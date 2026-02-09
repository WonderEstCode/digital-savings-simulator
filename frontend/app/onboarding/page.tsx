import { Suspense } from "react";
import { PiggyBank, CheckCircle, ArrowRight } from "lucide-react";
import OnboardingForm from "@/components/onboarding/OnboardingForm";
import { getProducts } from "@/lib/api";

export default async function OnboardingPage() {
  const data = await getProducts();

  return (
    <div className="relative min-h-[calc(100vh-4rem)] lg:flex">
      {/* Left side / Mobile: form area */}
      <div className="flex-1 lg:w-[45%] bg-gradient-to-b from-slate-50 to-white lg:bg-gradient-to-br lg:from-slate-50 lg:via-white lg:to-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-10 lg:flex lg:items-center lg:justify-center lg:min-h-[calc(100vh-4rem)] lg:px-12">
          <div className="w-full max-w-lg mx-auto lg:mx-0 lg:ml-auto lg:mr-12">
            {/* Mobile header */}
            <div className="text-center lg:hidden">
              <h1 className="text-3xl font-bold text-slate-700">
                Abre tu cuenta de ahorro
              </h1>
              <p className="mt-2 text-slate-500">
                Completa el formulario para registrar tu intención de apertura.
              </p>
            </div>

            {/* Desktop header */}
            <div className="hidden lg:block mb-2">
              <h2 className="text-2xl font-bold text-slate-800">
                Abre tu cuenta de ahorro
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Completa el formulario para registrar tu intención de apertura.
              </p>
            </div>

            <div className="mt-8 lg:mt-6">
              <Suspense
                fallback={
                  <div className="mx-auto h-96 max-w-lg animate-pulse rounded-xl bg-slate-100" />
                }
              >
                <OnboardingForm products={data} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: right panel with gradient bg, motivational text and decorative pigs */}
      <div className="hidden lg:flex lg:w-[55%] xl:w-[55%] relative overflow-hidden bg-gradient-to-br from-caja-blue-dark via-caja-blue-bright to-blue-600 flex-col justify-center px-12 xl:px-20">
        {/* Decorative blurs */}
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        {/* Decorative 3D piggy banks */}
        <div className="absolute top-16 right-16 opacity-60 pointer-events-none">
          <div
            className="rounded-xl bg-white/15 p-2.5 backdrop-blur-sm"
            style={{
              transform: "rotateX(20deg) rotateY(-25deg) rotateZ(15deg)",
              boxShadow:
                "0 20px 40px rgba(0, 0, 0, 0.2), inset -2px -2px 5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <PiggyBank className="h-10 w-10 text-white/80" />
          </div>
        </div>

        <div className="absolute bottom-24 left-14 opacity-50 pointer-events-none">
          <div
            className="rounded-xl bg-white/10 p-2 backdrop-blur-sm"
            style={{
              transform: "rotateX(-15deg) rotateY(30deg) rotateZ(-20deg)",
              boxShadow:
                "0 15px 30px rgba(0, 0, 0, 0.15), inset -1px -1px 3px rgba(0, 0, 0, 0.08)",
            }}
          >
            <PiggyBank className="h-8 w-8 text-white/70" />
          </div>
        </div>

        <div className="absolute top-1/3 right-10 opacity-30 pointer-events-none">
          <div
            className="rounded-lg bg-white/10 p-1.5"
            style={{
              transform: "rotateX(25deg) rotateY(-15deg) rotateZ(25deg)",
              boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
            }}
          >
            <PiggyBank className="h-6 w-6 text-white/60" />
          </div>
        </div>

        <div className="absolute bottom-1/3 right-1/3 opacity-40 pointer-events-none">
          <div
            className="rounded-lg bg-white/10 p-2"
            style={{
              transform: "rotateX(-20deg) rotateY(20deg) rotateZ(-10deg)",
              boxShadow: "0 12px 25px rgba(0, 0, 0, 0.12)",
            }}
          >
            <PiggyBank className="h-7 w-7 text-white/65" />
          </div>
        </div>

        {/* Motivational content */}
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 backdrop-blur-sm mb-6">
            <PiggyBank className="h-4 w-4 text-blue-200" />
            <span className="text-xs font-semibold text-blue-100">Paso final</span>
          </div>

          <h1 className="text-3xl xl:text-4xl font-bold text-white leading-tight">
            Estás a un paso de
            <span className="block text-blue-200">comenzar tu aventura</span>
          </h1>

          <p className="mt-4 text-base text-blue-100/90 leading-relaxed">
            Completa tus datos y registra tu intención de apertura. Es rápido, seguro y 100% digital.
          </p>

          <div className="mt-8 space-y-3">
            {[
              "Elige el producto ideal para ti",
              "Ingresa tus datos personales",
              "Recibe tu código de solicitud",
            ].map((text) => (
              <div key={text} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-blue-300 shrink-0" />
                <span className="text-sm text-blue-50">{text}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-center gap-2 text-xs text-blue-200/70">
            <ArrowRight className="h-3.5 w-3.5" />
            <span>Proceso 100% en línea, sin papeleos</span>
          </div>
        </div>
      </div>
    </div>
  );
}
