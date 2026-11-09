import Nav from "./components/ui/nav";
import { Space } from "./components/ui/space";
import Hero from "./sections/hero";
import AboutMe from "./sections/aboutme";
import ProfessionalExperience from "./sections/experience";
import Projects from "./sections/projects";
import Skills from "./sections/skills";
import { Footer } from "./sections/footer";

/* A film in five acts. The starfield sits behind all of it; the HUD on top. */
export default function Home() {
  return (
    <>
      <a
        href="#origin"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[60] focus-visible:bg-star focus-visible:px-4 focus-visible:py-3 focus-visible:font-mono focus-visible:text-xs focus-visible:uppercase focus-visible:tracking-[0.2em] focus-visible:text-void"
      >
        Skip the title sequence
      </a>
      {/* first in the tab order, though it is drawn on top of everything */}
      <Nav />
      {/* clip, not hidden: nothing may widen the page, but sticky scenes must still pin */}
      <main className="overflow-x-clip">
        <Space />
        <Hero />
        <AboutMe />
        <ProfessionalExperience />
        <Projects />
        <Skills />
        <Footer />
      </main>
    </>
  );
}
