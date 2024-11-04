import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "lenis/dist/lenis.css";
import { Analytics } from "@vercel/analytics/react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Julien FEGER Workshop",
  description: "Portfolio of Julien FEGER 2024, all rights reserved",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-y-scroll overflow-x-hidden">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans h-[100vh] bg-neutral-950 antialiased relative`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
