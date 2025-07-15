"use client";

import { motion } from "framer-motion";
import { ThemeSwitch } from "../theme/themeswitch";
import { FlipWords } from "./ui/filpword";
import { MainImg } from "./ui/mainImg";

export default function Header() {
  const words = ["Software Engineer", "Full Stack Developer"];

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap flex-row mt-10 items-start">
        <motion.div
          whileHover={{ scale: 0.97 }}
          className="cursor-pointer hover:brightness-75 ml-4 md:ml-24 transition duration-300 md:w-auto"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <MainImg />
        </motion.div>

        <div className="flex flex-col items-start ml-4 mt-2 flex-1">
          <motion.div
            className="md:flex w-full items-center justify-between"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold">Fazal Singh</h1>
            <div className="flex items-center md:mr-24 space-x-4">
              <a
                href="https://drive.google.com/file/d/1nLlLWEVNrAkQVug81Qbbpxs_CSL34jfj/view"
                target="_blank"
                rel="noreferrer"
              >
                resume
              </a>
              <ThemeSwitch />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <FlipWords className="text-zinc-500 md:mt-1" words={words} />
          </motion.div>

          <motion.div
            className="flex flex-wrap gap-2 md:mt-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {/* GitHub */}
            <a href="https://github.com/fazal-bhinder" target="_blank" rel="noreferrer">
              <svg
                className="hover:border-gray-500 hover:border-1 bg-black rounded-sm hover:scale-105 transition duration-300"
                width="40"
                height="40"
                viewBox="-25.6 -25.6 307.20 307.20"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMinYMin meet"
                fill="black"
                stroke="black"
                strokeWidth="0.00256"
              >
                <g fill="#ffffff">
                  <path d="M127.505 0C57.095 0 0 57.085 0 127.505c0 56.336 36.534 104.13 87.196 120.99 6.372 1.18 8.712-2.766 8.712-6.134 0-3.04-.119-13.085-.173-23.739-35.473 7.713-42.958-15.044-42.958-15.044-5.8-14.738-14.157-18.656-14.157-18.656-11.568-7.914.872-7.752.872-7.752 12.804.9 19.546 13.14 19.546 13.14 11.372 19.493 29.828 13.857 37.104 10.6 1.144-8.242 4.449-13.866 8.095-17.05-28.32-3.225-58.092-14.158-58.092-63.014 0-13.92 4.981-25.295 13.138-34.224-1.324-3.212-5.688-16.18 1.235-33.743 0 0 10.707-3.427 35.073 13.07 10.17-2.826 21.078-4.242 31.914-4.29 10.836.048 21.752 1.464 31.942 4.29 24.337-16.497 35.029-13.07 35.029-13.07 6.94 17.563 2.574 30.531 1.25 33.743 8.175 8.929 13.122 20.303 13.122 34.224 0 48.972-29.828 59.756-58.22 62.912 4.573 3.957 8.648 11.717 8.648 23.612 0 17.06-.148 30.791-.148 34.991 0 3.393 2.295 7.369 8.759 6.117 50.634-16.879 87.122-64.656 87.122-120.973C255.009 57.085 197.922 0 127.505 0" />
                  <path d="M47.755 181.634c-.28.633-1.278.823-2.185.389-.925-.416-1.445-1.28-1.145-1.916.275-.652 1.273-.834 2.196-.396.927.415 1.455 1.287 1.134 1.923M54.027 187.23c-.608.564-1.797.302-2.604-.589-.834-.889-.99-2.077-.373-2.65.627-.563 1.78-.3 2.616.59.834.899.996 2.08.36 2.65M58.33 194.39c-.782.543-2.06.034-2.849-1.1-.781-1.133-.781-2.493.017-3.038.792-.545 2.05-.055 2.85 1.07.78 1.153.78 2.513-.019 3.069M65.606 202.683c-.699.77-2.187.564-3.277-.488-1.114-1.028-1.425-2.487-.724-3.258.707-.772 2.204-.555 3.302.488 1.107 1.026 1.445 2.496.7 3.258M75.01 205.483c-.307.998-1.741 1.452-3.185 1.028-1.442-.437-2.386-1.607-2.095-2.616.3-1.005 1.74-1.478 3.195-1.024 1.44.435 2.386 1.596 2.086 2.612M85.714 206.67c.036 1.052-1.189 1.924-2.705 1.943-1.525.033-2.758-.818-2.774-1.852 0-1.062 1.197-1.926 2.721-1.951 1.516-.03 2.758.815 2.758 1.86M96.228 206.267c.182 1.026-.872 2.08-2.377 2.36-1.48.27-2.85-.363-3.039-1.38-.184-1.052.89-2.105 2.367-2.378 1.508-.262 2.857.355 3.049 1.398" />
                </g>
              </svg>
            </a>

            {/* LinkedIn */}
            <a href="https://linkedin.com/in/fazal-bhinder" target="_blank" rel="noreferrer">
              <svg
                width="40"
                height="40"
                fill="#ffffff"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="hover:border-gray-500 hover:border-1 bg-black p-1 rounded-sm hover:scale-105 transition duration-300"
              >
                <path d="M116.504,500.219V170.654H6.975v329.564H116.504L116.504,500.219z M61.751,125.674
                c38.183,0,61.968-25.328,61.968-56.953c-0.722-32.328-23.785-56.941-61.252-56.941C24.994,11.781,0.5,36.394,0.5,68.722
                c0,31.625,23.772,56.953,60.53,56.953H61.751L61.751,125.674z M177.124,500.219c0,0,1.437-298.643,0-329.564H286.67v47.794
                h-0.727c14.404-22.49,40.354-55.533,99.44-55.533c72.085,0,126.116,47.103,126.116,148.333v188.971H401.971V323.912
                c0-44.301-15.848-74.531-55.497-74.531c-30.254,0-48.284,20.38-56.202,40.08c-2.897,7.012-3.602,16.861-3.602,26.711v184.047
                H177.124L177.124,500.219z"></path>
              </svg>
            </a>

            {/* Twitter / X */}
            <a href="https://x.com/damnfazal" target="_blank" rel="noreferrer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                fill="none"
                viewBox="0 0 512 512"
                className="hover:border-gray-500 hover:border-1 bg-black rounded-sm hover:scale-105 transition duration-300"
              >
                <rect width="512" height="512" fill="#000" rx="60"></rect>
                <path fill="#fff" d="M355.904 100H408.832L293.2 232.16L429.232 412H322.72L239.296 302.928L143.84 412H90.8805L214.56 270.64L84.0645 100H193.28L268.688 199.696L355.904 100ZM337.328 380.32H366.656L177.344 130.016H145.872L337.328 380.32Z" />
              </svg>
            </a>

            {/* Email */}
            <a href="mailto:bhinderfazal@gmail.com" target="_blank" rel="noreferrer">
              <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -2.5 20 20"
              width="40"
              height="40"
              className="hover:border-gray-500 hover:border-1 bg-black p-1 rounded-sm hover:scale-105 transition duration-300"
              fill="#ffffff"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0" />
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
              <g id="SVGRepo_iconCarrier">
                <title>email</title>
                <desc>Created with Sketch.</desc>
                <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                  <g id="Dribbble-Light-Preview" transform="translate(-300.000000, -922.000000)" fill="white">
                    <g id="icons" transform="translate(56.000000, 160.000000)">
                      <path
                        d="M262,764.291 L254,771.318 L246,764.281 L246,764 L262,764 L262,764.291 Z 
                          M246,775 L246,766.945 L254,773.98 L262,766.953 L262,775 L246,775 Z 
                          M244,777 L264,777 L264,762 L244,762 L244,777 Z"
                        id="email"
                      ></path>
                    </g>
                  </g>
                </g>
              </g>
            </svg>
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
