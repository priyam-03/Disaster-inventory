"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { FaLink } from "react-icons/fa";
import PopUp from "./popup";  // Import the custom Popup component
import "./MyMap.css";
import { Record, Location } from "../types/records";

// Define available months and years for filters
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

// DynamicIcon component to handle zoom-level based icon size
const DynamicIcon = ({ zoomLevel }: { zoomLevel: number }) => {
  // Calculate icon size based on zoom level
  const iconSize: [number, number] = [zoomLevel * 2 + 10, zoomLevel * 2 + 10];  // Simple size scaling logic

  return L.icon({
    iconUrl: "/map-marker.png", // Replace with your own marker icon URL
    iconSize: iconSize,  // Dynamically adjust icon size
    iconAnchor: [iconSize[0] / 2, iconSize[1]],  // Keep anchor proportional
    popupAnchor: [0, -iconSize[1]],
  });
};

export default function MyMap() {
  const [records, setRecords] = useState<Record[]>([]);
  const [zoomLevel, setZoomLevel] = useState(5.5);  // Initial zoom level

  // State for the filters
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');

  // Fetch data from API with filters
  const fetchData = async () => {
    const params = new URLSearchParams();
    if (selectedYear) params.append('year', selectedYear);
    if (selectedMonth) params.append('month', selectedMonth);
    if (selectedState) params.append('state', selectedState);

    const response = await fetch(`/api/records?${params.toString()}`);
    const data = await response.json();

    setRecords(data.filtered_articles);
    console.log(records)
  };
  const customIcon = L.icon({
    iconUrl: "/map-marker.png", 
    iconSize: [30, 30],
    iconAnchor: [15, 30], 
    popupAnchor: [0, -30], 
  });
  useEffect(() => {
    fetchData();
  }, [selectedYear, selectedMonth, selectedState]);

  // Custom hook to handle zoom level changes
  const ZoomHandler = () => {
    useMapEvents({
      zoomend: (e) => {
        const map = e.target;
        setZoomLevel(map.getZoom());
      }
    });
    return null;
  };

  const clearFilters = () => {
    setSelectedYear('');
    setSelectedMonth('');
    setSelectedState('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <main className="container mx-auto py-10 px-4">
        {/* Filter Form */}
        <div className="mb-4 flex flex-wrap items-center">
          <div className="mr-4">
            <label className="mr-2 text-blue-700">State:</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="border p-2 text-blue-700 bg-white"
            >
              <option value="">Select a state</option>
              {indianStates.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          <div className="mr-4">
            <label className="mr-2 text-blue-700">Month:</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border p-2 text-blue-700 bg-white"
            >
              <option value="">Select a month</option>
              {months.map((month) => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
          </div>

          <div className="mr-4">
            <label className="mr-2 text-blue-700">Year:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="border p-2 text-blue-700 bg-white"
            >
              <option value="">Select a year</option>
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <button
              onClick={fetchData}
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            >
              Apply Filters
            </button>
            <button
              onClick={clearFilters}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Clear Filters
            </button>
          </div>
        </div>

        <div className="w-full h-1000 rounded-lg overflow-hidden shadow-lg">
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

            {/* Handle zoom events to update zoom level */}
            <ZoomHandler />

            {/* Iterate over the data to create Markers */}
            {records.map((record: Record, index: number) =>
              record.landslide_record &&
              record.landslide_record.locations &&
              record.landslide_record.locations.length > 0
                ? record.landslide_record.locations.map(
                    (location: Location, locIndex: number) => {
                      const latitude = location.lat;
                      const longitude = location.lon;

                      if (latitude !== undefined && longitude !== undefined) {
                        return (
                          <Marker
                            key={`${index}-${locIndex}`}
                            position={[latitude, longitude]}
                            icon={DynamicIcon({ zoomLevel })}  // Pass the dynamic icon size
                          >
                            {/* Pass record, location, and locIndex to PopUp */}
                            <PopUp record={record} location={location} locIndex={locIndex} />
                          </Marker>
                        );
                      }
                      return null; // Skip if lat/lon are not available
                    }
                  )
                : null
            )}
          </MapContainer>
        </div>
      </main>
    </div>
  );
}
