"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const Skills = () => {
  const technologies = [
    { name: "Typescript", image: "/skills/typescript.png" },
    { name: "Python", image: "/skills/python.png" },
    { name: "React", image: "/skills/react.png" },
    { name: "Next.js", image: "/skills/nextjs.png" },
    { name: "Node.js", image: "/skills/nodejs.png" },
    { name: "FastAPI", image: "/skills/FastAPI.png" },
    { name: "Docker", image: "/skills/docker.png" },
    { name: "Redis", image: "/skills/redis.png" },
    { name: "MongoDb", image: "/skills/mongodb.png" },
    { name: "PostgreSQL", image: "/skills/PostgreSQL.png" }
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
        staggerChildren: 0.08, // Slightly faster stagger for multiple items
        delayChildren: 0.1
      }
    }
  };

  const skillItemVariants = {
    hidden: { opacity: 0 },
    show: { 
      opacity: 1,
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
        {technologies.map((tech, index) => (
          <motion.div
            key={index}
            className="rounded-lg text-center px-2 py-1 border border-zinc-200 dark:border-zinc-700 text-sm cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:hover:shadow-white/25 flex items-center"
            variants={skillItemVariants}
          >
            <Image
              src={tech.image}
              alt={tech.name}
              width={25}
              height={25}
              className="rounded-md hover:border-gray-500 hover:border-1 p-1 hover:scale-105 transition duration-300"
              loading="lazy"
            />
            <span>{tech.name}</span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Skills;