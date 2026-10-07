import React from 'react';
import { Destination } from '../types';
import { X, MapPin, Mountain, CloudSun, Navigation, Calendar, Footprints, Star } from 'lucide-react';

interface DestinationDetailModalProps {
  destination: Destination;
  isOpen: boolean;
  onClose: () => void;
  onOpenWeather: (destination: Destination) => void;
  onOpenMap: (destination: Destination) => void;
}

export const DestinationDetailModal: React.FC<DestinationDetailModalProps> = ({
  destination,
  isOpen,
  onClose,
  onOpenWeather,
  onOpenMap,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#1E2822]/80 backdrop-blur-sm p-3 sm:p-6 flex items-center justify-center overflow-y-auto">
      <div className="w-full max-w-3xl max-h-[calc(100dvh-2rem)] overflow-y-auto bg-[#FDFCF7] rounded-3xl shadow-2xl border border-[#E8E4D9] my-auto">
        <div className="relative h-56 sm:h-72 md:h-80">
          <img
            src={destination.coverImage}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E2822] via-[#1E2822]/30 to-transparent" />
          
          <button
            id="close-destination-detail-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-black/40 hover:bg-black/60 text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-6 sm:right-6 text-white">
            <span className="text-xs font-bold uppercase tracking-wider bg-[#4A6741] px-2.5 py-1 rounded-full inline-block">
              {destination.type === 'fort' ? '🏰 Fort' : '🥾 Trek'}
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold mt-2 leading-tight">
              {destination.name}
            </h2>
            <p className="text-xs sm:text-sm flex gap-1 items-center mt-1 text-[#D1CDC0]">
              <MapPin className="w-3.5 h-3.5 text-[#A8C69F] shrink-0" />
              <span>{destination.district}, {destination.state}</span>
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-5">
          <p className="text-xs sm:text-sm leading-relaxed text-[#5C6662]">
            {destination.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-xs">
            {destination.altitudeM && (
              <Metric
                icon={<Mountain className="w-4 h-4" />}
                label="Altitude"
                value={`${destination.altitudeM.toLocaleString()} m`}
              />
            )}
            {destination.durationDays && (
              <Metric
                icon={<Calendar className="w-4 h-4" />}
                label="Duration"
                value={`${destination.durationDays} day${destination.durationDays > 1 ? 's' : ''}`}
              />
            )}
            {destination.distanceKm && (
              <Metric
                icon={<Footprints className="w-4 h-4" />}
                label="Distance"
                value={`${destination.distanceKm} km`}
              />
            )}
            {destination.rating && (
              <Metric
                icon={<Star className="w-4 h-4 text-amber-500 fill-amber-500" />}
                label="Rating"
                value={`${destination.rating} / 5`}
              />
            )}
          </div>

          {!!destination.highlights?.length && (
            <div>
              <h3 className="font-heading font-bold text-sm mb-2 text-[#2D3633]">Highlights</h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {destination.highlights.map((h) => (
                  <span
                    key={h}
                    className="text-xs bg-[#F3F1EA] border border-[#E8E4D9] rounded-lg px-2.5 py-1 text-[#5C6662]"
                  >
                    • {h}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2">
            <button
              id="destination-live-weather-btn"
              onClick={() => onOpenWeather(destination)}
              className="flex-1 py-3 px-4 rounded-xl border border-[#4A6741]/30 hover:bg-[#4A6741]/10 text-[#2D4F1E] font-bold text-xs flex gap-2 items-center justify-center transition-colors min-h-[44px]"
            >
              <CloudSun className="w-4 h-4 text-[#4A6741]" />
              <span>Live Mountain Weather</span>
            </button>
            <button
              id="destination-get-directions-btn"
              onClick={() => onOpenMap(destination)}
              className="flex-1 py-3 px-4 rounded-xl bg-[#4A6741] hover:bg-[#3D5636] text-white font-bold text-xs flex gap-2 items-center justify-center transition-colors shadow-sm min-h-[44px]"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Directions & Route</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Metric = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="bg-[#F3F1EA] rounded-xl p-3 text-[#5C6662]">
    <div className="text-[#4A6741] mb-1">{icon}</div>
    <div className="text-[10px] uppercase font-bold tracking-wider text-[#8B9691]">{label}</div>
    <div className="font-bold text-[#2D3633] text-xs sm:text-sm mt-0.5">{value}</div>
  </div>
);
