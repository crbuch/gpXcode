export interface Waypoint {
  id: string;
  lat: number;
  lng: number;
  timestamp?: Date;
  additionalTime: number; // in minutes
  isUserPlaced: boolean; // true for user-placed, false for generated
}

export interface RouteSettings {
  speed: number; // in mph
}
