import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "../../globals.css";
import { Analytics } from "@vercel/analytics/react";
import { PinataSDK } from "pinata";

const inter = Inter({ subsets: ["latin"] });

const commitMono = localFont({
  src: [
    {
      path: "../../CommitMono-400-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../CommitMono-700-Regular.otf",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-commitMono",
});

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.GATEWAY_DOMAIN,
});

// Generate metadata based on the slug parameter
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const slug = params.slug;

  // You can fetch snippet details here similar to page.tsx
  // This is a simplified version
  let snippetName = "Snippets.so";
  let description = "Clean and simple code sharing";

  try {
    // Try to get file info based on slug
    const fileInfo = await pinata.files.list().metadata({
      slug: slug
    });

    if (fileInfo.files.length > 0) {
      const file = fileInfo.files[0];
      snippetName = file.name || "Snippets.so";
      description = `${snippetName}`;
    }
  } catch (error) {
    console.log("Error fetching metadata:", error);
  }

  const frame = {
    version: "next",
    imageUrl: `https://snippets.so/api/preview/${slug}`,
    button: {
      title: "Open Snippet",
      action: {
        type: "launch_frame",
        name: "Snippets.so",
        url: `https://snippets.so/snip/${slug}`,
        splashImageUrl: `https://snippets.so/icon.png`,
        splashBackgroundColor: "#ffffff",
      },
    },
  };

  return {
    title: snippetName,
    description: description,
    icons: {
      apple: "/apple-touch-icon.png",
      shortcut: "/favicon.ico",
      icon: "/favicon-32z32.png",
    },
    openGraph: {
      title: snippetName,
      description: description,
      url: `https://snippets.so/snip/${slug}`,
      siteName: "Snippets.so",
      images: [`https://www.snippets.so/api/preview/${slug}`],
    },
    twitter: {
      card: "summary_large_image",
      title: snippetName,
      description: description,
      images: [`https://www.snippets.so/api/preview/${slug}`],
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

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
