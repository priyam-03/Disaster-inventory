"use client";
import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { FaMapMarkerAlt, FaCalendarAlt, FaTimes, FaChevronLeft, FaChevronRight, FaLayerGroup } from "react-icons/fa";
import PopUp from "./popup";
import { Record, Location } from "../types/records";
import type { MarkerCluster } from 'leaflet';

const months = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" }
];

const years = Array.from(new Array(30), (_, index) => {
  const year = new Date().getFullYear() - index;
  return year.toString();
});

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh"
];

const fetchRecords = async (state: string, month: string, year: string, startDate: string, endDate: string) => {
  const params = new URLSearchParams();
  if (state) params.append("state", state);
  if (year) params.append("year", year);
  if (month) params.append("month", month);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  const response = await fetch(`/api/records?${params.toString()}`);
  if (!response.ok) throw new Error("Failed to fetch records");
  return response.json();
};

// Defined at module level — stable reference, never recreated on parent renders
const createClusterCustomIcon = (cluster: MarkerCluster) => {
  const count = cluster.getChildCount();
  let size = 40;
  let ringSize = 52;
  if (count > 100) { size = 52; ringSize = 66; }
  else if (count > 50) { size = 46; ringSize = 58; }

  return L.divIcon({
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      ">
        <div style="
          position: absolute;
          inset: -${(ringSize - size) / 2}px;
          border-radius: 50%;
          background: rgba(99, 102, 241, 0.12);
          animation: pulse-ring 2s ease-out infinite;
        "></div>
        <div style="
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #4338ca);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
          border: 2.5px solid rgba(255,255,255,0.9);
        ">
          <span style="color: white; font-size: ${count > 999 ? '11' : '13'}px; font-weight: 700; letter-spacing: -0.3px;">
            ${count > 999 ? Math.round(count / 1000) + 'k' : count}
          </span>
        </div>
      </div>
    `,
    className: 'custom-marker-cluster',
    iconSize: L.point(ringSize, ringSize),
    iconAnchor: L.point(ringSize / 2, ringSize / 2),
  });
};

// Defined at module level — avoids remount on every parent render
const createDynamicIcon = (zoomLevel: number) => {
  const size = Math.max(20, Math.min(40, zoomLevel * 2));
  return L.icon({
    iconUrl: "/map-marker.png",
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
};

// Defined at module level — avoids remount on every parent render
const ZoomHandler = ({ onZoom }: { onZoom: (zoom: number) => void }) => {
  useMapEvents({
    zoomend: (e) => onZoom(e.target.getZoom()),
  });
  return null;
};

export default function MyMap() {
  const router = useRouter();
  const [selectedYear, setSelectedYear] = useState<string>("2025");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [filterMode, setFilterMode] = useState<'monthYear' | 'dateRange'>('monthYear');
  const [zoomLevel, setZoomLevel] = useState(5.5);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const queryKey = ["records", selectedState, selectedMonth, selectedYear, startDate, endDate, filterMode];

  const isDateRangeValid =
    filterMode === 'dateRange' &&
    ((startDate !== "" && endDate !== "" && new Date(startDate) < new Date(endDate)) || (startDate === "" && endDate === ""));

  const isMonthYearValid = filterMode === 'monthYear';
  const isQueryEnabled = isMonthYearValid || isDateRangeValid;

  const { data: records = [], isLoading, error } = useQuery({
    queryKey,
    enabled: isQueryEnabled,
    queryFn: async () => {
      const data = await fetchRecords(
        selectedState,
        filterMode === 'monthYear' ? selectedMonth : '',
        filterMode === 'monthYear' ? selectedYear : '',
        filterMode === 'dateRange' ? startDate : '',
        filterMode === 'dateRange' ? endDate : ''
      );
      return data.filtered_articles;
    },
  });

  // One icon object per zoom level, shared across all markers
  const markerIcon = useMemo(() => createDynamicIcon(zoomLevel), [zoomLevel]);

  const totalMarkers = useMemo(() =>
    records.reduce((acc: number, record: Record) => {
      return acc + (record.landslide_record?.locations?.length || 0);
    }, 0), [records]);

  const hasActiveFilters = useMemo(() =>
    !!(selectedState || selectedMonth || selectedYear || startDate || endDate),
    [selectedState, selectedMonth, selectedYear, startDate, endDate]);

  const activeFilterCount = useMemo(() =>
    [selectedState, selectedMonth, selectedYear, startDate, endDate].filter(Boolean).length,
    [selectedState, selectedMonth, selectedYear, startDate, endDate]);

  // Derived inline error — replaces blocking alert()
  const dateErrorMessage = useMemo(() => {
    if (filterMode === 'dateRange' && startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      return "Start date must be earlier than end date";
    }
    return "";
  }, [filterMode, startDate, endDate]);

  const handleZoom = useCallback((zoom: number) => setZoomLevel(zoom), []);

  const clearFilters = useCallback(() => {
    setSelectedYear("2025");
    setSelectedMonth("");
    setSelectedState("");
    setStartDate("");
    setEndDate("");
    setFilterMode('monthYear');
  }, []);

  const handleFilterModeChange = useCallback((mode: 'monthYear' | 'dateRange') => {
    setFilterMode(mode);
    if (mode === 'monthYear') {
      setStartDate("");
      setEndDate("");
      setSelectedYear("2025");
    } else {
      setSelectedMonth("");
      setSelectedYear("");
      setStartDate("2025-01-01");
      setEndDate("2025-12-31");
    }
  }, []);

  const handleStartDateChange = useCallback((value: string) => {
    setStartDate(value);
  }, []);

  const handleEndDateChange = useCallback((value: string) => {
    setEndDate(value);
  }, []);

  return (
    <div className="flex h-[calc(100vh-120px)] relative">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-[280px]' : 'w-0'} transition-all duration-300 ease-in-out flex-shrink-0 overflow-hidden relative z-10`}>
        <div className="w-[280px] h-full bg-white/95 backdrop-blur-md border-r border-surface-200/60 flex flex-col">
          {/* Sidebar Header - View Switcher */}
          <div className="p-4 border-b border-surface-100 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg shadow-glow">
                <FaLayerGroup className="text-white text-sm" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-surface-800">Cluster View</h2>
                <p className="text-[11px] text-surface-400">Grouped markers</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1 bg-surface-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => router.push('/locations')}
                className="flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-md transition-all duration-200 text-surface-500 hover:text-surface-700 hover:bg-white/50 cursor-pointer"
              >
                <FaMapMarkerAlt className="text-[10px]" />
                Location
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-md transition-all duration-200 bg-white text-brand-600 shadow-sm"
              >
                <FaLayerGroup className="text-[10px]" />
                Cluster
              </button>
            </div>
          </div>

          {/* Filter Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Filter Mode Toggle */}
            <div>
              <label className="block text-[10px] font-bold text-surface-400 mb-2 uppercase tracking-widest">Filter Type</label>
              <div className="grid grid-cols-2 gap-1 bg-surface-100 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => handleFilterModeChange('monthYear')}
                  className={`flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-md transition-all duration-200 ${
                    filterMode === 'monthYear' ? 'bg-white text-brand-600 shadow-sm' : 'text-surface-500 hover:text-surface-700'
                  }`}
                >
                  <FaCalendarAlt className="text-[10px]" />
                  Month/Year
                </button>
                <button
                  type="button"
                  onClick={() => handleFilterModeChange('dateRange')}
                  className={`flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-md transition-all duration-200 ${
                    filterMode === 'dateRange' ? 'bg-white text-brand-600 shadow-sm' : 'text-surface-500 hover:text-surface-700'
                  }`}
                >
                  <FaCalendarAlt className="text-[10px]" />
                  Date Range
                </button>
              </div>
            </div>

            <div className="h-px bg-surface-100" />

            {/* State Filter */}
            <div>
              <label className="block text-[10px] font-bold text-surface-400 mb-1.5 uppercase tracking-widest">State</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full border border-surface-200 rounded-lg px-3 py-2 text-sm text-surface-700
                  bg-white hover:border-brand-300 transition-colors duration-200 cursor-pointer
                  focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
              >
                <option value="">All States</option>
                {indianStates.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            {/* Month/Year Filters */}
            {filterMode === 'monthYear' && (
              <>
                <div>
                  <label className="block text-[10px] font-bold text-surface-400 mb-1.5 uppercase tracking-widest">Month</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full border border-surface-200 rounded-lg px-3 py-2 text-sm text-surface-700
                      bg-white hover:border-brand-300 transition-colors duration-200 cursor-pointer
                      focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
                  >
                    <option value="">All Months</option>
                    {months.map((month) => (
                      <option key={month.value} value={month.value}>{month.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-surface-400 mb-1.5 uppercase tracking-widest">Year</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full border border-surface-200 rounded-lg px-3 py-2 text-sm text-surface-700
                      bg-white hover:border-brand-300 transition-colors duration-200 cursor-pointer
                      focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
                  >
                    <option value="">All Years</option>
                    {years.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {/* Date Range Filters */}
            {filterMode === 'dateRange' && (
              <>
                <div>
                  <label className="block text-[10px] font-bold text-surface-400 mb-1.5 uppercase tracking-widest">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    max={endDate}
                    onChange={(e) => handleStartDateChange(e.target.value)}
                    className="w-full border border-surface-200 rounded-lg px-3 py-2 text-sm text-surface-700
                      bg-white hover:border-brand-300 transition-colors duration-200 cursor-pointer
                      focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-surface-400 mb-1.5 uppercase tracking-widest">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => handleEndDateChange(e.target.value)}
                    min={startDate}
                    className="w-full border border-surface-200 rounded-lg px-3 py-2 text-sm text-surface-700
                      bg-white hover:border-brand-300 transition-colors duration-200 cursor-pointer
                      focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
                  />
                </div>
                {/* Inline date error — replaces blocking alert() */}
                {dateErrorMessage && (
                  <p className="text-xs text-red-500 font-medium">{dateErrorMessage}</p>
                )}
              </>
            )}

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="w-full flex items-center justify-center gap-1.5 text-xs font-medium text-accent-rose
                  py-2 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 transition-all duration-200"
              >
                <FaTimes className="text-[10px]" />
                Clear All Filters
              </button>
            )}
          </div>

          {/* Stats Footer */}
          <div className="p-3 border-t border-surface-100 bg-surface-50/80">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center py-2 px-1 bg-white rounded-lg border border-surface-100">
                <div className="text-base font-bold text-brand-600">{totalMarkers}</div>
                <div className="text-[10px] text-surface-400 font-medium">Locations</div>
              </div>
              <div className="text-center py-2 px-1 bg-white rounded-lg border border-surface-100">
                <div className="text-base font-bold text-brand-600">{records.length}</div>
                <div className="text-[10px] text-surface-400 font-medium">Records</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`absolute top-4 z-20 flex items-center justify-center w-6 h-14 bg-white/95 backdrop-blur-sm border border-surface-200
          rounded-r-lg shadow-card hover:shadow-card-hover hover:bg-brand-50 transition-all duration-300 ease-in-out`}
        style={{ left: sidebarOpen ? '280px' : '0px' }}
      >
        {sidebarOpen ? (
          <FaChevronLeft className="text-surface-400 text-[10px]" />
        ) : (
          <div className="relative">
            <FaChevronRight className="text-surface-400 text-[10px]" />
            {activeFilterCount > 0 && (
              <div className="absolute -top-2.5 -right-2.5 w-4 h-4 bg-brand-500 rounded-full flex items-center justify-center">
                <span className="text-[8px] text-white font-bold">{activeFilterCount}</span>
              </div>
            )}
          </div>
        )}
      </button>

      {/* Map Area */}
      <div className="flex-1 relative rounded-xl overflow-hidden border border-surface-200/50 m-2 ml-0 shadow-glass">
        <div className="absolute top-0 left-0 right-0 z-[500] h-1 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-700" />

        <div className={`h-full ${isLoading ? 'blur-[2px]' : ''} transition-all duration-300`}>
          <MapContainer
            center={[22.4989, 88.3714]}
            zoom={zoomLevel}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            <ZoomHandler onZoom={handleZoom} />

            <MarkerClusterGroup
              chunkedLoading
              iconCreateFunction={createClusterCustomIcon}
              spiderfyOnMaxZoom={true}
              showCoverageOnHover={false}
              maxClusterRadius={50}
              disableClusteringAtZoom={15}
            >
              {!isLoading && records.map((record: Record, index: number) => (
                record.landslide_record?.locations?.map((location: Location, locIndex: number) => {
                  if (location.lat == null || location.lon == null || isNaN(location.lat) || isNaN(location.lon)) return null;
                  return (
                    <Marker
                      key={`${index}-${locIndex}`}
                      position={[location.lat, location.lon]}
                      icon={markerIcon}
                    >
                      <PopUp record={record} location={location} locIndex={locIndex} />
                    </Marker>
                  );
                })
              ))}
            </MarkerClusterGroup>
          </MapContainer>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm z-[1000]">
            <div className="flex flex-col items-center gap-3 p-6 bg-white/90 rounded-2xl shadow-glass">
              <div className="w-12 h-12 rounded-full border-[3px] border-surface-200 border-t-brand-500 animate-spin" />
              <span className="text-sm font-medium text-surface-500">Loading clusters...</span>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="absolute bottom-4 left-4 right-4 z-[1000] flex items-center gap-3 bg-red-50/95 backdrop-blur-sm
            text-accent-rose px-4 py-3 rounded-xl border border-red-200 shadow-card">
            <div className="w-2 h-2 rounded-full bg-accent-rose animate-pulse" />
            <span className="text-sm font-medium">Error loading records: {error.message}</span>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.6; }
          80%, 100% { transform: scale(1.3); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
