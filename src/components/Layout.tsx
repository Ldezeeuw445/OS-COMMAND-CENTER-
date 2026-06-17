import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function Layout() {
  return (
    <div className="app-shell flex h-[100dvh] min-h-[100dvh] w-screen overflow-hidden bg-[#0f1115]">
      <Sidebar />
      <div className="flex flex-1 min-w-0 flex-col">
        <TopBar />
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

