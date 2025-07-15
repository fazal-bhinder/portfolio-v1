"use client";

import Image from "next/image";
import { FaGithub } from "react-icons/fa";
import { HiOutlineExternalLink } from "react-icons/hi";
import type { StaticImageData } from "next/image";

interface ProjectCardProps {
  imageSrc: string | StaticImageData;
  title: string;
  description: string;
  status: "Running" | "Down";
  demoUrl: string;
  githubUrl: string;
}

export default function ProjectCard({
  imageSrc,
  title,
  description,
  demoUrl,
  githubUrl,
}: ProjectCardProps) {
  return (
    <div
      className={`
        transition-transform duration-300 
        hover:scale-[1.015] 
        hover:border-primary
        rounded-lg p-4 flex flex-col sm:flex-row items-start gap-4 
        w-full max-w-4xl mx-auto group shadow-md
        dark:hover:shadow-white/25 mb-2
      `}
    >
      <div className="w-full sm:w-32 h-48 sm:h-28 relative shrink-0 rounded-md overflow-hidden">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <h2 className="text-xl font-semibold">{title}</h2>
          <div className="flex items-center gap-3">
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Live Demo"
            />
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open"
            >
              <HiOutlineExternalLink className="w-5 h-5" />
            </a>
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
            >
              <FaGithub className="w-5 h-5" />
            </a>
          </div>
        </div>
        <p className="text-sm mt-2 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
