import Image from "next/image";
import Link from "next/link";
import {
  LayoutGrid,
  Calculator,
  UserPlus,
  TrendingUp,
  Shield,
  Zap,
  ArrowRight,
  PiggyBank,
} from "lucide-react";
import { getProducts } from "@/lib/api";

const steps = [
  {
    number: "01",
    icon: LayoutGrid,
    title: "Explora productos",
    description: "Compara cuentas de ahorro con tasas, plazos y beneficios claros.",
    href: "/products",
    label: "Ver productos",
    color: "bg-blue-50 text-caja-blue-bright",
    borderColor: "border-blue-100",
  },
  {
    number: "02",
    icon: Calculator,
    title: "Simula tu rentabilidad",
    description: "Calcula cuánto ganarías con tu monto y plazo elegido.",
    href: "/simulator",
    label: "Ir al simulador",
    color: "bg-green-50 text-caja-green",
    borderColor: "border-green-100",
  },
  {
    number: "03",
    icon: UserPlus,
    title: "Abre tu cuenta",
    description: "Registra tu intención de apertura en pocos minutos.",
    href: "/onboarding",
    label: "Comenzar",
    color: "bg-amber-50 text-amber-500",
    borderColor: "border-amber-100",
  },
];

export default async function HomePage() {
  const allProducts = await getProducts();
  const maxRate = Math.max(...allProducts.map((p) => p.annualRate));

  const trustPoints = [
    {
      icon: TrendingUp,
      title: "Tasas competitivas",
      text: `Hasta ${maxRate}% E.A. en nuestros productos de ahorro a largo plazo.`,
    },
    {
      icon: Shield,
      title: "Seguro y confiable",
      text: "Tu dinero protegido con los más altos estándares de seguridad.",
    },
    {
      icon: Zap,
      title: "100% digital",
      text: "Simula, compara y abre tu cuenta sin salir de casa.",
    },
  ];
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-caja-blue-dark via-caja-blue-bright to-blue-600 px-4 py-8 sm:py-12">
        <div className="absolute -left-40 top-0 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

        <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-6 lg:items-center">
          <div className="text-center">
            <div className="inline-flex items-center gap-2.5 mb-3">
              <PiggyBank className="h-4 w-4 text-white/90" />
              <span className="text-xs font-semibold text-white/80">Aventura de Ahorro</span>
            </div>
            <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
              Tu próxima meta financiera
              <span className="block text-blue-100">empieza aquí</span>
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-base font-semibold leading-relaxed text-blue-50">
              Explora productos de ahorro, simula tu rentabilidad y da el primer paso hacia tus metas.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-2.5 sm:flex-row">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-2.5 text-xs font-semibold text-caja-blue-dark shadow-lg shadow-black/20 transition-all hover:bg-blue-50 hover:shadow-xl"
              >
                Explorar productos <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/simulator"
                className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white bg-transparent px-6 py-2.5 text-xs font-semibold text-white transition-all hover:bg-white/10"
              >
                <Calculator className="h-3.5 w-3.5" /> Simular ahorro
              </Link>
            </div>
          </div>

          <div className="relative shrink-0 flex items-center justify-center">
            <div className="absolute -top-3 -right-5 sm:-top-4 sm:-right-6 z-10">
              <div
                className="rounded-lg bg-blue-50 p-1.5 transition-transform duration-300 hover:scale-110"
                style={{
                  transform: "rotateX(25deg) rotateY(-30deg) rotateZ(20deg)",
                  boxShadow:
                    "0 20px 40px rgba(30, 58, 138, 0.3), inset -2px -2px 5px rgba(0, 0, 0, 0.1)",
                }}
              >
                <PiggyBank className="h-10 w-10 text-caja-blue-dark sm:h-12 sm:w-12" />
              </div>
            </div>

            <Image
              src="/images/products/ahorro-amigo.png"
              alt="Ahorro Amigo"
              width={300}
              height={300}
              className="h-48 w-48 object-contain sm:h-56 sm:w-56 lg:h-64 lg:w-64 drop-shadow-2xl"
              priority
            />
          </div>
        </div>
      </section>

      <section className="relative px-4 py-16 sm:py-24 bg-white">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-800 sm:text-4xl">
            ¿Cómo funciona?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-slate-600">
            Tres pasos simples para comenzar tu aventura de ahorro y alcanzar tus metas financieras.
          </p>
        </div>

        <div className="absolute left-0 top-40 opacity-60 pointer-events-none">
          <div
            className="rounded-lg bg-blue-50 p-1.5"
            style={{
              transform: "rotateX(-20deg) rotateY(25deg) rotateZ(-15deg)",
              boxShadow:
                "0 15px 30px rgba(30, 58, 138, 0.2), inset -1px -1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <PiggyBank className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="absolute right-0 bottom-40 opacity-50 pointer-events-none">
          <div
            className="rounded-lg bg-green-50 p-1.5"
            style={{
              transform: "rotateX(18deg) rotateY(-30deg) rotateZ(18deg)",
              boxShadow:
                "0 15px 30px rgba(56, 161, 105, 0.15), inset -1px -1px 3px rgba(0, 0, 0, 0.08)",
            }}
          >
            <PiggyBank className="h-7 w-7 text-caja-green" />
          </div>
        </div>

        <div className="relative mx-auto max-w-5xl">
          <div className="hidden lg:block absolute left-1/2 top-12 bottom-12 w-px -translate-x-1/2 bg-gradient-to-b from-blue-200 via-green-200 to-amber-200" />

          <div className="space-y-16 lg:space-y-24 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isEven = idx % 2 === 0;
              const numberColors = [
                "text-blue-100",
                "text-green-100",
                "text-amber-100",
              ];
              const iconBgColors = [
                "from-blue-50 to-blue-100",
                "from-green-50 to-green-100",
                "from-amber-50 to-amber-100",
              ];
              const numberAccentColors = [
                "text-blue-300",
                "text-green-300",
                "text-amber-300",
              ];

              return (
                <Link
                  key={step.href}
                  href={step.href}
                  className={`group relative flex flex-col items-center text-center lg:grid lg:grid-cols-2 lg:items-center lg:gap-16 lg:text-left`}
                >
                  {/* Mobile: stacked layout */}
                  {/* Desktop: zigzag - even rows: content left + number right, odd rows: number left + content right */}

                  <div className={`${isEven ? "lg:order-1" : "lg:order-2"}`}>
                    <div className="relative inline-flex items-center gap-4 lg:gap-6">
                      <span className={`hidden lg:block text-[8rem] xl:text-[10rem] font-black leading-none ${numberColors[idx]} select-none transition-all group-hover:scale-105`}>
                        {step.number}
                      </span>
                      <div
                        className={`relative flex h-20 w-20 lg:h-24 lg:w-24 items-center justify-center rounded-2xl bg-gradient-to-br ${iconBgColors[idx]} shadow-lg transition-all group-hover:-translate-y-2 group-hover:scale-110 group-hover:shadow-2xl`}
                      >
                        <Icon className="h-9 w-9 lg:h-10 lg:w-10 text-caja-blue-dark" />
                        <span className="lg:hidden absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-caja-blue-dark text-xs font-bold text-white shadow-lg">
                          {step.number}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={`mt-6 lg:mt-0 ${isEven ? "lg:order-2" : "lg:order-1 lg:text-right"}`}>
                    <span className={`hidden lg:block text-sm font-bold uppercase tracking-widest ${numberAccentColors[idx]} mb-2`}>
                      Paso {step.number}
                    </span>
                    <h3 className="text-xl lg:text-2xl font-bold text-slate-800">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm lg:text-base leading-relaxed text-slate-600 max-w-sm lg:max-w-md mx-auto lg:mx-0">
                      {step.description}
                    </p>
                    <span className={`mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-caja-blue-bright transition-colors group-hover:text-caja-blue-dark ${!isEven ? "lg:flex-row-reverse" : ""}`}>
                      {!isEven && <ArrowRight className="h-4 w-4 transition-transform group-hover:-translate-x-1 lg:rotate-180 hidden lg:block" />}
                      {step.label}
                      <ArrowRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${!isEven ? "lg:hidden" : ""}`} />
                      {isEven && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 hidden lg:block" />}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:py-16 bg-slate-50">
        <div className="relative mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-800 sm:text-3xl">
              ¿Por qué elegirnos?
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
              La mejor experiencia para tu ahorro.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {trustPoints.map((item, idx) => {
              const iconComps = [TrendingUp, Shield, Zap];
              const IconComp = iconComps[idx];
              const bgColors = [
                "from-blue-600 to-blue-500",
                "from-green-600 to-green-500",
                "from-amber-500 to-amber-400",
              ];
              const lightBgColors = [
                "from-blue-50 to-blue-100/50",
                "from-green-50 to-green-100/50",
                "from-amber-50 to-amber-100/50",
              ];

              return (
                <div
                  key={item.title}
                  className="group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  <div className={`h-1 bg-gradient-to-r ${bgColors[idx]}`} />
                  <div className={`bg-gradient-to-br ${lightBgColors[idx]} p-7 h-full`}>
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${bgColors[idx]} shadow-lg transition-transform group-hover:scale-110`}>
                      <IconComp className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mt-4 font-bold text-slate-800 text-base leading-tight">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-slate-600 text-sm leading-relaxed">{item.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
