export type IndianState =
  | 'Andhra Pradesh' | 'Arunachal Pradesh' | 'Assam' | 'Bihar'
  | 'Chhattisgarh' | 'Goa' | 'Gujarat' | 'Haryana'
  | 'Himachal Pradesh' | 'Jharkhand' | 'Karnataka' | 'Kerala'
  | 'Madhya Pradesh' | 'Maharashtra' | 'Manipur' | 'Meghalaya'
  | 'Mizoram' | 'Nagaland' | 'Odisha' | 'Punjab'
  | 'Rajasthan' | 'Sikkim' | 'Tamil Nadu' | 'Telangana'
  | 'Tripura' | 'Uttar Pradesh' | 'Uttarakhand' | 'West Bengal'
  | 'Andaman and Nicobar Islands' | 'Chandigarh'
  | 'Dadra and Nagar Haveli and Daman and Diu'
  | 'Delhi' | 'Jammu and Kashmir' | 'Ladakh'
  | 'Lakshadweep' | 'Puducherry';

// Backward-compatible alias — existing code using Region still works
export type Region = IndianState;

export type Difficulty = 'Easy' | 'Moderate' | 'Difficult' | 'Strenuous';
export type Season = 'Spring' | 'Summer' | 'Monsoon' | 'Autumn' | 'Winter';
export type DestinationType = 'trek' | 'fort';

export interface ElevationPoint {
  km: number;
  altitudeM: number;
  altitudeFt: number;
  locationName: string;
  stage: 'Basecamp' | 'Trek' | 'Pass' | 'Summit' | 'Lake' | 'Camp' | 'Viewpoint';
  description?: string;
}

export interface Waypoint {
  id: string;
  name: string;
  altitudeM: number;
  distanceFromStartKm: number;
  type: 'start' | 'camp' | 'water' | 'pass' | 'summit' | 'lake' | 'finish' | 'viewpoint';
  description: string;
  dayNumber: number;
}

export interface DayPlan {
  day: number;
  title: string;
  distanceKm: number;
  altitudeGainLoss: string;
  durationHours: string;
  altitudeM: number;
  campSite: string;
  description: string;
  highlights: string[];
}

export interface Review {
  id: string;
  trekId: string;
  authorName: string;
  authorEmail?: string;
  authorAvatar?: string;
  authorLocation: string;
  rating: number; // 1 to 5
  date: string;
  title: string;
  comment: string;
  verifiedTrekker: boolean;
  helpfulCount: number;
  trailCondition?: string;
  recommendedSeason?: string;
}

export interface GearRentalItem {
  id: string;
  name: string;
  pricePerDayINR: number;
  icon: string;
  description: string;
}

export interface Trek {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  region: Region;
  state: string;
  district: string;
  baseCamp: string;
  durationDays: number;
  durationNights: number;
  distanceKm: number;
  maxAltitudeM: number;
  maxAltitudeFt: number;
  difficulty: Difficulty;
  startingPriceINR: number;
  discountedPriceINR?: number;
  bestSeasons: Season[];
  bestMonths: string[];
  coverImage: string;
  galleryImages: string[];
  overview: string;
  highlights: string[];
  itinerary: DayPlan[];
  elevationProfile: ElevationPoint[];
  waypoints: Waypoint[];
  inclusions: string[];
  exclusions: string[];
  fitnessRequirement: string;
  requiredGear: string[];
  rating: number;
  reviewsCount: number;
  availableBatches: {
    date: string;
    availableSlots: number;
    guideName: string;
  }[];
  temperatureRange: string;
  featured?: boolean;
}

// Lightweight destination interface for the all-India browsing layer
export interface Destination {
  id: string;
  name: string;
  slug: string;
  type: DestinationType;
  state: string;
  district: string;
  lat: number;
  lon: number;
  altitudeM?: number;
  difficulty?: Difficulty;
  distanceKm?: number;
  durationDays?: number;
  description: string;
  coverImage: string;
  galleryImages?: string[];
  highlights?: string[];
  bestSeasons?: Season[];
  rating?: number;
  featured?: boolean;
  // Link to rich Trek data if available (for the original 9 featured treks)
  linkedTrekId?: string;
}

export interface Booking {
  id: string;
  bookingCode: string;
  trekId: string;
  trekName: string;
  trekRegion: Region;
  trekImage: string;
  selectedBatchDate: string;
  trekkersCount: number;
  primaryContact: {
    name: string;
    email: string;
    phone: string;
    emergencyContact: string;
  };
  trekkerDetails: {
    name: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
  }[];
  rentedGearIds: string[];
  basePriceINR: number;
  gearTotalINR: number;
  discountINR: number;
  taxINR: number;
  totalPriceINR: number;
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
  bookedAt: string;
  paymentMethod: 'UPI' | 'Card' | 'NetBanking';
}

export interface DailyForecast {
  date: string;
  dayName: string;
  maxTempC: number;
  minTempC: number;
  precipitationMm: number;
  precipProbability: number;
  windSpeedMax: number;
  condition: string;
  icon: string;
  severity: 'optimal' | 'moderate' | 'caution' | 'hazardous';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  authMethod: 'email' | 'google';
  savedTreks: string[]; // trek ids
  phone?: string;
  experienceLevel?: 'Beginner' | 'Intermediate' | 'Experienced';
}

export interface LiveWeatherReport {
  trekId: string;
  locationName: string;
  region: string;
  baseCamp: string;
  altitudeM: number;
  lastUpdated: string;
  current: {
    tempC: number;
    feelsLikeC: number;
    humidityPct: number;
    precipitationMm: number;
    windSpeedKmh: number;
    windDirectionDeg: number;
    surfacePressureHpa: number;
    weatherCode: number;
    condition: string;
    icon: string;
    severity: 'optimal' | 'moderate' | 'caution' | 'hazardous';
    isDay: boolean;
    summitTempEstC: number;
    summitWindEstKmh: number;
    trailSafetyScore: number;
  };
  forecast: DailyForecast[];
}

export interface RouteStep {
  instruction: string;
  distanceM: number;
  durationSec: number;
  maneuver?: string;
}

export interface MapRoute {
  distanceM: number;
  durationSec: number;
  geometry: { type: string; coordinates: [number, number][] };
  steps: RouteStep[];
}
