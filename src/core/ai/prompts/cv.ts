/**
 * CV/Resume Extraction Prompt Template
 * 
 * Structured prompt for extracting professional profile data from CV/resume text.
 */

export interface CVPromptParams {
  cvText: string;
}

/**
 * Generate a structured prompt for CV extraction
 */
export function createCVPrompt(params: CVPromptParams): string {
  const { cvText } = params;
  
  return `You are an expert at extracting structured information from CVs and resumes.
Your task is to analyze the following CV/resume text and extract professional profile information.

IMPORTANT INSTRUCTIONS:
1. Extract information ONLY if it is explicitly stated in the CV text
2. Return a valid JSON object with the specified schema
3. Use null for any field that cannot be determined from the text
4. For arrays, return empty arrays if no information is found
5. Be precise and avoid making assumptions beyond what the text provides
6. For dates, use ISO format (YYYY-MM-DD) or partial dates (YYYY-MM, YYYY) as appropriate
7. Mark current positions/education with "current": true and leave "end_date" as null

EXTRACTION SCHEMA:
{
  "personal_info": {
    "name": string | null,
    "email": string | null,
    "phone": string | null,
    "location": string | null
  },
  "work_experience": [
    {
      "company": string,                  // Required: Company name
      "position": string,                 // Required: Job title/position
      "location": string | null,          // Office location
      "start_date": string,               // Required: ISO format (YYYY-MM-DD or YYYY-MM or YYYY)
      "end_date": string | null,          // ISO format, null if current
      "current": boolean,                 // Required: true if currently working here
      "description": string | null,       // Job responsibilities and achievements
      "technologies": string[]            // Technologies/tools used in this role
    }
  ],
  "education": [
    {
      "institution": string,              // Required: School/university name
      "degree": string,                   // Required: Degree type (e.g., "Bachelor of Science")
      "field_of_study": string | null,    // Major/field (e.g., "Computer Science")
      "start_date": string,               // Required: ISO format
      "end_date": string | null,          // ISO format, null if current
      "current": boolean                  // Required: true if currently studying
    }
  ],
  "technical_skills": [
    {
      "category": string,                 // Required: Skill category (e.g., "Programming Languages", "Frameworks")
      "name": string,                     // Required: Skill name (e.g., "JavaScript", "React")
      "proficiency": string | null        // Proficiency level if mentioned (e.g., "Expert", "Intermediate")
    }
  ]
}

EXTRACTION RULES:

Personal Information:
- Extract contact details from header or contact section
- Normalize phone numbers to include country code if possible
- Keep email addresses exactly as written

Work Experience:
- List in reverse chronological order (most recent first)
- For current positions: set "current": true and "end_date": null
- Extract key technologies mentioned in job descriptions
- Include internships and contract positions
- For dates: prefer YYYY-MM-DD, but accept YYYY-MM or YYYY if that's all that's available

Education:
- List in reverse chronological order (most recent first)
- Include degree type and field of study separately
- For current studies: set "current": true and "end_date": null
- Include certifications if they appear in education section

Technical Skills:
- Group skills by logical categories (e.g., "Programming Languages", "Frameworks", "Databases", "Tools")
- Extract individual skills, not skill groups
- Include proficiency level only if explicitly stated
- Common categories: "Programming Languages", "Frameworks", "Databases", "Cloud Platforms", "Tools", "Methodologies"

CV/RESUME TEXT:
${cvText}

Extract the information and return ONLY a valid JSON object with no additional text or explanation.`;
}

/**
 * Example CV text for testing
 */
export const EXAMPLE_CV = `
John Doe
john.doe@email.com | +1-555-0123 | San Francisco, CA
LinkedIn: linkedin.com/in/johndoe | GitHub: github.com/johndoe

PROFESSIONAL SUMMARY
Senior Software Engineer with 8+ years of experience in full-stack development.

WORK EXPERIENCE

Senior Software Engineer
TechCorp Inc., San Francisco, CA
January 2020 - Present
- Lead development of microservices architecture using Node.js and Kubernetes
- Implemented CI/CD pipelines reducing deployment time by 60%
- Mentored team of 5 junior developers
Technologies: Node.js, React, TypeScript, PostgreSQL, AWS, Docker, Kubernetes

Software Engineer
StartupXYZ, Remote
June 2017 - December 2019
- Built RESTful APIs serving 1M+ daily requests
- Developed responsive web applications using React and Redux
Technologies: JavaScript, React, Redux, MongoDB, Express.js

EDUCATION

Bachelor of Science in Computer Science
University of California, Berkeley
September 2013 - May 2017

TECHNICAL SKILLS

Programming Languages: JavaScript, TypeScript, Python, Java
Frameworks: React, Node.js, Express.js, Next.js
Databases: PostgreSQL, MongoDB, Redis
Cloud & DevOps: AWS, Docker, Kubernetes, CI/CD
Tools: Git, Jest, Webpack
`;

export const EXAMPLE_CV_EXTRACTION = {
  personal_info: {
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1-555-0123",
    location: "San Francisco, CA"
  },
  work_experience: [
    {
      company: "TechCorp Inc.",
      position: "Senior Software Engineer",
      location: "San Francisco, CA",
      start_date: "2020-01",
      end_date: null,
      current: true,
      description: "Lead development of microservices architecture using Node.js and Kubernetes. Implemented CI/CD pipelines reducing deployment time by 60%. Mentored team of 5 junior developers.",
      technologies: ["Node.js", "React", "TypeScript", "PostgreSQL", "AWS", "Docker", "Kubernetes"]
    },
    {
      company: "StartupXYZ",
      position: "Software Engineer",
      location: "Remote",
      start_date: "2017-06",
      end_date: "2019-12",
      current: false,
      description: "Built RESTful APIs serving 1M+ daily requests. Developed responsive web applications using React and Redux.",
      technologies: ["JavaScript", "React", "Redux", "MongoDB", "Express.js"]
    }
  ],
  education: [
    {
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      field_of_study: "Computer Science",
      start_date: "2013-09",
      end_date: "2017-05",
      current: false
    }
  ],
  technical_skills: [
    { category: "Programming Languages", name: "JavaScript", proficiency: null },
    { category: "Programming Languages", name: "TypeScript", proficiency: null },
    { category: "Programming Languages", name: "Python", proficiency: null },
    { category: "Programming Languages", name: "Java", proficiency: null },
    { category: "Frameworks", name: "React", proficiency: null },
    { category: "Frameworks", name: "Node.js", proficiency: null },
    { category: "Frameworks", name: "Express.js", proficiency: null },
    { category: "Frameworks", name: "Next.js", proficiency: null },
    { category: "Databases", name: "PostgreSQL", proficiency: null },
    { category: "Databases", name: "MongoDB", proficiency: null },
    { category: "Databases", name: "Redis", proficiency: null },
    { category: "Cloud Platforms", name: "AWS", proficiency: null },
    { category: "Tools", name: "Docker", proficiency: null },
    { category: "Tools", name: "Kubernetes", proficiency: null },
    { category: "Tools", name: "Git", proficiency: null },
    { category: "Tools", name: "Jest", proficiency: null },
    { category: "Tools", name: "Webpack", proficiency: null }
  ]
};
