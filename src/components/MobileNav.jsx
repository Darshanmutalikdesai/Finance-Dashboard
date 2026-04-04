import React from "react";
import { useApp, useTheme } from "../context/AppContext";
import { NAV } from "./Sidebar";


//  MOBILE HEADER  (sticky, hidden on desktop)
export function MobileHeader() {
  const { state, dispatch } = useApp();
  const s = useTheme();
  const isAdmin = state.role === "admin";

  return (
    <div className="mobile-header" style={{ background: s.sidebar }}>
      <button className="hamburger" onClick={() => dispatch({ type: "TOGGLE_SIDEBAR" })}>
        <span/><span/><span/>
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 30, height: 30, borderRadius: 9, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        </div>
        <span style={{ color: "white", fontWeight: 800, fontSize: 15 }}>FinTrack</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {isAdmin && (
          <button
            onClick={() => dispatch({ type: "SET_ADD_OPEN", payload: true })}
            className="action-btn"
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 9, padding: "7px 14px", color: "white", fontSize: 12, fontWeight: 700, fontFamily: "inherit" }}
          >
            + Add
          </button>
        )}
        <button
          onClick={() => dispatch({ type: "TOGGLE_DARK" })}
          style={{ background: "rgba(255,255,255,.1)", border: "none", borderRadius: 9, padding: "7px 10px", color: "rgba(255,255,255,.7)", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}
        >
          {state.dark ? "☀" : "◑"}
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  BOTTOM NAV  (mobile only, fixed at bottom)
// ══════════════════════════════════════════════════════════════════
export function BottomNav() {
  const { state, dispatch } = useApp();
  const s = useTheme();

  return (
    <div className="bottom-nav" style={{ background: s.sidebar, justifyContent: "space-around" }}>
      {NAV.map(item => (
        <button
          key={item.id}
          onClick={() => dispatch({ type: "SET_TAB", payload: item.id })}
          className={`mob-nav-btn${state.activeTab === item.id ? " active" : ""}`}
          style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            padding: "6px 4px", background: "transparent",
            color: state.activeTab === item.id ? "#a5b4fc" : "rgba(255,255,255,.3)",
            borderRadius: 10, fontFamily: "inherit", fontSize: 10,
            fontWeight: state.activeTab === item.id ? 700 : 400,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d={item.icon}/>
          </svg>
          {item.label}
        </button>
      ))}
    </div>
  );
}