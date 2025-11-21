import { type ReactNode, createContext, useContext } from "react";
import { useWalletClient } from "wagmi";

import { storyTestnet } from "../lib/storyChain";

export const StoryReadyContext = createContext<boolean>(false);

export const useStoryReady = () => useContext(StoryReadyContext);

type Props = {
	children: ReactNode;
};

export const StorySdkProvider = ({ children }: Props) => {
	const { data: walletClient } = useWalletClient();

	const isReady = Boolean(walletClient) && walletClient?.chain?.id === storyTestnet.id;

	return (
		<StoryReadyContext.Provider value={isReady}>
			{children}
		</StoryReadyContext.Provider>
	);
};
