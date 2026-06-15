interface ProcessCardProps {
  step: string;
  category: string;
  title: string;
  description: string;
}

export default function ProcessCard({ step, category, title, description }: ProcessCardProps) {
  return (
    <div className="group bg-white border border-deep-blue/15 rounded-card p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover hover:border-ocean/30">
      <div className="flex items-start justify-between mb-4">
        <span className="font-display text-5xl text-ocean/25 leading-none">{step}</span>
        <span className="font-body font-medium text-xs tracking-[0.15em] uppercase text-teal mt-2">
          {category}
        </span>
      </div>
      <h3 className="font-body font-semibold text-xl text-deep-blue mb-2 tracking-tight">
        {title}
      </h3>
      <p className="font-body text-sm text-deep-blue/50 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
