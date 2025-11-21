import clsx from "clsx";
import type { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLSpanElement> & {
	tone?: "default" | "success" | "danger" | "info";
};

export const Badge = ({ tone = "default", className, ...props }: Props) => {
	const palette: Record<typeof tone, string> = {
		default:
			"bg-[rgba(127,90,240,0.16)] text-[var(--accent-strong)] border border-[rgba(127,90,240,0.45)]",
		success:
			"bg-[rgba(74,222,128,0.15)] text-[#bbf7d0] border border-[rgba(74,222,128,0.35)]",
		danger:
			"bg-[rgba(255,91,107,0.15)] text-[#fecdd3] border border-[rgba(255,91,107,0.5)]",
		info: "bg-[rgba(56,189,248,0.1)] text-[#bae6fd] border border-[rgba(56,189,248,0.35)]",
	};

	return (
		<span
			className={clsx(
				"inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
				palette[tone],
				className,
			)}
			{...props}
		/>
	);
};
