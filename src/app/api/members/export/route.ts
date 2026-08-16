import { NextRequest, NextResponse } from "next/server";
import {
  exportFilename,
  membersToExportRows,
  toCsv,
  toXlsxBuffer,
} from "@/lib/member-export";
import { listAllMembers } from "@/lib/members";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const format = searchParams.get("format");
    const search = searchParams.get("search") ?? undefined;

    if (format !== "csv" && format !== "xlsx") {
      return NextResponse.json(
        { error: "Invalid format. Use csv or xlsx." },
        { status: 400 },
      );
    }

    const members = listAllMembers({ search });
    const rows = membersToExportRows(members);
    const filename = exportFilename(format);

    if (format === "csv") {
      const csv = `\uFEFF${toCsv(rows)}`;

      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    }

    const buffer = toXlsxBuffer(rows);

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Failed to export members:", error);
    return NextResponse.json(
      { error: "Failed to export members. Check your database connection." },
      { status: 500 },
    );
  }
}
