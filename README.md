# Saaboq — Distraction-Free Educational Video Platform (MVP)

A modern, high-density educational video-sharing platform engineered strictly for structured, deep technical learning. Inspired by YouTube's information-dense video browsing and Linear's precise, restrained interface.

---

## 1. Visual Direction & Anti-AI Design Rules

- **Palette (Amethyst, Royal Violet & Luminous Mauve)**:
  - `--dark-amethyst: #10002b` (Deepest obsidian purple - main body background)
  - `--dark-amethyst-2: #240046` (Dark velvet amethyst - panels, sidebar, video controls & card surfaces)
  - `--indigo-ink: #3c096c` (Deep royal indigo - inputs, elevated hover states)
  - `--indigo-velvet: #5a189a` (Luminous border, subtle dividers, active cards)
  - `--royal-violet: #7b2cbf` (Royal violet - secondary accents, borders, tags)
  - `--lavender-purple: #9d4edd` (Electric lavender - primary buttons, active icons)
  - `--mauve-magic: #c77dff` (Neon mauve - brand "oq" glow, active indicator lines, CTAs)
  - `--mauve: #e0aaff` (Ethereal light mauve - subtitles, badges, tags, secondary text)
  - Text high: `#fdfcff` (Crisp crystalline ice-white for primary headings)
- **Geometry & Micro-Interactions**:
  - Video thumbnails: `8px` border radius.
  - Buttons and inputs: `6px` border radius.
  - No oversized landing-page hero sections: Immediate video feed when opened.
  - No bouncing, scaling, or upward-moving card hover animations: Thumbnails remain strictly stationary on hover with a subtle `120ms` background transition.
  - Monospace duration badges: At most one badge in the bottom-right corner (`rgba(0,0,0,0.85)`). Course lessons format: `03/12 • 18:40`. Standalone videos: `18:40`.
  - Sticky navbar: `backdrop-filter: blur(12px)` with `background: rgba(22, 25, 29, 0.85)`.

---

## 2. Technology Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript.
- **Styling**: Tailwind CSS v4 + PostCSS, integrated with exact CSS variable tokens.
- **Icons**: Lucide React.
- **State & Data Store**: Unified persistent store layer (`src/lib/store.ts`) mirroring relational schema in `localStorage` + Supabase client utilities (`src/lib/supabase/client.ts`).
- **Database & Auth Schema**: Supabase PostgreSQL schema with 10 tables, RLS policies, full-text search indexes, triggers (`supabase/schema.sql`).
- **Video Delivery Pipeline**: Ready for Cloudflare Stream HLS/DASH direct uploads with fallback for validated HTTPS MP4 streams.

---

## 3. Core Implemented Features & Routes

| Route | Description |
| :--- | :--- |
| `/` | **Home Feed**: Immediate video grid, category filter chips, curated lessons, structured tracks shelf, most studied lessons, recently published. |
| `/explore` | **Curriculum Discovery**: Real database search with 250ms debouncing, category filter, difficulty filter (Beginner/Intermediate/Advanced), and sorting (newest, views, duration). |
| `/watch/[id]` | **Video Watch & Classroom**: Responsive video player, lesson navigation (prev/next), course playlist drawer, like/unlike with counter, save/bookmark, canonical share, chapter timestamps seeking, verified academic papers/code links, and discussion comments. |
| `/channel/[username]` | **Educator Public Profile**: Channel banner, verified educator credentials, subscriber count, tabs for Lessons, Courses & Tracks, and Curriculum Philosophy. |
| `/dashboard` | **Creator Studio**: Real analytics cards (total views, subscribers, published lessons, courses), lesson management table with inline edit and delete confirmation modals, course track creator, and educator bio editor. |
| `/upload` | **Video Publishing Workflow**: Educational lecture publisher with Cloudflare Stream diagnostics, sample educational video presets, custom stream URL validation, chapter builder, resource attachments builder, and live card preview before publishing. |
| `/courses` | **Structured Tracks Catalog**: Multi-module master tracks organized in chronological order with syllabus view and direct playback links. |
| `/subscriptions` | **Educator Subscriptions**: Dedicated feed of lectures published by followed instructors. |
| `/saved` | **Saved Videos Library**: Persistent personal bookmarks with 1-click removal. |
| `/history` | **Watch & Progress History**: Resumes lectures from exact timestamps and displays completion percentages. |
| `/admin/moderation` | **Curriculum Moderation Queue**: Protected admin route to inspect flagged content, review report reasons, dismiss reports, or delete violating videos. |
| `/auth/login` & `/register` | **Authentication Flow**: Account creation, login, guest protection dialogs, and an evaluator 1-click persona switcher (Julian - Viewer, Dr. Elena - Educator, Admin - Moderation). |
| `/settings` | **Settings & Diagnostics**: Profile editor, Supabase/Cloudflare architecture status, and 1-click database seed reset. |

---

## 4. Setup & Running Locally

### Step 1: Install Dependencies
```bash
npm install --legacy-peer-deps
```

### Step 2: Configure Environment (Optional)
Copy `.env.example` to `.env.local` to connect your remote Supabase and Cloudflare Stream accounts:
```bash
cp .env.example .env.local
```
*(Note: Saaboq runs immediately out of the box with zero external configuration using its internal unified persistence layer and authentic technical diagrams).*

### Step 3: Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 4: Run the Production Build
```bash
npm run build
npm run start -p 3000
```

---

## 5. Supabase Database Setup

When connecting to Supabase:
1. Create a project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase Dashboard.
3. Paste and execute the contents of [`supabase/schema.sql`](file:///c:/Users/HP%20VICTUS/Desktop/Saaboq/supabase/schema.sql).
4. Copy `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to your `.env.local`.
