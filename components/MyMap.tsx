"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

export default function MyMap() {
	return (
		<MapContainer
			center={[22.4989, 88.3714]}
			zoom={7.5}
			scrollWheelZoom={false}
			style={{ height: "1000px", width: "100%" }}
		>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			
			<Marker position={[22.4989, 88.3714]}>
				<Popup>
					It is jadavpur university.
				</Popup>
			</Marker>

			{/* <Marker position={[51.605, -0.09]}>
				<Popup>
					A pretty CSS3 popup. <br /> Easily customizable.
				</Popup>
			</Marker> */}
		</MapContainer>
	);
}
