interface TypeMetadata {
  label: string;
  benefits: { title: string; description: string }[];
}

interface VisualTheme {
  cardGradient: string;
  heroGradient: string;
}

export interface ProductTheme extends VisualTheme, TypeMetadata {}

const visuals: Record<string, VisualTheme> = {
  goal: {
    cardGradient: "from-blue-50 to-blue-100/50",
    heroGradient: "from-caja-blue-bright to-caja-blue-dark",
  },
  housing: {
    cardGradient: "from-green-50 to-green-100/50",
    heroGradient: "from-caja-green to-caja-blue-dark",
  },
  programmed: {
    cardGradient: "from-amber-50 to-orange-100/50",
    heroGradient: "from-amber-500 to-orange-700",
  },
};

const palette: VisualTheme[] = [
  { cardGradient: "from-purple-50 to-purple-100/50", heroGradient: "from-purple-600 to-purple-800" },
  { cardGradient: "from-rose-50 to-rose-100/50", heroGradient: "from-rose-500 to-rose-700" },
  { cardGradient: "from-teal-50 to-teal-100/50", heroGradient: "from-teal-500 to-teal-700" },
  { cardGradient: "from-indigo-50 to-indigo-100/50", heroGradient: "from-indigo-500 to-indigo-700" },
  { cardGradient: "from-cyan-50 to-cyan-100/50", heroGradient: "from-cyan-600 to-cyan-800" },
  { cardGradient: "from-fuchsia-50 to-fuchsia-100/50", heroGradient: "from-fuchsia-500 to-fuchsia-700" },
];

const defaultBenefits: TypeMetadata["benefits"] = [
  { title: "Rentabilidad competitiva", description: "Tasa de interés diseñada para hacer crecer tu ahorro de forma constante." },
  { title: "Gestión 100% digital", description: "Administra tu cuenta desde cualquier dispositivo, sin trámites presenciales." },
  { title: "Sin costos ocultos", description: "Transparencia total en condiciones, sin comisiones sorpresa." },
  { title: "Seguridad garantizada", description: "Tu dinero protegido con los más altos estándares del sector." },
];

function hashType(type: string): number {
  let hash = 5381;
  for (let i = 0; i < type.length; i++) {
    hash = ((hash << 5) + hash + type.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function getProductTheme(
  type: string,
  productTypes?: Record<string, TypeMetadata>,
): ProductTheme {
  const metadata = productTypes?.[type];
  const visual = visuals[type];

  if (metadata && visual) {
    return { ...visual, ...metadata };
  }

  return {
    ...(visual ?? palette[hashType(type) % palette.length]),
    label: metadata?.label ?? type.charAt(0).toUpperCase() + type.slice(1),
    benefits: metadata?.benefits ?? defaultBenefits,
  };
}
