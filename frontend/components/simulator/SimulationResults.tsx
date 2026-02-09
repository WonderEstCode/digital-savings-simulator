import Link from "next/link";
import {
  PiggyBank,
  ArrowDownToLine,
  TrendingUp,
  Percent,
  UserPlus,
} from "lucide-react";
import Card from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import type { SimulationResult } from "@/lib/simulator";

interface SimulationResultsProps {
  result: SimulationResult;
  productName: string;
  productId: string;
  termMonths: number;
}

export default function SimulationResults({
  result,
  productName,
  productId,
  termMonths,
}: SimulationResultsProps) {
  return (
    <Card className="flex flex-col justify-center">
      <h2 className="text-xl font-bold text-slate-700">
        Resultado de la Simulación
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        {productName} &mdash; {termMonths} {termMonths === 1 ? "mes" : "meses"}
      </p>

      <div className="mt-6 space-y-4">
        <div className="rounded-xl bg-gradient-to-r from-caja-blue-dark to-caja-blue-bright p-5 text-center">
          <div className="flex items-center justify-center gap-2">
            <PiggyBank className="h-5 w-5 text-white/70" />
            <p className="text-sm font-medium text-white/70">
              Saldo final estimado
            </p>
          </div>
          <p className="mt-1 text-3xl font-bold text-white">
            {formatCurrency(result.finalBalance)}
          </p>
        </div>

        <div className="space-y-3 rounded-lg bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-slate-500">
              <ArrowDownToLine className="h-4 w-4" /> Total depositado
            </span>
            <span className="font-semibold text-slate-700">
              {formatCurrency(result.totalDeposited)}
            </span>
          </div>
          <div className="border-t border-slate-200" />
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-slate-500">
              <TrendingUp className="h-4 w-4" /> Intereses ganados
            </span>
            <span className="font-bold text-caja-green">
              {formatCurrency(result.interestEarned)}
            </span>
          </div>
          <div className="border-t border-slate-200" />
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-slate-500">
              <Percent className="h-4 w-4" /> Tasa E.A.
            </span>
            <span className="font-semibold text-slate-700">
              {result.effectiveAnnualRate}%
            </span>
          </div>
        </div>
      </div>

      <Link
        href={`/onboarding?productId=${productId}`}
        className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-caja-green px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-caja-green/90"
      >
        <UserPlus className="h-4 w-4" /> Abrir esta cuenta
      </Link>

      <p className="mt-4 text-xs text-slate-400">
        * Simulación estimada. Los valores reales pueden variar según
        condiciones del mercado.
      </p>
    </Card>
  );
}
