# Spesifikasi & Kontrak API Intelecta SuperApp

## 1. REST API V1 Endpoints
- `POST /api/v1/auth/login`: Autentikasi dan penerbitan Firebase Custom Token.
- `GET /api/v1/omnichannel/leads`: Query daftar lead masuk.
- `POST /api/v1/omnichannel/instagram/reply`: Balas pesan DM Instagram melalui Meta Graph API.
- `POST /api/v1/team/sync-public-profile`: Pembaruan profil engineer + pemicu revalidasi ke Next.js `/tim/[slug]`.
- `GET /api/v1/projects/{uuid}/board`: Data hierarki Kanban sprint dan task.
- `POST /api/v1/invoices/{uuid}/generate-payment`: Gateway link generation.

## 2. Webhook Ingress
- `POST /api/webhooks/instagram`: Receiver resmi Meta Platform (challenge verification & event capture).
- `POST /api/webhooks/corporate-web`: Receiver kontak form & CLI beacon dari Next.js Corporate Web.
