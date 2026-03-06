import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface StoryParams {
  tone: string;
  setting: string;
  gender: string;
}

export const generateStory = async (params: StoryParams): Promise<string> => {
  try {
    const prompt = `Você é um mestre de RPG e escritor profissional. Gere uma biografia de personagem com as seguintes restrições:

Tema: ${params.setting} | Tom: ${params.tone} | Gênero: ${params.gender}

Regras: Máximo de 3 parágrafos e 1000 caracteres. Proibido usar 'Era uma vez' ou clichês de início. Comece 'in media res' (no meio da ação) ou com um monólogo interno impactante. Foque no conflito central e deixe um 'gancho' para uma aventura. Use vocabulário imersivo (Ex: 'cyberdeck/nanites' para Cyberpunk, 'alforje/estribo' para Medieval).`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text || "Os deuses da narrativa estão silenciosos agora... Tente novamente em instantes.";
  } catch (error) {
    console.error("Erro ao gerar história:", error);
    throw new Error("Falha na comunicação com o oráculo.");
  }
};
