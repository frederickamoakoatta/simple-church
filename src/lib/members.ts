import db from "@/lib/db";
import {
  MEMBERS_PAGE_SIZE,
  type Member,
  type MemberInput,
} from "@/types/member";

const COLUMNS = [
  "title",
  "firstname",
  "middle_name",
  "lastname",
  "gender",
  "dob",
  "place_of_birth",
  "phone",
  "email",
  "spouse_firstname",
  "marital_status",
  "address_1",
  "gps_address",
  "hometown",
  "street_name",
  "city",
  "parent_name",
  "parent_relationship",
  "holyghost_baptism",
  "date_of_holyspirit_baptism",
  "water_baptism",
  "date_of_baptism",
  "date_of_conversion",
  "date_of_joining_us",
  "place_of_baptism",
  "officiating_minister_baptism",
  "officiating_ministers_district_church",
  "communicant",
  "occupation",
  "level_of_education",
  "dedicated",
  "dedication_date",
  "name_of_officiating_minister",
  "church_where_dedication_was_done",
] as const;

function normalizeValue(value: unknown): string | null {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  return String(value).trim() || null;
}

function toDbValues(input: MemberInput): Record<string, string | null> {
  const values: Record<string, string | null> = {};
  for (const column of COLUMNS) {
    values[column] = normalizeValue(input[column]);
  }
  return values;
}

function formatDateField(value: unknown): string | null {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  const text = String(value).trim();
  if (!text) {
    return null;
  }

  if (/^\d{4}-\d{2}-\d{2}/.test(text)) {
    return text.slice(0, 10);
  }

  return text;
}

function formatMember(row: Member): Member {
  return {
    ...row,
    dob: formatDateField(row.dob),
    date_of_holyspirit_baptism: formatDateField(row.date_of_holyspirit_baptism),
    date_of_joining_us: formatDateField(row.date_of_joining_us),
    dedication_date: formatDateField(row.dedication_date),
  };
}

function buildSearchFilter(search?: string) {
  const trimmed = search?.trim();

  if (!trimmed) {
    return { whereClause: "", searchParams: {} };
  }

  return {
    whereClause: `WHERE title LIKE @search
          OR firstname LIKE @search
          OR lastname LIKE @search
          OR phone LIKE @search
          OR email LIKE @search`,
    searchParams: { search: `%${trimmed}%` },
  };
}

export type ListMembersResult = {
  members: Member[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export function listMembers(options?: {
  search?: string;
  page?: number;
  pageSize?: number;
}): ListMembersResult {
  const pageSize = options?.pageSize ?? MEMBERS_PAGE_SIZE;
  const page = Math.max(1, options?.page ?? 1);
  const { whereClause, searchParams } = buildSearchFilter(options?.search);

  const total = Number(
    (
      db
        .prepare(`SELECT COUNT(*) AS total FROM members ${whereClause}`)
        .get(searchParams) as { total: number }
    ).total ?? 0,
  );

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);

  if (currentPage !== page) {
    return listMembers({ ...options, page: currentPage });
  }

  const rows = db
    .prepare(
      `SELECT * FROM members ${whereClause}
       ORDER BY lastname ASC, firstname ASC
       LIMIT @limit OFFSET @offset`,
    )
    .all({
      ...searchParams,
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
    }) as Member[];

  return {
    members: rows.map(formatMember),
    total,
    page: currentPage,
    pageSize,
    totalPages,
  };
}

export function listAllMembers(options?: { search?: string }): Member[] {
  const { whereClause, searchParams } = buildSearchFilter(options?.search);

  const rows = db
    .prepare(
      `SELECT * FROM members ${whereClause}
       ORDER BY lastname ASC, firstname ASC`,
    )
    .all(searchParams) as Member[];

  return rows.map(formatMember);
}

export function listRecentMembers(limit = 5): Member[] {
  const rows = db
    .prepare(
      `SELECT * FROM members
       ORDER BY created_at DESC, id DESC
       LIMIT @limit`,
    )
    .all({ limit }) as Member[];

  return rows.map(formatMember);
}

export function getMember(id: number): Member | null {
  const row = db
    .prepare("SELECT * FROM members WHERE id = @id LIMIT 1")
    .get({ id }) as Member | undefined;

  if (!row) {
    return null;
  }

  return formatMember(row);
}

export function createMember(input: MemberInput): number {
  const values = toDbValues(input);
  const columns = COLUMNS.join(", ");
  const placeholders = COLUMNS.map((column) => `@${column}`).join(", ");

  const result = db
    .prepare(`INSERT INTO members (${columns}) VALUES (${placeholders})`)
    .run(values);

  return Number(result.lastInsertRowid);
}

export function updateMember(id: number, input: MemberInput): boolean {
  const values = toDbValues(input);
  const assignments = COLUMNS.map((column) => `${column} = @${column}`).join(
    ", ",
  );

  const result = db
    .prepare(`UPDATE members SET ${assignments} WHERE id = @id`)
    .run({ ...values, id });

  return result.changes > 0;
}

export function deleteMember(id: number): boolean {
  const result = db.prepare("DELETE FROM members WHERE id = @id").run({ id });
  return result.changes > 0;
}

export type MemberStats = {
  total: number;
  male: number;
  female: number;
  withPhone: number;
};

export function getMemberStats(): MemberStats {
  const row = db
    .prepare(
      `SELECT
         COUNT(*) AS total,
         SUM(CASE WHEN LOWER(gender) = 'male' THEN 1 ELSE 0 END) AS male,
         SUM(CASE WHEN LOWER(gender) = 'female' THEN 1 ELSE 0 END) AS female,
         SUM(CASE WHEN phone IS NOT NULL AND TRIM(phone) != '' THEN 1 ELSE 0 END) AS withPhone
       FROM members`,
    )
    .get() as MemberStats;

  return {
    total: Number(row.total ?? 0),
    male: Number(row.male ?? 0),
    female: Number(row.female ?? 0),
    withPhone: Number(row.withPhone ?? 0),
  };
}
