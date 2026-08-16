import type {
  HTMLAttributes,
  ReactNode,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react";

export function Table({
  children,
  className = "",
  scrollable = false,
}: {
  children: ReactNode;
  className?: string;
  scrollable?: boolean;
}) {
  return (
    <div
      className={`custom-scrollbar ${
        scrollable
          ? "min-h-0 flex-1 overflow-auto"
          : "overflow-x-auto"
      } ${className}`}
    >
      <table className="min-w-full">{children}</table>
    </div>
  );
}

export function TableHead({ children }: { children: ReactNode }) {
  return (
    <thead className="border-y border-gray-100 bg-gray-50">{children}</thead>
  );
}

export function TableBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-gray-100">{children}</tbody>;
}

export function TableRow({
  children,
  className = "",
}: HTMLAttributes<HTMLTableRowElement> & { children: ReactNode }) {
  return (
    <tr className={`transition hover:bg-gray-50 ${className}`}>{children}</tr>
  );
}

export function TableHeader({
  children,
  className = "",
  sticky = false,
}: ThHTMLAttributes<HTMLTableCellElement> & {
  children: ReactNode;
  sticky?: boolean;
}) {
  return (
    <th
      className={`text-theme-xs whitespace-nowrap px-5 py-3 text-left font-medium text-gray-500 sm:px-6 ${
        sticky ? "sticky top-0 z-10 bg-gray-50" : ""
      } ${className}`}
    >
      {children}
    </th>
  );
}

export function TableCell({
  children,
  className = "",
  colSpan,
}: TdHTMLAttributes<HTMLTableCellElement> & { children: ReactNode }) {
  return (
    <td
      colSpan={colSpan}
      className={`text-theme-sm px-5 py-4 text-gray-500 sm:px-6 ${className}`}
    >
      {children}
    </td>
  );
}
