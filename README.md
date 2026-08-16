# COP - IBE — Member Registry

A Next.js app for recording and managing church member biodata, backed by SQLite.

The `members` table matches the columns in your **Membership- IBE Database Nov 2024.xlsx** spreadsheet.

## Prerequisites

- Node.js 18+

## Local setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment**

   ```bash
   cp .env.example .env
   ```

   Default SQLite file: `./data/simple_church.db`

3. **Create the database and table**

   ```bash
   npm run db:init
   ```

4. **Import existing members (optional)**

   ```bash
   npm run db:import
   ```

   Or pass a custom file path:

   ```bash
   npm run db:import -- "/path/to/your/members.xlsx"
   ```

5. **Start the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Deploy to Render

Use a paid Web Service with a **persistent disk** so SQLite data survives redeploys.

### 1. Deploy the service

1. **New → Blueprint** (or Web Service) and connect this repository.
2. Confirm a persistent disk is mounted at **`/var/data`** (included in [`render.yaml`](render.yaml)).
3. Confirm **`SQLITE_PATH=/var/data/simple_church.db`** is set in Environment.
4. Deploy the service.

### 2. Initialize the database (Shell)

After the first deploy, open the **Shell** tab and run:

```bash
npm run db:init
npm run db:import
```

That creates the schema on the persistent disk and imports members from `IBE-MEMBERS-PENDING-REGISTRATION.xlsx` (already in the repo).

Verify the env var if anything fails:

```bash
echo $SQLITE_PATH
# should print: /var/data/simple_church.db
```

The app also runs `npm run db:ensure` on startup to create the schema if the database file is missing, but you still need `db:import` once to load member data.

## Features

- Add, edit, and delete member records
- Search members by name, phone, or email (press Enter to search)
- Paginated membership list with in-table scrolling
- Export all members to CSV or Excel
- Stepwise member form (Personal, Contact, Family, Spiritual)

## Database schema

See [`db/schema.sql`](db/schema.sql) for the full `members` table definition.

Note: the spreadsheet has a duplicate **Firstname** column (mostly spouse names). It is stored as `spouse_firstname` in the database.

## API

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/members` | List members (`?search=` and `?page=` optional) |
| POST | `/api/members` | Create a member |
| GET | `/api/members/:id` | Get one member |
| PUT | `/api/members/:id` | Update a member |
| DELETE | `/api/members/:id` | Delete a member |
| GET | `/api/members/export` | Export members (`?format=csv\|xlsx&search=` optional) |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run db:init` | Create SQLite schema |
| `npm run db:import` | Import members from Excel |
