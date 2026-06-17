import { Search, Bell, PanelLeft } from "lucide-react";
import { useLocation } from "react-router-dom";

const pageNames: Record<string, string> = {
  "/": "Overview",
  "/products": "Products",
  "/agent-offices": "Agent Offices",
  "/server-room": "Server Room",
  "/finance": "Finance",
  "/support": "Support",
  "/growth": "Growth",
  "/users": "Users",
  "/releases": "Releases",
  "/mcp-hub": "MCP Hub",
  "/settings": "Settings",
};

type TopBarProps = {
  onOpenSidebar?: () => void;
};

export default function TopBar({ onOpenSidebar }: TopBarProps) {
  const location = useLocation();
  const pageName = pageNames[location.pathname] || "OS Command Center";

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-[#0f1420] border-b border-white/[0.06] flex-shrink-0 shadow-[inset_0_-1px_0_rgba(255,255,255,0.03)]">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="lg:hidden inline-flex items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.03] p-1.5 text-white/70 hover:bg-white/[0.06]"
          aria-label="Open sidebar menu"
        >
          <PanelLeft size={14} />
        </button>
        <h1 className="text-[13px] font-bold text-white/80">{pageName}</h1>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <span className="hidden sm:inline text-[9px] px-2 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium tracking-wider">
          DEMO MODE
        </span>
        <div className="hidden md:flex items-center gap-2 bg-white/[0.04] rounded-md px-3 py-1.5 border border-white/[0.08]">
          <Search size={12} className="text-white/20" />
          <input
            type="text"
            placeholder="Search users, tickets, agents..."
            className="bg-transparent text-[11px] text-white/60 placeholder:text-white/20 outline-none w-56"
          />
        </div>
        <button className="relative p-1.5 rounded-md hover:bg-white/[0.04] transition-colors">
          <Bell size={14} className="text-white/30" />
          <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-red-500" />
        </button>
        <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.08]">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/20 flex items-center justify-center">
            <span className="text-[8px] font-bold text-cyan-400">A</span>
          </div>
        </div>
      </div>
    </div>
  );
}

