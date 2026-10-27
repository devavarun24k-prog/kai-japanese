// src/features/electronics/lessons/data/lessonWaferProcess.ts
// Lesson 6: Wafer Process Flow: From Sand to Microchip
import { EngineeringLesson } from '../types';

export const LESSON_WAFER_PROCESS: EngineeringLesson = {
  id: 'lesson_wafer_process',
  title: 'Wafer Fabrication: 8 Steps from Sand to Chip',
  titleJp: '半導体前工程とウェハー製造プロセス8段階',
  track: 'fabrication',
  level: 'Beginner',
  estimatedMinutes: 18,
  summary: 'Journey inside an ultra-clean semiconductor fab (クリーンルーム) to examine the 8 crucial steps transforming raw silicon into high-performance integrated circuits.',
  reviewed: false,
  sections: [
    {
      heading: '1. Ingot Growth & Wafer Slicing (ウェハー製造)',
      content: 'Raw quartz sand (SiO₂) is refined into Electronic Grade Silicon (99.9999999% purity). The Czochralski method pulls a seed crystal from molten silicon to grow a cylindrical monocrystalline ingot, which is then sliced with diamond wire saws into mirror-polished discs called wafers.'
    },
    {
      heading: '2. Thermal Oxidation (酸化工程)',
      content: 'Wafers enter a high-temperature furnace (~1,000°C) with dry or wet oxygen to grow an ultra-uniform silicon dioxide (SiO₂) glass layer. SiO₂ acts as a high-quality electrical insulator and physical protective mask.',
      formula: 'Si + O₂ → SiO₂   (Thermal Dry Oxidation)'
    },
    {
      heading: '3. Photolithography (写真製版・露光)',
      content: 'The heart of chip manufacturing: light-sensitive polymer (photoresist) is spin-coated across the wafer. Deep Ultraviolet (DUV) or Extreme Ultraviolet (EUV, 13.5nm wavelength) light is projected through a chrome photomask reticle to imprint nanometer-scale circuit patterns.'
    },
    {
      heading: '4. Etching (エッチング)',
      content: 'Developing washes away the exposed photoresist. The wafer is placed in a reactive ion etching (RIE) chamber where plasma gases selectively vaporize the unprotected SiO₂ or polysilicon layers, carving deep vertical trenches.'
    },
    {
      heading: '5. Ion Implantation & Annealing (イオン注入・熱処理)',
      content: 'Dopant atoms (Boron or Arsenic) are accelerated through an electrostatic accelerator into the silicon surface at tens of thousands of electron-volts to define P-type and N-type transistor wells, followed by rapid thermal annealing to mend the crystal lattice.'
    },
    {
      heading: '6. Thin-Film Deposition & Metallization (成膜・配線)',
      content: 'Chemical Vapor Deposition (CVD) and Physical Vapor Deposition (PVD) lay down alternating nanometer films of copper wiring and dielectric insulation to connect billions of transistors across multiple routing tiers (up to 15+ layers).'
    },
    {
      heading: '7. CMP: Chemical Mechanical Planarization (研磨・平坦化)',
      content: 'Multi-layer manufacturing creates irregular surface bumps. Chemical Mechanical Polishing uses abrasive chemical slurry and rotating polishing pads to buff the wafer until it is atomic-level flat before the next lithography step.'
    },
    {
      heading: '8. Wafer Probing, Dicing & Packaging (後工程・検査)',
      content: 'Automated probe stations test every die on the wafer (wafer sort). Diamond saws slice the wafer into loose chips (dicing), which are wire-bonded or flip-chip mounted into ceramic/plastic packages to shield them from moisture and physical shocks.'
    }
  ],
  workedExample: {
    problem: 'Why is Chemical Mechanical Planarization (CMP) indispensable between each layer of multi-layer metal interconnects?',
    stepByStep: [
      'Modern ICs feature 10 to 18 layers of microscopic metal wiring stacked on top of each other.',
      'Without polishing, etching and deposition create microscopic bumps and hills across the surface.',
      'High-resolution photolithography uses lenses with extremely shallow depth of focus (DoF < 100 nm).',
      'If the wafer surface is bumpy or out of focus, subsequent lithography patterns blur, leading to short circuits and destroyed yield.',
      'Conclusion: CMP flattens each layer to optical planarity, ensuring sharp photographic focus for subsequent tiers.'
    ],
    answer: 'CMP provides the atomic planarity required for lithography lenses with sub-100nm depth of focus.'
  },
  quizQuestions: [
    {
      id: 'q_waf_1',
      question: 'What is the primary role of photolithography (露光) in semiconductor fabrication?',
      options: [
        'Melting the silicon into liquid',
        'Transferring microscopic geometric circuit patterns from a mask onto the photoresist-coated wafer',
        'Polishing the backside of the wafer with diamond paste',
        'Cooling the chip during computer execution'
      ],
      correctIndex: 1,
      explanation: 'Photolithography uses projected light to transfer circuit layout stencils from reticles onto photoresist.',
      reviewed: false
    },
    {
      id: 'q_waf_2',
      question: 'Which light wavelength does Extreme Ultraviolet (EUV) lithography use to produce leading-edge sub-5nm chips?',
      options: ['13.5 nm', '193 nm', '365 nm', '700 nm'],
      correctIndex: 0,
      explanation: 'EUV lithography utilizes a 13.5 nanometer wavelength produced by laser-pulsed tin droplets.',
      reviewed: false
    },
    {
      id: 'q_waf_3',
      question: 'What does the manufacturing term “Yield” (歩留まり - Budomari) represent?',
      options: [
        'The speed at which conveyor belts move wafers',
        'The percentage of non-defective, functional dies produced out of the total fabricated dies on a wafer',
        'The physical weight of the silicon ingot in kilograms',
        'The electricity power consumption of the cleanroom'
      ],
      correctIndex: 1,
      explanation: 'Yield is the ratio of working, non-defective chips to total potential chips, directly determining fab profitability.',
      reviewed: false
    },
    {
      id: 'q_waf_4',
      question: 'Why do personnel wear full-body bunny suits (防塵服) inside cleanrooms?',
      options: [
        'To prevent skin flakes, hair, and dust particles from contaminating microscopic wafer patterns',
        'To keep workers warm in sub-zero freezing cleanrooms',
        'To shield workers from radio waves',
        'To prevent uniforms from tearing on sharp machinery'
      ],
      correctIndex: 0,
      explanation: 'Human shedding (skin particles, hair, fibers) is the primary source of cleanroom contamination.',
      reviewed: false
    }
  ]
};
