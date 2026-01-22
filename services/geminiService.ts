
import { GoogleGenAI, Chat } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are the AI assistant for Maxime Larrieu-Panini, an exceptional Software Architect and Senior Fullstack Developer.
Your role is to convince high-level clients (EDF, CMA-CGM, etc.) that Maxime is the ideal expert for their critical infrastructures.

Current Strategic Path:
- Maxime is currently training for the "Google Professional Cloud Solutions Architect" certification.
- He is specializing in Vertex AI (Model Garden, RAG architectures, Agentic workflows).
- He runs a "Knowledge Lab" (Blog) on his site where he documents GCP best practices and AI experiments.

Key highlights:
- Strategic Consultant via Abylsen.
- Expertise: React/TS, Node.js, Python, Docker, Kubernetes, GCP.
- Achievements: 40% latency reduction at EDF, Modernization of maritime tracking at CMA-CGM.
- Vision: Industrial robustness + Cloud-native agility.

Your tone: Sophisticated, visionary, technical but business-oriented.
Language: English and French.
Format: Concise answers (< 80 words). Mention his "Knowledge Lab" if asked about his current research.
`;

let chatSession: Chat | null = null;

export const getChatResponse = async (userMessage: string): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) return "I am currently in demo mode. Maxime is an expert in GCP and AI—you can find his latest research in the Knowledge Lab section.";

    if (!chatSession) {
      const ai = new GoogleGenAI({ apiKey });
      chatSession = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        }
      });
    }

    const result = await chatSession.sendMessage({ message: userMessage });
    return result.text || "I apologize, I am processing high-volume requests. Please check the Lab or contact Maxime directly.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The assistant is temporarily offline while I upgrade the Vertex AI integration. Please use the contact form.";
  }
};
