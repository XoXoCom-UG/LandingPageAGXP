import { StageMount } from "@/components/three/stage-mount";
import { FpsMeter } from "@/components/ui/fps-meter";
import { Nav } from "@/components/ui/nav";
import { Footer } from "@/components/ui/footer";
import { Hero } from "@/components/sections/hero";
import { Pair } from "@/components/sections/pair";
import { Roster } from "@/components/sections/roster";
import { Interview } from "@/components/sections/interview";
import { Output } from "@/components/sections/output";
import { Memory } from "@/components/sections/memory";
import { Accents } from "@/components/sections/accents";
import { Beta } from "@/components/sections/beta";
import { Marquee } from "@/components/sections/marquee";
import { UseCases } from "@/components/sections/use-cases";

/**
 * The page is one continuous fall past seven objects. The WebGL stage is fixed
 * behind all of it; each section owns one scene and pulls it through the frame
 * as it scrolls.
 */
export default function Page() {
  return (
    <>
      <StageMount />
      <FpsMeter />
      <Nav />

      <main className="page" id="top">
        <Hero />
        <Pair />
        <Roster />
        <Memory />
        <Marquee />
        <Interview />
        <Output />
        <UseCases />
        <Accents />
        <Beta />
      </main>

      <Footer />
    </>
  );
}
