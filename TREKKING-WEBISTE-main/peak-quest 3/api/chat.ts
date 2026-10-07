import type { VercelRequest, VercelResponse } from '@vercel/node';

const HIMALAYAN_CONTEXT = `You are "Assistant", the official AI Trekking & High-Altitude Mountain Guide for Peak Quest.
Peak Quest specializes in curated, IMF-certified Himalayan expeditions in Himachal Pradesh and Uttarakhand with prices starting from ₹5,000 INR.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid messages array' });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://peakquest.in',
        'X-Title': 'Peak Quest Himalayan Assistant',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-001',
        messages: [{ role: 'system', content: HIMALAYAN_CONTEXT }, ...messages],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      return res.json({ reply: 'Hello! How can I help you plan your Himalayan trek today?' });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'Hello! How can I help you plan your Himalayan trek today?';
    return res.json({ reply, model: data.model });
  } catch (err: any) {
    return res.json({ reply: 'Hello! How can I assist you with your Himalayan trek?' });
  }
}
