import Link from "next/link";
import { PiggyBank } from "lucide-react";
import products from "@/data/products.json";

const productLinks = products.map((p) => ({
  href: `/products/${p.slug}`,
  label: p.name,
}));

const resourceLinks = [
  { href: "/simulator", label: "Simulador de rentabilidad" },
  { href: "/onboarding", label: "Abrir una cuenta" },
  { href: "/products", label: "Comparar productos" },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-bold text-caja-blue-dark"
            >
              <div className="rounded-lg bg-rose-50 p-1.5">
                <PiggyBank className="h-5 w-5 text-rose-500" />
              </div>
              Aventura de Ahorro
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              Tu plataforma digital para explorar productos de ahorro, simular
              tu rentabilidad y dar el primer paso hacia tus metas financieras.
            </p>
          </div>


          <div>
            <h4 className="text-sm font-semibold text-slate-700">Productos</h4>
            <ul className="mt-3 space-y-2">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 transition-colors hover:text-caja-blue-bright"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>


          <div>
            <h4 className="text-sm font-semibold text-slate-700">Recursos</h4>
            <ul className="mt-3 space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 transition-colors hover:text-caja-blue-bright"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>


          <div>
            <h4 className="text-sm font-semibold text-slate-700">Legal</h4>
            <ul className="mt-3 space-y-2">
              <li>
                <span className="text-sm text-slate-400">
                  Proyecto educativo / prueba técnica
                </span>
              </li>
              <li>
                <span className="text-sm text-slate-400">
                  No constituye asesoría financiera
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-6 sm:flex-row">
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} Aventura de Ahorro. Todos los
            derechos reservados.
          </p>
          <p className="text-xs text-slate-400">
            Las tasas y rendimientos son simulados con fines ilustrativos.
          </p>
        </div>
      </div>
    </footer>
  );
}
