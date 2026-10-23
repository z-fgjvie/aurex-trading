import type { Metadata } from "next";
import LearnView from "@/components/panel/LearnView";

export const metadata: Metadata = { title: "Aprender · Aurex", robots: { index: false } };
export default function Page() {
  return <LearnView />;
}
