import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Revara v2 - Real Estate Investment Platform",
  description: "Find distressed properties, connect with cash buyers, and close deals faster.",
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
