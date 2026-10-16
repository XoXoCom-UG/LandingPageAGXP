import { Fact, Gap, LegalSection, LegalShell, Mail, MissingDataNotice } from "@/components/legal/legal";
import { COMPANY } from "@/lib/company";

/**
 * Pflichtangaben nach § 5 DDG / § 18 Abs. 2 MStV. Every fact comes from
 * lib/company.ts; the English page is a translation of the same facts.
 */
export function Impressum({ lang }: { lang: "de" | "en" }) {
  const de = lang === "de";
  const { postalCode, city, registerCourt, registerNumber, vatId, phone } = COMPANY;

  return (
    <LegalShell
      title={de ? "Impressum" : "Imprint"}
      lang={lang}
      alternate={de ? { href: "/imprint", label: "English" } : { href: "/impressum", label: "Deutsch" }}
    >
      <MissingDataNotice lang={lang} />
      {!de && (
        <p className="legal-note">
          Translation for convenience. The <a href="/impressum">German version</a> is the binding one.
        </p>
      )}

      <LegalSection heading={de ? "Angaben gemäß § 5 DDG" : "Information pursuant to § 5 DDG (German Digital Services Act)"}>
        <Fact field="name" lang={lang} />
        <Fact field="street" lang={lang} />
        <p>{postalCode || city ? `${postalCode} ${city}`.trim() : <Gap lang={lang} />}</p>
        <Fact field="country" lang={lang} />
      </LegalSection>

      <LegalSection heading={de ? "Vertreten durch" : "Represented by"}>
        <Fact field="representedBy" lang={lang} />
      </LegalSection>

      <LegalSection heading={de ? "Kontakt" : "Contact"}>
        {phone && <p>{de ? "Telefon" : "Phone"}: {phone}</p>}
        <p>
          E-Mail: <Mail address={COMPANY.email} lang={lang} />
        </p>
      </LegalSection>

      {/* Only with an entry: a sole trader has none, and an empty
          "Registernummer:" line would suggest one is missing. */}
      {(registerCourt || registerNumber) && (
        <LegalSection heading={de ? "Registereintrag" : "Commercial register"}>
          {registerCourt && <p>{de ? "Registergericht" : "Register court"}: {registerCourt}</p>}
          {registerNumber && <p>{de ? "Registernummer" : "Register number"}: {registerNumber}</p>}
        </LegalSection>
      )}

      {vatId && (
        <LegalSection heading={de ? "Umsatzsteuer-ID" : "VAT ID"}>
          <p>
            {de
              ? "Umsatzsteuer-Identifikationsnummer gemäß § 27 a UStG"
              : "VAT identification number pursuant to § 27 a UStG"}
            : {vatId}
          </p>
        </LegalSection>
      )}

      <LegalSection
        heading={de ? "Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV" : "Responsible for content pursuant to § 18 (2) MStV"}
      >
        <Fact field="contentResponsible" lang={lang} />
      </LegalSection>

      {/* The EU's ODR platform was shut down in July 2025, so there is no
          longer a link to it; the VSBG statement stays. */}
      <LegalSection heading={de ? "Verbraucherstreitbeilegung" : "Consumer dispute resolution"}>
        <p>
          {de
            ? "Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen."
            : "We are neither willing nor obliged to take part in dispute resolution proceedings before a consumer arbitration board."}
        </p>
      </LegalSection>

      <LegalSection heading={de ? "Haftung für Links" : "Liability for links"}>
        <p>
          {de
            ? "Diese Seite enthält nur Links auf eigene Angebote. Sollten künftig Links auf Websites Dritter hinzukommen, haben wir auf deren Inhalte keinen Einfluss; für sie ist der jeweilige Anbieter verantwortlich. Werden uns Rechtsverletzungen bekannt, entfernen wir solche Links umgehend."
            : "This page only links to our own services. Should links to third-party websites be added, we have no influence on their content; the respective provider is responsible for it. If we become aware of any infringement, we will remove such links immediately."}
        </p>
      </LegalSection>
    </LegalShell>
  );
}
