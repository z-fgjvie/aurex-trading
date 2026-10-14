import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "./globals.css";
import { brand } from "@/lib/config";

export const metadata: Metadata = {
  title: `${brand.name} – ${brand.tagline}`,
  description: brand.description,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-ink font-sans text-white">{children}</body>
    </html>
  );
}
