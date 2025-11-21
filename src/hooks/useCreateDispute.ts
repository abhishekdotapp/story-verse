import { useMutation } from "@tanstack/react-query";
import { parseEther } from "viem";
import { useAccount } from "wagmi";

import { createStoryProtocolClient } from "../lib/storySdkClient";
import { uploadDisputeEvidenceToIPFS, DisputeTag } from "../utils/disputeUtils";
import { DisputeTargetTag } from "@story-protocol/core-sdk";

export interface CreateDisputeInput {
	targetIpId: string;
	disputeTag: DisputeTag;
	evidence: string;
	bondAmount: string; // in ETH
	livenessInDays: number;
}

export interface DisputeResponse {
	txHash: string;
	disputeId: string;
	targetIpId: string;
}

const mapDisputeTag = (tag: DisputeTag): DisputeTargetTag => {
	const tagMap: Record<DisputeTag, DisputeTargetTag> = {
		IMPROPER_REGISTRATION: DisputeTargetTag.IMPROPER_REGISTRATION,
		IMPROPER_USAGE: DisputeTargetTag.IMPROPER_USAGE,
		IMPROPER_PAYMENT: DisputeTargetTag.IMPROPER_PAYMENT,
		CONTENT_STANDARDS_VIOLATION: DisputeTargetTag.CONTENT_STANDARDS_VIOLATION,
	};
	return tagMap[tag];
};

export const useCreateDispute = () => {
	const { address } = useAccount();

	return useMutation({
		mutationFn: async (input: CreateDisputeInput): Promise<DisputeResponse> => {
			if (!address) throw new Error("Wallet not connected");

			console.log("🚀 Creating dispute...", {
				targetIpId: input.targetIpId,
				tag: input.disputeTag,
				bond: input.bondAmount,
				liveness: input.livenessInDays,
			});

			// Step 1: Upload evidence to IPFS
			console.log("📤 Uploading dispute evidence to IPFS...");
			const evidenceCID = await uploadDisputeEvidenceToIPFS(input.evidence);
			console.log("✅ Evidence uploaded:", evidenceCID);

			// Step 2: Create Story Protocol client and raise dispute
			const client = createStoryProtocolClient(address);

			console.log("⚖️ Raising dispute on-chain...");
			const disputeResponse = await client.dispute.raiseDispute({
				targetIpId: input.targetIpId as `0x${string}`,
				cid: evidenceCID,
				targetTag: mapDisputeTag(input.disputeTag),
				bond: parseEther(input.bondAmount),
				liveness: input.livenessInDays * 24 * 60 * 60, // Convert days to seconds
			});

			console.log("✅ Dispute created successfully!", {
				txHash: disputeResponse.txHash,
				disputeId: disputeResponse.disputeId,
			});

			return {
				txHash: disputeResponse.txHash || "",
				disputeId: (disputeResponse.disputeId ?? 0n).toString(),
				targetIpId: input.targetIpId,
			};
		},
	});
};
