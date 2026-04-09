import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export interface AnalysisResult {
  trust_score: number;
  risk_level: string;
  analysis: string;
  recommended_savings_plan: string;
  loan_eligibility_status: string;
  key_metrics: {
    income_consistency: number; // 0-100
    expense_management: number; // 0-100
    liquidity_ratio: number; // 0-100
  };
}

export async function analyzeTransactions(logs: string): Promise<AnalysisResult> {
  if (!apiKey) {
    throw new Error("Gemini API key is missing. Please configure it in the Secrets panel.");
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        role: "user",
        parts: [{ text: `Analyze these mobile money transaction logs and generate a financial profile:\n\n${logs}` }]
      }
    ],
    config: {
      systemInstruction: `You are "Beyond the Wallet," an expert Alternative Credit Scoring AI. Your job is to analyze informal digital footprints (mobile money transaction logs, SMS receipts) of informal vendors and generate a financial profile.
      
      Analyze the provided data for:
      1. Income consistency (steady stream of small incomes).
      2. Expense management (bills, payments, business reinvestment).
      3. Red flags (frequent gambling, constantly hitting zero balance).
      4. Liquidity (money in vs money out).
      
      Output a structured JSON object with:
      - trust_score (0-1000)
      - risk_level (Low, Medium, High)
      - analysis (detailed summary)
      - recommended_savings_plan (specific daily/weekly goal)
      - loan_eligibility_status (e.g., "Eligible for Tier 1 Micro-Loan")
      - key_metrics (object with income_consistency, expense_management, liquidity_ratio as 0-100 values)
      
      Be strict and logical. Do not hallucinate data that isn't there. If data is insufficient, reflect that in the trust score and analysis.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          trust_score: { type: Type.NUMBER },
          risk_level: { type: Type.STRING },
          analysis: { type: Type.STRING },
          recommended_savings_plan: { type: Type.STRING },
          loan_eligibility_status: { type: Type.STRING },
          key_metrics: {
            type: Type.OBJECT,
            properties: {
              income_consistency: { type: Type.NUMBER },
              expense_management: { type: Type.NUMBER },
              liquidity_ratio: { type: Type.NUMBER },
            },
            required: ["income_consistency", "expense_management", "liquidity_ratio"]
          }
        },
        required: ["trust_score", "risk_level", "analysis", "recommended_savings_plan", "loan_eligibility_status", "key_metrics"]
      },
      temperature: 0.1,
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from Gemini");
  
  return JSON.parse(text) as AnalysisResult;
}
