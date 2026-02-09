import { Suspense } from "react";
import OnboardingForm from "@/components/onboarding/OnboardingForm";
import { getProducts } from "@/lib/api";

export default async function OnboardingPage() {
  const data = await getProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-700">
          Abre tu cuenta de ahorro
        </h1>
        <p className="mt-2 text-slate-500">
          Completa el formulario para registrar tu intención de apertura.
        </p>
      </div>

      <div className="mt-8">
        <Suspense
          fallback={
            <div className="mx-auto h-96 max-w-lg animate-pulse rounded-xl bg-slate-100" />
          }
        >
          <OnboardingForm products={data} />
        </Suspense>
      </div>
    </div>
  );
}
