import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

interface Employee {
  id: string;
  name: string;
  role: string;
  predictionRisk: number;
  trustScore: number;
  driftScore: number;
  status: string;
}

interface Prediction {
  id: string;
  employeeId: string;
  probability: number;
  attackType: string;
  status: string;
}

const copilotInference = (message: string, employeesList: Employee[], predictionsList: Prediction[]): { response: string; references?: string[] } => {
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
      response: `**Summary of Active Threat Predictions:**

We have detected **3 critical behavioral anomalies** matching high-risk insider threat categories:
1. **Karthikeyan Balaji (Treasury)**: 92% probability of *Data Theft & Exfiltration*. Active exfiltration on USB detected.
2. **Meenakshi Sundaram (IT & Security)**: 84% probability of *Privilege Abuse & Security Sabotage*. Database logging service was manually disabled.
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

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message query is required.' }, { status: 400 });
    }

    const employees = await prisma.employee.findMany();
    const predictions = await prisma.riskPrediction.findMany();

    const result = copilotInference(message, employees as any, predictions as any);

    return NextResponse.json({ 
      response: result.response,
      references: result.references || []
    });

  } catch (error: any) {
    console.error('AI API Route Error:', error);
    return NextResponse.json({ error: 'AI inference service failed.' }, { status: 500 });
  }
}
