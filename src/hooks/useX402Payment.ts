import { useState, useEffect } from "react";
import type { SavedStory } from "../hooks/useCreateStory";
import type { PaymentState } from "../types/payment";
import { hasUserPaid } from "../utils/x402";

export const useX402Payment = (story: SavedStory) => {
	const [paymentState, setPaymentState] = useState<PaymentState>({
		isPaid: false,
		isLoading: false,
	});

	// Check if user has already paid on mount
	useEffect(() => {
		const isPaid = hasUserPaid(story.id);
		setPaymentState((prev) => ({ ...prev, isPaid }));
	}, [story.id]);

	const pay = async (): Promise<void> => {
		// Payment feature removed - this hook is no longer used
		return;
	};

	const checkPaid = (): boolean => {
		return false;
	};

	return {
		pay,
		checkPaid,
		isPaid: paymentState.isPaid,
		isLoading: paymentState.isLoading,
		error: paymentState.error,
	};
};
