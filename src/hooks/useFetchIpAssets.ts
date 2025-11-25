import { useQuery } from "@tanstack/react-query";
import { createPublicClient, http, parseAbiItem } from "viem";
import { storyTestnet } from "../lib/storyChain";
import { STORY_NFT_COLLECTION, SIMPLE_NFT_ABI } from "../lib/simpleNFT";
import type { SavedStory } from "./useCreateStory";
import { fetchMetadataFromIPFS, convertIpfsMetadataToStory } from "../utils/ipfsMetadata";

// Note: Currently unused - using Supabase for better performance
// Kept for potential future direct blockchain queries

// ERC721 Transfer event ABI
const TRANSFER_EVENT = parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)');

export const useFetchIpAssets = () => {
	return useQuery({
		queryKey: ["ipAssets", STORY_NFT_COLLECTION],
		queryFn: async (): Promise<SavedStory[]> => {
			console.log("🔍 Fetching all stories from blockchain...");

			const publicClient = createPublicClient({
				chain: storyTestnet,
				transport: http(storyTestnet.rpcUrls.default.http[0]),
			});

			try {
				// Get current block number
				const currentBlock = await publicClient.getBlockNumber();
				const fromBlock = currentBlock > 100000n ? currentBlock - 100000n : 0n; // Look back 100k blocks

				console.log(`📦 Scanning Transfer events from block ${fromBlock} to ${currentBlock}`);

				// Get all Transfer events (mints) from the NFT contract
				// Transfer from address(0) means it's a mint
				const transferLogs = await publicClient.getLogs({
					address: STORY_NFT_COLLECTION,
					event: TRANSFER_EVENT,
					args: {
						from: "0x0000000000000000000000000000000000000000" as `0x${string}`,
					},
					fromBlock,
					toBlock: currentBlock,
				});

				console.log(`✅ Found ${transferLogs.length} minted NFTs`);

				if (transferLogs.length === 0) {
					console.log("📭 No stories found on blockchain yet");
					return [];
				}

				const stories: SavedStory[] = [];
				const processedTokenIds = new Set<string>(); // Avoid duplicates

				// Process each minted NFT
				for (const log of transferLogs) {
					try {
						const tokenId = log.args.tokenId;
						if (!tokenId) continue;

						const tokenIdStr = tokenId.toString();
						if (processedTokenIds.has(tokenIdStr)) continue;
						processedTokenIds.add(tokenIdStr);

						console.log(`📝 Processing token #${tokenId}`);

						// Get tokenURI
						const tokenURI = await publicClient.readContract({
							address: STORY_NFT_COLLECTION,
							abi: SIMPLE_NFT_ABI,
							functionName: "tokenURI",
							args: [tokenId],
						}) as string;

						console.log(`🔗 Token URI: ${tokenURI}`);

						// Extract IPFS hash from URI (format: ipfs://QmXXX or https://gateway/ipfs/QmXXX)
						let ipfsHash = "";
						if (tokenURI.startsWith("ipfs://")) {
							ipfsHash = tokenURI.replace("ipfs://", "");
						} else if (tokenURI.includes("/ipfs/")) {
							ipfsHash = tokenURI.split("/ipfs/")[1];
						} else {
							console.warn(`⚠️ Unsupported URI format: ${tokenURI}`);
							continue;
						}

						// Fetch metadata from IPFS
						console.log(`📥 Fetching metadata from IPFS: ${ipfsHash}`);
						const metadata = await fetchMetadataFromIPFS(ipfsHash);

						if (metadata) {
							// Filter: Only include stories from this app
							if (metadata.appId !== "story-verse") {
								console.log(`⏭️ Skipping token ${tokenId} - not from story-verse app (appId: ${metadata.appId || 'none'})`);
								continue;
							}

					// Get IP ID - since registry queries don't work, check metadata first
					let ipId: string | undefined;
					
					// First check if IP ID is stored in metadata
					if (metadata.ipId) {
						ipId = metadata.ipId;
						console.log(`✅ Found IP ID in metadata for token ${tokenId}: ${ipId}`);
					} else {
						console.warn(`⚠️ No IP ID in metadata for token ${tokenId}, using fallback`);
					}

					const story = convertIpfsMetadataToStory(
						metadata,
						ipId || `0x${tokenId.toString(16).padStart(40, '0')}`, // Use token ID as fallback
						tokenIdStr,
						ipfsHash
					);
					
					console.log(`📦 Story: "${story.metadata.title}" | Token: ${tokenIdStr} | IP ID: ${story.ipId} | Fallback: ${!ipId}`);
					
					stories.push(story);
					console.log(`✅ Story loaded: "${story.metadata.title}"`);
				}
					} catch (error) {
						console.warn(`⚠️ Error processing token:`, error);
					}
				}

				console.log(`✨ Successfully loaded ${stories.length} stories from blockchain`);
				return stories;

			} catch (error) {
				console.error("❌ Error fetching from blockchain:", error);
				
				return [];
			}
		},
		staleTime: 30000, // 30 seconds
		refetchInterval: 60000, // Refetch every minute
		retry: 2,
	});
};
