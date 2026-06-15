import { useEffect, useRef } from 'react';

interface Leaf {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  swayAmp: number;
  swayFreq: number;
  swayPhase: number;
  opacity: number;
  rotation: number;
  rotSpeed: number;
  color: string;
}

interface LeafParticlesProps {
  count?: number;
  className?: string;
}

export default function LeafParticles({ count = 50, className = '' }: LeafParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const leavesRef = useRef<Leaf[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();

    const colors = [
      'rgba(43, 74, 110, 0.12)',
      'rgba(43, 74, 110, 0.18)',
      'rgba(74, 144, 194, 0.10)',
      'rgba(74, 144, 194, 0.15)',
      'rgba(61, 139, 139, 0.10)',
    ];

    const rect = canvas.getBoundingClientRect();
    leavesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      size: 4 + Math.random() * 5,
      speedY: 0.2 + Math.random() * 0.5,
      speedX: (Math.random() - 0.5) * 0.15,
      swayAmp: 15 + Math.random() * 25,
      swayFreq: 0.0005 + Math.random() * 0.001,
      swayPhase: Math.random() * Math.PI * 2,
      opacity: 0.3 + Math.random() * 0.4,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.01,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      leavesRef.current.forEach((leaf) => {
        leaf.y += leaf.speedY;
        leaf.x += leaf.speedX + Math.sin(Date.now() * leaf.swayFreq + leaf.swayPhase) * 0.15;
        leaf.rotation += leaf.rotSpeed;

        if (leaf.y > rect.height + 10) {
          leaf.y = -10;
          leaf.x = Math.random() * rect.width;
        }
        if (leaf.x < -20) leaf.x = rect.width + 20;
        if (leaf.x > rect.width + 20) leaf.x = -20;

        ctx.save();
        ctx.translate(leaf.x, leaf.y);
        ctx.rotate(leaf.rotation);
        ctx.globalAlpha = leaf.opacity;
        ctx.fillStyle = leaf.color;

        // Draw leaf shape (ellipse)
        ctx.beginPath();
        ctx.ellipse(0, 0, leaf.size * 0.6, leaf.size, 0, 0, Math.PI * 2);
        ctx.fill();

        // Leaf vein line
        ctx.strokeStyle = leaf.color;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, -leaf.size * 0.7);
        ctx.lineTo(0, leaf.size * 0.7);
        ctx.stroke();

        ctx.restore();
      });

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
