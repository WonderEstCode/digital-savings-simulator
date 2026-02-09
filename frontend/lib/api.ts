import type { Product } from "@/types";

const API_URL = process.env.API_URL ?? "http://localhost:3001/api";

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/products`, {
    next: { tags: ["products"], revalidate: 3600 },
  });

  if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
  return res.json();
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const res = await fetch(`${API_URL}/products/${slug}`, {
    next: { tags: ["products"], revalidate: 3600 },
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to fetch product: ${res.status}`);
  return res.json();
}

export async function getProductTypes(): Promise<
  Record<string, { label: string; benefits: { title: string; description: string }[] }>
> {
  const res = await fetch(`${API_URL}/product-types`, {
    next: { tags: ["product-types"], revalidate: 3600 },
  });

  if (!res.ok) throw new Error(`Failed to fetch product types: ${res.status}`);
  return res.json();
}
