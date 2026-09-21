// REST API Route for Leaderboard Data & Ingestion Trigger
// Compatible with both Vercel Serverless Functions and Vite Dev Server middleware.

import { getRankedModels, getLastUpdateTimestamp, getDb } from '../server/db.js';
import { runIngestionPipeline } from '../server/pipeline/ingest.js';
import fs from 'node:fs';
import path from 'node:path';

export async function handleLeaderboardRequest(req, res) {
  const url = new URL(req.url, `http://${req.headers?.host || 'localhost'}`);

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  // GET or POST /api/leaderboard/update -> trigger automated/manual pipeline execution
  if (url.pathname.endsWith('/update')) {
    try {
      const result = await runIngestionPipeline();
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = result.success ? 200 : 500;
      res.end(JSON.stringify(result));
      return;
    } catch (err) {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 500;
      res.end(JSON.stringify({ success: false, error: err.message }));
      return;
    }
  }

  // GET /api/leaderboard
  try {
    const perspective = url.searchParams.get('perspective') || 'overall';
    const category = url.searchParams.get('category') || 'All';
    const searchQuery = (url.searchParams.get('search') || '').toLowerCase().trim();
    const limit = parseInt(url.searchParams.get('limit') || '500', 10);

    // Query SQLite database
    let models = getRankedModels(perspective, limit);

    // Fallback to public snapshot if DB is empty on serverless cold start
    if (!models || models.length === 0) {
      try {
        const snapPath = path.resolve(process.cwd(), 'public', 'leaderboard_data.json');
        if (fs.existsSync(snapPath)) {
          const snap = JSON.parse(fs.readFileSync(snapPath, 'utf-8'));
          models = snap.modelsByPerspective?.[perspective]?.models || snap.models?.slice(0, limit) || [];
        }
      } catch (fErr) {
        console.warn('Fallback file read failed:', fErr.message);
      }
    }

    // Apply secondary category filter if requested
    if (category !== 'All') {
      const isMatch = (itemCat, targetCat) => {
        if (!itemCat) return false;
        const ic = String(itemCat).toLowerCase().trim();
        const tc = String(targetCat).toLowerCase().trim();
        if (ic === tc) return true;
        if (tc === 'chat' || tc === 'chatbot') return ic.includes('chat') || ic.includes('llm');
        if (tc === 'code' || tc === 'coding') return ic.includes('code') || ic.includes('coding') || ic.includes('developer');
        if (tc === 'reasoning') return ic.includes('reason');
        if (tc === 'image') return ic.includes('image');
        if (tc === 'video') return ic.includes('video');
        if (tc === 'research') return ic.includes('research');
        if (tc === 'agents') return ic.includes('agent') || ic.includes('automation');
        return ic.includes(tc) || tc.includes(ic);
      };
      models = models.filter((m) => isMatch(m.category, category));
    }

    // Apply search filter if requested
    if (searchQuery) {
      models = models.filter((m) =>
        (m.name || '').toLowerCase().includes(searchQuery) ||
        (m.org || '').toLowerCase().includes(searchQuery) ||
        (m.superpower || '').toLowerCase().includes(searchQuery) ||
        (m.category || '').toLowerCase().includes(searchQuery)
      );
    }

    const lastUpdatedMeta = getLastUpdateTimestamp() || {
      iso: new Date().toISOString(),
      diffHours: 0,
      formattedText: 'DATA UPDATED JUST NOW'
    };

    // Perspective counts
    const db = getDb();
    const counts = {
      overall: db.prepare("SELECT COUNT(*) as c FROM rankings WHERE perspective = 'overall'").get()?.c || 100,
      risers: db.prepare("SELECT COUNT(*) as c FROM rankings WHERE perspective = 'risers'").get()?.c || 100,
      adopted: db.prepare("SELECT COUNT(*) as c FROM rankings WHERE perspective = 'adopted'").get()?.c || 100,
      speed: db.prepare("SELECT COUNT(*) as c FROM rankings WHERE perspective = 'speed'").get()?.c || 100,
      open_weights: db.prepare("SELECT COUNT(*) as c FROM rankings WHERE perspective = 'open_weights'").get()?.c || 100
    };

    const responsePayload = {
      perspective,
      total: models.length,
      counts,
      lastUpdated: lastUpdatedMeta.iso,
      lastUpdatedText: lastUpdatedMeta.formattedText,
      models
    };

    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify(responsePayload));
  } catch (err) {
    console.error('[API] Leaderboard request error:', err);
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Internal Server Error', message: err.message }));
  }
}

// Vercel Serverless Function entry point
export default async function handler(req, res) {
  return handleLeaderboardRequest(req, res);
}
