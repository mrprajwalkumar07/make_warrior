const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const validator = require('validator');
const Database = require('better-sqlite3');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_KEY = process.env.ADMIN_KEY || 'Prajwalz@30';

// Initialize SQLite database
const dbPath = path.join(__dirname, 'warrior_feedback.db');
const db = new Database(dbPath);

// Create table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    email TEXT NOT NULL,
    note TEXT NOT NULL,
    created_at TEXT NOT NULL
  )
`);

const cors = require('cors');

// Middleware
app.use(cors({
  origin: '*', // Allows requests from Cloudflare Pages, localhost, or any domain
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-admin-key']
}));
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));
const fs = require('fs');

// Determine static directory (dist if built, otherwise public)
const staticDir = fs.existsSync(path.join(__dirname, 'dist'))
  ? path.join(__dirname, 'dist')
  : path.join(__dirname, 'public');

app.use(express.static(staticDir));

// Rate limiter for feedback endpoint: 5 submissions per minute per IP
const feedbackLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: 429,
  message: {
    success: false,
    error: 'Too many battlefield dispatches sent from this location. Please wait 1 minute before submitting again.'
  }
});

// Helper for input sanitization (trim and HTML escaping)
function sanitizeText(str) {
  if (typeof str !== 'string') return '';
  return validator.escape(str.trim());
}

/**
 * Validation Helper
 * - Name: required, 2-60 characters
 * - Phone number: required, 7-15 digits (allow + and spaces)
 * - Email: required, valid format
 * - Note: required, 5-1000 characters
 */
function validateFeedback(body) {
  const errors = {};

  const rawName = typeof body.name === 'string' ? body.name.trim() : '';
  const rawPhone = typeof (body.phoneNumber || body.phone_number) === 'string'
    ? (body.phoneNumber || body.phone_number).trim()
    : '';
  const rawEmail = typeof body.email === 'string' ? body.email.trim() : '';
  const rawNote = typeof body.note === 'string' ? body.note.trim() : '';

  // Validate Name
  if (!rawName) {
    errors.name = 'Name is required.';
  } else if (rawName.length < 2 || rawName.length > 60) {
    errors.name = 'Name must be between 2 and 60 characters.';
  }

  // Validate Phone Number
  // Allowed characters: +, digits, spaces, hyphens. Total digits must be 7-15.
  const phoneCharRegex = /^\+?[\d\s-]+$/;
  const digitsOnly = rawPhone.replace(/\D/g, '');

  if (!rawPhone) {
    errors.phoneNumber = 'Phone number is required.';
  } else if (!phoneCharRegex.test(rawPhone) || digitsOnly.length < 7 || digitsOnly.length > 15) {
    errors.phoneNumber = 'Phone number must contain between 7 and 15 digits (spaces and + are allowed).';
  }

  // Validate Email
  if (!rawEmail) {
    errors.email = 'Email address is required.';
  } else if (!validator.isEmail(rawEmail)) {
    errors.email = 'Please provide a valid email address.';
  }

  // Validate Note
  if (!rawNote) {
    errors.note = 'Note is required.';
  } else if (rawNote.length < 5 || rawNote.length > 1000) {
    errors.note = 'Note must be between 5 and 1000 characters.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    data: {
      name: sanitizeText(rawName),
      phoneNumber: sanitizeText(rawPhone),
      email: validator.normalizeEmail(rawEmail) || rawEmail.toLowerCase(),
      note: sanitizeText(rawNote)
    }
  };
}

// POST /api/feedback: Submit feedback
app.post('/api/feedback', feedbackLimiter, (req, res) => {
  try {
    const { isValid, errors, data } = validateFeedback(req.body || {});

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed. Please correct the highlighted errors.',
        errors
      });
    }

    const createdAt = new Date().toISOString();
    const insertStmt = db.prepare(`
      INSERT INTO feedback (name, phone_number, email, note, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = insertStmt.run(
      data.name,
      data.phoneNumber,
      data.email,
      data.note,
      createdAt
    );

    return res.status(201).json({
      success: true,
      message: 'Battlefield dispatch received and recorded successfully.',
      id: result.lastInsertRowid,
      created_at: createdAt
    });
  } catch (err) {
    console.error('Error inserting feedback:', err);
    return res.status(500).json({
      success: false,
      error: 'Internal server error while processing feedback.'
    });
  }
});

// GET /api/feedback: Protected route to view feedback entries
app.get('/api/feedback', (req, res) => {
  const clientKey = req.headers['x-admin-key'];

  if (!clientKey || clientKey !== ADMIN_KEY) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Missing or invalid x-admin-key header.'
    });
  }

  try {
    const query = db.prepare(`
      SELECT id, name, phone_number, email, note, created_at
      FROM feedback
      ORDER BY id DESC
    `);
    const records = query.all();

    return res.status(200).json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (err) {
    console.error('Error querying feedback:', err);
    return res.status(500).json({
      success: false,
      error: 'Internal server error while retrieving feedback.'
    });
  }
});

// Catch-all route to serve index.html for client side
app.get('*', (req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`⚔️  MAKE WARRIOR SERVER ACTIVE ⚔️`);
  console.log(`🌐  Local URL: http://localhost:${PORT}`);
  console.log(`🛡️  Admin Key Configured: ${ADMIN_KEY ? 'Yes' : 'No'}`);
  console.log(`=========================================`);
});
