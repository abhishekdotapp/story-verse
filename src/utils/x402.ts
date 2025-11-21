import type { PaidStory } from "../types/payment";

const PAID_STORIES_KEY = "paidStories";

/**
 * Get all paid stories from localStorage
 */
export function getPaidStories(): PaidStory[] {
	try {
		const data = localStorage.getItem(PAID_STORIES_KEY);
		return data ? JSON.parse(data) : [];
	} catch (error) {
		console.error("Failed to get paid stories:", error);
		return [];
	}
}

/**
 * Check if user has already paid for a story
 */
export function hasUserPaid(storyId: string): boolean {
	const paidStories = getPaidStories();
	return paidStories.some((story) => story.storyId === storyId);
}

/**
 * Save payment proof to localStorage
 */
export function savePaymentProof(payment: PaidStory): void {
	try {
		const paidStories = getPaidStories();
		// Check if already exists (prevent duplicates)
		if (!paidStories.some((s) => s.storyId === payment.storyId)) {
			paidStories.push(payment);
			localStorage.setItem(PAID_STORIES_KEY, JSON.stringify(paidStories));
		}
	} catch (error) {
		console.error("Failed to save payment proof:", error);
	}
}

/**
 * Get payment proof for a specific story
 */
export function getPaymentProof(storyId: string): PaidStory | null {
	const paidStories = getPaidStories();
	return paidStories.find((story) => story.storyId === storyId) || null;
}

/**
 * Convert USDC amount to wei (6 decimals for USDC)
 */
export function usdcToWei(amount: string): bigint {
	const usdcDecimals = 6;
	const [whole, decimal = ""] = amount.split(".");
	const paddedDecimal = decimal.padEnd(usdcDecimals, "0").slice(0, usdcDecimals);
	const weiString = whole + paddedDecimal;
	return BigInt(weiString);
}

/**
 * Convert wei to USDC display amount
 */
export function weiToUsdc(wei: bigint): string {
	const usdcDecimals = 6;
	const divisor = BigInt(10 ** usdcDecimals);
	const whole = wei / divisor;
	const remainder = wei % divisor;
	const decimal = remainder.toString().padStart(usdcDecimals, "0");
	return `${whole}.${decimal}`.replace(/\.?0+$/, "");
}

/**
 * Format USDC amount for display
 */
export function formatUsdc(amount: string): string {
	const num = parseFloat(amount);
	if (isNaN(num)) return "$0.00";
	return `$${num.toFixed(2)}`;
}

/**
 * Get total earnings for a creator from a specific story
 */
export function getStoryEarnings(storyId: string, creatorAddress: string): {
	totalAmount: string;
	paymentCount: number;
} {
	const paidStories = getPaidStories();
	const payments = paidStories.filter(
		(payment) =>
			payment.storyId === storyId &&
			payment.creatorAddress.toLowerCase() === creatorAddress.toLowerCase()
	);

	const totalAmount = payments.reduce((sum, payment) => {
		return sum + parseFloat(payment.amount);
	}, 0);

	return {
		totalAmount: totalAmount.toFixed(2),
		paymentCount: payments.length,
	};
}

/**
 * Get total earnings for all stories by a creator
 */
export function getTotalEarnings(creatorAddress: string): {
	totalAmount: string;
	paymentCount: number;
	paidStories: string[];
} {
	const paidStories = getPaidStories();
	const payments = paidStories.filter(
		(payment) =>
			payment.creatorAddress.toLowerCase() === creatorAddress.toLowerCase()
	);

	const totalAmount = payments.reduce((sum, payment) => {
		return sum + parseFloat(payment.amount);
	}, 0);

	const uniqueStories = [...new Set(payments.map((p) => p.storyId))];

	return {
		totalAmount: totalAmount.toFixed(2),
		paymentCount: payments.length,
		paidStories: uniqueStories,
	};
}
