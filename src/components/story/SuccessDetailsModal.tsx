import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Copy, ExternalLink, X } from "lucide-react";
import { useState } from "react";

interface SuccessDetailsModalProps {
	isOpen: boolean;
	onClose: () => void;
	details: {
		ipId?: string;
		tokenId?: string;
		ipfsHash?: string;
		txHash?: string;
		mintTxHash?: string;
		ipRegistrationTxHash?: string;
		licenseAttachmentTxHash?: string;
		licenseTermsId?: string;
		commercialRevShare?: number;
		title?: string;
	};
}

export const SuccessDetailsModal = ({
	isOpen,
	onClose,
	details,
}: SuccessDetailsModalProps) => {
	const [copiedField, setCopiedField] = useState<string | null>(null);

	const copyToClipboard = (text: string, field: string) => {
		navigator.clipboard.writeText(text);
		setCopiedField(field);
		setTimeout(() => setCopiedField(null), 2000);
	};

	const CopyButton = ({ text, field }: { text: string; field: string }) => (
		<button
			type="button"
			onClick={() => copyToClipboard(text, field)}
			className="p-1 hover:bg-white/10 rounded transition"
			title="Copy"
		>
			{copiedField === field ? (
				<CheckCircle className="h-4 w-4 text-green-400" />
			) : (
				<Copy className="h-4 w-4 text-gray-400" />
			)}
		</button>
	);

	const DetailRow = ({
		label,
		value,
		txHash,
		copyField,
	}: {
		label: string;
		value: string;
		txHash?: string;
		copyField: string;
	}) => (
		<div className="flex items-start justify-between gap-4 p-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
			<div className="flex-1 min-w-0">
				<p className="text-xs text-gray-500 mb-1">{label}</p>
				<code className="text-xs text-purple-400 font-mono break-all">
					{value}
				</code>
			</div>
			<div className="flex items-center gap-1 flex-shrink-0">
				<CopyButton text={value} field={copyField} />
				{txHash && (
					<a
						href={`https://aeneid.storyscan.xyz/tx/${txHash}`}
						target="_blank"
						rel="noopener noreferrer"
						className="p-1 hover:bg-white/10 rounded transition"
						title="View on Explorer"
					>
						<ExternalLink className="h-4 w-4 text-gray-400" />
					</a>
				)}
			</div>
		</div>
	);

	return (
		<AnimatePresence>
			{isOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="absolute inset-0 bg-black/80 backdrop-blur-sm"
					/>

					{/* Modal */}
					<motion.div
						initial={{ opacity: 0, scale: 0.95, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: 20 }}
						className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-green-500/30 shadow-2xl"
					>
						{/* Header */}
						<div className="sticky top-0 z-10 border-b border-green-500/30 bg-gradient-to-r from-green-900/20 to-emerald-900/20 backdrop-blur-sm p-6">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
										<CheckCircle className="h-6 w-6 text-green-400" />
									</div>
									<div>
										<h2 className="text-2xl font-bold text-white">
											Story Created Successfully!
										</h2>
										{details.title && (
											<p className="text-sm text-gray-400 mt-1">
												"{details.title}"
											</p>
										)}
									</div>
								</div>
								<button
									onClick={onClose}
									className="p-2 hover:bg-white/10 rounded-lg transition"
								>
									<X className="h-5 w-5 text-gray-400" />
								</button>
							</div>
						</div>

						{/* Content */}
						<div className="p-6 space-y-6">
							{/* IP Asset Details */}
							<div className="space-y-3">
								<h3 className="text-lg font-semibold text-white flex items-center gap-2">
									📝 IP Asset Information
								</h3>

								{details.ipId && (
									<DetailRow
										label="IP Asset ID"
										value={details.ipId}
										copyField="ipId"
									/>
								)}

								{details.tokenId && (
									<DetailRow
										label="NFT Token ID"
										value={details.tokenId}
										copyField="tokenId"
									/>
								)}

								{details.ipfsHash && (
									<DetailRow
										label="IPFS Hash"
										value={details.ipfsHash}
										copyField="ipfsHash"
									/>
								)}

								{details.licenseTermsId && (
									<DetailRow
										label="License Terms ID"
										value={details.licenseTermsId}
										copyField="licenseTermsId"
									/>
								)}
							</div>

							{/* Transaction Hashes */}
							<div className="space-y-3">
								<h3 className="text-lg font-semibold text-white flex items-center gap-2">
									🔗 Transaction Hashes
								</h3>

								{details.txHash && (
									<DetailRow
										label="License Registration Transaction"
										value={details.txHash}
										txHash={details.txHash}
										copyField="txHash"
									/>
								)}

								{details.mintTxHash && (
									<DetailRow
										label="NFT Mint Transaction"
										value={details.mintTxHash}
										txHash={details.mintTxHash}
										copyField="mintTxHash"
									/>
								)}

								{details.ipRegistrationTxHash && (
									<DetailRow
										label="IP Registration Transaction"
										value={details.ipRegistrationTxHash}
										txHash={details.ipRegistrationTxHash}
										copyField="ipRegistrationTxHash"
									/>
								)}

								{details.licenseAttachmentTxHash && (
									<DetailRow
										label="License Attachment Transaction"
										value={details.licenseAttachmentTxHash}
										txHash={details.licenseAttachmentTxHash}
										copyField="licenseAttachmentTxHash"
									/>
								)}
							</div>

							{/* Commercial License Info */}
							<div className="rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 p-4">
								<h3 className="text-sm font-semibold text-yellow-400 mb-2">
									💰 Commercial License Active
								</h3>
								<p className="text-xs text-gray-300 mb-2">
									Your story is protected by a PIL (Programmable IP License) with
									commercial rights.
								</p>
								<ul className="text-xs text-gray-400 space-y-1">
									<li>
										✅ Revenue Share:{" "}
										<span className="text-purple-400 font-semibold">
											{details.commercialRevShare || 10}%
										</span>{" "}
										from all derivatives
									</li>
									<li>✅ Commercial Use: Allowed</li>
									<li>✅ Derivatives: Allowed with reciprocal terms</li>
									<li>✅ Attribution: Required</li>
								</ul>
							</div>

							{/* What's Next */}
							<div className="rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 p-4">
								<h3 className="text-sm font-semibold text-purple-400 mb-2">
									🎉 What's Next?
								</h3>
								<ul className="text-xs text-gray-300 space-y-1">
									<li>
										✨ Your story is now visible in the "My Stories" and
										"Marketplace" tabs
									</li>
									<li>
										🔄 Other creators can remix your story and you'll earn
										revenue
									</li>
									<li>
										💰 Check "My Stories" to claim accumulated royalties from
										remixes
									</li>
									<li>
										🌐 Your story is permanently stored on IPFS (decentralized
										storage)
									</li>
								</ul>
							</div>
						</div>

						{/* Footer */}
						<div className="border-t border-green-500/30 bg-gradient-to-r from-green-900/10 to-emerald-900/10 p-6">
							<div className="flex gap-3">
								{details.ipfsHash && (
									<a
										href={`https://ipfs.io/ipfs/${details.ipfsHash}`}
										target="_blank"
										rel="noopener noreferrer"
										className="flex-1 text-center px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
									>
										<ExternalLink className="h-4 w-4" />
										View on IPFS
									</a>
								)}
								{details.ipId && (
									<a
										href={`https://aeneid.storyscan.xyz/ipa/${details.ipId}`}
										target="_blank"
										rel="noopener noreferrer"
										className="flex-1 text-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
									>
										<ExternalLink className="h-4 w-4" />
										View IP Asset
									</a>
								)}
								<button
									onClick={onClose}
									className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition"
								>
									Close
								</button>
							</div>
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
};
