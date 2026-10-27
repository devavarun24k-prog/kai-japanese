// src/features/electronics/lessons/data/lessonOhm.ts
// Lesson 1: Voltage, Current, Resistance & Ohm's Law
import { EngineeringLesson } from '../types';

export const LESSON_OHM: EngineeringLesson = {
  id: 'lesson_ohm',
  title: "Voltage, Current, Resistance & Ohm's Law",
  titleJp: 'オームの法則と電気回路の基礎',
  track: 'circuits',
  level: 'Beginner',
  estimatedMinutes: 12,
  summary: 'Understand the three fundamental quantities of electronics—Voltage (V), Current (I), and Resistance (R)—and how Ohm’s Law and Joule’s Power equation govern every circuit.',
  reviewed: false,
  sections: [
    {
      heading: '1. What Drives Electricity? (The Water Pipe Analogy)',
      content: 'Think of an electric circuit like water pumped through a pipe. Voltage is the water pressure pushing electrons through the conductor. Current is the rate of water flow (electrons per second). Resistance is the pipe constriction narrowing the flow. When resistance increases, current drops unless pressure is increased.',
      formula: 'V = I × R   (Voltage = Current × Resistance)'
    },
    {
      heading: '2. Units of Measurement',
      content: 'Voltage is measured in Volts (V), Current in Amperes or Amps (A), and Resistance in Ohms (Ω). In practical electronic circuits, currents are often measured in milliamperes (1 mA = 0.001 A) and resistances in kilo-ohms (1 kΩ = 1,000 Ω). Always convert to base SI units before calculating!',
      tip: 'Mnemonic: Cover the quantity you want to calculate in the triangle [V / (I · R)]. If you want I, it is V divided by R.'
    },
    {
      heading: '3. Electrical Power & Heat Dissipation',
      content: 'Electrical power is the rate at which electrical energy is converted into work or heat. Power is measured in Watts (W). Passing current through a resistor generates heat, so resistors have power ratings (e.g., 0.25W or 0.5W). Exceeding this rating causes smoke or component failure.',
      formula: 'P = V × I = I² × R = V² / R'
    }
  ],
  workedExample: {
    problem: 'An LED requires 2.0 V to illuminate and can safely handle 20 mA (0.020 A) of current. If powering it from a 5.0 V microcontroller pin, what current-limiting resistor is needed, and how much power will the resistor dissipate?',
    stepByStep: [
      'Find voltage drop across resistor: V_resistor = 5.0V - 2.0V = 3.0V',
      'Apply Ohm’s Law: R = V / I = 3.0V / 0.020A = 150 Ω',
      'Calculate power dissipated: P = V × I = 3.0V × 0.020A = 0.060 W (60 mW)',
      'Conclusion: A standard 150 Ω, 0.25W (250 mW) carbon-film resistor is well within safety margins.'
    ],
    answer: 'R = 150 Ω, Power = 60 mW (0.06 W)'
  },
  quizQuestions: [
    {
      id: 'q_ohm_1',
      question: 'A 12V automotive battery is connected across a 24 Ω heating resistor. What is the current flowing through the circuit?',
      options: ['0.5 A', '2.0 A', '288 A', '12 A'],
      correctIndex: 0,
      explanation: 'Using Ohm’s Law: I = V / R = 12V / 24Ω = 0.5 A (500 mA).',
      reviewed: false
    },
    {
      id: 'q_ohm_2',
      question: 'If you double the resistance in a circuit while holding voltage constant, what happens to the electric current?',
      options: ['Current doubles', 'Current halves', 'Current stays identical', 'Current quadruples'],
      correctIndex: 1,
      explanation: 'Since I = V / R, current is inversely proportional to resistance. Doubling R halves I.',
      reviewed: false
    },
    {
      id: 'q_ohm_3',
      question: 'A 100 Ω resistor has 2 A of current flowing through it. How much power is it dissipating as heat?',
      options: ['200 W', '400 W', '50 W', '100 W'],
      correctIndex: 1,
      explanation: 'Using P = I² × R: (2 A)² × 100 Ω = 4 × 100 = 400 W.',
      reviewed: false
    },
    {
      id: 'q_ohm_4',
      question: 'Which of the following is equivalent to 1 milliampere (1 mA)?',
      options: ['1,000 A', '0.01 A', '0.001 A', '0.000001 A'],
      correctIndex: 2,
      explanation: 'The metric prefix “milli-” denotes 10⁻³, so 1 mA = 0.001 A.',
      reviewed: false
    }
  ]
};
