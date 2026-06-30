import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import ClientLayout from './client-layout';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: '欧阳文 — 高级 .NET 全栈工程师',
    template: '%s | Owen',
  },
  description:
    '9年C#/.NET全栈开发经验，专注企业级应用与AI智能化落地，熟练ASP.NET Core、ABP框架、微服务架构。',
  keywords: [
    '.NET',
    'C#',
    '全栈工程师',
    'ABP Framework',
    '微服务',
    'DDD',
    '上海',
    'Owen',
  ],
  authors: [{ name: 'Owen' }],
  creator: 'Owen',
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    siteName: '欧阳文 - 个人作品集',
    title: '欧阳文 — 高级 .NET 全栈工程师',
    description:
      '9年C#/.NET全栈开发经验，专注企业级应用与AI智能化落地。',
    url: 'https://owen.dev',
  },
  twitter: {
    card: 'summary_large_image',
    title: '欧阳文 — 高级 .NET 全栈工程师',
    description:
      '9年C#/.NET全栈开发经验，专注企业级应用与AI智能化落地。',
    creator: '@owen',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
