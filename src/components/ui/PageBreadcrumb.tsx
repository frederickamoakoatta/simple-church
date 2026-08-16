import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

type Crumb = {
  label: string;
  href?: string;
};

type PageBreadcrumbProps = {
  title: string;
  description?: string;
  crumbs?: Crumb[];
  action?: ReactNode;
};

export default function PageBreadcrumb({
  title,
  description,
  crumbs = [],
  action,
}: PageBreadcrumbProps) {
  const trail: Crumb[] = [{ label: "Home", href: "/" }, ...crumbs, { label: title }];

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        {description ? (
          <p className="text-theme-sm mt-1 text-gray-500">{description}</p>
        ) : null}
      </div>

      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <nav>
          <ol className="flex items-center gap-1.5">
            {trail.map((crumb, index) => {
              const isLast = index === trail.length - 1;

              return (
                <li key={`${crumb.label}-${index}`} className="flex items-center gap-1.5">
                  {crumb.href && !isLast ? (
                    <Link
                      href={crumb.href}
                      className="text-theme-sm text-gray-500 transition hover:text-gray-700"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-theme-sm text-gray-800">
                      {crumb.label}
                    </span>
                  )}
                  {isLast ? null : (
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </div>
  );
}
