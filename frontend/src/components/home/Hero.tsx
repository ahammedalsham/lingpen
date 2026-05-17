'use client';

import { motion } from "framer-motion";
import LiveAnnotationDemo from "./LiveAnnotationDemo";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-[#07111F]">

      {/* Background Image */}
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/Gemini_Generated_Image_3o0pqv3o0pqv3o0p.png')"
        }}
      />

      {/* overlays */}
      <div className="absolute inset-0 bg-slate-950/75" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#07111F] via-[#07111F]/85 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#07111F]/30 via-transparent to-[#07111F]" />

      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.04]">
        <svg width="100%" height="100%">
          <pattern
            id="heroGrid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M40 0L0 0 0 40"
              fill="none"
              stroke="white"
              strokeWidth=".6"
            />
          </pattern>

          <rect
            width="100%"
            height="100%"
            fill="url(#heroGrid)"
          />
        </svg>
      </div>

      {/* subtle glow */}
      <div className="absolute top-[-200px] right-[-200px] w-[700px] h-[700px] rounded-full bg-blue-500/10 blur-[160px]" />
      <div className="absolute bottom-[-150px] left-[-100px] w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[140px]" />

      {/* Main Content */}
      <div className="relative z-10 max-w-[1450px] mx-auto px-6 lg:px-10 pt-28 pb-24">

        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-16 items-center">

          {/* LEFT CONTENT */}

          <motion.div
            className="max-w-2xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >

            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-3 border border-white/15 bg-gradient-to-r from-white/[0.08] to-white/[0.02] backdrop-blur-md px-4 py-2.5 rounded-full mb-8 hover:border-white/25 transition-all duration-300"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

              <span className="text-[11px] uppercase tracking-[0.25em] text-slate-300 font-semibold">
                Open Linguistic Research Infrastructure
              </span>

            </motion.div>


            <motion.h1
              variants={itemVariants}
              className="text-white text-5xl md:text-6xl xl:text-7xl leading-[1.05] tracking-tight font-serif font-semibold"
            >
              Language is the{" "}
              <span className="text-blue-400">
                infrastructure
              </span>{" "}
              of human knowledge.
            </motion.h1>


            <motion.p
              variants={itemVariants}
              className="mt-8 text-lg md:text-xl leading-relaxed text-slate-300/90 max-w-xl font-light tracking-wide"
            >
              LingPen is a collaborative research platform
              for Universal Dependencies annotation,
              multilingual corpora,
              computational linguistics,
              and open scholarly infrastructure.
            </motion.p>


            <motion.div
              variants={itemVariants}
              className="mt-12 flex flex-col sm:flex-row gap-5"
            >

              <button className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-lg font-semibold transition-all duration-300 shadow-[0_10px_40px_rgba(37,99,235,.3)] hover:shadow-[0_15px_50px_rgba(37,99,235,.4)] hover:-translate-y-1 active:translate-y-0">
                Begin Annotation
              </button>

              <a
                href="/treebanks"
                className="flex justify-center items-center px-8 py-4 border border-white/20 rounded-lg text-white hover:bg-white/[0.08] hover:border-white/30 transition-all duration-300 font-medium backdrop-blur-sm"
              >
                Explore Treebanks
              </a>

            </motion.div>


            {/* metrics */}

            <motion.div
              variants={itemVariants}
              className="mt-16 grid grid-cols-3 gap-8 max-w-lg"
            >

              <div className="group">
                <div className="text-3xl font-semibold text-white mb-2">
                  150+
                </div>
                <div className="text-sm text-slate-400 font-medium">
                  Treebanks
                </div>
                <div className="h-px w-0 group-hover:w-8 bg-gradient-to-r from-blue-400 to-transparent transition-all duration-300 mt-3" />
              </div>

              <div className="group">
                <div className="text-3xl font-semibold text-white mb-2">
                  80+
                </div>
                <div className="text-sm text-slate-400 font-medium">
                  Languages
                </div>
                <div className="h-px w-0 group-hover:w-8 bg-gradient-to-r from-blue-400 to-transparent transition-all duration-300 mt-3" />
              </div>

              <div className="group">
                <div className="text-3xl font-semibold text-white mb-2">
                  Open
                </div>
                <div className="text-sm text-slate-400 font-medium">
                  Research Ecosystem
                </div>
                <div className="h-px w-0 group-hover:w-8 bg-gradient-to-r from-blue-400 to-transparent transition-all duration-300 mt-3" />
              </div>

            </motion.div>

          </motion.div>



          {/* RIGHT SIDE */}

          <motion.div
            initial={{
              opacity:0,
              x:40
            }}
            animate={{
              opacity:1,
              x:0
            }}
            transition={{
              duration:1,
              delay:.6
            }}
            className="hidden lg:block"
          >

            <div className="
            relative
            overflow-hidden
            rounded-2xl
            border border-white/15
            bg-gradient-to-br from-[#0B1120]/90 to-[#0B1120]/70
            backdrop-blur-2xl
            shadow-[0_20px_60px_rgba(0,0,0,.8)]
            hover:border-white/25
            transition-all
            duration-500
            group
            ">


              {/* top bar */}

              <div className="
              px-6
              py-3.5
              border-b
              border-white/10
              flex
              items-center
              justify-between
              bg-gradient-to-r
              from-black/50
              to-black/20
              ">

                <div className="flex items-center gap-3">

                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/70"/>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70"/>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70"/>
                  </div>

                  <div className="h-4 w-px bg-white/10"/>

                  <span className="text-[11px] text-slate-500 font-mono">
                    English UD v2.12
                  </span>

                  <span className="text-slate-600">
                    ›
                  </span>

                  <span className="text-[11px] font-mono text-slate-200">
                    Live CoNLL-U Studio
                  </span>

                </div>


                <div className="flex items-center gap-2 bg-emerald-500/15 px-2.5 py-1.5 rounded border border-emerald-500/30">

                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>

                  <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-semibold">
                    LIVE
                  </span>

                </div>

              </div>


              {/* sentence */}

              <div className="
              px-6
              py-5
              border-b
              border-white/5
              bg-gradient-to-b
              from-white/[0.03]
              to-white/[0.01]
              flex
              items-baseline
              gap-4
              ">

                <span className="
                font-mono
                text-[10px]
                text-slate-500
                uppercase
                tracking-widest
                ">
                  sent_001
                </span>

                <span className="text-[15px] text-slate-200 leading-relaxed">

                  LingPen is an{" "}

                  <span className="
                  bg-blue-500/20
                  text-blue-300
                  px-1.5
                  rounded
                  ">
                    annotation
                  </span>

                  {" "}tool.

                </span>

              </div>



              {/* live animation */}

              <div className="bg-gradient-to-b from-transparent to-black/20">

                <LiveAnnotationDemo />

              </div>



              {/* bottom status */}

              <div className="
              grid
              grid-cols-3
              border-t
              border-white/10
              bg-gradient-to-r
              from-black/30
              to-black/10
              divide-x
              divide-white/10
              ">

                <div className="p-5">

                  <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2 font-medium">
                    Active Token
                  </div>

                  <div className="flex items-center gap-2">

                    <span className="text-white font-semibold">
                      annotation
                    </span>

                    <span className="
                    px-2
                    py-1
                    rounded
                    text-[9px]
                    font-mono
                    bg-blue-500/20
                    text-blue-300
                    border border-blue-500/40
                    ">
                      NOUN
                    </span>

                  </div>

                </div>


                <div className="p-5">

                  <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2 font-medium">
                    Morphological Features
                  </div>

                  <div className="flex gap-2">

                    <span className="
                    text-[11px]
                    font-mono
                    text-slate-300
                    ">
                      Number=Sing
                    </span>

                  </div>

                </div>


                <div className="p-5">

                  <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2 font-medium">
                    Head & Relation
                  </div>

                  <div className="flex items-center gap-2">

                    <span className="text-white font-mono text-xs font-medium">
                      0
                    </span>

                    <span className="text-slate-500 text-xs">
                      →
                    </span>

                    <span className="
                    text-emerald-400
                    font-mono
                    text-xs
                    font-semibold
                    ">
                      root
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </motion.div>

        </div>

      </div>

    </section>
  );
}