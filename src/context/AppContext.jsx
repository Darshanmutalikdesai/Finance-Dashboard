import React, { createContext, useContext, useReducer, useEffect } from "react";
import { MOCK } from "../constants/mockData";


//  CONTEXT
export const AppContext = createContext(null);

//  INITIAL STATE
export const initialState = {
  transactions: MOCK,
  role:         "viewer",   // "viewer" | "admin"
  dark:         true,
  activeTab:    "dashboard",
  tabKey:       0,
  // filters
  search: "",
  fType:  "all",
  fCat:   "all",
  sort:   "date-desc",
  // modals
  addOpen:   false,
  loginOpen: false,
  // new transaction form
  newTx: { date: "", description: "", amount: "", category: "Food", type: "expense", customCat: "" },
  // mobile
  sidebarOpen: false,
};

//  REDUCER
export function reducer(state, action) {
  switch (action.type) {
    case "SET_TRANSACTIONS":   return { ...state, transactions: action.payload };
    case "ADD_TRANSACTION":    return { ...state, transactions: [action.payload, ...state.transactions] };
    case "DELETE_TRANSACTION": return { ...state, transactions: state.transactions.filter(t => t.id !== action.id) };
    case "SET_ROLE":           return { ...state, role: action.payload };
    case "TOGGLE_DARK":        return { ...state, dark: !state.dark };
    case "SET_TAB":            return { ...state, activeTab: action.payload, tabKey: state.tabKey + 1, sidebarOpen: false };
    case "SET_SEARCH":         return { ...state, search: action.payload };
    case "SET_FTYPE":          return { ...state, fType: action.payload };
    case "SET_FCAT":           return { ...state, fCat: action.payload };
    case "SET_SORT":           return { ...state, sort: action.payload };
    case "SET_ADD_OPEN":       return { ...state, addOpen: action.payload };
    case "SET_LOGIN_OPEN":     return { ...state, loginOpen: action.payload };
    case "SET_NEW_TX":         return { ...state, newTx: { ...state.newTx, ...action.payload } };
    case "RESET_NEW_TX":       return { ...state, newTx: initialState.newTx, addOpen: false };
    case "TOGGLE_SIDEBAR":     return { ...state, sidebarOpen: !state.sidebarOpen };
    case "CLOSE_SIDEBAR":      return { ...state, sidebarOpen: false };
    case "HYDRATE":            return { ...state, ...action.payload };
    default: return state;
  }
}

//  PROVIDER
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Hydrate from localStorage on first load
  useEffect(() => {
    try {
      const saved = {};
      const t = localStorage.getItem("ft_txns3"); if (t) saved.transactions = JSON.parse(t);
      const d = localStorage.getItem("ft_dark3"); if (d) saved.dark = d === "true";
      if (Object.keys(saved).length) dispatch({ type: "HYDRATE", payload: saved });
    } catch {}
  }, []);

  // Persist transactions
  useEffect(() => {
    try { localStorage.setItem("ft_txns3", JSON.stringify(state.transactions)); } catch {}
  }, [state.transactions]);

  // Persist dark mode
  useEffect(() => {
    try { localStorage.setItem("ft_dark3", String(state.dark)); } catch {}
  }, [state.dark]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

//  HOOKS

/** Access global state and dispatch */
export function useApp() {
  return useContext(AppContext);
}

/** Returns theme tokens derived from dark mode state */
export function useTheme() {
  const { state } = useApp();
  const d = state.dark;
  return {
    bg:      d ? "#080c18" : "#f0f4f8",
    card:    d ? "#0d1526" : "#ffffff",
    border:  d ? "rgba(99,102,241,.14)" : "#e2e8f0",
    text:    d ? "#e2e8f0" : "#0f172a",
    muted:   d ? "#4f637d" : "#64748b",
    surface: d ? "#0a1020" : "#f8fafc",
    sidebar: d ? "#060b16" : "#0d1b35",
    dark:    d,
  };
}