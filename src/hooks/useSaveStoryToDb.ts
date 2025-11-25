import { useMutation } from "@tanstack/react-query";
import { supabase, storyToDbFormat } from "../lib/supabase";
import type { SavedStory } from "./useCreateStory";

export const useSaveStoryToDb = () => {
	return useMutation({
		mutationFn: async (story: SavedStory) => {
			console.log("💾 Saving story to database...", story.metadata.title);
			
			// Ensure ipId exists before saving to database
			if (!story.ipId) {
				throw new Error("Cannot save story without IP ID");
			}
			
			const dbStory = storyToDbFormat(story as Required<Pick<SavedStory, 'ipId'>> & SavedStory);
			
			// Use upsert to handle both insert and update cases
			const { data, error } = await supabase
				.from('stories')
				.upsert(dbStory, { 
					onConflict: 'ip_id',
					ignoreDuplicates: false 
				})
				.select()
				.single();

			if (error) {
				console.error("❌ Database save error:", error);
				throw new Error(`Failed to save to database: ${error.message}`);
			}

			console.log("✅ Story saved to database:", data);
			return data;
		},
	});
};
