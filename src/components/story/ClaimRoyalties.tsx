import { motion } from "framer-motion";
import { Coins, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import {
	useGetRoyaltyVault,
	useClaimRoyalties,
} from "../../hooks/useClaimRoyalties";
import { formatEther } from "viem";

interface ClaimRoyaltiesProps {
	ipId: string;
	childIpIds?: string[];
}

export const ClaimRoyalties = ({ ipId, childIpIds = [] }: ClaimRoyaltiesProps) => {
	const { data: vaultInfo, isLoading: isLoadingVault } = useGetRoyaltyVault(ipId);
	const { mutate: claimRoyalties, isPending: isClaiming } = useClaimRoyalties();
	const [claimStatus, setClaimStatus] = useState<"idle" | "success" | "error">(
		"idle",
	);
	const [errorMessage, setErrorMessage] = useState("");

	const handleClaim = () => {
		setClaimStatus("idle");
		setErrorMessage("");

		claimRoyalties(
			{ ipId, childIpIds },
			{
				onSuccess: (data) => {
					console.log("✅ Claimed royalties:", data);
					setClaimStatus("success");
				},
				onError: (error) => {
					console.error("❌ Error claiming royalties:", error);
					setClaimStatus("error");
					setErrorMessage(error.message || "Failed to claim royalties");
				},
			},
		);
	};

	if (isLoadingVault) {
		return (
			<Card className="p-4 bg-gray-900/40 border-gray-800">
				<div className="flex items-center gap-2">
					<Loader2 className="h-4 w-4 animate-spin text-purple-500" />
					<span className="text-sm text-gray-400">
						Checking claimable royalties...
					</span>
				</div>
			</Card>
		);
	}

	if (!vaultInfo) {
		return null;
	}

	const claimableAmount = BigInt(vaultInfo.claimableRevenue);
	const hasClaimable = claimableAmount > 0n;

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<Card className="p-4 bg-gradient-to-br from-yellow-500/5 to-purple-500/5 border-yellow-500/30">
				<div className="flex items-start justify-between mb-3">
					<div className="flex items-center gap-2">
						<Coins className="h-5 w-5 text-yellow-400" />
						<h4 className="text-sm font-semibold text-white">
							Claimable Royalties
						</h4>
					</div>
					{hasClaimable && (
						<Badge tone="success" className="text-xs">
							Available
						</Badge>
					)}
				</div>

				<div className="space-y-3">
					<div className="rounded-lg bg-gray-900/60 border border-gray-800 p-3">
						<div className="flex items-center justify-between mb-2">
							<span className="text-xs text-gray-500">Amount Available:</span>
							<span
								className={`text-lg font-bold font-mono ${hasClaimable ? "text-yellow-400" : "text-gray-500"}`}
							>
								{formatEther(claimableAmount)} WIP
							</span>
						</div>
						<div className="flex items-center justify-between text-xs">
							<span className="text-gray-500">Royalty Vault:</span>
							<code className="text-purple-400 font-mono text-xs">
								{vaultInfo.vault.slice(0, 6)}...{vaultInfo.vault.slice(-4)}
							</code>
						</div>
					</div>

					{childIpIds.length > 0 && (
						<div className="text-xs text-gray-400">
							<p className="mb-1">From {childIpIds.length} derivative(s)</p>
						</div>
					)}

					{claimStatus === "success" && (
						<div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
							<CheckCircle className="h-4 w-4 text-green-400" />
							<span className="text-sm text-green-400">
								Royalties claimed successfully!
							</span>
						</div>
					)}

					{claimStatus === "error" && (
						<div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
							<AlertCircle className="h-4 w-4 text-red-400" />
							<span className="text-sm text-red-400">{errorMessage}</span>
						</div>
					)}

					<Button
						onClick={handleClaim}
						disabled={!hasClaimable || isClaiming}
						className="w-full"
					>
						{isClaiming ? (
							<>
								<Loader2 className="h-4 w-4 animate-spin mr-2" />
								Claiming...
							</>
						) : hasClaimable ? (
							"Claim Royalties"
						) : (
							"No Royalties Available"
						)}
					</Button>

					{hasClaimable && (
						<p className="text-xs text-gray-500 text-center">
							Royalties from license minting fees and derivative revenue will be
							transferred to your wallet
						</p>
					)}
				</div>
			</Card>
		</motion.div>
	);
};
