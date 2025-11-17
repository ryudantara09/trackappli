-- Enable UUID extension (for compatibility)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Note: PostgreSQL 13+ (Supabase) has gen_random_uuid() built-in
-- We use it instead of uuid_generate_v4() for better compatibility

-- Applications table
CREATE TABLE applications (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  position_url TEXT NOT NULL,
  position_title TEXT,
  company_name TEXT,
  job_location TEXT,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'APPLIED',
  cv_path TEXT,
  cover_letter_path TEXT,
  notes TEXT,
  description TEXT,
  tech_stack JSONB,
  soft_skills JSONB,
  job_type TEXT,
  tags JSONB,
  extracted_json JSONB
);

-- Indexes for applications
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_applied_at ON applications(applied_at);

-- Row Level Security for applications
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own applications"
  ON applications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own applications"
  ON applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications"
  ON applications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own applications"
  ON applications FOR DELETE
  USING (auth.uid() = user_id);

-- Work Experience table
CREATE TABLE work_experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  location TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  current BOOLEAN NOT NULL DEFAULT FALSE,
  description TEXT,
  technologies JSONB
);

CREATE INDEX idx_work_experience_user_id ON work_experience(user_id);

ALTER TABLE work_experience ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own work experience"
  ON work_experience FOR ALL
  USING (auth.uid() = user_id);

-- Education table
CREATE TABLE education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT,
  location TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  current BOOLEAN NOT NULL DEFAULT FALSE,
  gpa TEXT,
  description TEXT
);

CREATE INDEX idx_education_user_id ON education(user_id);

ALTER TABLE education ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own education"
  ON education FOR ALL
  USING (auth.uid() = user_id);

-- Technical Skills table
CREATE TABLE technical_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  proficiency TEXT NOT NULL,
  years_of_exp INTEGER,
  description TEXT,
  verified BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_technical_skills_user_id ON technical_skills(user_id);
CREATE INDEX idx_technical_skills_category ON technical_skills(category);

ALTER TABLE technical_skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own skills"
  ON technical_skills FOR ALL
  USING (auth.uid() = user_id);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_work_experience_updated_at
  BEFORE UPDATE ON work_experience
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_education_updated_at
  BEFORE UPDATE ON education
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_technical_skills_updated_at
  BEFORE UPDATE ON technical_skills
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
