import type { LucideIcon } from "lucide-react";

type MetricCardProps = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
};

export default function MetricCard({
  label,
  value,
  icon: Icon,
  hint,
}: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
        <Icon className="h-5 w-5 text-gray-800" />
      </div>

      <div className="mt-5 flex items-end justify-between">
        <div>
          <span className="text-sm text-gray-500">{label}</span>
          <h4 className="text-title-sm mt-2 font-bold text-gray-800">
            {value}
          </h4>
        </div>

        {hint ? (
          <span className="bg-gray-100 text-theme-xs rounded-full px-2.5 py-0.5 font-medium text-gray-700">
            {hint}
          </span>
        ) : null}
      </div>
    </div>
  );
}
