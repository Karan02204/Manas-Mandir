import type { Metadata } from "next";
import { Cinzel, EB_Garamond, Tiro_Devanagari_Sanskrit } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const basgira = localFont({
  src: "./fonts/BasgiraRegular.ttf",
  variable: "--font-basgira",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-cinzel",
  display: "swap",
});

const garamond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-garamond",
  display: "swap",
});

const devanagari = Tiro_Devanagari_Sanskrit({
  subsets: ["devanagari"],
  weight: "400",
  variable: "--font-devanagari",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shri Hanuman Mandir",
  description: "A divine journey through devotion — experience the eternal presence of Hanuman ji",
  openGraph: {
    title: "Shri Hanuman Mandir",
    description: "A divine journey through devotion",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#0A0603",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi" className={`${cinzel.variable} ${garamond.variable} ${devanagari.variable} ${basgira.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
