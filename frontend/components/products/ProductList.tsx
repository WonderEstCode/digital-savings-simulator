"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";
import { getProductTheme } from "@/lib/product-theme";
import ProductCard from "./ProductCard";
import ProductFilter from "./ProductFilter";

interface ProductListProps {
  products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const typeOptions = useMemo(() => {
    const seen = new Set<string>();
    const options = [{ value: "", label: "Todos" }];
    for (const p of products) {
      if (!seen.has(p.type)) {
        seen.add(p.type);
        options.push({ value: p.type, label: getProductTheme(p.type).label });
      }
    }
    return options;
  }, [products]);

  const debouncedSearch = useDebounce(search);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesName = p.name
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase());
      const matchesType = selectedType === "" || p.type === selectedType;
      return matchesName && matchesType;
    });
  }, [products, debouncedSearch, selectedType]);

  return (
    <div>
      <ProductFilter
        search={search}
        onSearchChange={setSearch}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        typeOptions={typeOptions}
      />

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-gray-500">
          No se encontraron productos con esos criterios.
        </p>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
