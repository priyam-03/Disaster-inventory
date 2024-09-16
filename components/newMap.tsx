'use client';

import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

interface Incident {
  id: string;
  url: string;
  lat: number;
  lon: number;
  state: string;
}

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", 
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", 
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", 
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", 
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", 
  "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep", 
  "Delhi", "Puducherry"
];

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

const customIcon = L.icon({
  iconUrl: "/map-marker.png", 
  iconSize: [30, 30],
  iconAnchor: [15, 30], 
  popupAnchor: [0, -30], 
});

const fetchIncidents = async (state: string, month: string, year: string) => {
  const params = new URLSearchParams();
  if (state) params.append('state', state);
  if (month && year) {
    params.append('month', `${year}-${month}`);
  }
  const response = await fetch(`/api/incidents?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch incidents');
  }
  return response.json();
};

export default function MyMap() {
  const queryClient = useQueryClient(); // Access the query client to interact with the cache
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('2024');
  const [initialDataLoaded, setInitialDataLoaded] = useState<boolean>(false);

  const queryKey = ['incidents', selectedState, selectedMonth, selectedYear];

  const { data: incidents = [], isLoading, error } = useQuery(
    {
      queryKey,
      queryFn: async () => {
        const cachedData = queryClient.getQueryData<Incident[]>(queryKey);
        if (cachedData) {
          return cachedData; // Use cached data if available
        } else {
          const data = await fetchIncidents(selectedState, selectedMonth, selectedYear);
          queryClient.setQueryData(queryKey, data); // Cache the fetched data
          return data;
        }
      },
      // staleTime: 1000,
      
    }
  );

  useEffect(() => {
    // This useEffect ensures the map renders immediately without data.
    setInitialDataLoaded(true);
  }, []);

  const clearFilters = () => {
    setSelectedState('');
    setSelectedMonth('');
    setSelectedYear('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
     
      
      <main className="container py-4 px-4">
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
              onClick={() => setInitialDataLoaded(true)}
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
            center={[29.380539, 79.467877]}
            zoom={7.5}
            scrollWheelZoom={true}
            style={{ height: "600px", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {!isLoading && incidents.map((incident: Incident) => (
              <Marker
                key={incident.id}
                position={[incident.lat, incident.lon]}
                icon={customIcon}
              >
                <Popup>
                  <a href={incident.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    View Incident Details
                  </a>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {isLoading && <p>Loading incidents...</p>}
          {error && <p>Error loading incidents: {error.message}</p>}
        </div>
      </main>

     
    </div>
  );
}
