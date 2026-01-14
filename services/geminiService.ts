
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSpiritualInsight = async (nextPrayer: string, city: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Berikan satu kutipan singkat atau hadits (beserta maknanya) yang relevan dengan waktu sholat ${nextPrayer} dalam Bahasa Indonesia yang menyejukkan hati. Tambahkan pesan singkat penyemangat untuk warga di kota ${city}. Format JSON.`,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "Anda adalah asisten spiritual yang bijak dan menyejukkan. Berikan respon dalam format JSON: { 'quote': string, 'source': string, 'message': string }",
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      quote: "Shalat adalah tiang agama.",
      source: "Hadits Riwayat Tirmidzi",
      message: "Semoga hari Anda diberkati."
    };
  }
};
