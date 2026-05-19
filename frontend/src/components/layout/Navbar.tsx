'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ROUTES } from '@/config/routes';
import Image from "next/image";
import {
  Search,
  Bell,
  Menu,
  X,
  ChevronDown,
  BookOpen,
  Database,
  GraduationCap,
  Users,
  Globe,
  User
} from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const menus = {
    research: {
      icon: <BookOpen size={18} />,
      description: "Scholarly publications, corpora and language datasets.",
      sections: [
        {
          title: "Publications",
          links: [
            ["Peer Reviewed", "/papers"],
            ["Preprints", "/preprints"],
            ["Journals", "/journals"]
          ]
        },
        {
          title: "Language Data",
          links: [
            ["Treebanks", "/treebanks"],
            ["Corpora", "/corpora"],
            ["Syntax", "/syntax"]
          ]
        },
        {
          title: "Analytics",
          links: [
            ["Metrics", "/metrics"],
            ["Citation Graphs", "/graphs"]
          ]
        }
      ]
    },
    infrastructure: {
      icon: <Database size={18} />,
      description: "Core computational systems and annotation infrastructure.",
      sections: [
        {
          title: "Annotation",
          links: [
            ["CoNLL-U Editor", "/editor"],
            ["Tree Visualizer", "/trees"]
          ]
        },
        {
          title: "Systems",
          links: [
            ["API", "/api"],
            ["Parser Services", "/parser"]
          ]
        },
        {
          title: "Developer",
          links: [
            ["Github", "/github"],
            ["Documentation", "/docs"]
          ]
        }
      ]
    },
    learn: {
      icon: <GraduationCap size={18} />,
      description: "Academic pathways and structured learning.",
      sections: [
        {
          title: "Courses",
          links: [
            ["Syntax", "/syntax"],
            ["Computational Linguistics", "/cl"]
          ]
        },
        {
          title: "Exercises",
          links: [
            ["Annotation Lab", "/lab"],
            ["Practice Sets", "/practice"]
          ]
        }
      ]
    },
    community: {
      icon: <Users size={18} />,
      description: "Research networks and scholarly communication.",
      sections: [
        {
          title: "Networks",
          links: [
            ["Forums", "/forum"],
            ["Groups", "/groups"]
          ]
        },
        {
          title: "Events",
          links: [
            ["Conferences", "/events"],
            ["Workshops", "/workshops"]
          ]
        }
      ]
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col select-none">
      {/* Skip to Content Link for Layout Accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-0 focus:left-0 focus:bg-white focus:p-3 text-blue-900 font-semibold border-b-2 border-blue-900">
        Skip to main content
      </a>

      {/* LAYER 1: TOP METADATA BAR */}
      <div className="bg-slate-950 h-9 text-[11px] text-slate-400 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between font-mono">
          <div className="hidden lg:flex gap-6">
            <span>CORPORA:<strong className="text-white ml-1">142K</strong></span>
            <span>PROJECTS:<strong className="text-white ml-1">41</strong></span>
            <span>RELEASE:<strong className="text-white ml-1">2026.IV</strong></span>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 hover:text-white transition-colors">
              <Globe size={12} />
              EN
            </button>
            <Link href="/about" className="hover:text-white transition-colors">
              About
            </Link>
          </div>
        </div>
      </div>

      {/* LAYER 2: PRIMARY INTERACTIVE NAV BAR */}
      <nav
        className={`bg-white transition-all duration-300 border-b border-slate-200 relative ${
          scrolled ? 'shadow-md h-16 bg-white/95 backdrop-blur-md' : 'h-20'
        }`}
        onMouseLeave={() => setActiveMenu(null)}
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
          
          {/* Leftside Branding and Links */}
          <div className="flex items-center gap-10 h-full">
            <Link href="/" className="flex items-center gap-3 group outline-none">
              <Image 
                src="/your-logo.png" 
                alt="Logo" 
                width={32} 
                height={32} 
                className="h-8 w-8" 
              />
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 group-hover:text-blue-900 transition-colors">
                  LingPen
                </h1>
                <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400 font-bold leading-none mt-0.5">
                  Language Research Infrastructure
                </p>
              </div>
            </Link>

            {/* Desktop Dynamic Key Layout Loop */}
            <div className="hidden md:flex h-full items-center">
              {Object.keys(menus).map((k) => (
                <button
                  key={k}
                  onMouseEnter={() => setActiveMenu(k)}
                  className={`h-full px-5 uppercase text-xs font-bold tracking-wider border-b-2 transition-all outline-none ${
                    activeMenu === k
                      ? 'border-blue-900 text-slate-950 bg-slate-50/40'
                      : 'border-transparent text-slate-500 hover:text-slate-950 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span className="capitalize">{k}</span>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${activeMenu === k ? "rotate-180 text-blue-900" : ""}`} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Controls Area */}
          <div className="flex items-center gap-3 md:gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href={ROUTES.LOGIN}
                className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-md transition-colors"
              >
                Sign in
              </Link>
              <Link
                href={ROUTES.REGISTER}
                className="text-sm font-semibold text-white bg-blue-900 hover:bg-blue-950 px-4 py-2 rounded-md shadow-sm transition-colors"
              >
                Register
              </Link>
            </div>
            <div className="hidden lg:flex items-center bg-slate-50 border border-slate-200 rounded-full px-4 py-2 focus-within:bg-white focus-within:border-slate-300 transition-all">
              <Search size={15} className="text-slate-400" />
              <input
                placeholder="Search..."
                className="bg-transparent outline-none w-40 ml-2 text-sm text-slate-900 placeholder-slate-400 font-mono"
              />
            </div>

            <button className="relative p-1 text-slate-400 hover:text-slate-900 transition-colors" aria-label="Notifications">
              <Bell size={18} />
              <div className="absolute top-1 right-1 w-2 h-2 bg-blue-900 rounded-full ring-2 ring-white" />
            </button>

            <button className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors outline-none" aria-label="User profile config">
              <User size={16} />
            </button>

            <button
              className="md:hidden p-1 text-slate-600 hover:text-slate-900 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle mobile drawer"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* LAYER 3: DESKTOP MULTI-COLUMN MEGA MENU TRACK */}
        {activeMenu && (
          <div
            className="hidden md:block absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-2xl z-40 animate-in fade-in slide-in-from-top-1 duration-100"
            onMouseEnter={() => setActiveMenu(activeMenu)}
          >
            <div className="max-w-7xl mx-auto px-8 py-10 grid grid-cols-4 gap-10">
              <div className="border-r border-slate-100 pr-4">
                <div className="flex items-center gap-2 text-lg font-bold text-slate-900 uppercase tracking-wide">
                  {menus[activeMenu as keyof typeof menus].icon}
                  <span className="capitalize">{activeMenu}</span>
                </div>
                <p className="mt-4 text-sm text-slate-500 leading-relaxed">
                  {menus[activeMenu as keyof typeof menus].description}
                </p>
              </div>

              <div className="col-span-3 grid grid-cols-3 gap-8">
                {menus[activeMenu as keyof typeof menus].sections.map((section, i) => (
                  <div key={i}>
                    <h3 className="uppercase font-mono text-[10px] tracking-widest text-slate-400 mb-4 font-bold border-b border-slate-100 pb-1">
                      {section.title}
                    </h3>
                    <div className="space-y-3">
                      {section.links.map(([label, href], j) => (
                        <Link
                          key={j}
                          href={href}
                          className="block text-sm text-slate-600 hover:text-blue-900 font-medium transition-colors"
                        >
                          {label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* MOBILE FULL CONTENT ACCORDION BLOCK */}
      {mobileOpen && (
        <div className="md:hidden w-full bg-white border-b border-slate-200 max-h-[calc(100vh-6rem)] overflow-y-auto" id="mobile-menu">
          <div className="px-4 py-4 space-y-4">
            <div className="flex gap-2 sm:hidden pb-2 border-b border-slate-100">
              <Link
                href={ROUTES.LOGIN}
                className="flex-1 text-center text-sm font-semibold text-slate-700 border border-slate-200 rounded-md py-2.5"
                onClick={() => setMobileOpen(false)}
              >
                Sign in
              </Link>
              <Link
                href={ROUTES.REGISTER}
                className="flex-1 text-center text-sm font-semibold text-white bg-blue-900 rounded-md py-2.5"
                onClick={() => setMobileOpen(false)}
              >
                Register
              </Link>
            </div>
            {Object.entries(menus).map(([key, value]) => (
              <div key={key} className="space-y-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-wider text-slate-400 px-1">
                  {value.icon}
                  <span className="capitalize">{key}</span>
                </div>
                <div className="pl-6 grid grid-cols-2 gap-4 pt-1">
                  {value.sections.map((section, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="text-xs font-bold text-slate-800">{section.title}</div>
                      {section.links.map(([label, href], id) => (
                        <Link key={id} href={href} className="block text-xs text-slate-500 py-1 hover:text-blue-900 transition-colors">
                          {label}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}