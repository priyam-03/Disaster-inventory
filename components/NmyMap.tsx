"use client";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { FaSpinner } from "react-icons/fa";
import PopUp from "./popup";
import { Record, Location } from "../types/records";
import type { MarkerCluster } from 'leaflet';
import LogoutBtn from '@/components/LogoutBtn'
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
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi"
];

const fetchRecords = async (state: string, month: string, year: string) => {
  const params = new URLSearchParams();
  if (state) params.append("state", state);
  if (year) params.append("year", year);
  if (month) params.append("month", month);
  const response = await fetch(`/api/records?${params.toString()}`);
  if (!response.ok) throw new Error("Failed to fetch records");
  return response.json();
};

// Create custom cluster icon
const createClusterCustomIcon = (cluster:MarkerCluster) => {
  const count = cluster.getChildCount();
  let size = 'h-8 w-8';
  if (count > 100) size = 'h-12 w-12';
  else if (count > 50) size = 'h-10 w-10';
  
  return L.divIcon({
    html: `
      <div class="bg-blue-500 rounded-full ${size} flex items-center justify-center">
        <span class="text-white text-xs font-bold">
          ${count}
        </span>
      </div>
    `,
    className: 'custom-marker-cluster',
    iconSize: L.point(0, 0)
  });
};

const DynamicIcon = ({ zoomLevel }: { zoomLevel: number }) => {
  const size = Math.max(20, Math.min(40, zoomLevel * 2));
  
  return L.icon({
    iconUrl: "/map-marker.png",
    iconSize: [size, size],
    iconAnchor: [size/2, size],
    popupAnchor: [0, -size],
  });
};

export default function MyMap() {
  const queryClient = useQueryClient();
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [zoomLevel, setZoomLevel] = useState(5.5);

  const queryKey = ["records", selectedState, selectedMonth, selectedYear];

  const { data: records = [], isLoading, error } = useQuery({
    queryKey,
    queryFn: async () => {
      const cachedData = queryClient.getQueryData<Record[]>(queryKey);
      if (cachedData) return cachedData;
      const data = await fetchRecords(selectedState, selectedMonth, selectedYear);
      queryClient.setQueryData(queryKey, data);
      return data.filtered_articles;
    },
  });

  const ZoomHandler = () => {
    useMapEvents({
      zoomend: (e) => setZoomLevel(e.target.getZoom()),
    });
    return null;
  };

  const clearFilters = () => {
    setSelectedYear("");
    setSelectedMonth("");
    setSelectedState("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <main className="container mx-auto py-10 px-4">
        {/* Filter Form */}
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <div>
            <label className="mr-2 text-blue-700">State:</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="border p-2 text-blue-700 bg-white rounded"
            >
              <option value="">Select a state</option>
              {indianStates.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mr-2 text-blue-700">Month:</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border p-2 text-blue-700 bg-white rounded"
            >
              <option value="">Select a month</option>
              {months.map((month) => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mr-2 text-blue-700">Year:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="border p-2 text-blue-700 bg-white rounded"
            >
              <option value="">Select a year</option>
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <button
            onClick={clearFilters}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition-colors"
          >
            Clear Filters
          </button>
        </div>

        <div className="relative w-full rounded-lg overflow-hidden shadow-lg">
          <div className={`${isLoading ? 'blur-sm' : ''} transition-filter duration-300`}>
            <MapContainer
              center={[22.4989, 88.3714]}
              zoom={zoomLevel}
              scrollWheelZoom={true}
              style={{ height: "600px", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <ZoomHandler />

              <MarkerClusterGroup
                chunkedLoading
                iconCreateFunction={createClusterCustomIcon}
                spiderfyOnMaxZoom={true}
                showCoverageOnHover={false}
                maxClusterRadius={50}
                disableClusteringAtZoom={13}
              >
                
                {!isLoading && records.map((record: Record, index: number) => (
                  record.landslide_record?.locations?.map((location: Location, locIndex: number) => (
                    <Marker
                      key={`${index}-${locIndex}`}
                      position={[location.lat, location.lon]}
                      icon={DynamicIcon({ zoomLevel })}
                    >
                      <PopUp record={record} location={location} locIndex={locIndex} />
                    </Marker>
                  ))
                ))}
               
              </MarkerClusterGroup>
            </MapContainer>
          </div>

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
              <FaSpinner className="animate-spin text-blue-700 text-4xl" />
            </div>
          )}

          {error && (
            <div className="absolute bottom-4 left-4 bg-red-100 text-red-700 px-4 py-2 rounded">
              Error loading records: {error.message}
            </div>
          )}
        </div>
       
      </main>
    </div>
  );
}