// src/features/electronics/lessons/data/lessonBinary.ts
// Lesson 4: Binary, Hexadecimal & Number Systems
import { EngineeringLesson } from '../types';

export const LESSON_BINARY: EngineeringLesson = {
  id: 'lesson_binary',
  title: 'Binary, Hexadecimal & Number Systems',
  titleJp: '2進数・16進数とデジタル数値体系',
  track: 'digital',
  level: 'Beginner',
  estimatedMinutes: 12,
  summary: 'Master how digital microcontrollers and memory architectures represent numbers, characters, and memory addresses using Base-2 (Binary) and Base-16 (Hexadecimal).',
  reviewed: false,
  sections: [
    {
      heading: '1. Why Binary? (Base-2)',
      content: 'Digital computers use binary because electronic switches (transistors) are most reliable when distinguishing between only two states: ON (1) or OFF (0). Each position represents a power of 2: 2⁰ (1), 2¹ (2), 2² (4), 2³ (8), 2⁴ (16), 2⁵ (32), 2⁶ (64), 2⁷ (128).',
      formula: 'Decimal Value = Σ (bit_i × 2^i)'
    },
    {
      heading: '2. Bits, Nibbles, and Bytes',
      content: 'A single binary digit is a bit. A group of 4 bits is a nibble. A group of 8 bits is a byte. An 8-bit byte can represent 2⁸ = 256 unique states (from 0 to 255 in unsigned integer notation). 16-bit words can represent 65,536 values.',
      tip: 'The largest unsigned integer an 8-bit byte can hold is 11111111 in binary, which is 255 in decimal.'
    },
    {
      heading: '3. Hexadecimal (Base-16) for Human Readability',
      content: 'Long binary strings like 11011010 are difficult to read and write without error. Hexadecimal groups 4 bits (one nibble) into a single symbol: 0-9 for numbers 0 to 9, and A-F for values 10 to 15 (A=10, B=11, C=12, D=13, E=14, F=15). 1101 (13=D) and 1010 (10=A) becomes simply 0xDA.',
      formula: '1 Hex Digit = 4 Bits (Nibble) | 2 Hex Digits = 8 Bits (1 Byte)'
    }
  ],
  workedExample: {
    problem: 'Convert binary 10110101₂ into both Decimal and Hexadecimal.',
    stepByStep: [
      'Split into two 4-bit nibbles: [1011] and [0101]',
      'Calculate decimal value of lower nibble [0101]: 0×8 + 1×4 + 0×2 + 1×1 = 5 (Hex: 5)',
      'Calculate decimal value of upper nibble [1011]: 1×8 + 0×4 + 1×2 + 1×1 = 11 (Hex: B)',
      'Combine hex digits: 0xB5',
      'Compute decimal value: (11 × 16) + 5 = 176 + 5 = 181₁₀.'
    ],
    answer: 'Decimal = 181, Hexadecimal = 0xB5'
  },
  quizQuestions: [
    {
      id: 'q_bin_1',
      question: 'What is the decimal equivalent of the binary byte 00101010₂?',
      options: ['42', '24', '84', '32'],
      correctIndex: 0,
      explanation: 'Powers of 2: bit5 (32) + bit3 (8) + bit1 (2) = 32 + 8 + 2 = 42.',
      reviewed: false
    },
    {
      id: 'q_bin_2',
      question: 'How many distinct values can an 8-bit byte represent?',
      options: ['128', '255', '256', '512'],
      correctIndex: 2,
      explanation: '2⁸ = 256 unique combinations (from 0 to 255 inclusive).',
      reviewed: false
    },
    {
      id: 'q_bin_3',
      question: 'What decimal number does hexadecimal digit ‘F’ represent?',
      options: ['10', '14', '15', '16'],
      correctIndex: 2,
      explanation: 'In hexadecimal: A=10, B=11, C=12, D=13, E=14, and F=15.',
      reviewed: false
    },
    {
      id: 'q_bin_4',
      question: 'Why do engineers use hexadecimal representation for memory addresses and registers?',
      options: [
        'Hexadecimal numbers require less physical wiring inside chips',
        'One hexadecimal digit maps exactly to 4 binary bits, making binary values much shorter and easier to read',
        'Computers do arithmetic faster in base 16 than base 2',
        'Hexadecimal supports negative numbers without bits'
      ],
      correctIndex: 1,
      explanation: 'Hexadecimal provides a 4:1 compaction ratio over raw binary without requiring division or complex conversion.',
      reviewed: false
    }
  ]
};
