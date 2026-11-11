# Setup Guide: Krishi Mitra AI (Crop Advisory Assistant)

This guide walks you through setting up and running the **Krishi Mitra AI** platform locally or deploying it to production.

---

## 1. Prerequisites

- **Node.js**: Version 20.x or later (LTS recommended)
- **npm** or **pnpm**
- **Supabase Account**: (Free tier at [supabase.com](https://supabase.com))
- **Google AI Studio Account**: For the Gemini API key ([aistudio.google.com](https://aistudio.google.com))

---

## 2. Supabase Configuration

### Step 2.1: Create Project
1. Log in to your [Supabase Dashboard](https://supabase.com/dashboard) and create a new project (e.g. `krishi-mitra-ai`).
2. Note your **Project URL** and **API Keys** (`anon` public key and `service_role` secret key) under **Project Settings -> API**.

### Step 2.2: Apply Database Migrations
1. In the Supabase sidebar, navigate to the **SQL Editor**.
2. Click **New Query**, paste the contents of `supabase/migrations/001_initial_schema.sql`, and click **Run**.
3. Create a second query, paste the contents of `supabase/seed.sql`, and click **Run**.
4. This sets up all 9 tables, indexes, triggers, and Row Level Security (RLS) policies.

### Step 2.3: Storage Bucket (Optional for permanent image storage)
1. Go to **Storage** -> **New Bucket**.
2. Name the bucket `disease-images` and mark it private.

---

## 3. Google Gemini Setup

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Generate an API Key.
3. Keep this key confidential; it will only be placed in `server/.env`.

---

## 4. Backend Configuration (`server/`)

1. Copy the environment template:
   ```bash
   cd server
   cp .env.example .env
   ```
2. Fill in the variables in `server/.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173

   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   GEMINI_API_KEY=your_gemini_api_key
   GEMINI_MODEL=gemini-2.5-flash
   ```
3. Start the server:
   ```bash
   npm run dev
   ```
   The backend will be running at `http://localhost:5000`.

---

## 5. Frontend Configuration (`client/`)

1. Copy the frontend environment template:
   ```bash
   cd client
   cp .env.example .env
   ```
2. Fill in `client/.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api/v1
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The web application will open at `http://localhost:5173`.

---

## 6. Development Demo Mode

If you wish to test the UI immediately before provisioning Supabase credentials:
- Open the application at `http://localhost:5173`.
- Click **Sign In** -> **Continue as Demo Farmer (Ramesh Patel, Dharwad)**.
- All forms, radar charts, PDF generation, and speech synthesis are fully interactive.

