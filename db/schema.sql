CREATE TABLE IF NOT EXISTS members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  firstname TEXT NOT NULL,
  middle_name TEXT,
  lastname TEXT NOT NULL,
  gender TEXT,
  dob TEXT,
  place_of_birth TEXT,
  phone TEXT,
  email TEXT,
  spouse_firstname TEXT,
  marital_status TEXT,
  address_1 TEXT,
  gps_address TEXT,
  hometown TEXT,
  street_name TEXT,
  city TEXT,
  parent_name TEXT,
  parent_relationship TEXT,
  holyghost_baptism TEXT,
  date_of_holyspirit_baptism TEXT,
  water_baptism TEXT,
  date_of_baptism TEXT,
  date_of_conversion TEXT,
  date_of_joining_us TEXT,
  place_of_baptism TEXT,
  officiating_minister_baptism TEXT,
  officiating_ministers_district_church TEXT,
  communicant TEXT,
  occupation TEXT,
  level_of_education TEXT,
  dedicated TEXT,
  dedication_date TEXT,
  name_of_officiating_minister TEXT,
  church_where_dedication_was_done TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_members_name ON members (lastname, firstname);
CREATE INDEX IF NOT EXISTS idx_members_phone ON members (phone);

CREATE TRIGGER IF NOT EXISTS members_updated_at
AFTER UPDATE ON members
FOR EACH ROW
BEGIN
  UPDATE members SET updated_at = datetime('now') WHERE id = OLD.id;
END;
