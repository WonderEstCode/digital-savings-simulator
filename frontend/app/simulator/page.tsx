import { Suspense } from "react";
import SimulatorForm from "@/components/simulator/SimulatorForm";
import { getProducts } from "@/lib/api";

export default async function SimulatorPage() {
  const data = await getProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-700 sm:text-4xl">
        Simulador de Rentabilidad
      </h1>
      <p className="mt-2 max-w-lg text-slate-500">
        Calcula el interés estimado con monto inicial, aporte mensual y
        plazo. Elige un producto para ver resultados personalizados.
      </p>

      <div className="mt-8">
        <Suspense
          fallback={
            <div className="h-96 animate-pulse rounded-xl bg-slate-100" />
          }
        >
          <SimulatorForm products={data} />
        </Suspense>
      </div>
    </div>
  );
}
