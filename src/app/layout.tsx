import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SocialFlow — 社媒内容与视觉智能检测",
  description: "检测文案合规 · 分析配图设计 · 预测互动潜力 · 一键智能改写 — 支持小红书、Twitter、Facebook、Instagram、YouTube",
  keywords: "小红书违规词检测,社媒内容检测,Twitter content checker,Instagram caption analyzer,YouTube thumbnail analyzer,social media compliance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
