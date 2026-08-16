import { BookOpen } from "lucide-react";
import PageBreadcrumb from "@/components/ui/PageBreadcrumb";
import { Card } from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";

export default function BibleStudyGroupsPage() {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <PageBreadcrumb
        title="Bible Study Groups"
        description="Organize and manage study groups"
      />

      <Card padded={false}>
        <EmptyState
          icon={BookOpen}
          title="Bible study groups coming soon"
          description="This module will help you organize groups and members."
        />
      </Card>
    </div>
  );
}
