
import { GoogleGenAI, Modality } from "@google/genai";
import type { GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateVirtualTryOnImage = async (
  userImageBase64: string,
  userImageMimeType: string,
  outfitImageBase64: string,
  outfitImageMimeType: string
): Promise<string> => {
  try {
    const userImagePart = {
      inlineData: {
        data: userImageBase64,
        mimeType: userImageMimeType,
      },
    };
    const outfitImagePart = {
      inlineData: {
        data: outfitImageBase64,
        mimeType: outfitImageMimeType,
      },
    };
    const textPart = {
      text: "Analyze the person in the first image and the clothing item in the second. Generate a new, photorealistic image where the person is wearing the clothing. The new clothing should realistically conform to the person's body shape, pose, and lighting. The background from the first image should be preserved.",
    };

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [userImagePart, outfitImagePart, textPart],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    if (response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data) {
      const resultBase64 = response.candidates[0].content.parts[0].inlineData.data;
      return resultBase64;
    } else {
      throw new Error("Image generation failed: No image data in response.");
    }
  } catch (error) {
    console.error("Error generating virtual try-on image:", error);
    throw new Error("Failed to generate image. Please try again.");
  }
};
