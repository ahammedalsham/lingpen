import DependencyGraph from '../visuals/DependencyGraph';

export default function Hero() {
  return (
    <section className="mt-16 min-h-[90vh] bg-indigo-dark grid grid-cols-1 md:grid-cols-2">
      {/* Left Column: Copy & CTA */}
      <div className="flex flex-col justify-center px-8 md:px-16 py-12 z-10">
        <span className="text-amber text-sm font-bold tracking-widest uppercase mb-4">
          Open Linguistic Infrastructure
        </span>
        <h1 className="text-white text-5xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
          Language is the infrastructure of thought.
        </h1>
        <p className="text-indigo-200 text-xl mb-8 max-w-lg">
          LingPen is the infrastructure of language research. Universal Dependencies annotation built collaboratively.
        </p>
        
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
          <button className="bg-amber text-indigo-dark px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors shadow-lg">
            Start Annotating - it&apos;s free
          </button>
          <a href="/explore" className="text-center border border-white/20 text-white px-6 py-3 rounded-lg font-bold hover:bg-white/10 transition-colors">
            Explore Treebanks
          </a>
        </div>
        
        <div className="flex space-x-4 text-indigo-300 text-sm font-medium">
          <span>✓ No installation</span>
          <span>✓ Open source</span>
          <span>✓ CC BY-SA datasets</span>
        </div>
      </div>

      {/* Right Column: Interactive Visual */}
      <div className="flex flex-col items-center justify-center p-8 bg-indigo-dark border-l border-indigo-primary/30 relative overflow-hidden">
        {/* Subtle grid background effect */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-primary/40 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="relative w-full max-w-lg bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-2xl z-10">
          <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber/80"></div>
              <div className="w-3 h-3 rounded-full bg-emerald/80"></div>
            </div>
            <span className="text-xs text-indigo-200 font-mono bg-black/20 px-2 py-1 rounded">mal-ud-test.conllu</span>
          </div>
          
          {/* Render our interactive D3 Graph */}
          <DependencyGraph />
          
        </div>
      </div>
    </section>
  );
}