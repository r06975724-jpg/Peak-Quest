import React from 'react';
import { Booking } from '../types';
import { X, Calendar, Users, MapPin, FileText, CheckCircle2, AlertCircle, Compass } from 'lucide-react';

interface MyBookingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  onCancelBooking: (bookingId: string) => void;
}

export const MyBookingsDrawer: React.FC<MyBookingsDrawerProps> = ({
  isOpen,
  onClose,
  bookings,
  onCancelBooking
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#1E2822]/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#FDFCF7] text-[#2D3633] h-full shadow-2xl flex flex-col justify-between overflow-hidden">
        
        {/* Drawer Header */}
        <div className="bg-[#1E2822] text-[#FDFCF7] p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#4A6741] flex items-center justify-center text-white">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base font-heading">My Bookings & Permits</h3>
              <p className="text-[#D1CDC0] text-xs">{bookings.length} Expedition{bookings.length === 1 ? '' : 's'}</p>
            </div>
          </div>

          <button
            id="close-my-bookings-btn"
            onClick={onClose}
            className="text-[#D1CDC0] hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bookings List */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {bookings.length === 0 ? (
            <div className="text-center py-16 text-[#8B9691] space-y-3">
              <Compass className="w-12 h-12 text-[#D1CDC0] mx-auto" />
              <div>
                <p className="text-[#2D3633] font-bold text-sm">No Active Bookings</p>
                <p className="text-xs text-[#5C6662] mt-1 max-w-xs mx-auto">
                  Explore Himachal Pradesh and Uttarakhand treks starting from ₹5,000 INR to book your next Himalayan adventure.
                </p>
              </div>
            </div>
          ) : (
            bookings.map((b) => (
              <div
                key={b.id}
                id={`booking-card-${b.id}`}
                className="bg-[#F3F1EA] rounded-2xl p-4 border border-[#E8E4D9] shadow-xs space-y-3"
              >
                <div className="flex gap-3">
                  <img
                    src={b.trekImage}
                    alt={b.trekName}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-[#E8E4D9]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#2D4F1E] font-bold bg-[#4A6741]/15 px-2 py-0.5 rounded border border-[#4A6741]/20">
                        {b.bookingCode}
                      </span>
                      <span className="text-[11px] text-[#2D4F1E] font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#4A6741]" />
                        {b.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-[#2D3633] text-sm truncate mt-1">{b.trekName}</h4>
                    <span className="text-xs text-[#5C6662] block">{b.trekRegion}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-[#E8E4D9] text-[#5C6662]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#8B9691]" />
                    <span className="truncate">{b.selectedBatchDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#8B9691]" />
                    <span>{b.trekkersCount} Trekker{b.trekkersCount > 1 ? 's' : ''}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E8E4D9] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#8B9691] block">TOTAL PAID</span>
                    <span className="font-bold text-[#2D3633] text-sm">₹{b.totalPriceINR.toLocaleString('en-IN')} INR</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.print()}
                      className="px-2.5 py-1 text-xs border border-[#E8E4D9] rounded-lg text-[#2D3633] hover:bg-white flex items-center gap-1 transition-colors"
                    >
                      <FileText className="w-3 h-3" />
                      <span>Voucher</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to cancel booking ${b.bookingCode}?`)) {
                          onCancelBooking(b.id);
                        }
                      }}
                      className="px-2.5 py-1 text-xs text-[#8B3A36] hover:bg-[#FDF2F2] rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 bg-[#F3F1EA] border-t border-[#E8E4D9] text-xs text-[#5C6662] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-[#4A6741] shrink-0" />
          <span>Mountain rescue support available 24/7 across Himachal & Uttarakhand state corridors.</span>
        </div>
      </div>
    </div>
  );
};
