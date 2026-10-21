import type { StaticImageData } from "next/image";
import HelmImg from "@/public/projects/helm.jpeg";
import AmeckImg from "@/public/projects/ameckcrm.jpeg";
import CarpetstoryImg from "@/public/projects/carpetstory.jpeg";
import SpectreImg from "@/public/projects/thespectre.jpeg";
import ShallymarImg from "@/public/projects/shallymar.jpeg";
import MetadataImg from "@/public/projects/metadata.jpeg";
import FontGlitchImg from "@/public/projects/fontglitch.jpeg";
import DiscordImg from "@/public/projects/discordts.jpeg";
import SentinelImg from "@/public/projects/sentinel.png";
import TrashAI from "@/public/projects/TrashAI.jpeg";

export interface Project {
  title: string;
  description: string;
  imageSrc: StaticImageData;
  liveUrl?: string;
  githubUrl?: string;
}

export const projects: Project[] = [
  {
    title: "Helm",
    description: "A crypto trading desk run by AI agents. Services research, size and place Binance futures trades on their own, inside a daily loss limit, and repair their own faults. Paper trading on live data for now.",
    imageSrc: HelmImg,
  },
  {
    title: "Ameck CRM",
    description: "Client project. Turned a prototype into a production sales CRM for Ameck Business House, now used by two companies for leads, quotes, orders and payments.",
    imageSrc: AmeckImg,
    liveUrl: "https://crm.thespectre.one",
  },
  {
    title: "Carpetstory",
    description: "Built from scratch: the online store for a Jaipur rug exporter, selling to interior designers in the US and Europe in English, French and German.",
    imageSrc: CarpetstoryImg,
    liveUrl: "https://carpetstory.one",
  },
  {
    title: "The Spectre",
    description: "AI marketing platform. I built the backend that drafts Instagram posts and email campaigns and publishes them once a person approves.",
    imageSrc: SpectreImg,
    liveUrl: "https://thespectre.one",
  },
  {
    title: "Shallymar",
    description: "Launch site for an art-rug line hand-knotted in Jaipur, plus a video pipeline that cuts launch reels to the beat of the music.",
    imageSrc: ShallymarImg,
    liveUrl: "https://shallymar.com",
  },
  {
    title: "Metadata Remover",
    description: "Strips location and camera data from photos and videos inside the browser, without re-encoding them. Nothing is uploaded. Live in 12 languages.",
    imageSrc: MetadataImg,
    liveUrl: "https://metadataremoverai.com",
  },
  {
    title: "FontGlitch",
    description: "A glitch text generator with real control over the chaos: separate sliders for above, through and below, with previews for Instagram, Discord and WhatsApp.",
    imageSrc: FontGlitchImg,
    liveUrl: "https://fontglitch.com",
  },
  {
    title: "Discord Timestamps",
    description: "Pick a time, copy a code, and every reader sees it in their own time zone. Runs in the browser, with a small public API.",
    imageSrc: DiscordImg,
    liveUrl: "https://discordtimestampgen.com",
  },
  {
    title: "Sentinel",
    description: "Catches LLM providers silently changing their response shape, the kind of drift where the parser still succeeds but cost reads null.",
    imageSrc: SentinelImg,
    liveUrl: "https://sentinel-nu-lyart.vercel.app",
    githubUrl: "https://github.com/fazal-bhinder/sentinel",
  },
  {
    title: "TrashAI",
    description: "A browser IDE that turns a prompt into a running full-stack app with GPT-4o and WebContainers, no local setup needed.",
    imageSrc: TrashAI,
    liveUrl: "https://trashai.vercel.app/",
    githubUrl: "https://github.com/fazal-bhinder/TrashAI",
  },
];
