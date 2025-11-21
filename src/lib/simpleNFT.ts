import { getAddress } from "viem";

export const SIMPLE_NFT_ABI = [
	{
		inputs: [
			{ name: "to", type: "address" },
			{ name: "tokenURI", type: "string" },
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

// Story Protocol's pre-deployed public NFT collection on Aeneid testnet
// This is the official SPG (Story Protocol Generated) NFT contract
// Ready for anyone to mint: https://aeneid.storyscan.xyz/address/0xc32A8a0FF3beDDDa58393d022aF433e78739FAbc
export const STORY_NFT_COLLECTION = getAddress(
	"0xc32A8a0FF3beDDDa58393d022aF433e78739FAbc"
);

// SPG NFT ABI - simplified for minting
export const SPG_NFT_ABI = [
	{
		inputs: [
			{
				name: "nftMetadataURI",
				type: "string",
			},
		],
		name: "mint",
		outputs: [
			{
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				name: "to",
				type: "address",
			},
			{
				name: "nftMetadataURI",
				type: "string",
			},
		],
		name: "mintTo",
		outputs: [
			{
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "nonpayable",
		type: "function",
	},
] as const;

