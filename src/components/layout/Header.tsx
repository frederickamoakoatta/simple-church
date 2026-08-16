"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Church, Menu, Search, X } from "lucide-react";
import { APP_NAME } from "@/lib/app-config";

type HeaderProps = {
  isMobileOpen: boolean;
  onToggleSidebar: () => void;
};

export default function Header({ isMobileOpen, onToggleSidebar }: HeaderProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    router.push(
      trimmed ? `/membership?search=${encodeURIComponent(trimmed)}` : "/membership",
    );
  }

  return (
    <header className="z-99999 sticky top-0 flex w-full border-gray-200 bg-white lg:border-b">
      <div className="flex grow flex-col items-center justify-between lg:flex-row lg:px-6">
        <div className="flex w-full items-center gap-3 border-b border-gray-200 px-3 py-3 sm:gap-4 lg:border-b-0 lg:px-0 lg:py-4">
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
            className="z-99999 flex h-10 w-10 items-center justify-center rounded-lg border-gray-200 text-gray-500 hover:bg-gray-100 lg:h-11 lg:w-11 lg:border"
          >
            {isMobileOpen ? <X className="h-6 w-6 lg:hidden" /> : null}
            <Menu
              className={isMobileOpen ? "hidden h-5 w-5 lg:block" : "h-5 w-5"}
            />
          </button>

          <Link href="/" className="flex items-center gap-2 lg:hidden">
            <span className="bg-brand-500 flex h-9 w-9 items-center justify-center rounded-lg">
              <Church className="h-4 w-4 text-white" />
            </span>
            <span className="font-bold text-gray-800">{APP_NAME}</span>
          </Link>

          <div className="hidden lg:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                <Search className="h-5 w-5 text-gray-500" />
              </span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search members..."
                aria-label="Search members"
                className="focus:border-brand-300 shadow-theme-xs focus:ring-brand-500/10 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-4 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-hidden focus:ring-3 xl:w-[430px]"
              />
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}
