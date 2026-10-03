import React, { useState } from 'react';
import { Trek, Review, UserProfile } from '../types';
import { TrailMapViewer } from './TrailMapViewer';
import { ReviewsSection } from './ReviewsSection';
import { 
  X, 
  MapPin, 
  Calendar, 
  Clock, 
  Mountain, 
  ShieldCheck, 
  TrendingUp, 
  Star, 
  Compass, 
  ChevronRight, 
  Check, 
  Heart, 
  Share2, 
  AlertCircle, 
  Thermometer,
  Layers,
  Award,
  Footprints,
  Info,
  CloudSun,
  Map
} from 'lucide-react';

interface TrekDetailModalProps {
  trek: Trek | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: (trek: Trek) => void;
  reviews: Review[];
  onAddReview: (review: Review) => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  isSaved: boolean;
  onToggleSave: (trekId: string) => void;
  onOpenLiveWeather?: (trek: Trek) => void;
  onOpenMap?: (trek: Trek) => void;
}

export const TrekDetailModal: React.FC<TrekDetailModalProps> = ({
  trek,
  isOpen,
  onClose,
  onOpenBooking,
  reviews,
  onAddReview,
  currentUser,
  onOpenAuth,
  isSaved,
  onToggleSave,
  onOpenLiveWeather,
  onOpenMap,
}) => {
  if (!isOpen || !trek) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'trailmap' | 'itinerary' | 'gear' | 'reviews'>('overview');
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  const [checkedGear, setCheckedGear] = useState<Record<string, boolean>>({});
  const [copyFeedback, setCopyFeedback] = useState(false);

  const images = [trek.coverImage, ...trek.galleryImages];

  const handleToggleGearCheck = (item: string) => {
    setCheckedGear((prev) => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Peak Quest - ${trek.name}`,
        text: `${trek.tagline} in ${trek.region} starting from ₹${trek.startingPriceINR} INR.`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-0 md:p-6 bg-[#1E2822]/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#FDFCF7] text-[#2D3633] md:rounded-3xl shadow-2xl border border-[#E8E4D9] overflow-hidden min-h-screen md:min-h-0 md:max-h-[92vh] flex flex-col">
        
        {/* Sticky Top Header Bar */}
        <div className="bg-[#1E2822] text-[#FDFCF7] px-5 py-3.5 flex items-center justify-between border-b border-[#E8E4D9]/20 shrink-0 z-20">
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-0.5 rounded-full bg-[#4A6741]/80 text-[#FDFCF7] font-bold border border-[#A8C69F]/40">
              {trek.region}
            </span>
            <span className="text-[#8B9691]">•</span>
            <span className="text-[#D1CDC0] font-medium">{trek.district} District</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="save-trek-detail-btn"
              onClick={() => onToggleSave(trek.id)}
              className={`p-2 rounded-full transition-colors ${
                isSaved ? 'text-[#8B5E3C] bg-white/20' : 'text-[#D1CDC0] hover:text-white hover:bg-white/10'
              }`}
              title={isSaved ? 'Saved to wishlist' : 'Save trek'}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-[#8B5E3C] text-[#8B5E3C]' : ''}`} />
            </button>

            <button
              id="share-trek-detail-btn"
              onClick={handleShare}
              className="p-2 rounded-full text-[#D1CDC0] hover:text-white hover:bg-white/10 transition-colors"
              title="Share trek"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {copyFeedback && (
              <span className="text-[11px] text-[#A8C69F] font-semibold animate-fade-in">
                Link Copied!
              </span>
            )}

            <button
              id="close-trek-detail-btn"
              onClick={onClose}
              className="p-2 rounded-full text-[#D1CDC0] hover:text-white hover:bg-white/10 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Container */}
        <div className="flex-1 overflow-y-auto">
          {/* Hero Media Section */}
          <div className="relative bg-[#1E2822]">
            <div className="h-64 sm:h-80 md:h-96 w-full relative overflow-hidden">
              <img
                src={images[activeImageIdx] || trek.coverImage}
                alt={trek.name}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E2822] via-[#1E2822]/40 to-transparent" />
              
              {/* Floating Hero Content */}
              <div className="absolute bottom-4 left-5 right-5 sm:bottom-6 sm:left-8 sm:right-8">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold text-[#FDFCF7] uppercase tracking-wider ${
                    trek.difficulty === 'Easy'
                      ? 'bg-[#4A6741]'
                      : trek.difficulty === 'Moderate'
                      ? 'bg-[#8B5E3C]'
                      : 'bg-[#734B2E]'
                  }`}>
                    {trek.difficulty} Grade
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/20 text-[#FDFCF7] backdrop-blur-sm">
                    {trek.durationDays} Days / {trek.durationNights} Nights
                  </span>
                  <div className="flex items-center gap-1 text-[#FCD34D] text-xs font-bold bg-[#1E2822]/80 px-2 py-0.5 rounded-full border border-white/10">
                    <Star className="w-3.5 h-3.5 fill-[#FCD34D]" />
                    <span>{trek.rating}</span>
                    <span className="text-[#D1CDC0] font-normal">({trek.reviewsCount})</span>
                  </div>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold text-[#FDFCF7] tracking-tight font-heading">
                  {trek.name}
                </h1>
                <p className="text-[#D1CDC0] text-xs sm:text-sm mt-1 max-w-2xl">
                  {trek.tagline}
                </p>
              </div>
            </div>

            {/* Thumbnail switcher */}
            {images.length > 1 && (
              <div className="flex gap-2 p-3 bg-[#1E2822] border-t border-[#E8E4D9]/20 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIdx(i)}
                    className={`h-12 w-20 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                      activeImageIdx === i ? 'border-[#A8C69F] opacity-100 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Specifications Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-[#F3F1EA] border-b border-[#E8E4D9] text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#E8F0E5] text-[#2D4F1E] flex items-center justify-center shrink-0">
                <Mountain className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[#5C6662] block text-[10px] uppercase font-bold tracking-wider">MAX ALTITUDE</span>
                <span className="font-bold text-[#2D3633]">{trek.maxAltitudeM.toLocaleString()} m ({trek.maxAltitudeFt.toLocaleString()} ft)</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#E8F0E5] text-[#2D4F1E] flex items-center justify-center shrink-0">
                <Footprints className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[#5C6662] block text-[10px] uppercase font-bold tracking-wider">TREK DISTANCE</span>
                <span className="font-bold text-[#2D3633]">{trek.distanceKm} Kilometers</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#E8F0E5] text-[#2D4F1E] flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[#5C6662] block text-[10px] uppercase font-bold tracking-wider">BEST SEASONS</span>
                <span className="font-bold text-[#2D3633]">{trek.bestSeasons.join(', ')}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#E8F0E5] text-[#2D4F1E] flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[#5C6662] block text-[10px] uppercase font-bold tracking-wider">BASE CAMP</span>
                <span className="font-bold text-[#2D3633]">{trek.baseCamp}</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-[#E8E4D9] bg-[#FDFCF7] sticky top-0 z-10 overflow-x-auto px-5">
            {[
              { id: 'overview', label: 'Overview & Highlights', icon: Info },
              { id: 'trailmap', label: 'Trail Map & Elevation', icon: Compass },
              { id: 'itinerary', label: 'Day-by-Day Itinerary', icon: Calendar },
              { id: 'gear', label: 'Inclusions & Gear', icon: ShieldCheck },
              { id: 'reviews', label: `Hiker Reviews (${trek.reviewsCount})`, icon: Star }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-btn-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-3.5 px-4 font-bold text-xs sm:text-sm whitespace-nowrap transition-all border-b-2 flex items-center gap-2 ${
                    isActive
                      ? 'border-[#4A6741] text-[#2D4F1E] bg-[#E8F0E5]/50'
                      : 'border-transparent text-[#5C6662] hover:text-[#2D3633] hover:bg-[#F3F1EA]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#4A6741]' : 'text-[#8B9691]'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Panels */}
          <div className="p-5 sm:p-8 bg-[#FDFCF7]">
            {/* 1. OVERVIEW & HIGHLIGHTS */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-[#2D3633] font-heading mb-2">Expedition Summary</h3>
                  <p className="text-[#5C6662] text-sm leading-relaxed">{trek.overview}</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#2D3633] font-heading mb-3">Key Highlights</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {trek.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F3F1EA] border border-[#E8E4D9]">
                        <div className="w-6 h-6 rounded-full bg-[#4A6741] text-[#FDFCF7] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                          ✓
                        </div>
                        <span className="text-xs sm:text-sm text-[#2D3633] font-medium">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weather & Fitness Requirement */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#F3F1EA] border border-[#E8E4D9]">
                    <div className="flex items-center gap-2 font-bold text-sm text-[#2D3633] mb-1">
                      <Thermometer className="w-4 h-4 text-[#4A6741]" />
                      <span>Temperature Range</span>
                    </div>
                    <p className="text-xs text-[#5C6662]">{trek.temperatureRange}</p>
                    <div className="mt-2 text-[11px] text-[#8B9691]">
                      Best months: <span className="font-semibold text-[#2D3633]">{trek.bestMonths.join(', ')}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F3F1EA] border border-[#E8E4D9]">
                    <div className="flex items-center gap-2 font-bold text-sm text-[#2D3633] mb-1">
                      <TrendingUp className="w-4 h-4 text-[#4A6741]" />
                      <span>Fitness Level Needed</span>
                    </div>
                    <p className="text-xs text-[#5C6662]">{trek.fitnessRequirement}</p>
                  </div>
                </div>
              </div>
            )}

            {/* 2. TRAIL MAP & ELEVATION PROFILE */}
            {activeTab === 'trailmap' && (
              <div>
                <TrailMapViewer trek={trek} />
              </div>
            )}

            {/* 3. DAY-BY-DAY ITINERARY */}
            {activeTab === 'itinerary' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#2D3633] font-heading">
                    {trek.durationDays}-Day Expedition Schedule
                  </h3>
                  <span className="text-xs text-[#5C6662] font-medium">All timings approximate based on group pace</span>
                </div>

                <div className="space-y-4">
                  {trek.itinerary.map((plan) => (
                    <div
                      key={plan.day}
                      className="p-5 rounded-2xl bg-white border border-[#E8E4D9] shadow-xs space-y-2.5 relative pl-6 border-l-4 border-l-[#4A6741]"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#E8F0E5] text-[#2D4F1E] uppercase tracking-wider">
                            Day {plan.day}
                          </span>
                          <h4 className="font-bold text-[#2D3633] text-sm sm:text-base">{plan.title}</h4>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-[#5C6662]">
                          {plan.distanceKm > 0 && <span>{plan.distanceKm} km</span>}
                          <span>{plan.durationHours}</span>
                          <span className="text-[#2D4F1E] font-semibold">{plan.altitudeM} m</span>
                        </div>
                      </div>

                      <p className="text-[#5C6662] text-xs sm:text-sm leading-relaxed">{plan.description}</p>

                      <div className="pt-2 border-t border-[#E8E4D9] flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="text-[#5C6662]">
                          Overnight: <strong className="text-[#2D3633]">{plan.campSite}</strong>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {plan.highlights.map((h, hi) => (
                            <span key={hi} className="text-[10px] bg-[#F3F1EA] text-[#5C6662] border border-[#E8E4D9] px-2 py-0.5 rounded-full font-medium">
                              ★ {h}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. GEAR & INCLUSIONS */}
            {activeTab === 'gear' && (
              <div className="space-y-6">
                {/* Inclusions & Exclusions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#E8F0E5]/60 p-5 rounded-2xl border border-[#C5DCC0] space-y-3">
                    <h4 className="font-bold text-[#2D4F1E] text-sm flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#4A6741]" />
                      <span>What's Included in Booking</span>
                    </h4>
                    <ul className="space-y-2 text-xs text-[#2D3633]">
                      {trek.inclusions.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-[#4A6741] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-[#FDF3F2] p-5 rounded-2xl border border-[#F5D5D3] space-y-3">
                    <h4 className="font-bold text-[#8B3A36] text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-[#C2410C]" />
                      <span>What's Not Included</span>
                    </h4>
                    <ul className="space-y-2 text-xs text-[#5C6662]">
                      {trek.exclusions.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-[#C2410C] font-bold shrink-0">✕</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Interactive Packing Checklist */}
                <div className="bg-[#F3F1EA] p-5 rounded-2xl border border-[#E8E4D9] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-[#2D3633] text-sm">Trekker Packing Checklist</h4>
                      <p className="text-xs text-[#5C6662]">Tick items as you pack your Himalayan rucksack.</p>
                    </div>
                    <span className="text-xs font-semibold text-[#2D4F1E] bg-[#E8F0E5] px-2 py-0.5 rounded-full border border-[#C5DCC0]">
                      {Object.values(checkedGear).filter(Boolean).length} / {trek.requiredGear.length} Packed
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    {trek.requiredGear.map((item, idx) => {
                      const isChecked = !!checkedGear[item];
                      return (
                        <div
                          key={idx}
                          onClick={() => handleToggleGearCheck(item)}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                            isChecked
                              ? 'bg-[#E8F0E5] border-[#A8C69F] text-[#2D4F1E] font-medium'
                              : 'bg-white border-[#E8E4D9] text-[#5C6662] hover:border-[#D1CDC0]'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                            isChecked ? 'bg-[#4A6741] text-white' : 'border border-[#D1CDC0]'
                          }`}>
                            {isChecked && <Check className="w-3 h-3" />}
                          </div>
                          <span className="text-xs">{item}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* 5. REVIEWS SECTION */}
            {activeTab === 'reviews' && (
              <ReviewsSection
                trek={trek}
                reviews={reviews}
                onAddReview={onAddReview}
                currentUser={currentUser}
                onOpenAuth={onOpenAuth}
              />
            )}
          </div>
        </div>

        {/* Sticky Bottom Booking Bar */}
        <div className="bg-white p-4 sm:p-5 border-t border-[#E8E4D9] flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 shadow-lg z-20">
          <div>
            <div className="text-xs text-[#5C6662]">Starting Price per Trekker</div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-[#2D4F1E] font-heading">
                ₹{(trek.discountedPriceINR || trek.startingPriceINR).toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-semibold text-[#8B5E3C]">INR</span>
              {trek.discountedPriceINR && trek.discountedPriceINR < trek.startingPriceINR && (
                <span className="text-xs text-[#8B9691] line-through">
                  ₹{trek.startingPriceINR.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-[11px] text-[#4A6741] font-semibold">
              Includes 100% vegetarian meals, guide, permit & camping
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {onOpenMap && (
              <button
                id="view-on-map-btn"
                onClick={() => onOpenMap(trek)}
                className="flex-none px-4 py-3 rounded-xl border border-[#4A6741] text-[#4A6741] font-bold text-sm hover:bg-[#4A6741]/10 transition-colors flex items-center gap-2"
              >
                <Map className="w-4 h-4" />
                <span className="hidden sm:inline">Directions</span>
              </button>
            )}
            <button
              id="sticky-book-now-btn"
              onClick={() => onOpenBooking(trek)}
              className="w-full sm:w-auto bg-[#8B5E3C] hover:bg-[#734B2E] text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm"
            >
              <span>Book This Trek</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
