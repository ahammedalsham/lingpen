import type { Metadata } from "next";
import { 
  Inter, 
  Noto_Sans, 
  Noto_Sans_Malayalam, 
  Noto_Sans_Tamil, 
  Noto_Sans_Bengali 
} from "next/font/google";
import "./globals.css";

// Inter for standard UI elements and headings
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

// Base Noto Sans (supports Latin and Devanagari natively)
const notoSans = Noto_Sans({ 
  subsets: ["latin", "devanagari"], // Removed invalid subsets
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans",
});

// Dedicated Noto Sans for specific Indian languages
const notoSansMalayalam = Noto_Sans_Malayalam({ 
  subsets: ["malayalam"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-malayalam",
});

const notoSansTamil = Noto_Sans_Tamil({ 
  subsets: ["tamil"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-tamil",
});

const notoSansBengali = Noto_Sans_Bengali({ 
  subsets: ["bengali"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-bengali",
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
      <body className={`
        ${inter.variable} 
        ${notoSans.variable} 
        ${notoSansMalayalam.variable} 
        ${notoSansTamil.variable} 
        ${notoSansBengali.variable} 
        font-sans antialiased
      `}>
        {children}
      </body>
    </html>
  );
}