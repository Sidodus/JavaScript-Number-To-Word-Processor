import type { Metadata, Viewport } from "next";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";

export const metadata: Metadata = {
  applicationName: "JS Number To Word Processor",
  title: "JSnumberToWordProcessor",
  description:
    "The goal of JSnumberToWordProcessor is a well formatted human readable number, with its corresponding words. Process standard dictionary numbers up to 10^33003.",
  robots: "index,follow",
  openGraph: {
    siteName: "sidodus",
    title: "JSnumberToWordProcessor",
    description:
      "The goal of JSnumberToWordProcessor is a well formatted human readable number, with its corresponding words.",
    url: "https://github.com/Sidodus/JavaScript-Number-To-Word-Processor",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#4285f4",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
