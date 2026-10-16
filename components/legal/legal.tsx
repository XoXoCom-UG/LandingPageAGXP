import { Logo } from "@/components/brand/logo";
import { COMPANY, missingCompanyFields, type Company } from "@/lib/company";

/**
 * Shared frame for Impressum and Datenschutz, and their English translations.
 * Plain document pages: no WebGL stage, no reveal animation, nothing that
 * could leave legal text invisible if a script fails.
 */
export function LegalShell({
  title,
  lang,
  alternate,
  children,
}: {
  title: string;
  lang: "de" | "en";
  /** The same page in the other language. */
  alternate: { href: string; label: string };
  children: React.ReactNode;
}) {
  const de = lang === "de";
  return (
    <div className="legal" lang={lang}>
      <header className="legal-head">
        <div className="legal-col legal-head-row">
          <a href="/" className="legal-brand" aria-label={de ? "AgentiX Projects, zur Startseite" : "AgentiX Projects, home"}>
            <Logo size={26} />
          </a>
          <a href={alternate.href} className="legal-lang" hrefLang={de ? "en" : "de"}>
            {alternate.label}
          </a>
        </div>
      </header>

      <main className="legal-col legal-body">
        <h1>{title}</h1>
        {children}
      </main>

      <footer className="legal-foot">
        <div className="legal-col legal-foot-row">
          <a href={de ? "/impressum" : "/imprint"}>{de ? "Impressum" : "Imprint"}</a>
          <a href={de ? "/datenschutz" : "/privacy"}>{de ? "Datenschutz" : "Privacy"}</a>
          <a href="/" className="legal-back">
            {de ? "← Zur Startseite" : "← Back to the page"}
          </a>
        </div>
      </footer>
    </div>
  );
}

export function LegalSection({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="legal-section">
      <h2>{heading}</h2>
      {children}
    </section>
  );
}

const FIELD_LABELS: Record<keyof Company, [de: string, en: string]> = {
  name: ["Firmenname", "company name"],
  street: ["Straße und Hausnummer", "street"],
  postalCode: ["PLZ", "postal code"],
  city: ["Ort", "city"],
  country: ["Land", "country"],
  representedBy: ["Vertretungsberechtigte Person", "authorised representative"],
  email: ["E-Mail-Adresse", "email"],
  phone: ["Telefon", "phone"],
  registerCourt: ["Registergericht", "register court"],
  registerNumber: ["Registernummer", "register number"],
  vatId: ["USt-IdNr.", "VAT ID"],
  contentResponsible: ["Verantwortlich nach § 18 Abs. 2 MStV", "responsible for content"],
  privacyEmail: ["Datenschutz-Kontakt", "privacy contact"],
};

/**
 * Shown whenever lib/company.ts is still blank — in production too, on
 * purpose. A page that admits it is incomplete gets fixed; a page of
 * placeholders that looks finished does not.
 */
export function MissingDataNotice({ lang }: { lang: "de" | "en" }) {
  const missing = missingCompanyFields();
  if (!missing.length) return null;
  const labels = missing.map(f => FIELD_LABELS[f][lang === "de" ? 0 : 1]).join(", ");
  return (
    <p className="legal-missing" role="status">
      {lang === "de"
        ? `Diese Seite ist noch nicht vollständig. Es fehlen: ${labels}.`
        : `This page is not complete yet. Missing: ${labels}.`}
    </p>
  );
}

/** One fact from lib/company.ts, or a visible gap while it is blank. */
export function Fact({ field, prefix, lang }: { field: keyof Company; prefix?: string; lang: "de" | "en" }) {
  const value = COMPANY[field].trim();
  return (
    <p>
      {prefix ? `${prefix}: ` : ""}
      {value || <Gap lang={lang} />}
    </p>
  );
}

export function Gap({ lang }: { lang: "de" | "en" }) {
  return <span className="legal-gap">{lang === "de" ? "— noch nicht eingetragen —" : "— not filled in yet —"}</span>;
}

/** An email address as a link, or a gap. */
export function Mail({ address, lang }: { address: string; lang: "de" | "en" }) {
  return address ? <a href={`mailto:${address}`}>{address}</a> : <Gap lang={lang} />;
}
