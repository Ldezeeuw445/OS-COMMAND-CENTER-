import { useMemo, useState, type CSSProperties } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function Layout() {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const glowStyle = useMemo(
    () =>
      ({
        "--mx": `${pointer.x}px`,
        "--my": `${pointer.y}px`,
      }) as CSSProperties,
    [pointer.x, pointer.y],
  );

  return (
    <div className="app-shell flex h-[100dvh] min-h-[100dvh] w-screen overflow-hidden bg-[#0c1018]">
      <Sidebar className="hidden lg:flex" />
      <div
        className="relative flex flex-1 min-w-0 flex-col"
        onMouseMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          setPointer({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
          });
        }}
      >
        <div className="op-grid-overlay" style={glowStyle} />
        <div className="relative z-10 flex flex-1 min-h-0 flex-col">
          <TopBar onOpenSidebar={() => setMobileSidebarOpen(true)} />
          <main className="flex-1 overflow-hidden">
            <Outlet />
          </main>
        </div>
      </div>
      {mobileSidebarOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/55 backdrop-blur-[1px]"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Close sidebar menu"
          />
          <Sidebar
            className="relative z-10 h-full w-[82vw] max-w-[270px]"
            onNavigate={() => setMobileSidebarOpen(false)}
          />
        </div>
      ) : null}
    </div>
  );
}

