interface SectionHeaderProps {
  label: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
  labelColor?: string;
}

export default function SectionHeader({
  label,
  title,
  subtitle,
  align = 'center',
  labelColor = 'text-ocean',
}: SectionHeaderProps) {
  const alignClass = align === 'center' ? 'text-center items-center' : 'text-left items-start';

  return (
    <div className={`flex flex-col ${alignClass} max-w-2xl`}>
      <span
        className={`font-body font-medium text-xs tracking-[0.15em] uppercase ${labelColor} mb-4`}
      >
        {label}
      </span>
      <h2 className="font-display text-4xl md:text-5xl text-deep-blue leading-tight tracking-tight mb-5">
        {title}
      </h2>
      {subtitle && (
        <p className="font-body text-base md:text-lg text-deep-blue/50 leading-relaxed max-w-xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
