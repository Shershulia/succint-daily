import type { Metadata } from "next";
import { Geist } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const ivory = localFont({
  src: "../public/Ivory.ttf",
  variable: "--font-ivory",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Succinct Daily",
  description: "Succinct Daily",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
      </head>
      <body
          className={`${ivory.variable} ${geistSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
