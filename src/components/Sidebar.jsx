import React from "react";
import { useApp, useTheme } from "../context/AppContext";

//  NAV CONFIG
export const NAV = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  },
  {
    id: "transactions",
    label: "Transactions",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  },
  {
    id: "insights",
    label: "Insights",
    icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
  },
];


//  SIDEBAR
export default function Sidebar() {
  const { state, dispatch } = useApp();
  const s = useTheme();
  const isAdmin = state.role === "admin";
  const isOpen  = state.sidebarOpen;

  const open  = () => dispatch({ type: "OPEN_SIDEBAR"  });
  const close = () => dispatch({ type: "CLOSE_SIDEBAR" });

  return (
    <>
      {/* ── Hamburger style — mobile only ── */}
      <style>{`
        .hamburger-btn {
          display: none;
        }
        @media (max-width: 768px) {
          .hamburger-btn {
            display: flex !important;
          }
        }
      `}</style>

      {/* ── Hamburger button — mobile only ── */}
      <button
        onClick={isOpen ? close : open}
        className="hamburger-btn"
        style={{
          position: "fixed", top: 14, left: 14, zIndex: 1200,
          width: 40, height: 40, borderRadius: 11,
          background: "rgba(99,102,241,.18)",
          border: "1px solid rgba(99,102,241,.3)",
          cursor: "pointer", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 5,
          backdropFilter: "blur(8px)", transition: "background .2s",
          padding: 0,
        }}
      >
        <span style={{
          display: "block", width: 18, height: 2, borderRadius: 2, background: "white",
          transition: "transform .3s cubic-bezier(.22,1,.36,1)",
          transform: isOpen ? "rotate(45deg) translate(5px, 5px)" : "none",
        }}/>
        <span style={{
          display: "block", width: 18, height: 2, borderRadius: 2, background: "white",
          transition: "opacity .2s",
          opacity: isOpen ? 0 : 1,
        }}/>
        <span style={{
          display: "block", width: 18, height: 2, borderRadius: 2, background: "white",
          transition: "transform .3s cubic-bezier(.22,1,.36,1)",
          transform: isOpen ? "rotate(-45deg) translate(5px, -5px)" : "none",
        }}/>
      </button>

      {/* ── Mobile overlay ── */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={close}
          style={{ display: "block" }}
        />
      )}

      <aside
        className={`sidebar${isOpen ? " open" : ""}`}
        style={{ background: s.sidebar, borderRight: "1px solid rgba(99,102,241,.08)" }}
      >
        {/* ── Logo ── */}
        <div style={{ padding: "22px 20px 18px", borderBottom: "1px solid rgba(99,102,241,.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 13,
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 18px rgba(99,102,241,.55)",
              animation: "glow 3s ease-in-out infinite", flexShrink: 0,
            }}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div>
              <div style={{ color: "white", fontWeight: 800, fontSize: 16, letterSpacing: "-.4px" }}>FinTrack</div>
              <div style={{ color: "rgba(255,255,255,.22)", fontSize: 11 }}>Personal Finance</div>
            </div>
          </div>
        </div>

        {/* ── Nav links ── */}
        <nav style={{ padding: "16px 12px", flex: 1 }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,.18)", letterSpacing: "1.2px", fontWeight: 700, padding: "0 10px", marginBottom: 10 }}>
            NAVIGATION
          </div>
          {NAV.map(item => (
            <button
              key={item.id}
              onClick={() => {
                dispatch({ type: "SET_TAB", payload: item.id });
                close();
              }}
              className={`nav-btn${state.activeTab === item.id ? " active" : ""}`}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, marginBottom: 3, background: "transparent", color: "rgba(255,255,255,.32)", fontWeight: 500, fontSize: 14, textAlign: "left", fontFamily: "inherit" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={item.icon}/>
              </svg>
              {item.label}
              {item.id === "transactions" && state.transactions.length > 0 && (
                <span style={{ marginLeft: "auto", background: "rgba(99,102,241,.2)", color: "#a5b4fc", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>
                  {state.transactions.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* ── Role switcher ── */}
        <div className="desktop-role" style={{ padding: "14px 14px 20px", borderTop: "1px solid rgba(99,102,241,.08)" }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,.18)", letterSpacing: "1.2px", fontWeight: 700, marginBottom: 10 }}>
            ACCESS ROLE
          </div>
          <div style={{ background: "rgba(99,102,241,.07)", borderRadius: 12, padding: 12 }}>
            <select
              value={state.role}
              onChange={e => {
                if (e.target.value === "admin") dispatch({ type: "SET_LOGIN_OPEN", payload: true });
                else dispatch({ type: "SET_ROLE", payload: "viewer" });
              }}
              style={{ width: "100%", background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 9, color: "white", padding: "8px 10px", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}
            >
              <option value="viewer" style={{ background: "#0d1b35" }}>  Viewer</option>
              <option value="admin"  style={{ background: "#0d1b35" }}> Admin</option>
            </select>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 10 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: isAdmin ? "#10b981" : "#f59e0b", animation: isAdmin ? "pulse 2s infinite" : "none" }}/>
              <span style={{ fontSize: 11, color: isAdmin ? "#6ee7b7" : "rgba(255,255,255,.2)", fontWeight: isAdmin ? 600 : 400 }}>
                {isAdmin ? "Full access enabled" : "Read-only mode"}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}