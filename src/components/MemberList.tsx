"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Search, Trash2, Users } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import Badge, { genderBadgeVariant } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { MEMBERS_PAGE_SIZE, type Member } from "@/types/member";

type MemberListProps = {
  members: Member[];
  page: number;
  totalPages: number;
  total: number;
  search: string;
  className?: string;
};

function buildListUrl(page: number, search: string) {
  const params = new URLSearchParams();
  if (search.trim()) {
    params.set("search", search.trim());
  }
  if (page > 1) {
    params.set("page", String(page));
  }
  const query = params.toString();
  return query ? `/membership?${query}` : "/membership";
}

function buildExportUrl(format: "csv" | "xlsx", search: string) {
  const params = new URLSearchParams({ format });
  if (search.trim()) {
    params.set("search", search.trim());
  }
  return `/api/members/export?${params.toString()}`;
}

export default function MemberList({
  members,
  page,
  totalPages,
  total,
  search,
  className = "",
}: MemberListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [query, setQuery] = useState(search);

  useEffect(() => {
    setQuery(search);
  }, [search]);

  const pageSize = MEMBERS_PAGE_SIZE;
  const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, total);
  const exportCountLabel = search.trim() ? ` (${total})` : "";

  async function handleDelete(id: number, name: string) {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) {
      return;
    }

    setDeletingId(id);

    try {
      const response = await fetch(`/api/members/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Failed to delete member.");
      }
      router.refresh();
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Failed to delete member.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(buildListUrl(1, query));
  }

  return (
    <div
      className={`flex min-h-0 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white ${className}`}
    >
      <div className="shrink-0 flex flex-col gap-4 px-5 py-4 sm:px-6 sm:py-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Member Directory
          </h3>
          <p className="text-theme-sm mt-1 text-gray-500">
            {total.toLocaleString()} member{total === 1 ? "" : "s"} registered
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-2"
          >
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                <Search className="h-4 w-4 text-gray-500" />
              </span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search members..."
                aria-label="Search members"
                className="focus:border-brand-300 shadow-theme-xs focus:ring-brand-500/10 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-11 pr-4 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-hidden focus:ring-3 sm:w-[260px]"
              />
            </div>
            <Button type="submit" variant="outline" size="sm">
              Search
            </Button>
          </form>

          {total > 0 ? (
            <>
              <a
                href={buildExportUrl("csv", search)}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-theme-xs ring-1 ring-inset ring-gray-300 transition hover:bg-gray-50"
              >
                Export CSV{exportCountLabel}
              </a>
              <a
                href={buildExportUrl("xlsx", search)}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-theme-xs ring-1 ring-inset ring-gray-300 transition hover:bg-gray-50"
              >
                Export Excel{exportCountLabel}
              </a>
            </>
          ) : null}

          <Button href="/membership/new" size="sm">
            <Plus className="h-4 w-4" />
            Add Member
          </Button>
        </div>
      </div>

      {members.length === 0 ? (
        <div className="border-t border-gray-100">
          <EmptyState
            icon={Users}
            title={search ? "No members match your search" : "No members yet"}
            description={
              search
                ? "Try a different search term or clear the filter."
                : "Add your first member to get started."
            }
            action={
              search ? (
                <Button href="/membership" variant="outline" size="sm">
                  Clear search
                </Button>
              ) : (
                <Button href="/membership/new" size="sm">
                  <Plus className="h-4 w-4" />
                  Add Member
                </Button>
              )
            }
          />
        </div>
      ) : (
        <>
          <Table scrollable className="border-t border-gray-100">
            <TableHead>
              <TableRow>
                <TableHeader sticky>Title</TableHeader>
                <TableHeader sticky>Name</TableHeader>
                <TableHeader sticky>Gender</TableHeader>
                <TableHeader sticky>Phone</TableHeader>
                <TableHeader sticky>Email</TableHeader>
                <TableHeader sticky>Marital Status</TableHeader>
                <TableHeader sticky className="text-right">
                  Actions
                </TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {members.map((member) => {
                const name = [
                  member.firstname,
                  member.middle_name,
                  member.lastname,
                ]
                  .filter(Boolean)
                  .join(" ");

                const displayName = [member.title, name]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <TableRow key={member.id}>
                    <TableCell className="whitespace-nowrap">
                      {member.title ?? "—"}
                    </TableCell>
                    <TableCell className="font-medium text-gray-800">
                      {name}
                    </TableCell>
                    <TableCell>
                      {member.gender ? (
                        <Badge variant={genderBadgeVariant(member.gender)}>
                          {member.gender}
                        </Badge>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {member.phone ?? "—"}
                    </TableCell>
                    <TableCell>{member.email ?? "—"}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {member.marital_status ?? "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Link
                          href={`/membership/${member.id}/edit`}
                          className="hover:text-brand-500 inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100"
                          title="Edit member"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(member.id, displayName)}
                          disabled={deletingId === member.id}
                          className="hover:text-error-500 hover:bg-error-50 inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition disabled:opacity-50"
                          title="Delete member"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <div className="shrink-0">
            <Pagination
              page={page}
              totalPages={totalPages}
              total={total}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              buildUrl={(p) => buildListUrl(p, search)}
              itemLabel="members"
            />
          </div>
        </>
      )}
    </div>
  );
}
