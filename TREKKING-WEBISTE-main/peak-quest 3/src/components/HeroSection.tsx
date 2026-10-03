import React, { useState, useEffect, useCallback } from 'react';
import { DESTINATIONS_DATA } from '../data/destinations';
import { Mountain, MapPin, ShieldCheck, TrendingUp, Sparkles, Calendar, CloudSun, Wind, Droplets, RefreshCw, ArrowRight, Map } from 'lucide-react';

const WEATHER_DESTINATIONS = DESTINATIONS_DATA
  .filter(d => d.featured || d.rating && d.rating >= 4.5)
  .slice(0, 12)
  .map(d => ({ id: d.id, label: d.name, lat: d.lat, lon: d.lon, altitudeM: d.altitudeM || 1000, state: d.state }));

interface WeatherSnippet {
  tempC: number;
  condition: string;
  windSpeedKmh: number;
  humidityPct: number;
  trailSafetyScore: number;
  severity: 'optimal' | 'moderate' | 'caution' | 'hazardous';
  locationName: string;
}

interface HeroSectionProps {
  onSelectState: (state: string) => void;
  selectedState: string;
  onScrollToTreks: () => void;
  totalTreksCount: number;
  searchQuery?: string;
  onOpenWeather?: (trekId?: string) => void;
  onOpenMap?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSelectState,
  selectedState,
  onScrollToTreks,
  totalTreksCount,
  searchQuery = '',
  onOpenWeather,
  onOpenMap,
}) => {
  const [weatherTrekId, setWeatherTrekId] = useState('triund-trek');
  const [weather, setWeather] = useState<WeatherSnippet | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  // Auto-match trek from search query
  useEffect(() => {
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    const match = WEATHER_DESTINATIONS.find((t) => t.label.toLowerCase().includes(q) || t.id.includes(q));
    if (match) setWeatherTrekId(match.id);
  }, [searchQuery]);

  const fetchWeather = useCallback(async (trekId: string) => {
    setWeatherLoading(true);
    try {
      const dest = WEATHER_DESTINATIONS.find(d => d.id === trekId);
      const weatherUrl = dest
        ? `/api/weather?lat=${dest.lat}&lon=${dest.lon}&name=${encodeURIComponent(dest.label)}&altitude=${dest.altitudeM}&region=${encodeURIComponent(dest.state)}`
        : `/api/weather?trekId=${trekId}`;
      const res = await fetch(weatherUrl);
      if (!res.ok) return;
      const data = await res.json();
      setWeather({
        tempC: data.current.tempC,
        condition: data.current.condition,
        windSpeedKmh: data.current.windSpeedKmh,
        humidityPct: data.current.humidityPct,
        trailSafetyScore: data.current.trailSafetyScore,
        severity: data.current.severity,
        locationName: data.locationName,
      });
    } catch { /* silent fail */ }
    finally { setWeatherLoading(false); }
  }, []);

  useEffect(() => { fetchWeather(weatherTrekId); }, [weatherTrekId]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => fetchWeather(weatherTrekId), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [weatherTrekId, fetchWeather]);

  const safetyColor =
    weather?.severity === 'optimal' ? 'text-[#4A6741] bg-[#E8F0E5] border-[#A8C69F]' :
    weather?.severity === 'moderate' ? 'text-amber-700 bg-amber-50 border-amber-300' :
    'text-rose-700 bg-rose-50 border-rose-300';

  return (
    <div className="relative bg-[#1E2822] text-[#FDFCF7] overflow-hidden border-b border-[#E8E4D9]/20">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=85"
          alt="Himalayan mountain peaks"
          className="w-full h-full object-cover object-center opacity-35 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E2822] via-[#1E2822]/70 to-[#1E2822]/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

          {/* Left: Hero Text */}
          <div className="max-w-xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#4A6741]/80 border border-[#A8C69F]/40 backdrop-blur-md text-[#FDFCF7] text-xs font-bold uppercase tracking-wider">
              <Mountain className="w-3.5 h-3.5 text-[#A8C69F]" />
              <span>{selectedState ? `${selectedState} Adventures` : 'All-India Trekking & Fort Discovery'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#FDFCF7] tracking-tight font-heading leading-tight">
              Climb Higher with{' '}
              <span className="text-[#A8C69F] italic font-serif">Peak Quest</span>
            </h1>

            <p className="text-[#D1CDC0] text-sm sm:text-base leading-relaxed">
              Curated Indian trails and historic forts with interactive maps, live weather, and instant bookings for featured expeditions starting from <strong className="text-[#C5DCC0] font-bold">₹5,000 INR</strong>.
            </p>

            {/* Region Selector Pills */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button onClick={() => { onSelectState(''); onScrollToTreks(); }}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md ${selectedState === '' ? 'bg-[#4A6741] text-[#FDFCF7] ring-2 ring-[#A8C69F]' : 'bg-[#2D3633]/80 border border-[#4A6741]/40 text-[#E8E4D9] hover:bg-[#3D5636]'}`}>
                All India ({totalTreksCount})
              </button>
              {['Himachal Pradesh', 'Uttarakhand', 'Maharashtra', 'Rajasthan'].map((state) => <button key={state} onClick={() => { onSelectState(state); onScrollToTreks(); }} className={`px-3 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md ${selectedState === state ? 'bg-[#4A6741] text-white ring-2 ring-[#A8C69F]' : 'bg-[#2D3633]/80 border border-[#4A6741]/40 text-[#E8E4D9] hover:bg-[#3D5636]'}`}>{state}</button>)}
            </div>

            {/* Trust Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#E8E4D9]/20 text-xs">
              <div className="flex items-center gap-2 text-[#E8E4D9]"><ShieldCheck className="w-4 h-4 text-[#A8C69F] shrink-0" /><span>IMF Certified</span></div>
              <div className="flex items-center gap-2 text-[#E8E4D9]"><TrendingUp className="w-4 h-4 text-[#A8C69F] shrink-0" /><span>Trail Maps</span></div>
              <div className="flex items-center gap-2 text-[#E8E4D9]"><Sparkles className="w-4 h-4 text-[#A8C69F] shrink-0" /><span>From ₹5,000</span></div>
              <div className="flex items-center gap-2 text-[#E8E4D9]"><Calendar className="w-4 h-4 text-[#A8C69F] shrink-0" /><span>Instant Confirm</span></div>
            </div>
          </div>

          {/* Right: Live Weather Widget */}
          <div className="bg-[#1E2822]/80 backdrop-blur-xl border border-[#E8E4D9]/20 rounded-3xl p-5 shadow-2xl space-y-4">

            {/* Widget Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#4A6741] flex items-center justify-center">
                  <CloudSun className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm text-white">Live Trek Weather</h3>
                  <p className="text-[10px] text-[#D1CDC0]">Real-time meteorological data</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="flex items-center gap-1 text-[10px] bg-[#4A6741]/40 text-[#86EFAC] px-2 py-0.5 rounded-full font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#86EFAC] animate-ping inline-block" />
                  Live
                </span>
                <button onClick={() => fetchWeather(weatherTrekId)} disabled={weatherLoading}
                  className="p-1.5 text-[#D1CDC0] hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                  <RefreshCw className={`w-3.5 h-3.5 ${weatherLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Trek Pill Selector — horizontally scrollable on mobile */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {WEATHER_DESTINATIONS.map((t) => (
                <button key={t.id} onClick={() => setWeatherTrekId(t.id)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all shrink-0 ${weatherTrekId === t.id ? 'bg-[#4A6741] text-white' : 'bg-white/10 text-[#D1CDC0] hover:bg-white/20'}`}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Weather Data */}
            {weatherLoading && !weather ? (
              <div className="py-6 flex items-center justify-center gap-2 text-[#D1CDC0] text-xs">
                <RefreshCw className="w-4 h-4 animate-spin text-[#4A6741]" />
                <span>Fetching high-altitude data...</span>
              </div>
            ) : weather ? (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-[#A8C69F] font-semibold">{weather.locationName}</div>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-4xl font-black font-heading text-white">{weather.tempC}°</span>
                      <span className="text-sm text-[#D1CDC0]">C</span>
                    </div>
                    <div className="text-xs text-[#D1CDC0] mt-0.5">{weather.condition}</div>
                  </div>
                  <CloudSun className="w-12 h-12 text-amber-400 opacity-80" />
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-white/5 rounded-xl p-2.5 text-center">
                    <Wind className="w-3.5 h-3.5 text-[#86EFAC] mx-auto mb-1" />
                    <div className="font-bold text-white font-mono">{weather.windSpeedKmh}</div>
                    <div className="text-[10px] text-[#D1CDC0]">km/h wind</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-2.5 text-center">
                    <Droplets className="w-3.5 h-3.5 text-[#86EFAC] mx-auto mb-1" />
                    <div className="font-bold text-white font-mono">{weather.humidityPct}%</div>
                    <div className="text-[10px] text-[#D1CDC0]">humidity</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-2.5 text-center">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#86EFAC] mx-auto mb-1" />
                    <div className="font-bold text-white font-mono">{weather.trailSafetyScore}</div>
                    <div className="text-[10px] text-[#D1CDC0]">safety /100</div>
                  </div>
                </div>

                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold ${safetyColor}`}>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Trail Status: {weather.severity.toUpperCase()}
                </div>
              </>
            ) : null}

            {/* CTA buttons */}
            <div className="flex gap-2 pt-1">
              {onOpenWeather && (
                <button onClick={() => onOpenWeather(weatherTrekId)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-xl transition-colors">
                  <CloudSun className="w-3.5 h-3.5" /> Full Forecast <ArrowRight className="w-3 h-3" />
                </button>
              )}
              {onOpenMap && (
                <button onClick={onOpenMap}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold bg-white/10 hover:bg-white/20 text-[#D1CDC0] rounded-xl transition-colors border border-white/10">
                  <Map className="w-3.5 h-3.5" /> View Map
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
