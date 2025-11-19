-- Enable authenticated authors to manage their articles without requiring the service role key
-- Insert policy: allow authors to create articles when author_id matches auth.uid()
CREATE POLICY "Authors can create articles"
  ON articles
  FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- Update policy: allow authors to update their own articles
CREATE POLICY "Authors can update their articles"
  ON articles
  FOR UPDATE
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- Delete policy: allow authors to delete their own articles
CREATE POLICY "Authors can delete their articles"
  ON articles
  FOR DELETE
  USING (auth.uid() = author_id);


