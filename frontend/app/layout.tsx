import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Fonts are self-hosted (latin subset, variable weight) so builds don't
// download from Google Fonts, which made CI builds fail intermittently.
const roboto = localFont({
  src: "./fonts/Roboto-Variable.woff2",
  variable: "--font-roboto",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMono-Variable.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "cei",
  description: "The cei website is the unofficial & duplicated website (for development purposes) of South Africa’s Electoral Commission. It provides information and services related to elections.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${roboto.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}