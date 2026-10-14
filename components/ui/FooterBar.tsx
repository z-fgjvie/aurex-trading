import type { ReactNode } from "react";

// Barra inferior fija con el botón principal de cada paso.
export default function FooterBar({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 flex justify-center bg-gradient-to-t from-ink via-ink to-transparent px-4 pb-5 pt-8">
      {children}
    </div>
  );
}
