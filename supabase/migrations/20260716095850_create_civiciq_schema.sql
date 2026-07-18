/*
# CivicIQ — AI Civic Intelligence Platform Schema

## Overview
Creates the full data model for CivicIQ, an AI intelligence layer for government
infrastructure management. This is a single-tenant demo application (no sign-in),
so all policies allow both anon and authenticated roles.

## New Tables

1. **departments** — Government departments (Water, Roads, Electricity, etc.)
   - id, name, icon, color, head_officer, performance_score, active_complaints, resolved_complaints

2. **wards** — City wards with AI Civic Health Scores
   - id, name, number, health_score, roads_score, water_score, electricity_score, garbage_score, traffic_score, satisfaction_score, population, lat, lng

3. **complaints** — Citizen complaints with AI auto-classification
   - id, title, description, photo_url, department, category, priority, status, ward_id, address, lat, lng, ai_confidence, ai_analysis, estimated_resolution, created_at

4. **root_causes** — AI-grouped root causes behind complaint clusters
   - id, title, description, confidence, affected_citizens, affected_wards, recommended_action, estimated_budget, estimated_resolution_hours, department, severity, complaint_count, status, created_at

5. **action_plans** — Daily AI executive action plans for officers
   - id, date, critical_issue, affected_population, recommended_department, estimated_budget, suggested_team, completion_time, priority_score, confidence_score, status, created_at

6. **reports** — AI-generated executive briefs and intelligence reports
   - id, title, type (daily/weekly/monthly), summary, content (jsonb), created_at

## Security
- RLS enabled on all tables.
- All tables allow anon + authenticated CRUD (single-tenant demo, intentionally public).
*/

-- Departments
CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  icon text DEFAULT 'Building2',
  color text DEFAULT 'primary',
  head_officer text,
  performance_score numeric DEFAULT 0,
  active_complaints int DEFAULT 0,
  resolved_complaints int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_departments" ON departments;
CREATE POLICY "anon_select_departments" ON departments FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_departments" ON departments;
CREATE POLICY "anon_insert_departments" ON departments FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_departments" ON departments;
CREATE POLICY "anon_update_departments" ON departments FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_departments" ON departments;
CREATE POLICY "anon_delete_departments" ON departments FOR DELETE TO anon, authenticated USING (true);

-- Wards
CREATE TABLE IF NOT EXISTS wards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  number int NOT NULL,
  health_score numeric DEFAULT 0,
  roads_score numeric DEFAULT 0,
  water_score numeric DEFAULT 0,
  electricity_score numeric DEFAULT 0,
  garbage_score numeric DEFAULT 0,
  traffic_score numeric DEFAULT 0,
  satisfaction_score numeric DEFAULT 0,
  population int DEFAULT 0,
  lat numeric DEFAULT 0,
  lng numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE wards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_wards" ON wards;
CREATE POLICY "anon_select_wards" ON wards FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_wards" ON wards;
CREATE POLICY "anon_insert_wards" ON wards FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_wards" ON wards;
CREATE POLICY "anon_update_wards" ON wards FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_wards" ON wards;
CREATE POLICY "anon_delete_wards" ON wards FOR DELETE TO anon, authenticated USING (true);

-- Complaints
CREATE TABLE IF NOT EXISTS complaints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  photo_url text,
  department text,
  category text,
  priority text DEFAULT 'medium',
  status text DEFAULT 'pending',
  ward_id uuid REFERENCES wards(id),
  address text,
  lat numeric,
  lng numeric,
  ai_confidence numeric DEFAULT 0,
  ai_analysis jsonb,
  estimated_resolution text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_complaints" ON complaints;
CREATE POLICY "anon_select_complaints" ON complaints FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_complaints" ON complaints;
CREATE POLICY "anon_insert_complaints" ON complaints FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_complaints" ON complaints;
CREATE POLICY "anon_update_complaints" ON complaints FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_complaints" ON complaints;
CREATE POLICY "anon_delete_complaints" ON complaints FOR DELETE TO anon, authenticated USING (true);

-- Root Causes
CREATE TABLE IF NOT EXISTS root_causes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  confidence numeric DEFAULT 0,
  affected_citizens int DEFAULT 0,
  affected_wards text[],
  recommended_action text,
  estimated_budget text,
  estimated_resolution_hours numeric DEFAULT 0,
  department text,
  severity text DEFAULT 'medium',
  complaint_count int DEFAULT 0,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE root_causes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_root_causes" ON root_causes;
CREATE POLICY "anon_select_root_causes" ON root_causes FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_root_causes" ON root_causes;
CREATE POLICY "anon_insert_root_causes" ON root_causes FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_root_causes" ON root_causes;
CREATE POLICY "anon_update_root_causes" ON root_causes FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_root_causes" ON root_causes;
CREATE POLICY "anon_delete_root_causes" ON root_causes FOR DELETE TO anon, authenticated USING (true);

-- Action Plans
CREATE TABLE IF NOT EXISTS action_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date DEFAULT CURRENT_DATE,
  critical_issue text NOT NULL,
  affected_population int DEFAULT 0,
  recommended_department text,
  estimated_budget text,
  suggested_team text,
  completion_time text,
  priority_score numeric DEFAULT 0,
  confidence_score numeric DEFAULT 0,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE action_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_action_plans" ON action_plans;
CREATE POLICY "anon_select_action_plans" ON action_plans FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_action_plans" ON action_plans;
CREATE POLICY "anon_insert_action_plans" ON action_plans FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_action_plans" ON action_plans;
CREATE POLICY "anon_update_action_plans" ON action_plans FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_action_plans" ON action_plans;
CREATE POLICY "anon_delete_action_plans" ON action_plans FOR DELETE TO anon, authenticated USING (true);

-- Reports
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  type text NOT NULL DEFAULT 'daily',
  summary text,
  content jsonb,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_reports" ON reports;
CREATE POLICY "anon_select_reports" ON reports FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_reports" ON reports;
CREATE POLICY "anon_insert_reports" ON reports FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_reports" ON reports;
CREATE POLICY "anon_update_reports" ON reports FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_reports" ON reports;
CREATE POLICY "anon_delete_reports" ON reports FOR DELETE TO anon, authenticated USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_complaints_ward ON complaints(ward_id);
CREATE INDEX IF NOT EXISTS idx_complaints_department ON complaints(department);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_root_causes_status ON root_causes(status);
CREATE INDEX IF NOT EXISTS idx_action_plans_date ON action_plans(date);
