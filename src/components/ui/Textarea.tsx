import clsx from "clsx";
import { type TextareaHTMLAttributes, forwardRef } from "react";

export const Textarea = forwardRef<
	HTMLTextAreaElement,
	TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
	<textarea
		ref={ref}
		className={clsx(
			"min-h-[120px] w-full rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(10,10,30,0.55)] px-4 py-3 text-sm text-[var(--text-0)] leading-relaxed shadow-[0_10px_30px_rgba(12,10,35,0.35)] transition focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[rgba(127,90,240,0.4)]",
			className,
		)}
		{...props}
	/>
));

Textarea.displayName = "Textarea";
