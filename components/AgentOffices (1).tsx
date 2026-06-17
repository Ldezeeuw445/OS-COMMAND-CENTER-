import {
  BarChart2, BookOpen, Globe, Shield, Terminal, Headphones,
  TrendingUp, CreditCard, Library, Activity, Settings
} from 'lucide-react';
import { useDataMode } from '../src/lib/dataMode';
import { useAssistantChat } from '../src/lib/hooks/useAssistantChat';

const agents = [
  {
    name: 'OS Command Core AI',
    desc: 'One central AI for global ops triage and routing',
    badge: 'GLOBAL CORE',
    lane: 'Core Ops',
    model: 'GPT-4o-mini',
    provider: 'OpenAI',
    prompt: 'v1.0.0',
    today: '2.420',
    success: '99.6%',
    successColor: 'green',
    latency: '72ms',
    cost: '$4.10',
    tools: 9,
    lastRun: '14:36',
    status: 'Active',
    statusColor: 'green',
  },
  {
    name: 'Trade Reviewer',
    desc: 'Pattern detection in trade history',
    badge: 'BOTH',
    lane: 'Trading / Risk',
    model: 'GPT-4o',
    provider: 'OpenAI',
    prompt: 'v2.4.1',
    today: '1.240',
    success: '98.2%',
    successColor: 'green',
    latency: '142ms',
    cost: '$12.40',
    tools: 5,
    lastRun: '14:32',
    status: 'Active',
    statusColor: 'green',
  },
  {
    name: 'Journal Coach',
    desc: 'Guided trade journaling',
    badge: 'AXE COMPANION',
    lane: 'Trading / Risk',
    model: 'GPT-4o',
    provider: 'OpenAI',
    prompt: 'v1.8.3',
    today: '892',
    success: '99.1%',
    successColor: 'green',
    latency: '98ms',
    cost: '$8.90',
    tools: 4,
    lastRun: '14:30',
    status: 'Active',
    statusColor: 'green',
  },
  {
    name: 'Market Context Agent',
    desc: 'Real-time market context delivery',
    badge: 'BOTH',
    lane: 'Trading / Risk',
    model: 'Claude 3.5',
    provider: 'Anthropic',
    prompt: 'v3.1.0',
    today: '743',
    success: '97.8%',
    successColor: 'green',
    latency: '203ms',
    cost: '$15.20',
    tools: 6,
    lastRun: '14:28',
    status: 'Active',
    statusColor: 'green',
  },
  {
    name: 'Risk Guardian',
    desc: 'Risk monitoring and alerting',
    badge: 'TRADING OS',
    lane: 'Trading / Risk',
    model: 'GPT-4o',
    provider: 'OpenAI',
    prompt: 'v2.0.2',
    today: '1.560',
    success: '99.5%',
    successColor: 'green',
    latency: '67ms',
    cost: '$6.20',
    tools: 4,
    lastRun: '14:33',
    status: 'Active',
    statusColor: 'green',
  },
  {
    name: 'Terminal Copilot',
    desc: 'In-terminal AI assistance',
    badge: 'TRADING OS',
    lane: 'Automation / Ops',
    model: 'GPT-4o',
    provider: 'OpenAI',
    prompt: 'v4.2.0',
    today: '2.100',
    success: '98.9%',
    successColor: 'green',
    latency: '89ms',
    cost: '$18.50',
    tools: 7,
    lastRun: '14:35',
    status: 'Active',
    statusColor: 'green',
  },
  {
    name: 'Support Agent',
    desc: 'User support automation',
    badge: 'BOTH',
    lane: 'Website / Support',
    model: 'GPT-4o-mini',
    provider: 'OpenAI',
    prompt: 'v1.3.5',
    today: '420',
    success: '94.5%',
    successColor: 'amber',
    latency: '340ms',
    cost: '$2.10',
    tools: 3,
    lastRun: '14:15',
    status: 'Active',
    statusColor: 'green',
    warning: 'Timeout',
    warningDesc: 'Response exceeded 30s threshold',
  },
  {
    name: 'Growth Assistant',
    desc: 'Growth analysis and recommendations',
    badge: 'ADMIN',
    lane: 'Growth / Marketing',
    model: 'GPT-4o',
    provider: 'OpenAI',
    prompt: 'v1.1.0',
    today: '180',
    success: '99%',
    successColor: 'green',
    latency: '112ms',
    cost: '$3.60',
    tools: 3,
    lastRun: '13:00',
    status: 'Active',
    statusColor: 'green',
  },
  {
    name: 'Billing Assistant',
    desc: 'Billing and subscription support',
    badge: 'BOTH',
    lane: 'Website / Support',
    model: 'GPT-4o-mini',
    provider: 'OpenAI',
    prompt: 'v1.0.4',
    today: '320',
    success: '99.2%',
    successColor: 'green',
    latency: '78ms',
    cost: '$1.60',
    tools: 3,
    lastRun: '14:05',
    status: 'Active',
    statusColor: 'green',
  },
  {
    name: 'Knowledge Curator',
    desc: 'Knowledge base management',
    badge: 'BOTH',
    lane: 'Automation / Ops',
    model: 'Claude 3.5',
    provider: 'Anthropic',
    prompt: 'v2.5.1',
    today: '95',
    success: '98.5%',
    successColor: 'green',
    latency: '245ms',
    cost: '$4.80',
    tools: 4,
    lastRun: '12:30',
    status: 'Active',
    statusColor: 'green',
  },
];

const iconMap: Record<string, React.ReactNode> = {
  'OS Command Core AI': <Terminal size={16} className="text-cyan-400" />,
  'Trade Reviewer': <BarChart2 size={16} className="text-cyan-400" />,
  'Journal Coach': <BookOpen size={16} className="text-cyan-400" />,
  'Market Context Agent': <Globe size={16} className="text-cyan-400" />,
  'Risk Guardian': <Shield size={16} className="text-cyan-400" />,
  'Terminal Copilot': <Terminal size={16} className="text-cyan-400" />,
  'Support Agent': <Headphones size={16} className="text-cyan-400" />,
  'Growth Assistant': <TrendingUp size={16} className="text-cyan-400" />,
  'Billing Assistant': <CreditCard size={16} className="text-cyan-400" />,
  'Knowledge Curator': <Library size={16} className="text-cyan-400" />,
};

export default function AgentOffices() {
  const { mode } = useDataMode();
  const panelStatus = mode === 'live' ? 'PENDING' : mode === 'hybrid' ? 'DEMO' : 'DEMO';
  const assistant = useAssistantChat();
  const lanes = ['Core Ops', 'Website / Support', 'Trading / Risk', 'Automation / Ops', 'Growth / Marketing'];
  const laneColors: Record<string, string> = {
    'Core Ops': 'text-cyan-300',
    'Website / Support': 'text-green-300',
    'Trading / Risk': 'text-amber-300',
    'Automation / Ops': 'text-purple-300',
    'Growth / Marketing': 'text-pink-300',
  };

  return (
    <div className="h-full overflow-y-auto scrollbar-hide p-4 space-y-4">
      <div className="panel" data-status="LIVE">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-xs font-semibold text-white/70">AI Assistant (Ops)</h3>
          <span className="text-[9px] text-white/35">
            Default model: <span className="font-mono text-white/50">gpt-4o-mini</span>
          </span>
        </div>
        <p className="mt-1 text-[10px] text-white/35">
          Ask for incident response, cost optimization, or health-check triage steps.
        </p>
        <form
          className="mt-2 flex flex-col gap-2 md:flex-row"
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget as HTMLFormElement;
            const input = form.elements.namedItem('assistantMessage') as HTMLInputElement | null;
            const message = input?.value?.trim() || '';
            if (!message) return;
            await assistant.ask(message);
          }}
        >
          <input
            name="assistantMessage"
            type="text"
            placeholder="e.g. Why is Cloudflare showing error and what should I fix first?"
            className="flex-1 rounded-md border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-[11px] text-white/70 placeholder:text-white/25 outline-none"
          />
          <button
            type="submit"
            disabled={assistant.loading}
            className="rounded-md border border-cyan-500/20 bg-cyan-500/10 px-3 py-2 text-[11px] text-cyan-300 disabled:opacity-50"
          >
            {assistant.loading ? 'Thinking…' : 'Ask Assistant'}
          </button>
        </form>
        {assistant.error ? (
          <p className="mt-2 text-[10px] text-red-300">{assistant.error}</p>
        ) : null}
        {assistant.reply ? (
          <div className="mt-2 rounded border border-white/[0.06] bg-white/[0.02] p-2">
            <p className="text-[9px] text-white/35">
              Reply via <span className="font-mono text-white/50">{assistant.model || 'unknown'}</span>
            </p>
            <p className="mt-1 whitespace-pre-wrap text-[10px] text-white/70">{assistant.reply}</p>
          </div>
        ) : null}
      </div>
      {(mode === 'live' || mode === 'hybrid') && (
        <div className="px-3 py-2 rounded-md bg-white/[0.02] border border-white/[0.04]">
          <span className="text-[11px] text-white/50">
            Agent Offices will stay <span className="text-white/70 font-semibold">PENDING</span> until AXE Core run logging exists. No runs are real yet.
          </span>
        </div>
      )}
      {/* Filters */}
      <div className="flex items-center gap-2">
        <select className="bg-white/[0.03] border border-white/[0.08] rounded-md px-3 py-1.5 text-[11px] text-white/60 outline-none">
          <option>All Products</option>
          <option>AXE Companion</option>
          <option>Trading OS</option>
        </select>
        <select className="bg-white/[0.03] border border-white/[0.08] rounded-md px-3 py-1.5 text-[11px] text-white/60 outline-none">
          <option>Today</option>
          <option>7 Days</option>
          <option>30 Days</option>
        </select>
        <select className="bg-white/[0.03] border border-white/[0.08] rounded-md px-3 py-1.5 text-[11px] text-white/60 outline-none">
          <option>All Agents</option>
          <option>Active</option>
          <option>Degraded</option>
        </select>
        <div className="flex-1" />
        <div className="flex items-center gap-2 bg-white/[0.03] rounded-md px-3 py-1.5 border border-white/[0.04]">
          <span className="text-white/20 text-[11px]">🔍</span>
          <input
            type="text"
            placeholder="Search users, tickets, agents..."
            className="bg-transparent text-[11px] text-white/60 placeholder:text-white/20 outline-none w-48"
          />
        </div>
        <button className="text-[10px] text-white/30 hover:text-white/50 flex items-center gap-1">
          ↻ Reset
        </button>
      </div>

      {/* Status badges */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> 8 ACTIVE
        </span>
        <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> 1 DEGRADED
        </span>
        <span className="text-[10px] px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> 0 OFFLINE
        </span>
      </div>

      {/* Agent Cards by lane */}
      {lanes.map((lane) => {
        const laneAgents = agents.filter((a) => a.lane === lane);
        if (laneAgents.length === 0) return null;
        return (
          <div key={lane} className="space-y-2">
            <h3 className={`text-[10px] uppercase tracking-wider ${laneColors[lane] || 'text-white/45'}`}>
              {lane}
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {laneAgents.map((agent) => (
                <div key={agent.name} className="panel" data-status={panelStatus}>
                  {/* Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-md bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                        {iconMap[agent.name]}
                      </div>
                      <div>
                        <h4 className="text-[12px] font-semibold text-white/80">{agent.name}</h4>
                        <p className="text-[9px] text-white/30">{agent.desc}</p>
                      </div>
                    </div>
                    <span className="text-[8px] px-2 py-0.5 rounded-full bg-white/[0.04] text-white/30 border border-white/[0.06]">
                      {agent.badge}
                    </span>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-3 gap-2 py-2 border-t border-white/[0.04]">
                    <div>
                      <div className="text-[8px] text-white/25 uppercase tracking-wider">Model</div>
                      <div className="text-[10px] text-white/60 mt-0.5">{agent.model}</div>
                    </div>
                    <div>
                      <div className="text-[8px] text-white/25 uppercase tracking-wider">Provider</div>
                      <div className="text-[10px] text-white/60 mt-0.5">{agent.provider}</div>
                    </div>
                    <div>
                      <div className="text-[8px] text-white/25 uppercase tracking-wider">Prompt</div>
                      <div className="text-[10px] text-white/60 mt-0.5">{agent.prompt}</div>
                    </div>
                    <div>
                      <div className="text-[8px] text-white/25 uppercase tracking-wider">Today</div>
                      <div className="text-[10px] text-white/60 mt-0.5">{agent.today}</div>
                    </div>
                    <div>
                      <div className="text-[8px] text-white/25 uppercase tracking-wider">Success</div>
                      <div className={`text-[10px] mt-0.5 ${agent.successColor === 'green' ? 'text-green-400' : 'text-amber-400'}`}>{agent.success}</div>
                    </div>
                    <div>
                      <div className="text-[8px] text-white/25 uppercase tracking-wider">Latency</div>
                      <div className="text-[10px] text-white/60 mt-0.5">{agent.latency}</div>
                    </div>
                    <div>
                      <div className="text-[8px] text-white/25 uppercase tracking-wider">Cost</div>
                      <div className="text-[10px] text-white/60 mt-0.5">{agent.cost}</div>
                    </div>
                    <div>
                      <div className="text-[8px] text-white/25 uppercase tracking-wider">Tools</div>
                      <div className="text-[10px] text-white/60 mt-0.5">{agent.tools}</div>
                    </div>
                    <div>
                      <div className="text-[8px] text-white/25 uppercase tracking-wider">Last Run</div>
                      <div className="text-[10px] text-white/60 mt-0.5">{agent.lastRun}</div>
                    </div>
                  </div>

                  {/* Warning */}
                  {'warning' in agent && (
                    <div className="mt-2 p-2 rounded bg-red-500/5 border border-red-500/10">
                      <div className="flex items-center gap-1.5">
                        <Activity size={10} className="text-red-400" />
                        <span className="text-[10px] text-red-400">{agent.warning}</span>
                      </div>
                      <p className="text-[8px] text-red-400/60 mt-0.5">{agent.warningDesc}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.04]">
                    <span className={`inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded ${
                      agent.statusColor === 'green'
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      <Activity size={10} /> {agent.status}
                    </span>
                    <button className="flex items-center gap-1 text-[9px] text-white/30 hover:text-white/50 px-2 py-0.5 rounded hover:bg-white/[0.03] transition-colors">
                      <Settings size={10} /> Open Office
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
