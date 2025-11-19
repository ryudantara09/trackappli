/**
 * Job Posting Extraction Prompt Template
 * 
 * Structured prompt for extracting job details from raw job posting text.
 */

export interface JobPostingPromptParams {
  rawText: string;
}

/**
 * Generate a structured prompt for job posting extraction
 */
export function createJobPostingPrompt(params: JobPostingPromptParams): string {
  const { rawText } = params;
  
  return `You are an expert at extracting structured information from job postings. 
Your task is to analyze the following job posting text and extract key information.

IMPORTANT INSTRUCTIONS:
1. Extract information ONLY if it is explicitly stated or clearly implied in the text
2. Return a valid JSON object with the specified schema
3. Use null for any field that cannot be determined from the text
4. For arrays (tech_stack, soft_skills), return empty arrays if no information is found
5. Be precise and avoid making assumptions beyond what the text provides

EXTRACTION SCHEMA:
{
  "position_title": string | null,        // Job title/position name
  "company": string | null,               // Company name
  "location": string | null,              // Job location (city, state, country, or "Remote")
  "job_type": string | null,              // e.g., "Full-time", "Part-time", "Contract", "Internship"
  "tech_stack": string[],                 // Technical skills, programming languages, frameworks, tools
  "soft_skills": string[],                // Soft skills like "communication", "leadership", "teamwork"
  "description": string | null,           // the job description full text (without the company name, position title etc) MEANING DO NOT MAKE IT AS A SUMMARY, but also don't keep all sections that are not part of the  position description
  "salary_range": string | null           // Salary information if mentioned
}

EXTRACTION RULES:
- For tech_stack: Include programming languages, frameworks, libraries, databases, cloud platforms, tools
- For soft_skills: Include interpersonal skills, work style preferences, team dynamics
- For location: Normalize to a readable format (e.g., "San Francisco, CA" or "Remote")
- For job_type: Use standard categories (Full-time, Part-time, Contract, Internship, Temporary)
- For salary_range: Keep the original format if mentioned (e.g., "$100k-$150k", "€50,000-€70,000")

JOB POSTING TEXT:
${rawText}

Extract the information and return ONLY a valid JSON object with no additional text or explanation.`;
}

/**
 * Example usage and expected output format
 */
export const EXAMPLE_JOB_POSTING = `
Senior Full Stack Developer
TechCorp Inc.
San Francisco, CA (Hybrid)

We're looking for an experienced Full Stack Developer to join our growing team.

Requirements:
- 5+ years of experience with React and Node.js
- Strong knowledge of TypeScript, PostgreSQL, and AWS
- Experience with Docker and Kubernetes
- Excellent communication and problem-solving skills
- Ability to work in a fast-paced, collaborative environment

Salary: $120,000 - $160,000
Type: Full-time
`;

export const EXAMPLE_EXTRACTION = {
  position_title: "Senior Full Stack Developer",
  company: "TechCorp Inc.",
  location: "San Francisco, CA (Hybrid)",
  job_type: "Full-time",
  tech_stack: [
    "React",
    "Node.js",
    "TypeScript",
    "PostgreSQL",
    "AWS",
    "Docker",
    "Kubernetes"
  ],
  soft_skills: [
    "communication",
    "problem-solving",
    "collaborative"
  ],
  description: "Experienced Full Stack Developer position for a growing team",
  salary_range: "$120,000 - $160,000"
};
