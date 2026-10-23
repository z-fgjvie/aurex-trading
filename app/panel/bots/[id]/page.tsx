import type { Metadata } from "next";
import BotDetailView from "@/components/panel/BotDetailView";

export const metadata: Metadata = { title: "Bot · Aurex", robots: { index: false } };
export default function Page({ params }: { params: { id: string } }) {
  return <BotDetailView id={params.id} />;
}
