"use client";

import { Search, SlidersHorizontal } from "lucide-react";

interface TypeOption {
  value: string;
  label: string;
}

interface ProductFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
  typeOptions: TypeOption[];
}

export default function ProductFilter({
  search,
  onSearchChange,
  selectedType,
  onTypeChange,
  typeOptions,
}: ProductFilterProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 transition-colors focus:border-caja-blue-bright focus:outline-none focus:ring-2 focus:ring-caja-blue-bright/20"
        />
      </div>

      <div className="flex items-center gap-2">
        <SlidersHorizontal className="hidden h-4 w-4 shrink-0 text-slate-400 sm:block" />
        <div className="flex gap-1.5 overflow-x-auto">
          {typeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onTypeChange(opt.value)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                selectedType === opt.value
                  ? "bg-caja-blue-dark text-white"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
