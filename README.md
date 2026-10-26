# KAI — Personal Japanese Mastery Platform (日本語マスター)

> **Learn Japanese. Think Japanese. Master Japanese.**

An elite, interactive, trilingual Japanese-learning web application tailored for an English- and Telugu-speaking learner progressing from early Hiragana to JLPT mastery.

---

## 🌟 Key Highlights

1. **Trilingual Pedagogical Architecture**:
   - **Japanese Script**: Kanji, Hiragana, Katakana with accessible ruby furigana.
   - **Telugu Guidance**: Natural Telugu explanations and Telugu-script phonetic pronunciation guides (e.g., `కొరె వా హొన్ దెసు` / `ఇది ఒక పుస్తకం`).
   - **English Explanations**: Grammatical breakdown, word-by-word meaning, and cultural notes.
   - **Display Mode Switcher**: Instant toggle between **Bilingual (ద్విభాషా)**, **English**, and **Telugu**.

2. **Single-User Security & Data Sovereignty**:
   - Protected routes and session management with master access-key authorization.
   - Supabase Auth + Row Level Security (RLS) policies for hosted PostgreSQL synchronization.
   - Zero-telemetry local storage with full JSON data export and permanent wipe/purge options.
   - Server-side and client-safe secret handling.

3. **Curriculum & Core Modules**:
   - **Home Dashboard**: Real study streak, mastery level, FSRS reviews due, competency radar, and daily quests.
   - **Kana Academy**: Full Gojuon grid, dakuten, handakuten, stroke order demonstrations, and guided tracing canvas.
   - **Vocabulary Academy**: High-yield N5/N4 core words organized by topic with audio, mnemonics, and flashcards.
   - **Kanji Dojo**: Radical decomposition, ON/KUN readings with Telugu guides, compounds, and stroke writing.
   - **Grammar Lab**: Particle contrasts (は vs が, に vs で), verb conjugations (Te-form, Masu-form), and cloze tests.
   - **Sentence Forge**: Interactive tile arrangement and real-time Romaji-to-Kana IME input.
   - **KAI AI Tutor**: Level-adaptive mentor (Beginner to N1) with Gemini API support and built-in pedagogical fallback engine.
   - **Speaking Studio**: Push-to-talk microphone shadowing with mora-level pronunciation discrepancy analysis.
   - **Handwriting & Homework Analyzer**: Genkō yōshi digital canvas and photograph upload with Japanese OCR inspection.
   - **Listening Lab**: Variable speed audio playback (0.7x learner rate), dictation, and comprehension quizzes.
   - **Reading Theatre**: Original graded reader stories with clickable lexicon and comprehension challenges.
   - **KAI RPG & Learning Games**: 10 real playable arcade games (Kana Reflex speed rush, Memory Match, Grammar Boss fight, etc.).
   - **Spaced Repetition Deck**: Full FSRS-4 algorithm scheduling (Again, Hard, Good, Easy) for optimal retention.
   - **Weakness Detection & Mistake Notebook**: Evidence-based analytics detecting confusion matrices (さ vs き, は vs わ).
   - **Study Planner & Memory Coach**: Interleaved daily routine scheduler (10, 20, 30, 45 min) and streak shield.
   - **JLPT Exam Arena**: Timed diagnostic mock exam simulator adhering to official N5 specifications.

---

## 🛠️ Tech Stack & Dependencies

| Layer | Technology | License |
|---|---|---|
| **Framework** | React 18 + TypeScript + Vite | MIT |
| **Styling** | Tailwind CSS (Japanese Editorial RPG Palette) | MIT |
| **Icons & Motion** | Lucide React + Canvas Confetti | MIT / ISC |
| **Spaced Repetition** | `ts-fsrs` (Free Spaced Repetition Scheduler) | MIT |
| **Japanese Processing**| `wanakana` (Romaji / Kana conversion) | MIT |
| **Handwriting OCR** | `tesseract.js` (Client-side Japanese OCR) | Apache-2.0 |
| **Audio & Speech** | Web Speech API (Synthesis & Recognition) | Web Standard |
| **Backend & Auth** | Supabase Auth + PostgreSQL RLS | Apache-2.0 |
| **Test Suite** | Vitest (11 passing unit tests) | MIT |

---

## 🚀 Quickstart & Development

### 1. Installation
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
The application will launch at `http://localhost:5173`.

### 3. Run Test Suite
```bash
npm run test
```

### 4. Build for Production
```bash
npm run build
```
The optimized bundle will be generated in `dist/`.

---

## 🔐 Configuration & Environment Variables

Copy `.env.example` to `.env`:
```env
# Optional Supabase credentials for cloud sync (local master mode works offline)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional Google Gemini API key for live AI generation (built-in pedagogical engine active by default)
VITE_GEMINI_API_KEY=AIzaSy...
```

---

## 📜 Supabase Database Setup

To enable cloud persistence with Row Level Security:
1. Create a Supabase project at [supabase.com](https://supabase.com).
2. Go to the SQL Editor and execute `supabase/migrations/20261026_kai_schema.sql`.
3. Copy your project URL and anon public key into `.env`.
