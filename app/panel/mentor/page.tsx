import type { Metadata } from "next";
import MentorView from "@/components/panel/MentorView";

export const metadata: Metadata = { title: "Mentor · Aurex", robots: { index: false } };
export default function Page() {
  return <MentorView />;
}
