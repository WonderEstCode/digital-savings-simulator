"use client";

import { useState } from "react";
import {
  ChevronDown,
  TrendingUp,
  Wallet,
  Calculator,
  Clock,
  Droplets,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  TrendingUp,
  Wallet,
  Calculator,
  Clock,
  Droplets,
};

interface DetailRow {
  icon: string;
  label: string;
  value: string;
  valueColor?: string;
  hint: string;
}

interface ProductDetailCardProps {
  rows: DetailRow[];
  tags: string[];
}

export default function ProductDetailCard({ rows, tags }: ProductDetailCardProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  function toggle(index: number) {
    setExpandedIndex((prev) => (prev === index ? null : index));
  }

  return (
    <div className="rounded-xl bg-white p-5 shadow-card border border-slate-100">
      <div className="divide-y divide-slate-100">
        {rows.map((row, index) => {
          const Icon = iconMap[row.icon];
          const isExpanded = expandedIndex === index;

          return (
            <button
              key={row.label}
              type="button"
              onClick={() => toggle(index)}
              className="w-full text-left py-3 first:pt-0 last:pb-0 group"
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-slate-600">
                  {Icon && <Icon className="h-4 w-4" />} {row.label}
                  <ChevronDown
                    className={cn(
                      "h-3 w-3 text-slate-400 transition-transform duration-200",
                      isExpanded && "rotate-180",
                    )}
                  />
                </span>
                <span className={cn("text-sm font-semibold", row.valueColor ?? "text-slate-800")}>
                  {row.value}
                </span>
              </div>
              <div
                className={cn(
                  "overflow-hidden transition-all duration-200",
                  isExpanded ? "max-h-24 opacity-100 mt-2" : "max-h-0 opacity-0",
                )}
              >
                <p className="text-xs leading-relaxed text-slate-500 bg-slate-50 rounded-lg px-3 py-2">
                  {row.hint}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Tags */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-caja-blue-bright"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
