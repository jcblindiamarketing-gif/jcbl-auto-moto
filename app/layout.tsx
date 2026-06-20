import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Header from "@/components/Header";
import FooterCTA from "@/components/FooterCTA";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JCBL Auto Moto",
  description: "JCBL India Auto Moto",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col"
      >
        <Header />

        <main className="flex-1">
          {children}
        </main>

        <FooterCTA />

        <Footer />
        <div id="google_translate_element" style={{ display: "none" }} />

<Script id="google-translate-init" strategy="afterInteractive">
  {`
    function googleTranslateElementInit() {
      new google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          autoDisplay: false
        },
        'google_translate_element'
      );
    }
    window.googleTranslateElementInit = googleTranslateElementInit;
  `}
</Script>

<Script
  src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
  strategy="afterInteractive"
/>
      </body>
    </html>
  );
}