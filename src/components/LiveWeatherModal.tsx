import React, { useState, useEffect, useMemo } from 'react';
import { 
  CloudSun, 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudFog, 
  CloudDrizzle, 
  Snowflake, 
  CloudLightning, 
  Wind, 
  Droplets, 
  Gauge, 
  Compass, 
  ShieldAlert, 
  ShieldCheck, 
  RefreshCw, 
  X, 
  Sparkles, 
  Mountain, 
  ArrowRight,
  ExternalLink,
  Thermometer,
  Calendar,
  Layers
} from 'lucide-react';
import Markdown from 'react-markdown';
import { Trek, LiveWeatherReport, Destination } from '../types';
import { DESTINATIONS_DATA } from '../data/destinations';
import { fetchLiveWeather } from '../lib/weather';

interface LiveWeatherModalProps {
  isOpen: boolean;
  onClose: () => void;
  treks: Trek[];
  destinations?: Destination[];
  initialTrekId?: string;
  onSelectTrek: (destination: Destination) => void;
  onBookTrek: (trek: Trek) => void;
}

export const LiveWeatherModal: React.FC<LiveWeatherModalProps> = ({
  isOpen,
  onClose,
  treks,
  destinations,
  initialTrekId,
  onSelectTrek,
  onBookTrek,
}) => {
  const [selectedTrekId, setSelectedTrekId] = useState<string>(initialTrekId || treks[0]?.id || 'triund-trek');
  const [weatherData, setWeatherData] = useState<LiveWeatherReport | null>(null);
  const [advisory, setAdvisory] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingAdvisory, setIsLoadingAdvisory] = useState<boolean>(false);
  const [regionFilter, setRegionFilter] = useState<string>('All');

  const activeTrek = treks.find((t) => t.id === selectedTrekId) || treks[0];

  const allLocations = useMemo(() => {
    const trekLocs = treks.map(t => ({
      id: t.id, name: t.name, state: t.region || t.state || '', lat: 0, lon: 0, altitudeM: t.maxAltitudeM,
    }));
    const destLocs = (destinations || DESTINATIONS_DATA).map(d => ({
      id: d.id, name: d.name, state: d.state, lat: d.lat, lon: d.lon, altitudeM: d.altitudeM || 1000,
    }));
    const map = new Map<string, typeof trekLocs[0]>();
    destLocs.forEach(d => map.set(d.id, d));
    trekLocs.forEach(t => { if (!map.has(t.id)) map.set(t.id, t); });
    return Array.from(map.values());
  }, [treks, destinations]);

  const availableStates = useMemo(() => {
    const states = [...new Set(allLocations.map(l => l.state).filter(Boolean))];
    return ['All', ...states.sort()];
  }, [allLocations]);

  useEffect(() => {
    if (initialTrekId) {
      setSelectedTrekId(initialTrekId);
    }
  }, [initialTrekId]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchWeather = async () => {
      setIsLoading(true);
      try {
        const loc = allLocations.find(l => l.id === selectedTrekId);
        const data = await fetchLiveWeather({
          lat: loc?.lat,
          lon: loc?.lon,
          name: loc?.name || 'Selected Destination',
          altitudeM: loc?.altitudeM || 1000,
          region: loc?.state || 'India',
          trekId: selectedTrekId,
        });
        setWeatherData(data);

        // Fetch AI Advisory
        fetchAdvisory(data);
      } catch (err) {
        console.error('Weather fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
  }, [selectedTrekId, isOpen, allLocations]);

  const fetchAdvisory = async (data: LiveWeatherReport) => {
    setIsLoadingAdvisory(true);
    try {
      const res = await fetch('/api/weather/advisory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trekId: data.trekId,
          locationName: data.locationName,
          region: data.region,
          baseCamp: data.baseCamp,
          currentTemp: data.current.tempC,
          weatherCondition: data.current.condition,
          windSpeed: data.current.windSpeedKmh,
          altitudeM: data.altitudeM,
        }),
      });
      if (res.ok) {
        const resJson = await res.json();
        setAdvisory(resJson.advisory);
      }
    } catch (err) {
      console.error('Advisory error:', err);
    } finally {
      setIsLoadingAdvisory(false);
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const loc = allLocations.find(l => l.id === selectedTrekId);
      const data = await fetchLiveWeather({
        lat: loc?.lat,
        lon: loc?.lon,
        name: loc?.name || 'Selected Destination',
        altitudeM: loc?.altitudeM || 1000,
        region: loc?.state || 'India',
        trekId: selectedTrekId,
      });
      setWeatherData(data);
      fetchAdvisory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const filteredLocations = (regionFilter === 'All'
    ? allLocations
    : allLocations.filter((location) => location.state === regionFilter)).filter(location => location.lat !== 0);

  const getWeatherIcon = (iconName: string, className = 'w-6 h-6') => {
    switch (iconName) {
      case 'Sun':
        return <Sun className={`${className} text-amber-500`} />;
      case 'CloudSun':
        return <CloudSun className={`${className} text-amber-400`} />;
      case 'Cloud':
        return <Cloud className={`${className} text-stone-400`} />;
      case 'CloudFog':
        return <CloudFog className={`${className} text-stone-400`} />;
      case 'CloudDrizzle':
        return <CloudDrizzle className={`${className} text-sky-400`} />;
      case 'CloudRain':
        return <CloudRain className={`${className} text-blue-500`} />;
      case 'Snowflake':
        return <Snowflake className={`${className} text-cyan-300 animate-pulse`} />;
      case 'CloudLightning':
        return <CloudLightning className={`${className} text-amber-400 animate-bounce`} />;
      default:
        return <CloudSun className={`${className} text-amber-400`} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E2822]/80 backdrop-blur-sm p-3 sm:p-5 overflow-y-auto">
      <div 
        id="live-weather-modal-content"
        className="bg-[#FDFCF7] text-[#2D3633] w-full max-w-4xl rounded-3xl shadow-2xl border border-[#E8E4D9] overflow-hidden my-auto flex flex-col max-h-[calc(100dvh-2rem)]"
      >
        {/* Header */}
        <div className="bg-[#1E2822] text-[#FDFCF7] p-4 sm:p-6 flex items-start sm:items-center justify-between border-b border-[#2D3633] gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#4A6741] flex items-center justify-center text-white shadow-inner">
              <CloudSun className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-lg sm:text-xl text-white">
                  India Live Weather Radar
                </h3>
                <span className="flex items-center gap-1 text-[10px] bg-[#4A6741]/50 text-[#86EFAC] px-2 py-0.5 rounded-full font-mono font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#86EFAC] animate-ping" />
                  Live Satellite
                </span>
              </div>
              <p className="text-xs text-[#D1CDC0] mt-0.5">
                Real-time readings and trail safety alerts for destinations across India
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="refresh-live-weather-btn"
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-2 text-[#D1CDC0] hover:text-white hover:bg-white/10 rounded-xl transition-colors flex items-center gap-1 text-xs"
              title="Refresh Meteorological Readings"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              id="close-live-weather-btn"
              onClick={onClose}
              className="p-2 text-[#D1CDC0] hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Region & Trek Selector Bar */}
        <div className="bg-[#F3F1EA] border-b border-[#E8E4D9] p-3 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
          {/* Region Tabs */}
          <select value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)} className="bg-white border border-[#E8E4D9] rounded-xl px-3 py-1.5 text-xs font-semibold text-[#2D3633] focus:outline-none min-w-[140px]">
            {availableStates.map(s => <option key={s} value={s}>{s === 'All' ? '🇮🇳 All India' : s}</option>)}
          </select>

          {/* Trek Dropdown / Tabs */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
            {filteredLocations.map((t) => {
              const isSelected = t.id === selectedTrekId;
              return (
                <button
                  key={t.id}
                  id={`select-weather-trek-${t.id}`}
                  onClick={() => setSelectedTrekId(t.id)}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 border ${
                    isSelected
                      ? 'bg-[#1E2822] text-white border-[#1E2822] shadow-xs'
                      : 'bg-white text-[#2D3633] border-[#E8E4D9] hover:border-[#4A6741]'
                  }`}
                >
                  {t.name.split(' ')[0]} {t.name.split(' ')[1] || ''}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {isLoading && !weatherData ? (
            <div className="py-20 text-center space-y-3 text-[#5C6662]">
              <RefreshCw className="w-8 h-8 text-[#4A6741] animate-spin mx-auto" />
              <p className="text-sm font-medium">Fetching high-altitude meteorological data...</p>
            </div>
          ) : weatherData ? (
            <>
              {/* Main Weather Hero Card */}
              <div className="bg-[#1E2822] text-[#FDFCF7] rounded-3xl p-5 sm:p-6 shadow-md border border-[#2D3633] relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-radial from-[#4A6741]/30 to-transparent blur-2xl pointer-events-none" />

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-[#86EFAC] font-semibold uppercase tracking-wider">
                        {weatherData.region} • Basecamp: {weatherData.baseCamp}
                      </span>
                      <span className="text-[11px] text-[#D1CDC0]">• Updated {weatherData.lastUpdated}</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
                      {weatherData.locationName}
                    </h2>

                    <div className="flex items-center gap-3 pt-1">
                      <span className="inline-flex items-center gap-1.5 bg-white/10 text-white text-xs px-2.5 py-1 rounded-lg border border-white/10 font-mono">
                        <Mountain className="w-3.5 h-3.5 text-[#86EFAC]" />
                        Summit: {weatherData.altitudeM.toLocaleString()} m
                      </span>

                      <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-bold ${
                        weatherData.current.severity === 'optimal'
                          ? 'bg-[#4A6741]/40 text-[#86EFAC] border border-[#4A6741]'
                          : weatherData.current.severity === 'moderate'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}>
                        {weatherData.current.severity === 'optimal' ? (
                          <ShieldCheck className="w-3.5 h-3.5" />
                        ) : (
                          <ShieldAlert className="w-3.5 h-3.5" />
                        )}
                        Trail Safety: {weatherData.current.trailSafetyScore}/100 ({weatherData.current.severity.toUpperCase()})
                      </span>
                    </div>
                  </div>

                  {/* Temperature Display */}
                  <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl">
                    <div className="p-3 rounded-2xl bg-white/10">
                      {getWeatherIcon(weatherData.current.icon, 'w-10 h-10')}
                    </div>
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl sm:text-5xl font-black font-heading text-white">
                          {weatherData.current.tempC}°
                        </span>
                        <span className="text-sm text-[#D1CDC0] font-mono">C</span>
                      </div>
                      <p className="text-xs text-[#D1CDC0] font-medium mt-0.5">
                        {weatherData.current.condition}
                      </p>
                      <p className="text-[11px] text-[#86EFAC] font-mono">
                        Feels like {weatherData.current.feelsLikeC}°C
                      </p>
                    </div>
                  </div>
                </div>

                {/* Altitude Comparison Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 mt-5 border-t border-white/10 text-xs">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <div className="flex items-center gap-1.5 text-[#D1CDC0] mb-1">
                      <Thermometer className="w-3.5 h-3.5 text-[#86EFAC]" />
                      <span>Summit Push Temp</span>
                    </div>
                    <span className="text-base font-bold font-mono text-white">
                      {weatherData.current.summitTempEstC}°C
                    </span>
                    <span className="text-[10px] text-[#D1CDC0] block">At {weatherData.altitudeM}m pass</span>
                  </div>

                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <div className="flex items-center gap-1.5 text-[#D1CDC0] mb-1">
                      <Wind className="w-3.5 h-3.5 text-[#86EFAC]" />
                      <span>Ridge Wind Speed</span>
                    </div>
                    <span className="text-base font-bold font-mono text-white">
                      {weatherData.current.summitWindEstKmh} km/h
                    </span>
                    <span className="text-[10px] text-[#D1CDC0] block">Basecamp: {weatherData.current.windSpeedKmh} km/h</span>
                  </div>

                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <div className="flex items-center gap-1.5 text-[#D1CDC0] mb-1">
                      <Droplets className="w-3.5 h-3.5 text-[#86EFAC]" />
                      <span>Humidity & Precip</span>
                    </div>
                    <span className="text-base font-bold font-mono text-white">
                      {weatherData.current.humidityPct}%
                    </span>
                    <span className="text-[10px] text-[#D1CDC0] block">{weatherData.current.precipitationMm} mm rain/snow</span>
                  </div>

                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <div className="flex items-center gap-1.5 text-[#D1CDC0] mb-1">
                      <Gauge className="w-3.5 h-3.5 text-[#86EFAC]" />
                      <span>Barometric Pressure</span>
                    </div>
                    <span className="text-base font-bold font-mono text-white">
                      {weatherData.current.surfacePressureHpa} hPa
                    </span>
                    <span className="text-[10px] text-[#D1CDC0] block">High-altitude zone</span>
                  </div>
                </div>
              </div>

              {/* 5-Day Mountain Weather Forecast */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading font-bold text-sm sm:text-base text-[#2D3633] flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#4A6741]" />
                    5-Day High-Altitude Trail Forecast
                  </h4>
                  <span className="text-xs text-[#5C6662]">Updated daily via meteorological satellites</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {weatherData.forecast.map((day, idx) => (
                    <div
                      key={day.date}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        idx === 0
                          ? 'bg-[#F3F1EA] border-[#4A6741] shadow-xs'
                          : 'bg-white border-[#E8E4D9] hover:border-[#4A6741]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-xs text-[#2D3633]">
                          {idx === 0 ? 'Today' : day.dayName}
                        </span>
                        <span className="text-[10px] text-[#8B9691]">
                          {new Date(day.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      </div>

                      <div className="my-2 flex items-center justify-center">
                        {getWeatherIcon(day.icon, 'w-8 h-8')}
                      </div>

                      <div className="text-center space-y-1">
                        <div className="flex items-center justify-center gap-1.5 font-mono text-xs">
                          <span className="font-bold text-[#2D3633]">{day.maxTempC}°</span>
                          <span className="text-[#8B9691]">/</span>
                          <span className="text-[#5C6662]">{day.minTempC}°</span>
                        </div>
                        <p className="text-[10px] text-[#5C6662] truncate" title={day.condition}>
                          {day.condition}
                        </p>
                        <div className="flex items-center justify-center gap-1 text-[10px] text-[#8B5E3C] font-mono font-medium">
                          <Droplets className="w-3 h-3" />
                          <span>{day.precipProbability}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI High-Altitude Safety & Weather Advisory */}
              <div className="bg-[#F3F1EA] rounded-3xl p-5 border border-[#E8E4D9] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#4A6741] text-white flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-sm text-[#2D3633]">
                        AI High-Altitude Trail Weather Bulletin
                      </h4>
                      <p className="text-[11px] text-[#5C6662]">
                        Meteorological safety analysis powered by OpenRouter AI
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => fetchAdvisory(weatherData)}
                    disabled={isLoadingAdvisory}
                    className="text-xs text-[#4A6741] hover:text-[#3D5636] font-bold flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#4A6741]/20 hover:bg-[#4A6741]/10 transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAdvisory ? 'animate-spin' : ''}`} />
                    <span>Re-analyze</span>
                  </button>
                </div>

                {isLoadingAdvisory ? (
                  <div className="py-6 flex items-center justify-center gap-2 text-xs text-[#5C6662]">
                    <Sparkles className="w-4 h-4 text-[#4A6741] animate-spin" />
                    <span>Analyzing high-altitude summit conditions & gear requirements...</span>
                  </div>
                ) : (
                  <div className="prose prose-sm max-w-none text-[#2D3633] text-xs sm:text-sm bg-white p-4 rounded-2xl border border-[#E8E4D9] leading-relaxed">
                    <Markdown>{advisory}</Markdown>
                  </div>
                )}
              </div>

              {/* Quick Actions for active trek */}
              {activeTrek && (
                <div className="bg-[#FDFCF7] border border-[#E8E4D9] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={activeTrek.coverImage}
                      alt={activeTrek.name}
                      className="w-12 h-12 rounded-xl object-cover border border-[#E8E4D9]"
                    />
                    <div>
                      <h5 className="font-bold text-sm text-[#2D3633]">{activeTrek.name}</h5>
                      <span className="text-xs text-[#5C6662]">
                        ₹{activeTrek.startingPriceINR.toLocaleString('en-IN')} INR • {activeTrek.durationDays} Days • {activeTrek.difficulty}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => {
                        const destination = (destinations || DESTINATIONS_DATA).find(d => d.id === selectedTrekId || d.linkedTrekId === selectedTrekId);
                        if (destination) onSelectTrek(destination);
                        onClose();
                      }}
                      className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold text-[#2D3633] bg-white hover:bg-[#F3F1EA] border border-[#E8E4D9] rounded-xl transition-colors"
                    >
                      View Trail Profile
                    </button>
                    <button
                      onClick={() => {
                        onBookTrek(activeTrek);
                        onClose();
                      }}
                      className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold text-white bg-[#8B5E3C] hover:bg-[#734B2E] rounded-xl transition-colors shadow-xs"
                    >
                      Book Expedition
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="py-16 text-center space-y-4">
              <CloudSun className="w-12 h-12 text-[#4A6741] mx-auto opacity-70" />
              <div>
                <p className="font-bold text-sm text-[#2D3633]">Live Satellite Syncing</p>
                <p className="text-xs text-[#5C6662] mt-1">Connecting to mountain meteorological stations...</p>
              </div>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-xl text-xs font-bold transition-colors shadow-sm inline-flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sync Mountain Weather</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
