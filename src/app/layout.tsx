import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stratum — O&G Program Toolkit",
  description: "PMO Cockpit — program management toolkit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
