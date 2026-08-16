export const MEMBERS_PAGE_SIZE = 50;

export interface Member {
  id: number;
  title: string | null;
  firstname: string;
  middle_name: string | null;
  lastname: string;
  gender: string | null;
  dob: string | null;
  place_of_birth: string | null;
  phone: string | null;
  email: string | null;
  spouse_firstname: string | null;
  marital_status: string | null;
  address_1: string | null;
  gps_address: string | null;
  hometown: string | null;
  street_name: string | null;
  city: string | null;
  parent_name: string | null;
  parent_relationship: string | null;
  holyghost_baptism: string | null;
  date_of_holyspirit_baptism: string | null;
  water_baptism: string | null;
  date_of_baptism: string | null;
  date_of_conversion: string | null;
  date_of_joining_us: string | null;
  place_of_baptism: string | null;
  officiating_minister_baptism: string | null;
  officiating_ministers_district_church: string | null;
  communicant: string | null;
  occupation: string | null;
  level_of_education: string | null;
  dedicated: string | null;
  dedication_date: string | null;
  name_of_officiating_minister: string | null;
  church_where_dedication_was_done: string | null;
  created_at: string;
  updated_at: string;
}

export type MemberInput = Omit<Member, "id" | "created_at" | "updated_at">;

export const MEMBER_FIELDS: {
  key: keyof MemberInput;
  label: string;
  type: "text" | "email" | "tel" | "date" | "select";
  required?: boolean;
  section: "personal" | "contact" | "family" | "spiritual";
  options?: string[];
}[] = [
  {
    key: "title",
    label: "Title",
    type: "select",
    section: "personal",
    options: [
      "",
      "Brother",
      "Sister",
      "Deacon",
      "DEACON",
      "Deaconess",
      "DEACONESS",
      "DEACONNESS",
      "Elder",
      "ELDER RTD",
      "Pastor",
      "Rev",
      "Member",
      "Ms",
      "Mr. Mrs",
      "YOUTH",
      "CHILDREN MINISTRY",
    ],
  },
  { key: "firstname", label: "First Name", type: "text", required: true, section: "personal" },
  { key: "middle_name", label: "Middle Name", type: "text", section: "personal" },
  { key: "lastname", label: "Last Name", type: "text", required: true, section: "personal" },
  { key: "gender", label: "Gender", type: "select", section: "personal", options: ["", "Male", "Female"] },
  { key: "dob", label: "Date of Birth", type: "date", section: "personal" },
  { key: "place_of_birth", label: "Place of Birth", type: "text", section: "personal" },
  { key: "phone", label: "Phone", type: "tel", section: "contact" },
  { key: "email", label: "Email", type: "email", section: "contact" },
  {
    key: "marital_status",
    label: "Marital Status",
    type: "select",
    section: "family",
    options: [
      "",
      "Single",
      "Married",
      "MARRED",
      "Divorced",
      "Widowed",
      "WIDOW",
      "NOT MARRIED",
    ],
  },
  { key: "spouse_firstname", label: "Spouse First Name", type: "text", section: "family" },
  { key: "address_1", label: "Address", type: "text", section: "contact" },
  { key: "gps_address", label: "GPS Address", type: "text", section: "contact" },
  { key: "hometown", label: "Hometown", type: "text", section: "contact" },
  { key: "street_name", label: "Street Name", type: "text", section: "contact" },
  { key: "city", label: "City", type: "text", section: "contact" },
  { key: "parent_name", label: "Parent / Guardian Name", type: "text", section: "family" },
  { key: "parent_relationship", label: "Parent Relationship", type: "text", section: "family" },
  { key: "holyghost_baptism", label: "Holy Ghost Baptism", type: "select", section: "spiritual", options: ["", "Yes", "No"] },
  { key: "date_of_holyspirit_baptism", label: "Date of Holy Spirit Baptism", type: "date", section: "spiritual" },
  { key: "water_baptism", label: "Water Baptism", type: "select", section: "spiritual", options: ["", "Yes", "No"] },
  { key: "date_of_baptism", label: "Date of Baptism", type: "text", section: "spiritual" },
  { key: "date_of_conversion", label: "Date of Conversion", type: "text", section: "spiritual" },
  { key: "date_of_joining_us", label: "Date of Joining Church", type: "date", section: "spiritual" },
  { key: "place_of_baptism", label: "Place of Baptism", type: "text", section: "spiritual" },
  { key: "officiating_minister_baptism", label: "Officiating Minister (Baptism)", type: "text", section: "spiritual" },
  { key: "officiating_ministers_district_church", label: "Officiating Minister District/Church", type: "text", section: "spiritual" },
  { key: "communicant", label: "Communicant", type: "select", section: "spiritual", options: ["", "Yes", "No"] },
  { key: "occupation", label: "Occupation", type: "text", section: "personal" },
  { key: "level_of_education", label: "Level of Education", type: "text", section: "personal" },
  { key: "dedicated", label: "Dedicated", type: "select", section: "spiritual", options: ["", "Yes", "No"] },
  { key: "dedication_date", label: "Dedication Date", type: "date", section: "spiritual" },
  { key: "name_of_officiating_minister", label: "Name of Officiating Minister (Dedication)", type: "text", section: "spiritual" },
  { key: "church_where_dedication_was_done", label: "Church Where Dedication Was Done", type: "text", section: "spiritual" },
];

export const FORM_STEPS = [
  "personal",
  "contact",
  "family",
  "spiritual",
] as const;

export type FormStep = (typeof FORM_STEPS)[number];

export const SECTION_LABELS: Record<FormStep, string> = {
  personal: "Personal Information",
  contact: "Contact & Address",
  family: "Family",
  spiritual: "Spiritual & Church Records",
};

export function emptyMemberInput(): MemberInput {
  return {
    title: null,
    firstname: "",
    middle_name: null,
    lastname: "",
    gender: null,
    dob: null,
    place_of_birth: null,
    phone: null,
    email: null,
    spouse_firstname: null,
    marital_status: null,
    address_1: null,
    gps_address: null,
    hometown: null,
    street_name: null,
    city: null,
    parent_name: null,
    parent_relationship: null,
    holyghost_baptism: null,
    date_of_holyspirit_baptism: null,
    water_baptism: null,
    date_of_baptism: null,
    date_of_conversion: null,
    date_of_joining_us: null,
    place_of_baptism: null,
    officiating_minister_baptism: null,
    officiating_ministers_district_church: null,
    communicant: null,
    occupation: null,
    level_of_education: null,
    dedicated: null,
    dedication_date: null,
    name_of_officiating_minister: null,
    church_where_dedication_was_done: null,
  };
}
