// Mock data for SecureMind AI Platform
// Generates realistic banking employees with Indian names and behavioral characteristics

export interface ActivityLog {
  id: string;
  timestamp: string;
  category: 'login' | 'database' | 'file' | 'usb' | 'privilege' | 'network';
  description: string;
  severity: 'low' | 'medium' | 'high';
  anomaly: boolean;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  trustScore: number; // 0 to 100 (high is good)
  predictionRisk: number; // 0 to 100 (high is risky)
  status: 'online' | 'offline';
  baselineWorkingHours: { start: string; end: string };
  currentWorkingHours: { start: string; end: string };
  driftScore: number; // percentage behavior drift
  behaviorDNA: string[];
  weeklyPattern: number[]; // 7 numbers for risk trend
  monthlyPattern: number[]; // 4 numbers for weekly risk trend
  recentLogs: ActivityLog[];
  aiTwinSummary: string;
  anomaliesCount: number;
}

export interface Prediction {
  id: string;
  employeeId: string;
  employeeName: string;
  role: string;
  department: string;
  probability: number; // e.g. 92
  confidence: number; // e.g. 95
  timeWindow: string; // e.g. "Next 24 Hours"
  attackType: string;
  businessImpact: 'Low' | 'Medium' | 'High' | 'Critical';
  explainableAI: string[];
  status: 'active' | 'investigating' | 'resolved' | 'dismissed';
  detectedAt: string;
}

export interface InvestigationCase {
  id: string;
  employeeId: string;
  employeeName: string;
  role: string;
  department: string;
  severity: 'high' | 'medium' | 'low';
  status: 'open' | 'under_review' | 'resolved';
  assignedTo: string;
  createdAt: string;
  description: string;
  evidence: string[];
  aiExplanation: string;
  timeline: ActivityLog[];
  notes: string[];
}

// Helper to generate deterministic dates relative to current time
const getPastDateString = (hoursAgo: number) => {
  const d = new Date();
  d.setHours(d.getHours() - hoursAgo);
  return d.toISOString();
};

const firstNames = [
  'Karthik', 'Senthil', 'Vignesh', 'Ramesh', 'Suresh', 'Balaji', 'Vijay', 'Ajith', 'Sanjay', 'Hari',
  'Dinesh', 'Saravanan', 'Murugan', 'Prabhu', 'Selvam', 'Kannan', 'Ganesh', 'Arun', 'Sridhar', 'Anand',
  'Mani', 'Prakash', 'Rajesh', 'Kumar', 'Priya', 'Meena', 'Abirami', 'Divya', 'Anitha', 'Kavitha',
  'Deepa', 'Sandhya', 'Archana', 'Vidya', 'Sujatha', 'Gayathri', 'Preethi', 'Chitra', 'Lakshmi', 'Uma',
  'Aishwarya', 'Janani', 'Pavithra', 'Subhashini', 'Revathi', 'Nandhini', 'Shalini', 'Dharshini', 'Kokila', 'Malathi'
];

const lastNames = [
  'Ramanathan', 'Chidambaram', 'Subramanian', 'Krishnan', 'Srinivasan', 'Balasubramanian', 'Arumugam', 'Rajasekaran', 'Senthilvel', 'Gunasekaran',
  'Natarajan', 'Thangavel', 'Kaliappan', 'Muthuvel', 'Palaniappan', 'Sadasivam', 'Karuppasamy', 'Chettiyar', 'Pillai', 'Ganesan',
  'Sundaram', 'Viswanathan', 'Radhakrishnan', 'Shanmugam', 'Doraisamy', 'Gopalakrishnan', 'Soundararajan', 'Venkatraman', 'Anbazhagan', 'Thirunavukkarasu',
  'Kaliyaperumal', 'Meenakshisundaram', 'Sathyamurthy', 'Ramasamy', 'Kandasamy', 'Kathirvel', 'Govindasamy', 'Velusamy', 'Nallasamy', 'Chinnasamy',
  'Palanisamy', 'Muthusamy', 'Ramasundaram', 'Kalyanasundaram', 'Somasundaram', 'Jegadeesan', 'Paneerselvam', 'Sabarigirish', 'Logeswaran', 'Sivakumar'
];

const departments = [
  'Treasury & Markets',
  'Wealth Management',
  'Retail Banking',
  'IT & Cybersecurity',
  'Operations',
  'Human Resources',
  'Legal & Compliance'
];

const rolesByDept: Record<string, string[]> = {
  'Treasury & Markets': ['Treasury Dealer', 'Foreign Exchange Analyst', 'Fixed Income Trader', 'Risk Analyst'],
  'Wealth Management': ['Wealth Manager', 'Relationship Manager', 'Investment Advisor', 'Portfolio Specialist'],
  'Retail Banking': ['Branch Manager', 'Loan Officer', 'Customer Service Manager', 'Retail Teller Supervisor'],
  'IT & Cybersecurity': ['DevSecOps Engineer', 'Database Administrator', 'Network Architect', 'Security Analyst'],
  'Operations': ['Operations Lead', 'Clearing Associate', 'Settlement Specialist', 'KYC Verification Analyst'],
  'Human Resources': ['HR Partner', 'Talent Acquisition Lead', 'Payroll Specialist', 'HR Operations Analyst'],
  'Legal & Compliance': ['Compliance Auditor', 'Legal Counsel', 'AML Analyst', 'Fraud Investigator']
};

const workingHoursBaselines = [
  { start: '09:00', end: '18:00' },
  { start: '08:30', end: '17:30' },
  { start: '10:00', end: '19:00' },
  { start: '09:30', end: '18:30' }
];

// Seeded pseudo-random generator to keep mock data consistent
function createRandom(seed: number) {
  return function() {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
}

export const generateMockDatabase = () => {
  const random = createRandom(42); // Seeded random
  const employees: Employee[] = [];

  // 1. Manually add our high-profile threat prediction cases first to ensure they exist exactly as designed
  const rajesh: Employee = {
    id: 'EMP001',
    name: 'Karthikeyan Balaji',
    email: 'karthikeyan.balaji@securemind.bank',
    role: 'Fixed Income Trader',
    department: 'Treasury & Markets',
    trustScore: 18,
    predictionRisk: 92,
    status: 'online',
    baselineWorkingHours: { start: '08:30', end: '17:30' },
    currentWorkingHours: { start: '03:15', end: '22:45' },
    driftScore: 78,
    behaviorDNA: [
      'High Trading Volume Threshold Exceeded',
      'Off-hours Database Queries',
      'Mass Download of Confidential Yield Sheets',
      'Unauthorized USB Connection detected'
    ],
    weeklyPattern: [10, 15, 30, 60, 92, 85, 92],
    monthlyPattern: [20, 35, 65, 92],
    recentLogs: [
      {
        id: 'L101',
        timestamp: getPastDateString(2),
        category: 'usb',
        description: 'Unauthorized storage device (Cruzer USB 64GB) connected to workstation WS-TRD-45',
        severity: 'high',
        anomaly: true
      },
      {
        id: 'L102',
        timestamp: getPastDateString(4),
        category: 'file',
        description: 'Mass download (1,450 records) of treasury bond client data sheet from secure repository',
        severity: 'high',
        anomaly: true
      },
      {
        id: 'L103',
        timestamp: getPastDateString(7),
        category: 'database',
        description: 'Read query to confidential TREASURY_LEDGER table executed at 03:22 AM',
        severity: 'high',
        anomaly: true
      },
      {
        id: 'L104',
        timestamp: getPastDateString(28),
        category: 'login',
        description: 'Remote VPN Login from unusual subnet IP 103.45.12.89 at 03:15 AM',
        severity: 'medium',
        anomaly: true
      },
      {
        id: 'L105',
        timestamp: getPastDateString(32),
        category: 'network',
        description: 'Port scanning attempt detected from local terminal WS-TRD-45',
        severity: 'medium',
        anomaly: true
      }
    ],
    aiTwinSummary: 'Karthikeyan\'s behavior exhibits extreme anomalies compared to his historical baseline of 3 years. He is currently working outside designated trading hours and has established persistent database reads containing foreign asset data, followed by local file exfiltration vectors on unauthorized storage media.',
    anomaliesCount: 5
  };

  const priya: Employee = {
    id: 'EMP002',
    name: 'Meenakshi Sundaram',
    email: 'meenakshi.sundaram@securemind.bank',
    role: 'Database Administrator',
    department: 'IT & Cybersecurity',
    trustScore: 24,
    predictionRisk: 84,
    status: 'online',
    baselineWorkingHours: { start: '09:00', end: '18:00' },
    currentWorkingHours: { start: '09:00', end: '23:30' },
    driftScore: 61,
    behaviorDNA: [
      'Elevated Administrative Privileges request',
      'System Audit Logging daemon termination',
      'Access to HR Salary database tables',
      'Unusual command-line scripts execution'
    ],
    weeklyPattern: [8, 12, 28, 55, 78, 84, 84],
    monthlyPattern: [12, 22, 45, 84],
    recentLogs: [
      {
        id: 'L201',
        timestamp: getPastDateString(1),
        category: 'privilege',
        description: 'Successfully requested root administrative access bypass for DB-PROD-RETAIL-01',
        severity: 'high',
        anomaly: true
      },
      {
        id: 'L202',
        timestamp: getPastDateString(5),
        category: 'network',
        description: 'Daemon process syslogd terminated on production SQL server',
        severity: 'high',
        anomaly: true
      },
      {
        id: 'L203',
        timestamp: getPastDateString(18),
        category: 'database',
        description: 'Select query executed on table HR_SALARIES_CONFIDENTIAL containing executive payroll',
        severity: 'high',
        anomaly: true
      },
      {
        id: 'L204',
        timestamp: getPastDateString(24),
        category: 'login',
        description: 'Login from secondary IT workstation WS-SEC-09 during off-shifts',
        severity: 'medium',
        anomaly: true
      }
    ],
    aiTwinSummary: 'Meenakshi\'s Digital Twin indicates zero direct history of DB audit logs modification or access to core HR payroll systems. Her current privilege escalation behavior represents a highly anomalous pattern indicative of a possible IT administrative threat or credential compromise.',
    anomaliesCount: 4
  };

  const amit: Employee = {
    id: 'EMP003',
    name: 'Senthil Kumar',
    email: 'senthil.kumar@securemind.bank',
    role: 'Branch Manager',
    department: 'Retail Banking',
    trustScore: 31,
    predictionRisk: 76,
    status: 'offline',
    baselineWorkingHours: { start: '09:00', end: '18:00' },
    currentWorkingHours: { start: '08:00', end: '19:15' },
    driftScore: 48,
    behaviorDNA: [
      'Account balance limits modification requests',
      'Unauthorized customer KYC edits',
      'Frequent access to inactive savings accounts',
      'Repeated invalid supervisor override codes input'
    ],
    weeklyPattern: [15, 20, 25, 45, 60, 70, 76],
    monthlyPattern: [18, 28, 48, 76],
    recentLogs: [
      {
        id: 'L301',
        timestamp: getPastDateString(8),
        category: 'privilege',
        description: 'Attempted account balance limit bypass for transaction value > ₹10,00,000 without dual authorizations',
        severity: 'high',
        anomaly: true
      },
      {
        id: 'L302',
        timestamp: getPastDateString(14),
        category: 'database',
        description: 'Modified dormant user record details for Account #9832174620 (Inactive for 480 days)',
        severity: 'high',
        anomaly: true
      },
      {
        id: 'L303',
        timestamp: getPastDateString(36),
        category: 'login',
        description: 'Repeated overrides attempts using supervisor credentials on retail branch portal',
        severity: 'medium',
        anomaly: true
      }
    ],
    aiTwinSummary: 'Senthil is exhibiting high-risk procedural bypass indicators. Digital Twin baselines show strict conformance to dual-authorization protocols in Retail Banking. The current pattern of modification on inactive savings balances is flag-worthy and deviates significantly from standard branch branch operations.',
    anomaliesCount: 3
  };

  employees.push(rajesh, priya, amit);

  // Generate 97 other random employees with realistic fields
  for (let i = 4; i <= 100; i++) {
    const fIdx = Math.floor(random() * firstNames.length);
    const lIdx = Math.floor(random() * lastNames.length);
    const dIdx = Math.floor(random() * departments.length);
    
    const name = `${firstNames[fIdx]} ${lastNames[lIdx]}`;
    // Deduplicate names to avoid exact matches
    const emailName = name.toLowerCase().replace(' ', '.');
    const email = `${emailName}@securemind.bank`;
    const department = departments[dIdx];
    const roles = rolesByDept[department];
    const role = roles[Math.floor(random() * roles.length)];
    
    // Most employees have high trust (80-98) and low prediction risk (2-15)
    // A few have moderate deviations
    const isMediumRisk = random() < 0.08; // 8% chance of medium risk
    
    let trustScore, predictionRisk, driftScore;
    if (isMediumRisk) {
      trustScore = Math.floor(45 + random() * 20); // 45-65
      predictionRisk = Math.floor(40 + random() * 25); // 40-65
      driftScore = Math.floor(30 + random() * 25); // 30-55%
    } else {
      trustScore = Math.floor(82 + random() * 16); // 82-98
      predictionRisk = Math.floor(2 + random() * 12); // 2-14
      driftScore = Math.floor(2 + random() * 12); // 2-14%
    }

    const status = random() > 0.4 ? 'online' : 'offline';
    const baseline = workingHoursBaselines[Math.floor(random() * workingHoursBaselines.length)];
    
    // Calculate current working hours based on risk
    let currentHours = { ...baseline };
    if (isMediumRisk) {
      // Shift hours slightly
      const startHour = parseInt(baseline.start.split(':')[0]);
      const endHour = parseInt(baseline.end.split(':')[0]);
      currentHours = {
        start: `${String(startHour - 2).padStart(2, '0')}:15`,
        end: `${String(endHour + 2).padStart(2, '0')}:45`
      };
    }

    // Generate weekly patterns
    const weeklyPattern: number[] = [];
    let curRisk = predictionRisk;
    for (let w = 0; w < 7; w++) {
      curRisk = Math.max(2, Math.min(99, curRisk + Math.floor((random() - 0.5) * 8)));
      weeklyPattern.push(curRisk);
    }
    weeklyPattern[6] = predictionRisk; // Ensure last match is actual current risk

    const monthlyPattern = [
      Math.max(2, predictionRisk - 20),
      Math.max(2, predictionRisk - 10),
      Math.max(2, predictionRisk - 5),
      predictionRisk
    ];

    // Behavior DNA tags
    const dnaOptions = [
      'Standard Desktop Apps usage',
      'Normal Login Hours baseline',
      'Database Query Limit normal',
      'Local Storage compliance',
      'Network traffic threshold healthy',
      'Corporate VPN matching baseline',
      'Single device authentication matching'
    ];
    
    const behaviorDNA: string[] = [];
    if (isMediumRisk) {
      behaviorDNA.push('Unusual Off-hours File Access');
      behaviorDNA.push('Multi-Device Access attempt');
      behaviorDNA.push('Minor Database Over-querying');
    } else {
      behaviorDNA.push(dnaOptions[0], dnaOptions[1], dnaOptions[2]);
    }

    // Dynamic recent logs
    const recentLogs: ActivityLog[] = [];
    let anomaliesCount = 0;
    
    if (isMediumRisk) {
      recentLogs.push({
        id: `L${i}01`,
        timestamp: getPastDateString(12),
        category: 'file',
        description: 'Accessed unusual department folder (Corporate Legal Archive)',
        severity: 'medium',
        anomaly: true
      });
      recentLogs.push({
        id: `L${i}02`,
        timestamp: getPastDateString(22),
        category: 'login',
        description: 'Login from remote location outside of registered employee home network region',
        severity: 'medium',
        anomaly: true
      });
      anomaliesCount = 2;
    } else {
      recentLogs.push({
        id: `L${i}01`,
        timestamp: getPastDateString(3),
        category: 'login',
        description: 'Successful authentication on Active Directory client',
        severity: 'low',
        anomaly: false
      });
      recentLogs.push({
        id: `L${i}02`,
        timestamp: getPastDateString(26),
        category: 'network',
        description: 'Connected securely to internal retail proxy node',
        severity: 'low',
        anomaly: false
      });
    }

    const aiTwinSummary = isMediumRisk
      ? `${name}'s baseline working hours show minor shift deviations, coupled with file access queries outside their primary role. Behavior drift is moderate and security parameters are elevated.`
      : `${name}'s digital twin shows perfect compliance with baseline working hours, file downloading ratios, and database queries. Behavior is highly consistent, posing no current security concern.`;

    employees.push({
      id: `EMP${String(i).padStart(3, '0')}`,
      name,
      email,
      role,
      department,
      trustScore,
      predictionRisk,
      status,
      baselineWorkingHours: baseline,
      currentWorkingHours: currentHours,
      driftScore,
      behaviorDNA,
      weeklyPattern,
      monthlyPattern,
      recentLogs,
      aiTwinSummary,
      anomaliesCount
    });
  }

  // Generate Predictions list (only active threats)
  const predictions: Prediction[] = [
    {
      id: 'PRD001',
      employeeId: 'EMP001',
      employeeName: 'Karthikeyan Balaji',
      role: 'Fixed Income Trader',
      department: 'Treasury & Markets',
      probability: 92,
      confidence: 95,
      timeWindow: 'Next 24 Hours',
      attackType: 'Data Theft & Exfiltration',
      businessImpact: 'Critical',
      explainableAI: [
        'Logged in outside normal working hours (03:15 AM vs 08:30 AM baseline)',
        'Accessed TREASURY_LEDGER database containing highly confidential bond rates',
        'Downloaded 1,450 files (7800% increase over daily baseline)',
        'Connected external flash storage (Cruzer USB) to download folder directory'
      ],
      status: 'active',
      detectedAt: getPastDateString(2)
    },
    {
      id: 'PRD002',
      employeeId: 'EMP002',
      employeeName: 'Meenakshi Sundaram',
      role: 'Database Administrator',
      department: 'IT & Cybersecurity',
      probability: 84,
      confidence: 89,
      timeWindow: 'Next 48 Hours',
      attackType: 'Privilege Abuse & Security Sabotage',
      businessImpact: 'Critical',
      explainableAI: [
        'Attempted to override standard administrator access controls on production retail database server',
        'Manually terminated syslogd logger process daemon, obscuring further network telemetry',
        'Queried payroll metadata values including salary schedules of executives',
        'Executed custom non-standard terminal scripts bypass tool'
      ],
      status: 'investigating',
      detectedAt: getPastDateString(1)
    },
    {
      id: 'PRD003',
      employeeId: 'EMP003',
      employeeName: 'Senthil Kumar',
      role: 'Branch Manager',
      department: 'Retail Banking',
      probability: 76,
      confidence: 82,
      timeWindow: 'Next 3 Days',
      attackType: 'Financial Fraud & Unauthorized Override',
      businessImpact: 'High',
      explainableAI: [
        'Attempted transaction balance limit override overrides above individual branch thresholds',
        'Accessed inactive savings accounts records (dormant account profile lookup)',
        'Bypassed dual-auth security policies using cached single-manager credentials'
      ],
      status: 'active',
      detectedAt: getPastDateString(8)
    }
  ];

  // Also include a few medium prediction flags
  const mediumRiskEmployees = employees.filter(e => e.predictionRisk >= 40 && e.predictionRisk <= 65);
  mediumRiskEmployees.forEach((emp, index) => {
    predictions.push({
      id: `PRD${String(index + 4).padStart(3, '0')}`,
      employeeId: emp.id,
      employeeName: emp.name,
      role: emp.role,
      department: emp.department,
      probability: emp.predictionRisk,
      confidence: Math.floor(70 + (emp.predictionRisk % 10)),
      timeWindow: 'Next 7 Days',
      attackType: 'Unauthorized Folder Traversal',
      businessImpact: 'Medium',
      explainableAI: [
        'Behavior drift exceeded acceptable baseline parameters (Working hours shifting by +4 hours)',
        'Traversed and downloaded legal files of non-departmental assets',
        'Accessed systems from residential ISP IP addresses never used by employee in the past'
      ],
      status: 'active',
      detectedAt: getPastDateString(12)
    });
  });

  // Investigation cases mapping
  const investigations: InvestigationCase[] = [
    {
      id: 'CASE-2026-001',
      employeeId: 'EMP001',
      employeeName: 'Karthikeyan Balaji',
      role: 'Fixed Income Trader',
      department: 'Treasury & Markets',
      severity: 'high',
      status: 'open',
      assignedTo: 'Abirami Ganesan (SOC Manager)',
      createdAt: getPastDateString(2),
      description: 'Suspicious activities pointing to potential bulk client portfolio theft and unauthorized media interface.',
      evidence: [
        'Device telemetry showing Cruzer USB connection ID: DEV_4591_USB',
        'DB Log transaction hash indicating TREASURY_LEDGER read queries matching 1,450 asset lists',
        'System activity report: ws-trd-45 data transfer metrics'
      ],
      aiExplanation: 'The AI twin indicates a 78% behavior deviation. The combination of off-hours database ledger reading, unauthorized local drive connections, and download spikes is a 92% match for malicious data exfiltration ahead of potential competitive departure.',
      timeline: rajesh.recentLogs,
      notes: [
        'SOC Analyst notified. Employee workstation isolation requested pending verification.',
        'Escalated to Treasury compliance manager to verify if this download was authorized.'
      ]
    },
    {
      id: 'CASE-2026-002',
      employeeId: 'EMP002',
      employeeName: 'Meenakshi Sundaram',
      role: 'Database Administrator',
      department: 'IT & Cybersecurity',
      severity: 'high',
      status: 'under_review',
      assignedTo: 'Balaji Varadhan (Senior Security Analyst)',
      createdAt: getPastDateString(1),
      description: 'Root bypass audit anomaly, audit logging termination and queries into executive payroll tables.',
      evidence: [
        'System log daemon crash timestamp matching user priya.sharma root privileges request',
        'SQL query log: SELECT FROM HR_SALARIES_CONFIDENTIAL'
      ],
      aiExplanation: 'The user requested root authorization bypass outside change management windows. Immediately following, the local logging daemon syslogd was terminated manually, preventing remote recording. This is a behavior drift profile indicating a credential takeover or high-level admin insider threat.',
      timeline: priya.recentLogs,
      notes: [
        'Account credentials frozen as temporary preventive measure.',
        'Spoke with Meenakshi\'s supervisor; no scheduled database system maintenance was planned for database server.'
      ]
    }
  ];

  return {
    employees,
    predictions,
    investigations
  };
};

export const getLiveActivities = () => {
  return [
    { id: 1, time: 'Just now', type: 'usb', name: 'Karthikeyan Balaji', msg: 'Connected Cruzer USB flash storage', severity: 'high' },
    { id: 2, time: '5 mins ago', type: 'file', name: 'Karthikeyan Balaji', msg: 'Downloaded 1,450 Treasury Ledger Excel files', severity: 'high' },
    { id: 3, time: '12 mins ago', type: 'privilege', name: 'Meenakshi Sundaram', msg: 'Bypassed sudo admin verification for production SQL', severity: 'high' },
    { id: 4, time: '25 mins ago', type: 'network', name: 'Meenakshi Sundaram', msg: 'Terminated syslogd logs service daemon', severity: 'high' },
    { id: 5, time: '1 hour ago', type: 'database', name: 'Senthil Kumar', msg: 'Queried dormant account ledger balance details', severity: 'medium' },
    { id: 6, time: '2 hours ago', type: 'login', name: 'Karthikeyan Balaji', msg: 'VPN Login from unusual subnet IP 103.45.12.89', severity: 'medium' },
    { id: 7, time: '3 hours ago', type: 'login', name: 'Jennifer Rao', msg: 'Standard remote VPN session established successfully', severity: 'low' },
    { id: 8, time: '4 hours ago', type: 'database', name: 'Michael Mehta', msg: 'Began query sequence on Wealth Management assets', severity: 'low' }
  ];
};

export const getDepartmentMetrics = () => {
  return [
    { name: 'Treasury & Markets', risk: 85, trust: 62, employees: 12, predictedThreats: 1 },
    { name: 'Wealth Management', risk: 38, trust: 81, employees: 18, predictedThreats: 1 },
    { name: 'Retail Banking', risk: 42, trust: 79, employees: 25, predictedThreats: 1 },
    { name: 'IT & Cybersecurity', risk: 65, trust: 74, employees: 8, predictedThreats: 1 },
    { name: 'Operations', risk: 14, trust: 92, employees: 20, predictedThreats: 0 },
    { name: 'Legal & Compliance', risk: 8, trust: 95, employees: 10, predictedThreats: 0 },
    { name: 'Human Resources', risk: 12, trust: 94, employees: 7, predictedThreats: 0 }
  ];
};

export const getDailyInsights = () => {
  return [
    {
      id: 1,
      title: 'Treasury Department Alert',
      desc: 'Significant behavior drift detected in Treasury & Markets. Off-hours activity has surged by 450% compared to monthly average baselines.',
      severity: 'high'
    },
    {
      id: 2,
      title: 'IT Privilege Escalation Risk',
      desc: 'Production database system logging was disabled by an admin account outside of authorized change control windows. Investigation recommended.',
      severity: 'high'
    },
    {
      id: 3,
      title: 'Organizational Trust Score',
      desc: 'The firm-wide Behavior Trust Score is at 84.7%. Moderate risk elevations are isolated to 3 specific high-privilege employee accounts.',
      severity: 'medium'
    }
  ];
};

export const copilotInference = (message: string, employeesList: Employee[], predictionsList: Prediction[]): { response: string; references?: string[] } => {
  const query = message.toLowerCase();
  
  if (query.includes('rajesh') || query.includes('kumar') || query.includes('emp001')) {
    return {
      response: `**Karthikeyan Balaji (Fixed Income Trader, Treasury & Markets) - Insider Threat Profile:**

* **Current Status:** High Risk Alert (92% Risk Probability).
* **AI Twin Baseline Deviations:**
  * **Working Hours:** Karthikeyan normally logs in between 08:30 AM and 17:30 PM. Today, he logged in via remote VPN at **03:15 AM** (78% working hours drift).
  * **Database Querying:** Accessed the secure table \`TREASURY_LEDGER\` outside standard dealing hours.
  * **Data Exfiltration Vector:** Downloaded 1,450 files containing confidential client portfolios (an 7800% increase over his daily file download baseline of 18 files).
  * **Media Interface:** Connected an unauthorized Cruzer USB drive (DEV_4591_USB) to transfer the downloaded data.

**Recommended Actions:**
1. Temporarily freeze Karthikeyan Balaji's Active Directory and trading credentials.
2. Quarantine his workstation WS-TRD-45 from the internal trading VLAN.
3. Schedule an immediate executive security audit review with the Treasury compliance director.`,
      references: ['Karthikeyan Balaji Profile', 'Case CASE-2026-001', 'Threat Prediction PRD001']
    };
  }
  
  if (query.includes('priya') || query.includes('sharma') || query.includes('emp002')) {
    return {
      response: `**Meenakshi Sundaram (Database Administrator, IT & Cybersecurity) - Insider Threat Profile:**

* **Current Status:** Critical Alert (84% Risk Probability).
* **AI Twin Baseline Deviations:**
  * **Privilege Escalation:** Meenakshi requested emergency administrative bypass on server \`DB-PROD-RETAIL-01\` outside standard Change Advisory Board (CAB) windows.
  * **Audit Evasion:** Terminated the core auditing service daemon (\`syslogd\`) on the database server, masking subsequent SQL queries.
  * **Target Assets:** Audits show read commands executed on the \`HR_SALARIES_CONFIDENTIAL\` database.

**Recommended Actions:**
1. Revoke temporary root bypass permissions immediately.
2. Force credential rotation for database administrator accounts on the retail server.
3. Automatically restart the database logging daemon remotely.`,
      references: ['Meenakshi Sundaram Profile', 'Case CASE-2026-002', 'Threat Prediction PRD002']
    };
  }

  if (query.includes('summarize') || query.includes('today') || query.includes('predictions')) {
    return {
      response: `**Summary of Threat Predictions for Today (July 16, 2026):**

We have detected **3 critical behavioral anomalies** matching high-risk insider threat categories:
1. **Karthikeyan Balaji (Treasury)**: 92% probability of *Data Theft & Exfiltration*. Active exfiltration on USB detected.
2. **Meenakshi Sundaram (IT & Security)**: 84% probability of *Privilege Abuse & Security Sabotage*. Database logging service was manual disabled.
3. **Senthil Kumar (Retail Banking)**: 76% probability of *Financial Fraud & Procedural Overrides*. Attempting account limits modifications on dormant portfolios.

Overall, department-level drift shows Treasury & Markets is the most anomalous unit (85% risk index) followed by IT (65% risk index).`,
      references: ['Predictions Feed', 'Department Analytics', 'Executive Security Score']
    };
  }

  if (query.includes('action') || query.includes('recommend') || query.includes('preventive')) {
    return {
      response: `**System-wide Automated Preventive Recommendations:**

1. **Deploy Auto-Isolation Rules:** For employees exceeding 85% prediction risk with active exfiltration indicators (e.g., Karthikeyan Balaji), immediately trigger temporary endpoint network containment.
2. **Lock Audit Evasion Paths:** Implement active file integrity monitoring (FIM) and prevent local termination of system loggers (\`syslogd\`) on SQL production databases.
3. **Dual-Authorization Enforcement:** Restrict Branch Managers (e.g., Senthil Kumar) from modifying transaction limits or viewing dormant accounts without a secondary Compliance Officer approval.`,
      references: ['Settings: Sensitivity Thresholds', 'Investigation Playbook', 'Compliance Audit Logs']
    };
  }

  return {
    response: `Hello. I am the **SecureMind AI Security Copilot**. I analyze real-time behavior drift against historical Digital Twin baselines to help you secure the bank.

You can ask me questions such as:
* *"Why is Karthikeyan Balaji high risk?"*
* *"Summarize today's active threat predictions"*
* *"Recommend preventive actions for the database administrator threat"*
* *"Generate an investigation executive summary"*

How can I assist you with behavioral risk analysis today?`,
    references: ['User Manual', 'Baseline Documentation', 'Security Playbooks']
  };
};
