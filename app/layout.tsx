import type { Metadata } from "next";
import { opensans, bebas } from "@/config/fonts";
import { Toaster } from "sonner";
import LocomotiveScrollWrapper from "@/components/LocomotiveScrollWrapper";
import NavbarWrapper from "@/components/NavbarWrapper";
import FooterWrapper from "@/components/FooterWrapper";
import { ThemeProvider } from "@/app/providers";
import PageTransition from "@/components/page-transition";
import { PartnerFAB } from "@/components/PartnerFAB";
import "./globals.css";

const BASE_URL = "https://thenonstop.org";
const OG_IMAGE = `${BASE_URL}/non-stop-logo.webp`;

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "The Non-Stop Series™ — 25th Anniversary Silver Jubilee Edition",
    template: "%s | The Non-Stop Series™",
  },
  description:
    "Celebrating 25 years of faith, The Non-Stop Series™ is Africa's premier 144-hour non-stop praise and worship experience — 6 days and 6 nights of continuous, unbroken worship, intercession, and the Word. Organised by the Logos-Rhema Foundation in Accra, Ghana, and streamed live to the world.",
  keywords: [
    "non-stop praise and worship",
    "continuous praise and worship",
    "24 hours praise and worship",
    "24/7 worship",
    "144 hours praise and worship",
    "144 hour worship",
    "nonstop worship",
    "non stop worship Ghana",
    "continuous worship Africa",
    "praise and worship event",
    "live worship stream",
    "prayer and worship",
    "Logos-Rhema Foundation",
    "The Non-Stop Series",
    "thenonstop.org",
    "worship revival Ghana",
    "unbroken worship",
    "worship marathon",
    "worship intercession",
    "Tabernacle of David",
    "recovery revival restoration",
  ],
  authors: [{ name: "The Non-Stop Series", url: BASE_URL }],
  creator: "Logos-Rhema Foundation",
  publisher: "Logos-Rhema Foundation",
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "The Non-Stop Series™",
    title: "The Non-Stop Series™ — 144 Hours of Continuous Praise & Worship",
    description:
      "6 days. 6 nights. Non-stop praise, worship, intercession, and the Word. Join thousands across Africa and the world in the most powerful continuous worship experience.",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "The Non-Stop Series — 144 Hours of Continuous Praise & Worship",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Non-Stop Series™ — 144 Hours of Continuous Praise & Worship",
    description:
      "6 days. 6 nights. Non-stop praise, worship, intercession, and the Word. Join thousands across Africa and the world.",
    images: [OG_IMAGE],
    creator: "@thenonstop",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/images/favicon_io/favicon.ico",
    apple: "/images/favicon_io/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      className={`${opensans.variable} ${bebas.variable}`}
      data-scroll-behavior='smooth'
      scrollbar-width='thin'
      scrollbar-color='#000 #fff'
      suppressHydrationWarning
    >
      <body
        className={`${opensans.variable} ${bebas.variable} text-base antialiased`}
      >
        <ThemeProvider>
          <NavbarWrapper />
          <LocomotiveScrollWrapper>
            <PageTransition>
              {children}
              <PartnerFAB />
            </PageTransition>
            <FooterWrapper />
          </LocomotiveScrollWrapper>
          <Toaster
            richColors
            position='bottom-right'
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
