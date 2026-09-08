import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup file path for the local SQLite database
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, 'scores.db');

let db;

// This function connects to the local SQLite database and creates the table if it doesn't exist.
// It tracks a user's score over time so we can show them a history graph.
export async function initDB() {
    db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    // Create the table to store user scores and contribution points
    await db.exec(`
    CREATE TABLE IF NOT EXISTS score_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      score INTEGER NOT NULL,
      contributions INTEGER DEFAULT 0,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    // Migration logic: If the database is old and missing the 'contributions' column, add it safely.
    try {
        await db.exec('ALTER TABLE score_history ADD COLUMN contributions INTEGER DEFAULT 0');
        console.log('Migration: Added contributions column to score_history');
    } catch (e) {
        // If it throws an error, it means the column already exists, so we do nothing.
    }

    console.log('Database initialized at', dbPath);
}

// This function saves a new score entry into the database after an analysis is finished.
export async function saveScore(username, score, contributions = 0, timestamp = Date.now()) {
    if (!db) await initDB();
    const normalizedUsername = username.toLowerCase(); // Convert to lowercase to prevent duplicates like 'Zeel' vs 'zeel'
    await db.run(
        'INSERT INTO score_history (username, score, contributions, timestamp) VALUES (?, ?, ?, ?)',
        [normalizedUsername, score, contributions, timestamp]
    );
}

// This function retrieves all past scores for a specific user to display on the frontend charts.
export async function getHistory(username) {
    if (!db) await initDB();
    const normalizedUsername = username.toLowerCase();
    return await db.all(
        'SELECT score, contributions, timestamp FROM score_history WHERE username = ? ORDER BY timestamp ASC',
        [normalizedUsername]
    );
}
