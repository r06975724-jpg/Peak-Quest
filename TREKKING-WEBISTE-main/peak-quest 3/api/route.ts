import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { startLat, startLon, endLat, endLon } = req.query as Record<string, string>;
  if (!startLat || !startLon || !endLat || !endLon) {
    return res.status(400).json({ error: 'Missing startLat, startLon, endLat, endLon' });
  }

  const sLat = parseFloat(startLat), sLon = parseFloat(startLon);
  const eLat = parseFloat(endLat), eLon = parseFloat(endLon);

  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${sLon},${sLat};${eLon},${eLat}?overview=full&geometries=geojson&steps=true`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`OSRM ${response.status}`);
    const data = await response.json();
    if (data.code === 'Ok' && data.routes?.[0]) return res.json(data);
    throw new Error('No routes');
  } catch {
    // Geodesic fallback
    const R = 6371e3;
    const phi1 = (sLat * Math.PI) / 180, phi2 = (eLat * Math.PI) / 180;
    const deltaPhi = ((eLat - sLat) * Math.PI) / 180, deltaLambda = ((eLon - sLon) * Math.PI) / 180;
    const a = Math.sin(deltaPhi / 2) ** 2 + Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceM = Math.round(R * c * 1.28);
    const durationSec = Math.round(distanceM / 15.28);

    const coords: [number, number][] = Array.from({ length: 26 }, (_, i) => {
      const f = i / 25;
      const A = Math.sin((1 - f) * c) / (Math.sin(c) || 1), B = Math.sin(f * c) / (Math.sin(c) || 1);
      const x = A * Math.cos(phi1) * Math.cos((sLon * Math.PI) / 180) + B * Math.cos(phi2) * Math.cos((eLon * Math.PI) / 180);
      const y = A * Math.cos(phi1) * Math.sin((sLon * Math.PI) / 180) + B * Math.cos(phi2) * Math.sin((eLon * Math.PI) / 180);
      const z = A * Math.sin(phi1) + B * Math.sin(phi2);
      return [(Math.atan2(y, x) * 180) / Math.PI, (Math.atan2(z, Math.sqrt(x * x + y * y)) * 180) / Math.PI];
    });

    return res.json({
      code: 'Ok',
      routes: [{ distance: distanceM, duration: durationSec, geometry: { type: 'LineString', coordinates: coords }, legs: [{ distance: distanceM, duration: durationSec, steps: [] }] }],
    });
  }
}
