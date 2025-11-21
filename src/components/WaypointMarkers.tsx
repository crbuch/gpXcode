
import { Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import type { Waypoint } from '../types';

interface WaypointMarkersProps {
  waypoints: Waypoint[];
  onRemoveWaypoint: (id: string) => void;
  onAddTime: (waypointId: string, minutes: number) => void;
}

// Custom icons
const userWaypointIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const waypointWithTimeIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function WaypointMarkers({ 
  waypoints, 
  onRemoveWaypoint,
  onAddTime
}: WaypointMarkersProps) {

  const handlePauseTimeChange = (waypointId: string, value: string) => {
    const minutes = parseFloat(value);
    if (!isNaN(minutes) && minutes >= 0) {
      onAddTime(waypointId, minutes);
    }
  };

  return (
    <>
      {waypoints.map((waypoint) => {
        const icon = waypoint.additionalTime > 0 ? waypointWithTimeIcon : userWaypointIcon;

        return (
          <Marker
            key={waypoint.id}
            position={[waypoint.lat, waypoint.lng]}
            icon={icon}
          >
            <Popup>
                <div style={{ minWidth: '180px' }}>
                  <p><strong>Waypoint</strong></p>
                  <p style={{ margin: '4px 0', fontSize: '12px' }}>Lat: {waypoint.lat.toFixed(6)}</p>
                  <p style={{ margin: '4px 0', fontSize: '12px' }}>Lon: {waypoint.lng.toFixed(6)}</p>
                  
                  <div style={{ margin: '12px 0' }}>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 'bold' }}>
                      Pause here (minutes):
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={waypoint.additionalTime}
                      onChange={(e) => handlePauseTimeChange(waypoint.id, e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        width: '100%',
                        padding: '6px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveWaypoint(waypoint.id);
                    }}
                    style={{
                      width: '100%',
                      padding: '8px',
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    Remove
                  </button>
                </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}
