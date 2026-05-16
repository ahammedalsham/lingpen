import { FadeIn } from "../ui/fade-in";

export default function EducationPathway() {
  return (
      <section className="relative bg-gradient-to-br from-indigo-dark to-indigo-light text-white">
        {/* Top Wave Divider */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
          <svg className="relative block w-[calc(100%+1.3px)] h-[50px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-neutral-50"></path>
          </svg>
        </div>

        <div className="py-32 px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <FadeIn>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Don&apos;t have an annotator? Grow one.</h2>
              <p className="text-indigo-100 text-lg mb-12">LingPen trains the contributors it needs, from within its own community.</p>
            </FadeIn>
            
            <div className="grid md:grid-cols-3 gap-6 mb-12">
               <FadeIn delay={0.1} className="bg-white/10 backdrop-blur-md p-8 rounded-2xl text-left border border-white/20 hover:-translate-y-1 transition-transform">
                 <div className="w-10 h-10 bg-amber/20 rounded-lg flex items-center justify-center mb-4 text-amber font-bold">1</div>
                 <h4 className="font-bold text-xl">UD Fundamentals</h4>
                 <p className="text-sm text-indigo-200 mt-2 font-medium">12 Lessons • 2 Hours</p>
               </FadeIn>
               <FadeIn delay={0.2} className="bg-white/10 backdrop-blur-md p-8 rounded-2xl text-left border border-white/20 hover:-translate-y-1 transition-transform">
                 <div className="w-10 h-10 bg-amber/20 rounded-lg flex items-center justify-center mb-4 text-amber font-bold">2</div>
                 <h4 className="font-bold text-xl">Enhanced Dependencies</h4>
                 <p className="text-sm text-indigo-200 mt-2 font-medium">8 Lessons • 1.5 Hours</p>
               </FadeIn>
               <FadeIn delay={0.3} className="bg-white/10 backdrop-blur-md p-8 rounded-2xl text-left border border-white/20 hover:-translate-y-1 transition-transform">
                 <div className="w-10 h-10 bg-amber/20 rounded-lg flex items-center justify-center mb-4 text-amber font-bold">3</div>
                 <h4 className="font-bold text-xl">Language Practice</h4>
                 <p className="text-sm text-indigo-200 mt-2 font-medium">Interactive Exercises</p>
               </FadeIn>
            </div>
            <FadeIn delay={0.4}>
              <p className="font-medium text-amber text-lg bg-indigo-dark/40 inline-block px-6 py-3 rounded-full border border-indigo-primary">Earn a LingPen certification that demonstrates your annotation expertise.</p>
            </FadeIn>
          </div>
        </div>
      </section>
  );
}