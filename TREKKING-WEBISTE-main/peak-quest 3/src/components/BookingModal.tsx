import React, { useState } from 'react';
import { Trek, Booking, UserProfile, GearRentalItem } from '../types';
import { GEAR_RENTALS } from '../data/treks';
import confetti from 'canvas-confetti';
import { 
  X, 
  Check, 
  Calendar, 
  Users, 
  ShieldCheck, 
  Compass, 
  CreditCard, 
  Sparkles, 
  Tag, 
  ArrowRight, 
  Phone, 
  Mail, 
  User, 
  CheckCircle2, 
  FileText,
  AlertCircle
} from 'lucide-react';

interface BookingModalProps {
  trek: Trek;
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onBookingSuccess: (newBooking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  trek,
  isOpen,
  onClose,
  currentUser,
  onOpenAuth,
  onBookingSuccess
}) => {
  if (!isOpen) return null;

  // Selected state
  const [selectedBatch, setSelectedBatch] = useState<string>(trek.availableBatches[0]?.date || 'Upcoming Weekend');
  const [trekkersCount, setTrekkersCount] = useState<number>(1);
  const [selectedGearIds, setSelectedGearIds] = useState<string[]>([]);
  
  // Contact state
  const [contactName, setContactName] = useState<string>(currentUser?.name || '');
  const [contactEmail, setContactEmail] = useState<string>(currentUser?.email || '');
  const [contactPhone, setContactPhone] = useState<string>(currentUser?.phone || '');
  const [emergencyPhone, setEmergencyPhone] = useState<string>('');
  
  // Trekkers details
  const [trekkerNames, setTrekkerNames] = useState<string[]>([currentUser?.name || 'Trekker 1']);

  // Promo code
  const [couponInput, setCouponInput] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPercent?: number; flatDiscount?: number } | null>(null);
  const [couponError, setCouponError] = useState<string>('');

  // Step state
  const [step, setStep] = useState<'details' | 'addons' | 'payment' | 'confirmation'>('details');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking'>('UPI');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [completedBooking, setCompletedBooking] = useState<Booking | null>(null);

  // Price calculation in INR
  const baseRate = trek.discountedPriceINR || trek.startingPriceINR;
  const baseTotalINR = baseRate * trekkersCount;
  
  // Gear price per person for trek duration
  const gearTotalINR = selectedGearIds.reduce((sum, gId) => {
    const item = GEAR_RENTALS.find((g) => g.id === gId);
    return sum + (item ? item.pricePerDayINR * trek.durationDays * trekkersCount : 0);
  }, 0);

  // Discount calculation
  let discountINR = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      discountINR = Math.round((baseTotalINR * appliedCoupon.discountPercent) / 100);
    } else if (appliedCoupon.flatDiscount) {
      discountINR = appliedCoupon.flatDiscount;
    }
  }

  // 5% GST tax (Indian standard for adventure tours)
  const taxableAmount = Math.max(0, baseTotalINR + gearTotalINR - discountINR);
  const gstTaxINR = Math.round(taxableAmount * 0.05);
  const finalTotalINR = taxableAmount + gstTaxINR;

  const handleTrekkersChange = (count: number) => {
    const validCount = Math.max(1, Math.min(10, count));
    setTrekkersCount(validCount);
    
    // adjust trekker names list
    const newNames = [...trekkerNames];
    while (newNames.length < validCount) {
      newNames.push(`Trekker ${newNames.length + 1}`);
    }
    setTrekkerNames(newNames.slice(0, validCount));
  };

  const handleToggleGear = (gearId: string) => {
    if (selectedGearIds.includes(gearId)) {
      setSelectedGearIds(selectedGearIds.filter((id) => id !== gearId));
    } else {
      setSelectedGearIds([...selectedGearIds, gearId]);
    }
  };

  const handleApplyCoupon = () => {
    setCouponError('');
    const code = couponInput.trim().toUpperCase();
    if (code === 'PEAKQUEST') {
      setAppliedCoupon({ code: 'PEAKQUEST', flatDiscount: 500 });
    } else if (code === 'HIMALAYA10') {
      setAppliedCoupon({ code: 'HIMALAYA10', discountPercent: 10 });
    } else if (code === 'SUMMIT2026') {
      setAppliedCoupon({ code: 'SUMMIT2026', flatDiscount: 1000 });
    } else {
      setCouponError('Invalid coupon code. Try "HIMALAYA10" or "PEAKQUEST".');
    }
  };

  const handleConfirmBooking = () => {
    if (!contactName.trim() || !contactEmail.trim() || !contactPhone.trim()) {
      alert('Please fill out all contact information to confirm your permit.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const generatedCode = `PQ-${trek.region === 'Himachal Pradesh' ? 'HP' : 'UK'}-${Math.floor(10000 + Math.random() * 90000)}`;
      
      const newBooking: Booking = {
        id: `book-${Date.now()}`,
        bookingCode: generatedCode,
        trekId: trek.id,
        trekName: trek.name,
        trekRegion: trek.region,
        trekImage: trek.coverImage,
        selectedBatchDate: selectedBatch,
        trekkersCount,
        primaryContact: {
          name: contactName,
          email: contactEmail,
          phone: contactPhone,
          emergencyContact: emergencyPhone || contactPhone
        },
        trekkerDetails: trekkerNames.map((name, i) => ({
          name: name || `Trekker ${i + 1}`,
          age: 24 + i * 2,
          gender: 'Other'
        })),
        rentedGearIds: selectedGearIds,
        basePriceINR: baseTotalINR,
        gearTotalINR,
        discountINR,
        taxINR: gstTaxINR,
        totalPriceINR: finalTotalINR,
        status: 'Confirmed',
        bookedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        paymentMethod
      };

      setCompletedBooking(newBooking);
      onBookingSuccess(newBooking);
      setIsSubmitting(false);
      setStep('confirmation');

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Safe fallback if confetti isn't supported
      }
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E2822]/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FDFCF7] text-[#2D3633] rounded-2xl shadow-2xl border border-[#E8E4D9] overflow-hidden my-6">
        {/* Modal Header */}
        <div className="bg-[#1E2822] text-[#FDFCF7] p-5 sm:p-6 flex items-start justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-[#A8C69F] text-xs font-semibold uppercase tracking-wider mb-1">
              <Compass className="w-4 h-4" />
              <span>Himalayan Expedition Booking</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight font-heading">{trek.name}</h2>
            <p className="text-[#D1CDC0] text-xs sm:text-sm mt-0.5">
              {trek.durationDays} Days • {trek.region} • Altitude: {trek.maxAltitudeFt.toLocaleString()} ft
            </p>
          </div>

          <button
            id="close-booking-modal-btn"
            onClick={onClose}
            className="text-[#D1CDC0] hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors relative z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Step Indicator */}
        {step !== 'confirmation' && (
          <div className="bg-[#F3F1EA] px-6 py-3 border-b border-[#E8E4D9] flex items-center justify-between text-xs font-medium text-[#5C6662]">
            <button
              onClick={() => setStep('details')}
              className={`flex items-center gap-1.5 ${step === 'details' ? 'text-[#2D4F1E] font-bold' : ''}`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 'details' ? 'bg-[#4A6741] text-white' : 'bg-[#E8E4D9] text-[#5C6662]'}`}>1</span>
              <span>Dates & Trekkers</span>
            </button>
            <span className="text-[#D1CDC0]">──</span>
            <button
              onClick={() => setStep('addons')}
              className={`flex items-center gap-1.5 ${step === 'addons' ? 'text-[#2D4F1E] font-bold' : ''}`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 'addons' ? 'bg-[#4A6741] text-white' : 'bg-[#E8E4D9] text-[#5C6662]'}`}>2</span>
              <span>Gear & Permits</span>
            </button>
            <span className="text-[#D1CDC0]">──</span>
            <button
              onClick={() => setStep('payment')}
              className={`flex items-center gap-1.5 ${step === 'payment' ? 'text-[#2D4F1E] font-bold' : ''}`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 'payment' ? 'bg-[#4A6741] text-white' : 'bg-[#E8E4D9] text-[#5C6662]'}`}>3</span>
              <span>Summary & Pay</span>
            </button>
          </div>
        )}

        {/* Modal Body Content */}
        <div className="p-5 sm:p-6 max-h-[70vh] overflow-y-auto">
          {/* STEP 1: Dates & Trekkers details */}
          {step === 'details' && (
            <div className="space-y-6">
              {/* Batch Date Selector */}
              <div>
                <label className="block text-xs font-bold text-[#5C6662] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#4A6741]" />
                  <span>Select Departure Batch Date</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {trek.availableBatches.map((batch, idx) => {
                    const isSelected = selectedBatch === batch.date;
                    return (
                      <div
                        key={idx}
                        id={`batch-select-${idx}`}
                        onClick={() => setSelectedBatch(batch.date)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#4A6741] bg-[#E8F0E5]/70 shadow-xs ring-1 ring-[#4A6741]'
                            : 'border-[#E8E4D9] hover:border-[#D1CDC0] bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-[#2D3633]">{batch.date}</span>
                          {isSelected && <Check className="w-4 h-4 text-[#4A6741]" />}
                        </div>
                        <div className="flex items-center justify-between text-xs text-[#5C6662] mt-1">
                          <span>Guide: {batch.guideName}</span>
                          <span className="text-[#2D4F1E] font-semibold bg-[#E8F0E5] px-2 py-0.5 rounded-full text-[11px] border border-[#C5DCC0]">
                            {batch.availableSlots} slots left
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Number of Trekkers Counter */}
              <div>
                <label className="block text-xs font-bold text-[#5C6662] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#4A6741]" />
                  <span>Number of Trekkers</span>
                </label>
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#F3F1EA] border border-[#E8E4D9]">
                  <div>
                    <div className="font-bold text-[#2D3633] text-sm">Trek Permits & Tents</div>
                    <div className="text-xs text-[#5C6662]">
                      ₹{baseRate.toLocaleString('en-IN')} INR per trekker (Includes all meals, guide, permits)
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      id="decrease-trekkers-btn"
                      type="button"
                      onClick={() => handleTrekkersChange(trekkersCount - 1)}
                      className="w-8 h-8 rounded-lg bg-white border border-[#E8E4D9] text-[#2D3633] font-bold hover:bg-[#F3F1EA] flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="font-bold text-base text-[#2D3633] w-5 text-center">{trekkersCount}</span>
                    <button
                      id="increase-trekkers-btn"
                      type="button"
                      onClick={() => handleTrekkersChange(trekkersCount + 1)}
                      className="w-8 h-8 rounded-lg bg-[#4A6741] text-white font-bold hover:bg-[#3D5636] flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Primary Contact Details */}
              <div className="space-y-3 pt-2 border-t border-[#E8E4D9]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#5C6662] uppercase tracking-wider">
                    Primary Contact & Permit Details
                  </span>
                  {!currentUser && (
                    <button
                      type="button"
                      onClick={onOpenAuth}
                      className="text-xs text-[#8B5E3C] hover:text-[#734B2E] font-semibold underline"
                    >
                      Sign In to autofill
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[#5C6662] mb-1">Full Name (As per Govt ID)</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#8B9691] absolute left-3 top-2.5" />
                      <input
                        id="booking-contact-name-input"
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="e.g. Ashwini Saurabh"
                        className="w-full pl-9 pr-3 py-2 text-sm border border-[#E8E4D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6741] bg-white text-[#2D3633]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-[#5C6662] mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#8B9691] absolute left-3 top-2.5" />
                      <input
                        id="booking-contact-email-input"
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="ashwini@example.com"
                        className="w-full pl-9 pr-3 py-2 text-sm border border-[#E8E4D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6741] bg-white text-[#2D3633]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-[#5C6662] mb-1">Mobile Number (WhatsApp updates)</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#8B9691] absolute left-3 top-2.5" />
                      <input
                        id="booking-contact-phone-input"
                        type="tel"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-9 pr-3 py-2 text-sm border border-[#E8E4D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6741] bg-white text-[#2D3633]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-[#5C6662] mb-1">Emergency Contact Number</label>
                    <input
                      id="booking-emergency-phone-input"
                      type="tel"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      placeholder="Family / Guardian contact"
                      className="w-full px-3 py-2 text-sm border border-[#E8E4D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6741] bg-white text-[#2D3633]"
                    />
                  </div>
                </div>
              </div>

              {/* Next Button */}
              <div className="pt-3">
                <button
                  id="booking-step1-continue-btn"
                  type="button"
                  onClick={() => {
                    if (!contactName.trim() || !contactEmail.trim() || !contactPhone.trim()) {
                      alert('Please provide your name, email and phone number to proceed.');
                      return;
                    }
                    setStep('addons');
                  }}
                  className="w-full bg-[#8B5E3C] hover:bg-[#734B2E] text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  <span>Continue to Gear & Equipment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Gear Rental & Add-ons */}
          {step === 'addons' && (
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-[#2D3633] text-base font-heading">Himalayan Equipment & Gear Rental</h3>
                  <span className="text-xs font-semibold text-[#2D4F1E] bg-[#E8F0E5] px-2 py-0.5 rounded-full border border-[#C5DCC0]">
                    Optional Add-ons
                  </span>
                </div>
                <p className="text-xs text-[#5C6662]">
                  Save luggage weight and rent sanitized, high-quality mountain gear for {trek.durationDays} days.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {GEAR_RENTALS.map((gear) => {
                  const isChecked = selectedGearIds.includes(gear.id);
                  const totalItemCost = gear.pricePerDayINR * trek.durationDays * trekkersCount;
                  return (
                    <div
                      key={gear.id}
                      id={`gear-item-${gear.id}`}
                      onClick={() => handleToggleGear(gear.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isChecked
                          ? 'border-[#4A6741] bg-[#E8F0E5]/70 shadow-xs ring-1 ring-[#4A6741]'
                          : 'border-[#E8E4D9] hover:border-[#D1CDC0] bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-bold text-sm text-[#2D3633]">{gear.name}</div>
                          <p className="text-[11px] text-[#5C6662] mt-0.5">{gear.description}</p>
                        </div>
                        <div className={`w-5 h-5 rounded flex items-center justify-center text-xs shrink-0 mt-0.5 ${
                          isChecked ? 'bg-[#4A6741] text-white' : 'border border-[#D1CDC0] bg-[#F3F1EA]'
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-[#E8E4D9] flex items-center justify-between text-xs">
                        <span className="text-[#5C6662]">₹{gear.pricePerDayINR}/day</span>
                        <span className="font-bold text-[#2D4F1E]">
                          +₹{totalItemCost.toLocaleString('en-IN')} INR total
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Inclusions summary checklist */}
              <div className="p-4 rounded-xl bg-[#F3F1EA] border border-[#E8E4D9] text-xs space-y-2">
                <div className="font-bold text-[#2D3633] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#4A6741]" />
                  <span>Standard Inclusions Covered in Base Fare</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[#5C6662]">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#4A6741] shrink-0" />
                    <span>All meals & snacks on trail</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#4A6741] shrink-0" />
                    <span>High altitude 4-season tents</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#4A6741] shrink-0" />
                    <span>IMF Certified Trek Leader</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#4A6741] shrink-0" />
                    <span>Forest permits & camping charges</span>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="w-1/3 py-3 border border-[#E8E4D9] text-[#2D3633] font-semibold rounded-xl hover:bg-[#F3F1EA] text-sm"
                >
                  Back
                </button>
                <button
                  id="booking-step2-continue-btn"
                  type="button"
                  onClick={() => setStep('payment')}
                  className="w-2/3 bg-[#8B5E3C] hover:bg-[#734B2E] text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg text-sm"
                >
                  <span>Review & Pay</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Summary, Coupons & Payment */}
          {step === 'payment' && (
            <div className="space-y-5">
              {/* Fare Breakdown in INR */}
              <div className="bg-[#F3F1EA] p-4 rounded-xl border border-[#E8E4D9] space-y-2.5 text-xs sm:text-sm">
                <div className="flex items-center justify-between text-[#5C6662]">
                  <span>Base Fare ({trekkersCount} Trekker{trekkersCount > 1 ? 's' : ''} × ₹{baseRate.toLocaleString('en-IN')})</span>
                  <span className="font-semibold text-[#2D3633]">₹{baseTotalINR.toLocaleString('en-IN')} INR</span>
                </div>

                {gearTotalINR > 0 && (
                  <div className="flex items-center justify-between text-[#5C6662]">
                    <span>Gear Rentals ({selectedGearIds.length} item{selectedGearIds.length > 1 ? 's' : ''})</span>
                    <span className="font-semibold text-[#2D3633]">+₹{gearTotalINR.toLocaleString('en-IN')} INR</span>
                  </div>
                )}

                {appliedCoupon && (
                  <div className="flex items-center justify-between text-[#2D4F1E] font-semibold">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" />
                      Coupon ({appliedCoupon.code})
                    </span>
                    <span>-₹{discountINR.toLocaleString('en-IN')} INR</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-[#5C6662]">
                  <span>Govt GST & Adventure Safety Cess (5%)</span>
                  <span className="font-semibold text-[#2D3633]">+₹{gstTaxINR.toLocaleString('en-IN')} INR</span>
                </div>

                <div className="pt-2 border-t border-[#E8E4D9] flex items-center justify-between font-bold text-base text-[#2D3633]">
                  <span>Total Amount (INR)</span>
                  <span className="text-[#2D4F1E] text-lg font-heading">₹{finalTotalINR.toLocaleString('en-IN')} INR</span>
                </div>
              </div>

              {/* Coupon Code Box */}
              <div>
                <label className="block text-xs font-bold text-[#5C6662] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-[#4A6741]" />
                  <span>Promo Code or Coupon</span>
                </label>
                <div className="flex gap-2">
                  <input
                    id="booking-coupon-input"
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter code (e.g. HIMALAYA10, PEAKQUEST)"
                    className="flex-1 px-3 py-2 text-sm border border-[#E8E4D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6741] uppercase font-mono bg-white text-[#2D3633]"
                  />
                  <button
                    id="apply-coupon-btn"
                    type="button"
                    onClick={handleApplyCoupon}
                    className="bg-[#2D3633] hover:bg-[#1E2822] text-[#FDFCF7] px-4 py-2 rounded-lg text-xs font-bold transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-xs text-[#8B3A36] mt-1">{couponError}</p>}
                {appliedCoupon && (
                  <p className="text-xs text-[#2D4F1E] mt-1 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Coupon {appliedCoupon.code} applied successfully!
                  </p>
                )}
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-[#5C6662] uppercase tracking-wider mb-2 flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-[#4A6741]" />
                  <span>Payment Method (Instant Confirmation)</span>
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    id="pay-upi-btn"
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-2.5 rounded-xl border text-center font-semibold transition-all ${
                      paymentMethod === 'UPI'
                        ? 'border-[#4A6741] bg-[#E8F0E5] text-[#2D4F1E] ring-1 ring-[#4A6741]'
                        : 'border-[#E8E4D9] text-[#5C6662] hover:bg-[#F3F1EA]'
                    }`}
                  >
                    UPI / GPay / PhonePe
                  </button>
                  <button
                    id="pay-card-btn"
                    type="button"
                    onClick={() => setPaymentMethod('Card')}
                    className={`p-2.5 rounded-xl border text-center font-semibold transition-all ${
                      paymentMethod === 'Card'
                        ? 'border-[#4A6741] bg-[#E8F0E5] text-[#2D4F1E] ring-1 ring-[#4A6741]'
                        : 'border-[#E8E4D9] text-[#5C6662] hover:bg-[#F3F1EA]'
                    }`}
                  >
                    Credit / Debit Card
                  </button>
                  <button
                    id="pay-netbanking-btn"
                    type="button"
                    onClick={() => setPaymentMethod('NetBanking')}
                    className={`p-2.5 rounded-xl border text-center font-semibold transition-all ${
                      paymentMethod === 'NetBanking'
                        ? 'border-[#4A6741] bg-[#E8F0E5] text-[#2D4F1E] ring-1 ring-[#4A6741]'
                        : 'border-[#E8E4D9] text-[#5C6662] hover:bg-[#F3F1EA]'
                    }`}
                  >
                    Net Banking
                  </button>
                </div>
              </div>

              {/* Summary note */}
              <div className="text-[11px] text-[#5C6662] flex items-start gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-[#8B9691] shrink-0 mt-0.5" />
                <span>
                  Free cancellation up to 7 days before departure. Instant permit registration with Himachal / Uttarakhand state authorities upon booking.
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('addons')}
                  className="w-1/3 py-3 border border-[#E8E4D9] text-[#2D3633] font-semibold rounded-xl hover:bg-[#F3F1EA] text-sm"
                >
                  Back
                </button>
                <button
                  id="confirm-booking-pay-btn"
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleConfirmBooking}
                  className="w-2/3 bg-[#8B5E3C] hover:bg-[#734B2E] text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg text-sm disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Processing Permit & Payment...</span>
                  ) : (
                    <>
                      <span>Pay ₹{finalTotalINR.toLocaleString('en-IN')} & Confirm</span>
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Booking Confirmation & Voucher */}
          {step === 'confirmation' && completedBooking && (
            <div className="text-center py-4 space-y-5">
              <div className="w-16 h-16 bg-[#E8F0E5] text-[#2D4F1E] rounded-full flex items-center justify-center mx-auto shadow-inner border border-[#C5DCC0]">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-[#2D3633] font-heading">Trek Permit Confirmed!</h3>
                <p className="text-sm text-[#5C6662] mt-1">
                  Congratulations! Your spot on <span className="font-semibold text-[#2D3633]">{completedBooking.trekName}</span> has been confirmed.
                </p>
              </div>

              {/* Voucher Ticket Card */}
              <div className="bg-[#1E2822] text-[#FDFCF7] p-5 rounded-2xl text-left border border-[#2D3633] shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#2D3633]">
                  <div>
                    <span className="text-[10px] text-[#A8C69F] uppercase tracking-wider block">BOOKING REFERENCE CODE</span>
                    <span className="font-mono text-lg font-bold text-white tracking-widest">{completedBooking.bookingCode}</span>
                  </div>
                  <span className="px-3 py-1 bg-[#4A6741]/40 text-[#A8C69F] text-xs font-semibold rounded-full border border-[#A8C69F]/30">
                    Permit Active
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#8B9691] block text-[10px]">DEPARTURE BATCH</span>
                    <span className="text-white font-medium">{completedBooking.selectedBatchDate}</span>
                  </div>
                  <div>
                    <span className="text-[#8B9691] block text-[10px]">TREKKERS COUNT</span>
                    <span className="text-white font-medium">{completedBooking.trekkersCount} Person(s)</span>
                  </div>
                  <div>
                    <span className="text-[#8B9691] block text-[10px]">PRIMARY TREKKER</span>
                    <span className="text-white font-medium">{completedBooking.primaryContact.name}</span>
                  </div>
                  <div>
                    <span className="text-[#8B9691] block text-[10px]">AMOUNT PAID (INR)</span>
                    <span className="text-[#A8C69F] font-bold">₹{completedBooking.totalPriceINR.toLocaleString('en-IN')} INR</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#2D3633] flex items-center justify-between text-[11px] text-[#D1CDC0]">
                  <span>State: {completedBooking.trekRegion}</span>
                  <span>Confirmation sent to {completedBooking.primaryContact.email}</span>
                </div>
              </div>

              {/* Voucher Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  id="print-permit-btn"
                  onClick={() => window.print()}
                  className="flex-1 py-3 px-4 border border-[#E8E4D9] text-[#2D3633] rounded-xl font-bold text-xs hover:bg-[#F3F1EA] transition-colors flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Download / Print Permit Voucher</span>
                </button>
                <button
                  id="done-booking-btn"
                  onClick={onClose}
                  className="flex-1 py-3 px-4 bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-xl font-bold text-xs transition-colors shadow-md"
                >
                  View in My Bookings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
