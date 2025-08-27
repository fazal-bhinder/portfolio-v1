"use client";

import { motion } from "framer-motion";
import { experience } from "../data/experience";


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

const ProfessionalExperience = () => {
  return (
    <motion.div
      className="px-4 sm:px-8 md:px-16 lg:px-24 mt-10 max-w-6xl mx-auto"
      variants={fadeIn}
      initial="hidden"
      animate="show"
    >
    <p className="h-[0.1px] w-full bg-gradient-to-r bg-zinc-400 mb-8" />
      <motion.h2 
        className="text-xl font-semibold mb-6"
        variants={itemVariants}
      >
        experience.
      </motion.h2>

      <div className="space-y-8">
        {experience.map((exp) => (
          <motion.div
            key={exp.id}
            className="block"
            variants={itemVariants}
          >
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">
                  {exp.company}
                </h3>
                {exp.isActive && (
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                )}
              </div>
              <div className="text-gray-500 text-sm sm:text-right">
                {exp.duration}
              </div>
            </div>
            
            {/* Position */}
            <p className="text-gray-500 italic text-sm mb-4">
              {exp.position}
            </p>
            
            {/* Description */}
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              {exp.description}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProfessionalExperience;