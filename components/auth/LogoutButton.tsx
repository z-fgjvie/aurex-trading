"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const out = async () => {
    setBusy(true);
    try {
      await supabaseBrowser().auth.signOut();
    } finally {
      router.replace("/login");
      router.refresh();
    }
  };

  return (
    <button onClick={out} disabled={busy} className="btn-ghost !py-2.5 disabled:opacity-60">
      {busy ? "Saliendo…" : "Cerrar sesión"}
    </button>
  );
}
