import React, { useState, useRef, useEffect } from "react";
import { useApp, useTheme } from "../context/AppContext";
import { ADMIN_USER, ADMIN_PASS } from "../constants";

//  LOGIN MODAL
export default function LoginModal() {
  const { dispatch } = useApp();
  const s = useTheme();

  const [u, setU]           = useState("");
  const [p, setP]           = useState("");
  const [show, setShow]     = useState(false);
  const [err, setErr]       = useState("");
  const [shake, setShake]   = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  useEffect(() => { ref.current?.focus(); }, []);

  const login = () => {
    if (!u || !p) { setErr("Fill in both fields."); return; }
    setLoading(true);
    setTimeout(() => {
      if (u === ADMIN_USER && p === ADMIN_PASS) {
        dispatch({ type: "SET_ROLE",       payload: "admin" });
        dispatch({ type: "SET_LOGIN_OPEN", payload: false });
      } else {
        setErr("Invalid credentials.");
        setShake(true);
        setTimeout(() => setShake(false), 600);
        setP("");
      }
      setLoading(false);
    }, 700);
  };

  const iStyle = {
    width: "100%", padding: "11px 14px",
    border: `1.5px solid ${s.border}`, borderRadius: 12,
    background: s.surface, color: s.text,
    fontSize: 14, fontFamily: "inherit", transition: "all .2s",
  };

  const fields = [
    { label: "USERNAME", type: "text",                      val: u, set: setU, r: ref },
    { label: "PASSWORD", type: show ? "text" : "password",  val: p, set: setP },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.72)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)", animation: "fadeIn .2s ease", padding: "16px" }}>
      <div
        className="modal-box"
        style={{ background: s.card, borderRadius: 24, padding: 40, width: 420, boxShadow: "0 40px 100px rgba(0,0,0,.55)", border: `1px solid ${s.border}`, animation: shake ? "shake .6s ease" : "slideIn .35s cubic-bezier(.22,1,.36,1)" }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ width: 62, height: 62, borderRadius: 20, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", boxShadow: "0 8px 30px rgba(99,102,241,.55)", animation: "glow 2.5s ease-in-out infinite" }}>
            <svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
          </div>
          <div style={{ fontSize: 21, fontWeight: 800, color: s.text, letterSpacing: "-.5px" }}>Admin Access</div>
          <div style={{ fontSize: 13, color: s.muted, marginTop: 5 }}>
            Demo:{" "}
            <code style={{ color: "#6366f1", fontFamily: "'JetBrains Mono'", fontSize: 12, background: s.surface, padding: "2px 8px", borderRadius: 6 }}>
              admin / admin123
            </code>
          </div>
        </div>

        {/* Error */}
        {err && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#e24b4a", animation: "fadeUp .2s ease" }}>
            {err}
          </div>
        )}

        {/* Fields */}
        {fields.map((f, i) => (
          <div key={i} style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: s.muted, display: "block", marginBottom: 6, letterSpacing: ".6px" }}>
              {f.label}
            </label>
            <input
              ref={f.r}
              type={f.type}
              value={f.val}
              onChange={e => { f.set(e.target.value); setErr(""); }}
              onKeyDown={e => e.key === "Enter" && login()}
              style={iStyle}
            />
          </div>
        ))}

        {/* Show password toggle */}
        <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 22, cursor: "pointer", fontSize: 13, color: s.muted }}>
          <input type="checkbox" checked={show} onChange={() => setShow(v => !v)} style={{ accentColor: "#6366f1" }}/> Show password
        </label>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => dispatch({ type: "SET_LOGIN_OPEN", payload: false })}
            style={{ flex: 1, padding: "12px", border: `1.5px solid ${s.border}`, borderRadius: 12, background: "transparent", color: s.muted, cursor: "pointer", fontSize: 14, fontFamily: "inherit", fontWeight: 500 }}
          >
            Cancel
          </button>
          <button
            onClick={login}
            disabled={loading}
            className="action-btn"
            style={{ flex: 2, padding: "12px", border: "none", borderRadius: 12, background: loading ? "#9ca3af" : "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit", boxShadow: "0 4px 20px rgba(99,102,241,.42)" }}
          >
            {loading ? (
              <><div style={{ width: 15, height: 15, border: "2px solid rgba(255,255,255,.3)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin .8s linear infinite" }}/> Verifying...</>
            ) : "Login as Admin →"}
          </button>
        </div>
      </div>
    </div>
  );
}