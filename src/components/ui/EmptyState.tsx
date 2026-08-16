import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: ReactNode;
};

export default function EmptyState({
  title,
  description,
  icon: Icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-12 text-center sm:px-6">
      {Icon ? (
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
          <Icon className="h-6 w-6 text-gray-500" />
        </div>
      ) : null}
      <h3 className="text-base font-semibold text-gray-800">{title}</h3>
      {description ? (
        <p className="text-theme-sm mt-1.5 max-w-md text-gray-500">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
