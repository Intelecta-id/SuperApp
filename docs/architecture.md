# Arsitektur Intelecta SuperApp (Next.js 15 + Supabase + Vercel)

## 1. Ikhtisar Arsitektur

Intelecta SuperApp mengadopsi arsitektur **Next.js 15 Serverless Monorepo** berkinerja tinggi yang menggabungkan kemampuan SSR/SSG & Route Handlers di **Vercel** dengan Backend-as-a-Service **Supabase** (PostgreSQL, Supabase Auth via `@supabase/ssr`, Realtime WebSockets, Storage, dan Edge Functions).

```
SuperAppIntelecta/
├── supabase/                 # Supabase Infrastructure & DDL
│   ├── config.toml           # Supabase CLI local dev config
│   ├── migrations/           # PostgreSQL Schema, Triggers, & RLS Policies
│   │   └── 20260907000001_create_superapp_schema.sql
│   ├── seed.sql              # Initial operational & mock seeding data
│   └── functions/            # Supabase Edge Functions (Deno / TypeScript)
│
├── frontend/                 # Next.js 15 (App Router) + Tailwind CSS
│   ├── next.config.mjs       # Next.js configuration
│   ├── src/
│   │   ├── middleware.js     # Supabase Auth session refresh middleware
│   │   ├── app/              # App Router (Pages, Layouts, & API Routes)
│   │   │   ├── layout.jsx    # Root Layout, dark obsidian theme & providers
│   │   │   ├── page.jsx      # / (Dashboard Command Center)
│   │   │   ├── login/        # /login (Operator Auth)
│   │   │   ├── omnichannel/  # /omnichannel (Unified Inbox)
│   │   │   ├── clients/      # /clients (B2B Directory)
│   │   │   ├── projects/     # /projects (Scrum Kanban)
│   │   │   ├── financial/    # /financial (Invoices & Billing)
│   │   │   ├── team/         # /team (Talent & /tim sync)
│   │   │   ├── helpdesk/     # /helpdesk (SLA Incident Room)
│   │   │   ├── settings/     # /settings (System Config)
│   │   │   └── api/          # Route Handlers (Webhooks & AI Copilot)
│   │   │       ├── webhooks/ (Instagram & Corporate Web)
│   │   │       └── ai/       (AI Smart Reply)
│   │   ├── components/       # Layout, Chat, CRM, Kanban, UI
│   │   ├── contexts/         # Auth, Chat, Api, Notification Contexts
│   │   └── lib/supabase/     # Supabase SSR Browser & Server clients
│   └── tailwind.config.js    # Dark Obsidian design tokens
│
├── docs/                     # Dokumentasi Arsitektur, Skema, & Deployment
│   ├── architecture.md
│   ├── database-schema.md
│   └── deployment-guide.md
│
└── vercel.json               # Deployment configuration for Vercel
```

## 2. Pola Integrasi & Alur Data

1. **Framework & Hosting**: **Next.js 15 (App Router)** di-hosting secara *native* di **Vercel Edge Network**.
2. **Database & REST**: Seluruh modul data tersimpan di **PostgreSQL Supabase** dengan Row Level Security (RLS) dan diakses via `@supabase/ssr`.
3. **Autentikasi**: **Supabase Auth** dengan cookie session persistence yang divalidasi oleh `middleware.js`.
4. **Realtime Engine**: Menggunakan **Supabase Realtime channels** (`postgres_changes` pada `chat_messages`, `tasks`, `tickets`) untuk komunikasi instan sub-100ms.
5. **Webhook Handlers**: Ditangani langsung via Next.js Route Handlers di `app/api/webhooks/*` atau Supabase Edge Functions.
