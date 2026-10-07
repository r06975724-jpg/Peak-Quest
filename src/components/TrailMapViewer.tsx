import React, { useState } from 'react';
import { Trek, ElevationPoint, Waypoint } from '../types';
import { 
  Mountain, 
  MapPin, 
  Compass, 
  TrendingUp, 
  Navigation, 
  Flag, 
  Droplets, 
  Tent, 
  Footprints, 
  Award,
  Layers
} from 'lucide-react';

interface TrailMapViewerProps {
  trek: Trek;
}

export const TrailMapViewer: React.FC<TrailMapViewerProps> = ({ trek }) => {
  const [activeElevationIdx, setActiveElevationIdx] = useState<number | null>(null);
  const [selectedWaypoint, setSelectedWaypoint] = useState<Waypoint | null>(trek.waypoints[0] || null);
  const [mapViewMode, setMapViewMode] = useState<'elevation' | 'waypoints' | 'schematic'>('elevation');

  // Elevation calculations
  const minAlt = Math.min(...trek.elevationProfile.map((p) => p.altitudeM)) * 0.9;
  const maxAlt = Math.max(...trek.elevationProfile.map((p) => p.altitudeM)) * 1.05;
  const totalDist = trek.elevationProfile[trek.elevationProfile.length - 1]?.km || trek.distanceKm;

  const svgWidth = 800;
  const svgHeight = 260;
  const paddingX = 45;
  const paddingY = 30;

  const getX = (km: number) => paddingX + (km / (totalDist || 1)) * (svgWidth - 2 * paddingX);
  const getY = (alt: number) => svgHeight - paddingY - ((alt - minAlt) / ((maxAlt - minAlt) || 1)) * (svgHeight - 2 * paddingY);

  // Generate SVG Path
  const pathD = trek.elevationProfile.reduce((acc, point, idx) => {
    const x = getX(point.km);
    const y = getY(point.altitudeM);
    return idx === 0 ? `M ${x},${y}` : `${acc} L ${x},${y}`;
  }, '');

  const areaD = `${pathD} L ${getX(totalDist)},${svgHeight - paddingY} L ${getX(0)},${svgHeight - paddingY} Z`;

  const hoveredPoint: ElevationPoint | null = activeElevationIdx !== null ? trek.elevationProfile[activeElevationIdx] : null;

  return (
    <div className="bg-[#1E2822] text-[#FDFCF7] rounded-2xl p-5 md:p-7 border border-[#2D3633] shadow-xl overflow-hidden">
      {/* Header with Title and Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2D3633]">
        <div>
          <div className="flex items-center gap-2 text-[#A8C69F] text-xs font-semibold tracking-wider uppercase mb-1">
            <Compass className="w-4 h-4" />
            <span>Topographic & Trail Elevation Profile</span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-[#FDFCF7] tracking-tight font-heading">
            {trek.name} Trail Route Map
          </h3>
          <p className="text-[#D1CDC0] text-xs md:text-sm mt-0.5">
            Total Distance: <span className="text-[#FDFCF7] font-medium">{trek.distanceKm} km</span> • Max Altitude: <span className="text-[#A8C69F] font-medium">{trek.maxAltitudeM.toLocaleString()} m ({trek.maxAltitudeFt.toLocaleString()} ft)</span> • Region: <span className="text-[#FDFCF7] font-medium">{trek.region}</span>
          </p>
        </div>

        {/* View toggles */}
        <div className="flex items-center bg-[#2D3633] p-1 rounded-xl border border-[#3E4A46] self-start sm:self-auto text-xs font-medium">
          <button
            id="view-mode-elevation-btn"
            onClick={() => setMapViewMode('elevation')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              mapViewMode === 'elevation'
                ? 'bg-[#4A6741] text-[#FDFCF7] shadow'
                : 'text-[#D1CDC0] hover:text-[#FDFCF7]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Elevation Graph</span>
          </button>
          <button
            id="view-mode-waypoints-btn"
            onClick={() => setMapViewMode('waypoints')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              mapViewMode === 'waypoints'
                ? 'bg-[#4A6741] text-[#FDFCF7] shadow'
                : 'text-[#D1CDC0] hover:text-[#FDFCF7]'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Waypoints ({trek.waypoints.length})</span>
          </button>
          <button
            id="view-mode-schematic-btn"
            onClick={() => setMapViewMode('schematic')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              mapViewMode === 'schematic'
                ? 'bg-[#4A6741] text-[#FDFCF7] shadow'
                : 'text-[#D1CDC0] hover:text-[#FDFCF7]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Topo Scheme</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Elevation Graph */}
      {mapViewMode === 'elevation' && (
        <div className="pt-5">
          <div className="relative w-full overflow-x-auto">
            <div className="min-w-[620px] relative">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-auto select-none"
              >
                <defs>
                  {/* Subtle terrain gradient */}
                  <linearGradient id={`elev-grad-${trek.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4A6741" stopOpacity="0.5" />
                    <stop offset="60%" stopColor="#4A6741" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#4A6741" stopOpacity="0.0" />
                  </linearGradient>

                  {/* Line glow */}
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#A8C69F" floodOpacity="0.6" />
                  </filter>
                </defs>

                {/* Horizontal Altitude Grid Lines */}
                {[0.25, 0.5, 0.75, 1.0].map((ratio, i) => {
                  const altVal = Math.round(minAlt + ratio * (maxAlt - minAlt));
                  const y = getY(altVal);
                  return (
                    <g key={i} className="opacity-25">
                      <line
                        x1={paddingX}
                        y1={y}
                        x2={svgWidth - paddingX}
                        y2={y}
                        stroke="#8B9691"
                        strokeDasharray="4 4"
                        strokeWidth="1"
                      />
                      <text
                        x={paddingX - 8}
                        y={y + 3}
                        fill="#D1CDC0"
                        fontSize="9"
                        textAnchor="end"
                        fontFamily="monospace"
                      >
                        {altVal}m
                      </text>
                    </g>
                  );
                })}

                {/* Filled Area */}
                <path d={areaD} fill={`url(#elev-grad-${trek.id})`} />

                {/* Main Elevation Stroke */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="#A8C69F"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#glow)"
                />

                {/* Data Points on Path */}
                {trek.elevationProfile.map((pt, idx) => {
                  const x = getX(pt.km);
                  const y = getY(pt.altitudeM);
                  const isHovered = activeElevationIdx === idx;
                  const isSummit = pt.stage === 'Summit' || pt.stage === 'Pass';

                  return (
                    <g
                      key={idx}
                      className="cursor-pointer transition-transform duration-200"
                      onMouseEnter={() => setActiveElevationIdx(idx)}
                      onClick={() => setActiveElevationIdx(idx)}
                    >
                      {/* Outer pulse if summit */}
                      {isSummit && (
                        <circle
                          cx={x}
                          cy={y}
                          r={isHovered ? 12 : 8}
                          fill="#A8C69F"
                          opacity="0.3"
                          className="animate-ping"
                        />
                      )}

                      <circle
                        cx={x}
                        cy={y}
                        r={isHovered ? 7 : isSummit ? 6 : 4.5}
                        fill={isSummit ? '#FCD34D' : isHovered ? '#A8C69F' : '#FDFCF7'}
                        stroke="#1E2822"
                        strokeWidth="2"
                      />

                      {/* Label for important points */}
                      <text
                        x={x}
                        y={y - 12}
                        fill={isHovered ? '#A8C69F' : '#E8E4D9'}
                        fontSize="10"
                        fontWeight={isHovered || isSummit ? 'bold' : 'normal'}
                        textAnchor="middle"
                        className="pointer-events-none drop-shadow"
                      >
                        {pt.locationName}
                      </text>

                      {/* Distance marker on x-axis */}
                      <text
                        x={x}
                        y={svgHeight - paddingY + 16}
                        fill="#8B9691"
                        fontSize="9"
                        textAnchor="middle"
                        fontFamily="monospace"
                      >
                        {pt.km}km
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Hovered point details panel */}
          <div className="mt-4 p-4 bg-[#2D3633] rounded-xl border border-[#3E4A46] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            {hoveredPoint ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#4A6741]/30 text-[#A8C69F] flex items-center justify-center font-bold">
                    <Mountain className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-[#FDFCF7] font-semibold text-base">{hoveredPoint.locationName}</h4>
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-[#4A6741]/40 text-[#A8C69F] border border-[#A8C69F]/30">
                        {hoveredPoint.stage}
                      </span>
                    </div>
                    <p className="text-[#D1CDC0] text-xs mt-0.5">{hoveredPoint.description || 'Waypoint landmark on the trail.'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="bg-[#1E2822] px-3 py-1.5 rounded-lg border border-[#3E4A46]">
                    <span className="text-[#8B9691] block text-[10px]">ALTITUDE</span>
                    <span className="text-[#A8C69F] font-bold text-sm">
                      {hoveredPoint.altitudeM.toLocaleString()} m <span className="text-[#8B9691] font-normal">({hoveredPoint.altitudeFt.toLocaleString()} ft)</span>
                    </span>
                  </div>
                  <div className="bg-[#1E2822] px-3 py-1.5 rounded-lg border border-[#3E4A46]">
                    <span className="text-[#8B9691] block text-[10px]">DISTANCE</span>
                    <span className="text-[#FDFCF7] font-bold text-sm">{hoveredPoint.km} km from start</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between w-full text-[#D1CDC0] text-xs">
                <span className="flex items-center gap-2">
                  <Footprints className="w-4 h-4 text-[#A8C69F]" />
                  Hover or click on any elevation point to inspect altitude, distance marker, and landmark description.
                </span>
                <span className="text-[#A8C69F] font-medium">Max: {trek.maxAltitudeFt.toLocaleString()} ft</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Waypoints List View */}
      {mapViewMode === 'waypoints' && (
        <div className="pt-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Waypoints timeline */}
          <div className="lg:col-span-7 space-y-2.5 max-h-[340px] overflow-y-auto pr-2">
            {trek.waypoints.map((wp, idx) => {
              const isSelected = selectedWaypoint?.id === wp.id;
              return (
                <div
                  key={wp.id}
                  id={`waypoint-card-${wp.id}`}
                  onClick={() => setSelectedWaypoint(wp)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#4A6741]/30 border-[#A8C69F] shadow-md text-[#FDFCF7]'
                      : 'bg-[#2D3633]/60 border-[#3E4A46] hover:bg-[#2D3633] text-[#D1CDC0]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                      isSelected ? 'bg-[#4A6741] text-[#FDFCF7]' : 'bg-[#3E4A46] text-[#D1CDC0]'
                    }`}>
                      {idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{wp.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#3E4A46] text-[#D1CDC0] uppercase">
                          Day {wp.dayNumber}
                        </span>
                      </div>
                      <span className="text-[#8B9691] text-xs block truncate max-w-xs">{wp.description}</span>
                    </div>
                  </div>

                  <div className="text-right pl-3">
                    <div className="text-[#A8C69F] font-semibold text-xs">{wp.altitudeM} m</div>
                    <div className="text-[#8B9691] text-[10px]">{wp.distanceFromStartKm} km</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Waypoint Detail Card */}
          <div className="lg:col-span-5 bg-[#2D3633] rounded-xl p-5 border border-[#3E4A46] flex flex-col justify-between">
            {selectedWaypoint ? (
              <>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#4A6741]/40 text-[#A8C69F] border border-[#A8C69F]/30 uppercase tracking-wider">
                      {selectedWaypoint.type} Landmark
                    </span>
                    <span className="text-xs text-[#8B9691]">Day {selectedWaypoint.dayNumber} of {trek.durationDays}</span>
                  </div>
                  <h4 className="text-lg font-bold text-[#FDFCF7] mb-1">{selectedWaypoint.name}</h4>
                  <p className="text-[#D1CDC0] text-xs leading-relaxed mb-4">{selectedWaypoint.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-[#1E2822] p-2.5 rounded-lg border border-[#3E4A46]">
                      <span className="text-[#8B9691] block text-[10px]">ELEVATION</span>
                      <span className="text-[#FDFCF7] font-bold">{selectedWaypoint.altitudeM} m ({Math.round(selectedWaypoint.altitudeM * 3.28084)} ft)</span>
                    </div>
                    <div className="bg-[#1E2822] p-2.5 rounded-lg border border-[#3E4A46]">
                      <span className="text-[#8B9691] block text-[10px]">DISTANCE TRAVELED</span>
                      <span className="text-[#A8C69F] font-bold">{selectedWaypoint.distanceFromStartKm} km</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#3E4A46] text-[11px] text-[#8B9691] flex items-center gap-2">
                  <Navigation className="w-3.5 h-3.5 text-[#A8C69F]" />
                  <span>Trail safety: Always pace with the certified trek leader and drink 3-4L water daily.</span>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-[#8B9691] text-xs">
                Select a waypoint on the left to inspect waypoint specifications.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Schematic Topo Map Mode */}
      {mapViewMode === 'schematic' && (
        <div className="pt-5">
          <div className="bg-[#1E2822] rounded-xl p-5 border border-[#2D3633] relative overflow-hidden">
            {/* Topographic background contours pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#A8C69F_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-[#A8C69F] uppercase tracking-wider flex items-center gap-1.5">
                  <Compass className="w-4 h-4" /> Schematic Trail Flow
                </span>
                <span className="text-xs text-[#8B9691]">Garhwal / Pir Panjal Trail Grid</span>
              </div>

              {/* Waypoints flow connector */}
              <div className="flex flex-wrap items-center gap-3 md:gap-4 py-4">
                {trek.waypoints.map((wp, i) => (
                  <React.Fragment key={wp.id}>
                    <div className="bg-[#2D3633] border border-[#3E4A46] rounded-xl p-3 flex items-center gap-2.5 min-w-[140px] hover:border-[#A8C69F] transition-colors">
                      <div className="w-7 h-7 rounded-lg bg-[#4A6741]/40 text-[#A8C69F] flex items-center justify-center text-xs font-bold">
                        {i === 0 ? <Flag className="w-3.5 h-3.5" /> : i === trek.waypoints.length - 1 ? <Award className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#FDFCF7] truncate max-w-[110px]">{wp.name}</div>
                        <div className="text-[10px] text-[#8B9691]">{wp.altitudeM}m • Day {wp.dayNumber}</div>
                      </div>
                    </div>

                    {i < trek.waypoints.length - 1 && (
                      <div className="hidden sm:flex text-[#A8C69F] font-mono text-sm">
                        →
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-[#2D3633] text-xs">
                <div>
                  <span className="text-[#8B9691] block text-[10px]">BASECAMP</span>
                  <span className="text-[#FDFCF7] font-medium">{trek.baseCamp}</span>
                </div>
                <div>
                  <span className="text-[#8B9691] block text-[10px]">TOTAL ASCENT</span>
                  <span className="text-[#A8C69F] font-medium">+{trek.maxAltitudeM - trek.elevationProfile[0].altitudeM} m</span>
                </div>
                <div>
                  <span className="text-[#8B9691] block text-[10px]">DIFFICULTY GRADE</span>
                  <span className="text-[#FDFCF7] font-medium">{trek.difficulty}</span>
                </div>
                <div>
                  <span className="text-[#8B9691] block text-[10px]">STARTING PRICE</span>
                  <span className="text-[#A8C69F] font-bold">₹{trek.startingPriceINR.toLocaleString('en-IN')} INR</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
