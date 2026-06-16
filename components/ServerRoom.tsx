import {
  Activity,
  Database,
  Server,
  Terminal,
  Wifi,
} from 'lucide-react';
import { useDataMode } from '../src/lib/dataMode';
export default function ServerRoom() {
  const { mode } = useDataMode();
  const panelStatus = mode === 'live' ? 'LIVE' : 'PENDING';

  return (
    <div className="h-full overflow-y-auto scrollbar-hide p-4 space-y-4">
      <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-cyan-500/5 border border-cyan-500/15">
        <Server size={14} className="text-cyan-300" />
        <span className="text-[11px] text-cyan-300">
          Server Room is in real-only mode. Metrics appear automatically when integrations start returning telemetry.
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Latency', value: 'No data', icon: Wifi },
          { label: 'Error rate', value: 'No data', icon: Activity },
          { label: 'Service logs', value: 'No data', icon: Terminal },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="panel" data-status={panelStatus}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/45">{item.label}</span>
                <Icon size={12} className="text-white/45" />
              </div>
              <div className="mt-2 text-[12px] font-semibold text-white/70">{item.value}</div>
              <p className="mt-1 text-[9px] text-white/30">
                Connect runtime providers to populate this section.
              </p>
            </div>
          );
        })}
      </div>

      <div className="panel" data-status={panelStatus}>
        <h3 className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Telemetry Pipeline</h3>
        <div className="space-y-2 text-[10px] text-white/38">
          <p>1) Configure runtime secrets in `.env` or deploy secrets manager.</p>
          <p>2) Start local API bridge: <span className="font-mono text-white/60">npm run dev:api</span></p>
          <p>3) Run app: <span className="font-mono text-white/60">npm run dev</span></p>
          <p>4) Server Room starts showing real metrics once integrations respond.</p>
        </div>
        <div className="mt-3 rounded bg-white/[0.02] border border-white/[0.04] p-2 text-[10px] text-white/35">
          No runtime logs yet.
        </div>
      </div>
    </div>
  );
}
