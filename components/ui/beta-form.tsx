"use client";

import { useId, useState } from "react";
import { BETA_CONTACT, registerUrl } from "@/lib/links";

/**
 * "Register with Beta-Key". The key is checked by the app, not here: the
 * landing page has no session and no database, and the app's redeem function
 * already trims and upper-cases whatever it is given. So this only stops an
 * empty submit and hands the key over.
 *
 * Keys look like AGXP-7K2M4P, but hand-issued ones can be anything, so the
 * placeholder suggests the shape without the input enforcing it.
 */
export function BetaForm({ compact = false }: { compact?: boolean }) {
  const id = useId();
  const [key, setKey] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const code = key.trim().toUpperCase();
    if (code.length < 4) {
      setError("Enter the key from your invitation.");
      return;
    }
    window.location.href = registerUrl(code);
  }

  return (
    <form className={`beta-form${compact ? " is-compact" : ""}`} onSubmit={submit} noValidate>
      <label className="beta-form-label" htmlFor={id}>
        Register with Beta-Key
      </label>
      <div className="beta-form-row">
        <input
          id={id}
          className="beta-form-input"
          value={key}
          onChange={e => {
            setKey(e.target.value.toUpperCase());
            setError(null);
          }}
          placeholder="AGXP-XXXXXX"
          autoComplete="off"
          spellCheck={false}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
        />
        <button type="submit" className="btn btn-primary beta-form-btn">
          Register
        </button>
      </div>
      {error ? (
        <p className="beta-form-note is-error" id={`${id}-err`} role="alert">
          {error}
        </p>
      ) : (
        <p className="beta-form-note">
          No key yet? <a href={BETA_CONTACT}>Write to us</a> and we&rsquo;ll add you to the next round.
        </p>
      )}
    </form>
  );
}
