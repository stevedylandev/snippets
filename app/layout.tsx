import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

const commitMono = localFont({
  src: [
    {
      path: "./CommitMono-400-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./CommitMono-700-Regular.otf",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-commitMono",
});

export const metadata: Metadata = {
  title: "Snippets.so",
  description: "Minimal code snippets",
  icons: {
    apple: "/favicon.ico",
    shortcut: "/favicon.ico",
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Snippets.so",
    description: "Minimal code snippets",
    url: "https://snippets.so",
    siteName: "Flowcast",
    images: [`https://www.snippets.so/og.png`],
  },
  twitter: {
    card: "summary_large_image",
    title: "Snippets.so",
    description: "Minimal code snippets",
    images: [`https://www.snippets.so/og.png`],
  },
  // other: {
  //   "fc:frame": "vNext",
  //   "fc:frame:image": "https://www.flowcast.me/og.png",
  //   "fc:frame:button:1": "Start Writing",
  //   "fc:frame:button:1:action": "link",
  //   "fc:frame:button:1:target": "https://www.flowcast.me",
  //   "fc:frame:button:2": "What is Flowcast?",
  //   "fc:frame:button:2:action": "post",
  //   "fc:frame:button:2:target": "https://www.flowcast.me/slides",
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className={`${inter.className} ${commitMono.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
