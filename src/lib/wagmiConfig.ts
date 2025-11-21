import { http, createConfig } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";
import { storyTestnet } from "./storyChain";

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;
const appUrl = import.meta.env.VITE_APP_URL ?? "http://localhost:5173";

export const wagmiConfig = createConfig({
	chains: [storyTestnet, sepolia, mainnet],
	connectors: [
		injected({
			shimDisconnect: true,
			target() {
				return {
					id: "injected",
					name: "Browser Wallet",
					provider: window.ethereum,
				};
			},
		}),
		walletConnect({
			projectId: projectId ?? "demo",
			metadata: {
				name: "StoryVerse",
				description: "Create, license, and remix stories on Story Protocol",
				url: appUrl,
				icons: ["https://avatars.githubusercontent.com/u/11403763?s=200&v=4"],
			},
			showQrModal: true,
		}),
	],
	transports: {
		[storyTestnet.id]: http(storyTestnet.rpcUrls.default.http[0], {
			timeout: 30000, // 30 second timeout
			retryCount: 3, // Retry failed requests 3 times
			retryDelay: 1000, // Wait 1 second between retries
		}),
		[sepolia.id]: http(),
		[mainnet.id]: http(),
	},
	ssr: false,
});
