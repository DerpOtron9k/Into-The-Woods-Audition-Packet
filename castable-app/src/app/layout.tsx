import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from '@vercel/analytics/react';
import { AnalyticsProvider } from '@/components/analytics-provider';
import { ThemeProvider } from '@/components/theme-provider';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Castable - Stop Wrestling with Paper Audition Packets",
  description: "Create professional, interactive audition pages in under 10 minutes. Attract better actors. Streamline your casting process. Trusted by 500+ theaters nationwide.",
  keywords: "audition management, theater casting, digital audition packets, theater director tools, casting software",
  openGraph: {
    title: "Castable - Professional Audition Management for Theaters",
    description: "Create professional, interactive audition pages in under 10 minutes. Attract better actors. Streamline your casting process.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AnalyticsProvider>
              {children}
            </AnalyticsProvider>
            <Analytics />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}