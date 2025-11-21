import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Loader2, CheckCircle } from "lucide-react";
import { useState } from "react";
import { parseEther } from "viem";
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { Button } from "../ui/Button";
import type { SavedStory } from "../../hooks/useCreateStory";

interface PaymentModalProps {
	isOpen: boolean;
	onClose: () => void;
	story: SavedStory;
	onPaymentSuccess: () => void;
}

export const PaymentModal = ({
	isOpen,
	onClose,
	story,
	onPaymentSuccess,
}: PaymentModalProps) => {
	const { address } = useAccount();
	const [error, setError] = useState<string | null>(null);
	
	const { data: txHash, isPending, sendTransaction } = useSendTransaction();
	
	const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
		hash: txHash,
	});

	// Payment feature removed - this component is not used anymore
	const readingFee = "0.01";
	const creatorAddress = story.author;

	const handlePayment = async () => {
		setError(null);

		if (!address) {
			setError("Please connect your wallet");
			return;
		}

		try {
			// Send IP tokens directly to creator
			sendTransaction({
				to: creatorAddress as `0x${string}`,
				value: parseEther(readingFee),
			});
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "Payment failed. Please try again."
			);
		}
	};

	// Handle successful payment
	if (isSuccess && txHash) {
		// Save payment proof to localStorage
		const payment = {
			storyId: story.id,
			txHash: txHash,
			paidAt: Date.now(),
			amount: readingFee,
			creatorAddress: creatorAddress,
		};

		const paidStories = JSON.parse(
			localStorage.getItem("paidStories") || "[]"
		);
		
		// Check if not already recorded
		if (!paidStories.some((p: any) => p.storyId === story.id && p.txHash === txHash)) {
			paidStories.push(payment);
			localStorage.setItem("paidStories", JSON.stringify(paidStories));
		}

		setTimeout(() => {
			onPaymentSuccess();
			onClose();
		}, 1500);
	}

	const isProcessing = isPending || isConfirming;

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
					/>

					{/* Modal */}
					<motion.div
						initial={{ opacity: 0, scale: 0.95, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: 20 }}
						className="fixed inset-0 z-50 flex items-center justify-center p-4"
					>
						<div className="relative w-full max-w-md rounded-xl border border-purple-500/30 bg-gray-900 p-6 shadow-2xl shadow-purple-500/20">
							{/* Close Button */}
							<button
								onClick={onClose}
								className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-800 hover:text-gray-200 transition-colors"
							>
								<X className="h-5 w-5" />
							</button>

							{/* Success State */}
							{isSuccess ? (
								<div className="text-center py-8">
									<motion.div
										initial={{ scale: 0 }}
										animate={{ scale: 1 }}
										className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 text-green-400"
									>
										<CheckCircle className="h-8 w-8" />
									</motion.div>
									<h3 className="text-xl font-bold text-green-400 mb-2">
										Payment Successful!
									</h3>
									<p className="text-gray-300">
										Story unlocked. Enjoy reading!
									</p>
								</div>
							) : (
								<>
									{/* Header */}
									<div className="mb-6 text-center">
										<div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/20 text-purple-400">
											<Lock className="h-6 w-6" />
										</div>
										<h3 className="text-xl font-bold text-gray-100 mb-2">
											Unlock Story
										</h3>
										<p className="text-sm text-gray-400">
											Pay once to read the full story
										</p>
									</div>

									{/* Story Info */}
									<div className="mb-6 rounded-lg border border-gray-800 bg-gray-800/50 p-4">
										<h4 className="font-semibold text-gray-200 mb-1">
											{story.metadata.title}
										</h4>
										<p className="text-xs text-gray-400">
											by {story.metadata.creatorName || "Anonymous"}
										</p>
									</div>

									{/* Payment Amount */}
							<div className="mb-6 rounded-lg border border-purple-500/30 bg-purple-500/10 p-4">
								<div className="flex items-center justify-between">
									<span className="text-sm text-gray-300">
										Reading Fee
									</span>
									<span className="text-2xl font-bold text-purple-400">
										{readingFee} IP
									</span>
								</div>
								<p className="mt-2 text-xs text-gray-400">
									Direct payment to creator • Story Protocol network
								</p>
							</div>									{/* Error Message */}
									{error && (
										<div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3">
											<p className="text-sm text-red-400">{error}</p>
										</div>
									)}

									{/* Payment Button */}
									<Button
										onClick={handlePayment}
										disabled={isProcessing}
										className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
										variant="primary"
									>
										{isProcessing ? (
											<>
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
												{isPending ? "Confirm in wallet..." : "Confirming payment..."}
											</>
									) : (
										<>
											<Lock className="mr-2 h-4 w-4" />
											Pay {readingFee} IP to Read
										</>
									)}
								</Button>

								{/* Info Text */}
								<p className="mt-4 text-center text-xs text-gray-500">
									Payment sent directly to creator on Story Protocol
									</p>
								</>
							)}
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
};
