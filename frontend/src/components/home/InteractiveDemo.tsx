import { FadeIn } from "../ui/fade-in";

export default function InteractiveDemo() {
  return (
      <section className="py-32 bg-white px-6">
        <div className="max-w-6xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 mb-6 tracking-tight">See annotation in action</h2>
            <p className="text-neutral-600 text-lg max-w-2xl mx-auto mb-16">A real LingPen editor with example sentences. Try clicking the dependency arcs.</p>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            {/* Mac OS Window Frame Mockup */}
            <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 h-[600px] flex flex-col mb-12 overflow-hidden">
              {/* Window Header */}
              <div className="h-12 bg-neutral-100 border-b border-neutral-200 flex items-center px-4 space-x-2 relative">
                <div className="flex space-x-2 absolute left-4">
                  <div className="w-3 h-3 rounded-full bg-red-400 border border-black/10"></div>
                  <div className="w-3 h-3 rounded-full bg-amber border border-black/10"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald border border-black/10"></div>
                </div>
                {/* Optional fake URL bar */}
                <div className="mx-auto bg-white rounded-md px-32 py-1 text-xs text-neutral-400 border border-neutral-200 shadow-sm font-mono">
                  lingpen.io/demo
                </div>
              </div>

              {/* Window Body (Replace the span below with your Figma SVG export or React Component) */}
              <div className="flex-1 bg-neutral-50 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-grid-neutral-200/50 [mask-image:linear-gradient(to_bottom,white,transparent)]" />
                <span className="text-neutral-500 font-medium z-10 px-6 py-3 bg-white rounded-lg shadow-sm border border-neutral-200">
                  [Place High-Fidelity Figma Export Here]
                </span>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-4xl mx-auto">
              <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100">
                <div className="font-bold text-neutral-900 text-lg mb-1">⚡ Real-time sync</div>
                <div className="text-neutral-500 text-sm">Table & Graph update instantly</div>
              </div>
              <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100">
                <div className="font-bold text-neutral-900 text-lg mb-1">✅ Live validation</div>
                <div className="text-neutral-500 text-sm">Errors flagged as you type</div>
              </div>
              <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100">
                <div className="font-bold text-neutral-900 text-lg mb-1">⌨️ Keyboard-first</div>
                <div className="text-neutral-500 text-sm">Full shortcut support</div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
  );
}