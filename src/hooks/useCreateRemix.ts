import { useMutation } from "@tanstack/react-query";
import type { Address } from "viem";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";

import { STORY_NFT_COLLECTION } from "../lib/simpleNFT";
import { createStoryProtocolClient } from "../lib/storySdkClient";
import { storyTestnet } from "../lib/storyChain";
import { type StoryMetadata, uploadToIPFS } from "../utils/ipfs";
import type { SavedStory } from "./useCreateStory";

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

			// 0. Attach license terms to parent IP if not already attached
			console.log("📋 Ensuring license terms are attached to parent IP...");
			try {
				await storyClient.license.attachLicenseTerms({
					ipId: input.parentIpId,
					licenseTermsId: BigInt(input.licenseTermsId),
				});
				console.log("✅ License terms attached to parent IP");
			} catch (error) {
				// License terms might already be attached, continue
				const errorMsg = error instanceof Error ? error.message : String(error);
				if (errorMsg.includes("already attached") || errorMsg.includes("AlreadyAttached")) {
					console.log("ℹ️ License terms already attached to parent IP");
				} else {
					console.warn("⚠️ Failed to attach license terms, attempting to continue:", errorMsg);
				}
			}

			// 1. Mint License Token from parent story
			console.log("📜 Minting license token...");
			const mintResult = await storyClient.license.mintLicenseTokens({
				licenseTermsId: BigInt(input.licenseTermsId),
				licensorIpId: input.parentIpId,
				amount: 1,
			});

			const licenseTokenId = mintResult.licenseTokenIds?.[0];
			if (!licenseTokenId) {
				throw new Error("Failed to mint license token");
			}

			console.log("✅ License token minted:", licenseTokenId.toString());
			console.log("🔗 Transaction Hash:", mintResult.txHash);

		// 2. Upload remix content to IPFS
		console.log("📤 Uploading remix to IPFS...");
		const metadata: StoryMetadata = {
			title: input.title,
			description: input.description,
			content: input.content,
			author: address,
			createdAt: Date.now(),
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

			// 3. Register remix as IP asset AND link to parent as derivative (combined)
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

			// 4. Attach license terms to the derivative IP asset
			console.log("📋 Attaching license terms to derivative...");
			const attachLicenseResponse = await storyClient.license.attachLicenseTerms({
				ipId: registration.ipId as `0x${string}`,
				licenseTermsId: BigInt(input.licenseTermsId),
			});

			console.log("✅ License terms attached to derivative!");
			console.log("🔗 License Attachment TX:", attachLicenseResponse.txHash);

			// 5. Save remix to local storage
			const derivativeStory: SavedStory = {
				id: ipfsHash,
				ipId: registration.ipId,
				ipfsHash,
				tokenURI,
				metadata,
				author: address,
				timestamp: Date.now(),
				status: "derivative_registered",
				mintingFee: input.mintingFee || "0",
				commercialRevShare: input.commercialRevShare || 0,
				licenseTermsId: input.licenseTermsId,
				parentIpId: input.parentIpId,
				licenseTokenId: licenseTokenId.toString(),
				derivativeTxHash: registration.txHash,
				txHash: registration.txHash,
				licenseAttachmentTxHash: attachLicenseResponse.txHash,
				remixOf: input.parentTitle,
			};

			try {
				const existingStories: SavedStory[] = JSON.parse(
					localStorage.getItem("myStories") || "[]",
				);
				existingStories.unshift(derivativeStory);
				localStorage.setItem("myStories", JSON.stringify(existingStories));
				console.log("💾 Remix saved to local storage");
			} catch (storageError) {
				console.warn("⚠️ Unable to persist remix locally:", storageError);
			}

			console.log("🎉 Remix created successfully!");

			return {
				ipId: registration.ipId,
				ipfsHash,
				tokenURI,
				licenseTokenId: licenseTokenId.toString(),
				parentIpId: input.parentIpId,
				txHash: registration.txHash,
				derivativeTxHash: registration.txHash,
				licenseAttachmentTxHash: attachLicenseResponse.txHash,
			};
		},
	});
};
