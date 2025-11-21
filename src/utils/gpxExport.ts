import type { Waypoint } from '../types';

/**
 * Export waypoints as an Xcode-compatible GPX file
 * @param waypoints Array of waypoints with timestamps
 * @returns GPX file content as string
 */
export function exportToXcodeGPX(waypoints: Waypoint[]): string {
  const lines: string[] = [];
  
  // GPX header
  lines.push('<?xml version="1.0" encoding="UTF-8"?>');
  lines.push('<gpx version="1.1" creator="Xcode">');

  // Add each waypoint
  for (const waypoint of waypoints) {
    if (!waypoint.timestamp) {
      continue;
    }

    lines.push(`    <wpt lat="${waypoint.lat}" lon="${waypoint.lng}">`);
    lines.push(`        <time>${waypoint.timestamp.toISOString()}</time>`);
    lines.push('    </wpt>');
  }

  // GPX footer
  lines.push('</gpx>');

  return lines.join('\n');
}

/**
 * Download GPX content as a file
 * @param content GPX file content
 * @param filename Desired filename
 */
export function downloadGPX(content: string, filename: string = 'route.gpx'): void {
  const blob = new Blob([content], { type: 'application/gpx+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
