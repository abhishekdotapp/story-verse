import { useQuery } from "@tanstack/react-query";

export type StoryNode = {
	id: string;
	title: string;
	parentId?: string;
	synopsis: string;
	author: string;
	mood: "hopeful" | "mysterious" | "tragic" | "playful";
	depth: number;
	licenseFee: string;
	createdAt: string;
	contributors: string[];
};

export type StoryEdge = {
	id: string;
	source: string;
	target: string;
};

export type StoryGraph = {
	nodes: StoryNode[];
	edges: StoryEdge[];
};

const demoGraph: StoryGraph = {
	nodes: [
		{
			id: "root",
			title: "Genesis: The Lighthouse",
			synopsis:
				"A lone lighthouse keeper discovers the sea holds memories of every story ever told.",
			author: "0xGenesis",
			mood: "mysterious",
			depth: 0,
			licenseFee: "0.05",
			createdAt: new Date().toISOString(),
			contributors: ["0xGenesis"],
		},
		{
			id: "child-1",
			title: "Refraction",
			synopsis:
				"A poet tunes the lighthouse beam to replay lost melodies for passing ships.",
			author: "0xVerse",
			mood: "hopeful",
			depth: 1,
			licenseFee: "0.02",
			createdAt: new Date().toISOString(),
			contributors: ["0xVerse"],
			parentId: "root",
		},
		{
			id: "child-2",
			title: "Signal Lost",
			synopsis:
				"Storms corrupt the beam, splitting time into shimmering fragments.",
			author: "0xChronicle",
			mood: "tragic",
			depth: 1,
			licenseFee: "0.03",
			createdAt: new Date().toISOString(),
			contributors: ["0xChronicle"],
			parentId: "root",
		},
		{
			id: "branch-1",
			title: "Tidal Choir",
			synopsis:
				"Merfolk composers collaborate to harmonize the fractured timelines.",
			author: "0xCantor",
			mood: "playful",
			depth: 2,
			licenseFee: "0.015",
			createdAt: new Date().toISOString(),
			contributors: ["0xCantor", "0xVerse"],
			parentId: "child-1",
		},
	],
	edges: [
		{ id: "root-child-1", source: "root", target: "child-1" },
		{ id: "root-child-2", source: "root", target: "child-2" },
		{ id: "child-1-branch-1", source: "child-1", target: "branch-1" },
	],
};

const GRAPH_ENDPOINT = import.meta.env.VITE_STORY_GRAPH_ENDPOINT;

async function fetchGraph(rootIpId?: string): Promise<StoryGraph> {
	if (!GRAPH_ENDPOINT) {
		return demoGraph;
	}

	const response = await fetch(`${GRAPH_ENDPOINT}?rootIpId=${rootIpId ?? ""}`);

	if (!response.ok) {
		throw new Error("Failed to fetch story graph");
	}

	return (await response.json()) as StoryGraph;
}

export const useStoryGraph = (rootIpId?: string) =>
	useQuery({
		queryKey: ["story-graph", rootIpId],
		queryFn: () => fetchGraph(rootIpId),
		refetchInterval: 20_000,
	});
