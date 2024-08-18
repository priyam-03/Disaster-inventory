"use client";
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

// Define types based on your Prisma schema
interface Incident {
  id: string;
  url: string;
  lat: number;
  lon: number;
  state: string;
}

// Define the custom icon using Leaflet's L.icon
const customIcon = L.icon({
  iconUrl: "/map-marker.png", // Replace with your custom marker image path
  iconSize: [30, 30],
  iconAnchor: [15, 30], // Adjust the anchor so the icon points correctly to the location
  popupAnchor: [0, -30], // Adjust the popup anchor based on icon size
});

export default function MyMap() {
    const [incidents, setIncidents] = useState<Incident[]>([]);

    useEffect(() => {
        async function fetchData() {
            const response = await fetch('/api/incidents');
            const data = await response.json();
            setIncidents(data);
        }
        fetchData();
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100">
            <header className="w-full bg-blue-600 text-white py-6">
                <div className="container mx-auto text-center">
                    <h1 className="text-4xl font-bold">Incident Map</h1>
                </div>
            </header>
            
            <main className="container mx-auto py-10 px-4">
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

                        {/* Iterate over the incidents to create Markers */}
                        {incidents.map((incident: Incident, index: number) => (
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
