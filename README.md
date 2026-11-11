# Krishi Mitra AI (AI-Powered Agriculture Crop Advisory Assistant)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey.svg)](https://expressjs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E.svg)](https://supabase.com/)
[![Gemini AI](https://img.shields.io/badge/Google%20GenAI-Gemini%202.5-orange.svg)](https://aistudio.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Empowering Indian farmers with scientific agro-climatic intelligence, multimodal plant pathology scanning, precision fertigation schedules, and vernacular audio decision support.**

---

## 🌾 Project Overview

**Krishi Mitra AI** is an enterprise-grade, accessible agricultural decision-support web platform engineered for smallholder and commercial Indian farmers, agricultural students, and Krishi Vigyan Kendra (KVK) extension agents.

The system translates raw environmental parameters (soil texture, pH, NPK laboratory measurements, water availability, crop phenological stages) and leaf photographs into scientifically sound, actionable agricultural intelligence.

### Core Agronomic Philosophy
- **Decision Support, Not Scientific Absolutes**: AI outputs are framed as decision-support guidance, never as guaranteed predictions.
- **Anti-Hallucination Guardrails**: Never invents soil tests, weather records, or unregistered pesticides. Communicates missing information clearly.
- **Integrated Pest Management (IPM)**: Gated remediation pathway: Cultural $\rightarrow$ Biological/Bio-control $\rightarrow$ Regulated Chemical, complete with Pre-Harvest Intervals (PHI) and Personal Protective Equipment (PPE) notices.
- **Trilingual Accessibility**: Full native support for **English**, **Kannada (ಕನ್ನಡ)**, and **Hindi (हिन्दी)** with built-in voice read-aloud functionality for semi-literate users.

---

## 🚀 Key Features

1. **AI Crop Recommendation Engine**: Matches soil chemistry, target season (Kharif, Rabi, Zaid), water source, and prior crop history to recommend the top 3-4 suitable crops with suitability scores ($0-100\%$), estimated duration, yield forecasts, and management tips.
2. **Soil Health & Nutrient Analysis**: Digitizes physical soil testing laboratory reports (pH, EC, Organic Carbon %, N, P, K). Renders an interactive 5-axis **Soil Health Radar Chart** plotted against ICAR fertile benchmarks, accompanied by lime/gypsum/FYM soil amendment dosing.
3. **Stage-Wise Fertilizer Guidance**: Calculates balanced nutrient regimens tailored to the crop's specific phenological stage (Basal, Vegetative, Flowering, Grain Filling) with organic alternatives and safety precautions.
4. **Precision Irrigation Advisory**: Formulates water budgets, monitoring intervals, and water conservation practices while checking for visual water-stress indicators.
5. **Multimodal Plant Doctor (Disease Scanner)**: Inspects uploaded leaf/plant photographs using Gemini Vision (`gemini-2.5-pro` / `gemini-2.5-flash`), delivering confidence scores, differential diagnoses, observed symptoms, and phased IPM remediation.
6. **"Ask Krishi Mitra" Agricultural Chatbot**: Multi-turn conversational assistant with conversation history persistence, topic categorization, and interactive follow-up question suggestions.
7. **Advisory History & Audit Ledger**: Filterable historical repository of all past crop plans, soil tests, and plant diagnoses with individual report views and deletion workflows.
8. **Exportable PDF Dossiers**: Instant compilation of clean, printable advisory dossiers using `jspdf` and `html2canvas`.
9. **Vernacular Audio Synthesizer**: Text-to-speech engine powered by the Web Speech API (`speechSynthesis`) that reads advisory summaries aloud in English, Kannada, or Hindi.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18 (Vite SPA) | Fast, responsive component-driven interface |
| **Styling** | Tailwind CSS | Accessible, mobile-first agricultural design |
| **Icons** | Lucide React | Clean, intuitive agricultural iconography |
| **Charts** | Recharts | 5-axis soil health radar and fertility index |
| **PDF Export** | jsPDF + html2canvas | Client-side export of formatted advisory briefs |
| **Backend** | Node.js + Express | RESTful API with structured routing and middleware |
| **Language** | TypeScript | End-to-end type safety and compile-time verification |
| **Database** | Supabase (PostgreSQL 15+) | Relational persistence with PostGIS & UUIDs |
| **Security** | Supabase RLS + Helmet + Rate Limit | Cross-tenant data isolation and API protection |
| **AI SDK** | `@google/genai` (Official) | Generative AI orchestration with structured JSON schemas |
| **Validation** | Zod | Runtime schema validation across all inputs and AI outputs |
| **Image Processing** | Sharp + Multer | In-memory buffering, EXIF stripping, and normalization |

---

## 📂 Project Directory Structure

```text
Antigravity project/
├── client/                     # React 18 + Vite Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI & domain components
│   │   │   ├── common/         # Navbar, Footer, AudioPlayer, LanguageSelector
│   │   │   ├── diagnostics/    # CameraDropzone
│   │   │   └── soil/           # SoilHealthRadarChart (Recharts)
│   │   ├── context/            # AuthContext, LanguageContext
│   │   ├── i18n/               # Trilingual dictionaries (EN, KN, HI)
│   │   ├── pages/              # Landing, Dashboard, CropAdvisor, Soil, Disease, Chat, History
│   │   ├── services/           # Supabase & Express API clients
│   │   ├── App.tsx             # Route definitions & guards
│   │   └── main.tsx            # React root entry point
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── server/                     # Node.js + Express Backend
│   ├── src/
│   │   ├── config/             # Supabase, Gemini, and Environment config
│   │   ├── controllers/        # Profile, Crop, Soil, Fertilizer, Irrigation, Disease, Chat
│   │   ├── middleware/         # Auth (JWT), Validation (Zod), Upload (Multer), Error handler
│   │   ├── prompts/            # Master agronomist system instruction & capability prompts
│   │   ├── routes/             # REST route endpoints under /api/v1
│   │   ├── schemas/            # Strict Zod schemas for AI responses
│   │   ├── services/ai/        # Gemini AI execution engine
│   │   └── app.ts              # Express application configuration
│   ├── package.json
│   └── tsconfig.json
├── database/                   # Database DDL & Reference fixtures
│   ├── schema.sql
│   └── seed.sql
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql  # Production Supabase migration script
│   └── seed.sql                    # Agricultural reference data
├── docs/                       # Technical architecture documentation
│   ├── API_DOCUMENTATION.md
│   ├── DATABASE_DOCUMENTATION.md
│   ├── SETUP_GUIDE.md
│   └── SECURITY.md
└── README.md
```

---

## ⚙️ Quick Start Installation

### 1. Prerequisites
- Node.js v20+ LTS
- npm v10+

### 2. Install Dependencies
```bash
# Install Server dependencies
cd server
npm install

# Install Client dependencies
cd ../client
npm install
```

### 3. Environment Variables

Create `.env` in `server/`:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Supabase Credentials
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
```

Create `.env` in `client/`:
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Apply Database Migrations in Supabase
1. Open your Supabase Project -> **SQL Editor**.
2. Run `supabase/migrations/001_initial_schema.sql`.
3. Run `supabase/seed.sql`.

### 5. Start Development Servers
In two separate terminals:
```bash
# Terminal 1: Backend API (runs on port 5000)
cd server
npm run dev

# Terminal 2: Frontend Client (runs on port 5173)
cd client
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 🧪 Testing & Verification Status

| Component | Status | Verification Detail |
|---|---|---|
| **Server TypeScript Compilation** | ✅ VERIFIED | `tsc` compiles with code 0; strict type checks satisfied. |
| **Client Vite Compilation** | ✅ VERIFIED | Production bundle builds cleanly with zero errors. |
| **Supabase Database Schema** | ✅ VERIFIED | 9 tables, 8 RLS policies, automatic signup triggers, and indexes. |
| **Gemini AI Integration** | ✅ VERIFIED | Uses official `@google/genai` SDK with strict JSON response parsing. |
| **Soil Radar Chart** | ✅ VERIFIED | Recharts renders 5-axis fertility index against ICAR standards. |
| **Plant Pathology Camera** | ✅ VERIFIED | EXIF stripping, JPEG compression, and base64 transmission via Sharp. |
| **Multilingual Engine** | ✅ VERIFIED | Full UI translations in English, Kannada, and Hindi. |
| **Audio Read-Aloud** | ✅ VERIFIED | Web Speech API synthesis with `kn-IN`, `hi-IN`, and `en-IN` voice tags. |
| **PDF Dossier Export** | ✅ VERIFIED | Formatted client-side PDF document generation. |
| **Demo Mode** | ✅ VERIFIED | Instant evaluator login bypassing third-party credentials. |

---

## 🚢 Production Deployment

- **Frontend**: Deploy `client/` to [Vercel](https://vercel.com) or [Netlify](https://netlify.com) using standard Vite settings (Build command: `npm run build`, Output directory: `dist`).
- **Backend**: Deploy `server/` to [Render](https://render.com), [Railway](https://railway.app), or AWS ECS (Build command: `npm run build`, Start command: `node dist/app.js`).
- Set environment variables on the respective hosting provider dashboards.

---

## 📜 Agricultural Advisory Disclaimer

*Krishi Mitra AI is a decision-support advisory tool designed to provide scientific recommendations. Recommendations must not be treated as infallible commercial predictions. Always consult your local Block Agricultural Officer, Krishi Vigyan Kendra (KVK), or State Agricultural University (SAU) before undertaking major chemical applications or capital expenditures.*
#   A n t i g r a v i t y p r o j e c t  
 