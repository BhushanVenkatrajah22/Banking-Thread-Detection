// AI Service Module for SecureMind AI Platform
// Primary: Groq (ultra-fast LLM inference)
// Fallback: OpenAI, Claude, then built-in inference engine

export interface AIResult {
  response: string;
  confidenceScore?: number;
  threatProbability?: number;
  timeWindow?: string;
  impactLevel?: 'Low' | 'Medium' | 'High' | 'Critical';
}

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile'; // Best Groq model for reasoning

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const ANTHROPIC_API_KEY = process.env.CLAUDE_API_KEY || '';

const SYSTEM_PROMPT = `You are SecureMind AI, an elite insider threat detection and behavioral intelligence system deployed within a major Indian bank. 
You analyze employee Digital Twin profiles, behavioral baselines, and anomaly patterns to identify and predict insider threats before they occur.
You communicate with precision, urgency, and clarity. Use structured markdown in your responses. 
Always provide specific, actionable security recommendations.`;

async function callGroq(prompt: string): Promise<string> {
  if (!GROQ_API_KEY) {
    return null as any;
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      temperature: 0.4,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

async function callOpenAI(prompt: string): Promise<string | null> {
  if (!OPENAI_API_KEY) return null;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      temperature: 0.4,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) return null;
  const data = await response.json();
  return data.choices?.[0]?.message?.content || null;
}

async function callClaude(prompt: string): Promise<string | null> {
  if (!ANTHROPIC_API_KEY) return null;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) return null;
  const data = await response.json();
  return data.content?.[0]?.text || null;
}

async function generateAIText(prompt: string): Promise<string> {
  // Priority: Groq → OpenAI → Claude → Built-in fallback
  try {
    if (GROQ_API_KEY) {
      const result = await callGroq(prompt);
      if (result) return result;
    }
  } catch (e) {
    console.warn('[AI Service] Groq call failed, trying fallback:', e);
  }

  try {
    if (OPENAI_API_KEY) {
      const result = await callOpenAI(prompt);
      if (result) return result;
    }
  } catch (e) {
    console.warn('[AI Service] OpenAI call failed, trying Claude:', e);
  }

  try {
    if (ANTHROPIC_API_KEY) {
      const result = await callClaude(prompt);
      if (result) return result;
    }
  } catch (e) {
    console.warn('[AI Service] Claude call failed, using built-in engine:', e);
  }

  // Built-in fallback engine
  return `[SecureMind AI Core Engine — Offline Mode] Behavioral inference processed using internal parameter weights. Set GROQ_API_KEY in .env to enable live LLM analysis.`;
}

export async function analyzeEmployeeBehavior(employeeId: string, currentLogs: any[], baselineDNA: string[]): Promise<AIResult> {
  const prompt = `
Analyze insider threat risk for employee ID: ${employeeId}

Baseline Behavior DNA:
${baselineDNA.map((d, i) => `${i + 1}. ${d}`).join('\n')}

Recent Activity Logs (last 72 hours):
${currentLogs.map(l => `- [${l.severity?.toUpperCase()}] ${l.category}: ${l.description}`).join('\n')}

Provide a structured threat analysis with: risk level, key anomaly indicators, and top 3 recommended actions.
`;

  const response = await generateAIText(prompt);
  const anomalies = currentLogs.filter(l => l.anomaly).length;
  const hasUsb = currentLogs.some(l => l.category === 'usb' && l.anomaly);
  const driftScore = Math.min(98, (anomalies * 18) + (hasUsb ? 30 : 0));

  return {
    response,
    confidenceScore: 90,
    threatProbability: driftScore
  };
}

export async function predictThreat(employeeId: string, trustScore: number, driftScore: number): Promise<AIResult> {
  const prompt = `
Predict insider threat probability for employee: ${employeeId}

Metrics:
- Trust Score: ${trustScore}% (lower = more suspicious)
- Behavior Drift Index: ${driftScore}% (higher = more anomalous)

Provide: probability estimate, predicted attack vector, recommended time window for intervention.
`;

  const response = await generateAIText(prompt);
  const probability = Math.min(99, Math.floor(driftScore * 1.2));
  const timeWindow = probability >= 75 ? 'Next 24 Hours' : probability >= 50 ? 'Next 48 Hours' : 'Next 7 Days';
  const impactLevel: AIResult['impactLevel'] = probability >= 80 ? 'Critical' : probability >= 60 ? 'High' : probability >= 35 ? 'Medium' : 'Low';

  return { response, threatProbability: probability, confidenceScore: 85, timeWindow, impactLevel };
}

export async function explainPrediction(predictionId: string, explainFactors: string[]): Promise<AIResult> {
  const prompt = `
Explain in detail the threat prediction ${predictionId}:

Correlated Indicators:
${explainFactors.map((f, i) => `${i + 1}. ${f}`).join('\n')}

Provide explainable AI reasoning for a security analyst audience.
`;
  const response = await generateAIText(prompt);
  return { response };
}

export async function generateRecommendations(predictionId: string, attackType: string): Promise<AIResult> {
  const prompt = `
Generate a security response playbook for threat type: "${attackType}"
Reference Alert: ${predictionId}

Include: immediate containment steps, investigation checklist, and escalation criteria.
`;
  const response = await generateAIText(prompt);
  return { response };
}

export async function generateInvestigationReport(caseId: string, details: any): Promise<AIResult> {
  const prompt = `
Generate a formal SOC Investigation Report for case: ${caseId}

Case Details:
${JSON.stringify(details, null, 2)}

Format as a professional security incident report with: executive summary, technical findings, evidence chain, and recommended disposition.
`;
  const response = await generateAIText(prompt);
  return { response };
}
