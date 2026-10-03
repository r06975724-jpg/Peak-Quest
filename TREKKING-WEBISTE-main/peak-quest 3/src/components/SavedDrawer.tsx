import React from 'react';
import { Trek, Destination } from '../types';
import { X, Heart, Compass, ArrowRight, Trash2 } from 'lucide-react';

interface SavedDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedTreks: (Trek | Destination)[];
  onSelectTrek: (trek: Trek | Destination) => void;
  onRemoveSaved: (trekId: string) => void;
}

export const SavedDrawer: React.FC<SavedDrawerProps> = ({
  isOpen,
  onClose,
  savedTreks,
  onSelectTrek,
  onRemoveSaved
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#1E2822]/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#FDFCF7] text-[#2D3633] h-full shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="bg-[#1E2822] text-[#FDFCF7] p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-400 fill-rose-400" />
            <h3 className="font-bold text-base font-heading">Saved Expeditions</h3>
            <span className="text-xs bg-[#2D3633] text-[#D1CDC0] px-2 py-0.5 rounded-full">
              {savedTreks.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-[#D1CDC0] hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Saved List */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {savedTreks.length === 0 ? (
            <div className="text-center py-16 text-[#8B9691] space-y-3">
              <Heart className="w-12 h-12 text-[#D1CDC0] mx-auto" />
              <div>
                <p className="text-[#2D3633] font-bold text-sm">No Saved Treks Yet</p>
                <p className="text-xs text-[#5C6662] mt-1 max-w-xs mx-auto">
                  Click the heart icon on any trek card to save it for your next Himalayan trip planning.
                </p>
              </div>
            </div>
          ) : (
            savedTreks.map((trek) => (
              <div
                key={trek.id}
                className="bg-[#F3F1EA] rounded-2xl p-3.5 border border-[#E8E4D9] shadow-xs flex items-center gap-3.5 group hover:border-[#4A6741] transition-colors"
              >
                <img
                  src={trek.coverImage}
                  alt={trek.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 cursor-pointer border border-[#E8E4D9]"
                  onClick={() => {
                    onSelectTrek(trek);
                    onClose();
                  }}
                />

                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-[#2D4F1E] font-bold uppercase">{'region' in trek ? trek.region : `${trek.state} · ${trek.type}`}</span>
                  <h4 
                    onClick={() => {
                      onSelectTrek(trek);
                      onClose();
                    }}
                    className="font-bold text-[#2D3633] text-xs sm:text-sm truncate cursor-pointer hover:text-[#4A6741]"
                  >
                    {trek.name}
                  </h4>
                  <div className="flex items-center justify-between text-xs mt-1">
                    {'startingPriceINR' in trek ? <span className="font-extrabold text-[#2D3633]">₹{(trek.discountedPriceINR || trek.startingPriceINR).toLocaleString('en-IN')} INR</span> : <span className="font-bold text-[#4A6741]">Explore</span>}
                    <span className="text-[#5C6662] text-[11px]">{'durationDays' in trek && trek.durationDays ? `${trek.durationDays} Days` : 'No booking yet'}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => onRemoveSaved(trek.id)}
                    className="p-1.5 text-[#8B9691] hover:text-[#8B3A36] rounded-lg hover:bg-[#FDF2F2] transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      onSelectTrek(trek);
                      onClose();
                    }}
                    className="p-1.5 text-[#2D3633] hover:text-[#4A6741] rounded-lg hover:bg-[#4A6741]/10 transition-colors"
                    title="View details"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F3F1EA] border-t border-[#E8E4D9] text-center text-xs text-[#5C6662]">
          Peak Quest • Handcrafted Himalayan Expeditions
        </div>
      </div>
    </div>
  );
};
