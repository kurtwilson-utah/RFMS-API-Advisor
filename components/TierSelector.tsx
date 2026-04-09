"use client";

import type { Tier } from "@/lib/types";

const tiers: { value: Tier; label: string; description: string }[] = [
  { value: "Standard", label: "Standard", description: "CRM basics" },
  {
    value: "Plus",
    label: "Plus",
    description: "Orders, payments, inventory lookup",
  },
  {
    value: "Enterprise",
    label: "Enterprise",
    description: "Full CRUD, scheduling, inventory assignment",
  },
];

interface TierSelectorProps {
  selected: Tier;
  onChange: (tier: Tier) => void;
}

export default function TierSelector({
  selected,
  onChange,
}: TierSelectorProps) {
  return (
    <div className="flex items-center gap-1.5">
      {tiers.map((tier) => (
        <button
          key={tier.value}
          onClick={() => onChange(tier.value)}
          title={tier.description}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            selected === tier.value
              ? "bg-[#0066CC] text-white"
              : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70"
          }`}
        >
          {tier.label}
        </button>
      ))}
    </div>
  );
}
