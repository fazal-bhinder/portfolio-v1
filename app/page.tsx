import AboutMe from "./components/aboutme";
import Header from "./components/header";
import Projects from "./components/projects";
import Skills from "./components/skills";
import { BackgroundBeamsTracingBeam } from "./components/ui/tracing-beam";

export default function Home() {
  return (

    <BackgroundBeamsTracingBeam className="">
      <div className="flex flex-col min-h-scree">
        <Header />
        <AboutMe />
        <Skills/>
        <Projects/>
      </div>
    </BackgroundBeamsTracingBeam>

  );
}
