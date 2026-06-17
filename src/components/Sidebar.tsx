import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Bot,
  Server,
  DollarSign,
  Headphones,
  TrendingUp,
  Users,
  GitBranch,
  Settings,
  ChevronRight,
  Zap,
  PlugZap,
} from "lucide-react";

type SidebarProps = {
  className?: string;
  onNavigate?: () => void;
};

const navSections = [
  {
    title: "PRODUCT ROOMS",
    items: [{ to: "/", icon: LayoutDashboard, label: "Overview" }],
  },
  {
    title: "OPERATIONS",
    items: [
      { to: "/products", icon: Package, label: "Products" },
      { to: "/agent-offices", icon: Bot, label: "Agent Offices" },
      { to: "/server-room", icon: Server, label: "Server Room" },
      { to: "/finance", icon: DollarSign, label: "Finance" },
      { to: "/support", icon: Headphones, label: "Support" },
    ],
  },
  {
    title: "GROWTH & USERS",
    items: [
      { to: "/growth", icon: TrendingUp, label: "Growth" },
      { to: "/users", icon: Users, label: "Users" },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      { to: "/releases", icon: GitBranch, label: "Releases" },
      { to: "/mcp-hub", icon: PlugZap, label: "MCP Hub" },
      { to: "/settings", icon: Settings, label: "Settings" },
    ],
  },
];

export default function Sidebar({ className = "", onNavigate }: SidebarProps) {
  return (
    <aside
      className={`w-[210px] h-full min-h-full self-stretch bg-[#0d1118] border-r border-white/[0.06] flex flex-col flex-shrink-0 shadow-[inset_-1px_0_0_rgba(255,255,255,0.03),inset_-2px_0_18px_rgba(6,182,212,0.18)] ${className}`}
    >
      <div className="px-3 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/20 flex items-center justify-center shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
            <Zap size={14} className="text-[#06b6d4]" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-white/80 tracking-wide">OS Command</div>
            <div className="text-[8px] tracking-wider text-white/30">CENTER</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-2.5 space-y-3 overflow-y-auto scrollbar-hide">
        {navSections.map((section) => (
          <div key={section.title}>
            <div className="px-2.5 mb-1 text-[8px] text-white/20 uppercase tracking-widest font-semibold">
              {section.title}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/"}
                    onClick={() => onNavigate?.()}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[11px] transition-all ${
                        isActive
                          ? "border border-cyan-400/30 bg-cyan-500/[0.08] text-cyan-300 shadow-[inset_0_0_0_1px_rgba(6,182,212,0.2)]"
                          : "text-white/45 hover:text-white/75 hover:bg-white/[0.03]"
                      }`
                    }
                  >
                    <Icon size={14} />
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-2 border-t border-white/[0.06]">
        <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-white/[0.03] cursor-pointer transition-colors">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/20 flex items-center justify-center">
            <span className="text-[8px] font-bold text-cyan-400">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] text-white/50 truncate">Administrator</div>
            <div className="text-[8px] text-white/25 truncate">Full Access</div>
          </div>
          <ChevronRight size={10} className="text-white/15" />
        </div>
        <div className="mt-1 px-2 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span className="text-[9px] text-white/30">All systems operational</span>
        </div>
      </div>
    </aside>
  );
}

