import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PineTrees from '@/components/PineTrees';
import ConnectWalletButton from '@/components/ConnectWalletButton';

gsap.registerPlugin(ScrollTrigger);

const promptExamples = [
  'Build a REST API with JWT auth in Node.js',
  'Create a React data table with sorting and filters',
  'Design a microservice architecture for e-commerce',
  'Write Python scrapers for real-time price tracking',
  'Build a full authentication system with refresh tokens',
  'Set up a CI/CD pipeline with GitHub Actions',
];

export default function WorkspaceCTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        scale: 0.95,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(1.4)',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
      });

      if (contentRef.current) {
        gsap.from(contentRef.current.children, {
          y: 20,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          delay: 0.3,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-36 px-4 bg-sky-dark overflow-hidden"
    >
      <PineTrees opacity={0.08} />

      <div className="relative z-10 max-w-[800px] mx-auto">
        <div
          ref={cardRef}
          className="glass-card rounded-3xl px-6 md:px-12 py-12 md:py-16 text-center"
        >
          <div ref={contentRef}>
            <span className="font-body font-medium text-xs tracking-[0.15em] uppercase text-white/70 mb-4 block">
              WORKSPACE
            </span>

            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-4">
              Start working with your agents
            </h2>

            <p className="font-body text-base md:text-lg text-white/80 leading-relaxed max-w-[560px] mx-auto mb-8">
              Connect your wallet on Base to access the full Athena workspace — a three-panel AI operating environment with persistent memory, skills, and treasury rewards.
            </p>

            {/* Prompt Tags */}
            <div className="flex flex-wrap justify-center gap-2.5 mb-8">
              {promptExamples.map((prompt) => (
                <span
                  key={prompt}
                  className="font-body text-xs md:text-sm text-white/90 bg-white/[0.12] border border-white/25 rounded-full px-4 py-2"
                >
                  {prompt}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <ConnectWalletButton variant="white" />
              <button className="font-body font-semibold text-sm text-white bg-transparent border border-white/40 hover:bg-white/10 px-7 py-3 rounded-button transition-all duration-200">
                Learn more
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
