import type { Metadata } from "next";
import { LegalShell } from "@/components/LegalShell";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description:
    "Datenschutzerklärung von Café Laren · Marl, NRW. Welche Daten wir verarbeiten und welche Drittanbieter wir einbinden.",
  robots: { index: true, follow: true },
};

export default function DatenschutzPage() {
  return (
    <LegalShell
      overline="Rechtliches"
      title="Datenschutz­erklärung"
      lastUpdated="2026"
    >
      <h2>Verantwortliche Stelle</h2>
      <address>
        Café Laren
        <br />
        Marl, Nordrhein-Westfalen, Deutschland
        <br />
        E-Mail: <a href="mailto:info@cafe-laren.de">info@cafe-laren.de</a>
        <br />
        Telefon: <a href="tel:+4915258990000">+49 152 5899 0000</a>
      </address>
      <p>
        Verantwortlich im Sinne der Datenschutz-Grundverordnung (DSGVO) sowie
        anderer nationaler Datenschutzgesetze der Mitgliedsstaaten und sonstiger
        datenschutzrechtlicher Bestimmungen ist die oben genannte Stelle.
      </p>

      <h2>Allgemeines</h2>
      <p>
        Wir freuen uns über deinen Besuch auf cafe-laren.de. Der Schutz deiner
        personenbezogenen Daten ist uns wichtig. Im Folgenden informieren wir
        dich darüber, welche Daten beim Besuch unserer Website erhoben und wie
        sie verarbeitet werden.
      </p>

      <h2>Server-Logfiles</h2>
      <p>
        Beim Aufruf unserer Website werden automatisch Informationen vom
        Browser deines Endgeräts an unseren Hosting-Anbieter übermittelt und
        in Server-Logfiles gespeichert. Erfasst werden:
      </p>
      <ul>
        <li>besuchte Seite</li>
        <li>Datum und Uhrzeit des Zugriffs</li>
        <li>übertragene Datenmenge</li>
        <li>Browser-Typ und -Version, Betriebssystem</li>
        <li>Referrer-URL</li>
        <li>anonymisierte IP-Adresse des Endgeräts</li>
      </ul>
      <p>
        Diese Daten werden zur Bereitstellung der Website, zur Sicherstellung
        der Funktionalität und zur IT-Sicherheit verarbeitet (Art. 6 Abs. 1
        lit. f DSGVO). Logs werden nach kurzer Zeit gelöscht.
      </p>

      <h2>Cookies und externe Inhalte</h2>
      <p>
        Wir verwenden auf unserer Website Cookies nur dort, wo es für den
        Betrieb erforderlich ist (zum Beispiel zur Speicherung deiner
        Cookie-Auswahl). Externe Inhalte wie die Google-Maps-Karte oder ein
        Instagram-Feed werden ausschließlich nach deiner ausdrücklichen
        Zustimmung geladen (Art. 6 Abs. 1 lit. a DSGVO).
      </p>
      <p>
        Du kannst deine Einwilligung jederzeit über den Link
        „Cookie-Einstellungen" im Footer der Website widerrufen.
      </p>

      <h2>Google Maps</h2>
      <p>
        Wir nutzen den Kartendienst Google Maps der Google Ireland Limited,
        Gordon House, Barrow Street, Dublin 4, Irland („Google"), um den
        Standort des Cafés visuell darzustellen. Die Einbindung erfolgt nur,
        wenn du dem Laden externer Inhalte zugestimmt hast.
      </p>
      <p>
        Bei Aktivierung der Karte werden Daten wie deine IP-Adresse, der
        Zeitpunkt des Aufrufs und ggf. weitere Browserinformationen an Google
        übertragen. Eine Übermittlung in Drittstaaten (insbesondere die USA)
        ist möglich. Google ist unter dem EU-US Data Privacy Framework
        zertifiziert. Mehr Informationen findest du in der{" "}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noreferrer"
        >
          Datenschutzerklärung von Google
        </a>
        .
      </p>

      <h2>Instagram</h2>
      <p>
        Wir verlinken auf unser öffentliches Instagram-Profil
        (@cafelaren) und planen, Inhalte aus diesem Profil künftig direkt
        einzubinden. Eine direkte Einbindung erfolgt nur nach deiner
        Zustimmung (Art. 6 Abs. 1 lit. a DSGVO). Anbieter ist die Meta
        Platforms Ireland Limited, 4 Grand Canal Square, Dublin 2, Irland.
        Beim Klick auf den Instagram-Link wirst du auf die Instagram-Website
        weitergeleitet, wo Meta Daten gemäß seiner eigenen Datenschutzrichtlinie
        verarbeitet. Mehr in der{" "}
        <a
          href="https://privacycenter.instagram.com/policy"
          target="_blank"
          rel="noreferrer"
        >
          Datenschutzrichtlinie von Instagram
        </a>
        .
      </p>

      <h2>Hosting</h2>
      <p>
        Unsere Website wird bei einem externen Dienstleister gehostet
        (Vercel Inc., USA). Personenbezogene Daten, die auf dieser Website
        erfasst werden, werden auf den Servern des Hosters gespeichert. Es
        besteht ein Auftragsverarbeitungsvertrag (Art. 28 DSGVO). Vercel ist
        unter dem EU-US Data Privacy Framework zertifiziert.
      </p>

      <h2>Kontaktaufnahme</h2>
      <p>
        Wenn du uns per E-Mail oder Telefon kontaktierst, werden deine Angaben
        zur Bearbeitung deiner Anfrage und für den Fall von Anschlussfragen
        gespeichert. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b oder lit. f DSGVO.
      </p>

      <h2>Deine Rechte</h2>
      <p>Du hast jederzeit das Recht auf:</p>
      <ul>
        <li>Auskunft über deine gespeicherten Daten (Art. 15 DSGVO)</li>
        <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
        <li>Löschung deiner Daten (Art. 17 DSGVO)</li>
        <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
        <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
        <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
        <li>Widerruf erteilter Einwilligungen (Art. 7 Abs. 3 DSGVO)</li>
      </ul>
      <p>
        Es besteht außerdem ein Beschwerderecht bei der zuständigen
        Aufsichtsbehörde (in NRW: Landesbeauftragte für Datenschutz und
        Informationsfreiheit Nordrhein-Westfalen, Kavalleriestraße 2–4, 40213
        Düsseldorf).
      </p>

      <h2>Änderungen dieser Datenschutzerklärung</h2>
      <p>
        Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie
        stets den aktuellen rechtlichen Anforderungen entspricht oder um
        Änderungen unserer Leistungen abzubilden. Für deinen erneuten Besuch
        gilt dann die neue Fassung.
      </p>
    </LegalShell>
  );
}
