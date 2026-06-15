import { useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import SectionHeader from '@/components/SectionHeader';
import { ExternalLink, Maximize2, RefreshCcw } from 'lucide-react';

const DEMO_URL = (import.meta.env.VITE_DEMO_URL as string) || 'https://athena-production-9044.up.railway.app/app';

export default function DemoSection() {
  const headerRef = useScrollReveal<HTMLDivElement>({
    y: 30,
    duration: 0.6,
    start: 'top 80%',
  });
  const frameRef = useScrollReveal<HTMLDivElement>({
    y: 50,
    duration: 0.8,
    start: 'top 75%',
  });

  const [iframeKey, setIframeKey] = useState(0);

  return (
    <section id="demo" className="relative py-section md:py-section px-4 bg-sky-pale overflow-hidden">
      <div className="relative z-10 max-w-[1200px] mx-auto">
        <div ref={headerRef} className="flex flex-col items-center mb-12">
          <SectionHeader
            label="LIVE DEMO"
            title="See the swarm in action"
            subtitle="Real-time 3D command center streaming live agent status, task progress, and built artifacts - directly from a running swarm."
          />
        </div>

        <div ref={frameRef} className="relative">
          {/* Browser chrome */}
          <div className="glass-card rounded-card overflow-hidden shadow-card-hover">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-deep-blue/10 bg-white/40">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                <span className="w-3 h-3 rounded-full bg-[#28C840]" />
              </div>
              <div className="hidden sm:flex items-center gap-2 bg-white border border-deep-blue/10 rounded-full px-3 py-1 text-xs font-mono text-deep-blue/60 max-w-[280px] truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-leaf animate-pulse-dot" />
                <span className="truncate">{DEMO_URL}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIframeKey((k) => k + 1)}
                  className="p-1.5 rounded hover:bg-deep-blue/10 text-deep-blue/60 hover:text-deep-blue transition-colors"
                  aria-label="Reload demo"
                  title="Reload demo"
                >
                  <RefreshCcw className="w-3.5 h-3.5" />
                </button>
                <a
                  href={DEMO_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded hover:bg-deep-blue/10 text-deep-blue/60 hover:text-deep-blue transition-colors"
                  aria-label="Open demo in new tab"
                  title="Open in new tab"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Iframe */}
            <div className="relative aspect-[16/10] bg-sky-base">
              <iframe
                key={iframeKey}
                src={DEMO_URL}
                title="Athena dashboard live demo"
                className="absolute inset-0 w-full h-full"
                allow="clipboard-read; clipboard-write"
              />
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            <a
              href={DEMO_URL}
              target="_blank"
              rel="noreferrer"
              className="font-body font-semibold text-sm text-white gradient-cta hover:gradient-cta-hover px-7 py-3 rounded-button transition-all duration-200 hover:shadow-cta inline-flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Open dashboard
            </a>
            <p className="font-body text-xs text-deep-blue/50 text-center sm:text-left max-w-md">
              Live 3D dashboard running on{' '}
              <code className="font-mono text-deep-blue/70">{DEMO_URL}</code>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
