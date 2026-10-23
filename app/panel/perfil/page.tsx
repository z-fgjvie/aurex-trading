import type { Metadata } from "next";
import ProfileView from "@/components/panel/ProfileView";

export const metadata: Metadata = { title: "Perfil · Aurex", robots: { index: false } };
export default function Page() {
  return <ProfileView />;
}
