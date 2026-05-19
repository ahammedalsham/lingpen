import { FadeIn } from "../ui/fade-in";

export default function LanguageEcosystem() {
  return (
      <section className="pt-32 pb-24 bg-indigo-dark text-white px-6 relative z-10 -mt-12 rounded-t-[3rem] shadow-2xl">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl tracking-tight font-bold mb-4">Building resources for India&apos;s languages</h2>
            <p className="text-indigo-200 text-lg">Starting with the languages that need it most.</p>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <div className="h-[400px] bg-white/5 rounded-2xl border border-white/10 mb-12 flex items-center justify-center backdrop-blur-sm shadow-inner relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-primary/20 to-transparent"></div>
              <span className="text-indigo-300 font-medium z-10">[Interactive SVG Map of India]</span>
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               {['Hindi', 'Malayalam', 'Tamil', 'Bengali'].map((lang) => (
                 <div key={lang} className="bg-white/10 hover:bg-white/15 transition-colors p-6 rounded-xl border border-white/10 cursor-pointer group">
                   <h4 className="font-bold text-lg group-hover:text-amber transition-colors">{lang}</h4>
                   <div className="flex items-center mt-2">
                     <span className="w-2 h-2 rounded-full bg-emerald mr-2 animate-pulse"></span>
                     <p className="text-xs text-indigo-200 font-medium tracking-wide uppercase">Active</p>
                   </div>
                 </div>
               ))}
            </div>
          </FadeIn>
        </div>
      </section>
  );
}