import { Suspense } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  TrendingUp,
  Wallet,
  Clock,
  UserPlus,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { getProductTheme } from "@/lib/product-theme";
import { getProducts, getProductTypes } from "@/lib/api";

import SimulatorForm from "@/components/simulator/SimulatorForm";
import ProductDetailCard from "@/components/products/ProductDetailCard";

const liquidityLabels: Record<string, { label: string; color: string }> = {
  high: { label: "Alta", color: "text-caja-green" },
  medium: { label: "Media", color: "text-amber-500" },
  low: { label: "Baja", color: "text-slate-500" },
};

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const products = await getProducts();
  const product = products.find((p) => p.slug === slug);
  if (!product) return { title: "Producto no encontrado" };
  return {
    title: `${product.name} — Aventura de Ahorro`,
    description: product.description,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [allProducts, productTypes] = await Promise.all([
    getProducts(),
    getProductTypes(),
  ]);
  const product = allProducts.find((p) => p.slug === slug);

  if (!product) notFound();

  const theme = getProductTheme(product.type, productTypes);
  const liq = liquidityLabels[product.liquidity] ?? liquidityLabels.medium;

  return (
    <div>
      <div className="border-b border-slate-200 bg-white px-4 py-4">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-caja-blue-bright transition-colors hover:text-caja-blue-dark"
          >
            <ArrowLeft className="h-4 w-4" /> Volver a productos
          </Link>
        </div>
      </div>

      <section className={`relative overflow-hidden bg-gradient-to-br ${theme.heroGradient} px-4 py-16 sm:py-24`}>
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 -left-10 h-60 w-60 rounded-full bg-white/5" />

        <div className="relative mx-auto max-w-5xl">
          <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-center lg:gap-8">
            <div className="flex-1 text-center lg:text-left">
              <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
                {theme.label}
              </span>
              <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl lg:text-5xl">
                {product.name}
              </h1>
              <p className="mt-4 max-w-lg text-base text-white/95 leading-relaxed">
                {product.description}
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
                <div className="rounded-xl bg-white/95 px-4 py-3">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                    <TrendingUp className="h-4 w-4" /> Tasa E.A.
                  </div>
                  <p className="mt-1 text-2xl font-bold text-caja-blue-dark">
                    {product.annualRate}%
                  </p>
                </div>
                <div className="rounded-xl bg-white/95 px-4 py-3">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                    <Wallet className="h-4 w-4" /> Monto mínimo
                  </div>
                  <p className="mt-1 text-lg font-bold text-caja-blue-dark">
                    {product.minOpeningAmount === 0
                      ? "Sin mínimo"
                      : formatCurrency(product.minOpeningAmount)}
                  </p>
                </div>
                <div className="rounded-xl bg-white/95 px-4 py-3">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                    <Clock className="h-4 w-4" /> Plazo sugerido
                  </div>
                  <p className="mt-1 text-lg font-bold text-caja-blue-dark">
                    {product.suggestedTermMonths} meses
                  </p>
                </div>
              </div>
            </div>

            {product.image && (
              <div className="shrink-0">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={560}
                  height={560}
                  quality={95}
                  sizes="(min-width: 1024px) 256px, (min-width: 640px) 224px, 192px"
                  className="h-48 w-48 object-contain drop-shadow-2xl sm:h-56 sm:w-56 lg:h-64 lg:w-64"
                  priority
                />
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 px-4 py-4">
        <div className="mx-auto max-w-5xl flex items-center justify-between gap-6">
          <div>
            <h3 className="text-base font-semibold text-slate-700">
              ¿Te interesa {product.name}?
            </h3>
            <p className="mt-0.5 text-sm text-slate-500">
              Abre tu cuenta en pocos minutos, 100% digital.
            </p>
          </div>
          <Link
            href={`/onboarding?productId=${product.id}`}
            className="flex-shrink-0 inline-flex items-center gap-2 rounded-xl bg-caja-blue-dark px-6 py-3 text-sm font-bold text-white shadow-lg shadow-caja-blue-dark/25 transition-all hover:bg-caja-blue-dark/90 hover:shadow-xl hover:scale-105"
          >
            <UserPlus className="h-4 w-4" /> Abrir cuenta
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <div className="space-y-12">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">
              Simula tu rentabilidad
            </h2>
            <p className="mt-3 text-base text-slate-600 max-w-2xl">
              Calcula cuánto ganarías con {product.name}. Los campos están
              precargados con los valores sugeridos.
            </p>
            <div className="mt-8">
              <Suspense
                fallback={
                  <div className="h-96 animate-pulse rounded-xl bg-slate-100" />
                }
              >
                <SimulatorForm
                  products={allProducts}
                  fixedProduct={product}
                />
              </Suspense>
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <h2 className="text-2xl font-bold text-slate-800">
                Beneficios
              </h2>
              <div className="mt-6 space-y-4">
                {theme.benefits.map((benefit: { title: string; description: string }) => (
                  <div
                    key={benefit.title}
                    className="flex gap-3 rounded-xl bg-white p-5 shadow-soft border border-slate-100"
                  >
                    <div className="mt-0.5 shrink-0">
                      <CheckCircle className="h-5 w-5 text-caja-green" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">
                        {benefit.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-2xl font-bold text-slate-800">
                Detalles del producto
              </h2>
              <ProductDetailCard
                rows={[
                  {
                    icon: "TrendingUp",
                    label: "Tasa E.A.",
                    value: `${product.annualRate}%`,
                    valueColor: "font-bold text-caja-green",
                    hint: "Es el porcentaje que tu dinero gana en un año. Mientras más alta, más crecen tus ahorros con el tiempo.",
                  },
                  {
                    icon: "Wallet",
                    label: "Monto mínimo",
                    value: product.minOpeningAmount === 0
                      ? "Sin mínimo"
                      : formatCurrency(product.minOpeningAmount),
                    hint: product.minOpeningAmount === 0
                      ? "No necesitas un monto específico para empezar. Puedes abrir tu cuenta con cualquier valor."
                      : `Para abrir esta cuenta necesitas al menos ${formatCurrency(product.minOpeningAmount)}. Es el punto de partida de tu ahorro.`,
                  },
                  ...(product.recommendedMonthlyContribution > 0
                    ? [{
                        icon: "Calculator",
                        label: "Aporte sugerido",
                        value: `${formatCurrency(product.recommendedMonthlyContribution)}/mes`,
                        hint: "Es la cantidad que te recomendamos ahorrar cada mes para alcanzar mejores resultados. No es obligatorio, pero ayuda mucho.",
                      }]
                    : []),
                  {
                    icon: "Clock",
                    label: "Plazo sugerido",
                    value: `${product.suggestedTermMonths} meses`,
                    hint: `Te sugerimos mantener tu ahorro durante ${product.suggestedTermMonths} meses para obtener el mejor rendimiento. Puedes elegir otro plazo si prefieres.`,
                  },
                  {
                    icon: "Droplets",
                    label: "Liquidez",
                    value: liq.label,
                    valueColor: `font-semibold ${liq.color}`,
                    hint: liq.label === "Alta"
                      ? "Puedes retirar tu dinero en cualquier momento sin penalización. Ideal si necesitas acceso rápido a tus fondos."
                      : liq.label === "Media"
                        ? "Puedes acceder a tu dinero con algunas condiciones. Un buen balance entre rendimiento y disponibilidad."
                        : "Tu dinero está comprometido por más tiempo, pero a cambio obtienes una mejor rentabilidad.",
                  },
                ]}
                tags={product.tags}
              />

              <div className="rounded-xl bg-blue-50 px-5 py-4 border border-blue-100">
                <h3 className="text-xs font-semibold text-caja-blue-dark flex items-center gap-2">
                  <UserPlus className="h-3.5 w-3.5" /> ¿Para quién es este producto?
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-700">
                  {product.targetAudience}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-caja-green to-caja-green/80 p-8 text-center">
            <h3 className="text-2xl font-bold text-white">
              ¿Listo para comenzar?
            </h3>
            <p className="mt-2 text-base text-white/80">
              Registra tu intención de apertura en pocos minutos.
            </p>
            <Link
              href={`/onboarding?productId=${product.id}`}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-semibold text-caja-green transition-all hover:bg-white/90 hover:scale-105"
            >
              <UserPlus className="h-5 w-5" /> Abrir esta cuenta
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
