import { getStripe } from "@/lib/stripe";
import { plans } from "@/lib/config";

export type PurchaseDetails = {
  sessionId: string;
  email: string;
  name: string;
  planId: string;
  planLabel: string;
  botId: string;
  amount: number;
  currency: string;
};

export type PurchaseResult =
  | { state: "invalid" }
  | { state: "pending" | "paid"; details: PurchaseDetails };

// Pregunta a Stripe qué pasó con una compra. Es la única fuente confiable: nunca se debe
// creer lo que diga el navegador sobre si alguien pagó.
export async function getPurchase(sessionId?: string | null): Promise<PurchaseResult> {
  if (!sessionId || !/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) return { state: "invalid" };
  try {
    const s = await getStripe().checkout.sessions.retrieve(sessionId);
    if (s.status !== "complete") return { state: "invalid" };

    const email = (s.customer_details?.email ?? s.customer_email ?? "").trim().toLowerCase();
    if (!email) return { state: "invalid" };

    const planId = s.metadata?.planId ?? "";
    const plan = plans.find((p) => p.id === planId);
    return {
      state: s.payment_status === "paid" ? "paid" : "pending",
      details: {
        sessionId: s.id,
        email,
        name: s.metadata?.name ?? "",
        planId,
        planLabel: plan?.label ?? "",
        botId: s.metadata?.botId ?? "",
        amount: (s.amount_total ?? 0) / 100,
        currency: (s.currency ?? "mxn").toUpperCase(),
      },
    };
  } catch {
    return { state: "invalid" };
  }
}
