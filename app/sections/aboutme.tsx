"use client";

import { motion } from "framer-motion";

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

export default function AboutMe() {
  return (
    <motion.div
      className="flex flex-col px-4 sm:px-8 md:px-16 lg:px-24 mt-5 max-w-5xl mx-auto"
      variants={fadeIn}
      initial="hidden"
      animate="show"
    >
      <motion.p 
        className="text-zinc-500 mt-3 text-base"
        variants={itemVariants}
      >
        i&#39;m a 23-year-old full stack developer based in India.
      </motion.p>

      <motion.p 
        className="text-zinc-500 mt-4 text-base"
        variants={itemVariants}
      >
        an undergrate computer science student and{" "}
        <a className="border-b-2 border-current pb-0.5">full stack developer.</a>{" "}
        usally i spend most of my time in building something or learning some new technologie. 
      </motion.p>

      <motion.p 
        className="text-zinc-500 mt-4 text-base"
        variants={itemVariants}
      >
        i also love to watch{" "}
        <a className="border-b-2 border-current pb-0.5 hover:scale-105 transition duration-300">movies</a>{" "}
        and jamming the{" "}
        <a
          href="https://open.spotify.com/playlist/3E0Dt0p8hGw0Qprxp6KJ1u?si=45rNyaV6RPyzOen_mAXCDQ&pi=gKmJTgo7RBCvh"
          className="border-b-2 border-current pb-0.5"
        >
          muzic 
        </a>
        .
        you will often find me contributing to open-source or building side projects.
      </motion.p>
    </motion.div>
  );
}