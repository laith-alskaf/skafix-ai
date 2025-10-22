import { GoogleGenAI, Modality, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateImage = async (prompt: string, aspectRatio: string): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: aspectRatio,
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
      throw new Error("No image was generated.");
    }
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image. Please check the console for details.");
  }
};

export const editImage = async (base64Data: string, mimeType: string, prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
      }
    }
    throw new Error("No edited image was returned.");

  } catch (error) {
    console.error("Error editing image:", error);
    throw new Error("Failed to edit image. Please check the console for details.");
  }
};

export const enhancePrompt = async (userPrompt: string): Promise<string> => {
  try {
    const modelPrompt = `You are an expert prompt engineer for text-to-image models. Rewrite the following user-provided prompt to be more vivid, descriptive, and detailed, incorporating artistic styles, lighting, and composition techniques. The output must be only the improved prompt, without any extra text, labels, or explanation.

    Original Prompt: "${userPrompt}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: modelPrompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error enhancing prompt:", error);
    throw new Error("Failed to enhance prompt. Please check the console for details.");
  }
};

export interface AdOptimizationResult {
  optimizedAd: string;
  generatedImage: string | null;
}

export const optimizeAd = async (
  originalAd: string | null,
  targetAudience: string,
  platform: string,
  tone: string,
  images: { base64Data: string; mimeType: string; }[] | null
): Promise<AdOptimizationResult> => {
  try {
    const systemInstruction = `You are a world-class social media marketing expert and copywriter. Your task is to analyze a user's input (which can be text, one or more images, or both) and create a highly effective social media advertisement.

    You must adhere to the following instructions:
    1.  **Analyze All Inputs:** Carefully consider the original ad text (if provided), the product image(s) (if provided), the target audience, the social media platform, and the desired tone.
    2.  **Craft Optimized Ad Copy:** Write a new version of the ad that is engaging, persuasive, and clear. Incorporate marketing techniques like a strong hook, clear value proposition, and a compelling call-to-action (CTA).
    3.  **Create a New Image Prompt:** Based on your analysis of the product(s) in the image(s) and the new ad copy, create a detailed and artistic prompt for an AI image generator. This prompt MUST describe a SINGLE, new, professional ad image that creatively MERGES or COMBINES the key elements from ALL the provided images into one cohesive and visually stunning scene.
    4.  **Output Format:** You MUST return the result in a JSON object with two keys: "optimizedAd" and "imagePrompt". Do not include any other text, markdown formatting, or explanations outside of the JSON structure.`;
    
    const parts: any[] = [];
    if (originalAd) {
      parts.push({ text: `**Original Ad:** "${originalAd}"` });
    }
    if (images && images.length > 0) {
      images.forEach(image => {
        parts.push({
          inlineData: {
            data: image.base64Data,
            mimeType: image.mimeType,
          },
        });
      });
    }
    
    const userPrompt = `Please optimize this ad based on these details:
      - **Target Audience:** "${targetAudience}"
      - **Platform:** "${platform}"
      - **Desired Tone:** "${tone}"
      - **User-provided materials are attached.**`;
      
    parts.unshift({ text: userPrompt });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: { parts: parts },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            optimizedAd: { type: Type.STRING },
            imagePrompt: { type: Type.STRING },
          },
          required: ["optimizedAd", "imagePrompt"]
        }
      }
    });

    const jsonString = response.text.trim();
    const result: { optimizedAd: string, imagePrompt: string } = JSON.parse(jsonString);

    let generatedImageUrl: string | null = null;
    if (result.imagePrompt) {
        try {
            generatedImageUrl = await generateImage(result.imagePrompt, '1:1');
        } catch(imageError) {
            console.error("Failed to generate new ad image, but ad text was optimized.", imageError);
            // Proceed without the image
        }
    }

    return {
        optimizedAd: result.optimizedAd,
        generatedImage: generatedImageUrl,
    };

  } catch (error) {
    console.error("Error optimizing ad:", error);
    throw new Error("Failed to optimize ad. The model may have returned an invalid format. Please check the console for details.");
  }
};