import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(process.cwd(), 'data', 'socialflow.db');

let _db: Database.Database | null = null;

function getDb(): Database.Database {
  if (_db) return _db;
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  _db = new Database(DB_PATH);
  _db.pragma('journal_mode = WAL');
  _db.exec(`
    CREATE TABLE IF NOT EXISTS reports (
      id         TEXT PRIMARY KEY,
      platforms  TEXT NOT NULL,
      title      TEXT DEFAULT '',
      content    TEXT NOT NULL,
      twitter_lang TEXT,
      results    TEXT NOT NULL,
      images     TEXT DEFAULT '[]',
      created_at TEXT DEFAULT (datetime('now')),
      share_count INTEGER DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS history (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      report_id      TEXT,
      platforms      TEXT NOT NULL,
      title          TEXT DEFAULT '',
      content_preview TEXT NOT NULL,
      overall_score  INTEGER NOT NULL,
      status         TEXT NOT NULL,
      created_at     TEXT DEFAULT (datetime('now'))
    );
  `);
  try { _db.exec(`ALTER TABLE reports ADD COLUMN images TEXT DEFAULT '[]'`); } catch { /* column already exists */ }
  return _db;
}

// --- Reports ---

export function saveReport(data: {
  id: string;
  platforms: string[];
  title: string;
  content: string;
  twitterLang?: string;
  results: unknown;
  images?: string[];
}): void {
  const db = getDb();
  db.prepare(`
    INSERT INTO reports (id, platforms, title, content, twitter_lang, results, images)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      platforms = excluded.platforms, title = excluded.title,
      content = excluded.content, twitter_lang = excluded.twitter_lang,
      results = excluded.results, images = excluded.images
  `).run(data.id, JSON.stringify(data.platforms), data.title, data.content, data.twitterLang || null, JSON.stringify(data.results), JSON.stringify(data.images || []));
}

export function getReport(id: string): {
  id: string;
  platforms: string[];
  title: string;
  content: string;
  twitterLang: string | null;
  results: unknown;
  images: string[];
  createdAt: string;
  shareCount: number;
} | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM reports WHERE id = ?').get(id) as Record<string, unknown> | undefined;
  if (!row) return null;
  let images: string[] = [];
  try { images = JSON.parse((row.images as string) || '[]'); } catch { images = []; }
  return {
    id: row.id as string,
    platforms: JSON.parse(row.platforms as string),
    title: row.title as string,
    content: row.content as string,
    twitterLang: row.twitter_lang as string | null,
    results: JSON.parse(row.results as string),
    images,
    createdAt: row.created_at as string,
    shareCount: row.share_count as number,
  };
}

export function incrementShareCount(id: string): void {
  const db = getDb();
  db.prepare('UPDATE reports SET share_count = share_count + 1 WHERE id = ?').run(id);
}

// --- History ---

export function addHistory(data: {
  reportId?: string;
  platforms: string[];
  title: string;
  contentPreview: string;
  overallScore: number;
  status: string;
}): void {
  const db = getDb();
  db.prepare(`
    INSERT INTO history (report_id, platforms, title, content_preview, overall_score, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(data.reportId || null, JSON.stringify(data.platforms), data.title, data.contentPreview, data.overallScore, data.status);
}

export function getHistory(limit = 50, offset = 0): {
  id: number;
  reportId: string | null;
  platforms: string[];
  title: string;
  contentPreview: string;
  overallScore: number;
  status: string;
  createdAt: string;
}[] {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM history ORDER BY id DESC LIMIT ? OFFSET ?').all(limit, offset) as Record<string, unknown>[];
  return rows.map(row => ({
    id: row.id as number,
    reportId: row.report_id as string | null,
    platforms: JSON.parse(row.platforms as string),
    title: row.title as string,
    contentPreview: row.content_preview as string,
    overallScore: row.overall_score as number,
    status: row.status as string,
    createdAt: row.created_at as string,
  }));
}

export function getHistoryCount(): number {
  const db = getDb();
  const row = db.prepare('SELECT COUNT(*) as count FROM history').get() as { count: number };
  return row.count;
}
