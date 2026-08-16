import {
  AlertTriangle,
  CheckCircle2,
  Info,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

type AlertVariant = "success" | "error" | "warning" | "info";

type AlertProps = {
  variant?: AlertVariant;
  title: string;
  children?: ReactNode;
};

const variantStyles: Record<
  AlertVariant,
  { border: string; icon: string; iconComponent: LucideIcon }
> = {
  success: {
    border: "border-success-500 bg-success-50",
    icon: "text-success-500",
    iconComponent: CheckCircle2,
  },
  error: {
    border: "border-error-500 bg-error-50",
    icon: "text-error-500",
    iconComponent: XCircle,
  },
  warning: {
    border: "border-warning-500 bg-warning-50",
    icon: "text-warning-500",
    iconComponent: AlertTriangle,
  },
  info: {
    border: "border-blue-light-500 bg-blue-light-50",
    icon: "text-blue-light-500",
    iconComponent: Info,
  },
};

export default function Alert({
  variant = "info",
  title,
  children,
}: AlertProps) {
  const styles = variantStyles[variant];
  const Icon = styles.iconComponent;

  return (
    <div
      className={`rounded-xl border border-l-4 border-gray-200 p-4 ${styles.border}`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${styles.icon}`} />
        <div>
          <h4 className="text-theme-sm mb-1 font-semibold text-gray-800">
            {title}
          </h4>
          {children ? (
            <div className="text-theme-sm text-gray-500">{children}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
