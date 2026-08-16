import { HeartHandshake } from "lucide-react";
import PageBreadcrumb from "@/components/ui/PageBreadcrumb";
import { Card } from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";

export default function FuneralContributionsPage() {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <PageBreadcrumb
        title="Funeral Contributions"
        description="Record and track funeral contributions"
      />

      <Card padded={false}>
        <EmptyState
          icon={HeartHandshake}
          title="Funeral contributions coming soon"
          description="This module will let you record and track contributions."
        />
      </Card>
    </div>
  );
}
