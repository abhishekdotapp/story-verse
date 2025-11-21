import { TooltipProvider } from "@radix-ui/react-tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import React from "react";
import ReactDOM from "react-dom/client";
import { WagmiProvider } from "wagmi";

import { App } from "./App";
import { queryClient } from "./lib/queryClient";
import { wagmiConfig } from "./lib/wagmiConfig";
import { StorySdkProvider } from "./providers/StorySdkProvider";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<WagmiProvider config={wagmiConfig}>
			<QueryClientProvider client={queryClient}>
				<TooltipProvider>
					<StorySdkProvider>
						<AnimatePresence mode="wait">
							<App />
						</AnimatePresence>
					</StorySdkProvider>
				</TooltipProvider>
			</QueryClientProvider>
		</WagmiProvider>
	</React.StrictMode>,
);
