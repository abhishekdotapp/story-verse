import { defineChain } from "viem";

// RPC endpoints for Story Aeneid Testnet (Chain ID 1315)
const aeneidRpcUrls = [
	"https://aeneid.storyrpc.io",
	"https://story-testnet-rpc.contributiondao.com",
	"https://story-testnet-evm.itrocket.net",
	"https://evmrpc-t.story.nodestake.org",
];

// Use custom RPC only if explicitly set
const customRpcUrl = import.meta.env.VITE_STORY_RPC_URL;
const shouldUseCustom =
	typeof customRpcUrl === "string" &&
	customRpcUrl.length > 0 &&
	!customRpcUrl.includes("ankr") &&
	!customRpcUrl.includes("quiknode");

const storyRpcUrls = shouldUseCustom
	? [customRpcUrl, ...aeneidRpcUrls]
	: aeneidRpcUrls;

export const storyTestnet = defineChain({
	id: 1315, // Story Aeneid Testnet
	name: "Story Aeneid Testnet",
	nativeCurrency: {
		name: "IP",
		symbol: "IP",
		decimals: 18,
	},
	rpcUrls: {
		default: {
			http: storyRpcUrls,
		},
		public: {
			http: storyRpcUrls,
		},
	},
	blockExplorers: {
		default: {
			name: "Story Explorer",
			url: "https://aeneid.storyscan.xyz",
		},
	},
	testnet: true,
});

// Export verified config for manual network addition
export const STORY_TESTNET_CONFIG = {
	chainId: "0x523", // 1315 in hex
	chainName: "Story Aeneid Testnet",
	nativeCurrency: {
		name: "IP",
		symbol: "IP",
		decimals: 18,
	},
	rpcUrls: storyRpcUrls,
	blockExplorerUrls: ["https://aeneid.storyscan.xyz"],
};
