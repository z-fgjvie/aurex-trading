import type { Metadata } from "next";
import SimulatorView from "@/components/panel/SimulatorView";

export const metadata: Metadata = { title: "Simulador · Aurex", robots: { index: false } };
export default function Page() {
  return <SimulatorView />;
}
