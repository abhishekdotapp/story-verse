import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, ExternalLink } from "lucide-react";

import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { useCreateDispute } from "../../hooks/useCreateDispute";
import {
	DisputeTagLabels,
	DisputeTagDescriptions,
} from "../../utils/disputeUtils";

const schema = z.object({
	targetIpId: z.string().min(42).max(42).startsWith("0x"),
	disputeTag: z.enum(["IMPROPER_REGISTRATION", "IMPROPER_USAGE", "IMPROPER_PAYMENT", "CONTENT_STANDARDS_VIOLATION"]),
	evidence: z.string().min(50).max(10000),
	bondAmount: z.string().regex(/^\d+(\.\d{1,18})?$/),
	livenessInDays: z.number().int().min(1).max(30),
});

type DisputeFormData = z.infer<typeof schema>;

export const DisputeForm = () => {
	const createDispute = useCreateDispute();
	const [result, setResult] = useState<{ txHash: string; disputeId: string } | null>(null);

	const form = useForm<DisputeFormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			targetIpId: "0x",
			disputeTag: "IMPROPER_REGISTRATION",
			evidence: "",
			bondAmount: "0.1",
			livenessInDays: 30,
		},
	});

	const onSubmit = form.handleSubmit(async (data) => {
		try {
			const response = await createDispute.mutateAsync({
				targetIpId: data.targetIpId,
				disputeTag: data.disputeTag,
				evidence: data.evidence,
				bondAmount: data.bondAmount,
				livenessInDays: data.livenessInDays,
			});
			setResult({ txHash: response.txHash, disputeId: response.disputeId });
			form.reset({
				targetIpId: "0x",
				disputeTag: "IMPROPER_REGISTRATION",
				evidence: "",
				bondAmount: "0.1",
				livenessInDays: 30,
			});
		} catch (error) {
			console.error("Dispute creation error:", error);
		}
	});

	const selectedTag = form.watch("disputeTag");

	return (
		<Card className="p-6">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<div className="mb-6 flex items-start justify-between">
					<div>
						<div className="mb-2 flex items-center gap-3">
							<AlertTriangle className="h-6 w-6 text-red-500" />
							<h2 className="text-2xl font-bold text-white">Raise a Dispute</h2>
						</div>
						<p className="text-sm text-gray-400">
							Challenge an IP asset by providing evidence and posting a bond
						</p>
					</div>
					<Badge tone="danger">Dispute</Badge>
				</div>

				{result ? (
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						className="space-y-4 rounded-lg bg-green-500/10 border border-green-500/30 p-6"
					>
						<div className="flex items-center gap-3">
							<CheckCircle className="h-6 w-6 text-green-400" />
							<h3 className="text-lg font-semibold text-green-400">Dispute Created!</h3>
						</div>
						<div className="space-y-2 text-sm">
							<p className="text-gray-300">
								<span className="font-semibold">Dispute ID:</span> {result.disputeId}
							</p>
							<p className="text-gray-300">
								<span className="font-semibold">Transaction:</span> {result.txHash.slice(0, 10)}...
								{result.txHash.slice(-8)}
							</p>
							<a
								href={`https://aeneid.storyscan.io/tx/${result.txHash}`}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition"
							>
								View on Explorer
								<ExternalLink className="h-3 w-3" />
							</a>
						</div>
						<Button
							onClick={() => setResult(null)}
							variant="secondary"
							size="sm"
							className="w-full"
						>
							Create Another Dispute
						</Button>
					</motion.div>
				) : (
					<form onSubmit={onSubmit} className="space-y-6">
						<div className="space-y-2">
							<label htmlFor="target-ip-id" className="text-sm font-medium text-gray-300">
								Target IP ID
							</label>
							<Input
								id="target-ip-id"
								placeholder="0x..."
								{...form.register("targetIpId")}
								className="bg-gray-900/50 font-mono text-sm"
							/>
							{form.formState.errors.targetIpId && (
								<p className="text-xs text-red-400">
									{form.formState.errors.targetIpId.message}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<label htmlFor="dispute-tag" className="text-sm font-medium text-gray-300">
								Dispute Reason
							</label>
							<select
								id="dispute-tag"
								{...form.register("disputeTag")}
								className="w-full rounded-lg bg-gray-900/50 border border-gray-700 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition"
							>
								<option value="IMPROPER_REGISTRATION">{DisputeTagLabels.IMPROPER_REGISTRATION}</option>
								<option value="IMPROPER_USAGE">{DisputeTagLabels.IMPROPER_USAGE}</option>
								<option value="IMPROPER_PAYMENT">{DisputeTagLabels.IMPROPER_PAYMENT}</option>
								<option value="CONTENT_STANDARDS_VIOLATION">{DisputeTagLabels.CONTENT_STANDARDS_VIOLATION}</option>
							</select>
							<p className="text-xs text-gray-400">
								{selectedTag && DisputeTagDescriptions[selectedTag as keyof typeof DisputeTagDescriptions]}
							</p>
							{form.formState.errors.disputeTag && (
								<p className="text-xs text-red-400">
									{form.formState.errors.disputeTag.message}
								</p>
							)}
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<label htmlFor="bond-amount" className="text-sm font-medium text-gray-300">
									Bond Amount (ETH)
								</label>
								<Input
									id="bond-amount"
									type="number"
									step="0.01"
									placeholder="0.1"
									{...form.register("bondAmount")}
									className="bg-gray-900/50"
								/>
								{form.formState.errors.bondAmount && (
									<p className="text-xs text-red-400">
										{form.formState.errors.bondAmount.message}
									</p>
								)}
							</div>

							<div className="space-y-2">
								<label htmlFor="liveness" className="text-sm font-medium text-gray-300">
									Liveness Period (Days)
								</label>
								<Input
									id="liveness"
									type="number"
									min="1"
									max="30"
									placeholder="30"
									{...form.register("livenessInDays", { valueAsNumber: true })}
									className="bg-gray-900/50"
								/>
								{form.formState.errors.livenessInDays && (
									<p className="text-xs text-red-400">
										{form.formState.errors.livenessInDays.message}
									</p>
								)}
							</div>
						</div>

						<div className="space-y-2">
							<label htmlFor="evidence" className="text-sm font-medium text-gray-300">
								Evidence & Reasoning
							</label>
							<Textarea
								id="evidence"
								placeholder="Provide detailed evidence for your dispute (minimum 50 characters)..."
								rows={8}
								{...form.register("evidence")}
								className="bg-gray-900/50 font-mono text-sm"
							/>
							<div className="flex justify-between items-center">
								{form.formState.errors.evidence && (
									<p className="text-xs text-red-400">
										{form.formState.errors.evidence.message}
									</p>
								)}
								<p className="text-xs text-gray-500">
									{form.watch("evidence").length}/10000 characters
								</p>
							</div>
						</div>

						<div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
							<p className="text-xs text-blue-200 leading-relaxed">
								<strong>⚠️ Important:</strong> You are posting a bond of{" "}
								<strong>{form.watch("bondAmount")} ETH</strong> for this dispute. If the dispute
								is deemed frivolous, your bond may be forfeited. The liveness period determines
								how long others have to respond to this dispute (1-30 days).
							</p>
						</div>

						<Button
							type="submit"
							disabled={createDispute.isPending}
							className="w-full bg-red-600 hover:bg-red-700"
						>
							{createDispute.isPending ? (
								<>
									<div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
									Submitting Dispute...
								</>
							) : (
								<>
									<AlertTriangle className="h-4 w-4 mr-2" />
									Raise Dispute
								</>
							)}
						</Button>

						{createDispute.error && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								className="rounded-lg bg-red-500/10 border border-red-500/30 p-4"
							>
								<p className="text-sm text-red-400">
									Error: {createDispute.error instanceof Error ? createDispute.error.message : "Failed to create dispute"}
								</p>
							</motion.div>
						)}
					</form>
				)}
			</motion.div>
		</Card>
	);
};
