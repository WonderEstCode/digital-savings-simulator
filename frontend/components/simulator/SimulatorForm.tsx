"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Calculator, TrendingUp, Clock } from "lucide-react";
import ProductCombobox from "@/components/ui/ProductCombobox";
import type { Product } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";
import { calculateSavings, type SimulationResult } from "@/lib/simulator";
import CurrencyInput from "@/components/ui/CurrencyInput";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

import SimulationResults from "./SimulationResults";

interface SimulatorFormProps {
  products: Product[];
  /** When provided, locks the form to a single product (hides selector) */
  fixedProduct?: Product;
}

type SimulatorFieldError = Partial<
  Record<"productId" | "initialAmount" | "monthlyContribution" | "termMonths", string>
>;

export default function SimulatorForm({ products, fixedProduct }: SimulatorFormProps) {
  const searchParams = useSearchParams();
  const preselectedId = fixedProduct?.id ?? searchParams.get("productId");

  const preselectedProduct = preselectedId
    ? fixedProduct ?? products.find((p) => p.id === preselectedId) ?? null
    : null;

  const [selectedProductId, setSelectedProductId] = useState(
    preselectedId ?? "",
  );
  const [initialAmount, setInitialAmount] = useState(
    preselectedProduct?.minOpeningAmount
      ? String(preselectedProduct.minOpeningAmount)
      : "",
  );
  const [monthlyContribution, setMonthlyContribution] = useState(
    preselectedProduct?.recommendedMonthlyContribution
      ? String(preselectedProduct.recommendedMonthlyContribution)
      : "",
  );
  const [termMonths, setTermMonths] = useState(
    preselectedProduct?.suggestedTermMonths
      ? String(preselectedProduct.suggestedTermMonths)
      : "",
  );
  const [errors, setErrors] = useState<SimulatorFieldError>({});
  const [result, setResult] = useState<SimulationResult | null>(null);

  const selectedProduct = useMemo(
    () => fixedProduct ?? products.find((p) => p.id === selectedProductId) ?? null,
    [products, selectedProductId, fixedProduct],
  );

  function validate(): boolean {
    const newErrors: SimulatorFieldError = {};

    if (!selectedProduct) {
      newErrors.productId = "Debes seleccionar un producto de ahorro.";
    }

    const parsedInitial = Number(initialAmount || "0");
    if (isNaN(parsedInitial) || parsedInitial < 0) {
      newErrors.initialAmount = "Ingresa un monto inicial válido.";
    } else if (
      selectedProduct &&
      selectedProduct.minOpeningAmount > 0 &&
      parsedInitial < selectedProduct.minOpeningAmount
    ) {
      newErrors.initialAmount = `El monto mínimo para ${selectedProduct.name} es ${formatCurrency(selectedProduct.minOpeningAmount)}.`;
    } else if (!initialAmount && selectedProduct && selectedProduct.minOpeningAmount > 0) {
      newErrors.initialAmount = "Ingresa un monto inicial válido.";
    }

    const parsedMonthly = Number(monthlyContribution || "0");
    if (isNaN(parsedMonthly) || parsedMonthly < 0) {
      newErrors.monthlyContribution =
        "El aporte mensual debe ser un número mayor o igual a 0.";
    }

    const parsedTerm = Number(termMonths);
    if (!termMonths || isNaN(parsedTerm) || !Number.isInteger(parsedTerm)) {
      newErrors.termMonths = "Ingresa un número entero de meses.";
    } else if (parsedTerm < 1 || parsedTerm > 360) {
      newErrors.termMonths = "El plazo debe estar entre 1 y 360 meses.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate() || !selectedProduct) return;

    const simResult = calculateSavings(
      Number(initialAmount),
      Number(monthlyContribution || "0"),
      Number(termMonths),
      selectedProduct.annualRate,
    );

    setResult(simResult);
  }

  function handleProductChange(value: string) {
    setSelectedProductId(value);
    setResult(null);
    setErrors({});

    const product = products.find((p) => p.id === value);
    if (product) {
      setInitialAmount(
        product.minOpeningAmount ? String(product.minOpeningAmount) : "",
      );
      setMonthlyContribution(
        product.recommendedMonthlyContribution
          ? String(product.recommendedMonthlyContribution)
          : "",
      );
      setTermMonths(
        product.suggestedTermMonths
          ? String(product.suggestedTermMonths)
          : "",
      );
    } else {
      setInitialAmount("");
      setMonthlyContribution("");
      setTermMonths("");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          {!fixedProduct && (
            <ProductCombobox
              products={products}
              value={selectedProductId}
              onChange={handleProductChange}
              error={errors.productId}
            />
          )}

          <div className={cn("space-y-5", !fixedProduct && "mt-6")}>
            <CurrencyInput
              label="Monto inicial"
              placeholder="Ej: 100.000"
              value={initialAmount}
              onChange={setInitialAmount}
              error={errors.initialAmount}
            />
            <CurrencyInput
              label="Aporte mensual"
              placeholder="Ej: 200.000"
              value={monthlyContribution}
              onChange={setMonthlyContribution}
              error={errors.monthlyContribution}
            />
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="term-months"
                className="text-sm font-medium text-slate-700"
              >
                Plazo (meses)
              </label>
              <input
                id="term-months"
                type="number"
                min={1}
                max={360}
                placeholder="Ej: 12"
                value={termMonths}
                onChange={(e) => setTermMonths(e.target.value)}
                className={cn(
                  "rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium tabular-nums transition-colors focus:border-caja-blue-bright focus:outline-none focus:ring-2 focus:ring-caja-blue-bright/20",
                  errors.termMonths &&
                    "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20",
                )}
              />
              {errors.termMonths && (
                <p className="text-sm text-rose-500">{errors.termMonths}</p>
              )}
            </div>
            <Button type="submit" className="flex w-full items-center justify-center gap-2">
              <Calculator className="h-4 w-4" /> Calcular rentabilidad
            </Button>
          </div>
        </Card>

        {result && selectedProduct ? (
          <SimulationResults
            result={result}
            productName={selectedProduct.name}
            productId={selectedProduct.id}
            termMonths={Number(termMonths)}
          />
        ) : (
          <Card className="flex flex-col items-center justify-center text-center">
            {selectedProduct ? (
              <>
                {selectedProduct.image && (
                  <Image
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    width={240}
                    height={240}
                    sizes="160px"
                    className="h-40 w-40 object-contain"
                  />
                )}
                <h3 className="mt-4 text-xl font-bold text-slate-700">
                  {selectedProduct.name}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {selectedProduct.description}
                </p>
                <div className="mt-4 flex items-center justify-center gap-4">
                  <span className="flex items-center gap-1 text-sm font-bold text-caja-green">
                    <TrendingUp className="h-3.5 w-3.5" />
                    {selectedProduct.annualRate}% E.A.
                  </span>
                  <span className="flex items-center gap-1 text-sm text-slate-500">
                    <Clock className="h-3.5 w-3.5" />
                    {selectedProduct.suggestedTermMonths} meses
                  </span>
                </div>
                <div className="mt-5 rounded-lg bg-blue-50 px-4 py-3">
                  <p className="text-sm font-medium text-caja-blue-dark">
                    Estás a un paso de conocer tu rentabilidad
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Completa los campos y presiona calcular.
                  </p>
                </div>
              </>
            ) : (
              <>
                <Image
                  src="/images/hero.png"
                  alt="Simula tu ahorro"
                  width={180}
                  height={180}
                  sizes="160px"
                  className="h-40 w-40 rounded-2xl object-contain"
                />
                <h3 className="mt-4 text-xl font-bold text-slate-700">
                  Simula tu ahorro
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Selecciona un producto y completa los campos para ver cuánto podrías ganar.
                </p>
              </>
            )}
          </Card>
        )}
      </div>
    </form>
  );
}
