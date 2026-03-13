import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("Gemini API key missing in .env");
}

const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash"
});

export async function askAgriBot(question: string) {

  try {

    const prompt = `
You are an expert agriculture AI assistant.

Help farmers with:
• crop recommendations
• pest control
• soil health
• irrigation planning
• fertilizer guidance
• weather impact on crops

User Question:
${question}
`;

    const result = await model.generateContent(prompt);

    const response = await result.response;

    return response.text();

  } catch (error) {

    console.error("Gemini API error:", error);

    return "⚠️ AI service unavailable. Please try again.";

  }

}