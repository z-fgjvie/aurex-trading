import type { Metadata } from "next";
import ToolsView from "@/components/panel/ToolsView";

export const metadata: Metadata = { title: "Herramientas · Aurex", robots: { index: false } };
export default function Page() {
  return <ToolsView />;
}
