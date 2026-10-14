type Props = {
  emoji: string;
  label: string;
  selected: boolean;
  onClick: () => void;
};

export default function OptionCard({ emoji, label, selected, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      className={`flex w-full items-center gap-5 rounded-lg border px-5 py-5 text-left transition ${
        selected
          ? "border-accent bg-accent/10"
          : "border-transparent bg-card hover:border-line hover:bg-[#2d2e33]"
      }`}
    >
      <span className="w-10 text-center text-4xl leading-none">{emoji}</span>
      <span className="text-sm font-semibold">{label}</span>
    </button>
  );
}
