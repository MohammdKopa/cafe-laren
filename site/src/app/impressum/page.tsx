import type { Metadata } from "next";
import { LegalShell } from "@/components/LegalShell";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum von Café Laren · Marl, NRW.",
  robots: { index: true, follow: true },
};

export default function ImpressumPage() {
  return (
    <LegalShell
      overline="Rechtliches"
      title="Impressum"
      lastUpdated="2026"
    >
      <h2>Angaben gemäß § 5 DDG</h2>
      <address>
        Café Laren
        <br />
        {/* TODO Owner: vollständige Anschrift einfügen (Straße, Hausnummer, PLZ, Ort). */}
        Marl
        <br />
        Nordrhein-Westfalen
        <br />
        Deutschland
      </address>

      <h3>Vertreten durch</h3>
      <p>{/* TODO Owner: Name des Inhabers */}Inhaber: [Name des Inhabers]</p>

      <h2>Kontakt</h2>
      <p>
        Telefon:{" "}
        <a href="tel:+4915258990000">+49 152 5899 0000</a>
        <br />
        E-Mail:{" "}
        <a href="mailto:info@cafe-laren.de">info@cafe-laren.de</a>
        <br />
        Instagram:{" "}
        <a
          href="https://www.instagram.com/cafelaren/"
          target="_blank"
          rel="noreferrer"
        >
          @cafelaren
        </a>
      </p>

      <h2>Umsatzsteuer-ID</h2>
      <p>
        {/* TODO Owner: USt-IdNr. nach § 27a UStG, falls vorhanden. */}
        Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz: [auf
        Anfrage]
      </p>

      <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
      <address>
        {/* TODO Owner: Name + Anschrift der inhaltlich verantwortlichen Person */}
        [Name des Inhabers]
        <br />
        Marl, Deutschland
      </address>

      <h2>EU-Streitschlichtung</h2>
      <p>
        Die Europäische Kommission stellt eine Plattform zur
        Online-Streitbeilegung (OS) bereit:{" "}
        <a
          href="https://ec.europa.eu/consumers/odr/"
          target="_blank"
          rel="noreferrer"
        >
          https://ec.europa.eu/consumers/odr/
        </a>
        . Unsere E-Mail-Adresse findest du oben im Impressum.
      </p>

      <h2>Verbraucherstreitbeilegung / Universalschlichtungsstelle</h2>
      <p>
        Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren
        vor einer Verbraucherschlichtungsstelle teilzunehmen.
      </p>

      <h2>Haftung für Inhalte</h2>
      <p>
        Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte
        auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§
        8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet,
        übermittelte oder gespeicherte fremde Informationen zu überwachen oder
        nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit
        hinweisen.
      </p>
      <p>
        Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
        Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.
        Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der
        Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden
        von entsprechenden Rechtsverletzungen werden wir diese Inhalte
        umgehend entfernen.
      </p>

      <h2>Haftung für Links</h2>
      <p>
        Unser Angebot enthält Links zu externen Websites Dritter, auf deren
        Inhalte wir keinen Einfluss haben. Deshalb können wir für diese
        fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
        verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der
        Seiten verantwortlich.
      </p>

      <h2>Urheberrecht</h2>
      <p>
        Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen
        Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung,
        Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
        Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des
        jeweiligen Autors bzw. Erstellers.
      </p>
    </LegalShell>
  );
}
