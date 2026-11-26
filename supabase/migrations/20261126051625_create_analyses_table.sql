/*
# Create analyses table (single-tenant, no auth)

1. New Tables
- `analyses`
- `id` (uuid, primary key)
- `filename` (text, not null) — name of the analyzed file
- `media_type` (text, not null) — one of 'image' | 'video' | 'audio'
- `file_size` (bigint, not null) — file size in bytes
- `mime_type` (text, nullable) — MIME type of the file
- `status` (text, not null, default 'pending') — 'pending' | 'analyzing' | 'completed' | 'failed'
- `result` (jsonb, nullable) — backend analysis result payload (authenticity, confidence, indicators, summary)
- `error_message` (text, nullable) — error description if status is 'failed'
- `created_at` (timestamptz, default now())
- `updated_at` (timestamptz, default now())

2. Security
- Enable RLS on `analyses`.
- Grant CRUD to `anon` + `authenticated` so the Data API can reach the table.
- Allow anon + authenticated CRUD because the data is intentionally shared/public (no sign-in app).

3. Indexes
- Index on `created_at` desc for history listing.
*/

CREATE TABLE IF NOT EXISTS analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  media_type text NOT NULL CHECK (media_type IN ('image', 'video', 'audio')),
  file_size bigint NOT NULL,
  mime_type text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'analyzing', 'completed', 'failed')),
  result jsonb,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON analyses TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_analyses" ON analyses;
CREATE POLICY "anon_select_analyses"
ON analyses FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_analyses" ON analyses;
CREATE POLICY "anon_insert_analyses"
ON analyses FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_analyses" ON analyses;
CREATE POLICY "anon_update_analyses"
ON analyses FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_analyses" ON analyses;
CREATE POLICY "anon_delete_analyses"
ON analyses FOR DELETE
TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON analyses (created_at DESC);
