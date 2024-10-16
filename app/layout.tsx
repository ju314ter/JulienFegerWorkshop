import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
    <html
      lang="en"
      className="overflow-y-scroll snap-y snap-proximity scroll-smooth overflow-x-hidden"
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} h-[100vh] bg-violet-700 antialiased relative`}
      >
        <div className="fixed w-20 h-20 top-[2vw] left-[2vw] bg-black z-50 flex justify-center items-center">
          <span className="text-white text-3xl">JF</span>
        </div>
        <div className="noise pointer-events-none"></div>
        {children}
      </body>
    </html>
  );
}
