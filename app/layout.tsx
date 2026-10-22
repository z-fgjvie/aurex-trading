import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/figtree";
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

// Aplica el tema guardado antes de pintar para que no parpadee. Por defecto: oscuro.
const themeScript = `(function(){try{var t=localStorage.getItem('aurex-theme');document.documentElement.classList.toggle('dark',t!=='light');}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen font-body">{children}</body>
    </html>
  );
}
