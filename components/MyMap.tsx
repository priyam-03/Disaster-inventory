"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { FaLink } from "react-icons/fa";
// Import your JSON data
import data from '../data/test_modified.json'; // Adjust the path as necessary

// Define types based on your JSON structure
interface Location {
  lat?: number;
  lon?: number;
  [key: string]: any; // Allow additional properties for flexibility
}

interface LandslideRecord {
  locations: Location[];
}

interface Record {
  title: string;
  link: string;
  landslide_record?: LandslideRecord;
}

// Define the custom icon using Leaflet's L.icon
const customIcon = L.icon({
  iconUrl: "map-marker.png", // Replace with your custom marker image path
  iconSize: [30, 30],
  iconAnchor: [15, 30], // Adjust the anchor so the icon points correctly to the location
  popupAnchor: [0, -30], // Adjust the popup anchor based on icon size
});

export default function MyMap() {
    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100">
            <header className="w-full bg-blue-600 text-white py-6">
                <div className="container mx-auto text-center">
                    <h1 className="text-4xl font-bold">Landslide Records Map</h1>
                    {/* <p className="mt-2 text-lg">Explore the map to see where landslides have been recorded.</p> */}
                </div>
            </header>
            
            <main className="container mx-auto py-10 px-4">
                {/* <div className="bg-white p-6 rounded-lg shadow-md mb-10">
                    <h2 className="text-2xl font-semibold mb-4">About the Map</h2>
                    <p className="text-gray-700">
                        This map provides a visual representation of recorded landslide events. Each marker on the map
                        indicates a specific location where a landslide has been recorded. Click on the markers to view
                        more details about the event.
                    </p>
                </div> */}

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
            {data.map((record: Record, index: number) => (
                record.landslide_record && record.landslide_record.locations.map((location: Location, locIndex: number) => {
                    // Extract latitude and longitude, supporting different property names
                    const latitude = location.lat;
                    const longitude = location.lon;

                    // Check if both latitude and longitude are defined
                    if (latitude !== undefined && longitude !== undefined) {
                        return (
                            <Marker
                                key={`${index}-${locIndex}`}
                                position={[latitude, longitude]}
                                icon={customIcon}  // Use the custom icon here
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
