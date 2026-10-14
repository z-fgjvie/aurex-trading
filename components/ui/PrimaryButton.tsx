import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { full?: boolean };

export default function PrimaryButton({ full, className = "", disabled, children, ...rest }: Props) {
  return (
    <button
      disabled={disabled}
      className={`rounded-lg px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-ink transition ${
        disabled ? "cursor-not-allowed bg-accent-deep/80 text-ink/70" : "bg-accent hover:bg-accent-dark"
      } ${full ? "w-full" : "w-full max-w-[22rem]"} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
