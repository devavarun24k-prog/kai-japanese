// src/features/interview/data/questionsPart3.ts
// Interview starter questions 41 to 60: Engineering Projects & Behavioral / HR
import { InterviewQuestion } from '../types';

export const INTERVIEW_QUESTIONS_PART_3: InterviewQuestion[] = [
  // Engineering Projects (MCQ & Descriptive)
  {
    id: 'int_proj_1',
    category: 'projects',
    difficulty: 'beginner',
    type: 'mcq',
    question: 'When presenting an engineering capstone or technical project in an interview, what is the recommended framework for structuring your narrative?',
    options: [
      'STAR Framework: Situation, Task, Action, and quantifiable Result',
      'Tell chronological details about every line of code written',
      'Focus only on what went wrong and blame team members',
      'Read the component datasheet aloud'
    ],
    correctIndex: 0,
    explanation: 'The STAR framework ensures clear communication by presenting the engineering challenge (S/T), personal actions (A), and measurable results (R).',
    reviewed: false
  },
  {
    id: 'int_proj_2',
    category: 'projects',
    difficulty: 'intermediate',
    type: 'descriptive',
    question: 'Describe an engineering project you built, focusing on a major technical trade-off you had to make between performance, power, and cost.',
    explanation: 'Demonstrates systems engineering thinking, balancing component selection against physical constraints.',
    modelAnswer: 'In my hardware development project, we faced a trade-off between power consumption and computational performance. Initially, a 32-bit Cortex-M4 microcontroller running at 120 MHz provided smooth digital signal processing, but consumed 45 mA, which drained our compact battery in under 8 hours. To achieve our 30-day battery life requirement, I redesigned the architecture to use an ultra-low-power Cortex-M0+ running at 16 MHz with hardware sleep modes, offloading periodic sensor sampling to an autonomous DMA channel. This reduced average current to 180 μA, meeting battery life targets while preserving required sampling throughput.',
    requiredKeyPoints: [
      { id: 'kp_49', label: 'Concrete technical project context', keywords: ['project', 'system', 'hardware', 'sensor', 'microcontroller', 'circuit', 'design'] },
      { id: 'kp_50', label: 'Clear trade-off identification (power vs performance/cost)', keywords: ['trade-off', 'power consumption', 'battery', 'cost', 'speed', 'performance'] },
      { id: 'kp_51', label: 'Specific engineering action taken', keywords: ['redesigned', 'switched', 'optimized', 'implemented', 'sleep mode', 'dma', 'component selection'] },
      { id: 'kp_52', label: 'Quantifiable result or validation', keywords: ['reduced', 'achieved', 'measured', 'result', 'hours', 'percent', 'target'] }
    ],
    reviewed: false
  },
  {
    id: 'int_proj_3',
    category: 'projects',
    difficulty: 'beginner',
    type: 'mcq',
    question: 'Why is Design for Manufacturing and Assembly (DFM/DFA) critical before releasing a hardware PCB for volume fabrication?',
    options: [
      'It identifies layout violations, inadequate thermal reliefs, and component clearances early, avoiding expensive board respins and assembly line halts',
      'It automatically writes the firmware code',
      'It changes the color of the solder mask to green',
      'It makes the circuit completely immune to gravity'
    ],
    correctIndex: 0,
    explanation: 'DFM/DFA ensures the board layout can be produced with high yield and assembled smoothly by pick-and-place machines.',
    reviewed: false
  },
  {
    id: 'int_proj_4',
    category: 'projects',
    difficulty: 'intermediate',
    type: 'mcq',
    question: 'In Git version control for collaborative embedded software development, what is the advantage of using feature branches and Pull Requests?',
    options: [
      'Allows peer code review, continuous integration (CI) unit test automation, and keeps the main production branch stable and buildable',
      'Deletes all previous commit history to save disk space',
      'Prevents any other team member from seeing the code',
      'Compiles the C code into machine binary automatically'
    ],
    correctIndex: 0,
    explanation: 'Pull Requests enable code quality gates, automated testing, and team knowledge sharing before merging into mainline.',
    reviewed: false
  },
  {
    id: 'int_proj_5',
    category: 'projects',
    difficulty: 'advanced',
    type: 'descriptive',
    question: 'How do you handle scope creep and unexpected component obsolescence or supply chain shortages in an active hardware project?',
    explanation: 'Involves multi-sourcing, pin-compatible alternative selection, and formal change control.',
    modelAnswer: '1. Multi-sourcing & Second Sources: During initial schematic capture, I specify pin-compatible secondary alternates for critical passives, power ICs, and sensors. 2. Active Lifecycle Tracking: Monitor component lifecycle status (NRND - Not Recommended for New Designs, EOL) via distributor APIs. 3. Modular Architecture: Abstract hardware-dependent drivers behind clear HAL (Hardware Abstraction Layer) interfaces, allowing microcontroller pin reassignment without breaking application firmware. 4. Change Control & Scope Management: Evaluate unexpected feature requests against the critical path and BOM budget, negotiating phased rollouts for non-essential features.',
    requiredKeyPoints: [
      { id: 'kp_53', label: 'Pin-compatible second sources during schematic design', keywords: ['second source', 'pin-compatible', 'alternate part', 'multi-sourcing'] },
      { id: 'kp_54', label: 'Lifecycle monitoring (EOL, NRND)', keywords: ['eol', 'nrnd', 'lifecycle', 'obsolescence'] },
      { id: 'kp_55', label: 'Hardware Abstraction Layer (HAL) firmware modularity', keywords: ['hal', 'abstraction', 'modular firmware', 'driver separation'] },
      { id: 'kp_56', label: 'Formal change control / critical path trade-offs', keywords: ['scope creep', 'critical path', 'change control', 'bom cost'] }
    ],
    reviewed: false
  },
  {
    id: 'int_proj_6',
    category: 'projects',
    difficulty: 'intermediate',
    type: 'mcq',
    question: 'What is a Bill of Materials (BOM) in hardware development?',
    options: [
      'A comprehensive list of raw materials, assemblies, sub-components, and quantities needed to manufacture an end product, along with manufacturer part numbers (MPN)',
      'The electric utility invoice for running the factory',
      'The legal patent registration form',
      'A receipt for the software license'
    ],
    correctIndex: 0,
    explanation: 'A BOM defines every physical item needed for PCBA assembly, including reference designators, MPNs, footprints, and tolerances.',
    reviewed: false
  },
  {
    id: 'int_proj_7',
    category: 'projects',
    difficulty: 'beginner',
    type: 'mcq',
    question: 'What does Thermal Design Power (TDP) indicate when selecting an active heatsink or cooling solution for an IC?',
    options: [
      'The maximum amount of heat generated by the semiconductor under normal operating workload that the cooling system must dissipate',
      'The minimum battery voltage required to start the device',
      'The temperature at which solder melts',
      'The thermal energy of the room'
    ],
    correctIndex: 0,
    explanation: 'TDP represents the heat dissipation requirement (in Watts) to keep the semiconductor junction temperature (Tj) below maximum ratings.',
    reviewed: false
  },

  // Behavioral & HR (STAR Method & Japanese Workplace Culture)
  {
    id: 'int_hr_1',
    category: 'behavioral_hr',
    difficulty: 'beginner',
    type: 'mcq',
    question: 'In Japanese business and engineering culture, what does the fundamental communication principle "Hou-Ren-So" (報連相) represent?',
    options: [
      'Houkoku (Report progress), Renraku (Inform / communicate), and Soudan (Consult / ask for guidance)',
      'A specific manufacturing robot from Tokyo',
      'An emergency fire alarm evacuation protocol',
      'A type of Japanese green tea served to clients'
    ],
    correctIndex: 0,
    explanation: 'Hou-Ren-So is the cornerstone of Japanese teamwork: Reporting status promptly, informing stakeholders of changes, and consulting colleagues before problems escalate.',
    reviewed: false
  },
  {
    id: 'int_hr_2',
    category: 'behavioral_hr',
    difficulty: 'intermediate',
    type: 'descriptive',
    question: 'Tell me about a time you experienced a technical disagreement with a team member or project lead. How did you resolve it?',
    explanation: 'Demonstrates professional emotional intelligence, objective data-driven argumentation, and commitment to project goals.',
    modelAnswer: 'During our robotics capstone project, my teammate and I disagreed on the motor control architecture: they favored open-loop stepper motors for simplicity, while I advocated closed-loop BLDC motors with magnetic encoders for precision and battery efficiency. Instead of arguing opinion, I proposed an objective benchmark test: we set up a rapid breadboard prototype with both options and measured torque under load, position repeatability, and current draw. The data clearly showed the stepper motor stalled under high friction. My teammate agreed with the data, and we adopted closed-loop control. I made sure to thank them for their focus on simplicity, which inspired us to streamline our wiring harness.',
    requiredKeyPoints: [
      { id: 'kp_57', label: 'Concrete technical disagreement described', keywords: ['disagreement', 'differing opinion', 'architecture', 'approach', 'decision'] },
      { id: 'kp_58', label: 'Objective data-driven resolution (benchmarking/testing)', keywords: ['data', 'testing', 'benchmark', 'prototype', 'objective', 'measured'] },
      { id: 'kp_59', label: 'Constructive collaborative attitude (listening/respect)', keywords: ['listened', 'collaborated', 'discussed', 'agreed', 'respect'] },
      { id: 'kp_60', label: 'Positive project outcome reached', keywords: ['successful', 'outcome', 'delivered', 'result', 'resolved'] }
    ],
    reviewed: false
  },
  {
    id: 'int_hr_3',
    category: 'behavioral_hr',
    difficulty: 'beginner',
    type: 'mcq',
    question: 'When asked in an interview: "What is your greatest technical weakness?", which response strategy is most effective?',
    options: [
      'State a genuine area of improvement, coupled with concrete proactive steps and habits you are actively taking to master it',
      'Claim you have zero weaknesses and know everything',
      'Give a disguised boast like "I work too hard and care too much"',
      'Blame your previous school teachers or former managers'
    ],
    correctIndex: 0,
    explanation: 'Honest self-awareness combined with demonstrable learning initiatives shows maturity, growth mindset, and coachability.',
    reviewed: false
  },
  {
    id: 'int_hr_4',
    category: 'behavioral_hr',
    difficulty: 'intermediate',
    type: 'descriptive',
    question: 'Why do you want to work as an engineer in Japan, and how are you preparing for cultural and language integration?',
    explanation: 'Assesses commitment, genuine motivation towards Japanese engineering excellence, and active language study.',
    modelAnswer: 'I have deep respect for Japanese Monozukuri (ものづくり)—the dedication to craftsmanship, zero-defect quality, and relentless Kaizen (continuous improvement) in semiconductor and hardware engineering. Japan is a global leader in precision semiconductor manufacturing equipment and robotics. To prepare for seamless integration, I study Japanese daily, focusing on technical workplace vocabulary, keigo honorifics, and Hou-Ren-So communication. I am committed to building a long-term engineering career in Japan and contributing my foundational hardware skills to the team.',
    requiredKeyPoints: [
      { id: 'kp_61', label: 'Genuine appreciation for Monozukuri or Japanese tech excellence', keywords: ['monozukuri', 'craftsmanship', 'quality', 'kaizen', 'semiconductor leadership', 'precision'] },
      { id: 'kp_62', label: 'Active Japanese language study habits', keywords: ['study japanese', 'jlpt', 'language study', 'vocabulary', 'keigo'] },
      { id: 'kp_63', label: 'Understanding of workplace culture (e.g. Hou-Ren-So / Kaizen)', keywords: ['hou-ren-so', 'teamwork', 'communication', 'culture', 'integration'] },
      { id: 'kp_64', label: 'Long-term career commitment', keywords: ['long term', 'career', 'contribute', 'future in japan'] }
    ],
    reviewed: false
  },
  {
    id: 'int_hr_5',
    category: 'behavioral_hr',
    difficulty: 'beginner',
    type: 'mcq',
    question: 'What does the Japanese manufacturing philosophy "Kaizen" (改善) mean?',
    options: [
      'Continuous, incremental improvement involving everyone from shop-floor workers to executives',
      'Canceling a product line immediately',
      'Hiring external consultants for rapid layoffs',
      'Building the largest factory possible'
    ],
    correctIndex: 0,
    explanation: 'Kaizen signifies continuous improvement through small, everyday refinements that compound into world-class quality over time.',
    reviewed: false
  },
  {
    id: 'int_hr_6',
    category: 'behavioral_hr',
    difficulty: 'advanced',
    type: 'descriptive',
    question: 'Describe a situation where a critical deadline was in jeopardy because of an unexpected technical setback. How did you prioritize and deliver?',
    explanation: 'Evaluates composure under pressure, triage, communication with stakeholders, and practical problem-solving.',
    modelAnswer: 'Two weeks before our final product demonstration, our custom power supply PCB developed an unexpected thermal shutdown during continuous full-load testing. Missing the deadline would have delayed client trials. I immediately utilized Hou-Ren-So: informed the project lead and team of the risk with an estimated triage timeline. Next, I performed a rapid root-cause analysis with an infrared camera and identified that an inductor was saturating, causing excessive switching FET heat. As a short-term workaround to keep software integration on schedule, we wired an external bench supply, while I redesigned the inductor footprint and ordered rapid 48-hour prototype boards. We populated the revised board, re-verified thermal margins under load, and delivered the demonstration on the target date.',
    requiredKeyPoints: [
      { id: 'kp_65', label: 'High-stakes deadline and unexpected setback described', keywords: ['deadline', 'setback', 'failure', 'risk', 'problem', 'demonstration'] },
      { id: 'kp_66', label: 'Immediate stakeholder communication / escalation', keywords: ['informed', 'communicated', 'hou-ren-so', 'notified lead', 'transparent'] },
      { id: 'kp_67', label: 'Root cause analysis and pragmatic triage', keywords: ['root cause', 'thermal', 'identified', 'workaround', 'prioritized'] },
      { id: 'kp_68', label: 'Successful delivery on target schedule', keywords: ['delivered', 'on time', 'resolved', 'successful demonstration'] }
    ],
    reviewed: false
  },
  {
    id: 'int_hr_7',
    category: 'behavioral_hr',
    difficulty: 'beginner',
    type: 'mcq',
    question: 'At the conclusion of a technical interview in Japan, the interviewer asks: "Do you have any questions for us?" (逆質問). What is the best practice?',
    options: [
      'Ask 2-3 thoughtful questions about the team’s current engineering technical challenges, wafer technology roadmap, or onboarding mentorship',
      'Say "No, I have no questions" and leave immediately',
      'Ask exclusively about how many vacation days and bonuses you will get',
      'Ask the interviewer how much money they earn'
    ],
    correctIndex: 0,
    explanation: 'Reverse questions (Gyakushitsumon) demonstrate genuine curiosity, technical engagement, and enthusiasm for the company.',
    reviewed: false
  },
  {
    id: 'int_proj_8',
    category: 'projects',
    difficulty: 'intermediate',
    type: 'mcq',
    question: 'What is the standard recommended layer stackup for a 4-layer PCB to minimize EMI and loop inductance?',
    options: [
      'Layer 1: Signal (High-speed), Layer 2: Solid Ground Plane, Layer 3: Power Plane, Layer 4: Signal',
      'Layer 1: Power, Layer 2: Power, Layer 3: Signal, Layer 4: Ground',
      'Layer 1: Ground, Layer 2: Ground, Layer 3: Ground, Layer 4: Signal',
      'Layer 1: Signal, Layer 2: Signal, Layer 3: Signal, Layer 4: Power'
    ],
    correctIndex: 0,
    explanation: 'Placing a solid, unbroken ground plane directly beneath high-speed surface signals (Layer 2) provides minimum return current loop area and excellent shielding.',
    reviewed: false
  },
  {
    id: 'int_proj_9',
    category: 'projects',
    difficulty: 'advanced',
    type: 'descriptive',
    question: 'Explain how you utilize the Ishikawa (Fishbone) diagram and the "5 Whys" methodology to perform root cause failure analysis on a hardware defect.',
    explanation: 'Fishbone categorizes causal factors into 6M categories (Machine, Method, Material, Measurement, Man, Mother Nature); 5 Whys drills down to root failure.',
    modelAnswer: 'When a critical hardware failure occurs, I employ an Ishikawa (Fishbone) diagram to systematically categorize potential causes across the 6Ms: Machine (assembly equipment calibration), Method (reflow thermal profile), Material (component solderability/plating), Measurement (probe loading), Man (operator handling/ESD), and Milieu/Environment (ambient humidity). Once the most probable causal branch is isolated through empirical testing, I apply the "5 Whys" iterative inquiry. For instance: 1. Why did the IC fail? Solder bridge. 2. Why did it bridge? Excess solder paste. 3. Why excess paste? Clogged stencil aperture. 4. Why clogged? Ultrasonic cleaning cycle skipped. 5. Why skipped? Inadequate SOP checkoff. This identifies the procedural breakdown rather than blaming the operator, enabling lasting corrective action.',
    requiredKeyPoints: [
      { id: 'kp_69', label: 'Ishikawa fishbone categorization (6Ms/categories)', keywords: ['ishikawa', 'fishbone', 'categories', 'cause and effect', 'machine', 'material'] },
      { id: 'kp_70', label: '5 Whys iterative drill-down technique', keywords: ['5 whys', 'five whys', 'iterative inquiry', 'root cause'] },
      { id: 'kp_71', label: 'Empirical isolation and verification', keywords: ['empirical', 'testing', 'isolation', 'verify'] },
      { id: 'kp_72', label: 'Process-level corrective action (prevent recurrence)', keywords: ['corrective action', 'prevent recurrence', 'sop', 'process improvement'] }
    ],
    reviewed: false
  },
  {
    id: 'int_proj_10',
    category: 'projects',
    difficulty: 'beginner',
    type: 'mcq',
    question: 'Why are dedicated test points (TP) placed on signal traces and power rails during PCB layout?',
    options: [
      'To allow automated bed-of-nails pogo pin fixtures and multimeters to measure voltages and clock signals without damaging components',
      'To make the PCB lighter in weight',
      'To let air escape from the copper traces',
      'To serve as attachment points for screws'
    ],
    correctIndex: 0,
    explanation: 'Test points provide predictable copper landing pads for automated in-circuit test (ICT) pogo pins and benchtop oscilloscope probes.',
    reviewed: false
  },
  {
    id: 'int_hr_8',
    category: 'behavioral_hr',
    difficulty: 'beginner',
    type: 'mcq',
    question: 'What are the five Japanese principles of the "5S" workplace organization methodology widely practiced in engineering and manufacturing?',
    options: [
      'Seiri (Sort), Seiton (Set in order), Seiso (Shine/Clean), Seiketsu (Standardize), and Shitsuke (Sustain/Discipline)',
      'Sushi, Sashimi, Soba, Sake, and Sukiyaki',
      'Speed, Strength, Strategy, Scale, and System',
      'Silicon, Solder, SMT, Schematic, and Sensor'
    ],
    correctIndex: 0,
    explanation: '5S creates a clean, organized, safe, and efficient workplace foundational to Japanese lean manufacturing and zero-defect quality.',
    reviewed: false
  },
  {
    id: 'int_hr_9',
    category: 'behavioral_hr',
    difficulty: 'intermediate',
    type: 'descriptive',
    question: 'How do you handle receiving critical or blunt technical feedback from a senior Japanese engineering lead (Senpai/Kachou)?',
    explanation: 'Emphasizes humility, active listening, gratitude for coaching, and proactive implementation.',
    modelAnswer: 'In Japanese engineering culture, critical feedback from a Senpai or section chief (Kachou) is a demonstration of investment in your professional growth. First, I listen actively without becoming defensive, taking detailed notes and confirming my understanding with respectful clarification. Second, I express sincere gratitude for their guidance ("Goshiteki arigatou gozaimasu"). Third, I promptly formulate an actionable plan to rectify the issue, update my work, and report back (Houkoku) to demonstrate that their feedback has been effectively incorporated.',
    requiredKeyPoints: [
      { id: 'kp_73', label: 'Active listening without defensiveness', keywords: ['listen', 'active listening', 'non-defensive', 'receptive', 'open-minded'] },
      { id: 'kp_74', label: 'Appreciation of feedback as mentorship/growth', keywords: ['growth', 'mentorship', 'guidance', 'gratitude', 'arigatou'] },
      { id: 'kp_75', label: 'Concrete corrective implementation', keywords: ['action plan', 'implement', 'correct', 'adjust', 'revise'] },
      { id: 'kp_76', label: 'Closing the loop via reporting (Houkoku)', keywords: ['houkoku', 'report back', 'close the loop', 'follow up'] }
    ],
    reviewed: false
  },
  {
    id: 'int_hr_10',
    category: 'behavioral_hr',
    difficulty: 'beginner',
    type: 'mcq',
    question: 'What is the correct protocol when exchanging business cards (名刺交換 - Meishi Koukan) in a Japanese corporate setting?',
    options: [
      'Offer your card with both hands held below the client’s card, bow slightly, read their card attentively, and place it on top of your card case during the meeting',
      'Toss your card across the table',
      'Immediately put their card into your back pants pocket',
      'Write your personal phone number on their card with a pen'
    ],
    correctIndex: 0,
    explanation: 'Business cards in Japan represent the person; holding with both hands and treating it respectfully signifies professional esteem.',
    reviewed: false
  },
  {
    id: 'int_hr_11',
    category: 'behavioral_hr',
    difficulty: 'advanced',
    type: 'descriptive',
    question: 'How do you maintain high engineering quality standards and safety protocols when faced with intense pressure to meet an aggressive shipping deadline?',
    explanation: 'Addresses risk assessment, transparent communication, avoiding shortcuts that cause field failures.',
    modelAnswer: 'Meeting aggressive delivery dates is important, but shipping compromised hardware leads to catastrophic field failures, safety hazards, and brand erosion. When under deadline pressure, I first differentiate between cosmetic non-critical features and non-negotiable safety/quality criteria (e.g. thermal margins, ESD protection, overvoltage cutoffs). I never compromise on compliance or core reliability. Instead, I communicate transparently using Hou-Ren-So, presenting data-backed risk assessments to management. If necessary, I propose phased firmware feature rollouts via OTA or deploying additional automated test fixtures, ensuring the physical hardware remains robust and verified.',
    requiredKeyPoints: [
      { id: 'kp_77', label: 'Non-negotiable safety and reliability standards', keywords: ['safety', 'reliability', 'no compromise', 'compliance', 'non-negotiable'] },
      { id: 'kp_78', label: 'Risk assessment and feature triage', keywords: ['risk assessment', 'triage', 'prioritize', 'core features'] },
      { id: 'kp_79', label: 'Transparent stakeholder communication (Hou-Ren-So)', keywords: ['transparent', 'hou-ren-so', 'management', 'data-driven'] },
      { id: 'kp_80', label: 'Pragmatic mitigation (phased rollout / test automation)', keywords: ['phased rollout', 'mitigation', 'automation', 'test fixture'] }
    ],
    reviewed: false
  }
];
