import { StoryClient, type StoryConfig } from "@story-protocol/core-sdk";
import { custom } from "viem";
import type { WalletClient } from "viem";

import { storyTestnet } from "./storyChain";

export const createStoryProtocolClient = (
	walletClient: WalletClient,
): ReturnType<typeof StoryClient.newClient> => {
	const config: StoryConfig = {
		wallet: walletClient as StoryConfig["wallet"],
		transport: custom(walletClient.transport),
		chainId: storyTestnet.id,
	};

	return StoryClient.newClient(config);
};


