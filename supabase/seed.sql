-- ==============================================================================
-- Intelecta SuperApp — Seed Data for Supabase
-- ==============================================================================

-- 1. Profiles
INSERT INTO public.profiles (id, email, name, role, department, avatar_url, bio)
VALUES 
    ('a0000000-0000-0000-0000-000000000001', 'admin@intelecta.id', 'Fabian S.', 'super_admin', 'Engineering & Operations', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', 'Principal Solutions Architect & Core Lead'),
    ('a0000000-0000-0000-0000-000000000002', 'naufal@intelecta.id', 'Naufal Rizky', 'engineer', 'Frontend Engineering', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 'Senior Frontend Engineer (React/Next.js)'),
    ('a0000000-0000-0000-0000-000000000003', 'sarah@intelecta.id', 'Sarah Maharani', 'project_manager', 'Delivery & Agile', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', 'Senior Technical Project Manager')
ON CONFLICT (id) DO NOTHING;

-- 2. Team Profiles (/tim sync)
INSERT INTO public.team_profiles (profile_id, name, slug, role, bio, skills, github_url, linkedin_url, order_index)
VALUES 
    ('a0000000-0000-0000-0000-000000000001', 'Fabian S.', 'fabian-s', 'Principal Solutions Architect', 'Specializing in high-scale distributed web applications and modern serverless ecosystems.', '["PostgreSQL", "Supabase", "React", "Cloud Architecture"]'::jsonb, 'https://github.com/SukaMCD', 'https://linkedin.com', 1),
    ('a0000000-0000-0000-0000-000000000002', 'Naufal Rizky', 'naufal-rizky', 'Senior Frontend Engineer', 'Obsessed with fluid interactions, design systems, and resilient UI state orchestration.', '["React", "Next.js", "Tailwind CSS", "TypeScript"]'::jsonb, 'https://github.com', 'https://linkedin.com', 2)
ON CONFLICT (slug) DO NOTHING;

-- 3. Clients
INSERT INTO public.clients (id, company_name, pic_name, email, phone, status, tier, contract_value, avatar_url, notes)
VALUES
    ('b0000000-0000-0000-0000-000000000001', 'PT Nusantara Megah Logistik', 'Budi Santoso', 'budi@nusantaralog.co.id', '+62 811-2345-6789', 'active', 'enterprise', 185000000, 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&auto=format&fit=crop&q=80', 'Enterprise SLA retainer & custom fleet dashboard development'),
    ('b0000000-0000-0000-0000-000000000002', 'Fintech Nusantara Solusi', 'Dian Pratama', 'dian@fintechnusa.id', '+62 812-9876-5432', 'active', 'enterprise', 240000000, 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&auto=format&fit=crop&q=80', 'Payment gateway and microservices migration'),
    ('b0000000-0000-0000-0000-000000000003', 'Apotek Sehat Keluarga', 'dr. Ratna Dewi', 'ratna@apoteksehat.com', '+62 813-1122-3344', 'active', 'standard', 75000000, 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=150&auto=format&fit=crop&q=80', 'POS & Telemedicine prescription mobile app')
ON CONFLICT (id) DO NOTHING;

-- 4. Projects
INSERT INTO public.projects (id, client_id, name, slug, service_type, status, progress, budget, start_date, deadline, description)
VALUES
    ('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Fleet Management Telematics System', 'fleet-telematics-system', 'web_app', 'in_progress', 68, 185000000, '2026-06-01', '2026-10-15', 'Custom realtime GPS & load tracking dashboard for 350+ trucks nationwide.'),
    ('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'Fintech Multi-Tenant Portal', 'fintech-multitenant-portal', 'web_dev', 'review', 92, 240000000, '2026-05-10', '2026-09-20', 'High security B2B settlement platform with multi-factor authentication.'),
    ('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003', 'Apotek Sehat Mobile Pharmacy', 'apotek-sehat-mobile', 'mobile_dev', 'in_progress', 45, 75000000, '2026-07-01', '2026-11-30', 'Flutter cross-platform app with e-prescription scanning and Midtrans checkout.')
ON CONFLICT (id) DO NOTHING;

-- 5. Leads (Omnichannel Ingestion)
INSERT INTO public.leads (id, name, email, phone, company, source, status, estimated_value, message)
VALUES
    ('d0000000-0000-0000-0000-000000000001', 'Reza Firmansyah', 'reza@bravocorp.id', '+62 817-555-1234', 'Bravo Corp Logistics', 'instagram', 'new', 65000000, 'Halo admin Intelecta, kami tertarik untuk revamp website korporat dan integrasi sistem order tracking via DM ini.'),
    ('d0000000-0000-0000-0000-000000000002', 'Citra Lestari', 'citra@medikaapp.com', '+62 818-444-9876', 'Medika Digital Clinic', 'web_contact', 'qualified', 120000000, 'Butuh konsultasi pembuatan mobile app iOS & Android untuk sistem booking dokter.'),
    ('d0000000-0000-0000-0000-000000000003', 'Aditya Pratama', 'adit@startupkilat.io', '+62 819-333-8888', 'Kilat Quick Commerce', 'web_terminal', 'proposal', 85000000, 'Request RFP via Intelecta CLI terminal. Ingin bangun microservices dashboard.')
ON CONFLICT (id) DO NOTHING;

-- 6. Invoices
INSERT INTO public.invoices (id, invoice_number, project_id, client_id, amount, status, issue_date, due_date, items)
VALUES
    ('e0000000-0000-0000-0000-000000000001', 'INV/2026/08/001', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 55500000, 'paid', '2026-08-01', '2026-08-15', '[{"description": "Milestone 1: Architecture & UI Prototype", "amount": 55500000}]'::jsonb),
    ('e0000000-0000-0000-0000-000000000002', 'INV/2026/08/002', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 55500000, 'issued', '2026-08-25', '2026-09-10', '[{"description": "Milestone 2: Realtime GPS Telematics Integration", "amount": 55500000}]'::jsonb),
    ('e0000000-0000-0000-0000-000000000003', 'INV/2026/08/003', 'c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 120000000, 'paid', '2026-07-15', '2026-07-30', '[{"description": "Termin 1: 50% Down Payment Fintech Portal", "amount": 120000000}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 7. Tickets
INSERT INTO public.tickets (id, ticket_number, client_id, project_id, title, description, status, priority, sla_hours)
VALUES
    ('f0000000-0000-0000-0000-000000000001', 'TCK-2026-001', 'b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'GPS Coordinates Drift on Expressway Segment', 'Laporan keterlambatan broadcast telemetry koordinat pada truk area Tol Trans Jawa.', 'open', 'high', 12),
    ('f0000000-0000-0000-0000-000000000002', 'TCK-2026-002', 'b0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', 'SSL Handshake Timeout on Webhook Ingestion', 'Midtrans callback notification sesekali mengalami timeout di staging.', 'resolved', 'critical', 4)
ON CONFLICT (id) DO NOTHING;

-- 8. Chat Channels & Messages
INSERT INTO public.chat_channels (id, name, type, unread_count, last_message, last_time)
VALUES
    ('general', 'General Engineering', 'general', 0, 'Schema migration to Supabase ready for review.', '14:00'),
    ('incident-room', 'SLA Incident Escalation', 'incident', 1, 'High priority ticket TCK-2026-001 created.', '13:45'),
    ('lead-omni-1', 'Omnichannel: Reza Firmansyah', 'lead_omnichannel', 2, 'Halo admin Intelecta, kami tertarik untuk revamp website...', '13:10')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.chat_messages (id, channel_id, sender_id, sender_name, text, is_internal_note)
VALUES
    ('msg-101', 'general', 'usr-admin', 'Fabian S.', 'Setup awal migrasi arsitektur ke Vercel + Supabase dimulai.', false),
    ('msg-102', 'incident-room', 'usr-sarah', 'Sarah Maharani', 'Incident room aktif untuk pemantauan SLA client.', true),
    ('msg-103', 'lead-omni-1', 'lead-reza', 'Reza Firmansyah', 'Halo admin Intelecta, kami tertarik untuk revamp website korporat dan integrasi sistem order tracking via DM ini.', false)
ON CONFLICT (id) DO NOTHING;
