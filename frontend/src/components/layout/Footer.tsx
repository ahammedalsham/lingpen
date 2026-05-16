import Link from 'next/link';
import { Share2 } from 'lucide-react';

export default function Footer() {
  const footerSections = [
    {
      title: 'Platform',
      links: [
        { label: 'About LingPen', href: '/about' },
        { label: 'Treebanks', href: '/treebanks' },
        { label: 'Languages', href: '/languages' },
        { label: 'Research Roadmap', href: '/roadmap' },
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '/docs' },
        { label: 'API Reference', href: '/docs/api' },
        { label: 'UD Guidelines', href: '/guidelines/ud' },
        { label: 'Annotation Guidelines', href: '/guidelines/annotation' },
        { label: 'Downloads', href: '/downloads' },
      ]
    },
    {
      title: 'Community',
      links: [
        { label: 'Blog', href: '/blog' },
        { label: 'Discussions', href: '/discussions' },
        { label: 'Events', href: '/events' },
        { label: 'Digital Magazine', href: '/magazine' },
        { label: 'Contributors', href: '/contributors' },
      ]
    },
    {
      title: 'About',
      links: [
        { label: 'Team', href: '/team' },
        { label: 'Funding & Acknowledgements', href: '/funding' },
        { label: 'Open Source', href: '/open-source' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Use', href: '/terms' },
        { label: 'Contact', href: '/contact' },
      ]
    }
  ];

  return (
    <footer className="bg-[var(--color-indigo-dark)] pt-16 pb-8 px-6 border-t border-[var(--color-indigo-primary)]">
      <div className="max-w-7xl mx-auto">
        
        {/* Main 4-Column Grid [cite: 1208-1233] */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-white font-bold mb-6 tracking-wide">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      href={link.href} 
                      className="text-sm text-[var(--color-indigo-200)] hover:text-white hover:underline underline-offset-4 transition-all"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar [cite: 1234] */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center space-x-2 text-white">
            <Share2 className="w-5 h-5 text-[var(--color-amber)]" />
            <span className="font-bold text-lg tracking-wide">LingPen</span>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4 text-xs text-[var(--color-indigo-200)]">
            <span>© {new Date().getFullYear()} LingPen Project.</span>
            
            {/* Badges */}
            <div className="flex items-center space-x-3">
              <span className="flex items-center px-2 py-1 bg-white/10 rounded-md border border-white/10">
                <span className="w-2 h-2 rounded-full bg-[var(--color-emerald)] mr-2"></span>
                Open Source (MIT)
              </span>
              <span className="flex items-center px-2 py-1 bg-white/10 rounded-md border border-white/10">
                <span className="w-2 h-2 rounded-full bg-[var(--color-amber)] mr-2"></span>
                Data: CC BY-SA 4.0
              </span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}