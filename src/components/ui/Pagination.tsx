import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  rangeStart: number;
  rangeEnd: number;
  buildUrl: (page: number) => string;
  itemLabel?: string;
};

const stepperClasses =
  "shadow-theme-xs flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 transition hover:bg-gray-50";
const stepperDisabledClasses =
  "flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-300";

function pageWindow(page: number, totalPages: number) {
  const pages: number[] = [];
  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
  const end = Math.min(totalPages, Math.max(page + 2, 5));

  for (let index = start; index <= end; index += 1) {
    pages.push(index);
  }

  return pages;
}

export default function Pagination({
  page,
  totalPages,
  total,
  rangeStart,
  rangeEnd,
  buildUrl,
  itemLabel = "items",
}: PaginationProps) {
  if (total === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <p className="text-theme-sm text-gray-500">
        Showing <span className="font-medium text-gray-700">{rangeStart}</span>–
        <span className="font-medium text-gray-700">{rangeEnd}</span> of{" "}
        <span className="font-medium text-gray-700">{total}</span> {itemLabel}
      </p>

      {totalPages > 1 ? (
        <nav className="flex items-center gap-2" aria-label="Pagination">
          {page > 1 ? (
            <Link
              href={buildUrl(page - 1)}
              aria-label="Previous page"
              className={stepperClasses}
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>
          ) : (
            <span className={stepperDisabledClasses}>
              <ChevronLeft className="h-4 w-4" />
            </span>
          )}

          <ul className="hidden items-center gap-1 sm:flex">
            {pageWindow(page, totalPages).map((item) => (
              <li key={item}>
                <Link
                  href={buildUrl(item)}
                  aria-current={item === page ? "page" : undefined}
                  className={`text-theme-sm flex h-10 w-10 items-center justify-center rounded-lg font-medium transition ${
                    item === page
                      ? "bg-brand-500 text-white"
                      : "text-gray-700 hover:bg-brand-50 hover:text-brand-500"
                  }`}
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>

          <span className="text-theme-sm text-gray-500 sm:hidden">
            Page {page} of {totalPages}
          </span>

          {page < totalPages ? (
            <Link
              href={buildUrl(page + 1)}
              aria-label="Next page"
              className={stepperClasses}
            >
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <span className={stepperDisabledClasses}>
              <ChevronRight className="h-4 w-4" />
            </span>
          )}
        </nav>
      ) : null}
    </div>
  );
}
