import type { Metadata } from "next";
import BotsView from "@/components/panel/BotsView";

export const metadata: Metadata = { title: "Bots · Aurex", robots: { index: false } };
export default function Page() {
  return <BotsView />;
}
