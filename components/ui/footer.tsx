"use client";

import { AccentPicker } from "@/components/ui/nav";
import { Logo } from "@/components/brand/logo";
import { BETA_REQUEST, LEGAL_LINKS } from "@/lib/links";

/**
 * Impressum and Datenschutz live on this site, not only in the app: § 5 DDG
 * wants them reachable from every page of the site that is actually public,
 * and the app is not public during the closed beta.
 */

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
              <a href="#roster">Profiles</a>
              <a href="#interview">The interview</a>
              <a href="#beta">Beta access</a>
              <a href={BETA_REQUEST}>Request a beta key</a>
            </nav>

            <nav aria-label="Legal">
              <span className="footer-head">Legal</span>
              {LEGAL_LINKS.map(l => (
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
          <span>© {new Date().getFullYear()} AgentiX Projects</span>
          <span className="muted">AgxP</span>
        </div>
      </div>
    </footer>
  );
}
