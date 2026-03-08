import type { Metadata } from "next";
import { Noto_Serif_KR, Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/ui/Navigation";
import Footer from "@/components/ui/Footer";
import TransitionLayout from "@/components/ui/TransitionLayout";

const notoSerifKr = Noto_Serif_KR({
  variable: "--font-noto-serif-kr",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kim Minju — Official Fan Site",
  description: "Enter the dream world of Kim Minju — actress, model, and former IZ*ONE member.",
  openGraph: {
    title: "Kim Minju — Official Fan Site",
    description: "Enter the dream world of Kim Minju",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kim Minju — Official Fan Site",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${notoSerifKr.variable} ${inter.variable}`}>
      <body className="antialiased bg-[#fdf7fa]">
        <Navigation />
        <TransitionLayout>
          {children}
        </TransitionLayout>
        <Footer />
      </body>
    </html>
  );
}
