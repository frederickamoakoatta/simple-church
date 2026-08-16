import MemberList from "@/components/MemberList";
import Alert from "@/components/ui/Alert";
import PageBreadcrumb from "@/components/ui/PageBreadcrumb";
import { listMembers } from "@/lib/members";
import type { Member } from "@/types/member";

export const dynamic = "force-dynamic";

type MembershipPageProps = {
  searchParams: Promise<{ page?: string; search?: string }>;
};

export default async function MembershipPage({
  searchParams,
}: MembershipPageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const search = params.search ?? "";

  let members: Member[] = [];
  let total = 0;
  let totalPages = 1;
  let currentPage = page;
  let dbError: string | null = null;

  try {
    const result = await listMembers({ page, search });
    members = result.members;
    total = result.total;
    totalPages = result.totalPages;
    currentPage = result.page;
  } catch (error) {
    console.error(error);
    dbError =
      "Could not open the SQLite database. Run npm run db:init and check your .env settings.";
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0">
        <PageBreadcrumb
          title="Membership"
          description="Record and manage member biodata"
        />
      </div>

      {dbError ? (
        <div className="mb-4 shrink-0 md:mb-6">
          <Alert variant="warning" title="Database unavailable">
            {dbError}
          </Alert>
        </div>
      ) : null}

      <MemberList
        className="min-h-0 flex-1"
        members={members}
        page={currentPage}
        totalPages={totalPages}
        total={total}
        search={search}
      />
    </div>
  );
}
