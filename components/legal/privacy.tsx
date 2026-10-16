import { Gap, LegalSection, LegalShell, Mail, MissingDataNotice } from "@/components/legal/legal";
import { COMPANY, postalAddress } from "@/lib/company";
import { BETA_EMAIL } from "@/lib/links";

/**
 * Datenschutzerklärung for the landing page only — the app has its own.
 *
 * Written against what this site actually does, not from a template:
 *  - Hosting: Vercel (see README). Request logs are the only processing that
 *    happens without the visitor doing anything.
 *  - No cookies. localStorage holds the theme and accent, and only once the
 *    visitor picks one (lib/theme.tsx).
 *  - Fonts are self-hosted by next/font at build time; the browser never
 *    contacts Google.
 *  - The 3D scene is generated in the browser; drei's <Environment> is fed
 *    local Lightformers, so no HDRI is fetched from a CDN.
 *  - The beta request is a mailto link (lib/links.ts): nothing is submitted
 *    from the page.
 *
 * If any of that changes — analytics, a form, an embedded video, a font from a
 * CDN — this page changes with it, and a consent banner may become necessary.
 */

const UPDATED = { de: "Oktober 2026", en: "October 2026" };

export function Privacy({ lang }: { lang: "de" | "en" }) {
  const de = lang === "de";
  const address = postalAddress();
  const privacyMail = <Mail address={COMPANY.privacyEmail} lang={lang} />;

  return (
    <LegalShell
      title={de ? "Datenschutzerklärung" : "Privacy policy"}
      lang={lang}
      alternate={de ? { href: "/privacy", label: "English" } : { href: "/datenschutz", label: "Deutsch" }}
    >
      <MissingDataNotice lang={lang} />
      {!de && (
        <p className="legal-note">
          Translation for convenience. The <a href="/datenschutz">German version</a> is the binding one.
        </p>
      )}

      <p className="legal-lede">
        {de
          ? "Diese Seite stellt AgentiX Projects vor. Sie setzt keine Cookies, enthält keine Analyse- oder Tracking-Werkzeuge und lädt keine Inhalte von Drittanbietern. Im Folgenden steht genau, welche Daten trotzdem anfallen."
          : "This page introduces AgentiX Projects. It sets no cookies, contains no analytics or tracking tools and loads no third-party content. Below is exactly which data is processed anyway."}
      </p>

      <LegalSection heading={de ? "1. Verantwortlicher" : "1. Controller"}>
        <p>
          {COMPANY.name || <Gap lang={lang} />}
          {address ? `, ${address}` : ""}
        </p>
        <p>
          E-Mail: {privacyMail}
        </p>
        <p>
          {de ? "Weitere Angaben im " : "Further details in the "}
          <a href={de ? "/impressum" : "/imprint"}>{de ? "Impressum" : "imprint"}</a>.
        </p>
      </LegalSection>

      <LegalSection heading={de ? "2. Hosting und Server-Logdateien" : "2. Hosting and server log files"}>
        <p>
          {de
            ? "Diese Website wird bei Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA, gehostet. Bei jedem Aufruf verarbeitet der Hoster technisch notwendige Verbindungsdaten: IP-Adresse, Datum und Uhrzeit, aufgerufene Adresse, Referrer-URL, Browsertyp und -version sowie Betriebssystem."
            : "This website is hosted by Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA. On every visit the host processes technically necessary connection data: IP address, date and time, the requested address, referrer URL, browser type and version, and operating system."}
        </p>
        <p>
          {de
            ? "Das dient ausschließlich der Auslieferung der Seite sowie ihrer Sicherheit und Stabilität (etwa der Abwehr von Angriffen). Wir werten diese Daten nicht aus und führen sie nicht mit anderen Daten zusammen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes Interesse liegt in einer sicheren, funktionierenden Website. Die Logdaten werden nur kurzzeitig gespeichert und danach automatisch gelöscht."
            : "This serves solely to deliver the page and to keep it secure and stable (for example, to fend off attacks). We do not analyse this data or combine it with other data. The legal basis is Art. 6(1)(f) GDPR; our legitimate interest is a secure, working website. Log data is kept only briefly and then deleted automatically."}
        </p>
        <p>
          {de
            ? "Mit Vercel besteht ein Vertrag zur Auftragsverarbeitung nach Art. 28 DSGVO. Eine Übermittlung in die USA ist dabei möglich; sie stützt sich auf den Angemessenheitsbeschluss zum EU-U.S. Data Privacy Framework, unter dem Vercel zertifiziert ist, und ergänzend auf die Standardvertragsklauseln der EU-Kommission."
            : "A data processing agreement under Art. 28 GDPR is in place with Vercel. Data may be transferred to the USA in the process; the transfer relies on the adequacy decision for the EU-U.S. Data Privacy Framework, under which Vercel is certified, and additionally on the EU Commission's Standard Contractual Clauses."}
        </p>
      </LegalSection>

      <LegalSection heading={de ? "3. Beta-Key per E-Mail anfragen" : "3. Requesting a beta key by email"}>
        <p>
          {de ? "Der Button „Request a beta key“ öffnet lediglich Ihr eigenes E-Mail-Programm mit einer vorbereiteten Nachricht an " : "The “Request a beta key” button only opens your own email app with a prepared message to "}
          <a href={`mailto:${BETA_EMAIL}`}>{BETA_EMAIL}</a>
          {de
            ? ". Über diese Seite selbst wird nichts übermittelt. Erst wenn Sie die E-Mail absenden, erhalten wir Ihre E-Mail-Adresse und alles, was Sie hineinschreiben."
            : ". Nothing is sent through this page itself. Only when you send the email do we receive your email address and whatever you write in it."}
        </p>
        <p>
          {de
            ? "Wir verwenden diese Angaben nur, um Ihre Anfrage zu bearbeiten und Ihnen gegebenenfalls einen Beta-Key zu schicken. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Maßnahmen auf Ihre Anfrage vor Vertragsschluss), im Übrigen Art. 6 Abs. 1 lit. f DSGVO (Beantwortung von Anfragen). Wir löschen die Nachricht, sobald die Anfrage erledigt ist und keine gesetzlichen Aufbewahrungspflichten entgegenstehen. Sie sind nicht verpflichtet, uns zu schreiben; ohne Anfrage können wir Ihnen allerdings keinen Key schicken."
            : "We use this only to handle your request and, where applicable, send you a beta key. The legal basis is Art. 6(1)(b) GDPR (steps taken at your request prior to a contract), otherwise Art. 6(1)(f) GDPR (answering enquiries). We delete the message once the request is settled, unless statutory retention duties apply. You are not obliged to write to us; without a request, however, we cannot send you a key."}
        </p>
      </LegalSection>

      <LegalSection heading={de ? "4. Cookies und lokale Speicherung" : "4. Cookies and local storage"}>
        <p>
          {de
            ? "Diese Seite setzt keine Cookies. Wählen Sie selbst ein helles oder dunkles Design oder eine Akzentfarbe, speichert Ihr Browser diese Wahl im lokalen Speicher (localStorage, Schlüssel „agxp-theme“ und „agxp-accent“), damit die Seite beim nächsten Besuch gleich aussieht. Diese Einträge verlassen Ihr Gerät nicht und werden nicht an uns übertragen."
            : "This page sets no cookies. If you choose a light or dark theme or an accent colour yourself, your browser keeps that choice in local storage (localStorage, keys “agxp-theme” and “agxp-accent”) so the page looks the same on your next visit. These entries never leave your device and are not sent to us."}
        </p>
        <p>
          {de
            ? "Die Speicherung ist unbedingt erforderlich, um die von Ihnen ausdrücklich gewünschte Einstellung bereitzustellen (§ 25 Abs. 2 Nr. 2 TDDDG); eine Einwilligung ist dafür nicht nötig, und deshalb zeigt die Seite auch kein Cookie-Banner. Sie können die Einträge jederzeit über die Einstellungen Ihres Browsers löschen."
            : "This storage is strictly necessary to provide the setting you explicitly asked for (§ 25(2) no. 2 TDDDG, the German implementation of the ePrivacy Directive); no consent is required for it, which is why the page shows no cookie banner. You can delete the entries at any time in your browser settings."}
        </p>
      </LegalSection>

      <LegalSection heading={de ? "5. Schriftarten und Inhalte Dritter" : "5. Fonts and third-party content"}>
        <p>
          {de
            ? "Die verwendeten Schriftarten liegen auf unserem eigenen Server; beim Aufruf wird keine Verbindung zu Google oder einem anderen Schriftenanbieter hergestellt. Die 3D-Grafik wird vollständig in Ihrem Browser erzeugt. Es werden keine Analyse-Dienste, Werbenetzwerke, Social-Media-Plugins, Karten oder Videos Dritter eingebunden."
            : "The fonts are served from our own server; no connection to Google or any other font provider is made. The 3D graphics are generated entirely in your browser. No analytics services, ad networks, social media plugins, maps or third-party videos are embedded."}
        </p>
      </LegalSection>

      <LegalSection heading={de ? "6. Verschlüsselung" : "6. Encryption"}>
        <p>
          {de
            ? "Die Seite wird ausschließlich über eine verschlüsselte Verbindung (HTTPS/TLS) ausgeliefert."
            : "The page is delivered over an encrypted connection (HTTPS/TLS) only."}
        </p>
      </LegalSection>

      <LegalSection heading={de ? "7. Ihre Rechte" : "7. Your rights"}>
        <p>
          {de
            ? "Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18) und Datenübertragbarkeit (Art. 20). Eine Anfrage genügt formlos an "
            : "You have the right of access (Art. 15 GDPR), rectification (Art. 16), erasure (Art. 17), restriction of processing (Art. 18) and data portability (Art. 20). An informal request to "}
          {privacyMail}
          {de ? "." : " is enough."}
        </p>
        <p className="legal-strong">
          {de
            ? "Widerspruchsrecht: Soweit wir Daten auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO verarbeiten, können Sie dieser Verarbeitung aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit widersprechen (Art. 21 DSGVO)."
            : "Right to object: where we process data on the basis of Art. 6(1)(f) GDPR, you may object to that processing at any time on grounds relating to your particular situation (Art. 21 GDPR)."}
        </p>
        <p>
          {de
            ? "Außerdem können Sie sich bei einer Datenschutz-Aufsichtsbehörde beschweren (Art. 77 DSGVO), insbesondere in dem Mitgliedstaat Ihres Aufenthalts, Ihres Arbeitsplatzes oder des mutmaßlichen Verstoßes."
            : "You may also lodge a complaint with a data protection supervisory authority (Art. 77 GDPR), in particular in the member state of your residence, your place of work or the place of the alleged infringement."}
        </p>
      </LegalSection>

      <LegalSection heading={de ? "8. Keine automatisierten Entscheidungen" : "8. No automated decisions"}>
        <p>
          {de
            ? "Auf dieser Seite findet keine automatisierte Entscheidungsfindung und kein Profiling statt."
            : "This page involves no automated decision-making and no profiling."}
        </p>
      </LegalSection>

      <LegalSection heading={de ? "9. Die AgentiX-Anwendung" : "9. The AgentiX application"}>
        <p>
          {de
            ? "Diese Erklärung gilt nur für diese Website. Für die AgentiX-Anwendung selbst, die Beta-Teilnehmer mit ihrem Key nutzen, gilt eine eigene Datenschutzerklärung, die dort vor der Registrierung abrufbar ist."
            : "This policy covers this website only. The AgentiX application itself, which beta participants use with their key, has its own privacy policy, available there before registration."}
        </p>
      </LegalSection>

      <p className="legal-updated">{de ? `Stand: ${UPDATED.de}` : `Last updated: ${UPDATED.en}`}</p>
    </LegalShell>
  );
}
