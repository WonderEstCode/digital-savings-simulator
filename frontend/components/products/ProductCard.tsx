import Image from "next/image";
import Link from "next/link";
import { TrendingUp, Wallet, ArrowRight } from "lucide-react";
import type { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { getProductTheme } from "@/lib/product-theme";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { cardGradient } = getProductTheme(product.type);

  return (
    <Link href={`/products/${product.slug}`}>
      <article className={`group relative flex items-center gap-4 overflow-visible rounded-2xl border border-slate-200/60 bg-gradient-to-r ${cardGradient} p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card sm:gap-6 sm:p-8`}>
        {/* Image that overflows the card */}
        <div className="relative -mb-10 -mt-10 shrink-0 sm:-mb-14 sm:-mt-14">
          {product.image && (
            <Image
              src={product.image}
              alt={product.name}
              width={320}
              height={320}
              quality={95}
              sizes="(min-width: 640px) 160px, 112px"
              className="h-28 w-28 object-contain drop-shadow-lg sm:h-40 sm:w-40"
            />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 py-1">
          <h3 className="text-lg font-bold text-slate-700 sm:text-xl">
            {product.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-slate-500">
            {product.description}
          </p>

          {/* Key stats */}
          <div className="mt-3 flex items-center gap-4">
            <span className="flex items-center gap-1 text-sm font-bold text-caja-green">
              <TrendingUp className="h-3.5 w-3.5" />
              {product.annualRate}% E.A.
            </span>
            <span className="flex items-center gap-1 text-sm text-slate-500">
              <Wallet className="h-3.5 w-3.5" />
              {product.minOpeningAmount === 0
                ? "Sin mínimo"
                : formatCurrency(product.minOpeningAmount)}
            </span>
          </div>

          <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-caja-blue-bright transition-colors group-hover:text-caja-blue-dark">
            Conocer más <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </article>
    </Link>
  );
}
