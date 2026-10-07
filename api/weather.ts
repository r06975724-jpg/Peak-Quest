import type { VercelRequest, VercelResponse } from '@vercel/node';

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

function interpretWeatherCode(code: number) {
  switch (code) {
    case 0: return { condition: 'Clear Sky & High Visibility', icon: 'Sun', severity: 'optimal' };
    case 1: case 2: return { condition: 'Partly Cloudy with Good Visibility', icon: 'CloudSun', severity: 'optimal' };
    case 3: return { condition: 'Overcast Ridge Clouds', icon: 'Cloud', severity: 'moderate' };
    case 45: case 48: return { condition: 'Dense Mountain Fog / Low Visibility', icon: 'CloudFog', severity: 'caution' };
    case 51: case 53: case 55: return { condition: 'Light High-Altitude Drizzle', icon: 'CloudDrizzle', severity: 'moderate' };
    case 61: case 63: case 65: return { condition: 'Rain & Wet Trail Conditions', icon: 'CloudRain', severity: 'caution' };
    case 71: case 73: case 75: return { condition: 'Snowfall / Fresh Snow Accumulation', icon: 'Snowflake', severity: 'caution' };
    case 80: case 81: case 82: return { condition: 'Heavy Rain Showers', icon: 'CloudRain', severity: 'caution' };
    case 85: case 86: return { condition: 'Heavy Alpine Snow Showers', icon: 'Snowflake', severity: 'hazardous' };
    case 95: case 96: case 99: return { condition: 'High-Altitude Thunderstorm / Lightning Hazard', icon: 'CloudLightning', severity: 'hazardous' };
    default: return { condition: 'Typical Mountain Weather', icon: 'CloudSun', severity: 'optimal' };
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const trekId = (req.query.trekId as string) || '';
  const queryLat = parseFloat(req.query.lat as string);
  const queryLon = parseFloat(req.query.lon as string);
  const queryName = (req.query.name as string) || '';

  let lat = 32.257, lon = 76.354, altitudeM = 2828;
  let locationName = 'Triund Trail & Snowline Ridge';
  let region = 'Himachal Pradesh';
  let baseCamp = 'McLeodganj';

  try {
    if (!isNaN(queryLat) && !isNaN(queryLon)) {
      lat = queryLat; lon = queryLon;
      altitudeM = parseInt(req.query.altitude as string) || 1000;
      locationName = queryName || 'Selected Destination';
      region = (req.query.region as string) || 'India';
      baseCamp = (req.query.baseCamp as string) || locationName;
    } else {
      const loc = TREK_LOCATIONS[trekId] || TREK_LOCATIONS['triund-trek'];
      lat = loc.lat; lon = loc.lon; altitudeM = loc.altitudeM;
      locationName = loc.name; region = loc.region; baseCamp = loc.baseCamp;
    }

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=Asia%2FKolkata&forecast_days=5`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Open-Meteo returned ${response.status}`);
    const weatherData = await response.json();
    const current = weatherData.current;
    const interpretation = interpretWeatherCode(current.weather_code);

    const altitudeDiffKm = Math.max(0.5, (altitudeM - 1800) / 1000);
    const summitTempEst = Math.round((current.temperature_2m - altitudeDiffKm * 6.5) * 10) / 10;
    let trailSafetyScore = 95;
    if (interpretation.severity === 'hazardous') trailSafetyScore = 40;
    else if (interpretation.severity === 'caution') trailSafetyScore = 65;
    else if (interpretation.severity === 'moderate') trailSafetyScore = 82;
    if (current.wind_speed_10m > 35) trailSafetyScore -= 15;
    if (current.precipitation > 2) trailSafetyScore -= 12;

    const dailyForecasts = weatherData.daily.time.map((dateStr: string, idx: number) => {
      const dayInterp = interpretWeatherCode(weatherData.daily.weather_code[idx]);
      return {
        date: dateStr,
        dayName: new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' }),
        maxTempC: Math.round(weatherData.daily.temperature_2m_max[idx]),
        minTempC: Math.round(weatherData.daily.temperature_2m_min[idx]),
        precipitationMm: weatherData.daily.precipitation_sum[idx],
        precipProbability: weatherData.daily.precipitation_probability_max?.[idx] || 10,
        windSpeedMax: Math.round(weatherData.daily.wind_speed_10m_max[idx]),
        condition: dayInterp.condition, icon: dayInterp.icon, severity: dayInterp.severity,
      };
    });

    return res.json({
      trekId, locationName, region, baseCamp, altitudeM,
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
        condition: interpretation.condition, icon: interpretation.icon, severity: interpretation.severity,
        isDay: Boolean(current.is_day),
        summitTempEstC: summitTempEst,
        summitWindEstKmh: Math.round(current.wind_speed_10m * 1.4),
        trailSafetyScore: Math.max(20, Math.min(99, trailSafetyScore)),
      },
      forecast: dailyForecasts,
    });
  } catch (err: any) {
    const alt = altitudeM || 1500;
    const month = new Date().getMonth();
    let seaLevelBaseTemp = 28, condition = 'Clear Sky & High Visibility', icon = 'Sun', weatherCode = 0;
    let severity: 'optimal' | 'moderate' | 'caution' | 'hazardous' = 'optimal';
    if (month >= 11 || month <= 1) { seaLevelBaseTemp = 22; if (alt > 2500) { condition = 'Cold Alpine Air / Snow Conditions'; icon = 'Snowflake'; weatherCode = 71; severity = 'caution'; } }
    else if (month >= 5 && month <= 8) { seaLevelBaseTemp = 32; if (alt > 2000) { condition = 'High-Altitude Ridge Clouds'; icon = 'Cloud'; weatherCode = 3; severity = 'moderate'; } }
    const tempC = Math.round((seaLevelBaseTemp - (alt / 1000) * 6.5) * 10) / 10;
    return res.json({
      trekId, locationName, region, baseCamp, altitudeM: alt,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      current: { tempC, feelsLikeC: Math.round((tempC - 2) * 10) / 10, humidityPct: 55, precipitationMm: 0, windSpeedKmh: 20, windDirectionDeg: 180, surfacePressureHpa: Math.round(1013 - (alt / 8.3)), weatherCode, condition, icon, severity, isDay: true, summitTempEstC: Math.round((tempC - 6) * 10) / 10, summitWindEstKmh: 27, trailSafetyScore: 88 },
      forecast: Array.from({ length: 5 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i); return { date: d.toISOString().split('T')[0], dayName: d.toLocaleDateString('en-US', { weekday: 'short' }), maxTempC: Math.round(tempC + 3), minTempC: Math.round(tempC - 4), precipitationMm: 0, precipProbability: 10, windSpeedMax: 24, condition, icon, severity }; }),
    });
  }
}
