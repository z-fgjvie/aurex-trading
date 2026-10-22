import type { Metadata } from "next";
import RegisterView from "@/components/auth/RegisterView";
import { adminConfigured } from "@/lib/auth";
import { brand } from "@/lib/config";
import { getPurchase } from "@/lib/purchase";

export const metadata: Metadata = {
  title: `Crea tu cuenta · ${brand.name}`,
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function RegistroPage({ searchParams }: { searchParams: { session_id?: string } }) {
  const purchase = await getPurchase(searchParams.session_id);
  return <RegisterView purchase={purchase} configured={adminConfigured()} />;
}
