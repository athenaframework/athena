import { useScrollReveal } from '@/hooks/useScrollReveal';
import SectionHeader from '@/components/SectionHeader';
import ProcessCard from '@/components/ProcessCard';
import PineTrees from '@/components/PineTrees';

const steps = [
  {
    step: '01',
    category: 'INTAKE',
    title: 'Submit a Task',
    description:
      'Describe your objective in plain language. Athena parses intent, extracts structured requirements, and dispatches the task to the agent swarm.',
  },
  {
    step: '02',
    category: 'DESIGN',
    title: 'Nexus Architects',
    description:
      'Nexus analyzes the goal and produces a complete system design - technology selection, component structure, and agent workflow.',
  },
  {
    step: '03',
    category: 'PLAN',
    title: 'Oracle Plans',
    description:
      'Oracle converts the architecture into an ordered execution plan with dependency mapping, sequencing, and clear success criteria per step.',
  },
  {
    step: '04',
    category: 'BUILD',
    title: 'Forge Builds',
    description:
      'Forge writes production-grade code, streamed token-by-token. Every file, function, and integration follows the plan precisely.',
  },
  {
    step: '05',
    category: 'REVIEW',
    title: 'Aegis Reviews',
    description:
      'Aegis audits the implementation against security, quality, and correctness standards. Actionable fixes are proposed and applied.',
  },
  {
    step: '06',
    category: 'VALIDATE',
    title: 'Cipher Validates',
    description:
      'Cipher designs and runs a full test suite. Edge cases, regressions, and coverage gaps are resolved before final delivery.',
  },
];

export default function ProcessSection() {
  const gridRef = useScrollReveal<HTMLDivElement>({
    y: 40,
    duration: 0.6,
    stagger: 0.1,
    start: 'top 80%',
    childSelector: '.process-card',
  });

  return (
    <section id="features" className="relative py-section md:py-section px-4 bg-sky-light overflow-hidden">
      <PineTrees opacity={0.15} />

      <div className="relative z-10 max-w-[1200px] mx-auto">
        <div className="flex flex-col items-center mb-16">
          <SectionHeader
            label="PROCESS"
            title="How Athena works"
            subtitle="Six specialized agents work in sequence, each handing context to the next, to deliver complete, validated solutions."
          />
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {steps.map((s) => (
            <div key={s.step} className="process-card">
              <ProcessCard
                step={s.step}
                category={s.category}
                title={s.title}
                description={s.description}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
