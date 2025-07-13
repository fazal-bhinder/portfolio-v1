"use client";

import { projects } from "../data/projects";
import { Footer } from "./footer";
import ProjectCard from "./ui/projectCard";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 1 } },
};

export default function Projects() {
  return (
    <motion.div
      className="flex flex-col px-4 sm:px-8 md:px-16 lg:px-24 mt-10 max-w-6xl mx-auto"
      variants={fadeIn}
      initial="hidden"
      animate="show"
    >
      {/* Section Heading */}
      <div className="mb-5">
        <p className="h-[1px] w-full bg-gradient-to-r from-white to-black mb-4" />
        <p className="text-xl font-semibold">proof of work.</p>
      </div>

      {/* Projects List */}
      <div className="flex flex-col gap-4">
        {projects.map((project) => (
          <ProjectCard
            key={project.title}
            title={project.title}
            description={project.description}
            imageSrc={project.imageSrc}
            status="Running"
            demoUrl={project.liveUrl}
            githubUrl={project.githubUrl}
          />
        ))}
      </div>

      {/* Footer Separator */}
      <p className="h-[1px] w-full bg-gradient-to-r from-white to-black mt-8 mb-6" />

      {/* Footer */}
      <Footer />
    </motion.div>
  );
}
