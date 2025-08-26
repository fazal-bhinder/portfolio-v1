"use client";

import { useState } from "react";
import { projects } from "../data/projects";
import { Footer } from "../sections/footer";

import { motion, AnimatePresence } from "framer-motion";
import ProjectCard from "../components/ui/projectCard";

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 1 } },
};

const projectFadeIn = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

export default function Projects() {
  const [showAll, setShowAll] = useState(false);
  const hasMoreProjects = projects.length > 2;

  return (
    <motion.div
      className="flex flex-col px-4 sm:px-8 md:px-16 lg:px-24 mt-10 max-w-6xl mx-auto"
      variants={fadeIn}
      initial="hidden"
      animate="show"
    >
      {/* Section Heading */}
      <div className="mb-5">
        <p className="h-[0.1px] w-full bg-gradient-to-r bg-zinc-400 mb-4" />
        <p className="text-xl font-semibold">proof of work.</p>
      </div>

      {/* Projects List */}
      <div className="flex flex-col gap-4">
        {/* Always show first 2 projects */}
        {projects.slice(0, 2).map((project) => (
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

        {/* Additional Projects with Animation */}
        <AnimatePresence>
          {showAll &&
            projects.slice(2).map((project) => (
              <motion.div
                key={project.title}
                variants={projectFadeIn}
                initial="hidden"
                animate="show"
                exit="exit"
              >
                <ProjectCard
                  title={project.title}
                  description={project.description}
                  imageSrc={project.imageSrc}
                  status="Running"
                  demoUrl={project.liveUrl}
                  githubUrl={project.githubUrl}
                />
              </motion.div>
            ))}
        </AnimatePresence>

        {/* Show More/Less Button */}
        {hasMoreProjects && (
          <motion.button
            onClick={() => setShowAll(!showAll)}
            className="self-center mt-4 px-6 py-2 text-sm font-medium text-zinc-500 border border-zinc-300 hover:border-zinc-400 rounded-lg transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {showAll ? "Show Less" : `Show More (${projects.length - 2} more)`}
          </motion.button>
        )}
      </div>

      {/* Footer Separator */}
      <p className="h-[0.1px] w-full bg-gradient-to-r bg-zinc-400 mt-8 mb-6" />

      {/* Footer */}
      <Footer />
    </motion.div>
  );
}