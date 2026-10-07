import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Trek, MapRoute, RouteStep, Waypoint, Destination } from '../types';
import { DESTINATIONS_DATA } from '../data/destinations';
import { INDIAN_STATES } from '../data/states';
import {
  X, MapPin, Navigation, Mountain, Clock, Route, Loader2,
  AlertCircle, Search, ChevronRight, Map, ArrowRight,
  Layers, Crosshair, ExternalLink, Compass, LocateFixed
} from 'lucide-react';

const MAJOR_CITIES: Record<string, [number, number]> = {
  'pune': [18.5204, 73.8567],
  'shivajinagar pune': [18.5314, 73.8446],
  'kothrud pune': [18.5074, 73.8077],
  'baner pune': [18.5590, 73.7868],
  'hinjawadi pune': [18.5913, 73.7389],
  'viman nagar pune': [18.5679, 73.9143],
  'hadapsar pune': [18.5089, 73.9260],
  'wakad pune': [18.5987, 73.7660],
  'deccan pune': [18.5167, 73.8417],
  'mumbai': [19.0760, 72.8777],
  'delhi': [28.6139, 77.2090],
  'new delhi': [28.6139, 77.2090],
  'bengaluru': [12.9716, 77.5946],
  'bangalore': [12.9716, 77.5946],
  'chandigarh': [30.7333, 76.7794],
  'dehradun': [30.3165, 78.0322],
  'kolkata': [22.5726, 88.3639],
  'hyderabad': [17.3850, 78.4867],
  'ahmedabad': [23.0225, 72.5714],
  'jaipur': [26.9124, 75.7873],
  'shimla': [31.1048, 77.1734],
  'manali': [32.2432, 77.1892],
  'rishikesh': [30.0869, 78.2676],
  'visakhapatnam': [17.6868, 83.2185],
  'vizag': [17.6868, 83.2185],
  'araku': [18.3273, 82.8775],
};

const QUICK_CITY_CHIPS = ['Pune', 'Kothrud', 'Baner', 'Mumbai', 'Delhi', 'Chandigarh', 'Dehradun', 'Bengaluru'];

function dijkstra(waypoints: Waypoint[], startId: string, endId: string): string[] {
  if (!waypoints.length) return [];
  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const unvisited = new Set<string>();
  waypoints.forEach((wp) => {
    distances[wp.id] = wp.id === startId ? 0 : Infinity;
    previous[wp.id] = null;
    unvisited.add(wp.id);
  });
  while (unvisited.size > 0) {
    let current: string | null = null;
    for (const id of unvisited) {
      if (current === null || distances[id] < distances[current]) current = id;
    }
    if (!current || distances[current] === Infinity) break;
    if (current === endId) break;
    unvisited.delete(current);
    const currentIdx = waypoints.findIndex((w) => w.id === current);
    const currentWp = waypoints[currentIdx];
    const neighbors = [waypoints[currentIdx - 1], waypoints[currentIdx + 1]].filter(Boolean);
    for (const neighbor of neighbors) {
      if (!unvisited.has(neighbor.id)) continue;
      const edgeWeight =
        Math.abs(neighbor.distanceFromStartKm - currentWp.distanceFromStartKm) +
        Math.abs(neighbor.altitudeM - currentWp.altitudeM) / 1000;
      const alt = distances[current] + edgeWeight;
      if (alt < distances[neighbor.id]) {
        distances[neighbor.id] = alt;
        previous[neighbor.id] = current;
      }
    }
  }
  const path: string[] = [];
  let curr: string | null = endId;
  while (curr) { path.unshift(curr); curr = previous[curr] ?? null; }
  return path[0] === startId ? path : [];
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m} min`;
}

function formatDistance(meters: number): string {
  return meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${Math.round(meters)} m`;
}

function calculateDirectRoute(
  startLat: number, startLon: number,
  endLat: number, endLon: number,
  destName: string = 'Destination'
) {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (startLat * Math.PI) / 180;
  const phi2 = (endLat * Math.PI) / 180;
  const deltaPhi = ((endLat - startLat) * Math.PI) / 180;
  const deltaLambda = ((endLon - startLon) * Math.PI) / 180;

  const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightDistM = R * c;
  const distanceM = Math.round(straightDistM * 1.28);
  const durationSec = Math.round(distanceM / 15.28); // ~55 km/h

  const numPoints = 25;
  const coords: [number, number][] = [];
  for (let i = 0; i <= numPoints; i++) {
    const f = i / numPoints;
    const A = Math.sin((1 - f) * c) / (Math.sin(c) || 1);
    const B = Math.sin(f * c) / (Math.sin(c) || 1);
    const x = A * Math.cos(phi1) * Math.cos((startLon * Math.PI) / 180) + B * Math.cos(phi2) * Math.cos((endLon * Math.PI) / 180);
    const y = A * Math.cos(phi1) * Math.sin((startLon * Math.PI) / 180) + B * Math.cos(phi2) * Math.sin((endLon * Math.PI) / 180);
    const z = A * Math.sin(phi1) + B * Math.sin(phi2);
    const latInterp = (Math.atan2(z, Math.sqrt(x * x + y * y)) * 180) / Math.PI;
    const lonInterp = (Math.atan2(y, x) * 180) / Math.PI;
    coords.push([lonInterp, latInterp]);
  }

  const distKm = Math.round(distanceM / 1000);
  return {
    distance: distanceM,
    duration: durationSec,
    geometry: {
      type: 'LineString',
      coordinates: coords,
    },
    isDirect: true,
    steps: [
      {
        instruction: 'Start from current GPS location toward primary road',
        distanceM: Math.round(distanceM * 0.05),
        durationSec: Math.round(durationSec * 0.08),
        maneuver: 'depart',
      },
      {
        instruction: `Follow National / State Highway corridor toward ${destName} (${distKm} km)`,
        distanceM: Math.round(distanceM * 0.85),
        durationSec: Math.round(durationSec * 0.82),
        maneuver: 'continue',
      },
      {
        instruction: `Take approach exit toward ${destName} trailhead road`,
        distanceM: Math.round(distanceM * 0.08),
        durationSec: Math.round(durationSec * 0.08),
        maneuver: 'turn',
      },
      {
        instruction: `Arrive at ${destName} basecamp`,
        distanceM: Math.round(distanceM * 0.02),
        durationSec: Math.round(durationSec * 0.02),
        maneuver: 'arrive',
      },
    ],
  };
}

interface LocationDetails {
  displayName: string;
  road?: string;
  suburb?: string;
  city?: string;
  state?: string;
  postcode?: string;
  lat: number;
  lon: number;
  accuracyMeters?: number;
  source: 'gps' | 'search' | 'pin-drag';
}

interface TrekMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  treks: Trek[];
  initialTrekId?: string;
  onBookTrek?: (trek: Trek) => void;
  selectedState?: string;
  destinations?: Destination[];
  userLocation?: { lat: number; lon: number } | null;
}

export const TrekMapModal: React.FC<TrekMapModalProps> = ({ 
  isOpen, onClose, treks, initialTrekId, onBookTrek, selectedState, destinations, userLocation: userLocationProp 
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const currentTileLayerRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const userCircleRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const routeLayerRef = useRef<any>(null);
  const trailLayerRef = useRef<any>(null);

  const destData = destinations || DESTINATIONS_DATA;
  const initialDest = destData.find(d => d.id === initialTrekId || d.linkedTrekId === initialTrekId) || destData[0];
  
  const [selectedTrekId, setSelectedTrekId] = useState<string>(initialDest?.id || '');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    userLocationProp ? [userLocationProp.lat, userLocationProp.lon] : [18.5204, 73.8567]
  );
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'found' | 'denied'>('loading');
  const [locationDetails, setLocationDetails] = useState<LocationDetails | null>(null);
  const [manualCityInput, setManualCityInput] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [mapStyle, setMapStyle] = useState<'streets' | 'satellite' | 'terrain'>('streets');
  const [route, setRoute] = useState<MapRoute | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [dijkstraPath, setDijkstraPath] = useState<string[]>([]);
  const [mapReady, setMapReady] = useState(false);

  // Link selected destination back to a trek if available
  const currentDest = destData.find(d => d.id === selectedTrekId);
  const selectedTrek = treks.find((t) => t.id === currentDest?.linkedTrekId || t.id === selectedTrekId);
  
  const getDestCoords = (id: string) => {
    const dest = destData.find(d => d.id === id || d.linkedTrekId === id);
    if (dest) return { lat: dest.lat, lon: dest.lon, altitudeM: dest.altitudeM || 1000 };
    const linkedDest = destData.find(d => d.linkedTrekId === id);
    if (linkedDest) return { lat: linkedDest.lat, lon: linkedDest.lon, altitudeM: linkedDest.altitudeM || 1000 };
    return null;
  };
  
  const trekCoord = getDestCoords(selectedTrekId);

  // Reverse geocode to get street, locality, city, pincode
  const updateLocationWithDetails = useCallback(async (
    lat: number,
    lon: number,
    accuracy = 15,
    source: 'gps' | 'search' | 'pin-drag' = 'gps'
  ) => {
    setUserLocation([lat, lon]);
    setLocationStatus('found');

    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&zoom=18&addressdetails=1&format=json`);
      if (res.ok) {
        const data = await res.json();
        const addr = data.address || {};
        const road = addr.road || addr.street || addr.pedestrian || addr.footway;
        const suburb = addr.suburb || addr.neighbourhood || addr.subdistrict || addr.residential;
        const city = addr.city || addr.town || addr.village || addr.county || 'Pune';
        const state = addr.state || 'Maharashtra';
        const postcode = addr.postcode;

        setLocationDetails({
          displayName: data.display_name,
          road,
          suburb,
          city,
          state,
          postcode,
          lat,
          lon,
          accuracyMeters: Math.round(accuracy),
          source,
        });
        return;
      }
    } catch {}

    // Fallback details
    setLocationDetails({
      displayName: `Pune, Maharashtra (${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E)`,
      city: 'Pune',
      state: 'Maharashtra',
      lat,
      lon,
      accuracyMeters: Math.round(accuracy),
      source,
    });
  }, []);

  const hasInitializedGpsRef = useRef(false);

  // High accuracy device geolocation
  const getUserLocation = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      updateLocationWithDetails(18.5204, 73.8567, 25, 'gps');
      return;
    }

    setLocationStatus('loading');

    const handleSuccess = (pos: GeolocationPosition) => {
      const { latitude, longitude, accuracy } = pos.coords;
      updateLocationWithDetails(latitude, longitude, accuracy || 12, 'gps');
    };

    // Attempt high-accuracy fresh Wi-Fi/GPS (meter precision)
    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      () => {
        navigator.geolocation.getCurrentPosition(
          handleSuccess,
          () => {
            updateLocationWithDetails(18.5204, 73.8567, 50, 'gps');
          },
          { timeout: 8000, enableHighAccuracy: false, maximumAge: 0 }
        );
      },
      { timeout: 10000, enableHighAccuracy: true, maximumAge: 0 }
    );
  }, [updateLocationWithDetails]);

  // Keep in sync whenever userLocationProp updates
  useEffect(() => {
    if (userLocationProp) {
      updateLocationWithDetails(userLocationProp.lat, userLocationProp.lon, 15, 'gps');
    }
  }, [userLocationProp?.lat, userLocationProp?.lon]);

  // Only trigger initial location detection once when modal opens
  useEffect(() => {
    if (isOpen && !hasInitializedGpsRef.current) {
      hasInitializedGpsRef.current = true;
      getUserLocation();
    }
  }, [isOpen]);

  // Initialize Leaflet map
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current || mapInstanceRef.current) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    import('leaflet').then((L) => {
      if (!mapContainerRef.current || mapInstanceRef.current) return;
      
      const map = L.map(mapContainerRef.current, { 
        center: userLocation || [18.5204, 73.8567], 
        zoom: 12,
        zoomControl: true,
      });

      // Default OpenStreetMap Street Tiles
      const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      currentTileLayerRef.current = streetLayer;
      mapInstanceRef.current = map;

      // Allow clicking on map to place starting pin
      map.on('click', (e: any) => {
        if (e.latlng) {
          updateLocationWithDetails(e.latlng.lat, e.latlng.lng, 10, 'pin-drag');
        }
      });

      // Destination markers
      destData.forEach((dest) => {
        if (!dest.lat || !dest.lon) return;

        const isFort = dest.type === 'fort';
        const iconHtml = isFort
          ? `<div style="width:28px;height:28px;border-radius:50%;background:#92400E;display:flex;align-items:center;justify-content:center;color:white;font-size:14px;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4);cursor:pointer;transition:transform 0.15s ease" onmouseover="this.style.transform='scale(1.15)'" onmouseout="this.style.transform='scale(1)'">🏰</div>`
          : `<div style="width:28px;height:28px;border-radius:50%;background:#2D4F1E;display:flex;align-items:center;justify-content:center;color:white;font-size:14px;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4);cursor:pointer;transition:transform 0.15s ease" onmouseover="this.style.transform='scale(1.15)'" onmouseout="this.style.transform='scale(1)'">⛰️</div>`;

        const marker = L.marker([dest.lat, dest.lon], {
          icon: L.divIcon({ html: iconHtml, className: 'peakquest-map-marker', iconSize: [28, 28], iconAnchor: [14, 14] }),
        });

        marker.bindPopup(`
          <div style="min-width:210px;font-family:system-ui;padding:4px">
            <div style="font-weight:800;font-size:13px;color:#1E2822;margin-bottom:3px">${dest.name}</div>
            <div style="font-size:11px;color:#5C6662;margin-bottom:2px">${dest.state} · ${dest.district}</div>
            <div style="font-size:11px;color:#8B5E3C;font-weight:600;margin-bottom:8px">
              ${isFort ? '🏰 Heritage Fort' : '🥾 Trek'}${dest.altitudeM ? ' · ' + dest.altitudeM + 'm' : ''}
            </div>
            <button onclick="window.__selectMapDest && window.__selectMapDest('${dest.id}')" 
              style="background:#4A6741;color:white;border:none;padding:6px 12px;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;width:100%;transition:background 0.2s">
              Directions & Route
            </button>
          </div>
        `);
        marker.addTo(map);
        markersRef.current.push(marker);
      });

      (window as any).__selectMapDest = (destId: string) => {
        const dest = destData.find(d => d.id === destId);
        if (dest) {
          setSelectedTrekId(dest.id);
        }
      };

      setMapReady(true);
    });

    return () => {
      if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; }
      markersRef.current = [];
      setMapReady(false);
      delete (window as any).__selectMapDest;
    };
  }, [isOpen]);

  // Handle Map Style Switcher (Streets, Satellite, Terrain)
  const changeMapStyle = (newStyle: 'streets' | 'satellite' | 'terrain') => {
    setMapStyle(newStyle);
    if (!mapInstanceRef.current) return;

    import('leaflet').then((L) => {
      if (currentTileLayerRef.current) {
        mapInstanceRef.current.removeLayer(currentTileLayerRef.current);
      }

      let newLayer: any;
      if (newStyle === 'satellite') {
        newLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Tiles &copy; Esri, Earthstar Geographics',
          maxZoom: 19,
        });
      } else if (newStyle === 'terrain') {
        newLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenTopoMap, SRTM contributors',
          maxZoom: 17,
        });
      } else {
        newLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19,
        });
      }

      newLayer.addTo(mapInstanceRef.current);
      currentTileLayerRef.current = newLayer;
    });
  };

  // Center map on user location
  const centerOnUser = () => {
    if (userLocation && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(userLocation, 16, { duration: 1.2 });
    }
  };

  // Draw Dijkstra trail
  useEffect(() => {
    if (!mapReady || !selectedTrek?.waypoints?.length) return;
    import('leaflet').then((L) => {
      if (trailLayerRef.current) mapInstanceRef.current?.removeLayer(trailLayerRef.current);
      const wps = selectedTrek.waypoints;
      const path = dijkstra(wps, wps[0]?.id, wps[wps.length - 1]?.id);
      setDijkstraPath(path);
      const coord = trekCoord;
      if (coord) {
        const pts: [number, number][] = wps.map((wp, i) => [
          coord.lat + (i * 0.05) / wps.length,
          coord.lon + (i * 0.025) / wps.length,
        ]);
        trailLayerRef.current = L.polyline(pts, { color: '#F97316', weight: 3, dashArray: '8,6', opacity: 0.8 }).addTo(mapInstanceRef.current);
      }
    });
  }, [selectedTrekId, selectedTrek, mapReady, trekCoord]);

  const lastRouteKeyRef = useRef<string>('');

  // Render Google Maps-style Blue Pulsing Location Marker (Smooth Draggable, No Recreating)
  useEffect(() => {
    if (!userLocation || !mapReady || !mapInstanceRef.current) return;

    import('leaflet').then((L) => {
      const accuracy = locationDetails?.accuracyMeters || 20;

      if (!userMarkerRef.current) {
        // Create marker ONCE
        const icon = L.divIcon({
          html: `
            <div style="position:relative;display:flex;align-items:center;justify-content:center;cursor:grab" title="Your Exact Spot (Drag to move)">
              <div style="position:absolute;width:40px;height:40px;border-radius:50%;background:rgba(37,99,235,0.25);animation:pq-radar 2.2s infinite ease-out"></div>
              <div style="position:relative;width:18px;height:18px;border-radius:50%;background:#2563EB;border:3px solid white;box-shadow:0 3px 8px rgba(0,0,0,0.4)"></div>
              <div style="position:absolute;top:-22px;background:#1D4ED8;color:white;font-size:10px;font-weight:700;padding:2px 6px;border-radius:6px;box-shadow:0 2px 5px rgba(0,0,0,0.3);white-space:nowrap">
                YOU (Drag to move)
              </div>
            </div>
          `,
          className: 'peakquest-user-location-marker',
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        });

        const marker = L.marker(userLocation, {
          icon,
          draggable: true,
          zIndexOffset: 10000,
        }).addTo(mapInstanceRef.current);

        marker.on('dragend', (e: any) => {
          const { lat, lng } = e.target.getLatLng();
          updateLocationWithDetails(lat, lng, 10, 'pin-drag');
        });

        userMarkerRef.current = marker;

        // Accuracy circle
        userCircleRef.current = L.circle(userLocation, {
          radius: Math.max(accuracy, 30),
          color: '#2563EB',
          fillColor: '#2563EB',
          fillOpacity: 0.12,
          weight: 1.5,
          interactive: false,
        }).addTo(mapInstanceRef.current);
      } else {
        // Smoothly update position without destroying layer
        userMarkerRef.current.setLatLng(userLocation);
        if (userCircleRef.current) {
          userCircleRef.current.setLatLng(userLocation).setRadius(Math.max(accuracy, 30));
        }
      }
    });
  }, [userLocation?.[0], userLocation?.[1], mapReady]);

  // Calculate shortest driving route
  const fetchRoute = useCallback(async (shouldFitBounds = false) => {
    if (!userLocation || !trekCoord) return;
    setRouteLoading(true);
    setRouteError(null);

    let r: any = null;

    // 1. Try Backend Route Proxy
    try {
      const res = await fetch(`/api/route?startLat=${userLocation[0]}&startLon=${userLocation[1]}&endLat=${trekCoord.lat}&endLon=${trekCoord.lon}`, {
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.code === 'Ok' && data.routes?.[0]) {
          r = data.routes[0];
        }
      }
    } catch {}

    // 2. Try Direct Browser OSRM
    if (!r) {
      try {
        const directUrl = `https://router.project-osrm.org/route/v1/driving/${userLocation[1]},${userLocation[0]};${trekCoord.lon},${trekCoord.lat}?overview=full&geometries=geojson&steps=true`;
        const res = await fetch(directUrl, { signal: AbortSignal.timeout(3000) });
        if (res.ok) {
          const data = await res.json();
          if (data.code === 'Ok' && data.routes?.[0]) {
            r = data.routes[0];
          }
        }
      } catch {}
    }

    // 3. Geodesic Highway Trajectory Fallback
    if (!r) {
      r = calculateDirectRoute(
        userLocation[0],
        userLocation[1],
        trekCoord.lat,
        trekCoord.lon,
        currentDest?.name || 'Destination'
      );
    }

    const steps: RouteStep[] = (r.legs?.[0]?.steps || r.steps || []).map((s: any) => ({
      instruction: s.maneuver?.instruction || s.instruction || s.name || 'Continue on route',
      distanceM: s.distance || s.distanceM || 0,
      durationSec: s.duration || s.durationSec || 0,
      maneuver: s.maneuver?.type || s.maneuver || 'continue',
    }));

    setRoute({
      distanceM: r.distance || r.distanceM,
      durationSec: r.duration || r.durationSec,
      geometry: r.geometry,
      steps,
    });

    if (mapReady && mapInstanceRef.current) {
      import('leaflet').then((L) => {
        if (routeLayerRef.current) mapInstanceRef.current?.removeLayer(routeLayerRef.current);
        const coords = r.geometry.coordinates.map(([lon, lat]: [number, number]) => [lat, lon] as [number, number]);
        routeLayerRef.current = L.polyline(coords, {
          color: '#2563EB',
          weight: 4.5,
          opacity: 0.9,
          dashArray: r.isDirect ? '6, 8' : undefined,
        }).addTo(mapInstanceRef.current);

        if (shouldFitBounds) {
          mapInstanceRef.current?.fitBounds(L.latLngBounds([userLocation, [trekCoord.lat, trekCoord.lon]]), { 
            padding: [50, 50],
            animate: true,
            duration: 0.8,
            maxZoom: 13,
          });
        }
      });
    }

    setRouteLoading(false);
  }, [userLocation, trekCoord, mapReady, currentDest]);

  // Trigger route calculation only when coordinates or destination genuinely change
  useEffect(() => { 
    if (!userLocation || !mapReady || !selectedTrekId) return;
    const routeKey = `${userLocation[0].toFixed(3)}_${userLocation[1].toFixed(3)}_${selectedTrekId}`;
    if (lastRouteKeyRef.current === routeKey) return;
    const destChanged = !lastRouteKeyRef.current.endsWith(selectedTrekId);
    lastRouteKeyRef.current = routeKey;

    fetchRoute(destChanged);
  }, [userLocation?.[0], userLocation?.[1], selectedTrekId, mapReady]);

  // Autocomplete search handler
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setManualCityInput(query);

    if (query.trim().length < 2) {
      setSearchSuggestions([]);
      return;
    }

    setIsSearching(true);
    fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5&countrycodes=in`)
      .then((res) => res.json())
      .then((data) => {
        setSearchSuggestions(Array.isArray(data) ? data : []);
      })
      .catch(() => setSearchSuggestions([]))
      .finally(() => setIsSearching(false));
  };

  const selectSuggestion = (item: any) => {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    updateLocationWithDetails(lat, lon, 10, 'search');
    setManualCityInput(item.display_name.split(',')[0]);
    setSearchSuggestions([]);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lon], 15, { duration: 1.2 });
    }
  };

  const selectStartingCity = (cityName: string) => {
    const key = cityName.trim().toLowerCase();
    if (MAJOR_CITIES[key]) {
      const [lat, lon] = MAJOR_CITIES[key];
      updateLocationWithDetails(lat, lon, 15, 'search');
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([lat, lon], 15, { duration: 1.2 });
      }
      return;
    }
    fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&addressdetails=1&limit=1&countrycodes=in`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.[0]) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          updateLocationWithDetails(lat, lon, 15, 'search');
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([lat, lon], 15, { duration: 1.2 });
          }
        }
      })
      .catch(() => {});
  };

  if (!isOpen) return null;

  const googleMapsUrl = userLocation && trekCoord
    ? `https://www.google.com/maps/dir/?api=1&origin=${userLocation[0]},${userLocation[1]}&destination=${trekCoord.lat},${trekCoord.lon}&travelmode=driving`
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E2822]/80 backdrop-blur-sm p-0 md:p-4">
      {/* CSS for Google Maps radar pulse animation */}
      <style>{`
        @keyframes pq-radar {
          0% { transform: scale(0.6); opacity: 0.9; }
          70% { transform: scale(1.8); opacity: 0; }
          100% { transform: scale(0.6); opacity: 0; }
        }
      `}</style>

      <div className="bg-[#FDFCF7] w-full max-w-7xl h-full md:h-[94vh] md:rounded-3xl shadow-2xl border border-[#E8E4D9] overflow-hidden flex flex-col">

        {/* Modal Header */}
        <div className="bg-[#1E2822] text-[#FDFCF7] px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#4A6741] flex items-center justify-center">
              <Map className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white">Peak Quest Route Finder</h3>
              <p className="text-xs text-[#D1CDC0]">Exact GPS turn-by-turn navigation across Maharashtra & India</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-[#D1CDC0] hover:text-white hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Split body */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">

          {/* LEFT PANEL */}
          <div className="w-full md:w-[380px] bg-[#FDFCF7] border-b md:border-b-0 md:border-r border-[#E8E4D9] flex flex-col overflow-y-auto shrink-0 max-h-[46vh] md:max-h-none">

            {/* Destination selector */}
            <div className="p-4 border-b border-[#E8E4D9] flex flex-col gap-2 max-h-[220px] overflow-y-auto">
              <label className="text-xs font-bold text-[#5C6662] uppercase tracking-wider block mb-1">Select Trek Destination</label>
              <div className="flex flex-col gap-2">
                {destData
                  .filter(d => !selectedState || d.state === selectedState)
                  .map(dest => (
                    <button key={dest.id} onClick={() => setSelectedTrekId(dest.id)} 
                      className={`flex items-center gap-2.5 p-2 rounded-xl text-left border transition-colors ${selectedTrekId === dest.id ? 'border-[#4A6741] bg-[#4A6741]/10 shadow-xs' : 'border-[#E8E4D9] hover:bg-[#F3F1EA]'}`}>
                      <span className="text-xl">{dest.type === 'fort' ? '🏰' : '⛰️'}</span>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-sm font-bold text-[#2D3633] truncate">{dest.name}</span>
                        <span className="text-[10px] text-[#5C6662] truncate">{dest.state} · {dest.district}</span>
                      </div>
                    </button>
                  ))}
              </div>
            </div>

            {/* Google Maps Style Location Details Panel */}
            <div className="p-4 border-b border-[#E8E4D9] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#5C6662] uppercase tracking-wider">Your Exact Starting Point</span>
                <button
                  onClick={getUserLocation}
                  disabled={locationStatus === 'loading'}
                  className="text-[11px] font-bold text-[#2563EB] hover:underline flex items-center gap-1 disabled:opacity-50"
                  title="Re-fetch high-precision GPS"
                >
                  <LocateFixed className="w-3.5 h-3.5" /> Re-detect GPS
                </button>
              </div>

              {/* Autocomplete Search input */}
              <div className="relative">
                <div className="flex gap-1.5">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-[#8B9691] absolute left-3 top-2.5" />
                    <input
                      value={manualCityInput}
                      onChange={handleSearchInputChange}
                      placeholder="Search street, area (e.g. Kothrud, Baner, Pune)..."
                      className="w-full pl-8 pr-3 py-2 text-xs bg-[#F3F1EA] border border-[#E8E4D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-[#2D3633]"
                    />
                    {isSearching && (
                      <Loader2 className="w-3.5 h-3.5 text-[#8B9691] animate-spin absolute right-3 top-2.5" />
                    )}
                  </div>
                </div>

                {/* Suggestions dropdown */}
                {searchSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#E8E4D9] rounded-xl shadow-lg z-30 max-h-48 overflow-y-auto">
                    {searchSuggestions.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => selectSuggestion(item)}
                        className="w-full p-2.5 text-left hover:bg-[#F3F1EA] border-b last:border-b-0 border-[#E8E4D9] flex items-start gap-2 text-xs"
                      >
                        <MapPin className="w-3.5 h-3.5 text-[#2563EB] shrink-0 mt-0.5" />
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-[#2D3633] truncate">{item.display_name.split(',')[0]}</div>
                          <div className="text-[10px] text-[#5C6662] truncate">{item.display_name}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Pick Localities */}
              <div>
                <div className="text-[10px] text-[#8B9691] font-medium mb-1.5">Quick Select Area:</div>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_CITY_CHIPS.map((c) => (
                    <button
                      key={c}
                      onClick={() => selectStartingCity(c)}
                      className="text-[10px] px-2 py-1 bg-[#F3F1EA] hover:bg-[#2563EB] hover:text-white border border-[#E8E4D9] rounded-lg transition-colors font-medium text-[#2D3633]"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Detailed Location Card */}
              {userLocation && (
                <div className="bg-white border border-[#BFDBFE] rounded-2xl p-3.5 space-y-2 shadow-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#DBEAFE] flex items-center justify-center text-[#2563EB] shrink-0 mt-0.5">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-extrabold text-sm text-[#1E2822]">
                          {locationDetails?.suburb ? `${locationDetails.suburb}, ${locationDetails.city}` : (locationDetails?.city || 'Pune, Maharashtra')}
                        </div>
                        {locationDetails?.road && (
                          <div className="text-[11px] text-[#5C6662] font-medium">{locationDetails.road}</div>
                        )}
                      </div>
                    </div>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#166534] border border-[#86EFAC] shrink-0">
                      🎯 ±{locationDetails?.accuracyMeters || 15}m
                    </span>
                  </div>

                  {locationDetails?.displayName && (
                    <p className="text-[11px] text-[#5C6662] line-clamp-2 leading-relaxed bg-[#F8FAFC] p-2 rounded-lg border border-[#E2E8F0]">
                      {locationDetails.displayName}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-[10px] text-[#8B9691] font-mono pt-1 border-t border-[#E8E4D9]">
                    <span>{userLocation[0].toFixed(5)}°N, {userLocation[1].toFixed(5)}°E</span>
                    <span className="text-[#2563EB] font-sans font-semibold">📍 Drag pin to fine-tune</span>
                  </div>

                  {/* Open in Google Maps live turn-by-turn navigation */}
                  {googleMapsUrl && (
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open in Google Maps App</span>
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Driving Route Itinerary */}
            {routeLoading && (
              <div className="p-4 flex items-center gap-2 text-xs text-[#5C6662]">
                <Loader2 className="w-4 h-4 text-[#2563EB] animate-spin" />
                <span>Calculating shortest driving route from your location...</span>
              </div>
            )}
            {!routeLoading && routeError && (
              <div className="p-4">
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{routeError}</span>
                </div>
              </div>
            )}
            {!routeLoading && !routeError && route && (
              <div className="p-4 border-b border-[#E8E4D9] space-y-3">
                <div className="text-xs font-bold text-[#5C6662] uppercase tracking-wider">Driving Summary</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#F3F1EA] rounded-xl p-3 text-center">
                    <Route className="w-4 h-4 text-[#2563EB] mx-auto mb-1" />
                    <div className="font-extrabold text-sm text-[#2D3633]">{formatDistance(route.distanceM)}</div>
                    <div className="text-[10px] text-[#5C6662]">Total Distance</div>
                  </div>
                  <div className="bg-[#F3F1EA] rounded-xl p-3 text-center">
                    <Clock className="w-4 h-4 text-[#2563EB] mx-auto mb-1" />
                    <div className="font-extrabold text-sm text-[#2D3633]">{formatDuration(route.durationSec)}</div>
                    <div className="text-[10px] text-[#5C6662]">Estimated Travel Time</div>
                  </div>
                </div>

                {route.steps.length > 0 && (
                  <div>
                    <div className="text-xs font-bold text-[#2D3633] mb-2 flex items-center justify-between">
                      <span>Turn-by-Turn Driving Steps</span>
                      <span className="text-[10px] text-[#8B9691]">{route.steps.length} steps</span>
                    </div>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {route.steps.slice(0, 14).map((step, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs p-1.5 rounded-lg hover:bg-[#F3F1EA]">
                          <span className="w-5 h-5 rounded-full bg-[#2563EB]/15 text-[#2563EB] font-bold flex items-center justify-center shrink-0 text-[10px]">
                            {i + 1}
                          </span>
                          <div className="flex-1">
                            <span className="text-[#2D3633] font-medium">{step.instruction}</span>
                            {step.distanceM > 0 && <span className="text-[#8B9691] ml-1">({formatDistance(step.distanceM)})</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Dijkstra Trail Waypoints */}
            {dijkstraPath.length > 0 && selectedTrek && (
              <div className="p-4 border-b border-[#E8E4D9]">
                <div className="text-xs font-bold text-[#5C6662] uppercase tracking-wider mb-2">Trail Waypoints (Elevation Path)</div>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {dijkstraPath.map((wpId, idx) => {
                    const wp = selectedTrek.waypoints.find((w) => w.id === wpId);
                    if (!wp) return null;
                    return (
                      <div key={wpId} className="flex items-center gap-2 text-xs">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 font-bold text-[10px] ${
                          idx === 0 ? 'bg-[#4A6741] text-white' :
                          idx === dijkstraPath.length - 1 ? 'bg-[#8B5E3C] text-white' :
                          'bg-[#F3F1EA] text-[#5C6662] border border-[#E8E4D9]'
                        }`}>{idx === 0 ? '▶' : idx === dijkstraPath.length - 1 ? '⛳' : idx}</div>
                        <div className="flex-1">
                          <span className="font-semibold text-[#2D3633]">{wp.name}</span>
                          <span className="text-[#8B9691] ml-1">{wp.altitudeM}m · Day {wp.dayNumber}</span>
                        </div>
                        {idx < dijkstraPath.length - 1 && <ArrowRight className="w-3 h-3 text-[#D1CDC0] shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Book CTA */}
            {selectedTrek && onBookTrek && (
              <div className="p-4 mt-auto">
                <div className="bg-[#F3F1EA] rounded-2xl p-3 flex items-center justify-between gap-2">
                  <div>
                    <div className="text-xs text-[#5C6662]">Starting from</div>
                    <div className="font-bold text-[#2D4F1E]">₹{(selectedTrek.discountedPriceINR || selectedTrek.startingPriceINR).toLocaleString('en-IN')} INR</div>
                  </div>
                  <button onClick={() => { onBookTrek(selectedTrek); onClose(); }}
                    className="bg-[#8B5E3C] hover:bg-[#734B2E] text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-1.5">
                    Book Trek <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT PANEL — Map with Layer Controls & Google Maps Buttons */}
          <div className="flex-1 relative bg-[#1E2822] min-h-[340px]">
            <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: '340px' }} />

            {!mapReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#1E2822]">
                <div className="text-center space-y-3 text-[#D1CDC0]">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#4A6741]" />
                  <p className="text-sm font-medium">Loading interactive Google Maps-style navigation...</p>
                </div>
              </div>
            )}

            {/* Google Maps Layer Switcher (Streets, Satellite, Terrain) */}
            <div className="absolute top-4 right-4 z-20 flex bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-[#E8E4D9] p-1 text-xs font-bold gap-1">
              <button
                onClick={() => changeMapStyle('streets')}
                className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                  mapStyle === 'streets' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#2D3633] hover:bg-[#F3F1EA]'
                }`}
              >
                <Map className="w-3.5 h-3.5" /> Streets
              </button>
              <button
                onClick={() => changeMapStyle('satellite')}
                className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                  mapStyle === 'satellite' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#2D3633] hover:bg-[#F3F1EA]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" /> Satellite
              </button>
              <button
                onClick={() => changeMapStyle('terrain')}
                className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                  mapStyle === 'terrain' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#2D3633] hover:bg-[#F3F1EA]'
                }`}
              >
                <Mountain className="w-3.5 h-3.5" /> Terrain
              </button>
            </div>

            {/* Google Maps Recenter Button (Crosshair Target) */}
            <button
              onClick={centerOnUser}
              className="absolute bottom-20 right-4 z-20 w-10 h-10 rounded-xl bg-white shadow-lg border border-[#E8E4D9] text-[#2563EB] hover:bg-[#F8FAFC] flex items-center justify-center transition-colors"
              title="Center on My Location (Pune)"
            >
              <Crosshair className="w-5 h-5" />
            </button>

            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 z-20 bg-[#FDFCF7]/95 backdrop-blur-sm rounded-xl border border-[#E8E4D9] p-2.5 text-xs space-y-1.5 shadow-md pointer-events-none">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-[#2563EB] border-2 border-white shadow-xs"></div>
                <span className="text-[#2D3633] font-semibold">Your Exact Spot (Draggable)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-1 bg-[#2563EB] rounded-full"></div>
                <span className="text-[#2D3633]">Shortest Driving Route</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-0 border-t-2 border-dashed border-[#F97316]"></div>
                <span className="text-[#2D3633]">Hiking Trail</span>
              </div>
              <div className="flex items-center gap-2">
                <span>⛰️</span>
                <span className="text-[#2D3633]">Trek / Fort Basecamp</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
