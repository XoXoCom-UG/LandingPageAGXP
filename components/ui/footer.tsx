"use client";

import { AccentPicker } from "@/components/ui/nav";
import { Logo } from "@/components/brand/logo";
import { LEGAL_LINKS, LOGIN_URL } from "@/lib/links";

/**
 * The legal links point at the app's own Impressum, Datenschutz and AGB rather
 * than copies — one set of legal text, kept in one place. They resolve once
 * NEXT_PUBLIC_APP_URL is set.
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
              <a href={LOGIN_URL}>Log in</a>
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
