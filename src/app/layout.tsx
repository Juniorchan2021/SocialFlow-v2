import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "SocialFlow — 社媒内容与视觉智能检测",
  description: "检测文案合规 · 分析配图设计 · 预测互动潜力 · 一键智能改写 — 支持小红书、Twitter、Facebook、Instagram、YouTube",
  keywords: "小红书违规词检测,社媒内容检测,Twitter content checker,Instagram caption analyzer,YouTube thumbnail analyzer,social media compliance",
  metadataBase: new URL('https://socialflow-v2.onrender.com'),
  openGraph: {
    title: 'SocialFlow — 社媒内容与视觉智能检测',
    description: '5平台内容检测 · 8维度评分 · AI配图分析 · 一键改写',
    type: 'website',
    siteName: 'SocialFlow',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SocialFlow — Social Media Content Analyzer',
    description: 'Check compliance, predict engagement, optimize for algorithms — across 5 platforms',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        <div className="ambient-bg" />
        <Navigation />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
