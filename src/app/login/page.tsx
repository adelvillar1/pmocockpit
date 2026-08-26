import { IBM_Plex_Sans, Newsreader } from "next/font/google";

import { LoginForm } from "./login-form";

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-sans",
});

const serif = Newsreader({
  subsets: ["latin"],
  weight: "500",
  variable: "--font-serif",
});

export const metadata = {
  title: "Sign in — Stratum",
};

export default function LoginPage() {
  return (
    <div
      className={`${sans.variable} ${serif.variable}`}
      style={
        {
          "--bg": "#0b0e12",
          "--surface": "#14181f",
          "--raised": "#1b212a",
          "--fg": "#ecece8",
          "--muted": "#8b919a",
          "--primary": "#9aada8",
          "--border": "#2a313c",
        } as React.CSSProperties
      }
    >
      <style>{`
        html, body {
          margin: 0;
          padding: 0;
          background: var(--bg);
        }
      `}</style>
      <main
        style={{
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          padding: "1rem",
          background: "var(--bg)",
          color: "var(--fg)",
          fontFamily: "var(--font-sans), system-ui, sans-serif",
        }}
      >
        <div
          style={{
            width: "min(22rem, 100%)",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            padding: "2.5rem 2rem 2rem",
          }}
        >
          <p
            style={{
              margin: "0 0 1.75rem",
              textAlign: "center",
              fontFamily: "var(--font-serif), Georgia, serif",
              fontSize: "0.95rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--muted)",
            }}
          >
            Stratum
          </p>
          <LoginForm />
        </div>
      </main>
    </div>
  );
}
