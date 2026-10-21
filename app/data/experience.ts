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
    company: "House of Dotone",
    position: "Full Stack Engineer · Carpetstory, The Spectre",
    duration: "Apr. 2026 – Present",
    points: [
      "Built carpetstory.one from scratch, giving a Jaipur rug exporter its own online store for interior designers in the US and Europe, in English, French and German.",
      "Set up Sanity CMS so the team adds rugs on its own, and cut image payloads by 33% with a custom CDN loader.",
      "Built the backend of our AI marketing platform, which drafts Instagram posts and email campaigns and publishes them once a person approves.",
      "Rebuilt the platform's search over full-text and embeddings, lifting retrieval quality (MRR) by 54.5%, and moved it off paid hosting onto our own Oracle Cloud servers.",
      "Turned a client's prototype into a production sales CRM for Ameck Business House, now used by two companies. Their last 6 feature requests went live the same day.",
      "Launched shallymar.com for our art-rug line, with a video pipeline that cuts launch reels to the beat of the music.",
      "Automated lead research with Python and Playwright, giving the sales team 2,581 verified B2B contacts across the US, Canada, the UK and India.",
    ],
    isActive: true,
  },
  {
    id: 2,
    company: "Psylief Technologies",
    position: "Backend Developer Intern",
    duration: "Aug. 2025 – Mar. 2026",
    points: [
      "Helped a services company build its first product, an engineering analytics platform, working directly with the CEO.",
      "Moved ingestion onto RabbitMQ workers. Large Jira and GitHub payloads went from minutes to under 30 seconds.",
      "Built natural-language search over sprint and PR history with the OpenAI API. Managers got answers in under 5 seconds instead of digging through Jira.",
      "Replaced manual Jira exports with a live sprint dashboard (FastAPI, React) fed by Jira and GitHub webhooks.",
    ],
    isActive: false,
  },
];
