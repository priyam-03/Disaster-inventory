'use client';

import React from 'react';
import { Marker, useMap } from 'react-leaflet';
import L from 'leaflet';

interface MarkerProps {
  position: [number, number];
  icon?: L.Icon;
  onClickZoom?: number;
}

export default function Markerwhatever({ position, icon, onClickZoom = 14 }: MarkerProps) {
  const map = useMap();

  return (
    <Marker
      position={position}
      icon={icon}
      eventHandlers={{
        click: (e) => {
          map.flyTo(e.latlng, onClickZoom);
        },
      }}
    />
  );
}
