import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { DESTINATIONS_DATA } from './src/data/destinations';

// Load .env.local first (user keys override defaults)
dotenv.config({ path: '.env.local' });
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '3000', 10);
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

const HIMALAYAN_EXPEDITION_CONTEXT = `
You are "Assistant", the official AI Trekking & High-Altitude Mountain Guide for Peak Quest.
Peak Quest specializes in curated, IMF-certified Himalayan expeditions in Himachal Pradesh and Uttarakhand with prices starting from ₹5,000 INR.
The platform now also helps users discover trekking routes and historic forts across all Indian states and union territories; detailed booking support is currently limited to the nine featured expeditions below.

Here is the exact catalog of expeditions hosted on Peak Quest:
1. Triund Trail & Snowline Ridge (Himachal Pradesh, Kangra/Dharamshala, 2 Days, 2,828m, Easy, ₹5,000 INR)
   - Highlights: Dhauladhar range view, sunset over Kangra valley, beginner-friendly weekend trek.
2. Hampta Pass & Chandratal Lake (Himachal Pradesh, Manali to Spiti, 5 Days, 4,287m, Moderate, ₹10,499 INR)
   - Highlights: Dramatic landscape crossover from green Kullu valley to barren Spiti desert, Shea Goru camp, Chandratal glacial moon lake.
3. Beas Kund Glacial Lake (Himachal Pradesh, Solang/Manali, 3 Days, 3,810m, Easy-Moderate, ₹5,999 INR)
   - Highlights: Source of the sacred Beas River, views of Hanuman Tibba, Friendship Peak, and Ladakhi Peak.
4. Pin Bhaba Pass (Himachal Pradesh, Kinnaur to Spiti, 8 Days, 4,915m, Difficult, ₹18,500 INR)
   - Highlights: Dense Bhaba river valley crossing over into cold Spiti desert moonscape at nearly 5,000 meters.
5. Nag Tibba Summit (Uttarakhand, Mussoorie/Pantwari, 2 Days, 3,022m, Easy, ₹5,200 INR)
   - Highlights: Serpent's Peak summit, panoramic 100km view of Swargarohini, Bandarpoonch, Kedarnath peaks.
6. Kedarkantha Winter Summit (Uttarakhand, Sankri/Govind Wildlife, 5 Days, 3,810m, Easy-Moderate, ₹7,999 INR)
   - Highlights: Iconic 360-degree snow summit push, Juda Ka Talab alpine frozen pond, starlit camping.
7. Valley of Flowers & Hemkund Sahib (Uttarakhand, Govindghat/Chamoli, 6 Days, 4,329m, Moderate, ₹11,800 INR)
   - Highlights: UNESCO World Heritage floral meadows (500+ blooming species in Monsoon), holy Hemkund glacial lake.
8. Har Ki Dun - Valley of Gods (Uttarakhand, Sankri/Garhwal, 7 Days, 3,566m, Moderate, ₹10,500 INR)
   - Highlights: Ancient mythological cradle of the Pandavas, views of Swargarohini I-III peaks, traditional wooden villages of Osla.
9. Brahmatal Frozen Lake & Ridge (Uttarakhand, Lohajung/Chamoli, 6 Days, 3,840m, Moderate, ₹8,750 INR)
   - Highlights: High ridge walk with direct face-to-face views of Mt. Trishul (7,120m) and Mt. Nanda Ghunti.

Gear Rentals Available (INR per day):
- Trekking Poles: ₹150/day
- -10°C Down Jacket: ₹350/day
- Microspikes/Crampons: ₹200/day
- Heavy-Duty Poncho: ₹100/day
- Snow Gaiters: ₹120/day
- 300-Lumen Headlamp: ₹90/day

Key Guidelines for Assistant:
- Personality: Knowledgeable, safety-first, encouraging, crisp, structured, and passionate about Himalayan trails.
- Always quote prices in Indian Rupees (₹ INR).
- Help users match their fitness level (beginner vs experienced), available days (weekend 2-day vs weeklong), preferred region (Himachal vs Uttarakhand), and current season (Spring, Summer, Monsoon, Autumn, Winter).
- Provide practical trail advice (acclimatization, hydration, AMS prevention, clothing layering, gear rentals).
- Format responses cleanly with bold headings, clear bullet points, and concise summaries.
`;

// Trek geographical coordinates and elevation metadata for Himalayan trails
const TREK_LOCATIONS: Record<string, { name: string; region: string; lat: number; lon: number; altitudeM: number; baseCamp: string }> = {
  'triund-trek': { name: 'Triund Trail & Snowline Ridge', region: 'Himachal Pradesh', lat: 32.257, lon: 76.354, altitudeM: 2828, baseCamp: 'McLeodganj' },
  'hampta-pass': { name: 'Hampta Pass & Chandratal Lake', region: 'Himachal Pradesh', lat: 32.292, lon: 77.368, altitudeM: 4287, baseCamp: 'Jobra / Manali' },
  'beas-kund': { name: 'Beas Kund Glacial Lake', region: 'Himachal Pradesh', lat: 32.365, lon: 77.087, altitudeM: 3810, baseCamp: 'Solang Nallah' },
  'pin-bhaba-pass': { name: 'Pin Bhaba Pass', region: 'Himachal Pradesh', lat: 31.841, lon: 78.024, altitudeM: 4915, baseCamp: 'Kafnu / Kinnaur' },
  'nag-tibba': { name: 'Nag Tibba Summit', region: 'Uttarakhand', lat: 30.584, lon: 78.151, altitudeM: 3022, baseCamp: 'Pantwari / Mussoorie' },
  'kedarkantha-trek': { name: 'Kedarkantha Winter Summit', region: 'Uttarakhand', lat: 31.071, lon: 78.183, altitudeM: 3810, baseCamp: 'Sankri' },
  'valley-of-flowers': { name: 'Valley of Flowers & Hemkund Sahib', region: 'Uttarakhand', lat: 30.728, lon: 79.589, altitudeM: 4329, baseCamp: 'Govindghat' },
  'har-ki-dun': { name: 'Har Ki Dun - Valley of Gods', region: 'Uttarakhand', lat: 31.144, lon: 78.418, altitudeM: 3566, baseCamp: 'Sankri' },
  'brahmatal-trek': { name: 'Brahmatal Frozen Lake & Ridge', region: 'Uttarakhand', lat: 30.138, lon: 79.572, altitudeM: 3840, baseCamp: 'Lohajung' },
};

// Rich Trek records use the explicit `-trek` suffix; retain legacy aliases while
// ensuring direct trekId weather requests resolve to the correct coordinates.
Object.assign(TREK_LOCATIONS, {
  'hampta-pass-trek': TREK_LOCATIONS['hampta-pass'],
  'beas-kund-trek': TREK_LOCATIONS['beas-kund'],
  'pin-bhaba-pass-trek': TREK_LOCATIONS['pin-bhaba-pass'],
  'nag-tibba-trek': TREK_LOCATIONS['nag-tibba'],
  'valley-of-flowers-trek': TREK_LOCATIONS['valley-of-flowers'],
});

function interpretWeatherCode(code: number): { condition: string; icon: string; severity: 'optimal' | 'moderate' | 'caution' | 'hazardous' } {
  switch (code) {
    case 0:
      return { condition: 'Clear Sky & High Visibility', icon: 'Sun', severity: 'optimal' };
    case 1:
    case 2:
      return { condition: 'Partly Cloudy with Good Visibility', icon: 'CloudSun', severity: 'optimal' };
    case 3:
      return { condition: 'Overcast Ridge Clouds', icon: 'Cloud', severity: 'moderate' };
    case 45:
    case 48:
      return { condition: 'Dense Mountain Fog / Low Visibility', icon: 'CloudFog', severity: 'caution' };
    case 51:
    case 53:
    case 55:
      return { condition: 'Light High-Altitude Drizzle', icon: 'CloudDrizzle', severity: 'moderate' };
    case 61:
    case 63:
    case 65:
      return { condition: 'Rain & Wet Trail Conditions', icon: 'CloudRain', severity: 'caution' };
    case 71:
    case 73:
    case 75:
      return { condition: 'Snowfall / Fresh Snow Accumulation', icon: 'Snowflake', severity: 'caution' };
    case 77:
      return { condition: 'Snow Grains / Freezing Flurries', icon: 'Snowflake', severity: 'caution' };
    case 80:
    case 81:
    case 82:
      return { condition: 'Heavy Rain Showers', icon: 'CloudRain', severity: 'caution' };
    case 85:
    case 86:
      return { condition: 'Heavy Alpine Snow Showers', icon: 'Snowflake', severity: 'hazardous' };
    case 95:
    case 96:
    case 99:
      return { condition: 'High-Altitude Thunderstorm / Lightning Hazard', icon: 'CloudLightning', severity: 'hazardous' };
    default:
      return { condition: 'Typical Mountain Weather', icon: 'CloudSun', severity: 'optimal' };
  }
}

// In-memory weather cache to ensure rapid response
const weatherCache: { [key: string]: { data: any; expiresAt: number } } = {};
const advisoryCache: { [key: string]: { data: string; expiresAt: number } } = {};

async function startServer() {
  const app = express();

  app.use(express.json());

  // Health check API
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Public catalogue endpoint for clients that want API-driven destination loading.
  app.get('/api/destinations', (req, res) => {
    const state = typeof req.query.state === 'string' ? req.query.state : '';
    const type = typeof req.query.type === 'string' ? req.query.type : '';
    const data = DESTINATIONS_DATA.filter(d => (!state || d.state === state) && (!type || d.type === type));
    res.json({ destinations: data, count: data.length });
  });

  // Live Himalayan Weather Endpoint
  app.get('/api/weather', async (req, res) => {
    const trekId = (req.query.trekId as string) || '';
    const queryLat = parseFloat(req.query.lat as string);
    const queryLon = parseFloat(req.query.lon as string);
    const queryName = (req.query.name as string) || '';

    let lat: number = 32.257, lon: number = 76.354, altitudeM: number = 2828;
    let locationName: string = 'Triund Trail & Snowline Ridge';
    let region: string = 'Himachal Pradesh';
    let baseCamp: string = 'McLeodganj';

    try {

      if (!isNaN(queryLat) && !isNaN(queryLon)) {
        // Direct coordinate mode - for any destination
        lat = queryLat;
        lon = queryLon;
        altitudeM = parseInt(req.query.altitude as string) || 1000;
        locationName = queryName || 'Selected Destination';
        region = (req.query.region as string) || 'India';
        baseCamp = (req.query.baseCamp as string) || locationName;
      } else {
        // Legacy trekId lookup mode
        const loc = TREK_LOCATIONS[trekId] || TREK_LOCATIONS['triund-trek'];
        lat = loc.lat;
        lon = loc.lon;
        altitudeM = loc.altitudeM;
        locationName = loc.name;
        region = loc.region;
        baseCamp = loc.baseCamp;
      }

      const cacheKey = !isNaN(queryLat) ? `weather_${queryLat}_${queryLon}` : `weather_${trekId || 'triund-trek'}`;
      const now = Date.now();

      if (weatherCache[cacheKey] && weatherCache[cacheKey].expiresAt > now) {
        return res.json(weatherCache[cacheKey].data);
      }

      // Fetch live data from Open-Meteo
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=Asia%2FKolkata&forecast_days=5`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Open-Meteo returned status ${response.status}`);
      }

      const weatherData = await response.json();
      const current = weatherData.current;
      const interpretation = interpretWeatherCode(current.weather_code);

      // Estimated summit temperature (temperature drops ~6.5°C per 1000m altitude gain from basecamp to summit)
      const baseCampTemp = current.temperature_2m;
      const altitudeDiffKm = Math.max(0.5, (altitudeM - 1800) / 1000);
      const summitTempEst = Math.round((baseCampTemp - altitudeDiffKm * 6.5) * 10) / 10;
      const summitWindEst = Math.round(current.wind_speed_10m * 1.4);

      // Calculate trail safety index (1-100)
      let trailSafetyScore = 95;
      if (interpretation.severity === 'hazardous') trailSafetyScore = 40;
      else if (interpretation.severity === 'caution') trailSafetyScore = 65;
      else if (interpretation.severity === 'moderate') trailSafetyScore = 82;

      if (current.wind_speed_10m > 35) trailSafetyScore -= 15;
      if (current.precipitation > 2) trailSafetyScore -= 12;

      // 5-day forecast formatting
      const dailyForecasts = weatherData.daily.time.map((dateStr: string, idx: number) => {
        const dayCode = weatherData.daily.weather_code[idx];
        const dayInterp = interpretWeatherCode(dayCode);
        return {
          date: dateStr,
          dayName: new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' }),
          maxTempC: Math.round(weatherData.daily.temperature_2m_max[idx]),
          minTempC: Math.round(weatherData.daily.temperature_2m_min[idx]),
          precipitationMm: weatherData.daily.precipitation_sum[idx],
          precipProbability: weatherData.daily.precipitation_probability_max?.[idx] || 10,
          windSpeedMax: Math.round(weatherData.daily.wind_speed_10m_max[idx]),
          condition: dayInterp.condition,
          icon: dayInterp.icon,
          severity: dayInterp.severity,
        };
      });

      const result = {
        trekId,
        locationName,
        region,
        baseCamp,
        altitudeM,
        lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        current: {
          tempC: Math.round(current.temperature_2m * 10) / 10,
          feelsLikeC: Math.round(current.apparent_temperature * 10) / 10,
          humidityPct: current.relative_humidity_2m,
          precipitationMm: current.precipitation,
          windSpeedKmh: Math.round(current.wind_speed_10m),
          windDirectionDeg: current.wind_direction_10m,
          surfacePressureHpa: Math.round(current.surface_pressure),
          weatherCode: current.weather_code,
          condition: interpretation.condition,
          icon: interpretation.icon,
          severity: interpretation.severity,
          isDay: Boolean(current.is_day),
          summitTempEstC: summitTempEst,
          summitWindEstKmh: summitWindEst,
          trailSafetyScore: Math.max(20, Math.min(99, trailSafetyScore)),
        },
        forecast: dailyForecasts,
      };

      // Cache for 5 minutes
      weatherCache[cacheKey] = {
        data: result,
        expiresAt: now + 5 * 60 * 1000,
      };

      return res.json(result);
    } catch (err: any) {
      console.warn('Weather API remote fetch failed, falling back to elevation model:', err?.message);

      const alt = typeof altitudeM === 'number' && !isNaN(altitudeM) ? altitudeM : 1500;
      const month = new Date().getMonth();
      let seaLevelBaseTemp = 28;
      let condition = 'Clear Sky & High Visibility';
      let icon = 'Sun';
      let weatherCode = 0;
      let severity: 'optimal' | 'moderate' | 'caution' | 'hazardous' = 'optimal';

      if (month >= 11 || month <= 1) {
        seaLevelBaseTemp = 22;
        if (alt > 2500) { condition = 'Cold Alpine Air / Snow Conditions'; icon = 'Snowflake'; weatherCode = 71; severity = 'caution'; }
      } else if (month >= 5 && month <= 8) {
        seaLevelBaseTemp = 32;
        if (alt > 2000) { condition = 'High-Altitude Ridge Clouds'; icon = 'Cloud'; weatherCode = 3; severity = 'moderate'; }
      } else {
        seaLevelBaseTemp = 29;
        condition = 'Pleasant Trail Weather'; icon = 'CloudSun'; weatherCode = 1;
      }

      const tempDrop = (alt / 1000) * 6.5;
      const tempC = Math.round((seaLevelBaseTemp - tempDrop) * 10) / 10;
      const altitudeDiffKm = Math.max(0.5, (alt - 1800) / 1000);
      const summitTempEstC = Math.round((tempC - altitudeDiffKm * 6.5) * 10) / 10;
      const windSpeedKmh = Math.min(65, Math.max(8, Math.round(10 + (alt / 500) * 3)));

      const fallbackForecast = Array.from({ length: 5 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return {
          date: d.toISOString().split('T')[0],
          dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
          maxTempC: Math.round(tempC + 3 + (i % 2)),
          minTempC: Math.round(tempC - 4 - (i % 2)),
          precipitationMm: 0,
          precipProbability: 10 + i * 5,
          windSpeedMax: windSpeedKmh + 4,
          condition,
          icon,
          severity,
        };
      });

      const fallbackResult = {
        trekId: trekId || 'destination',
        locationName: locationName || 'Selected Destination',
        region: region || 'India',
        baseCamp: baseCamp || locationName || 'Basecamp',
        altitudeM: alt,
        lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        current: {
          tempC,
          feelsLikeC: Math.round((tempC - 2) * 10) / 10,
          humidityPct: 55,
          precipitationMm: 0,
          windSpeedKmh,
          windDirectionDeg: 180,
          surfacePressureHpa: Math.round(1013 - (alt / 8.3)),
          weatherCode,
          condition,
          icon,
          severity,
          isDay: true,
          summitTempEstC,
          summitWindEstKmh: Math.round(windSpeedKmh * 1.35),
          trailSafetyScore: 88,
        },
        forecast: fallbackForecast,
      };

      return res.json(fallbackResult);
    }
  });

  // Live AI Mountain Weather & Safety Advisory (Using OpenRouter API)
  app.post('/api/weather/advisory', async (req, res) => {
    try {
      const { trekId, currentTemp, weatherCondition, windSpeed, altitudeM, locationName, region, baseCamp } = req.body;
      const loc = TREK_LOCATIONS[trekId] || TREK_LOCATIONS['triund-trek'];
      const advisoryLocation = { name: locationName || loc.name, region: region || loc.region, altitudeM: altitudeM || loc.altitudeM, baseCamp: baseCamp || loc.baseCamp };

      const cacheKey = `advisory_${trekId}_${Math.round(currentTemp || 10)}`;
      const now = Date.now();

      if (advisoryCache[cacheKey] && advisoryCache[cacheKey].expiresAt > now) {
        return res.json({ advisory: advisoryCache[cacheKey].data });
      }

      const prompt = `You are the Lead Trail Safety Officer for Peak Quest India.
Generate a concise, high-value live weather & trail bulletin for visitors heading to ${advisoryLocation.name} (${advisoryLocation.region}, Elevation: ${advisoryLocation.altitudeM}m, Basecamp: ${advisoryLocation.baseCamp}).
Current Basecamp Condition: ${weatherCondition || 'Clear'}, Basecamp Temp: ${currentTemp || 12}°C, Wind: ${windSpeed || 15} km/h.

Output formatted with clear sections:
1. **Trail Hazard Level & Visibility**: (Current status, terrain grip, snow/mud status)
2. **High-Altitude Window**: (Optimal time of day for summit push / hiking)
3. **Clothing & Gear Layering**: (Base layer, fleece, down jacket, poncho, microspikes requirement)
4. **Acclimatization & Altitude Alert**: (Hydration, heat/cold exposure, and altitude signs for ${advisoryLocation.altitudeM}m)

Keep it crisp, professional, under 180 words, tailored to high-altitude Himalayan standards.`;

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://peakquest.in',
          'X-Title': 'Peak Quest Weather Advisory',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.0-flash-001',
          messages: [
            { role: 'system', content: 'You are an elite IMF-certified mountain guide providing real-time Himalayan weather bulletins.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.5,
          max_tokens: 450,
        }),
      });

      if (!response.ok) {
        // Fallback advisory
        const fallbackAdvisory = `**Trail Hazard Level**: Moderate. Trails are active with normal seasonal conditions. Keep to marked ridgeline paths.
**High-Altitude Window**: Optimal push between 05:30 AM - 11:30 AM before afternoon ridge clouds gather.
**Gear Layering**: Use 3-tier layering (thermal base layer, mid-fleece, and windproof shell). Carry down jacket for summit pass temperatures (${Math.round((currentTemp || 12) - 10)}°C).
**Altitude & Hydration**: Drink 3.5-4L water daily with ORS/electrolytes and ascend at a measured pace for ${advisoryLocation.altitudeM}m elevation.`;
        return res.json({ advisory: fallbackAdvisory });
      }

      const data = await response.json();
      const advisory = data.choices?.[0]?.message?.content || 'Weather conditions normal. Ensure proper layering and hydration.';

      advisoryCache[cacheKey] = {
        data: advisory,
        expiresAt: now + 15 * 60 * 1000,
      };

      return res.json({ advisory });
    } catch (err: any) {
      console.error('Advisory error:', err);
      const defaultAdvisory = `**Live Mountain Advisory**: Ensure 3-layer system with waterproof shell, carry hydration bladder with electrolytes, and start summit push by dawn.`;
      return res.json({ advisory: defaultAdvisory });
    }
  });

  // Chatbot Assistant endpoint using OpenRouter
  app.post('/api/chat', async (req, res) => {
    try {
      const { messages } = req.body;

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Invalid messages array provided' });
      }

      const systemMessage = {
        role: 'system',
        content: HIMALAYAN_EXPEDITION_CONTEXT
      };

      const payload = {
        model: 'google/gemini-2.0-flash-001',
        messages: [systemMessage, ...messages],
        temperature: 0.7,
        max_tokens: 1024,
      };

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://peakquest.in',
          'X-Title': 'Peak Quest Himalayan Assistant',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenRouter API error:', response.status, errorText);
        
        // Try fallback with alternative OpenRouter model if first model has rate limit
        const fallbackResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'HTTP-Referer': 'https://peakquest.in',
            'X-Title': 'Peak Quest Himalayan Assistant',
          },
          body: JSON.stringify({
            model: 'meta-llama/llama-3.3-70b-instruct',
            messages: [systemMessage, ...messages],
            temperature: 0.7,
            max_tokens: 1024,
          }),
        });

        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          const reply = fallbackData.choices?.[0]?.message?.content || 'I am ready to help you plan your Himalayan expedition.';
          return res.json({ reply, model: fallbackData.model || 'openrouter-assistant' });
        }

        return res.status(502).json({
          error: 'Failed to communicate with AI provider',
          details: errorText,
        });
      }

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || 'Hello! How can I assist you with your Himalayan trek?';
      return res.json({ reply, model: data.model || 'assistant-openrouter' });
    } catch (err: any) {
      console.error('Server chat error:', err);
      return res.status(500).json({
        error: 'Internal server error while processing assistant chat request',
        message: err.message,
      });
    }
  });

  // OSRM Route Proxy with resilient highway trajectory fallback
  app.get('/api/route', async (req, res) => {
    const { startLat, startLon, endLat, endLon } = req.query as Record<string, string>;
    if (!startLat || !startLon || !endLat || !endLon) {
      return res.status(400).json({ error: 'Missing startLat, startLon, endLat, endLon' });
    }

    const sLat = parseFloat(startLat);
    const sLon = parseFloat(startLon);
    const eLat = parseFloat(endLat);
    const eLon = parseFloat(endLon);

    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${sLon},${sLat};${eLon},${eLat}?overview=full&geometries=geojson&steps=true`;
      const response = await fetch(url, { signal: AbortSignal.timeout(4000) });
      if (!response.ok) throw new Error(`OSRM returned ${response.status}`);
      const data = await response.json();
      if (data.code === 'Ok' && data.routes?.[0]) {
        return res.json(data);
      }
      throw new Error('OSRM did not return valid routes');
    } catch (err: any) {
      console.warn('OSRM route proxy failed, generating highway trajectory:', err?.message);

      // Haversine formula calculation
      const R = 6371e3;
      const phi1 = (sLat * Math.PI) / 180;
      const phi2 = (eLat * Math.PI) / 180;
      const deltaPhi = ((eLat - sLat) * Math.PI) / 180;
      const deltaLambda = ((eLon - sLon) * Math.PI) / 180;

      const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
                Math.cos(phi1) * Math.cos(phi2) *
                Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const straightDistM = R * c;
      const distanceM = Math.round(straightDistM * 1.28);
      const durationSec = Math.round(distanceM / 15.28); // ~55 km/h

      const numPoints = 25;
      const coords: [number, number][] = [];
      for (let i = 0; i <= numPoints; i++) {
        const f = i / numPoints;
        const A = Math.sin((1 - f) * c) / (Math.sin(c) || 1);
        const B = Math.sin(f * c) / (Math.sin(c) || 1);
        const x = A * Math.cos(phi1) * Math.cos((sLon * Math.PI) / 180) + B * Math.cos(phi2) * Math.cos((eLon * Math.PI) / 180);
        const y = A * Math.cos(phi1) * Math.sin((sLon * Math.PI) / 180) + B * Math.cos(phi2) * Math.sin((eLon * Math.PI) / 180);
        const z = A * Math.sin(phi1) + B * Math.sin(phi2);
        const latInterp = (Math.atan2(z, Math.sqrt(x * x + y * y)) * 180) / Math.PI;
        const lonInterp = (Math.atan2(y, x) * 180) / Math.PI;
        coords.push([lonInterp, latInterp]);
      }

      const distKm = Math.round(distanceM / 1000);
      const fallbackData = {
        code: 'Ok',
        routes: [
          {
            distance: distanceM,
            duration: durationSec,
            geometry: {
              type: 'LineString',
              coordinates: coords,
            },
            legs: [
              {
                distance: distanceM,
                duration: durationSec,
                steps: [
                  {
                    name: 'Connecting Corridor',
                    distance: Math.round(distanceM * 0.05),
                    duration: Math.round(durationSec * 0.08),
                    maneuver: { instruction: 'Start from current GPS location toward nearest arterial highway', type: 'depart' }
                  },
                  {
                    name: 'Primary Highway Corridor',
                    distance: Math.round(distanceM * 0.85),
                    duration: Math.round(durationSec * 0.82),
                    maneuver: { instruction: `Follow National / State Highway corridor (${distKm} km)`, type: 'continue' }
                  },
                  {
                    name: 'Basecamp Approach',
                    distance: Math.round(distanceM * 0.08),
                    duration: Math.round(durationSec * 0.08),
                    maneuver: { instruction: 'Take access exit toward basecamp approach road', type: 'turn' }
                  },
                  {
                    name: 'Destination Trailhead',
                    distance: Math.round(distanceM * 0.02),
                    duration: Math.round(durationSec * 0.02),
                    maneuver: { instruction: 'Arrive at destination basecamp trailhead', type: 'arrive' }
                  }
                ]
              }
            ]
          }
        ]
      };

      return res.json(fallbackData);
    }
  });

  // Google Places Photo API Proxy - securely fetches real photos using Google Places API
  const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || process.env.VITE_GOOGLE_PLACES_API_KEY || '';
  const placePhotoCache = new Map<string, string[]>();

  app.get('/api/places/photo', async (req, res) => {
    const query = req.query.query as string;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter required' });
    }

    if (placePhotoCache.has(query)) {
      return res.json({ photos: placePhotoCache.get(query) });
    }

    if (!GOOGLE_PLACES_API_KEY || GOOGLE_PLACES_API_KEY.startsWith('MY_')) {
      return res.status(500).json({ error: 'Google Places API Key not configured' });
    }

    try {
      // Find Place from Text
      const searchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
        query
      )}&inputtype=textquery&fields=place_id,photos,name&key=${GOOGLE_PLACES_API_KEY}`;

      const searchResp = await fetch(searchUrl);
      const searchData = (await searchResp.json()) as any;

      if (!searchData.candidates || searchData.candidates.length === 0) {
        return res.json({ photos: [] });
      }

      const candidate = searchData.candidates[0];
      const photoRefs = candidate.photos || [];

      // Build photo URLs directly from photo_reference
      const photoUrls = photoRefs.slice(0, 5).map((p: any) => {
        return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photo_reference=${p.photo_reference}&key=${GOOGLE_PLACES_API_KEY}`;
      });

      placePhotoCache.set(query, photoUrls);
      return res.json({ photos: photoUrls });
    } catch (err: any) {
      console.error('Google Places photo fetch failed:', err?.message || err);
      return res.status(500).json({ error: 'Failed to fetch photos from Google Places' });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Peak Quest server running at: http://localhost:${PORT}\n`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
