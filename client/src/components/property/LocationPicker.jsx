
import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

const sriLankaCenter = [7.8731, 80.7718];

function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(event) {
      onLocationSelect({
        lat: event.latlng.lat,
        lng: event.latlng.lng,
      });
    },
  });

  return null;
}

function MapCenter({ position }) {
  const map = useMap();

  useEffect(() => {
    map.setView(position, map.getZoom());
  }, [map, position]);

  return null;
}

const LocationPicker = ({ value, onChange }) => {
  const position =
    value?.lat != null && value?.lng != null
      ? [value.lat, value.lng]
      : sriLankaCenter;

  const handleLocationSelect = (coordinates) => {
    onChange(coordinates);
  };

  return (
    <div className="space-y-3">
      <p className="font-medium text-gray-700">
        Select Property Location
      </p>

      <p className="text-sm text-gray-500">
        Click on the map to mark the property's location.
      </p>

      <MapContainer
        center={position}
        zoom={8}
        scrollWheelZoom={true}
        className="w-full h-80 rounded-xl z-0"
      >
        <MapCenter position={position} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickHandler
          onLocationSelect={handleLocationSelect}
        />

        <Marker position={position} />
      </MapContainer>

      <div className="text-sm bg-gray-50 rounded-lg p-3">
        <p>
          Latitude: {position[0].toFixed(6)}
        </p>

        <p>
          Longitude: {position[1].toFixed(6)}
        </p>
      </div>
    </div>
  );
};

export default LocationPicker;
