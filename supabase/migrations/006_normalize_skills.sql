-- Create skills table for normalized skill storage
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT, -- Canonical category
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Ensure category matches our application constants
  CONSTRAINT check_category_valid CHECK (category IN ('PROGRAMMING_LANGUAGE', 'FRAMEWORK', 'DATABASE', 'TOOL', 'CLOUD', 'OTHER'))
);

-- Case-insensitive unique index on name to prevent duplicates like "React" and "react"
CREATE UNIQUE INDEX idx_skills_name_unique ON skills (lower(name));

-- Enable RLS
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read skills (for suggestions)
CREATE POLICY "Skills are viewable by everyone" 
  ON skills FOR SELECT 
  USING (true);

-- Allow authenticated users to insert new skills
CREATE POLICY "Authenticated users can insert skills" 
  ON skills FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Add skill_id to technical_skills
ALTER TABLE technical_skills ADD COLUMN skill_id UUID REFERENCES skills(id);

-- Migrate existing data
-- 1. Insert unique skills from technical_skills
-- We use DISTINCT ON (lower(name)) to ensure we only get one entry per case-insensitive name
INSERT INTO skills (name, category)
SELECT DISTINCT ON (lower(name)) name, category
FROM technical_skills
ORDER BY lower(name), created_at;

-- 2. Update technical_skills to link to the new skills table
UPDATE technical_skills ts
SET skill_id = s.id
FROM skills s
WHERE lower(ts.name) = lower(s.name);

-- 3. Make skill_id NOT NULL after migration
ALTER TABLE technical_skills ALTER COLUMN skill_id SET NOT NULL;

-- 4. Drop redundant columns
ALTER TABLE technical_skills DROP COLUMN name;
ALTER TABLE technical_skills DROP COLUMN category;

-- Create index for performance on the foreign key
CREATE INDEX idx_technical_skills_skill_id ON technical_skills(skill_id);
