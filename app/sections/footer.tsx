"use client";

import { motion } from "framer-motion";

export const Footer = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col mt-"
    >
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-xl font-semibold mb-5"
      >
        reach me out.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-zinc-500"
      >
        if you&#39;re intersted in collaborating to build something cool or not so cool, feel free to dm me on{" "}
        <a href="https://x.com/damnfazal" className="border-b-2 border-current pb-0.5">
          x
        </a>{" "}
        or drop me a{" "}
        <a href="mailto:bhinderfazal@gmail.com" className="border-b-2 border-current pb-0.5">
          mail
        </a>
        . i&#39;ll get back to you in 0.1 working days hihi. i am always open to new ideas and conversations.
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-6 mb-10"
      >
        <p className="text-zinc-500">
          built and maintained by{" "}
          <a href="https://x.com/damnfazal" className="border-b-2 border-current pb-0.5">
            fazal
          </a>
          .
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="flex mt-4 justify-center items-center mb-10"
      >
        <p className="text-zinc-500 text-sm">
          © 2025 <a href="https://x.com/damnfazal">fazal</a>. All rights reserved.
        </p>
      </motion.div>
    </motion.div>
  );
};
