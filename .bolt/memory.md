# Project memory

## Product intent & audience

- TRUTHSCAN: AI-powered deepfake and digital media verification system.
- Analyzes images, videos, and audio to detect manipulation and help users verify authenticity.
- Audience: journalists, investigators, and general users needing media verification.

## Brand personality & voice

- Professional, trustworthy, cybersecurity-forward SaaS tone.
- Transparent about limitations — always states AI predictions are not absolute proof.
- Clearly separates demo UI from real AI analysis; never fabricates results.

## Visual design & UX direction

- Dark navy background with electric blue and cyan accents.
- Premium cybersecurity dashboard aesthetic; clean typography, subtle animations.
- Fully responsive across all pages.
- Drag-and-drop upload with click-to-browse fallback; live previews for image/video/audio.
- Reusable UI primitives: Card, Badge, Button, StatusPill, ConfidenceMeter, Logo, Navbar, Footer, Layout shell.

## Decisions, constraints & rationale

- Tech stack: React + Vite + TypeScript + Tailwind CSS + Lucide icons only; no extra UI packages.
- Custom signal-based router (no react-router); `@/` path alias maps to `src/`.
- History persisted via Supabase (single-tenant, no auth); `analyses` table migration applied.
- Analysis flow POSTs uploaded file to Python Flask backend; URL configurable via `VITE_ANALYSIS_API_URL`.
- Results page has three states: pending/demo (no backend), completed (real result), failed.
- Never fakes confidence scores or verdicts — creates a real history record and labels itself demo UI until backend is connected.
- Result schema is typed and ready to receive backend JSON; may need adjustment when API is finalized.

## Open questions & assumptions

- Flask backend not yet implemented; exact API request/response contract is inferred and may change.
- `VITE_ANALYSIS_API_URL` environment variable must be set when backend is ready.
- Supabase configured single-tenant without auth — may need multi-tenant/auth if scope grows.
- File size limits and supported formats not yet enforced in UI.