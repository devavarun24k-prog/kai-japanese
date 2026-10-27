# KAI Japanese Mastery — Implementation Progress

## Task Status Summary

| Phase / Module | Status | Description |
|---|---|---|
| **Phase 0: Architecture & Read-Only Audit** | Completed | Audited codebase (`AUDIT.md`), created roadmap (`PLAN.md`), verified top 10 architectural findings. |
| **Phase 1: Learning Progress Model & Vocab Schema** | Completed | Distinct character mastery vs. vocab knowledge; pure eligibility engine (`src/features/dictation/eligibility.ts`); 150 kana-only N5 vocab entries with Telugu verification tracking; 30 Vitest tests. |
| **Phase 2: Dictation Studio** | In Progress | Dictation setup, Audio Engine state machine with watchdog timer, Screen Mode kana keyboard, Paper Mode self-check, FSRS result integration. |
| **Phase 3: Electronics Lab** | Planned | Technical Japanese for electronics/semiconductor engineers, component Kanji, circuit schematics, lab dialogue. |
| **Phase 4: Interview Arena** | Planned | Tech interview simulation, self-intro (Jikoshoukai), keigo honorifics, speech evaluation. |
| **Phase 5: Career Studio** | Planned | Japanese Rirekisho & Shokumukeirekisho resume builders, tech email templates. |
| **Phase 6: Job Tracker** | Planned | Japan tech job pipeline, visa sponsorship tracking, JLPT requirement tags. |
| **Phase 7: Career Roadmap** | Planned | Milestone ladder from beginner to Tokyo tech hire, milestone gates, timeline estimator. |

---

## Active Phase: Phase 2 (Dictation Studio)

- [x] Defined character mastery types (`src/features/learning/types.ts`).
- [x] Implemented character mastery store & legacy FSRS migration (`src/features/learning/characterMastery.ts`).
- [x] Defined vocabulary schema with Telugu verification tracking (`src/data/vocab/types.ts`).
- [x] Built curated 150 kana-only N5 words dataset with Telugu unreviewed tracking (`src/data/vocab/n5KanaWords.ts`, split across parts 1-3).
- [x] Created audit utility for unreviewed Telugu items (`src/data/vocab/reportUnverified.ts`).
- [x] Implemented pure eligibility & selection functions (`src/features/dictation/eligibility.ts`).
- [x] Built dev-only debug view for learned set & pool verification (`src/features/dictation/debug/LearnedSetDebugger.tsx`).
- [x] Added 30 new unit tests covering eligibility, youon/sokuon/chouon splitting, shortage explanation, FSRS weighting, and non-destructive migration (all 161 tests passing).
- [ ] Implement Dictation Audio Engine state machine with single-channel audio and 6s watchdog timer (`src/features/dictation/audioEngine.ts`).
- [ ] Build Dictation Setup Screen with live pool size & shortage explanation (`src/features/dictation/DictationSetup.tsx`).
- [ ] Build Screen Mode with custom Kana keyboard (`src/features/dictation/DictationScreenMode.tsx`, `KanaKeyboard.tsx`).
- [ ] Build Paper Mode with self-check FSRS rating (`src/features/dictation/DictationPaperMode.tsx`).
- [ ] Build Results view with XP reward and FSRS card sync (`src/features/dictation/DictationResults.tsx`).
- [ ] Integrate Dictation Studio into app routing (`LearningContext.tsx`, `App.tsx`, `Sidebar.tsx`).
- [ ] Run build, lint, and tests. Commit Phase 2.
