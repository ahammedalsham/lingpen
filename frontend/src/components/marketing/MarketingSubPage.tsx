import Link from "next/link";

type MarketingSubPageProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
};

/**
 * Lightweight shell for marketing routes that are not yet full product surfaces.
 */
export default function MarketingSubPage({
  title,
  description,
  children,
}: MarketingSubPageProps) {
  return (
    <div className="min-h-screen bg-neutral-50 text-slate-900 flex flex-col">
      <header className="border-b border-neutral-200 bg-white/90 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="text-sm font-semibold text-indigo-primary hover:text-indigo-dark transition-colors"
          >
            ← Back to home
          </Link>
          <span className="text-xs font-mono uppercase tracking-widest text-slate-500">
            LingPen
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-14 md:py-20">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">
          {title}
        </h1>
        {description ? (
          <p className="text-lg text-slate-600 leading-relaxed mb-10">
            {description}
          </p>
        ) : null}
        {children}
      </main>
    </div>
  );
}
