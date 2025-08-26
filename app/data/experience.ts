export interface Experience {
  id: number;
  company: string;
  position: string;
  duration: string;
  description: string;
  isActive?: boolean;
}

export const experience: Experience[] = [
  {
    id: 1,
    company: "intellisight",
    position: "backend developer intern",
    duration: "jun 2025 – present",
    description: "working across Jira, GitHub, and OpenAI integrations. building and maintaining systems that bridge user experiences with automated data ingestion from selected projects, repositories, and natural language queries, with a focus on integrating OpenAI's intelligence layer and a distributed indexing service.",
    isActive: true
  }
];