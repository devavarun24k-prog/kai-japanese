// src/features/electronics/lessons/data/lessonLogic.ts
// Lesson 3: Logic Gates & Truth Tables
import { EngineeringLesson } from '../types';

export const LESSON_LOGIC: EngineeringLesson = {
  id: 'lesson_logic',
  title: 'Logic Gates & Truth Tables',
  titleJp: '論理ゲートと真理値表の基礎',
  track: 'digital',
  level: 'Beginner',
  estimatedMinutes: 14,
  summary: 'Learn Boolean logic, the operational truth tables for AND, OR, NOT, NAND, NOR, and XOR gates, and why NAND gates are called universal logic gates.',
  reviewed: false,
  sections: [
    {
      heading: '1. Binary Logic in Hardware',
      content: 'Digital circuits represent information using two discrete electrical voltage states: HIGH (binary 1, usually +3.3V or +5V) and LOW (binary 0, 0V/Ground). Logic gates take one or more binary inputs and produce a single binary output based on Boolean logic rules.'
    },
    {
      heading: '2. The Fundamental Gates: NOT, AND, OR',
      content: 'NOT (Inverter) flips the input (0 → 1, 1 → 0). AND outputs 1 if and only if ALL inputs are 1. OR outputs 1 if AT LEAST ONE input is 1 (outputs 0 only when both inputs are 0).',
      formula: 'AND: Y = A · B | OR: Y = A + B | NOT: Y = ¬A'
    },
    {
      heading: '3. Inverted & Exclusive Gates: NAND, NOR, XOR',
      content: 'NAND is an inverted AND (outputs 0 only when both inputs are 1). NOR is an inverted OR (outputs 1 only when both inputs are 0). XOR (Exclusive OR) outputs 1 when inputs are DIFFERENT (one is 1, the other is 0; both 1 produces 0).',
      formula: 'XOR: Y = A ⊕ B = (A · ¬B) + (¬A · B)'
    },
    {
      heading: '4. The Universal Gate Concept',
      content: 'NAND and NOR gates are called “universal gates” because any Boolean logic function (AND, OR, NOT, multiplexers, adders, flip-flops) can be created exclusively using NAND (or NOR) gates alone. This simplifies silicon chip manufacturing.',
      tip: 'Connecting both inputs of a 2-input NAND gate together turns it into a NOT inverter.'
    }
  ],
  workedExample: {
    problem: 'What is the output Y of the circuit: Y = (A NAND B) OR C, when A = 1, B = 1, and C = 0?',
    stepByStep: [
      'Evaluate the NAND sub-expression: 1 NAND 1 = NOT(1 AND 1) = NOT(1) = 0',
      'Evaluate the OR operation with C: Y = 0 OR 0',
      'According to OR truth table: 0 OR 0 = 0.',
      'Therefore, the overall output Y = 0 (LOW).'
    ],
    answer: 'Y = 0'
  },
  quizQuestions: [
    {
      id: 'q_log_1',
      question: 'Which logic gate outputs a binary 1 ONLY when its two inputs are different from each other?',
      options: ['AND gate', 'OR gate', 'XOR gate', 'NAND gate'],
      correctIndex: 2,
      explanation: 'The XOR (Exclusive OR) gate outputs 1 when inputs differ (0,1 or 1,0) and 0 when they match (0,0 or 1,1).',
      reviewed: false
    },
    {
      id: 'q_log_2',
      question: 'What is the output of a 2-input NAND gate when both input A and input B are at logic 1 (HIGH)?',
      options: ['1 (HIGH)', '0 (LOW)', 'Undefined high-impedance state', 'Oscillating pulse'],
      correctIndex: 1,
      explanation: '1 AND 1 produces 1, and the inverted bubble (NOT) makes the NAND output 0.',
      reviewed: false
    },
    {
      id: 'q_log_3',
      question: 'Why is the NAND gate referred to as a “universal gate” in semiconductor design?',
      options: [
        'It operates at the universal speed of light',
        'Any Boolean logic function or memory circuit can be built entirely using only NAND gates',
        'It requires no power supply voltage',
        'It can conduct both analog sound and digital bits simultaneously'
      ],
      correctIndex: 1,
      explanation: 'NAND is functionally complete: NOT, AND, OR, XOR, and sequential flip-flops can all be synthesized from NAND gates alone.',
      reviewed: false
    },
    {
      id: 'q_log_4',
      question: 'If an OR gate has inputs A = 0 and B = 1, what is the output value?',
      options: ['0', '1', '0.5', 'Null'],
      correctIndex: 1,
      explanation: 'An OR gate outputs 1 whenever at least one input is 1.',
      reviewed: false
    }
  ]
};
