import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RFMS API Assistant",
  description:
    "Get help integrating with the RFMS API 2. Describe what you're building and get endpoint guidance, example payloads, and working code.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full flex flex-col bg-[#0a0a0a] text-white">
        {children}
      </body>
    </html>
  );
}
