import type { Metadata, Viewport } from "next";
import { Unbounded, Inter, IBM_Plex_Mono } from "next/font/google";
import "../styles/globals.css";
import { getSite } from "@/lib/content/content";

const display = Unbounded({
  subsets: ["latin", "cyrillic"],
  variable: "--font-display",
  weight: ["400", "600"],
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-body",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://taistattoos.com"),
  title: {
    default: "Tais Tattoos — Black & Grey, Japanese Style Artist",
    template: "%s | Tais Tattoos",
  },
  description:
    "Custom black & grey and japanese style work. Book a consultation.",
  keywords: ["tattoo artist", "black and grey tattoo", "fine line tattoo"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Tais Tattoos",
    title: "Tais Tattoos — Black & Grey, Japanese Style Artist",
    description:
      "Custom black & grey and japanese Style work. Book a consultation.",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Tais Tattoos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tais Tattoos",
    description: "Black & grey and fine-line tattoo work.",
    images: ["/og-default.jpg"],
  },
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/",
  },
  icons: { icon: getSite().favicon || '/favicon.svg' },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0b",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${display.variable} ${inter.variable} ${plexMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}