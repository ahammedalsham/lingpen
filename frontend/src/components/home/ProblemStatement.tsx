'use client';

import { motion } from "framer-motion";
import { FadeIn } from "../ui/fade-in";

export default function ProblemStatement() {
  return (
    <section className="py-24 bg-white px-6">
      <div className="max-w-4xl mx-auto text-center">
        <FadeIn>
          <h2 className="text-3xl md:text-5xl tracking-tight font-bold text-neutral-900 mb-12">
            Indian languages deserve better linguistic infrastructure
          </h2>
        </FadeIn>
        
        <div className="grid md:grid-cols-2 gap-12 text-left mb-16 text-neutral-600">
          <FadeIn delay={0.1}>
            <h3 className="text-xl font-bold text-indigo-primary mb-4">The Resource Gap</h3>
            <p>Only ~12 of 22 scheduled languages have UD treebanks, mostly under 5,000 sentences. Without annotated corpora, NLP tools fail regional languages.</p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <h3 className="text-xl font-bold text-indigo-primary mb-4">The Tooling Gap</h3>
            <p>Existing tools are fragmented, struggle with agglutinative morphology and Indian scripts, and lack collaboration workflows.</p>
          </FadeIn>
        </div>

        {/* Minimalist Chart: Global vs Indian Languages */}
        <FadeIn delay={0.3}>
          <div className="bg-neutral-50 p-8 rounded-2xl border border-neutral-200 mb-16 text-left shadow-sm">
            <h4 className="text-sm font-bold text-neutral-600 uppercase tracking-wider mb-8 text-center">
              Universal Dependencies Treebank Size (Sentences)
            </h4>
            <div className="space-y-5">
              {/* Standard Data Points */}
              <div className="flex items-center">
                <span className="w-24 text-sm font-medium text-neutral-900">English</span>
                <div className="flex-1 h-6 bg-neutral-200 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: "100%" }} viewport={{ once: true }} transition={{ duration: 1, ease: "easeOut" }} className="h-full bg-neutral-600"></motion.div>
                </div>
                <span className="w-16 text-right text-xs text-neutral-600">100k+</span>
              </div>
              <div className="flex items-center">
                <span className="w-24 text-sm font-medium text-neutral-900">German</span>
                <div className="flex-1 h-6 bg-neutral-200 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: "65%" }} viewport={{ once: true }} transition={{ duration: 1, ease: "easeOut", delay: 0.1 }} className="h-full bg-neutral-600"></motion.div>
                </div>
                <span className="w-16 text-right text-xs text-neutral-600">65k+</span>
              </div>
              
              <div className="my-6 border-t border-neutral-200 border-dashed"></div>

              {/* Indian Languages (Highlighted) */}
              <div className="flex items-center">
                <span className="w-24 text-sm font-bold text-indigo-primary">Hindi</span>
                <div className="flex-1 h-6 bg-neutral-200 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: "16%" }} viewport={{ once: true }} transition={{ duration: 1, ease: "easeOut", delay: 0.2 }} className="h-full bg-indigo-light"></motion.div>
                </div>
                <span className="w-16 text-right text-xs font-bold text-indigo-primary">16k</span>
              </div>
              <div className="flex items-center">
                <span className="w-24 text-sm font-bold text-indigo-primary">Malayalam</span>
                <div className="flex-1 h-6 bg-neutral-200 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: "3%" }} viewport={{ once: true }} transition={{ duration: 1, ease: "easeOut", delay: 0.3 }} className="h-full bg-amber"></motion.div>
                </div>
                <span className="w-16 text-right text-xs font-bold text-amber">~2k</span>
              </div>
              <div className="flex items-center">
                <span className="w-24 text-sm font-bold text-indigo-primary">Assamese</span>
                <div className="flex-1 h-6 bg-neutral-200 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: "0%" }} viewport={{ once: true }} className="h-full bg-red-400"></motion.div>
                </div>
                <span className="w-16 text-right text-xs font-bold text-red-500">0</span>
              </div>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.4}>
          <h3 className="text-2xl md:text-3xl font-bold text-indigo-dark">
            LingPen exists to close this gap—one treebank at a time, collaboratively.
          </h3>
        </FadeIn>
      </div>
    </section>
  );
}