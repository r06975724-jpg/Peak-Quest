import React, { useEffect, useRef, useState } from 'react';
import { Booking, Destination, DestinationType, Difficulty, Review, Season, Trek, UserProfile } from './types';
import { TREKS_DATA, INITIAL_REVIEWS } from './data/treks';
import { DESTINATIONS_DATA } from './data/destinations';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FilterBar } from './components/FilterBar';
import { TrekCard } from './components/TrekCard';
import { TrekDetailModal } from './components/TrekDetailModal';
import { DestinationDetailModal } from './components/DestinationDetailModal';
import { BookingModal } from './components/BookingModal';
import { AuthModal } from './components/AuthModal';
import { MyBookingsDrawer } from './components/MyBookingsDrawer';
import { SavedDrawer } from './components/SavedDrawer';
import { TrailSafetySection } from './components/TrailSafetySection';
import { Footer } from './components/Footer';
import { ChatAssistant } from './components/ChatAssistant';
import { LiveWeatherModal } from './components/LiveWeatherModal';
import { TrekMapModal } from './components/TrekMapModal';
import { Check, Compass } from 'lucide-react';
import { supabase } from './lib/supabase';

// ---------------------------------------------------------------------------
// Local-storage helper (used for non-auth data: bookings, reviews, saved)
// ---------------------------------------------------------------------------
const stored = <T,>(key: string, fallback: T): T => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

export default function App() {
  const [treks] = useState<Trek[]>(TREKS_DATA);
  const [destinations] = useState<Destination[]>(DESTINATIONS_DATA);

  // Demo booking so the My Bookings drawer isn't empty on first visit
  const demoBooking: Booking = {
    id: 'demo-b1', bookingCode: 'PQ-HP-74829', trekId: 'triund-trek',
    trekName: 'Triund Trail & Snowline Ridge', trekRegion: 'Himachal Pradesh',
    trekImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
    selectedBatchDate: '12 Sep - 13 Sep 2026', trekkersCount: 2,
    primaryContact: { name: 'Peak Quest Trekker', email: 'hello@peakquest.in', phone: '+91 98765 43210', emergencyContact: '+91 98765 43211' },
    trekkerDetails: [{ name: 'Peak Quest Trekker', age: 26, gender: 'Other' }],
    rentedGearIds: [], basePriceINR: 5000, gearTotalINR: 0, discountINR: 0,
    taxINR: 250, totalPriceINR: 5250, status: 'Confirmed',
    bookedAt: '20 Aug 2026', paymentMethod: 'UPI',
  };

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------
  const [reviews, setReviews] = useState<Review[]>(() => stored<Review[]>('peakquest_reviews', INITIAL_REVIEWS));
  const [bookings, setBookings] = useState<Booking[]>(() => stored<Booking[]>('peakquest_bookings', [demoBooking]));
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => stored<UserProfile | null>('peakquest_current_user', null));
  const [savedIds, setSavedIds] = useState<string[]>(() => stored<string[]>('peakquest_saved_treks', []));

  // Filter state
  const [state, setState] = useState<string>('');
  const [type, setType] = useState<DestinationType | 'All'>('All');
  const [difficulty, setDifficulty] = useState<Difficulty | 'All'>('All');
  const [season, setSeason] = useState<Season | 'All'>('All');
  const [maxPrice, setMaxPrice] = useState(50000);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'altitude' | 'rating'>('featured');

  // Modal / drawer open state
  const [activeTrek, setActiveTrek] = useState<Trek | null>(null);
  const [activeDestination, setActiveDestination] = useState<Destination | null>(null);
  const [bookingTrek, setBookingTrek] = useState<Trek | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [bookingsOpen, setBookingsOpen] = useState(false);
  const [savedOpen, setSavedOpen] = useState(false);
  const [weatherOpen, setWeatherOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [weatherId, setWeatherId] = useState<string | undefined>();
  const [mapId, setMapId] = useState<string | undefined>();
  const [toast, setToast] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);

  const section = useRef<HTMLDivElement>(null);

  // ---------------------------------------------------------------------------
  // Supabase: restore session on page load + listen for auth state changes
  // ---------------------------------------------------------------------------
  useEffect(() => {
    // Restore session if user was previously signed in via Supabase
    try {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const u = session.user;
          setCurrentUser({
            id: u.id,
            name: u.user_metadata?.full_name || u.email?.split('@')[0] || 'Trekker',
            email: u.email ?? '',
            phone: u.user_metadata?.phone || '+91 98765 43210',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
              u.user_metadata?.full_name || u.email?.split('@')[0] || 'T'
            )}&background=4A6741&color=FDFCF7&size=120`,
            authMethod: 'email',
            savedTreks: [],
            experienceLevel: 'Intermediate',
          });
        }
      }).catch(() => {
        // Supabase network unreachable; preserves local storage user
      });
    } catch {}

    // Listen for future sign-in / sign-out events
    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
          const u = session.user;
          setCurrentUser({
            id: u.id,
            name: u.user_metadata?.full_name || u.email?.split('@')[0] || 'Trekker',
            email: u.email ?? '',
            phone: u.user_metadata?.phone || '+91 98765 43210',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
              u.user_metadata?.full_name || u.email?.split('@')[0] || 'T'
            )}&background=4A6741&color=FDFCF7&size=120`,
            authMethod: 'email',
            savedTreks: [],
            experienceLevel: 'Intermediate',
          });
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
        }
      });

      return () => subscription?.unsubscribe();
    } catch {}
  }, []);

  // ---------------------------------------------------------------------------
  // Persist non-auth data to localStorage
  // ---------------------------------------------------------------------------
  useEffect(() => { try { localStorage.setItem('peakquest_reviews', JSON.stringify(reviews)); } catch {} }, [reviews]);
  useEffect(() => { try { localStorage.setItem('peakquest_bookings', JSON.stringify(bookings)); } catch {} }, [bookings]);
  useEffect(() => { try { localStorage.setItem('peakquest_saved_treks', JSON.stringify(savedIds)); } catch {} }, [savedIds]);
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('peakquest_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('peakquest_current_user');
      }
    } catch {}
  }, [currentUser]);

  // Geolocation
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (p) => setLocation({ lat: p.coords.latitude, lon: p.coords.longitude }),
        () => {
          setLocation({ lat: 18.5204, lon: 73.8567 });
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------
  const notify = (message: string) => { setToast(message); setTimeout(() => setToast(null), 3000); };
  const scroll = () => section.current?.scrollIntoView({ behavior: 'smooth' });

  const handleLogout = async () => {
    try { await supabase.auth.signOut(); } catch {}
    try { localStorage.removeItem('peakquest_current_user'); } catch {}
    setCurrentUser(null);
    notify('You have been signed out.');
  };

  const linked = (d: Destination) => treks.find((t) => t.id === d.linkedTrekId);
  const select = (d: Destination) => { const trek = linked(d); trek ? setActiveTrek(trek) : setActiveDestination(d); };
  const openWeather = (x?: Trek | Destination | string) => { setWeatherId(typeof x === 'string' ? x : x?.id); setWeatherOpen(true); };
  const openMap = (x?: Trek | Destination | string) => { setMapId(typeof x === 'string' ? x : x?.id); setMapOpen(true); };

  const toggleSave = (id: string) => {
    const destination = destinations.find((d) => d.id === id || d.linkedTrekId === id);
    const keys = [id, destination?.id, destination?.linkedTrekId].filter(Boolean) as string[];
    setSavedIds((ids) =>
      ids.some((value) => keys.includes(value))
        ? ids.filter((value) => !keys.includes(value))
        : [...ids, destination?.id || id]
    );
  };

  // ---------------------------------------------------------------------------
  // Filtering & sorting
  // ---------------------------------------------------------------------------

  // Determine if user has applied any active search/filter
  const isFiltering = !!(search || state || type !== 'All' || difficulty !== 'All' || season !== 'All' || maxPrice < 50000 || sortBy !== 'featured');

  const results = destinations
    .filter((d) => {
      const trek = linked(d);
      const q = search.toLowerCase();
      const price = trek?.discountedPriceINR || trek?.startingPriceINR || 0;

      // When no filters are active, show only featured/popular treks on homepage
      if (!isFiltering && !d.featured) return false;

      return (
        (!state || d.state === state) &&
        (type === 'All' || d.type === type) &&
        (difficulty === 'All' || d.difficulty === difficulty) &&
        (season === 'All' || d.bestSeasons?.includes(season)) &&
        price <= maxPrice &&
        (!q || [d.name, d.state, d.district, d.description, d.type].some((v) => v.toLowerCase().includes(q)))
      );
    })
    .sort((a, b) => {
      const at = linked(a), bt = linked(b);
      const ap = at?.discountedPriceINR || at?.startingPriceINR || 0;
      const bp = bt?.discountedPriceINR || bt?.startingPriceINR || 0;
      if (sortBy === 'price-asc') return ap - bp;
      if (sortBy === 'price-desc') return bp - ap;
      if (sortBy === 'altitude') return (b.altitudeM || 0) - (a.altitudeM || 0);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return Number(!!b.featured) - Number(!!a.featured);
    });

  const reset = () => { setState(''); setType('All'); setDifficulty('All'); setSeason('All'); setMaxPrice(50000); setSearch(''); setSortBy('featured'); };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#FDFCF7] text-[#2D3633] flex flex-col">
      <Navbar
        selectedState={state} onSelectState={setState}
        searchQuery={search} onSearchChange={setSearch}
        currentUser={currentUser} onOpenAuth={() => setAuthOpen(true)} onLogout={handleLogout}
        savedCount={savedIds.length} bookingsCount={bookings.length}
        onOpenMyBookings={() => setBookingsOpen(true)} onOpenSavedDrawer={() => setSavedOpen(true)}
        onOpenLiveWeather={() => openWeather()} onOpenMap={() => openMap()}
      />

      <HeroSection
        selectedState={state} onSelectState={setState}
        onScrollToTreks={scroll} totalTreksCount={destinations.length}
        searchQuery={search} onOpenWeather={openWeather} onOpenMap={() => openMap()}
      />

      <main ref={section} className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full">
        <div className="mb-8">
          <span className="text-xs font-bold text-[#2D4F1E] uppercase tracking-wider">
            {isFiltering ? 'Search Results' : 'Popular Picks'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">
            {isFiltering
              ? (state ? `${state} Discoveries` : `${results.length} Trek${results.length !== 1 ? 's' : ''} Found`)
              : 'Popular Treks & Destinations'}
          </h2>
          <p className="text-[#5C6662] text-sm mt-1">
            {isFiltering
              ? 'Showing all matching results. Clear filters to see popular picks.'
              : 'Handpicked top-rated treks across India. Use search or filters to discover more.'}
          </p>
        </div>

        <FilterBar
          selectedState={state} onSelectState={setState}
          selectedType={type} onSelectType={setType}
          selectedDifficulty={difficulty} onSelectDifficulty={setDifficulty}
          selectedSeason={season} onSelectSeason={setSeason}
          maxPrice={maxPrice} onMaxPriceChange={setMaxPrice}
          sortBy={sortBy} onSortByChange={setSortBy}
          onResetFilters={reset} resultsCount={results.length}
        />

        <div className="mt-8">
          {results.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
              {results.map((d) => {
                const trek = linked(d);
                return (
                  <TrekCard
                    key={d.id} trek={trek} destination={d}
                    onSelect={() => select(d)}
                    onQuickBook={() => trek && setBookingTrek(trek)}
                    isSaved={savedIds.includes(d.id) || (!!trek && savedIds.includes(trek.id))}
                    onToggleSave={toggleSave}
                    onOpenWeather={() => openWeather(d)} onOpenMap={() => openMap(d)}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <Compass className="mx-auto text-[#4A6741]" />
              <p className="font-bold mt-3">No matching destinations</p>
              <button onClick={reset} className="mt-3 text-sm text-[#2D4F1E] underline">Reset filters</button>
            </div>
          )}
        </div>
      </main>

      <TrailSafetySection />
      <Footer onSelectRegion={(r) => { setState(r === 'All' ? '' : r); scroll(); }} onOpenAuth={() => setAuthOpen(true)} />

      {/* Modals & Drawers */}
      {activeTrek && (
        <TrekDetailModal
          trek={activeTrek} isOpen onClose={() => setActiveTrek(null)}
          onOpenBooking={(t) => { setActiveTrek(null); setBookingTrek(t); }}
          reviews={reviews} onAddReview={(r) => setReviews([r, ...reviews])}
          currentUser={currentUser} onOpenAuth={() => setAuthOpen(true)}
          isSaved={savedIds.includes(activeTrek.id) || destinations.some((d) => d.linkedTrekId === activeTrek.id && savedIds.includes(d.id))}
          onToggleSave={toggleSave}
          onOpenLiveWeather={(t) => openWeather(t.id)} onOpenMap={(t) => openMap(t.id)}
        />
      )}
      {activeDestination && (
        <DestinationDetailModal
          destination={activeDestination} isOpen onClose={() => setActiveDestination(null)}
          onOpenWeather={(d) => { setActiveDestination(null); openWeather(d); }}
          onOpenMap={(d) => { setActiveDestination(null); openMap(d); }}
        />
      )}
      {bookingTrek && (
        <BookingModal
          trek={bookingTrek} isOpen onClose={() => setBookingTrek(null)}
          currentUser={currentUser} onOpenAuth={() => setAuthOpen(true)}
          onBookingSuccess={(b) => { setBookings([b, ...bookings]); notify(`Booking ${b.bookingCode} confirmed!`); }}
        />
      )}

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} onAuthSuccess={setCurrentUser} />
      <MyBookingsDrawer isOpen={bookingsOpen} onClose={() => setBookingsOpen(false)} bookings={bookings} onCancelBooking={(id) => setBookings(bookings.filter((b) => b.id !== id))} />
      <SavedDrawer
        isOpen={savedOpen} onClose={() => setSavedOpen(false)}
        savedTreks={destinations.filter((d) => savedIds.includes(d.id) || (!!d.linkedTrekId && savedIds.includes(d.linkedTrekId)))}
        onSelectTrek={(item) => { if ('startingPriceINR' in item) setActiveTrek(item); else select(item); }}
        onRemoveSaved={(id) => setSavedIds((ids) => ids.filter((value) => value !== id && !destinations.some((d) => d.id === id && d.linkedTrekId === value)))}
      />
      <LiveWeatherModal isOpen={weatherOpen} onClose={() => setWeatherOpen(false)} treks={treks} destinations={destinations} initialTrekId={weatherId} onSelectTrek={(d) => { setWeatherOpen(false); select(d); }} onBookTrek={setBookingTrek} />
      <TrekMapModal isOpen={mapOpen} onClose={() => setMapOpen(false)} treks={treks} destinations={destinations} initialTrekId={mapId} selectedState={state || undefined} userLocation={location} onBookTrek={setBookingTrek} />
      <ChatAssistant treks={treks} onSelectTrek={setActiveTrek} onBookTrek={setBookingTrek} />

      {toast && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 bg-[#1E2822] text-white px-4 py-3 rounded-xl text-xs flex gap-2 shadow-xl max-w-[90vw]">
          <Check className="w-4 h-4 text-[#86EFAC] shrink-0" />
          {toast}
        </div>
      )}
    </div>
  );
}
