/**
 * Where the landing page hands people over to the product.
 *
 * The landing page has no auth of its own — sessions live on the app's origin,
 * so signing in, Google and redeeming a beta key all happen there. Set
 * NEXT_PUBLIC_APP_URL in Vercel to the app's deployed origin (no trailing
 * slash), e.g. https://app.agentixprojects.com.
 */
export const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "").replace(/\/+$/, "");

export const LOGIN_URL = `${APP_URL}/login`;

/**
 * The key travels as `?key=` so the app can pre-fill its beta gate. The app's
 * login page does not read it yet — see README, "Hand-over to the app".
 */
export function registerUrl(key: string): string {
  const params = new URLSearchParams({ mode: "signup", key });
  return `${LOGIN_URL}?${params.toString()}`;
}

/** The app's own legal pages — the landing page links to them rather than copying them. */
export const LEGAL_LINKS = [
  { label: "Imprint", href: `${APP_URL}/impressum` },
  { label: "Privacy", href: `${APP_URL}/datenschutz` },
  { label: "Terms", href: `${APP_URL}/agb` },
];

/** For people without a key. Same promise the app's beta gate makes: write to us. */
export const BETA_CONTACT = "mailto:beta@agentixprojects.com?subject=AgentiX%20beta%20key";
