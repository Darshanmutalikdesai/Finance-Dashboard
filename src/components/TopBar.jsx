import React, { useMemo } from "react";
import { useApp, useTheme } from "../context/AppContext";
import { fmt } from "../constants";


//  TOP BAR  (desktop only)
export default function TopBar() {
  const { state, dispatch } = useApp();
  const s = useTheme();
  const isAdmin = state.role === "admin";
  const { transactions: txns } = state;

  const balance = useMemo(() =>
    txns.reduce((sum, t) => t.type === "income" ? sum + t.amount : sum - t.amount, 0),
  [txns]);

  const titles = {
    dashboard:    "Overview",
    transactions: "Transactions",
    insights:     "Insights",
  };

  return (
    <div
      className="topbar"
      style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}
    >
      {/* Title block */}
      <div className="topbar-title" style={{ animation: "fadeUp .4s ease" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-.6px" }}>
          {titles[state.activeTab]}
        </h1>
        <div style={{ fontSize: 13, color: s.muted, marginTop: 4, fontWeight: 500 }}>
          {txns.length} transactions &nbsp;·&nbsp; Balance:&nbsp;
          <span style={{ color: balance >= 0 ? "#10b981" : "#f43f5e", fontWeight: 700, fontFamily: "'JetBrains Mono'" }}>
            {fmt(Math.abs(balance))}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 10, animation: "fadeIn .5s ease", flexShrink: 0 }}>
        <button
          onClick={() => dispatch({ type: "TOGGLE_DARK" })}
          className="action-btn"
          style={{ background: s.card, border: `1px solid ${s.border}`, borderRadius: 11, padding: "9px 16px", color: s.muted, fontSize: 13, fontFamily: "inherit", fontWeight: 600 }}
        >
          {state.dark ? "☀ Light" : "◑ Dark"}
        </button>

        <select
          value={state.role}
          onChange={e => {
            if (e.target.value === "admin") dispatch({ type: "SET_LOGIN_OPEN", payload: true });
            else dispatch({ type: "SET_ROLE", payload: "viewer" });
          }}
          style={{ padding: "9px 14px", border: `1px solid ${s.border}`, borderRadius: 11, background: s.card, color: s.text, fontSize: 13, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}
        >
          <option value="viewer">Viewer</option>
          <option value="admin">Admin</option>
        </select>

        {isAdmin && (
          <button
            onClick={() => dispatch({ type: "SET_ADD_OPEN", payload: true })}
            className="action-btn"
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 11, padding: "10px 20px", color: "white", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 7, fontFamily: "inherit", boxShadow: "0 4px 18px rgba(99,102,241,.42)" }}
          >
            <span style={{ fontSize: 19, lineHeight: 1 }}>+</span> Add Transaction
          </button>
        )}
      </div>
    </div>
  );
}