import { useState } from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import type { Waypoint } from './types';
import RouteMap from './components/RouteMap';
import ControlPanel from './components/ControlPanel';
import { calculateTimestamps, expandRoute } from './utils/waypointGenerator';
import { exportToXcodeGPX, downloadGPX } from './utils/gpxExport';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196F3',
    },
  },
});

function App() {
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [speed, setSpeed] = useState<number>(3.5); // Default walking speed

  // Add a new waypoint
  const handleAddWaypoint = (lat: number, lng: number) => {
    const newWaypoint: Waypoint = {
      id: `user-${Date.now()}`,
      lat,
      lng,
      additionalTime: 0,
      isUserPlaced: true,
    };
    setWaypoints([...waypoints, newWaypoint]);
  };

  // Remove a waypoint
  const handleRemoveWaypoint = (id: string) => {
    setWaypoints(waypoints.filter(wp => wp.id !== id));
  };



  // Add/edit additional time at waypoint
  const handleAddTime = (waypointId: string, minutes: number) => {
    setWaypoints(waypoints.map(wp => 
      wp.id === waypointId 
        ? { ...wp, additionalTime: minutes }
        : wp
    ));
  };

  // Download GPX file
  const handleDownload = () => {
    if (waypoints.length === 0) return;

    // Calculate timestamps for user waypoints
    const waypointsWithTimestamps = calculateTimestamps(waypoints, speed);
    
    // Expand route with intermediate waypoints (1 per second for smooth simulation)
    const expandedWaypoints = expandRoute(waypointsWithTimestamps, 1);
    
    // Export to GPX
    const gpxContent = exportToXcodeGPX(expandedWaypoints);
    
    // Download
    const timestamp = new Date().toISOString().split('T')[0];
    downloadGPX(gpxContent, `xcode_route_${timestamp}.gpx`);
  };

  // Clear all waypoints
  const handleClearRoute = () => {
    if (confirm('Are you sure you want to clear all waypoints?')) {
      setWaypoints([]);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ height: '100vh', width: '100vw', position: 'relative' }}>
        <RouteMap
          waypoints={waypoints}
          onAddWaypoint={handleAddWaypoint}
          onRemoveWaypoint={handleRemoveWaypoint}
          onAddTime={handleAddTime}
        />
        
        <ControlPanel
          speed={speed}
          onSpeedChange={setSpeed}
          waypointCount={waypoints.length}
          onDownload={handleDownload}
          onClearRoute={handleClearRoute}
        />
      </Box>
    </ThemeProvider>
  );
}

export default App;
