import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NIE 에코-챌린지 | 시민참여형 생태교란종 모니터링",
  description: "게임처럼 재미있게 생태교란종을 탐색하고 신고하여 생물다양성 보전에 기여하세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css"
        />
      </head>
      <body className={`${geistMono.variable} antialiased`}>
        <Header />
        <main className="min-h-screen pb-20 bg-gradient-to-b from-white to-emerald-50/30">
          <div className="max-w-lg mx-auto">
            {children}
          </div>
        </main>
        <MobileNav />
      </body>
    </html>
  );
}
