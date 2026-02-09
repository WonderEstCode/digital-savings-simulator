import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-caja-blue-bright text-white hover:bg-caja-blue-bright/90",
  secondary:
    "bg-caja-blue-dark text-white hover:bg-caja-blue-dark/90",
};

export default function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "rounded-lg px-6 py-2.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-caja-blue-bright/50 disabled:opacity-50",
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
