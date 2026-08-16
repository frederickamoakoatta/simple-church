import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  ClipboardList,
  HeartHandshake,
  Phone,
  UserRound,
  Users,
  UsersRound,
} from "lucide-react";
import PageBreadcrumb from "@/components/ui/PageBreadcrumb";
import MetricCard from "@/components/ui/MetricCard";
import Badge, { genderBadgeVariant } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { getMemberStats, listRecentMembers } from "@/lib/members";
import type { Member } from "@/types/member";

export const dynamic = "force-dynamic";

const MODULES = [
  {
    href: "/membership",
    title: "Membership",
    description: "Manage member biodata and records",
    icon: Users,
  },
  {
    href: "/attendance",
    title: "Attendance",
    description: "Track service and event attendance",
    icon: ClipboardList,
  },
  {
    href: "/bible-study-groups",
    title: "Bible Study Groups",
    description: "Organize and manage study groups",
    icon: BookOpen,
  },
  {
    href: "/funeral-contributions",
    title: "Funeral Contributions",
    description: "Record and track funeral contributions",
    icon: HeartHandshake,
  },
];

function fullName(member: Member) {
  return [member.firstname, member.middle_name, member.lastname]
    .filter(Boolean)
    .join(" ");
}

export default function DashboardPage() {
  let stats = { total: 0, male: 0, female: 0, withPhone: 0 };
  let recentMembers: Member[] = [];

  try {
    stats = getMemberStats();
    recentMembers = listRecentMembers(5);
  } catch {
    // Stats unavailable if DB not initialized
  }

  const phoneCoverage =
    stats.total > 0
      ? `${Math.round((stats.withPhone / stats.total) * 100)}%`
      : undefined;

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <PageBreadcrumb
        title="Dashboard"
        description="Overview of your church management activities"
      />

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
            <MetricCard
              label="Total Members"
              value={stats.total.toLocaleString()}
              icon={UsersRound}
            />
            <MetricCard
              label="Male Members"
              value={stats.male.toLocaleString()}
              icon={UserRound}
            />
            <MetricCard
              label="Female Members"
              value={stats.female.toLocaleString()}
              icon={UserRound}
            />
            <MetricCard
              label="With Phone Number"
              value={stats.withPhone.toLocaleString()}
              icon={Phone}
              hint={phoneCoverage}
            />
          </div>
        </div>

        <div className="col-span-12 xl:col-span-8">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Recent Members
                </h3>
                <p className="text-theme-sm mt-1 text-gray-500">
                  The latest people added to the register
                </p>
              </div>
              <Button href="/membership" variant="outline" size="sm">
                View all
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            {recentMembers.length === 0 ? (
              <div className="border-t border-gray-100">
                <EmptyState
                  icon={Users}
                  title="No members yet"
                  description="Add your first member to see them appear here."
                  action={
                    <Button href="/membership/new" size="sm">
                      Add Member
                    </Button>
                  }
                />
              </div>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>Name</TableHeader>
                    <TableHeader>Gender</TableHeader>
                    <TableHeader>Phone</TableHeader>
                    <TableHeader className="text-right">Action</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <span className="text-theme-sm bg-brand-50 text-brand-500 flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-semibold uppercase">
                            {member.firstname.charAt(0)}
                            {member.lastname.charAt(0)}
                          </span>
                          <div>
                            <p className="text-theme-sm font-medium text-gray-800">
                              {fullName(member)}
                            </p>
                            {member.title ? (
                              <p className="text-theme-xs text-gray-500">
                                {member.title}
                              </p>
                            ) : null}
                          </div>
                        </div>
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
                      <TableCell>{member.phone ?? "—"}</TableCell>
                      <TableCell className="text-right">
                        <Link
                          href={`/membership/${member.id}/edit`}
                          className="text-theme-sm text-brand-500 hover:text-brand-600 font-medium"
                        >
                          View
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>

        <div className="col-span-12 xl:col-span-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
            <h3 className="text-lg font-semibold text-gray-800">Modules</h3>
            <p className="text-theme-sm mt-1 text-gray-500">
              Jump straight into a section
            </p>

            <div className="mt-5 flex flex-col gap-3">
              {MODULES.map((module) => {
                const Icon = module.icon;

                return (
                  <Link
                    key={module.href}
                    href={module.href}
                    className="hover:border-brand-300 group flex items-center gap-4 rounded-xl border border-gray-200 p-4 transition hover:bg-gray-50"
                  >
                    <span className="group-hover:bg-brand-50 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 transition">
                      <Icon className="group-hover:text-brand-500 h-5 w-5 text-gray-800 transition" />
                    </span>
                    <span className="min-w-0">
                      <span className="text-theme-sm block font-medium text-gray-800">
                        {module.title}
                      </span>
                      <span className="text-theme-xs block text-gray-500">
                        {module.description}
                      </span>
                    </span>
                    <ArrowRight className="group-hover:text-brand-500 ml-auto h-4 w-4 shrink-0 text-gray-400" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
