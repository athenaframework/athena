import { useScrollReveal } from '@/hooks/useScrollReveal';
import SectionHeader from '@/components/SectionHeader';
import AgentCard from '@/components/AgentCard';
import LeafParticles from '@/components/LeafParticles';

const agents = [
  {
    name: 'Nexus',
    role: 'SYSTEM ARCHITECT',
    accentColor: '#7B8FC7',
    description:
      'Analyzes objectives and decomposes complex requirements into structured components. Designs system architecture, selects technology stack, and orchestrates the agent workflow.',
    tags: ['Architecture Design', 'System Decomposition', 'Tech Stack Selection', 'Agent Orchestration'],
  },
  {
    name: 'Oracle',
    role: 'STRATEGIC PLANNER',
    accentColor: '#C49B5A',
    description:
      'Transforms architectural blueprints into concrete, sequenced execution plans. Maps task dependencies, optimizes delivery order, and ensures every step has clear success criteria.',
    tags: ['Execution Planning', 'Dependency Mapping', 'Priority Sequencing', 'Progress Tracking'],
  },
  {
    name: 'Forge',
    role: 'CODE ENGINEER',
    accentColor: '#5B9A5B',
    description:
      'Produces production-grade implementations based on the plan. Writes clean, well-commented multi-language code and integrates all components into a cohesive, working system.',
    tags: ['Code Generation', 'Multi-Language Support', 'Framework Integration', 'API Development'],
  },
  {
    name: 'Aegis',
    role: 'QUALITY REVIEWER',
    accentColor: '#C75A5A',
    description:
      'Conducts rigorous audits of every implementation. Identifies vulnerabilities, validates best practices, provides actionable recommendations, and signs off on production readiness.',
    tags: ['Code Audit', 'Security Analysis', 'Standards Validation', 'Optimization Review'],
  },
  {
    name: 'Cipher',
    role: 'TEST ENGINEER',
    accentColor: '#5A8AC7',
    description:
      'Designs and executes comprehensive test suites to validate every requirement. Detects edge cases, ensures full coverage, and reports quality metrics back to the pipeline.',
    tags: ['Test Suite Design', 'Edge Case Detection', 'Regression Testing', 'Coverage Reporting'],
  },
  {
    name: 'Trace',
    role: 'DEBUGGING SPECIALIST',
    accentColor: '#8B6BC7',
    description:
      'Investigates failures with surgical precision. Traces root causes through logs and stack traces, proposes targeted fixes, and tunes system performance in collaboration with Forge.',
    tags: ['Root Cause Analysis', 'Stack Diagnostics', 'Fix Synthesis', 'Performance Tuning'],
  },
];

export default function AgentsSection() {
  const gridRef = useScrollReveal<HTMLDivElement>({
    y: 50,
    duration: 0.7,
    stagger: 0.12,
    ease: 'back.out(1.4)',
    start: 'top 75%',
    childSelector: '.agent-card',
  });

  return (
    <section id="agents" className="relative py-section md:py-section px-4 bg-sky-base overflow-hidden">
      <LeafParticles count={20} />

      <div className="relative z-10 max-w-[1200px] mx-auto">
        <div className="flex flex-col items-center mb-16">
          <SectionHeader
            label="THE SWARM"
            title="Meet the agents"
            subtitle="Six specialized agents, each with a distinct role and expertise, collaborating in sequence to deliver complete solutions."
          />
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {agents.map((agent) => (
            <div key={agent.name} className="agent-card">
              <AgentCard
                name={agent.name}
                role={agent.role}
                accentColor={agent.accentColor}
                description={agent.description}
                tags={agent.tags}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
