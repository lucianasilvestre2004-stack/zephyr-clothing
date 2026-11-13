import { SiteHeader } from "@/components/SiteHeader";
import { Hero } from "@/components/Hero";
import { GetTheFit } from "@/components/GetTheFit";
import { NewDrops } from "@/components/NewDrops";
import { Services } from "@/components/Services";
import { ZondaGame } from "@/components/ZondaGame";
import { Benefits } from "@/components/Benefits";
import { SiteFooter } from "@/components/SiteFooter";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="contenido">
        <Hero />
        <GetTheFit />
        <hr className="mx-auto max-w-[1400px] border-line" />
        <NewDrops />
        <ZondaGame />
        <hr className="mx-auto max-w-[1400px] border-line" />
        <Services />
        <Benefits />
      </main>
      <SiteFooter />
    </>
  );
}
