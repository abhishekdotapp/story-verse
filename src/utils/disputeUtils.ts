const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;
const PINATA_API_URL = "https://api.pinata.cloud";

/**
 * Upload dispute evidence to IPFS and return CIDv0 (Base58-encoded)
 */
export const uploadDisputeEvidenceToIPFS = async (evidence: string): Promise<string> => {
	if (!PINATA_JWT || PINATA_JWT === "your_pinata_jwt_here") {
		console.warn("⚠️ Pinata JWT not configured. Using mock dispute hash.");
		return `QmDispute${Math.random().toString(36).substring(2, 15)}${Date.now()}`;
	}

	try {
		// Upload raw text to IPFS via Pinata
		const formData = new FormData();
		formData.append("file", new Blob([evidence], { type: "text/plain" }), "evidence.txt");

		const response = await fetch(`${PINATA_API_URL}/pinning/pinFileToIPFS`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${PINATA_JWT}`,
			},
			body: formData,
		});

		if (!response.ok) {
			throw new Error(`Pinata upload failed: ${response.statusText}`);
		}

		const data = (await response.json()) as { IpfsHash: string };
		console.log("✅ Dispute evidence uploaded to IPFS:", data.IpfsHash);
		return data.IpfsHash; // Returns CIDv0
	} catch (error) {
		console.error("Error uploading dispute evidence:", error);
		throw error;
	}
};

/**
 * Dispute target tags from Story Protocol
 */
export const DisputeTag = {
	IMPROPER_REGISTRATION: "IMPROPER_REGISTRATION",
	IMPROPER_USAGE: "IMPROPER_USAGE",
	IMPROPER_PAYMENT: "IMPROPER_PAYMENT",
	CONTENT_STANDARDS_VIOLATION: "CONTENT_STANDARDS_VIOLATION",
} as const;

export type DisputeTag = (typeof DisputeTag)[keyof typeof DisputeTag];

export const DisputeTagLabels: Record<DisputeTag, string> = {
	IMPROPER_REGISTRATION: "Improper Registration",
	IMPROPER_USAGE: "Improper Usage",
	IMPROPER_PAYMENT: "Improper Payment",
	CONTENT_STANDARDS_VIOLATION: "Content Standards Violation",
};

export const DisputeTagDescriptions: Record<DisputeTag, string> = {
	IMPROPER_REGISTRATION: "IP was registered improperly or already exists",
	IMPROPER_USAGE: "Improper use of an IP Asset across multiple items",
	IMPROPER_PAYMENT: "Missing payments associated with this IP",
	CONTENT_STANDARDS_VIOLATION: "Violates content standards (hate, age, weapons, drugs, or pornography)",
};
