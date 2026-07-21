import type { Metadata } from "next";
import { Big_Shoulders, Barlow, DM_Serif_Display } from "next/font/google";
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
  title: "Top10QB — The World Renowned List",
  description:
    "Your favorite rapper's favorite top 10 list. The weekly NFL quarterback rankings, straight from the Rankmaster's desk.",
  openGraph: {
    title: "Top10QB — The World Renowned List",
    description: "The weekly NFL quarterback rankings, straight from the Rankmaster's desk.",
    url: "https://top10qb.com",
    siteName: "Top10QB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@top10qb",
    title: "Top10QB — The World Renowned List",
    description: "The weekly NFL quarterback rankings, straight from the Rankmaster's desk.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${bigShoulders.variable} ${barlow.variable} ${dmSerif.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
