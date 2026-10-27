// src/features/electronics/lessons/data/lessonSemiconductors.ts
// Lesson 5: Semiconductor Physics & The P-N Junction
import { EngineeringLesson } from '../types';

export const LESSON_SEMICONDUCTORS: EngineeringLesson = {
  id: 'lesson_semiconductors',
  title: 'Semiconductor Physics & P-N Junctions',
  titleJp: '半導体物理とP-N接合の仕組み',
  track: 'semiconductors',
  level: 'Beginner',
  estimatedMinutes: 16,
  summary: 'Discover how pure silicon is transformed through atomic doping into N-type and P-type semiconductors, creating the P-N junction that powers diodes, LEDs, solar cells, and transistors.',
  reviewed: false,
  sections: [
    {
      heading: '1. Silicon: The Group IV Semiconductor',
      content: 'Silicon (Si) has 4 valence electrons in its outer shell and forms a strong diamond-like covalent crystal lattice. At absolute zero, pure silicon is an electrical insulator because all valence electrons are tightly bound. At room temperature, thermal vibrations free a tiny number of electrons, creating electron-hole pairs.'
    },
    {
      heading: '2. Doping: N-Type vs. P-Type',
      content: 'Doping intentionally substitutes 1 in every million silicon atoms with an impurity. Group V dopants (Phosphorus, Arsenic) have 5 valence electrons—the fifth is easily freed, creating N-type (negative carrier) material. Group III dopants (Boron) have 3 valence electrons, creating a vacancy or hole that acts as a mobile positive charge (P-type).',
      tip: 'Mnemonic: P-type has Positive holes (Boron). N-type has Negative electrons (Phosphorus).'
    },
    {
      heading: '3. The P-N Junction & Depletion Region',
      content: 'When P-type and N-type regions meet, free electrons from the N-side diffuse into the P-side and recombine with holes. This leaves unneutralized positive donor ions on the N-side and negative acceptor ions on the P-side, creating a narrow insulated barrier called the Depletion Region with a built-in electric field.'
    },
    {
      heading: '4. Biasing: Forward vs. Reverse',
      content: 'In Forward Bias (connecting external positive voltage to P-side, negative to N-side), the external field counters the internal barrier. Once overcoming ~0.7V for silicon, the depletion zone collapses and large current flows. In Reverse Bias, the external field widens the depletion zone, blocking current entirely.',
      formula: 'Barrier Voltage V_bi ≈ 0.6V - 0.7V for Silicon at 300K'
    }
  ],
  workedExample: {
    problem: 'Explain what happens to a silicon P-N diode when connected to a 3V battery with the battery positive terminal hooked to the N-type cathode and negative terminal hooked to the P-type anode.',
    stepByStep: [
      'Identify the bias mode: Battery (+) is connected to N-side, Battery (-) to P-side.',
      'This configuration pulls majority carriers away from the junction (electrons pulled to (+), holes pulled to (-)).',
      'This is Reverse Bias.',
      'The depletion region widens, creating a strong opposing electric field that prevents current flow.',
      'Conclusion: No significant current conducts (only a negligible picoampere reverse leakage current).'
    ],
    answer: 'The diode is Reverse Biased; the depletion region expands and blocks current.'
  },
  quizQuestions: [
    {
      id: 'q_semi_1',
      question: 'Which chemical element is commonly introduced into silicon to create N-type semiconductor material?',
      options: ['Boron', 'Phosphorus', 'Carbon', 'Copper'],
      correctIndex: 1,
      explanation: 'Phosphorus (Group V) has 5 valence electrons, donating a free conduction electron to form N-type material.',
      reviewed: false
    },
    {
      id: 'q_semi_2',
      question: 'What is a “hole” in semiconductor physics?',
      options: [
        'A physical drill hole in the silicon wafer',
        'An empty valence electron state that behaves as a mobile positive charge',
        'A contaminant air bubble inside the cleanroom',
        'A defect created by overheating solder'
      ],
      correctIndex: 1,
      explanation: 'A hole is the absence of an electron in a valence bond, moving through adjacent electron hops as an effective positive carrier.',
      reviewed: false
    },
    {
      id: 'q_semi_3',
      question: 'What happens to the depletion region width at a P-N junction during Forward Bias?',
      options: [
        'It expands and widens',
        'It narrows and collapses, allowing current to flow',
        'It turns into gold wire',
        'It remains completely unchanged'
      ],
      correctIndex: 1,
      explanation: 'Forward bias pushes majority carriers into the junction, reducing barrier potential and narrowing the depletion region.',
      reviewed: false
    },
    {
      id: 'q_semi_4',
      question: 'How many valence electrons does an atom of pure silicon have in its outer shell?',
      options: ['2', '4', '6', '8'],
      correctIndex: 1,
      explanation: 'Silicon is in Group 14 (IV) of the periodic table, having 4 valence electrons forming tetrahedral covalent bonds.',
      reviewed: false
    }
  ]
};
