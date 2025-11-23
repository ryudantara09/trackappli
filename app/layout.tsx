import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { WebVitals } from "@/components/WebVitals";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "trakappli | Job Tracker & AI Resume Builder for Organized Career Teams",
  description:
    "trakappli is the all-in-one job tracker, AI resume builder, and collaborative workspace trusted by schools, career coaches, and ambitious candidates to land offers faster.",
  keywords: [
    "job tracker",
    "AI resume builder",
    "career management platform",
    "collaborative job search",
    "job search CRM",
  ],
  authors: [{ name: "trakappli Team" }],
  creator: "trakappli",
  publisher: "trakappli",
  robots: "index, follow",
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "any" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    shortcut: "/favicon/favicon.ico",
    apple: "/favicon/apple-touch-icon.png",
    other: [
      {
        rel: "mask-icon",
        url: "/favicon/favicon.svg",
      },
    ],
  },
  manifest: "/favicon/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://trakappli.com",
    title: "trakappli | Job Tracker & AI Resume Builder",
    description:
      "Organize every opportunity, tailor resumes with AI, and collaborate with coaches in one secure job search operating system.",
    siteName: "trakappli",
    images: [
      {
        url: "/banner.png",
        width: 1200,
        height: 630,
        alt: "trakappli Platform Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "trakappli | Job Tracker & AI Resume Builder",
    description:
      "The modern job search OS for schools, cohorts, and ambitious individuals. Track applications, automate follow-ups, and win offers faster.",
    images: ["/banner.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#111827" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>
        <AuthProvider>
          <ThemeProvider>
            <ToastProvider>
              {children}
              <WebVitals />
            </ToastProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
