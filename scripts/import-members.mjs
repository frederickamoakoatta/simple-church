import fs from "fs";
import path from "path";
import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import XLSX from "xlsx";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DEFAULT_FILE = path.join(
  __dirname,
  "..",
  "IBE-MEMBERS-PENDING-REGISTRATION.xlsx",
);
const DEFAULT_SHEET = "merged membership 16.7.2026";

function clean(value) {
  if (value === undefined || value === null) return null;
  const text = String(value).trim();
  return text || null;
}

function toDate(value) {
  if (!value) return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  return clean(value);
}

function emptyMemberFields() {
  return {
    title: null,
    dob: null,
    place_of_birth: null,
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

function parseFullName(fullName) {
  const parts = clean(fullName)?.split(/\s+/).filter(Boolean) ?? [];
  if (parts.length < 2) {
    return null;
  }

  if (parts.length === 2) {
    return {
      firstname: parts[0],
      middle_name: null,
      lastname: parts[1],
    };
  }

  return {
    firstname: parts[0],
    middle_name: parts.slice(1, -1).join(" "),
    lastname: parts[parts.length - 1],
  };
}

function rowFromMergedSheet(row) {
  const name = parseFullName(row["Full Name"]);
  if (!name) {
    return null;
  }

  return {
    ...emptyMemberFields(),
    ...name,
    gender: clean(row["Gender"]),
    phone: clean(row["Phone Number"]),
  };
}

function rowFromLegacySheet(row) {
  return {
    ...emptyMemberFields(),
    title: clean(row["Title"]),
    firstname: clean(row["Firstname"]),
    middle_name: clean(row["MiddleName"]),
    lastname: clean(row["Lastname"]),
    gender: clean(row["Gender"]),
    dob: toDate(row["DOB"]),
    place_of_birth: clean(row["PlaceOfBirth"]),
    phone: clean(row["Phone"]),
    email: clean(row["Email"]),
    spouse_firstname: clean(row["Firstname_1"] ?? row["Firstname.1"]),
    marital_status: clean(row["Marital Status"]),
    address_1: clean(row["Address 1"]),
    gps_address: clean(row["GPS Address"]),
    hometown: clean(row["Hometown"]),
    street_name: clean(row["Street Name"]),
    city: clean(row["City"]),
    parent_name: clean(row["Parent Name"]),
    parent_relationship: clean(row["Parent Relationship"]),
    holyghost_baptism: clean(row["HolyGhost Baptism"]),
    date_of_holyspirit_baptism: toDate(row["Date of HolySpirit Baptism"]),
    water_baptism: clean(row["Water Baptism"]),
    date_of_baptism: clean(row["Date of Baptism"]),
    date_of_conversion: clean(row["Date of Conversion"]),
    date_of_joining_us: toDate(row["Date of joining us"]),
    place_of_baptism: clean(row["Place of Baptism"]),
    officiating_minister_baptism: clean(row["Officiating Minister Baptism"]),
    officiating_ministers_district_church: clean(
      row["Officiating Ministers District/Church"],
    ),
    communicant: clean(row["Communicant?"]),
    occupation: clean(row["Occupation"]),
    level_of_education: clean(row["Level of Education"]),
    dedicated: clean(row["Dedicated"]),
    dedication_date: toDate(row["Dedication Date"]),
    name_of_officiating_minister: clean(row["Name of Officiating Minister"]),
    church_where_dedication_was_done: clean(
      row["Church where dedication was done"],
    ),
  };
}

function mapRow(row, sheetName) {
  if (row["Full Name"] !== undefined) {
    return rowFromMergedSheet(row);
  }

  if (row["Firstname"] !== undefined) {
    return rowFromLegacySheet(row);
  }

  console.warn(`Skipping unrecognized row format on sheet "${sheetName}"`);
  return null;
}

function main() {
  const filePath = process.argv[2] ?? DEFAULT_FILE;
  const sheetName = process.argv[3] ?? DEFAULT_SHEET;

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    console.error(
      'Usage: npm run db:import -- [file.xlsx] ["sheet name"]',
    );
    process.exit(1);
  }

  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[sheetName];

  if (!sheet) {
    console.error(`Sheet not found: ${sheetName}`);
    console.error("Available sheets:", workbook.SheetNames.join(", "));
    process.exit(1);
  }

  const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });

  const defaultDbPath = path.join(__dirname, "..", "data", "simple_church.db");
  const dbPath = process.env.SQLITE_PATH ?? defaultDbPath;

  if (!fs.existsSync(dbPath)) {
    console.error(`SQLite database not found at ${dbPath}`);
    console.error("Run npm run db:init first.");
    process.exit(1);
  }

  const db = new Database(dbPath);

  const insert = db.prepare(`
    INSERT INTO members (
      title, firstname, middle_name, lastname, gender, dob, place_of_birth,
      phone, email, spouse_firstname, marital_status, address_1, gps_address,
      hometown, street_name, city, parent_name, parent_relationship,
      holyghost_baptism, date_of_holyspirit_baptism, water_baptism,
      date_of_baptism, date_of_conversion, date_of_joining_us,
      place_of_baptism, officiating_minister_baptism,
      officiating_ministers_district_church, communicant, occupation,
      level_of_education, dedicated, dedication_date,
      name_of_officiating_minister, church_where_dedication_was_done
    ) VALUES (
      @title, @firstname, @middle_name, @lastname, @gender, @dob, @place_of_birth,
      @phone, @email, @spouse_firstname, @marital_status, @address_1, @gps_address,
      @hometown, @street_name, @city, @parent_name, @parent_relationship,
      @holyghost_baptism, @date_of_holyspirit_baptism, @water_baptism,
      @date_of_baptism, @date_of_conversion, @date_of_joining_us,
      @place_of_baptism, @officiating_minister_baptism,
      @officiating_ministers_district_church, @communicant, @occupation,
      @level_of_education, @dedicated, @dedication_date,
      @name_of_officiating_minister, @church_where_dedication_was_done
    )
  `);

  const values = rows
    .map((row) => mapRow(row, sheetName))
    .filter((row) => row?.firstname && row?.lastname);

  try {
    if (!values.length) {
      console.log("No valid rows found to import.");
      return;
    }

    const insertMany = db.transaction((members) => {
      for (const member of members) {
        insert.run(member);
      }
    });

    insertMany(values);

    const withGender = values.filter((row) => row.gender).length;
    const withPhone = values.filter((row) => row.phone).length;

    console.log(`Imported ${values.length} members from ${filePath}`);
    console.log(`Sheet: ${sheetName}`);
    console.log(`With gender: ${withGender}`);
    console.log(`With phone: ${withPhone}`);
  } finally {
    db.close();
  }
}

try {
  main();
} catch (error) {
  console.error("Import failed:", error instanceof Error ? error.message : error);
  process.exit(1);
}
