import { motion } from "framer-motion";
import { BookOpen, Calendar, ExternalLink, User, Image as ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";
import type { SavedStory } from "../../hooks/useCreateStory";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import { RemixStoryForm } from "./RemixStoryForm";
import { getIPFSUrl } from "../../utils/ipfs";

export const Marketplace = () => {
	const [stories, setStories] = useState<SavedStory[]>([]);
	const [selectedStory, setSelectedStory] = useState<SavedStory | null>(null);

	useEffect(() => {
		loadAllStories();
	}, []);

	const loadAllStories = () => {
		try {
			const savedStories = JSON.parse(
				localStorage.getItem("myStories") || "[]",
			);
			// Sort by newest first
			const sortedStories = savedStories.sort(
				(a: SavedStory, b: SavedStory) => b.timestamp - a.timestamp,
			);
			setStories(sortedStories);
		} catch (error) {
			console.error("Error loading stories:", error);
			setStories([]);
		}
	};

	const formatAddress = (address: string) => {
		return `${address.slice(0, 6)}...${address.slice(-4)}`;
	};

	if (stories.length === 0) {
		return (
			<Card className="p-8 text-center">
				<BookOpen className="mx-auto h-12 w-12 text-gray-500 mb-4" />
				<h3 className="text-xl font-semibold text-white mb-2">
					No Stories Available
				</h3>
				<p className="text-gray-400">
					Be the first to create a story on StoryVerse!
				</p>
			</Card>
		);
	}

	return (
		<div className="space-y-6">
			<div className="mb-6">
				<h2 className="text-2xl font-bold text-white mb-2">
					Story Marketplace
				</h2>
				<p className="text-gray-400 text-sm">
					Discover and explore stories created by the community
				</p>
			</div>

			<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
				{stories.map((story, index) => (
					<motion.div
						key={story.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3, delay: index * 0.05 }}
					>
						<Card
							className="p-5 hover:border-purple-500/50 transition-all cursor-pointer relative"
							onClick={() => setSelectedStory(story)}
						>
							{story.imageIPFSHash ? (
								<div className="mb-3 rounded-lg overflow-hidden h-40 bg-gray-800 relative">
									<img
										src={getIPFSUrl(story.imageIPFSHash)}
										alt={story.metadata.title}
										className="w-full h-full object-cover"
										onError={(e) => {
											e.currentTarget.style.display = "none";
										}}
									/>
								</div>
							) : (
								<div className="mb-3 rounded-lg overflow-hidden h-40 bg-gray-800 flex items-center justify-center">
									<ImageIcon className="h-8 w-8 text-gray-600" />
								</div>
							)}

							<div className="flex items-start justify-between mb-3">
								<Badge
									tone={story.ipId ? "success" : "info"}
									className="text-xs"
								>
									{story.ipId ? "Remix Ready" : "Onboarding"}
								</Badge>
								<div className="flex items-center gap-1 text-xs text-gray-500">
									<Calendar className="h-3 w-3" />
									{new Date(story.timestamp).toLocaleDateString()}
								</div>
							</div>							<h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
								{story.metadata.title}
							</h3>

							<p className="text-sm text-gray-400 mb-4 line-clamp-3">
								{story.metadata.description}
							</p>

							<div className="flex items-center gap-2 mb-4">
								<User className="h-4 w-4 text-gray-500" />
								<span className="text-xs text-gray-500">
									{formatAddress(story.author)}
								</span>
							</div>

							<div className="space-y-2 mb-4 pb-4 border-b border-gray-800">
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
							</div>

							<div className="flex gap-2">
								<button
									type="button"
									onClick={(e) => {
										e.stopPropagation();
										setSelectedStory(story);
									}}
									className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-lg transition"
								>
									{story.ipId ? "Remix / Read" : "View Story"}
								</button>
								<a
									href={`https://ipfs.io/ipfs/${story.ipfsHash}`}
									target="_blank"
									rel="noopener noreferrer"
									onClick={(e) => e.stopPropagation()}
									className="flex items-center justify-center px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded-lg transition"
								>
									<ExternalLink className="h-3 w-3" />
								</a>
							</div>
						</Card>
					</motion.div>
				))}
			</div>

			{/* Story Detail Modal */}
			{selectedStory && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
					onClick={() => setSelectedStory(null)}
				>
					<motion.div
						initial={{ scale: 0.9, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						className="bg-gray-900 border border-purple-500/30 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
						onClick={(e) => e.stopPropagation()}
					>
						{selectedStory.imageIPFSHash && (
							<div className="w-full h-64 bg-gray-800 overflow-hidden border-b border-gray-800">
								<img
									src={getIPFSUrl(selectedStory.imageIPFSHash)}
									alt={selectedStory.metadata.title}
									className="w-full h-full object-cover"
									onError={(e) => {
										e.currentTarget.style.display = "none";
									}}
								/>
							</div>
						)}

						<div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 z-10">
							<div className="flex items-start justify-between mb-4">
								<div>
									<h2 className="text-2xl font-bold text-white mb-2">
										{selectedStory.metadata.title}
									</h2>
									<div className="flex items-center gap-4 text-sm text-gray-400">
										<div className="flex items-center gap-1">
											<User className="h-4 w-4" />
											{formatAddress(selectedStory.author)}
										</div>
										<div className="flex items-center gap-1">
											<Calendar className="h-4 w-4" />
											{new Date(selectedStory.timestamp).toLocaleDateString()}
										</div>
									</div>
								</div>
								<button
									type="button"
									onClick={() => setSelectedStory(null)}
									className="text-gray-400 hover:text-white text-2xl"
								>
									×
								</button>
							</div>

						<div className="flex gap-2">
							<Badge tone="success">On IPFS</Badge>
							<Badge tone="info">Commercial Remix</Badge>
						</div>
						</div>

						<div className="p-6 space-y-6">
							<div>
								<h3 className="text-sm font-semibold text-gray-400 mb-2">
									Description
								</h3>
								<p className="text-gray-300">
									{selectedStory.metadata.description}
								</p>
							</div>

					{/* Story Content */}
					<div>
						<h3 className="text-sm font-semibold text-gray-400 mb-2">
							Story Content
						</h3>
						<div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
							<p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
								{selectedStory.metadata.content}
							</p>
						</div>
					</div>							<div className="grid grid-cols-2 gap-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
								<div>
									<p className="text-xs text-gray-400 mb-1">License Fee</p>
									<p className="text-lg font-semibold text-purple-400">
										{selectedStory.mintingFee} IP
									</p>
								</div>
								<div>
									<p className="text-xs text-gray-400 mb-1">Revenue Share</p>
									<p className="text-lg font-semibold text-purple-400">
										{selectedStory.commercialRevShare}%
									</p>
								</div>
							</div>

							<div className="space-y-2">
								<h3 className="text-sm font-semibold text-gray-400">
									IPFS Details
								</h3>
								<div className="bg-gray-800 rounded-lg p-3">
									<p className="text-xs text-gray-500 mb-1">IPFS Hash</p>
									<code className="text-xs text-purple-400 font-mono break-all">
										{selectedStory.ipfsHash}
									</code>
								</div>
								<div className="bg-gray-800 rounded-lg p-3">
									<p className="text-xs text-gray-500 mb-1">Token URI</p>
									<code className="text-xs text-purple-400 font-mono break-all">
										{selectedStory.tokenURI}
									</code>
								</div>
							</div>

							<div className="flex gap-2">
								{selectedStory.ipId && (
									<a
										href={`https://aeneid.explorer.story.foundation/ipa/${selectedStory.ipId}`}
										target="_blank"
										rel="noopener noreferrer"
										className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white text-sm rounded-lg transition"
									>
										<ExternalLink className="h-4 w-4" />
										View IP Details
									</a>
								)}
								<a
									href={`https://ipfs.io/ipfs/${selectedStory.ipfsHash}`}
									target="_blank"
									rel="noopener noreferrer"
									className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition"
								>
									<ExternalLink className="h-4 w-4" />
									View on IPFS
								</a>
								<a
									href="https://docs.story.foundation/developers/tutorials"
									target="_blank"
									rel="noopener noreferrer"
									className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition"
								>
									<BookOpen className="h-4 w-4" />
									Story Docs
								</a>
							</div>

							<RemixStoryForm
								story={selectedStory}
								onCompleted={loadAllStories}
							/>
						</div>
					</motion.div>
				</motion.div>
			)}
		</div>
	);
};
