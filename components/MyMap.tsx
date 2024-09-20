"use client";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { FaSpinner } from "react-icons/fa"; // For the loading spinner
import PopUp from "./popup";  // Custom popup component
import { Record, Location } from "../types/records";

// Utility function for debouncing
const debounce = (func: Function, delay: number) => {
  let timerId: NodeJS.Timeout;
  return (...args: any[]) => {
    if (timerId) clearTimeout(timerId);
    timerId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

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
const fetchRecords = async (state: string, month: string, year: string) => {
  const params = new URLSearchParams();
  if (state) params.append("state", state);
  if (year) params.append("year", year);
  if (month) params.append("month", month);
  console.log(params);
  const response = await fetch(`/api/records?${params.toString()}`);
  if (!response.ok) throw new Error("Failed to fetch records");
  return response.json();
};
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
  const queryClient = useQueryClient(); // For cache interaction
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [zoomLevel, setZoomLevel] = useState(5.5); // Initial zoom level

  const queryKey = ["records", selectedState, selectedMonth, selectedYear];

  const { data: records = [], isLoading, error } = useQuery(
    {
      queryKey,
      queryFn: async () => {
        const cachedData = queryClient.getQueryData<Record[]>(queryKey);
        if (cachedData) return cachedData; // Use cached data if available
        const data = await fetchRecords(selectedState, selectedMonth, selectedYear);
        queryClient.setQueryData(queryKey, data); // Cache fetched data
        console.log(data);
        return data.filtered_articles;
      },
    }
  );

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
            {/* <button
              onClick={() => queryClient.invalidateQueries(queryKey)}
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            >
              Apply Filters
            </button> */}
            <button
              onClick={clearFilters}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Clear Filters
            </button>
          </div>
        </div>

        <div className="relative w-full h-1000 rounded-lg overflow-hidden shadow-lg">
          {/* Apply blur if loading */}
          <div className={`${isLoading ? 'blur-0' : ''} transition-filter duration-300`}>
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

              {/* Display records with markers */}
              {!isLoading && records.map((record: Record, index: number) => (
                record.landslide_record?.locations?.map((location: Location, locIndex: number) => (
                  <Marker
                    key={`${index}-${locIndex}`}
                    position={[location.lat , location.lon]}
                    icon={DynamicIcon({ zoomLevel })}
                  >
                    <PopUp record={record} location={location} locIndex={locIndex} />
                  </Marker>
                ))
              ))}
            </MapContainer>
          </div>

          {/* Loading Spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
              <FaSpinner className="animate-spin text-blue-700 text-4xl" />
            </div>
          )}

          {error && <p>Error loading records: {error.message}</p>}
        </div>
      </main>
    </div>
  );
}