import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: ["class"],
	content: ["./index.html", "./src/**/*.{ts,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				sans: [
					"Sora",
					"Inter",
					"system-ui",
					"-apple-system",
					"BlinkMacSystemFont",
					'"Segoe UI"',
					"sans-serif",
				],
			},
			boxShadow: {
				neon: "0 24px 60px rgba(127, 90, 240, 0.35)",
			},
		},
	},
	plugins: [],
};

export default config;
