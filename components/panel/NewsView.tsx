import { Card, PageTitle } from "@/components/panel/ui";
import { news } from "@/lib/demo-content";

const tone = { Producto: "soft-brand text-brand", Educación: "soft-up text-up", Consejo: "bg-surface2 text-muted" } as const;

export default function NewsView() {
  return (
    <>
      <PageTitle title="Novedades" sub="Lo nuevo de la plataforma y consejos para practicar mejor." />
      <div className="grid gap-5 md:grid-cols-2">
        {news.map((n) => (
          <Card as="article" key={n.id} className="p-6">
            <span className={`rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${tone[n.tag]}`}>{n.tag}</span>
            <h2 className="mt-3 font-display text-xl font-semibold leading-snug">{n.title}</h2>
            <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{n.text}</p>
          </Card>
        ))}
      </div>
    </>
  );
}
