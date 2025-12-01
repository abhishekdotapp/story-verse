import Groq from "groq-sdk";

const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

if (!API_KEY) {
	throw new Error("VITE_GROQ_API_KEY is not set in environment variables");
}

const groq = new Groq({
	apiKey: API_KEY,
	dangerouslyAllowBrowser: true
});

export interface GeneratedStory {
	title: string;
	description: string;
	content: string;
	imagePrompt: string;
}

export async function generateStoryFromPrompt(
	userPrompt: string
): Promise<GeneratedStory> {
	const prompt = `You are a creative storytelling assistant. Based on the user's prompt, generate a complete story with the following structure:

User Prompt: "${userPrompt}"

Generate a JSON response with this exact structure (no markdown, just raw JSON):
{
  "title": "A catchy, creative title (max 60 characters)",
  "description": "A compelling 2-3 sentence summary of the story (max 200 characters)",
  "content": "The complete story content (500-1000 words). Make it engaging, creative, and well-structured with proper paragraphs.",
  "imagePrompt": "A detailed prompt for generating an image that represents this story (max 150 characters). Describe the key visual elements, mood, and style."
}

Make sure the story is creative, engaging, and matches the user's prompt. The content should be suitable for blockchain/NFT metadata. Return ONLY the JSON object, no other text.`;

	const completion = await groq.chat.completions.create({
		model: "llama-3.3-70b-versatile",
		messages: [
			{
				role: "system",
				content: "You are a creative storytelling assistant. Always respond with valid JSON only."
			},
			{ 
				role: "user", 
				content: prompt 
			}
		],
		temperature: 0.8,
		max_tokens: 2048
	});

	const text = completion.choices[0].message.content || "";

	try {
		// Clean up response - remove markdown if present
		let jsonText = text.trim();
		if (jsonText.startsWith("```json")) {
			jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
		} else if (jsonText.startsWith("```")) {
			jsonText = jsonText.replace(/```\n?/g, "");
		}

		const parsed = JSON.parse(jsonText) as GeneratedStory;

		// Validate the response
		if (!parsed.title || !parsed.description || !parsed.content || !parsed.imagePrompt) {
			throw new Error("Invalid response structure from AI");
		}

		return parsed;
	} catch (error) {
		console.error("Failed to parse AI response:", text);
		throw new Error("Failed to generate story. Please try again.");
	}
}

export async function generateImageFromPrompt(imagePrompt: string): Promise<string> {
	// For now, return the prompt - you can integrate with an image generation API later
	// Options: DALL-E, Midjourney, Stable Diffusion, etc.
	return imagePrompt;
}
