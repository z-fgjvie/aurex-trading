import type { Metadata } from "next";
import NotificationsView from "@/components/panel/NotificationsView";

export const metadata: Metadata = { title: "Notificaciones · Aurex", robots: { index: false } };
export default function Page() {
  return <NotificationsView />;
}
