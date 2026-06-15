import { Github } from 'lucide-react';

const inPageLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Agents', href: '#agents' },
  { label: 'Demo', href: '#demo' },
];

const externalLinks = {
  twitter: 'https://x.com/Use_Athena',
  github: 'https://github.com/athenaframework/athena',
};

const XIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25h6.83l4.713 6.231 5.447-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
  </svg>
);

export default function Footer() {
  const handleClick = (href: string) => {
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-deep-navy py-12 px-4 md:px-6">
      <div className="max-w-[1200px] mx-auto">
        {/* Row 1 */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 mb-8">
          {/* Logo + Tagline */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <a href="#" className="flex items-center gap-2">
              <img src="/logo.png" alt="Athena" className="h-7 w-7 object-contain" />
              <span className="font-display text-base text-white tracking-wide">
                Athena
              </span>
            </a>
            <p className="font-body text-sm text-white/50">
              The operating system for autonomous AI agents.
            </p>
          </div>

          {/* Nav Links + Socials */}
          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="flex flex-wrap items-center justify-center gap-6">
              {inPageLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleClick(link.href)}
                  className="font-body font-medium text-sm text-white/60 hover:text-white transition-colors duration-200"
                >
                  {link.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <a
                href={externalLinks.twitter}
                target="_blank"
                rel="noreferrer"
                aria-label="X (Twitter)"
                className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
              >
                <XIcon className="w-4 h-4" />
              </a>
              <a
                href={externalLinks.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/10 mb-6" />

        {/* Row 2 */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="font-body text-sm text-white/40">
            &copy; 2026 Athena. Built on BASE.
          </p>
          <p className="font-body text-sm text-white/40">
            Multi-agent intelligence platform
          </p>
        </div>
      </div>
    </footer>
  );
}
