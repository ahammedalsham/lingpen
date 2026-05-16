'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Menu, X, ChevronDown, Share2 } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect for shadow [cite: 1073]
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    {
      title: 'Explore',
      items: ['Treebanks', 'Languages', 'Research']
    },
    {
      title: 'Learn',
      items: ['Courses', 'Exercises', 'Certification', 'Documentation']
    },
    {
      title: 'Community',
      items: ['Blog', 'Discussions', 'Events', 'Magazine']
    }
  ];

  return (
    <nav className={`fixed top-0 w-full h-16 z-50 transition-all duration-300 border-b border-[var(--color-neutral-200)] ${
      isScrolled ? 'bg-white shadow-md' : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        
        {/* Logo [cite: 1074] */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-8 h-8 bg-[var(--color-indigo-primary)] rounded-lg flex items-center justify-center text-white group-hover:bg-[var(--color-indigo-dark)] transition-colors">
            <Share2 className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-[var(--color-indigo-dark)]">LingPen</span>
        </Link>

        {/* Desktop Navigation [cite: 1075-1078] */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-[var(--color-neutral-600)]">
          {navLinks.map((link) => (
            <div key={link.title} className="relative group cursor-pointer h-16 flex items-center">
              <span className="flex items-center hover:text-[var(--color-indigo-primary)] transition-colors">
                {link.title}
                <ChevronDown className="w-4 h-4 ml-1 opacity-50 group-hover:rotate-180 transition-transform duration-200" />
              </span>
              
              {/* Dropdown Menu */}
              <div className="absolute top-16 left-0 min-w-[200px] bg-white border border-[var(--color-neutral-200)] shadow-lg rounded-b-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 flex flex-col py-2">
                {link.items.map((item) => (
                  <Link key={item} href={`/${item.toLowerCase()}`} className="px-4 py-2 hover:bg-[var(--color-neutral-50)] hover:text-[var(--color-indigo-primary)] transition-colors">
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <Link href="/about" className="hover:text-[var(--color-indigo-primary)] transition-colors h-16 flex items-center">About</Link>
        </div>

        {/* Right Actions [cite: 1079-1082] */}
        <div className="hidden md:flex items-center space-x-6">
          <button className="text-[var(--color-neutral-600)] hover:text-[var(--color-indigo-primary)] transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <Link href="/login" className="text-sm font-medium text-[var(--color-neutral-600)] hover:text-[var(--color-indigo-primary)] transition-colors">
            Sign In
          </Link>
          <Link href="/register" className="bg-[var(--color-indigo-primary)] text-white text-sm px-4 py-2 rounded-md font-bold hover:bg-[var(--color-indigo-light)] transition-colors">
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Toggle [cite: 1083] */}
        <button 
          className="md:hidden text-[var(--color-neutral-600)]"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Slide-over Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-[var(--color-neutral-200)] shadow-lg py-4 px-6 flex flex-col space-y-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
          {navLinks.map((link) => (
            <div key={link.title} className="flex flex-col space-y-2">
              <span className="font-bold text-[var(--color-neutral-900)] border-b border-[var(--color-neutral-100)] pb-2">{link.title}</span>
              <div className="flex flex-col pl-4 space-y-2">
                {link.items.map((item) => (
                  <Link key={item} href={`/${item.toLowerCase()}`} className="text-sm text-[var(--color-neutral-600)]">
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <Link href="/about" className="font-bold text-[var(--color-neutral-900)] border-b border-[var(--color-neutral-100)] pb-2">About</Link>
          
          <div className="flex flex-col space-y-3 pt-4">
            <Link href="/login" className="text-center text-sm font-medium text-[var(--color-neutral-600)] border border-[var(--color-neutral-200)] py-2 rounded-md">
              Sign In
            </Link>
            <Link href="/register" className="text-center bg-[var(--color-indigo-primary)] text-white text-sm py-2 rounded-md font-bold">
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}