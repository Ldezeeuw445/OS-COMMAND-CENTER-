import { Bell, Search } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useDataMode } from "../lib/dataMode";
import { DataModePill } from "./DataStatusPill";

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
  "/settings": "Settings",
};

export default function TopBar() {
  const location = useLocation();
  const pageName = pageNames[location.pathname] || "OS Command Center";
  const { mode } = useDataMode();

  return (
    <div className="flex flex-shrink-0 items-center justify-between border-b border-white/[0.04] bg-[#0d0d0d] px-4 py-2">
      <div className="flex items-center gap-3">
        <h1 className="text-[13px] font-bold text-white/80">{pageName}</h1>
      </div>

      <div className="flex items-center gap-3">
        <DataModePill mode={mode} />
        <div className="flex items-center gap-2 rounded-md border border-white/[0.04] bg-white/[0.03] px-3 py-1.5">
          <Search size={12} className="text-white/20" />
          <input
            type="text"
            placeholder="Search users, tickets, agents..."
            className="w-56 bg-transparent text-[11px] text-white/60 placeholder:text-white/20 outline-none"
          />
        </div>
        <button
          type="button"
          className="relative rounded-md p-1.5 transition-colors hover:bg-white/[0.04]"
        >
          <Bell size={14} className="text-white/30" />
          <span className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-red-500" />
        </button>
        <div className="flex items-center gap-2 rounded-md border border-white/[0.04] bg-white/[0.02] px-2 py-1">
          <div className="flex h-5 w-5 items-center justify-center rounded-full border border-cyan-500/20 bg-gradient-to-br from-cyan-500/20 to-purple-500/20">
            <span className="text-[8px] font-bold text-cyan-400">A</span>
          </div>
        </div>
      </div>
    </div>
  );
}

