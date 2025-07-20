import TrashAI from "/public/projects/trash.jpeg";
import MuzicImg from "@/public/projects/muzic.jpeg";
import MediumImg from "@/public/projects/medium.jpeg"
import PaytmImg from "@/public/projects/paytm.jpeg";
import F1 from "@/public/projects/f1.jpeg";
import GYM from "@/public/projects/gym.jpeg";
import Resume from "@/public/projects/resume.jpeg";
import Todo from "@/public/projects/todo.jpeg";


export const projects = [
  {
    title: "TrashAI",
    description: "Never write from your code from scratch again. Kickstart your coding projects with TrashAI,your code AI assistant.",
    imageSrc: TrashAI,
    liveUrl: "https://trashai.vercel.app/",
    githubUrl: "https://github.com/fazal-bhinder/TrashAI",
  },
  {
    title: "Medium Clone",
    description: "Created a Medium-style blogging platform Implemented authentication, CRUD operations, and a clean editor interface.",
    imageSrc: MediumImg,
    liveUrl: "https://medium-frontend-beta.vercel.app/",
    githubUrl: "https://github.com/fazal-bhinder/medium?tab=readme-ov-file",
  },
  {
    title: "Muzic",
    description: "Developed a Spotify-like SaaS app allowing users to host and join live music streams. Features include collaborative song queues with upvote/downvote functionality, and a clean interface.",
    imageSrc: MuzicImg,
    liveUrl: "https://github.com/fazal-bhinder/muzic",
    githubUrl: "https://github.com/fazal-bhinder/muzic",
  },
  {
    title: "Old Portfolio",
    description: "This is my old portfolio website, showcasing my skills and projects as a full stack developer. It features a clean design, responsive layout, and highlights my work.",
    imageSrc: Resume,
    liveUrl: "https://portfolio-plum-mu-29.vercel.app",
    githubUrl: "https://github.com/fazal-bhinder/portfolio",
  }, 
  {
    title: "PayTm clone",
    description: "Built a full-stack Paytm-like payment app. Enabling users to transfer funds between bank and wallet, and send money to friends. Separate payment gateway routing, and real-time transaction of magic, and a lot of love.",
    imageSrc: PaytmImg,
    liveUrl: "https://github.com/fazal-bhinder/paytm?tab=readme-ov-file",
    githubUrl: "https://github.com/fazal-bhinder/paytm?tab=readme-ov-file",
  },
  {
    title: "Formla 1",
    description: "Inspired by the thrill and intensity of Formula 1. It features a dynamic fullscreen video background, iconic quotes from drivers, and a sleek, responsive design.",
    imageSrc: F1,
    liveUrl: "https://formula-01.netlify.app/",
    githubUrl: "https://github.com/fazal-bhinder/formula-1",
  },
  {
    title: "Todo App",
    description: "This is a simple todo app built with React and Next.js. It showcases my skills in building user interfaces and managing state.",
    imageSrc: Todo,
    liveUrl: "https://todo-frontend-flame-psi.vercel.app",
    githubUrl: "https://github.com/fazal-bhinder/todo_app",
  }, 
  {
    title: "GYM",
    description: "Built a responsive gym website with a modern design. It features a clean layout, smooth animations, and a user-friendly interface.",
    imageSrc: GYM,
    liveUrl: "https://github.com/fazal-bhinder/gym_app",
    githubUrl: "https://github.com/fazal-bhinder/gym_app",
  }, 
];
