// src/features/electronics/lessons/data/lessonComponents.ts
// Lesson 2: Resistors, Capacitors, Diodes & Transistors
import { EngineeringLesson } from '../types';

export const LESSON_COMPONENTS: EngineeringLesson = {
  id: 'lesson_components',
  title: 'Essential Components: R, C, Diodes & Transistors',
  titleJp: '電子部品の基礎：抵抗・コンデンサ・ダイオード・トランジスタ',
  track: 'circuits',
  level: 'Beginner',
  estimatedMinutes: 15,
  summary: 'Explore the building blocks of hardware: resistors (current limiters), capacitors (energy reservoirs), diodes (one-way valves), and transistors (solid-state switches and amplifiers).',
  reviewed: false,
  sections: [
    {
      heading: '1. Resistors: Current Limiting & Voltage Dividers',
      content: 'Resistors restrict electron flow and drop voltage. Arranged in series, two resistors form a voltage divider that outputs an exact fraction of input voltage: Vout = Vin × (R2 / (R1 + R2)). In parallel, equivalent resistance is always lower than the smallest branch.',
      formula: 'Series: R_total = R1 + R2 | Parallel: 1/R_total = 1/R1 + 1/R2'
    },
    {
      heading: '2. Capacitors: Electric Field Energy Storage',
      content: 'A capacitor consists of two conductive plates separated by an insulator (dielectric). It stores charge (Q = C × V) and blocks steady DC while passing alternating AC signals. Used everywhere for power supply smoothing, decoupling noise, and timing circuits.',
      formula: 'Q = C × V   (Charge in Coulombs = Capacitance in Farads × Volts)'
    },
    {
      heading: '3. Diodes & LEDs: One-Way Conductors',
      content: 'A semiconductor diode lets current flow easily in forward bias (from anode to cathode) once exceeding a forward threshold (~0.7V for silicon), but blocks current in reverse bias until breakdown. LEDs emit visible light when forward biased.',
      tip: 'The cathode pin on a physical diode is marked with a painted band. On a round LED, the cathode lead is shorter and has a flat edge on the plastic dome.'
    },
    {
      heading: '4. Transistors: Switches and Amplifiers',
      content: 'Transistors are three-terminal active components. A small control signal at one terminal regulates large current between the other two. Bipolar Junction Transistors (BJTs: NPN/PNP) are current-controlled; MOSFETs (Metal-Oxide-Semiconductor Field-Effect Transistors) are voltage-controlled and form the foundation of modern digital microchips.',
      formula: 'BJT: Ic = β × Ib | MOSFET: Gate voltage Vgs modulates Drain-Source channel resistance'
    }
  ],
  workedExample: {
    problem: 'You have a 12V supply and want to generate a 4V sensor reference voltage using a voltage divider with R2 = 10 kΩ. What value should R1 be?',
    stepByStep: [
      'Write the divider equation: Vout = Vin × (R2 / (R1 + R2))',
      'Substitute values: 4V = 12V × (10 kΩ / (R1 + 10 kΩ))',
      'Divide both sides by 12V: 1/3 = 10 kΩ / (R1 + 10 kΩ)',
      'Cross multiply: R1 + 10 kΩ = 30 kΩ',
      'Solve for R1: R1 = 30 kΩ - 10 kΩ = 20 kΩ.'
    ],
    answer: 'R1 = 20 kΩ'
  },
  quizQuestions: [
    {
      id: 'q_comp_1',
      question: 'Two 100 Ω resistors are placed in parallel. What is their equivalent total resistance?',
      options: ['200 Ω', '100 Ω', '50 Ω', '25 Ω'],
      correctIndex: 2,
      explanation: 'For two identical resistors in parallel, R_total = R / 2 = 100 Ω / 2 = 50 Ω.',
      reviewed: false
    },
    {
      id: 'q_comp_2',
      question: 'What behavior does an ideal capacitor exhibit when connected to a steady Direct Current (DC) voltage source after fully charging?',
      options: ['It acts as a short circuit (0 Ω)', 'It acts as an open circuit (blocks DC)', 'It oscillates like an AC generator', 'It continuously loses all charge'],
      correctIndex: 1,
      explanation: 'Once charged to source voltage, no continuous direct current can traverse the insulating dielectric, acting as an open circuit to DC.',
      reviewed: false
    },
    {
      id: 'q_comp_3',
      question: 'What is the typical forward voltage drop across a standard silicon P-N junction diode?',
      options: ['Approximately 0.1 V', 'Approximately 0.7 V', 'Approximately 5.0 V', 'Approximately 12.0 V'],
      correctIndex: 1,
      explanation: 'Silicon diodes require about 0.6V to 0.7V forward bias to overcome the internal barrier potential and begin conducting.',
      reviewed: false
    },
    {
      id: 'q_comp_4',
      question: 'Why are MOSFETs preferred over BJTs for modern computer processors with billions of transistors?',
      options: [
        'MOSFETs are voltage-controlled with almost zero static gate current, generating far less idle power',
        'MOSFETs only work with direct current',
        'MOSFETs are made from copper instead of silicon',
        'MOSFETs can only be manufactured by hand'
      ],
      correctIndex: 0,
      explanation: 'The insulated oxide gate of a MOSFET draws virtually no steady DC current, allowing dense microprocessors to conserve power.',
      reviewed: false
    }
  ]
};
