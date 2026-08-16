import { ClipboardList } from "lucide-react";
import PageBreadcrumb from "@/components/ui/PageBreadcrumb";
import { Card } from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";

export default function AttendancePage() {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <PageBreadcrumb
        title="Attendance"
        description="Track service and event attendance"
      />

      <Card padded={false}>
        <EmptyState
          icon={ClipboardList}
          title="Attendance tracking coming soon"
          description="This module will let you record and review service attendance."
        />
      </Card>
    </div>
  );
}
