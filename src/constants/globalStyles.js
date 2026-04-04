// ══════════════════════════════════════════════════════════════════
//  GLOBAL CSS
// ══════════════════════════════════════════════════════════════════

export const G_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ── Animations ── */
@keyframes fadeUp    { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeIn    { from { opacity: 0; } to { opacity: 1; } }
@keyframes shake     { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-10px)} 40%{transform:translateX(10px)} 60%{transform:translateX(-8px)} 80%{transform:translateX(8px)} }
@keyframes spin      { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes pulse     { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.82)} }
@keyframes glow      { 0%,100%{box-shadow:0 0 14px rgba(99,102,241,.4)} 50%{box-shadow:0 0 30px rgba(99,102,241,.75)} }
@keyframes slideIn   { from{opacity:0;transform:scale(.94) translateY(14px)} to{opacity:1;transform:scale(1) translateY(0)} }
@keyframes numPop    { 0%{transform:scale(.75);opacity:0} 65%{transform:scale(1.05)} 100%{transform:scale(1);opacity:1} }
@keyframes drawerOpen{ from{transform:translateX(-100%)} to{transform:translateX(0)} }

/* ── Utility classes ── */
.fade-up { animation: fadeUp .48s cubic-bezier(.22,1,.36,1) both; }
.fade-up:nth-child(1) { animation-delay: .04s; }
.fade-up:nth-child(2) { animation-delay: .10s; }
.fade-up:nth-child(3) { animation-delay: .17s; }
.fade-up:nth-child(4) { animation-delay: .24s; }

.card { border-radius: 18px; transition: box-shadow .25s, transform .25s; }
.card:hover { transform: translateY(-2px); box-shadow: 0 20px 50px rgba(0,0,0,.18) !important; }

.nav-btn { border: none; cursor: pointer; font-family: inherit; transition: all .2s; border-left: 3px solid transparent; }
.nav-btn:hover  { background: rgba(99,102,241,.09) !important; color: rgba(255,255,255,.85) !important; }
.nav-btn.active { border-left-color: #6366f1; background: rgba(99,102,241,.17) !important; color: #a5b4fc !important; }

.mob-nav-btn { border: none; cursor: pointer; font-family: inherit; transition: all .2s; }
.mob-nav-btn.active { background: rgba(99,102,241,.17) !important; color: #a5b4fc !important; }

.action-btn { border: none; cursor: pointer; font-family: inherit; transition: all .22s; }
.action-btn:hover { opacity: .87; transform: translateY(-1px); }

.tx-row { transition: background .15s; }
.tx-row:hover { background: rgba(99,102,241,.05) !important; }

input:focus, select:focus {
  outline: none !important;
  border-color: #6366f1 !important;
  box-shadow: 0 0 0 3px rgba(99,102,241,.18) !important;
}

::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(148,163,184,.22); border-radius: 10px; }

.chip { display: inline-flex; align-items: center; padding: 4px 11px; border-radius: 20px; font-size: 12px; font-weight: 600; }
.num  { animation: numPop .6s cubic-bezier(.22,1,.36,1) both; }

/* ── Sidebar ── */
.sidebar {
  width: 240px; position: fixed; top: 0; left: 0;
  height: 100vh; z-index: 200; display: flex; flex-direction: column;
  transition: transform .3s cubic-bezier(.22,1,.36,1);
}
.main-content {
  margin-left: 240px; flex: 1; min-height: 100vh;
  padding: 28px 36px; box-sizing: border-box; transition: margin-left .3s;
}

/* ── Mobile header ── */
.mobile-header {
  display: none; align-items: center; justify-content: space-between;
  padding: 14px 18px; position: sticky; top: 0; z-index: 150;
  border-bottom: 1px solid rgba(99,102,241,.1);
}
.hamburger { background: none; border: none; cursor: pointer; display: flex; flex-direction: column; gap: 5px; padding: 4px; }
.hamburger span { display: block; width: 22px; height: 2px; border-radius: 2px; background: rgba(255,255,255,.7); transition: all .25s; }

.sidebar-overlay {
  display: none; position: fixed; inset: 0;
  background: rgba(0,0,0,.55); z-index: 190;
  backdrop-filter: blur(3px); animation: fadeIn .2s ease;
}

/* ── Bottom nav ── */
.bottom-nav {
  display: none; position: fixed; bottom: 0; left: 0; right: 0;
  z-index: 180; border-top: 1px solid rgba(99,102,241,.12);
  padding: 8px 0 max(8px, env(safe-area-inset-bottom));
}

/* ── Tablet (≤900px) ── */
@media (max-width: 900px) {
  .sidebar { transform: translateX(-100%); }
  .sidebar.open { transform: translateX(0); animation: drawerOpen .3s cubic-bezier(.22,1,.36,1); }
  .sidebar-overlay { display: block !important; }
  .main-content { margin-left: 0; padding: 16px 18px; }
  .topbar { flex-wrap: wrap; gap: 10px; }
  .kpi-grid { grid-template-columns: 1fr 1fr !important; }
  .charts-row { grid-template-columns: 1fr !important; }
  .insights-grid { grid-template-columns: 1fr 1fr !important; }
  .mobile-header { display: flex !important; }
  .desktop-role { display: none !important; }
  .bottom-nav { display: flex !important; }
  .main-content { padding-bottom: 80px; }
}

/* ── Mobile (≤600px) ── */
@media (max-width: 600px) {
  .kpi-grid { grid-template-columns: 1fr !important; }
  .insights-grid { grid-template-columns: 1fr !important; }
  .main-content { padding: 12px 14px; padding-bottom: 80px; }
  .modal-box { width: calc(100vw - 32px) !important; padding: 22px 18px !important; }
  .filter-row { flex-direction: column !important; }
  .filter-row select, .filter-row input, .filter-row button { width: 100% !important; }
  .tx-table th:nth-child(2), .tx-table td:nth-child(2) { display: none; }
  .topbar-title h1 { font-size: 20px !important; }
  .chart-height-bar { height: 180px !important; }
  .chart-height-line { height: 160px !important; }
  .add-modal-grid { grid-template-columns: 1fr !important; }
}
`;