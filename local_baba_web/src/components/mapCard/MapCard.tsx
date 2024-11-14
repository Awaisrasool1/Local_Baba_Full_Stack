import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Theme from "../../theme/Theme";

const customIcon = L.icon({
  iconUrl: Theme.icons.map_marker,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
});

interface LocationProps {
  setLatLong: (latLong: [number, number, string]) => void;
  latLong: [number, number] | null;
}

const MapCard = ({ setLatLong, latLong }: LocationProps) => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const [clickedLocation, setClickedLocation] = useState<{
    lat: number;
    lng: number;
    fullAddress?: any;
  } | null>(null);

  const openCageApiKey = "b2bb851f263b4be1b7b49ab5ac03f5f6";

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        console.error("Error getting user location:", error);
      }
    );
  }, []);

  const fetchCityName = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${openCageApiKey}`
      );
      const data = await response.json();
      const fullAddress = data.results[0]?.formatted || "Address not found";
      setClickedLocation({ lat, lng, fullAddress });
      return fullAddress;
    } catch (error) {
      console.error("Error fetching city name:", error);
    }
  };

  const MapClickHandler = () => {
    useMapEvents({
      async click(e) {
        const { lat, lng } = e.latlng;
        let add = await fetchCityName(lat, lng);
        setLatLong([lat, lng, add]);
      },
    });
    return null;
  };

  const PositionMap = () => {
    const map = useMap();
    if (userLocation) {
      map.setView(userLocation, 13);
    }
    return null;
  };

  return (
    <div className="container" style={{ width: "100%", height: 200 }}>
      <MapContainer
        center={userLocation || [0, 0]}
        zoom={13}
        scrollWheelZoom={false}
        className="h-96"
        style={{ height: "200px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {userLocation && (
          <Marker position={userLocation} icon={customIcon}>
            <Popup>Your location</Popup>
          </Marker>
        )}

        {latLong && (
          <Marker position={latLong} icon={customIcon}>
            <Popup>
              Clicked location: <br />
              Latitude: {latLong?.[0]?.toFixed(4)} <br />
              Longitude: {latLong?.[1]?.toFixed(4)} <br />
              City: {clickedLocation?.fullAddress || "Fetching..."}
            </Popup>
          </Marker>
        )}

        <MapClickHandler />
        <PositionMap />
      </MapContainer>
    </div>
  );
};

export default MapCard;
