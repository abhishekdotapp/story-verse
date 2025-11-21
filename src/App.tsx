import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Sparkles, Feather, BookMarked, Scroll, Pen, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAccount } from "wagmi";
import { CreateStoryForm } from "./components/story/CreateStoryForm";
import { Marketplace } from "./components/story/Marketplace";
import { MyStories } from "./components/story/MyStories";
import { DisputeForm } from "./components/story/DisputeForm";
import { Badge } from "./components/ui/Badge";
import { WalletButton } from "./components/wallet/WalletButton";
import { useStoryReady } from "./providers/StorySdkProvider";

type Tab = "create" | "marketplace" | "my-stories" | "disputes";

export const App = () => {
	const [activeTab, setActiveTab] = useState<Tab>("create");
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const { isConnected } = useAccount();
	const isStoryReady = useStoryReady();

	const handleTabChange = (tab: Tab) => {
		setActiveTab(tab);
		setMobileMenuOpen(false);
		
		// Smooth scroll to top when changing tabs
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<div className="min-h-screen relative">
			{/* Animated Background Blobs */}
			<div className="floating-blob blob-purple" />
			<div className="floating-blob blob-pink" />
			<div className="floating-blob blob-cyan" />
			
			<div className="relative z-10">
				{/* Header */}
				<header className="border-b border-white/10 backdrop-blur-xl bg-black/20 sticky top-0 z-50">
					<div className="mx-auto max-w-7xl px-3 py-3 sm:px-6 lg:px-8">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2 sm:gap-3">
								{/* Hamburger Menu Button - Mobile Only */}
								{isConnected && (
									<button
										type="button"
										onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
										className="md:hidden flex items-center justify-center h-10 w-10 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
										aria-label="Toggle menu"
									>
										{mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
									</button>
								)}
								<div className="relative">
									<div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl blur-lg opacity-75 animate-pulse" />
									<div className="relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 shadow-lg">
										<BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
									</div>
								</div>
								<div>
									<h1 className="text-lg sm:text-2xl font-bold gradient-text">StoryVerse</h1>
									<p className="text-[10px] sm:text-xs text-gray-500 hidden sm:block">
										Powered by Story Protocol
									</p>
								</div>
							</div>
							<WalletButton />
						</div>
					</div>
				</header>

			{/* Main Content */}
			<main className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-8 lg:px-8">
				{!isConnected ? (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="space-y-8 sm:space-y-12"
					>
						{/* Welcome Section - Story Book Style */}
						<div className="text-center relative">
							<motion.div 
								initial={{ scale: 0.8, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								transition={{ duration: 0.5 }}
								className="mb-6 sm:mb-8 flex justify-center"
							>
								<div className="relative">
									<div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 rounded-full blur-2xl sm:blur-3xl opacity-50 animate-pulse" />
									<div className="relative flex h-20 w-20 sm:h-32 sm:w-32 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-rose-600 shadow-2xl border-2 sm:border-4 border-amber-200/20">
										<BookOpen className="h-10 w-10 sm:h-16 sm:w-16 text-white" strokeWidth={1.5} />
									</div>
								</div>
							</motion.div>
							
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.2 }}
							>
								<h2 className="mb-2 sm:mb-4 text-3xl sm:text-6xl font-bold">
									<span className="inline-block bg-gradient-to-r from-amber-300 via-orange-400 to-rose-500 bg-clip-text text-transparent">
										Welcome to
									</span>
								</h2>
								<h1 className="mb-4 sm:mb-6 text-4xl sm:text-7xl font-extrabold">
									<span className="inline-block bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg">
										StoryVerse
									</span>
								</h1>
								<p className="mb-4 sm:mb-8 text-lg sm:text-2xl text-gray-300 font-light italic px-4">
									"Once upon a time, in the blockchain..."
								</p>
								<p className="mb-6 sm:mb-8 text-sm sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed px-4">
									Where every tale lives forever on-chain, every creator is protected, 
									and every imagination can remix the multiverse of stories.
								</p>
								<Badge tone="info" className="mx-auto mb-6 sm:mb-8 text-sm sm:text-base px-4 sm:px-6 py-2">
									📖 Connect your wallet to begin your journey
								</Badge>
							</motion.div>
						</div>

						{/* Story Chapters - Features */}
						<div className="grid gap-4 sm:gap-6 md:grid-cols-3 px-2">
							{/* Chapter 1 */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.3 }}
								className="glass-card p-6 sm:p-8 group hover:scale-105 transition-transform"
							>
								<div className="mb-4 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg group-hover:shadow-orange-500/50 transition-shadow">
									<Feather className="h-6 w-6 sm:h-8 sm:w-8 text-white" strokeWidth={1.5} />
								</div>
								<div className="text-xs font-bold text-orange-400 mb-2 tracking-wider">CHAPTER I</div>
								<h3 className="mb-3 text-lg sm:text-xl font-bold text-white">The Author's Quill</h3>
								<p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
									Write your original tales and inscribe them into the eternal ledger. 
									Each story becomes a protected IP asset, forever yours.
								</p>
							</motion.div>

							{/* Chapter 2 */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.4 }}
								className="glass-card p-6 sm:p-8 group hover:scale-105 transition-transform"
							>
								<div className="mb-4 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg group-hover:shadow-purple-500/50 transition-shadow">
									<Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-white" strokeWidth={1.5} />
								</div>
								<div className="text-xs font-bold text-purple-400 mb-2 tracking-wider">CHAPTER II</div>
								<h3 className="mb-3 text-lg sm:text-xl font-bold text-white">The Remix Chronicles</h3>
								<p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
									Build upon the tales of others. Create alternate endings, 
									new characters, parallel universes—all with permission and attribution.
								</p>
							</motion.div>

							{/* Chapter 3 */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.5 }}
								className="glass-card p-6 sm:p-8 group hover:scale-105 transition-transform"
							>
								<div className="mb-4 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg group-hover:shadow-cyan-500/50 transition-shadow">
									<Scroll className="h-6 w-6 sm:h-8 sm:w-8 text-white" strokeWidth={1.5} />
								</div>
								<div className="text-xs font-bold text-cyan-400 mb-2 tracking-wider">CHAPTER III</div>
								<h3 className="mb-3 text-lg sm:text-xl font-bold text-white">The Sacred Scrolls</h3>
								<p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
									Your creative rights are encoded in smart contracts. 
									Non-Commercial Social Remixing ensures your legacy lives on.
								</p>
							</motion.div>
						</div>

						{/* The Journey - How It Works */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.6 }}
							className="glass-card p-6 sm:p-10 neon-border"
						>
							<div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
								<BookMarked className="h-6 w-6 sm:h-8 sm:w-8 text-amber-400" />
								<h3 className="text-xl sm:text-3xl font-bold text-white">The Journey Begins</h3>
							</div>
							<div className="space-y-4 sm:space-y-6">
								<div className="flex gap-3 sm:gap-6 items-start">
									<div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-base sm:text-lg font-bold text-white flex-shrink-0 shadow-lg">
										I
									</div>
									<div className="flex-1">
										<h4 className="font-bold text-white text-base sm:text-lg mb-1 sm:mb-2">Open the Portal</h4>
										<p className="text-xs sm:text-base text-gray-400">Connect your wallet to Story Aeneid Testnet and enter the StoryVerse realm.</p>
									</div>
								</div>
								<div className="flex gap-3 sm:gap-6 items-start">
									<div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-base sm:text-lg font-bold text-white flex-shrink-0 shadow-lg">
										II
									</div>
									<div className="flex-1">
										<h4 className="font-bold text-white text-base sm:text-lg mb-1 sm:mb-2">Craft Your Tale</h4>
										<p className="text-xs sm:text-base text-gray-400">Write original stories or browse the infinite library of existing narratives.</p>
									</div>
								</div>
								<div className="flex gap-3 sm:gap-6 items-start">
									<div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-base sm:text-lg font-bold text-white flex-shrink-0 shadow-lg">
										III
									</div>
									<div className="flex-1">
										<h4 className="font-bold text-white text-base sm:text-lg mb-1 sm:mb-2">Seal with Magic</h4>
										<p className="text-xs sm:text-base text-gray-400">Your story is inscribed on-chain, protected by PIL licenses, immortalized forever.</p>
									</div>
								</div>
								<div className="flex gap-3 sm:gap-6 items-start">
									<div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-base sm:text-lg font-bold text-white flex-shrink-0 shadow-lg">
										IV
									</div>
									<div className="flex-1">
										<h4 className="font-bold text-white text-base sm:text-lg mb-1 sm:mb-2">Join the Multiverse</h4>
										<p className="text-xs sm:text-base text-gray-400">Remix, reimagine, and create infinite story branches while honoring the original authors.</p>
									</div>
								</div>
								<div className="flex gap-3 sm:gap-6 items-start">
									<div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-rose-600 text-base sm:text-lg font-bold text-white flex-shrink-0 shadow-lg">
										V
									</div>
									<div className="flex-1">
										<h4 className="font-bold text-white text-base sm:text-lg mb-1 sm:mb-2">Defend the Realm</h4>
										<p className="text-xs sm:text-base text-gray-400">Use the Disputes system to report violations and protect the sanctity of creative rights.</p>
									</div>
								</div>
							</div>
						</motion.div>

						{/* Powers & Abilities */}
						<div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 px-2">
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.7 }}
								className="glass-card p-4 sm:p-6 border-l-4 border-cyan-500"
							>
								<h4 className="mb-2 sm:mb-3 font-bold text-cyan-300 flex items-center gap-2 text-sm sm:text-base">
									<span className="text-xl sm:text-2xl">🔮</span> Immutable Chronicles
								</h4>
								<p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
									Your stories are sealed in smart contracts and stored on IPFS, ensuring they survive for millennia across the digital cosmos.
								</p>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.7 }}
								className="glass-card p-4 sm:p-6 border-l-4 border-pink-500"
							>
								<h4 className="mb-2 sm:mb-3 font-bold text-pink-300 flex items-center gap-2 text-sm sm:text-base">
									<span className="text-xl sm:text-2xl">🌟</span> Creator's Sanctuary
								</h4>
								<p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
									Collaborate through remixing while maintaining full attribution. Every branch of your story tree acknowledges your genius.
								</p>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.8 }}
								className="glass-card p-4 sm:p-6 border-l-4 border-green-500"
							>
								<h4 className="mb-2 sm:mb-3 font-bold text-green-300 flex items-center gap-2 text-sm sm:text-base">
									<span className="text-xl sm:text-2xl">⚡</span> Permissionless Magic
								</h4>
								<p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
									No gatekeepers, no approval queues. Create, license, and remix stories instantly in this trustless creative multiverse.
								</p>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.8 }}
								className="glass-card p-4 sm:p-6 border-l-4 border-yellow-500"
							>
								<h4 className="mb-2 sm:mb-3 font-bold text-yellow-300 flex items-center gap-2 text-sm sm:text-base">
									<span className="text-xl sm:text-2xl">⚖️</span> The Council's Justice
								</h4>
								<p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
									Report violations and let the community decide through transparent on-chain governance. Truth prevails in the StoryVerse.
								</p>
							</motion.div>
						</div>

						{/* Magical Abilities Grid */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.9 }}
							className="glass-card p-6 sm:p-10 bg-gradient-to-br from-purple-900/20 to-pink-900/20"
						>
							<h3 className="mb-6 sm:mb-8 text-xl sm:text-3xl font-bold text-center">
								<span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
									Your Storyteller's Toolkit
								</span>
							</h3>
							<div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-3">
								<div className="text-center">
									<div className="text-2xl sm:text-4xl mb-2 sm:mb-3">✍️</div>
									<p className="font-bold text-white mb-1 text-sm sm:text-base">Story Forge</p>
									<p className="text-xs text-gray-400">Write & publish with cover art</p>
								</div>
								<div className="text-center">
									<div className="text-2xl sm:text-4xl mb-2 sm:mb-3">🧬</div>
									<p className="font-bold text-white mb-1 text-sm sm:text-base">IP Enchantment</p>
									<p className="text-xs text-gray-400">Auto-register as IP asset</p>
								</div>
								<div className="text-center">
									<div className="text-2xl sm:text-4xl mb-2 sm:mb-3">📜</div>
									<p className="font-bold text-white mb-1 text-sm sm:text-base">License Scrolls</p>
									<p className="text-xs text-gray-400">Non-Commercial remixing</p>
								</div>
								<div className="text-center">
									<div className="text-2xl sm:text-4xl mb-2 sm:mb-3">🎭</div>
									<p className="font-bold text-white mb-1 text-sm sm:text-base">Remix Portal</p>
									<p className="text-xs text-gray-400">Create licensed derivatives</p>
								</div>
								<div className="text-center">
									<div className="text-2xl sm:text-4xl mb-2 sm:mb-3">👤</div>
									<p className="font-bold text-white mb-1 text-sm sm:text-base">Author's Seal</p>
									<p className="text-xs text-gray-400">Your name on all your IP</p>
								</div>
								<div className="text-center">
									<div className="text-2xl sm:text-4xl mb-2 sm:mb-3">⚔️</div>
									<p className="font-bold text-white mb-1 text-sm sm:text-base">Dispute Shield</p>
									<p className="text-xs text-gray-400">Report violations</p>
								</div>
							</div>
						</motion.div>

						{/* CTA - Begin Journey */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 1 }}
							className="text-center px-4"
						>
							<p className="mb-4 sm:mb-6 text-base sm:text-xl text-gray-300 italic">
								"Every great story begins with a single word..."
							</p>
							<div className="inline-block glass-card px-4 sm:px-8 py-3 sm:py-4 neon-glow">
								<p className="text-xs sm:text-sm text-gray-400 mb-2">Ready to write your legend?</p>
								<Badge tone="success" className="text-xs sm:text-base px-3 sm:px-6 py-1.5 sm:py-2">
									🌐 Story Aeneid Testnet (Chain ID: 1315)
								</Badge>
							</div>
						</motion.div>
					</motion.div>
				) : !isStoryReady ? (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="flex min-h-[60vh] items-center justify-center"
					>
						<div className="text-center">
							<div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
							<p className="text-gray-400">Initializing Story Protocol...</p>
						</div>
					</motion.div>
				) : (
					<>
						{/* Mobile Menu Sidebar */}
						<AnimatePresence>
							{mobileMenuOpen && (
								<>
									{/* Backdrop */}
									<motion.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										onClick={() => setMobileMenuOpen(false)}
										className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
									/>
									{/* Sidebar */}
									<motion.div
										initial={{ x: -300 }}
										animate={{ x: 0 }}
										exit={{ x: -300 }}
										transition={{ type: "spring", damping: 25, stiffness: 200 }}
										className="fixed left-0 top-0 bottom-0 w-72 glass-card border-r border-white/10 z-50 md:hidden overflow-y-auto"
									>
										<div className="p-6">
											{/* Menu Header */}
											<div className="flex items-center justify-between mb-8">
												<div className="flex items-center gap-2">
													<div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 shadow-lg">
														<BookOpen className="h-5 w-5 text-white" />
													</div>
													<h2 className="text-lg font-bold gradient-text">Menu</h2>
												</div>
												<button
													type="button"
													onClick={() => setMobileMenuOpen(false)}
													className="flex items-center justify-center h-9 w-9 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
												>
													<X className="h-5 w-5" />
												</button>
											</div>

											{/* Navigation Items */}
											<nav className="space-y-2">
												<button
													type="button"
													onClick={() => handleTabChange("create")}
													className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold transition-all ${
														activeTab === "create"
															? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/50"
															: "text-gray-400 hover:text-white hover:bg-white/5"
													}`}
												>
													<Feather className="h-5 w-5" />
													<span>Write Tale</span>
												</button>
												<button
													type="button"
													onClick={() => handleTabChange("marketplace")}
													className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold transition-all ${
														activeTab === "marketplace"
															? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/50"
															: "text-gray-400 hover:text-white hover:bg-white/5"
													}`}
												>
													<BookOpen className="h-5 w-5" />
													<span>Story Library</span>
												</button>
												<button
													type="button"
													onClick={() => handleTabChange("my-stories")}
													className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold transition-all ${
														activeTab === "my-stories"
															? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/50"
															: "text-gray-400 hover:text-white hover:bg-white/5"
													}`}
												>
													<BookMarked className="h-5 w-5" />
													<span>My Chronicles</span>
												</button>
												<button
													type="button"
													onClick={() => handleTabChange("disputes")}
													className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold transition-all ${
														activeTab === "disputes"
															? "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/50"
															: "text-gray-400 hover:text-white hover:bg-white/5"
													}`}
												>
													<Scroll className="h-5 w-5" />
													<span>Disputes</span>
												</button>
											</nav>

											{/* Menu Footer */}
											<div className="mt-8 pt-6 border-t border-white/10">
												<p className="text-xs text-gray-500 text-center">
													Powered by Story Protocol
												</p>
											</div>
										</div>
									</motion.div>
								</>
							)}
						</AnimatePresence>

						{/* Desktop Navigation Tabs */}
						<div className="mb-6 sm:mb-8 hidden md:block">
							<div className="glass-card flex gap-2 p-1.5">
								<button
									type="button"
									onClick={() => setActiveTab("create")}
									className={`group relative flex-1 rounded-xl px-6 py-3 text-sm font-semibold transition-all ${
										activeTab === "create"
											? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/50"
											: "text-gray-400 hover:text-white hover:bg-white/5"
									}`}
								>
									<span className="relative z-10 flex items-center justify-center gap-2">
										<Feather className="h-4 w-4" />
										<span>Write Tale</span>
									</span>
								</button>
								<button
									type="button"
									onClick={() => setActiveTab("marketplace")}
									className={`group relative flex-1 rounded-xl px-6 py-3 text-sm font-semibold transition-all ${
										activeTab === "marketplace"
											? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/50"
											: "text-gray-400 hover:text-white hover:bg-white/5"
									}`}
								>
									<span className="relative z-10 flex items-center justify-center gap-2">
										<BookOpen className="h-4 w-4" />
										<span>Story Library</span>
									</span>
								</button>
								<button
									type="button"
									onClick={() => setActiveTab("my-stories")}
									className={`group relative flex-1 rounded-xl px-6 py-3 text-sm font-semibold transition-all ${
										activeTab === "my-stories"
											? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/50"
											: "text-gray-400 hover:text-white hover:bg-white/5"
									}`}
								>
									<span className="relative z-10 flex items-center justify-center gap-2">
										<BookMarked className="h-4 w-4" />
										<span>My Chronicles</span>
									</span>
								</button>
								<button
									type="button"
									onClick={() => setActiveTab("disputes")}
									className={`group relative flex-1 rounded-xl px-6 py-3 text-sm font-semibold transition-all ${
										activeTab === "disputes"
											? "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/50"
											: "text-gray-400 hover:text-white hover:bg-white/5"
									}`}
								>
									<span className="relative z-10 flex items-center justify-center gap-2">
										<Scroll className="h-4 w-4" />
										<span>Disputes</span>
									</span>
								</button>
							</div>
						</div>

						{/* Tab Content */}
						<AnimatePresence mode="wait">
							{activeTab === "create" && (
								<motion.div
									key="create"
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: 20 }}
									transition={{ duration: 0.3 }}
								>
									<CreateStoryForm />
								</motion.div>
							)}

							{activeTab === "marketplace" && (
								<motion.div
									key="marketplace"
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: 20 }}
									transition={{ duration: 0.3 }}
								>
									<Marketplace />
								</motion.div>
							)}

							{activeTab === "my-stories" && (
								<motion.div
									key="my-stories"
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: 20 }}
									transition={{ duration: 0.3 }}
								>
									<MyStories />
								</motion.div>
							)}

							{activeTab === "disputes" && (
								<motion.div
									key="disputes"
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: 20 }}
									transition={{ duration: 0.3 }}
								>
									<DisputeForm />
								</motion.div>
							)}
						</AnimatePresence>
					</>
				)}
			</main>

			{/* Footer */}
			<footer className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-xl py-8 mt-20 text-center">
				<div className="mx-auto max-w-7xl px-4">
					<p className="text-sm text-gray-400 mb-3 italic">"And they lived happily ever after... on the blockchain."</p>
					<p className="text-xs text-gray-600 mb-3">Built with 💜 using Story Protocol, IPFS & Web3</p>
					<div className="flex justify-center gap-4 text-xs text-gray-600">
						<span>✨ Immutable Tales</span>
						<span>•</span>
						<span>🎨 Creative Freedom</span>
						<span>•</span>
						<span>🚀 Decentralized Forever</span>
					</div>
				</div>
			</footer>
		</div>
		</div>
	);
};
