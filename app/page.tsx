import { SiteHeader } from "@/components/SiteHeader";
import { Hero } from "@/components/Hero";
import { GetTheFit } from "@/components/GetTheFit";
import { NewDrops } from "@/components/NewDrops";
import { Identity } from "@/components/Identity";
import { Closing } from "@/components/Closing";
import { SiteFooter } from "@/components/SiteFooter";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="contenido">
        <Hero />
        <GetTheFit />
        <NewDrops />
        <Identity />
        <Closing />
      </main>
      <SiteFooter />
    </>
  );
}
