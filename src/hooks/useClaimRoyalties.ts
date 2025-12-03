import { useMutation, useQuery } from "@tanstack/react-query";
import { useAccount, useWalletClient } from "wagmi";
import { createStoryProtocolClient } from "../lib/storySdkClient";
import type { Address } from "viem";

interface RoyaltyVaultInfo {
	ipId: string;
	vault: Address;
	claimableRevenue: string;
	currency: Address;
}

const WIP_TOKEN = "0x1514000000000000000000000000000000000000" as Address;
const LAP_ROYALTY_POLICY = "0xBe54FB168b3c982b7AaE60dB6CF75Bd8447b390E" as Address;

export const useClaimRoyalties = () => {
	const { address } = useAccount();
	const { data: walletClient } = useWalletClient();

	return useMutation({
		mutationFn: async ({
			ipId,
			childIpIds,
		}: {
			ipId: string;
			childIpIds: string[];
		}) => {
			if (!address) {
				throw new Error("Please connect your wallet first");
			}

			if (!walletClient) {
				throw new Error("Wallet client not available");
			}

			const client = createStoryProtocolClient(walletClient);

			console.log("💰 Claiming royalties for IP Asset:", ipId);
			console.log("📦 From child IPs:", childIpIds);

			// Claim all revenue from child IPs and own vault
			const claimResponse = await client.royalty.claimAllRevenue({
				ancestorIpId: ipId as Address,
				claimer: ipId as Address, // IP Account is the claimer
				childIpIds: childIpIds as Address[],
				royaltyPolicies: childIpIds.map(() => LAP_ROYALTY_POLICY),
				currencyTokens: [WIP_TOKEN],
			});

			console.log("✅ Royalty claim transactions:", claimResponse.txHashes);

			return {
				success: true,
				txHashes: claimResponse.txHashes,
				claimedTokens: claimResponse.claimedTokens,
				message: "Royalties claimed successfully!",
			};
		},
	});
};

export const useGetRoyaltyVault = (ipId?: string) => {
	const { address } = useAccount();
	const { data: walletClient } = useWalletClient();

	return useQuery({
		queryKey: ["royaltyVault", ipId, address],
		queryFn: async (): Promise<RoyaltyVaultInfo | null> => {
			if (!ipId || !address || !walletClient) return null;

			const client = createStoryProtocolClient(walletClient);

			try {
				// Get IP's royalty vault address
				const vaultAddress = await client.royalty.getRoyaltyVaultAddress(
					ipId as Address,
				);

				if (!vaultAddress) {
					console.log("No royalty vault found for IP:", ipId);
					return null;
				}

				// Get claimable revenue for this IP
				const claimable = await client.royalty.claimableRevenue({
					ipId: ipId as Address,
					claimer: ipId as Address, // IP Account is the claimer
					token: WIP_TOKEN,
				});

				return {
					ipId,
					vault: vaultAddress,
					claimableRevenue: claimable.toString(),
					currency: WIP_TOKEN,
				};
			} catch (error) {
				console.error("Error fetching royalty vault:", error);
				return null;
			}
		},
		enabled: !!ipId && !!address && !!walletClient,
		refetchInterval: 30000, // Refetch every 30 seconds
	});
};

export const useGetIpRoyaltyVault = (ipId?: string) => {
	const { data: walletClient } = useWalletClient();

	return useQuery({
		queryKey: ["ipRoyaltyVault", ipId],
		queryFn: async () => {
			if (!ipId || !walletClient) return null;

			const client = createStoryProtocolClient(walletClient);

			try {
				const response = await client.royalty.getRoyaltyVaultAddress(
					ipId as Address,
				);

				return response;
			} catch (error) {
				console.error("Error fetching royalty vault:", error);
				return null;
			}
		},
		enabled: !!ipId && !!walletClient,
	});
};
