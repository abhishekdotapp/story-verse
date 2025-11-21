import { Lock } from "lucide-react";
import { Badge } from "../ui/Badge";

interface PaymentBadgeProps {
	requiresPayment?: boolean;
	readingFee?: string;
	isPaid?: boolean;
	compact?: boolean;
}

export const PaymentBadge = ({
	requiresPayment,
	readingFee,
	isPaid,
	compact = false,
}: PaymentBadgeProps) => {
	// Free story
	if (!requiresPayment) {
		return (
			<Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
				<span className="text-xs">FREE</span>
			</Badge>
		);
	}

	// Already paid
	if (isPaid) {
		return (
			<Badge className="bg-green-500/20 text-green-300 border-green-500/30">
				<span className="text-xs">✓ UNLOCKED</span>
			</Badge>
		);
	}

	// Requires payment
	const amount = readingFee || "0.01";

	if (compact) {
		return (
			<Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 flex items-center gap-1">
				<Lock className="h-3 w-3" />
				<span className="text-xs">{amount} IP</span>
			</Badge>
		);
	}

	return (
		<div className="flex items-center gap-2">
			<Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 flex items-center gap-1.5">
				<Lock className="h-3 w-3" />
				<span className="text-xs font-medium">{amount} IP</span>
			</Badge>
			<span className="text-xs text-gray-400">to read</span>
		</div>
	);
};
