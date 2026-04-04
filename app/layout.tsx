import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Web3Providers } from "@/lib/wallet/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lore — stamp any ENS",
  description:
    "Stamp ENS identities and build a playful onchain social graph with Intuition.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Web3Providers>{children}</Web3Providers>
      </body>
    </html>
  );
}
