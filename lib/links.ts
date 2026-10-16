/**
 * Where the landing page sends people.
 *
 * During the closed beta there is no login here: the only door is asking for a
 * key, by email. That keeps the page free of forms, cookies and a backend — a
 * visitor's data only ever reaches us if they choose to write.
 */

/** Same promise the app's beta gate makes: write to us. */
export const BETA_EMAIL = "info@xoxocom.net";

/**
 * The prefilled email. It asks for as little as we need to decide on a key —
 * no name, phone or role fields — because whatever is asked for here has to be
 * justified in the privacy policy.
 */
export const BETA_REQUEST = `mailto:${BETA_EMAIL}?${new URLSearchParams({
  subject: "AgentiX beta key request",
  body: "Hi AgentiX team,\n\nI'd like a beta key.\n\nCompany:\nWhat I'd like to use AgentiX for:\n",
})
  .toString()
  // mailto wants %20, not "+", or some mail apps show the plus signs literally.
  .replace(/\+/g, "%20")}`;

/** This site's own legal pages — German is the binding version. */
export const LEGAL_LINKS = [
  { label: "Imprint", href: "/impressum" },
  { label: "Privacy", href: "/datenschutz" },
];
