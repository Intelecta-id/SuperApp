-- ==============================================================================
-- Intelecta SuperApp — PostgreSQL Database Schema for Supabase
-- Covers all 8 core modules: Profiles, Clients, Projects, Sprints, Tasks,
-- Leads, Invoices, Tickets, Realtime Chat, Audit Logs, and Webhook Logs.
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PROFILES & ROLES (Tied to Supabase auth.users or standalone UUID)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'engineer' CHECK (role IN ('super_admin', 'project_manager', 'engineer', 'marketing', 'finance', 'client')),
    avatar_url TEXT,
    phone TEXT,
    department TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 2. TEAM PROFILES (Public Talent Synchronization for Corporate Web /tim)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.team_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL,
    bio TEXT,
    skills JSONB DEFAULT '[]'::jsonb,
    avatar_url TEXT,
    github_url TEXT,
    linkedin_url TEXT,
    is_public BOOLEAN DEFAULT true,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 3. CLIENTS (B2B Directory & Accounts)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT NOT NULL,
    pic_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'churned')),
    tier TEXT NOT NULL DEFAULT 'standard' CHECK (tier IN ('standard', 'enterprise', 'retainer')),
    contract_value NUMERIC(15, 2) DEFAULT 0,
    avatar_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 4. PROJECTS & PROJECT MEMBERS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    service_type TEXT NOT NULL CHECK (service_type IN ('web_dev', 'mobile_dev', 'web_app')),
    status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('planning', 'in_progress', 'review', 'completed', 'maintenance')),
    progress INT DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    budget NUMERIC(15, 2) DEFAULT 0,
    start_date DATE,
    deadline DATE,
    repository_url TEXT,
    live_url TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.project_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'contributor',
    joined_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    UNIQUE(project_id, profile_id)
);

-- ------------------------------------------------------------------------------
-- 5. SPRINTS & TASKS (Scrum Kanban Engine)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sprints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    goal TEXT,
    start_date DATE,
    end_date DATE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('planned', 'active', 'completed')),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    sprint_id UUID REFERENCES public.sprints(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('backlog', 'todo', 'in_progress', 'review', 'done')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    assignee_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    points INT DEFAULT 1,
    order_index INT DEFAULT 0,
    due_date DATE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.task_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INT,
    file_type TEXT,
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 6. LEADS & ACTIVITIES (Omnichannel Pipeline)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    company TEXT,
    source TEXT NOT NULL CHECK (source IN ('instagram', 'web_contact', 'web_terminal', 'whatsapp', 'manual')),
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost')),
    estimated_value NUMERIC(15, 2) DEFAULT 0,
    message TEXT,
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.lead_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    type TEXT NOT NULL CHECK (type IN ('call', 'meeting', 'email', 'note', 'status_change')),
    notes TEXT,
    scheduled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 7. INVOICES (Billing & Financial)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number TEXT UNIQUE NOT NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    amount NUMERIC(15, 2) NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'issued', 'paid', 'overdue', 'cancelled')),
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    paid_at TIMESTAMPTZ,
    payment_method TEXT,
    notes TEXT,
    items JSONB DEFAULT '[]'::jsonb,
    midtrans_snap_token TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 8. TICKETS & REPLIES (Helpdesk SLA)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number TEXT UNIQUE NOT NULL,
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    sla_hours INT DEFAULT 24,
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.ticket_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 9. REALTIME CHAT (Replacing Firestore NoSQL with Relational + Supabase Realtime)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.chat_channels (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('general', 'project', 'lead_omnichannel', 'incident')),
    reference_id UUID,
    unread_count INT DEFAULT 0,
    last_message TEXT,
    last_time TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.chat_messages (
    id TEXT PRIMARY KEY DEFAULT ('msg-' || gen_random_uuid()::text),
    channel_id TEXT REFERENCES public.chat_channels(id) ON DELETE CASCADE,
    sender_id TEXT NOT NULL,
    sender_name TEXT NOT NULL,
    sender_avatar TEXT,
    text TEXT NOT NULL,
    is_internal_note BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 10. AUDIT & WEBHOOK LOGS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    old_values JSONB,
    new_values JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.webhook_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source TEXT NOT NULL,
    payload JSONB,
    response_status INT,
    status TEXT DEFAULT 'success',
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- TRIGGERS: auto-update updated_at timestamp
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ 
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND column_name = 'updated_at'
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS set_updated_at ON public.%I;
            CREATE TRIGGER set_updated_at
            BEFORE UPDATE ON public.%I
            FOR EACH ROW
            EXECUTE FUNCTION public.handle_updated_at();
        ', t, t);
    END LOOP;
END $$;

-- ------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;

-- Standard policies for internal authenticated team access
CREATE POLICY "Allow public read for team profiles" ON public.team_profiles FOR SELECT USING (is_public = true);
CREATE POLICY "Allow all access to authenticated users" ON public.profiles FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all access to team_profiles" ON public.team_profiles FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all access to clients" ON public.clients FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all access to projects" ON public.projects FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all access to project_members" ON public.project_members FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all access to sprints" ON public.sprints FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all access to tasks" ON public.tasks FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all access to task_attachments" ON public.task_attachments FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all access to leads" ON public.leads FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow public insert for leads" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all access to lead_activities" ON public.lead_activities FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all access to invoices" ON public.invoices FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all access to tickets" ON public.tickets FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all access to ticket_replies" ON public.ticket_replies FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all access to chat_channels" ON public.chat_channels FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all access to chat_messages" ON public.chat_messages FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all access to audit_logs" ON public.audit_logs FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all access to webhook_logs" ON public.webhook_logs FOR ALL TO authenticated USING (true);

-- ------------------------------------------------------------------------------
-- REALTIME PUBLICATION
-- ------------------------------------------------------------------------------
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_channels;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tickets;
