import { notFound } from "next/navigation";
import MemberForm from "@/components/MemberForm";
import PageBreadcrumb from "@/components/ui/PageBreadcrumb";
import Button from "@/components/ui/Button";
import { toMemberInput } from "@/lib/member-form";
import { getMember } from "@/lib/members";

export const dynamic = "force-dynamic";

type EditMemberPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditMemberPage({ params }: EditMemberPageProps) {
  const { id } = await params;
  const member = await getMember(Number(id));

  if (!member) {
    notFound();
  }

  const initialData = toMemberInput(member);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="max-w-4xl">
        <PageBreadcrumb
          title="Edit Member"
          description={`Update biodata for ${member.firstname} ${member.lastname}`}
          crumbs={[{ label: "Membership", href: "/membership" }]}
          action={
            <Button href="/membership" variant="outline" size="sm">
              Back to list
            </Button>
          }
        />

        <MemberForm initialData={initialData} memberId={member.id} />
      </div>
    </div>
  );
}
