import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("❌ Gemini API key missing in .env file");
}

const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

/* Clean AI response */
function cleanResponse(text: string) {
  return text
    .replace(/\*/g, "")
    .replace(/•/g, "")
    .replace(/#/g, "")
    .replace(/`/g, "")
    .replace(/\n\s*\n/g, "\n")
    .trim();
}

/* Ask AI */

export async function askAgriBot(question: string): Promise<string> {
  try {
    const prompt = `
You are SmartCrop AI, an expert agriculture assistant.

Rules:
- Do NOT use bullet points
- Do NOT use markdown
- Respond in clear plain text
- Keep answers short and helpful
- Write in simple farmer friendly language

You help farmers with:
crop recommendations
pest control
soil health
irrigation planning
fertilizer usage
weather impact on farming

User Question:
${question}
`;

    const result = await model.generateContent(prompt);

    const response = await result.response;

    const text = response.text();

    if (!text) {
      return "I could not generate a response. Please try again.";
    }

    return cleanResponse(text);
  } catch (error) {
    console.error("Gemini API error:", error);

    return "AI service unavailable. Please try again.";
  }
}