"use client";

import { useState, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { User, FileText, Mail, Send, ShieldCheck, ShieldAlert } from "lucide-react";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";
import ProductCombobox from "@/components/ui/ProductCombobox";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import OnboardingSuccess from "./OnboardingSuccess";

interface OnboardingFormProps {
  products: Product[];
}

const hasRealRecaptcha = !!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

type OnboardingFieldError = Partial<
  Record<"productId" | "fullName" | "documentNumber" | "email" | "recaptcha", string>
>;

export default function OnboardingForm({ products }: OnboardingFormProps) {
  const searchParams = useSearchParams();
  const preselectedId = searchParams.get("productId");

  const { executeRecaptcha } = useGoogleReCaptcha();

  const [selectedProductId, setSelectedProductId] = useState(
    preselectedId ?? "",
  );
  const [fullName, setFullName] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<OnboardingFieldError>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{
    code: string;
    name: string;
    email: string;
  } | null>(null);

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === selectedProductId) ?? null,
    [products, selectedProductId],
  );

  function validate(): boolean {
    const newErrors: OnboardingFieldError = {};

    if (!selectedProductId) {
      newErrors.productId = "Selecciona el producto que deseas abrir.";
    }

    const trimmedName = fullName.trim();
    if (!trimmedName) {
      newErrors.fullName = "Ingresa tu nombre completo.";
    } else if (trimmedName.length < 3) {
      newErrors.fullName = "El nombre debe tener al menos 3 caracteres.";
    }

    const trimmedDoc = documentNumber.trim();
    if (!trimmedDoc) {
      newErrors.documentNumber = "Ingresa tu número de documento.";
    } else if (!/^\d{6,12}$/.test(trimmedDoc)) {
      newErrors.documentNumber =
        "El documento debe tener entre 6 y 12 dígitos numéricos.";
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      newErrors.email = "Ingresa tu correo electrónico.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      newErrors.email = "Ingresa un correo electrónico válido.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const getRecaptchaToken = useCallback(async (): Promise<string | null> => {
    if (!hasRealRecaptcha) {
      return "SIMULATED_TOKEN";
    }
    if (executeRecaptcha) {
      try {
        return await executeRecaptcha("onboarding_submit");
      } catch {
        return null;
      }
    }
    return null;
  }, [executeRecaptcha]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.recaptcha;
      return next;
    });

    try {
      const token = await getRecaptchaToken();

      if (!token) {
        setErrors((prev) => ({
          ...prev,
          recaptcha:
            "No se pudo completar la verificación de seguridad. Recarga la página e intenta de nuevo.",
        }));
        setSubmitting(false);
        return;
      }

      const verifyResponse = await fetch("/api/verify-recaptcha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const verifyData = await verifyResponse.json();

      if (!verifyData.success) {
        setErrors((prev) => ({
          ...prev,
          recaptcha:
            verifyData.error ??
            "La verificación de seguridad falló. Intenta de nuevo.",
        }));
        setSubmitting(false);
        return;
      }

      const code = crypto.randomUUID();
      setSuccess({ code, name: fullName.trim(), email: email.trim() });
    } catch {
      setErrors((prev) => ({
        ...prev,
        recaptcha: "Error de conexión. Verifica tu internet e intenta de nuevo.",
      }));
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <OnboardingSuccess
        requestCode={success.code}
        fullName={success.name}
        email={success.email}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-lg">
      <Card>
        <ProductCombobox
          products={products}
          value={selectedProductId}
          onChange={(id) => {
            setSelectedProductId(id);
            setErrors((prev) => {
              const next = { ...prev };
              delete next.productId;
              return next;
            });
          }}
          error={errors.productId}
        />

        <div className="mt-6 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Datos personales
          </p>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="full-name"
              className="text-sm font-medium text-slate-700"
            >
              Nombre completo
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="full-name"
                type="text"
                placeholder="Ej: María García López"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={cn(
                  "w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-4 text-sm transition-colors focus:border-caja-blue-bright focus:outline-none focus:ring-2 focus:ring-caja-blue-bright/20",
                  errors.fullName &&
                    "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20",
                )}
              />
            </div>
            {errors.fullName && (
              <p className="text-sm text-rose-500">{errors.fullName}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="document-number"
              className="text-sm font-medium text-slate-700"
            >
              Número de documento
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="document-number"
                type="text"
                inputMode="numeric"
                placeholder="Ej: 1234567890"
                value={documentNumber}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setDocumentNumber(val);
                }}
                className={cn(
                  "w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-4 text-sm tabular-nums transition-colors focus:border-caja-blue-bright focus:outline-none focus:ring-2 focus:ring-caja-blue-bright/20",
                  errors.documentNumber &&
                    "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20",
                )}
              />
            </div>
            {errors.documentNumber && (
              <p className="text-sm text-rose-500">{errors.documentNumber}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-sm font-medium text-slate-700"
            >
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="email"
                type="email"
                placeholder="Ej: maria@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={cn(
                  "w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-4 text-sm transition-colors focus:border-caja-blue-bright focus:outline-none focus:ring-2 focus:ring-caja-blue-bright/20",
                  errors.email &&
                    "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20",
                )}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-rose-500">{errors.email}</p>
            )}
          </div>
        </div>

        {errors.recaptcha && (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
            <p className="text-sm text-rose-600">{errors.recaptcha}</p>
          </div>
        )}

        <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5" />
          Protegido por reCAPTCHA
          {!hasRealRecaptcha && (
            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-amber-600">
              modo simulado
            </span>
          )}
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="mt-4 flex w-full items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Verificando y enviando...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" /> Registrar solicitud
            </>
          )}
        </Button>

        <p className="mt-4 text-center text-xs text-slate-400">
          Al registrarte, aceptas nuestros términos y condiciones.
        </p>
      </Card>
    </form>
  );
}
