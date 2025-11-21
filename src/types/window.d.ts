// Type declarations for window.ethereum and Web3 wallet integration

interface EthereumProvider {
	isMetaMask?: boolean;
	isCoinbaseWallet?: boolean;
	isPhantom?: boolean;
	isBraveWallet?: boolean;

	request(args: {
		method: string;
		params?: unknown[] | Record<string, unknown>;
	}): Promise<unknown>;

	on(eventName: string, handler: (...args: unknown[]) => void): void;
	removeListener(
		eventName: string,
		handler: (...args: unknown[]) => void,
	): void;

	selectedAddress?: string | null;
	chainId?: string;
	networkVersion?: string;

	// Legacy methods (still used by some wallets)
	enable?(): Promise<string[]>;
	sendAsync?(
		request: { method: string; params?: unknown[] },
		callback: (error: unknown, response: unknown) => void,
	): void;
	send?(
		request: { method: string; params?: unknown[] },
		callback: (error: unknown, response: unknown) => void,
	): void;
}

interface Window {
	ethereum?: EthereumProvider;
}

declare global {
	interface Window {
		ethereum?: EthereumProvider;
	}
}

export {};
