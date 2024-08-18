"use client";
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { FaLink } from "react-icons/fa";

// Define types based on your Prisma schema
interface Location {
  lat?: number;
  lon?: number;
}

interface LandslideRecord {
  locations: Location[];
}

interface Record {
  title: string;
  link: string;
  landslideRecord?: LandslideRecord;
}

// Define the custom icon using Leaflet's L.icon
const customIcon = L.icon({
  iconUrl: "/map-marker.png", // Replace with your custom marker image path
  iconSize: [30, 30],
  iconAnchor: [15, 30], // Adjust the anchor so the icon points correctly to the location
  popupAnchor: [0, -30], // Adjust the popup anchor based on icon size
});

export default function MyMap() {
    const [records, setRecords] = useState<Record[]>([]);

    useEffect(() => {
        async function fetchData() {
            const response = await fetch('/api/records');
            const data = await response.json();
            setRecords(data);
        }
        fetchData();
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100">
            <header className="w-full bg-blue-600 text-white py-6">
                <div className="container mx-auto text-center">
                    <h1 className="text-4xl font-bold">Landslide Records Map</h1>
                </div>
            </header>
            
            <main className="container mx-auto py-10 px-4">
                <div className="w-full h-1000 rounded-lg overflow-hidden shadow-lg">
                    <MapContainer
                        center={[22.4989, 88.3714]}
                        zoom={5.5}
                        scrollWheelZoom={true}
                        style={{ height: "600px", width: "100%" }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {/* Iterate over the data to create Markers */}
                        {records.map((record: Record, index: number) => (
                            record.landslideRecord && record.landslideRecord.locations.map((location: Location, locIndex: number) => {
                                // Extract latitude and longitude
                                const latitude = location.lat;
                                const longitude = location.lon;

                                // Check if both latitude and longitude are defined
                                if (latitude !== undefined && longitude !== undefined) {
                                    return (
                                        <Marker
                                            key={`${index}-${locIndex}`}
                                            position={[latitude, longitude]}
                                            icon={customIcon}
                                        >
                                            <Popup>
                                                <div className="text-center">
                                                    {record.title && (
                                                        <strong className="text-lg text-gray-800">{record.title}</strong>
                                                    )}
                                                    <br />
                                                    {record.link && (
                                                        <a href={record.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center justify-center mt-2">
                                                            <FaLink className="mr-2" />
                                                            <span>Visit Link</span>
                                                        </a>
                                                    )}
                                                </div>
                                            </Popup>
                                        </Marker>
                                    );
                                }
                                return null; // Skip this marker if lat/lon are not available
                            })
                        ))}
                    </MapContainer>
                </div>
            </main>

            <footer className="w-full bg-blue-600 text-white py-4 mt-auto">
                <div className="container mx-auto text-center">
                    <p>&copy; 2024 Landslide Records. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
