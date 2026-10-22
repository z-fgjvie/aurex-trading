import Link from "next/link";
import Header from "@/components/ui/Header";
import { afterPurchase, brand, currency, currencyLabel } from "@/lib/config";
import { getStripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

async function loadSession(id?: string) {
  if (!id) return null;
  try {
    return await getStripe().checkout.sessions.retrieve(id);
  } catch {
    return null;
  }
}

export default async function Gracias({ searchParams }: { searchParams: { session_id?: string } }) {
  const session = await loadSession(searchParams.session_id);
  const paid = session?.payment_status === "paid";
  const pending = session && !paid && session.status === "complete"; // OXXO / SPEI en espera

  return (
    <div className="min-h-screen bg-ink font-sans text-white">
      <Header />
      <main className="mx-auto max-w-md px-4 pt-14 text-center">
        {paid && (
          <>
            <p className="text-5xl">✅</p>
            <h1 className="mt-4 text-2xl font-bold">{afterPurchase.title}</h1>
            <p className="mt-3 text-sm text-white/85">{afterPurchase.body}</p>
          </>
        )}
        {pending && (
          <>
            <p className="text-5xl">⏳</p>
            <h1 className="mt-4 text-2xl font-bold">{afterPurchase.pendingTitle}</h1>
            <p className="mt-3 text-sm text-white/85">{afterPurchase.pendingBody}</p>
          </>
        )}
        {!paid && !pending && (
          <>
            <p className="text-5xl">🤔</p>
            <h1 className="mt-4 text-2xl font-bold">No encontramos tu pago</h1>
            <p className="mt-3 text-sm text-white/85">
              Si ya pagaste, escríbenos a {brand.supportEmail} con el correo que usaste.
            </p>
          </>
        )}

        {session && (
          <p className="mt-6 text-xs text-white/60">
            Total: {currency}
            {((session.amount_total ?? 0) / 100).toFixed(2)} {currencyLabel} · Ref. {session.id.slice(-8)}
          </p>
        )}

        <Link href="/" className="mt-8 inline-block text-sm text-accent underline">
          Volver al inicio
        </Link>
      </main>
    </div>
  );
}
