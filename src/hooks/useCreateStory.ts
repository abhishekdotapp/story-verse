import { useMutation } from "@tanstack/react-query";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";

import { STORY_NFT_COLLECTION } from "../lib/simpleNFT";
import { storyTestnet } from "../lib/storyChain";
import { createStoryProtocolClient } from "../lib/storySdkClient";
import { type StoryMetadata, uploadToIPFS, uploadFileToIPFS, hashFile } from "../utils/ipfs";

interface CreateStoryInput {
	title: string;
	description: string;
	content: string;
	creatorName?: string;
	imageFile?: File;
}

export interface SavedStory {
	id: string;
	ipId?: string;
	ipfsHash: string;
	imageIPFSHash?: string;
	tokenURI: string;
	metadata: StoryMetadata;
	author: string;
	timestamp: number;
	status: string;
	mintingFee: string;
	commercialRevShare: number;
	licenseTermsId?: string;
	tokenId?: string;
	nftContract?: string;
	txHash?: string;
	mintTxHash?: string;
	ipRegistrationTxHash?: string;
	licenseAttachmentTxHash?: string;
	licenseRegistrationTxHash?: string;
	parentIpId?: string;
	licenseTokenId?: string;
	derivativeTxHash?: string;
	nftTxHash?: string;
	remixOf?: string;
}

// Browser-compatible hash function using SHA-256
async function hashString(str: string): Promise<string> {
	const encoder = new TextEncoder();
	const data = encoder.encode(str);
	const hashBuffer = await crypto.subtle.digest("SHA-256", data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return "0x" + hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const useCreateStory = () => {
	const { address } = useAccount();
	const { data: wallet } = useWalletClient();
	const publicClient = usePublicClient({ chainId: storyTestnet.id });

	return useMutation({
		mutationFn: async (input: CreateStoryInput) => {
			if (!address || !wallet || !publicClient) {
				throw new Error("Please connect your wallet on Story Aeneid Testnet.");
			}

			console.log(
				"✨ Starting story creation with on-chain licensing...",
			);

			try {
				// Step 1: Upload image to IPFS if provided
				let imageIPFSHash: string | undefined;
				let imageHash: string | undefined;
				if (input.imageFile) {
					console.log("🖼️ Uploading NFT cover image to IPFS...");
					imageIPFSHash = await uploadFileToIPFS(input.imageFile);
					imageHash = await hashFile(input.imageFile);
					console.log("✅ Image uploaded to IPFS:", imageIPFSHash);
					console.log("✅ Image hash:", imageHash);
				}

			// Step 2: Upload to IPFS
			console.log("📤 Uploading story to IPFS...");
			const imageUrl = imageIPFSHash ? `ipfs://${imageIPFSHash}` : undefined;
			
			const metadata: StoryMetadata = {
				title: input.title,
				description: input.description,
				content: input.content,
				author: address,
				creatorName: input.creatorName || "Anonymous",
				createdAt: Date.now(),
				image: imageUrl,
				imageHash: imageHash,
				// Creator information required by IPA Metadata Standard for explorer display
				creators: [
					{
						name: input.creatorName || "Anonymous",
						address: address,
						contributionPercent: 100,
						description: `Creator of "${input.title}"`,
					},
				],
				// Media URL and hash for commercial infringement checking
				mediaUrl: imageUrl,
				mediaHash: imageHash,
				mediaType: input.imageFile ? "image/png" : undefined, // Default to PNG, could be enhanced to detect actual type
				// NFT attributes
				attributes: [
					{ trait_type: "Story Type", value: "Original" },
					{ trait_type: "License Type", value: "Non-Commercial Social Remixing" },
					{ trait_type: "Remixable", value: "Yes" },
					{ trait_type: "Commercial Use", value: "No" },
				],
			};

			const ipfsHash = await uploadToIPFS(metadata);
			const tokenURI = `ipfs://${ipfsHash}`;
			console.log("✅ IPFS upload complete:", tokenURI);

			// Step 3: Setup Story Client
			console.log("🔧 Setting up Story Protocol client...");
			const walletChainId = wallet.chain?.id;
			console.log("📍 Wallet chain ID:", walletChainId);

				if (!walletChainId || walletChainId !== storyTestnet.id) {
					throw new Error(
						`Please connect to Story Aeneid Testnet (Chain ID ${storyTestnet.id}). Current chain: ${walletChainId}`,
					);
				}

				const client = createStoryProtocolClient(wallet);

			// Step 4: Use pre-registered Non-Commercial Social Remixing license (ID = 1)
			console.log("📜 Using Non-Commercial Social Remixing license (pre-registered)...");
			
			// Non-Commercial Social Remixing is already registered on Story Protocol as licenseTermsId = 1
			// No need to register it again - just use it directly
			const NON_COMMERCIAL_LICENSE_ID = "1";
			
			console.log("✅ Using pre-registered Non-Commercial Social Remixing license!");
			console.log("📝 License Terms ID:", NON_COMMERCIAL_LICENSE_ID);

			// Step 5: Register as IP Asset with NFT mint - simplified approach
			console.log("📝 Registering story as IP asset & minting NFT...");
			
			// Create browser-compatible hashes
			const metadataHash = await hashString(JSON.stringify(metadata));

			const registration = await client.ipAsset.registerIpAsset({
				nft: {
					type: "mint",
					spgNftContract: STORY_NFT_COLLECTION,
					recipient: address,
				},
				ipMetadata: {
					ipMetadataURI: tokenURI,
					ipMetadataHash: metadataHash as `0x${string}`,
					nftMetadataURI: tokenURI,
					nftMetadataHash: metadataHash as `0x${string}`,
				},
			});

			if (!registration.ipId) {
				throw new Error("Failed to register story as IP asset");
			}

			console.log("✅ Story registered as IP asset!");
			console.log("📝 IP Asset ID:", registration.ipId);
			console.log("🔗 Registration Transaction Hash:", registration.txHash);

			// Attach Non-Commercial Social Remixing license to enable remixing
			console.log("📋 Attaching Non-Commercial Social Remixing license...");
			try {
				const attachResult = await client.license.attachLicenseTerms({
					ipId: registration.ipId as `0x${string}`,
					licenseTermsId: BigInt(NON_COMMERCIAL_LICENSE_ID),
				});
				console.log("✅ License terms attached! TX:", attachResult.txHash);
			} catch (attachError) {
				// Log but don't fail - license might already be attached
				const errorMsg = attachError instanceof Error ? attachError.message : String(attachError);
				if (errorMsg.includes("already attached") || errorMsg.includes("AlreadyAttached")) {
					console.log("ℹ️ License terms already attached");
				} else {
					console.warn("⚠️ License attachment warning:", errorMsg);
				}
			}

			const storyData: SavedStory = {
				id: ipfsHash,
				ipId: registration.ipId,
				ipfsHash,
				imageIPFSHash,
				tokenURI,
				metadata,
				author: address,
				timestamp: Date.now(),
				status: "fully_registered",
				mintingFee: "0",
				commercialRevShare: 0,
				licenseTermsId: NON_COMMERCIAL_LICENSE_ID,
				txHash: registration.txHash,
			};

			const existingStories = JSON.parse(
				localStorage.getItem("myStories") || "[]",
			);
			existingStories.unshift(storyData);
			localStorage.setItem("myStories", JSON.stringify(existingStories));

			console.log("💾 Story saved successfully");
			console.log("🎉 Story created with on-chain PIL terms!");

			return {
				...storyData,
				message:
					"✅ Story fully registered on-chain! IP asset created. Your story is ready!",
				success: true,
			};
		} catch (error) {
			console.error("❌ Story creation failed:", error);				const rawMessage =
					error instanceof Error ? error.message : String(error ?? "");
				const message = rawMessage.toLowerCase();

				if (message.includes("user rejected")) {
					throw new Error(
						"Transaction rejected. Please approve the request in your wallet to continue.",
					);
				}

				if (message.includes("insufficient funds")) {
					throw new Error(
						"Insufficient IP tokens for gas. Grab test tokens from https://faucet.story.foundation and try again.",
					);
				}

				if (message.includes("ipfs")) {
					throw new Error(
						"Failed to upload to IPFS. Check your connection and retry.",
					);
				}

				if (message.includes("license") || message.includes("pil")) {
					throw new Error(
						"Failed to register PIL terms. Please ensure you have enough IP tokens for gas and try again.",
					);
				}

				if (
					message.includes("chain") ||
					message.includes("network") ||
					message.includes("wrong")
				) {
					throw new Error(
						`Please switch your wallet to Story Aeneid Testnet (Chain ID ${storyTestnet.id}).`,
					);
				}

				throw new Error(
					rawMessage || "Failed to create story. Please try again.",
				);
			}
		},
	});
};
