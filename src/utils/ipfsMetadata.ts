import type { SavedStory } from "../hooks/useCreateStory";

interface IpfsMetadata {
	appId?: string;
	appVersion?: string;
	title?: string;
	description?: string;
	content?: string;
	author?: string;
	creatorName?: string;
	image?: string;
	imageHash?: string;
	createdAt?: number;
	ipType?: string;
	attributes?: Array<{
		trait_type: string;
		value: string | number;
	}>;
	creators?: Array<{
		name: string;
		address: string;
		contributionPercent: number;
	}>;
	parentIpId?: string;
	licenseTermsId?: string;
	mintingFee?: string;
	commercialRevShare?: string;
	// Some metadata uses different field names
	name?: string;
	[key: string]: any; // Allow other fields
}

export const fetchMetadataFromIPFS = async (ipfsHash: string): Promise<IpfsMetadata | null> => {
	try {
		// Try multiple IPFS gateways for reliability
		const gateways = [
			`https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
			`https://ipfs.io/ipfs/${ipfsHash}`,
			`https://cloudflare-ipfs.com/ipfs/${ipfsHash}`,
		];

		for (const gateway of gateways) {
			try {
				const response = await fetch(gateway, {
					method: "GET",
					headers: {
						Accept: "application/json",
					},
					signal: AbortSignal.timeout(10000), // 10 second timeout
				});

				if (response.ok) {
					const data = await response.json();
					return data;
				}
			} catch (error) {
				console.warn(`Failed to fetch from ${gateway}:`, error);
				continue;
			}
		}

		console.error(`Failed to fetch metadata from all gateways for ${ipfsHash}`);
		return null;
	} catch (error) {
		console.error("Error fetching IPFS metadata:", error);
		return null;
	}
};

export const convertIpfsMetadataToStory = (
	metadata: IpfsMetadata,
	ipId: string,
	tokenId: string,
	nftMetadataHash: string
): SavedStory => {
	// Extract author from various possible fields
	const author = metadata.author 
		|| metadata.creators?.[0]?.address 
		|| "0x0000000000000000000000000000000000000000";
	
	const creatorName = metadata.creatorName 
		|| metadata.creators?.[0]?.name 
		|| "Anonymous";
	
	const title = metadata.title || metadata.name || "Untitled Story";
	const description = metadata.description || "";
	const content = metadata.content || "";

	// Extract IPFS hash from image URL (format: ipfs://QmXXX or just QmXXX)
	let imageIPFSHash: string | undefined;
	if (metadata.image) {
		const imageStr = metadata.image;
		if (imageStr.startsWith("ipfs://")) {
			imageIPFSHash = imageStr.replace("ipfs://", "");
		} else if (imageStr.startsWith("Qm") || imageStr.startsWith("bafy")) {
			imageIPFSHash = imageStr;
		}
	}

	return {
		id: ipId,
		ipId: ipId,
		tokenId: tokenId,
		nftContract: "0xc32A8a0FF3beDDDa58393d022aF433e78739FAbc", // STORY_NFT_COLLECTION
		ipfsHash: nftMetadataHash,
		tokenURI: `ipfs://${nftMetadataHash}`,
		status: "license_attached",
		author: author,
		timestamp: metadata.createdAt || Date.now(),
		mintingFee: metadata.mintingFee || "0",
		commercialRevShare: Number(metadata.commercialRevShare || 0),
		parentIpId: metadata.parentIpId,
		licenseTermsId: metadata.licenseTermsId,
		imageIPFSHash: imageIPFSHash,
		metadata: {
			title: title,
			description: description,
			content: content,
			author: author,
			creatorName: creatorName,
			createdAt: metadata.createdAt || Date.now(),
			creators: metadata.creators,
			image: metadata.image,
			imageHash: metadata.imageHash,
			ipType: metadata.ipType || "Story",
			attributes: metadata.attributes || [
				{ trait_type: "Type", value: "Story" },
				{ trait_type: "License", value: metadata.licenseTermsId ? "Commercial" : "Non-Commercial" }
			],
		},
	};
};
