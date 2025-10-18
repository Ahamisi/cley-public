import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Toaster } from 'sonner';
import { Header } from '@/components/layout/Header';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata = {
  title: {
    default: "Cleyverse - Create without walls",
    template: "%s | Cleyverse"
  },
  description: "Complete creator economy platform for 10M+ creators globally. Discover products, events, and connect with talented creators worldwide.",
  keywords: ["creator economy", "digital products", "events", "creators", "marketplace", "platform"],
  authors: [{ name: "Cleyverse Team" }],
  creator: "Cleyverse",
  publisher: "Cleyverse",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://cley.me'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://cley.me',
    siteName: 'Cleyverse',
    title: 'Cleyverse - Create without walls',
    description: 'Complete creator economy platform for 10M+ creators globally. Discover products, events, and connect with talented creators worldwide.',
    images: [
      {
        url: '/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Cleyverse - Create without walls',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cleyverse - Create without walls',
    description: 'Complete creator economy platform for 10M+ creators globally. Discover products, events, and connect with talented creators worldwide.',
    images: ['/og-default.jpg'],
    creator: '@cleyverse',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0662BB" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
          <body className="font-body antialiased">
            <Header />
            {children}
            <Toaster position="top-right" richColors />
            <Analytics />
            <SpeedInsights />
          </body>
    </html>
  );
}

