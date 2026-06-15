import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import LeafParticles from '@/components/LeafParticles';
import PineTrees from '@/components/PineTrees';
import ConnectWalletButton from '@/components/ConnectWalletButton';
import { Copy } from 'lucide-react';

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const tokenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      tl.from(badgeRef.current, {
        y: 10,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
      })
        .from(
          titleRef.current,
          {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out',
          },
          '-=0.2'
        )
        .from(
          subtitleRef.current,
          {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out',
          },
          '-=0.4'
        )
        .from(
          ctaRef.current,
          {
            y: 15,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out',
          },
          '-=0.4'
        )
        .from(
          statsRef.current?.children || [],
          {
            y: 15,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
          },
          '-=0.2'
        )
        .from(
          tokenRef.current,
          {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out',
          },
          '-=0.2'
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleCopyCA = () => {
    navigator.clipboard.writeText('TBA — Athena token launching on Base');
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen gradient-hero flex flex-col items-center justify-center px-4 pt-16 overflow-hidden"
    >
      <LeafParticles count={50} />
      <PineTrees opacity={0.3} />

      <div className="relative z-10 max-w-[700px] mx-auto text-center">
        {/* Badge */}
        <div ref={badgeRef} className="inline-flex items-center gap-2 bg-teal/10 border border-teal/25 rounded-full px-4 py-1.5 mb-6">
          <span className="w-2 h-2 rounded-full bg-teal animate-pulse-dot" />
          <span className="font-body font-medium text-xs tracking-wide text-teal">
            Now available — multi-agent intelligence
          </span>
        </div>

        {/* Title */}
        <h1
          ref={titleRef}
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-deep-blue leading-[1.05] tracking-tight mb-5"
        >
          The operating system
          <br />
          for autonomous <span className="text-ocean">AI</span> agents
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="font-body text-base md:text-lg text-deep-blue/50 leading-relaxed max-w-[560px] mx-auto mb-8"
        >
          Athena orchestrates specialized agents to plan, research, build, and validate complex tasks — end-to-end, without supervision.
        </p>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
          <ConnectWalletButton variant="primary" />
          <button
            onClick={() => {
              const el = document.getElementById('demo');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="font-body font-semibold text-sm text-deep-blue bg-transparent border border-deep-blue/30 hover:bg-white hover:border-deep-blue/50 px-7 py-3 rounded-button transition-all duration-200"
          >
            View Live Demo
          </button>
        </div>

        {/* Stats */}
        <div
          ref={statsRef}
          className="flex items-center justify-center gap-0 max-w-[500px] mx-auto mb-8"
        >
          {[
            { value: '6', label: 'Specialized Agents' },
            { value: '100%', label: 'Real-time Streaming' },
            { value: '24/7', label: 'Always Active' },
          ].map((stat, i, arr) => (
            <div key={stat.label} className="flex items-center">
              <div className="px-6 md:px-8 text-center">
                <div className="font-body font-bold text-3xl md:text-4xl text-deep-blue tracking-tight">
                  {stat.value}
                </div>
                <div className="font-body font-medium text-xs tracking-wide text-deep-blue/50 uppercase mt-1">
                  {stat.label}
                </div>
              </div>
              {i < arr.length - 1 && (
                <div className="w-px h-10 bg-deep-blue/15" />
              )}
            </div>
          ))}
        </div>

        {/* Chain + Token Info */}
        <div ref={tokenRef} className="flex flex-wrap items-center justify-center gap-3">
          <div className="inline-flex items-center gap-2 bg-white border border-deep-blue/15 rounded-full px-4 py-2">
            <span className="font-body text-xs text-deep-blue/50 uppercase tracking-wide">Chain</span>
            <span className="font-body font-semibold text-sm text-deep-blue">Base L2</span>
            <span className="w-1.5 h-1.5 rounded-full bg-ocean" />
          </div>
          <div className="inline-flex items-center gap-2 bg-white border border-deep-blue/15 rounded-full px-4 py-2">
            <span className="font-body text-xs text-deep-blue/50 uppercase tracking-wide">CA</span>
            <span className="font-body text-sm text-deep-blue">TBA</span>
            <button
              onClick={handleCopyCA}
              className="p-1 hover:bg-deep-blue/5 rounded transition-colors"
              aria-label="Copy contract address"
            >
              <Copy className="w-3.5 h-3.5 text-deep-blue/50" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
