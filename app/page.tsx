import Nav from "./components/ui/nav";
import Hero from "./sections/hero";
import AboutMe from "./sections/aboutme";
import ProfessionalExperience from "./sections/experience";
import Skills from "./sections/skills";
import Projects from "./sections/projects";
import { Footer } from "./sections/footer";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <AboutMe />
      <ProfessionalExperience />
      <Skills />
      <Projects />
      <Footer />
    </main>
  );
}
