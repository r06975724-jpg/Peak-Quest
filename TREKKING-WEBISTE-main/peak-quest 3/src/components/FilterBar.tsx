import React from 'react';
import { DestinationType, Difficulty, Season } from '../types';
import { ALL_STATE_NAMES } from '../data/states';
import { Filter, SlidersHorizontal, ArrowUpDown, RefreshCw, MapPin } from 'lucide-react';

interface FilterBarProps {
  selectedState: string;
  onSelectState: (state: string) => void;
  selectedType: DestinationType | 'All';
  onSelectType: (type: DestinationType | 'All') => void;
  selectedDifficulty: Difficulty | 'All';
  onSelectDifficulty: (d: Difficulty | 'All') => void;
  selectedSeason: Season | 'All';
  onSelectSeason: (s: Season | 'All') => void;
  maxPrice: number;
  onMaxPriceChange: (p: number) => void;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'altitude' | 'rating';
  onSortByChange: (s: 'featured' | 'price-asc' | 'price-desc' | 'altitude' | 'rating') => void;
  onResetFilters: () => void;
  resultsCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedState,
  onSelectState,
  selectedType,
  onSelectType,
  selectedDifficulty,
  onSelectDifficulty,
  selectedSeason,
  onSelectSeason,
  maxPrice,
  onMaxPriceChange,
  sortBy,
  onSortByChange,
  onResetFilters,
  resultsCount
}) => {
  const isFiltered = selectedState !== '' || selectedType !== 'All' || selectedDifficulty !== 'All' || selectedSeason !== 'All' || maxPrice < 50000;

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8E4D9] shadow-xs space-y-4 text-[#2D3633]">
      {/* Top row: Results count & sorting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8E4D9]">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#4A6741]" />
          <span className="font-bold text-[#2D3633] text-sm font-heading">
            Destinations ({resultsCount} available)
          </span>
          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="text-xs text-[#8B5E3C] hover:text-[#734B2E] underline flex items-center gap-1 ml-2 font-medium"
            >
              <RefreshCw className="w-3 h-3" />
              Reset filters
            </button>
          )}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 text-xs">
          <ArrowUpDown className="w-3.5 h-3.5 text-[#5C6662]" />
          <span className="text-[#5C6662] font-medium">Sort by:</span>
          <select
            id="sort-treks-select"
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as any)}
            className="bg-[#F3F1EA] border border-[#E8E4D9] rounded-lg px-2.5 py-1.5 font-semibold text-[#2D3633] focus:outline-none focus:ring-2 focus:ring-[#4A6741] text-xs"
          >
            <option value="featured">Featured / Popular</option>
            <option value="price-asc">Price: Low to High (From ₹5,000)</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="altitude">Max Altitude (Summit)</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Filter Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        {/* 1. Region Selector */}
        <div>
          <label className="block font-bold text-[#5C6662] uppercase tracking-wider mb-1.5">
            Indian State / Region
          </label>
          <select
            value={selectedState}
            onChange={(e) => onSelectState(e.target.value)}
            className="bg-[#F3F1EA] border border-[#E8E4D9] rounded-xl px-3 py-2 text-xs font-semibold text-[#2D3633] focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 min-w-[160px] w-full"
          >
            <option value="">All India</option>
            {ALL_STATE_NAMES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="mt-3">
             <label className="block font-bold text-[#5C6662] uppercase tracking-wider mb-1.5">
              Destination Type
            </label>
            <div className="flex gap-1 bg-[#F3F1EA] border border-[#E8E4D9] rounded-xl p-0.5">
              {(['All', 'trek', 'fort'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => onSelectType(t === 'All' ? 'All' : t)}
                  className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedType === t
                      ? 'bg-[#4A6741] text-white shadow-sm'
                      : 'text-[#5C6662] hover:text-[#2D3633]'
                  }`}
                >
                  {t === 'All' ? '🏔️ All' : t === 'trek' ? '🥾 Treks' : '🏰 Forts'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Difficulty Grade */}
        <div>
          <label className="block font-bold text-[#5C6662] uppercase tracking-wider mb-1.5">
            Difficulty Grade
          </label>
          <select
            id="difficulty-select"
            value={selectedDifficulty}
            onChange={(e) => onSelectDifficulty(e.target.value as any)}
            className="w-full bg-[#F3F1EA] border border-[#E8E4D9] rounded-xl px-3 py-2 font-medium text-[#2D3633] focus:outline-none focus:ring-2 focus:ring-[#4A6741]"
          >
            <option value="All">All Grades (Easy to Difficult)</option>
            <option value="Easy">Easy (Beginner friendly)</option>
            <option value="Moderate">Moderate (Alpine passes)</option>
            <option value="Difficult">Difficult (High expedition)</option>
          </select>
        </div>

        {/* 3. Season Filter */}
        <div>
          <label className="block font-bold text-[#5C6662] uppercase tracking-wider mb-1.5">
            Trek Season
          </label>
          <select
            id="season-select"
            value={selectedSeason}
            onChange={(e) => onSelectSeason(e.target.value as any)}
            className="w-full bg-[#F3F1EA] border border-[#E8E4D9] rounded-xl px-3 py-2 font-medium text-[#2D3633] focus:outline-none focus:ring-2 focus:ring-[#4A6741]"
          >
            <option value="All">All Seasons</option>
            <option value="Spring">Spring (Mar - May)</option>
            <option value="Summer">Summer (Jun - Jul)</option>
            <option value="Monsoon">Monsoon (Jul - Aug)</option>
            <option value="Autumn">Autumn (Sep - Nov)</option>
            <option value="Winter">Winter Snow (Dec - Feb)</option>
          </select>
        </div>

        {/* 4. Maximum Budget Slider in INR */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="font-bold text-[#5C6662] uppercase tracking-wider">
              Max Budget
            </label>
            <span className="font-bold text-[#8B5E3C] bg-[#F3F1EA] px-2 py-0.5 rounded border border-[#E8E4D9]">
              ₹{maxPrice.toLocaleString('en-IN')} INR
            </span>
          </div>
          <input
            id="budget-range-slider"
            type="range"
            min="5000"
            max="50000"
            step="500"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(Number(e.target.value))}
            className="w-full accent-[#4A6741] cursor-pointer bg-[#E8E4D9] h-2 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-[#8B9691] mt-1">
            <span>₹5,000 (Min)</span>
            <span>₹50,000+</span>
          </div>
        </div>
      </div>
    </div>
  );
};
