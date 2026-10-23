import { redirect } from "next/navigation";
import DemoProvider, { type PanelUser } from "@/components/panel/DemoProvider";
import PanelShell from "@/components/panel/PanelShell";
import { authConfigured } from "@/lib/auth";
import { plans } from "@/lib/config";
import { planTitle, virtualBalance } from "@/lib/landing";
import { supabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  if (!authConfigured()) redirect("/login");
  const {
    data: { user },
  } = await supabaseServer().auth.getUser();
  if (!user) redirect("/login");

  const meta = (user.app_metadata ?? {}) as { plan?: string; activated_at?: string; access_until?: string };
  const plan = plans.find((p) => p.id === meta.plan);
  const until = meta.access_until ? new Date(meta.access_until) : null;
  const msLeft = until ? until.getTime() - Date.now() : 0;

  const panelUser: PanelUser = {
    id: user.id,
    email: user.email ?? "",
    name: ((user.user_metadata?.name as string | undefined) ?? "").trim(),
    planLabel: plan ? planTitle(plan.label) : "Plan activo",
    daysLeft: Math.max(0, Math.ceil(msLeft / 86_400_000)),
    accessUntil: until ? until.toISOString() : null,
    startedAt: meta.activated_at ?? null,
    active: until !== null && msLeft > 0,
  };

  return (
    <DemoProvider user={panelUser} start={virtualBalance}>
      <PanelShell>{children}</PanelShell>
    </DemoProvider>
  );
}
