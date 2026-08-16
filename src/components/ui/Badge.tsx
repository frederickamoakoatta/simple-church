import type { ReactNode } from "react";

type BadgeVariant =
  | "primary"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "light"
  | "pink";

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
};

const variantClasses: Record<BadgeVariant, string> = {
  primary: "bg-brand-50 text-brand-500",
  success: "bg-success-50 text-success-600",
  error: "bg-error-50 text-error-600",
  warning: "bg-warning-50 text-warning-600",
  info: "bg-blue-light-50 text-blue-light-500",
  light: "bg-gray-100 text-gray-700",
  pink: "text-theme-pink-500 bg-pink-50",
};

export default function Badge({ children, variant = "light" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center justify-center gap-1 rounded-full px-2.5 py-0.5 text-sm font-medium ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
}

export function genderBadgeVariant(gender: string | null): BadgeVariant {
  const value = gender?.trim().toLowerCase();

  if (value === "male") return "info";
  if (value === "female") return "pink";
  return "light";
}
