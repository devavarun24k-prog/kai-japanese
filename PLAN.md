# KAI Japanese Mastery — Multi-Phase Implementation Plan

Date: 2026-10-27  
Author: Antigravity Agent  
Repository: `c:\Users\enosh\Desktop\Kai`

---

## Roadmap Overview

This plan outlines the architecture, data models, files, tests, and backend requirements for the next evolution of KAI.
Per standing guidelines, all modules are organized into modular feature directories under `src/features/`, files are kept under ~400 lines, unverified Telugu data is explicitly flagged (`teluguVerified: false`), and no mock data is presented as real.

---

## Phase 1: Learning Progress Model & Vocabulary Schema

### Objective
Separate character-level glyph mastery from vocabulary recognition. Build a pure eligibility engine that inspects a learner's known glyph set and dynamically computes which vocabulary words can be dictated.

### Data Models
1. **Character Mastery Glyph**:
   ```typescript
   export type GlyphMasteryState = 'unseen' | 'learning' | 'known' | 'mastered' | 'struggling';

   export interface CharacterMasteryRecord {
     glyph: string; // e.g. "あ", "が", "きゃ", "っ", "ー"
     system: 'hiragana' | 'katakana';
     group: 'gojuon' | 'dakuten' | 'handakuten' | 'youon' | 'sokuon' | 'chouon';
     state: GlyphMasteryState;
     seenCount: number;
     correctCount: number;
     incorrectCount: number;
     lastSeen?: string;
     fsrsDue?: string;
     manualOverride?: boolean;
   }
   ```
2. **Vocabulary Schema (`src/data/vocab/types.ts`)**:
   ```typescript
   export interface DictationVocabItem {
     id: string;
     kana: string; // Exact dictation phonetic spelling
     kanji?: string;
     romaji: string;
     meaningEn: string;
     meaningTe?: string;
     teluguVerified: boolean;
     teluguPron?: string;
     englishPron: string;
     level: 'N5' | 'N4' | 'N3';
     tags: string[];
     audioUrl?: string;
     example: {
       ja: string;
       kana: string;
       romaji: string;
       en: string;
       te?: string;
       teVerified: boolean;
     };
   }
   ```

### Files to Add / Touch
- `src/features/learning/progressModel.ts`: Character mastery repository, migration adapter converting existing `FSRSCard` entries into character mastery records without deleting old data.
- `src/features/learning/types.ts`: TypeScript contracts for character mastery and learned sets.
- `src/features/dictation/eligibility.ts`: Pure functions:
  - `splitKanaUnits(kana: string): string[]` (handles youon "きゃ", sokuon "っ", chouon "ー", dakuten).
  - `isWordEligible(word: DictationVocabItem, learnedSet: Set<string>): boolean`.
  - `buildPool(allWords: DictationVocabItem[], learnedSet: Set<string>): DictationVocabItem[]`.
  - `explainShortage(targetCount: number, availablePool: DictationVocabItem[], learnedSet: Set<string>): { missingGlyphs: string[]; unlockedIfLearned: Record<string, number> }`.
  - `pickWords(pool: DictationVocabItem[], count: number, historyCards: FSRSCard[]): DictationVocabItem[]`.
- `src/data/vocab/n5KanaWords.ts`: ~150 curated kana-only N5 words with Telugu marked `teluguVerified: false`.
- `src/data/vocab/reportUnverified.ts`: Script / utility reporting unreviewed Telugu entries.
- `src/features/dictation/debug/LearnedSetDebugger.tsx`: Dev-only visual inspection panel for the active glyph set and eligible pool.

### Tests (`src/tests/eligibility.test.ts`, `src/tests/progressModel.test.ts`)
- Unit test kana unit splitter on dakuten, handakuten, contracted youon, double consonants, and long vowel mark `ー`.
- Unit test eligibility filter against partial and complete character sets.
- Unit test shortage explanation logic.
- Unit test non-destructive migration from legacy FSRS cards.

### Backend / Credentials Required
- None. Runs 100% locally with client storage and optional offline sync to Supabase.

---

## Phase 2: Dictation Studio

### Objective
Interactive audio-first spelling and recall training. The learner hears natural Japanese audio and reconstructs the word using a touch/click kana keyboard (Screen Mode) or paper handwriting with self-checking (Paper Mode).

### Architecture & Components (`src/features/dictation/`)
1. **Audio Engine State Machine (`src/features/dictation/audioEngine.ts`)**:
   - States: `idle` | `loading` | `playing` | `paused` | `error`.
   - Single audio channel enforcement: cancels previous audio before starting new playback.
   - Watchdog timer: 6-second timeout fallback if speech synthesis stalls or fails.
   - Normal (1.0x) and Slow (0.75x) playback speeds.
2. **Setup Screen (`src/features/dictation/DictationSetup.tsx`)**:
   - Number of questions (5, 10, 20).
   - Mode selector: Screen Mode (interactive kana keyboard) vs. Paper Mode (Genkou Youshi / self-check).
   - Real-time eligible pool indicator with shortage explanation if pool is under target.
3. **Screen Mode (`src/features/dictation/DictationScreenMode.tsx`)**:
   - Custom Japanese Kana keyboard with mora layout.
   - Live mora slots display.
   - Replay audio button with keyboard shortcut (`Space` or `R`).
4. **Paper Mode (`src/features/dictation/DictationPaperMode.tsx`)**:
   - Audio prompt with delayed reveal.
   - Self-grading interface (Again, Hard, Good, Easy) aligned with FSRS.
5. **Results View (`src/features/dictation/DictationResults.tsx`)**:
   - Accuracy score, XP award, character-level mistake insights, and automated FSRS card updates.

### Files to Add / Touch
- `src/features/dictation/types.ts`
- `src/features/dictation/audioEngine.ts`
- `src/features/dictation/DictationStudio.tsx`
- `src/features/dictation/DictationSetup.tsx`
- `src/features/dictation/DictationScreenMode.tsx`
- `src/features/dictation/DictationPaperMode.tsx`
- `src/features/dictation/DictationResults.tsx`
- `src/features/dictation/KanaKeyboard.tsx`
- `src/context/LearningContext.tsx` (add `'dictation'` to `ActiveSection`)
- `src/components/common/Sidebar.tsx` (add Dictation to Practice section)
- `src/App.tsx` (lazy load `DictationStudio`)

### Tests (`src/tests/dictation.test.ts`)
- Audio engine state machine transitions and watchdog fallback.
- Keyboard input matching, mora concatenation, and backspace.
- FSRS rating dispatch on completion.

### Backend / Credentials Required
- None. Uses browser `window.speechSynthesis` and local audio.

---

## Phase 3: Electronics Lab

### Objective
High-yield Japanese technical vocabulary, kanji, and workplace communication for engineers in semiconductor, embedded systems, robotics, and PCB manufacturing industries.

### Data Models (`src/features/electronics/types.ts`)
```typescript
export interface ElectronicsTerm {
  id: string;
  kanji: string;
  reading: string;
  romaji: string;
  english: string;
  telugu?: string;
  category: 'components' | 'circuits' | 'equipment' | 'manufacturing' | 'safety';
  schematicSymbol?: string;
  workplaceExample: {
    japanese: string;
    english: string;
    context: string;
  };
}
```

### Components (`src/features/electronics/`)
1. `ElectronicsLab.tsx`: Lab navigation hub.
2. `ComponentKanjiDojo.tsx`: Technical kanji breakdown (e.g. 抵抗器 resistor, 半導体 semiconductor, 基板 circuit board, 電圧 voltage).
3. `SchematicReader.tsx`: Interactive circuit diagram with Japanese engineering callouts.
4. `LabSafetyDrill.tsx`: Safety protocol comprehension (KYT - Kiken Yochi Training).

### Tests (`src/tests/electronics.test.ts`)
- Technical terminology verification and category filtering.
- Schematic symbol mapping.

### Backend / Credentials Required
- None.

---

## Phase 4: Interview Arena

### Objective
Simulate technical job interviews for Japanese multinational corporations and Tokyo startups. Practice self-introduction (Jikoshoukai), answering engineering scenario questions, and navigating polite business speech (Keigo).

### Data Models (`src/features/interview/types.ts`)
```typescript
export interface InterviewQuestion {
  id: string;
  role: 'embedded_software' | 'hardware_engineer' | 'frontend_dev' | 'general_tech';
  questionJp: string;
  questionRomaji: string;
  questionEn: string;
  keigoLevel: 'teineigo' | 'kenjougo' | 'sonkeigo';
  sampleAnswers: {
    answerJp: string;
    breakdown: string;
    isPolite: boolean;
  }[];
  evaluationRubric: string[];
}
```

### Components (`src/features/interview/`)
1. `InterviewArena.tsx`: Main simulation chamber.
2. `JikoshoukaiBuilder.tsx`: Step-by-step 1-minute self-introduction creator.
3. `MockInterviewSession.tsx`: Audio prompt with speech recognition analysis via `SpeechRecognitionService`.
4. `KeigoCorrectionView.tsx`: Compares casual vs. professional business responses.

### Tests (`src/tests/interview.test.ts`)
- Jikoshoukai generator template validation.
- Keigo transformation verification.

### Backend / Credentials Required
- Real-time AI evaluation uses the existing Supabase Edge Function `kai-tutor` with Google Gemini. Built-in offline rubric fallback is provided when unconfigured.

---

## Phase 5: Career Studio

### Objective
Generate authentic, standard Japanese engineering resumes:
- **Rirekisho (履歴書)**: JIS-standard personal history, educational background, certifications (JLPT, FE exam).
- **Shokumukeirekisho (職務経歴書)**: Detailed technical project history and skill matrices.
- **Business Email Templates (ビジネスメール)**: Formal communication with Japanese hiring managers and recruiters.

### Data Models (`src/features/career/types.ts`)
```typescript
export interface RirekishoProfile {
  personalInfo: {
    fullNameKana: string;
    fullNameKanji: string;
    romaji: string;
    birthDate: string;
    photoUrl?: string;
  };
  educationHistory: { period: string; institution: string; status: string }[];
  workHistory: { period: string; company: string; role: string }[];
  licenses: { date: string; name: string }[];
  selfPR: string;
  reasonForApplication: string;
}
```

### Components (`src/features/career/`)
1. `CareerStudio.tsx`: Career tools hub.
2. `RirekishoForm.tsx`: JIS standard form fields with Japanese year (Reiwa 令和) conversion.
3. `RirekishoPreview.tsx`: Pixel-accurate Japanese A4 print/PDF layout.
4. `EmailTemplateGallery.tsx`: Ready-to-use Japanese business email templates.

### Tests (`src/tests/career.test.ts`)
- Japanese era year conversion (e.g. 2026 $\rightarrow$ 令和8年).
- Rirekisho data serialization and export validation.

### Backend / Credentials Required
- None for preview and client-side print/PDF generation.

---

## Phase 6: Job Tracker

### Objective
A dedicated, privacy-focused pipeline for tracking engineering job applications to Japanese companies, visa sponsorship statuses (Engineer/Specialist in Humanities visa), and JLPT milestones.

### Data Models (`src/features/jobs/types.ts`)
```typescript
export type JobApplicationStage = 'bookmarked' | 'applied' | 'casual_talk' | 'tech_interview' | 'final_interview' | 'offer' | 'rejected';

export interface JobApplication {
  id: string;
  companyName: string;
  position: string;
  location: string; // e.g. "Tokyo", "Osaka", "Remote Japan"
  stage: JobApplicationStage;
  jlptRequired: 'None' | 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  visaSponsorship: 'offered' | 'not_offered' | 'unknown';
  salaryRange?: string;
  appliedDate: string;
  notes: string;
  interviewDates: string[];
}
```

### Components (`src/features/jobs/`)
1. `JobTracker.tsx`: Kanban board and list view.
2. `JobApplicationModal.tsx`: Add/edit job application form.
3. `VisaChecklistCard.tsx`: Engineering visa requirements guide.

### Tests (`src/tests/jobs.test.ts`)
- Kanban drag-and-drop state transitions.
- Filter by visa sponsorship and JLPT level.

### Backend / Credentials Required
- Stored in user-scoped `localStorage` with automatic sync to Supabase table `public.job_applications` (to be added with RLS).

---

## Phase 7: Career Roadmap

### Objective
A structured, goal-oriented visual ladder showing the pathway from Complete Beginner (0 Japanese, 0 Japan experience) to landing a senior tech job in Tokyo.

### Stages
1. **Gate 0: Kana & Foundations** (Hiragana, Katakana, 100 core words).
2. **Gate 1: JLPT N5 & Basic Tech Vocab** (Basic circuit terms, daily communication).
3. **Gate 2: JLPT N4 & Tech Fluency** (Schematic reading, daily standup Japanese).
4. **Gate 3: JLPT N3 & Business Communication** (Interview prep, Jikoshoukai, Keigo basics).
5. **Gate 4: Career Launch** (JIS Rirekisho completed, visa paperwork ready, applications active).

### Components (`src/features/roadmap/`)
1. `CareerRoadmap.tsx`: Interactive milestone tree with completed gate indicators.
2. `MilestoneGateModal.tsx`: Gate requirements check and unlock button.

### Tests (`src/tests/roadmap.test.ts`)
- Gate completion calculation based on current user stats and attempts.

### Backend / Credentials Required
- None.

---

## Execution Guardrails & Standards

1. **File Length**: Any component approaching 350 lines must be split into sub-components.
2. **Non-Destructive Storage**: Never overwrite legacy keys without timestamped backup; never drop user tables.
3. **Data Authenticity**: All newly seeded vocabulary items without native human review must have `teluguVerified: false`.
4. **Verification Cadence**: Every phase must conclude with:
   ```bash
   npm run build
   npm run lint
   npm test
   git commit
   ```
