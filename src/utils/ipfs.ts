const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;
const PINATA_API_URL = "https://api.pinata.cloud";

// Hash a string using SHA-256
export const hashString = async (str: string): Promise<string> => {
	const encoder = new TextEncoder();
	const data = encoder.encode(str);
	const hashBuffer = await crypto.subtle.digest("SHA-256", data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return `0x${hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")}`;
};

// Hash file content using SHA-256
export const hashFile = async (file: File): Promise<string> => {
	const arrayBuffer = await file.arrayBuffer();
	const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return `0x${hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")}`;
};

// Hash URL content using SHA-256
export const hashUrl = async (url: string): Promise<string> => {
	try {
		const response = await fetch(url);
		const arrayBuffer = await response.arrayBuffer();
		const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		return `0x${hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")}`;
	} catch (error) {
		console.error("Error hashing URL:", error);
		throw error;
	}
};

export interface IpCreator {
	name: string;
	address: string;
	contributionPercent: number;
	description?: string;
	image?: string;
	role?: string;
	socialMedia?: Array<{
		platform: string;
		url: string;
	}>;
}

	export interface StoryMetadata {
	// App identifier to filter stories
	appId?: string;
	appVersion?: string;

	// IP Asset information
	ipId?: string;
	tokenId?: string;
	
	// License terms
	mintingFee?: string;
	commercialRevShare?: string;
	licenseTermsId?: string;

	// Required for explorer display
	title: string;
	description: string;
	image?: string;
	imageHash?: string;
	creators?: IpCreator[];
	createdAt: number;

	// Additional fields
	content: string;
	author: string;
	creatorName?: string;

	// Required for commercial infringement check
	mediaUrl?: string;
	mediaHash?: string;
	mediaType?: string;

	// Optional
	attributes?: Array<{
		trait_type: string;
		value: string | number;
	}>;
	tags?: string[];
	ipType?: string;
	
	// x402 payment fields
	requiresPayment?: boolean;
	readingFee?: string;
	creatorAddress?: string;
}

// Upload a file to IPFS and return its hash
export const uploadFileToIPFS = async (file: File): Promise<string> => {
	if (!PINATA_JWT || PINATA_JWT === "your_pinata_jwt_here") {
		console.warn("⚠️ Pinata JWT not configured. Using mock IPFS hash.");
		return `QmFile${Math.random().toString(36).substring(2, 15)}${Date.now()}`;
	}

	try {
		const formData = new FormData();
		formData.append("file", file);

		const response = await fetch(
			`${PINATA_API_URL}/pinning/pinFileToIPFS`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${PINATA_JWT}`,
				},
				body: formData,
			},
		);

		if (!response.ok) {
			throw new Error(`Pinata file upload failed: ${response.statusText}`);
		}

		const data = await response.json();
		return data.IpfsHash;
	} catch (error) {
		console.error("Error uploading file to IPFS:", error);
		throw new Error("Failed to upload image to IPFS");
	}
};

export const uploadToIPFS = async (
	metadata: StoryMetadata,
): Promise<string> => {
	if (!PINATA_JWT || PINATA_JWT === "your_pinata_jwt_here") {
		// Fallback for development - return mock IPFS hash
		console.warn("⚠️ Pinata JWT not configured. Using mock IPFS hash.");
		const mockHash = `Qm${Math.random().toString(36).substring(2, 15)}mock${Date.now()}`;
		return mockHash;
	}

	try {
		const response = await fetch(`${PINATA_API_URL}/pinning/pinJSONToIPFS`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${PINATA_JWT}`,
			},
			body: JSON.stringify({
				pinataContent: metadata,
				pinataMetadata: {
					name: `story-${metadata.title.slice(0, 20)}-${Date.now()}`,
				},
			}),
		});

		if (!response.ok) {
			throw new Error(`Pinata upload failed: ${response.statusText}`);
		}

		const data = await response.json();
		return data.IpfsHash;
	} catch (error) {
		console.error("Error uploading to IPFS:", error);
		throw new Error("Failed to upload story to IPFS");
	}
};

export const getIPFSUrl = (hash: string): string => {
	return `https://gateway.pinata.cloud/ipfs/${hash}`;
};

export const fetchFromIPFS = async (hash: string): Promise<StoryMetadata> => {
	try {
		const response = await fetch(getIPFSUrl(hash));
		if (!response.ok) {
			throw new Error("Failed to fetch from IPFS");
		}
		return await response.json();
	} catch (error) {
		console.error("Error fetching from IPFS:", error);
		throw new Error("Failed to fetch story from IPFS");
	}
};
