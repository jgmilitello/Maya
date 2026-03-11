// lib/db.ts — SQLite database setup (server-side only)
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(path.join(DATA_DIR, 'maya.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    username      TEXT    UNIQUE NOT NULL COLLATE NOCASE,
    email         TEXT    UNIQUE NOT NULL,
    password_hash TEXT    NOT NULL,
    created_at    INTEGER NOT NULL DEFAULT (unixepoch())
  )
`);

export interface UserRow {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  created_at: number;
}

export const userQueries = {
  findByUsername: db.prepare<[string], UserRow>(
    'SELECT * FROM users WHERE username = ? COLLATE NOCASE',
  ),
  create: db.prepare<{ username: string; email: string; password_hash: string }, void>(
    'INSERT INTO users (username, email, password_hash) VALUES (@username, @email, @password_hash)',
  ),
};

export default db;
