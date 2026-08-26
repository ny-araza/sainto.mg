import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ui.abdulrahmanasif.dev"),
  title: "Xero — Encrypt every row. Audit every move.",
  description:
    "Fully managed data encrypting service and annotation platform for teams of all industries.",
};

export default function XeroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} flex flex-col items-center px-3.5 antialiased`}
        style={{ background: "var(--bg)", color: "var(--text)" }}
      >
        {children}
      </body>
    </html>
  );
}
