import { useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function Layout() {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [drawerOffset, setDrawerOffset] = useState(0);
  const [drawerDragging, setDrawerDragging] = useState(false);
  const dragStartXRef = useRef(0);
  const activePointerIdRef = useRef<number | null>(null);

  const drawerCloseThreshold = 72;

  function closeMobileSidebar() {
    setMobileSidebarOpen(false);
    setDrawerOffset(0);
    setDrawerDragging(false);
    activePointerIdRef.current = null;
  }

  function onDrawerPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "touch") return;
    activePointerIdRef.current = event.pointerId;
    dragStartXRef.current = event.clientX;
    setDrawerDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onDrawerPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!drawerDragging || activePointerIdRef.current !== event.pointerId) return;
    const delta = event.clientX - dragStartXRef.current;
    if (delta < 0) {
      setDrawerOffset(Math.min(260, Math.abs(delta)));
      return;
    }
    setDrawerOffset(0);
  }

  function onDrawerPointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    if (activePointerIdRef.current !== event.pointerId) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    const shouldClose = drawerOffset >= drawerCloseThreshold;
    if (shouldClose) {
      closeMobileSidebar();
      return;
    }
    setDrawerOffset(0);
    setDrawerDragging(false);
    activePointerIdRef.current = null;
  }

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
          <TopBar
            onOpenSidebar={() => {
              setDrawerOffset(0);
              setMobileSidebarOpen(true);
            }}
          />
          <main className="flex-1 overflow-hidden">
            <Outlet />
          </main>
        </div>
      </div>
      {mobileSidebarOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/55 backdrop-blur-[1px] transition-opacity"
            style={{ opacity: Math.max(0.25, 1 - drawerOffset / 200) }}
            onClick={closeMobileSidebar}
            aria-label="Close sidebar menu"
          />
          <div
            className={`relative z-10 h-full w-[82vw] max-w-[270px] ${drawerDragging ? "" : "transition-transform duration-200 ease-out"}`}
            style={{ transform: `translateX(-${drawerOffset}px)` }}
            onPointerDown={onDrawerPointerDown}
            onPointerMove={onDrawerPointerMove}
            onPointerUp={onDrawerPointerUp}
            onPointerCancel={onDrawerPointerUp}
          >
            <Sidebar className="h-full w-full" onNavigate={closeMobileSidebar} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

