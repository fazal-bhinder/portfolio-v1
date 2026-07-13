export interface Experience {
  id: number;
  company: string;
  position: string;
  duration: string;
  description?: string;
  points?: string[];
  isActive?: boolean;
}

export const experience: Experience[] = [
  {
    id: 1,
    company: "Carpetstory",
    position: "Full Stack Engineer",
    duration: "Apr. 2026 – Present",
    points: [
      "Owned and shipped a full e-commerce platform solo using Next.js 16, TypeScript, and Sanity CMS.",
      "Optimized catalog performance and image delivery, cutting average page payloads by 33%.",
      "Built Spectre Command, an ops dashboard compiled into a single serverless HTML file.",
      "Automated analytics reporting and scraping with Python/Bash, saving hours of manual work weekly.",
      "Wrote a custom Python linter to validate markdown knowledge base links and metadata."
    ],
    isActive: true
  },
  {
    id: 2,
    company: "Psylief Technologies",
    position: "Backend Developer Intern",
    duration: "Aug. 2025 – Mar. 2026",
    points: [
      "Built a distributed indexing service on RabbitMQ, reducing payload processing time by 90%.",
      "Created an OpenAI-powered natural language query tool to search structured sprint and PR data.",
      "Developed a live FastAPI dashboard with GitHub/Jira webhooks to track sprint velocity."
    ],
    isActive: false
  }
];