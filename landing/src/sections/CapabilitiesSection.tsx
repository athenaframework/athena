import { useScrollReveal } from '@/hooks/useScrollReveal';
import SectionHeader from '@/components/SectionHeader';
import CapabilityCard from '@/components/CapabilityCard';
import { Layers, Code, Radio, Cpu, Brain, FileCheck } from 'lucide-react';

const capabilities = [
  {
    icon: Layers,
    category: 'CORE',
    title: 'Multi-Agent Orchestration',
    description:
      'Agents are dynamically spawned and assigned roles, communicating through a shared context bus. No single point of failure.',
  },
  {
    icon: Code,
    category: 'LANGUAGE',
    title: 'Any Language, Any Stack',
    description:
      'Python, TypeScript, Rust, Go - Athena agents adapt to your stack and follow your project conventions automatically.',
  },
  {
    icon: Radio,
    category: 'STREAMING',
    title: 'Real-Time Streaming',
    description:
      'Watch agents think, plan, and code in real time. Every decision and output is streamed live to your workspace.',
  },
  {
    icon: Cpu,
    category: 'MODEL',
    title: 'OpenRouter Powered',
    description:
      'Use any LLM on OpenRouter - GPT-4o, Claude, Gemini, Mistral, Llama. Assign models per-agent for cost efficiency.',
  },
  {
    icon: Brain,
    category: 'MEMORY',
    title: 'Context-Aware Memory',
    description:
      'Agents maintain shared working memory across the full task. No context loss, no repeated work - coherent, cumulative progress.',
  },
  {
    icon: FileCheck,
    category: 'OUTPUT',
    title: 'Structured Output',
    description:
      'All agents produce structured, validated output - files, diffs, test results, or JSON - that integrates directly into your workflow.',
  },
];

export default function CapabilitiesSection() {
  const gridRef = useScrollReveal<HTMLDivElement>({
    y: 30,
    duration: 0.5,
    stagger: 0.08,
    start: 'top 80%',
    childSelector: '.capability-card',
  });

  return (
    <section className="relative py-section md:py-section px-4 bg-white overflow-hidden">
      <div className="relative z-10 max-w-[1200px] mx-auto">
        <div className="flex flex-col items-center mb-16">
          <SectionHeader
            label="CAPABILITIES"
            title="Built for real work"
            subtitle="Every feature is engineered for professional reliability and precision in real-world automation at scale."
          />
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {capabilities.map((cap) => (
            <div key={cap.title} className="capability-card">
              <CapabilityCard
                icon={cap.icon}
                category={cap.category}
                title={cap.title}
                description={cap.description}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
