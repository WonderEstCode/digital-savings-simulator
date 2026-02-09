"use client";

import Link from "next/link";
import { CheckCircle, Mail, Copy, ArrowLeft } from "lucide-react";
import { useState } from "react";
import Card from "@/components/ui/Card";

interface OnboardingSuccessProps {
  requestCode: string;
  fullName: string;
  email: string;
}

export default function OnboardingSuccess({
  requestCode,
  fullName,
  email,
}: OnboardingSuccessProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(requestCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="animate-in fade-in mx-auto max-w-lg">
      <Card className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-8 w-8 text-caja-green" />
        </div>

        <h2 className="mt-5 text-2xl font-bold text-slate-700">
          ¡Solicitud registrada!
        </h2>
        <p className="mt-2 text-slate-500">
          Hola <span className="font-medium text-slate-700">{fullName}</span>,
          tu intención de apertura ha sido registrada exitosamente.
        </p>

        <div className="mt-6 rounded-lg bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Código de solicitud
          </p>
          <div className="mt-1.5 flex items-center justify-center gap-2">
            <code className="text-sm font-semibold text-caja-blue-dark">
              {requestCode}
            </code>
            <button
              onClick={handleCopy}
              className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600"
              title="Copiar código"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
          {copied && (
            <p className="mt-1 text-xs text-caja-green">Copiado</p>
          )}
        </div>

        <div className="mt-6 flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-left">
          <div className="rounded-full bg-blue-100 p-2">
            <Mail className="h-4 w-4 text-caja-blue-bright" />
          </div>
          <div className="text-sm">
            <p className="font-medium text-slate-700">
              Revisa tu correo electrónico
            </p>
            <p className="text-slate-500">
              Enviamos una confirmación a{" "}
              <span className="font-medium text-slate-700">{email}</span>
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-2 text-left text-sm">
          <p className="font-medium text-slate-700">¿Qué sigue?</p>
          <div className="flex items-start gap-2 text-slate-500">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-caja-blue-bright text-xs font-bold text-white">
              1
            </span>
            Recibirás un correo con los detalles de tu solicitud.
          </div>
          <div className="flex items-start gap-2 text-slate-500">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-caja-blue-bright text-xs font-bold text-white">
              2
            </span>
            Un asesor revisará tu información en las próximas 24 horas.
          </div>
          <div className="flex items-start gap-2 text-slate-500">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-caja-blue-bright text-xs font-bold text-white">
              3
            </span>
            Te contactaremos para completar la apertura de tu cuenta.
          </div>
        </div>

        <Link
          href="/products"
          className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-caja-blue-bright transition-colors hover:text-caja-blue-dark"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a productos
        </Link>
      </Card>
    </div>
  );
}
