import { useMutation } from "@tanstack/react-query";
import { useWalletClient } from "wagmi";
import { createStoryProtocolClient } from "../lib/storySdkClient";
import { storyTestnet } from "../lib/storyChain";

interface AttachLicenseInput {
	ipId: string;
	licenseTermsId?: string;
}

export const useAttachLicenseTerms = () => {
	const { data: walletClient } = useWalletClient();

	return useMutation({
		mutationFn: async (input: AttachLicenseInput) => {
			if (!walletClient) {
				throw new Error("Please connect your wallet first.");
			}

			if (walletClient.chain?.id !== storyTestnet.id) {
				throw new Error(
					`Please connect to Story Aeneid Testnet (Chain ID ${storyTestnet.id}).`,
				);
			}

			console.log("📋 Attaching license terms to IP:", input.ipId);

			const client = createStoryProtocolClient(walletClient);
			const licenseTermsId = input.licenseTermsId || "1"; // Default to non-commercial social remixing

			try {
			const result = await client.license.attachLicenseTerms({
				ipId: input.ipId as `0x${string}`,
				licenseTermsId: BigInt(licenseTermsId),
			});				console.log("✅ License terms attached! Tx:", result.txHash);

				return {
					success: true,
					txHash: result.txHash,
					licenseTermsId,
				};
			} catch (error) {
				const errorMsg = error instanceof Error ? error.message : String(error);
				
				// Check if already attached
				if (errorMsg.includes("already attached") || errorMsg.includes("AlreadyAttached")) {
					console.log("ℹ️ License terms already attached");
					return {
						success: true,
						alreadyAttached: true,
						licenseTermsId,
					};
				}
				
				throw error;
			}
		},
		onSuccess: (data) => {
			if (data.alreadyAttached) {
				console.log("✅ Story is already remixable!");
			} else {
				console.log("✅ Story is now remixable!");
			}
		},
		onError: (error) => {
			console.error("❌ Failed to attach license terms:", error);
		},
	});
};
