import type { InputHTMLAttributes } from "react";

export const fieldClasses =
  "h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-brand-500/10 focus:outline-hidden focus:ring-3";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className = "", ...props }: InputProps) {
  return <input className={`${fieldClasses} ${className}`} {...props} />;
}
