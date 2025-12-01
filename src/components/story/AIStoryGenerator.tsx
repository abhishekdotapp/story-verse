import { motion } from "framer-motion";
import { Sparkles, RefreshCw, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/Button";
import { Textarea } from "../ui/Textarea";
import { Card } from "../ui/Card";
import { useGenerateStory } from "../../hooks/useGenerateStory";
import type { GeneratedStory } from "../../lib/gemini";

interface AIStoryGeneratorProps {
	onAccept: (data: GeneratedStory) => void;
}

export const AIStoryGenerator = ({ onAccept }: AIStoryGeneratorProps) => {
	const [prompt, setPrompt] = useState("");
	const [generatedStory, setGeneratedStory] = useState<GeneratedStory | null>(null);

	const generateMutation = useGenerateStory();

	const handleGenerate = async () => {
		try {
			const result = await generateMutation.mutateAsync(prompt);
			setGeneratedStory(result);
		} catch (error) {
			console.error("Generation error:", error);
		}
	};

	const handleRegenerate = () => {
		handleGenerate();
	};

	const handleAccept = () => {
		if (generatedStory) {
			onAccept(generatedStory);
		}
	};

	return (
		<Card className="border-cyan-500/20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
			<div className="space-y-6 p-6">
				{/* Header */}
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500">
						<Sparkles className="h-5 w-5 text-white" />
					</div>
					<div>
						<h2 className="text-xl font-bold text-white">AI Story Generator</h2>
						<p className="text-sm text-gray-400">
							Powered by Gemini AI - Just describe your story idea
						</p>
					</div>
				</div>

				{/* Prompt Input */}
				{!generatedStory && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="space-y-4"
					>
						<div>
							<label className="mb-2 block text-sm font-medium text-gray-300">
								Story Prompt
							</label>
							<Textarea
								placeholder="E.g., 'A sci-fi adventure about a robot discovering emotions on Mars' or 'A fantasy tale of a dragon who loves books'"
								value={prompt}
								onChange={(e) => setPrompt(e.target.value)}
								rows={3}
								className="resize-none"
								disabled={generateMutation.isPending}
							/>
							<p className="mt-1 text-xs text-gray-500">
								Describe your story idea, theme, genre, or any specific elements you want included
							</p>
						</div>

						<Button
							onClick={handleGenerate}
							disabled={!prompt.trim() || generateMutation.isPending}
							className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
						>
							{generateMutation.isPending ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Generating Story...
								</>
							) : (
								<>
									<Sparkles className="mr-2 h-4 w-4" />
									Generate Story
								</>
							)}
						</Button>

						{generateMutation.isError && (
							<div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
								{generateMutation.error instanceof Error
									? generateMutation.error.message
									: "Failed to generate story. Please try again."}
							</div>
						)}
					</motion.div>
				)}

				{/* Generated Story Preview */}
				{generatedStory && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="space-y-4"
					>
						<div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
							<div className="mb-3 flex items-center gap-2 text-green-400">
								<Check className="h-5 w-5" />
								<span className="font-semibold">Story Generated!</span>
							</div>

							<div className="space-y-4">
								<div>
									<label className="mb-1 block text-xs font-medium text-gray-400">
										Title
									</label>
									<p className="text-base font-semibold text-white">
										{generatedStory.title}
									</p>
								</div>

								<div>
									<label className="mb-1 block text-xs font-medium text-gray-400">
										Description
									</label>
									<p className="text-sm text-gray-300">
										{generatedStory.description}
									</p>
								</div>

								<div>
									<label className="mb-1 block text-xs font-medium text-gray-400">
										Content Preview
									</label>
									<div className="max-h-40 overflow-y-auto rounded border border-gray-700 bg-gray-900/50 p-3 text-sm text-gray-300">
										{generatedStory.content}
									</div>
								</div>

								<div>
									<label className="mb-1 block text-xs font-medium text-gray-400">
										Image Concept
									</label>
									<p className="text-xs italic text-gray-400">
										{generatedStory.imagePrompt}
									</p>
								</div>
							</div>
						</div>

						<div className="flex gap-3">
							<Button
								onClick={handleRegenerate}
								disabled={generateMutation.isPending}
								variant="secondary"
								className="flex-1"
							>
								{generateMutation.isPending ? (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								) : (
									<RefreshCw className="mr-2 h-4 w-4" />
								)}
								Regenerate
							</Button>
							<Button
								onClick={handleAccept}
								className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
							>
								<Check className="mr-2 h-4 w-4" />
								Use This Story
							</Button>
						</div>

						<Button
							onClick={() => {
								setGeneratedStory(null);
								setPrompt("");
							}}
							variant="ghost"
							className="w-full text-gray-400 hover:text-white"
						>
							Start Over
						</Button>
					</motion.div>
				)}
			</div>
		</Card>
	);
};
