"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "0.6rem 0.75rem",
  fontSize: "0.9rem",
  fontFamily: "inherit",
  color: "var(--fg)",
  background: "var(--raised)",
  border: "1px solid var(--border)",
  borderRadius: "6px",
  outline: "none",
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.6rem 0.75rem",
  fontSize: "0.9rem",
  fontWeight: 500,
  fontFamily: "inherit",
  color: "var(--bg)",
  background: "var(--primary)",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

export function LoginForm() {
  const router = useRouter();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      if (res.status === 204) {
        router.push("/");
        router.refresh();
        return;
      }
      if (res.status === 401) {
        setError("Incorrect passcode");
      } else if (res.status === 429) {
        setError("Too many attempts. Try again later.");
      } else {
        setError("Something went wrong. Try again.");
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <label
        htmlFor="passcode"
        style={{
          display: "block",
          marginBottom: "0.4rem",
          fontSize: "0.8rem",
          color: "var(--muted)",
        }}
      >
        Passcode
      </label>
      <input
        id="passcode"
        name="passcode"
        type="password"
        autoComplete="current-password"
        autoFocus
        required
        value={passcode}
        onChange={(e) => setPasscode(e.target.value)}
        style={inputStyle}
      />
      <button type="submit" disabled={busy} style={buttonStyle}>
        {busy ? "Checking…" : "Sign in"}
      </button>
      <p
        role="alert"
        style={{
          margin: "0.75rem 0 0",
          minHeight: "1.2em",
          fontSize: "0.8rem",
          color: error ? "#c76e62" : "transparent",
        }}
      >
        {error ?? " "}
      </p>
    </form>
  );
}
