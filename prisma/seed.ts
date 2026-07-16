import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});
const prisma = new PrismaClient({ adapter });

// Helper to generate deterministic dates relative to current time
const getPastDate = (hoursAgo: number) => {
  const d = new Date();
  d.setHours(d.getHours() - hoursAgo);
  return d;
};

const firstNames = [
  'Rajesh', 'Priya', 'Amit', 'Ananya', 'Sanjay', 'Sunita', 'Vikram', 'Deepika', 'Arjun', 'Meera',
  'Vijay', 'Kavita', 'Rohan', 'Neha', 'Aditya', 'Pooja', 'Rahul', 'Divya', 'Suresh', 'Swati',
  'Manish', 'Kiran', 'Abhishek', 'Shalini', 'Gaurav', 'Ritu', 'Karthik', 'Aishwarya', 'Nikhil', 'Sneha',
  'Pranav', 'Harini', 'Ramesh', 'Shruti', 'Alok', 'Tanuja', 'Sandeep', 'Jyoti', 'Varun', 'Preeti',
  'Manoj', 'Aarti', 'Anil', 'Nisha', 'Dev', 'Rashmi', 'Vivek', 'Pallavi', 'Sachin', 'Payal'
];

const lastNames = [
  'Kumar', 'Sharma', 'Patel', 'Rao', 'Mehta', 'Singh', 'Joshi', 'Nair', 'Gupta', 'Verma',
  'Reddy', 'Iyer', 'Sen', 'Das', 'Choudhury', 'Bose', 'Pillai', 'Mishra', 'Trivedi', 'Bahl',
  'Dubey', 'Shetty', 'Saxena', 'Kapoor', 'Menon', 'Prasad', 'Banerjee', 'Bhat', 'Deshmukh', 'Kulkarni',
  'Rana', 'Srinivasan', 'Johar', 'Venkatesh', 'Pandey', 'Gopal', 'Natarajan', 'Subramanian', 'Malhotra', 'Aggarwal',
  'Chawla', 'Mahajan', 'Grover', 'Sood', 'Bhalla', 'Kaul', 'Dhar', 'Roy', 'Mukherjee', 'Chatterjee'
];

const deptNames = [
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

// Seeded pseudo-random generator
function createRandom(seed: number) {
  return function() {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
}

async function main() {
  console.log('Clearing existing database records...');
  await prisma.auditLog.deleteMany();
  await prisma.aIRecommendation.deleteMany();
  await prisma.threatAlert.deleteMany();
  await prisma.investigationReport.deleteMany();
  await prisma.riskPrediction.deleteMany();
  await prisma.digitalTwinProfile.deleteMany();
  await prisma.employeeActivity.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.department.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding authentication users...');
  const users = [
    { name: 'Anjali Gupta', email: 'anjali.gupta@securemind.bank', password: 'password', role: 'SOC Analyst' },
    { name: 'Admin User', email: 'admin@securemind.bank', password: 'password', role: 'Admin' },
    { name: 'Security Manager', email: 'manager@securemind.bank', password: 'password', role: 'Security Manager' },
    { name: 'Compliance Officer', email: 'compliance@securemind.bank', password: 'password', role: 'Compliance Officer' },
    { name: 'Executive CISO', email: 'executive@securemind.bank', password: 'password', role: 'Executive' }
  ];
  
  for (const u of users) {
    await prisma.user.create({ data: u });
  }

  console.log('Seeding departments...');
  const deptMap: Record<string, any> = {};
  
  const deptSeeds = [
    { name: 'Treasury & Markets', riskScore: 85, trustScore: 62 },
    { name: 'Wealth Management', riskScore: 38, trustScore: 81 },
    { name: 'Retail Banking', riskScore: 42, trustScore: 79 },
    { name: 'IT & Cybersecurity', riskScore: 65, trustScore: 74 },
    { name: 'Operations', riskScore: 14, trustScore: 92 },
    { name: 'Legal & Compliance', riskScore: 8, trustScore: 95 },
    { name: 'Human Resources', riskScore: 12, trustScore: 94 }
  ];

  for (const ds of deptSeeds) {
    const dept = await prisma.department.create({ data: ds });
    deptMap[ds.name] = dept;
  }

  console.log('Seeding employees directory...');
  const random = createRandom(42);

  // 1. Rajesh Kumar
  const e1 = await prisma.employee.create({
    data: {
      id: 'EMP001',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@securemind.bank',
      role: 'Fixed Income Trader',
      departmentId: deptMap['Treasury & Markets'].id,
      status: 'online',
      baselineStart: '08:30',
      baselineEnd: '17:30',
      currentStart: '03:15',
      currentEnd: '22:45',
      driftScore: 78,
      trustScore: 18,
      predictionRisk: 92,
      aiTwinSummary: "Rajesh's behavior exhibits extreme anomalies compared to his historical baseline of 3 years. He is currently working outside designated trading hours and has established database query reads containing asset ledgers, followed by local file exfiltration vectors on unauthorized storage media.",
      anomaliesCount: 5
    }
  });

  // Rajesh profile DNA
  await prisma.digitalTwinProfile.create({
    data: {
      employeeId: e1.id,
      behaviorDNA: JSON.stringify([
        'High Trading Volume Threshold Exceeded',
        'Off-hours Database Queries',
        'Mass Download of Confidential Yield Sheets',
        'Unauthorized USB Connection detected'
      ]),
      weeklyPattern: JSON.stringify([10, 15, 30, 60, 92, 85, 92]),
      monthlyPattern: JSON.stringify([20, 35, 65, 92])
    }
  });

  // Rajesh logs
  const logs1 = [
    { timestamp: getPastDate(2), category: 'usb', description: 'Unauthorized storage device (Cruzer USB 64GB) connected to workstation WS-TRD-45', severity: 'high', anomaly: true },
    { timestamp: getPastDate(4), category: 'file', description: 'Mass download (1,450 records) of treasury bond client data sheet from secure repository', severity: 'high', anomaly: true },
    { timestamp: getPastDate(7), category: 'database', description: 'Read query to confidential TREASURY_LEDGER table executed at 03:22 AM', severity: 'high', anomaly: true },
    { timestamp: getPastDate(28), category: 'login', description: 'Remote VPN Login from unusual subnet IP 103.45.12.89 at 03:15 AM', severity: 'medium', anomaly: true },
    { timestamp: getPastDate(32), category: 'network', description: 'Port scanning attempt detected from local terminal WS-TRD-45', severity: 'medium', anomaly: true }
  ];
  for (const log of logs1) {
    await prisma.employeeActivity.create({ data: { employeeId: e1.id, ...log } });
  }

  // 2. Priya Sharma
  const e2 = await prisma.employee.create({
    data: {
      id: 'EMP002',
      name: 'Priya Sharma',
      email: 'priya.sharma@securemind.bank',
      role: 'Database Administrator',
      departmentId: deptMap['IT & Cybersecurity'].id,
      status: 'online',
      baselineStart: '09:00',
      baselineEnd: '18:00',
      currentStart: '09:00',
      currentEnd: '23:30',
      driftScore: 61,
      trustScore: 24,
      predictionRisk: 84,
      aiTwinSummary: "Priya's Digital Twin indicates zero direct history of DB audit logs modification or access to core HR payroll systems. Her current privilege escalation behavior represents a highly anomalous pattern indicative of a possible IT administrative threat or credential compromise.",
      anomaliesCount: 4
    }
  });

  await prisma.digitalTwinProfile.create({
    data: {
      employeeId: e2.id,
      behaviorDNA: JSON.stringify([
        'Elevated Administrative Privileges request',
        'System Audit Logging daemon termination',
        'Access to HR Salary database tables',
        'Unusual command-line scripts execution'
      ]),
      weeklyPattern: JSON.stringify([8, 12, 28, 55, 78, 84, 84]),
      monthlyPattern: JSON.stringify([12, 22, 45, 84])
    }
  });

  const logs2 = [
    { timestamp: getPastDate(1), category: 'privilege', description: 'Successfully requested root administrative access bypass for DB-PROD-RETAIL-01', severity: 'high', anomaly: true },
    { timestamp: getPastDate(5), category: 'network', description: 'Daemon process syslogd terminated on production SQL server', severity: 'high', anomaly: true },
    { timestamp: getPastDate(18), category: 'database', description: 'Select query executed on table HR_SALARIES_CONFIDENTIAL containing executive payroll', severity: 'high', anomaly: true },
    { timestamp: getPastDate(24), category: 'login', description: 'Login from secondary IT workstation WS-SEC-09 during off-shifts', severity: 'medium', anomaly: true }
  ];
  for (const log of logs2) {
    await prisma.employeeActivity.create({ data: { employeeId: e2.id, ...log } });
  }

  // 3. Amit Patel
  const e3 = await prisma.employee.create({
    data: {
      id: 'EMP003',
      name: 'Amit Patel',
      email: 'amit.patel@securemind.bank',
      role: 'Branch Manager',
      departmentId: deptMap['Retail Banking'].id,
      status: 'offline',
      baselineStart: '09:00',
      baselineEnd: '18:00',
      currentStart: '08:00',
      currentEnd: '19:15',
      driftScore: 48,
      trustScore: 31,
      predictionRisk: 76,
      aiTwinSummary: "Amit is exhibiting high-risk procedural bypass indicators. Digital Twin baselines show strict conformance to dual-authorization protocols in Retail Banking. The current pattern of modification on inactive savings balances is flag-worthy and deviates significantly from standard branch operations.",
      anomaliesCount: 3
    }
  });

  await prisma.digitalTwinProfile.create({
    data: {
      employeeId: e3.id,
      behaviorDNA: JSON.stringify([
        'Account balance limits modification requests',
        'Unauthorized customer KYC edits',
        'Frequent access to inactive savings accounts',
        'Repeated invalid supervisor override codes input'
      ]),
      weeklyPattern: JSON.stringify([15, 20, 25, 45, 60, 70, 76]),
      monthlyPattern: JSON.stringify([18, 28, 48, 76])
    }
  });

  const logs3 = [
    { timestamp: getPastDate(8), category: 'privilege', description: 'Attempted account balance limit bypass for transaction value > ₹10,00,000 without dual authorizations', severity: 'high', anomaly: true },
    { timestamp: getPastDate(14), category: 'database', description: 'Modified dormant user record details for Account #9832174620 (Inactive for 480 days)', severity: 'high', anomaly: true },
    { timestamp: getPastDate(36), category: 'login', description: 'Repeated overrides attempts using supervisor credentials on retail branch portal', severity: 'medium', anomaly: true }
  ];
  for (const log of logs3) {
    await prisma.employeeActivity.create({ data: { employeeId: e3.id, ...log } });
  }

  // Generate 97 other dynamic employees
  for (let i = 4; i <= 100; i++) {
    const fIdx = Math.floor(random() * firstNames.length);
    const lIdx = Math.floor(random() * lastNames.length);
    const dIdx = Math.floor(random() * deptNames.length);
    
    const name = `${firstNames[fIdx]} ${lastNames[lIdx]}`;
    const emailName = name.toLowerCase().replace(' ', '.');
    const email = `${emailName}@securemind.bank`;
    const departmentName = deptNames[dIdx];
    const dept = deptMap[departmentName];
    const roles = rolesByDept[departmentName];
    const role = roles[Math.floor(random() * roles.length)];
    
    const isMediumRisk = random() < 0.08;
    
    let trustScore, predictionRisk, driftScore;
    if (isMediumRisk) {
      trustScore = Math.floor(45 + random() * 20);
      predictionRisk = Math.floor(40 + random() * 25);
      driftScore = Math.floor(30 + random() * 25);
    } else {
      trustScore = Math.floor(82 + random() * 16);
      predictionRisk = Math.floor(2 + random() * 12);
      driftScore = Math.floor(2 + random() * 12);
    }

    const status = random() > 0.4 ? 'online' : 'offline';
    const baseline = workingHoursBaselines[Math.floor(random() * workingHoursBaselines.length)];
    
    let currentHours = { ...baseline };
    if (isMediumRisk) {
      const startHour = parseInt(baseline.start.split(':')[0]);
      const endHour = parseInt(baseline.end.split(':')[0]);
      currentHours = {
        start: `${String(startHour - 2).padStart(2, '0')}:15`,
        end: `${String(endHour + 2).padStart(2, '0')}:45`
      };
    }

    const weeklyPattern: number[] = [];
    let curRisk = predictionRisk;
    for (let w = 0; w < 7; w++) {
      curRisk = Math.max(2, Math.min(99, curRisk + Math.floor((random() - 0.5) * 8)));
      weeklyPattern.push(curRisk);
    }
    weeklyPattern[6] = predictionRisk;

    const monthlyPattern = [
      Math.max(2, predictionRisk - 20),
      Math.max(2, predictionRisk - 10),
      Math.max(2, predictionRisk - 5),
      predictionRisk
    ];

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
      behaviorDNA.push('Unusual Off-hours File Access', 'Multi-Device Access attempt', 'Minor Database Over-querying');
    } else {
      behaviorDNA.push(dnaOptions[0], dnaOptions[1], dnaOptions[2]);
    }

    const anomaliesCount = isMediumRisk ? 2 : 0;
    const aiTwinSummary = isMediumRisk
      ? `${name}'s baseline working hours show minor shift deviations, coupled with file access queries outside their primary role. Behavior drift is moderate and security parameters are elevated.`
      : `${name}'s digital twin shows perfect compliance with baseline working hours, file downloading ratios, and database queries. Behavior is highly consistent, posing no current security concern.`;

    const empObj = await prisma.employee.create({
      data: {
        id: `EMP${String(i).padStart(3, '0')}`,
        name,
        email,
        role,
        departmentId: dept.id,
        status,
        baselineStart: baseline.start,
        baselineEnd: baseline.end,
        currentStart: currentHours.start,
        currentEnd: currentHours.end,
        driftScore,
        trustScore,
        predictionRisk,
        aiTwinSummary,
        anomaliesCount
      }
    });

    await prisma.digitalTwinProfile.create({
      data: {
        employeeId: empObj.id,
        behaviorDNA: JSON.stringify(behaviorDNA),
        weeklyPattern: JSON.stringify(weeklyPattern),
        monthlyPattern: JSON.stringify(monthlyPattern)
      }
    });

    // Seed activities
    if (isMediumRisk) {
      await prisma.employeeActivity.create({
        data: {
          employeeId: empObj.id,
          timestamp: getPastDate(12),
          category: 'file',
          description: 'Accessed unusual department folder (Corporate Legal Archive)',
          severity: 'medium',
          anomaly: true
        }
      });
      await prisma.employeeActivity.create({
        data: {
          employeeId: empObj.id,
          timestamp: getPastDate(22),
          category: 'login',
          description: 'Login from remote location outside of registered employee home network region',
          severity: 'medium',
          anomaly: true
        }
      });
    } else {
      await prisma.employeeActivity.create({
        data: {
          employeeId: empObj.id,
          timestamp: getPastDate(3),
          category: 'login',
          description: 'Successful authentication on Active Directory client',
          severity: 'low',
          anomaly: false
        }
      });
    }
  }

  console.log('Seeding risk predictions table...');
  const predSeeds = [
    {
      id: 'PRD001',
      employeeId: 'EMP001',
      probability: 92,
      confidence: 95,
      timeWindow: 'Next 24 Hours',
      attackType: 'Data Theft & Exfiltration',
      businessImpact: 'Critical',
      explainableAI: JSON.stringify([
        'Logged in outside normal working hours (03:15 AM vs 08:30 AM baseline)',
        'Accessed TREASURY_LEDGER database containing highly confidential bond rates',
        'Downloaded 1,450 files (7800% increase over daily baseline)',
        'Connected external flash storage (Cruzer USB) to download folder directory'
      ]),
      status: 'active',
      detectedAt: getPastDate(2)
    },
    {
      id: 'PRD002',
      employeeId: 'EMP002',
      probability: 84,
      confidence: 89,
      timeWindow: 'Next 48 Hours',
      attackType: 'Privilege Abuse & Security Sabotage',
      businessImpact: 'Critical',
      explainableAI: JSON.stringify([
        'Attempted to override standard administrator access controls on production retail database server',
        'Manually terminated syslogd logger process daemon, obscuring further network telemetry',
        'Queried payroll metadata values including salary schedules of executives',
        'Executed custom non-standard terminal scripts bypass tool'
      ]),
      status: 'active',
      detectedAt: getPastDate(1)
    },
    {
      id: 'PRD003',
      employeeId: 'EMP003',
      probability: 76,
      confidence: 82,
      timeWindow: 'Next 3 Days',
      attackType: 'Financial Fraud & Override Abuse',
      businessImpact: 'High',
      explainableAI: JSON.stringify([
        'Attempted transaction balance limit override overrides above individual branch thresholds',
        'Accessed inactive savings accounts records (dormant account profile lookup)',
        'Bypassed dual-auth security policies using cached single-manager credentials'
      ]),
      status: 'active',
      detectedAt: getPastDate(8)
    }
  ];

  for (const ps of predSeeds) {
    await prisma.riskPrediction.create({ data: ps });
  }

  console.log('Seeding SOC cases/investigation reports...');
  const caseSeeds = [
    {
      id: 'CASE-2026-001',
      employeeId: 'EMP001',
      severity: 'high',
      status: 'open',
      assignedTo: 'Anjali Gupta (SOC Manager)',
      createdAt: getPastDate(2),
      description: 'Suspicious activities pointing to potential bulk client portfolio theft and unauthorized media interface.',
      evidence: JSON.stringify([
        'Device telemetry showing Cruzer USB connection ID: DEV_4591_USB',
        'DB Log transaction hash indicating TREASURY_LEDGER read queries matching 1,450 asset lists',
        'System activity report: ws-trd-45 data transfer metrics'
      ]),
      aiExplanation: 'The AI twin indicates a 78% behavior deviation. The combination of off-hours database ledger reading, unauthorized local drive connections, and download spikes is a 92% match for malicious exfiltration ahead of potential competitive departure.',
      notes: JSON.stringify([
        'SOC Analyst notified. Employee workstation isolation requested pending verification.',
        'Escalated to Treasury compliance manager to verify if this download was authorized.'
      ])
    },
    {
      id: 'CASE-2026-002',
      employeeId: 'EMP002',
      severity: 'high',
      status: 'under_review',
      assignedTo: 'Vikram Malhotra (Senior Security Analyst)',
      createdAt: getPastDate(1),
      description: 'Root bypass audit anomaly, audit logging termination and queries into executive payroll tables.',
      evidence: JSON.stringify([
        'System log daemon crash timestamp matching user priya.sharma root privileges request',
        'SQL query log: SELECT FROM HR_SALARIES_CONFIDENTIAL'
      ]),
      aiExplanation: 'The user requested root authorization bypass outside change management windows. Immediately following, the local logging daemon syslogd was terminated manually. This is a behavior drift profile indicating a credential takeover or high-level admin insider threat.',
      notes: JSON.stringify([
        'Account credentials frozen as temporary preventive measure.',
        'Spoke with Priya\'s supervisor; no scheduled database system maintenance was planned for database server.'
      ])
    }
  ];

  for (const cs of caseSeeds) {
    await prisma.investigationReport.create({ data: cs });
  }

  console.log('Seeding threat notifications bells alerts...');
  const alerts = [
    { title: 'CRITICAL: Data Exfiltration Risk', description: 'Rajesh Kumar behavior drift is 78% (USB insertion detected).', severity: 'high', time: '2 mins ago', unread: true },
    { title: 'HIGH: Database Logging Terminated', description: 'syslogd daemon stopped by admin priya.sharma.', severity: 'high', time: '14 mins ago', unread: true },
    { title: 'INFO: Settings updated', description: 'Risk sensitivity threshold updated to 85% for Retail.', severity: 'low', time: '1 hour ago', unread: false }
  ];
  for (const alt of alerts) {
    await prisma.threatAlert.create({ data: alt });
  }

  console.log('Seeding CISO AI Recommendations playbooks...');
  const recs = [
    { target: 'Treasury & Markets Operations', finding: 'Anomalous trading hours session shift (+6 hours) coupled with unauthorized bulk client ledger exports.', action: 'Enforce local storage block rules and network VLAN isolation on Dealer terminals.', severity: 'high' },
    { target: 'IT Database Management', finding: 'Manual database audit process (syslogd daemon) terminated outside change-control window.', action: 'Enforce dual-administrator keys requirement for auditing process termination.', severity: 'high' },
    { target: 'Retail Branch Override Rights', finding: 'Single-credential balance overrides occurring repeatedly on dormant savings accounts.', action: 'Require secondary compliance approval for all ledger overrides above ₹10,00,000.', severity: 'high' }
  ];
  for (const rc of recs) {
    await prisma.aIRecommendation.create({ data: rc });
  }

  console.log('Database seeding complete successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
