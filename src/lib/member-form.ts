import type { Member, MemberInput } from "@/types/member";

function formatDateForInput(value: unknown): string | null {
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

function toNullableString(value: unknown): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const text = String(value).trim();
  return text || null;
}

/** Maps a database member row into form state for create/edit. */
export function toMemberInput(member: Member): MemberInput {
  return {
    title: toNullableString(member.title),
    firstname: member.firstname?.trim() ?? "",
    middle_name: toNullableString(member.middle_name),
    lastname: member.lastname?.trim() ?? "",
    gender: toNullableString(member.gender),
    dob: formatDateForInput(member.dob),
    place_of_birth: toNullableString(member.place_of_birth),
    phone: toNullableString(member.phone),
    email: toNullableString(member.email),
    spouse_firstname: toNullableString(member.spouse_firstname),
    marital_status: toNullableString(member.marital_status),
    address_1: toNullableString(member.address_1),
    gps_address: toNullableString(member.gps_address),
    hometown: toNullableString(member.hometown),
    street_name: toNullableString(member.street_name),
    city: toNullableString(member.city),
    parent_name: toNullableString(member.parent_name),
    parent_relationship: toNullableString(member.parent_relationship),
    holyghost_baptism: toNullableString(member.holyghost_baptism),
    date_of_holyspirit_baptism: formatDateForInput(
      member.date_of_holyspirit_baptism,
    ),
    water_baptism: toNullableString(member.water_baptism),
    date_of_baptism: toNullableString(member.date_of_baptism),
    date_of_conversion: toNullableString(member.date_of_conversion),
    date_of_joining_us: formatDateForInput(member.date_of_joining_us),
    place_of_baptism: toNullableString(member.place_of_baptism),
    officiating_minister_baptism: toNullableString(
      member.officiating_minister_baptism,
    ),
    officiating_ministers_district_church: toNullableString(
      member.officiating_ministers_district_church,
    ),
    communicant: toNullableString(member.communicant),
    occupation: toNullableString(member.occupation),
    level_of_education: toNullableString(member.level_of_education),
    dedicated: toNullableString(member.dedicated),
    dedication_date: formatDateForInput(member.dedication_date),
    name_of_officiating_minister: toNullableString(
      member.name_of_officiating_minister,
    ),
    church_where_dedication_was_done: toNullableString(
      member.church_where_dedication_was_done,
    ),
  };
}

export function getSelectOptions(
  predefined: string[] | undefined,
  currentValue: string | null,
): string[] {
  const options = predefined ?? [""];
  const value = currentValue?.trim() ?? "";

  if (!value || options.includes(value)) {
    return options;
  }

  return [...options, value];
}
