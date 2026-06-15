import { useEffect, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useDashboard } from './hooks/useDashboard';
import { useStore } from './hooks/useStore';
import { Send, Target, Users, Zap, Activity } from 'lucide-react';
import { TerminalFeed } from './components/TerminalFeed';
import { Scene3D } from './components/Scene3D';

const agentDisplayMap: Record<string, { display: string; role: string; color: string }> = {
  Oracle: { display: 'Oracle',  role: 'STRATEGIC PLANNER',    color: '#C49B5A' },
  Nexus:  { display: 'Nexus',   role: 'SYSTEM ARCHITECT',     color: '#7B8FC7' },
  Forge:  { display: 'Forge',   role: 'CODE ENGINEER',        color: '#5B9A5B' },
  Cipher: { display: 'Cipher',  role: 'TEST ENGINEER',        color: '#5A8AC7' },
  Aegis:  { display: 'Aegis',   role: 'QUALITY REVIEWER',     color: '#C75A5A' },
  // Legacy fallbacks (in case backend still emits old names mid-restart)
  Orchestrator: { display: 'Oracle',  role: 'STRATEGIC PLANNER',  color: '#C49B5A' },
  Architect:    { display: 'Nexus',   role: 'SYSTEM ARCHITECT',   color: '#7B8FC7' },
  Coder:        { display: 'Forge',   role: 'CODE ENGINEER',      color: '#5B9A5B' },
  Tester:       { display: 'Cipher',  role: 'TEST ENGINEER',      color: '#5A8AC7' },
  Scribe:       { display: 'Aegis',   role: 'QUALITY REVIEWER',   color: '#C75A5A' },
};

const lookupAgent = (name: string) => agentDisplayMap[name] || { display: name, role: 'AGENT', color: '#7BA3C4' };

export default function ATHENA() {
  const { state, connected, triggerGoal } = useDashboard();
  const { terminalLogs } = useStore();

  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, type: 'ai', text: 'ATHENA ready. Send a directive or pick a suggestion below.' },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const suggestedPrompts = [
    'Build a FastAPI hello world with tests',
    'Refactor my auth flow with JWT refresh tokens',
    'Generate Solidity ERC-20 contract on Base',
    'Write Python scraper for HN top stories',
  ];

  const activeAgents = state.agents?.filter((a) => a.status === 'working').length || 0;
  const totalAgents = state.agents?.length || 0;

  const overallProgress = state.agents?.length
    ? Math.round(state.agents.reduce((sum, agent) => sum + agent.progress, 0) / state.agents.length)
    : 0;

  const timeLeft = state.time_remaining_seconds ?? 0;
  const isRunning = state.task_running;
  const timerDisplay = isRunning || state.task_completed
    ? `${Math.floor(timeLeft / 60)}m ${timeLeft % 60}s ${state.task_completed ? '(DONE)' : 'left'}`
    : 'Idle';

  const realArtifacts = state.real_artifacts || [];
  const realOutput = state.real_result || '';

  const liveTasks = (state.agents || []).map((agent) => ({
    title: agent.current_task || `${lookupAgent(agent.name).display} is idle`,
    category: lookupAgent(agent.name).display,
    progress: agent.progress || 0,
    status: agent.status === 'working' ? 'active' : 'idle',
  }));

  const detectAssistantMode = (text: string) => {
    const normalized = text.trim().toLowerCase();
    const taskStart = /^(run|create|build|start|stop|deploy|fix|check|open|write|generate|implement|configure|install|update|refactor|review|clean|execute|setup|prepare|design|analyze|optimize|train|launch|schedule|enable|disable|compile)/;
    const chatStart = /^(what|who|how|why|when|where|is|are|can|should|could|would|will|tell|explain|describe|hi|hello|hey|thanks|thank you|please)/;
    const isQuestion = normalized.endsWith('?') || chatStart.test(normalized);
    const hasTaskTrigger = taskStart.test(normalized) || normalized.includes('task') || normalized.includes('goal');
    if (isQuestion && !hasTaskTrigger) return 'chat';
    if (hasTaskTrigger) return 'task';
    if (chatStart.test(normalized) && !taskStart.test(normalized)) return 'chat';
    return 'task';
  };

  const combinedLogs = [
    ...(state.logs || []),
    ...terminalLogs.filter((log) => !(state.logs || []).includes(log)),
  ].slice(-18);

  const latestUpdate = combinedLogs.length > 0 ? combinedLogs[combinedLogs.length - 1] : 'No updates yet';

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const goal = chatInput.trim();
    const mode = detectAssistantMode(goal);
    setChatMessages((prev) => [...prev, { id: Date.now(), type: 'user', text: goal }]);
    setChatInput('');
    try {
      await triggerGoal(goal, mode);
    } catch (err) { console.error(err); }
    setIsTyping(true);
    setTimeout(() => {
      const responseText = mode === 'task'
        ? `Directive received. Athena is dispatching the swarm.`
        : `Got it. Athena is thinking it through.`;
      setChatMessages((prev) => [...prev, { id: Date.now() + 1, type: 'ai', text: responseText }]);
      setIsTyping(false);
    }, 700);
  };

  // Map backend agents to Scene3D format with Athena colors
  const sceneAgents = (state.agents || []).map((a) => ({
    ...a,
    color: lookupAgent(a.name).color,
  }));

  return (
    <div className="min-h-screen w-full flex flex-col font-body text-deep-blue">
      {/* HEADER */}
      <header className="h-16 flex-shrink-0 border-b border-deep-blue/10 glass z-50">
        <div className="h-full max-w-[1600px] mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="font-display text-3xl tracking-[-1px] text-deep-blue">ATHENA</div>
            <div className="inline-flex items-center gap-2 bg-teal/10 border border-teal/25 rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse-dot" />
              <span className="font-body font-medium text-[11px] tracking-wide text-teal">LIVE</span>
            </div>
          </div>
          <div className={`px-3 py-1 text-[11px] font-mono tracking-[2px] rounded-full border ${
            connected
              ? 'bg-leaf/10 border-leaf/40 text-leaf'
              : 'bg-[#C75A5A]/10 border-[#C75A5A]/40 text-[#C75A5A]'
          }`}>
            {connected ? 'CONNECTED' : 'OFFLINE'}
          </div>
        </div>
      </header>

      {/* TOP GRID — 3D Hero (left) + Assistant Chat (right) */}
      <div className="px-4 py-4 md:px-6 md:py-6">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-4 md:gap-6">
          {/* 3D SCENE — hero */}
          <div className="glass-card rounded-card overflow-hidden h-[460px] md:h-[560px] athena-canvas-bg relative">
            {/* Top overlay row */}
            <div className="absolute top-3 left-4 right-4 z-10 flex items-start justify-between pointer-events-none">
              <div className="flex flex-col">
                <span className="text-[10px] font-mono tracking-[3px] text-deep-blue/60">THE SWARM</span>
                <span className="font-display text-base text-deep-blue/80 mt-0.5">
                  Athena agent constellation
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/70 border border-deep-blue/15 rounded-full px-3 py-1 shadow-card">
                <span className={`w-1.5 h-1.5 rounded-full ${activeAgents > 0 ? 'bg-leaf animate-pulse-dot' : 'bg-deep-blue/30'}`} />
                <span className="text-[10px] font-mono tracking-[2px] text-deep-blue/70">
                  {activeAgents}/{totalAgents} ACTIVE
                </span>
              </div>
            </div>

            {/* Vignette overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle at 50% 45%, transparent 55%, rgba(43, 74, 110, 0.18) 100%)',
              }}
            />

            <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
              <Suspense fallback={null}>
                <Scene3D agents={sceneAgents} activitiesLog={combinedLogs} />
              </Suspense>
            </Canvas>

            {/* Bottom-left: agent legend */}
            <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
              <div className="glass-card rounded-card px-3 py-2 flex flex-wrap items-center gap-3 pointer-events-auto">
                {sceneAgents.map((a) => (
                  <div key={a.name} className="flex items-center gap-1.5 text-[10px] font-mono tracking-wide text-deep-blue/75">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: a.color }} />
                    {a.name}
                  </div>
                ))}
              </div>
              <div className="hidden md:block text-[10px] font-mono tracking-[2px] text-deep-blue/40 pointer-events-none">
                CLICK · DRAG · SCROLL
              </div>
            </div>
          </div>

          {/* ASSISTANT CHAT */}
          <div className="flex flex-col glass-card rounded-card overflow-hidden h-[460px] md:h-[520px]">
            <div className="px-4 py-3 border-b border-deep-blue/10 flex items-center gap-2 flex-shrink-0">
              <Zap className="w-4 h-4 text-ocean" />
              <span className="font-body font-medium text-sm tracking-wide text-deep-blue">ATHENA ASSISTANT</span>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto custom-scroll p-4 space-y-3 text-sm">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={msg.type === 'user' ? 'text-right' : ''}>
                  <div className={`inline-block max-w-[88%] px-4 py-2 rounded-2xl text-[13.5px] ${
                    msg.type === 'user'
                      ? 'gradient-cta text-white shadow-cta'
                      : 'bg-white/70 border border-deep-blue/10 text-deep-blue'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && <div className="text-deep-blue/50 text-xs">Athena is thinking…</div>}

              {/* Suggested prompts — only show if conversation hasn't really started */}
              {chatMessages.length <= 1 && !isTyping && (
                <div className="pt-2 space-y-2">
                  <div className="text-[10px] font-mono tracking-[2px] text-deep-blue/40 uppercase">
                    Try a directive
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {suggestedPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => setChatInput(prompt)}
                        className="text-left text-xs text-deep-blue/75 bg-white/50 hover:bg-white border border-deep-blue/10 hover:border-ocean/40 rounded-lg px-3 py-2 transition-all"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <form onSubmit={handleSend} className="p-3 border-t border-deep-blue/10 flex-shrink-0">
              <div className="flex gap-2">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Give a directive to Athena…"
                  className="flex-1 bg-white border border-deep-blue/15 rounded-button px-4 py-2 text-sm focus:outline-none focus:border-ocean focus:ring-2 focus:ring-ocean/20 text-deep-blue placeholder:text-deep-blue/40"
                />
                <button type="submit" className="px-4 rounded-button gradient-cta hover:gradient-cta-hover text-white transition-all hover:shadow-cta">
                  <Send size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* STATS BAR */}
      <div className="px-4 md:px-6">
        <div className="max-w-[1600px] mx-auto grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
          {[
            { label: 'Active Agents', value: `${activeAgents}/${totalAgents}`, icon: Users },
            { label: 'Tasks Completed', value: state.tasks_completed || 0, icon: Activity },
            { label: 'Skills Created', value: state.skills_created || 0, icon: Zap },
            { label: 'Token Usage', value: (state.token_usage || 0).toLocaleString(), icon: Target },
            { label: 'Task Timer', value: timerDisplay, icon: Activity },
          ].map((m, i) => (
            <div key={i} className="glass-card rounded-card p-4">
              <div className="flex items-center gap-2 text-[10px] font-mono tracking-[2px] text-deep-blue/50 uppercase">
                <m.icon className="w-3.5 h-3.5" />
                {m.label}
              </div>
              <div className="mt-2 font-body font-bold text-2xl text-deep-blue truncate">{m.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM GRID — Operations / Outputs / Logs */}
      <div className="px-4 py-6 md:px-6">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* ACTIVE OPERATIONS */}
          <div className="flex flex-col min-h-0">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-ocean" />
              <h2 className="font-display text-xl text-deep-blue">Active Operations</h2>
              <span className="ml-auto text-[10px] font-mono tracking-[2px] text-deep-blue/50">
                LIVE · {liveTasks.length}
              </span>
            </div>
            <div className="glass-card rounded-card p-3 space-y-2">
              {liveTasks.length > 0 ? liveTasks.map((task, i) => {
                const agentMeta = lookupAgent(task.category);
                return (
                  <div
                    key={i}
                    className={`p-3 rounded-lg border text-sm transition-all ${
                      task.status === 'active'
                        ? 'border-ocean/40 bg-ocean/5'
                        : 'border-deep-blue/10 bg-white/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-deep-blue font-medium">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: agentMeta.color }} />
                      {task.title}
                    </div>
                    <div className="flex justify-between text-[11px] mt-1 text-deep-blue/55 font-mono">
                      <span>{task.category}</span>
                      <span>{task.progress}%</span>
                    </div>
                    <div className="mt-2 h-1 rounded-full bg-deep-blue/10 overflow-hidden">
                      <div className="h-full transition-all duration-300"
                        style={{ width: `${task.progress}%`, backgroundColor: agentMeta.color }} />
                    </div>
                  </div>
                );
              }) : (
                <div className="text-deep-blue/40 text-sm py-6 text-center">No active operations</div>
              )}
            </div>
          </div>

          {/* SWARM STATUS + REAL OUTPUT */}
          <div className="flex flex-col min-h-0 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-teal" />
              <h2 className="font-display text-xl text-deep-blue">Swarm Status</h2>
              <span className="ml-auto text-[10px] font-mono tracking-[2px] text-deep-blue/50">
                {overallProgress}% OVERALL
              </span>
            </div>
            <div className="glass-card rounded-card p-3 space-y-3">
              {(state.agents || []).length > 0 ? state.agents.map((agent, i) => {
                const meta = lookupAgent(agent.name);
                return (
                  <div key={i} className="pb-3 last:pb-0 border-b border-deep-blue/8 last:border-none">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-deep-blue text-sm">{meta.display}</div>
                        <div className="text-[10px] font-mono tracking-[1.5px] text-deep-blue/45">
                          {meta.role}
                        </div>
                      </div>
                      <div className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: meta.color + '20', color: meta.color }}>
                        {agent.status}
                      </div>
                    </div>
                    <div className="text-xs text-deep-blue/60 mt-1.5">
                      {agent.current_task || '—'}
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-deep-blue/8 overflow-hidden">
                      <div className="h-full transition-all duration-500"
                        style={{ width: `${agent.progress}%`, backgroundColor: meta.color }} />
                    </div>
                  </div>
                );
              }) : (
                <div className="text-deep-blue/40 text-sm">No agents connected</div>
              )}
            </div>

            {/* REAL OUTPUT */}
            {(realArtifacts.length > 0 || realOutput) && (
              <div className="glass-card rounded-card p-4">
                <div className="text-[10px] font-mono tracking-[2px] text-deep-blue/50 uppercase mb-2">
                  Real Task Output
                </div>
                {realArtifacts.length > 0 && (
                  <div className="space-y-1 mb-2">
                    {realArtifacts.slice(0, 4).map((f, i) => (
                      <div key={i} className="text-xs font-mono text-leaf">→ {f}</div>
                    ))}
                  </div>
                )}
                {realOutput && (
                  <div className="text-xs font-mono text-deep-blue/70 bg-white/40 rounded p-2 max-h-24 overflow-auto custom-scroll">
                    {realOutput.slice(0, 320)}{realOutput.length > 320 ? '…' : ''}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* LIVE LOGS */}
          <div className="flex flex-col min-h-0 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-leaf" />
              <h2 className="font-display text-xl text-deep-blue">Activity</h2>
              <span className="ml-auto text-[10px] font-mono tracking-[2px] text-deep-blue/50">
                LATEST
              </span>
            </div>
            <div className="glass-card rounded-card p-4">
              <div className="text-[10px] font-mono tracking-[2px] text-deep-blue/40 uppercase">
                Latest update
              </div>
              <div className="mt-1.5 text-sm text-deep-blue/80 leading-relaxed">
                {latestUpdate}
              </div>
            </div>
            <TerminalFeed logs={combinedLogs} maxLines={14} />
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="mt-auto px-6 py-4 border-t border-deep-blue/10 text-center">
        <div className="text-[11px] font-mono tracking-[2px] text-deep-blue/40">
          ATHENA · OPERATING SYSTEM FOR AUTONOMOUS AGENTS
        </div>
      </footer>
    </div>
  );
}
