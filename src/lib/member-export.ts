import * as XLSX from "xlsx";
import { MEMBER_FIELDS, type Member } from "@/types/member";

export type ExportRow = Record<string, string>;

export const EXPORT_COLUMNS: { key: keyof Member; label: string }[] = [
  { key: "id", label: "ID" },
  ...MEMBER_FIELDS.map((field) => ({
    key: field.key as keyof Member,
    label: field.label,
  })),
  { key: "created_at", label: "Created At" },
  { key: "updated_at", label: "Updated At" },
];

export function membersToExportRows(members: Member[]): ExportRow[] {
  return members.map((member) => {
    const row: ExportRow = {};

    for (const column of EXPORT_COLUMNS) {
      const value = member[column.key];
      row[column.label] = value == null ? "" : String(value);
    }

    return row;
  });
}

function escapeCsvField(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
}

export function toCsv(rows: ExportRow[]): string {
  const headers = EXPORT_COLUMNS.map((column) => column.label);

  const lines = [
    headers.map(escapeCsvField).join(","),
    ...rows.map((row) =>
      headers.map((header) => escapeCsvField(row[header] ?? "")).join(","),
    ),
  ];

  return lines.join("\n");
}

export function toXlsxBuffer(rows: ExportRow[]): Buffer {
  const sheet = XLSX.utils.json_to_sheet(rows, {
    header: EXPORT_COLUMNS.map((column) => column.label),
  });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, "Members");

  return Buffer.from(
    XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }),
  );
}

export function exportFilename(format: "csv" | "xlsx"): string {
  const date = new Date().toISOString().slice(0, 10);
  return `cop-ibe-members-${date}.${format}`;
}
