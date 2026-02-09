"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import { Search, ChevronDown, TrendingUp, Wallet, X } from "lucide-react";
import type { Product } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";

interface ProductComboboxProps {
  products: Product[];
  value: string;
  onChange: (productId: string) => void;
  error?: string;
}

export default function ProductCombobox({
  products,
  value,
  onChange,
  error,
}: ProductComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const debouncedSearch = useDebounce(search, 200);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === value) ?? null,
    [products, value],
  );

  const filtered = useMemo(() => {
    if (!debouncedSearch) return products;
    const q = debouncedSearch.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }, [products, debouncedSearch]);

  function handleSelect(productId: string) {
    onChange(productId);
    setOpen(false);
    setSearch("");
  }

  function handleClear() {
    onChange("");
    setSearch("");
    inputRef.current?.focus();
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
        setHighlightedIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!open) return;

      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < filtered.length - 1 ? prev + 1 : prev,
          );
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        }
        case "Enter": {
          e.preventDefault();
          if (highlightedIndex >= 0 && filtered[highlightedIndex]) {
            onChange(filtered[highlightedIndex].id);
            setOpen(false);
            setSearch("");
            setHighlightedIndex(-1);
          }
          break;
        }
        case "Escape": {
          e.preventDefault();
          setOpen(false);
          setHighlightedIndex(-1);
          break;
        }
      }
    }

    if (open) {
      const el = inputRef.current;
      el?.addEventListener("keydown", handleKeyDown);
      return () => el?.removeEventListener("keydown", handleKeyDown);
    }
  }, [open, highlightedIndex, filtered, onChange]);

  return (
    <div ref={containerRef} className="relative flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-700">
        Producto de ahorro
      </label>

      {selectedProduct && !open ? (
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            setTimeout(() => inputRef.current?.focus(), 0);
          }}
          className={cn(
            "flex items-center gap-3 rounded-xl border bg-white p-3 text-left transition-colors hover:border-caja-blue-bright",
            error ? "border-rose-500" : "border-slate-200",
          )}
        >
          {selectedProduct.image && (
            <Image
              src={selectedProduct.image}
              alt={selectedProduct.name}
              width={48}
              height={48}
              sizes="40px"
              className="h-10 w-10 shrink-0 rounded-lg object-contain"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-semibold text-slate-700">
              {selectedProduct.name}
            </p>
            <p className="flex items-center gap-2 text-xs text-slate-500">
              <span className="flex items-center gap-0.5 font-semibold text-caja-green">
                <TrendingUp className="h-3 w-3" />
                {selectedProduct.annualRate}% E.A.
              </span>
              <span className="flex items-center gap-0.5">
                <Wallet className="h-3 w-3" />
                {selectedProduct.minOpeningAmount === 0
                  ? "Sin mínimo"
                  : formatCurrency(selectedProduct.minOpeningAmount)}
              </span>
            </p>
          </div>
          <div
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleClear();
              }
            }}
            className="shrink-0 rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </div>
        </button>
      ) : (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={open}
            aria-controls="product-listbox"
            aria-activedescendant={
              open && highlightedIndex >= 0 && filtered[highlightedIndex]
                ? `product-option-${filtered[highlightedIndex].id}`
                : undefined
            }
            placeholder="Buscar producto por nombre..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setHighlightedIndex(-1);
              if (!open) setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            className={cn(
              "w-full rounded-xl border bg-white py-2.5 pl-10 pr-10 text-sm transition-colors focus:border-caja-blue-bright focus:outline-none focus:ring-2 focus:ring-caja-blue-bright/20",
              error
                ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                : "border-slate-200",
            )}
          />
          <ChevronDown
            className={cn(
              "absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-transform",
              open && "rotate-180",
            )}
          />
        </div>
      )}

      {error && <p className="text-sm text-rose-500">{error}</p>}

      {open && (
        <div
          ref={dropdownRef}
          id="product-listbox"
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg"
        >
          {filtered.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-slate-400">
              No se encontraron productos.
            </p>
          ) : (
            <div className="p-2">
              {filtered.map((product, index) => (
                <button
                  key={product.id}
                  id={`product-option-${product.id}`}
                  type="button"
                  role="option"
                  aria-selected={value === product.id}
                  onClick={() => handleSelect(product.id)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-blue-50",
                    value === product.id && "bg-blue-50 ring-1 ring-caja-blue-bright/30",
                    highlightedIndex === index && "bg-blue-100",
                  )}
                >
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={64}
                      height={64}
                      sizes="48px"
                      className="h-12 w-12 shrink-0 rounded-lg object-contain"
                    />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-400">
                      {product.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-700">
                      {product.name}
                    </p>
                    <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">
                      {product.description}
                    </p>
                    <div className="mt-1 flex items-center gap-3">
                      <span className="flex items-center gap-0.5 text-xs font-semibold text-caja-green">
                        <TrendingUp className="h-3 w-3" />
                        {product.annualRate}% E.A.
                      </span>
                      <span className="flex items-center gap-0.5 text-xs text-slate-400">
                        <Wallet className="h-3 w-3" />
                        {product.minOpeningAmount === 0
                          ? "Sin mínimo"
                          : formatCurrency(product.minOpeningAmount)}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
