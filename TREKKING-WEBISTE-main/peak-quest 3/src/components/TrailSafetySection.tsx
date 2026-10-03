import React from 'react';
import { ShieldCheck, HeartPulse, CloudSun, Leaf, Compass, Mountain } from 'lucide-react';

export const TrailSafetySection: React.FC = () => {
  return (
    <section className="py-16 bg-[#1E2822] text-[#FDFCF7] border-t border-[#2D3633]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#86EFAC] uppercase tracking-widest block mb-2 font-mono">
            Peak Quest Safety & Eco Protocol
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
            Trekking the Himalayas with Safety & Care
          </h2>
          <p className="text-[#D1CDC0] text-xs sm:text-sm mt-2">
            Our certified expedition protocols ensure high altitude safety, eco-conscious trail stewardship, and emergency preparedness.
          </p>
        </div>

        {/* Protocols Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: AMS & Altitude Acclimatization */}
          <div className="bg-[#2D3633]/70 p-6 rounded-2xl border border-[#4A6741]/30 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#4A6741]/30 text-[#86EFAC] flex items-center justify-center">
              <HeartPulse className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-heading">High Altitude Acclimatization</h3>
            <p className="text-[#D1CDC0] text-xs leading-relaxed">
              We mandate graded elevation ascents not exceeding 500m daily above 3,000m. Twice-daily pulse oximetry and portable oxygen cylinders are carried on all Himachal & Uttarakhand routes.
            </p>
          </div>

          {/* Card 2: IMF Certified Guides */}
          <div className="bg-[#2D3633]/70 p-6 rounded-2xl border border-[#4A6741]/30 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#4A6741]/30 text-[#86EFAC] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-heading">IMF & WFR Certified Leaders</h3>
            <p className="text-[#D1CDC0] text-xs leading-relaxed">
              Every batch is led by certified mountaineers trained at ABVIMAS Manali and NIM Uttarkashi with Wilderness First Responder credentials and satellite rescue connectivity.
            </p>
          </div>

          {/* Card 3: Leave No Trace Clean Trails */}
          <div className="bg-[#2D3633]/70 p-6 rounded-2xl border border-[#4A6741]/30 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#4A6741]/30 text-[#86EFAC] flex items-center justify-center">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-heading">Leave No Trace & Clean Trails</h3>
            <p className="text-[#D1CDC0] text-xs leading-relaxed">
              Zero single-use plastic policy. We provide eco-bags to collect any non-biodegradable waste from trails and support local Himalayan mountain communities.
            </p>
          </div>
        </div>

        {/* Region comparison pill banner */}
        <div className="mt-10 p-5 rounded-2xl bg-[#2D3633]/50 border border-[#4A6741]/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <Mountain className="w-5 h-5 text-[#86EFAC] shrink-0" />
            <div>
              <span className="font-bold text-white">Himachal Pradesh:</span> Pir Panjal & Dhauladhar ranges • <span className="font-bold text-white">Uttarakhand:</span> Garhwal & Kumaon ranges
            </div>
          </div>
          <span className="text-[#86EFAC] font-semibold text-[11px] whitespace-nowrap">
            All prices starting from ₹5,000 INR
          </span>
        </div>
      </div>
    </section>
  );
};
