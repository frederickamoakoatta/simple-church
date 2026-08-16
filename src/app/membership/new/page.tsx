import MemberForm from "@/components/MemberForm";
import PageBreadcrumb from "@/components/ui/PageBreadcrumb";
import Button from "@/components/ui/Button";

export default function NewMemberPage() {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="max-w-4xl">
        <PageBreadcrumb
          title="Add Member"
          description="Enter biodata for a new church member"
          crumbs={[{ label: "Membership", href: "/membership" }]}
          action={
            <Button href="/membership" variant="outline" size="sm">
              Back to list
            </Button>
          }
        />

        <MemberForm />
      </div>
    </div>
  );
}
