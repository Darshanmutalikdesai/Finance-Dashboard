import React from "react";
import { useApp, useTheme } from "../context/AppContext";
import { CAT_LIST } from "../constants";


//  ADD TRANSACTION MODAL
export default function AddModal({ editId }) {
  const { state, dispatch } = useApp();
  const s = useTheme();
  const { newTx } = state;
  const isOther = newTx.category === "Other";

  const iStyle = {
    width: "100%", padding: "11px 14px",
    border: `1.5px solid ${s.border}`, borderRadius: 12,
    background: s.surface, color: s.text,
    fontSize: 14, fontFamily: "inherit", transition: "all .2s",
  };

  const submit = () => {
    if (!newTx.date || !newTx.description || !newTx.amount) return;
    const cat = isOther ? (newTx.customCat.trim() || "Other") : newTx.category;
    dispatch({
      type: "ADD_TRANSACTION",
      payload: { ...newTx, id: Date.now(), amount: parseFloat(newTx.amount), category: cat },
    });
    dispatch({ type: "RESET_NEW_TX" });
  };

  const textFields = [
    { label: "DATE",        key: "date",        type: "date"   },
    { label: "DESCRIPTION", key: "description", type: "text",   placeholder: "e.g. Monthly Salary" },
    { label: "AMOUNT (₹)",  key: "amount",      type: "number", placeholder: "0.00" },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.65)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(6px)", animation: "fadeIn .2s ease", padding: "16px" }}>
      <div
        className="modal-box"
        style={{ background: s.card, borderRadius: 22, padding: 34, width: 450, boxShadow: "0 32px 80px rgba(0,0,0,.45)", border: `1px solid ${s.border}`, animation: "slideIn .35s cubic-bezier(.22,1,.36,1)", maxHeight: "90vh", overflowY: "auto" }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-.3px" }}>
              {editId ? "Edit Transaction" : "Add Transaction"}
            </div>
            <div style={{ fontSize: 12, color: s.muted, marginTop: 3 }}>Admin · saved locally</div>
          </div>
          <button
            onClick={() => dispatch({ type: "SET_ADD_OPEN", payload: false })}
            style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 9, width: 34, height: 34, cursor: "pointer", color: s.muted, fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}
          >×</button>
        </div>

        {/* Text inputs */}
        {textFields.map(f => (
          <div key={f.key} style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, color: s.muted, display: "block", marginBottom: 6, fontWeight: 700, letterSpacing: ".5px" }}>
              {f.label}
            </label>
            <input
              type={f.type}
              placeholder={f.placeholder}
              value={newTx[f.key]}
              onChange={e => dispatch({ type: "SET_NEW_TX", payload: { [f.key]: e.target.value } })}
              style={iStyle}
            />
          </div>
        ))}

        {/* Type + Category */}
        <div className="add-modal-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: isOther ? 14 : 24 }}>
          <div>
            <label style={{ fontSize: 11, color: s.muted, display: "block", marginBottom: 6, fontWeight: 700, letterSpacing: ".5px" }}>TYPE</label>
            <select value={newTx.type} onChange={e => dispatch({ type: "SET_NEW_TX", payload: { type: e.target.value } })} style={iStyle}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, color: s.muted, display: "block", marginBottom: 6, fontWeight: 700, letterSpacing: ".5px" }}>CATEGORY</label>
            <select
              value={newTx.category}
              onChange={e => dispatch({ type: "SET_NEW_TX", payload: { category: e.target.value, customCat: "" } })}
              style={{ ...iStyle, borderColor: isOther ? "#6366f1" : s.border, boxShadow: isOther ? "0 0 0 3px rgba(99,102,241,.15)" : "none" }}
            >
              {CAT_LIST.map(c => <option key={c} value={c}>{c === "Other" ? "Other (custom)" : c}</option>)}
            </select>
          </div>
        </div>

        {/* Custom category input */}
        {isOther && (
          <div style={{ marginBottom: 22, animation: "fadeUp .3s cubic-bezier(.22,1,.36,1)" }}>
            <label style={{ fontSize: 11, color: "#6366f1", display: "block", marginBottom: 6, fontWeight: 700, letterSpacing: ".5px" }}>
               CUSTOM CATEGORY NAME
            </label>
            <div style={{ position: "relative" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>
                <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
              <input
                autoFocus
                type="text"
                placeholder="e.g. Pet Care, Travel, Gifts…"
                value={newTx.customCat}
                onChange={e => dispatch({ type: "SET_NEW_TX", payload: { customCat: e.target.value } })}
                style={{ ...iStyle, paddingLeft: 36, borderColor: newTx.customCat.trim() ? "#6366f1" : s.border, boxShadow: newTx.customCat.trim() ? "0 0 0 3px rgba(99,102,241,.15)" : "none" }}
              />
            </div>
            {newTx.customCat.trim() && (
              <div style={{ marginTop: 6, fontSize: 11, color: "#6366f1", fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1" }}/> Will save as: <strong>"{newTx.customCat.trim()}"</strong>
              </div>
            )}
          </div>
        )}

        {/* ✅ Delete button — only shown when editing an existing transaction */}
        {editId && (
          <button
            onClick={() => {
              dispatch({ type: "DELETE_TRANSACTION", payload: editId });
              dispatch({ type: "SET_ADD_OPEN", payload: false });
            }}
            style={{
              width: "100%", padding: "11px", marginBottom: 10,
              border: "1.5px solid #f43f5e", borderRadius: 12,
              background: "transparent", color: "#f43f5e",
              cursor: "pointer", fontSize: 14, fontFamily: "inherit", fontWeight: 600,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
              <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
            </svg>
            Delete Transaction
          </button>
        )}

        {/* Submit */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 10 }}>
          <button
            onClick={() => dispatch({ type: "SET_ADD_OPEN", payload: false })}
            style={{ padding: "12px", border: `1.5px solid ${s.border}`, borderRadius: 12, background: "transparent", color: s.muted, cursor: "pointer", fontSize: 14, fontFamily: "inherit", fontWeight: 600 }}
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={isOther && !newTx.customCat.trim()}
            className="action-btn"
            style={{ padding: "12px", border: "none", borderRadius: 12, background: (isOther && !newTx.customCat.trim()) ? "#9ca3af" : "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", cursor: (isOther && !newTx.customCat.trim()) ? "not-allowed" : "pointer", fontSize: 14, fontWeight: 700, fontFamily: "inherit", boxShadow: "0 4px 18px rgba(99,102,241,.38)" }}
          >
            Save Transaction
          </button>
        </div>
      </div>
    </div>
  );
}