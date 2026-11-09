export interface Experience {
  id: number;
  company: string;
  position: string;
  duration: string;
  description?: string;
  /** the full record, shown on request */
  points?: string[];
  /** one line on what the job was */
  summary: string;
  /** the few things worth reading first */
  highlights: { title: string; detail: string }[];
  isActive?: boolean;
}

export const experience: Experience[] = [
  {
    id: 1,
    company: "House of Dotone",
    position: "Full Stack Engineer · Carpetstory, The Spectre",
    duration: "Apr. 2026 – Present",
    summary:
      "I take products from first commit to production: a store, an AI marketing platform, and a client CRM.",
    highlights: [
      {
        title: "Carpetstory store",
        detail: "Built from scratch in English, French and German. Image payloads cut by 33%.",
      },
      {
        title: "AI marketing backend",
        detail: "Drafts posts and campaigns, publishes on human approval. Search quality up 54.5% (MRR).",
      },
      {
        title: "Ameck CRM",
        detail: "A client prototype turned into a production CRM that two companies run sales on.",
      },
      {
        title: "Lead research",
        detail: "Python and Playwright automation that found 2,581 verified B2B contacts.",
      },
    ],
    points: [
      "Built carpetstory.one from scratch, giving a Jaipur rug exporter its own online store for interior designers in the US and Europe, in English, French and German.",
      "Set up Sanity CMS so the team adds rugs on its own, and cut image payloads by 33% with a custom CDN loader.",
      "Built the backend of our AI marketing platform, which drafts Instagram posts and email campaigns and publishes them once a person approves.",
      "Rebuilt the platform's search over full-text and embeddings, lifting retrieval quality (MRR) by 54.5%, and moved it off paid hosting onto our own Oracle Cloud servers.",
      "Turned a client’s prototype into a production sales CRM for Ameck Business House, now used by two companies. Their last 6 feature requests went live the same day.",
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
    summary:
      "I helped a services company build its first product, an engineering analytics platform, working directly with the CEO.",
    highlights: [
      {
        title: "Faster ingestion",
        detail: "RabbitMQ workers took large Jira and GitHub payloads from minutes to under 30 seconds.",
      },
      {
        title: "Ask-your-sprint search",
        detail: "Natural-language search over sprint and PR history. Answers in under 5 seconds.",
      },
      {
        title: "Live sprint dashboard",
        detail: "FastAPI and React on Jira and GitHub webhooks, replacing manual exports.",
      },
    ],
    points: [
      "Helped a services company build its first product, an engineering analytics platform, working directly with the CEO.",
      "Moved ingestion onto RabbitMQ workers. Large Jira and GitHub payloads went from minutes to under 30 seconds.",
      "Built natural-language search over sprint and PR history with the OpenAI API. Managers got answers in under 5 seconds instead of digging through Jira.",
      "Replaced manual Jira exports with a live sprint dashboard (FastAPI, React) fed by Jira and GitHub webhooks.",
    ],
    isActive: false,
  },
];
