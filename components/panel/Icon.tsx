const P: Record<string, string> = {
  home: "M3 11.5 12 4l9 7.5M5.5 10v9.5h13V10M10 19.5v-5h4v5",
  bots: "M12 3v3M7 8h10a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-5a3 3 0 0 1 3-3zM9 13h.01M15 13h.01M9.5 16.5h5",
  chart: "M4 20V4M4 20h16M8 16l3.5-4 3 2.5L19 8",
  tools: "M14.7 6.3a4 4 0 0 0-5.4 5.2L4 16.8V20h3.2l5.3-5.3a4 4 0 0 0 5.2-5.4l-2.6 2.6-2.4-.6-.6-2.4z",
  book: "M5 4.5h9a3 3 0 0 1 3 3V20H8a3 3 0 0 1-3-3zM5 17a3 3 0 0 1 3-3h9",
  news: "M5 5h12v14H7a2 2 0 0 1-2-2zM17 9h2v8a2 2 0 0 1-2 2M8.5 9h5M8.5 12.5h5M8.5 16h3",
  bell: "M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 20a7.5 7.5 0 0 1 15 0",
  chat: "M4 5h16v11H9l-4 3.5V16H4z",
  logout: "M10 4H5v16h5M15 8l4 4-4 4M19 12H9",
  check: "M5 12.5l4.5 4.5L19 7.5",
  arrow: "M5 12h14M13 6l6 6-6 6",
  back: "M19 12H5M11 6l-6 6 6 6",
  close: "M6 6l12 12M18 6 6 18",
  lock: "M7 11V8a5 5 0 0 1 10 0v3M6 11h12v9H6z",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
  flame: "M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3.2 2-4.2C9.5 11 11 8 12 3z",
  spark: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM18.5 16l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z",
  external: "M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5",
  mail: "M4 6h16v12H4zM4 7l8 6 8-6",
  phone: "M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM11 18h2",
  key: "M15 7a4 4 0 1 0-3.6 4L4 18.5V21h3v-2h2v-2h2l1.6-1.6A4 4 0 0 0 15 7z",
  wallet: "M4 7h14a2 2 0 0 1 2 2v9H6a2 2 0 0 1-2-2zM4 7a2 2 0 0 1 2-2h10M16 13h2",
  calendar: "M5 6h14v14H5zM5 10h14M9 3v4M15 3v4",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM16 16l5 5",
  id: "M4 6h16v12H4zM9 12a2 2 0 1 0 0-.01M6 16.5a3 3 0 0 1 6 0M14 10h4M14 13h3",
  warn: "M12 4l9 16H3zM12 10v4M12 17h.01",
  list: "M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01",
  laptop: "M5 6h14v10H5zM2 19h20",
  qr: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h3v3h-3zM18 18h2v2h-2zM17 14h3",
  shield: "M12 3l7 3v5.5c0 4.3-2.9 8-7 9.5-4.1-1.5-7-5.2-7-9.5V6z",
};

export default function Icon({ name, size = 20, className = "", stroke = 1.9 }: { name: keyof typeof P | string; size?: number; className?: string; stroke?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      <path d={P[name] ?? ""} />
    </svg>
  );
}
