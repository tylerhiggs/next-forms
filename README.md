# Next Forms

A modern form builder application built with Next.js 15, NextAuth.js, Drizzle ORM, and Neon PostgreSQL.

## Features

- 🔐 **Authentication**: Secure authentication with NextAuth.js supporting Google and GitHub providers
- 📊 **Database**: PostgreSQL with Neon serverless database
- 🛠️ **Type-safe ORM**: Drizzle ORM for type-safe database operations
- 🎨 **Modern UI**: Built with Tailwind CSS
- ⚡ **Fast Development**: Powered by Turbopack for fast refresh

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Authentication**: NextAuth.js v4
- **Database**: Neon PostgreSQL
- **ORM**: Drizzle ORM
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Package Manager**: Bun

## Prerequisites

- Bun >= 1.0
- Node.js >= 18
- A Neon database account
- OAuth app credentials (Google and/or GitHub)

## Running the Application

```bash
# Development
bun run dev

# Production build
bun run build
bun run start

# Lint
bun run lint
```

## Database Commands

```bash
# Generate new migrations after schema changes
bun run db:generate

# Apply migrations to database
bun run db:migrate

# Push schema changes directly (development only)
bun run db:push
```

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Protected dashboard
│   └── ...
├── components/            # React components
│   ├── ui/               # UI components
│   └── ...
├── lib/                  # Utility functions
├── src/                  # Source code
│   └── db/               # Database schema and config
├── types/                # TypeScript type definitions
└── migrations/           # Database migrations
```

## Authentication Features

- ✅ Google OAuth login
- ✅ GitHub OAuth login
- ✅ Protected routes with middleware
- ✅ Session management
- ✅ User profile display
- ✅ Automatic redirects for unauthenticated users

## Next Steps

- Create form builder interface
- Add form submission handling
- Implement form analytics
