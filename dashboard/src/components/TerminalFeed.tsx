import React, { useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';

interface TerminalFeedProps {
  logs: string[];
  maxLines?: number;
}

export const TerminalFeed: React.FC<TerminalFeedProps> = ({
  logs,
  maxLines = 12,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  const displayLogs = logs.slice(-maxLines);

  return (
    <div className="glass-card rounded-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-deep-blue/10 bg-white/40">
        <Terminal size={15} className="text-teal" />
        <span className="text-[11px] font-body font-medium text-deep-blue/70 uppercase tracking-[2px]">
          Live Activity Feed
        </span>
      </div>

      <div
        ref={containerRef}
        className="h-48 overflow-y-auto p-4 font-mono text-xs text-deep-blue/80 space-y-1 scroll-smooth custom-scroll"
      >
        {displayLogs.length === 0 ? (
          <div className="text-deep-blue/40">&gt; Waiting for activity...</div>
        ) : (
          displayLogs.map((log, i) => {
            const isError = log.includes('[ERROR]') || /error|❌/i.test(log);
            const isSuccess = log.includes('[SUCCESS]') || /✓|✅|completed|success/i.test(log);
            const isWarning = log.includes('[WARNING]') || /warning|⚠/i.test(log);

            let textColor = 'text-deep-blue/75';
            if (isError) textColor = 'text-[#C75A5A]';
            if (isSuccess) textColor = 'text-leaf';
            if (isWarning) textColor = 'text-[#C49B5A]';

            return (
              <div key={i} className={`${textColor} truncate`}>
                <span className="text-deep-blue/30">{'>'}</span> {log}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
