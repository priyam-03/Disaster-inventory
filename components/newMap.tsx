'use client'
import { useEffect, useState } from 'react';
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

const customIcon = L.icon({
  iconUrl: "/map-marker.png", 
  iconSize: [30, 30],
  iconAnchor: [15, 30], 
  popupAnchor: [0, -30], 
});

export default function MyMap() {
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [selectedState, setSelectedState] = useState<string>('');
    const [month, setMonth] = useState<string>('');

    const fetchData = async () => {
        const params = new URLSearchParams();
        if (selectedState) params.append('state', selectedState);
        if (month) params.append('month', month);
        const response = await fetch(`/api/incidents?${params.toString()}`);
        const data = await response.json();
        setIncidents(data);
    };

    useEffect(() => {
        fetchData(); // Fetch data when component mounts or state/month changes
    }, [selectedState, month]);

    const clearFilters = () => {
        setSelectedState('');
        setMonth('');
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100">
            <header className="w-full bg-blue-600 text-white py-6">
                <div className="container mx-auto text-center">
                    <h1 className="text-4xl font-bold">Incident Map</h1>
                </div>
            </header>
            
            <main className="container mx-auto py-10 px-4">
                {/* Filter Form */}
                <div className="mb-6 flex flex-wrap items-center">
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
                        <input
                            type="month"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="border p-2 text-blue-700 bg-white"
                        />
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
                        center={[29.380539, 79.467877]}
                        zoom={7.5}
                        scrollWheelZoom={true}
                        style={{ height: "600px", width: "100%" }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {incidents.map((incident: Incident) => (
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
                </div>
            </main>

            <footer className="w-full bg-blue-600 text-white py-4 mt-auto">
                <div className="container mx-auto text-center">
                    <p>&copy; 2024 Incident Records. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
