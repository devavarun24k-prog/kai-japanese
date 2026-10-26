// src/components/games/RPGGameHub.tsx
// Interactive Japanese RPG Arcade with 10 real, playable games, XP rewards, and boss battles
import React, { useState, useEffect } from 'react';
import {
  Gamepad2,
  Zap,
  Layers,
  Search,
  Sparkles,
  Swords,
  Timer,
  Trophy,
  RotateCcw,
  Play,
  ArrowRight,
  ShieldAlert,
  Hammer,
  CheckCircle2,
  XCircle,
  Volume2,
  Target,
  Train,
  Award,
  Flame,
  Star
} from 'lucide-react';
import { GameId } from '../../types';
import { HIRAGANA_DATA } from '../../data/kanaData';
import { VOCAB_DATA } from '../../data/vocabData';
import { GRAMMAR_DATA } from '../../data/grammarData';
import { KANJI_DATA } from '../../data/kanjiData';
import { AudioButton } from '../common/AudioButton';
import { useLearning } from '../../context/LearningContext';
import { soundEffects } from '../../services/soundEffects';

export const RPGGameHub: React.FC = () => {
  const { awardXP, displayMode, setActiveSection, recordAttempt } = useLearning();
  const [activeGame, setActiveGame] = useState<GameId | null>(null);

  // --- Game 1: Kana Reflex (Speed drill) ---
  const [reflexTime, setReflexTime] = useState<number>(10);
  const [reflexScore, setReflexScore] = useState<number>(0);
  const [reflexCurrent, setReflexCurrent] = useState(HIRAGANA_DATA[0]);
  const [reflexActive, setReflexActive] = useState<boolean>(false);

  // --- Game 2: Memory Match ---
  const [memoryTiles, setMemoryTiles] = useState<
    { id: number; text: string; pairId: string; flipped: boolean; matched: boolean }[]
  >([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);

  // --- Game 3: Particle Detective ---
  const [detectiveCaseIndex, setDetectiveCaseIndex] = useState<number>(0);
  const [detectiveAnswered, setDetectiveAnswered] = useState<boolean>(false);
  const [detectiveSelected, setDetectiveSelected] = useState<number | null>(null);
  const [detectiveScore, setDetectiveScore] = useState<number>(0);

  const detectiveCases = [
    {
      caseTitle: 'Case #101: Shibuya Station Platform',
      sentence: 'わたし ＿＿ 犯人 (culprit) を見ました！',
      options: ['は (wa)', 'で (de)', 'を (o)', 'へ (e)'],
      correct: 0,
      clueEn: 'The speaker is presenting themselves as the TOPIC who witnessed the event.',
      clueTe: 'మాట్లాడే వ్యక్తి తనను తాను టాపిక్ (Topic) గా మార్చడానికి "は" వాడాలి.'
    },
    {
      caseTitle: 'Case #102: The Locker Mystery',
      sentence: '盗まれた鍵は えき ＿＿ ロッカーにあります。',
      options: ['の (no)', 'に (ni)', 'と (to)', 'も (mo)'],
      correct: 0,
      clueEn: 'Possession/location association: "The station\'s locker".',
      clueTe: 'స్టేషన్ యొక్క (Station\'s) లాకర్ కాబట్టి సంబంధాన్ని తెలిపే "の" వాడాలి.'
    },
    {
      caseTitle: 'Case #103: The Escape Route',
      sentence: '犯人は でんしゃ ＿＿ にげました。',
      options: ['で (de)', 'を (o)', 'は (wa)', 'に (ni)'],
      correct: 0,
      clueEn: 'Means/instrument of travel: "escaped BY train".',
      clueTe: 'రైలు ద్వారా పారిపోయాడు (సాధనం) కాబట్టి "で" వాడాలి.'
    }
  ];

  // --- Game 4: Kanji Forge ---
  const [forgeStep, setForgeStep] = useState<number>(0);
  const [forgedSuccess, setForgedSuccess] = useState<boolean>(false);

  const forgeRecipes = [
    {
      r1: '日 (Sun)',
      r2: '月 (Moon)',
      result: '明',
      meaningEn: 'Bright / Clear',
      meaningTe: 'ప్రకాశవంతమైన',
      prompt: 'Combine Sun and Moon to forge a Kanji that means "Bright":'
    },
    {
      r1: '木 (Tree)',
      r2: '木 (Tree)',
      result: '林',
      meaningEn: 'Grove / Woods',
      meaningTe: 'అడవి / చెట్ల గుంపు',
      prompt: 'Combine two Trees together to forge a Kanji meaning "Grove":'
    },
    {
      r1: '人 (Person)',
      r2: '木 (Tree)',
      result: '休',
      meaningEn: 'To Rest',
      meaningTe: 'విశ్రాంతి తీసుకోవడం',
      prompt: 'A Person leaning against a Tree forges the Kanji for "Rest":'
    }
  ];

  // --- Game 5: Sentence Shinkansen Builder ---
  const [trainPieces, setTrainPieces] = useState<string[]>([]);
  const [trainSelected, setTrainSelected] = useState<string[]>([]);
  const [trainSolved, setTrainSolved] = useState<boolean>(false);

  const trainChallenge = {
    targetSentence: 'わたしはほんをよみます',
    english: 'I read books.',
    pieces: ['よみます', 'わたし', 'ほん', 'は', 'を']
  };

  // --- Game 6: Listening Hunter ---
  const [hunterTarget, setHunterTarget] = useState(HIRAGANA_DATA[0]);
  const [hunterScore, setHunterScore] = useState<number>(0);
  const [hunterOptions, setHunterOptions] = useState<typeof HIRAGANA_DATA>([]);

  // --- Game 7: Grammar Boss Battle ---
  const [bossHp, setBossHp] = useState<number>(100);
  const [playerHp, setPlayerHp] = useState<number>(100);
  const [bossTurn, setBossTurn] = useState<number>(0);

  const bossQuestions = [
    {
      q: 'Which particle marks the TOPIC: わたし ＿＿ 田中 (Watashi __ Tanaka)?',
      options: ['は (wa)', 'が (ga)', 'を (o)'],
      correct: 0,
      damage: 35
    },
    {
      q: 'Which particle indicates ACTION LOCATION: としょかん ＿＿ べんきょう (Study __ library)?',
      options: ['で (de)', 'に (ni)', 'へ (e)'],
      correct: 0,
      damage: 35
    },
    {
      q: 'Which particle marks the DIRECT OBJECT: みず ＿＿ のみます (Drink __ water)?',
      options: ['を (o)', 'は (wa)', 'も (mo)'],
      correct: 0,
      damage: 35
    }
  ];

  // --- Game 8: Word Quest Dungeon ---
  const dungeonMonsters = [
    {
      name: 'Water Slime (水スライム)',
      maxHp: 60,
      prompt: 'Identify the meaning of 水 (みず - mizu):',
      options: ['Water / నీరు', 'Fire / నిప్పు', 'Tree / చెట్టు', 'Gold / బంగారం'],
      correct: 0,
      icon: '💧'
    },
    {
      name: 'Goblin Scout (小鬼)',
      maxHp: 70,
      prompt: 'Translate the verb: 食べる (たべる - taberu)',
      options: ['To Drink', 'To Eat / తినడం', 'To Sleep', 'To Walk'],
      correct: 1,
      icon: '👺'
    },
    {
      name: 'Skeleton Mage (骸骨魔術師)',
      maxHp: 80,
      prompt: 'Identify the noun: 本 (ほん - hon)',
      options: ['Book / పుస్తకం', 'Pen / కలం', 'Bag / సంచి', 'Chair / కుర్చీ'],
      correct: 0,
      icon: '💀'
    },
    {
      name: 'Stone Golem (石の巨人)',
      maxHp: 90,
      prompt: 'Translate the noun: 車 (くるま - kuruma)',
      options: ['Airplane', 'Train', 'Car / Automobile / కారు', 'Bicycle'],
      correct: 2,
      icon: '🗿'
    },
    {
      name: 'Dungeon Dragon (竜王)',
      maxHp: 100,
      prompt: 'Translate the adjective: 美味しい (おいしい - oishii)',
      options: ['Delicious / Tasty / రుచికరమైన', 'Dangerous / ప్రమాదకరమైన', 'Quiet / ప్రశాంతమైన', 'Cold / చల్లని'],
      correct: 0,
      icon: '🐉'
    }
  ];
  const [dungeonMonsterIndex, setDungeonMonsterIndex] = useState<number>(0);
  const [dungeonMonsterHp, setDungeonMonsterHp] = useState<number>(60);
  const [dungeonPlayerHp, setDungeonPlayerHp] = useState<number>(100);
  const [dungeonCleared, setDungeonCleared] = useState<boolean>(false);
  const [dungeonGameOver, setDungeonGameOver] = useState<boolean>(false);

  // --- Game 9: Daily Challenge Sprint ---
  const sprintQuestions = [
    {
      category: 'Kana',
      q: 'Identify this Hiragana: あ',
      options: ['a (అ)', 'o (ఒ)', 'e (ఎ)', 'u (ఉ)'],
      correct: 0
    },
    {
      category: 'Vocabulary',
      q: 'What is "cat" in Japanese?',
      options: ['inu (いぬ)', 'neko (ねこ - పిల్లి)', 'tori (とり)', 'sakana (さかな)'],
      correct: 1
    },
    {
      category: 'Kanji',
      q: 'What is the primary meaning of the Kanji 日?',
      options: ['Sun / Day (సూర్యుడు/రోజు)', 'Moon (చంద్రుడు)', 'Fire (నిప్పు)', 'Water (నీరు)'],
      correct: 0
    },
    {
      category: 'Grammar',
      q: 'Complete: わたし ＿＿ 学生です。 (I am a student)',
      options: ['は (wa)', 'を (o)', 'で (de)', 'へ (e)'],
      correct: 0
    },
    {
      category: 'Time',
      q: 'What is "one o\'clock" in Japanese?',
      options: ['ichiji (いちじ)', 'niji (にじ)', 'sanji (さんじ)', 'yoji (よじ)'],
      correct: 0
    }
  ];
  const [sprintIndex, setSprintIndex] = useState<number>(0);
  const [sprintScore, setSprintScore] = useState<number>(0);
  const [sprintTime, setSprintTime] = useState<number>(45);
  const [sprintActive, setSprintActive] = useState<boolean>(false);
  const [sprintCompleted, setSprintCompleted] = useState<boolean>(false);

  // --- Game 10: JLPT Arena ---
  const arenaQuestions = [
    {
      section: 'Kanji Reading',
      prompt: 'Choose the correct reading for: 先生 (Teacher)',
      options: ['せんせい (sensei)', 'がくせい (gakusei)', 'かいしゃいん (kaishain)', 'いしゃ (isha)'],
      correct: 0,
      explanation: '先生 is pronounced せんせい (sensei).'
    },
    {
      section: 'Contextual Vocabulary',
      prompt: '毎日、日本語を ＿＿。 (Every day, I study Japanese.)',
      options: ['勉強します (benkyou shimasu)', '飲みます (nomimasu)', '買います (kaimasu)', '寝ます (nemasu)'],
      correct: 0,
      explanation: '勉強します means to study.'
    },
    {
      section: 'Grammar Particles',
      prompt: '友達 ＿＿ 話します。 (I speak with a friend.)',
      options: ['と (to)', 'に (ni)', 'で (de)', 'を (o)'],
      correct: 0,
      explanation: 'と marks mutual companion ("with a friend").'
    },
    {
      section: 'Sentence Formation',
      prompt: 'What belongs in the star position: これ は ＿＿ ＿＿ [★] ＿＿ ? (Is this a book?)',
      options: ['本 (hon)', 'です (desu)', 'か (ka)', '水 (mizu)'],
      correct: 1, // これ は [本] [*です] [か]
      explanation: 'Correct order: これ は 本 [です] か.'
    },
    {
      section: 'Short Reading',
      prompt: '「明日は日曜日ですから、学校へ行きません。」Why won\'t they go to school?',
      options: ['Because tomorrow is Sunday', 'Because it will rain', 'Because they are sick', 'Because they finished homework'],
      correct: 0,
      explanation: '日曜日 (Sunday) ですから (because).'
    }
  ];
  const [arenaIndex, setArenaIndex] = useState<number>(0);
  const [arenaAnswers, setArenaAnswers] = useState<Record<number, number>>({});
  const [arenaSubmitted, setArenaSubmitted] = useState<boolean>(false);

  const gamesList: {
    id: GameId;
    title: string;
    titleJp: string;
    desc: string;
    icon: string;
    xp: number;
  }[] = [
    {
      id: 'kana_reflex',
      title: 'Kana Reflex',
      titleJp: '早押しかな',
      desc: 'Speed-identify Hiragana characters before the 10s timer expires!',
      icon: '⚡',
      xp: 40
    },
    {
      id: 'memory_match',
      title: 'Memory Match',
      titleJp: '絵合わせ',
      desc: 'Flip and match Japanese words with English & Telugu meanings.',
      icon: '🎴',
      xp: 50
    },
    {
      id: 'grammar_boss',
      title: 'Grammar Boss Battle',
      titleJp: '文法魔王戦',
      desc: 'Defeat the Shadow Shogun using particle and conjugation spells!',
      icon: '👹',
      xp: 100
    },
    {
      id: 'particle_detective',
      title: 'Particle Detective',
      titleJp: '助詞探偵',
      desc: 'Investigate missing particles at Tokyo crime scenes.',
      icon: '🔍',
      xp: 45
    },
    {
      id: 'kanji_forge',
      title: 'Kanji Forge',
      titleJp: '漢字鍛冶',
      desc: 'Assemble radical components together into legitimate Kanji.',
      icon: '🔨',
      xp: 50
    },
    {
      id: 'sentence_builder',
      title: 'Shinkansen Sentence Builder',
      titleJp: '文列車',
      desc: 'Link sentence cars in proper SOV order on the railway.',
      icon: '🚄',
      xp: 60
    },
    {
      id: 'listening_hunter',
      title: 'Listening Hunter',
      titleJp: '音狩り',
      desc: 'Identify target kana by listening to native Japanese pronunciation.',
      icon: '🎯',
      xp: 50
    },
    {
      id: 'word_quest',
      title: 'Word Quest Dungeon',
      titleJp: '単語ダンジョン',
      desc: 'Dungeon crawl through N5 vocabulary chambers and defeat monsters.',
      icon: '🗡️',
      xp: 75
    },
    {
      id: 'daily_challenge',
      title: 'Daily Challenge Rush',
      titleJp: '日課試練',
      desc: 'Sprint testing kana, vocabulary, and grammar in succession.',
      icon: '⭐',
      xp: 80
    },
    {
      id: 'jlpt_arena',
      title: 'JLPT Exam Arena',
      titleJp: '試験場',
      desc: 'Full mock exam simulator with official JLPT scoring.',
      icon: '🏛️',
      xp: 90
    }
  ];

  // --- Handlers ---
  const startKanaReflex = () => {
    setReflexScore(0);
    setReflexTime(10);
    setReflexActive(true);
    setReflexCurrent(HIRAGANA_DATA[Math.floor(Math.random() * HIRAGANA_DATA.length)]);
    soundEffects.playLevelUp();
  };

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (reflexActive && reflexTime > 0) {
      timer = setTimeout(() => setReflexTime((t) => t - 1), 1000);
    } else if (reflexActive && reflexTime === 0) {
      setReflexActive(false);
      soundEffects.playWrong();
      awardXP(reflexScore * 5, 'Completed Kana Reflex drill');
    }
    return () => clearTimeout(timer);
  }, [reflexActive, reflexTime, reflexScore]);

  // Sprint Timer Effect
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (sprintActive && sprintTime > 0) {
      timer = setTimeout(() => setSprintTime((t) => t - 1), 1000);
    } else if (sprintActive && sprintTime === 0) {
      setSprintActive(false);
      setSprintCompleted(true);
      soundEffects.playLevelUp();
      awardXP(sprintScore, 'Completed Daily Challenge Sprint');
    }
    return () => clearTimeout(timer);
  }, [sprintActive, sprintTime, sprintScore]);

  const handleReflexChoice = (romaji: string) => {
    if (!reflexActive) return;
    if (romaji === reflexCurrent.romaji) {
      soundEffects.playCorrect();
      setReflexScore((s) => s + 1);
      setReflexTime((t) => Math.min(12, t + 1));
      setReflexCurrent(HIRAGANA_DATA[Math.floor(Math.random() * HIRAGANA_DATA.length)]);
    } else {
      soundEffects.playWrong();
      setReflexTime((t) => Math.max(0, t - 2));
    }
  };

  const startMemoryMatch = () => {
    const selected = VOCAB_DATA.slice(0, 4);
    const tiles: typeof memoryTiles = [];
    selected.forEach((item, i) => {
      tiles.push({ id: i * 2, text: item.word, pairId: item.id, flipped: false, matched: false });
      tiles.push({
        id: i * 2 + 1,
        text: `${item.english} (${item.telugu})`,
        pairId: item.id,
        flipped: false,
        matched: false
      });
    });
    setMemoryTiles(tiles.sort(() => 0.5 - Math.random()));
    setFlippedIndices([]);
  };

  const handleTileClick = (idx: number) => {
    if (memoryTiles[idx].matched || memoryTiles[idx].flipped || flippedIndices.length >= 2) return;

    soundEffects.playCardFlip();
    const newTiles = [...memoryTiles];
    newTiles[idx].flipped = true;
    setMemoryTiles(newTiles);

    const newFlipped = [...flippedIndices, idx];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      const [i1, i2] = newFlipped;
      if (newTiles[i1].pairId === newTiles[i2].pairId) {
        soundEffects.playCorrect();
        newTiles[i1].matched = true;
        newTiles[i2].matched = true;
        setMemoryTiles([...newTiles]);
        setFlippedIndices([]);
        awardXP(15, 'Matched Japanese word pair');
      } else {
        setTimeout(() => {
          soundEffects.playWrong();
          newTiles[i1].flipped = false;
          newTiles[i2].flipped = false;
          setMemoryTiles([...newTiles]);
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  const handleBossSpell = (optIdx: number) => {
    const curQ = bossQuestions[bossTurn % bossQuestions.length];
    if (optIdx === curQ.correct) {
      soundEffects.playCorrect();
      const newHp = Math.max(0, bossHp - curQ.damage);
      setBossHp(newHp);
      if (newHp === 0) {
        soundEffects.playLevelUp();
        awardXP(100, 'Defeated the Grammar Boss!');
      } else {
        setBossTurn((t) => t + 1);
      }
    } else {
      soundEffects.playWrong();
      setPlayerHp((hp) => Math.max(0, hp - 25));
    }
  };

  const handleDetectiveChoice = (optIdx: number) => {
    if (detectiveAnswered) return;
    setDetectiveSelected(optIdx);
    setDetectiveAnswered(true);

    const isCorrect = optIdx === detectiveCases[detectiveCaseIndex].correct;
    if (isCorrect) {
      soundEffects.playCorrect();
      setDetectiveScore((s) => s + 1);
      awardXP(15, 'Solved Detective Case');
    } else {
      soundEffects.playWrong();
    }
  };

  const startListeningHunter = () => {
    const target = HIRAGANA_DATA[Math.floor(Math.random() * 15)];
    setHunterTarget(target);
    const options = [
      target,
      ...HIRAGANA_DATA.filter((k) => k.id !== target.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
    ].sort(() => 0.5 - Math.random());
    setHunterOptions(options);
  };

  // --- Handlers for Game 8, 9, 10 ---
  const startDungeon = () => {
    setDungeonMonsterIndex(0);
    setDungeonMonsterHp(dungeonMonsters[0].maxHp);
    setDungeonPlayerHp(100);
    setDungeonCleared(false);
    setDungeonGameOver(false);
    soundEffects.playLevelUp();
  };

  const handleDungeonAttack = (optIdx: number) => {
    if (dungeonCleared || dungeonGameOver) return;
    const curMonster = dungeonMonsters[dungeonMonsterIndex];

    if (optIdx === curMonster.correct) {
      soundEffects.playCorrect();
      const newHp = Math.max(0, dungeonMonsterHp - 50);
      setDungeonMonsterHp(newHp);

      if (newHp === 0) {
        if (dungeonMonsterIndex + 1 < dungeonMonsters.length) {
          const nextIdx = dungeonMonsterIndex + 1;
          setDungeonMonsterIndex(nextIdx);
          setDungeonMonsterHp(dungeonMonsters[nextIdx].maxHp);
          soundEffects.playCardFlip();
        } else {
          setDungeonCleared(true);
          soundEffects.playLevelUp();
          awardXP(75, 'Cleared Word Quest Dungeon!');
          recordAttempt({
            item_id: 'rpg_word_quest',
            item_type: 'vocab',
            skill: 'vocabulary',
            question_type: 'dungeon_battle',
            user_response: 'Dungeon cleared 5/5',
            expected_response: 'Dungeon cleared 5/5',
            is_correct: true,
            response_time_ms: 15000,
            hint_used: false,
            retry_count: 0
          });
        }
      }
    } else {
      soundEffects.playWrong();
      const newPlayerHp = Math.max(0, dungeonPlayerHp - 25);
      setDungeonPlayerHp(newPlayerHp);
      if (newPlayerHp === 0) {
        setDungeonGameOver(true);
      }
    }
  };

  const startDailySprint = () => {
    setSprintIndex(0);
    setSprintScore(0);
    setSprintTime(45);
    setSprintActive(true);
    setSprintCompleted(false);
    soundEffects.playLevelUp();
  };

  const handleSprintAnswer = (optIdx: number) => {
    if (!sprintActive || sprintCompleted) return;
    const q = sprintQuestions[sprintIndex];
    if (optIdx === q.correct) {
      soundEffects.playCorrect();
      setSprintScore((s) => s + 20);
    } else {
      soundEffects.playWrong();
    }

    if (sprintIndex + 1 < sprintQuestions.length) {
      setSprintIndex((i) => i + 1);
    } else {
      setSprintActive(false);
      setSprintCompleted(true);
      soundEffects.playLevelUp();
      awardXP(80, 'Completed Daily Challenge Sprint!');
      recordAttempt({
        item_id: 'rpg_daily_sprint',
        item_type: 'grammar',
        skill: 'grammar',
        question_type: 'speed_sprint',
        user_response: `Score: ${sprintScore + (optIdx === q.correct ? 20 : 0)}`,
        expected_response: 'Score: 100',
        is_correct: true,
        response_time_ms: 25000,
        hint_used: false,
        retry_count: 0
      });
    }
  };

  const startArena = () => {
    setArenaIndex(0);
    setArenaAnswers({});
    setArenaSubmitted(false);
    soundEffects.playLevelUp();
  };

  const handleArenaChoice = (qIdx: number, optIdx: number) => {
    if (arenaSubmitted) return;
    setArenaAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
    soundEffects.playClick();
  };

  const handleArenaSubmit = () => {
    setArenaSubmitted(true);
    let correctCount = 0;
    arenaQuestions.forEach((q, idx) => {
      if (arenaAnswers[idx] === q.correct) correctCount++;
    });

    if (correctCount >= 3) {
      soundEffects.playLevelUp();
      awardXP(90, 'Passed JLPT Arena Diagnostic Challenge!');
    } else {
      soundEffects.playWrong();
      awardXP(30, 'Completed JLPT Arena Challenge');
    }

    recordAttempt({
      item_id: 'rpg_jlpt_arena',
      item_type: 'grammar',
      skill: 'grammar',
      question_type: 'jlpt_mock',
      user_response: `${correctCount}/5`,
      expected_response: '5/5',
      is_correct: correctCount >= 3,
      response_time_ms: 20000,
      hint_used: false,
      retry_count: 0
    });
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-kai-border pb-4">
        <div>
          <h1 className="text-2xl font-bold font-serif_jp text-kai-ink dark:text-kai-dark-ink flex items-center gap-2">
            <span>RPG道場</span>
            <span className="text-sm font-sans font-normal text-kai-muted">
              KAI RPG & Learning Games
            </span>
          </h1>
          <p className="text-xs text-kai-muted">
            10 playable Japanese games turning retrieval practice, grammar rules, and vocabulary into exciting adventures.
          </p>
        </div>

        {activeGame && (
          <button
            onClick={() => setActiveGame(null)}
            className="px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-kai-ink text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw size={14} />
            <span>Return to Arcade Hub</span>
          </button>
        )}
      </div>

      {/* Arcade Game Selector Grid if no game active */}
      {!activeGame && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {gamesList.map((g) => (
            <div
              key={g.id}
              onClick={() => {
                setActiveGame(g.id);
                if (g.id === 'kana_reflex') startKanaReflex();
                if (g.id === 'memory_match') startMemoryMatch();
                if (g.id === 'grammar_boss') {
                  setBossHp(100);
                  setPlayerHp(100);
                  setBossTurn(0);
                }
                if (g.id === 'particle_detective') {
                  setDetectiveCaseIndex(0);
                  setDetectiveAnswered(false);
                  setDetectiveScore(0);
                }
                if (g.id === 'kanji_forge') {
                  setForgeStep(0);
                  setForgedSuccess(false);
                }
                if (g.id === 'sentence_builder') {
                  setTrainPieces([...trainChallenge.pieces].sort(() => 0.5 - Math.random()));
                  setTrainSelected([]);
                  setTrainSolved(false);
                }
                if (g.id === 'listening_hunter') {
                  setHunterScore(0);
                  startListeningHunter();
                }
                if (g.id === 'word_quest') startDungeon();
                if (g.id === 'daily_challenge') startDailySprint();
                if (g.id === 'jlpt_arena') startArena();
              }}
              className="p-5 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border shadow-washi hover:shadow-washi-lg hover:border-kai-vermilion/50 transition-all cursor-pointer group flex flex-col justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{g.icon}</span>
                  <span className="text-2xs font-mono font-bold px-2 py-0.5 rounded-full bg-kai-gold/15 text-kai-gold">
                    +{g.xp} XP
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-kai-ink dark:text-kai-dark-ink group-hover:text-kai-vermilion transition-colors text-sm font-sans flex items-center gap-1.5">
                    <span>{g.title}</span>
                    <span className="font-japanese font-normal text-xs text-kai-muted">
                      ({g.titleJp})
                    </span>
                  </h3>
                  <p className="text-xs text-kai-muted mt-1 leading-snug">{g.desc}</p>
                </div>
              </div>

              <div className="flex items-center text-xs font-semibold text-kai-indigo group-hover:translate-x-1 transition-transform gap-1">
                <span>Play Game</span>
                <ArrowRight size={13} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* GAME 1: KANA REFLEX */}
      {activeGame === 'kana_reflex' && (
        <div className="max-w-md mx-auto p-6 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border shadow-washi space-y-6 text-center">
          <div className="flex items-center justify-between border-b border-kai-border pb-3">
            <span className="text-xs font-mono font-bold text-kai-vermilion flex items-center gap-1">
              <Timer size={14} />
              <span>{reflexTime}s remaining</span>
            </span>
            <span className="text-xs font-mono font-bold text-kai-indigo">
              Score: {reflexScore}
            </span>
          </div>

          {reflexActive ? (
            <div className="space-y-6">
              <div className="text-6xl font-bold font-japanese text-kai-ink dark:text-white animate-in zoom-in-95">
                {reflexCurrent.character}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  reflexCurrent.romaji,
                  ...HIRAGANA_DATA.filter((k) => k.romaji !== reflexCurrent.romaji)
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 3)
                    .map((k) => k.romaji)
                ]
                  .sort(() => 0.5 - Math.random())
                  .map((rom, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleReflexChoice(rom)}
                      className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 font-mono text-base font-bold border border-kai-border hover:border-kai-vermilion text-kai-ink dark:text-white transition-all active:scale-95"
                    >
                      {rom}
                    </button>
                  ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-6">
              <Trophy size={48} className="text-kai-gold mx-auto" />
              <h3 className="text-xl font-bold text-kai-ink dark:text-white">Drill Finished!</h3>
              <p className="text-sm text-kai-muted">
                Final Score: <strong className="text-kai-vermilion">{reflexScore}</strong>{' '}
                characters in 10s!
              </p>
              <button
                onClick={startKanaReflex}
                className="w-full py-3 rounded-2xl bg-kai-vermilion text-white font-bold text-xs shadow-vermilion"
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      )}

      {/* GAME 2: MEMORY MATCH */}
      {activeGame === 'memory_match' && (
        <div className="max-w-xl mx-auto p-6 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border shadow-washi space-y-6">
          <div className="flex items-center justify-between border-b border-kai-border pb-3">
            <h3 className="text-sm font-bold text-kai-ink dark:text-white font-serif_jp">
              Card Memory Match (絵合わせ)
            </h3>
            <button
              onClick={startMemoryMatch}
              className="text-xs text-kai-vermilion font-semibold flex items-center gap-1 hover:underline"
            >
              <RotateCcw size={13} />
              <span>Reset Cards</span>
            </button>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {memoryTiles.map((tile, idx) => (
              <div
                key={tile.id}
                onClick={() => handleTileClick(idx)}
                className={`h-24 rounded-2xl border text-center flex items-center justify-center p-2 cursor-pointer transition-all select-none text-xs font-semibold ${
                  tile.flipped || tile.matched
                    ? 'bg-kai-vermilion-bg text-kai-vermilion font-japanese font-bold text-sm border-kai-vermilion'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-400 hover:border-kai-indigo'
                }`}
              >
                {tile.flipped || tile.matched ? tile.text : '❓'}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GAME 3: PARTICLE DETECTIVE */}
      {activeGame === 'particle_detective' && (
        <div className="max-w-xl mx-auto p-6 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border shadow-washi space-y-6">
          <div className="flex items-center justify-between border-b border-kai-border pb-3">
            <span className="text-xs font-mono font-bold text-kai-indigo">
              {detectiveCases[detectiveCaseIndex].caseTitle}
            </span>
            <span className="text-xs font-mono text-kai-muted">
              Score: {detectiveScore} / {detectiveCases.length}
            </span>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-mono text-kai-muted">Case Evidence:</span>
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 text-lg font-bold font-japanese text-kai-ink dark:text-white">
              {detectiveCases[detectiveCaseIndex].sentence}
            </div>
            <p className="text-xs text-kai-muted italic">
              💡 Clue: {detectiveCases[detectiveCaseIndex].clueEn}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {detectiveCases[detectiveCaseIndex].options.map((opt, idx) => {
              const isSelected = detectiveSelected === idx;
              const isCorrect = idx === detectiveCases[detectiveCaseIndex].correct;

              let style = 'bg-stone-50 dark:bg-stone-800 border-kai-border text-kai-ink hover:border-kai-vermilion';
              if (detectiveAnswered) {
                if (isCorrect) style = 'bg-green-100 border-green-500 font-bold text-green-900';
                else if (isSelected) style = 'bg-red-100 border-red-500 text-red-900';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleDetectiveChoice(idx)}
                  disabled={detectiveAnswered}
                  className={`p-4 rounded-2xl border font-japanese font-bold text-sm transition-all ${style}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {detectiveAnswered && (
            <button
              onClick={() => {
                if (detectiveCaseIndex + 1 < detectiveCases.length) {
                  setDetectiveCaseIndex((i) => i + 1);
                  setDetectiveAnswered(false);
                  setDetectiveSelected(null);
                } else {
                  setActiveGame(null);
                }
              }}
              className="w-full py-2.5 rounded-xl bg-kai-vermilion text-white text-xs font-semibold"
            >
              {detectiveCaseIndex + 1 < detectiveCases.length
                ? 'Proceed to Next Case'
                : 'Case Closed! Return to Hub'}
            </button>
          )}
        </div>
      )}

      {/* GAME 4: KANJI FORGE */}
      {activeGame === 'kanji_forge' && (
        <div className="max-w-md mx-auto p-6 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border shadow-washi space-y-6 text-center">
          <div className="flex items-center justify-between border-b border-kai-border pb-3">
            <h3 className="text-sm font-bold text-kai-ink dark:text-white font-serif_jp">
              Radical Anvil Forge (漢字鍛冶)
            </h3>
            <span className="text-xs font-mono text-kai-muted">
              Recipe {forgeStep + 1} of {forgeRecipes.length}
            </span>
          </div>

          <p className="text-xs text-kai-muted">{forgeRecipes[forgeStep].prompt}</p>

          <div className="flex items-center justify-center gap-3 py-4">
            <div className="w-16 h-16 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center font-japanese font-bold text-xl border border-kai-border">
              {forgeRecipes[forgeStep].r1.split(' ')[0]}
            </div>
            <span className="text-xl font-bold">+</span>
            <div className="w-16 h-16 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center font-japanese font-bold text-xl border border-kai-border">
              {forgeRecipes[forgeStep].r2.split(' ')[0]}
            </div>
            <span className="text-xl font-bold">=</span>
            <div className="w-16 h-16 rounded-2xl bg-kai-vermilion-bg text-kai-vermilion flex items-center justify-center font-japanese font-bold text-2xl border border-kai-vermilion shadow-sm">
              {forgedSuccess ? forgeRecipes[forgeStep].result : '?'}
            </div>
          </div>

          {!forgedSuccess ? (
            <button
              onClick={() => {
                soundEffects.playLevelUp();
                setForgedSuccess(true);
                awardXP(30, 'Forged Radical into Kanji');
              }}
              className="w-full py-3 rounded-2xl bg-kai-vermilion text-white font-bold text-xs shadow-vermilion flex items-center justify-center gap-2"
            >
              <Hammer size={16} />
              <span>Strike the Anvil!</span>
            </button>
          ) : (
            <div className="space-y-3 animate-in fade-in">
              <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-900 text-xs">
                Successfully forged <strong>{forgeRecipes[forgeStep].result}</strong>! (
                {forgeRecipes[forgeStep].meaningEn} • {forgeRecipes[forgeStep].meaningTe})
              </div>
              <button
                onClick={() => {
                  if (forgeStep + 1 < forgeRecipes.length) {
                    setForgeStep((s) => s + 1);
                    setForgedSuccess(false);
                  } else {
                    setActiveGame(null);
                  }
                }}
                className="w-full py-2.5 rounded-xl bg-stone-100 text-kai-ink text-xs font-semibold"
              >
                {forgeStep + 1 < forgeRecipes.length ? 'Next Forge Recipe' : 'Finish Forging'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* GAME 5: SHINKANSEN SENTENCE BUILDER */}
      {activeGame === 'sentence_builder' && (
        <div className="max-w-xl mx-auto p-6 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border shadow-washi space-y-6">
          <div className="flex items-center justify-between border-b border-kai-border pb-3">
            <h3 className="text-sm font-bold text-kai-ink dark:text-white font-serif_jp flex items-center gap-2">
              <Train size={16} className="text-kai-indigo" />
              <span>Shinkansen Train Coupler</span>
            </h3>
            <span className="text-2xs font-mono text-kai-muted">Assemble in SOV Order</span>
          </div>

          <div className="space-y-1">
            <span className="text-2xs font-mono text-kai-muted">Target Meaning:</span>
            <p className="text-base font-bold text-kai-ink dark:text-white">
              "{trainChallenge.english}"
            </p>
          </div>

          {/* Connected Train Cars */}
          <div className="p-4 rounded-2xl bg-stone-100 dark:bg-stone-800 min-h-[64px] flex items-center gap-1.5 flex-wrap">
            {trainSelected.length === 0 ? (
              <span className="text-xs text-kai-muted">Couple train cars below...</span>
            ) : (
              trainSelected.map((piece, i) => (
                <button
                  key={i}
                  onClick={() => {
                    soundEffects.playClick();
                    setTrainSelected((prev) => prev.filter((_, idx) => idx !== i));
                    setTrainPieces((prev) => [...prev, piece]);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-kai-indigo text-white font-japanese font-bold text-xs shadow-sm hover:bg-red-600 transition-colors"
                >
                  {piece}
                </button>
              ))
            )}
          </div>

          {/* Available Cars */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {trainPieces.map((piece, idx) => (
              <button
                key={idx}
                onClick={() => {
                  soundEffects.playClick();
                  setTrainPieces((prev) => prev.filter((_, i) => i !== idx));
                  setTrainSelected((prev) => [...prev, piece]);
                }}
                className="px-3.5 py-2 rounded-xl bg-white dark:bg-kai-dark-card border border-kai-border hover:border-kai-vermilion font-japanese font-bold text-sm text-kai-ink dark:text-white transition-all shadow-sm"
              >
                {piece}
              </button>
            ))}
          </div>

          {!trainSolved ? (
            <button
              onClick={() => {
                if (trainSelected.join('') === trainChallenge.targetSentence) {
                  soundEffects.playLevelUp();
                  setTrainSolved(true);
                  awardXP(40, 'Coupled Shinkansen sentence cars');
                } else {
                  soundEffects.playWrong();
                }
              }}
              disabled={trainSelected.length === 0}
              className="w-full py-2.5 rounded-xl bg-kai-vermilion text-white text-xs font-semibold shadow-vermilion disabled:opacity-40"
            >
              Dispatch Shinkansen Train
            </button>
          ) : (
            <div className="space-y-3 animate-in fade-in">
              <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-900 text-xs font-semibold text-center">
                Train departed on time! Accurate Japanese syntax.
              </div>
              <button
                onClick={() => setActiveGame(null)}
                className="w-full py-2.5 rounded-xl bg-stone-100 text-kai-ink text-xs font-semibold"
              >
                Back to Arcade
              </button>
            </div>
          )}
        </div>
      )}

      {/* GAME 6: LISTENING HUNTER */}
      {activeGame === 'listening_hunter' && (
        <div className="max-w-md mx-auto p-6 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border shadow-washi space-y-6 text-center">
          <div className="flex items-center justify-between border-b border-kai-border pb-3">
            <div className="flex items-center gap-1.5">
              <Target size={16} className="text-kai-vermilion" />
              <h3 className="text-sm font-bold text-kai-ink dark:text-white font-serif_jp">
                Listening Hunter (音狩り)
              </h3>
            </div>
            <span className="text-xs font-mono text-kai-green font-bold">Score: {hunterScore}</span>
          </div>

          <div className="py-4 space-y-3">
            <span className="text-xs text-kai-muted block">Listen carefully to the target audio:</span>
            <AudioButton text={hunterTarget.character} size="lg" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {hunterOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  if (opt.id === hunterTarget.id) {
                    soundEffects.playCorrect();
                    setHunterScore((s) => s + 1);
                    awardXP(10, 'Target Hit in Listening Hunter');
                    startListeningHunter();
                  } else {
                    soundEffects.playWrong();
                  }
                }}
                className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800 font-japanese text-3xl font-bold border border-kai-border hover:border-kai-vermilion text-kai-ink dark:text-white transition-all hover:scale-105"
              >
                {opt.character}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              awardXP(hunterScore * 5, 'Finished Listening Hunter');
              setActiveGame(null);
            }}
            className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-kai-ink text-xs font-semibold"
          >
            End Hunting Session
          </button>
        </div>
      )}

      {/* GAME 7: GRAMMAR BOSS BATTLE */}
      {activeGame === 'grammar_boss' && (
        <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-stone-900 text-white shadow-washi-lg space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-red-400 font-bold flex items-center gap-1.5">
                <Swords size={15} />
                <span>SHADOW SHOGUN (影将軍)</span>
              </span>
              <span className="text-red-300">{bossHp} / 100 HP</span>
            </div>
            <div className="w-full h-3 rounded-full bg-stone-800 overflow-hidden">
              <div
                className="h-full bg-red-600 transition-all duration-300"
                style={{ width: `${bossHp}%` }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-2xs font-mono text-stone-400">
              <span>Learner HP</span>
              <span>{playerHp} / 100 HP</span>
            </div>
            <div className="w-full h-2 rounded-full bg-stone-800 overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${playerHp}%` }}
              />
            </div>
          </div>

          {bossHp > 0 && playerHp > 0 ? (
            <div className="p-6 rounded-2xl bg-stone-800/80 border border-stone-700 space-y-4">
              <span className="text-2xs font-mono uppercase text-kai-gold font-bold">
                Spell Incantation #{bossTurn + 1}:
              </span>
              <p className="text-base font-bold font-sans">
                {bossQuestions[bossTurn % bossQuestions.length].q}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                {bossQuestions[bossTurn % bossQuestions.length].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleBossSpell(idx)}
                    className="p-3.5 rounded-xl bg-stone-700 hover:bg-kai-vermilion text-white font-japanese font-bold text-sm transition-colors text-center"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ) : bossHp === 0 ? (
            <div className="text-center py-6 space-y-3">
              <Trophy size={48} className="text-kai-gold mx-auto animate-bounce" />
              <h3 className="text-2xl font-bold text-kai-gold">Victory! Shogun Banished!</h3>
              <p className="text-xs text-stone-300">
                You earned +100 XP for mastering verb & particle spells.
              </p>
              <button
                onClick={() => setActiveGame(null)}
                className="px-6 py-2.5 rounded-xl bg-kai-vermilion text-white font-bold text-xs"
              >
                Back to Hub
              </button>
            </div>
          ) : (
            <div className="text-center py-6 space-y-3">
              <ShieldAlert size={48} className="text-red-500 mx-auto" />
              <h3 className="text-xl font-bold text-red-400">Defeated! Review Your Grammar!</h3>
              <button
                onClick={() => {
                  setBossHp(100);
                  setPlayerHp(100);
                  setBossTurn(0);
                }}
                className="px-6 py-2.5 rounded-xl bg-stone-700 text-white font-bold text-xs"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      )}

      {/* GAME 8: WORD QUEST DUNGEON */}
      {activeGame === 'word_quest' && (
        <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-stone-900 text-white shadow-washi-lg space-y-6">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🗡️</span>
              <div>
                <h3 className="text-sm font-bold font-serif_jp text-white">
                  Word Quest Dungeon (単語ダンジョン)
                </h3>
                <span className="text-3xs font-mono text-stone-400">
                  Chamber {dungeonMonsterIndex + 1} of {dungeonMonsters.length}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-2xs font-mono text-stone-400 block">Hero HP:</span>
              <span className="font-mono text-xs font-bold text-green-400">{dungeonPlayerHp} / 100</span>
            </div>
          </div>

          {!dungeonCleared && !dungeonGameOver ? (
            <div className="space-y-5">
              {/* Monster Presentation */}
              <div className="p-5 rounded-2xl bg-stone-800 border border-stone-700 text-center space-y-3">
                <div className="text-4xl animate-bounce">
                  {dungeonMonsters[dungeonMonsterIndex].icon}
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">
                    {dungeonMonsters[dungeonMonsterIndex].name}
                  </h4>
                  <div className="w-48 h-2 rounded-full bg-stone-900 mx-auto mt-1 overflow-hidden">
                    <div
                      className="h-full bg-red-500 transition-all duration-300"
                      style={{
                        width: `${(dungeonMonsterHp / dungeonMonsters[dungeonMonsterIndex].maxHp) * 100}%`
                      }}
                    />
                  </div>
                  <span className="text-3xs font-mono text-stone-400 mt-0.5 block">
                    Enemy HP: {dungeonMonsterHp} / {dungeonMonsters[dungeonMonsterIndex].maxHp}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-stone-900/80 border border-stone-800 text-sm font-bold text-amber-300">
                  {dungeonMonsters[dungeonMonsterIndex].prompt}
                </div>
              </div>

              {/* Combat Choices */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {dungeonMonsters[dungeonMonsterIndex].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleDungeonAttack(idx)}
                    className="p-3.5 rounded-xl bg-stone-800 hover:bg-kai-vermilion border border-stone-700 text-white font-medium text-xs text-left transition-colors"
                  >
                    <span className="font-mono text-2xs mr-1.5 opacity-60">[{idx + 1}]</span>
                    <span>{opt}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : dungeonCleared ? (
            <div className="text-center py-6 space-y-4">
              <Trophy size={50} className="text-kai-gold mx-auto animate-bounce" />
              <h3 className="text-2xl font-bold text-kai-gold">Dungeon Cleared!</h3>
              <p className="text-xs text-stone-300">
                You defeated all 5 vocabulary monsters and recovered the ancient Kanji scroll! (+75 XP)
              </p>
              <div className="flex gap-2 justify-center pt-2">
                <button
                  onClick={startDungeon}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs"
                >
                  Crawl Again
                </button>
                <button
                  onClick={() => setActiveGame(null)}
                  className="px-5 py-2 rounded-xl bg-kai-vermilion text-white font-bold text-xs"
                >
                  Back to Hub
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 space-y-4">
              <ShieldAlert size={50} className="text-red-500 mx-auto" />
              <h3 className="text-xl font-bold text-red-400">Hero Fallen in Battle!</h3>
              <p className="text-xs text-stone-400">
                Review your high-yield vocabulary to fortify your defenses.
              </p>
              <button
                onClick={startDungeon}
                className="px-6 py-2.5 rounded-xl bg-stone-800 text-white font-bold text-xs"
              >
                Try Dungeon Again
              </button>
            </div>
          )}
        </div>
      )}

      {/* GAME 9: DAILY CHALLENGE SPRINT */}
      {activeGame === 'daily_challenge' && (
        <div className="max-w-md mx-auto p-6 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border shadow-washi space-y-6">
          <div className="flex items-center justify-between border-b border-kai-border pb-3">
            <div className="flex items-center gap-1.5 font-bold text-sm text-kai-ink dark:text-white">
              <Flame size={16} className="text-orange-500" />
              <span>Daily Challenge Sprint (45s)</span>
            </div>
            <span className="text-xs font-mono font-bold text-kai-vermilion">
              {sprintTime}s
            </span>
          </div>

          {!sprintCompleted ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between text-2xs font-mono text-kai-muted">
                <span>Stage {sprintIndex + 1} of {sprintQuestions.length}: {sprintQuestions[sprintIndex].category}</span>
                <span>Score: {sprintScore} pts</span>
              </div>

              <div className="p-5 rounded-2xl bg-stone-50 dark:bg-kai-dark-bg/60 border border-kai-border text-center space-y-2">
                <h4 className="text-lg font-bold text-kai-ink dark:text-white">
                  {sprintQuestions[sprintIndex].q}
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {sprintQuestions[sprintIndex].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSprintAnswer(idx)}
                    className="p-3.5 rounded-xl bg-white dark:bg-stone-800 border border-kai-border hover:border-kai-vermilion text-kai-ink dark:text-white font-semibold text-xs transition-colors"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 space-y-4">
              <Trophy size={48} className="text-kai-gold mx-auto" />
              <h3 className="text-xl font-bold text-kai-ink dark:text-white">Sprint Completed!</h3>
              <p className="text-xs text-kai-muted">
                Final Score: <strong className="text-kai-vermilion">{sprintScore} / 100</strong> (+80 XP recorded)
              </p>
              <div className="flex gap-2 justify-center pt-2">
                <button
                  onClick={startDailySprint}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-kai-ink font-bold text-xs"
                >
                  Play Again
                </button>
                <button
                  onClick={() => setActiveGame(null)}
                  className="px-5 py-2 rounded-xl bg-kai-vermilion text-white font-bold text-xs shadow-vermilion"
                >
                  Return to Arcade
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* GAME 10: JLPT ARENA */}
      {activeGame === 'jlpt_arena' && (
        <div className="max-w-xl mx-auto p-6 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border shadow-washi space-y-6">
          <div className="flex items-center justify-between border-b border-kai-border pb-3">
            <div className="flex items-center gap-1.5 font-bold text-sm text-kai-ink dark:text-white">
              <Award size={16} className="text-kai-indigo" />
              <span>JLPT N5 Diagnostic Arena</span>
            </div>
            <span className="text-2xs font-mono text-kai-muted">
              5 Rapid Questions
            </span>
          </div>

          <div className="space-y-4">
            {arenaQuestions.map((q, qIdx) => (
              <div
                key={qIdx}
                className="p-4 rounded-2xl bg-stone-50 dark:bg-kai-dark-bg/60 border border-kai-border/60 space-y-2.5"
              >
                <div className="flex items-center justify-between text-2xs font-mono text-kai-indigo font-bold">
                  <span>Q{qIdx + 1}: {q.section}</span>
                </div>
                <p className="text-xs font-bold text-kai-ink dark:text-white">
                  {q.prompt}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = arenaAnswers[qIdx] === optIdx;
                    const isCorrect = optIdx === q.correct;

                    let btnStyle = 'bg-white dark:bg-kai-dark-card border-kai-border text-kai-ink dark:text-white hover:border-kai-vermilion';
                    if (arenaSubmitted) {
                      if (isCorrect) btnStyle = 'bg-green-100 dark:bg-green-950/60 border-green-500 font-bold';
                      else if (isSelected) btnStyle = 'bg-red-100 dark:bg-red-950/60 border-red-500';
                    } else if (isSelected) {
                      btnStyle = 'bg-kai-vermilion-bg border-kai-vermilion font-bold';
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleArenaChoice(qIdx, optIdx)}
                        disabled={arenaSubmitted}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-colors ${btnStyle}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {arenaSubmitted && (
                  <p className="text-3xs text-kai-muted font-mono pt-1">
                    Guidance: {q.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>

          {!arenaSubmitted ? (
            <button
              onClick={handleArenaSubmit}
              disabled={Object.keys(arenaAnswers).length < arenaQuestions.length}
              className="w-full py-3 rounded-2xl bg-kai-vermilion hover:bg-kai-vermilion-dark text-white font-semibold text-xs shadow-vermilion disabled:opacity-40"
            >
              Submit Diagnostic Test
            </button>
          ) : (
            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-2xl bg-stone-100 dark:bg-stone-800 text-center space-y-1">
                <span className="font-bold text-sm text-kai-ink dark:text-white block">
                  Diagnostic Result Recorded! (+90 XP)
                </span>
                <p className="text-xs text-kai-muted">
                  Correct:{' '}
                  {
                    arenaQuestions.filter((q, idx) => arenaAnswers[idx] === q.correct).length
                  }{' '}
                  / {arenaQuestions.length}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={startArena}
                  className="flex-1 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-kai-ink text-xs font-semibold"
                >
                  Retry Arena
                </button>
                <button
                  onClick={() => setActiveSection('jlpt')}
                  className="flex-1 py-2.5 rounded-xl bg-kai-indigo hover:bg-kai-indigo-dark text-white text-xs font-semibold shadow-sm"
                >
                  Full Exam Simulator →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
