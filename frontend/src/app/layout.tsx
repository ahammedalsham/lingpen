import type { Metadata } from "next";
import { Inter, Noto_Sans } from "next/font/google";
import "./globals.css";

// Inter for standard UI elements and headings
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

// Noto Sans for linguistic tokens and Indian scripts
const notoSans = Noto_Sans({ 
  subsets: ["latin", "devanagari", "malayalam", "tamil", "bengali"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans",
});

export const metadata: Metadata = {
  title: "LingPen | Linguistic Research Ecosystem",
  description: "A Collaborative Linguistic Research & Annotation Ecosystem for Indian Languages",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${notoSans.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}