import { motion } from "framer-motion";
import { BookOpen, CheckCircle, Copy, ExternalLink, Loader2 } from "lucide-react";
import { useState } from "react";
import { useAccount } from "wagmi";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import { useFetchMyStoriesFromDb } from "../../hooks/useFetchStoriesFromDb";

export const MyStories = () => {
	const { address } = useAccount();
	const { data: stories = [], isLoading } = useFetchMyStoriesFromDb(address);
	const [copiedId, setCopiedId] = useState<string | null>(null);

	const copyToClipboard = (text: string, id: string) => {
		navigator.clipboard.writeText(text);
		setCopiedId(id);
		setTimeout(() => setCopiedId(null), 2000);
	};

	if (!address) {
		return (
			<Card className="p-8 text-center">
				<BookOpen className="mx-auto h-12 w-12 text-gray-500 mb-4" />
				<h3 className="text-xl font-semibold text-white mb-2">
					Connect Your Wallet
				</h3>
				<p className="text-gray-400">
					Please connect your wallet to view your stories
				</p>
			</Card>
		);
	}

	if (isLoading) {
		return (
			<Card className="p-8 text-center">
				<Loader2 className="mx-auto h-12 w-12 text-purple-500 mb-4 animate-spin" />
				<h3 className="text-xl font-semibold text-white mb-2">
					Loading Your Stories...
				</h3>
				<p className="text-gray-400">Fetching from blockchain</p>
			</Card>
		);
	}

	if (stories.length === 0) {
		return (
			<Card className="p-8 text-center">
				<BookOpen className="mx-auto h-12 w-12 text-gray-500 mb-4" />
				<h3 className="text-xl font-semibold text-white mb-2">
					No Stories Yet
				</h3>
				<p className="text-gray-400">Create your first story to see it here!</p>
			</Card>
		);
	}

	return (
		<div className="space-y-4">
			<div className="mb-6">
				<h2 className="text-2xl font-bold text-white mb-2">My Stories</h2>
				<p className="text-gray-400 text-sm">
					{stories.length} {stories.length === 1 ? "story" : "stories"} created
				</p>
			</div>

			<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
				{stories.map((story, index) => (
					<motion.div
						key={story.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3, delay: index * 0.1 }}
					>
						<Card className="p-5 hover:border-purple-500/50 transition-all">
							<div className="flex items-start justify-between mb-3">
								<div className="flex items-center gap-2">
									<Badge
										tone={
											story.status === "license_attached" ||
											story.status === "license_registered"
												? "success"
												: story.status?.includes("derivative")
													? "warning"
													: "info"
										}
										className="text-xs"
									>
										{story.status === "license_attached"
											? "Licensed IP"
											: story.status === "license_registered"
												? "Registered"
											: story.status === "derivative_registered"
												? "Derivative"
												: (story.status ?? "Draft")}
								</Badge>
							</div>
							<span className="text-xs text-gray-500">
								{new Date(story.timestamp).toLocaleDateString()}
							</span>
							</div>

							<h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
								{story.metadata.title}
							</h3>

							<p className="text-sm text-gray-400 mb-4 line-clamp-3">
								{story.metadata.description}
							</p>

							{story.remixOf && (
								<p className="text-xs text-yellow-400 mb-2">
									Remix of: {story.remixOf}
								</p>
							)}

							<div className="space-y-2 mb-4">
								<div className="flex items-center justify-between text-xs">
									<span className="text-gray-500">License Fee:</span>
									<span className="text-purple-400 font-mono">
										{story.mintingFee} IP
									</span>
								</div>
								<div className="flex items-center justify-between text-xs">
									<span className="text-gray-500">Revenue Share:</span>
									<span className="text-purple-400 font-mono">
										{story.commercialRevShare}%
									</span>
								</div>
								{story.licenseTermsId ? (
									<div className="flex items-center justify-between text-xs">
										<span className="text-gray-500">License ID:</span>
										<span className="text-green-400 font-mono text-xs">
											{String(story.licenseTermsId).slice(0, 8)}...
										</span>
								</div>
							) : null}
						</div>							{story.ipId && (
								<div className="rounded-lg bg-gray-900/60 border border-gray-800 p-3 mb-4">
									<p className="text-xs text-gray-500 mb-1">IP Asset ID</p>
									<code className="text-xs text-purple-400 font-mono break-all">
										{story.ipId}
									</code>
								</div>
							)}

							<div className="border-t border-gray-800 pt-4 space-y-2">
								<div className="flex items-center gap-2">
									<span className="text-xs text-gray-500">IPFS Hash:</span>
									<code className="text-xs text-purple-400 font-mono flex-1 truncate">
										{story.ipfsHash}
									</code>
									<button
										type="button"
										onClick={() => copyToClipboard(story.ipfsHash, story.id)}
										className="text-gray-400 hover:text-white transition"
										title="Copy IPFS Hash"
									>
										{copiedId === story.id ? (
											<CheckCircle className="h-4 w-4 text-green-400" />
										) : (
											<Copy className="h-4 w-4" />
										)}
									</button>
								</div>

								<div className="flex gap-2 mt-4">
									<a
										href={`https://ipfs.io/ipfs/${story.ipfsHash}`}
										target="_blank"
										rel="noopener noreferrer"
										className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-400 text-xs rounded-lg transition"
									>
										<ExternalLink className="h-3 w-3" />
										View IPFS
									</a>
									<div className="flex-1 space-y-2 text-xs">
										{story.mintTxHash && (
											<a
												href={`https://aeneid.storyscan.xyz/tx/${story.mintTxHash}`}
												target="_blank"
												rel="noopener noreferrer"
												className="flex w-full items-center justify-center gap-2 px-3 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-400 rounded-lg transition"
											>
												<ExternalLink className="h-3 w-3" />
												NFT Mint
											</a>
										)}
										{story.ipRegistrationTxHash && (
											<a
												href={`https://aeneid.storyscan.xyz/tx/${story.ipRegistrationTxHash}`}
												target="_blank"
												rel="noopener noreferrer"
												className="flex w-full items-center justify-center gap-2 px-3 py-2 bg-teal-600/20 hover:bg-teal-600/30 border border-teal-500/30 text-teal-400 rounded-lg transition"
											>
												<ExternalLink className="h-3 w-3" />
												IP Registration
											</a>
										)}
										{story.licenseAttachmentTxHash && (
											<a
												href={`https://aeneid.storyscan.xyz/tx/${story.licenseAttachmentTxHash}`}
												target="_blank"
												rel="noopener noreferrer"
												className="flex w-full items-center justify-center gap-2 px-3 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-400 rounded-lg transition"
											>
												<ExternalLink className="h-3 w-3" />
												License Attachment
											</a>
										)}
										{story.txHash && (
											<a
												href={`https://aeneid.storyscan.xyz/tx/${story.txHash}`}
												target="_blank"
												rel="noopener noreferrer"
												className="flex w-full items-center justify-center gap-2 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 rounded-lg transition"
											>
												<ExternalLink className="h-3 w-3" />
												License Registration
											</a>
										)}
									</div>
								</div>
							</div>
						</Card>
					</motion.div>
				))}
			</div>

			<div className="mt-6 rounded-lg border border-green-500/30 bg-green-500/10 p-4">
				<h4 className="text-sm font-semibold text-green-400 mb-2">
					✅ Your Stories Are Registered!
				</h4>
				<p className="text-xs text-gray-300 mb-2">
					Each story you create includes:
				</p>
				<ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
					<li>Permanent IPFS storage for content</li>
					<li>On-chain license terms registration</li>
					<li>Verified blockchain transaction</li>
					<li>Commercial remix licensing enabled</li>
				</ul>
				<div className="mt-3 flex gap-2">
					<a
						href="https://aeneid.storyscan.xyz"
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg transition"
					>
						<ExternalLink className="h-3 w-3" />
						View on Explorer
					</a>
					<a
						href="https://docs.story.foundation"
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition"
					>
						<BookOpen className="h-3 w-3" />
						Learn More
					</a>
				</div>
			</div>
		</div>
	);
};
