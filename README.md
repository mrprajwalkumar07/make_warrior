# ⚔️ MAKE WARRIOR - Personal Portfolio & Feedback System

A high-performance personal portfolio website built with a bold, dark warrior aesthetic (deep obsidian, crimson blade accents, and forged gold highlights). Engineered with vanilla frontend technologies (HTML5, CSS3, Vanilla ES6 JavaScript) and a hardened Node.js/Express backend with SQLite (`better-sqlite3`) persistence.

---

## 🚀 Features

- **Warrior Design System**: Mobile-first responsive layout, sharp beveled cuts, glowing hover states, and smooth scrolling.
- **Single-Page Architecture**:
  - **Apex / Hero**: Name, rank, battle status HUD, and action triggers.
  - **The Creed (About Me)**: Philosophy, battlefield stats counters (Battles won, uptime, dedication).
  - **The Arsenal (Skills)**: Categorized proficiencies (Frontline Combat, Stronghold Engineering, Tactical Operations) with power meters.
  - **The Armory (Projects)**: 3 featured project cards with technology tags and demo links.
  - **Battlefield Dispatch (Feedback)**: Interactive feedback form with real-time client & server validation, character count, loading indicators, and status banners.
  - **Footer**: Brand crest, creed quote, and copyright.
- **Fortified Backend**:
  - `POST /api/feedback`: Accepts and validates name, phone number, email, and note. Sanitizes input and saves to local SQLite file (`warrior_feedback.db`).
  - Rate Limiting: 5 submissions per minute per IP address.
  - `GET /api/feedback`: Protected administrative endpoint requiring `x-admin-key` header matching `ADMIN_KEY` in `.env`.

---

## 🛠️ Project Structure

```
make-warrior/
├── public/
│   ├── index.html       # Single-page HTML markup with accessible semantics
│   ├── style.css        # Warrior theme styles, animations, and responsive layout
│   └── script.js        # Form validation, async dispatch submission, & editable content config
├── .env                 # Local environment variables (PORT, ADMIN_KEY)
├── .env.example         # Environment template for deployments
├── package.json         # Dependencies and start script
├── server.js            # Express server, SQLite init, rate limiting, and feedback routes
├── warrior_feedback.db  # SQLite database file (created automatically on startup)
└── README.md            # Documentation and deployment instructions
```

---

## ⚡ Quick Start

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher recommended, tested on Node v24)
- **npm** (v9.0.0 or higher)

### 2. Installation
Open your terminal in the project directory:
```bash
cd make-warrior
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env` (already configured for local development):
```bash
cp .env.example .env
```
Default `.env` values:
```env
PORT=3000
ADMIN_KEY=Prajwalz@30
```

### 4. Start the Server
```bash
npm start
```
The server will start at:
👉 **`http://localhost:3000`**

---

## 📝 How to Edit Your Name, Text, and Projects

All personal profile information and project placeholders are kept in **one clearly marked location** at the top of `public/script.js`:

### Editing in `public/script.js`:
Open `public/script.js` and edit the `WARRIOR_CONFIG` object:

```javascript
const WARRIOR_CONFIG = {
  profile: {
    name: "YOUR NAME OR ALIAS",
    badge: "YOUR MOTTO // CORE PRINCIPLES",
    tagline: "Your customized elevator pitch and engineering mission.",
    rank: "LEAD ARCHITECT / SENIOR DEVELOPER",
    specialization: "SPECIALIZATION: CLOUD & DISTRIBUTED SYSTEMS",
    aboutLead: "Your headline introduction in the about section.",
    bioParagraph1: "Your first background paragraph.",
    bioParagraph2: "Your second background paragraph.",
    stats: [
      { number: "75+", label: "Projects Completed", accent: "accent-gold" },
      { number: "99.9%", label: "Uptime Defense", accent: "accent-crimson" },
      { number: "8 Yrs", label: "Battle Experience", accent: "accent-gold" },
      { number: "100%", label: "Client Satisfaction", accent: "accent-crimson" }
    ]
  },

  projects: [
    {
      badge: "SECURITY TOOL",
      badgeClass: "",
      title: "Your First Project",
      description: "Brief summary of what it does and why it was built.",
      techStack: ["React", "Go", "PostgreSQL"],
      demoUrl: "https://your-demo-link.com",
      repoUrl: "https://github.com/your-username/your-repo"
    },
    // ... edit card 2 and card 3
  ]
};
```

You can also edit any static text directly inside `public/index.html` where sections are marked with comment banners like `<!-- ==================== HERO SECTION ==================== -->`.

---

## 🛡️ Administrative Inspection (Viewing Feedback)

All feedback entries are saved in `warrior_feedback.db`. You can view them in 3 easy ways:

### Method 1: In Your Browser (Visual Inbox)
1. Open 👉 **`http://localhost:3000/admin.html`** in your browser.
2. Enter your `ADMIN_KEY` (default is `Prajwalz@30`).
3. View all dispatches formatted in a warrior-styled table with instant refresh!

### Method 2: In Your Terminal (One Command)
Run this command in the project directory:
```bash
npm run feedback
```
This prints a clean table of all feedback directly to your terminal.

### Method 3: Using the Raw API with cURL or PowerShell
#### Using cURL:
```bash
curl -H "x-admin-key: Prajwalz@30" http://localhost:3000/api/feedback
```

#### Using PowerShell:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/feedback" -Headers @{ "x-admin-key" = "Prajwalz@30" } | ConvertTo-Json
```

### Unauthorized Access:
Requests without the correct `x-admin-key` header will receive:
```json
{
  "success": false,
  "error": "Unauthorized: Missing or invalid x-admin-key header."
}
```

---

## 🚢 Deployment Guide

When you're ready to deploy "Make Warrior" to the public internet:

### Option A: Render.com (Recommended - Free & Fast)
1. Push your repository to GitHub or GitLab.
2. In [Render](https://render.com), create a new **Web Service**.
3. Connect your repository.
4. Set:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Under **Environment Variables**, add:
   - `ADMIN_KEY`: `<YourSecretSecurePassword>`
   - `NODE_ENV`: `production`
6. (Optional) Under **Disks**, attach a persistent disk mounted to `/opt/render/project/src` if you want the SQLite database file to persist between cold rebuilds.

### Option B: Railway.app
1. Go to [Railway.app](https://railway.app), click **New Project** &rarr; **Deploy from GitHub repo**.
2. Railway detects Node.js and runs `npm install` and `npm start` automatically.
3. In **Variables**, add `ADMIN_KEY`.
4. Attach a volume if persistent SQLite storage is required.

### Option C: Fly.io
1. Install `flyctl` and run `fly launch`.
2. Create a volume for SQLite: `fly volumes create warrior_data -s 1`.
3. Set your secret: `fly secrets set ADMIN_KEY=your_secure_key`.
4. Run `fly deploy`.

### Option D: Ubuntu / Debian VPS with PM2 & Nginx
1. SSH into your VPS.
2. Clone repository and run `npm install`.
3. Create `.env` file with production values.
4. Start process with PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name "make-warrior"
   pm2 save
   pm2 startup
   ```
5. Point Nginx reverse proxy to `http://localhost:3000`.
6. Obtain free SSL using Certbot:
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

---

## 📄 License
Released under the MIT License. Built for warriors of code.
