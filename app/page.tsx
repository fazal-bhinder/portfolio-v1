import AboutMe from "./sections/aboutme";
import Hero from "./sections/hero";
import Projects from "./sections/projects";
import Skills from "./sections/skills";
import { BackgroundBeamsTracingBeam } from "./components/ui/tracing-beam";
import ProfessionalExperience from "./sections/experience";

export default function Home() {
  return (

    <BackgroundBeamsTracingBeam className=" min-h-screen">
      <div className="">
        <Hero />
        <AboutMe />
        <Skills/>
        <ProfessionalExperience/>
        <Projects/>
      </div>
    </BackgroundBeamsTracingBeam>

  );
}
