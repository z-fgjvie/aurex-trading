import type { Metadata } from "next";
import RealFlow from "@/components/real/RealFlow";

export const metadata: Metadata = { title: "Modo REAL · Aurex", robots: { index: false } };
export default function Page() {
  return <RealFlow />;
}
