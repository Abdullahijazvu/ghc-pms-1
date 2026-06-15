# GHC PMS — Multi-Tenant Patient Management System

A multi-tenant clinic management system built with Next.js 15, MySQL, and NextAuth.

## Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Auth:** NextAuth v5 (Credentials — email/password)
- **Database:** MySQL + Drizzle ORM
- **Styling:** Tailwind CSS + Shadcn UI
- **Formatting:** Prettier

## Getting Started

### Prerequisites

- MySQL 8+ running on localhost:3306
- Node.js 20+
- pnpm

### Setup

```bash
pnpm install
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=root
MYSQL_DATABASE=ghc
NEXTAUTH_URL=http://localhost:3000
AUTH_SECRET=<generated-secret>
```

### Database

```bash
pnpm drizzle-kit push
```

### Seed (optional)

```bash
curl http://localhost:3000/api/seed
```

### Run

```bash
pnpm dev
```

Visit http://localhost:3000
