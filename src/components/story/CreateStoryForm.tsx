import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { BookPlus, Loader2, Upload, X, Feather } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateStory } from "../../hooks/useCreateStory";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const schema = z.object({
	title: z.string().min(3, "Title must be at least 3 characters"),
	description: z.string().min(10, "Description must be at least 10 characters"),
	content: z.string().min(100, "Story content must be at least 100 characters"),
	creatorName: z.string().optional(),
	mintingFee: z.string().optional(),
	commercialRevShare: z.string().optional().refine((val) => {
		if (!val) return true; // Allow empty
		const num = Number.parseFloat(val);
		return !Number.isNaN(num) && num >= 0 && num <= 100;
	}, "Revenue share must be between 0 and 100"),
});

type FormData = z.infer<typeof schema>;

type CreateStoryResult = Awaited<
	ReturnType<ReturnType<typeof useCreateStory>["mutateAsync"]>
>;

export const CreateStoryForm = () => {
	const [result, setResult] = useState<CreateStoryResult | null>(null);
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string>("");
	const imageInputRef = useRef<HTMLInputElement>(null);
	const createStory = useCreateStory();
	const fieldIds = {
		title: "create-story-title",
		description: "create-story-description",
		content: "create-story-content",
		image: "create-story-image",
	};

	const form = useForm<FormData>({
		resolver: zodResolver(schema),
	});

	const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (file.size > MAX_FILE_SIZE) {
			alert("Image must be less than 5MB");
			return;
		}

		if (!file.type.startsWith("image/")) {
			alert("Please select a valid image file");
			return;
		}

		setImageFile(file);

		// Create preview
		const reader = new FileReader();
		reader.onloadend = () => {
			setImagePreview(reader.result as string);
		};
		reader.readAsDataURL(file);
	};

	const removeImage = () => {
		setImageFile(null);
		setImagePreview("");
		if (imageInputRef.current) {
			imageInputRef.current.value = "";
		}
	};

	const onSubmit = form.handleSubmit(async (data) => {
		try {
			const result = await createStory.mutateAsync({
			title: data.title,
			description: data.description,
			content: data.content,
			creatorName: data.creatorName || "Anonymous",
			imageFile: imageFile || undefined,
			mintingFee: data.mintingFee || "0",
			commercialRevShare: Number.parseFloat(data.commercialRevShare || "10"),
		});
		setResult(result);
		form.reset({
			creatorName: "Anonymous",
		});
		removeImage();
	} catch (error) {
		console.error("Create story error:", error);
	}
});	return (
		<Card className="p-6">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<div className="mb-6 flex items-start justify-between">
					<div>
						<div className="mb-2 flex items-center gap-3">
							<BookPlus className="h-6 w-6 text-purple-500" />
							<h2 className="text-2xl font-bold text-white">
								Create Original Story
							</h2>
						</div>
						<p className="text-sm text-gray-400">
							Write your story, mint as NFT, register on Story Protocol, and set
							licensing terms
						</p>
					</div>
					<Badge tone="info">Original IP</Badge>
				</div>

				<form onSubmit={onSubmit} className="space-y-6">
					<div className="space-y-2">
						<label
							htmlFor={fieldIds.image}
							className="text-sm font-medium text-gray-300"
						>
							NFT Cover Image
						</label>
						{imagePreview ? (
							<div className="relative w-full">
								<img
									src={imagePreview}
									alt="Preview"
									className="w-full h-48 object-cover rounded-lg border border-purple-500/30"
								/>
								<button
									type="button"
									onClick={removeImage}
									className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-600 rounded-lg transition"
								>
									<X className="h-4 w-4 text-white" />
								</button>
							</div>
						) : (
							<div
								className="border-2 border-dashed border-purple-500/30 rounded-lg p-6 cursor-pointer hover:border-purple-500/50 transition"
								onClick={() => imageInputRef.current?.click()}
							>
								<div className="flex flex-col items-center justify-center gap-2">
									<Upload className="h-8 w-8 text-purple-400" />
									<p className="text-sm text-gray-400">
										Click to upload or drag and drop
									</p>
									<p className="text-xs text-gray-500">
										PNG, JPG, GIF up to 5MB
									</p>
								</div>
							</div>
						)}
						<input
							ref={imageInputRef}
							id={fieldIds.image}
							type="file"
							accept="image/*"
							onChange={handleImageSelect}
							className="hidden"
						/>
						{imageFile && (
							<p className="text-xs text-purple-400">
								📷 {imageFile.name} selected
							</p>
						)}
					</div>

					<div className="space-y-2 form-field">
						<label
							htmlFor={fieldIds.title}
							className="text-sm font-medium text-gray-300"
						>
							Story Title
						</label>
						<Input
							id={fieldIds.title}
							placeholder="Enter an engaging title..."
							{...form.register("title")}
							className="bg-gray-900/50"
						/>
						{form.formState.errors.title && (
							<p className="text-xs text-red-400">
								{form.formState.errors.title.message}
							</p>
						)}
					</div>

					<div className="space-y-2">
						<label
							htmlFor="creator-name"
							className="text-sm font-medium text-gray-300"
						>
							Creator Name <span className="text-gray-500">(Optional)</span>
						</label>
						<Input
							id="creator-name"
							placeholder="Your name or pen name..."
							{...form.register("creatorName")}
							className="bg-gray-900/50"
						/>
						{form.formState.errors.creatorName && (
							<p className="text-xs text-red-400">
								{form.formState.errors.creatorName.message}
							</p>
						)}
					</div>

					<div className="space-y-2">
						<label
							htmlFor={fieldIds.description}
							className="text-sm font-medium text-gray-300"
						>
							Short Description
						</label>
						<Input
							id={fieldIds.description}
							placeholder="A brief summary of your story..."
							{...form.register("description")}
							className="bg-gray-900/50"
						/>
						{form.formState.errors.description && (
							<p className="text-xs text-red-400">
								{form.formState.errors.description.message}
							</p>
						)}
					</div>

					<div className="space-y-2">
						<label
							htmlFor={fieldIds.content}
							className="text-sm font-medium text-gray-300"
						>
							Story Content
						</label>
					<Textarea
						id={fieldIds.content}
						placeholder="Write your story here... (minimum 100 characters)"
						rows={10}
						{...form.register("content")}
						className="bg-gray-900/50 font-mono text-sm"
					/>
						{form.formState.errors.content && (
							<p className="text-xs text-red-400">
								{form.formState.errors.content.message}
							</p>
						)}
					</div>

				<div className="rounded-lg border border-purple-500/30 bg-purple-500/10 p-4">
					<h3 className="mb-3 text-sm font-semibold text-purple-300">
						💰 License Terms (Stored in Metadata)
					</h3>
					<p className="text-xs text-gray-400 mb-3">
						These values are saved in your story metadata for future reference. Currently using Non-Commercial Social Remixing license.
					</p>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-300">
									Minting Fee (IP Tokens)
								</label>
								<Input
									type="number"
									min="0"
									step="0.01"
									placeholder="0"
									{...form.register("mintingFee")}
									className="bg-gray-900/50"
								/>
								<p className="text-xs text-gray-400">
									Fee required to mint a license for remixing
								</p>
								{form.formState.errors.mintingFee && (
									<p className="text-xs text-red-400">
										{form.formState.errors.mintingFee.message}
									</p>
								)}
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-300">
									Revenue Share (%)
								</label>
								<Input
									type="number"
									min="0"
									max="100"
									step="1"
									placeholder="10"
									{...form.register("commercialRevShare")}
									className="bg-gray-900/50"
								/>
								<p className="text-xs text-gray-400">
									Percentage of derivative revenue you receive
								</p>
								{form.formState.errors.commercialRevShare && (
									<p className="text-xs text-red-400">
										{form.formState.errors.commercialRevShare.message}
									</p>
								)}
							</div>
						</div>
					</div>

				<div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
					<h3 className="mb-2 text-sm font-semibold text-blue-300">
						📜 Active License Type
					</h3>
					<div className="space-y-2">
						<p className="text-sm text-gray-300">
							<strong>Non-Commercial Social Remixing</strong>
						</p>
						<ul className="text-xs text-gray-400 space-y-1 ml-4">
							<li>✅ Free for anyone to remix and share</li>
							<li>✅ Remixers inherit the same license terms</li>
							<li>❌ Commercial use not allowed</li>
							<li>✅ Attribution required</li>
						</ul>
						<p className="text-xs text-yellow-400 mt-2">
							💡 Tip: Minting fee and revenue share are saved in metadata for your records but not enforced by the non-commercial license.
						</p>
					</div>
				</div>					<div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-4">
						<h3 className="mb-3 text-sm font-semibold text-cyan-300">
							🔗 Transaction Preview
						</h3>
						<div className="space-y-2 text-xs">
							<div className="flex items-start gap-3">
								<div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 flex-shrink-0">1</div>
								<div>
									<p className="font-semibold text-gray-300">Upload Image to IPFS</p>
									<p className="text-gray-400">Store your story image permanently on IPFS</p>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 flex-shrink-0">2</div>
								<div>
									<p className="font-semibold text-gray-300">Upload Metadata to IPFS</p>
									<p className="text-gray-400">Store story metadata (title, description, creator) on IPFS</p>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 flex-shrink-0">3</div>
								<div>
									<p className="font-semibold text-gray-300">Mint NFT & Register IP Asset</p>
									<p className="text-gray-400">Create NFT on Story network and register as IP asset</p>
									<Badge className="mt-1 bg-purple-500/20 text-purple-300">Transaction #1</Badge>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 flex-shrink-0">4</div>
								<div>
									<p className="font-semibold text-gray-300">Attach Non-Commercial License</p>
									<p className="text-gray-400">Enable free remixing with attribution (License ID: 1)</p>
									<Badge className="mt-1 bg-green-500/20 text-green-300">Automatic</Badge>
								</div>
							</div>
						</div>
						<div className="mt-3 rounded-lg bg-gray-800/50 p-2 text-xs text-gray-400">
							<p>⏱️ <strong>Total time:</strong> 30-60 seconds • <strong>Transactions:</strong> 1 on-chain • <strong>Cost:</strong> Free (testnet) or ~$0.01 (mainnet)</p>
						</div>
					</div>

					<Button
						type="submit"
						disabled={createStory.isPending}
						className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-600 hover:via-orange-600 hover:to-rose-700 text-white font-bold shadow-lg shadow-orange-500/50 text-base sm:text-lg py-4 sm:py-6"
						variant="primary"
					>
						{createStory.isPending ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
								<span className="hidden sm:inline">Creating Story...</span>
								<span className="sm:hidden">Creating...</span>
							</>
						) : (
							<span className="flex items-center justify-center gap-2">
								<Feather className="h-4 w-4 sm:h-5 sm:w-5" />
								<span className="hidden sm:inline">Create & Publish Story</span>
								<span className="sm:hidden">Create Story</span>
							</span>
						)}
					</Button>
				</form>

				{result && (
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						className="mt-6 rounded-lg border border-green-500/30 bg-green-500/10 p-4"
					>
						<h3 className="mb-2 font-semibold text-green-400">
							✨ Story Created & Registered On-Chain!
						</h3>
						<div className="space-y-3">
							<div className="rounded-lg bg-green-500/10 border border-green-500/20 p-3">
								<p className="text-sm font-semibold text-green-400 mb-2">
									✅ Transaction Confirmed!
								</p>
								<p className="text-xs text-gray-300 mb-2">{result.message}</p>
							</div>

							{result.licenseTermsId && (
								<div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-3">
									<p className="text-xs font-semibold text-blue-400 mb-2">
										📜 Non-Commercial Social Remixing License Registered
									</p>
									<div className="space-y-1 text-xs text-gray-300">
										<p>
											<strong>License Terms ID:</strong>{" "}
											<code className="bg-gray-800 px-2 py-1 rounded">
												{result.licenseTermsId}
											</code>
										</p>
										<p>✅ Free to remix • Attribution required • Non-commercial only</p>
									</div>
								</div>
							)}

							{result.ipId && (
								<div className="rounded-lg bg-teal-500/10 border border-teal-500/20 p-3">
									<p className="text-xs font-semibold text-teal-300 mb-2">
										🧬 IP Asset Registered
									</p>
									<div className="space-y-1 text-xs text-gray-300">
										<p>
											<strong>IP Asset ID:</strong>{" "}
											<code className="bg-gray-800 px-2 py-1 rounded break-all">
												{result.ipId}
											</code>
										</p>
										{result.tokenId && (
											<p>
												<strong>NFT Token ID:</strong> {result.tokenId}
											</p>
										)}
										{result.nftContract && (
											<p>
												<strong>NFT Contract:</strong>{" "}
												<code className="bg-gray-800 px-2 py-1 rounded">
													{result.nftContract}
												</code>
											</p>
										)}
									</div>
								</div>
							)}

							{(result.txHash ||
								result.ipRegistrationTxHash ||
								result.licenseAttachmentTxHash ||
								result.mintTxHash) && (
								<div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-3">
									<p className="text-xs font-semibold text-blue-400 mb-2">
										🔗 Transaction Details
									</p>
									<div className="space-y-3 text-xs text-gray-300">
										{result.mintTxHash && (
											<div>
												<p className="font-semibold text-gray-200">
													NFT Mint Transaction
												</p>
												<code className="bg-gray-800 px-2 py-1 rounded break-all block">
													{result.mintTxHash}
												</code>
												<a
													href={`https://aeneid.storyscan.xyz/tx/${result.mintTxHash}`}
													target="_blank"
													rel="noopener noreferrer"
													className="text-blue-400 hover:underline inline-flex items-center gap-1 mt-1"
												>
													View on Explorer →
												</a>
											</div>
										)}
										{result.ipRegistrationTxHash && (
											<div>
												<p className="font-semibold text-gray-200">
													IP Registration
												</p>
												<code className="bg-gray-800 px-2 py-1 rounded break-all block">
													{result.ipRegistrationTxHash}
												</code>
												<a
													href={`https://aeneid.storyscan.xyz/tx/${result.ipRegistrationTxHash}`}
													target="_blank"
													rel="noopener noreferrer"
													className="text-blue-400 hover:underline inline-flex items-center gap-1 mt-1"
												>
													View on Explorer →
												</a>
											</div>
										)}
										{result.licenseAttachmentTxHash && (
											<div>
												<p className="font-semibold text-gray-200">
													License Attachment
												</p>
												<code className="bg-gray-800 px-2 py-1 rounded break-all block">
													{result.licenseAttachmentTxHash}
												</code>
												<a
													href={`https://aeneid.storyscan.xyz/tx/${result.licenseAttachmentTxHash}`}
													target="_blank"
													rel="noopener noreferrer"
													className="text-blue-400 hover:underline inline-flex items-center gap-1 mt-1"
												>
													View on Explorer →
												</a>
											</div>
										)}
										{result.txHash && (
											<div>
												<p className="font-semibold text-gray-200">
													License Registration
												</p>
												<code className="bg-gray-800 px-2 py-1 rounded break-all block">
													{result.txHash}
												</code>
												<a
													href={`https://aeneid.storyscan.xyz/tx/${result.txHash}`}
													target="_blank"
													rel="noopener noreferrer"
													className="text-blue-400 hover:underline inline-flex items-center gap-1 mt-1"
												>
													View on Explorer →
												</a>
											</div>
										)}
									</div>
								</div>
							)}

							<div className="space-y-2 text-xs text-gray-300">
								<p>
									<strong>📦 IPFS Hash:</strong>{" "}
									<code className="bg-gray-800 px-2 py-1 rounded text-xs">
										{result.ipfsHash}
									</code>
								</p>
								<p>
									<strong>🔗 Token URI:</strong>{" "}
									<code className="bg-gray-800 px-2 py-1 rounded text-xs break-all">
										{result.tokenURI}
									</code>
								</p>
								<p>
									<strong>👤 Author:</strong> {result.author}
								</p>
								<p>
									<strong>📅 Created:</strong>{" "}
									{new Date(result.timestamp).toLocaleString()}
								</p>
							</div>

							<div className="rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-3 mt-3">
								<p className="text-xs font-semibold text-yellow-400 mb-2">
									📝 What Just Happened:
								</p>
								<ol className="text-xs text-gray-300 space-y-1 list-decimal list-inside">
									<li>✅ Story metadata stored permanently on IPFS</li>
									<li>✅ NFT minted on Story testnet collection</li>
									<li>✅ IP asset registered on Story Protocol</li>
									<li>✅ Non-Commercial Social Remixing license registered & attached</li>
									<li>📖 Story added to "My Stories" and Marketplace tabs</li>
									<li>🎨 Anyone can now remix your story for free (with attribution)</li>
								</ol>
							</div>

							<div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-3 mt-3">
								<p className="text-xs font-semibold text-blue-400 mb-2">
									📜 Non-Commercial Social Remixing:
								</p>
								<p className="text-xs text-gray-300">
									Your story is protected by a PIL (Programmable IP License) that allows
									anyone to remix and share your work freely, but not commercially.
									Remixes inherit the same license, creating a community-driven remix tree!
								</p>
							</div>

							<div className="flex gap-2 mt-4">
								<a
									href={`https://ipfs.io/ipfs/${result.ipfsHash}`}
									target="_blank"
									rel="noopener noreferrer"
									className="flex-1 text-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-lg transition"
								>
									View on IPFS
								</a>
								{result.txHash && (
									<a
										href={`https://aeneid.storyscan.xyz/tx/${result.txHash}`}
										target="_blank"
										rel="noopener noreferrer"
										className="flex-1 text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition"
									>
										View Transaction
									</a>
								)}
							</div>
						</div>
					</motion.div>
				)}

				{createStory.error && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-4"
					>
						<p className="text-sm text-red-400">
							{createStory.error.message || "Failed to create story"}
						</p>
					</motion.div>
				)}
			</motion.div>
		</Card>
	);
};
