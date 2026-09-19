// Server SQLite Database Layer
// Uses Node 24 native node:sqlite for zero-dependency, ultra-fast persistence.
// Maintains models, historical snapshots, perspective rankings, ingestion logs, and metadata.

import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_PATH = path.resolve(DATA_DIR, 'leaderboard.db');
const PUBLIC_JSON_PATH = path.resolve(process.cwd(), 'public', 'leaderboard_data.json');

let dbInstance = null;

export function getDb() {
  if (!dbInstance) {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    dbInstance = new DatabaseSync(DB_PATH);
    initSchema(dbInstance);
  }
  return dbInstance;
}

function initSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS models (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE,
      name TEXT NOT NULL,
      org TEXT,
      category TEXT,
      entityType TEXT,
      rank INTEGER,
      arenaElo INTEGER,
      votes INTEGER,
      isOpenWeights INTEGER,
      license TEXT,
      licenseType TEXT,
      outputSpeed TEXT,
      speedNum INTEGER,
      contextWindow TEXT,
      price TEXT,
      rankDelta TEXT,
      eloChange TEXT,
      superpower TEXT,
      superpowerShort TEXT,
      shortDescription TEXT,
      badge TEXT,
      sourceMetadata TEXT,
      updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS snapshots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      snapshot_date TEXT NOT NULL,
      model_id TEXT NOT NULL,
      rank INTEGER,
      elo INTEGER,
      votes INTEGER
    );

    CREATE TABLE IF NOT EXISTS rankings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      perspective TEXT NOT NULL,
      rank INTEGER NOT NULL,
      model_id TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ingestion_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      status TEXT NOT NULL,
      source TEXT,
      models_count INTEGER,
      error_message TEXT,
      timestamp TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS metadata (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);
}

export function getPreviousSnapshotMap() {
  const db = getDb();
  try {
    // Find the latest snapshot date that is older than today or the most recent prior batch
    const dateRow = db.prepare(`
      SELECT DISTINCT snapshot_date FROM snapshots 
      ORDER BY snapshot_date DESC LIMIT 1 OFFSET 1
    `).get();

    const targetDate = dateRow?.snapshot_date;
    if (!targetDate) {
      // If no second date, return the earliest snapshot
      const firstDateRow = db.prepare(`
        SELECT DISTINCT snapshot_date FROM snapshots 
        ORDER BY snapshot_date ASC LIMIT 1
      `).get();
      if (!firstDateRow) return new Map();
    }

    const compareDate = targetDate || db.prepare(`SELECT DISTINCT snapshot_date FROM snapshots ORDER BY snapshot_date ASC LIMIT 1`).get()?.snapshot_date;
    const rows = db.prepare(`
      SELECT model_id, rank, elo, votes FROM snapshots WHERE snapshot_date = ?
    `).all(compareDate);

    const map = new Map();
    for (const r of rows) {
      map.set(r.model_id, { rank: r.rank, elo: r.elo, votes: r.votes });
    }
    return map;
  } catch (err) {
    console.error('[DB] Error getting previous snapshot:', err.message);
    return new Map();
  }
}

export function saveIngestionResults(models, rankingsByPerspective) {
  const db = getDb();
  const now = new Date().toISOString();
  const dateStr = now.split('T')[0];

  // Atomic transaction
  db.exec('BEGIN TRANSACTION');
  try {
    const insertModel = db.prepare(`
      INSERT OR REPLACE INTO models (
        id, slug, name, org, category, entityType, rank, arenaElo, votes,
        isOpenWeights, license, licenseType, outputSpeed, speedNum,
        contextWindow, price, rankDelta, eloChange, superpower, superpowerShort,
        shortDescription, badge, sourceMetadata, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?
      )
    `);

    for (const m of models) {
      insertModel.run(
        m.id,
        m.slug,
        m.name,
        m.org,
        m.category,
        m.entityType,
        m.rank,
        m.arenaElo,
        m.votes,
        m.isOpenWeights ? 1 : 0,
        m.license,
        m.licenseType,
        m.outputSpeed,
        m.speedNum,
        m.contextWindow,
        m.price,
        m.rankDelta,
        m.eloChange,
        m.superpower,
        m.superpowerShort,
        m.shortDescription,
        m.badge,
        JSON.stringify(m.sourceMetadata || {}),
        now
      );
    }

    // Save dated snapshot
    const insertSnapshot = db.prepare(`
      INSERT INTO snapshots (snapshot_date, model_id, rank, elo, votes)
      VALUES (?, ?, ?, ?, ?)
    `);
    for (const m of models) {
      insertSnapshot.run(dateStr, m.slug, m.rank, m.arenaElo, m.votes);
    }

    // Clear and insert perspective rankings
    db.exec('DELETE FROM rankings');
    const insertRanking = db.prepare(`
      INSERT INTO rankings (perspective, rank, model_id, updated_at)
      VALUES (?, ?, ?, ?)
    `);

    for (const [perspective, rankedResult] of Object.entries(rankingsByPerspective)) {
      for (const m of rankedResult.models) {
        insertRanking.run(perspective, m.rank, m.slug, now);
      }
    }

    // Update metadata
    const setMeta = db.prepare('INSERT OR REPLACE INTO metadata (key, value) VALUES (?, ?)');
    setMeta.run('last_successful_update', now);
    setMeta.run('total_models', String(models.length));

    // Log success
    db.prepare(`
      INSERT INTO ingestion_logs (status, source, models_count, error_message, timestamp)
      VALUES ('SUCCESS', 'LMSYS Chatbot Arena & Artificial Analysis', ?, NULL, ?)
    `).run(models.length, now);

    db.exec('COMMIT');

    // Export synced public snapshot
    exportPublicSnapshot(models, rankingsByPerspective, now);

    return true;
  } catch (err) {
    db.exec('ROLLBACK');
    console.error('[DB] Transaction failed. Rolled back.', err);

    // Record failure log
    db.prepare(`
      INSERT INTO ingestion_logs (status, source, models_count, error_message, timestamp)
      VALUES ('FAILED', 'LMSYS & AA', 0, ?, ?)
    `).run(err.message, now);

    throw err;
  }
}

export function getLastUpdateTimestamp() {
  const db = getDb();
  try {
    const row = db.prepare("SELECT value FROM metadata WHERE key = 'last_successful_update'").get();
    if (!row || !row.value) return null;

    const date = new Date(row.value);
    const diffHours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));

    let formattedText = 'DATA UPDATED JUST NOW';
    if (diffHours >= 1) {
      formattedText = `DATA UPDATED ${diffHours}H AGO`;
    }

    return {
      iso: row.value,
      diffHours,
      formattedText
    };
  } catch (err) {
    return null;
  }
}

export function getRankedModels(perspective = 'overall', limit = 100) {
  const db = getDb();
  try {
    const rows = db.prepare(`
      SELECT m.*, r.rank as perspective_rank
      FROM rankings r
      JOIN models m ON r.model_id = m.slug
      WHERE r.perspective = ?
      ORDER BY r.rank ASC
      LIMIT ?
    `).all(perspective, limit);

    return rows.map((r) => ({
      ...r,
      rank: r.perspective_rank,
      isOpenWeights: r.isOpenWeights === 1,
      sourceMetadata: r.sourceMetadata ? JSON.parse(r.sourceMetadata) : {}
    }));
  } catch (err) {
    console.error('[DB] Error querying ranked models:', err.message);
    return [];
  }
}

export function exportPublicSnapshot(models, rankingsByPerspective, timestamp) {
  try {
    const counts = {};
    for (const [p, r] of Object.entries(rankingsByPerspective)) {
      counts[p] = r.models.length;
    }

    const payload = {
      metadata: {
        source: 'LMSYS Chatbot Arena Official Dataset & Artificial Analysis',
        lastUpdated: timestamp,
        totalModels: models.length,
        version: '2.5.0',
        counts
      },
      modelsByPerspective: rankingsByPerspective,
      models
    };

    const dir = path.dirname(PUBLIC_JSON_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(PUBLIC_JSON_PATH, JSON.stringify(payload, null, 2), 'utf-8');
    console.log('[DB] Public snapshot exported successfully to public/leaderboard_data.json');
  } catch (err) {
    console.error('[DB] Failed to export public snapshot:', err.message);
  }
}
