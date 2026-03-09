import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface StoryParams {
  tone: string;
  setting: string;
  gender: string;
  narrator: string;
  name: string;
}

export const generateStory = async (params: StoryParams): Promise<string> => {
  try {
    const prompt = `Você é um mestre de RPG e escritor profissional. Gere uma biografia de personagem com as seguintes restrições:

Nome: ${params.name} | Tema: ${params.setting} | Tom: ${params.tone} | Gênero: ${params.gender} | Narrador: ${params.narrator}

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

export const generateNames = async (setting: string, tone: string, gender: string): Promise<string[]> => {
  try {
    const prompt = `Gere exatamente 3 opções de nomes criativos e imersivos para um personagem de RPG com as seguintes características:
Cenário: ${setting}
Tom: ${tone}
Gênero: ${gender}

Retorne APENAS os 3 nomes, separados por vírgula, sem numeração ou texto adicional. Exemplo: Kaelen, Vane, Thorne`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const text = response.text || "";
    const names = text.split(',').map(n => n.trim()).filter(n => n.length > 0);
    
    if (names.length >= 3) {
      return names.slice(0, 3);
    }
    return ["Aria", "Kael", "Nova"]; // Fallback
  } catch (error) {
    console.error("Erro ao gerar nomes:", error);
    return ["Aria", "Kael", "Nova"]; // Fallback
  }
};
