import { NavLink } from "react-router-dom";
import {
  Bot,
  ChevronRight,
  DollarSign,
  GitBranch,
  Headphones,
  LayoutDashboard,
  Package,
  Server,
  Settings,
  TrendingUp,
  Users,
} from "lucide-react";

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
      { to: "/settings", icon: Settings, label: "Settings" },
    ],
  },
];

export default function Sidebar() {
  return (
    <div className="flex w-[210px] flex-shrink-0 flex-col border-r border-white/[0.04] bg-[#0d0d0d]">
      <div className="border-b border-white/[0.04] px-3 py-3">
        <div className="flex items-center gap-2">
          <img
            src="./axe-logo-square.png"
            alt="AXE logo"
            className="h-7 w-7 rounded border border-cyan-500/20 object-cover"
          />
          <div>
            <div className="text-[11px] font-bold tracking-wide text-white/80">
              AXE Command
            </div>
            <div className="text-[8px] tracking-wider text-white/30">CENTER</div>
          </div>
        </div>
      </div>

      <nav className="scrollbar-hide flex-1 space-y-3 overflow-y-auto p-2">
        {navSections.map((section) => (
          <div key={section.title}>
            <div className="mb-1 px-2.5 text-[8px] font-semibold uppercase tracking-widest text-white/20">
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
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[11px] transition-all ${
                        isActive
                          ? "border border-cyan-500/20 bg-cyan-500/10 text-cyan-400"
                          : "text-white/35 hover:bg-white/[0.02] hover:text-white/60"
                      }`
                    }
                  >
                    <Icon size={14} />
                    <span className="flex-1">{item.label}</span>
                    <ChevronRight size={12} className="text-white/10" />
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}

