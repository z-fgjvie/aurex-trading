import type { Metadata } from "next";
import HomeView from "@/components/panel/HomeView";
import { brand } from "@/lib/config";

export const metadata: Metadata = { title: `Mi panel · ${brand.name}`, robots: { index: false } };

export default function PanelPage() {
  return <HomeView />;
}
