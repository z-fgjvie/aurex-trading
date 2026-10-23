import type { Metadata } from "next";
import NewsView from "@/components/panel/NewsView";

export const metadata: Metadata = { title: "Novedades · Aurex", robots: { index: false } };
export default function Page() {
  return <NewsView />;
}
