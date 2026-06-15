import { type LucideIcon } from 'lucide-react';

interface CapabilityCardProps {
  icon: LucideIcon;
  category: string;
  title: string;
  description: string;
}

export default function CapabilityCard({ icon: Icon, category, title, description }: CapabilityCardProps) {
  return (
    <div className="group bg-sky-pale border border-deep-blue/15 rounded-card p-8 transition-all duration-300 hover:bg-sky-light">
      <div className="w-12 h-12 rounded-full bg-sky-base flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-white">
        <Icon className="w-7 h-7 text-ocean" strokeWidth={1.5} />
      </div>
      <span className="font-body font-medium text-xs tracking-[0.15em] uppercase text-teal mb-3 block">
        {category}
      </span>
      <h3 className="font-body font-semibold text-xl text-deep-blue mb-2 tracking-tight">
        {title}
      </h3>
      <p className="font-body text-sm text-deep-blue/50 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
