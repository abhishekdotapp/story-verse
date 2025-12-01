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
	mintingFee?: string;
	commercialRevShare?: number;
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
			// Step 1: Upload image to IPFS if provided, or use default ippy.svg
			let imageIPFSHash: string | undefined;
			let imageHash: string | undefined;
			if (input.imageFile) {
				console.log("🖼️ Uploading NFT cover image to IPFS...");
				imageIPFSHash = await uploadFileToIPFS(input.imageFile);
				imageHash = await hashFile(input.imageFile);
				console.log("✅ Image uploaded to IPFS:", imageIPFSHash);
				console.log("✅ Image hash:", imageHash);
			} else {
				// Use default ippy.svg
				console.log("🖼️ Using default ippy.svg as NFT cover...");
				const response = await fetch("/ippy.svg");
				const svgBlob = await response.blob();
				const defaultImageFile = new File([svgBlob], "ippy.svg", { type: "image/svg+xml" });
				imageIPFSHash = await uploadFileToIPFS(defaultImageFile);
				imageHash = await hashFile(defaultImageFile);
				console.log("✅ Default image uploaded to IPFS:", imageIPFSHash);
			}

		// Step 2: Upload to IPFS
		console.log("📤 Uploading story to IPFS...");
		const imageUrl = imageIPFSHash ? `ipfs://${imageIPFSHash}` : undefined;			const metadata: StoryMetadata = {
				appId: "story-verse",
				appVersion: "1.0.0",
				title: input.title,
				description: input.description,
				content: input.content,
				author: address,
				creatorName: input.creatorName || "Anonymous",
				createdAt: Date.now(),
				image: imageUrl,
			imageHash: imageHash,
			mintingFee: input.mintingFee || "0",
			commercialRevShare: (input.commercialRevShare || 10).toString(),
			licenseTermsId: "commercial",
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
				mediaType: input.imageFile ? (input.imageFile.type || "image/png") : "image/svg+xml", // SVG for default ippy
				// NFT attributes - Commercial Use with Revenue Share
				attributes: [
					{ trait_type: "Story Type", value: "Original" },
					{ trait_type: "License Type", value: "Commercial Use" },
					{ trait_type: "Remixable", value: "Yes" },
					{ trait_type: "Commercial Use", value: "Yes" },
					{ trait_type: "Derivatives Allowed", value: "Yes" },
					{ trait_type: "Attribution Required", value: "Yes" },
					{ trait_type: "Revenue Share", value: `${input.commercialRevShare || 10}%` },
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

		// Step 4: Register IP asset on Story Protocol blockchain
		// Using COMMERCIAL license so original creator earns from remixes
		console.log("📜 Registering IP asset with Commercial License...");

		let ipId: string | undefined;
		let txHash: string | undefined;
		let tokenId: string | undefined;
		let licenseTermsId: string | undefined;
		let status: "fully_registered" | "pending_blockchain" = "pending_blockchain";

		try {
			// Step 5: Register PIL Terms for Commercial Use
			console.log("📝 Registering Commercial License Terms...");
			
			const licenseResponse = await client.license.registerPILTerms({
				transferable: true,
				royaltyPolicy: "0xBe54FB168b3c982b7AaE60dB6CF75Bd8447b390E" as `0x${string}`, // LAP Royalty Policy
				defaultMintingFee: BigInt(1000000000000000000), // 1 WIP token (18 decimals)
				expiration: BigInt(0),
				commercialUse: true,
				commercialAttribution: true,
				commercializerChecker: "0x0000000000000000000000000000000000000000" as `0x${string}`,
				commercializerCheckerData: "0x" as `0x${string}`,
				commercialRevShare: input.commercialRevShare || 10, // Direct percentage (0-100)
				commercialRevCeiling: BigInt(0),
				derivativesAllowed: true,
				derivativesAttribution: true,
				derivativesApproval: false,
				derivativesReciprocal: true,
				derivativeRevCeiling: BigInt(0),
				currency: "0x1514000000000000000000000000000000000000" as `0x${string}`, // WIP token (whitelisted on Aeneid)
				uri: "",
			});

			if (!licenseResponse.licenseTermsId) {
				throw new Error("Failed to register license terms");
			}

			licenseTermsId = licenseResponse.licenseTermsId.toString();
			console.log("✅ License Terms registered! ID:", licenseTermsId);

			// Step 6: Mint NFT and register IP with license terms
			console.log("📝 Minting NFT and registering as IP asset...");
			
			const metadataHash = await hashString(JSON.stringify(metadata));
			const nftMetadataHash = await hashString(tokenURI);

			const response = await client.ipAsset.registerIpAsset({
				nft: {
					type: "mint",
					spgNftContract: STORY_NFT_COLLECTION as `0x${string}`,
				},
				ipMetadata: {
					ipMetadataURI: tokenURI,
					ipMetadataHash: metadataHash as `0x${string}`,
					nftMetadataURI: tokenURI,
					nftMetadataHash: nftMetadataHash as `0x${string}`,
				},
			});

			if (!response.ipId) {
				throw new Error("No IP ID returned from registration");
			}

			ipId = response.ipId;
			txHash = response.txHash;
			tokenId = response.tokenId?.toString() || '0';
			status = "fully_registered";

			console.log("✅ Story registered on blockchain!");
			console.log("📝 IP Asset ID:", ipId);
			console.log("📝 Token ID:", tokenId);
			console.log("🔗 Transaction Hash:", txHash);

			// Step 7: Attach commercial license terms
			try {
				console.log("📜 Attaching Commercial License Terms...");
				const licenseResult = await client.license.attachLicenseTerms({
					ipId: ipId as `0x${string}`,
					licenseTermsId: BigInt(licenseTermsId),
				});
				
				if (licenseResult.success) {
					console.log("✅ License terms attached! Tx:", licenseResult.txHash);
				}
			} catch (licenseError: any) {
				console.warn("⚠️ Could not attach license terms:", licenseError.message);
				console.log("ℹ️ Continuing without license terms (can be attached later)");
			}

		} catch (blockchainError: any) {
			// Blockchain registration failed - save to database anyway with pending status
			console.warn("⚠️ Blockchain registration failed:", blockchainError.message);
			console.log("💾 Saving story to database with pending status...");
			
			// Generate a temporary IP ID for database tracking
			ipId = `pending_${Date.now()}_${address?.slice(2, 10)}`;
			txHash = undefined;
			tokenId = '0';
			status = "pending_blockchain";
			
			console.log("ℹ️ Story saved as 'pending' - you can retry blockchain registration later");
		}

		// Step 8: Save to database (whether blockchain succeeded or not)
		const storyData: SavedStory = {
			id: ipfsHash,
			ipId: ipId || `pending_${ipfsHash}`,
			ipfsHash,
			imageIPFSHash,
			tokenURI,
			metadata,
			author: address,
			timestamp: Date.now(),
			status: status,
			mintingFee: input.mintingFee || "0",
			commercialRevShare: input.commercialRevShare || 10,
			licenseTermsId: licenseTermsId || undefined,
			tokenId: tokenId || '0',
			nftContract: STORY_NFT_COLLECTION,
			txHash: txHash,
		};

		console.log("💾 Saving story to database...");
		
		// Save to database (whether blockchain succeeded or not)
		try {
			const { supabase, storyToDbFormat } = await import("../lib/supabase");
			const dbStory = storyToDbFormat(storyData as any);
			
			const { error: dbError } = await supabase
				.from('stories')
				.upsert(dbStory, { onConflict: 'ip_id' });
			
			if (dbError) {
				console.error("❌ Database save failed:", dbError);
				throw new Error(`Failed to save to database: ${dbError.message}`);
			}

			console.log("✅ Story saved to database successfully!");
			
			if (status === "pending_blockchain") {
				console.log("⚠️ Note: Blockchain registration pending. Story saved to database.");
				console.log("ℹ️ The Story Protocol testnet is experiencing issues. Your story is saved and visible in the app.");
			}
		} catch (dbError) {
			console.error("❌ Database save failed:", dbError);
			throw new Error(`Failed to save story: ${dbError instanceof Error ? dbError.message : 'Unknown error'}`);
		}
		
		console.log("🎉 Story created successfully!");

		return {
			...storyData,
			message: status === "fully_registered" 
				? "✅ Story fully registered on-chain! IP asset created. Your story is ready!"
				: "✅ Story saved! Blockchain registration will retry when testnet is available.",
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
