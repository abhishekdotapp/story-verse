import clsx from "clsx";
import type { HTMLAttributes } from "react";

export const Card = ({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) => (
	<div
		className={clsx(
			"glass-panel relative overflow-hidden border border-[rgba(255,255,255,0.08)] p-6",
			className,
		)}
		{...props}
	/>
);
