import { Cpu, Database, GitBranch, Server, Shield } from 'lucide-react';
import { useDataMode } from '../src/lib/dataMode';
import { integrations } from '../src/lib/integrations';
import { useIntegrationStatuses } from '../src/lib/hooks/useIntegrationStatuses';
import { AdapterStatusPill } from '../src/components/DataStatusPill';

export default function Overview() {
  const { mode } = useDataMode();
  const integrationApi = useIntegrationStatuses(mode);
  const panelStatus = 'LIVE';

  return (
    <div className="h-full overflow-y-auto scrollbar-hide p-4 space-y-4">
      <div className="px-3 py-2 rounded-md bg-cyan-500/5 border border-cyan-500/15">
        <span className="text-[11px] text-cyan-300">
          Real mode only. This dashboard shows live integration status and real data only. No mock data is rendered.
        </span>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {[
          { label: 'Data Mode', value: 'LIVE', icon: Shield },
          { label: 'Integrations', value: `${integrations.length}`, icon: Database },
          { label: 'AXE Core Link', value: 'Configured via API', icon: Cpu },
          { label: 'Runtime Links', value: 'AXE + Platforms', icon: Server },
          { label: 'Release Stream', value: 'GitHub/Vercel', icon: GitBranch },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="panel" data-status={panelStatus}>
              <div className="flex items-center justify-between">
                <span className="text-[9px] uppercase tracking-wider text-white/35">{card.label}</span>
                <Icon size={12} className="text-white/45" />
              </div>
              <div className="mt-2 text-[13px] font-semibold text-white/80">{card.value}</div>
            </div>
          );
        })}
      </div>

      <div className="panel" data-status={panelStatus}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold text-white/70">Live Integration Status</h3>
          {integrationApi.loading ? <span className="text-[9px] text-white/35">Refreshing…</span> : null}
        </div>
        <div className="grid grid-cols-5 gap-2 text-[9px] text-white/30 uppercase tracking-wider mb-2 px-2">
          <span>Name</span>
          <span>Scope</span>
          <span>Status</span>
          <span>Source</span>
          <span>Message</span>
        </div>
        {integrations.map((it) => {
          const api = integrationApi.ordered.find((x) => x.id === it.id)?.api ?? null;
          return (
            <div key={it.id} className="grid grid-cols-5 gap-2 items-center py-2 border-t border-white/[0.04] px-2">
              <span className="text-[11px] text-white/60">{it.label}</span>
              <span className="text-[10px] text-white/35">{it.scope}</span>
              <div>{api ? <AdapterStatusPill result={api} /> : <span className="text-[9px] text-white/30">pending</span>}</div>
              <span className="text-[9px] font-mono text-white/35">{api?.source ?? 'oscc-api'}</span>
              <span className="text-[9px] text-white/28">{api?.error ?? 'No data returned yet.'}</span>
            </div>
          );
        })}
        {integrationApi.error ? (
          <div className="mt-3 text-[10px] text-red-300">API error: {integrationApi.error}</div>
        ) : null}
      </div>

      <div className="panel" data-status={panelStatus}>
        <h3 className="text-xs font-semibold text-white/70">Operational Feed</h3>
        <p className="mt-2 text-[10px] text-white/35">
          No operational events are available yet. As soon as AXE Companion / AXE Core endpoints are connected,
          this stream will show real incidents, sync alerts, and deployment telemetry.
        </p>
      </div>
    </div>
  );
}
