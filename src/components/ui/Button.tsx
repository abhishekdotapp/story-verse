import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import clsx from "clsx";
import { type ButtonHTMLAttributes, forwardRef } from "react";

const buttonVariants = cva(
	"inline-flex items-center justify-center rounded-lg border border-transparent px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50",
	{
		variants: {
			variant: {
				primary:
					"bg-[var(--accent)] text-[var(--bg-0)] shadow-[0_14px_40px_rgba(127,90,240,0.35)] focus-visible:outline-[var(--accent)]",
				secondary:
					"bg-[var(--bg-1)] text-[var(--text-0)] border border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.08)] focus-visible:outline-[var(--accent)]",
				ghost:
					"bg-transparent text-[var(--text-0)] hover:bg-[rgba(255,255,255,0.08)] focus-visible:outline-[var(--accent)]",
			},
			size: {
				sm: "h-9 px-3 text-xs",
				md: "h-11 px-4 text-sm",
				lg: "h-12 px-5 text-base",
			},
		},
		defaultVariants: {
			variant: "primary",
			size: "md",
		},
	},
);

type Props = ButtonHTMLAttributes<HTMLButtonElement> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	};

export const Button = forwardRef<HTMLButtonElement, Props>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : "button";
		return (
			<Comp
				className={clsx(buttonVariants({ variant, size }), className)}
				ref={ref}
				{...props}
			/>
		);
	},
);

Button.displayName = "Button";
