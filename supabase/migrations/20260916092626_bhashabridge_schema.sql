/*
# BhashaBridge Library — Core Schema

## Purpose
Stores bilingual educational content linked to textbook codes (class-subject-chapter-page),
community feedback/ratings, and contributor info. This is a no-auth MVP — all data is
intentionally public/shared, so policies allow anon + authenticated CRUD.

## New Tables

### textbook_content
- `id` (uuid PK)
- `class_num` (int 1-10) — school class/grade
- `subject` (text) — e.g. "Math", "EVS", "English"
- `chapter` (int) — chapter number
- `page` (int) — page number
- `code` (text, unique) — canonical textbook code, format CC-SUB-CH-PPP (e.g. 05-MATH-03-012)
- `content_type` (enum: EXPLANATION, STORY, PRACTICE)
- `school_language` (text) — ISO-like code e.g. "en", "hi"
- `home_language` (text) — e.g. "hi", "mr", "gon"
- `title_school` (text) — title in school language
- `body_school` (text) — body in school language
- `title_home` (text) — title in home language
- `body_home` (text) — body in home language
- `contributor_name` (text, nullable)
- `contributor_role` (text, nullable) — TEACHER, VOLUNTEER, PARENT, STUDENT
- `views_count` (int, default 0)
- `average_rating` (numeric, default 0)
- `ratings_count` (int, default 0)
- `created_at` (timestamptz)

### feedback
- `id` (uuid PK)
- `content_id` (uuid FK → textbook_content, ON DELETE CASCADE)
- `rating` (int 1-5)
- `comment` (text, nullable)
- `helpful` (boolean, nullable)
- `session_id` (text) — anonymous session identifier
- `created_at` (timestamptz)

## Security
- RLS enabled on both tables.
- All policies use `TO anon, authenticated` (no-auth MVP, intentionally public data).
*/

CREATE TABLE IF NOT EXISTS textbook_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_num int NOT NULL CHECK (class_num >= 1 AND class_num <= 10),
  subject text NOT NULL,
  chapter int NOT NULL,
  page int NOT NULL,
  code text UNIQUE NOT NULL,
  content_type text NOT NULL CHECK (content_type IN ('EXPLANATION', 'STORY', 'PRACTICE')),
  school_language text NOT NULL,
  home_language text NOT NULL,
  title_school text NOT NULL,
  body_school text NOT NULL,
  title_home text NOT NULL,
  body_home text NOT NULL,
  contributor_name text,
  contributor_role text,
  views_count int NOT NULL DEFAULT 0,
  average_rating numeric(3,2) NOT NULL DEFAULT 0,
  ratings_count int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE textbook_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_content" ON textbook_content;
CREATE POLICY "anon_select_content" ON textbook_content FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_content" ON textbook_content;
CREATE POLICY "anon_insert_content" ON textbook_content FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_content" ON textbook_content;
CREATE POLICY "anon_update_content" ON textbook_content FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid NOT NULL REFERENCES textbook_content(id) ON DELETE CASCADE,
  rating int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  helpful boolean,
  session_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_feedback" ON feedback;
CREATE POLICY "anon_select_feedback" ON feedback FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_feedback" ON feedback;
CREATE POLICY "anon_insert_feedback" ON feedback FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_feedback" ON feedback;
CREATE POLICY "anon_update_feedback" ON feedback FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_content_code ON textbook_content(code);
CREATE INDEX IF NOT EXISTS idx_content_home_lang ON textbook_content(home_language);
CREATE INDEX IF NOT EXISTS idx_feedback_content_id ON feedback(content_id);
