import React from 'react';
import { Mountain, Heart, Compass, Mail, Phone, MapPin, Shield } from 'lucide-react';
import { Region } from '../types';

interface FooterProps {
  onSelectRegion: (region: Region | 'All') => void;
  onOpenAuth: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectRegion, onOpenAuth }) => {
  return (
    <footer className="bg-[#1E2822] text-[#D1CDC0] border-t border-[#2D3633] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#4A6741] flex items-center justify-center text-white">
                <Mountain className="w-4 h-4" />
              </div>
              <span className="font-heading font-extrabold text-lg tracking-tight text-white">
                Peak Quest
              </span>
            </div>
            <p className="text-[#D1CDC0] text-xs leading-relaxed">
              India’s trail and heritage discovery platform. Explore treks and forts nationwide with elevation maps, live weather, and instant bookings for featured expeditions from ₹5,000 INR.
            </p>
          </div>

          {/* Col 2: Featured Himalayan Treks */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs font-heading">Himachal Pradesh</h4>
            <ul className="space-y-1.5 text-[#D1CDC0]">
              <li>
                <button onClick={() => onSelectRegion('Himachal Pradesh')} className="hover:text-[#86EFAC] transition-colors text-left">
                  Triund Trail (₹5,000 INR)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectRegion('Himachal Pradesh')} className="hover:text-[#86EFAC] transition-colors text-left">
                  Hampta Pass & Chandratal (₹10,499 INR)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectRegion('Himachal Pradesh')} className="hover:text-[#86EFAC] transition-colors text-left">
                  Beas Kund Glacial Lake (₹5,999 INR)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectRegion('Himachal Pradesh')} className="hover:text-[#86EFAC] transition-colors text-left">
                  Pin Bhaba High Pass (₹18,500 INR)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Featured Uttarakhand Treks */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs font-heading">Uttarakhand</h4>
            <ul className="space-y-1.5 text-[#D1CDC0]">
              <li>
                <button onClick={() => onSelectRegion('Uttarakhand')} className="hover:text-[#86EFAC] transition-colors text-left">
                  Nag Tibba Summit (₹5,200 INR)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectRegion('Uttarakhand')} className="hover:text-[#86EFAC] transition-colors text-left">
                  Kedarkantha Winter Summit (₹7,999 INR)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectRegion('Uttarakhand')} className="hover:text-[#86EFAC] transition-colors text-left">
                  Valley of Flowers & Hemkund (₹11,800 INR)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectRegion('Uttarakhand')} className="hover:text-[#86EFAC] transition-colors text-left">
                  Har Ki Dun - Valley of Gods (₹10,500 INR)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectRegion('Uttarakhand')} className="hover:text-[#86EFAC] transition-colors text-left">
                  Brahmatal Frozen Lake (₹8,750 INR)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Safety & Support */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs font-heading">Base Support & Contact</h4>
            <div className="space-y-1.5 text-[#D1CDC0]">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#86EFAC] shrink-0" />
                <span>India-wide trail support • Manali & Dehradun hubs</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#86EFAC] shrink-0" />
                <span>expeditions@peakquest.in</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#86EFAC] shrink-0" />
                <span>+91 (1800) 419-PEAK (24/7 Helpline)</span>
              </div>
              <div className="pt-2">
                <button
                  onClick={onOpenAuth}
                  className="bg-[#2D3633] hover:bg-[#3D4944] text-[#FDFCF7] px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#4A6741]/30 transition-colors"
                >
                  Trekker Sign In / Account
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-[#2D3633] flex flex-col sm:flex-row items-center justify-between gap-3 text-[#8B9691] text-[11px]">
          <div>
            © {new Date().getFullYear()} Peak Quest. Indian Rupees (INR) Pricing. All rights reserved.
          </div>
          <div className="flex items-center gap-3">
            <span>Himachal Tourism Approved</span>
            <span>•</span>
            <span>Uttarakhand Tourism Development Board</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
