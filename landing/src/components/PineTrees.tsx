import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface PineTreesProps {
  opacity?: number;
  className?: string;
}

export default function PineTrees({ opacity = 0.2, className = '' }: PineTreesProps) {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      [leftRef.current, rightRef.current].forEach((el) => {
        if (!el) return;
        gsap.to(el, {
          y: -30,
          ease: 'none',
          scrollTrigger: {
            trigger: el.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  const tree1 = (
    <svg viewBox="0 0 120 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <polygon points="60,0 10,70 40,70 5,130 35,130 0,190 120,190 85,130 115,130 80,70 110,70" fill="currentColor" />
      <rect x="50" y="190" width="20" height="10" fill="currentColor" />
    </svg>
  );

  const tree2 = (
    <svg viewBox="0 0 100 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <polygon points="50,0 5,60 30,60 0,110 25,110 0,170 100,170 75,110 100,110 70,60 95,60" fill="currentColor" />
      <rect x="42" y="170" width="16" height="10" fill="currentColor" />
    </svg>
  );

  const tree3 = (
    <svg viewBox="0 0 80 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <polygon points="40,0 5,50 25,50 0,95 20,95 0,145 80,145 60,95 80,95 55,50 75,50" fill="currentColor" />
      <rect x="33" y="145" width="14" height="8" fill="currentColor" />
    </svg>
  );

  return (
    <div className={`absolute bottom-0 left-0 right-0 pointer-events-none overflow-hidden ${className}`} style={{ height: '200px' }}>
      {/* Left cluster */}
      <div ref={leftRef} className="absolute bottom-0 left-0 flex items-end" style={{ opacity }}>
        <div className="w-24 h-40 text-sky-dark">{tree2}</div>
        <div className="w-16 h-28 text-sky-dark -ml-4">{tree3}</div>
        <div className="w-20 h-36 text-sky-dark -ml-6">{tree1}</div>
      </div>
      {/* Right cluster */}
      <div ref={rightRef} className="absolute bottom-0 right-0 flex items-end" style={{ opacity }}>
        <div className="w-20 h-36 text-sky-dark -mr-6">{tree1}</div>
        <div className="w-16 h-28 text-sky-dark -mr-4">{tree3}</div>
        <div className="w-24 h-40 text-sky-dark">{tree2}</div>
      </div>
    </div>
  );
}
