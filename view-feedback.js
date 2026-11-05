const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, 'warrior_feedback.db');

try {
  const db = new Database(dbPath);
  const rows = db.prepare(`
    SELECT id, name, phone_number, email, note, created_at
    FROM feedback
    ORDER BY id DESC
  `).all();

  console.log('\n======================================================');
  console.log(`⚔️  MAKE WARRIOR - BATTLEFIELD DISPATCH INBOX (${rows.length} Total) ⚔️`);
  console.log('======================================================\n');

  if (rows.length === 0) {
    console.log('No dispatches recorded yet.\n');
  } else {
    console.table(rows);
  }
} catch (err) {
  console.error('Failed to read database:', err.message);
}
