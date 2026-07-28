import type { Metadata } from "next";
import { Big_Shoulders, Barlow, DM_Serif_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

// Google merged "Big Shoulders Display" into the "Big Shoulders" family — same
// condensed athletic type. next/font only knows the new name.
const bigShoulders = Big_Shoulders({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-big-shoulders",
  display: "swap",
});

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-barlow",
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-dm-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://top10qb.com"),
  title: {
    default: "Top10QB — The World Renowned List",
    template: "%s — Top10QB",
  },
  description:
    "One guy's weekly NFL quarterback rankings. No credentials. Plenty of opinions.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Top10QB — The World Renowned List",
    description: "One guy's weekly NFL quarterback rankings. No credentials. Plenty of opinions.",
    url: "https://top10qb.com",
    siteName: "Top10QB",
    type: "website",
    images: [
      {
        url: "/graphics/list?format=landscape",
        width: 1600,
        height: 900,
        alt: "The latest Top10QB ranking",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@top10qb",
    title: "Top10QB — The World Renowned List",
    description: "One guy's weekly NFL quarterback rankings. No credentials. Plenty of opinions.",
    images: ["/graphics/list?format=landscape"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${bigShoulders.variable} ${barlow.variable} ${dmSerif.variable}`}
    >
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
