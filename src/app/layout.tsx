import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Founders Hook — The Exclusive Network for Startup Founders",
  description:
    "Founders Hook is where student and early-stage startup founders publish their ideas, build teams, and connect with talent looking for internships and real startup experience.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="bg-ink-950 text-mist-100 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
