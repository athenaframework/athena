import { useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import SectionHeader from '@/components/SectionHeader';
import { ExternalLink, Maximize2, RefreshCcw, Rocket } from 'lucide-react';

const DEMO_URL = (import.meta.env.VITE_DEMO_URL as string) || '';
const IS_LIVE = DEMO_URL && !DEMO_URL.includes('localhost');

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
                <span className={`w-1.5 h-1.5 rounded-full ${IS_LIVE ? 'bg-leaf animate-pulse-dot' : 'bg-gold'}`} />
                <span className="truncate">{IS_LIVE ? DEMO_URL : 'athena.up.railway.app'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {IS_LIVE && (
                  <button
                    onClick={() => setIframeKey((k) => k + 1)}
                    className="p-1.5 rounded hover:bg-deep-blue/10 text-deep-blue/60 hover:text-deep-blue transition-colors"
                    aria-label="Reload demo"
                    title="Reload demo"
                  >
                    <RefreshCcw className="w-3.5 h-3.5" />
                  </button>
                )}
                <a
                  href={IS_LIVE ? DEMO_URL : '#'}
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

            {/* Content area */}
            <div className="relative aspect-[16/10] bg-gradient-to-br from-[#EAF2F8] to-[#D4E8F4]">
              {IS_LIVE ? (
                /* Live iframe when Railway URL is set */
                <iframe
                  key={iframeKey}
                  src={DEMO_URL}
                  title="Athena dashboard live demo"
                  className="absolute inset-0 w-full h-full"
                  allow="clipboard-read; clipboard-write"
                />
              ) : (
                /* Placeholder when no VITE_DEMO_URL is set */
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-8">
                  {/* Animated orbs mimicking the 3D dashboard */}
                  <div className="relative w-48 h-48 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-2 border-ocean/20 animate-[spin_8s_linear_infinite]" />
                    <div className="absolute inset-4 rounded-full border border-teal/25 animate-[spin_5s_linear_infinite_reverse]" />
                    <div className="absolute inset-8 rounded-full border border-gold/20 animate-[spin_12s_linear_infinite]" />
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-ocean/40 to-teal/30 flex items-center justify-center shadow-lg">
                      <img src="/logo.png" alt="Athena" className="w-9 h-9 object-contain" />
                    </div>
                    {/* Agent dots */}
                    {[0, 72, 144, 216, 288].map((deg, i) => (
                      <div
                        key={i}
                        className="absolute w-5 h-5 rounded-full border border-white/60 bg-white/80 shadow"
                        style={{
                          top: `calc(50% + ${Math.sin((deg * Math.PI) / 180) * 76}px - 10px)`,
                          left: `calc(50% + ${Math.cos((deg * Math.PI) / 180) * 76}px - 10px)`,
                        }}
                      />
                    ))}
                  </div>

                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 bg-ocean/10 border border-ocean/20 rounded-full px-4 py-1.5 mb-3">
                      <Rocket className="w-3.5 h-3.5 text-ocean" />
                      <span className="font-body font-medium text-xs text-ocean tracking-wide">DEPLOYING SOON</span>
                    </div>
                    <p className="font-body text-sm text-deep-blue/50 max-w-xs">
                      Live 3D dashboard is launching on Railway. The swarm will be visible here.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            <a
              href={IS_LIVE ? DEMO_URL : 'https://github.com/athenaframework/athena'}
              target="_blank"
              rel="noreferrer"
              className="font-body font-semibold text-sm text-white gradient-cta hover:gradient-cta-hover px-7 py-3 rounded-button transition-all duration-200 hover:shadow-cta inline-flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              {IS_LIVE ? 'Open dashboard' : 'View on GitHub'}
            </a>
            <p className="font-body text-xs text-deep-blue/50 text-center sm:text-left max-w-md">
              {IS_LIVE
                ? <>Live 3D dashboard on <code className="font-mono text-deep-blue/70">{DEMO_URL}</code>.</>
                : 'Full live demo coming soon. Track deployment progress on GitHub.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
