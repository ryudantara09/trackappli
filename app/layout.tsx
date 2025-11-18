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
  title: "Trakaply - Job Application Tracker",
  description: "Track and manage your job applications efficiently with AI-powered insights",
  keywords: ["job tracker", "application tracker", "job search", "career management"],
  authors: [{ name: "Trakaply Team" }],
  creator: "Trakaply",
  publisher: "Trakaply",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://trakaply.com",
    title: "Trakaply - Job Application Tracker",
    description: "Track and manage your job applications efficiently with AI-powered insights",
    siteName: "Trakaply",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trakaply - Job Application Tracker",
    description: "Track and manage your job applications efficiently with AI-powered insights",
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
