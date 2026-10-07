import React, { useState } from 'react';
import { UserProfile } from '../types';
import { ALL_STATE_NAMES } from '../data/states';
import { 
  Mountain, 
  Search, 
  Heart, 
  Bookmark, 
  User, 
  LogOut, 
  Compass, 
  Menu, 
  X,
  MapPin,
  Sparkles,
  CloudSun,
  Map
} from 'lucide-react';

interface NavbarProps {
  selectedState: string;
  onSelectState: (state: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  savedCount: number;
  bookingsCount: number;
  onOpenMyBookings: () => void;
  onOpenSavedDrawer: () => void;
  onOpenLiveWeather: () => void;
  onOpenMap?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedState,
  onSelectState,
  searchQuery,
  onSearchChange,
  currentUser,
  onOpenAuth,
  onLogout,
  savedCount,
  bookingsCount,
  onOpenMyBookings,
  onOpenSavedDrawer,
  onOpenLiveWeather,
  onOpenMap,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-[#FDFCF7]/95 backdrop-blur-md text-[#2D3633] border-b border-[#E8E4D9] transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onSelectState('');
                onSearchChange('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5 group text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4A6741] to-[#2D4F1E] flex items-center justify-center text-[#FDFCF7] shadow-sm group-hover:scale-105 transition-transform">
                <Mountain className="w-5 h-5" />
              </div>
              <div>
                <span className="font-heading font-extrabold text-xl sm:text-2xl tracking-tight text-[#2D4F1E] block leading-none">
                  Peak Quest
                </span>
                <span className="text-[10px] text-[#8B5E3C] font-bold uppercase tracking-widest block mt-0.5">
                  All India Adventures
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Region Navigation Switcher */}
          <nav className="hidden lg:flex items-center">
            <select
              value={selectedState}
              onChange={(e) => onSelectState(e.target.value)}
              className="bg-[#1E2822] border border-[#3D5636] rounded-xl px-3 py-1.5 text-xs font-semibold text-[#C8D6B9] focus:outline-none focus:ring-2 focus:ring-[#86EFAC]/30 min-w-[140px]"
            >
              <option value="">🇮🇳 All India</option>
              {ALL_STATE_NAMES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Input on Desktop */}
            <div className="hidden md:flex relative items-center w-48 lg:w-64">
              <Search className="w-4 h-4 text-[#8B9691] absolute left-3 pointer-events-none" />
              <input
                id="navbar-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search treks, forts, states..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F3F1EA] border border-[#E8E4D9] rounded-xl text-[#2D3633] placeholder-[#8B9691] focus:outline-none focus:ring-2 focus:ring-[#4A6741] focus:bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 text-[#8B9691] hover:text-[#2D3633]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Live Weather Radar Button */}
            <button
              id="nav-live-weather-btn"
              onClick={onOpenLiveWeather}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#4A6741]/10 hover:bg-[#4A6741]/20 border border-[#4A6741]/30 text-[#2D4F1E] text-xs font-semibold flex items-center gap-1.5 transition-colors group"
              title="Live Weather Radar"
            >
              <div className="relative">
                <CloudSun className="w-4 h-4 text-[#4A6741]" />
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[#86EFAC] rounded-full animate-ping" />
              </div>
              <span className="hidden md:inline font-bold">Live Weather</span>
            </button>

            {/* Map / Directions Button */}
            {onOpenMap && (
              <button
                id="nav-map-btn"
                onClick={onOpenMap}
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#F3F1EA] hover:bg-[#E8E4D9] border border-[#E8E4D9] text-[#2D3633] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Trek Route Finder & Map"
              >
                <Map className="w-4 h-4 text-[#4A6741]" />
                <span className="hidden md:inline">Map</span>
              </button>
            )}

            {/* My Bookings Button */}
            <button
              id="nav-my-bookings-btn"
              onClick={onOpenMyBookings}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#F3F1EA] hover:bg-[#E8E4D9] border border-[#E8E4D9] text-[#2D3633] text-xs font-semibold flex items-center gap-1.5 relative transition-colors"
              title="My Bookings"
            >
              <Compass className="w-4 h-4 text-[#4A6741]" />
              <span className="hidden sm:inline">My Bookings</span>
              {bookingsCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#4A6741] text-[#FDFCF7] font-bold text-[10px] flex items-center justify-center">
                  {bookingsCount}
                </span>
              )}
            </button>

            {/* Saved Wishlist Button */}
            <button
              id="nav-saved-btn"
              onClick={onOpenSavedDrawer}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#F3F1EA] hover:bg-[#E8E4D9] border border-[#E8E4D9] text-[#2D3633] text-xs font-semibold flex items-center gap-1.5 relative transition-colors"
              title="Saved Treks"
            >
              <Heart className={`w-4 h-4 ${savedCount > 0 ? 'text-[#8B5E3C] fill-[#8B5E3C]' : 'text-[#8B9691]'}`} />
              <span className="hidden sm:inline">Saved</span>
              {savedCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#8B5E3C] text-white font-bold text-[10px] flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>

            {/* User Auth Profile / Login Button */}
            {currentUser ? (
              <div className="relative">
                <button
                  id="user-profile-menu-btn"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 sm:pr-3 rounded-xl bg-[#F3F1EA] border border-[#E8E4D9] hover:bg-[#E8E4D9] transition-colors"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-lg object-cover"
                  />
                  <span className="hidden sm:inline text-xs font-bold text-[#2D3633] max-w-[90px] truncate">
                    {currentUser.name}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#FDFCF7] border border-[#E8E4D9] rounded-2xl shadow-2xl py-2 z-50 text-xs">
                    <div className="px-4 py-2 border-b border-[#E8E4D9]">
                      <div className="font-bold text-[#2D3633] truncate">{currentUser.name}</div>
                      <div className="text-[10px] text-[#5C6662] truncate">{currentUser.email}</div>
                    </div>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenMyBookings();
                      }}
                      className="w-full text-left px-4 py-2 text-[#5C6662] hover:bg-[#F3F1EA] hover:text-[#2D3633] flex items-center gap-2"
                    >
                      <Compass className="w-3.5 h-3.5 text-[#4A6741]" />
                      <span>My Permits ({bookingsCount})</span>
                    </button>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenSavedDrawer();
                      }}
                      className="w-full text-left px-4 py-2 text-[#5C6662] hover:bg-[#F3F1EA] hover:text-[#2D3633] flex items-center gap-2"
                    >
                      <Heart className="w-3.5 h-3.5 text-[#8B5E3C]" />
                      <span>Saved Treks ({savedCount})</span>
                    </button>
                    <div className="border-t border-[#E8E4D9] my-1" />
                    <button
                      id="logout-btn"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-4 py-2 text-[#8B5E3C] hover:bg-[#F3F1EA] flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="nav-signin-btn"
                onClick={onOpenAuth}
                className="bg-[#4A6741] hover:bg-[#3D5636] text-[#FDFCF7] font-bold px-3.5 py-2 rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#5C6662] hover:text-[#2D3633] rounded-lg hover:bg-[#F3F1EA]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-[#E8E4D9] space-y-3">
            {/* Mobile search */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#8B9691] absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search treks, forts across India..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#F3F1EA] border border-[#E8E4D9] rounded-xl text-[#2D3633] placeholder-[#8B9691] focus:outline-none focus:ring-2 focus:ring-[#4A6741]"
              />
            </div>

            {/* Mobile Region Tabs */}
            <select
              value={selectedState}
              onChange={(e) => { onSelectState(e.target.value); setMobileMenuOpen(false); }}
              className="w-full bg-[#2D3633] border border-[#3D5636] rounded-xl px-3 py-2.5 text-sm font-semibold text-[#C8D6B9] focus:outline-none"
            >
              <option value="">🇮🇳 All India</option>
              {ALL_STATE_NAMES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            {/* Mobile Weather Radar Button */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLiveWeather();
              }}
              className="w-full py-3 px-3 bg-[#4A6741]/15 text-[#2D4F1E] font-bold text-xs rounded-xl flex items-center justify-center gap-2 border border-[#4A6741]/30 min-h-[44px]"
            >
              <CloudSun className="w-4 h-4 text-[#4A6741]" />
              <span>Live Weather Radar</span>
            </button>

            {/* Mobile Map Button */}
            {onOpenMap && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenMap();
                }}
                className="w-full py-3 px-3 bg-[#F3F1EA] text-[#2D3633] font-bold text-xs rounded-xl flex items-center justify-center gap-2 border border-[#E8E4D9] min-h-[44px]"
              >
                <Map className="w-4 h-4 text-[#4A6741]" />
                <span>Trek Route Map & Directions</span>
              </button>
            )}

          </div>
        )}
      </div>
    </header>
  );
};
