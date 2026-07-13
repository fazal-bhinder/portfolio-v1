"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { 
  SiTypescript, 
  SiJavascript,
  SiPython, 
  SiReact, 
  SiNextdotjs, 
  SiNodedotjs, 
  SiFastapi, 
  SiDocker, 
  SiRedis, 
  SiMongodb, 
  SiPostgresql,
  SiTailwindcss,
  SiFramer,
  SiRabbitmq,
  SiPrisma,
  SiSanity,
  SiGithubactions,
  SiCloudflare,
  SiVercel,
  SiHono,
  SiPostman,
  SiGit
} from "react-icons/si";

const Skills = () => {
  const technologies = [
    { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
    { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
    { name: "Python", icon: SiPython, color: "#3776AB" },
    { name: "React", icon: SiReact, color: "#61DAFB" },
    { name: "Next.js", icon: SiNextdotjs, color: "#000000" },
    { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
    { name: "FastAPI", icon: SiFastapi, color: "#009688" },
    { name: "Hono.js", icon: SiHono, color: "#E36002" },
    { name: "Docker", icon: SiDocker, color: "#2496ED" },
    { name: "Redis", icon: SiRedis, color: "#FF4438" },
    { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
    { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
    { name: "Prisma", icon: SiPrisma, color: "#2D3748" },
    { name: "Sanity", icon: SiSanity, color: "#F03E2F" },
    { name: "RabbitMQ", icon: SiRabbitmq, color: "#FF6600" },
    { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
    { name: "Framer Motion", icon: SiFramer, color: "#0055FF" },
    { name: "GitHub Actions", icon: SiGithubactions, color: "#2088FF" },
    { name: "Cloudflare", icon: SiCloudflare, color: "#F38020" },
    { name: "Vercel", icon: SiVercel, color: "#000000" },
    { name: "Git", icon: SiGit, color: "#F05032" },
    { name: "Postman", icon: SiPostman, color: "#FF6C37" }
  ];

  // Consistent animation variants matching experience section
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6,
        staggerChildren: 0.1
      } 
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  // Container for skills grid with staggered animations
  const skillsContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05, // Slightly faster stagger for multiple items
        delayChildren: 0.1
      }
    }
  };

  const skillItemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { 
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.4
      } 
    }
  };

  return (
    <motion.div
      className="px-4 sm:px-8 md:px-16 lg:px-24 mt-5 max-w-6xl mx-auto"
      variants={fadeIn}
      initial="hidden"
      animate="show"
    >
      <motion.p 
        className="text-xl font-semibold mb-4"
        variants={itemVariants}
      >
        generally i be with.
      </motion.p>

      <motion.div 
        className="flex flex-wrap gap-3"
        variants={skillsContainerVariants}
      >
        {technologies.map((tech, index) => {
          const IconComponent = tech.icon;
          return (
            <motion.div
              key={index}
              className="rounded-lg text-center px-2.5 py-1.5 border border-zinc-200 dark:border-zinc-800 text-sm cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:hover:shadow-white/10 flex items-center gap-2 bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-sm"
              variants={skillItemVariants}
            >
              {IconComponent && (
                <IconComponent 
                  size={18}
                  style={{ color: tech.color }}
                  className="hover:scale-105 transition duration-300 shrink-0"
                />
              )}
              <span className="font-medium text-zinc-700 dark:text-zinc-300">{tech.name}</span>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
};

export default Skills;