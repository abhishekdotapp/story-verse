import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useCreateRemix } from "../../hooks/useCreateRemix";
import type { SavedStory } from "../../hooks/useCreateStory";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";

const remixSchema = z.object({
	title: z.string().min(3, "Title must be at least 3 characters"),
	description: z.string().min(10, "Description must be at least 10 characters"),
	content: z.string().min(100, "Content must be at least 100 characters"),
	creatorName: z.string().optional(),
	mintingFee: z.string().optional(),
	commercialRevShare: z.string().optional(),
});

type RemixFormData = z.infer<typeof remixSchema>;

type RemixMutationResult = Awaited<
	ReturnType<ReturnType<typeof useCreateRemix>["mutateAsync"]>
>;

type Props = {
	story: SavedStory;
	onCompleted?: () => void;
};

export const RemixStoryForm = ({ story, onCompleted }: Props) => {
	const [result, setResult] = useState<RemixMutationResult | null>(null);
	const remixMutation = useCreateRemix();
	const inputIds = {
		title: `remix-title-${story.id}`,
		description: `remix-description-${story.id}`,
		content: `remix-content-${story.id}`,
		creatorName: `remix-creator-${story.id}`,
		mintingFee: `remix-minting-fee-${story.id}`,
		commercialRevShare: `remix-commercial-rev-share-${story.id}`,
	};

	const form = useForm<RemixFormData>({
		resolver: zodResolver(remixSchema),
		defaultValues: {
			title: `${story.metadata.title} — Remix`,
			description: `A derivative inspired by ${story.metadata.title}`,
			content:
				"Begin your remix here. Describe how you expand the universe and respect the original lore...",
			mintingFee: "0",
			commercialRevShare: "0",
		},
	});

	if (!story.ipId || !story.licenseTermsId) {
		return (
			<div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4 text-xs text-yellow-300">
				<p className="font-semibold mb-1">⏳ Story Pending Registration</p>
				<p>This story's IP asset is still being registered on-chain. Once registration completes, you'll be able to license and remix it.</p>
			</div>
		);
	}

	const onSubmit = form.handleSubmit(async (data) => {
		try {
			const remixResult = await remixMutation.mutateAsync({
				parentIpId: story.ipId as `0x${string}`,
				licenseTermsId: story.licenseTermsId!,
				title: data.title,
				description: data.description,
				content: data.content,
				parentTitle: story.metadata.title,
				creatorName: data.creatorName,
				mintingFee: data.mintingFee,
				commercialRevShare: Number.parseInt(data.commercialRevShare || "0"),
			});
			setResult(remixResult);
			form.reset();
			onCompleted?.();
		} catch (error) {
			console.error("Remix creation failed:", error);
		}
	});

	return (
		<div className="space-y-4 rounded-2xl border border-white/5 bg-gray-900/70 p-5">
			<div className="flex items-center gap-2">
				<Sparkles className="h-4 w-4 text-purple-400" />
				<h4 className="text-sm font-semibold text-white">
					License & Remix This Story
				</h4>
				<Badge tone="info" className="ml-auto">
					Requires {story.mintingFee} IP
				</Badge>
			</div>

			<form onSubmit={onSubmit} className="space-y-4">
				<div className="space-y-1">
					<label htmlFor={inputIds.title} className="text-xs text-gray-400">
						Remix Title
					</label>
					<Input
						id={inputIds.title}
						{...form.register("title")}
						className="bg-gray-900/50 text-sm"
					/>
					{form.formState.errors.title && (
						<p className="text-xs text-red-400">
							{form.formState.errors.title.message}
						</p>
					)}
				</div>
				<div className="space-y-1">
					<label
						htmlFor={inputIds.description}
						className="text-xs text-gray-400"
					>
						Description
					</label>
					<Input
						id={inputIds.description}
						{...form.register("description")}
						className="bg-gray-900/50 text-sm"
					/>
					{form.formState.errors.description && (
						<p className="text-xs text-red-400">
							{form.formState.errors.description.message}
						</p>
					)}
				</div>
				<div className="space-y-1">
					<label htmlFor={inputIds.content} className="text-xs text-gray-400">
						Remix Content
					</label>
					<Textarea
						id={inputIds.content}
						rows={6}
						{...form.register("content")}
						className="bg-gray-900/50 font-mono text-xs"
					/>
					{form.formState.errors.content && (
						<p className="text-xs text-red-400">
							{form.formState.errors.content.message}
						</p>
					)}
				</div>

				<div className="space-y-1">
					<label htmlFor={inputIds.creatorName} className="text-xs text-gray-400">
						Creator Name
					</label>
					<Input
						id={inputIds.creatorName}
						{...form.register("creatorName")}
						placeholder="Anonymous"
						className="bg-gray-900/50 text-sm"
					/>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-1">
						<label htmlFor={inputIds.mintingFee} className="text-xs text-gray-400">
							Minting Fee (IP)
						</label>
						<Input
							id={inputIds.mintingFee}
							type="number"
							step="0.001"
							{...form.register("mintingFee")}
							className="bg-gray-900/50 text-sm"
						/>
						<p className="text-xs text-gray-500">
							Fee for others to remix your derivative
						</p>
					</div>

					<div className="space-y-1">
						<label htmlFor={inputIds.commercialRevShare} className="text-xs text-gray-400">
							Revenue Share (%)
						</label>
						<Input
							id={inputIds.commercialRevShare}
							type="number"
							min="0"
							max="100"
							{...form.register("commercialRevShare")}
							className="bg-gray-900/50 text-sm"
						/>
						<p className="text-xs text-gray-500">
							Your share of derivative earnings
						</p>
					</div>
				</div>

				<div className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-4">
					<h3 className="mb-3 text-sm font-semibold text-purple-300">
						🔗 Transaction Preview
					</h3>
					<div className="space-y-2 text-xs">
						<div className="flex items-start gap-3">
							<div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-purple-500/20 text-purple-300 flex-shrink-0">1</div>
							<div>
								<p className="font-semibold text-gray-300">Mint License Token</p>
								<p className="text-gray-400">Get permission to remix the parent story</p>
								<Badge className="mt-1 bg-purple-500/20 text-purple-300">Transaction #1</Badge>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-purple-500/20 text-purple-300 flex-shrink-0">2</div>
							<div>
								<p className="font-semibold text-gray-300">Upload Remix Metadata to IPFS</p>
								<p className="text-gray-400">Store your remix content, title, and description on IPFS</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-purple-500/20 text-purple-300 flex-shrink-0">3</div>
							<div>
								<p className="font-semibold text-gray-300">Register Derivative IP Asset</p>
								<p className="text-gray-400">Register your remix as a new IP asset linked to the parent</p>
								<Badge className="mt-1 bg-purple-500/20 text-purple-300">Transaction #2</Badge>
							</div>
						</div>
					</div>
					<div className="mt-3 rounded-lg bg-gray-800/50 p-2 text-xs text-gray-400">
						<p>⏱️ <strong>Total time:</strong> 30-60 seconds • <strong>Transactions:</strong> 2 on-chain • <strong>Gas fee:</strong> Varies by network congestion</p>
					</div>
				</div>

				<Button
					type="submit"
					className="w-full"
					disabled={remixMutation.isPending}
				>
					{remixMutation.isPending ? (
						<>
							<Loader2 className="h-4 w-4 animate-spin mr-2" />
							Mint Remix & Register
						</>
					) : (
						"Pay License & Remix"
					)}
				</Button>
			</form>

			{remixMutation.error && (
				<p className="text-xs text-red-400">
					{remixMutation.error.message || "Failed to create remix"}
				</p>
			)}

			{result && (
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					className="rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-xs text-gray-200"
				>
					<p className="font-semibold text-green-400 mb-2">
						🎉 Remix registered on-chain!
					</p>
					<div className="space-y-1">
						<p>
							<strong>Child IP ID:</strong>{" "}
							<code className="break-all bg-gray-800 px-2 py-1 rounded">
								{result.ipId}
							</code>
						</p>
						{result.licenseTokenId && (
							<p>
								<strong>License Token:</strong> #{result.licenseTokenId}
							</p>
						)}
						{result.txHash && (
							<a
								href={`https://aeneid.storyscan.xyz/tx/${result.txHash}`}
								target="_blank"
								rel="noopener noreferrer"
								className="text-green-300 underline inline-flex items-center gap-1"
							>
								View Transaction →
							</a>
						)}
					</div>
				</motion.div>
			)}
		</div>
	);
};
