"use client";

import { useCallback } from "react";
import { cn } from "@/lib/utils";
import { DollarSign } from "lucide-react";

interface CurrencyInputProps {
  label?: string;
  error?: string;
  value: string;
  onChange: (rawValue: string) => void;
  disabled?: boolean;
  placeholder?: string;
  id?: string;
}

function formatDisplay(raw: string): string {
  const num = Number(raw);
  if (!raw || isNaN(num)) return raw;
  return num.toLocaleString("es-CO");
}

function stripFormatting(formatted: string): string {
  return formatted.replace(/[.\s]/g, "");
}

export default function CurrencyInput({
  label,
  error,
  value,
  onChange,
  disabled = false,
  placeholder,
  id,
}: CurrencyInputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  const displayValue = formatDisplay(value);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = stripFormatting(e.target.value);
      if (raw === "" || /^\d+$/.test(raw)) {
        onChange(raw);
      }
    },
    [onChange],
  );

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          id={inputId}
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder}
          className={cn(
            "w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-14 text-sm font-medium tabular-nums transition-colors focus:border-caja-blue-bright focus:outline-none focus:ring-2 focus:ring-caja-blue-bright/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400",
            error &&
              "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20",
          )}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
          COP
        </span>
      </div>
      {error && <p className="text-sm text-rose-500">{error}</p>}
    </div>
  );
}
