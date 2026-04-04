
import React from "react";

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
import { G_CSS }         from "./constants/globalStyles";

import Sidebar           from "./components/Sidebar";
import { MobileHeader, BottomNav } from "./components/MobileNav";
import TopBar            from "./components/TopBar";
import LoginModal        from "./components/LoginModal";
import AddModal          from "./components/AddModal";

import DashboardPage     from "./pages/DashboardPage";
import TransactionsPage  from "./pages/TransactionsPage";
import InsightsPage      from "./pages/InsightsPage";

//  INNER APP  

function AppInner() {
  const { state } = useApp();
  const s = useTheme();

  return (
    <div style={{ minHeight:"100vh", background:s.bg, fontFamily:"'Sora','Segoe UI',sans-serif", color:s.text, transition:"background .3s, color .3s" }}>
      <style>{G_CSS}</style>

      {/* Mobile sticky header */}
      <MobileHeader/>

      <div style={{ display:"flex", minHeight:"100vh" }}>
        <Sidebar/>

        <main className="main-content">
          {/* Desktop top bar */}
          <TopBar/>

          {/* Page routing */}
          {state.activeTab === "dashboard"    && <DashboardPage/>}
          {state.activeTab === "transactions" && <TransactionsPage/>}
          {state.activeTab === "insights"     && <InsightsPage/>}
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <BottomNav/>

      {/* Modals */}
      {state.loginOpen                           && <LoginModal/>}
      {state.addOpen && state.role === "admin"   && <AddModal/>}
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