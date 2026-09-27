"use client";

import { AccentPicker } from "@/components/ui/nav";
import { Logo } from "@/components/brand/logo";

/**
 * Note for whoever ships this: the product is operated from Germany and the app
 * already carries Impressum, Datenschutz and AGB pages. Point the three links
 * below at them before this goes public — a public marketing page without an
 * Impressum is a problem in DE.
 */
const LEGAL = [
  { label: "Imprint", href: "/impressum" },
  { label: "Privacy", href: "/datenschutz" },
  { label: "Terms", href: "/agb" },
];

export function Footer() {
  return (
    <footer className="footer">
      <div className="shell">
        <hr className="hair" />

        <div className="footer-grid">
          <div className="footer-brand">
            <Logo size={32} />
            <p className="footer-line">
              Two agents, one project. Currently in closed beta.
            </p>
          </div>

          <div className="footer-cols">
            <nav aria-label="Sections">
              <span className="footer-head">Page</span>
              <a href="#duo">The pair</a>
              <a href="#interview">The interview</a>
              <a href="#document">The output</a>
              <a href="#beta">Beta access</a>
            </nav>

            <nav aria-label="Legal">
              <span className="footer-head">Legal</span>
              {LEGAL.map(l => (
                <a key={l.href} href={l.href}>
                  {l.label}
                </a>
              ))}
            </nav>

            <div>
              <span className="footer-head">Accent</span>
              <AccentPicker expanded />
            </div>
          </div>
        </div>

        <div className="footer-base">
          <span>© {new Date().getFullYear()} Agentix Projects</span>
          <span className="muted">AgxP</span>
        </div>
      </div>
    </footer>
  );
}
