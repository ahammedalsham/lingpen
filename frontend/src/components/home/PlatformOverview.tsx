import { ArrowRight } from "lucide-react";
import { FadeIn } from "../ui/fade-in";

export default function PlatformOverview() {
  return (
    <section className="py-24 bg-neutral-50 px-6 border-y border-neutral-200">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 mb-4 tracking-tight">
              One platform. <span className="text-indigo-primary">Six capabilities.</span>
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Most annotation tools solve one problem. LingPen connects all of them into a single, unified research environment.
            </p>
          </div>
        </FadeIn>

        {/* Modern Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
          
          {/* Large Feature - Spans 2 columns */}
          <FadeIn delay={0.1} className="md:col-span-2">
            <div className="h-full bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl mb-6 flex items-center justify-center text-indigo-primary font-bold text-xl">1</div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-3">Enhanced UD Annotation</h3>
              <p className="text-neutral-600 text-lg max-w-md relative z-10">
                Create and edit Universal Dependencies in a blazing-fast, browser-native editor built for agglutinative languages.
              </p>
              {/* Abstract background decorative element */}
              <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="40" className="text-indigo-primary"/>
                </svg>
              </div>
            </div>
          </FadeIn>

          {/* Standard Feature */}
          <FadeIn delay={0.2} className="h-full">
            <div className="h-full bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-amber/10 rounded-xl mb-6 flex items-center justify-center text-amber font-bold text-xl">2</div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Collaborative Workspaces</h3>
              <p className="text-neutral-600 text-sm">Manage projects, assign sentences, and run seamless review workflows.</p>
            </div>
          </FadeIn>

          {/* Standard Feature */}
          <FadeIn delay={0.3} className="h-full">
            <div className="h-full bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-emerald/10 rounded-xl mb-6 flex items-center justify-center text-emerald font-bold text-xl">3</div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Linguistic Corpus Search</h3>
              <p className="text-neutral-600 text-sm">Query annotated corpora by dependency pattern and morphological feature.</p>
            </div>
          </FadeIn>

          {/* Large Feature - Spans 2 columns */}
          <FadeIn delay={0.4} className="md:col-span-2">
            <div className="h-full bg-indigo-dark p-8 rounded-2xl border border-indigo-primary shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
              <div className="w-12 h-12 bg-white/10 rounded-xl mb-6 flex items-center justify-center text-white font-bold text-xl">4</div>
              <h3 className="text-2xl font-bold text-white mb-3">Education & Certification</h3>
              <p className="text-indigo-200 text-lg max-w-md">Learn dependency annotation through interactive tutorials and earn verifiable certificates.</p>
              <div className="mt-6 flex items-center text-amber font-medium group-hover:translate-x-2 transition-transform cursor-pointer">
                Explore Courses <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}