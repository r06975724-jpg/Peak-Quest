import React from 'react';
import { Trek, Destination } from '../types';
import { 
  Mountain, 
  MapPin, 
  Calendar, 
  Star, 
  Compass, 
  Heart, 
  ArrowRight, 
  Footprints,
  ShieldCheck,
  CloudSun,
  Map
} from 'lucide-react';

interface TrekCardProps {
  trek?: Trek;
  destination?: Destination;
  onSelect: (item: any) => void;
  onQuickBook: (item: any) => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onOpenWeather?: (item: any) => void;
  onOpenMap?: (item: any) => void;
}

export const TrekCard: React.FC<TrekCardProps> = ({
  trek,
  destination,
  onSelect,
  onQuickBook,
  isSaved,
  onToggleSave,
  onOpenWeather,
  onOpenMap,
}) => {
  const data = trek || (destination ? {
    id: destination.id,
    name: destination.name,
    region: destination.state as any,
    district: destination.district,
    difficulty: destination.difficulty || 'Moderate',
    coverImage: destination.coverImage,
    galleryImages: destination.galleryImages || [],
    tagline: destination.description.slice(0, 80) + '...',
    highlights: destination.highlights || [],
    maxAltitudeM: destination.altitudeM || 0,
    maxAltitudeFt: Math.round((destination.altitudeM || 0) * 3.28084),
    durationDays: destination.durationDays || 0,
    durationNights: Math.max(0, (destination.durationDays || 1) - 1),
    distanceKm: destination.distanceKm || 0,
    baseCamp: destination.district,
    rating: destination.rating || 0,
    reviewsCount: 0,
    startingPriceINR: 0,
    discountedPriceINR: undefined,
    featured: destination.featured,
    slug: destination.slug,
  } : null) as any;

  if (!data) return null;

  return (
    <div 
      id={`trek-card-${data.id}`}
      className="group bg-white rounded-3xl overflow-hidden border border-[#E8E4D9] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
    >
      {/* Card Media Header */}
      <div className="relative h-60 w-full overflow-hidden bg-[#1E2822]">
        <img
          src={data.coverImage}
          alt={data.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E2822]/90 via-[#1E2822]/30 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#2D4F1E]/80 text-[#FDFCF7] backdrop-blur-md border border-[#A8C69F]/30">
              {data.region}
            </span>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#FDFCF7] shadow-xs ${
              data.difficulty === 'Easy'
                ? 'bg-[#4A6741]'
                : data.difficulty === 'Moderate'
                ? 'bg-[#8B5E3C]'
                : 'bg-[#734B2E]'
            }`}>
              {data.difficulty}
            </span>
            {destination && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                destination.type === 'fort' ? 'bg-amber-700/90 text-white' : 'bg-emerald-700/90 text-white'
              }`}>
                {destination.type === 'fort' ? '🏰 Fort' : '🥾 Trek'}
              </span>
            )}
          </div>

          <button
            id={`save-btn-${data.id}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(destination?.id || data.id);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${
              isSaved
                ? 'bg-white text-[#8B5E3C] shadow-md'
                : 'bg-[#1E2822]/60 text-white hover:bg-[#1E2822]/90'
            }`}
            title={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-[#8B5E3C] text-[#8B5E3C]' : ''}`} />
          </button>
        </div>

        {/* Bottom floating details */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white flex items-end justify-between">
          <div>
            <div className="flex items-center gap-1 text-[#FCD34D] text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-[#FCD34D]" />
              <span>{data.rating}</span>
              <span className="text-[#D1CDC0] font-normal">({data.reviewsCount} reviews)</span>
            </div>
            <div className="text-xs text-[#E8E4D9] mt-0.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#A8C69F]" />
              <span>Base: {data.baseCamp}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-[#D1CDC0] block uppercase font-medium">Altitude</span>
            <span className="text-xs font-bold text-[#A8C69F]">{data.maxAltitudeFt.toLocaleString()} ft</span>
          </div>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs text-[#5C6662] mb-1.5">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#4A6741]" />
              {data.durationDays} Days / {data.durationNights} Nights
            </span>
            <span className="flex items-center gap-1">
              <Footprints className="w-3.5 h-3.5 text-[#8B9691]" />
              {data.distanceKm} km trail
            </span>
          </div>

          <h3 
            onClick={() => onSelect(trek || destination)}
            className="font-heading font-extrabold text-lg sm:text-xl text-[#2D3633] group-hover:text-[#2D4F1E] transition-colors cursor-pointer line-clamp-1"
          >
            {data.name}
          </h3>

          <p className="text-[#5C6662] text-xs line-clamp-2 mt-1 leading-relaxed">
            {data.tagline}
          </p>
        </div>

        {/* Highlights Pills */}
        <div className="flex flex-wrap gap-1.5">
          {data.highlights.slice(0, 2).map((hl: string, i: number) => (
            <span key={i} className="text-[10px] bg-[#F3F1EA] text-[#5C6662] border border-[#E8E4D9] px-2 py-0.5 rounded-md font-medium truncate max-w-full">
              • {hl}
            </span>
          ))}
        </div>

        {/* Card Footer with Price in INR & Actions */}
        <div className="pt-3 border-t border-[#E8E4D9] flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-[#8B9691] uppercase font-semibold block">Booking From</span>
            <div className="flex items-baseline gap-1">
              {data.startingPriceINR > 0 ? (
                <>
                  <span className="font-heading font-extrabold text-xl text-[#2D4F1E]">
                    ₹{(data.discountedPriceINR || data.startingPriceINR).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] font-bold text-[#8B5E3C]">INR</span>
                </>
              ) : (
                <span className="text-[#4A6741] font-bold text-xs">Explore →</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {onOpenWeather && (
              <button
                id={`weather-btn-${data.id}`}
                type="button"
                onClick={() => onOpenWeather(trek || destination)}
                className="p-2.5 rounded-xl border border-[#E8E4D9] text-[#2D3633] hover:bg-[#4A6741]/15 hover:text-[#2D4F1E] hover:border-[#4A6741]/30 transition-colors text-xs font-semibold flex items-center gap-1"
                title="View Live Mountain Weather"
              >
                <CloudSun className="w-4 h-4 text-[#4A6741]" />
                <span className="hidden sm:inline">Weather</span>
              </button>
            )}

            {onOpenMap && (
              <button
                id={`map-btn-${data.id}`}
                type="button"
                onClick={() => onOpenMap(trek || destination)}
                className="p-2.5 rounded-xl border border-[#E8E4D9] text-[#2D3633] hover:bg-[#4A6741]/15 hover:text-[#2D4F1E] hover:border-[#4A6741]/30 transition-colors text-xs font-semibold flex items-center gap-1"
                title="Get Directions to Basecamp"
              >
                <Map className="w-4 h-4 text-[#4A6741]" />
                <span className="hidden sm:inline">Directions</span>
              </button>
            )}

            <button
              id={`view-trail-map-btn-${data.id}`}
              type="button"
              onClick={() => onSelect(trek || destination)}
              className="p-2.5 rounded-xl border border-[#E8E4D9] text-[#2D3633] hover:bg-[#F3F1EA] hover:text-[#2D4F1E] transition-colors text-xs font-semibold flex items-center gap-1"
              title="View Interactive Trail Map & Itinerary"
            >
              <Compass className="w-4 h-4 text-[#4A6741]" />
              <span className="hidden sm:inline">Map</span>
            </button>

            {data.startingPriceINR > 0 && (
              <button
                id={`book-trek-btn-${data.id}`}
                type="button"
                onClick={() => onQuickBook(trek || destination)}
                className="bg-[#8B5E3C] hover:bg-[#734B2E] text-white font-bold px-3.5 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-1 shadow-xs hover:shadow-md"
              >
                <span>Book</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
