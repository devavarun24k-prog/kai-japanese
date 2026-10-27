# KAI Japanese Mastery — Architectural Audit Report

Date: 2026-10-27  
Auditor: Antigravity Agent  
Repository: `c:\Users\enosh\Desktop\Kai`

---

## 1. Routes & Application Sections

KAI does not use a URL-based router like `react-router-dom`; instead, it utilizes a centralized, reactive application state router governed by `activeSection: ActiveSection` in [src/context/LearningContext.tsx](file:///c:/Users/enosh/Desktop/Kai/src/context/LearningContext.tsx) and orchestrated in [src/App.tsx](file:///c:/Users/enosh/Desktop/Kai/src/App.tsx).

### Current Sections:
1. `landing`: Cinematic landing page ([CinematicLandingPage.tsx](file:///c:/Users/enosh/Desktop/Kai/src/components/landing/CinematicLandingPage.tsx))
2. `dashboard`: Editorial home dashboard ([HomeDashboard.tsx](file:///c:/Users/enosh/Desktop/Kai/src/components/dashboard/HomeDashboard.tsx))
3. `start_here`: Structured 8-stage zero-to-N5 curriculum ([StartHerePath.tsx](file:///c:/Users/enosh/Desktop/Kai/src/components/startHere/StartHerePath.tsx))
4. `kana`: Stroke orders, mnemonics, audio, and quizzes for Hiragana/Katakana ([KanaAcademy.tsx](file:///c:/Users/enosh/Desktop/Kai/src/components/kana/KanaAcademy.tsx))
5. `vocab`: Categorized vocabulary browser with audio & Telugu guides ([VocabAcademy.tsx](file:///c:/Users/enosh/Desktop/Kai/src/components/vocab/VocabAcademy.tsx))
6. `kanji`: Radical breakdowns, stroke orders, and compounds ([KanjiDojo.tsx](file:///c:/Users/enosh/Desktop/Kai/src/components/kanji/KanjiDojo.tsx))
7. `grammar`: Formations, particles, and common mistakes ([GrammarLab.tsx](file:///c:/Users/enosh/Desktop/Kai/src/components/grammar/GrammarLab.tsx))
8. `sentence`: Sentence structure builder ([SentenceForge.tsx](file:///c:/Users/enosh/Desktop/Kai/src/components/sentence/SentenceForge.tsx))
9. `tutor`: Interactive AI tutor with fallback pedagogy ([AITutorChat.tsx](file:///c:/Users/enosh/Desktop/Kai/src/components/tutor/AITutorChat.tsx))
10. `speaking`: Shadowing and speech recognition ([SpeakingStudio.tsx](file:///c:/Users/enosh/Desktop/Kai/src/components/speaking/SpeakingStudio.tsx))
11. `handwriting`: Canvas drawing and Tesseract OCR handwriting evaluation ([HandwritingStudio.tsx](file:///c:/Users/enosh/Desktop/Kai/src/components/handwriting/HandwritingStudio.tsx))
12. `listening`: Audio discrimination drills ([ListeningLab.tsx](file:///c:/Users/enosh/Desktop/Kai/src/components/listening/ListeningLab.tsx))
13. `reading`: Multi-paragraph graded stories with inline lexicons ([ReadingTheatre.tsx](file:///c:/Users/enosh/Desktop/Kai/src/components/reading/ReadingTheatre.tsx))
14. `rpg_games`: Gamified drills ([RPGGameHub.tsx](file:///c:/Users/enosh/Desktop/Kai/src/components/games/RPGGameHub.tsx))
15. `reviews`: FSRS spaced repetition review deck ([SpacedRepetitionDeck.tsx](file:///c:/Users/enosh/Desktop/Kai/src/components/reviews/SpacedRepetitionDeck.tsx))
16. `analytics`: Weakness notebook & accuracy metrics ([WeaknessAnalytics.tsx](file:///c:/Users/enosh/Desktop/Kai/src/components/analytics/WeaknessAnalytics.tsx))
17. `planner`: Daily goals and study schedule ([StudyPlanner.tsx](file:///c:/Users/enosh/Desktop/Kai/src/components/planner/StudyPlanner.tsx))
18. `jlpt`: JLPT Mock exam arena & registration calendar ([JLPTArena.tsx](file:///c:/Users/enosh/Desktop/Kai/src/components/jlpt/JLPTArena.tsx))

**Navigation Model:**
- Desktop/Tablet: Progressive disclosure sidebar ([src/components/common/Sidebar.tsx](file:///c:/Users/enosh/Desktop/Kai/src/components/common/Sidebar.tsx)) showcasing 5 core modules: *Start Here*, *Practice*, *Reviews*, *Write*, *Tutor*, with other modules locked behind curriculum gates or attempt thresholds (e.g. Weakness Notebook unlocked after $\ge 50$ attempts).
- Keyboard shortcuts: `Ctrl+K` / `Cmd+K` launches [CommandPalette.tsx](file:///c:/Users/enosh/Desktop/Kai/src/components/common/CommandPalette.tsx).
- Mobile: Android hardware back button bridge via [platformService.ts](file:///c:/Users/enosh/Desktop/Kai/src/services/platformService.ts).

---

## 2. Contexts

1. **`AuthContext`** ([src/context/AuthContext.tsx](file:///c:/Users/enosh/Desktop/Kai/src/context/AuthContext.tsx)):
   - Dual-mode authentication:
     - **Production / Supabase Mode**: Connects via `@supabase/supabase-js`. Manages user sessions, password recovery, email confirmation, and single-owner enforcement (`VITE_OWNER_EMAIL`).
     - **Offline / Local Demo Mode**: Protected PBKDF2/SHA-256 hashed password store with salted keys in localStorage when Supabase is unconfigured or in offline demo environments.
   - Triggers `storageService.setUserId(user.id)` on authentication change to maintain strict user-namespaced isolation.

2. **`LearningContext`** ([src/context/LearningContext.tsx](file:///c:/Users/enosh/Desktop/Kai/src/context/LearningContext.tsx)):
   - Manages global state: `activeSection`, `stats` (`UserStats`), display preferences (`displayMode`: `'english' | 'telugu' | 'bilingual'`), sound toggle, furigana toggle, romaji toggle, and dark/light theme.
   - Provides reactive methods: `awardXP()`, `recordAttempt()`, `rateFSRSCard()`.

---

## 3. Services

- **`storageService.ts`**: Encapsulates all persistent storage. Handles user-scoped localStorage keys (`kai_user_<userId>_<key>`), legacy un-namespaced migration, export/import of full JSON backups, and an offline synchronization queue.
- **`supabaseClient.ts`**: Initializes `@supabase/supabase-js` client using `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Gracefully sets `isSupabaseConfigured = false` when missing.
- **`fsrsService.ts`**: Full Free Spaced Repetition Scheduler algorithm implementing 17 memory parameters ($w_0 \dots w_{16}$), retrievability calculation $R = (1 + \text{factor} \cdot t / S)^{-0.5}$, and next interval scheduling for ratings 1 (Again), 2 (Hard), 3 (Good), and 4 (Easy).
- **`audioService.ts`**: Browser `window.speechSynthesis` wrapper with natural Japanese voice auto-selection (`ja-JP`, prioritizing Google/Microsoft/Apple natural voices), rate adjustments (`speakSlow`), loop repetitions, and completion promises.
- **`speechRecognition.ts`**: Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`) for spoken Japanese analysis. Calculates Levenshtein distance against normalized phonetic kana and returns detailed mora mismatch feedback.
- **`aiService.ts`**: Dual-layer AI engine. Attempts to call the secure Supabase Edge Function `kai-tutor` (passing user JWT). If offline or unconfigured, falls back to a deterministic, zero-dependency offline pedagogical engine with quiz banks.
- **`platformService.ts`**: Bridge layer detecting Web vs. Windows Electron vs. Android Capacitor, managing URL external launches safely and registering hardware back buttons.
- **`soundEffects.ts`**: Web Audio API synthesizer generating clean synthesized tones for correct, incorrect, level-up, and click feedback without external audio files.

---

## 4. Storage Architecture: LocalStorage vs. Supabase & RLS

### LocalStorage Namespaces
Keys are strictly scoped per user to prevent session bleeding:
- `kai_user_<uid>_profile`
- `kai_user_<uid>_stats`
- `kai_user_<uid>_fsrs_cards`
- `kai_user_<uid>_attempts`
- `kai_user_<uid>_mistakes`
- `kai_user_<uid>_quests`
- `kai_user_<uid>_achievements`
- `kai_user_<uid>_completed_lessons`
- `kai_user_<uid>_favorite_vocab`
- `kai_user_<uid>_offline_sync_queue`

### Supabase Tables & RLS Policies ([supabase/migrations/20261026_kai_schema.sql](file:///c:/Users/enosh/Desktop/Kai/supabase/migrations/20261026_kai_schema.sql))
All tables enforce strict Row-Level Security:
1. `public.profiles`: Primary key `id UUID REFERENCES auth.users(id)`. RLS policy: `auth.uid() = id`.
2. `public.fsrs_cards`: Primary key `card_id TEXT`. Foreign key `user_id UUID REFERENCES auth.users(id)`. RLS policy: `auth.uid() = user_id`. Indexed by `(user_id, due)`.
3. `public.learning_attempts`: Primary key `id TEXT`. Foreign key `user_id UUID REFERENCES auth.users(id)`. RLS policy: `auth.uid() = user_id`. Indexed by `(user_id, timestamp DESC)`.
4. `public.mistake_records`: Primary key `id TEXT`. Foreign key `user_id UUID REFERENCES auth.users(id)`. RLS policy: `auth.uid() = user_id`.
5. Private Storage Bucket: `kai-private-evidence` with RLS restricting access to the user's subfolder: `(storage.foldername(name))[1] = auth.uid()::text`.

---

## 5. Authentication Flow

- Handled in `AuthContext.tsx`.
- On application mount, `supabase.auth.getSession()` is queried.
- If a valid session exists:
  - If `CONFIGURED_OWNER_EMAIL` is set and does not match, session is immediately terminated.
  - User ID is set in `storageService`, triggering local scoped cache retrieval and `syncFromSupabase()`.
- If no Supabase connection is available:
  - Offline demo login is permitted using salted PBKDF2 hash stored locally.
- On logout:
  - `storageService.clearMemoryState()` is invoked, memory references are purged, and guest profile is restored.
  - User records in localStorage remain isolated under `kai_user_<uid>_*`.

---

## 6. Kana & Vocabulary Progress Tracking Today

### Current Model
1. **FSRS Card Storage**:
   - `FSRSCard`: `{ card_id, item_id, item_type: 'kana'|'vocab'|'kanji'|'grammar'|'mistake'|'sentence', state, due, stability, difficulty, reps, lapses }`.
   - `stats.kana_mastery_pct` is derived dynamically by counting kana cards with `state === 2` (Review) and `stability >= 1.5` divided by 46 Gojuon characters.
   - `stats.vocab_mastered_count` counts vocab cards with `state === 2`.
2. **Attempt Logs**:
   - Stored in `LearningAttempt[]` (capped at 1,000 entries in localStorage). Records `is_correct`, `response_time_ms`, `error_category`.
3. **Shortcomings in Current Model**:
   - **No Character vs. Vocabulary Separation**: If a learner reviews the vocabulary word "あさ" (asa), the system does not separately know whether the learner has mastered the individual glyphs "あ" and "さ".
   - **Kana Sub-Units Unmapped**: Dakuten (が, ざ, だ, ば), Handakuten (ぱ), Yoon (きゃ, しゅ, ちょ), small tsu (っ), and long vowel marks (ー) are not tracked as distinct atomic mastery units.
   - **Static Vocabulary Pool**: Current vocabulary items in `src/data/vocabData.ts` do not distinguish between kana-only vs. kanji-dependent words, and lack verification tracking for regional Telugu transliterations.

---

## 7. Reusable Design Tokens & FX Components

- **Color Palette (`tailwind.config.js`)**:
  - `kai-vermilion` (`#D9483B`, `#B83226`)
  - `kai-indigo` / `ai-*` indigo scale (`#0A101C` through `#2E4370`)
  - `kai-gold` / `kinpaku` (`#C59B27`)
  - `washi` (`#F3EBDD`, `#FAF5ED`, `#DDD2B8`)
  - `sumi` ink (`#14110F`)
- **Typography**:
  - `font-serif_jp`: "Noto Serif JP", "Yu Mincho", serif
  - `font-japanese`: "Noto Sans JP", sans-serif
  - `font-telugu`: "Noto Sans Telugu", Gautami, sans-serif
- **FX Components ([src/components/fx/](file:///c:/Users/enosh/Desktop/Kai/src/components/fx/))**:
  - `InkKanji.tsx`: Dynamic SVG stroke-by-stroke kanji drawing.
  - `PetalField.tsx`: Lightweight canvas sakura petals, cursor-reactive with battery/visibility pausing.
  - `MagneticButton.tsx`: Magnetic pull on hover with physics spring.
  - `TiltCard.tsx`: 3D card tilt with moving light glare.
  - `SplitText.tsx`: Staggered typography reveals.
  - `HankoStamp.tsx`: Traditional vermilion seal stamp animation.
  - `patterns.tsx`: Pure SVG zero-dependency tileable patterns (`Seigaiha`, `Asanoha`, `Shippo`, `WashiTexture`, `GoldFlecks`).
  - `NorenCurtain.tsx`: Traditional shop curtain entry transition.

---

## 8. Speech & Audio Architecture

1. **Speech Synthesis (`audioService.ts`)**:
   - Uses Web Speech API `SpeechSynthesis`.
   - Voice loading listens to `onvoiceschanged`.
   - Has built-in `speakSlow()` (rate 0.72) and `speakLoop()`.
   - **Limitation**: Depends on browser platform voice availability. On some Linux/Android devices without Japanese voice packs, native voice may be absent. Requires graceful fallback or audioUrl playback.
2. **Speech Recognition (`speechRecognition.ts`)**:
   - Uses `webkitSpeechRecognition` with `ja-JP`.
   - Normalizes text via `wanakana.toHiragana()` and maps phonetic particles (e.g. `は` to `わ`).
   - Computes character-level similarity and identifies mismatched moras.
3. **Sound Synthesizer (`soundEffects.ts`)**:
   - Synthesizes 4 distinct tones using `AudioContext` oscillator: Correct (arpeggio), Incorrect (low buzzed sine), LevelUp (celebratory chord), Click (short transient). Fully functional offline with zero asset downloads.

---

## 9. Test Suite & Coverage

- **Runner**: Vitest 3.2.7 (`npm test` / `vitest run`).
- **Test Files**: 6 test files in `src/tests/` (12 test runs including worktree):
  - `src/tests/fsrs.test.ts`: FSRS scheduling, stability calculations, lapse handling.
  - `src/tests/learning.test.ts`: XP math, level titles, streak logic, attempt logging, derived stats recalculation.
  - `src/tests/pedagogy.test.ts`: Kana mnemonics, stroke orders, grammar rules, quiz generation.
  - `src/tests/platform.test.ts`: Web vs Electron vs Capacitor detection, safe URL protocol validation.
  - `src/tests/security.test.ts`: PBKDF2 salting, constant-time string comparison, input sanitization.
  - `src/tests/auth.test.ts`: Single-owner email enforcement, guest profile fallback.
- **Current Results**: 131 tests passing, 0 failures.

---

## 10. Architectural Risks & Conflicts to Mitigate

1. **Overlapping Audio Playback**: Simultaneous calls to `audioService.speak()` or rapid user interaction can trigger speech synthesis race conditions or speech cancellation errors. Dictation Studio must implement a strict finite-state audio manager with a watchdog timer.
2. **Database Migration Safety**: Existing user data in localStorage and Supabase `fsrs_cards` must not be deleted or corrupted when introducing character-level mastery tables. The new schema must non-destructively derive character mastery from existing card records.
3. **Telugu Pronunciation Reliability**: Machine-generated Telugu transliterations can produce unnatural phonetics. All newly introduced vocabulary items must carry an explicit `teluguVerified: boolean` flag, set to `false` until audited by a native speaker.
4. **File Length Discipline**: Standing rules require keeping files under ~400 lines. New features (Dictation Studio, Electronics Lab, Career Suite) must be decomposed into modular directories (`src/features/...`) with separated UI, state machines, and pure helper functions.
