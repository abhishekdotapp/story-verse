// Simple Story NFT Contract ABI (ERC-721)
export const STORY_NFT_ABI = [
	{
		inputs: [
			{ name: "to", type: "address" },
			{ name: "uri", type: "string" },
		],
		name: "mint",
		outputs: [{ name: "tokenId", type: "uint256" }],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [{ name: "tokenId", type: "uint256" }],
		name: "tokenURI",
		outputs: [{ name: "", type: "string" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [{ name: "owner", type: "address" }],
		name: "balanceOf",
		outputs: [{ name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
] as const;

// You can deploy your own Story NFT contract or use an existing one
// For testing, you can use the Story Protocol testnet mock NFT contract
export const STORY_NFT_CONTRACT_ADDRESS =
	"0x041b4F29183317fd352ae57E331154E55B3ab60b"; // Mock NFT on Story testnet (checksummed)
