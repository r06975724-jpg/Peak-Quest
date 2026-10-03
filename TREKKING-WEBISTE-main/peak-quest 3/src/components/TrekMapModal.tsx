import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Trek, MapRoute, RouteStep, Waypoint, Destination } from '../types';
import { DESTINATIONS_DATA } from '../data/destinations';
import { INDIAN_STATES } from '../data/states';
import {
  X, MapPin, Navigation, Mountain, Clock, Route, Loader2,
  AlertCircle, Search, ChevronRight, Map, ArrowRight,
} from 'lucide-react';

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
  const userMarkerRef = useRef<any>(null);
  const userCircleRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const routeLayerRef = useRef<any>(null);
  const trailLayerRef = useRef<any>(null);

  const destData = destinations || DESTINATIONS_DATA;
  const initialDest = destData.find(d => d.id === initialTrekId || d.linkedTrekId === initialTrekId) || destData[0];
  
  const [selectedTrekId, setSelectedTrekId] = useState<string>(initialDest?.id || '');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    userLocationProp ? [userLocationProp.lat, userLocationProp.lon] : null
  );
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'found' | 'denied'>(
    userLocationProp ? 'found' : 'idle'
  );
  const [manualCityInput, setManualCityInput] = useState('');
  const [manualCityLabel, setManualCityLabel] = useState('');
  const [route, setRoute] = useState<MapRoute | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [dijkstraPath, setDijkstraPath] = useState<string[]>([]);
  const [mapReady, setMapReady] = useState(false);

  // The browser may resolve permission after the modal has mounted.
  useEffect(() => {
    if (userLocationProp) {
      setUserLocation([userLocationProp.lat, userLocationProp.lon]);
      setLocationStatus('found');
    }
  }, [userLocationProp]);

  // Link selected destination back to a trek if available (for UI purposes)
  const currentDest = destData.find(d => d.id === selectedTrekId);
  const selectedTrek = treks.find((t) => t.id === currentDest?.linkedTrekId || t.id === selectedTrekId);
  
  const getDestCoords = (id: string) => {
    const dest = destData.find(d => d.id === id || d.linkedTrekId === id);
    if (dest) return { lat: dest.lat, lon: dest.lon, altitudeM: dest.altitudeM || 1000 };
    // Fallback for legacy trek IDs
    const linkedDest = destData.find(d => d.linkedTrekId === id);
    if (linkedDest) return { lat: linkedDest.lat, lon: linkedDest.lon, altitudeM: linkedDest.altitudeM || 1000 };
    return null;
  };
  
  const trekCoord = getDestCoords(selectedTrekId);

  useEffect(() => {
    if (!isOpen || !mapContainerRef.current || mapInstanceRef.current) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    import('leaflet').then((L) => {
      if (!mapContainerRef.current || mapInstanceRef.current) return;
      
      const map = L.map(mapContainerRef.current, { center: [22.5, 82.0], zoom: 5 });
      const mapTilerKey = (import.meta as any).env?.VITE_MAP_API_KEY || '';
      
      const tileUrl = mapTilerKey ? `https://api.maptiler.com/maps/outdoor/{z}/{x}/{y}.png?key=${mapTilerKey}` : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      L.tileLayer(tileUrl, {
        attribution: '&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);
      mapInstanceRef.current = map;

      if (selectedState) {
        const stateInfo = INDIAN_STATES.find(s => s.name === selectedState);
        if (stateInfo) {
          map.setView([stateInfo.centerLat, stateInfo.centerLon], stateInfo.zoom);
        }
      }

      // Lightweight grid clustering keeps the India-wide marker layer readable
      // without adding a second Leaflet plugin dependency.
      const buckets = new globalThis.Map<string, Destination[]>();
      destData.forEach(dest => { const key = `${Math.round(dest.lat)}:${Math.round(dest.lon)}`; const bucket = buckets.get(key) || []; bucket.push(dest); buckets.set(key, bucket); });
      buckets.forEach((bucket) => {
        if (bucket.length > 1) {
          const lat = bucket.reduce((sum, d) => sum + d.lat, 0) / bucket.length;
          const lon = bucket.reduce((sum, d) => sum + d.lon, 0) / bucket.length;
          const marker = L.marker([lat, lon], { icon: L.divIcon({ html: `<div style="width:34px;height:34px;border-radius:50%;background:#1E2822;color:white;border:3px solid #A8C69F;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:12px;box-shadow:0 2px 8px rgba(0,0,0,.4)">${bucket.length}</div>`, className: '', iconSize: [34, 34], iconAnchor: [17, 17] }) });
          marker.bindPopup(`<strong>${bucket.length} destinations</strong><br/><span style="font-size:11px">Zoom in to explore this cluster.</span>`).on('click', () => map.fitBounds(L.latLngBounds(bucket.map(d => [d.lat, d.lon] as [number, number])), { padding: [40, 40] })).addTo(map); markersRef.current.push(marker); return;
        }
        const dest = bucket[0];
        const iconHtml = dest.type === 'fort'
          ? `<div style="width:28px;height:28px;border-radius:50%;background:#92400E;display:flex;align-items:center;justify-content:center;color:white;font-size:14px;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4)">🏰</div>`
          : `<div style="width:28px;height:28px;border-radius:50%;background:#2D4F1E;display:flex;align-items:center;justify-content:center;color:white;font-size:14px;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4)">⛰️</div>`;
        
        const marker = L.marker([dest.lat, dest.lon], {
          icon: L.divIcon({ html: iconHtml, className: '', iconSize: [28, 28], iconAnchor: [14, 14] }),
        });
        
        marker.bindPopup(`
          <div style="min-width:200px;font-family:system-ui">
            <div style="font-weight:700;font-size:13px;margin-bottom:4px">${dest.name}</div>
            <div style="font-size:11px;color:#666;margin-bottom:2px">${dest.state} · ${dest.district}</div>
            <div style="font-size:11px;color:#666;margin-bottom:4px">${dest.type === 'fort' ? '🏰 Fort' : '🥾 Trek'}${dest.altitudeM ? ' · ' + dest.altitudeM + 'm' : ''}</div>
            <button onclick="window.__selectMapDest && window.__selectMapDest('${dest.id}')" 
              style="background:#4A6741;color:white;border:none;padding:4px 10px;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;width:100%">
              Get Directions
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

  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !selectedState) return;
    const stateInfo = INDIAN_STATES.find(s => s.name === selectedState);
    if (stateInfo) mapInstanceRef.current.flyTo([stateInfo.centerLat, stateInfo.centerLon], stateInfo.zoom, { duration: 0.8 });
  }, [selectedState, mapReady]);

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
  }, [selectedTrekId, selectedTrek, mapReady]);

  const getUserLocation = useCallback(() => {
    if (userLocationProp) {
      setUserLocation([userLocationProp.lat, userLocationProp.lon]);
      setLocationStatus('found');
      return;
    }
    setLocationStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => { setUserLocation([pos.coords.latitude, pos.coords.longitude]); setLocationStatus('found'); },
      () => setLocationStatus('denied'),
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, [userLocationProp]);

  useEffect(() => { if (isOpen && locationStatus === 'idle') getUserLocation(); }, [isOpen]);

  useEffect(() => {
    if (!userLocation || !mapReady) return;
    import('leaflet').then((L) => {
      if (userMarkerRef.current) mapInstanceRef.current?.removeLayer(userMarkerRef.current);
      if (userCircleRef.current) mapInstanceRef.current?.removeLayer(userCircleRef.current);
      const icon = L.divIcon({
        html: `<div style="position:relative;display:flex;flex-direction:column;align-items:center"><span style="background:#1D4ED8;color:white;font:700 9px system-ui;padding:2px 5px;border-radius:5px;white-space:nowrap;box-shadow:0 1px 4px rgba(0,0,0,.4)">YOU</span><div style="margin-top:2px;width:18px;height:18px;background:#2563EB;border:3px solid white;border-radius:50%;box-shadow:0 2px 10px rgba(37,99,235,.8)"></div></div>`,
        className: 'peakquest-user-location', iconSize: [42, 42], iconAnchor: [21, 36],
      });
      userMarkerRef.current = L.marker(userLocation, { icon, zIndexOffset: 10000 }).addTo(mapInstanceRef.current).bindPopup('<strong>📍 Your Current Location</strong>');
      userCircleRef.current = L.circle(userLocation, { radius: 900, color: '#2563EB', fillColor: '#2563EB', fillOpacity: 0.12, weight: 2, interactive: false }).addTo(mapInstanceRef.current);
    });
  }, [userLocation, mapReady]);

  const fetchRoute = useCallback(async () => {
    if (!userLocation || !trekCoord) return;
    setRouteLoading(true); setRouteError(null);
    try {
      const res = await fetch(`/api/route?startLat=${userLocation[0]}&startLon=${userLocation[1]}&endLat=${trekCoord.lat}&endLon=${trekCoord.lon}`);
      if (!res.ok) throw new Error('Route service unavailable');
      const data = await res.json();
      if (data.code !== 'Ok' || !data.routes?.[0]) throw new Error('No drivable route found');
      const r = data.routes[0];
      const steps: RouteStep[] = (r.legs?.[0]?.steps || []).map((s: any) => ({
        instruction: s.maneuver?.instruction || s.name || 'Continue',
        distanceM: s.distance, durationSec: s.duration, maneuver: s.maneuver?.type,
      }));
      setRoute({ distanceM: r.distance, durationSec: r.duration, geometry: r.geometry, steps });
      if (mapReady) {
        import('leaflet').then((L) => {
          if (routeLayerRef.current) mapInstanceRef.current?.removeLayer(routeLayerRef.current);
          const coords = r.geometry.coordinates.map(([lon, lat]: [number, number]) => [lat, lon] as [number, number]);
          routeLayerRef.current = L.polyline(coords, { color: '#3B82F6', weight: 4, opacity: 0.8 }).addTo(mapInstanceRef.current);
          mapInstanceRef.current?.fitBounds(L.latLngBounds([userLocation, [trekCoord.lat, trekCoord.lon]]), { padding: [40, 40] });
        });
      }
    } catch (err: any) { setRouteError(err.message || 'Could not calculate route'); }
    finally { setRouteLoading(false); }
  }, [userLocation, trekCoord, mapReady]);

  useEffect(() => { if (userLocation && mapReady && selectedTrekId) fetchRoute(); }, [userLocation, selectedTrekId, mapReady]);

  useEffect(() => {
    if (!mapReady || !trekCoord) return;
    mapInstanceRef.current?.flyTo([trekCoord.lat, trekCoord.lon], 9, { duration: 1.2 });
  }, [selectedTrekId, mapReady]);

  const handleManualSearch = async () => {
    if (!manualCityInput.trim()) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(manualCityInput)}&format=json&limit=1`);
      const data = await res.json();
      if (data[0]) {
        setUserLocation([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        setLocationStatus('found'); setManualCityLabel(manualCityInput);
      } else setRouteError('City not found. Try another name.');
    } catch { setRouteError('Could not geocode city.'); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E2822]/80 backdrop-blur-sm p-0 md:p-4">
      <div className="bg-[#FDFCF7] w-full max-w-7xl h-full md:h-[92vh] md:rounded-3xl shadow-2xl border border-[#E8E4D9] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="bg-[#1E2822] text-[#FDFCF7] px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#4A6741] flex items-center justify-center">
              <Map className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white">Trek Route Finder</h3>
              <p className="text-xs text-[#D1CDC0]">GPS-powered routes to treks and heritage forts across India</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-[#D1CDC0] hover:text-white hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Split body */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">

          {/* LEFT PANEL */}
          <div className="w-full md:w-[370px] bg-[#FDFCF7] border-b md:border-b-0 md:border-r border-[#E8E4D9] flex flex-col overflow-y-auto shrink-0 max-h-[42vh] md:max-h-none">

            {/* Trek selector */}
            <div className="p-4 border-b border-[#E8E4D9] flex flex-col gap-2 max-h-[250px] overflow-y-auto">
              <label className="text-xs font-bold text-[#5C6662] uppercase tracking-wider block mb-1.5">Select Destination</label>
              <div className="flex flex-col gap-2">
                {destData
                  .filter(d => !selectedState || d.state === selectedState)
                  .map(dest => (
                    <button key={dest.id} onClick={() => setSelectedTrekId(dest.id)} 
                      className={`flex items-center gap-2 p-2 rounded-xl text-left border ${selectedTrekId === dest.id ? 'border-[#4A6741] bg-[#4A6741]/5' : 'border-[#E8E4D9] hover:bg-[#F3F1EA]'}`}>
                      <span className="text-xl">{dest.type === 'fort' ? '🏰' : '⛰️'}</span>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#2D3633]">{dest.name}</span>
                        <span className="text-[10px] text-[#5C6662]">{dest.state}</span>
                      </div>
                    </button>
                  ))}
              </div>
            </div>

            {/* Location */}
            <div className="p-4 border-b border-[#E8E4D9]">
              <div className="text-xs font-bold text-[#5C6662] uppercase tracking-wider mb-2">Your Starting Point</div>

              {locationStatus === 'loading' && (
                <div className="flex items-center gap-2 text-xs text-[#5C6662] bg-[#F3F1EA] rounded-xl p-3">
                  <Loader2 className="w-4 h-4 text-[#4A6741] animate-spin" />
                  <span>Acquiring GPS location...</span>
                </div>
              )}
              {locationStatus === 'found' && userLocation && (
                <div className="bg-[#E8F0E5] border border-[#A8C69F] rounded-xl p-3 text-xs space-y-0.5">
                  <div className="flex items-center gap-1.5 font-bold text-[#2D4F1E]">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{manualCityLabel || 'GPS Location Found'}</span>
                  </div>
                  <div className="text-[#5C6662] font-mono text-[10px]">{userLocation[0].toFixed(4)}°N, {userLocation[1].toFixed(4)}°E</div>
                </div>
              )}
              {locationStatus === 'denied' && (
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Location denied. Enter your starting city:</span>
                  </div>
                  <div className="flex gap-2">
                    <input value={manualCityInput} onChange={(e) => setManualCityInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleManualSearch()}
                      placeholder="e.g. Delhi, Chandigarh..."
                      className="flex-1 px-3 py-2 text-xs bg-[#F3F1EA] border border-[#E8E4D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A6741]" />
                    <button onClick={handleManualSearch} className="px-3 py-2 bg-[#4A6741] text-white rounded-xl hover:bg-[#3D5636] transition-colors">
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
              {locationStatus === 'idle' && (
                <button onClick={getUserLocation} className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#4A6741] text-white text-xs font-bold rounded-xl hover:bg-[#3D5636] transition-colors">
                  <Navigation className="w-4 h-4" /> Detect My Location
                </button>
              )}
            </div>

            {/* Route */}
            {routeLoading && (
              <div className="p-4 flex items-center gap-2 text-xs text-[#5C6662]">
                <Loader2 className="w-4 h-4 text-[#4A6741] animate-spin" />
                <span>Calculating shortest driving route...</span>
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
                <div className="text-xs font-bold text-[#5C6662] uppercase tracking-wider">Route Summary</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#F3F1EA] rounded-xl p-3 text-center">
                    <Route className="w-4 h-4 text-[#4A6741] mx-auto mb-1" />
                    <div className="font-bold text-sm text-[#2D3633]">{formatDistance(route.distanceM)}</div>
                    <div className="text-[10px] text-[#5C6662]">Driving Distance</div>
                  </div>
                  <div className="bg-[#F3F1EA] rounded-xl p-3 text-center">
                    <Clock className="w-4 h-4 text-[#4A6741] mx-auto mb-1" />
                    <div className="font-bold text-sm text-[#2D3633]">{formatDuration(route.durationSec)}</div>
                    <div className="text-[10px] text-[#5C6662]">Estimated Drive</div>
                  </div>
                </div>
                {route.steps.length > 0 && (
                  <div>
                    <div className="text-xs font-bold text-[#2D3633] mb-2">Turn-by-Turn Directions</div>
                    <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                      {route.steps.slice(0, 12).map((step, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs">
                          <span className="w-5 h-5 rounded-full bg-[#4A6741]/15 text-[#4A6741] font-bold flex items-center justify-center shrink-0 text-[10px]">{i + 1}</span>
                          <div className="flex-1">
                            <span className="text-[#2D3633]">{step.instruction}</span>
                            {step.distanceM > 0 && <span className="text-[#8B9691] ml-1">({formatDistance(step.distanceM)})</span>}
                          </div>
                        </div>
                      ))}
                      {route.steps.length > 12 && (
                        <div className="text-[10px] text-[#8B9691] text-center pt-1">+{route.steps.length - 12} more steps</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Dijkstra trail path */}
            {dijkstraPath.length > 0 && selectedTrek && (
              <div className="p-4 border-b border-[#E8E4D9]">
                <div className="text-xs font-bold text-[#5C6662] uppercase tracking-wider mb-2">Trail Waypoints (Dijkstra Shortest Path)</div>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
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

          {/* RIGHT PANEL — Map */}
          <div className="flex-1 relative bg-[#1E2822] min-h-[300px]">
            <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: '300px' }} />
            {!mapReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#1E2822]">
                <div className="text-center space-y-3 text-[#D1CDC0]">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#4A6741]" />
                  <p className="text-sm font-medium">Loading interactive map...</p>
                </div>
              </div>
            )}
            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-[#FDFCF7]/95 backdrop-blur-sm rounded-xl border border-[#E8E4D9] p-2.5 text-xs space-y-1.5 shadow-md pointer-events-none">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#3B82F6] border-2 border-white shadow-sm"></div><span className="text-[#2D3633]">Your Location</span></div>
              <div className="flex items-center gap-2"><div className="w-6 h-0.5 bg-[#3B82F6]"></div><span className="text-[#2D3633]">Driving Route</span></div>
              <div className="flex items-center gap-2"><div className="w-6 h-0 border-t-2 border-dashed border-[#F97316]"></div><span className="text-[#2D3633]">Trek Trail</span></div>
              <div className="flex items-center gap-2"><span>⛰</span><span className="text-[#2D3633]">Trek Basecamp</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
