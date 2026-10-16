import { BETA_EMAIL, BETA_REQUEST } from "@/lib/links";

/**
 * "Request a beta key". There is no login during the closed beta, so the only
 * door is an email: the button opens the visitor's own mail app with a short
 * prefilled message. Nothing is submitted from this page and nothing is
 * stored — which is also why the page needs no consent banner.
 */
export function BetaForm({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`beta-form${compact ? " is-compact" : ""}`}>
      <span className="beta-form-label">Request a Beta-Key</span>
      <a href={BETA_REQUEST} className="btn btn-primary beta-form-btn">
        Request access
      </a>
      <p className="beta-form-note">
        Opens your email app, addressed to <a href={BETA_REQUEST}>{BETA_EMAIL}</a>. We use what you
        send only to answer you — see our <a href="/datenschutz">privacy policy</a>.
      </p>
    </div>
  );
}
