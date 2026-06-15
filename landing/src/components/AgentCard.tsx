interface AgentCardProps {
  name: string;
  role: string;
  accentColor: string;
  description: string;
  tags: string[];
}

export default function AgentCard({ name, role, accentColor, description, tags }: AgentCardProps) {
  return (
    <div
      className="group bg-white border border-deep-blue/15 rounded-card p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover overflow-hidden"
      style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
    >
      {/* Colored top border */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] rounded-t-card"
        style={{ backgroundColor: accentColor }}
      />

      <h3 className="font-body font-semibold text-xl mb-1 tracking-tight" style={{ color: accentColor }}>
        {name}
      </h3>
      <span className="font-body font-medium text-xs tracking-[0.08em] uppercase text-deep-blue/50 mb-4 block">
        {role}
      </span>
      <p className="font-body text-sm text-deep-blue/50 leading-relaxed mb-5">
        {description}
      </p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="font-body font-medium text-xs tracking-wide text-deep-blue/50 bg-deep-blue/[0.08] px-2.5 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
