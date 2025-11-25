import { useMutation } from "@tanstack/react-query";
import type { Address } from "viem";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";

import { STORY_NFT_COLLECTION } from "../lib/simpleNFT";
import { createStoryProtocolClient } from "../lib/storySdkClient";
import { storyTestnet } from "../lib/storyChain";
import { type StoryMetadata, uploadToIPFS } from "../utils/ipfs";

// Browser-compatible hash function using SHA-256
async function hashString(str: string): Promise<string> {
	const encoder = new TextEncoder();
	const data = encoder.encode(str);
	const hashBuffer = await crypto.subtle.digest("SHA-256", data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return "0x" + hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

interface CreateRemixInput {
	parentIpId: Address;
	licenseTermsId: string;
	title: string;
	description: string;
	content: string;
	parentTitle: string;
	creatorName?: string;
	mintingFee?: string;
	commercialRevShare?: number;
}

export const useCreateRemix = () => {
	const { address } = useAccount();
	const { data: walletClient } = useWalletClient();
	const publicClient = usePublicClient({ chainId: storyTestnet.id });

	return useMutation({
		mutationFn: async (input: CreateRemixInput) => {
			if (!address || !walletClient || !publicClient) {
				throw new Error("Please connect your wallet first.");
			}

			if (walletClient.chain?.id !== storyTestnet.id) {
				throw new Error(
					`Please connect to Story Aeneid Testnet (Chain ID ${storyTestnet.id}).`,
				);
			}

			console.log("🎬 Creating remix...");
			console.log("📍 Parent IP ID:", input.parentIpId);
			console.log("📋 License Terms ID:", input.licenseTermsId);

			const storyClient = createStoryProtocolClient(walletClient);

			// Note: The SDK will automatically mint the license token from the parent if needed
			// during registerDerivativeIpAsset, so we don't need to manually handle that

		// 1. Upload remix content to IPFS
		console.log("📤 Uploading remix to IPFS...");
		const metadata: StoryMetadata = {
			appId: "story-verse",
			appVersion: "1.0.0",
			title: input.title,
			description: input.description,
			content: input.content,
			author: address,
		createdAt: Date.now(),
		mintingFee: input.mintingFee || "0",
		commercialRevShare: input.commercialRevShare?.toString() || "0",
		licenseTermsId: input.licenseTermsId,
		// Creator information required by IPA Metadata Standard for explorer display
			creators: [
				{
					name: input.creatorName || "Anonymous",
					address: address,
					contributionPercent: 100,
					description: `Remixer of "${input.parentTitle}"`,
				},
			],
			// NFT attributes
			attributes: [
				{ trait_type: "Story Type", value: "Remix/Derivative" },
				{ trait_type: "Parent Story", value: input.parentTitle },
				{ trait_type: "Parent IP ID", value: input.parentIpId },
			],
		};			const ipfsHash = await uploadToIPFS(metadata);
			const tokenURI = `ipfs://${ipfsHash}`;

			console.log("✅ Remix uploaded to IPFS:", tokenURI);

			// 2. Register remix as IP asset AND link to parent as derivative (combined)
			console.log("📝 Registering remix as derivative IP asset...");
			
			const metadataHash = await hashString(JSON.stringify(metadata));
			const nftMetadataHash = await hashString(JSON.stringify({
				name: metadata.title,
				description: metadata.description,
			}));

			const registration = await storyClient.ipAsset.registerDerivativeIpAsset({
				nft: {
					type: "mint",
					spgNftContract: STORY_NFT_COLLECTION,
					recipient: address,
				},
				ipMetadata: {
					ipMetadataURI: tokenURI,
					ipMetadataHash: metadataHash as `0x${string}`,
					nftMetadataURI: tokenURI,
					nftMetadataHash: nftMetadataHash as `0x${string}`,
				},
				derivData: {
					parentIpIds: [input.parentIpId],
					licenseTermsIds: [BigInt(input.licenseTermsId)],
				},
			});

			if (!registration.ipId) {
				throw new Error("Failed to register remix as derivative IP asset");
			}

			console.log("✅ Remix registered as derivative IP asset!");
			console.log("📝 Child IP ID:", registration.ipId);
			console.log("🔗 Derivative Registration TX:", registration.txHash);

			console.log("💾 Remix registered on blockchain");
		
		// Save to database
		try {
			const { supabase, storyToDbFormat } = await import("../lib/supabase");
			const remixData = {
				id: ipfsHash,
				ipId: registration.ipId,
				tokenId: registration.tokenId?.toString() || '0',
				nftContract: STORY_NFT_COLLECTION,
				ipfsHash,
				tokenURI,
				imageIPFSHash: undefined,
				metadata: {
					title: input.title,
					description: input.description,
					content: input.content,
					author: address,
					creatorName: input.creatorName,
				},
				author: address,
				mintingFee: input.mintingFee || "0",
				commercialRevShare: input.commercialRevShare || 0,
				licenseTermsId: input.licenseTermsId,
				txHash: registration.txHash,
				parentIpId: input.parentIpId,
				remixOf: input.parentTitle,
				status: "derivative_registered",
				timestamp: Date.now(),
			};
			
			const dbStory = storyToDbFormat(remixData as any);
			
			const { error: dbError } = await supabase
				.from('stories')
				.upsert(dbStory, { onConflict: 'ip_id' });
			
			if (dbError) {
				console.warn("⚠️ Failed to save remix to database:", dbError.message);
			} else {
				console.log("✅ Remix saved to database");
			}
		} catch (dbError) {
			console.warn("⚠️ Database save error:", dbError);
		}

		console.log("🎉 Remix created successfully!");
		
		return {
				ipId: registration.ipId,
				ipfsHash,
				tokenURI,
				parentIpId: input.parentIpId,
				txHash: registration.txHash,
				derivativeTxHash: registration.txHash,
			};
		},
	});
};
