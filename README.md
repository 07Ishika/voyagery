# Voyagery — Global Migration Platform

<div align="center">

**Your Journey to Global Success Starts Here**

🔗 **[Live App](https://voyagery.vercel.app)**

[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

</div>

## 🌍 About Voyagery

Voyagery is a MERN stack platform that connects migrants with verified immigration guides for personalized 1:1 consultations. It also includes **Costlytic**, a cost-of-living comparison tool with AI-generated relocation insights, to help users evaluate whether a move is financially realistic before they commit to it.

> This is an actively developed MVP built as a personal/portfolio project. See [Project Status](#-project-status) below for what's fully built vs. in progress.

### ✨ Key Features

- **🔐 Authentication** — Google OAuth and manual login, with role-based access for migrants and guides
- **👥 Two-Sided Marketplace** — Separate dashboards and navigation for migrants and guides
- **🔍 Guide Discovery** — Search and filter guides by specialization, rating, and experience
- **📞 Consultation Flow** — Request, accept/decline, and schedule sessions, with meeting links tracked on both dashboards
- **📊 Migrant & Guide Dashboards** — Request counts, statuses, and upcoming scheduled calls
- **📁 Document Management** — Upload and manage trip files and guide credentials
- **💰 Costlytic** — Compare cost of living between two cities (housing, food, transport, utilities), convert currencies, and score budget feasibility against real user input
- **🤖 AI Cost Insights** — LLM-generated recommendations based on the cost comparison (biggest cost gaps, hidden costs, budget adjustment suggestions)
- **🔄 Auto-Refreshing Dashboards** — Polling-based updates for new requests

## 📌 Project Status

| Area | Status |
|---|---|
| Auth (Google OAuth + manual) | ✅ Complete |
| Guide search & discovery | ✅ Complete |
| Consultation request/booking flow | ✅ Complete |
| Migrant & guide dashboards | ✅ Complete |
| Document upload | ✅ Complete |
| Costlytic (cost comparison + currency conversion) | ✅ Complete |
| AI cost insights | ✅ Complete |
| Community discussions | 🚧 Prototype / mock data — schema and UI in place, backend integration in progress |
| Guide profile pages (extended content) | 🚧 Partial — some sections still use placeholder data |

The live demo includes seeded guide profiles and sample consultations so the core flows can be explored end-to-end without signing up.

## 🏗️ Architecture

### Frontend (React + Vite)
```
src_js/
├── components/          # Reusable UI components
├── pages/               # Route-based page components
├── contexts/            # React Context providers
├── hooks/               # Custom React hooks
├── services/            # API service layer
└── utils/               # Utility functions
```

### Backend (Node.js + Express)
```
server/
├── index.js             # Main server file with API routes
├── models/              # Mongoose schemas
├── middleware/          # Authentication and validation
├── utils/               # Server utilities
└── config/              # Database and environment configuration
```

### Database (MongoDB)
```
Collections:
├── users                # Authentication data
├── profiles             # Extended, role-specific user profiles
├── guide_sessions        # Session requests and bookings
├── documents            # Uploaded files
```
> Update this list to match your actual `models/` folder before publishing — remove any collections (e.g. messages, reviews, notifications) that aren't implemented yet.

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (v4.4 or higher, local or Atlas)
- **npm**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/07Ishika/voyagery.git
   cd voyagery
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd server && npm install && cd ..
   ```

3. **Environment setup**

   Create a `.env` file inside `server/`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/voyagery
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
   SESSION_SECRET=your_session_secret
   PORT=5000
   ```
   > List every env var your app actually reads (e.g. an LLM API key for AI insights, a currency-conversion API key) — check `server/config` and add them here.

4. **Run the app**
   ```bash
   # Terminal 1
   cd server && node index.js

   # Terminal 2
   npm run dev
   ```

5. **Access**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 👥 User Roles

### 🧳 Migrants
- Dashboard with request status (total, pending, accepted, scheduled)
- Browse and filter verified guides
- Request consultations
- Use Costlytic to compare and plan destination costs
- Upload and manage documents

### 👨‍💼 Guides
- Dashboard to manage incoming requests
- Accept/decline consultations
- View and contact migrants
- Profile showcasing specialization, languages, and experience

## 🛠️ Technology Stack

**Frontend:** React 18, Vite, Tailwind CSS, shadcn/ui, React Router, Lucide React
**Backend:** Node.js, Express.js, MongoDB, Mongoose, Passport.js, Express Session
**Auth:** Google OAuth 2.0, session-based auth, role-based access control
**AI:** LLM integration for cost/relocation insight generation
**Deployment:** Vercel (frontend), Render (backend), MongoDB Atlas

## 📡 API Endpoints

> Confirm each of these against `server/index.js` / your route files before publishing — remove anything not implemented, add anything missing (e.g. Costlytic and AI insight routes).

### Authentication
```
GET  /auth/google
GET  /auth/google/callback
GET  /auth/user
POST /auth/manual-login
POST /auth/set-role
GET  /auth/logout
```

### Profiles
```
GET  /api/profile/:userId
POST /api/profile
```

### Sessions
```
GET    /api/guide-sessions
POST   /api/guide-sessions
PUT    /api/guide-sessions/:id
DELETE /api/guide-sessions/:id
```

### Search & Discovery
```
GET /api/guides/search
```

### Costlytic
```
GET  /api/costlytic/compare
POST /api/costlytic/insights
```

## 🔧 Available Scripts

**Frontend**
```bash
npm run dev
npm run build
npm run preview
npm run lint
```

**Backend**
```bash
node index.js
node create-test-users.js
```

## 🚀 Deployment

Deployed frontend on **Vercel** and backend on **Render**, with a hosted **MongoDB Atlas** database.

Production environment variables (backend):
```env
NODE_ENV=production
MONGODB_URI=your_atlas_connection_string
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=https://your-backend.onrender.com/auth/google/callback
SESSION_SECRET=...
PORT=5000
```

> Note: the Render free tier sleeps after inactivity — the first request after idle time may take 30–50 seconds.

## 📄 License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">
  <p>Built by <a href="https://github.com/07Ishika">Ishika Anam</a></p>
</div>
