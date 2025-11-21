export interface Story {
	id: string;
	ipId: string;
	nftContract: string;
	tokenId: string;
	title: string;
	content: string;
	author: string;
	authorName?: string;
	thumbnail?: string;
	createdAt: number;
	licenseTermsId?: string;
	licenseFee?: string;
	commercialRevShare?: number;
	currency?: string;
	parentIpId?: string;
	isDerivative: boolean;
	txHash?: string;
	// x402 payment fields
	requiresPayment?: boolean;
	readingFee?: string; // USDC amount
	creatorAddress?: string; // For x402 payTo
}

export interface LicenseTerms {
	licenseTermsId: string;
	mintingFee: string;
	commercialRevShare: number;
	currency: string;
	royaltyPolicy?: string;
}

export interface DerivativeInfo {
	parentIpId: string;
	childIpId: string;
	licenseTokenId: string;
	timestamp: number;
}
