import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@radix-ui/react-popover";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { useMemo, useState } from "react";
import {
	useAccount,
	useConnect,
	useDisconnect,
	useEnsName,
	useSwitchChain,
} from "wagmi";
import { STORY_TESTNET_CONFIG, storyTestnet } from "../../lib/storyChain";
import { Button } from "../ui/Button";

type WalletError = {
	code?: number;
	message?: string;
};

const parseWalletError = (error: unknown): WalletError => {
	if (typeof error === "object" && error !== null) {
		const candidate = error as { code?: number | string; message?: unknown };
		const code =
			typeof candidate.code === "number"
				? candidate.code
				: typeof candidate.code === "string"
					? Number(candidate.code)
					: undefined;
		const message =
			typeof candidate.message === "string"
				? candidate.message
				: error instanceof Error
					? error.message
					: undefined;
		return { code, message };
	}

	if (typeof error === "string") {
		return { message: error };
	}

	if (error instanceof Error) {
		return { message: error.message };
	}

	return {};
};

const formatAddress = (address?: string) => {
	if (!address) return "";
	return `${address.slice(0, 6)}…${address.slice(-4)}`;
};

export const WalletButton = () => {
	const { connectors, connectAsync, status, error } = useConnect();
	const { disconnect } = useDisconnect();
	const { address, chainId, isConnected } = useAccount();
	const { data: ensName } = useEnsName({ address });
	const { switchChainAsync, chains } = useSwitchChain();
	const [connectionError, setConnectionError] = useState<string | null>(null);

	const availableConnectors = useMemo(() => connectors, [connectors]);

	const addStoryNetwork = async () => {
		try {
			if (!window.ethereum) {
				throw new Error("No Web3 wallet found");
			}

			// Use the verified config
			await window.ethereum.request({
				method: "wallet_addEthereumChain",
				params: [STORY_TESTNET_CONFIG],
			});
			return true;
		} catch (error) {
			console.error("Failed to add Story network:", error);
			const { code, message } = parseWalletError(error);
			if (code === 4001) {
				setConnectionError("You rejected the network addition");
			} else {
				setConnectionError(message || "Failed to add network");
			}
			return false;
		}
	};

	const handleConnect = async (connectorId: string) => {
		try {
			setConnectionError(null);
			const connector = availableConnectors.find(
				(item) => item.id === connectorId,
			);
			if (!connector) {
				console.error("Connector not found:", connectorId);
				setConnectionError("Wallet connector not found");
				return;
			}

			console.log("Attempting to connect with:", connector.name);

			// First connect to the wallet
			const result = await connectAsync({ connector });
			console.log("Connected to wallet, chain ID:", result.chainId);

			// Check if we're on the right chain
			if (result.chainId !== storyTestnet.id) {
				console.log(
					"Wrong chain detected. Current:",
					result.chainId,
					"Expected:",
					storyTestnet.id,
				);
				try {
					// Try to switch to Story chain
					await switchChainAsync({ chainId: storyTestnet.id });
				} catch (switchError) {
					console.error("Switch chain error:", switchError);
					const { code, message } = parseWalletError(switchError);
					// If switch fails (chain not found), try to add the network
					const normalizedMessage = message?.toLowerCase() ?? "";
					if (
						code === 4902 ||
						normalizedMessage.includes("unrecognized chain") ||
						normalizedMessage.includes("not added")
					) {
						console.log("Chain not found in wallet, adding Story network...");
						const added = await addStoryNetwork();
						if (added) {
							// Try switching again after adding
							try {
								await switchChainAsync({ chainId: storyTestnet.id });
							} catch (retryError) {
								console.error(
									"Failed to switch after adding network:",
									retryError,
								);
							}
						}
					} else {
						throw switchError;
					}
				}
			}
		} catch (error) {
			console.error("Connection error:", error);
			const { message } = parseWalletError(error);
			let errorMessage = "Failed to connect wallet";

			if (message) {
				const normalized = message.toLowerCase();
				if (normalized.includes("user rejected")) {
					errorMessage = "You rejected the connection request";
				} else if (normalized.includes("chain")) {
					errorMessage =
						"Chain ID mismatch. Please remove and re-add the Story network in your wallet.";
				} else if (normalized.includes("network")) {
					errorMessage =
						"Network connection issue. Please check your RPC settings.";
				} else {
					errorMessage = message;
				}
			}

			setConnectionError(errorMessage);
		}
	};

	const ensureStoryChain = async () => {
		if (chainId === storyTestnet.id) return;

		try {
			setConnectionError(null);
			const target = chains.find((c) => c.id === storyTestnet.id);
			if (!target) {
				// Network not found, try to add it
				const added = await addStoryNetwork();
				if (!added) return;
			}
			await switchChainAsync({ chainId: storyTestnet.id });
		} catch (error) {
			console.error("Switch chain error:", error);
			const { code, message } = parseWalletError(error);
			if (code === 4902) {
				// Try adding the network if it doesn't exist
				await addStoryNetwork();
			} else if (message?.toLowerCase().includes("chain id")) {
				setConnectionError(
					"Chain ID mismatch detected. Please remove the Story network from your wallet and reconnect.",
				);
			} else {
				setConnectionError("Failed to switch to Story network");
			}
		}
	};

	if (!isConnected) {
		return (
			<Popover>
				<PopoverTrigger asChild>
					<Button variant="primary" size="md" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold shadow-lg shadow-cyan-500/50 text-xs sm:text-sm px-3 sm:px-4">
						{status === "pending" ? "Connecting…" : (
							<>
								<span className="hidden sm:inline">Connect Wallet</span>
								<span className="sm:hidden">Connect</span>
							</>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent
					align="end"
					className="glass-panel mt-3 w-64 rounded-2xl border border-[rgba(255,255,255,0.06)] p-4 text-sm text-[var(--text-0)] shadow-[0_20px_60px_rgba(4,6,20,0.45)]"
				>
					<p className="mb-3 text-xs text-[var(--text-1)]">
						Select a wallet to join the Story multiverse.
					</p>
					<div className="space-y-2">
						{availableConnectors.length === 0 ? (
							<p className="text-xs text-[var(--text-1)]">
								No wallet detected. Please install MetaMask or another Web3
								wallet.
							</p>
						) : null}
						{availableConnectors.map((connector) => (
							<motion.button
								key={connector.id}
								onClick={() => handleConnect(connector.id)}
								className="w-full rounded-xl bg-[rgba(255,255,255,0.06)] px-3 py-2 text-left font-medium transition hover:bg-[rgba(127,90,240,0.18)]"
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								{connector.name}
							</motion.button>
						))}
					</div>
					{(error || connectionError) && (
						<div className="mt-3 flex items-start gap-2 rounded-lg bg-red-500/10 p-2">
							<AlertCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
							<p className="text-xs text-red-400">
								{connectionError || error?.message}
							</p>
						</div>
					)}
				</PopoverContent>
			</Popover>
		);
	}

	const isWrongChain = chainId !== storyTestnet.id;

	return (
		<Tooltip delayDuration={0}>
			<TooltipTrigger asChild>
				<div className="flex items-center gap-2">
					{isWrongChain && (
						<Button
							variant="primary"
							size="sm"
							onClick={ensureStoryChain}
							className="text-xs bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold px-2 sm:px-3"
						>
							<span className="hidden sm:inline">Switch to Story</span>
							<span className="sm:hidden">Switch</span>
						</Button>
					)}
					<Button variant="secondary" size="md" onClick={ensureStoryChain} className="text-xs sm:text-sm px-2 sm:px-4">
						<span
							className={`mr-2 sm:mr-3 h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full ${
								isWrongChain ? "bg-yellow-500" : "bg-[var(--success)]"
							}`}
						/>
						<span className="truncate max-w-[100px] sm:max-w-none">
							{ensName ?? formatAddress(address)}
						</span>
					</Button>
				</div>
			</TooltipTrigger>
			<TooltipContent
				side="bottom"
				className="glass-panel rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(10,10,30,0.8)] px-4 py-3 shadow-[0_12px_40px_rgba(6,8,24,0.55)]"
			>
				<div className="flex flex-col gap-2 text-xs text-[var(--text-1)]">
					<span>
						Connected to{" "}
						{chainId === storyTestnet.id
							? "Story Aeneid"
							: `Chain ${chainId} (Wrong Network)`}
					</span>
					{isWrongChain && (
						<button
							type="button"
							onClick={ensureStoryChain}
							className="rounded-lg bg-[rgba(127,90,240,0.2)] px-3 py-2 text-left text-[var(--text-0)] transition hover:bg-[rgba(127,90,240,0.3)]"
						>
							Switch to Story Aeneid
						</button>
					)}
					<button
						type="button"
						onClick={() => disconnect()}
						className="rounded-lg bg-[rgba(255,255,255,0.08)] px-3 py-2 text-left text-[var(--text-0)] transition hover:bg-[rgba(255,91,107,0.2)]"
					>
						Disconnect
					</button>
				</div>
			</TooltipContent>
		</Tooltip>
	);
};
