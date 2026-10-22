"use client";

import { useState } from "react";
import { passwordStrength } from "@/lib/auth";

type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete: "current-password" | "new-password";
  placeholder?: string;
  strength?: boolean;
  invalid?: boolean;
};

const barColor = ["", "bg-down", "bg-warn", "bg-up", "bg-up"];

export default function PasswordField({ id, label, value, onChange, autoComplete, placeholder, strength, invalid }: Props) {
  const [show, setShow] = useState(false);
  const st = passwordStrength(value);

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-invalid={invalid || undefined}
          className={`field pr-12 ${invalid ? "field-error" : ""}`}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
          className="absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-muted transition-colors hover:text-fg"
        >
          {show ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.1A9.8 9.8 0 0 1 12 5c5 0 8.6 3.4 10 7a11.6 11.6 0 0 1-3.2 4.4M6.3 6.3A11.5 11.5 0 0 0 2 12c1.4 3.6 5 7 10 7a9.7 9.7 0 0 0 4-.9" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M2 12c1.4-3.6 5-7 10-7s8.6 3.4 10 7c-1.4 3.6-5 7-10 7S3.4 15.6 2 12z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>

      {strength && value && (
        <div className="mt-2.5" aria-live="polite">
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((n) => (
              <span key={n} className={`h-1.5 flex-1 rounded-full ${n <= st.score ? barColor[st.score] : "bg-surface2"}`} />
            ))}
          </div>
          <p className="mt-1.5 text-xs text-muted">
            Seguridad: <span className="font-medium text-fg">{st.label}</span>
          </p>
        </div>
      )}
    </div>
  );
}
