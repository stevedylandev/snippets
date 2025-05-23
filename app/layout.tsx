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

const frame = {
  version: "next",
  imageUrl: `https://snippets.so/og.png`,
  button: {
    title: "Share Snippet",
    action: {
      type: "launch_frame",
      name: "Snippets.so",
      url: `https://snippets.so`,
      splashImageUrl: `https://snippets.so/icon.png`,
      splashBackgroundColor: "#ffffff",
    },
  },
};

export const metadata: Metadata = {
  title: "Snippets.so",
  description: "Clean and simple code sharing",
  icons: {
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
    icon: "/favicon-32z32.png",
  },
  openGraph: {
    title: "Snippets.so",
    description: "Clean and simple code sharing",
    url: "https://snippets.so",
    siteName: "Snippets.so",
    images: ["https://www.snippets.so/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Snippets.so",
    description: "Clean and simple code sharing",
    images: ["https://www.snippets.so/og.png"],
  },
  other: {
    "fc:frame": JSON.stringify(frame),
  },
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
