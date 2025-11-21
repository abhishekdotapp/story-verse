// x402 Payment Protocol Types

export interface PaymentRequirement {
	x402Version: number;
	scheme: string; // "exact"
	network: string; // "base-sepolia"
	maxAmountRequired: string; // in atomic units (wei)
	resource: string;
	description: string;
	payTo: string; // creator's address
	asset: string; // ERC20 contract address (USDC)
}

export interface PaymentRequiredResponse {
	x402Version: number;
	accepts: PaymentRequirement[];
}

export interface PaymentPayload {
	x402Version: number;
	scheme: string;
	network: string;
	payload: any; // scheme dependent
}

export interface VerificationResponse {
	verified: boolean;
	txHash?: string;
	message?: string;
}

export interface PaidStory {
	storyId: string;
	txHash: string;
	paidAt: number;
	amount: string;
	creatorAddress: string;
}

export interface PaymentState {
	isPaid: boolean;
	isLoading: boolean;
	error?: string;
}
