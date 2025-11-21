import { useRef, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, useMapEvents, useMap } from 'react-leaflet';
import type { LatLngExpression, Map as LeafletMap } from 'leaflet';
import type { Waypoint } from '../types/index.js';
import 'leaflet/dist/leaflet.css';
import WaypointMarkers from './WaypointMarkers.jsx';

interface RouteMapProps {
  waypoints: Waypoint[];
  onAddWaypoint: (lat: number, lng: number) => void;
  onRemoveWaypoint: (id: string) => void;
  onAddTime: (waypointId: string, minutes: number) => void;
}

// Component to handle map clicks
function MapClickHandler({ onAddWaypoint }: { onAddWaypoint: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      // Only add waypoint if clicking on the map itself, not on a marker or popup
      if (e.originalEvent.target instanceof HTMLElement) {
        const target = e.originalEvent.target;
        // Check if click is on popup or marker
        if (target.closest('.leaflet-popup') || target.closest('.leaflet-marker-icon')) {
          return;
        }
      }
      onAddWaypoint(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Component to update map view when location is obtained
function MapViewController({ center, zoom }: { center: LatLngExpression | null; zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  
  return null;
}

export default function RouteMap({ 
  waypoints, 
  onAddWaypoint, 
  onRemoveWaypoint,
  onAddTime
}: RouteMapProps) {
  const mapRef = useRef<LeafletMap | null>(null);
  const [userLocation, setUserLocation] = useState<LatLngExpression | null>(null);
  const [initialZoom, setInitialZoom] = useState<number>(13);

  // Get user's location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setInitialZoom(13);
        },
        (error) => {
          console.log('Geolocation error:', error.message);
          // Falls back to default center if permission denied or error
        }
      );
    }
  }, []);

  // Convert waypoints to line coordinates
  const lineCoordinates: LatLngExpression[] = waypoints.map(
    wp => [wp.lat, wp.lng]
  );

  return (
    <MapContainer
      center={[39.8283, -98.5795]}
      zoom={4}
      style={{ height: '100%', width: '100%' }}
      ref={mapRef}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <MapViewController center={userLocation} zoom={initialZoom} />
      <MapClickHandler onAddWaypoint={onAddWaypoint} />
      
      {/* Draw the route line */}
      {lineCoordinates.length > 1 && (
        <Polyline
          positions={lineCoordinates}
          color="#2196F3"
          weight={3}
          opacity={0.7}
        />
      )}
      
      {/* Draw waypoint markers */}
      <WaypointMarkers
        waypoints={waypoints}
        onRemoveWaypoint={onRemoveWaypoint}
        onAddTime={onAddTime}
      />
    </MapContainer>
  );
}
