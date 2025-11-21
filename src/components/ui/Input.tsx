import clsx from "clsx";
import { type InputHTMLAttributes, forwardRef } from "react";

export const Input = forwardRef<
	HTMLInputElement,
	InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
	<input
		ref={ref}
		className={clsx(
			"h-11 w-full rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(10,10,30,0.55)] px-4 text-sm text-[var(--text-0)] shadow-[0_10px_30px_rgba(12,10,35,0.35)] transition focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[rgba(127,90,240,0.4)]",
			className,
		)}
		{...props}
	/>
));

Input.displayName = "Input";
