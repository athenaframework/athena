import { useState, useEffect } from 'react';
import { useNavbarScroll } from '@/hooks/useNavbarScroll';
import { Menu, X as CloseIcon, Github } from 'lucide-react';
import ConnectWalletButton from './ConnectWalletButton';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Agents', href: '#agents' },
  { label: 'Demo', href: '#demo' },
];

const externalLinks = {
  twitter: 'https://x.com/Use_Athena',
  github: 'https://github.com/Use-Athena',
};

// X / Twitter logo SVG (since lucide's Twitter is the old bird)
const XIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25h6.83l4.713 6.231 5.447-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
  </svg>
);

export default function Navbar() {
  const isScrolled = useNavbarScroll(50);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300 ${
          isScrolled
            ? 'bg-sky-pale/85 backdrop-blur-xl border-b border-deep-blue/10'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-[1200px] mx-auto h-full px-6 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="2" fill="#4A90C2" />
              <ellipse cx="10" cy="10" rx="8" ry="3" stroke="#4A90C2" strokeWidth="1" transform="rotate(0 10 10)" />
              <ellipse cx="10" cy="10" rx="8" ry="3" stroke="#4A90C2" strokeWidth="1" transform="rotate(60 10 10)" />
              <ellipse cx="10" cy="10" rx="8" ry="3" stroke="#4A90C2" strokeWidth="1" transform="rotate(120 10 10)" />
            </svg>
            <span className="font-display text-base text-deep-blue tracking-wide">
              ATHENA
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="relative font-body font-medium text-sm text-deep-blue/50 hover:text-deep-blue transition-colors duration-200 group"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-ocean transition-all duration-200 group-hover:w-full" />
              </button>
            ))}

            {/* X + GitHub icon links */}
            <div className="flex items-center gap-2 pl-1 border-l border-deep-blue/15 ml-1">
              <a
                href={externalLinks.twitter}
                target="_blank"
                rel="noreferrer"
                aria-label="X (Twitter)"
                className="p-2 rounded-full text-deep-blue/50 hover:text-deep-blue hover:bg-deep-blue/5 transition-all"
              >
                <XIcon className="w-4 h-4" />
              </a>
              <a
                href={externalLinks.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="p-2 rounded-full text-deep-blue/50 hover:text-deep-blue hover:bg-deep-blue/5 transition-all"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <ConnectWalletButton className="!px-5 !py-2.5" />
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 text-deep-blue"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-sky-light transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-12">
            <a href="#" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="2" fill="#4A90C2" />
                <ellipse cx="10" cy="10" rx="8" ry="3" stroke="#4A90C2" strokeWidth="1" transform="rotate(0 10 10)" />
                <ellipse cx="10" cy="10" rx="8" ry="3" stroke="#4A90C2" strokeWidth="1" transform="rotate(60 10 10)" />
                <ellipse cx="10" cy="10" rx="8" ry="3" stroke="#4A90C2" strokeWidth="1" transform="rotate(120 10 10)" />
              </svg>
              <span className="font-display text-base text-deep-blue">ATHENA</span>
            </a>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-deep-blue"
              aria-label="Close menu"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col gap-6 items-center flex-1">
            {navLinks.map((link, i) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="font-body font-medium text-xl text-deep-blue/70 hover:text-deep-blue transition-colors duration-200"
                style={{
                  opacity: isMobileMenuOpen ? 1 : 0,
                  transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(10px)',
                  transition: `all 0.3s ease ${0.1 * (i + 1)}s`,
                }}
              >
                {link.label}
              </button>
            ))}
            <div
              className="mt-8 flex flex-col items-center gap-4"
              style={{
                opacity: isMobileMenuOpen ? 1 : 0,
                transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(10px)',
                transition: 'all 0.3s ease 0.5s',
              }}
            >
              <ConnectWalletButton className="!px-8 !py-3" />
              <div className="flex items-center gap-3">
                <a
                  href={externalLinks.twitter}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="X (Twitter)"
                  className="p-3 rounded-full text-deep-blue/60 hover:text-deep-blue hover:bg-deep-blue/5 transition-all"
                >
                  <XIcon className="w-5 h-5" />
                </a>
                <a
                  href={externalLinks.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="p-3 rounded-full text-deep-blue/60 hover:text-deep-blue hover:bg-deep-blue/5 transition-all"
                >
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
