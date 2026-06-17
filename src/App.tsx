import { HashRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { DataModeProvider } from "./lib/dataMode";
import { AuthProvider, useAuth } from "./lib/auth";
import Overview from "./pages/Overview";
import Products from "./pages/Products";
import AgentOffices from "./pages/AgentOffices";
import ServerRoom from "./pages/ServerRoom";
import Finance from "./pages/Finance";
import Support from "./pages/Support";
import Growth from "./pages/Growth";
import Users from "./pages/Users";
import Releases from "./pages/Releases";
import McpHub from "./pages/McpHub";
import Settings from "./pages/Settings";
import Login from "./pages/Login";

function GuardedApp() {
  const auth = useAuth();

  if (auth.loading) {
    return (
      <div className="min-h-[100dvh] w-full bg-[#0b101a] flex items-center justify-center text-sm text-white/55">
        Checking secure session...
      </div>
    );
  }

  if (!auth.authenticated) {
    return <Login />;
  }

  return (
    <DataModeProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Overview />} />
            <Route path="/products" element={<Products />} />
            <Route path="/agent-offices" element={<AgentOffices />} />
            <Route path="/server-room" element={<ServerRoom />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/support" element={<Support />} />
            <Route path="/growth" element={<Growth />} />
            <Route path="/users" element={<Users />} />
            <Route path="/releases" element={<Releases />} />
            <Route path="/mcp-hub" element={<McpHub />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </HashRouter>
    </DataModeProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <GuardedApp />
    </AuthProvider>
  );
}

