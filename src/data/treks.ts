import { Trek, GearRentalItem, Review } from '../types';

export const GEAR_RENTALS: GearRentalItem[] = [
  {
    id: 'poles',
    name: 'Trekking Poles (Pair)',
    pricePerDayINR: 150,
    icon: 'Compass',
    description: 'Anti-shock carbon-aluminum telescoping poles with ergonomic grips.'
  },
  {
    id: 'jacket',
    name: '-10°C Down Feather Jacket',
    pricePerDayINR: 350,
    icon: 'Shield',
    description: 'High-loft insulated water-resistant winter summit parka.'
  },
  {
    id: 'microspikes',
    name: 'Snow Grips / Microspikes',
    pricePerDayINR: 200,
    icon: 'Footprints',
    description: 'Stainless steel crampons for hard-packed snow and icy trails.'
  },
  {
    id: 'poncho',
    name: 'Heavy-Duty Rain Poncho & Bag Cover',
    pricePerDayINR: 100,
    icon: 'CloudRain',
    description: '100% waterproof seam-sealed rain protection for trekker & 60L rucksack.'
  },
  {
    id: 'gaiters',
    name: 'Waterproof Snow Gaiters',
    pricePerDayINR: 120,
    icon: 'ShieldCheck',
    description: 'High-ankle breathable gaiters to keep snow, scree, and mud out of boots.'
  },
  {
    id: 'headlamp',
    name: '300-Lumen LED Headlamp',
    pricePerDayINR: 90,
    icon: 'Sun',
    description: 'Rechargeable multi-beam headlamp essential for summit day night pushes.'
  }
];

export const TREKS_DATA: Trek[] = [
  {
    id: 'triund-trek',
    name: 'Triund Trail & Snowline Ridge',
    slug: 'triund-trail-himachal',
    tagline: 'The Crown Jewel of Dharamshala with panoramic views of Dhauladhar',
    region: 'Himachal Pradesh',
    state: 'Himachal Pradesh',
    district: 'Kangra',
    baseCamp: 'McLeodganj / Dharamshala',
    durationDays: 2,
    durationNights: 1,
    distanceKm: 18,
    maxAltitudeM: 2828,
    maxAltitudeFt: 9278,
    difficulty: 'Easy',
    startingPriceINR: 5000,
    discountedPriceINR: 5000,
    bestSeasons: ['Spring', 'Summer', 'Autumn'],
    bestMonths: ['March', 'April', 'May', 'September', 'October', 'November'],
    coverImage: '/images/treks/triund.jpg',
    galleryImages: [
      '/images/treks/triund.jpg',
      'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1200&q=80'
    ],
    overview: 'Triund is one of the most picturesque weekend treks in Himachal Pradesh, offering dramatic close-up views of the snow-crested Dhauladhar range rising straight above the lush Kangra Valley. Perfectly suited for beginners and nature enthusiasts.',
    highlights: [
      'Spectacular sunset over the vast Kangra Valley basin',
      'Panoramic 180-degree view of the snow-clad Dhauladhar peaks',
      'Starlit ridge camping with campfire under crystal clear Himalayan skies',
      'Charming pine, oak, and deodar forest walking trails'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Trek from Dharamkot / Galu Temple to Triund Ridge',
        distanceKm: 9,
        altitudeGainLoss: '+1,028 m gain',
        durationHours: '4 - 5 hrs',
        altitudeM: 2828,
        campSite: 'Triund Ridge Meadow Camp',
        description: 'Begin through fragrant mixed forests of oak and deodar. Stop at Magic View Cafe for tea before the final push up the 22 curves to the breathtaking grassy ridge of Triund.',
        highlights: ['Galu Devi Temple', 'Magic View Himalayan Cafe', 'Golden sunset over Kangra']
      },
      {
        day: 2,
        title: 'Triund to Snowline Cafe and Descend to McLeodganj',
        distanceKm: 9,
        altitudeGainLoss: '-1,028 m descent',
        durationHours: '4 hrs',
        altitudeM: 1800,
        campSite: 'Return to McLeodganj',
        description: 'Wake up to sunrise hitting the Dhauladhar massif. Optional short excursion to Snowline Cafe (3,200m) before tracing steps back down to Dharamkot.',
        highlights: ['Morning alpine glow', 'Snowline viewpoint', 'Descent via Bhagsu waterfall trail']
      }
    ],
    elevationProfile: [
      { km: 0, altitudeM: 1800, altitudeFt: 5900, locationName: 'McLeodganj Base', stage: 'Basecamp', description: 'Starting trailhead' },
      { km: 2.5, altitudeM: 2100, altitudeFt: 6890, locationName: 'Galu Devi Temple', stage: 'Trek', description: 'Forest checkpoint' },
      { km: 5.5, altitudeM: 2450, altitudeFt: 8038, locationName: 'Magic View Cafe', stage: 'Trek', description: 'Rest stop & tea house' },
      { km: 9, altitudeM: 2828, altitudeFt: 9278, locationName: 'Triund Top Ridge', stage: 'Camp', description: 'Open ridge campsite' },
      { km: 12, altitudeM: 3200, altitudeFt: 10498, locationName: 'Snowline Cafe', stage: 'Viewpoint' as any, description: 'Highest viewpoint excursion' },
      { km: 18, altitudeM: 1800, altitudeFt: 5900, locationName: 'Dharamkot Finish', stage: 'Basecamp', description: 'Trail conclusion' }
    ],
    waypoints: [
      { id: 'w1', name: 'Galu Temple Checkpoint', altitudeM: 2100, distanceFromStartKm: 2.5, type: 'start', description: 'Permit checking and water refill point.', dayNumber: 1 },
      { id: 'w2', name: 'Magic View Point', altitudeM: 2450, distanceFromStartKm: 5.5, type: 'water', description: 'Historic tea shack established in 1984.', dayNumber: 1 },
      { id: 'w3', name: 'Triund Top Ridge', altitudeM: 2828, distanceFromStartKm: 9.0, type: 'camp', description: 'Wide grassy meadow with view of Mun Peak.', dayNumber: 1 },
      { id: 'w4', name: 'Snowline Glacier Point', altitudeM: 3200, distanceFromStartKm: 12.0, type: 'viewpoint', description: 'Closest point to the perpetual snowline.', dayNumber: 2 },
      { id: 'w5', name: 'Bhagsu Waterfall Exit', altitudeM: 1800, distanceFromStartKm: 18.0, type: 'finish', description: 'Natural waterfall and market exit.', dayNumber: 2 }
    ],
    inclusions: [
      '1 Night alpine tent accommodation on twin/triple sharing',
      'All nutritious vegetarian meals (Day 1 Lunch & Dinner, Day 2 Breakfast)',
      'Certified Himalayan mountain guide and camp leader',
      'Forest department permits and camping fees',
      'First-aid medical kit with portable oximeter and oxygen cylinder support'
    ],
    exclusions: [
      'Transportation to and from McLeodganj base',
      'Personal trekking gear and porter for personal bags',
      'Any snacks, bottled water, or beverages purchased at mountain stalls'
    ],
    fitnessRequirement: 'Basic fitness. Ability to comfortably walk 4 to 5 hours with a 4kg daypack.',
    requiredGear: ['Sturdy hiking shoes', 'Warm fleece layer', 'Waterproof windbreaker', '1L Reusable water bottle', 'UV Sunscreen & hat'],
    rating: 4.8,
    reviewsCount: 142,
    availableBatches: [
      { date: 'Every Saturday & Sunday', availableSlots: 12, guideName: 'Tenzing Negi' },
      { date: '12 Sep - 13 Sep 2026', availableSlots: 8, guideName: 'Vikram Sharma' },
      { date: '19 Sep - 20 Sep 2026', availableSlots: 10, guideName: 'Rohit Katoch' },
      { date: '26 Sep - 27 Sep 2026', availableSlots: 6, guideName: 'Vikram Sharma' }
    ],
    temperatureRange: '8°C to 22°C (Day) / 2°C to 8°C (Night)',
    featured: true
  },
  {
    id: 'nag-tibba-trek',
    name: 'Nag Tibba Summit Trek',
    slug: 'nag-tibba-summit-uttarakhand',
    tagline: 'Highest peak in the lesser Himalayas of Garhwal Uttarakhand',
    region: 'Uttarakhand',
    state: 'Uttarakhand',
    district: 'Tehri Garhwal',
    baseCamp: 'Pantwari / Mussoorie',
    durationDays: 2,
    durationNights: 1,
    distanceKm: 16,
    maxAltitudeM: 3022,
    maxAltitudeFt: 9915,
    difficulty: 'Easy',
    startingPriceINR: 5200,
    discountedPriceINR: 5200,
    bestSeasons: ['Autumn', 'Winter', 'Spring'],
    bestMonths: ['October', 'November', 'December', 'January', 'February', 'March', 'April'],
    coverImage: '/images/treks/nag-tibba.jpg',
    galleryImages: [
      '/images/treks/nag-tibba.jpg',
      'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80'
    ],
    overview: 'Nag Tibba ("Serpent\'s Peak") is an ideal weekend winter summit trek in Uttarakhand. It offers breathtaking panoramic vistas of Bandarpoonch, Swargarohini, Gangotri, and Kedarnath peaks without requiring weeks of acclimatization.',
    highlights: [
      'Clear vistas of the Bandarpoonch and Kedarnath massifs',
      'Dense rhododendron, oak, and cedar forests',
      'Ancient Nag Devta temple steeped in local Garhwali folklore',
      'Crisp snow trails during peak winter months from December to February'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Drive from Dehradun to Pantwari & Trek to Nag Tibba Base Camp',
        distanceKm: 6,
        altitudeGainLoss: '+900 m gain',
        durationHours: '4 hrs',
        altitudeM: 2600,
        campSite: 'Nag Tibba Base Clearing',
        description: 'Start from Pantwari village through rocky goat trails and oak woodlands to reach the peaceful base camp meadow with sunset views.',
        highlights: ['Pantwari Village', 'Oak Forest Trail', 'Base Camp Sunset']
      },
      {
        day: 2,
        title: 'Base Camp to Nag Tibba Summit (3,022m) & Descend to Pantwari',
        distanceKm: 10,
        altitudeGainLoss: '+422 m gain / -1,322 m descent',
        durationHours: '6 hrs',
        altitudeM: 3022,
        campSite: 'Pantwari / Return Drive',
        description: 'Early morning climb to Nag Devta temple followed by the summit ridge. Enjoy 100+ km view of Greater Himalayan peaks before descending.',
        highlights: ['Nag Devta Temple', 'Summit Flag Point', '360° Himalayan Panorama']
      }
    ],
    elevationProfile: [
      { km: 0, altitudeM: 1400, altitudeFt: 4593, locationName: 'Pantwari Village', stage: 'Basecamp', description: 'Trailhead village' },
      { km: 3, altitudeM: 2000, altitudeFt: 6561, locationName: 'Goat Village Ridge', stage: 'Trek', description: 'Terraced fields' },
      { km: 6, altitudeM: 2600, altitudeFt: 8530, locationName: 'Nag Tibba Base Camp', stage: 'Camp', description: 'Alpine clearing camp' },
      { km: 8, altitudeM: 2850, altitudeFt: 9350, locationName: 'Nag Devta Shrine', stage: 'Trek', description: 'Historic mountain shrine' },
      { km: 9.5, altitudeM: 3022, altitudeFt: 9915, locationName: 'Nag Tibba Summit', stage: 'Summit', description: 'Highest Garhwal ridge crest' },
      { km: 16, altitudeM: 1400, altitudeFt: 4593, locationName: 'Pantwari Descent', stage: 'Basecamp', description: 'Return to vehicles' }
    ],
    waypoints: [
      { id: 'nt1', name: 'Pantwari Starting Trail', altitudeM: 1400, distanceFromStartKm: 0, type: 'start', description: 'Garhwali rural village trailhead.', dayNumber: 1 },
      { id: 'nt2', name: 'Nag Tibba Base Clearing', altitudeM: 2600, distanceFromStartKm: 6.0, type: 'camp', description: 'Protected forest camping site.', dayNumber: 1 },
      { id: 'nt3', name: 'Nag Devta Ancient Temple', altitudeM: 2850, distanceFromStartKm: 8.0, type: 'pass', description: 'Stone temple venerated by local shepherds.', dayNumber: 2 },
      { id: 'nt4', name: 'Nag Tibba High Flag Peak', altitudeM: 3022, distanceFromStartKm: 9.5, type: 'summit', description: 'Garhwal summit with Bandarpoonch view.', dayNumber: 2 },
      { id: 'nt5', name: 'Pantwari Base', altitudeM: 1400, distanceFromStartKm: 16.0, type: 'finish', description: 'Conclusion point.', dayNumber: 2 }
    ],
    inclusions: [
      '1 Night dome tent camping on twin/triple sharing with sleeping bags & fleece liners',
      'All meals on trek (1 Breakfast, 2 Lunches, 1 Dinner & evening snacks)',
      'Experienced Garhwali trek leader and local safety guides',
      'Forest entry permits and conservation environmental charges'
    ],
    exclusions: ['Dehradun to Pantwari transport (available as shared add-on)', 'Personal gear hire'],
    fitnessRequirement: 'Beginner friendly. Comfortable for anyone with basic walking stamina.',
    requiredGear: ['Thermal inners', 'Trekking shoes with good tread', 'Warm beanie & gloves', 'Headlamp / Torch'],
    rating: 4.7,
    reviewsCount: 98,
    availableBatches: [
      { date: '12 Sep - 13 Sep 2026', availableSlots: 10, guideName: 'Anil Rawat' },
      { date: '19 Sep - 20 Sep 2026', availableSlots: 14, guideName: 'Surender Singh' },
      { date: '26 Sep - 27 Sep 2026', availableSlots: 8, guideName: 'Anil Rawat' },
      { date: '03 Oct - 04 Oct 2026', availableSlots: 15, guideName: 'Vipin Negi' }
    ],
    temperatureRange: '-2°C to 18°C',
    featured: false
  },
  {
    id: 'kedarkantha-trek',
    name: 'Kedarkantha Winter Summit',
    slug: 'kedarkantha-summit-uttarakhand',
    tagline: 'India\'s most celebrated winter snow peak climb with 360° summit views',
    region: 'Uttarakhand',
    state: 'Uttarakhand',
    district: 'Uttarkashi',
    baseCamp: 'Sankri Village',
    durationDays: 5,
    durationNights: 4,
    distanceKm: 24,
    maxAltitudeM: 3800,
    maxAltitudeFt: 12500,
    difficulty: 'Moderate',
    startingPriceINR: 8750,
    discountedPriceINR: 7999,
    bestSeasons: ['Winter', 'Spring', 'Autumn'],
    bestMonths: ['December', 'January', 'February', 'March', 'April', 'November'],
    coverImage: '/images/treks/kedarkantha.jpg',
    galleryImages: [
      '/images/treks/kedarkantha.jpg',
      'https://images.unsplash.com/photo-1573481078535-f07f2f5cc5e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?auto=format&fit=crop&w=1200&q=80'
    ],
    overview: 'Kedarkantha is celebrated as the quintessential Himalayan winter trek. Standing atop its pyramid peak at 12,500 feet, you are surrounded by an amphitheater of 13 giant peaks including Swargarohini, Black Peak (Kalanag), and Bandarpoonch.',
    highlights: [
      'Classic 360-degree summit sunrise over 13 Himalayan giants',
      'Camping beside the frozen, mythologically revered Juda Ka Talab lake',
      'Pristine pine and maple forest trails coated with powdered snow',
      'Exciting snow slide descents from summit ridge'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Sankri (1,950m) & Briefing',
        distanceKm: 0,
        altitudeGainLoss: 'Basecamp rest',
        durationHours: 'Check-in',
        altitudeM: 1950,
        campSite: 'Sankri Guest Lodge',
        description: 'Check into Sankri lodge. Meet your mountain guide, inspect gear, and enjoy traditional Garhwali dinner.',
        highlights: ['Sankri mountain village', 'Equipment fitting', 'Starry night briefing']
      },
      {
        day: 2,
        title: 'Sankri to Juda Ka Talab (2,775m)',
        distanceKm: 5,
        altitudeGainLoss: '+825 m gain',
        durationHours: '4 - 5 hrs',
        altitudeM: 2775,
        campSite: 'Juda Ka Talab Alpine Camp',
        description: 'Trek through thick pine and oak forests. Arrive at the enchanting frozen lake clearing surrounded by towering silver firs.',
        highlights: ['Dense forest canopies', 'Frozen Juda Ka Talab lake', 'Lakeside tent pitching']
      },
      {
        day: 3,
        title: 'Juda Ka Talab to Kedarkantha Base Camp (3,400m)',
        distanceKm: 4,
        altitudeGainLoss: '+625 m gain',
        durationHours: '3 hrs',
        altitudeM: 3400,
        campSite: 'Kedarkantha Base Camp',
        description: 'A moderate gradient climb passing open snow fields. The pyramid peak of Kedarkantha looms in clear view ahead.',
        highlights: ['Tree line transition', 'First clear view of summit pyramid', 'Summit push preparation']
      },
      {
        day: 4,
        title: 'Summit Push (3,800m) at 3:30 AM & Descend to Hargaon',
        distanceKm: 8,
        altitudeGainLoss: '+400 m summit / -1,150 m descent',
        durationHours: '7 hrs',
        altitudeM: 3800,
        campSite: 'Hargaon Meadow Camp (2,650m)',
        description: 'Headlamp climb to the summit shrine for the sunrise over Swargarohini and Bandarpoonch. Descend via Hargaon meadows.',
        highlights: ['Alpine headlamp trek', 'Lord Shiva summit shrine', 'Golden sunrise over 13 peaks']
      },
      {
        day: 5,
        title: 'Hargaon to Sankri & Departure',
        distanceKm: 7,
        altitudeGainLoss: '-700 m descent',
        durationHours: '3 - 4 hrs',
        altitudeM: 1950,
        campSite: 'Sankri / Dehradun',
        description: 'Pleasant downhill stroll through apple orchards and pine trees back to Sankri for celebration certificates.',
        highlights: ['Apple orchards', 'Certificate handover', 'Farewell lunch']
      }
    ],
    elevationProfile: [
      { km: 0, altitudeM: 1950, altitudeFt: 6397, locationName: 'Sankri Village', stage: 'Basecamp', description: 'Traditional wooden village' },
      { km: 5, altitudeM: 2775, altitudeFt: 9104, locationName: 'Juda Ka Talab', stage: 'Lake', description: 'Iconic frozen lake camp' },
      { km: 9, altitudeM: 3400, altitudeFt: 11155, locationName: 'Kedarkantha Base', stage: 'Camp', description: 'Wind-protected bowl camp' },
      { km: 13, altitudeM: 3800, altitudeFt: 12500, locationName: 'Kedarkantha Summit', stage: 'Summit', description: '360° Himalayan crown peak' },
      { km: 17, altitudeM: 2650, altitudeFt: 8694, locationName: 'Hargaon Meadow', stage: 'Camp', description: 'Grassy clearing' },
      { km: 24, altitudeM: 1950, altitudeFt: 6397, locationName: 'Sankri Base', stage: 'Basecamp', description: 'Trek finish' }
    ],
    waypoints: [
      { id: 'kk1', name: 'Sankri Trailhead', altitudeM: 1950, distanceFromStartKm: 0, type: 'start', description: 'Starting hub for Govind National Park.', dayNumber: 1 },
      { id: 'kk2', name: 'Juda Ka Talab', altitudeM: 2775, distanceFromStartKm: 5.0, type: 'lake', description: 'Sacred mountain lake frozen in winter.', dayNumber: 2 },
      { id: 'kk3', name: 'KK Summit Base Camp', altitudeM: 3400, distanceFromStartKm: 9.0, type: 'camp', description: 'Pre-summit staging ridge.', dayNumber: 3 },
      { id: 'kk4', name: 'Kedarkantha Peak Summit', altitudeM: 3800, distanceFromStartKm: 13.0, type: 'summit', description: 'Shiva trident stone cairn summit.', dayNumber: 4 },
      { id: 'kk5', name: 'Hargaon Hut Clearing', altitudeM: 2650, distanceFromStartKm: 17.0, type: 'camp', description: 'Pine glade campsite.', dayNumber: 4 },
      { id: 'kk6', name: 'Sankri Exit', altitudeM: 1950, distanceFromStartKm: 24.0, type: 'finish', description: 'Permit checkout & return.', dayNumber: 5 }
    ],
    inclusions: [
      '4 Nights accommodation (1 night Sankri guest house + 3 nights 4-season alpine tents)',
      'All meals: Day 1 Dinner through Day 5 Breakfast (organic, high-energy meals)',
      'Experienced IMF certified Trek Leaders, local mountain guides & cook staff',
      'Microspikes, gaiters, safety harnesses and high altitude medical kits',
      'Govind Wildlife Sanctuary permits and environmental camping cess'
    ],
    exclusions: ['Dehradun to Sankri vehicle transfers (can be booked via Peak Quest at ₹1,200/seat)'],
    fitnessRequirement: 'Moderate fitness. Capable of jogging 4 km in under 30 minutes.',
    requiredGear: ['Waterproof trekking boots with ankle support', 'Minus 10°C Down Jacket', '2 Pairs thermal innerwear', 'Fleece gloves & balaclava'],
    rating: 4.9,
    reviewsCount: 312,
    availableBatches: [
      { date: '15 Sep - 19 Sep 2026', availableSlots: 6, guideName: 'Devendra Panwar' },
      { date: '22 Sep - 26 Sep 2026', availableSlots: 12, guideName: 'Mahesh Negi' },
      { date: '01 Oct - 05 Oct 2026', availableSlots: 8, guideName: 'Devendra Panwar' },
      { date: '10 Oct - 14 Oct 2026', availableSlots: 15, guideName: 'Rajesh Chauhan' }
    ],
    temperatureRange: '-8°C to 15°C',
    featured: true
  },
  {
    id: 'hampta-pass-trek',
    name: 'Hampta Pass & Chandratal Lake',
    slug: 'hampta-pass-chandratal-himachal',
    tagline: 'Dramatic cross-over from lush green Kullu Valley to barren desert Spiti',
    region: 'Himachal Pradesh',
    state: 'Himachal Pradesh',
    district: 'Kullu & Lahaul Spiti',
    baseCamp: 'Manali / Jobra',
    durationDays: 5,
    durationNights: 4,
    distanceKm: 28,
    maxAltitudeM: 4287,
    maxAltitudeFt: 14065,
    difficulty: 'Moderate',
    startingPriceINR: 11499,
    discountedPriceINR: 10499,
    bestSeasons: ['Summer', 'Monsoon', 'Autumn'],
    bestMonths: ['June', 'July', 'August', 'September', 'October'],
    coverImage: '/images/treks/hampta-pass.jpg',
    galleryImages: [
      '/images/treks/hampta-pass.jpg',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80'
    ],
    overview: 'No other trek in India showcases such a radical, theatrical landscape shift. You begin in the lush pine forests and floral meadows of Manali, climb over the narrow notch of Hampta Pass (14,065 ft), and suddenly step into the raw, Martian landscapes of Lahaul & Spiti, finished by the turquoise waters of moon-shaped Chandratal Lake.',
    highlights: [
      'Stark landscape transformation from emerald Kullu to desert Lahaul',
      'Crossing glacial melt streams and the high Hampta Pass pass at 14,065 ft',
      'Excursion to high-altitude crescent-shaped Chandratal (Moon Lake)',
      'Camping under the Milky Way at Shea Goru and Balu Ka Ghera'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Manali Drive to Jobra & Trek to Chika (3,100m)',
        distanceKm: 4,
        altitudeGainLoss: '+450 m gain',
        durationHours: '2.5 hrs',
        altitudeM: 3100,
        campSite: 'Chika Alpine Campsite',
        description: 'Drive along 42 hairpin bends to Jobra dam. Gentle trek along Rani Nallah river through pine and birch trees.',
        highlights: ['Jobra dam trailhead', 'Rani Nallah stream', 'Chika waterfall']
      },
      {
        day: 2,
        title: 'Chika to Balu Ka Ghera (3,750m)',
        distanceKm: 8,
        altitudeGainLoss: '+650 m gain',
        durationHours: '5 hrs',
        altitudeM: 3750,
        campSite: 'Balu Ka Ghera ("Bed of Sand")',
        description: 'Crossing glacial streams and boulders into a wide valley bed surrounded by colorful Himalayan wild flora.',
        highlights: ['Jwara river crossing', 'Balu Ka Ghera yellow sand flats', 'View of Indrasan peak']
      },
      {
        day: 3,
        title: 'Balu Ka Ghera over Hampta Pass (4,287m) to Shea Goru (3,900m)',
        distanceKm: 8,
        altitudeGainLoss: '+537 m pass climb / -387 m descent',
        durationHours: '8 hrs',
        altitudeM: 4287,
        campSite: 'Shea Goru ("Cold Oasis")',
        description: 'The pass day! Ascend steep switchbacks onto the snowy ridge of Hampta Pass. Look down into Spiti valley and descend to Shea Goru stream.',
        highlights: ['Hampta Pass summit crest', 'Lahaul panorama', 'Shea Goru riverbed camp']
      },
      {
        day: 4,
        title: 'Shea Goru to Chatru & Drive to Chandratal Lake (4,250m)',
        distanceKm: 6,
        altitudeGainLoss: '-600 m descent + 45 km drive',
        durationHours: '4 hrs trek + 2 hrs drive',
        altitudeM: 4250,
        campSite: 'Chatru / Chandratal Camp',
        description: 'Cross the freezing Shea Goru river in the morning. Descend to Chatru roadhead and drive to turquoise Chandratal lake.',
        highlights: ['Shea Goru glacial ford', 'Chhota Dhara gorge', 'Turquoise Chandratal Lake']
      },
      {
        day: 5,
        title: 'Chatru to Manali via Atal Tunnel',
        distanceKm: 0,
        altitudeGainLoss: 'Return drive 65 km',
        durationHours: '4 hrs drive',
        altitudeM: 2050,
        campSite: 'Manali Mall Road',
        description: 'Drive back through Gramphu, cross into Kullu valley via the engineering marvel Atal Tunnel, arriving in Manali by afternoon.',
        highlights: ['Spiti rock faces', 'Atal Tunnel crossing', 'Arrival in Manali']
      }
    ],
    elevationProfile: [
      { km: 0, altitudeM: 2050, altitudeFt: 6725, locationName: 'Manali Town', stage: 'Basecamp', description: 'Meeting point' },
      { km: 4, altitudeM: 3100, altitudeFt: 10170, locationName: 'Chika Camp', stage: 'Camp', description: 'River valley clearing' },
      { km: 12, altitudeM: 3750, altitudeFt: 12300, locationName: 'Balu Ka Ghera', stage: 'Camp', description: 'Sandy high valley' },
      { km: 16, altitudeM: 4287, altitudeFt: 14065, locationName: 'Hampta Pass Crest', stage: 'Pass', description: 'The grand crossover notch' },
      { km: 22, altitudeM: 3900, altitudeFt: 12795, locationName: 'Shea Goru Camp', stage: 'Camp', description: 'Cold river oasis' },
      { km: 28, altitudeM: 4250, altitudeFt: 13943, locationName: 'Chandratal Lake', stage: 'Lake', description: 'Crescent celestial lake' }
    ],
    waypoints: [
      { id: 'hp1', name: 'Jobra Hydro Dam', altitudeM: 2750, distanceFromStartKm: 0, type: 'start', description: 'Dam bridge where trek begins.', dayNumber: 1 },
      { id: 'hp2', name: 'Chika Campsite', altitudeM: 3100, distanceFromStartKm: 4.0, type: 'camp', description: 'Green boulder meadow.', dayNumber: 1 },
      { id: 'hp3', name: 'Balu Ka Ghera', altitudeM: 3750, distanceFromStartKm: 12.0, type: 'camp', description: 'Base before the pass climb.', dayNumber: 2 },
      { id: 'hp4', name: 'Hampta Pass', altitudeM: 4287, distanceFromStartKm: 16.0, type: 'pass', description: 'Geographic divide between Kullu & Spiti.', dayNumber: 3 },
      { id: 'hp5', name: 'Shea Goru Meadow', altitudeM: 3900, distanceFromStartKm: 22.0, type: 'camp', description: 'Spiti riverside camp.', dayNumber: 3 },
      { id: 'hp6', name: 'Chandratal Lake', altitudeM: 4250, distanceFromStartKm: 28.0, type: 'lake', description: 'Glacial alpine lake.', dayNumber: 4 }
    ],
    inclusions: [
      '4 Nights camping accommodation (triple/twin sharing high alpine tents)',
      'All meals on trek: Morning tea, breakfast, packed lunch, high tea & hot dinner',
      'Experienced High Altitude Trek Leader, Mountain Guide, Cook and helper team',
      'Chandratal permit, vehicle transport from Chatru to Chandratal and back to Manali',
      'Safety equipment: Stretcher, Oxygen cylinder, Oximeter, First Aid'
    ],
    exclusions: ['Backpack offloading fee (optional: ₹1,500 for entire trek)', 'Personal gear rental'],
    fitnessRequirement: 'Good endurance. Ability to run 5 km in 32 minutes and climb stairs without breathlessness.',
    requiredGear: ['High ankle waterproof hiking boots', 'Waterproof rucksack (50-60L)', 'Raincoat / Poncho', 'Warm thermal layers (2 sets)'],
    rating: 4.9,
    reviewsCount: 220,
    availableBatches: [
      { date: '10 Sep - 14 Sep 2026', availableSlots: 8, guideName: 'Sonam Thakur' },
      { date: '18 Sep - 22 Sep 2026', availableSlots: 11, guideName: 'Kartik Bodh' },
      { date: '25 Sep - 29 Sep 2026', availableSlots: 5, guideName: 'Sonam Thakur' },
      { date: '02 Oct - 06 Oct 2026', availableSlots: 12, guideName: 'Anup Verma' }
    ],
    temperatureRange: '1°C to 18°C',
    featured: true
  },
  {
    id: 'beas-kund-trek',
    name: 'Beas Kund Glacial Lake',
    slug: 'beas-kund-himachal',
    tagline: 'Trek to the holy origin of River Beas surrounded by Hanuman Tibba & Friendship Peak',
    region: 'Himachal Pradesh',
    state: 'Himachal Pradesh',
    district: 'Kullu',
    baseCamp: 'Solang Valley / Manali',
    durationDays: 3,
    durationNights: 2,
    distanceKm: 16,
    maxAltitudeM: 3810,
    maxAltitudeFt: 12500,
    difficulty: 'Easy',
    startingPriceINR: 6500,
    discountedPriceINR: 5999,
    bestSeasons: ['Summer', 'Autumn', 'Spring'],
    bestMonths: ['May', 'June', 'July', 'September', 'October'],
    coverImage: '/images/treks/beas-kund.jpg',
    galleryImages: [
      '/images/treks/beas-kund.jpg',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1596195689404-24d8a8d1c6ea?auto=format&fit=crop&w=1200&q=80'
    ],
    overview: 'Beas Kund is a pristine high-altitude alpine lake cradled beneath towering 6,000-meter giants like Hanuman Tibba, Friendship Peak, and Ladakhi Peak. Legend holds that Sage Vyas meditated here while authoring the Mahabharata.',
    highlights: [
      'Glacial amphitheater with towering 6000m Pir Panjal summits',
      'Emerald blue waters of the sacred Beas Kund lake',
      'Rich alpine flower grasslands of Bakarthach',
      'Short 3-day duration suitable for families and first-time high altitude trekkers'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Manali drive to Dhundi (2,840m) & Trek to Bakarthach (3,300m)',
        distanceKm: 5,
        altitudeGainLoss: '+460 m gain',
        durationHours: '4 hrs',
        altitudeM: 3300,
        campSite: 'Bakarthach Alpine Meadow',
        description: 'Trek along the river through birch (bhojpatra) and spruce forests to the expansive pastures of Bakarthach where mountaineers train.',
        highlights: ['Dhundi river gorge', 'Bhojpatra ancient forest', 'Bakarthach sheep meadow']
      },
      {
        day: 2,
        title: 'Bakarthach to Beas Kund (3,810m) & Return to Camp',
        distanceKm: 6,
        altitudeGainLoss: '+510 m gain / -510 m return',
        durationHours: '5 - 6 hrs',
        altitudeM: 3810,
        campSite: 'Bakarthach Campsite',
        description: 'Ascend the moraine ridge to discover the hidden emerald lake of Beas Kund at the base of the massive hanging glaciers.',
        highlights: ['Moraine traverse', 'Beas Kund Lake', 'Close view of Hanuman Tibba']
      },
      {
        day: 3,
        title: 'Bakarthach to Dhundi & Drive back to Manali',
        distanceKm: 5,
        altitudeGainLoss: '-460 m descent',
        durationHours: '3 hrs',
        altitudeM: 2050,
        campSite: 'Manali',
        description: 'Gentle descent following the roaring Beas stream back to Dhundi and drive to Manali.',
        highlights: ['Wildflower trail', 'Mountain stream crossings', 'Return to Manali']
      }
    ],
    elevationProfile: [
      { km: 0, altitudeM: 2840, altitudeFt: 9317, locationName: 'Dhundi Trailhead', stage: 'Basecamp', description: 'Forest road end' },
      { km: 5, altitudeM: 3300, altitudeFt: 10826, locationName: 'Bakarthach Meadow', stage: 'Camp', description: 'Shepherd high camp' },
      { km: 8, altitudeM: 3810, altitudeFt: 12500, locationName: 'Beas Kund Lake', stage: 'Lake', description: 'Sacred glacial lake' },
      { km: 11, altitudeM: 3300, altitudeFt: 10826, locationName: 'Bakarthach Return', stage: 'Camp', description: 'Overnight meadow' },
      { km: 16, altitudeM: 2840, altitudeFt: 9317, locationName: 'Dhundi Exit', stage: 'Basecamp', description: 'Trek end' }
    ],
    waypoints: [
      { id: 'bk1', name: 'Dhundi Checkpoint', altitudeM: 2840, distanceFromStartKm: 0, type: 'start', description: 'Trailhead beyond Solang.', dayNumber: 1 },
      { id: 'bk2', name: 'Bakarthach Camping Ground', altitudeM: 3300, distanceFromStartKm: 5.0, type: 'camp', description: 'Grassy alpine camp.', dayNumber: 1 },
      { id: 'bk3', name: 'Beas Kund Sacred Lake', altitudeM: 3810, distanceFromStartKm: 8.0, type: 'lake', description: 'Glacial origin of Beas river.', dayNumber: 2 },
      { id: 'bk4', name: 'Dhundi Base', altitudeM: 2840, distanceFromStartKm: 16.0, type: 'finish', description: 'Vehicle parking and return.', dayNumber: 3 }
    ],
    inclusions: [
      '2 Nights dome tent camping with insulated sleeping mats',
      'Nutritious meals on all trek days',
      'Mountaineering certified guide and support staff',
      'Forest entry fee & safety gear'
    ],
    exclusions: ['Personal porter expenses', 'Pick up from Manali hotel to Dhundi'],
    fitnessRequirement: 'Basic fitness. Great starter trek.',
    requiredGear: ['Sturdy hiking shoes', 'Fleece jacket', 'Rainwear', 'Sun hat'],
    rating: 4.8,
    reviewsCount: 110,
    availableBatches: [
      { date: '11 Sep - 13 Sep 2026', availableSlots: 10, guideName: 'Ravi Sen' },
      { date: '18 Sep - 20 Sep 2026', availableSlots: 12, guideName: 'Ravi Sen' },
      { date: '25 Sep - 27 Sep 2026', availableSlots: 8, guideName: 'Kishore Thakur' }
    ],
    temperatureRange: '4°C to 20°C',
    featured: false
  },
  {
    id: 'valley-of-flowers-trek',
    name: 'Valley of Flowers & Hemkund Sahib',
    slug: 'valley-of-flowers-uttarakhand',
    tagline: 'UNESCO World Heritage botanical wonderland carpeted with 500+ species of wild flora',
    region: 'Uttarakhand',
    state: 'Uttarakhand',
    district: 'Chamoli',
    baseCamp: 'Govindghat / Ghangaria',
    durationDays: 6,
    durationNights: 5,
    distanceKm: 38,
    maxAltitudeM: 4329,
    maxAltitudeFt: 14200,
    difficulty: 'Moderate',
    startingPriceINR: 12900,
    discountedPriceINR: 11800,
    bestSeasons: ['Monsoon', 'Summer'],
    bestMonths: ['July', 'August', 'September'],
    coverImage: '/images/treks/valley-of-flowers.jpg',
    galleryImages: [
      '/images/treks/valley-of-flowers.jpg',
      'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1200&q=80'
    ],
    overview: 'A UNESCO World Heritage National Park nestled in the Chamoli Garhwal Himalayas. Between July and September, the high glacial valley bursts into a kaleidoscope of colors with rare Himalayan blue poppies, Brahma Kamals, orchids, and anemones, complemented by a pilgrimage trek to high altitude Hemkund Sahib.',
    highlights: [
      'Wandering through fields of over 500 endemic botanical Himalayan wildflowers',
      'Visiting the pristine high-altitude glacial lake and shrine of Hemkund Sahib (14,200 ft)',
      'Gushing Pushpawati river canyon and roaring waterfalls',
      'Comfortable lodge stays in Ghangaria village without wilderness tenting constraints'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Rishikesh drive to Govindghat / Poolna (1,920m)',
        distanceKm: 0,
        altitudeGainLoss: 'Scenic drive 270 km',
        durationHours: '9 hrs drive',
        altitudeM: 1920,
        campSite: 'Govindghat Hotel',
        description: 'Drive alongside Devprayag (confluence of Alaknanda & Bhagirathi) to reach Govindghat.',
        highlights: ['Panchprayag confluences', 'Alaknanda river canyon']
      },
      {
        day: 2,
        title: 'Poolna to Ghangaria (3,050m)',
        distanceKm: 10,
        altitudeGainLoss: '+1,130 m gain',
        durationHours: '5 - 6 hrs',
        altitudeM: 3050,
        campSite: 'Ghangaria Guest Lodge',
        description: 'Well-paved trail ascending along the roaring Lakshman Ganga river through coniferous forests.',
        highlights: ['Lakshman Ganga cascade', 'Ghangaria alpine village']
      },
      {
        day: 3,
        title: 'Ghangaria to Valley of Flowers (3,600m) and back',
        distanceKm: 8,
        altitudeGainLoss: '+550 m gain / -550 m descent',
        durationHours: '6 hrs',
        altitudeM: 3600,
        campSite: 'Ghangaria Guest Lodge',
        description: 'Enter the UNESCO National Park. Explore the carpet of Brahma Kamal, Blue Poppy, and Joan Margaret Legge\'s memorial.',
        highlights: ['Blue Poppy & Cobra Lily blooms', 'Pushpawati riverbed', 'Mount Rataban backdrop']
      },
      {
        day: 4,
        title: 'Ghangaria to Hemkund Sahib (4,329m) and back',
        distanceKm: 12,
        altitudeGainLoss: '+1,279 m gain / -1,279 m descent',
        durationHours: '7 - 8 hrs',
        altitudeM: 4329,
        campSite: 'Ghangaria Guest Lodge',
        description: 'Steep zig-zag trail up to the sacred crystal clear lake surrounded by 7 snow-clad peaks and the highest Gurudwara in the world.',
        highlights: ['Hemkund glacial lake', 'Hot langar & tea at 14,200 ft', 'Rare Brahma Kamal blooms']
      },
      {
        day: 5,
        title: 'Ghangaria to Poolna & Drive to Govindghat / Badrinath',
        distanceKm: 10,
        altitudeGainLoss: '-1,130 m descent',
        durationHours: '4 hrs',
        altitudeM: 1920,
        campSite: 'Govindghat Hotel',
        description: 'Descend to Poolna and drive to Govindghat. Optional afternoon excursion to Badrinath shrine and Mana (India\'s first village).',
        highlights: ['Mana village', 'Bhim Pul', 'Badrinath temple']
      },
      {
        day: 6,
        title: 'Govindghat to Rishikesh Departure',
        distanceKm: 0,
        altitudeGainLoss: 'Return drive',
        durationHours: '9 hrs drive',
        altitudeM: 340,
        campSite: 'Rishikesh',
        description: 'Drive back along the Ganges to Rishikesh to conclude the unforgettable pilgrimage.',
        highlights: ['Rishikesh Ganga Aarti']
      }
    ],
    elevationProfile: [
      { km: 0, altitudeM: 1920, altitudeFt: 6299, locationName: 'Govindghat / Poolna', stage: 'Basecamp', description: 'Roadhead' },
      { km: 10, altitudeM: 3050, altitudeFt: 10006, locationName: 'Ghangaria Village', stage: 'Camp', description: 'Central base lodge' },
      { km: 14, altitudeM: 3600, altitudeFt: 11811, locationName: 'Valley of Flowers Core', stage: 'Trek', description: 'Botanical haven' },
      { km: 22, altitudeM: 4329, altitudeFt: 14200, locationName: 'Hemkund Sahib Lake', stage: 'Lake', description: 'Sacred glacial lake' },
      { km: 38, altitudeM: 1920, altitudeFt: 6299, locationName: 'Poolna Exit', stage: 'Basecamp', description: 'Trek finish' }
    ],
    waypoints: [
      { id: 'vof1', name: 'Poolna Trailhead', altitudeM: 1920, distanceFromStartKm: 0, type: 'start', description: 'Vehicle parking and pony station.', dayNumber: 2 },
      { id: 'vof2', name: 'Ghangaria Hub', altitudeM: 3050, distanceFromStartKm: 10.0, type: 'camp', description: 'Base for both Valley and Hemkund.', dayNumber: 2 },
      { id: 'vof3', name: 'Valley of Flowers Checkpoint', altitudeM: 3350, distanceFromStartKm: 12.0, type: 'pass', description: 'UNESCO National Park gate.', dayNumber: 3 },
      { id: 'vof4', name: 'Hemkund Sahib Glacial Lake', altitudeM: 4329, distanceFromStartKm: 22.0, type: 'lake', description: 'High altitude pilgrimage lake.', dayNumber: 4 },
      { id: 'vof5', name: 'Poolna Return Gate', altitudeM: 1920, distanceFromStartKm: 38.0, type: 'finish', description: 'Trek completion.', dayNumber: 5 }
    ],
    inclusions: [
      '5 Nights hotel & guest lodge accommodation on twin/triple sharing',
      'All meals on trek: Breakfast, packed lunch during excursions, hot evening dinner',
      'UNESCO National Park entry permits and camera permissions',
      'Experienced Senior Trek Leader and Wilderness First Responder certified guide'
    ],
    exclusions: ['Pony / porter services for personal baggage', 'Personal raincoats and boots'],
    fitnessRequirement: 'Moderate endurance. Capable of walking 10 km daily on undulating terrain.',
    requiredGear: ['Sturdy waterproof boots (Vibram sole recommended)', 'Quality rain poncho / gore-tex jacket', 'Trekking poles'],
    rating: 4.95,
    reviewsCount: 285,
    availableBatches: [
      { date: '05 Jul - 10 Jul 2026', availableSlots: 6, guideName: 'Harish Bhandari' },
      { date: '18 Jul - 23 Jul 2026', availableSlots: 10, guideName: 'Rameshwar Bisht' },
      { date: '02 Aug - 07 Aug 2026', availableSlots: 8, guideName: 'Harish Bhandari' },
      { date: '15 Aug - 20 Aug 2026', availableSlots: 14, guideName: 'Rameshwar Bisht' }
    ],
    temperatureRange: '9°C to 20°C',
    featured: true
  },
  {
    id: 'brahmatal-trek',
    name: 'Brahmatal Frozen Lake & Ridge',
    slug: 'brahmatal-uttarakhand',
    tagline: 'Witness grand panoramic views of Mount Trishul & Nanda Ghunti with secluded frozen alpine lakes',
    region: 'Uttarakhand',
    state: 'Uttarakhand',
    district: 'Chamoli',
    baseCamp: 'Lohajung',
    durationDays: 6,
    durationNights: 5,
    distanceKm: 22,
    maxAltitudeM: 3734,
    maxAltitudeFt: 12250,
    difficulty: 'Moderate',
    startingPriceINR: 9450,
    discountedPriceINR: 8750,
    bestSeasons: ['Winter', 'Spring', 'Autumn'],
    bestMonths: ['December', 'January', 'February', 'March', 'April', 'November'],
    coverImage: '/images/treks/brahmatal.jpg',
    galleryImages: [
      '/images/treks/brahmatal.jpg',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=1200&q=80'
    ],
    overview: 'Brahmatal is among the rare winter treks in India offering continuous, unobstructed face-to-face vistas of Mount Trishul (7,120m) and Nanda Ghunti (6,309m). Trekkers witness two glacial lakes—Bekaltal and Brahmatal—cradled in snow-clad wilderness.',
    highlights: [
      'Front-row theatrical view of Mt. Trishul\'s 7000m sheer vertical rock face',
      'Camping beside Bekaltal and the sacred frozen lake of Brahmatal',
      'Strolling along the expansive snowy ridgeline above 12,000 feet',
      'Rich oak and scarlet rhododendron forests'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Rishikesh / Kathgodam to Lohajung (2,300m)',
        distanceKm: 0,
        altitudeGainLoss: 'Drive 220 km',
        durationHours: '8 hrs drive',
        altitudeM: 2300,
        campSite: 'Lohajung Guest House',
        description: 'Scenic mountain drive alongside Pindar river to the vibrant trekking hub of Lohajung.',
        highlights: ['Gwaldam valley view', 'Lohajung base briefing']
      },
      {
        day: 2,
        title: 'Lohajung to Bekaltal (2,950m)',
        distanceKm: 6,
        altitudeGainLoss: '+650 m gain',
        durationHours: '4 - 5 hrs',
        altitudeM: 2950,
        campSite: 'Bekaltal Forest Camp',
        description: 'Trek through Mandoli village and dense oak woods to the emerald green Bekaltal lake.',
        highlights: ['Mandoli wooden homes', 'Bekaltal lake reflections']
      },
      {
        day: 3,
        title: 'Bekaltal to Brahmatal (3,200m)',
        distanceKm: 5,
        altitudeGainLoss: '+250 m gain',
        durationHours: '4 hrs',
        altitudeM: 3200,
        campSite: 'Brahmatal Meadow Camp',
        description: 'Climb above tree line onto the snow meadows of Jhandi Top with panoramic views of Roopkund trail peaks.',
        highlights: ['Jhandi Top ridge', 'First view of Mt. Trishul']
      },
      {
        day: 4,
        title: 'Brahmatal to Brahmatal Pass (3,734m) & Descend to Khorwekhet',
        distanceKm: 7,
        altitudeGainLoss: '+534 m pass / -600 m descent',
        durationHours: '6 - 7 hrs',
        altitudeM: 3734,
        campSite: 'Khorwekhet Clearing',
        description: 'Pass the frozen Brahmatal lake and reach the ridge summit for a majestic view of Trishul, Nanda Ghunti, and Chaukhamba.',
        highlights: ['Frozen Brahmatal lake', 'Trishul massif in 4K clarity', 'Ridge walk']
      },
      {
        day: 5,
        title: 'Khorwekhet to Lohajung',
        distanceKm: 4,
        altitudeGainLoss: '-800 m descent',
        durationHours: '3 hrs',
        altitudeM: 2300,
        campSite: 'Lohajung Lodge',
        description: 'Descend through Malling forest back into Lohajung village for celebrations.',
        highlights: ['Malling village trail', 'Certificate distribution']
      },
      {
        day: 6,
        title: 'Lohajung to Rishikesh / Kathgodam',
        distanceKm: 0,
        altitudeGainLoss: 'Return drive',
        durationHours: '8 hrs drive',
        altitudeM: 340,
        campSite: 'Rishikesh',
        description: 'Drive back to Rishikesh/Kathgodam with memories of the great Himalayan peaks.',
        highlights: ['Himalayan souvenir shopping']
      }
    ],
    elevationProfile: [
      { km: 0, altitudeM: 2300, altitudeFt: 7545, locationName: 'Lohajung Base', stage: 'Basecamp', description: 'Starting hub' },
      { km: 6, altitudeM: 2950, altitudeFt: 9678, locationName: 'Bekaltal Lake', stage: 'Lake', description: 'Hidden forest lake' },
      { km: 11, altitudeM: 3200, altitudeFt: 10498, locationName: 'Brahmatal Meadow', stage: 'Camp', description: 'Snow meadow campsite' },
      { km: 15, altitudeM: 3734, altitudeFt: 12250, locationName: 'Brahmatal Pass Peak', stage: 'Pass', description: 'Face-to-face with Mt. Trishul' },
      { km: 22, altitudeM: 2300, altitudeFt: 7545, locationName: 'Lohajung Return', stage: 'Basecamp', description: 'Trek finish' }
    ],
    waypoints: [
      { id: 'bt1', name: 'Lohajung Village', altitudeM: 2300, distanceFromStartKm: 0, type: 'start', description: 'Base village in Chamoli.', dayNumber: 1 },
      { id: 'bt2', name: 'Bekaltal Lake', altitudeM: 2950, distanceFromStartKm: 6.0, type: 'lake', description: 'Sacred lake in the woods.', dayNumber: 2 },
      { id: 'bt3', name: 'Jhandi Top Point', altitudeM: 3300, distanceFromStartKm: 9.0, type: 'viewpoint', description: 'Windy viewing ridge.', dayNumber: 3 },
      { id: 'bt4', name: 'Brahmatal Frozen Lake', altitudeM: 3400, distanceFromStartKm: 13.0, type: 'lake', description: 'Where Lord Brahma meditated.', dayNumber: 4 },
      { id: 'bt5', name: 'Brahmatal Summit Pass', altitudeM: 3734, distanceFromStartKm: 15.0, type: 'summit', description: 'Grand Mt. Trishul viewpoint.', dayNumber: 4 },
      { id: 'bt6', name: 'Lohajung Finish', altitudeM: 2300, distanceFromStartKm: 22.0, type: 'finish', description: 'Return point.', dayNumber: 5 }
    ],
    inclusions: [
      '5 Nights accommodation (2 nights Lohajung guest house + 3 nights alpine snow tents)',
      'All meals on trek: 3 Hot meals daily + evening soup and snacks',
      'Certified Mountain Leader, Cook, Kitchen helpers and Mule support',
      'Microspikes, gaiters, 4-season high altitude sleeping bags (-10°C rated)'
    ],
    exclusions: ['Transportation to and from Lohajung base', 'Personal porter services'],
    fitnessRequirement: 'Moderate. Ability to walk 5-6 hours in sub-zero snow conditions.',
    requiredGear: ['Sturdy waterproof high-ankle snow shoes', 'Minus 10°C Feather Down Jacket', 'Fleece thermals', 'UV Snow Goggles'],
    rating: 4.85,
    reviewsCount: 178,
    availableBatches: [
      { date: '20 Sep - 25 Sep 2026', availableSlots: 8, guideName: 'Trilok Singh' },
      { date: '04 Oct - 09 Oct 2026', availableSlots: 12, guideName: 'Trilok Singh' },
      { date: '18 Oct - 23 Oct 2026', availableSlots: 10, guideName: 'Kalyan Negi' },
      { date: '01 Nov - 06 Nov 2026', availableSlots: 15, guideName: 'Kalyan Negi' }
    ],
    temperatureRange: '-7°C to 12°C',
    featured: false
  },
  {
    id: 'pin-bhaba-pass-trek',
    name: 'Pin Bhaba Pass: Kinnaur to Spiti',
    slug: 'pin-bhaba-pass-himachal',
    tagline: 'The most dramatic high crossover pass from the green Kinnaur valley into the cold Martian deserts of Spiti',
    region: 'Himachal Pradesh',
    state: 'Himachal Pradesh',
    district: 'Kinnaur & Lahaul Spiti',
    baseCamp: 'Kafnu / Shimla',
    durationDays: 7,
    durationNights: 6,
    distanceKm: 51,
    maxAltitudeM: 4915,
    maxAltitudeFt: 16125,
    difficulty: 'Difficult',
    startingPriceINR: 19800,
    discountedPriceINR: 18500,
    bestSeasons: ['Summer', 'Monsoon', 'Autumn'],
    bestMonths: ['July', 'August', 'September', 'October'],
    coverImage: '/images/treks/pin-bhaba.jpg',
    galleryImages: [
      '/images/treks/pin-bhaba.jpg',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'
    ],
    overview: 'Pin Bhaba is considered the grandest crossover pass in the Indian Himalayas. Starting from the lush apple orchards and dense cedar forests of Bhaba Valley in Kinnaur, you climb to an astonishing 16,125 feet before plunging into the purple and ochre desert canyons of Pin Valley in Spiti.',
    highlights: [
      'Staggering high-altitude crossover at 16,125 feet (4,915 m)',
      'The lush green velvet meadows of Kara and Mulling in Bhaba Valley',
      'Pin Valley National Park, famous for wild ibex and rare snow leopards',
      'Exploration of ancient Tibetan monasteries in Mudh and Kaza'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Shimla drive to Kafnu (2,400m)',
        distanceKm: 0,
        altitudeGainLoss: 'Scenic drive 200 km',
        durationHours: '7 hrs drive',
        altitudeM: 2400,
        campSite: 'Kafnu Guest Lodge',
        description: 'Drive along the Satluj river through Rampur Bushahr to the hydro village of Kafnu.',
        highlights: ['Satluj river gorge', 'Kafnu hydro project']
      },
      {
        day: 2,
        title: 'Kafnu to Mulling (3,280m)',
        distanceKm: 11,
        altitudeGainLoss: '+880 m gain',
        durationHours: '6 hrs',
        altitudeM: 3280,
        campSite: 'Mulling Green Meadow',
        description: 'Walk through thick silver birch, pine and oak forests into a magical open meadow surrounded by granite cliffs.',
        highlights: ['Bhaba river trail', 'Mulling open meadow']
      },
      {
        day: 3,
        title: 'Mulling to Kara (3,550m)',
        distanceKm: 6,
        altitudeGainLoss: '+270 m gain',
        durationHours: '4 hrs',
        altitudeM: 3550,
        campSite: 'Kara Alpine Clearing',
        description: 'Pass subterranean waterfalls and vibrant wildflower fields grazing flocks of Gaddi sheep.',
        highlights: ['Subterranean waterfall', 'Kara shepherd pastures']
      },
      {
        day: 4,
        title: 'Kara to Phutsirang (4,100m) - Bhaba Base Camp',
        distanceKm: 5,
        altitudeGainLoss: '+550 m gain',
        durationHours: '4 hrs',
        altitudeM: 4100,
        campSite: 'Phutsirang High Camp',
        description: 'River crossings and ascent into high moraine terrain with views of three mountain passes.',
        highlights: ['Three-pass junction', 'Phutsirang high camp']
      },
      {
        day: 5,
        title: 'Phutsirang over Pin Bhaba Pass (4,915m) to Mangrungse (4,150m)',
        distanceKm: 12,
        altitudeGainLoss: '+815 m pass / -765 m descent',
        durationHours: '9 hrs',
        altitudeM: 4915,
        campSite: 'Mangrungse River Camp',
        description: 'Steep glacier and scree climb to the razor-sharp crest of Pin Bhaba Pass. Instantaneous contrast into Pin Valley.',
        highlights: ['16,125 ft Pass Crest', 'Lush Kinnaur meets Desert Spiti', 'Pin Valley multicolored scree']
      },
      {
        day: 6,
        title: 'Mangrungse to Mudh (3,750m) & Drive to Kaza',
        distanceKm: 17,
        altitudeGainLoss: '-400 m descent',
        durationHours: '6 hrs',
        altitudeM: 3750,
        campSite: 'Kaza Guest Lodge',
        description: 'Walk along the red clay and stone riverbeds of Pin River into the postcard village of Mudh.',
        highlights: ['Mudh Spiti village', 'Tara Guest House momos', 'Drive to Kaza']
      },
      {
        day: 7,
        title: 'Kaza to Manali via Kunzum Pass & Atal Tunnel',
        distanceKm: 0,
        altitudeGainLoss: 'Return drive 200 km',
        durationHours: '8 hrs drive',
        altitudeM: 2050,
        campSite: 'Manali',
        description: 'High-altitude drive over Kunzum Pass (4,551m) and Rohtang/Atal Tunnel to conclude in Manali.',
        highlights: ['Kunzum Mata temple', 'Chandra river gorge', 'Arrival in Manali']
      }
    ],
    elevationProfile: [
      { km: 0, altitudeM: 2400, altitudeFt: 7874, locationName: 'Kafnu Village', stage: 'Basecamp', description: 'Kinnaur valley start' },
      { km: 11, altitudeM: 3280, altitudeFt: 10761, locationName: 'Mulling Meadow', stage: 'Camp', description: 'Pine meadow' },
      { km: 17, altitudeM: 3550, altitudeFt: 11646, locationName: 'Kara Grasslands', stage: 'Camp', description: 'Alpine pastures' },
      { km: 22, altitudeM: 4100, altitudeFt: 13451, locationName: 'Phutsirang High Base', stage: 'Camp', description: 'Pass base camp' },
      { km: 28, altitudeM: 4915, altitudeFt: 16125, locationName: 'Pin Bhaba Pass Crest', stage: 'Pass', description: '16,125 ft High crossover divide' },
      { km: 40, altitudeM: 4150, altitudeFt: 13615, locationName: 'Mangrungse Camp', stage: 'Camp', description: 'Pin valley camp' },
      { km: 51, altitudeM: 3750, altitudeFt: 12303, locationName: 'Mudh Village', stage: 'Basecamp', description: 'Spiti finish village' }
    ],
    waypoints: [
      { id: 'pb1', name: 'Kafnu Hydro Station', altitudeM: 2400, distanceFromStartKm: 0, type: 'start', description: 'Bhaba river trailhead.', dayNumber: 2 },
      { id: 'pb2', name: 'Mulling Meadow', altitudeM: 3280, distanceFromStartKm: 11.0, type: 'camp', description: 'Expansive grassy meadow.', dayNumber: 2 },
      { id: 'pb3', name: 'Kara Shepherds Plain', altitudeM: 3550, distanceFromStartKm: 17.0, type: 'camp', description: 'Stream intersection.', dayNumber: 3 },
      { id: 'pb4', name: 'Phutsirang Base Camp', altitudeM: 4100, distanceFromStartKm: 22.0, type: 'camp', description: 'Pre-pass high altitude staging.', dayNumber: 4 },
      { id: 'pb5', name: 'Pin Bhaba Pass Summit', altitudeM: 4915, distanceFromStartKm: 28.0, type: 'pass', description: 'Border marker between Kinnaur and Spiti.', dayNumber: 5 },
      { id: 'pb6', name: 'Mudh Ancient Village', altitudeM: 3750, distanceFromStartKm: 51.0, type: 'finish', description: 'Spitian village surrounded by pea fields.', dayNumber: 6 }
    ],
    inclusions: [
      '6 Nights accommodation (2 nights guest lodge + 4 nights wilderness high-altitude dome tents)',
      'All gourmet expedition meals prepared by high-altitude cooks',
      'Experienced IMF-certified expedition leaders and local Spitian/Kinnauri mountain guides',
      'Safety equipment: Gamow bag, pulse oximeters, emergency oxygen canisters, satellite trackers',
      'Kaza to Manali vehicle transport across Kunzum Pass'
    ],
    exclusions: ['Shimla to Kafnu transport', 'Personal gear rental'],
    fitnessRequirement: 'High endurance required. Previous high-altitude trek experience recommended.',
    requiredGear: ['Sturdy 4-season trekking boots', 'Waterproof windcheater jacket and pant', 'Down jacket (-15°C)', 'Thermal base layers'],
    rating: 4.96,
    reviewsCount: 164,
    availableBatches: [
      { date: '12 Jul - 18 Jul 2026', availableSlots: 4, guideName: 'Chhering Dorje' },
      { date: '26 Jul - 01 Aug 2026', availableSlots: 7, guideName: 'Chhering Dorje' },
      { date: '09 Aug - 15 Aug 2026', availableSlots: 5, guideName: 'Padma Namgyal' },
      { date: '23 Aug - 29 Aug 2026', availableSlots: 8, guideName: 'Padma Namgyal' }
    ],
    temperatureRange: '-5°C to 16°C',
    featured: true
  },
  {
    id: 'har-ki-dun-trek',
    name: 'Har Ki Dun: Valley of Gods',
    slug: 'har-ki-dun-uttarakhand',
    tagline: 'Ancient cradle valley of Garhwal rich in Pandava mythology and Swargarohini views',
    region: 'Uttarakhand',
    state: 'Uttarakhand',
    district: 'Uttarkashi',
    baseCamp: 'Sankri / Taluka',
    durationDays: 6,
    durationNights: 5,
    distanceKm: 47,
    maxAltitudeM: 3566,
    maxAltitudeFt: 11700,
    difficulty: 'Moderate',
    startingPriceINR: 11200,
    discountedPriceINR: 10500,
    bestSeasons: ['Spring', 'Summer', 'Autumn', 'Winter'],
    bestMonths: ['April', 'May', 'June', 'September', 'October', 'November', 'December'],
    coverImage: '/images/treks/har-ki-dun.jpg',
    galleryImages: [
      '/images/treks/har-ki-dun.jpg',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'
    ],
    overview: 'Har Ki Dun ("Valley of Gods") is a hanging river valley in Govind Ballabh Pant National Park. Trekkers walk past centuries-old wooden villages like Osla and Gangad, gazing upon the dramatic Swargarohini peak, believed to be the stairway to heaven taken by Yudhishthira and his dog.',
    highlights: [
      'Unmatched view of the Swargarohini I, II, III and Jaundhar Glacier',
      'Ancient 2000-year-old wooden temples with intricate Garhwali carving in Osla',
      'Walking along the gushing Supin river through walnut, chestnut, and deodar forests',
      'Excursion to Maninda Tal and Jaundhar Glacier viewpoint'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Sankri (1,950m)',
        distanceKm: 0,
        altitudeGainLoss: 'Check-in & Briefing',
        durationHours: 'Overnight lodge',
        altitudeM: 1950,
        campSite: 'Sankri Guest House',
        description: 'Acclimatization, equipment verification and route briefing.',
        highlights: ['Sankri sunset', 'Expedition team meet']
      },
      {
        day: 2,
        title: 'Sankri drive to Taluka & Trek to Pauni Garaat (2,500m)',
        distanceKm: 10,
        altitudeGainLoss: '+400 m gain',
        durationHours: '5 hrs',
        altitudeM: 2500,
        campSite: 'Pauni Garaat Riverside Camp',
        description: 'Trek along the emerald Supin river crossing suspension bridges and passing terraced red amaranth fields.',
        highlights: ['Taluka village bridge', 'Gangaad wooden settlement', 'Riverside camp']
      },
      {
        day: 3,
        title: 'Pauni Garaat to Kalkattiyadhar (2,950m) via Osla Village',
        distanceKm: 8,
        altitudeGainLoss: '+450 m gain',
        durationHours: '5 hrs',
        altitudeM: 2950,
        campSite: 'Kalkattiyadhar Meadow Camp',
        description: 'Visit the ancient wooden temple village of Osla before ascending to the open grassy ridge of Kalkattiyadhar.',
        highlights: ['Osla Someshwar temple', 'View of Dhaula Dhar ridges']
      },
      {
        day: 4,
        title: 'Kalkattiyadhar to Har Ki Dun (3,566m) & Maninda Tal Excursion',
        distanceKm: 9,
        altitudeGainLoss: '+616 m gain / -616 m return',
        durationHours: '7 hrs',
        altitudeM: 3566,
        campSite: 'Kalkattiyadhar Camp',
        description: 'Enter the grand amphitheater of Har Ki Dun. Towering face of Swargarohini rises straight ahead with Jaundhar Glacier.',
        highlights: ['Har Ki Dun valley basin', 'Swargarohini stairway peaks', 'Maninda Tal lake']
      },
      {
        day: 5,
        title: 'Kalkattiyadhar to Pauni Garaat',
        distanceKm: 8,
        altitudeGainLoss: '-450 m descent',
        durationHours: '4 hrs',
        altitudeM: 2500,
        campSite: 'Pauni Garaat Camp',
        description: 'Retrace paths along the Supin river, spending time with local Himalayan artisans.',
        highlights: ['Handwoven Garhwali shawls', 'Supin river stroll']
      },
      {
        day: 6,
        title: 'Pauni Garaat to Taluka & Drive to Sankri',
        distanceKm: 10,
        altitudeGainLoss: '-400 m descent',
        durationHours: '4 hrs',
        altitudeM: 1950,
        campSite: 'Sankri / Dehradun',
        description: 'Descend to Taluka roadhead and drive to Sankri for celebration banquet.',
        highlights: ['Farewell celebration', 'Certificate award']
      }
    ],
    elevationProfile: [
      { km: 0, altitudeM: 1950, altitudeFt: 6397, locationName: 'Sankri / Taluka', stage: 'Basecamp', description: 'Starting valley' },
      { km: 10, altitudeM: 2500, altitudeFt: 8202, locationName: 'Pauni Garaat', stage: 'Camp', description: 'Riverside clearing' },
      { km: 18, altitudeM: 2950, altitudeFt: 9678, locationName: 'Osla & Kalkattiya', stage: 'Camp', description: 'Ancient heritage village' },
      { km: 27, altitudeM: 3566, altitudeFt: 11700, locationName: 'Har Ki Dun Basin', stage: 'Pass', description: 'Valley of the Gods' },
      { km: 47, altitudeM: 1950, altitudeFt: 6397, locationName: 'Taluka Exit', stage: 'Basecamp', description: 'Trek finish' }
    ],
    waypoints: [
      { id: 'hkd1', name: 'Taluka Trailhead', altitudeM: 2100, distanceFromStartKm: 0, type: 'start', description: 'Suspension bridge gate.', dayNumber: 2 },
      { id: 'hkd2', name: 'Osla Village & Temple', altitudeM: 2600, distanceFromStartKm: 14.0, type: 'pass', description: 'Centuries-old Garhwali heritage village.', dayNumber: 3 },
      { id: 'hkd3', name: 'Kalkattiyadhar Camp', altitudeM: 2950, distanceFromStartKm: 18.0, type: 'camp', description: 'Open high meadow with peak views.', dayNumber: 3 },
      { id: 'hkd4', name: 'Har Ki Dun Valley Basin', altitudeM: 3566, distanceFromStartKm: 27.0, type: 'summit', description: 'Under the foot of Swargarohini.', dayNumber: 4 },
      { id: 'hkd5', name: 'Taluka Return', altitudeM: 2100, distanceFromStartKm: 47.0, type: 'finish', description: 'Conclusion.', dayNumber: 6 }
    ],
    inclusions: [
      '5 Nights accommodation (1 night Sankri lodge + 4 nights alpine camping)',
      'All fresh vegetarian mountain meals with evening tea and snacks',
      'Certified mountain guides, cooks, porters, and mule luggage support',
      'Govind National Park wildlife permits and local village eco-tax'
    ],
    exclusions: ['Dehradun to Sankri road transfers (available as add-on)'],
    fitnessRequirement: 'Moderate fitness. Able to walk 8-10 km comfortably across rolling paths.',
    requiredGear: ['Sturdy hiking shoes', 'Fleece jackets', 'Rain gear', 'Trekking poles'],
    rating: 4.88,
    reviewsCount: 195,
    availableBatches: [
      { date: '14 Sep - 19 Sep 2026', availableSlots: 8, guideName: 'Bhupendra Chauhan' },
      { date: '28 Sep - 03 Oct 2026', availableSlots: 12, guideName: 'Bhupendra Chauhan' },
      { date: '12 Oct - 17 Oct 2026', availableSlots: 7, guideName: 'Ranjeet Rawat' },
      { date: '26 Oct - 31 Oct 2026', availableSlots: 14, guideName: 'Ranjeet Rawat' }
    ],
    temperatureRange: '2°C to 18°C',
    featured: false
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    trekId: 'triund-trek',
    authorName: 'Aarav Mehta',
    authorEmail: 'aarav.m@example.com',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    authorLocation: 'Chandigarh, India',
    rating: 5,
    date: '14 Aug 2026',
    title: 'Unbelievable sunset and starry night over Dhauladhar!',
    comment: 'Booked Triund for ₹5,000 INR through Peak Quest. The trek leader Tenzing was extremely courteous and knowledgeable. The tents at the ridge were clean and warm, and waking up to the Dhauladhar wall glowing in morning light was an experience of a lifetime.',
    verifiedTrekker: true,
    helpfulCount: 28,
    trailCondition: 'Dry and well-marked',
    recommendedSeason: 'Autumn'
  },
  {
    id: 'rev-2',
    trekId: 'kedarkantha-trek',
    authorName: 'Priya Sundaram',
    authorEmail: 'priya.s@example.com',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    authorLocation: 'Bengaluru, India',
    rating: 5,
    date: '02 Aug 2026',
    title: 'The 3:30 AM summit push was magical',
    comment: 'Kedarkantha is worth every single step. Standing at 12,500 ft with Swargarohini glowing pink during sunrise will bring tears to your eyes. The camp food was exceptionally delicious and hot tea on summit day was a lifesaver!',
    verifiedTrekker: true,
    helpfulCount: 45,
    trailCondition: 'Snow on summit ridge',
    recommendedSeason: 'Winter'
  },
  {
    id: 'rev-3',
    trekId: 'hampta-pass-trek',
    authorName: 'Rohan Deshmukh',
    authorEmail: 'rohan.d@example.com',
    authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
    authorLocation: 'Pune, India',
    rating: 5,
    date: '28 Jul 2026',
    title: 'The landscape contrast blew my mind',
    comment: 'You cross the Hampta Pass at 14,000 feet and suddenly you are on another planet! Lahaul and Chandratal lake were so surreal. Peak Quest safety measures, oximeter checks twice daily, and rented down jackets made it super smooth.',
    verifiedTrekker: true,
    helpfulCount: 39,
    trailCondition: 'Some glacial water crossings',
    recommendedSeason: 'Summer / Monsoon'
  },
  {
    id: 'rev-4',
    trekId: 'valley-of-flowers-trek',
    authorName: 'Ananya Sen',
    authorEmail: 'ananya.sen@example.com',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    authorLocation: 'Kolkata, India',
    rating: 5,
    date: '10 Aug 2026',
    title: 'A true fairy tale valley in the clouds',
    comment: 'Saw thousands of Blue Poppies and rare alpine flora. The Hemkund Sahib climb was steep but the hot halwa and tea at the high Gurudwara revived us completely. Highly recommend Peak Quest for Uttarakhand treks!',
    verifiedTrekker: true,
    helpfulCount: 33,
    trailCondition: 'Wet trails with occasional mist',
    recommendedSeason: 'Monsoon (July-August)'
  },
  {
    id: 'rev-5',
    trekId: 'nag-tibba-trek',
    authorName: 'Siddharth Kaul',
    authorEmail: 'sid.kaul@example.com',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    authorLocation: 'Delhi NCR, India',
    rating: 4,
    date: '18 Jul 2026',
    title: 'Best weekend getaway from Delhi for ₹5,200',
    comment: 'Left Delhi Friday night, summited Nag Tibba on Sunday morning with clear Bandarpoonch views, and was back home Sunday night. Super cost-effective, great local Garhwali guides, clean tents.',
    verifiedTrekker: true,
    helpfulCount: 19,
    trailCondition: 'Clear and pleasant',
    recommendedSeason: 'Autumn / Winter'
  }
];
