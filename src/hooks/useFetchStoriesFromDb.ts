import { useQuery } from "@tanstack/react-query";
import { supabase, dbStoryToAppFormat, type DbStory } from "../lib/supabase";
import type { SavedStory } from "./useCreateStory";

export const useFetchStoriesFromDb = () => {
	return useQuery({
		queryKey: ['stories'],
		queryFn: async (): Promise<SavedStory[]> => {
			console.log("📚 Fetching stories from database...");

			const { data, error } = await supabase
				.from('stories')
				.select('*')
				.order('created_at', { ascending: false });

			if (error) {
				console.error("❌ Database fetch error:", error);
				throw new Error(`Failed to fetch from database: ${error.message}`);
			}

			console.log(`✅ Fetched ${data?.length || 0} stories from database`);
			
			// Convert database format to app format
			const stories = (data as DbStory[]).map(dbStoryToAppFormat);
			
			return stories;
		},
		staleTime: 30000, // 30 seconds
		refetchInterval: 60000, // Refetch every minute
		retry: 2,
	});
};

// Hook to fetch stories by a specific author
export const useFetchMyStoriesFromDb = (authorAddress: string | undefined) => {
	return useQuery({
		queryKey: ['my-stories', authorAddress],
		queryFn: async (): Promise<SavedStory[]> => {
			if (!authorAddress) {
				return [];
			}

			console.log(`📚 Fetching stories by ${authorAddress}...`);

			const { data, error } = await supabase
				.from('stories')
				.select('*')
				.ilike('author', authorAddress)
				.order('created_at', { ascending: false });

			if (error) {
				console.error("❌ Database fetch error:", error);
				throw new Error(`Failed to fetch from database: ${error.message}`);
			}

			console.log(`✅ Fetched ${data?.length || 0} stories by author`);
			
			const stories = (data as DbStory[]).map(dbStoryToAppFormat);
			
			return stories;
		},
		staleTime: 30000,
		refetchInterval: 60000,
		retry: 2,
		enabled: !!authorAddress, // Only run query if address is provided
	});
};
