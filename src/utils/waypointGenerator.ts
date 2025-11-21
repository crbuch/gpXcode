import type { Waypoint } from '../types';
import { haversineDistance } from './haversine';

/**
 * Generate intermediate waypoints between two points based on time intervals
 * @param start Starting waypoint (must have timestamp)
 * @param end Ending waypoint (must have timestamp)
 * @param intervalSeconds Time interval between waypoints in seconds (default: 1 second)
 * @returns Array of intermediate waypoints (not including start and end)
 */
export function generateIntermediateWaypoints(
  start: Waypoint,
  end: Waypoint,
  intervalSeconds: number = 1
): Waypoint[] {
  if (!start.timestamp || !end.timestamp) {
    return [];
  }

  const timeDiff = end.timestamp.getTime() - start.timestamp.getTime();
  const timeDiffSeconds = timeDiff / 1000;
  
  // If time difference is too small, no need for intermediate points
  if (timeDiffSeconds <= intervalSeconds) {
    return [];
  }

  // Calculate how many intermediate points we need
  const numPoints = Math.floor(timeDiffSeconds / intervalSeconds) - 1;
  
  if (numPoints <= 0) {
    return [];
  }

  const intermediatePoints: Waypoint[] = [];
  
  // Generate evenly spaced points in both time and space
  for (let i = 1; i <= numPoints; i++) {
    const ratio = i / (numPoints + 1);
    const timestamp = new Date(start.timestamp.getTime() + (timeDiff * ratio));
    
    intermediatePoints.push({
      id: `gen-${Date.now()}-${i}`,
      lat: start.lat + (end.lat - start.lat) * ratio,
      lng: start.lng + (end.lng - start.lng) * ratio,
      additionalTime: 0,
      isUserPlaced: false,
      timestamp,
    });
  }

  return intermediatePoints;
}

/**
 * Calculate timestamps for all waypoints based on travel speed
 * @param waypoints Array of waypoints
 * @param speedMph Travel speed in miles per hour
 * @param startTime Starting timestamp (defaults to current time)
 * @returns Array of waypoints with calculated timestamps
 */
export function calculateTimestamps(
  waypoints: Waypoint[],
  speedMph: number,
  startTime: Date = new Date()
): Waypoint[] {
  if (waypoints.length === 0) {
    return [];
  }

  // Convert mph to meters per second
  const metersPerSecond = (speedMph * 1609.34) / 3600;
  
  console.log(`Speed: ${speedMph} mph = ${metersPerSecond} m/s`);

  const result: Waypoint[] = [];
  let currentTime = new Date(startTime);

  // First waypoint
  result.push({
    ...waypoints[0],
    timestamp: new Date(currentTime),
  });

  // Process remaining waypoints
  for (let i = 1; i < waypoints.length; i++) {
    const prev = waypoints[i - 1];
    const curr = waypoints[i];

    // Add any additional time spent at previous waypoint BEFORE traveling
    if (prev.additionalTime > 0) {
      currentTime = new Date(currentTime.getTime() + prev.additionalTime * 60 * 1000);
    }

    // Calculate distance and travel time
    const distance = haversineDistance(prev.lat, prev.lng, curr.lat, curr.lng);
    const travelSeconds = distance / metersPerSecond;

    // Add travel time
    currentTime = new Date(currentTime.getTime() + travelSeconds * 1000);

    result.push({
      ...curr,
      timestamp: new Date(currentTime),
    });
  }

  return result;
}

/**
 * Expand a route by generating intermediate waypoints between user-placed waypoints
 * Must be called AFTER calculateTimestamps since it requires timestamps
 * @param waypointsWithTimestamps Waypoints that already have timestamps
 * @param intervalSeconds Time interval between generated waypoints (default: 1 second)
 * @returns Complete array of waypoints including generated ones
 */
export function expandRoute(
  waypointsWithTimestamps: Waypoint[],
  intervalSeconds: number = 1
): Waypoint[] {
  if (waypointsWithTimestamps.length === 0) {
    return [];
  }

  if (waypointsWithTimestamps.length === 1) {
    return [...waypointsWithTimestamps];
  }

  const expandedRoute: Waypoint[] = [];

  for (let i = 0; i < waypointsWithTimestamps.length; i++) {
    expandedRoute.push(waypointsWithTimestamps[i]);

    // Generate intermediate points to next waypoint
    if (i < waypointsWithTimestamps.length - 1) {
      const intermediates = generateIntermediateWaypoints(
        waypointsWithTimestamps[i],
        waypointsWithTimestamps[i + 1],
        intervalSeconds
      );
      expandedRoute.push(...intermediates);
    }
  }

  return expandedRoute;
}
