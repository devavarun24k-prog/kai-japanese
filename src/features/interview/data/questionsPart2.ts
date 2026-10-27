// src/features/interview/data/questionsPart2.ts
// Interview starter questions 21 to 40: Embedded Systems, Quality & Testing, Troubleshooting
import { InterviewQuestion } from '../types';

export const INTERVIEW_QUESTIONS_PART_2: InterviewQuestion[] = [
  // Embedded Systems (MCQ & Descriptive)
  {
    id: 'int_emb_1',
    category: 'embedded_systems',
    difficulty: 'beginner',
    type: 'mcq',
    question: 'What is the primary architectural difference between Harvard and Von Neumann computer architectures?',
    options: [
      'Harvard has separate physical memory buses for instructions and data, whereas Von Neumann shares a single bus',
      'Von Neumann runs on batteries while Harvard requires AC power',
      'Harvard architecture only supports 8-bit processors',
      'Von Neumann architecture does not have an ALU'
    ],
    correctIndex: 0,
    explanation: 'Harvard architecture allows simultaneous instruction fetching and data reading via dedicated buses, avoiding the Von Neumann bottleneck.',
    reviewed: false
  },
  {
    id: 'int_emb_2',
    category: 'embedded_systems',
    difficulty: 'intermediate',
    type: 'descriptive',
    question: 'Compare I2C, SPI, and UART serial communication protocols in terms of wire count, topology, and typical speeds.',
    explanation: 'I2C uses 2 wires with addressing; SPI uses 4 wires with chip select; UART is asynchronous point-to-point with 2 wires.',
    modelAnswer: '1. I2C (Inter-Integrated Circuit): Synchronous, multi-master/multi-slave using 2 open-drain lines (SDA, SCL) with pull-up resistors. Devices are addressed by 7-bit or 10-bit IDs. Typical speeds: 100 kHz (standard), 400 kHz (fast), up to 3.4 MHz. 2. SPI (Serial Peripheral Interface): Synchronous, full-duplex, master-slave using 4 wires (MOSI, MISO, SCK, CS/SS). No addressing overhead; each slave requires a dedicated Chip Select line. Speeds easily exceed 10-50+ MHz. 3. UART (Universal Asynchronous Receiver-Transmitter): Asynchronous point-to-point using 2 wires (TX, RX) without a shared clock. Requires agreed baud rate, start/stop framing bits, and parity. Speeds typically 9600 to 115200 baud.',
    requiredKeyPoints: [
      { id: 'kp_25', label: 'I2C 2-wire bus with addressing (SDA, SCL)', keywords: ['i2c', '2 wire', 'sda', 'scl', 'addressing', 'pull-up'] },
      { id: 'kp_26', label: 'SPI 4-wire high-speed with Chip Select', keywords: ['spi', '4 wire', 'mosi', 'miso', 'chip select', 'cs', 'full duplex'] },
      { id: 'kp_27', label: 'UART asynchronous 2-wire with baud rate', keywords: ['uart', 'asynchronous', 'baud rate', 'tx', 'rx', 'start bit', 'stop bit'] },
      { id: 'kp_28', label: 'Relative speed comparison', keywords: ['speed', 'faster', 'spi is fastest', 'mhz'] }
    ],
    reviewed: false
  },
  {
    id: 'int_emb_3',
    category: 'embedded_systems',
    difficulty: 'beginner',
    type: 'mcq',
    question: 'Why should an Interrupt Service Routine (ISR) in microcontroller firmware be kept as short and non-blocking as possible?',
    options: [
      'To prevent starving other interrupts and avoid delaying real-time system scheduling',
      'To prevent the flash memory from erasing',
      'Because microcontrollers cannot execute more than 5 lines of C code',
      'To reduce battery voltage instantly'
    ],
    correctIndex: 0,
    explanation: 'Long-running ISRs block other critical interrupts (interrupt latency), potentially causing dropped hardware packets or watchdog resets.',
    reviewed: false
  },
  {
    id: 'int_emb_4',
    category: 'embedded_systems',
    difficulty: 'intermediate',
    type: 'mcq',
    question: 'In embedded C programming, what does the `volatile` keyword instruct the compiler to do?',
    options: [
      'Disable compiler optimization for that variable and re-read its value directly from hardware memory on every access',
      'Store the variable permanently in EEPROM',
      'Ensure the variable can only be accessed by one thread at a time',
      'Make the variable execute 10 times faster'
    ],
    correctIndex: 0,
    explanation: '`volatile` tells the compiler that the variable value can change unexpectedly (e.g. by an ISR or hardware register), forbidding caching in CPU registers.',
    reviewed: false
  },
  {
    id: 'int_emb_5',
    category: 'embedded_systems',
    difficulty: 'advanced',
    type: 'descriptive',
    question: 'Explain Priority Inversion in real-time operating systems (RTOS) and describe how Priority Inheritance solves it.',
    explanation: 'Priority inversion happens when a high-priority task is blocked waiting for a low-priority task holding a mutex, while a medium task runs.',
    modelAnswer: 'Priority Inversion occurs when a High-priority task (H) needs a shared resource currently locked by a Low-priority task (L) with a mutex. If a Medium-priority task (M) that does not need the resource pre-empts L, H is indirectly blocked by M for an unbounded duration, inverting system priorities (famous Mars Pathfinder bug). Priority Inheritance Protocol solves this: when H blocks waiting for L’s mutex, L temporarily inherits H’s high priority until L releases the mutex. This prevents medium-priority tasks from preempting L, allowing L to finish quickly and return execution to H.',
    requiredKeyPoints: [
      { id: 'kp_29', label: 'High priority task blocked waiting for mutex', keywords: ['high priority', 'mutex', 'resource lock', 'blocked'] },
      { id: 'kp_30', label: 'Medium priority task preempting low priority task', keywords: ['medium priority', 'preempt', 'unbounded delay'] },
      { id: 'kp_31', label: 'Priority Inheritance mechanism', keywords: ['priority inheritance', 'temporary priority', 'elevate priority', 'boost'] },
      { id: 'kp_32', label: 'Quick release and priority restoration', keywords: ['release mutex', 'restore priority', 'prompt execution'] }
    ],
    reviewed: false
  },
  {
    id: 'int_emb_6',
    category: 'embedded_systems',
    difficulty: 'beginner',
    type: 'mcq',
    question: 'What is the role of a hardware Watchdog Timer (WDT) in mission-critical embedded systems?',
    options: [
      'Automatically resets the microcontroller if the software fails to periodically refresh ("kick") the timer due to a deadlock or crash',
      'Monitors the ambient temperature of the casing',
      'Keeps track of real-world date and time',
      'Counts the number of user button presses'
    ],
    correctIndex: 0,
    explanation: 'A watchdog timer is an autonomous hardware counter that triggers a hardware reset if the firmware freezes and stops resetting the counter.',
    reviewed: false
  },

  // Quality & Testing (MCQ & Descriptive)
  {
    id: 'int_qc_1',
    category: 'quality_testing',
    difficulty: 'beginner',
    type: 'mcq',
    question: 'What does Six Sigma quality methodology define as an acceptable defect rate in parts-per-million (PPM)?',
    options: ['3.4 defects per million opportunities', '100 defects per million', '1 defect per thousand', '0 defects (zero tolerance)'],
    correctIndex: 0,
    explanation: 'Six Sigma quality represents a statistical process capability of 3.4 defects per million opportunities (DPMO).',
    reviewed: false
  },
  {
    id: 'int_qc_2',
    category: 'quality_testing',
    difficulty: 'intermediate',
    type: 'descriptive',
    question: 'Explain the difference between In-Circuit Testing (ICT) and Functional Testing (FCT) on an electronics manufacturing line.',
    explanation: 'ICT tests individual passive/active components for manufacturing defects; FCT verifies complete operational behavior.',
    modelAnswer: 'In-Circuit Testing (ICT) uses a bed-of-nails fixture to contact test points on the unpowered or minimally powered PCBA. It checks for physical assembly defects such as solder shorts, opens, incorrect component orientations, and measures component values (resistors, capacitors, diodes). Functional Testing (FCT), by contrast, powers the PCB with operating voltages and simulates real-world operating inputs/outputs (firmware execution, sensor signals, communication buses) to verify that the board operates according to product specifications.',
    requiredKeyPoints: [
      { id: 'kp_33', label: 'ICT bed-of-nails test points', keywords: ['bed of nails', 'test points', 'fixture', 'in-circuit'] },
      { id: 'kp_34', label: 'ICT component-level checks (shorts, opens, values)', keywords: ['shorts', 'opens', 'component value', 'solder bridge', 'passive measurement'] },
      { id: 'kp_35', label: 'FCT operating under full power and inputs', keywords: ['functional test', 'full power', 'simulate inputs', 'operating voltage'] },
      { id: 'kp_36', label: 'FCT end-to-end specification validation', keywords: ['specification', 'firmware execution', 'operational behavior', 'end to end'] }
    ],
    reviewed: false
  },
  {
    id: 'int_qc_3',
    category: 'quality_testing',
    difficulty: 'beginner',
    type: 'mcq',
    question: 'What is Automated Optical Inspection (AOI) used for in Surface Mount Technology (SMT) production lines?',
    options: [
      'High-speed cameras photograph solder joints and component markings to detect misalignment, solder bridging, and missing parts',
      'Testing the radio frequency emissions of the cleanroom',
      'Cleaning the flux residue with lasers',
      'Measuring the electrical resistance of the silicon die'
    ],
    correctIndex: 0,
    explanation: 'AOI visually inspects surface-mount PCBAs post-reflow to catch tombstoning, solder bridges, solder insufficient, and part rotations.',
    reviewed: false
  },
  {
    id: 'int_qc_4',
    category: 'quality_testing',
    difficulty: 'intermediate',
    type: 'mcq',
    question: 'What is the purpose of Highly Accelerated Life Testing (HALT) during the product development cycle?',
    options: [
      'Applying severe multi-axis vibration, rapid thermal cycling, and voltage stress to deliberately discover design weaknesses and failure modes',
      'Speeding up the factory conveyor belt',
      'Checking if the product packaging looks appealing',
      'Confirming the software downloads quickly'
    ],
    correctIndex: 0,
    explanation: 'HALT subjects hardware to stress beyond rated operating specs to quickly uncover design margins and latent failure modes.',
    reviewed: false
  },
  {
    id: 'int_qc_5',
    category: 'quality_testing',
    difficulty: 'advanced',
    type: 'descriptive',
    question: 'What is Statistical Process Control (SPC), and how are Cp and Cpk indices used to evaluate manufacturing capability?',
    explanation: 'Cp measures process potential spread against specification limits; Cpk accounts for process centering.',
    modelAnswer: 'Statistical Process Control (SPC) uses statistical control charts to monitor a manufacturing process over time and distinguish between common-cause variation and special-cause anomalies. Cp (Process Capability) compares the allowed tolerance spread (Upper Spec Limit - Lower Spec Limit) against the natural 6-sigma process spread (6σ), measuring potential capability regardless of centering. Cpk (Process Capability Index) accounts for whether the process mean is centered: Cpk = min((USL - mean)/(3σ), (mean - LSL)/(3σ)). A Cpk >= 1.33 is standard for stable mass production; Cpk >= 1.67 or 2.0 indicates Six Sigma quality.',
    requiredKeyPoints: [
      { id: 'kp_37', label: 'Distinguishing common cause from special cause variation', keywords: ['statistical control', 'control chart', 'variation', 'spc'] },
      { id: 'kp_38', label: 'Cp measuring potential tolerance spread (6 sigma)', keywords: ['cp', 'process spread', '6 sigma', 'usl - lsl'] },
      { id: 'kp_39', label: 'Cpk accounting for process mean centering', keywords: ['cpk', 'centering', 'mean', 'process center'] },
      { id: 'kp_40', label: 'Standard capability benchmarks (e.g. 1.33 or 1.67)', keywords: ['1.33', '1.67', 'benchmark', 'six sigma'] }
    ],
    reviewed: false
  },
  {
    id: 'int_qc_6',
    category: 'quality_testing',
    difficulty: 'beginner',
    type: 'mcq',
    question: 'What does ESD stand for, and why is an ESD wrist strap mandatory in cleanrooms and assembly benches?',
    options: [
      'Electrostatic Discharge; it drains accumulated static body charge safely to ground through a 1 megaohm resistor to protect delicate gate oxides',
      'Electronic Sound Detector; it protects hearing',
      'Emergency Shut Down; it turns off the room lights',
      'Environmental Safety Device; it absorbs heat'
    ],
    correctIndex: 0,
    explanation: 'Static voltages generated by walking (thousands of volts) can rupture sub-nanometer MOSFET gate oxides; wrist straps drain this safely to earth.',
    reviewed: false
  },

  // Troubleshooting & Failure Analysis (MCQ & Descriptive)
  {
    id: 'int_trouble_1',
    category: 'troubleshooting',
    difficulty: 'beginner',
    type: 'mcq',
    question: 'You power on a newly assembled prototype board and notice the benchtop power supply immediately drops to 0V and displays "Current Limit (CC)". What is the most probable cause?',
    options: [
      'A dead short circuit between the power rail and ground',
      'The microcontroller is executing an infinite loop',
      'A pull-up resistor is slightly too large',
      'An LED is turned off'
    ],
    correctIndex: 0,
    explanation: 'A short circuit between VCC and GND causes maximum current to flow, driving the power supply into constant-current (CC) limiting mode.',
    reviewed: false
  },
  {
    id: 'int_trouble_2',
    category: 'troubleshooting',
    difficulty: 'intermediate',
    type: 'descriptive',
    question: 'Walk through your systematic troubleshooting methodology when debugging an intermittent microcontroller system crash in the field.',
    explanation: 'Methodology involves replicating the failure, monitoring power rails, examining watchdog/reset logs, and checking thermal/EMI.',
    modelAnswer: '1. Information Gathering & Replication: Determine environmental conditions (temperature, duty cycle, vibration) and examine the crash logs or reset cause register (Power-on, Watchdog, Brown-Out, or Software Reset). 2. Power Rail Analysis: Hook an oscilloscope to 3.3V/5V rails with AC coupling to capture transient brownouts, dropouts, or high-frequency switching ripple during high-load events (e.g. wireless transmission or motor actuation). 3. Clock & Reset Lines: Verify crystal oscillator stability, drive strength, and inspect the reset line for noise coupling. 4. Firmware Stack & Memory: Check for stack overflow, heap fragmentation, memory leaks, and unhandled interrupts. 5. Thermal & EMI Stress: Use thermal imaging to inspect for localized overheating components and test near inductive contactors.',
    requiredKeyPoints: [
      { id: 'kp_41', label: 'Check reset reason registers / crash logs', keywords: ['reset register', 'reset cause', 'watchdog reset', 'brown-out', 'crash log'] },
      { id: 'kp_42', label: 'Oscilloscope capture of power rail transients/brownouts', keywords: ['oscilloscope', 'power rail', 'brownout', 'voltage sag', 'ripple', 'transient'] },
      { id: 'kp_43', label: 'Clock oscillator stability check', keywords: ['clock', 'crystal', 'oscillator', 'jitter'] },
      { id: 'kp_44', label: 'Firmware stack overflow or memory inspection', keywords: ['stack overflow', 'memory leak', 'heap', 'null pointer', 'unhandled interrupt'] }
    ],
    reviewed: false
  },
  {
    id: 'int_trouble_3',
    category: 'troubleshooting',
    difficulty: 'beginner',
    type: 'mcq',
    question: 'When measuring an I2C communication bus with an oscilloscope, you see high levels that never reach +3.3V but float around +1.2V with sluggish rising edges. What is missing or misconfigured?',
    options: [
      'Missing or excessive pull-up resistors on SDA and SCL lines',
      'The oscilloscope probe is set to AC coupling',
      'The ground wire is too thick',
      'The battery is too full'
    ],
    correctIndex: 0,
    explanation: 'I2C is an open-drain bus; without proper pull-up resistors (typically 2.2kΩ to 4.7kΩ), the bus cannot pull signals cleanly up to VCC.',
    reviewed: false
  },
  {
    id: 'int_trouble_4',
    category: 'troubleshooting',
    difficulty: 'intermediate',
    type: 'mcq',
    question: 'What is the root cause of the "tombstoning" defect observed during SMT reflow soldering of passive chip components?',
    options: [
      'Unbalanced surface tension forces of molten solder between the two pads, causing the chip to stand up vertically on one end',
      'Excessive nitrogen gas in the oven',
      'The PCB being upside down',
      'Using lead-free solder with gold plating'
    ],
    correctIndex: 0,
    explanation: 'If one solder pad wets or heats faster than the other, the surface tension pull on that pad lifts the other end into a vertical tombstone.',
    reviewed: false
  },
  {
    id: 'int_trouble_5',
    category: 'troubleshooting',
    difficulty: 'advanced',
    type: 'descriptive',
    question: 'What is CMOS latch-up, what triggers it, and what design guidelines prevent it in semiconductor IC layouts?',
    explanation: 'Latch-up is parasitic thyristor (SCR) activation in CMOS creating a short between VDD and GND.',
    modelAnswer: 'CMOS latch-up is the inadvertent triggering of parasitic four-layer bipolar transistor structures (PNPN SCR: a parasitic NPN formed by N-well/P-substrate and PNP formed by P-diffusion/N-well) cross-coupled in positive feedback. When triggered by input overvoltage spikes, electrostatic discharge, or substrate noise exceeding diode forward voltage, the SCR turns fully ON, creating a low-impedance short circuit between VDD and GND that can destroy the chip from thermal runaway. Prevention techniques: 1. Extensive guard rings connected to VDD and GND surrounding wells. 2. Heavy substrate taps to keep substrate resistance low. 3. Input protection clamp diodes and current-limiting series resistors.',
    requiredKeyPoints: [
      { id: 'kp_45', label: 'Parasitic SCR (PNPN) cross-coupled thyristor', keywords: ['parasitic', 'scr', 'thyristor', 'pnpn', 'bipolar'] },
      { id: 'kp_46', label: 'Low impedance short between VDD and GND', keywords: ['short circuit', 'vdd and gnd', 'thermal runaway', 'low impedance'] },
      { id: 'kp_47', label: 'Guard rings around wells', keywords: ['guard ring', 'guard rings', 'isolation ring'] },
      { id: 'kp_48', label: 'Substrate taps to reduce resistance', keywords: ['substrate tap', 'well tap', 'substrate resistance'] }
    ],
    reviewed: false
  },
  {
    id: 'int_trouble_6',
    category: 'troubleshooting',
    difficulty: 'beginner',
    type: 'mcq',
    question: 'Which instrument is most effective for inspecting internal micro-voids, Delamination, and solder ball cracks underneath Ball Grid Array (BGA) packages?',
    options: ['X-ray Inspection (2D/3D AXI)', 'Visual inspection with a magnifying glass', 'Multimeter continuity test', 'Infrared thermometer'],
    correctIndex: 0,
    explanation: 'BGA solder joints are hidden underneath the chip body; non-destructive X-ray inspection (AXI) penetrates the package to visualize solder voids.',
    reviewed: false
  },
  {
    id: 'int_trouble_7',
    category: 'troubleshooting',
    difficulty: 'intermediate',
    type: 'mcq',
    question: 'You notice digital output signals showing ringing oscillations and significant voltage overshoot on an oscilloscope. What is the standard circuit solution?',
    options: [
      'Insert a small series termination resistor (e.g. 22Ω - 33Ω) at the driver output to match line impedance',
      'Remove all resistors from the board',
      'Increase the clock frequency by 10x',
      'Short the signal line directly to the 12V supply'
    ],
    correctIndex: 0,
    explanation: 'Series source termination absorbs reflected energy traveling back from the high-impedance receiver, eliminating ringing and overshoot.',
    reviewed: false
  }
];
