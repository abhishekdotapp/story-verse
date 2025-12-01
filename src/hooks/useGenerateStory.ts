import { useMutation } from "@tanstack/react-query";
import { generateStoryFromPrompt } from "../lib/gemini";

export const useGenerateStory = () => {
	return useMutation({
		mutationFn: async (prompt: string) => {
			if (!prompt.trim()) {
				throw new Error("Please enter a prompt to generate your story");
			}

			return await generateStoryFromPrompt(prompt);
		},
	});
};
