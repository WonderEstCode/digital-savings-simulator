import { NextResponse } from "next/server";
import { getProducts } from "@/lib/api";

export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products);
}
