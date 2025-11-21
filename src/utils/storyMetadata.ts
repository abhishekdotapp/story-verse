import { convertCIDtoHashIPFS } from "@story-protocol/core-sdk";
import type { Hex } from "viem";

export const getIpMetadataHashes = (
	ipfsHash: string,
): Partial<{
	ipMetadataHash: Hex;
	nftMetadataHash: Hex;
}> => {
	try {
		const hash = convertCIDtoHashIPFS(ipfsHash);
		return {
			ipMetadataHash: hash,
			nftMetadataHash: hash,
		};
	} catch (error) {
		console.warn(
			"⚠️ Unable to convert CID to hash. Proceeding without embedded hashes.",
			error,
		);
		return {};
	}
};


