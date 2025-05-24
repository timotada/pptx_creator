import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PPTX Templater - One-click PowerPoint Personalization",
  description: "Upload your PowerPoint template, fill in your details, and download a customized deck in seconds. Perfect for investor presentations, sales decks, and company pitches.",
  keywords: ["PowerPoint", "PPTX", "template", "customization", "presentation", "automation"],
  authors: [{ name: "PPTX Templater Team" }],
  openGraph: {
    title: "PPTX Templater - One-click PowerPoint Personalization",
    description: "Upload your PowerPoint template, fill in your details, and download a customized deck in seconds.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geist.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
