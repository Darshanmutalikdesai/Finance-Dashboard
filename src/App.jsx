import React, { lazy, Suspense } from "react";

//  CHART.JS REGISTRATION
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Filler, Tooltip, Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Filler, Tooltip, Legend
);

//  IMPORTS
import { AppProvider, useApp, useTheme } from "./context/AppContext";
import { G_CSS }                         from "./constants/globalStyles";

import Sidebar                           from "./components/Sidebar";
import { MobileHeader, BottomNav }       from "./components/MobileNav";
import TopBar                            from "./components/TopBar";
import LoginModal                        from "./components/LoginModal";
import AddModal                          from "./components/AddModal";

//  LAZY PAGES — each bundle is only fetched when first navigated to
const DashboardPage     = lazy(() => import("./pages/DashboardPage"));
const TransactionsPage  = lazy(() => import("./pages/TransactionsPage"));
const InsightsPage      = lazy(() => import("./pages/InsightsPage"));

//  PAGE LOADER — lightweight spinner shown while a chunk is downloading
function PageLoader() {
  const s = useTheme();
  return (
    <div style={{
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: 200,
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        border: `3px solid ${s.border}`,
        borderTopColor: "#6366f1",
        animation: "spin .7s linear infinite",
      }}/>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

//  INNER APP
function AppInner() {
  const { state } = useApp();
  const s = useTheme();

  return (
    <div style={{ minHeight: "100vh", background: s.bg, fontFamily: "'Sora','Segoe UI',sans-serif", color: s.text, transition: "background .3s, color .3s" }}>
      <style>{G_CSS}</style>

      {/* Mobile sticky header */}
      <MobileHeader/>

      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar/>

        <main className="main-content">
          {/* Desktop top bar */}
          <TopBar/>

          {/* Page routing — each page is code-split and lazy-loaded */}
          <Suspense fallback={<PageLoader/>}>
            {state.activeTab === "dashboard"    && <DashboardPage/>}
            {state.activeTab === "transactions" && <TransactionsPage/>}
            {state.activeTab === "insights"     && <InsightsPage/>}
          </Suspense>
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <BottomNav/>

      {/* Modals */}
      {state.loginOpen                         && <LoginModal/>}
      {state.addOpen && state.role === "admin" && <AddModal/>}
    </div>
  );
}

//  ROOT EXPORT
export default function App() {
  return (
    <AppProvider>
      <AppInner/>
    </AppProvider>
  );
}