import { ChevronDown } from "lucide-react";
import type { SelectHTMLAttributes } from "react";
import { fieldClasses } from "./Input";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export default function Select({
  className = "",
  children,
  ...props
}: SelectProps) {
  return (
    <div className="relative">
      <select
        className={`${fieldClasses} appearance-none bg-none pr-11 ${className}`}
        {...props}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
        <ChevronDown className="h-4 w-4" />
      </span>
    </div>
  );
}
