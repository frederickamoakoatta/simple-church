# COP - IBE — Member Registry

A Next.js app for recording and managing church member biodata, backed by SQLite.

The `members` table matches the columns in your **Membership- IBE Database Nov 2024.xlsx** spreadsheet.

## Prerequisites

- Node.js 18+

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure the database path (optional)**

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

## Features

- Add, edit, and delete member records
- Search members by name, phone, or email
- Paginated membership list
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
