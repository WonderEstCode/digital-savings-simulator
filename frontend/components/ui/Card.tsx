import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-white p-6 shadow-card",
        className,
      )}
    >
      {children}
    </div>
  );
}
