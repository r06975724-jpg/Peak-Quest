export interface StateInfo {
  name: string;
  abbreviation: string;
  centerLat: number;
  centerLon: number;
  zoom: number; // suggested Leaflet zoom level for this state
}

export const INDIAN_STATES: StateInfo[] = [
  // 28 States
  { name: 'Andhra Pradesh', abbreviation: 'AP', centerLat: 15.9129, centerLon: 79.74, zoom: 7 },
  { name: 'Arunachal Pradesh', abbreviation: 'AR', centerLat: 28.218, centerLon: 94.7278, zoom: 7 },
  { name: 'Assam', abbreviation: 'AS', centerLat: 26.2006, centerLon: 92.9376, zoom: 7 },
  { name: 'Bihar', abbreviation: 'BR', centerLat: 25.0961, centerLon: 85.3131, zoom: 7 },
  { name: 'Chhattisgarh', abbreviation: 'CG', centerLat: 21.2787, centerLon: 81.8661, zoom: 7 },
  { name: 'Goa', abbreviation: 'GA', centerLat: 15.2993, centerLon: 74.124, zoom: 10 },
  { name: 'Gujarat', abbreviation: 'GJ', centerLat: 22.2587, centerLon: 71.1924, zoom: 7 },
  { name: 'Haryana', abbreviation: 'HR', centerLat: 29.0588, centerLon: 76.0856, zoom: 8 },
  { name: 'Himachal Pradesh', abbreviation: 'HP', centerLat: 31.1048, centerLon: 77.1734, zoom: 8 },
  { name: 'Jharkhand', abbreviation: 'JH', centerLat: 23.6102, centerLon: 85.2799, zoom: 7 },
  { name: 'Karnataka', abbreviation: 'KA', centerLat: 15.3173, centerLon: 75.7139, zoom: 7 },
  { name: 'Kerala', abbreviation: 'KL', centerLat: 10.8505, centerLon: 76.2711, zoom: 8 },
  { name: 'Madhya Pradesh', abbreviation: 'MP', centerLat: 22.9734, centerLon: 78.6569, zoom: 7 },
  { name: 'Maharashtra', abbreviation: 'MH', centerLat: 19.7515, centerLon: 75.7139, zoom: 7 },
  { name: 'Manipur', abbreviation: 'MN', centerLat: 24.6637, centerLon: 93.9063, zoom: 8 },
  { name: 'Meghalaya', abbreviation: 'ML', centerLat: 25.467, centerLon: 91.3662, zoom: 8 },
  { name: 'Mizoram', abbreviation: 'MZ', centerLat: 23.1645, centerLon: 92.9376, zoom: 8 },
  { name: 'Nagaland', abbreviation: 'NL', centerLat: 26.1584, centerLon: 94.5624, zoom: 8 },
  { name: 'Odisha', abbreviation: 'OR', centerLat: 20.9517, centerLon: 85.0985, zoom: 7 },
  { name: 'Punjab', abbreviation: 'PB', centerLat: 31.1471, centerLon: 75.3412, zoom: 8 },
  { name: 'Rajasthan', abbreviation: 'RJ', centerLat: 27.0238, centerLon: 74.2179, zoom: 6 },
  { name: 'Sikkim', abbreviation: 'SK', centerLat: 27.533, centerLon: 88.5122, zoom: 9 },
  { name: 'Tamil Nadu', abbreviation: 'TN', centerLat: 11.1271, centerLon: 78.6569, zoom: 7 },
  { name: 'Telangana', abbreviation: 'TS', centerLat: 18.1124, centerLon: 79.0193, zoom: 7 },
  { name: 'Tripura', abbreviation: 'TR', centerLat: 23.9408, centerLon: 91.9882, zoom: 9 },
  { name: 'Uttar Pradesh', abbreviation: 'UP', centerLat: 26.8467, centerLon: 80.9462, zoom: 7 },
  { name: 'Uttarakhand', abbreviation: 'UK', centerLat: 30.0668, centerLon: 79.0193, zoom: 7 },
  { name: 'West Bengal', abbreviation: 'WB', centerLat: 22.9868, centerLon: 87.855, zoom: 7 },

  // 8 Union Territories
  { name: 'Andaman and Nicobar Islands', abbreviation: 'AN', centerLat: 11.7401, centerLon: 92.6586, zoom: 8 },
  { name: 'Chandigarh', abbreviation: 'CH', centerLat: 30.7333, centerLon: 76.7794, zoom: 11 },
  { name: 'Dadra and Nagar Haveli and Daman and Diu', abbreviation: 'DD', centerLat: 20.1809, centerLon: 73.0169, zoom: 9 },
  { name: 'Delhi', abbreviation: 'DL', centerLat: 28.7041, centerLon: 77.1025, zoom: 10 },
  { name: 'Jammu and Kashmir', abbreviation: 'JK', centerLat: 33.7782, centerLon: 76.5762, zoom: 7 },
  { name: 'Ladakh', abbreviation: 'LA', centerLat: 34.1526, centerLon: 77.5771, zoom: 7 },
  { name: 'Lakshadweep', abbreviation: 'LD', centerLat: 10.5667, centerLon: 72.6417, zoom: 9 },
  { name: 'Puducherry', abbreviation: 'PY', centerLat: 11.9416, centerLon: 79.8083, zoom: 10 }
];

export const ALL_STATE_NAMES: string[] = INDIAN_STATES.map((s) => s.name);
