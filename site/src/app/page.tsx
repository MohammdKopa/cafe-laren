import { Aktionen } from "@/components/Aktionen";
import { BesuchKontakt } from "@/components/BesuchKontakt";
import { Eisbecher } from "@/components/Eisbecher";
import { Eissorten } from "@/components/Eissorten";
import { Fruehstueck } from "@/components/Fruehstueck";
import { Galerie } from "@/components/Galerie";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { MobileActions } from "@/components/MobileActions";
import { TwoWorlds } from "@/components/TwoWorlds";
import { VollstaendigeKarte } from "@/components/VollstaendigeKarte";

export default function HomePage() {
  return (
    <main className="bg-paper-100 text-espresso-700">
      <Header />
      <Hero />
      <Aktionen />
      <TwoWorlds />
      <Eisbecher />
      <Eissorten />
      <Fruehstueck />
      <VollstaendigeKarte />
      <Galerie />
      <BesuchKontakt />
      <MobileActions />
    </main>
  );
}
