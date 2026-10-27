// src/features/interview/data/questionsPart1.ts
// Interview starter questions 1 to 20: ECE Fundamentals, Semiconductors & Manufacturing Process
import { InterviewQuestion } from '../types';

export const INTERVIEW_QUESTIONS_PART_1: InterviewQuestion[] = [
  // ECE Fundamentals (MCQ & Descriptive)
  {
    id: 'int_ece_1',
    category: 'ece_fundamentals',
    difficulty: 'beginner',
    type: 'mcq',
    question: 'In an AC circuit with a purely capacitive load, what is the phase relationship between current and voltage?',
    options: [
      'Current leads voltage by 90 degrees',
      'Voltage leads current by 90 degrees',
      'Current and voltage are in phase (0 degrees)',
      'Current lags voltage by 180 degrees'
    ],
    correctIndex: 0,
    explanation: 'In a capacitor, current leads voltage by 90 degrees (mnemonic: CIVIL — in a Capacitor (C), I leads V).',
    reviewed: false
  },
  {
    id: 'int_ece_2',
    category: 'ece_fundamentals',
    difficulty: 'beginner',
    type: 'mcq',
    question: 'What is the cutoff frequency fc of a first-order passive RC low-pass filter?',
    options: [
      'fc = 1 / (2 * π * R * C)',
      'fc = 2 * π * R * C',
      'fc = R / (2 * π * C)',
      'fc = 1 / (R * C)'
    ],
    correctIndex: 0,
    explanation: 'The -3dB cutoff frequency of a single-pole RC filter is fc = 1 / (2πRC).',
    reviewed: false
  },
  {
    id: 'int_ece_3',
    category: 'ece_fundamentals',
    difficulty: 'intermediate',
    type: 'descriptive',
    question: 'Explain the purpose and placement of decoupling (bypass) capacitors on a printed circuit board.',
    explanation: 'Decoupling capacitors filter out high-frequency power supply noise and act as localized energy reservoirs for switching ICs.',
    modelAnswer: 'Decoupling capacitors are placed in parallel between the DC power supply rail and ground, as physically close to each IC power pin as possible. When digital gates switch states rapidly, they demand sharp instantaneous current surges (dI/dt). Due to PCB trace parasitic inductance, these surges cause voltage dips and noise spikes on the power rail. The decoupling capacitor supplies this transient charge locally, shunting high-frequency noise directly to ground and maintaining rail voltage stability.',
    requiredKeyPoints: [
      { id: 'kp_1', label: 'Proximity to IC power pins', keywords: ['close to pin', 'physically close', 'near the pin', 'adjacent to'] },
      { id: 'kp_2', label: 'Local charge reservoir for switching surges', keywords: ['transient current', 'switching surge', 'reservoir', 'instantaneous current', 'di/dt'] },
      { id: 'kp_3', label: 'Parasitic trace inductance compensation', keywords: ['trace inductance', 'parasitic inductance', 'loop inductance'] },
      { id: 'kp_4', label: 'High-frequency noise shunting to ground', keywords: ['shunt noise', 'filter noise', 'bypass to ground', 'noise spike'] }
    ],
    reviewed: false
  },
  {
    id: 'int_ece_4',
    category: 'ece_fundamentals',
    difficulty: 'intermediate',
    type: 'mcq',
    question: 'According to Nyquist-Shannon sampling theorem, what minimum sampling frequency is required to reconstruct a 20 kHz audio signal without aliasing?',
    options: ['At least 40 kHz', 'At least 20 kHz', 'At least 10 kHz', 'At least 80 kHz'],
    correctIndex: 0,
    explanation: 'The sampling rate must be at least twice the highest frequency component (fs >= 2 * f_max = 2 * 20 kHz = 40 kHz).',
    reviewed: false
  },
  {
    id: 'int_ece_5',
    category: 'ece_fundamentals',
    difficulty: 'advanced',
    type: 'descriptive',
    question: 'What is impedance matching, and why is it critical in high-speed digital and RF signal transmission?',
    explanation: 'Impedance matching ensures maximum power transfer and prevents signal reflections.',
    modelAnswer: 'Impedance matching is the practice of designing the output impedance of a source, the characteristic impedance (Z0) of the transmission line, and the input impedance of the load to be equal (commonly 50Ω). When high-speed digital signal edge transition times are shorter than the transmission line delay, any impedance mismatch causes signal reflections (ringing, overshoot, and undershoot). This destroys signal integrity and causes bit errors or EMI.',
    requiredKeyPoints: [
      { id: 'kp_5', label: 'Characteristic line impedance (e.g. 50Ω)', keywords: ['characteristic impedance', 'z0', '50 ohm', 'equal impedance'] },
      { id: 'kp_6', label: 'Signal reflections prevention', keywords: ['signal reflection', 'reflected wave', 'prevent reflection'] },
      { id: 'kp_7', label: 'Maximum power transfer', keywords: ['power transfer', 'maximum power'] },
      { id: 'kp_8', label: 'Signal integrity and ringing/overshoot', keywords: ['signal integrity', 'ringing', 'overshoot', 'bit error'] }
    ],
    reviewed: false
  },
  {
    id: 'int_ece_6',
    category: 'ece_fundamentals',
    difficulty: 'beginner',
    type: 'mcq',
    question: 'Which component is used to prevent back-EMF voltage spikes when turning off an inductive load like a relay or DC motor?',
    options: [
      'Flyback (freewheeling) diode',
      'Ceramic capacitor in series',
      'Zener diode in forward bias',
      'Pull-up resistor'
    ],
    correctIndex: 0,
    explanation: 'A flyback diode placed anti-parallel across an inductor provides a safe dissipation path for stored magnetic energy when power is cut.',
    reviewed: false
  },
  {
    id: 'int_ece_7',
    category: 'ece_fundamentals',
    difficulty: 'intermediate',
    type: 'mcq',
    question: 'In an operational amplifier configured in negative feedback, what are the two golden rules of an ideal op-amp?',
    options: [
      'Zero input current and virtual short between inverting/non-inverting inputs (V+ = V-)',
      'Infinite input current and zero output voltage',
      'Zero gain and infinite bandwidth',
      'Infinite output impedance and zero input impedance'
    ],
    correctIndex: 0,
    explanation: 'Ideal op-amps have infinite input impedance (zero input pin current) and infinite open-loop gain, driving the differential input voltage to zero (V+ = V-).',
    reviewed: false
  },

  // Semiconductors (MCQ & Descriptive)
  {
    id: 'int_semi_1',
    category: 'semiconductors',
    difficulty: 'beginner',
    type: 'mcq',
    question: 'Which dopant element is added to intrinsic silicon to produce P-type semiconductor material?',
    options: ['Boron', 'Phosphorus', 'Arsenic', 'Antimony'],
    correctIndex: 0,
    explanation: 'Boron is a trivalent (Group III) element with 3 valence electrons, creating electron vacancies (holes) in the silicon crystal.',
    reviewed: false
  },
  {
    id: 'int_semi_2',
    category: 'semiconductors',
    difficulty: 'intermediate',
    type: 'descriptive',
    question: 'Explain how a MOSFET functions as an electronic switch and describe its three main operating regions.',
    explanation: 'A MOSFET operates in Cutoff, Linear (Triode), and Saturation regions based on Gate-Source and Drain-Source voltages.',
    modelAnswer: 'A MOSFET is a voltage-controlled semiconductor device. When Gate-to-Source voltage (Vgs) is less than the threshold voltage (Vth), the MOSFET is in Cutoff: no conductive inversion channel exists between drain and source, acting as an open switch. When Vgs > Vth, an electric field attracts minority carriers, creating a conductive channel. In the Linear (Triode) region (Vds < Vgs - Vth), it behaves like a voltage-variable resistor. In the Saturation region (Vds >= Vgs - Vth), current is independent of Vds and governed by Vgs, acting as a closed switch or constant current source.',
    requiredKeyPoints: [
      { id: 'kp_9', label: 'Threshold voltage Vth condition', keywords: ['vth', 'threshold voltage', 'vgs > vth'] },
      { id: 'kp_10', label: 'Cutoff region (OFF switch)', keywords: ['cutoff', 'open switch', 'off state', 'no channel'] },
      { id: 'kp_11', label: 'Linear / Triode region', keywords: ['linear', 'triode', 'resistor behavior'] },
      { id: 'kp_12', label: 'Saturation region (ON switch)', keywords: ['saturation', 'pinch off', 'constant current', 'closed switch'] }
    ],
    reviewed: false
  },
  {
    id: 'int_semi_3',
    category: 'semiconductors',
    difficulty: 'beginner',
    type: 'mcq',
    question: 'What is the built-in potential barrier voltage across an unbiased standard silicon P-N junction at room temperature?',
    options: ['0.6 V to 0.7 V', '0.1 V to 0.2 V', '1.5 V to 2.0 V', '5.0 V'],
    correctIndex: 0,
    explanation: 'The built-in barrier potential of silicon at 300K is approximately 0.6V to 0.7V.',
    reviewed: false
  },
  {
    id: 'int_semi_4',
    category: 'semiconductors',
    difficulty: 'intermediate',
    type: 'mcq',
    question: 'What causes the Early effect (base-width modulation) in bipolar junction transistors (BJTs)?',
    options: [
      'Increase in collector-base reverse bias widens the collector-base depletion region, narrowing the effective neutral base width',
      'Overheating in the emitter contact',
      'Excessive base doping causing avalanche breakdown',
      'Oxidation of the package pins'
    ],
    correctIndex: 0,
    explanation: 'Reverse biasing the collector-base junction widens the depletion zone into the lightly doped base, shortening effective base width.',
    reviewed: false
  },
  {
    id: 'int_semi_5',
    category: 'semiconductors',
    difficulty: 'advanced',
    type: 'descriptive',
    question: 'What is the Short-Channel Effect (SCE) in nanometer CMOS technology, and how do FinFET and GAA (Gate-All-Around) architectures solve it?',
    explanation: 'Short-channel effects include drain-induced barrier lowering (DIBL) and subthreshold leakage.',
    modelAnswer: 'As MOSFET gate lengths scale below 28nm, the drain electric field begins to interfere with channel control, leading to Drain-Induced Barrier Lowering (DIBL), high off-state subthreshold leakage current, and threshold voltage roll-off. Planar 2D transistors lose electrostatic control. FinFET solves this by wrapping a 3D gate around three sides of a thin vertical silicon fin. Gate-All-Around (GAA) nanosheets wrap the gate completely around all four sides of stacked horizontal silicon ribbons, maximizing electrostatic gate control and eliminating subthreshold leakage.',
    requiredKeyPoints: [
      { id: 'kp_13', label: 'Drain-Induced Barrier Lowering (DIBL) or leakage', keywords: ['dibl', 'barrier lowering', 'subthreshold leakage', 'leakage current'] },
      { id: 'kp_14', label: 'Loss of electrostatic gate control in planar', keywords: ['electrostatic control', 'gate control', 'planar limit'] },
      { id: 'kp_15', label: 'FinFET 3-sided 3D gate wrapping', keywords: ['finfet', 'three sides', 'vertical fin', '3d gate'] },
      { id: 'kp_16', label: 'GAA 4-sided nanosheet wrapping', keywords: ['gaa', 'gate all around', 'nanosheet', 'four sides', 'all sides'] }
    ],
    reviewed: false
  },
  {
    id: 'int_semi_6',
    category: 'semiconductors',
    difficulty: 'beginner',
    type: 'mcq',
    question: 'Why is Gallium Nitride (GaN) increasingly favored over Silicon in high-power fast chargers and electric vehicles?',
    options: [
      'GaN has a wider bandgap (3.4 eV), enabling higher breakdown voltages, faster switching speeds, and smaller thermal heatsinks',
      'GaN is cheaper than beach sand',
      'GaN conducts electricity at absolute zero only',
      'GaN does not require packaging'
    ],
    correctIndex: 0,
    explanation: 'Wide-bandgap semiconductors like GaN and SiC have higher breakdown fields and electron mobility, vastly reducing switching losses.',
    reviewed: false
  },

  // Manufacturing & Process (MCQ & Descriptive)
  {
    id: 'int_mfg_1',
    category: 'manufacturing_process',
    difficulty: 'beginner',
    type: 'mcq',
    question: 'Which photolithography light source is utilized to manufacture leading-edge 3nm and 2nm semiconductor nodes?',
    options: [
      'Extreme Ultraviolet (EUV) at 13.5 nm wavelength',
      'Deep Ultraviolet (DUV) ArF at 193 nm wavelength',
      'Mercury i-line at 365 nm wavelength',
      'Infrared laser at 1064 nm wavelength'
    ],
    correctIndex: 0,
    explanation: 'EUV lithography operating at 13.5nm wavelength is required to expose sub-5nm features without excessive multi-patterning.',
    reviewed: false
  },
  {
    id: 'int_mfg_2',
    category: 'manufacturing_process',
    difficulty: 'intermediate',
    type: 'descriptive',
    question: 'Describe the complete sequence of photolithography from wafer surface preparation to photoresist stripping.',
    explanation: 'The sequence includes priming, spin-coating, soft bake, exposure, post-exposure bake, development, hard bake, etch/implant, and resist strip.',
    modelAnswer: '1. Surface Preparation & Priming: HMDS vapor promotes photoresist adhesion on SiO2. 2. Spin-Coating: Liquid photoresist is dispensed and spun at high RPM to achieve uniform nanometer thickness. 3. Soft Bake: Evaporates excess solvent. 4. Alignment & Exposure: UV light projects mask patterns onto photoresist. 5. Post-Exposure Bake (PEB): Minimizes standing wave interference. 6. Development: Developer chemical dissolves exposed (positive) or unexposed (negative) resist. 7. Hard Bake: Toughens resist before etching. 8. Pattern Transfer: Plasma etching or ion implantation modifies the exposed substrate. 9. Strip: Oxygen plasma ashing removes all remaining photoresist.',
    requiredKeyPoints: [
      { id: 'kp_17', label: 'Spin-coating photoresist', keywords: ['spin coat', 'spin coating', 'photoresist application'] },
      { id: 'kp_18', label: 'Alignment and UV mask exposure', keywords: ['exposure', 'align mask', 'uv light', 'photomask'] },
      { id: 'kp_19', label: 'Chemical development of pattern', keywords: ['developer', 'development', 'dissolve'] },
      { id: 'kp_20', label: 'Photoresist stripping / ashing', keywords: ['strip', 'stripping', 'ashing', 'plasma ash', 'remove resist'] }
    ],
    reviewed: false
  },
  {
    id: 'int_mfg_3',
    category: 'manufacturing_process',
    difficulty: 'beginner',
    type: 'mcq',
    question: 'What is the main distinction between Chemical Vapor Deposition (CVD) and Physical Vapor Deposition (PVD)?',
    options: [
      'CVD involves chemical gas-phase reactions on the substrate surface, while PVD condenses physically sputtered/evaporated atoms',
      'CVD is done with water, PVD is done with oil',
      'CVD is only used for plastics, PVD for metals',
      'CVD is done by hand, PVD is automated'
    ],
    correctIndex: 0,
    explanation: 'CVD forms films via chemical reactions of precursor gases (yielding conformal coverage), whereas PVD is line-of-sight physical sputtering.',
    reviewed: false
  },
  {
    id: 'int_mfg_4',
    category: 'manufacturing_process',
    difficulty: 'intermediate',
    type: 'mcq',
    question: 'Why is Chemical Mechanical Planarization (CMP) required between successive metal interconnect layers on modern microchips?',
    options: [
      'To eliminate surface topography hills/valleys, ensuring optical depth-of-focus during subsequent lithography steps',
      'To make the wafer shiny for customer display',
      'To melt the copper interconnects into a single block',
      'To cool down the wafer'
    ],
    correctIndex: 0,
    explanation: 'High numerical aperture lithography lenses have extremely shallow depth of focus (<100nm); CMP maintains wafer flatness.',
    reviewed: false
  },
  {
    id: 'int_mfg_5',
    category: 'manufacturing_process',
    difficulty: 'advanced',
    type: 'descriptive',
    question: 'What is semiconductor yield (歩留まり - Budomari), and what statistical model is commonly used to predict yield based on defect density and die size?',
    explanation: 'Yield is the percentage of functional non-defective dies; models include Poisson, Murphy, and Negative Binomial / Murphy-Seeds.',
    modelAnswer: 'Yield (Budomari) is the percentage of functional, non-defective semiconductor chips obtained from a wafer relative to the maximum theoretical die count. The Murphy and Negative Binomial models are widely used to estimate yield. Yield depends exponentially on the critical defect density (D0) per unit area and the physical die size (A): Yield ≈ exp(-D0 * A) in the basic Poisson model. As die area increases, the probability of intercepting a killer particulate defect rises dramatically, which is why modern processors often partition large monolithic dies into smaller modular chiplets.',
    requiredKeyPoints: [
      { id: 'kp_21', label: 'Percentage of non-defective functional dies', keywords: ['functional chips', 'non-defective', 'good dies', 'working chips'] },
      { id: 'kp_22', label: 'Defect density D0 relationship', keywords: ['defect density', 'd0', 'particles per area'] },
      { id: 'kp_23', label: 'Die area A exponential dependency', keywords: ['die area', 'die size', 'larger die'] },
      { id: 'kp_24', label: 'Chiplet modular architecture benefit', keywords: ['chiplet', 'modular die', 'yield improvement', 'poisson', 'murphy'] }
    ],
    reviewed: false
  },
  {
    id: 'int_mfg_6',
    category: 'manufacturing_process',
    difficulty: 'intermediate',
    type: 'mcq',
    question: 'What is the purpose of Rapid Thermal Annealing (RTA) following ion implantation?',
    options: [
      'To repair crystal lattice displacement damage and electrically activate dopant atoms in substitution sites',
      'To burn off the wafer edges',
      'To deposit copper vias',
      'To cool the cleanroom atmosphere'
    ],
    correctIndex: 0,
    explanation: 'Ion implantation bombards silicon with high-energy ions that shatter the crystal lattice. RTA rapidly heats the wafer to repair the lattice.',
    reviewed: false
  },
  {
    id: 'int_mfg_7',
    category: 'manufacturing_process',
    difficulty: 'beginner',
    type: 'mcq',
    question: 'What cleanroom standard classifies an environment having no more than 1 particle of 0.5 μm size per cubic foot of air?',
    options: ['ISO Class 3 (Fed Standard 209E Class 1)', 'ISO Class 8 (Class 100,000)', 'Class 1,000', 'Standard office room'],
    correctIndex: 0,
    explanation: 'A Class 1 cleanroom contains at most 1 particle >= 0.5μm per cubic foot of air, equivalent to ISO Class 3.',
    reviewed: false
  }
];
