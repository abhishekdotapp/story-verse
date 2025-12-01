import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, X } from "lucide-react";

export interface TransactionStep {
	id: string;
	title: string;
	description: string;
	status: "pending" | "loading" | "completed" | "error";
	txHash?: string;
}

interface TransactionProgressModalProps {
	isOpen: boolean;
	onClose: () => void;
	steps: TransactionStep[];
	title?: string;
}

export const TransactionProgressModal = ({
	isOpen,
	onClose,
	steps,
	title = "Transaction Progress",
}: TransactionProgressModalProps) => {
	const allCompleted = steps.every((step) => step.status === "completed");
	const hasError = steps.some((step) => step.status === "error");

	return (
		<AnimatePresence>
			{isOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={allCompleted || hasError ? onClose : undefined}
						className="absolute inset-0 bg-black/80 backdrop-blur-sm"
					/>

					{/* Modal */}
					<motion.div
						initial={{ opacity: 0, scale: 0.95, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: 20 }}
						className="relative w-full max-w-2xl bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-purple-500/30 shadow-2xl overflow-hidden"
					>
						{/* Header */}
						<div className="border-b border-purple-500/30 bg-gradient-to-r from-purple-900/20 to-pink-900/20 p-6">
							<div className="flex items-center justify-between">
								<div>
									<h2 className="text-2xl font-bold text-white">{title}</h2>
									<p className="text-sm text-gray-400 mt-1">
										{allCompleted
											? "All transactions completed successfully!"
											: hasError
											? "Transaction failed"
											: "Processing your transactions..."}
									</p>
								</div>
								{(allCompleted || hasError) && (
									<button
										onClick={onClose}
										className="p-2 hover:bg-white/10 rounded-lg transition"
									>
										<X className="h-5 w-5 text-gray-400" />
									</button>
								)}
							</div>
						</div>

						{/* Steps */}
						<div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
							{steps.map((step, index) => (
								<motion.div
									key={step.id}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: index * 0.1 }}
									className={`flex items-start gap-4 p-4 rounded-xl border ${
										step.status === "completed"
											? "bg-green-500/10 border-green-500/30"
											: step.status === "error"
											? "bg-red-500/10 border-red-500/30"
											: step.status === "loading"
											? "bg-purple-500/10 border-purple-500/30"
											: "bg-gray-800/50 border-gray-700/30"
									}`}
								>
									{/* Status Icon */}
									<div className="flex-shrink-0 mt-1">
										{step.status === "completed" ? (
											<motion.div
												initial={{ scale: 0 }}
												animate={{ scale: 1 }}
												className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center"
											>
												<Check className="h-4 w-4 text-white" />
											</motion.div>
										) : step.status === "loading" ? (
											<div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
												<Loader2 className="h-4 w-4 text-white animate-spin" />
											</div>
										) : step.status === "error" ? (
											<div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
												<X className="h-4 w-4 text-white" />
											</div>
										) : (
											<div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center">
												<span className="text-xs text-gray-400">{index + 1}</span>
											</div>
										)}
									</div>

									{/* Content */}
									<div className="flex-1 min-w-0">
										<h3
											className={`font-semibold ${
												step.status === "completed"
													? "text-green-400"
													: step.status === "error"
													? "text-red-400"
													: step.status === "loading"
													? "text-purple-400"
													: "text-gray-400"
											}`}
										>
											{step.title}
										</h3>
										<p className="text-sm text-gray-400 mt-1">
											{step.description}
										</p>
										{step.txHash && (
											<a
												href={`https://testnet.storyscan.xyz/tx/${step.txHash}`}
												target="_blank"
												rel="noopener noreferrer"
												className="text-xs text-purple-400 hover:text-purple-300 mt-2 inline-flex items-center gap-1"
											>
												View transaction ↗
											</a>
										)}
									</div>
								</motion.div>
							))}
						</div>

						{/* Footer */}
						{(allCompleted || hasError) && (
							<div className="border-t border-purple-500/30 bg-gradient-to-r from-purple-900/10 to-pink-900/10 p-6">
								<button
									onClick={onClose}
									className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition shadow-lg shadow-purple-500/25"
								>
									{allCompleted ? "Continue" : "Close"}
								</button>
							</div>
						)}
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
};
