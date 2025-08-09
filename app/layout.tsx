import { NexusShell } from "@/components/ui/shell";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import type React from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title:
    "MySihat - AI-Powered Outbreak Detection | Ministry of Health Malaysia",
  description:
    "Professional health analytics dashboard for Malaysian health analysts to detect and respond to disease outbreaks",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var shouldBeDark = theme ? theme === 'dark' : systemPrefersDark;
                  
                  document.documentElement.classList.remove('dark', 'light');
                  document.documentElement.classList.add(shouldBeDark ? 'dark' : 'light');
                } catch (e) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
        <NexusShell>{children}</NexusShell>
      </body>
    </html>
  );
}
