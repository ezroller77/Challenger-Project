import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/* ═══ THEME TOKENS ═══ */
const T = {
  /* Surfaces — warm stone palette */
  bg: "#F5F4F1", surface: "#FFFFFF", surfaceMuted: "#EDECE8", surfaceHover: "#F9F8F6",
  /* Borders */
  border: "#E7E5E4", borderSubtle: "#EEEDEA",
  /* Text — warm charcoal hierarchy */
  text: "#1C1917", textSecondary: "#78716C", textTertiary: "#A8A29E",
  /* Accent — warm dark */
  accent: "#1C1917", accentSoft: "rgba(28,25,23,0.06)", accentBorder: "rgba(28,25,23,0.13)",
  /* Highlight — rich blue */
  highlight: "#2563EB", highlightSoft: "rgba(37,99,235,0.07)", highlightBorder: "rgba(37,99,235,0.18)",
  /* Semantic */
  green: "#059669", greenSoft: "rgba(5,150,105,0.07)", greenBorder: "rgba(5,150,105,0.18)",
  amber: "#D97706", amberSoft: "rgba(217,119,6,0.07)", amberBorder: "rgba(217,119,6,0.18)",
  violet: "#7C3AED", violetSoft: "rgba(124,58,237,0.06)", violetBorder: "rgba(124,58,237,0.15)",
  rose: "#E11D48", roseSoft: "rgba(225,29,72,0.06)", roseBorder: "rgba(225,29,72,0.15)",
  dark: "#1C1917", darkBorder: "#44403C",
  pink: "#DB2777", pinkSoft: "rgba(219,39,119,0.06)", pinkBorder: "rgba(219,39,119,0.15)",
  /* Typography — distinctive pairing */
  serif: "'Source Serif 4', Georgia, serif",
  sans: "'Nunito Sans', sans-serif",
  mono: "'Fira Code', monospace",
  /* Radii */
  r: 14, rSm: 8, rLg: 20,
  /* Elevation */
  shadow: "0 1px 3px rgba(28,25,23,0.04), 0 1px 2px rgba(28,25,23,0.02)",
  shadowMd: "0 4px 16px rgba(28,25,23,0.06), 0 1px 3px rgba(28,25,23,0.04)",
  shadowLg: "0 12px 40px rgba(28,25,23,0.1), 0 4px 12px rgba(28,25,23,0.04)",
};

/* ═══ ICONS ═══ */
const IC = {
  menu: (c="currentColor") => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>,
  x: (c="currentColor",s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>,
  check: (c="#fff",s=12) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>,
  plus: (c="currentColor",s=16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>,
  target: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  workflow: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="6" height="6" rx="1"/><rect x="16" y="3" width="6" height="6" rx="1"/><rect x="9" y="15" width="6" height="6" rx="1"/><path d="M5 9v3a2 2 0 0 0 2 2h4M19 9v3a2 2 0 0 1-2 2h-4"/></svg>,
  people: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  asset: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="6" width="22" height="12" rx="2"/><path d="M1 10h22"/><path d="M6 14h2M12 14h6"/></svg>,
  connector: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
  sparkle: (c,s=14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z"/></svg>,
  send: (c,s=16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
  pin: (c,s=11) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M12 17v5M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24z"/></svg>,
  home: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  tasks: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  chart: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  calendar: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  link: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  builder: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12h.01M17 12h.01M7 12h.01"/></svg>,
  source: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,
  settings: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  chevLeft: (c,s=16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>,
  chevRight: (c,s=16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>,
  clock: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  bell: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  save: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
  undo: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>,
  redo: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.13-9.36L23 10"/></svg>,
  folder: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  panel: (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>,
  bolt: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  play: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  decision: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l10 10-10 10L2 12z"/></svg>,
  filter: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>,
  catalog: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>,
  building: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22V12h6v10"/><path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01"/></svg>,
  globe: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  shield: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  userPlus: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>,
  grid: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>,
  waves: (c,s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M2 12c1.5-3 3.5-3 5 0s3.5 3 5 0 3.5-3 5 0 3.5 3 5 0"/></svg>,
};

/* ═══ CHART DATA ═══ */
const velData=[32,38,35,42,48,44,52,58,54,62,68,72];
const compData=[12,18,15,22,19,24,21];
const revData=[42,48,45,52,58,55,62,67,64,71,75,82,78,85,89];
const HOME_TASKS={
  manufacturing:[
    {text:"Complete morning line walk",ai:true,aiNote:"Line 3 flagged — bearing temp trending high",tag:"Priority",done:false},
    {text:"Review overnight shift handover notes",ai:true,aiNote:"2 quality holds noted on Line 1",tag:"AI summary",done:false},
    {text:"Verify PM schedule compliance for Line 3",ai:false,tag:"87% compliant",done:false},
    {text:"Run incoming shipment inspection",ai:false,tag:"Dock B",done:false},
    {text:"Submit daily OEE report",ai:true,aiNote:"Auto-populated from MES data",tag:"Ready ✨",done:false},
    {text:"Update safety board metrics",ai:false,tag:null,done:true},
  ],
  qsr:[
    {text:"Complete opening checklist",ai:false,tag:"14 steps",done:false},
    {text:"Log morning temperature readings",ai:true,aiNote:"Walk-in cooler at 38°F — within range",tag:"Compliance",done:false},
    {text:"Verify line check & station positioning",ai:false,tag:"Lunch prep",done:false},
    {text:"Review crew schedule for lunch rush",ai:true,aiNote:"8 crew on, 1 call-out — suggest cross-train backup",tag:"AI assist",done:false},
    {text:"Check 3rd-party delivery order accuracy",ai:false,tag:"DoorDash",done:false},
    {text:"Submit yesterday's waste tracking log",ai:false,tag:null,done:true},
  ],
  "transport-logistics":[
    {text:"Review morning pre-trip inspection reports",ai:true,aiNote:"2 flags on Unit 4472 — tire pressure + brake wear",tag:"Safety",done:false},
    {text:"Check driver HOS compliance dashboard",ai:true,aiNote:"98% fleet-wide — 2 drivers near limits",tag:"Compliance",done:false},
    {text:"Approve dock receiving schedule",ai:false,tag:"12 inbound",done:false},
    {text:"Review exception alerts for late shipments",ai:false,tag:"3 alerts",done:false},
    {text:"Verify fuel card reconciliation",ai:true,aiNote:"$340 variance flagged at Station 7",tag:"AI flagged",done:false},
    {text:"Submit end-of-day fleet utilization report",ai:false,tag:null,done:true},
  ],
};
const homeTasks=HOME_TASKS.manufacturing;

/* ═══ CHAT DATA ═══ */
const INITIAL_MESSAGES_MAP={
  manufacturing:[
    {id:"m1",role:"ai",text:"Good morning, Sarah! You have **5 open tasks** today. The morning line walk is first — Line 3 has a bearing temp trending high. Your overnight shift handover notes are summarized and ready.",widgets:[{type:"taskList"}],chips:["Start line walk","View OEE dashboard","Quality inspection","Shift handover"]},
  ],
  qsr:[
    {id:"m1",role:"ai",text:"Good morning, Sarah! You have **5 open tasks** to start the day. Opening checklist is up first — all temps look good. Lunch rush crew is set with 8 scheduled, but you have 1 call-out to manage.",widgets:[{type:"taskList"}],chips:["Opening checklist","Temp readings","Line check","Crew schedule"]},
  ],
  "transport-logistics":[
    {id:"m1",role:"ai",text:"Good morning, Sarah! You have **5 open tasks** today. Pre-trip reports are coming in — 2 flags on Unit 4472 need attention. HOS compliance is at 98% fleet-wide with 2 drivers approaching limits.",widgets:[{type:"taskList"}],chips:["Pre-trip reports","HOS dashboard","Exception alerts","Fleet status"]},
  ],
};
const INITIAL_MESSAGES=INITIAL_MESSAGES_MAP.manufacturing;

const AI_RESPONSES={
  velocity:{text:"Here's your team velocity trend over the last 12 weeks.",widgets:[{type:"velocity"}],chips:["Compare to last quarter","Show by team"]},
  completion:{text:"Completion rate is trending well — here's the breakdown.",widgets:[{type:"completion"}],chips:["Show weekly detail","Filter by project"]},
  revenue:{text:"Pipeline revenue is looking strong this month.",widgets:[{type:"revenue"}],chips:["Show by source","Export data"]},
  tasks:{text:"Here are your current tasks for today.",widgets:[{type:"taskList"}],chips:["Add a task","Filter by priority"]},
  activity:{text:"Here's the latest AI activity in your workspace.",widgets:[{type:"activity"}],chips:["Show all activity","Filter by type"]},
  stats:{text:"Here's a quick overview of your key numbers.",widgets:[{type:"quickStats"}],chips:["Show details","Compare to yesterday"]},
};

const AI_FALLBACK={text:"I understand — let me look into that for you. In the meantime, here's what I can help with: tasks, velocity, completion rates, revenue, activity, or quick stats.",widgets:[],chips:["Show my tasks","Team velocity","Revenue overview"]};

/* ═══ WIDGET CATALOGUE ═══ */
const AVAILABLE_WIDGETS=[
  {type:"agentBriefing",label:"Agent Briefing",desc:"Alerts from your app agents",icon:IC.sparkle,color:T.accent},
  {type:"taskList",label:"Tasks",desc:"Today's task list",icon:IC.tasks,color:T.accent},
  {type:"velocity",label:"Velocity",desc:"Team velocity trend",icon:IC.chart,color:T.green},
  {type:"completion",label:"Completion",desc:"Completion rate",icon:IC.chart,color:T.highlight},
  {type:"revenue",label:"Revenue",desc:"Pipeline revenue",icon:IC.chart,color:T.highlight},
  {type:"activity",label:"Activity",desc:"Recent AI activity",icon:IC.bolt,color:T.green},
  {type:"quickStats",label:"Quick Stats",desc:"PRs, meetings, messages",icon:IC.chart,color:T.violet},
];

const HOME_QUICK_ACTIONS={
  manufacturing:[
    {label:"Today's tasks",key:"tasks"},
    {label:"OEE trend",key:"velocity"},
    {label:"Quality rate",key:"completion"},
    {label:"Maintenance log",key:"activity"},
    {label:"Plant stats",key:"stats"},
  ],
  qsr:[
    {label:"Today's tasks",key:"tasks"},
    {label:"Speed of service",key:"velocity"},
    {label:"Completion rate",key:"completion"},
    {label:"Store activity",key:"activity"},
    {label:"Store stats",key:"stats"},
  ],
  "transport-logistics":[
    {label:"Today's tasks",key:"tasks"},
    {label:"Fleet utilization",key:"velocity"},
    {label:"On-time rate",key:"completion"},
    {label:"Fleet activity",key:"activity"},
    {label:"Fleet stats",key:"stats"},
  ],
};

/* ═══ ONBOARDING: INDUSTRIES ═══ */
const INDUSTRIES=[
  {id:"manufacturing",label:"Manufacturing",color:T.green,colorSoft:T.greenSoft,desc:"Production, quality, maintenance & supply chain",goalCount:24},
  {id:"qsr",label:"Quick Service Restaurants",color:T.amber,colorSoft:T.amberSoft,desc:"Speed, food safety, labor & multi-unit operations",goalCount:23},
  {id:"transport-logistics",label:"Transport & Logistics",color:T.violet,colorSoft:T.violetSoft,desc:"Fleet, delivery, routing & compliance",goalCount:23},
];

const GOAL_CATEGORIES={
  manufacturing:["Production & Throughput","Quality & Compliance","Maintenance & Reliability","Supply Chain & Inventory","Workforce & Safety","Cost & Efficiency"],
  qsr:["Speed & Customer Experience","Food Quality & Safety","Labor & Workforce","Inventory & Waste","Revenue & Profitability","Multi-Unit & Franchise Operations","Drive-Thru & Digital Channels"],
  "transport-logistics":["Delivery Performance & Reliability","Fleet & Asset Management","Warehouse & Distribution","Route Optimization & Efficiency","Driver Safety & Compliance","Cost Management","Visibility & Tracking"],
};

/* ═══ ONBOARDING: OPERATIONAL GOALS ═══ */
const OPERATIONAL_GOALS=[
  // Manufacturing — Production & Throughput
  {id:"mfg-oee",name:"Increase Overall Equipment Effectiveness (OEE)",description:"Maximize productive capacity by improving availability, performance, and quality rates simultaneously.",category:"Production & Throughput",industry:"manufacturing",metrics:["OEE %","Availability %","Performance %","Quality Rate %"],personas:["Plant Manager","VP of Operations","Production Manager","Continuous Improvement Manager"]},
  {id:"mfg-throughput",name:"Improve Production Throughput",description:"Increase the volume of units produced per unit of time without proportionally increasing resources.",category:"Production & Throughput",industry:"manufacturing",metrics:["Units per hour","Throughput rate","Takt time","Cycle time","Bottleneck utilization %"],personas:["Production Manager","Plant Manager","Industrial Engineer","VP of Operations"]},
  {id:"mfg-changeover",name:"Reduce Changeover Time",description:"Minimize time lost when switching a production line from one product to another.",category:"Production & Throughput",industry:"manufacturing",metrics:["Changeover time (min)","SMED compliance %","Changeovers per shift"],personas:["Production Manager","Continuous Improvement Manager","Line Supervisor"]},
  {id:"mfg-scheduling",name:"Optimize Production Scheduling",description:"Improve adherence to production plans and reduce schedule deviations causing delays.",category:"Production & Throughput",industry:"manufacturing",metrics:["Schedule adherence %","On-time completion rate","Production plan variance"],personas:["Production Planner","Plant Manager","Supply Chain Manager","VP of Operations"]},
  // Manufacturing — Quality & Compliance
  {id:"mfg-defects",name:"Reduce Defect Rate",description:"Lower the percentage of units that fail to meet specifications at first pass.",category:"Quality & Compliance",industry:"manufacturing",metrics:["First Pass Yield %","DPMO","Scrap rate %","Rework rate %","COPQ"],personas:["Quality Director","Quality Engineer","Plant Manager","VP of Operations"]},
  {id:"mfg-supplier-quality",name:"Improve Supplier Quality",description:"Ensure incoming materials meet specifications consistently, reducing rejections.",category:"Quality & Compliance",industry:"manufacturing",metrics:["Supplier PPM","Incoming rejection rate %","Supplier scorecard","SCARs issued"],personas:["Quality Director","Procurement Manager","Supply Chain Manager"]},
  {id:"mfg-regulatory",name:"Maintain Regulatory Compliance",description:"Meet all regulatory requirements (FDA, EPA, OSHA, ISO) and stay audit-ready.",category:"Quality & Compliance",industry:"manufacturing",metrics:["Audit findings","CAPA closure rate","Compliance score %"],personas:["Quality Director","Compliance Manager","Plant Manager","EHS Manager"]},
  {id:"mfg-customer-complaints",name:"Reduce Customer Complaints & Returns",description:"Decrease quality escapes that reach the customer, improving satisfaction.",category:"Quality & Compliance",industry:"manufacturing",metrics:["Complaints per million","Return rate %","Warranty cost","8D response time"],personas:["Quality Director","VP of Operations","Plant Manager"]},
  // Manufacturing — Maintenance & Reliability
  {id:"mfg-downtime",name:"Reduce Unplanned Downtime",description:"Minimize unexpected equipment failures that halt production.",category:"Maintenance & Reliability",industry:"manufacturing",metrics:["MTBF","Downtime hours","Downtime %","Breakdowns per month"],personas:["Plant Manager","Maintenance Manager","VP of Operations","Reliability Engineer"]},
  {id:"mfg-preventive-maintenance",name:"Shift to Preventive & Predictive Maintenance",description:"Move from reactive break-fix toward scheduled preventive maintenance.",category:"Maintenance & Reliability",industry:"manufacturing",metrics:["Planned Maintenance %","PM compliance %","Predictive alerts acted on","Reactive ratio"],personas:["Maintenance Manager","Reliability Engineer","Plant Manager"]},
  {id:"mfg-spare-parts",name:"Optimize Spare Parts & MRO Inventory",description:"Ensure critical spare parts are available while avoiding excess inventory.",category:"Maintenance & Reliability",industry:"manufacturing",metrics:["Stockout rate","MRO carrying cost","MTTR","Parts availability %"],personas:["Maintenance Manager","Inventory Manager","Plant Manager"]},
  // Manufacturing — Supply Chain & Inventory
  {id:"mfg-raw-inventory",name:"Reduce Raw Material Inventory",description:"Minimize capital tied up in raw material inventory while ensuring production continuity.",category:"Supply Chain & Inventory",industry:"manufacturing",metrics:["Days of Inventory on Hand","Turnover ratio","Carrying cost %","Stockout events"],personas:["Supply Chain Manager","VP of Operations","Plant Manager"]},
  {id:"mfg-otif",name:"Improve On-Time Delivery",description:"Increase the percentage of orders shipped complete and on time.",category:"Supply Chain & Inventory",industry:"manufacturing",metrics:["OTIF %","Fulfillment lead time","Backorder rate","Perfect order rate %"],personas:["VP of Operations","Supply Chain Manager","Plant Manager"]},
  {id:"mfg-wip",name:"Reduce Work-In-Process (WIP)",description:"Minimize partially completed inventory consuming space and increasing lead time.",category:"Supply Chain & Inventory",industry:"manufacturing",metrics:["WIP value","WIP units","WIP days","Flow efficiency"],personas:["Production Manager","Plant Manager","Lean/CI Manager"]},
  {id:"mfg-supply-resilience",name:"Strengthen Supply Chain Resilience",description:"Reduce single-source dependency and build supply chain risk visibility.",category:"Supply Chain & Inventory",industry:"manufacturing",metrics:["Single-source %","Lead time variability","Safety stock days"],personas:["Supply Chain Manager","VP of Operations","Procurement Manager"]},
  // Manufacturing — Workforce & Safety
  {id:"mfg-injuries",name:"Reduce Workplace Injuries",description:"Lower frequency and severity of workplace injuries through proactive safety programs.",category:"Workforce & Safety",industry:"manufacturing",metrics:["TRIR","LTIR","DART rate","Near-miss rate","OSHA recordables"],personas:["EHS Manager","Plant Manager","VP of Operations"]},
  {id:"mfg-turnover",name:"Reduce Absenteeism & Turnover",description:"Address chronic absenteeism and high turnover (~30% avg) impacting production.",category:"Workforce & Safety",industry:"manufacturing",metrics:["Absenteeism %","Turnover rate %","Time-to-fill","Overtime %"],personas:["HR Director","Plant Manager","VP of Operations"]},
  {id:"mfg-training",name:"Improve Training & Certification Compliance",description:"Ensure all operators are trained and certified on equipment and processes.",category:"Workforce & Safety",industry:"manufacturing",metrics:["Completion %","Cert expiry alerts","Skills matrix coverage %"],personas:["HR Director","Training Manager","Plant Manager","Quality Director"]},
  {id:"mfg-labor-utilization",name:"Optimize Labor Utilization",description:"Deploy the right workers with right skills to right stations at right times.",category:"Workforce & Safety",industry:"manufacturing",metrics:["Labor efficiency %","Utilization rate","Overtime %","Output per labor hour"],personas:["Production Manager","Plant Manager","HR Director"]},
  // Manufacturing — Cost & Efficiency
  {id:"mfg-cost-per-unit",name:"Reduce Manufacturing Cost Per Unit",description:"Lower total cost to produce each unit across labor, materials, energy, and overhead.",category:"Cost & Efficiency",industry:"manufacturing",metrics:["Cost per unit","Mfg cost as % revenue","Variance to standard cost"],personas:["VP of Operations","Plant Manager","CFO"]},
  {id:"mfg-energy",name:"Reduce Energy Consumption",description:"Lower energy usage per unit for both cost savings and sustainability goals.",category:"Cost & Efficiency",industry:"manufacturing",metrics:["kWh per unit","Energy intensity ratio","Carbon emissions per unit"],personas:["Plant Manager","VP of Operations","Sustainability Manager"]},
  {id:"mfg-scrap",name:"Minimize Scrap & Material Waste",description:"Reduce raw material wasted through better process control and yield optimization.",category:"Cost & Efficiency",industry:"manufacturing",metrics:["Scrap rate %","Material yield %","Waste cost","Rework cost"],personas:["Production Manager","Quality Director","Continuous Improvement Manager"]},
  {id:"mfg-asset-utilization",name:"Improve Asset Utilization",description:"Maximize productive use of capital equipment and facility capacity.",category:"Cost & Efficiency",industry:"manufacturing",metrics:["Capacity utilization %","Asset utilization rate","Equipment ROI","Revenue per machine hour"],personas:["VP of Operations","Plant Manager","Finance Director"]},
  {id:"mfg-lead-time",name:"Reduce Operational Lead Time",description:"Compress total time from order receipt to shipment by eliminating waste.",category:"Cost & Efficiency",industry:"manufacturing",metrics:["Order-to-ship time","Cycle time","Process cycle efficiency"],personas:["VP of Operations","Lean/CI Manager","Supply Chain Manager"]},

  // QSR — Speed & Customer Experience
  {id:"qsr-speed",name:"Speed of Service",description:"Minimize total time from order placement to order handoff across all channels.",category:"Speed & Customer Experience",industry:"qsr",metrics:["Drive-thru time (sec)","Counter time","Cars per hour","Order-to-delivery"],personas:["Store Manager","District Manager","VP of Operations"]},
  {id:"qsr-accuracy",name:"Order Accuracy",description:"Ensure every order is assembled correctly — the largest driver of guest complaints.",category:"Speed & Customer Experience",industry:"qsr",metrics:["Accuracy rate %","Remakes per 100 orders","Missing-item rate"],personas:["Store Manager","District Manager","VP of Operations"]},
  {id:"qsr-guest-satisfaction",name:"Guest Satisfaction & Loyalty",description:"Track and improve overall guest experience across all channels.",category:"Speed & Customer Experience",industry:"qsr",metrics:["OSAT/CSAT","NPS","Google rating","Loyalty enrollment","Visit frequency"],personas:["Store Manager","District Manager","VP of Marketing","Franchisee"]},
  // QSR — Food Quality & Safety
  {id:"qsr-food-safety",name:"Food Safety Compliance",description:"Maintain health-code and brand-standard compliance for food handling and sanitation.",category:"Food Quality & Safety",industry:"qsr",metrics:["Health inspection scores","Critical violations","HACCP compliance %","Temp log compliance"],personas:["Store Manager","VP of Quality Assurance","Franchisee"]},
  {id:"qsr-food-quality",name:"Food Quality Consistency",description:"Ensure every product matches brand standards for taste, appearance, and temperature.",category:"Food Quality & Safety",industry:"qsr",metrics:["Brand audit score","Mystery shop scores","Quality hold waste"],personas:["Store Manager","District Manager","VP of Quality Assurance"]},
  {id:"qsr-audit-scores",name:"Brand Standards & Ops Audits",description:"Score well on periodic audits evaluating cleanliness, food safety, and service.",category:"Food Quality & Safety",industry:"qsr",metrics:["Overall audit %","Sub-scores","Score trend","% locations above threshold"],personas:["Store Manager","District Manager","Franchisee"]},
  // QSR — Labor & Workforce
  {id:"qsr-labor-cost",name:"Labor Cost Optimization",description:"Keep labor cost aligned with sales volume through smart scheduling.",category:"Labor & Workforce",industry:"qsr",metrics:["Labor % of sales","SPLH","Overtime cost","Scheduled vs actual hours"],personas:["Store Manager","District Manager","Franchisee"]},
  {id:"qsr-retention",name:"Employee Retention & Turnover",description:"Reduce hourly crew turnover, which commonly exceeds 100-150% annually in QSR.",category:"Labor & Workforce",industry:"qsr",metrics:["30/60/90-day retention","Annual turnover %","Avg tenure","Cost per hire"],personas:["Store Manager","District Manager","VP of HR"]},
  {id:"qsr-scheduling",name:"Schedule Effectiveness",description:"Build schedules matching labor to sales forecast, minimizing no-shows.",category:"Labor & Workforce",industry:"qsr",metrics:["Schedule adherence","No-show rate","Under/over-staffed hours"],personas:["Store Manager","District Manager"]},
  {id:"qsr-training",name:"Training Completion & Certification",description:"Ensure all crew complete required training — the root cause behind many failures.",category:"Labor & Workforce",industry:"qsr",metrics:["Completion rate %","Time-to-proficiency","Cert compliance"],personas:["Store Manager","VP of Training"]},
  // QSR — Inventory & Waste
  {id:"qsr-food-cost",name:"Food Cost Control",description:"Manage theoretical vs actual food cost by controlling portioning, waste, and pricing.",category:"Inventory & Waste",industry:"qsr",metrics:["Food cost % of sales","Theoretical vs actual variance","COGS per transaction"],personas:["Store Manager","District Manager","Franchisee"]},
  {id:"qsr-waste",name:"Waste Reduction",description:"Minimize food waste from overproduction, spoilage, and quality holds.",category:"Inventory & Waste",industry:"qsr",metrics:["Waste $ per $1K sales","Waste by category","Shrinkage rate"],personas:["Store Manager","VP of Supply Chain"]},
  {id:"qsr-inventory",name:"Inventory Accuracy & Availability",description:"Keep accurate real-time inventory counts to prevent out-of-stocks and over-ordering.",category:"Inventory & Waste",industry:"qsr",metrics:["Inventory variance","Out-of-stocks per week","Days on hand","Availability %"],personas:["Store Manager","District Manager","VP of Supply Chain"]},
  // QSR — Revenue & Profitability
  {id:"qsr-sss",name:"Same-Store Sales Growth",description:"Grow revenue at existing locations through traffic, average check, and channels.",category:"Revenue & Profitability",industry:"qsr",metrics:["SSS growth % YoY","Transaction count growth","Average check","Channel mix"],personas:["Franchisee","District Manager","CFO"]},
  {id:"qsr-profitability",name:"Restaurant-Level Profitability",description:"Maximize four-wall profit — the primary metric for unit viability.",category:"Revenue & Profitability",industry:"qsr",metrics:["Operating margin %","Four-wall EBITDA","Prime cost %"],personas:["Franchisee","Store Manager","District Manager","CFO"]},
  {id:"qsr-daypart",name:"Daypart Sales Optimization",description:"Grow underpenetrated dayparts to maximize revenue from fixed real estate.",category:"Revenue & Profitability",industry:"qsr",metrics:["Sales by daypart","Daypart mix %","Transaction count by daypart"],personas:["Store Manager","District Manager","VP of Marketing"]},
  // QSR — Multi-Unit & Franchise Operations
  {id:"qsr-consistency",name:"Unit-to-Unit Consistency",description:"Reduce operational variance so every restaurant delivers the same experience.",category:"Multi-Unit & Franchise Operations",industry:"qsr",metrics:["Std dev of key metrics","% units above threshold","Bottom quartile count"],personas:["District Manager","VP of Operations","Franchisee"]},
  {id:"qsr-new-unit",name:"New Unit Opening Performance",description:"Ensure new restaurants ramp to target sales and proficiency on schedule.",category:"Multi-Unit & Franchise Operations",industry:"qsr",metrics:["Honeymoon index","Time to steady-state","New-unit OSAT","90-day retention"],personas:["VP of Operations","VP of Development","Franchisee"]},
  {id:"qsr-franchise-compliance",name:"Franchisee Performance & Compliance",description:"Monitor franchisee adherence to brand standards and operational performance.",category:"Multi-Unit & Franchise Operations",industry:"qsr",metrics:["Franchise audit scores","Royalty timeliness","Compliance rate"],personas:["VP of Operations","VP of Franchise Relations"]},
  // QSR — Drive-Thru & Digital Channels
  {id:"qsr-drive-thru",name:"Drive-Thru Throughput & Experience",description:"Maximize cars served per hour while maintaining accuracy. 65-75%+ of sales.",category:"Drive-Thru & Digital Channels",industry:"qsr",metrics:["Cars per hour","Avg time (sec)","Accuracy rate","OSAT","Balk rate"],personas:["Store Manager","District Manager"]},
  {id:"qsr-digital",name:"Digital & Mobile Order Growth",description:"Grow digital sales as % of total for higher average checks and first-party data.",category:"Drive-Thru & Digital Channels",industry:"qsr",metrics:["Digital % of total","App MAUs","Digital avg check","Kiosk utilization %"],personas:["VP of Digital","CMO","District Manager"]},
  {id:"qsr-delivery",name:"Third-Party Delivery Performance",description:"Manage quality, speed, and profitability through DoorDash, Uber Eats, etc.",category:"Drive-Thru & Digital Channels",industry:"qsr",metrics:["Delivery volume","Profitability after commission","Prep time","Error rate"],personas:["VP of Digital","CFO","Store Manager"]},
  {id:"qsr-kitchen",name:"Kitchen / Order Mgmt Efficiency",description:"Optimize order flow through the kitchen across all channels simultaneously.",category:"Drive-Thru & Digital Channels",industry:"qsr",metrics:["Ticket time by channel","Kitchen orders per hour","Throttling events"],personas:["Store Manager","VP of Technology"]},

  // Transport & Logistics — Delivery Performance
  {id:"tl-otd",name:"On-Time Delivery",description:"Ensure shipments arrive within the committed delivery window.",category:"Delivery Performance & Reliability",industry:"transport-logistics",metrics:["OTD %","Late delivery rate","Avg hours late","OTIF rate"],personas:["VP of Logistics","Dispatch Supervisor","Account Manager"]},
  {id:"tl-first-attempt",name:"First-Attempt Delivery Success",description:"Maximize deliveries completed on the first attempt without re-delivery.",category:"Delivery Performance & Reliability",industry:"transport-logistics",metrics:["First-attempt rate","Re-delivery rate","Failed delivery reasons"],personas:["Last-Mile Ops Manager","Dispatch Supervisor"]},
  {id:"tl-accuracy-damage",name:"Order Accuracy & Damage Reduction",description:"Ensure right items delivered in right quantities, undamaged.",category:"Delivery Performance & Reliability",industry:"transport-logistics",metrics:["Accuracy rate","Damage/claims %","Claims cost per shipment"],personas:["Warehouse Manager","Quality & Claims Manager"]},
  {id:"tl-dwell",name:"Dwell Time Reduction",description:"Minimize time trucks spend waiting at facilities for loading/unloading.",category:"Delivery Performance & Reliability",industry:"transport-logistics",metrics:["Avg dwell time","Detention rate","Detention cost per load"],personas:["Fleet Manager","Dispatch Supervisor"]},
  // Transport & Logistics — Fleet & Asset Management
  {id:"tl-fleet-utilization",name:"Fleet Utilization",description:"Maximize productive use of trucks, trailers, and containers.",category:"Fleet & Asset Management",industry:"transport-logistics",metrics:["Utilization %","Revenue per truck per day","Loaded vs empty miles"],personas:["Fleet Manager","VP of Operations","CFO"]},
  {id:"tl-vehicle-uptime",name:"Vehicle Uptime & Preventive Maintenance",description:"Keep vehicles on the road by reducing unplanned breakdowns.",category:"Fleet & Asset Management",industry:"transport-logistics",metrics:["Uptime %","MTBF","PM compliance","Breakdown rate","Maint cost per mile"],personas:["Fleet Manager","Maintenance Director"]},
  {id:"tl-trailer-pool",name:"Trailer Pool Optimization",description:"Balance trailer supply across locations to avoid delays and repositioning costs.",category:"Fleet & Asset Management",industry:"transport-logistics",metrics:["Trailer-to-load ratio","Pool turns per month","Repositioning cost"],personas:["Fleet Manager","Network Planning Manager"]},
  // Transport & Logistics — Warehouse & Distribution
  {id:"tl-dock-throughput",name:"Dock Throughput & Scheduling",description:"Maximize freight processed through dock doors per shift.",category:"Warehouse & Distribution",industry:"transport-logistics",metrics:["Loads per dock door per day","Avg load/unload time","Appointment adherence %"],personas:["Warehouse Manager","Dock Supervisor"]},
  {id:"tl-cross-dock",name:"Cross-Dock Efficiency",description:"Minimize time freight spends in facility between inbound and outbound movements.",category:"Warehouse & Distribution",industry:"transport-logistics",metrics:["Cycle time","Mis-sort rate","Pieces per hour","Outbound load factor"],personas:["Terminal Manager","Warehouse Manager"]},
  {id:"tl-inventory-fulfillment",name:"Inventory Accuracy & Fulfillment Speed",description:"Maintain precise inventory counts and accelerate pick-pack-ship cycles.",category:"Warehouse & Distribution",industry:"transport-logistics",metrics:["Accuracy %","Order cycle time","Pick accuracy","Orders per labor hour"],personas:["Warehouse Manager","Fulfillment Director"]},
  // Transport & Logistics — Route Optimization
  {id:"tl-route-efficiency",name:"Route Efficiency & Miles Reduction",description:"Optimize routes to minimize total miles and increase stops per route.",category:"Route Optimization & Efficiency",industry:"transport-logistics",metrics:["Planned vs actual miles","Miles per stop","Stops per route","Route adherence %"],personas:["Route Planner","Dispatch Supervisor","VP of Logistics"]},
  {id:"tl-deadhead",name:"Empty Miles (Deadhead) Reduction",description:"Minimize miles driven without revenue-generating freight.",category:"Route Optimization & Efficiency",industry:"transport-logistics",metrics:["Empty mile %","Deadhead ratio","Revenue per total mile","Backhaul utilization %"],personas:["Fleet Manager","Network Planning Manager"]},
  {id:"tl-cube-utilization",name:"Load Optimization (Cube Utilization)",description:"Maximize freight density in each trailer — filling both weight and volume.",category:"Route Optimization & Efficiency",industry:"transport-logistics",metrics:["Cube utilization %","Weight utilization %","Revenue per loaded trailer"],personas:["Load Planner","Dispatch Supervisor","VP of Operations"]},
  // Transport & Logistics — Driver Safety & Compliance
  {id:"tl-driver-safety",name:"Driver Safety & Accident Reduction",description:"Reduce frequency and severity of accidents and unsafe driving behaviors.",category:"Driver Safety & Compliance",industry:"transport-logistics",metrics:["Accident rate per M miles","Hard-braking events","CSA scores","Preventable accident rate"],personas:["Safety Director","Fleet Manager","VP of Operations"]},
  {id:"tl-hos",name:"Hours of Service (HOS) Compliance",description:"Ensure drivers operate within federally mandated HOS limits with ELD data.",category:"Driver Safety & Compliance",industry:"transport-logistics",metrics:["HOS violation rate","ELD compliance %","Available drive hours","Out-of-service rate"],personas:["Safety Director","Compliance Manager","Dispatch Supervisor"]},
  {id:"tl-driver-retention",name:"Driver Retention & Satisfaction",description:"Reduce driver turnover (80-95% annually) which costs $8-12K+ per driver to replace.",category:"Driver Safety & Compliance",industry:"transport-logistics",metrics:["Turnover rate","Avg tenure","Satisfaction score","Home-time compliance %"],personas:["VP of Driver Operations","Fleet Manager","HR Director"]},
  // Transport & Logistics — Cost Management
  {id:"tl-cost-per-mile",name:"Cost Per Mile / Per Shipment",description:"Track and reduce all-in operating cost to move freight.",category:"Cost Management",industry:"transport-logistics",metrics:["Cost per mile","Cost per shipment","Operating ratio","Fuel % of revenue"],personas:["CFO","VP of Operations","Fleet Manager"]},
  {id:"tl-fuel",name:"Fuel Cost Optimization",description:"Reduce fuel spend through routing, speed management, and idle reduction. 25-35% of cost.",category:"Cost Management",industry:"transport-logistics",metrics:["Fuel cost per mile","MPG","Idle time %","Fuel discount vs retail"],personas:["Fleet Manager","Finance Director"]},
  {id:"tl-freight-spend",name:"Freight Spend & Carrier Performance",description:"Control freight spend by benchmarking carrier rates and service levels.",category:"Cost Management",industry:"transport-logistics",metrics:["Spend vs budget","Cost per unit shipped","Carrier scorecard","Spot vs contract mix"],personas:["VP of Logistics","Procurement Manager"]},
  // Transport & Logistics — Visibility & Tracking
  {id:"tl-visibility",name:"Real-Time Shipment Visibility",description:"Provide end-to-end real-time location and status for every shipment.",category:"Visibility & Tracking",industry:"transport-logistics",metrics:["% with real-time tracking","Data freshness","Check-call compliance"],personas:["VP of Logistics","Dispatch Supervisor","Customer Success"]},
  {id:"tl-exceptions",name:"Exception & Delay Management",description:"Detect and resolve shipment exceptions before they impact the customer.",category:"Visibility & Tracking",industry:"transport-logistics",metrics:["Detection-to-resolution time","% resolved before impact","Exception rate"],personas:["Dispatch Supervisor","Control Tower Analyst","Customer Success"]},
  {id:"tl-eta",name:"ETA Accuracy & Predictive Arrival",description:"Improve estimated arrival accuracy using historical data and real-time signals.",category:"Visibility & Tracking",industry:"transport-logistics",metrics:["ETA accuracy %","Avg deviation (min)","Confidence score"],personas:["Dispatch Supervisor","Warehouse Manager","Customer Success"]},
  {id:"tl-pod",name:"Proof of Delivery (POD) Digitization",description:"Capture and transmit POD electronically to accelerate invoicing. Paper adds 3-7 days.",category:"Visibility & Tracking",industry:"transport-logistics",metrics:["ePOD capture rate %","Time to POD availability","Dispute rate","DSO impact"],personas:["Finance Director","Fleet Manager"]},
];

/* ═══ ONBOARDING: PERSONA DEFAULTS ═══ */
const PERSONA_DEFAULTS={
  "Plant Manager":["mfg-oee","mfg-downtime","mfg-defects","mfg-otif","mfg-injuries"],
  "VP of Operations":["mfg-cost-per-unit","mfg-oee","mfg-otif","mfg-throughput","mfg-lead-time"],
  "Quality Director":["mfg-defects","mfg-customer-complaints","mfg-regulatory","mfg-supplier-quality"],
  "Maintenance Manager":["mfg-downtime","mfg-preventive-maintenance","mfg-spare-parts"],
  "Production Manager":["mfg-throughput","mfg-changeover","mfg-labor-utilization","mfg-scheduling"],
  "Supply Chain Manager":["mfg-otif","mfg-raw-inventory","mfg-supply-resilience","mfg-supplier-quality"],
  "Store Manager":["qsr-speed","qsr-accuracy","qsr-labor-cost","qsr-food-cost","qsr-food-safety"],
  "District Manager":["qsr-consistency","qsr-profitability","qsr-audit-scores","qsr-retention","qsr-sss"],
  "Franchisee":["qsr-profitability","qsr-labor-cost","qsr-food-cost","qsr-sss","qsr-guest-satisfaction"],
  "VP of Quality Assurance":["qsr-food-safety","qsr-food-quality","qsr-audit-scores"],
  "Fleet Manager":["tl-fleet-utilization","tl-vehicle-uptime","tl-fuel","tl-driver-safety","tl-deadhead"],
  "Dispatch Supervisor":["tl-otd","tl-eta","tl-exceptions","tl-hos","tl-dwell"],
  "VP of Logistics":["tl-cost-per-mile","tl-otd","tl-visibility","tl-freight-spend","tl-fleet-utilization"],
  "Warehouse Manager":["tl-dock-throughput","tl-cross-dock","tl-dwell","tl-inventory-fulfillment"],
  "Safety Director":["tl-driver-safety","tl-hos","tl-driver-retention"],
};

const getGoalsByIndustry=(industry)=>OPERATIONAL_GOALS.filter(g=>g.industry===industry);
const getCompanyGoals=(industry)=>OPERATIONAL_GOALS.filter(g=>g.industry===industry&&g.level==="company");
const getSiteGoals=(industry)=>OPERATIONAL_GOALS.filter(g=>g.industry===industry&&g.level==="site");
const getChildGoals=(parentGoalId)=>OPERATIONAL_GOALS.filter(g=>g.parentGoalId===parentGoalId);
const getGoalById=(goalId)=>OPERATIONAL_GOALS.find(g=>g.id===goalId)||null;
const getPersonasByIndustry=(industry)=>{const p=new Set();OPERATIONAL_GOALS.filter(g=>g.industry===industry).forEach(g=>g.personas.forEach(x=>p.add(x)));return Array.from(p).sort();};

/* Only return personas that have PERSONA_DEFAULTS for this industry */
const getPersonasForIndustry=(industry)=>{
  return Object.keys(PERSONA_DEFAULTS).filter(pName=>{
    const ids=PERSONA_DEFAULTS[pName];
    return ids.some(id=>{const g=OPERATIONAL_GOALS.find(x=>x.id===id);return g&&g.industry===industry;});
  });
};

/* Derive focus description from persona's default goals */
const getPersonaFocus=(pName)=>{
  const ids=PERSONA_DEFAULTS[pName]||[];
  const cats=[...new Set(ids.map(id=>{const g=OPERATIONAL_GOALS.find(x=>x.id===id);return g?g.category:null;}).filter(Boolean))];
  return cats.slice(0,3).join(" · ")+(cats.length>3?` +${cats.length-3}`:"");
};

/* ═══ GOAL SCORING: SIGNALS ═══ */
const _SIGNAL_DEFS=[
  {id:"inspections",label:"Inspections",icon:IC.tasks,color:T.green},
  {id:"actions",label:"Actions Closed",icon:IC.check,color:T.highlight},
  {id:"training",label:"Training",icon:IC.people,color:T.violet},
  {id:"incidents",label:"Incident Reporting",icon:IC.shield,color:T.rose},
  {id:"assets",label:"Asset Compliance",icon:IC.asset,color:T.amber},
  {id:"observations",label:"Observations",icon:IC.target,color:T.accent},
];
const _SIGNAL_WEIGHTS={
  manufacturing:{inspections:25,actions:20,training:20,incidents:15,assets:10,observations:10},
  qsr:{inspections:30,actions:15,training:20,incidents:10,assets:5,observations:20},
  "transport-logistics":{inspections:20,actions:15,training:15,incidents:20,assets:25,observations:5},
};
const getSignalTypesForIndustry=(industry)=>{
  const w=_SIGNAL_WEIGHTS[industry]||_SIGNAL_WEIGHTS.manufacturing;
  return _SIGNAL_DEFS.map(s=>({...s,weight:w[s.id]||10}));
};
const GOAL_SIGNAL_TYPES=getSignalTypesForIndustry("manufacturing");

/* ═══ GOAL SCORING: MOCK SCORES ═══ */
const GOAL_SCORES={
  "mfg-oee":{score:3.8,trend:0.3,signals:{inspections:82,actions:74,training:90,incidents:65,assets:78,observations:70}},
  "mfg-throughput":{score:3.5,trend:0.2,signals:{inspections:78,actions:70,training:85,incidents:60,assets:72,observations:65}},
  "mfg-changeover":{score:2.9,trend:-0.1,signals:{inspections:65,actions:58,training:70,incidents:50,assets:60,observations:55}},
  "mfg-scheduling":{score:3.2,trend:0.1,signals:{inspections:72,actions:65,training:78,incidents:55,assets:68,observations:62}},
  "mfg-defects":{score:4.1,trend:0.4,signals:{inspections:90,actions:82,training:92,incidents:75,assets:85,observations:80}},
  "mfg-supplier-quality":{score:3.0,trend:0.0,signals:{inspections:68,actions:62,training:72,incidents:52,assets:65,observations:58}},
  "mfg-regulatory":{score:4.3,trend:0.2,signals:{inspections:92,actions:88,training:95,incidents:80,assets:90,observations:85}},
  "mfg-customer-complaints":{score:3.6,trend:0.3,signals:{inspections:80,actions:72,training:82,incidents:62,assets:75,observations:68}},
  "mfg-downtime":{score:2.5,trend:-0.2,signals:{inspections:55,actions:48,training:62,incidents:42,assets:50,observations:45}},
  "mfg-preventive-maintenance":{score:2.8,trend:0.1,signals:{inspections:62,actions:55,training:68,incidents:48,assets:58,observations:52}},
  "mfg-spare-parts":{score:3.1,trend:0.0,signals:{inspections:70,actions:64,training:74,incidents:54,assets:66,observations:60}},
  "mfg-raw-inventory":{score:3.4,trend:0.2,signals:{inspections:76,actions:68,training:80,incidents:58,assets:72,observations:66}},
  "mfg-otif":{score:3.7,trend:0.3,signals:{inspections:82,actions:74,training:86,incidents:64,assets:78,observations:72}},
  "mfg-wip":{score:3.3,trend:0.1,signals:{inspections:74,actions:66,training:78,incidents:56,assets:70,observations:64}},
  "mfg-supply-resilience":{score:2.7,trend:-0.1,signals:{inspections:60,actions:52,training:66,incidents:46,assets:56,observations:50}},
  "mfg-injuries":{score:3.9,trend:0.4,signals:{inspections:86,actions:78,training:90,incidents:70,assets:82,observations:76}},
  "mfg-turnover":{score:2.6,trend:-0.2,signals:{inspections:58,actions:50,training:64,incidents:44,assets:54,observations:48}},
  "mfg-training":{score:3.5,trend:0.2,signals:{inspections:78,actions:70,training:88,incidents:60,assets:72,observations:66}},
  "mfg-labor-utilization":{score:3.0,trend:0.0,signals:{inspections:68,actions:60,training:72,incidents:52,assets:64,observations:58}},
  "mfg-cost-per-unit":{score:3.2,trend:0.1,signals:{inspections:72,actions:64,training:76,incidents:54,assets:68,observations:62}},
  "mfg-energy":{score:2.9,trend:0.0,signals:{inspections:64,actions:56,training:70,incidents:48,assets:60,observations:54}},
  "mfg-scrap":{score:3.4,trend:0.2,signals:{inspections:76,actions:68,training:80,incidents:58,assets:72,observations:66}},
  "mfg-asset-utilization":{score:3.1,trend:0.1,signals:{inspections:70,actions:62,training:74,incidents:52,assets:66,observations:60}},
  "mfg-lead-time":{score:3.3,trend:0.2,signals:{inspections:74,actions:66,training:78,incidents:56,assets:70,observations:64}},
  "mfg-site-oee-plant1":{score:3.4,trend:0.4,signals:{inspections:78,actions:70,training:85,incidents:60,assets:74,observations:68}},
  "mfg-site-oee-plant2":{score:3.0,trend:0.1,signals:{inspections:68,actions:58,training:72,incidents:50,assets:62,observations:55}},
  "mfg-site-defects-plant1":{score:4.0,trend:0.3,signals:{inspections:88,actions:80,training:90,incidents:72,assets:82,observations:76}},
  "mfg-site-safety-plant2":{score:3.2,trend:-0.2,signals:{inspections:72,actions:65,training:76,incidents:48,assets:68,observations:60}},
  "mfg-site-downtime-plant1":{score:2.6,trend:0.2,signals:{inspections:58,actions:50,training:64,incidents:44,assets:52,observations:48}},
  "mfg-site-inventory-plant2":{score:2.8,trend:-0.1,signals:{inspections:62,actions:54,training:68,incidents:46,assets:58,observations:52}},
  "qsr-speed":{score:3.6,trend:0.3,signals:{inspections:80,actions:72,training:84,incidents:62,assets:76,observations:70}},
  "qsr-accuracy":{score:4.0,trend:0.2,signals:{inspections:88,actions:80,training:90,incidents:72,assets:84,observations:78}},
  "qsr-guest-satisfaction":{score:3.4,trend:0.1,signals:{inspections:76,actions:68,training:80,incidents:58,assets:72,observations:66}},
  "qsr-food-safety":{score:4.2,trend:0.3,signals:{inspections:92,actions:85,training:94,incidents:78,assets:88,observations:82}},
  "qsr-food-quality":{score:3.8,trend:0.2,signals:{inspections:84,actions:76,training:86,incidents:66,assets:80,observations:74}},
  "qsr-audit-scores":{score:3.5,trend:0.1,signals:{inspections:78,actions:70,training:82,incidents:60,assets:74,observations:68}},
  "qsr-labor-cost":{score:2.8,trend:-0.1,signals:{inspections:62,actions:54,training:68,incidents:46,assets:58,observations:52}},
  "qsr-retention":{score:2.4,trend:-0.3,signals:{inspections:52,actions:44,training:58,incidents:38,assets:48,observations:42}},
  "qsr-scheduling":{score:3.1,trend:0.0,signals:{inspections:70,actions:62,training:74,incidents:52,assets:66,observations:60}},
  "qsr-training":{score:3.3,trend:0.2,signals:{inspections:74,actions:66,training:82,incidents:56,assets:70,observations:64}},
  "qsr-food-cost":{score:3.0,trend:0.0,signals:{inspections:68,actions:60,training:72,incidents:50,assets:64,observations:58}},
  "qsr-waste":{score:2.6,trend:-0.1,signals:{inspections:58,actions:50,training:64,incidents:44,assets:54,observations:48}},
  "qsr-inventory":{score:3.2,trend:0.1,signals:{inspections:72,actions:64,training:76,incidents:54,assets:68,observations:62}},
  "qsr-sss":{score:3.7,trend:0.3,signals:{inspections:82,actions:74,training:86,incidents:64,assets:78,observations:72}},
  "qsr-profitability":{score:3.4,trend:0.2,signals:{inspections:76,actions:68,training:80,incidents:58,assets:72,observations:66}},
  "qsr-daypart":{score:2.9,trend:0.1,signals:{inspections:64,actions:56,training:70,incidents:48,assets:60,observations:54}},
  "qsr-consistency":{score:3.0,trend:0.0,signals:{inspections:68,actions:60,training:72,incidents:50,assets:64,observations:58}},
  "qsr-new-unit":{score:2.7,trend:-0.1,signals:{inspections:60,actions:52,training:66,incidents:46,assets:56,observations:50}},
  "qsr-franchise-compliance":{score:3.5,trend:0.2,signals:{inspections:78,actions:70,training:82,incidents:60,assets:74,observations:68}},
  "qsr-drive-thru":{score:3.8,trend:0.3,signals:{inspections:84,actions:76,training:88,incidents:66,assets:80,observations:74}},
  "qsr-digital":{score:3.1,trend:0.2,signals:{inspections:70,actions:62,training:74,incidents:52,assets:66,observations:60}},
  "qsr-delivery":{score:2.8,trend:0.0,signals:{inspections:62,actions:54,training:68,incidents:46,assets:58,observations:52}},
  "qsr-kitchen":{score:3.3,trend:0.1,signals:{inspections:74,actions:66,training:78,incidents:56,assets:70,observations:64}},
  "tl-otd":{score:3.9,trend:0.3,signals:{inspections:86,actions:78,training:88,incidents:70,assets:82,observations:76}},
  "tl-first-attempt":{score:3.5,trend:0.2,signals:{inspections:78,actions:70,training:82,incidents:60,assets:74,observations:68}},
  "tl-accuracy-damage":{score:4.0,trend:0.2,signals:{inspections:88,actions:80,training:90,incidents:72,assets:84,observations:78}},
  "tl-dwell":{score:2.8,trend:-0.1,signals:{inspections:62,actions:54,training:68,incidents:46,assets:58,observations:52}},
  "tl-fleet-utilization":{score:3.2,trend:0.1,signals:{inspections:72,actions:64,training:76,incidents:54,assets:68,observations:62}},
  "tl-vehicle-uptime":{score:3.0,trend:0.0,signals:{inspections:68,actions:60,training:72,incidents:50,assets:64,observations:58}},
  "tl-trailer-pool":{score:2.6,trend:-0.2,signals:{inspections:58,actions:50,training:64,incidents:44,assets:54,observations:48}},
  "tl-dock-throughput":{score:3.4,trend:0.2,signals:{inspections:76,actions:68,training:80,incidents:58,assets:72,observations:66}},
  "tl-cross-dock":{score:3.1,trend:0.1,signals:{inspections:70,actions:62,training:74,incidents:52,assets:66,observations:60}},
  "tl-inventory-fulfillment":{score:3.6,trend:0.2,signals:{inspections:80,actions:72,training:84,incidents:62,assets:76,observations:70}},
  "tl-route-efficiency":{score:3.3,trend:0.1,signals:{inspections:74,actions:66,training:78,incidents:56,assets:70,observations:64}},
  "tl-deadhead":{score:2.5,trend:-0.2,signals:{inspections:56,actions:48,training:62,incidents:42,assets:52,observations:46}},
  "tl-cube-utilization":{score:2.9,trend:0.0,signals:{inspections:64,actions:56,training:70,incidents:48,assets:60,observations:54}},
  "tl-driver-safety":{score:4.1,trend:0.3,signals:{inspections:90,actions:82,training:92,incidents:74,assets:86,observations:80}},
  "tl-hos":{score:4.3,trend:0.2,signals:{inspections:94,actions:86,training:96,incidents:80,assets:90,observations:84}},
  "tl-driver-retention":{score:2.4,trend:-0.3,signals:{inspections:52,actions:44,training:58,incidents:38,assets:48,observations:42}},
  "tl-cost-per-mile":{score:3.0,trend:0.0,signals:{inspections:68,actions:60,training:72,incidents:50,assets:64,observations:58}},
  "tl-fuel":{score:3.2,trend:0.1,signals:{inspections:72,actions:64,training:76,incidents:54,assets:68,observations:62}},
  "tl-freight-spend":{score:2.7,trend:-0.1,signals:{inspections:60,actions:52,training:66,incidents:46,assets:56,observations:50}},
  "tl-visibility":{score:3.7,trend:0.3,signals:{inspections:82,actions:74,training:86,incidents:64,assets:78,observations:72}},
  "tl-exceptions":{score:3.4,trend:0.2,signals:{inspections:76,actions:68,training:80,incidents:58,assets:72,observations:66}},
  "tl-eta":{score:3.8,trend:0.2,signals:{inspections:84,actions:76,training:88,incidents:66,assets:80,observations:74}},
  "tl-pod":{score:3.5,trend:0.2,signals:{inspections:78,actions:70,training:82,incidents:60,assets:74,observations:68}},
};

const computeAggregateScore=(goalIds)=>{
  const scored=goalIds.filter(id=>GOAL_SCORES[id]);
  if(scored.length===0)return{score:0,trend:0,count:0};
  const total=scored.reduce((s,id)=>s+GOAL_SCORES[id].score,0);
  const trendTotal=scored.reduce((s,id)=>s+GOAL_SCORES[id].trend,0);
  return{score:Math.round((total/scored.length)*10)/10,trend:Math.round((trendTotal/scored.length)*10)/10,count:scored.length};
};

const computeSignalAverages=(goalIds)=>{
  const scored=goalIds.filter(id=>GOAL_SCORES[id]);
  if(scored.length===0)return{};
  const sums={};const counts={};
  scored.forEach(id=>{const s=GOAL_SCORES[id].signals;Object.keys(s).forEach(k=>{sums[k]=(sums[k]||0)+s[k];counts[k]=(counts[k]||0)+1;});});
  const avg={};Object.keys(sums).forEach(k=>{avg[k]=Math.round(sums[k]/counts[k]);});
  return avg;
};

/* ═══ CONNECTOR MAP (goal → data sources) ═══ */
const CONNECTOR_MAP={
  // Manufacturing
  "mfg-oee":[{id:"mes",name:"MES",desc:"Manufacturing Execution System"}],
  "mfg-throughput":[{id:"mes",name:"MES",desc:"Manufacturing Execution System"}],
  "mfg-changeover":[{id:"mes",name:"MES",desc:"Manufacturing Execution System"}],
  "mfg-scheduling":[{id:"erp",name:"ERP",desc:"Enterprise Resource Planning"},{id:"mes",name:"MES",desc:"Manufacturing Execution System"}],
  "mfg-defects":[{id:"qms",name:"QMS",desc:"Quality Management System"},{id:"mes",name:"MES",desc:"Manufacturing Execution System"}],
  "mfg-supplier-quality":[{id:"qms",name:"QMS",desc:"Quality Management System"},{id:"erp",name:"ERP",desc:"Enterprise Resource Planning"}],
  "mfg-regulatory":[{id:"qms",name:"QMS",desc:"Quality Management System"}],
  "mfg-customer-complaints":[{id:"qms",name:"QMS",desc:"Quality Management System"},{id:"crm",name:"CRM",desc:"Customer Relationship Mgmt"}],
  "mfg-downtime":[{id:"cmms",name:"CMMS",desc:"Maintenance Management System"},{id:"mes",name:"MES",desc:"Manufacturing Execution System"}],
  "mfg-preventive-maintenance":[{id:"cmms",name:"CMMS",desc:"Maintenance Management System"}],
  "mfg-spare-parts":[{id:"cmms",name:"CMMS",desc:"Maintenance Management System"},{id:"erp",name:"ERP",desc:"Enterprise Resource Planning"}],
  "mfg-raw-inventory":[{id:"erp",name:"ERP",desc:"Enterprise Resource Planning"}],
  "mfg-otif":[{id:"erp",name:"ERP",desc:"Enterprise Resource Planning"},{id:"wms",name:"WMS",desc:"Warehouse Management System"}],
  "mfg-wip":[{id:"mes",name:"MES",desc:"Manufacturing Execution System"},{id:"erp",name:"ERP",desc:"Enterprise Resource Planning"}],
  "mfg-supply-resilience":[{id:"erp",name:"ERP",desc:"Enterprise Resource Planning"}],
  "mfg-injuries":[{id:"ehs",name:"EHS",desc:"Environment Health & Safety"}],
  "mfg-turnover":[{id:"hris",name:"HRIS",desc:"HR Information System"}],
  "mfg-training":[{id:"lms",name:"LMS",desc:"Learning Management System"},{id:"hris",name:"HRIS",desc:"HR Information System"}],
  "mfg-labor-utilization":[{id:"hris",name:"HRIS",desc:"HR Information System"},{id:"mes",name:"MES",desc:"Manufacturing Execution System"}],
  "mfg-cost-per-unit":[{id:"erp",name:"ERP",desc:"Enterprise Resource Planning"}],
  "mfg-energy":[{id:"scada",name:"SCADA",desc:"Supervisory Control & Data Acq."}],
  "mfg-scrap":[{id:"mes",name:"MES",desc:"Manufacturing Execution System"},{id:"qms",name:"QMS",desc:"Quality Management System"}],
  "mfg-asset-utilization":[{id:"mes",name:"MES",desc:"Manufacturing Execution System"}],
  "mfg-lead-time":[{id:"erp",name:"ERP",desc:"Enterprise Resource Planning"},{id:"mes",name:"MES",desc:"Manufacturing Execution System"}],
  // QSR
  "qsr-speed":[{id:"pos",name:"POS",desc:"Point of Sale System"},{id:"dtt",name:"Drive-Thru Timer",desc:"Timer & sensor system"}],
  "qsr-accuracy":[{id:"pos",name:"POS",desc:"Point of Sale System"},{id:"kds",name:"KDS",desc:"Kitchen Display System"}],
  "qsr-guest-satisfaction":[{id:"pos",name:"POS",desc:"Point of Sale System"},{id:"survey",name:"Survey",desc:"Guest feedback platform"}],
  "qsr-food-safety":[{id:"fst",name:"Food Safety",desc:"Digital temp logs & HACCP"}],
  "qsr-food-quality":[{id:"fst",name:"Food Safety",desc:"Digital temp logs & HACCP"}],
  "qsr-audit-scores":[{id:"audit",name:"Audit Platform",desc:"Brand standards auditing"}],
  "qsr-labor-cost":[{id:"wfm",name:"WFM",desc:"Workforce Management"},{id:"pos",name:"POS",desc:"Point of Sale System"}],
  "qsr-retention":[{id:"wfm",name:"WFM",desc:"Workforce Management"},{id:"hris",name:"HRIS",desc:"HR Information System"}],
  "qsr-scheduling":[{id:"wfm",name:"WFM",desc:"Workforce Management"}],
  "qsr-training":[{id:"lms",name:"LMS",desc:"Learning Management System"}],
  "qsr-food-cost":[{id:"inv",name:"Inventory",desc:"Inventory & ordering system"},{id:"pos",name:"POS",desc:"Point of Sale System"}],
  "qsr-waste":[{id:"inv",name:"Inventory",desc:"Inventory & ordering system"}],
  "qsr-inventory":[{id:"inv",name:"Inventory",desc:"Inventory & ordering system"}],
  "qsr-sss":[{id:"pos",name:"POS",desc:"Point of Sale System"}],
  "qsr-profitability":[{id:"pos",name:"POS",desc:"Point of Sale System"},{id:"erp",name:"ERP",desc:"Enterprise Resource Planning"}],
  "qsr-daypart":[{id:"pos",name:"POS",desc:"Point of Sale System"}],
  "qsr-consistency":[{id:"audit",name:"Audit Platform",desc:"Brand standards auditing"},{id:"pos",name:"POS",desc:"Point of Sale System"}],
  "qsr-new-unit":[{id:"pos",name:"POS",desc:"Point of Sale System"}],
  "qsr-franchise-compliance":[{id:"audit",name:"Audit Platform",desc:"Brand standards auditing"}],
  "qsr-drive-thru":[{id:"dtt",name:"Drive-Thru Timer",desc:"Timer & sensor system"},{id:"pos",name:"POS",desc:"Point of Sale System"}],
  "qsr-digital":[{id:"pos",name:"POS",desc:"Point of Sale System"},{id:"app",name:"Mobile App",desc:"Digital ordering platform"}],
  "qsr-delivery":[{id:"pos",name:"POS",desc:"Point of Sale System"},{id:"dsp",name:"Delivery Platform",desc:"3rd-party delivery integration"}],
  "qsr-kitchen":[{id:"kds",name:"KDS",desc:"Kitchen Display System"},{id:"pos",name:"POS",desc:"Point of Sale System"}],
  // Transport & Logistics
  "tl-otd":[{id:"tms",name:"TMS",desc:"Transportation Management System"}],
  "tl-first-attempt":[{id:"tms",name:"TMS",desc:"Transportation Management System"},{id:"gps",name:"GPS Tracking",desc:"Real-time GPS platform"}],
  "tl-accuracy-damage":[{id:"wms",name:"WMS",desc:"Warehouse Management System"}],
  "tl-dwell":[{id:"tms",name:"TMS",desc:"Transportation Management System"},{id:"ydm",name:"Yard Mgmt",desc:"Yard management system"}],
  "tl-fleet-utilization":[{id:"tms",name:"TMS",desc:"Transportation Management System"},{id:"eld",name:"ELD/Telematics",desc:"Electronic logging device"}],
  "tl-vehicle-uptime":[{id:"fms",name:"Fleet Maint",desc:"Fleet maintenance system"},{id:"eld",name:"ELD/Telematics",desc:"Electronic logging device"}],
  "tl-trailer-pool":[{id:"tms",name:"TMS",desc:"Transportation Management System"}],
  "tl-dock-throughput":[{id:"wms",name:"WMS",desc:"Warehouse Management System"},{id:"ydm",name:"Yard Mgmt",desc:"Yard management system"}],
  "tl-cross-dock":[{id:"wms",name:"WMS",desc:"Warehouse Management System"}],
  "tl-inventory-fulfillment":[{id:"wms",name:"WMS",desc:"Warehouse Management System"}],
  "tl-route-efficiency":[{id:"tms",name:"TMS",desc:"Transportation Management System"},{id:"gps",name:"GPS Tracking",desc:"Real-time GPS platform"}],
  "tl-deadhead":[{id:"tms",name:"TMS",desc:"Transportation Management System"}],
  "tl-cube-utilization":[{id:"tms",name:"TMS",desc:"Transportation Management System"}],
  "tl-driver-safety":[{id:"eld",name:"ELD/Telematics",desc:"Electronic logging device"},{id:"dashcam",name:"Dashcam AI",desc:"Driver safety cameras"}],
  "tl-hos":[{id:"eld",name:"ELD/Telematics",desc:"Electronic logging device"}],
  "tl-driver-retention":[{id:"hris",name:"HRIS",desc:"HR Information System"},{id:"eld",name:"ELD/Telematics",desc:"Electronic logging device"}],
  "tl-cost-per-mile":[{id:"tms",name:"TMS",desc:"Transportation Management System"},{id:"erp",name:"ERP",desc:"Enterprise Resource Planning"}],
  "tl-fuel":[{id:"fuel",name:"Fuel Card",desc:"Fuel card management"},{id:"eld",name:"ELD/Telematics",desc:"Electronic logging device"}],
  "tl-freight-spend":[{id:"tms",name:"TMS",desc:"Transportation Management System"}],
  "tl-visibility":[{id:"tms",name:"TMS",desc:"Transportation Management System"},{id:"gps",name:"GPS Tracking",desc:"Real-time GPS platform"}],
  "tl-exceptions":[{id:"tms",name:"TMS",desc:"Transportation Management System"}],
  "tl-eta":[{id:"tms",name:"TMS",desc:"Transportation Management System"},{id:"gps",name:"GPS Tracking",desc:"Real-time GPS platform"}],
  "tl-pod":[{id:"epod",name:"ePOD",desc:"Electronic proof of delivery"},{id:"tms",name:"TMS",desc:"Transportation Management System"}],
};

/* ═══ WORKFLOW TEMPLATES (industry → workflows with goalId links) ═══ */
const WORKFLOW_TEMPLATES={
  manufacturing:[
    {id:"wf-quality-audit",name:"Quality Inspection Checklist",desc:"Daily quality audit process",steps:12,goalIds:["mfg-defects","mfg-regulatory","mfg-customer-complaints"]},
    {id:"wf-shift-handover",name:"Shift Handover Procedure",desc:"Structured shift transition",steps:8,goalIds:["mfg-throughput","mfg-scheduling","mfg-oee"]},
    {id:"wf-pm-schedule",name:"Preventive Maintenance Routine",desc:"Scheduled equipment PM",steps:10,goalIds:["mfg-downtime","mfg-preventive-maintenance"]},
    {id:"wf-incident-report",name:"Incident Reporting Flow",desc:"Safety event documentation",steps:10,goalIds:["mfg-injuries","mfg-regulatory"]},
    {id:"wf-supplier-receiving",name:"Supplier Receiving Inspection",desc:"Incoming material QC",steps:6,goalIds:["mfg-supplier-quality","mfg-raw-inventory"]},
    {id:"wf-changeover",name:"Changeover Procedure",desc:"Line changeover checklist",steps:8,goalIds:["mfg-changeover","mfg-oee"]},
  ],
  qsr:[
    {id:"wf-opening-checklist",name:"Opening Checklist",desc:"Store opening procedure",steps:14,goalIds:["qsr-food-safety","qsr-audit-scores","qsr-food-quality"]},
    {id:"wf-temp-log",name:"Temperature Logging",desc:"Hourly temp compliance",steps:6,goalIds:["qsr-food-safety","qsr-food-quality"]},
    {id:"wf-line-check",name:"Line Check & Positioning",desc:"Station setup for daypart",steps:8,goalIds:["qsr-speed","qsr-accuracy","qsr-labor-cost"]},
    {id:"wf-waste-tracking",name:"Waste & Discard Tracking",desc:"End-of-day waste log",steps:5,goalIds:["qsr-waste","qsr-food-cost"]},
    {id:"wf-crew-training",name:"New Crew Onboarding",desc:"Training flow for new hire",steps:12,goalIds:["qsr-training","qsr-retention"]},
    {id:"wf-delivery-handoff",name:"Delivery Order Handoff",desc:"3rd-party delivery QC",steps:6,goalIds:["qsr-delivery","qsr-accuracy"]},
  ],
  "transport-logistics":[
    {id:"wf-pre-trip",name:"Pre-Trip Inspection",desc:"DOT pre-trip checklist",steps:16,goalIds:["tl-vehicle-uptime","tl-driver-safety","tl-hos"]},
    {id:"wf-dock-receiving",name:"Dock Receiving & Check-in",desc:"Inbound trailer processing",steps:8,goalIds:["tl-dock-throughput","tl-dwell","tl-accuracy-damage"]},
    {id:"wf-pod-capture",name:"Proof of Delivery Capture",desc:"Electronic POD workflow",steps:5,goalIds:["tl-pod","tl-otd","tl-visibility"]},
    {id:"wf-exception-mgmt",name:"Exception Handling",desc:"Delay/damage escalation",steps:8,goalIds:["tl-exceptions","tl-eta","tl-visibility"]},
    {id:"wf-fuel-audit",name:"Fuel Card Reconciliation",desc:"Weekly fuel spend audit",steps:6,goalIds:["tl-fuel","tl-cost-per-mile"]},
    {id:"wf-driver-debrief",name:"Driver End-of-Day Debrief",desc:"Shift completion checklist",steps:7,goalIds:["tl-driver-safety","tl-hos","tl-driver-retention"]},
  ],
};

/* ═══ PEOPLE & ASSETS TEMPLATES ═══ */
const PEOPLE_ASSETS_TEMPLATES={
  manufacturing:{
    people:[
      {role:"Line Supervisors",goalIds:["mfg-throughput","mfg-changeover","mfg-scheduling","mfg-oee"]},
      {role:"Quality Inspectors",goalIds:["mfg-defects","mfg-regulatory","mfg-supplier-quality"]},
      {role:"Maintenance Technicians",goalIds:["mfg-downtime","mfg-preventive-maintenance","mfg-spare-parts"]},
      {role:"EHS Coordinators",goalIds:["mfg-injuries","mfg-regulatory"]},
      {role:"Process Engineers",goalIds:["mfg-oee","mfg-throughput","mfg-changeover","mfg-energy"]},
    ],
    assets:[
      {name:"Production Lines",goalIds:["mfg-oee","mfg-throughput","mfg-changeover","mfg-asset-utilization"]},
      {name:"CNC & Equipment",goalIds:["mfg-downtime","mfg-preventive-maintenance","mfg-asset-utilization"]},
      {name:"Warehouse Zones",goalIds:["mfg-raw-inventory","mfg-wip","mfg-otif"]},
      {name:"Quality Stations",goalIds:["mfg-defects","mfg-customer-complaints","mfg-regulatory"]},
    ],
  },
  qsr:{
    people:[
      {role:"Shift Leads",goalIds:["qsr-speed","qsr-accuracy","qsr-scheduling","qsr-labor-cost"]},
      {role:"Crew Members",goalIds:["qsr-training","qsr-accuracy","qsr-food-quality"]},
      {role:"Kitchen Staff",goalIds:["qsr-speed","qsr-kitchen","qsr-food-quality"]},
      {role:"District Managers",goalIds:["qsr-consistency","qsr-profitability","qsr-audit-scores"]},
    ],
    assets:[
      {name:"Kitchen Stations",goalIds:["qsr-speed","qsr-accuracy","qsr-kitchen"]},
      {name:"Drive-Thru Lane",goalIds:["qsr-drive-thru","qsr-speed"]},
      {name:"Refrigeration Units",goalIds:["qsr-food-safety","qsr-food-quality"]},
      {name:"POS Terminals",goalIds:["qsr-sss","qsr-digital","qsr-accuracy"]},
    ],
  },
  "transport-logistics":{
    people:[
      {role:"Dispatchers",goalIds:["tl-otd","tl-exceptions","tl-eta","tl-route-efficiency"]},
      {role:"Drivers",goalIds:["tl-driver-safety","tl-hos","tl-driver-retention"]},
      {role:"Dock Workers",goalIds:["tl-dock-throughput","tl-cross-dock","tl-dwell"]},
      {role:"Fleet Coordinators",goalIds:["tl-fleet-utilization","tl-vehicle-uptime","tl-fuel"]},
    ],
    assets:[
      {name:"Trucks & Tractors",goalIds:["tl-fleet-utilization","tl-vehicle-uptime","tl-fuel"]},
      {name:"Trailers",goalIds:["tl-trailer-pool","tl-cube-utilization"]},
      {name:"Dock Doors",goalIds:["tl-dock-throughput","tl-dwell"]},
      {name:"GPS / Telematics",goalIds:["tl-visibility","tl-eta","tl-driver-safety"]},
    ],
  },
};

/* ═══ CONNECTOR CATALOG ═══ */
const CONNECTOR_CATALOG=[
  {id:"ai_models",label:"AI Models",color:T.violet,connectors:[
    {id:"openai",name:"OpenAI",desc:"GPT models for text and vision"},
    {id:"anthropic",name:"Anthropic",desc:"Claude for reasoning and safety"},
    {id:"google_gemini",name:"Google Gemini",desc:"Multimodal AI from Google"},
    {id:"meta_llama",name:"Meta Llama",desc:"Open-source foundation models"},
    {id:"mistral",name:"Mistral",desc:"Efficient European AI models"},
    {id:"cohere",name:"Cohere",desc:"Enterprise NLP and embeddings"},
  ]},
  {id:"hris",label:"HRIS",color:T.highlight,connectors:[
    {id:"workday",name:"Workday",desc:"Enterprise HR and finance"},
    {id:"sap_successfactors",name:"SAP SuccessFactors",desc:"Cloud-based HCM suite"},
    {id:"bamboohr",name:"BambooHR",desc:"HR software for growing teams"},
    {id:"adp_workforce_now",name:"ADP Workforce Now",desc:"All-in-one HR and payroll"},
    {id:"ukg",name:"UKG",desc:"Workforce management platform"},
    {id:"rippling",name:"Rippling",desc:"Unified HR, IT, and finance"},
    {id:"gusto_hr",name:"Gusto",desc:"Payroll, benefits, and HR"},
    {id:"hibob",name:"HiBob",desc:"Modern HR for mid-market"},
    {id:"ceridian_dayforce",name:"Ceridian Dayforce",desc:"Cloud HCM platform"},
    {id:"oracle_hcm",name:"Oracle HCM",desc:"Enterprise human capital mgmt"},
  ]},
  {id:"payroll",label:"Payroll",color:T.green,connectors:[
    {id:"adp_payroll",name:"ADP",desc:"Payroll and tax services"},
    {id:"paychex",name:"Paychex",desc:"Payroll and HR solutions"},
    {id:"gusto_payroll",name:"Gusto",desc:"Modern payroll platform"},
    {id:"xero_payroll",name:"Xero Payroll",desc:"Cloud payroll for Xero users"},
    {id:"quickbooks_payroll",name:"QuickBooks Payroll",desc:"Intuit payroll integration"},
    {id:"ceridian_payroll",name:"Ceridian",desc:"Continuous payroll calculation"},
    {id:"deel",name:"Deel",desc:"Global payroll and compliance"},
    {id:"rippling_payroll",name:"Rippling",desc:"Automated payroll processing"},
    {id:"square_payroll",name:"Square Payroll",desc:"POS-integrated payroll"},
    {id:"sage_payroll",name:"Sage Payroll",desc:"UK and global payroll"},
  ]},
  {id:"erp",label:"ERP",color:T.amber,connectors:[
    {id:"sap_s4hana",name:"SAP S/4HANA",desc:"Next-gen enterprise ERP"},
    {id:"oracle_netsuite",name:"Oracle NetSuite",desc:"Cloud ERP and financials"},
    {id:"microsoft_dynamics",name:"Dynamics 365",desc:"Microsoft cloud ERP"},
    {id:"infor",name:"Infor",desc:"Industry-specific cloud ERP"},
    {id:"epicor",name:"Epicor",desc:"Manufacturing and distribution"},
    {id:"acumatica",name:"Acumatica",desc:"Cloud ERP for mid-market"},
  ]},
  {id:"pos",label:"Point of Sale",color:T.rose,connectors:[
    {id:"square_pos",name:"Square",desc:"Payments and POS platform"},
    {id:"lightspeed",name:"Lightspeed",desc:"Retail and restaurant POS"},
    {id:"toast",name:"Toast",desc:"Restaurant management platform"},
    {id:"shopify_pos",name:"Shopify POS",desc:"Unified commerce POS"},
    {id:"revel",name:"Revel",desc:"Cloud-based iPad POS"},
  ]},
  {id:"telematics",label:"Telematics",color:T.accent,connectors:[
    {id:"samsara",name:"Samsara",desc:"Fleet and equipment IoT"},
    {id:"geotab",name:"Geotab",desc:"Vehicle tracking and analytics"},
    {id:"verizon_connect",name:"Verizon Connect",desc:"Fleet management platform"},
  ]},
  {id:"public_reviews",label:"Public Reviews",color:T.pink,connectors:[
    {id:"google_reviews",name:"Google Reviews",desc:"Google Business review data"},
    {id:"yelp",name:"Yelp",desc:"Local business review platform"},
    {id:"tripadvisor",name:"TripAdvisor",desc:"Travel and dining reviews"},
    {id:"trustpilot",name:"Trustpilot",desc:"Consumer review platform"},
    {id:"facebook_reviews",name:"Facebook Reviews",desc:"Meta business reviews"},
  ]},
  {id:"asset_systems",label:"Asset Systems",color:T.amber,connectors:[
    {id:"upkeep",name:"UpKeep",desc:"Mobile-first maintenance CMMS"},
    {id:"fiix",name:"Fiix",desc:"AI-powered maintenance mgmt"},
    {id:"ibm_maximo",name:"IBM Maximo",desc:"Enterprise asset management"},
    {id:"maintainx",name:"MaintainX",desc:"Work order and procedure mgmt"},
  ]},
  {id:"databases_feeds",label:"Databases & Data Feeds",color:T.highlight,connectors:[
    {id:"postgresql",name:"PostgreSQL",desc:"Open-source relational database"},
    {id:"mysql",name:"MySQL",desc:"Popular open-source SQL database"},
    {id:"snowflake",name:"Snowflake",desc:"Cloud data warehouse"},
    {id:"bigquery",name:"BigQuery",desc:"Google serverless analytics"},
    {id:"redshift",name:"Amazon Redshift",desc:"AWS data warehouse"},
    {id:"rest_api",name:"REST API",desc:"Custom HTTP API connector"},
    {id:"webhooks",name:"Webhooks",desc:"Event-driven HTTP callbacks"},
    {id:"sftp",name:"SFTP",desc:"Secure file transfer protocol"},
  ]},
];

/* ═══ CATALOG APPS ═══ */
/* APP_CATALOG — rich app definitions with workflows, dashboards, and connectors.
   Each app declares goalIds, contains workflows/dashboards, and lists requiredConnectors.
   Duplicated per industry for prototype simplicity (flat data, no conditional logic). */
const APP_CATALOG=[
  /* ────── Manufacturing ────── */
  {
    id:"quality-mgmt",name:"Quality Management",
    description:"Inspection checklists, defect tracking, supplier receiving, and audit workflows",
    color:T.violet,category:"Quality",industry:"manufacturing",
    goalIds:["mfg-defects"],
    workflows:[
      {id:"wf-quality-audit",name:"Quality Inspection Checklist",desc:"Daily quality audit process",steps:12},
      {id:"wf-supplier-receiving",name:"Supplier Receiving Inspection",desc:"Incoming material QC",steps:6},
    ],
    dashboards:[
      {id:"db-quality-overview",name:"Quality Overview",desc:"First-pass yield, defects, and complaint trends"},
    ],
    requiredConnectors:["qms","mes","crm","erp"],
  },
  {
    id:"safety-compliance",name:"Safety & Compliance",
    description:"Incident reporting, safety audits, and regulatory tracking",
    color:T.rose,category:"Compliance",industry:"manufacturing",
    goalIds:["mfg-injuries"],
    workflows:[
      {id:"wf-incident-report",name:"Incident Reporting Flow",desc:"Safety event documentation",steps:10},
    ],
    dashboards:[
      {id:"db-safety-scorecard",name:"Safety Scorecard",desc:"TRIR, near-misses, and compliance scores"},
    ],
    requiredConnectors:["ehs","qms"],
  },
  {
    id:"mfg-maintenance",name:"Maintenance Manager",
    description:"Preventive maintenance, work orders, and asset health tracking",
    color:T.highlight,category:"Maintenance",industry:"manufacturing",
    goalIds:["mfg-downtime"],
    workflows:[
      {id:"wf-pm-schedule",name:"Preventive Maintenance Routine",desc:"Scheduled equipment PM",steps:10},
    ],
    dashboards:[
      {id:"db-maintenance-health",name:"Asset Health Dashboard",desc:"MTBF, PM compliance, and breakdown trends"},
    ],
    requiredConnectors:["cmms","mes"],
  },
  {
    id:"mfg-shift-mgmt",name:"Shift Management",
    description:"Handover processes, changeover procedures, and crew scheduling",
    color:T.amber,category:"Operations",industry:"manufacturing",
    goalIds:["mfg-throughput"],
    workflows:[
      {id:"wf-shift-handover",name:"Shift Handover Procedure",desc:"Structured shift transition",steps:8},
      {id:"wf-changeover",name:"Changeover Procedure",desc:"Line changeover checklist",steps:8},
    ],
    dashboards:[
      {id:"db-shift-performance",name:"Shift Performance",desc:"Throughput, schedule adherence, and OEE by shift"},
    ],
    requiredConnectors:["mes","erp"],
  },
  {
    id:"production-ops",name:"Production Operations",
    description:"Production scheduling, OEE tracking, and capacity optimisation",
    color:T.green,category:"Operations",industry:"manufacturing",
    goalIds:["mfg-oee"],
    workflows:[
      {id:"wf-daily-production",name:"Daily Production Review",desc:"OEE and throughput daily check",steps:8},
      {id:"wf-capacity-planning",name:"Capacity Planning Workflow",desc:"Weekly capacity and scheduling review",steps:6},
    ],
    dashboards:[
      {id:"db-oee-tracker",name:"OEE Tracker",desc:"Real-time OEE, availability, performance, and quality"},
      {id:"db-production-costs",name:"Production Cost Analysis",desc:"Cost per unit trending and variance"},
    ],
    requiredConnectors:["mes","erp"],
  },
  {
    id:"mfg-inventory-mgmt",name:"Inventory Management",
    description:"Raw material tracking, WIP reduction, and supply chain optimisation",
    color:T.amber,category:"Supply Chain",industry:"manufacturing",
    goalIds:["mfg-raw-inventory"],
    workflows:[
      {id:"wf-inventory-count",name:"Inventory Cycle Count",desc:"Periodic inventory accuracy check",steps:7},
      {id:"wf-reorder-review",name:"Reorder Point Review",desc:"Weekly stock level and reorder assessment",steps:5},
    ],
    dashboards:[
      {id:"db-inventory-health",name:"Inventory Health",desc:"Days on hand, turnover, and stockout alerts"},
    ],
    requiredConnectors:["erp","wms","mes"],
  },
  {
    id:"mfg-training-ops",name:"Training & Onboarding",
    description:"Operator training modules, certification tracking, and skill assessments",
    color:T.pink,category:"People",industry:"manufacturing",
    goalIds:["mfg-training"],
    workflows:[
      {id:"wf-operator-training",name:"Operator Certification Flow",desc:"Equipment-specific training and sign-off",steps:10},
      {id:"wf-new-hire-onboarding",name:"New Hire Onboarding",desc:"Manufacturing onboarding checklist",steps:12},
    ],
    dashboards:[
      {id:"db-training-compliance",name:"Training Compliance",desc:"Completion rates, expiring certs, and skills gaps"},
    ],
    requiredConnectors:["lms","hris"],
  },

  /* ────── QSR ────── */
  {
    id:"food-safety",name:"Food Safety",
    description:"HACCP compliance, temperature logs, and inspection workflows",
    color:T.green,category:"Compliance",industry:"qsr",
    goalIds:["qsr-food-safety"],
    workflows:[
      {id:"wf-opening-checklist",name:"Opening Checklist",desc:"Store opening procedure",steps:14},
      {id:"wf-temp-log",name:"Temperature Logging",desc:"Hourly temp compliance",steps:6},
    ],
    dashboards:[
      {id:"db-compliance-scorecard",name:"Compliance Scorecard",desc:"Food safety metrics and audit trends"},
    ],
    requiredConnectors:["fst","audit"],
  },
  {
    id:"qsr-shift-mgmt",name:"Shift Management",
    description:"Line checks, station positioning, and crew scheduling",
    color:T.amber,category:"Operations",industry:"qsr",
    goalIds:["qsr-speed"],
    workflows:[
      {id:"wf-line-check",name:"Line Check & Positioning",desc:"Station setup for daypart",steps:8},
    ],
    dashboards:[
      {id:"db-shift-performance-qsr",name:"Shift Performance",desc:"Speed of service, accuracy, and labor cost by shift"},
    ],
    requiredConnectors:["pos","dtt","kds","wfm"],
  },
  {
    id:"qsr-inventory-mgmt",name:"Inventory Management",
    description:"Waste tracking, food cost control, and stock management",
    color:T.amber,category:"Supply Chain",industry:"qsr",
    goalIds:["qsr-waste"],
    workflows:[
      {id:"wf-waste-tracking",name:"Waste & Discard Tracking",desc:"End-of-day waste log",steps:5},
    ],
    dashboards:[
      {id:"db-food-cost",name:"Food Cost Dashboard",desc:"Theoretical vs actual food cost and waste trends"},
    ],
    requiredConnectors:["inv","pos"],
  },
  {
    id:"qsr-training-ops",name:"Training & Onboarding",
    description:"New crew onboarding, certification tracking, and skill development",
    color:T.pink,category:"People",industry:"qsr",
    goalIds:["qsr-training"],
    workflows:[
      {id:"wf-crew-training",name:"New Crew Onboarding",desc:"Training flow for new hire",steps:12},
    ],
    dashboards:[
      {id:"db-crew-readiness",name:"Crew Readiness",desc:"Training completion, retention rates, and time-to-proficiency"},
    ],
    requiredConnectors:["lms","wfm","hris"],
  },
  {
    id:"delivery-ops",name:"Delivery Operations",
    description:"Third-party delivery handoff, digital order management, and accuracy tracking",
    color:T.highlight,category:"Operations",industry:"qsr",
    goalIds:["qsr-delivery"],
    workflows:[
      {id:"wf-delivery-handoff",name:"Delivery Order Handoff",desc:"3rd-party delivery QC",steps:6},
    ],
    dashboards:[
      {id:"db-delivery-performance",name:"Delivery Performance",desc:"Delivery volume, error rate, and profitability"},
    ],
    requiredConnectors:["pos","dsp","kds","app"],
  },
  {
    id:"restaurant-ops",name:"Restaurant Operations",
    description:"Drive-thru optimisation, kitchen management, and service speed tracking",
    color:T.rose,category:"Operations",industry:"qsr",
    goalIds:["qsr-drive-thru"],
    workflows:[
      {id:"wf-drive-thru-check",name:"Drive-Thru Performance Check",desc:"Hourly speed and accuracy review",steps:6},
      {id:"wf-kitchen-flow",name:"Kitchen Order Flow Review",desc:"Channel balancing and ticket time audit",steps:5},
    ],
    dashboards:[
      {id:"db-drive-thru",name:"Drive-Thru Dashboard",desc:"Cars per hour, average time, and accuracy"},
      {id:"db-kitchen-ops",name:"Kitchen Operations",desc:"Ticket times by channel and throttling events"},
    ],
    requiredConnectors:["dtt","pos","kds"],
  },
  {
    id:"brand-standards",name:"Brand Standards & Compliance",
    description:"Brand audit management, mystery shop tracking, and franchise compliance scoring",
    color:T.violet,category:"Compliance",industry:"qsr",
    goalIds:["qsr-audit-scores","qsr-food-quality","qsr-consistency","qsr-franchise-compliance"],
    workflows:[
      {id:"wf-brand-audit",name:"Brand Standards Audit",desc:"Full-location brand compliance assessment covering cleanliness, food presentation, and service standards",steps:18},
      {id:"wf-mystery-shop",name:"Mystery Shop Review",desc:"Process and score incoming mystery shopper reports",steps:8},
    ],
    dashboards:[
      {id:"db-brand-compliance",name:"Brand Compliance",desc:"Audit scores, trends, and location comparison"},
      {id:"db-mystery-shop",name:"Mystery Shop Tracker",desc:"Shop scores by location and improvement areas"},
    ],
    requiredConnectors:["audit","pos"],
  },
  {
    id:"incident-mgmt",name:"Incident Management",
    description:"Incident reporting, investigation workflows, and corrective action tracking",
    color:T.rose,category:"Safety",industry:"qsr",
    goalIds:["qsr-food-safety","qsr-audit-scores","qsr-guest-satisfaction"],
    workflows:[
      {id:"wf-incident-report",name:"Incident Report",desc:"Structured incident capture with severity classification and immediate actions",steps:10},
      {id:"wf-investigation",name:"Investigation Workflow",desc:"Root cause analysis and corrective action plan for reported incidents",steps:12},
    ],
    dashboards:[
      {id:"db-incident-tracker",name:"Incident Tracker",desc:"Open incidents, severity trends, and CAPA status"},
      {id:"db-capa",name:"CAPA Dashboard",desc:"Corrective and preventive action tracking and closure rates"},
    ],
    requiredConnectors:["fst","audit"],
  },

  /* ────── Transport & Logistics ────── */
  {
    id:"fleet-ops",name:"Fleet Operations",
    description:"Vehicle inspections, driver management, fuel audits, and route compliance",
    color:T.highlight,category:"Operations",industry:"transport-logistics",
    goalIds:["tl-vehicle-uptime"],
    workflows:[
      {id:"wf-pre-trip",name:"Pre-Trip Inspection",desc:"DOT pre-trip checklist",steps:16},
      {id:"wf-fuel-audit",name:"Fuel Card Reconciliation",desc:"Weekly fuel spend audit",steps:6},
      {id:"wf-driver-debrief",name:"Driver End-of-Day Debrief",desc:"Shift completion checklist",steps:7},
    ],
    dashboards:[
      {id:"db-fleet-health",name:"Fleet Health",desc:"Vehicle uptime, MTBF, and maintenance costs"},
      {id:"db-driver-safety",name:"Driver Safety Scorecard",desc:"Accident rates, HOS compliance, and CSA scores"},
    ],
    requiredConnectors:["fms","eld","dashcam","fuel","tms","erp","hris"],
  },
  {
    id:"dock-ops",name:"Dock Operations",
    description:"Dock receiving, check-in, cross-dock efficiency, and dwell time management",
    color:T.amber,category:"Operations",industry:"transport-logistics",
    goalIds:["tl-dock-throughput"],
    workflows:[
      {id:"wf-dock-receiving",name:"Dock Receiving & Check-in",desc:"Inbound trailer processing",steps:8},
    ],
    dashboards:[
      {id:"db-dock-throughput",name:"Dock Throughput",desc:"Loads per door, dwell time, and appointment adherence"},
    ],
    requiredConnectors:["wms","ydm","tms"],
  },
  {
    id:"delivery-tracking",name:"Delivery Tracking",
    description:"POD capture, exception handling, and real-time shipment visibility",
    color:T.green,category:"Operations",industry:"transport-logistics",
    goalIds:["tl-otd"],
    workflows:[
      {id:"wf-pod-capture",name:"Proof of Delivery Capture",desc:"Electronic POD workflow",steps:5},
      {id:"wf-exception-mgmt",name:"Exception Handling",desc:"Delay/damage escalation",steps:8},
    ],
    dashboards:[
      {id:"db-delivery-visibility",name:"Shipment Visibility",desc:"Real-time tracking, OTD rate, and ETA accuracy"},
    ],
    requiredConnectors:["epod","tms","gps"],
  },
  {
    id:"route-ops",name:"Route Optimisation",
    description:"Route planning, empty mile reduction, and load optimisation",
    color:T.violet,category:"Operations",industry:"transport-logistics",
    goalIds:["tl-route-efficiency"],
    workflows:[
      {id:"wf-route-review",name:"Daily Route Review",desc:"Planned vs actual route analysis",steps:6},
      {id:"wf-load-planning",name:"Load Planning Check",desc:"Cube and weight utilisation review",steps:5},
    ],
    dashboards:[
      {id:"db-route-efficiency",name:"Route Efficiency",desc:"Miles per stop, deadhead ratio, and cube utilisation"},
    ],
    requiredConnectors:["tms","gps"],
  },
  {
    id:"tl-inventory-mgmt",name:"Inventory Management",
    description:"Warehouse inventory accuracy and pick-pack-ship optimisation",
    color:T.amber,category:"Supply Chain",industry:"transport-logistics",
    goalIds:["tl-inventory-fulfillment"],
    workflows:[
      {id:"wf-warehouse-count",name:"Warehouse Cycle Count",desc:"Inventory accuracy verification",steps:7},
      {id:"wf-fulfillment-check",name:"Fulfillment Quality Check",desc:"Pick accuracy and order completeness audit",steps:5},
    ],
    dashboards:[
      {id:"db-warehouse-ops",name:"Warehouse Operations",desc:"Inventory accuracy, order cycle time, and fulfillment speed"},
    ],
    requiredConnectors:["wms"],
  },
];

/* ═══ APP CATALOG HELPERS ═══ */
const getAppsByIndustry=(industry)=>APP_CATALOG.filter(a=>!a.industry||a.industry===industry);
const getAppsForGoal=(goalId)=>APP_CATALOG.filter(a=>a.goalIds.includes(goalId));
const getAppWorkflowsForGoal=(goalId)=>APP_CATALOG.filter(a=>a.goalIds.includes(goalId)).flatMap(a=>a.workflows.map(w=>({...w,appId:a.id,appName:a.name})));
const getAppConnectorsForGoal=(goalId)=>{
  const ids=new Set();const result=[];
  APP_CATALOG.filter(a=>a.goalIds.includes(goalId)).forEach(a=>{
    (a.requiredConnectors||[]).forEach(cId=>{if(!ids.has(cId)){ids.add(cId);result.push(cId);}});
  });
  return result;
};
const getConnectorById=(cId)=>{
  /* Try individual connector first */
  for(const cat of CONNECTOR_CATALOG){
    const found=cat.connectors.find(c=>c.id===cId);
    if(found)return{...found,category:cat.label,categoryColor:cat.color};
  }
  /* Fall back to category-level match (apps reference category IDs) */
  const cat=CONNECTOR_CATALOG.find(c=>c.id===cId);
  if(cat)return{id:cat.id,name:cat.label,desc:cat.connectors[0]?.desc||"",category:cat.label,categoryColor:cat.color,isCategory:true};
  return null;
};

/* ═══ APP AGENT INSIGHTS ═══ */
/* Each app has a named AI agent that proactively surfaces insights */
const APP_AGENT_INSIGHTS={
  /* Manufacturing */
  "quality-mgmt":{
    agent:"Quality Agent",
    status:"active",
    lastRun:"12 min ago",
    insights:[
      {type:"alert",title:"Defect spike on Line 3",desc:"First-pass yield dropped 4.2% in the last shift. Root cause appears linked to the bearing replacement on Station 7.",severity:"high",time:"11 min ago"},
      {type:"trend",title:"Supplier quality improving",desc:"Incoming material rejection rate down 18% over 30 days. Top 3 suppliers all above 98% acceptance.",severity:"positive",time:"2 hrs ago"},
      {type:"recommendation",title:"Schedule audit for Line 1",desc:"Line 1 hasn't had a quality audit in 14 days. Based on historical patterns, scheduling one this week could prevent a compliance gap.",severity:"medium",time:"4 hrs ago"},
    ],
  },
  "safety-compliance":{
    agent:"Safety Agent",
    status:"active",
    lastRun:"8 min ago",
    insights:[
      {type:"alert",title:"Near-miss cluster in Zone B",desc:"3 near-miss reports filed in Zone B this week — 2x the monthly average. Recommend a safety walk-through.",severity:"high",time:"25 min ago"},
      {type:"trend",title:"TRIR trending down",desc:"Total Recordable Incident Rate has decreased 22% quarter-over-quarter. EHS training completion correlates strongly.",severity:"positive",time:"1 hr ago"},
      {type:"recommendation",title:"Update lockout/tagout procedure",desc:"Procedure LOTO-04 hasn't been reviewed in 11 months. Regulatory best practice is every 6 months.",severity:"medium",time:"3 hrs ago"},
    ],
  },
  "mfg-maintenance":{
    agent:"Maintenance Agent",
    status:"active",
    lastRun:"5 min ago",
    insights:[
      {type:"alert",title:"Bearing temp anomaly — CNC-07",desc:"Temperature readings 12°C above baseline on CNC-07 spindle bearing. Failure probability: 34% within 72 hours.",severity:"high",time:"5 min ago"},
      {type:"trend",title:"PM compliance at 94%",desc:"Preventive maintenance completion rate improved from 87% to 94% over the last 60 days.",severity:"positive",time:"1 hr ago"},
      {type:"recommendation",title:"Reorder spare filter kits",desc:"Filter kit inventory will hit zero in ~8 days based on current usage. Lead time is 5 business days.",severity:"medium",time:"2 hrs ago"},
    ],
  },
  "mfg-shift-mgmt":{
    agent:"Shift Agent",
    status:"active",
    lastRun:"18 min ago",
    insights:[
      {type:"alert",title:"Overtime trending above budget",desc:"Week-to-date overtime is at 112% of budget. Night shift is the primary driver.",severity:"high",time:"18 min ago"},
      {type:"trend",title:"Changeover time reduced",desc:"Average changeover time down 11 min (from 42 to 31 min) since new procedure was implemented.",severity:"positive",time:"3 hrs ago"},
      {type:"recommendation",title:"Rebalance crew allocation",desc:"Day shift is overstaffed by 2 operators vs demand. Suggest reassigning to evening shift which is short.",severity:"medium",time:"5 hrs ago"},
    ],
  },
  "production-ops":{
    agent:"Production Agent",
    status:"active",
    lastRun:"3 min ago",
    insights:[
      {type:"alert",title:"OEE below target on Line 2",desc:"Line 2 OEE at 71% vs 85% target. Availability is the constraint — 3 unplanned stops in the last 4 hours.",severity:"high",time:"3 min ago"},
      {type:"trend",title:"Throughput up 6% this week",desc:"Overall throughput increased 6% week-over-week. Line 1 and Line 4 are the top contributors.",severity:"positive",time:"1 hr ago"},
      {type:"recommendation",title:"Review scheduling algorithm",desc:"Current scheduling creates 23% idle time between runs. Optimising job sequencing could recover ~45 min/shift.",severity:"medium",time:"4 hrs ago"},
    ],
  },
  "mfg-inventory-mgmt":{
    agent:"Inventory Agent",
    status:"active",
    lastRun:"22 min ago",
    insights:[
      {type:"alert",title:"Raw material stockout risk",desc:"Aluminium billet stock will fall below safety threshold in 3 days. Supplier lead time is 5 days.",severity:"high",time:"22 min ago"},
      {type:"trend",title:"WIP inventory declining",desc:"Work-in-progress value decreased 15% over 30 days, freeing $42k in working capital.",severity:"positive",time:"2 hrs ago"},
      {type:"recommendation",title:"Consolidate reorder points",desc:"5 SKUs have overlapping reorder windows. Consolidating orders could save ~$2,800 in freight costs.",severity:"medium",time:"6 hrs ago"},
    ],
  },
  "mfg-training-ops":{
    agent:"Training Agent",
    status:"active",
    lastRun:"45 min ago",
    insights:[
      {type:"alert",title:"3 certifications expiring this week",desc:"CNC operation certs for M. Torres, K. Singh, and R. Patel expire within 7 days. Training slots available Thursday.",severity:"high",time:"45 min ago"},
      {type:"trend",title:"Onboarding time reduced",desc:"Average time-to-proficiency for new operators down from 18 to 14 days since updated training modules.",severity:"positive",time:"3 hrs ago"},
      {type:"recommendation",title:"Cross-train Line 2 operators",desc:"Line 2 has single-operator dependency on 3 stations. Cross-training reduces production risk.",severity:"medium",time:"5 hrs ago"},
    ],
  },
  /* QSR */
  "food-safety":{
    agent:"Food Safety Agent",
    status:"active",
    lastRun:"6 min ago",
    insights:[
      {type:"alert",title:"Walk-in cooler temp variance",desc:"Unit 2 walk-in recorded 42°F at 6:15am — above the 40°F threshold. Returned to range by 6:28am but needs investigation.",severity:"high",time:"6 min ago"},
      {type:"trend",title:"Audit scores improving",desc:"Rolling 30-day food safety audit score is 96.2, up from 93.1 last month. Opening checklist compliance is the key driver.",severity:"positive",time:"1 hr ago"},
      {type:"recommendation",title:"Add midday temp check",desc:"Historical data shows 2pm-4pm is the highest risk window for temp excursions. Adding a scheduled check could prevent 60% of violations.",severity:"medium",time:"3 hrs ago"},
    ],
  },
  "qsr-shift-mgmt":{
    agent:"Shift Agent",
    status:"active",
    lastRun:"14 min ago",
    insights:[
      {type:"alert",title:"Drive-thru speed above target",desc:"Average service time hit 4:12 during lunch rush vs 3:30 target. Station 2 bottleneck identified.",severity:"high",time:"14 min ago"},
      {type:"trend",title:"Order accuracy at 98.4%",desc:"Accuracy rate up 1.2% since new line check procedure was introduced 3 weeks ago.",severity:"positive",time:"2 hrs ago"},
      {type:"recommendation",title:"Adjust staffing for Friday peak",desc:"Last 4 Fridays showed 22% higher volume than scheduled labour. Suggest adding 2 crew for 11am-2pm.",severity:"medium",time:"4 hrs ago"},
    ],
  },
  "qsr-inventory-mgmt":{
    agent:"Inventory Agent",
    status:"active",
    lastRun:"30 min ago",
    insights:[
      {type:"alert",title:"Waste above threshold",desc:"Yesterday's waste was 4.8% of food cost vs 3.5% target. Fry station discards were the main contributor.",severity:"high",time:"30 min ago"},
      {type:"trend",title:"Food cost trending down",desc:"Theoretical vs actual food cost gap narrowed from 2.1% to 1.4% over 30 days.",severity:"positive",time:"2 hrs ago"},
      {type:"recommendation",title:"Review batch sizes at fry station",desc:"Reducing batch size by 20% during off-peak could cut fry waste by ~35% without impacting speed.",severity:"medium",time:"5 hrs ago"},
    ],
  },
  "qsr-training-ops":{
    agent:"Training Agent",
    status:"active",
    lastRun:"1 hr ago",
    insights:[
      {type:"alert",title:"New hire behind on training",desc:"J. Martinez (started 5 days ago) has only completed 2 of 6 required modules. Target is 4 by day 5.",severity:"high",time:"1 hr ago"},
      {type:"trend",title:"Retention improving",desc:"90-day retention rate up to 78% from 64% since structured onboarding was introduced.",severity:"positive",time:"3 hrs ago"},
      {type:"recommendation",title:"Schedule food safety refresher",desc:"8 crew members are due for annual food safety refresher within 30 days.",severity:"medium",time:"4 hrs ago"},
    ],
  },
  "delivery-ops":{
    agent:"Delivery Agent",
    status:"active",
    lastRun:"10 min ago",
    insights:[
      {type:"alert",title:"DoorDash error rate spiking",desc:"Order error rate for DoorDash jumped to 6.2% today vs 2.8% average. Packaging label mismatches are the cause.",severity:"high",time:"10 min ago"},
      {type:"trend",title:"Delivery volume up 14%",desc:"Third-party delivery orders are up 14% month-over-month. Uber Eats now accounts for 42% of delivery volume.",severity:"positive",time:"2 hrs ago"},
      {type:"recommendation",title:"Add delivery staging area",desc:"Current handoff area causes congestion during peak. A dedicated staging shelf could reduce driver wait time by ~3 min.",severity:"medium",time:"6 hrs ago"},
    ],
  },
  "restaurant-ops":{
    agent:"Restaurant Agent",
    status:"active",
    lastRun:"8 min ago",
    insights:[
      {type:"alert",title:"Kitchen ticket time above 6 min",desc:"Average ticket time hit 6:24 during 12-1pm. Grill station was the bottleneck — 2 orders backed up.",severity:"high",time:"8 min ago"},
      {type:"trend",title:"Drive-thru cars per hour improving",desc:"Average cars/hour up from 28 to 31 over the last 2 weeks. New positioning guide is working.",severity:"positive",time:"1 hr ago"},
      {type:"recommendation",title:"Enable order throttling",desc:"When kitchen queue exceeds 8 tickets, auto-throttling delivery orders could prevent quality drops.",severity:"medium",time:"3 hrs ago"},
    ],
  },
  "brand-standards":{
    agent:"Brand Standards Agent",
    status:"active",
    lastRun:"20 min ago",
    insights:[
      {type:"alert",title:"Location #7 audit score dropped",desc:"Store #7 scored 74% on latest brand audit — down from 89%. Restroom cleanliness and menu board accuracy were main deductions.",severity:"high",time:"20 min ago"},
      {type:"trend",title:"System-wide audit average up 3 pts",desc:"Average brand audit score across 12 locations improved from 86% to 89% over the last 60 days.",severity:"positive",time:"2 hrs ago"},
      {type:"recommendation",title:"Schedule mystery shops for Q2",desc:"4 locations haven't had a mystery shop in 45+ days. Scheduling before month-end ensures consistent coverage.",severity:"medium",time:"5 hrs ago"},
    ],
  },
  "incident-mgmt":{
    agent:"Incident Agent",
    status:"active",
    lastRun:"12 min ago",
    insights:[
      {type:"alert",title:"Slip-and-fall reported at Store #3",desc:"Guest slip-and-fall in dining area at 11:42am. First aid administered, incident report filed. Floor mat was displaced.",severity:"high",time:"12 min ago"},
      {type:"trend",title:"Incident volume down 18%",desc:"Total reported incidents dropped from 11 to 9 month-over-month. Burns category showed largest improvement.",severity:"positive",time:"3 hrs ago"},
      {type:"recommendation",title:"Close 3 overdue CAPAs",desc:"3 corrective actions from February incidents are past their 14-day closure target. Escalation recommended.",severity:"medium",time:"6 hrs ago"},
    ],
  },
  /* Transport & Logistics */
  "fleet-ops":{
    agent:"Fleet Agent",
    status:"active",
    lastRun:"4 min ago",
    insights:[
      {type:"alert",title:"Unit 4472 brake inspection overdue",desc:"Pre-trip inspection flagged soft brake pedal. Vehicle should be taken out of service for inspection.",severity:"high",time:"4 min ago"},
      {type:"trend",title:"Fleet uptime at 96.2%",desc:"Vehicle uptime improved from 93.8% to 96.2% since predictive maintenance was enabled.",severity:"positive",time:"1 hr ago"},
      {type:"recommendation",title:"Rotate tyre sets on 6 units",desc:"Tread depth analysis shows 6 units approaching minimum. Rotating now extends life by ~15,000 miles.",severity:"medium",time:"3 hrs ago"},
    ],
  },
  "dock-ops":{
    agent:"Dock Agent",
    status:"active",
    lastRun:"15 min ago",
    insights:[
      {type:"alert",title:"Dock 3 dwell time at 4.2 hrs",desc:"Trailer at Dock 3 has been waiting 4.2 hours — 2.5x the average. Driver is past their appointment window.",severity:"high",time:"15 min ago"},
      {type:"trend",title:"Throughput up 8% this week",desc:"Loads processed per door increased from 12.4 to 13.4 daily average.",severity:"positive",time:"2 hrs ago"},
      {type:"recommendation",title:"Stagger appointment windows",desc:"Current 30-min windows create bunching at 8am and 1pm. 15-min stagger could reduce peak wait by 40%.",severity:"medium",time:"4 hrs ago"},
    ],
  },
  "delivery-tracking":{
    agent:"Delivery Agent",
    status:"active",
    lastRun:"7 min ago",
    insights:[
      {type:"alert",title:"3 shipments with ETA risk",desc:"Orders #4891, #4903, #4912 are projected to miss delivery windows. Weather delay on I-95 corridor.",severity:"high",time:"7 min ago"},
      {type:"trend",title:"On-time delivery at 94.6%",desc:"OTD rate improved 1.8% month-over-month. POD capture compliance is now at 99.1%.",severity:"positive",time:"1 hr ago"},
      {type:"recommendation",title:"Proactively notify customer",desc:"3 at-risk shipments should trigger proactive ETA updates to customers before they escalate.",severity:"medium",time:"2 hrs ago"},
    ],
  },
  "route-ops":{
    agent:"Route Agent",
    status:"active",
    lastRun:"20 min ago",
    insights:[
      {type:"alert",title:"Deadhead ratio above 18%",desc:"Empty miles hit 18.3% this week vs 14% target. Northeast corridor is the main driver.",severity:"high",time:"20 min ago"},
      {type:"trend",title:"Cube utilisation improving",desc:"Average trailer cube utilisation up from 76% to 82% since load planning optimisation was enabled.",severity:"positive",time:"2 hrs ago"},
      {type:"recommendation",title:"Consolidate NE corridor runs",desc:"Combining 3 partial loads on the NE corridor into 2 full loads could save ~$1,200/week in fuel.",severity:"medium",time:"5 hrs ago"},
    ],
  },
  "tl-inventory-mgmt":{
    agent:"Warehouse Agent",
    status:"active",
    lastRun:"35 min ago",
    insights:[
      {type:"alert",title:"Pick accuracy below target",desc:"Pick accuracy at 97.8% vs 99.5% target. Zone C is responsible for 60% of errors — mislabelled bins.",severity:"high",time:"35 min ago"},
      {type:"trend",title:"Order cycle time reduced",desc:"Average order cycle time decreased from 2.4 hrs to 1.9 hrs over 30 days.",severity:"positive",time:"2 hrs ago"},
      {type:"recommendation",title:"Re-slot Zone C bins",desc:"High-velocity SKUs in Zone C are in suboptimal positions. Re-slotting could reduce pick time by ~20%.",severity:"medium",time:"4 hrs ago"},
    ],
  },
};

/* ═══ CONNECTOR ICONS ═══ */
const CICO=(()=>{
  const mk=(vb,paths,fill)=>({vb,paths,fill});
  return{
    // AI Models
    openai:mk("0 0 24 24",[{d:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3l2.5 5H17l-4 3.5 1.5 5.5-4.5-3-4.5 3 1.5-5.5L3 10h4.5L12 5z",fill:"#10A37F"}]),
    anthropic:mk("0 0 24 24",[{d:"M12 3L4 21h3.5l1.5-3h6l1.5 3H20L12 3zm0 5.5L14.5 15h-5L12 8.5z",fill:"#D97706"}]),
    google_gemini:mk("0 0 24 24",[{d:"M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z",fill:"#4285F4"},{d:"M12 7l1.2 3.6L17 12l-3.8 1.4L12 17l-1.2-3.6L7 12l3.8-1.4L12 7z",fill:"#EA4335"}]),
    meta_llama:mk("0 0 24 24",[{d:"M12 4c-2 0-3.5 1-4.5 2.5S6 9.5 6 12c0 2 .5 3.5 1.5 5S9.5 19 12 20c2.5-1 3.5-2 4.5-3s1.5-3 1.5-5c0-2.5-.5-4-1.5-5.5S14 4 12 4z",fill:"#0668E1"},{d:"M12 8a4 4 0 100 8 4 4 0 000-8z",fill:"#fff"}]),
    mistral:mk("0 0 24 24",[{d:"M4 4h4v4H4zM10 4h4v4h-4zM16 4h4v4h-4zM4 10h4v4H4zM16 10h4v4h-4zM4 16h4v4H4zM10 16h4v4h-4zM16 16h4v4h-4z",fill:"#F7D046"},{d:"M10 10h4v4h-4z",fill:"#FF7000"}]),
    cohere:mk("0 0 24 24",[{d:"M12 4a8 8 0 018 8h-4a4 4 0 00-4-4V4z",fill:"#39594D"},{d:"M12 4v4a4 4 0 00-4 4H4a8 8 0 018-8z",fill:"#D18EE2"},{d:"M4 12h4a4 4 0 004 4v4a8 8 0 01-8-8z",fill:"#FF7759"}]),
    // HRIS
    workday:mk("0 0 24 24",[{d:"M12 4a8 8 0 100 16 8 8 0 000-16z",fill:"none",stroke:"#F68D2E",sw:2},{d:"M12 4c0 4.42 3.58 8 8 8",fill:"none",stroke:"#F68D2E",sw:2}]),
    sap_successfactors:mk("0 0 24 24",[{d:"M3 6h18v12H3z",fill:"#0070F2"},{d:"M7 10h2v4H7zM11 9h2v5h-2zM15 11h2v3h-2z",fill:"#fff"}]),
    bamboohr:mk("0 0 24 24",[{d:"M12 3c-5 0-9 4-9 9s4 9 9 9 9-4 9-9-4-9-9-9z",fill:"#73C41D"},{d:"M9 8c0 1.66 1.34 3 3 3s3-1.34 3-3",fill:"none",stroke:"#fff",sw:2}]),
    adp_workforce_now:mk("0 0 24 24",[{d:"M2 7h20v10H2z",fill:"#D0271D"},{d:"M5 10h3l1.5 4L11 10h3",fill:"none",stroke:"#fff",sw:1.5}]),
    ukg:mk("0 0 24 24",[{d:"M4 4h16v16H4z",fill:"#005151"},{d:"M8 8h3v8H8zM13 8h3v5h-3z",fill:"#fff"}]),
    rippling:mk("0 0 24 24",[{d:"M4 8c3-3 5-3 8 0s5 3 8 0M4 12c3-3 5-3 8 0s5 3 8 0M4 16c3-3 5-3 8 0s5 3 8 0",fill:"none",stroke:"#FEC312",sw:1.8}]),
    gusto_hr:mk("0 0 24 24",[{d:"M12 3a9 9 0 100 18 9 9 0 000-18z",fill:"#F45D48"},{d:"M12 8v4l3 2",fill:"none",stroke:"#fff",sw:2}]),
    hibob:mk("0 0 24 24",[{d:"M4 6h16v12H4z",rx:3,fill:"#FF426F"},{d:"M8 10h2v4H8zM14 10h2v4h-2z",fill:"#fff"}]),
    ceridian_dayforce:mk("0 0 24 24",[{d:"M12 4a8 8 0 100 16 8 8 0 000-16z",fill:"#0F4539"},{d:"M10 9h4v6h-4z",fill:"#8CC63F"}]),
    oracle_hcm:mk("0 0 24 24",[{d:"M3 8h18v8H3z",fill:"#F80000"},{d:"M7 11h10",fill:"none",stroke:"#fff",sw:2}]),
    // Payroll
    adp_payroll:mk("0 0 24 24",[{d:"M2 7h20v10H2z",fill:"#D0271D"},{d:"M7 12h10",fill:"none",stroke:"#fff",sw:2}]),
    paychex:mk("0 0 24 24",[{d:"M4 6h16v12H4z",fill:"#004B8D"},{d:"M8 10l4 4 4-4",fill:"none",stroke:"#fff",sw:2}]),
    gusto_payroll:mk("0 0 24 24",[{d:"M12 3a9 9 0 100 18 9 9 0 000-18z",fill:"#F45D48"},{d:"M9 12h6M12 9v6",fill:"none",stroke:"#fff",sw:2}]),
    xero_payroll:mk("0 0 24 24",[{d:"M12 3a9 9 0 100 18 9 9 0 000-18z",fill:"#13B5EA"},{d:"M8 8l8 8M16 8l-8 8",fill:"none",stroke:"#fff",sw:2}]),
    quickbooks_payroll:mk("0 0 24 24",[{d:"M12 3a9 9 0 100 18 9 9 0 000-18z",fill:"#2CA01C"},{d:"M14 8v8H10l4-8z",fill:"#fff"}]),
    ceridian_payroll:mk("0 0 24 24",[{d:"M12 4a8 8 0 100 16 8 8 0 000-16z",fill:"#0F4539"},{d:"M8 12h8",fill:"none",stroke:"#8CC63F",sw:2.5}]),
    deel:mk("0 0 24 24",[{d:"M4 6h16v12H4z",fill:"#15357A"},{d:"M8 9h3v6H8z",fill:"#fff"},{d:"M13 9a3 3 0 010 6",fill:"none",stroke:"#fff",sw:2}]),
    rippling_payroll:mk("0 0 24 24",[{d:"M4 9c3-2 5-2 8 0s5 2 8 0M4 13c3-2 5-2 8 0s5 2 8 0",fill:"none",stroke:"#FEC312",sw:2}]),
    square_payroll:mk("0 0 24 24",[{d:"M4 4h16v16H4z",fill:"#1A1A1E"},{d:"M8 8h8v8H8z",fill:"#fff"}]),
    sage_payroll:mk("0 0 24 24",[{d:"M12 3a9 9 0 100 18 9 9 0 000-18z",fill:"#00D639"},{d:"M8 12c0-2.2 1.8-4 4-4s4 1.8 4 4",fill:"none",stroke:"#fff",sw:2}]),
    // ERP
    sap_s4hana:mk("0 0 24 24",[{d:"M3 6h18v12H3z",fill:"#0070F2"},{d:"M6 10h3v4H6zM11 9h2v6h-2zM15 10h3v4h-3z",fill:"#fff"}]),
    oracle_netsuite:mk("0 0 24 24",[{d:"M3 8h18v8H3z",fill:"#F80000"},{d:"M7 10v4h2v-4M11 10v4h2v-2h2v2",fill:"none",stroke:"#fff",sw:1.5}]),
    microsoft_dynamics:mk("0 0 24 24",[{d:"M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z",fill:"#00A4EF"}]),
    infor:mk("0 0 24 24",[{d:"M4 6h16v12H4z",fill:"#007BC0"},{d:"M10 9h4v6h-4z",fill:"#F0AB00"}]),
    epicor:mk("0 0 24 24",[{d:"M4 8h16v8H4z",fill:"#E31937"},{d:"M8 11h8v2H8z",fill:"#fff"}]),
    acumatica:mk("0 0 24 24",[{d:"M12 4l8 8-8 8-8-8z",fill:"none",stroke:"#E8702A",sw:2},{d:"M12 8l4 4-4 4-4-4z",fill:"#E8702A"}]),
    // POS
    square_pos:mk("0 0 24 24",[{d:"M3 3h18v18H3z",fill:"#1A1A1E"},{d:"M7 7h10v10H7z",fill:"#fff"}]),
    lightspeed:mk("0 0 24 24",[{d:"M12 3a9 9 0 100 18 9 9 0 000-18z",fill:"#E2F04F"},{d:"M10 8l4 4-4 4",fill:"none",stroke:"#1A1A1E",sw:2.5}]),
    toast:mk("0 0 24 24",[{d:"M4 8h16v10H4z",fill:"#FF4C00"},{d:"M4 8c0-3 3.6-5 8-5s8 2 8 5",fill:"#FF4C00"}]),
    shopify_pos:mk("0 0 24 24",[{d:"M12 3l9 5v8l-9 5-9-5V8l9-5z",fill:"#96BF48"},{d:"M10 9h4v6l-4-2V9z",fill:"#fff"}]),
    revel:mk("0 0 24 24",[{d:"M4 6h16v12H4z",fill:"#2B2B2B"},{d:"M8 10h8M8 14h5",fill:"none",stroke:"#00C3FF",sw:2}]),
    // Telematics
    samsara:mk("0 0 24 24",[{d:"M12 3a9 9 0 100 18 9 9 0 000-18z",fill:"#1A1A1E"},{d:"M7 12h10M12 7v10",fill:"none",stroke:"#00D084",sw:2}]),
    geotab:mk("0 0 24 24",[{d:"M12 3a9 9 0 100 18 9 9 0 000-18z",fill:"#007DC5"},{d:"M8 14l4-6 4 6",fill:"none",stroke:"#fff",sw:2}]),
    verizon_connect:mk("0 0 24 24",[{d:"M3 12l6 6 12-12",fill:"none",stroke:"#CD040B",sw:3}]),
    // Public Reviews
    google_reviews:mk("0 0 24 24",[{d:"M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3-6.2 3.3 1.2-6.8-5-4.9 6.9-1L12 2z",fill:"#FBBC04"}]),
    yelp:mk("0 0 24 24",[{d:"M12 3v8l-6 3 1-7zM12 11l6 3-1 7z",fill:"#AF0606"},{d:"M12 11l-4 6h8z",fill:"#FF1A1A"}]),
    tripadvisor:mk("0 0 24 24",[{d:"M12 5c-5 0-9 3-9 3l3 1c0 2.8 2.7 5 6 5s6-2.2 6-5l3-1s-4-3-9-3z",fill:"#34E0A1"},{d:"M9 11a2 2 0 100-4 2 2 0 000 4zM15 11a2 2 0 100-4 2 2 0 000 4z",fill:"#1A1A1E"}]),
    trustpilot:mk("0 0 24 24",[{d:"M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3-6.2 3.3 1.2-6.8-5-4.9 6.9-1L12 2z",fill:"#00B67A"}]),
    facebook_reviews:mk("0 0 24 24",[{d:"M12 3a9 9 0 100 18 9 9 0 000-18z",fill:"#1877F2"},{d:"M13 10h2V8h-2a3 3 0 00-3 3v1H8v2h2v5h2v-5h2l.5-2H12v-1a1 1 0 011-1z",fill:"#fff"}]),
    // Asset Systems
    upkeep:mk("0 0 24 24",[{d:"M12 3a9 9 0 100 18 9 9 0 000-18z",fill:"#00B050"},{d:"M8 12l3 3 5-5",fill:"none",stroke:"#fff",sw:2.5}]),
    fiix:mk("0 0 24 24",[{d:"M4 6h16v12H4z",fill:"#1E88E5"},{d:"M8 10h3v4H8z",fill:"#fff"},{d:"M14 10h2v4h-2z",fill:"#FFC107"}]),
    ibm_maximo:mk("0 0 24 24",[{d:"M4 8h16M4 12h16M4 16h16",fill:"none",stroke:"#0F62FE",sw:2.5}]),
    maintainx:mk("0 0 24 24",[{d:"M4 4h16v16H4z",fill:"#FF6B00"},{d:"M8 8l8 8M16 8l-8 8",fill:"none",stroke:"#fff",sw:2}]),
    // Databases & Feeds
    postgresql:mk("0 0 24 24",[{d:"M12 3c-4 0-7 2-7 5v8c0 3 3 5 7 5s7-2 7-5V8c0-3-3-5-7-5z",fill:"none",stroke:"#336791",sw:2},{d:"M5 8c0 3 3 5 7 5s7-2 7-5",fill:"none",stroke:"#336791",sw:2}]),
    mysql:mk("0 0 24 24",[{d:"M12 4c-4.4 0-8 1.8-8 4v8c0 2.2 3.6 4 8 4s8-1.8 8-4V8c0-2.2-3.6-4-8-4z",fill:"none",stroke:"#00758F",sw:2},{d:"M4 8c0 2.2 3.6 4 8 4s8-1.8 8-4",fill:"none",stroke:"#00758F",sw:2}]),
    snowflake:mk("0 0 24 24",[{d:"M12 2v20M4.9 7l14.2 10M4.9 17L19.1 7",fill:"none",stroke:"#29B5E8",sw:2},{d:"M12 2l-2 2 2 2M12 18l2 2-2 2M4.9 7L3 9l2.8.7M19.1 7l1.9 2-2.8.7M4.9 17L3 15l2.8-.7M19.1 17l1.9-2-2.8-.7",fill:"none",stroke:"#29B5E8",sw:1.5}]),
    bigquery:mk("0 0 24 24",[{d:"M12 3a9 9 0 100 18 9 9 0 000-18z",fill:"#4386FA"},{d:"M10 8v5l4 3M14 10h-4",fill:"none",stroke:"#fff",sw:2}]),
    redshift:mk("0 0 24 24",[{d:"M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z",fill:"none",stroke:"#8C4FFF",sw:2},{d:"M12 8l4 2.3v4.4L12 17l-4-2.3v-4.4L12 8z",fill:"#8C4FFF"}]),
    rest_api:mk("0 0 24 24",[{d:"M4 8h6v8H4zM14 8h6v8h-6z",fill:"none",stroke:T.accent,sw:2},{d:"M10 12h4",fill:"none",stroke:T.accent,sw:2}]),
    webhooks:mk("0 0 24 24",[{d:"M12 5a7 7 0 017 7M12 9a3 3 0 013 3",fill:"none",stroke:T.accent,sw:2},{d:"M12 12l-7 7",fill:"none",stroke:T.accent,sw:2}]),
    sftp:mk("0 0 24 24",[{d:"M4 12a8 8 0 0116 0",fill:"none",stroke:T.accent,sw:2},{d:"M12 4v16M8 8l4-4 4 4M8 16l4 4 4-4",fill:"none",stroke:T.accent,sw:1.8}]),
  };
})();

/* ═══ REGISTER CATALOG (Data Tables) ═══ */
const REGISTER_CATALOG={
  manufacturing:[
    {id:"risk-register",name:"Risk Register",type:"Entity",updatedAgo:"1 day ago",rowCount:10},
    {id:"asset-register",name:"Asset Register",type:"Entity",updatedAgo:"3 days ago",rowCount:8},
    {id:"quality-ncr",name:"Quality NCRs",type:"Entity",updatedAgo:"2 hours ago",rowCount:5},
  ],
  qsr:[
    {id:"food-safety",name:"Food Safety Register",type:"Entity",updatedAgo:"4 hours ago",rowCount:5},
    {id:"compliance-log",name:"Compliance Log",type:"Entity",updatedAgo:"1 day ago",rowCount:4},
    {id:"incident-log",name:"Incident Log",type:"Entity",updatedAgo:"6 hours ago",rowCount:3},
  ],
  "transport-logistics":[
    {id:"fleet-register",name:"Fleet Register",type:"Entity",updatedAgo:"2 hours ago",rowCount:6},
    {id:"risk-register-tl",name:"Risk Register",type:"Entity",updatedAgo:"1 day ago",rowCount:5},
    {id:"incident-log-tl",name:"Incident Log",type:"Entity",updatedAgo:"12 hours ago",rowCount:4},
  ],
};

/* ═══ APP DETAIL DATA ═══ */
const APP_ACTIVITY_TYPES={
  inspection:{icon:"shield",color:T.green,label:"Inspection"},
  issue:{icon:"alert",color:T.rose,label:"Issue Raised"},
  escalation:{icon:"bolt",color:T.amber,label:"Escalation"},
  workflow:{icon:"workflow",color:T.highlight,label:"Workflow"},
  connector:{icon:"connector",color:T.violet,label:"Sync"},
  agent:{icon:"sparkle",color:T.accent,label:"Agent"},
};

const APP_TABLE_MAP={
  "quality-mgmt":["quality-ncr"],
  "safety-compliance":["risk-register"],
  "mfg-maintenance":["asset-register"],
  "food-safety":["food-safety"],
  "qsr-inventory-mgmt":["food-safety"],
  "brand-standards":["compliance-log"],
  "incident-mgmt":["incident-log"],
  "fleet-ops":["fleet-register"],
  "dock-ops":["fleet-register"],
  "delivery-tracking":["fleet-register"],
};

const APP_RECOMMENDED_WORKFLOWS={
  "quality-mgmt":[
    {name:"Corrective Action Tracking",desc:"CAPA workflow for quality deviations",configImpact:8},
    {name:"Management Review",desc:"Periodic quality management review",configImpact:5},
  ],
  "safety-compliance":[
    {name:"Risk Assessment",desc:"Structured risk assessment for new processes",configImpact:10},
    {name:"Near-Miss Reporting",desc:"Quick near-miss capture workflow",configImpact:7},
  ],
  "mfg-maintenance":[
    {name:"Escalation Rules",desc:"Auto-escalate overdue work orders",configImpact:8},
    {name:"Parts Inventory Check",desc:"Weekly spare parts stock review",configImpact:6},
  ],
  "food-safety":[
    {name:"Supplier Audit",desc:"Periodic supplier food safety audit",configImpact:9},
    {name:"Allergen Management",desc:"Cross-contamination prevention checklist",configImpact:7},
  ],
  "qsr-inventory-mgmt":[
    {name:"Count Variance Escalation",desc:"Auto-escalate when variance exceeds 5%",configImpact:8},
    {name:"Supplier Delivery Check",desc:"Verify incoming deliveries against PO",configImpact:7},
  ],
  "brand-standards":[
    {name:"Corrective Action Plan",desc:"Auto-assign fixes when audit score drops below 85%",configImpact:9},
    {name:"Pre-Audit Self-Check",desc:"Manager self-assessment before formal audit",configImpact:6},
  ],
  "incident-mgmt":[
    {name:"Auto-Escalation Rules",desc:"Escalate high-severity incidents to district manager",configImpact:8},
    {name:"Post-Incident Review",desc:"Structured review meeting 48 hours after incident",configImpact:7},
  ],
  "fleet-ops":[
    {name:"Accident Investigation",desc:"Post-incident investigation workflow",configImpact:8},
    {name:"Tyre Management",desc:"Tyre condition and rotation tracking",configImpact:5},
  ],
  "dock-ops":[
    {name:"Cross-Dock Efficiency Audit",desc:"Track throughput and bottlenecks",configImpact:9},
  ],
  "delivery-tracking":[
    {name:"Customer Feedback Capture",desc:"Post-delivery satisfaction check",configImpact:7},
  ],
};

const APP_DASHBOARD_METRICS={
  "quality-mgmt":[
    {label:"First Pass Yield",value:"94.2%",trend:1.2,color:T.green},
    {label:"Open NCRs",value:"7",trend:-2,color:T.amber},
    {label:"Inspections (30d)",value:"142",trend:12,color:T.green},
    {label:"Avg Response Time",value:"4.2 hrs",trend:-0.8,color:T.green},
  ],
  "safety-compliance":[
    {label:"TRIR",value:"1.8",trend:-0.3,color:T.green},
    {label:"Open Actions",value:"4",trend:-1,color:T.amber},
    {label:"Near Misses (30d)",value:"12",trend:3,color:T.rose},
    {label:"Days Since Incident",value:"34",trend:34,color:T.green},
  ],
  "mfg-maintenance":[
    {label:"PM Compliance",value:"87%",trend:4,color:T.green},
    {label:"MTBF",value:"312 hrs",trend:18,color:T.green},
    {label:"Open Work Orders",value:"9",trend:-3,color:T.amber},
    {label:"Uptime",value:"94.1%",trend:1.2,color:T.green},
  ],
  "food-safety":[
    {label:"Compliance Score",value:"96%",trend:2,color:T.green},
    {label:"Temp Exceptions",value:"3",trend:-1,color:T.amber},
    {label:"Inspections (30d)",value:"89",trend:7,color:T.green},
    {label:"Overdue Actions",value:"1",trend:-2,color:T.green},
  ],
  "qsr-inventory-mgmt":[
    {label:"Food Cost %",value:"28.4%",trend:-0.6,color:T.green},
    {label:"Waste (% of COGS)",value:"3.2%",trend:-0.4,color:T.green},
    {label:"Count Accuracy",value:"97.1%",trend:1.3,color:T.green},
    {label:"Out-of-Stocks",value:"2",trend:-3,color:T.green},
  ],
  "brand-standards":[
    {label:"Avg Audit Score",value:"89%",trend:3,color:T.green},
    {label:"Locations ≥85%",value:"10/12",trend:2,color:T.green},
    {label:"Open CAPAs",value:"4",trend:-2,color:T.amber},
    {label:"Mystery Shop Avg",value:"91%",trend:1.5,color:T.green},
  ],
  "incident-mgmt":[
    {label:"Open Incidents",value:"3",trend:-2,color:T.green},
    {label:"Avg Resolution",value:"2.4 days",trend:-0.8,color:T.green},
    {label:"Incidents (30d)",value:"9",trend:-2,color:T.green},
    {label:"Overdue CAPAs",value:"3",trend:1,color:T.rose},
  ],
  "fleet-ops":[
    {label:"Fleet Uptime",value:"91.4%",trend:0.8,color:T.green},
    {label:"HOS Compliance",value:"98%",trend:1,color:T.green},
    {label:"Fuel Efficiency",value:"6.2 mpg",trend:0.3,color:T.green},
    {label:"Open Defects",value:"5",trend:-2,color:T.amber},
  ],
};

const APP_CHART_DATA={
  "quality-mgmt":[72,78,74,82,85,79,88,91,87,94,92,94],
  "safety-compliance":[45,52,48,55,62,58,65,71,68,74,78,82],
  "mfg-maintenance":[60,58,65,62,70,68,75,72,80,84,87,87],
  "food-safety":[85,88,84,90,92,89,94,96,93,95,96,96],
  "qsr-inventory-mgmt":[68,65,70,72,74,71,76,78,80,82,84,85],
  "brand-standards":[74,76,72,78,80,82,84,86,85,88,89,89],
  "incident-mgmt":[55,58,52,60,64,62,68,72,70,75,78,80],
  "fleet-ops":[70,72,68,75,78,74,80,82,85,88,90,91],
};

const APP_ACTIVITY_SEEDS={
  "quality-mgmt":[
    {type:"inspection",text:"Quality Inspection — Line 3 completed",time:"12 min ago",user:"Sarah Chen",score:94},
    {type:"issue",text:"NCR raised — Batch #4472 label deviation",time:"2 hrs ago",user:"Ravi Singh"},
    {type:"escalation",text:"Corrective action overdue — NCR-023",time:"4 hrs ago",user:"System"},
    {type:"workflow",text:"Supplier Receiving Inspection submitted",time:"Yesterday",user:"Alice Lee",score:100},
    {type:"connector",text:"QMS sync completed — 38 records updated",time:"Yesterday",user:"System"},
    {type:"inspection",text:"Quality Inspection — Line 1 completed",time:"Yesterday",user:"Hannah Boyd",score:97},
    {type:"issue",text:"Defect flagged — surface finish out of spec",time:"2 days ago",user:"Sarah Chen"},
    {type:"workflow",text:"Incoming material inspection passed",time:"2 days ago",user:"Alice Lee",score:100},
  ],
  "safety-compliance":[
    {type:"inspection",text:"Weekly safety walkthrough completed",time:"1 hr ago",user:"Mia Brooks",score:87},
    {type:"issue",text:"Hydraulic leak reported — Press 4",time:"3 hrs ago",user:"Floor Operator"},
    {type:"escalation",text:"Area cordoned off — maintenance dispatched",time:"3 hrs ago",user:"System"},
    {type:"workflow",text:"Incident report submitted — near miss",time:"Yesterday",user:"Chris Park"},
    {type:"connector",text:"EHS system sync — 12 events updated",time:"Yesterday",user:"System"},
  ],
  "mfg-maintenance":[
    {type:"workflow",text:"PM routine — Line 2 conveyor completed",time:"2 hrs ago",user:"Ravi Singh",score:87},
    {type:"issue",text:"Unplanned breakdown — Pump Station 2",time:"6 hrs ago",user:"System"},
    {type:"workflow",text:"Work order WO-445 closed",time:"Yesterday",user:"Maintenance Tech",score:100},
    {type:"connector",text:"CMMS sync — 5 work orders updated",time:"Yesterday",user:"System"},
    {type:"escalation",text:"PM overdue — Press 4 lubrication",time:"2 days ago",user:"System"},
  ],
  "food-safety":[
    {type:"inspection",text:"Opening Checklist completed — all clear",time:"25 min ago",user:"Shift Manager",score:100},
    {type:"inspection",text:"Temperature log — all in range",time:"1 hr ago",user:"Team Member",score:100},
    {type:"issue",text:"Walk-in cooler temp 1°F above threshold",time:"Yesterday",user:"Team Member"},
    {type:"workflow",text:"Closing inspection submitted",time:"Yesterday",user:"Shift Manager",score:91},
    {type:"connector",text:"Food safety system sync completed",time:"Yesterday",user:"System"},
  ],
  "qsr-inventory-mgmt":[
    {type:"workflow",text:"End-of-day waste log submitted — 3.1% waste",time:"18 min ago",user:"Shift Manager",score:92},
    {type:"issue",text:"Lettuce count variance 8% — above threshold",time:"2 hrs ago",user:"Team Lead"},
    {type:"connector",text:"POS inventory sync — 142 items updated",time:"3 hrs ago",user:"System"},
    {type:"inspection",text:"Walk-in inventory count completed",time:"Yesterday",user:"Team Lead",score:97},
    {type:"workflow",text:"Supplier delivery verified — PO #4821",time:"Yesterday",user:"Shift Manager",score:100},
    {type:"agent",text:"Inventory Agent flagged fry oil reorder needed",time:"Yesterday",user:"System"},
  ],
  "brand-standards":[
    {type:"inspection",text:"Brand Standards Audit — Store #4 completed",time:"20 min ago",user:"District Manager",score:91},
    {type:"workflow",text:"Mystery Shop Report processed — Store #9",time:"2 hrs ago",user:"System",score:88},
    {type:"issue",text:"Menu board pricing mismatch at Store #7",time:"4 hrs ago",user:"Area Manager"},
    {type:"escalation",text:"Store #7 corrective action plan overdue",time:"Yesterday",user:"System"},
    {type:"connector",text:"Audit system sync — 6 reports updated",time:"Yesterday",user:"System"},
    {type:"inspection",text:"Pre-audit self-check — Store #11 completed",time:"2 days ago",user:"Store Manager",score:94},
  ],
  "incident-mgmt":[
    {type:"issue",text:"Slip-and-fall reported — Store #3 dining area",time:"12 min ago",user:"Shift Manager"},
    {type:"escalation",text:"High-severity incident escalated to District Manager",time:"12 min ago",user:"System"},
    {type:"workflow",text:"Incident investigation completed — burn #IR-089",time:"3 hrs ago",user:"Safety Officer",score:100},
    {type:"workflow",text:"CAPA closed — fryer guard installation verified",time:"Yesterday",user:"Maintenance"},
    {type:"issue",text:"Minor cut reported — prep station",time:"Yesterday",user:"Team Member"},
    {type:"connector",text:"Incident system sync — 4 records updated",time:"2 days ago",user:"System"},
  ],
  "fleet-ops":[
    {type:"inspection",text:"Pre-trip inspection — Unit 2847 passed",time:"30 min ago",user:"Driver",score:100},
    {type:"workflow",text:"Fuel audit — Route 12 reconciled",time:"2 hrs ago",user:"Fleet Coordinator",score:96},
    {type:"issue",text:"Tyre pressure alert — Unit 4472",time:"4 hrs ago",user:"System"},
    {type:"workflow",text:"Driver debrief submitted",time:"Yesterday",user:"Driver",score:100},
    {type:"connector",text:"Telematics sync — 24 vehicles updated",time:"Yesterday",user:"System"},
    {type:"escalation",text:"HOS violation warning — Driver M. Torres",time:"Yesterday",user:"System"},
  ],
};

const APP_PEOPLE_SEEDS={
  "quality-mgmt":[
    {name:"Sarah Chen",role:"Quality Inspector",initials:"SC"},
    {name:"Ravi Singh",role:"QA Manager",initials:"RS"},
    {name:"Alice Lee",role:"Receiving Inspector",initials:"AL"},
    {name:"Hannah Boyd",role:"Quality Analyst",initials:"HB"},
  ],
  "safety-compliance":[
    {name:"Mia Brooks",role:"EHS Coordinator",initials:"MB"},
    {name:"Chris Park",role:"Safety Officer",initials:"CP"},
    {name:"John Doe",role:"Site Manager",initials:"JD"},
  ],
  "mfg-maintenance":[
    {name:"Ravi Singh",role:"Maintenance Lead",initials:"RS"},
    {name:"Tom Wells",role:"Maintenance Tech",initials:"TW"},
    {name:"Jake Reeves",role:"Reliability Engineer",initials:"JR"},
  ],
  "food-safety":[
    {name:"Maria Santos",role:"Shift Manager",initials:"MS"},
    {name:"Tyler Brooks",role:"Team Lead",initials:"TB"},
    {name:"Aisha Khan",role:"Food Safety Officer",initials:"AK"},
  ],
  "qsr-inventory-mgmt":[
    {name:"Carlos Rivera",role:"Inventory Manager",initials:"CR"},
    {name:"Priya Patel",role:"Supply Chain Analyst",initials:"PP"},
    {name:"Jason Kim",role:"Shift Manager",initials:"JK"},
  ],
  "brand-standards":[
    {name:"Rachel Adams",role:"Brand Standards Manager",initials:"RA"},
    {name:"Derek Walsh",role:"Area Manager",initials:"DW"},
    {name:"Nina Okafor",role:"Mystery Shop Coordinator",initials:"NO"},
    {name:"Greg Hoffman",role:"District Manager",initials:"GH"},
  ],
  "incident-mgmt":[
    {name:"Laura Chen",role:"Safety Officer",initials:"LC"},
    {name:"Marcus Brown",role:"Risk Manager",initials:"MB"},
    {name:"Tanya Reid",role:"District Manager",initials:"TR"},
  ],
  "fleet-ops":[
    {name:"Dan Kowalski",role:"Fleet Manager",initials:"DK"},
    {name:"Maria Torres",role:"Driver",initials:"MT"},
    {name:"Sam O'Brien",role:"Fleet Coordinator",initials:"SO"},
    {name:"Lee Chang",role:"Mechanic",initials:"LC"},
  ],
};

function getAppConfigScore(app,addedConnectors){
  if(!app)return 0;
  const connSet=new Set(addedConnectors||[]);
  let total=0,done=0;
  total+=(app.workflows||[]).length;
  done+=(app.workflows||[]).length;
  total+=(APP_RECOMMENDED_WORKFLOWS[app.id]||[]).length;
  (app.requiredConnectors||[]).forEach(c=>{total++;if(connSet.has(c))done++;});
  const tables=APP_TABLE_MAP[app.id]||[];
  if(tables.length>0){total++;done++;}
  total++;
  if((APP_PEOPLE_SEEDS[app.id]||[]).length>0)done++;
  return total===0?0:Math.round((done/total)*100);
}

function getAppPerfScore(appId){
  const data=APP_CHART_DATA[appId];
  if(!data||data.length===0)return 0;
  const recent=data.slice(-3);
  return Math.round(recent.reduce((a,v)=>a+v,0)/recent.length);
}

function getAppDashboardMetrics(app){
  if(APP_DASHBOARD_METRICS[app.id])return APP_DASHBOARD_METRICS[app.id];
  return[
    {label:"Completion Rate",value:"78%",trend:3,color:T.green},
    {label:"Open Items",value:"5",trend:-1,color:T.amber},
    {label:"Activities (30d)",value:"64",trend:8,color:T.green},
    {label:"Avg Response",value:"6.1 hrs",trend:-1.2,color:T.green},
  ];
}

function getAppChartData(appId){
  return APP_CHART_DATA[appId]||[55,58,62,60,65,68,64,70,72,75,73,78];
}

function getAppActivity(appId){
  return APP_ACTIVITY_SEEDS[appId]||[
    {type:"workflow",text:"Workflow completed",time:"1 hr ago",user:"Team Member",score:92},
    {type:"inspection",text:"Routine check completed",time:"3 hrs ago",user:"Inspector",score:88},
    {type:"connector",text:"Data sync completed",time:"Yesterday",user:"System"},
  ];
}

function getAppPeople(appId){
  return APP_PEOPLE_SEEDS[appId]||[
    {name:"Team Member",role:"Assigned",initials:"TM"},
  ];
}

/* ═══ 100 DAYS LATER PRESET ═══ */
const HUNDRED_DAY_PRESET={
  brandName:"Burger Republic",
  onboardIndustry:"qsr",
  onboardPersona:"District Manager",
  selectedGoals:[
    "qsr-food-safety","qsr-food-quality","qsr-audit-scores",
    "qsr-speed","qsr-accuracy","qsr-guest-satisfaction",
    "qsr-labor-cost","qsr-scheduling","qsr-training","qsr-retention",
    "qsr-waste","qsr-food-cost",
    "qsr-drive-thru",
    "qsr-consistency",
  ],
  installedApps:["food-safety","brand-standards","qsr-inventory-mgmt","incident-mgmt"],
  addedConnectors:["fst","audit","pos","dtt","kds","wfm","inv","dsp"],
  addedWorkflows:[
    "wf-opening-checklist","wf-temp-log",
    "wf-brand-audit","wf-mystery-shop",
    "wf-waste-tracking",
    "wf-incident-report","wf-investigation",
  ],
  pinnedWidgets:["taskList","activity","quickStats"],
  chatMessages:[
    {id:"m100",role:"ai",text:"Good morning! **Burger Republic** is running well across all 12 locations today. You have **4 open tasks** — Store #7 needs a corrective action follow-up after last week's brand audit, and Store #3 just filed a slip-and-fall incident report. System-wide food safety compliance is at **96%** and trending up. Brand audit average is **89%**, up 3 points this quarter.",widgets:[{type:"taskList"}],chips:["View brand audits","Incident details","Food safety trend","Inventory status"]},
  ],
};

/* ═══ BUILDER DATA ═══ */
const NODE_TYPES=[
  {type:"trigger",label:"Trigger",desc:"Initiate workflows",color:T.green,icon:IC.bolt},
  {type:"action",label:"Action",desc:"Perform actions based on triggers",color:T.highlight,icon:IC.play},
  {type:"delay",label:"Delay",desc:"Pause the workflow",color:T.amber,icon:IC.clock},
  {type:"conditional",label:"Conditional",desc:"Branch the workflow",color:T.violet,icon:IC.filter},
  {type:"decision",label:"Decision",desc:"Route the workflow",color:T.rose,icon:IC.decision},
  {type:"notification",label:"Notification",desc:"Send alerts or notifications",color:T.pink,icon:IC.bell},
  {type:"aiAgent",label:"AI Agent",desc:"AI Agent Node",color:T.accent,icon:IC.sparkle},
];

const SAMPLE_NODES=[
  {id:"n1",type:"trigger",title:"Start Workflow",sub:"Trigger",x:280,y:40},
  {id:"n2",type:"conditional",title:"Check Client Source",sub:"Conditional",x:280,y:170},
  {id:"n3",type:"action",title:"Notify Platform",sub:"Action",x:100,y:340},
  {id:"n4",type:"action",title:"Confirm Request",sub:"Action",x:440,y:340},
  {id:"n5",type:"decision",title:"Recurring Customer?",sub:"Decision",x:280,y:480},
  {id:"n6",type:"action",title:"Create CRM Record",sub:"Performs tasks",x:100,y:620},
  {id:"n7",type:"delay",title:"Wait and proceed",sub:"Fixed delay",x:440,y:620},
  {id:"n8",type:"conditional",title:"Check Contact Reason",sub:"Conditional",x:280,y:760},
  {id:"n9",type:"decision",title:"Product or Service?",sub:"Decision",x:280,y:920},
];
const SAMPLE_EDGES=[
  {from:"n1",to:"n2"},{from:"n2",to:"n3",label:"Our website"},{from:"n2",to:"n4",label:"Partner Website"},
  {from:"n3",to:"n5"},{from:"n4",to:"n5"},{from:"n5",to:"n6",label:"✗"},{from:"n5",to:"n7",label:"✓"},
  {from:"n6",to:"n8"},{from:"n7",to:"n8"},{from:"n8",to:"n9",label:"Complaint"},
];

/* ═══ CHART PRIMITIVES ═══ */
function Sparkline({data,color,w=140,h=44,fill=false}){const max=Math.max(...data),min=Math.min(...data),rng=max-min||1;const pts=data.map((v,i)=>`${(i/(data.length-1))*w},${h-((v-min)/rng)*(h-6)-3}`).join(" ");const ly=h-((data[data.length-1]-min)/rng)*(h-6)-3;return<svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{display:"block"}}>{fill&&<polygon points={`0,${h} ${pts} ${w},${h}`} fill={color} opacity="0.1"/>}<polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx={w} cy={ly} r="3" fill={color}/></svg>;}
function AreaChart({data,color,w=280,h=110}){const max=Math.max(...data),min=Math.min(...data),rng=max-min||1;const pts=data.map((v,i)=>`${(i/(data.length-1))*w},${h-((v-min)/rng)*(h-14)-7}`).join(" ");const id=`g-${color.replace('#','')}`;return<svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{display:"block"}}><defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.2"/><stop offset="100%" stopColor={color} stopOpacity="0.02"/></linearGradient></defs><polygon points={`0,${h} ${pts} ${w},${h}`} fill={`url(#${id})`}/><polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;}
function MiniBar({data,color,w=140,h=48}){const max=Math.max(...data),bw=(w/data.length)-3;return<svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{display:"block"}}>{data.map((v,i)=>{const bh=(v/max)*(h-4);return<rect key={i} x={i*(bw+3)} y={h-bh} width={bw} height={bh} rx={2.5} fill={i===data.length-1?color:`${color}30`}/>;})}</svg>;}

/* ═══ PROGRESS PRIMITIVES ═══ */
function Ring({pct,size=56,stroke=5,color}){const r=(size-stroke)/2,circ=2*Math.PI*r,off=circ-(pct/100)*circ;return<svg width={size} height={size} style={{transform:"rotate(-90deg)"}}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.surfaceMuted} strokeWidth={stroke}/><circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round" style={{transition:"stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)"}}/></svg>;}
function Bar({pct,color,height=6}){return<div style={{height,borderRadius:height,background:T.surfaceMuted,overflow:"hidden",width:"100%"}}><div style={{height:"100%",width:`${pct}%`,borderRadius:height,background:color,transition:"width 0.8s cubic-bezier(0.4,0,0.2,1)"}}/></div>;}
function MiniRing({pct,size=28,stroke=3,color}){const r=(size-stroke)/2,circ=2*Math.PI*r,off=circ-(pct/100)*circ;return<svg width={size} height={size} style={{transform:"rotate(-90deg)",display:"block"}}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(59,130,246,0.15)" strokeWidth={stroke}/><circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round" style={{transition:"stroke-dashoffset 0.6s ease"}}/></svg>;}

/* ═══ SCORE PRIMITIVES ═══ */
function StarRating({score,size=28,gap=3}){
  const full=Math.floor(score);
  const partial=score-full;
  const empty=5-full-(partial>0?1:0);
  const gold="#B8962E",goldShadow="rgba(184,150,46,0.12)";
  return<div style={{display:"flex",gap}}>
    {Array(full).fill(0).map((_,i)=><div key={"f"+i} style={{width:size,height:size,borderRadius:size*0.22,background:gold,boxShadow:`0 1px 4px ${goldShadow}`}}/>)}
    {partial>0&&<div key="p" style={{width:size,height:size,borderRadius:size*0.22,background:`linear-gradient(90deg, ${gold} ${partial*100}%, ${T.surfaceMuted} ${partial*100}%)`,boxShadow:`0 1px 4px ${goldShadow}`}}/>}
    {Array(empty).fill(0).map((_,i)=><div key={"e"+i} style={{width:size,height:size,borderRadius:size*0.22,background:T.surfaceMuted}}/>)}
  </div>;
}

function ScoreBadge({score,trend,size="large"}){
  const isLg=size==="large";
  return<div style={{display:"flex",alignItems:"baseline",gap:isLg?10:6}}>
    <span style={{fontFamily:T.serif,fontSize:isLg?48:24,fontWeight:500,letterSpacing:"-0.03em",lineHeight:1}}>{score}</span>
    <span style={{fontSize:isLg?18:13,color:T.textTertiary,fontWeight:400}}>/5.0</span>
    {trend!==0&&<span className="chip" style={{background:trend>0?T.greenSoft:T.roseSoft,color:trend>0?T.green:T.rose,marginLeft:4}}>
      {trend>0?"↑":"↓"} {Math.abs(trend)}
    </span>}
  </div>;
}

function SignalBar({label,value,target,color,weight}){
  const pct=Math.min(100,value);
  const healthColor=pct>=70?T.green:pct>=40?T.amber:T.rose;
  return<div style={{marginBottom:10}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
      <span style={{fontSize:12,color:T.textSecondary}}>{label}{weight?<span style={{color:T.textTertiary,fontFamily:T.mono,fontSize:10,marginLeft:6}}>{weight}%</span>:null}</span>
      <span style={{fontSize:12,fontWeight:600,fontFamily:T.mono,color:healthColor}}>{value}%</span>
    </div>
    <div style={{height:6,borderRadius:3,background:T.surfaceMuted,overflow:"hidden"}}>
      <div style={{height:"100%",width:`${pct}%`,borderRadius:3,background:healthColor,opacity:0.75,transition:"width 0.8s cubic-bezier(0.4,0,0.2,1)"}}/>
    </div>
  </div>;
}

function LensToggle({lens,setLens}){
  return<div style={{display:"flex",background:T.surfaceMuted,borderRadius:99,padding:3,gap:2}}>
    {["risk","opportunity"].map(l=>{const a=lens===l;return<div key={l} onClick={()=>setLens(l)} style={{padding:"5px 16px",borderRadius:99,fontSize:12,fontWeight:a?600:400,color:a?T.text:T.textSecondary,background:a?T.surface:"transparent",boxShadow:a?"0 1px 3px rgba(0,0,0,0.06)":"none",cursor:"pointer",textTransform:"capitalize",letterSpacing:"-0.01em"}}>{l==="risk"?"Risk":"Opportunity"}</div>;})}
  </div>;
}

/* ═══ SIDEBAR (Persistent push + icon-rail collapse) ═══ */
function Sidebar({mode,onToggle,onNavigate,activePage,brandName,brandLogoUrl,onSettings,installedApps}){
  const expanded=mode==="expanded";
  const W=expanded?240:0;

  /* ── Nav items (flat, no section headings) ── */
  const topNav=[
    {icon:IC.home,label:"Home",id:"home",action:()=>onNavigate("home")},
    {icon:IC.tasks,label:"Tasks",id:"tasks",action:()=>onNavigate("tasks")},
    {icon:IC.people,label:"People",id:"people",action:()=>onNavigate("people")},
    {icon:IC.chart,label:"Score",id:"score",action:()=>onNavigate("score")},
  ];

  const installedAppItems=(installedApps||[]).map(id=>{
    const app=APP_CATALOG.find(a=>a.id===id);
    if(!app)return null;
    return{label:app.name,id:"installed_"+app.id,appColor:app.color||T.accent,action:()=>{window.location.hash="#app/"+app.id;}};
  }).filter(Boolean);

  const bottomNav=[
    {icon:IC.catalog,label:"Catalog",id:"catalog",action:()=>onNavigate("catalog")},
    {icon:IC.builder,label:"Builder",id:"builder",action:()=>onNavigate("builder")},
    {icon:IC.grid,label:"Data",id:"registers",action:()=>onNavigate("registers")},
    {icon:IC.source,label:"Sources",id:"sources"},
  ];

  const isActive=(item)=>item.id===activePage;

  /* ── Render helpers ── */
  const renderNavItem=(item,i)=>{
    const act=isActive(item);
    const disabled=item.disabled||!item.action;
    return<div key={item.id||i} onClick={disabled?undefined:item.action} title={expanded?undefined:item.label} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 10px",borderRadius:T.rSm,background:act?T.accentSoft:"transparent",color:act?T.accent:T.textSecondary,cursor:disabled?"default":"pointer",opacity:disabled?0.45:1,position:"relative",justifyContent:expanded?"flex-start":"center"}}>
      {act&&<div style={{position:"absolute",left:0,top:"50%",transform:"translateY(-50%)",width:3,height:16,borderRadius:"0 3px 3px 0",background:T.accent}}/>}
      <span style={{flexShrink:0}}>{item.icon(act?T.accent:T.textSecondary)}</span>
      {expanded&&<span style={{fontSize:13,fontWeight:act?600:400,fontFamily:T.sans,letterSpacing:"-0.01em",whiteSpace:"nowrap",overflow:"hidden"}}>{item.label}</span>}
    </div>;
  };

  const renderInstalledApp=(item,i)=>{
    const act=isActive(item);
    const initials=item.label.split(/\s+/).filter(w=>w.length>0).slice(0,2).map(w=>w[0]).join("").toUpperCase();
    return<div key={item.id||("ia"+i)} onClick={item.action} title={expanded?undefined:item.label} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 10px",borderRadius:T.rSm,background:act?T.accentSoft:"transparent",color:act?T.accent:T.textSecondary,cursor:"pointer",position:"relative",justifyContent:expanded?"flex-start":"center"}}>
      {act&&<div style={{position:"absolute",left:0,top:"50%",transform:"translateY(-50%)",width:3,height:16,borderRadius:"0 3px 3px 0",background:T.accent}}/>}
      <span style={{flexShrink:0,width:28,height:28,borderRadius:7,background:`${item.appColor}18`,border:`1px solid ${item.appColor}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,fontFamily:T.mono,color:item.appColor,letterSpacing:"-0.02em"}}>{initials}</span>
      {expanded&&<span style={{fontSize:13,fontWeight:act?600:400,fontFamily:T.sans,letterSpacing:"-0.01em",color:act?T.accent:T.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{item.label}</span>}
    </div>;
  };

  return<div style={{position:"fixed",left:0,top:0,bottom:0,width:W,background:T.surface,borderRight:`1px solid ${T.border}`,zIndex:100,transition:"width 0.3s cubic-bezier(0.4,0,0.2,1)",display:"flex",flexDirection:"column",overflow:"hidden"}}>
    {/* Header */}
    <div style={{padding:expanded?"14px 16px":"14px 0",display:"flex",alignItems:"center",justifyContent:expanded?"flex-start":"center",borderBottom:`1px solid ${T.borderSubtle}`,height:56,flexShrink:0}}>
      <div style={{display:"flex",alignItems:"center",gap:10,overflow:"hidden"}}><BrandIcon brandLogoUrl={brandLogoUrl} size={expanded?30:26}/>{expanded&&<span style={{fontFamily:T.serif,fontSize:16,fontWeight:600,letterSpacing:"-0.02em",whiteSpace:"nowrap"}}>{brandName||"RC Marine Ops"}</span>}</div>
    </div>

    {/* Nav */}
    <div style={{flex:1,padding:expanded?"12px 10px 0":"12px 6px 0",display:"flex",flexDirection:"column",overflowY:"auto"}}>
      {/* Core nav */}
      {topNav.map(renderNavItem)}

      {/* Installed apps */}
      {installedAppItems.length>0&&<>
        <div style={{height:1,background:T.borderSubtle,margin:expanded?"12px 10px":"12px 6px"}}/>
        {installedAppItems.map(renderInstalledApp)}
      </>}

      {/* Spacer */}
      <div style={{flex:1}}/>

      {/* Platform / data */}
      <div style={{borderTop:`1px solid ${T.borderSubtle}`,paddingTop:8,marginTop:8}}>
        {bottomNav.map(renderNavItem)}
      </div>
    </div>

    {/* Settings footer */}
    <div style={{padding:expanded?"8px 10px 16px":"8px 6px 16px",borderTop:`1px solid ${T.borderSubtle}`}}>
      <div onClick={()=>{if(onSettings)onSettings();}} title={expanded?undefined:"Settings"} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 10px",borderRadius:T.rSm,color:T.textTertiary,cursor:"pointer",justifyContent:expanded?"flex-start":"center"}}>
        <span>{IC.settings(T.textTertiary)}</span>
        {expanded&&<span style={{fontSize:13,fontFamily:T.sans,whiteSpace:"nowrap"}}>Settings</span>}
      </div>
    </div>
  </div>;
}

/* ═══ CONNECT PAGE (goal-derived setup) ═══ */

function ConnectPage({industry,persona,selectedGoals,onNavigate,addedConnectors,addedWorkflows,setAddedWorkflows}){
  const ind=INDUSTRIES.find(i=>i.id===industry)||INDUSTRIES[0];
  const allGoals=getGoalsByIndustry(industry);
  const goalObjs=allGoals.filter(g=>selectedGoals.includes(g.id));
  const _addedConnectors=addedConnectors||[];
  const _addedWorkflows=addedWorkflows||[];

  /* Derive unique categories from selected goals */
  const goalCategories=useMemo(()=>{
    return[...new Set(goalObjs.map(g=>g.category))];
  },[goalObjs]);

  /* Category color palette */
  const catColors=useMemo(()=>{
    const palette=[T.highlight,T.rose,T.green,T.violet,T.amber,T.pink];
    const map={};
    goalCategories.forEach((c,i)=>{map[c]=palette[i%palette.length];});
    return map;
  },[goalCategories]);

  /* Derive connectors from CONNECTOR_MAP for selected goals — deduped, annotated */
  const connectors=useMemo(()=>{
    const map=new Map();
    selectedGoals.forEach(gId=>{
      const sources=CONNECTOR_MAP[gId]||[];
      sources.forEach(src=>{
        if(!map.has(src.id)){
          map.set(src.id,{...src,servingGoals:[],servingGoalIds:[]});
        }
        const goalName=(OPERATIONAL_GOALS.find(g=>g.id===gId)||{}).name||gId;
        const entry=map.get(src.id);
        if(!entry.servingGoalIds.includes(gId)){
          entry.servingGoals.push(goalName);
          entry.servingGoalIds.push(gId);
        }
      });
    });
    return Array.from(map.values()).sort((a,b)=>b.servingGoals.length-a.servingGoals.length);
  },[selectedGoals]);

  /* Derive workflows */
  const workflows=useMemo(()=>{
    const templates=WORKFLOW_TEMPLATES[industry]||[];
    return templates.filter(w=>w.goalIds.some(id=>selectedGoals.includes(id))).map(w=>({
      ...w,
      matchedGoals:w.goalIds.filter(id=>selectedGoals.includes(id)).map(id=>(OPERATIONAL_GOALS.find(g=>g.id===id)||{}).name||id),
    }));
  },[industry,selectedGoals]);

  /* Derive people & assets */
  const peopleAssets=useMemo(()=>{
    const templates=PEOPLE_ASSETS_TEMPLATES[industry]||{people:[],assets:[]};
    const people=templates.people.filter(p=>p.goalIds.some(id=>selectedGoals.includes(id))).map(p=>({
      ...p,
      matchedGoals:p.goalIds.filter(id=>selectedGoals.includes(id)).map(id=>(OPERATIONAL_GOALS.find(g=>g.id===id)||{}).name||id),
    }));
    const assets=templates.assets.filter(a=>a.goalIds.some(id=>selectedGoals.includes(id))).map(a=>({
      ...a,
      matchedGoals:a.goalIds.filter(id=>selectedGoals.includes(id)).map(id=>(OPERATIONAL_GOALS.find(g=>g.id===id)||{}).name||id),
    }));
    return{people,assets};
  },[industry,selectedGoals]);

  /* Readiness score */
  const totalItems=connectors.length+workflows.length+peopleAssets.people.length+peopleAssets.assets.length;
  const doneItems=(_addedConnectors).length+(_addedWorkflows).length;
  const readinessPct=totalItems>0?Math.round((doneItems/totalItems)*100):0;

  /* Animated readiness ring */
  const[animPct,setAnimPct]=useState(0);
  useEffect(()=>{
    const timeout=setTimeout(()=>setAnimPct(readinessPct),120);
    return()=>clearTimeout(timeout);
  },[readinessPct]);

  /* Section expand/collapse */
  const[expandConnectors,setExpandConnectors]=useState(true);
  const[expandWorkflows,setExpandWorkflows]=useState(true);
  const[expandPeople,setExpandPeople]=useState(true);
  const[expandCatalog,setExpandCatalog]=useState(false);

  /* Hover state for goal cards scrollable row */
  const goalScrollRef=useRef(null);

  /* Empty state */
  if(!industry||selectedGoals.length===0){
    return<div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:40}}>
      <div style={{textAlign:"center",maxWidth:420,animation:"fadeIn 0.5s ease"}}>
        <div style={{width:72,height:72,borderRadius:18,background:T.surfaceMuted,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px",border:`1px solid ${T.borderSubtle}`}}>{IC.link(T.textTertiary,30)}</div>
        <h2 style={{fontFamily:T.serif,fontSize:24,fontWeight:400,letterSpacing:"-0.02em",marginBottom:10,lineHeight:1.3}}>No goals configured yet</h2>
        <p style={{fontSize:13.5,color:T.textSecondary,lineHeight:1.7,marginBottom:28}}>Complete the onboarding flow to set your industry, role, and operational goals. This page will then show the data sources, workflows, and team setup tailored to your goals.</p>
        <div onClick={()=>onNavigate("home")} style={{display:"inline-flex",alignItems:"center",gap:7,padding:"11px 24px",borderRadius:99,background:T.accent,color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",transition:"opacity 0.15s"}} onMouseEnter={e=>e.currentTarget.style.opacity="0.88"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
          {IC.home("#fff",15)}
          <span>Go to Home</span>
        </div>
      </div>
    </div>;
  }

  /* ─── Readiness Ring SVG ─── */
  const ringSize=140;
  const ringStroke=10;
  const ringR=(ringSize-ringStroke)/2;
  const ringCirc=2*Math.PI*ringR;
  const ringOff=ringCirc-(animPct/100)*ringCirc;
  const ringColor=animPct>=80?T.green:animPct>=40?T.highlight:T.amber;

  const ReadinessRing=()=><svg width={ringSize} height={ringSize} style={{transform:"rotate(-90deg)",flexShrink:0}}>
    <circle cx={ringSize/2} cy={ringSize/2} r={ringR} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={ringStroke}/>
    <circle cx={ringSize/2} cy={ringSize/2} r={ringR} fill="none" stroke={ringColor} strokeWidth={ringStroke} strokeDasharray={ringCirc} strokeDashoffset={ringOff} strokeLinecap="round" style={{transition:"stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1), stroke 0.4s ease"}}/>
  </svg>;

  /* Toggle workflow handler */
  const toggleWorkflow=(wId)=>{
    if(setAddedWorkflows){
      setAddedWorkflows(prev=>prev.includes(wId)?prev.filter(x=>x!==wId):[...prev,wId]);
    }
  };

  return<div style={{flex:1,overflowY:"auto"}}>
    <style>{`
      .cp2-card{background:${T.surface};border:1px solid ${T.border};border-radius:${T.r}px;transition:box-shadow 0.3s cubic-bezier(0.4,0,0.2,1),transform 0.3s cubic-bezier(0.4,0,0.2,1);overflow:hidden;box-shadow:${T.shadow}}
      .cp2-card:hover{box-shadow:${T.shadowMd};transform:translateY(-2px)}
      .cp2-section{background:${T.surface};border:1px solid ${T.border};border-radius:${T.r}px;margin-bottom:16px;overflow:hidden;box-shadow:${T.shadow}}
      .cp2-section-hd{display:flex;align-items:center;gap:12px;padding:18px 22px;cursor:pointer;transition:background 0.2s}
      .cp2-section-hd:hover{background:${T.surfaceHover}}
      .cp2-item{display:flex;align-items:center;gap:12px;padding:14px 22px;border-top:1px solid ${T.borderSubtle};transition:background 0.2s}
      .cp2-item:hover{background:${T.surfaceHover}}
      .cp2-goal-chip{display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:99px;font-size:9.5px;font-family:${T.mono};white-space:nowrap;max-width:220px;overflow:hidden;text-overflow:ellipsis}
      .cp2-btn{padding:6px 14px;border-radius:99px;font-size:11px;font-weight:600;display:inline-flex;align-items:center;gap:5px;cursor:pointer;transition:all 0.2s;border:none;flex-shrink:0;white-space:nowrap}
      .cp2-btn-outline{background:${T.surface};border:1px solid ${T.border};color:${T.textSecondary}}
      .cp2-btn-outline:hover{border-color:${T.accentBorder};background:${T.accentSoft};color:${T.text}}
      .cp2-btn-done{background:${T.greenSoft};border:1px solid ${T.greenBorder};color:${T.green}}
      .cp2-hero-scroll::-webkit-scrollbar{height:4px}.cp2-hero-scroll::-webkit-scrollbar-track{background:transparent}.cp2-hero-scroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.15);border-radius:2px}
      .cp2-cat-pill{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:${T.r}px;font-size:12px;font-weight:500;cursor:pointer;transition:all 0.2s;border:1px solid ${T.border};background:${T.surface}}
      .cp2-cat-pill:hover{box-shadow:0 4px 12px rgba(0,0,0,0.06);transform:translateY(-1px)}
      .cp2-connector-card{background:${T.surface};border:1px solid ${T.border};border-radius:${T.r}px;padding:16px;transition:all 0.3s cubic-bezier(0.4,0,0.2,1);box-shadow:${T.shadow}}
      .cp2-connector-card:hover{box-shadow:${T.shadowMd};transform:translateY(-2px)}
      @media(max-width:800px){.cp2-hero-inner{flex-direction:column!important;align-items:stretch!important}.cp2-hero-ring{justify-content:center!important}}
    `}</style>

    <div style={{maxWidth:960,margin:"0 auto",padding:"0 24px 60px"}}>

      {/* ═══════════════════════════════════════════════════ */}
      {/* HERO SECTION — Readiness Ring + Goal Cards         */}
      {/* ═══════════════════════════════════════════════════ */}
      <div style={{background:`linear-gradient(145deg, ${T.dark} 0%, #292524 55%, #1C1917 100%)`,borderRadius:`0 0 ${T.rLg}px ${T.rLg}px`,padding:"32px 28px 28px",marginBottom:24,border:`1px solid ${T.darkBorder}`,borderTop:"none",animation:"fadeInUp 0.6s cubic-bezier(0.4,0,0.2,1)"}}>
        <div className="cp2-hero-inner" style={{display:"flex",alignItems:"center",gap:32}}>
          {/* Left: Ring + stats */}
          <div className="cp2-hero-ring" style={{display:"flex",alignItems:"center",gap:20,flexShrink:0}}>
            <div style={{position:"relative",width:ringSize,height:ringSize}}>
              <ReadinessRing/>
              <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",transform:"rotate(0)"}}>
                <span style={{fontSize:32,fontWeight:700,fontFamily:T.mono,color:"#F5F5F4",letterSpacing:"-0.03em",lineHeight:1}}>{animPct}</span>
                <span style={{fontSize:10,color:"#78716C",fontFamily:T.mono,marginTop:2}}>% ready</span>
              </div>
            </div>
            <div>
              <div style={{fontFamily:T.serif,fontSize:20,fontWeight:400,color:"#F5F5F4",letterSpacing:"-0.02em",lineHeight:1.3,marginBottom:8}}>Workspace readiness</div>
              <div style={{display:"flex",flexDirection:"column",gap:5}}>
                {[
                  {label:"Connectors",done:_addedConnectors.length,total:connectors.length,color:T.rose},
                  {label:"Workflows",done:_addedWorkflows.length,total:workflows.length,color:T.green},
                  {label:"People & Assets",done:0,total:peopleAssets.people.length+peopleAssets.assets.length,color:T.violet},
                ].map(s=><div key={s.label} style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:s.color,flexShrink:0}}/>
                  <span style={{fontSize:11,color:"#A8A29E",fontFamily:T.mono}}>{s.done}/{s.total}</span>
                  <span style={{fontSize:11,color:"#78716C"}}>{s.label}</span>
                </div>)}
              </div>
            </div>
          </div>

          {/* Right: Goal Cards horizontal scroll */}
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
              <span style={{fontSize:10,textTransform:"uppercase",letterSpacing:"0.06em",fontFamily:T.mono,color:"#78716C"}}>{selectedGoals.length} goal{selectedGoals.length!==1?"s":""} selected</span>
              <span onClick={()=>onNavigate("goals")} style={{fontSize:11,color:T.highlight,cursor:"pointer",fontWeight:500,display:"flex",alignItems:"center",gap:4,transition:"opacity 0.15s"}} onMouseEnter={e=>e.currentTarget.style.opacity="0.7"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>View all goals {IC.chevRight(T.highlight,11)}</span>
            </div>
            <div ref={goalScrollRef} className="cp2-hero-scroll" style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4}}>
              {goalObjs.map((g,i)=>{
                const catColor=catColors[g.category]||T.highlight;
                const linkedCount=(CONNECTOR_MAP[g.id]||[]).length;
                return<div key={g.id} style={{flex:"0 0 auto",width:180,padding:"12px 14px",borderRadius:10,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",transition:"background 0.15s",cursor:"default",animation:`fadeIn ${0.2+i*0.06}s ease`}} onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.07)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.04)"}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                    <div style={{width:7,height:7,borderRadius:"50%",background:catColor,flexShrink:0}}/>
                    <span style={{fontSize:9,color:"#78716C",fontFamily:T.mono,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{g.category}</span>
                  </div>
                  <div style={{fontSize:12,fontWeight:500,color:"#E7E5E4",lineHeight:1.35,marginBottom:6,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{g.name}</div>
                  <div style={{fontSize:10,color:"#78716C",fontFamily:T.mono}}>{linkedCount} source{linkedCount!==1?"s":""}</div>
                </div>;
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* CONNECTORS SECTION                                 */}
      {/* ═══════════════════════════════════════════════════ */}
      <div className="cp2-section" style={{animation:"fadeIn 0.4s ease 0.1s both"}}>
        <div className="cp2-section-hd" onClick={()=>setExpandConnectors(!expandConnectors)}>
          <div style={{width:38,height:38,borderRadius:10,background:T.roseSoft,border:`1px solid ${T.roseBorder}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{IC.connector(T.rose,17)}</div>
          <div style={{flex:1}}>
            <div style={{fontFamily:T.serif,fontSize:16,fontWeight:500,letterSpacing:"-0.02em"}}>Data Sources</div>
            <div style={{fontSize:12,color:T.textSecondary,marginTop:2}}>{connectors.length} connector{connectors.length!==1?"s":""} recommended for your goals</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span className="chip" style={{background:T.roseSoft,color:T.rose,fontSize:10}}>{_addedConnectors.length}/{connectors.length}</span>
            <div style={{width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",transition:"transform 0.25s",transform:expandConnectors?"rotate(90deg)":"rotate(0)"}}>{IC.chevRight(T.textTertiary,14)}</div>
          </div>
        </div>

        {expandConnectors&&<div>
          {/* Recommended for your goals */}
          {connectors.length>0&&<div style={{padding:"12px 22px 6px"}}>
            <span style={{fontSize:10,textTransform:"uppercase",letterSpacing:"0.06em",fontFamily:T.mono,color:T.textTertiary,display:"flex",alignItems:"center",gap:5}}>{IC.target(T.textTertiary,11)} Recommended for your goals</span>
          </div>}

          {connectors.map((c)=>{
            const isAdded=_addedConnectors.includes(c.id);
            return<div key={c.id} className="cp2-item">
              <div style={{width:36,height:36,borderRadius:9,background:T.surfaceMuted,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:`1px solid ${T.borderSubtle}`}}>
                {IC.source(T.rose,15)}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13.5,fontWeight:500,letterSpacing:"-0.01em",marginBottom:2}}>{c.name}</div>
                <div style={{fontSize:11,color:T.textTertiary,marginBottom:4}}>{c.desc}</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                  {c.servingGoals.slice(0,3).map((gn,gi)=><span key={gi} className="cp2-goal-chip" style={{background:`${T.rose}10`,color:T.rose}}>{gn.length>30?gn.slice(0,28)+"...":gn}</span>)}
                  {c.servingGoals.length>3&&<span className="cp2-goal-chip" style={{background:`${T.rose}10`,color:T.rose}}>+{c.servingGoals.length-3}</span>}
                </div>
              </div>
              {isAdded
                ?<div className="cp2-btn cp2-btn-done">{IC.check(T.green,11)} Connected</div>
                :<div className="cp2-btn cp2-btn-outline" onClick={()=>onNavigate("connectors")}>{IC.plus(T.textSecondary,11)} Connect</div>
              }
            </div>;
          })}

          {/* Browse by category */}
          <div style={{padding:"16px 22px 8px",borderTop:`1px solid ${T.borderSubtle}`}}>
            <span style={{fontSize:10,textTransform:"uppercase",letterSpacing:"0.06em",fontFamily:T.mono,color:T.textTertiary,display:"flex",alignItems:"center",gap:5}}>{IC.catalog(T.textTertiary,11)} Browse by category</span>
          </div>
          <div style={{padding:"4px 22px 18px",display:"flex",flexWrap:"wrap",gap:8}}>
            {CONNECTOR_CATALOG.map((cat)=><div key={cat.id} className="cp2-cat-pill" onClick={()=>onNavigate("connectors")}>
              <div style={{width:8,height:8,borderRadius:"50%",background:cat.color,flexShrink:0}}/>
              <span style={{color:T.text}}>{cat.label}</span>
              <span style={{fontSize:10,color:T.textTertiary,fontFamily:T.mono}}>{cat.connectors.length}</span>
              <span style={{color:T.textTertiary,marginLeft:2}}>{IC.chevRight(T.textTertiary,10)}</span>
            </div>)}
          </div>
        </div>}
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* WORKFLOWS SECTION                                  */}
      {/* ═══════════════════════════════════════════════════ */}
      <div className="cp2-section" style={{animation:"fadeIn 0.4s ease 0.2s both"}}>
        <div className="cp2-section-hd" onClick={()=>setExpandWorkflows(!expandWorkflows)}>
          <div style={{width:38,height:38,borderRadius:10,background:T.greenSoft,border:`1px solid ${T.greenBorder}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{IC.workflow(T.green,17)}</div>
          <div style={{flex:1}}>
            <div style={{fontFamily:T.serif,fontSize:16,fontWeight:500,letterSpacing:"-0.02em"}}>Workflows</div>
            <div style={{fontSize:12,color:T.textSecondary,marginTop:2}}>{workflows.length} workflow{workflows.length!==1?"s":""} matched to your goals</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span className="chip" style={{background:T.greenSoft,color:T.green,fontSize:10}}>{_addedWorkflows.length}/{workflows.length}</span>
            <div style={{width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",transition:"transform 0.25s",transform:expandWorkflows?"rotate(90deg)":"rotate(0)"}}>{IC.chevRight(T.textTertiary,14)}</div>
          </div>
        </div>

        {expandWorkflows&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:0}}>
          {workflows.map((w)=>{
            const isAdded=_addedWorkflows.includes(w.id);
            return<div key={w.id} className="cp2-item" style={{flexDirection:"column",alignItems:"stretch",gap:10}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
                <div style={{width:36,height:36,borderRadius:9,background:T.surfaceMuted,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:`1px solid ${T.borderSubtle}`}}>
                  {IC.workflow(T.green,15)}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13.5,fontWeight:500,letterSpacing:"-0.01em",marginBottom:2}}>{w.name}</div>
                  <div style={{fontSize:11,color:T.textTertiary}}>{w.desc}</div>
                </div>
                {isAdded
                  ?<div className="cp2-btn cp2-btn-done" onClick={()=>toggleWorkflow(w.id)}>{IC.check(T.green,11)} Added</div>
                  :<div className="cp2-btn cp2-btn-outline" onClick={()=>toggleWorkflow(w.id)}>{IC.plus(T.textSecondary,11)} Add</div>
                }
              </div>
              <div style={{paddingLeft:48,display:"flex",alignItems:"center",flexWrap:"wrap",gap:6}}>
                <span style={{fontSize:10,color:T.textTertiary,fontFamily:T.mono,display:"flex",alignItems:"center",gap:3}}>{IC.bolt(T.textTertiary,10)} {w.steps} steps</span>
                <span style={{width:1,height:10,background:T.borderSubtle}}/>
                {w.matchedGoals.slice(0,2).map((gn,gi)=><span key={gi} className="cp2-goal-chip" style={{background:`${T.green}10`,color:T.green}}>{gn.length>28?gn.slice(0,26)+"...":gn}</span>)}
                {w.matchedGoals.length>2&&<span className="cp2-goal-chip" style={{background:`${T.green}10`,color:T.green}}>+{w.matchedGoals.length-2}</span>}
              </div>
            </div>;
          })}
          {workflows.length===0&&<div style={{padding:"24px 22px",textAlign:"center",color:T.textTertiary,fontSize:12}}>No workflows matched. Try selecting more goals.</div>}
        </div>}
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* PEOPLE & ASSETS SECTION (simplified)               */}
      {/* ═══════════════════════════════════════════════════ */}
      <div className="cp2-section" style={{animation:"fadeIn 0.4s ease 0.3s both"}}>
        <div className="cp2-section-hd" onClick={()=>setExpandPeople(!expandPeople)}>
          <div style={{width:38,height:38,borderRadius:10,background:T.violetSoft,border:`1px solid ${T.violetBorder}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{IC.people(T.violet,17)}</div>
          <div style={{flex:1}}>
            <div style={{fontFamily:T.serif,fontSize:16,fontWeight:500,letterSpacing:"-0.02em"}}>People & Assets</div>
            <div style={{fontSize:12,color:T.textSecondary,marginTop:2}}>{peopleAssets.people.length} role{peopleAssets.people.length!==1?"s":""} + {peopleAssets.assets.length} asset type{peopleAssets.assets.length!==1?"s":""}</div>
          </div>
          <div style={{width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",transition:"transform 0.25s",transform:expandPeople?"rotate(90deg)":"rotate(0)"}}>{IC.chevRight(T.textTertiary,14)}</div>
        </div>

        {expandPeople&&<div style={{padding:"18px 22px",borderTop:`1px solid ${T.borderSubtle}`}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            {/* People column */}
            <div>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:12}}>
                {IC.people(T.violet,13)}
                <span style={{fontSize:11,fontWeight:600,color:T.text}}>People Roles</span>
                <span className="chip" style={{background:T.violetSoft,color:T.violet,fontSize:9.5,marginLeft:"auto"}}>{peopleAssets.people.length}</span>
              </div>
              {peopleAssets.people.map((p,i)=><div key={p.role} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderTop:i>0?`1px solid ${T.borderSubtle}`:"none"}}>
                <div style={{width:28,height:28,borderRadius:7,background:T.violetSoft,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{IC.people(T.violet,12)}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12.5,fontWeight:500}}>{p.role}</div>
                  <div style={{fontSize:10,color:T.textTertiary,fontFamily:T.mono}}>{p.matchedGoals.length} goal{p.matchedGoals.length!==1?"s":""}</div>
                </div>
              </div>)}
            </div>

            {/* Assets column */}
            <div>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:12}}>
                {IC.asset(T.amber,13)}
                <span style={{fontSize:11,fontWeight:600,color:T.text}}>Asset Types</span>
                <span className="chip" style={{background:T.amberSoft,color:T.amber,fontSize:9.5,marginLeft:"auto"}}>{peopleAssets.assets.length}</span>
              </div>
              {peopleAssets.assets.map((a,i)=><div key={a.name} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderTop:i>0?`1px solid ${T.borderSubtle}`:"none"}}>
                <div style={{width:28,height:28,borderRadius:7,background:T.amberSoft,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{IC.asset(T.amber,12)}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12.5,fontWeight:500}}>{a.name}</div>
                  <div style={{fontSize:10,color:T.textTertiary,fontFamily:T.mono}}>{a.matchedGoals.length} goal{a.matchedGoals.length!==1?"s":""}</div>
                </div>
              </div>)}
            </div>
          </div>

          {/* Link to people page */}
          <div style={{marginTop:16,paddingTop:14,borderTop:`1px solid ${T.borderSubtle}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span style={{fontSize:12,color:T.textSecondary}}>Import team members and register assets to increase your readiness score.</span>
            <div className="cp2-btn cp2-btn-outline" onClick={()=>onNavigate("people")} style={{marginLeft:12}}>{IC.people(T.textSecondary,11)} Manage People</div>
          </div>
        </div>}
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* AI HELP CARD                                       */}
      {/* ═══════════════════════════════════════════════════ */}
      <div style={{padding:"18px 22px",borderRadius:T.r,background:T.surface,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:14,animation:"fadeIn 0.4s ease 0.4s both"}}>
        <div style={{width:42,height:42,borderRadius:11,background:`linear-gradient(135deg, ${T.accent} 0%, #44403C 100%)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{IC.sparkle("#fff",17)}</div>
        <div style={{flex:1}}>
          <div style={{fontSize:14,fontWeight:500,letterSpacing:"-0.01em",marginBottom:3}}>Need help connecting?</div>
          <div style={{fontSize:12,color:T.textSecondary,lineHeight:1.55}}>AI can auto-detect your existing systems, suggest API configurations, and bulk-import team members from your HRIS.</div>
        </div>
        <div style={{padding:"9px 18px",borderRadius:99,background:T.accent,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:6,flexShrink:0,whiteSpace:"nowrap",transition:"opacity 0.15s"}} onMouseEnter={e=>e.currentTarget.style.opacity="0.88"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>{IC.sparkle("#fff",13)} Ask AI</div>
      </div>

    </div>
  </div>;
}

/* ═══ CONNECTORS PAGE ═══ */

function ConnectorInitials({name}){
  const words=name.replace(/[\/&]/g,' ').split(/\s+/).filter(w=>w.length>0);
  return words.length===1?name.substring(0,2).toUpperCase():words.slice(0,2).map(w=>w[0]).join('').toUpperCase();
}

function ConnectorIcon({id,catColor,size=36}){
  const ico=CICO[id];
  if(!ico)return null;
  const s=size;
  return<svg width={s} height={s} viewBox={ico.vb} style={{borderRadius:s*0.25}}>
    {ico.paths.map((p,i)=><path key={i} d={p.d} fill={p.fill||"none"} stroke={p.stroke||"none"} strokeWidth={p.sw||0} strokeLinecap="round" strokeLinejoin="round" rx={p.rx||0}/>)}
  </svg>;
}

function ConnectorCard({conn,cat,isInstalled,isConfigured,onAction}){
  const initials=ConnectorInitials({name:conn.name});
  const hasIcon=!!CICO[conn.id];
  return<div onClick={onAction} style={{
    background:T.surface,border:`1px solid ${isInstalled?`${cat.color}20`:T.border}`,borderRadius:T.r,
    padding:"16px 16px 14px",display:"flex",flexDirection:"column",gap:10,
    cursor:"pointer",transition:"all 0.3s cubic-bezier(0.4,0,0.2,1)",position:"relative",boxShadow:T.shadow,
  }} onMouseEnter={e=>{e.currentTarget.style.boxShadow=T.shadowMd;e.currentTarget.style.transform="translateY(-2px)";}} onMouseLeave={e=>{e.currentTarget.style.boxShadow=T.shadow;e.currentTarget.style.transform="translateY(0)";}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      {hasIcon?<div style={{width:36,height:36,borderRadius:9,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",background:T.surfaceMuted}}><ConnectorIcon id={conn.id} size={28}/></div>:<div style={{width:36,height:36,borderRadius:9,background:`${cat.color}10`,border:`1px solid ${cat.color}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,fontFamily:T.mono,color:cat.color,letterSpacing:"-0.02em"}}>{initials}</div>}
      {isInstalled&&<div style={{display:"flex",alignItems:"center",gap:4,padding:"2px 8px",borderRadius:99,background:isConfigured?T.greenSoft:T.amberSoft}}>
        <div style={{width:5,height:5,borderRadius:"50%",background:isConfigured?T.green:T.amber}}/>
        <span style={{fontSize:9.5,fontWeight:600,color:isConfigured?T.green:T.amber,fontFamily:T.mono}}>{isConfigured?"Active":"Pending"}</span>
      </div>}
    </div>
    <div style={{flex:1}}>
      <div style={{fontSize:13,fontWeight:600,letterSpacing:"-0.01em",color:T.text}}>{conn.name}</div>
      <div style={{fontSize:11.5,color:T.textSecondary,marginTop:2,lineHeight:1.45}}>{conn.desc}</div>
    </div>
    <div style={{paddingTop:2,borderTop:`1px solid ${T.borderSubtle}`}}>
      {!isInstalled
        ?<div style={{paddingTop:6,fontSize:11.5,fontWeight:500,color:T.textTertiary,display:"flex",alignItems:"center",gap:4,transition:"color 0.15s"}} onMouseEnter={e=>e.currentTarget.style.color=T.text} onMouseLeave={e=>e.currentTarget.style.color=T.textTertiary}>{IC.plus(T.textTertiary,12)}<span>Install</span></div>
        :<div style={{paddingTop:6,fontSize:11.5,fontWeight:500,color:T.highlight,display:"flex",alignItems:"center",justifyContent:"space-between"}}><span>Configure</span>{IC.chevRight(T.highlight,13)}</div>
      }
    </div>
  </div>;
}

/* ═══ CONNECTOR CONFIG PANEL ═══ */
function ConnectorConfigPanel({conn,cat,isConfigured,onClose,onSave,onDisconnect}){
  const initials=ConnectorInitials({name:conn.name});
  const[apiKey,setApiKey]=useState("");
  const[endpoint,setEndpoint]=useState(isConfigured?"https://api.example.com/v1":"");
  const[tested,setTested]=useState(false);

  const fld={width:"100%",padding:"9px 12px",borderRadius:T.rSm,border:`1px solid ${T.border}`,fontFamily:T.mono,fontSize:12,color:T.text,outline:"none",background:T.surfaceHover,transition:"border-color 0.2s"};
  const lbl={fontSize:10,fontWeight:600,color:T.textSecondary,display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.05em",fontFamily:T.mono};

  return<>
    <div style={{position:"fixed",inset:0,background:"rgba(28,25,23,0.15)",zIndex:80,backdropFilter:"blur(3px)"}} onClick={onClose}/>
    <div style={{position:"fixed",right:0,top:0,bottom:0,width:360,maxWidth:"92vw",background:T.surface,borderLeft:`1px solid ${T.border}`,zIndex:90,boxShadow:T.shadowLg,display:"flex",flexDirection:"column",animation:"slideInRight 0.3s cubic-bezier(0.32,0.72,0,1)"}}>
      {/* Header */}
      <div style={{padding:"14px 20px",borderBottom:`1px solid ${T.borderSubtle}`,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <span style={{fontFamily:T.serif,fontSize:15,fontWeight:500}}>Configure</span>
        <div onClick={onClose} style={{width:28,height:28,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",background:T.surfaceMuted,transition:"background 0.15s"}} onMouseEnter={e=>e.currentTarget.style.background=T.border} onMouseLeave={e=>e.currentTarget.style.background=T.surfaceMuted}>{IC.x(T.textSecondary,14)}</div>
      </div>

      {/* Body */}
      <div style={{flex:1,overflowY:"auto",padding:"20px",display:"flex",flexDirection:"column",gap:20}}>
        {/* Identity */}
        <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px",borderRadius:T.r,background:`${cat.color}06`,border:`1px solid ${cat.color}12`}}>
          <div style={{width:44,height:44,borderRadius:11,background:`${cat.color}12`,border:`1px solid ${cat.color}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,fontFamily:T.mono,color:cat.color,flexShrink:0}}>{initials}</div>
          <div>
            <div style={{fontSize:14,fontWeight:600,letterSpacing:"-0.01em"}}>{conn.name}</div>
            <div style={{fontSize:11.5,color:T.textSecondary,marginTop:2}}>{conn.desc}</div>
          </div>
        </div>

        {/* Status */}
        <div style={{display:"flex",alignItems:"center",gap:7,padding:"9px 12px",borderRadius:T.rSm,background:isConfigured?T.greenSoft:T.amberSoft,border:`1px solid ${isConfigured?T.greenBorder:T.amberBorder}`}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:isConfigured?T.green:T.amber,animation:isConfigured?"none":"pulse 2s infinite"}}/>
          <span style={{fontSize:11.5,fontWeight:500,color:isConfigured?T.green:T.amber}}>{isConfigured?"Connected and active":"Installed — needs configuration"}</span>
        </div>

        {/* Connection fields */}
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={{fontSize:10,fontWeight:600,color:T.textTertiary,textTransform:"uppercase",letterSpacing:"0.06em",fontFamily:T.mono}}>Connection Details</div>
          <div>
            <label style={lbl}>API Key</label>
            <input value={apiKey} onChange={e=>setApiKey(e.target.value)} placeholder="Enter API key..." style={fld} onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.border}/>
          </div>
          <div>
            <label style={lbl}>Endpoint URL</label>
            <input value={endpoint} onChange={e=>setEndpoint(e.target.value)} placeholder="https://api.example.com/v1" style={fld} onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.border}/>
          </div>
          <div>
            <label style={lbl}>Environment</label>
            <div style={{...fld,display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",fontFamily:T.sans,color:T.textTertiary}}>
              <span>Production</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.textTertiary} strokeWidth="2" strokeLinecap="round"><path d="M6 9l6 6 6-6"/></svg>
            </div>
          </div>
        </div>

        {/* Test connection */}
        <div onClick={()=>setTested(true)} style={{padding:"10px 0",borderRadius:T.rSm,border:`1px solid ${tested?T.greenBorder:T.border}`,background:tested?T.greenSoft:"transparent",textAlign:"center",fontSize:12,fontWeight:500,color:tested?T.green:T.textSecondary,cursor:"pointer",transition:"all 0.2s",display:"flex",alignItems:"center",justifyContent:"center",gap:6}} onMouseEnter={e=>{if(!tested)e.currentTarget.style.background=T.surfaceHover;}} onMouseLeave={e=>{if(!tested)e.currentTarget.style.background="transparent";}}>
          {tested?<>{IC.check(T.green,12)}<span>Connection verified</span></>:<span>Test Connection</span>}
        </div>

        {/* Metadata */}
        <div style={{display:"flex",flexDirection:"column",gap:8,padding:"12px 0",borderTop:`1px solid ${T.borderSubtle}`}}>
          <div style={{fontSize:10,fontWeight:600,color:T.textTertiary,textTransform:"uppercase",letterSpacing:"0.06em",fontFamily:T.mono}}>Details</div>
          {[["Category",cat.label],["Connector ID",conn.id],["Status",isConfigured?"Configured":"Installed"]].map(([k,v],i)=>
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:11.5,color:T.textTertiary}}>{k}</span>
              <span style={{fontSize:11.5,fontFamily:T.mono,color:T.textSecondary}}>{v}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom actions */}
      <div style={{padding:"14px 20px",borderTop:`1px solid ${T.borderSubtle}`,display:"flex",gap:8,flexShrink:0}}>
        <div onClick={onDisconnect} style={{flex:1,padding:"10px 0",borderRadius:T.rSm,border:`1px solid ${T.roseBorder}`,background:T.roseSoft,textAlign:"center",fontSize:12,fontWeight:500,color:T.rose,cursor:"pointer",transition:"opacity 0.15s"}} onMouseEnter={e=>e.currentTarget.style.opacity="0.8"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>Disconnect</div>
        <div onClick={onSave} style={{flex:1.5,padding:"10px 0",borderRadius:T.rSm,background:T.accent,textAlign:"center",fontSize:12,fontWeight:600,color:"#fff",cursor:"pointer",transition:"opacity 0.15s"}} onMouseEnter={e=>e.currentTarget.style.opacity="0.9"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>Save Configuration</div>
      </div>
    </div>
  </>;
}

/* ═══ CONNECTORS PAGE ORCHESTRATOR ═══ */
function ConnectorsPage(){
  const[search,setSearch]=useState("");
  const[searchFocused,setSearchFocused]=useState(false);
  const[connStates,setConnStates]=useState({}); // {id:{installed,configured}}
  const[configPanel,setConfigPanel]=useState(null); // {connId,catId}

  const getState=(id)=>connStates[id]||{installed:false,configured:false};

  const install=(id)=>{
    setConnStates(prev=>({...prev,[id]:{installed:true,configured:false}}));
  };

  const openConfig=(connId,catId)=>{
    setConfigPanel({connId,catId});
  };

  const saveConfig=(id)=>{
    setConnStates(prev=>({...prev,[id]:{installed:true,configured:true}}));
    setConfigPanel(null);
  };

  const disconnect=(id)=>{
    setConnStates(prev=>{const n={...prev};delete n[id];return n;});
    setConfigPanel(null);
  };

  /* Search filtering */
  const filtered=useMemo(()=>{
    if(!search.trim()) return CONNECTOR_CATALOG;
    const q=search.toLowerCase();
    return CONNECTOR_CATALOG.map(cat=>({
      ...cat,
      connectors:cat.connectors.filter(c=>
        c.name.toLowerCase().includes(q)||c.desc.toLowerCase().includes(q)||cat.label.toLowerCase().includes(q)
      )
    })).filter(cat=>cat.connectors.length>0);
  },[search]);

  /* Installed connectors */
  const installed=useMemo(()=>{
    const res=[];
    CONNECTOR_CATALOG.forEach(cat=>{
      cat.connectors.forEach(conn=>{
        if(getState(conn.id).installed) res.push({conn,cat});
      });
    });
    return res;
  },[connStates]);

  /* Panel data lookup */
  const panelData=useMemo(()=>{
    if(!configPanel) return null;
    const cat=CONNECTOR_CATALOG.find(c=>c.id===configPanel.catId);
    const conn=cat?cat.connectors.find(c=>c.id===configPanel.connId):null;
    return conn&&cat?{conn,cat}:null;
  },[configPanel]);

  /* Installed count */
  const totalConnectors=CONNECTOR_CATALOG.reduce((s,c)=>s+c.connectors.length,0);

  return<div style={{flex:1,overflowY:"auto",background:T.bg}}>
    <div style={{maxWidth:960,margin:"0 auto",padding:"28px 24px 64px"}}>

      {/* Page header */}
      <div style={{marginBottom:24,display:"flex",alignItems:"flex-end",justifyContent:"space-between"}}>
        <div>
          <h1 style={{fontFamily:T.serif,fontSize:24,fontWeight:500,letterSpacing:"-0.03em",color:T.text,margin:0}}>Connectors</h1>
          <p style={{fontSize:13,color:T.textSecondary,marginTop:4,letterSpacing:"-0.01em"}}>Connect external systems and AI models</p>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          {installed.length>0&&<div style={{display:"flex",alignItems:"center",gap:5,padding:"4px 10px",borderRadius:99,background:T.greenSoft,border:`1px solid ${T.greenBorder}`}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:T.green}}/>
            <span style={{fontSize:11,fontWeight:600,color:T.green,fontFamily:T.mono}}>{installed.length} connected</span>
          </div>}
          <span style={{fontSize:11,color:T.textTertiary,fontFamily:T.mono}}>{totalConnectors} available</span>
        </div>
      </div>

      {/* Search bar */}
      <div style={{marginBottom:28}}>
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"11px 16px",borderRadius:T.r,background:T.surface,border:`1.5px solid ${searchFocused?T.accent:T.border}`,boxShadow:searchFocused?`0 0 0 3px ${T.accentSoft}`:T.shadow,transition:"all 0.2s"}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={searchFocused?T.accent:T.textTertiary} strokeWidth="2" strokeLinecap="round" style={{flexShrink:0,transition:"stroke 0.2s"}}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input value={search} onChange={e=>setSearch(e.target.value)} onFocus={()=>setSearchFocused(true)} onBlur={()=>setSearchFocused(false)} placeholder="Search connectors..." style={{flex:1,border:"none",background:"none",fontSize:14,fontFamily:T.sans,color:T.text,outline:"none",letterSpacing:"-0.01em"}}/>
          {search&&<div onClick={()=>setSearch("")} style={{cursor:"pointer",display:"flex",alignItems:"center",padding:2,borderRadius:4,transition:"background 0.15s"}} onMouseEnter={e=>e.currentTarget.style.background=T.surfaceMuted} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>{IC.x(T.textTertiary,14)}</div>}
        </div>
      </div>

      {/* Installed section */}
      {installed.length>0&&!search.trim()&&<div style={{marginBottom:32}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
          <span style={{fontSize:12.5,fontWeight:600,color:T.text,letterSpacing:"-0.01em"}}>Installed</span>
          <span style={{padding:"2px 7px",borderRadius:99,background:T.accentSoft,fontSize:10,fontWeight:600,color:T.textSecondary,fontFamily:T.mono}}>{installed.length}</span>
        </div>
        <div className="connector-grid">
          {installed.map(({conn,cat})=>{
            const st=getState(conn.id);
            return<ConnectorCard key={conn.id} conn={conn} cat={cat} isInstalled={true} isConfigured={st.configured} onAction={()=>openConfig(conn.id,cat.id)}/>;
          })}
        </div>
        <div style={{height:1,background:T.borderSubtle,margin:"28px 0 0"}}/>
      </div>}

      {/* Category sections */}
      <div style={{display:"flex",flexDirection:"column",gap:28}}>
        {filtered.map(cat=><div key={cat.id} style={{animation:"fadeIn 0.3s ease"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
            <div style={{width:5,height:5,borderRadius:"50%",background:cat.color,flexShrink:0}}/>
            <span style={{fontSize:12.5,fontWeight:600,color:T.text,letterSpacing:"-0.01em"}}>{cat.label}</span>
            <span style={{fontSize:10.5,color:T.textTertiary,fontFamily:T.mono}}>{cat.connectors.length}</span>
          </div>
          <div className="connector-grid">
            {cat.connectors.map(conn=>{
              const st=getState(conn.id);
              return<ConnectorCard key={conn.id} conn={conn} cat={cat} isInstalled={st.installed} isConfigured={st.configured} onAction={()=>{
                if(st.installed) openConfig(conn.id,cat.id);
                else install(conn.id);
              }}/>;
            })}
          </div>
        </div>)}
      </div>

      {/* Empty search */}
      {filtered.length===0&&search&&<div style={{textAlign:"center",padding:"60px 0"}}>
        <div style={{width:48,height:48,borderRadius:12,background:T.surfaceMuted,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.textTertiary} strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
        <div style={{fontSize:13,fontWeight:500,color:T.textSecondary}}>No connectors match "{search}"</div>
        <div style={{fontSize:12,color:T.textTertiary,marginTop:4}}>Try a different search term</div>
      </div>}
    </div>

    {/* Config panel */}
    {panelData&&<ConnectorConfigPanel conn={panelData.conn} cat={panelData.cat} isConfigured={getState(panelData.conn.id).configured} onClose={()=>setConfigPanel(null)} onSave={()=>saveConfig(panelData.conn.id)} onDisconnect={()=>disconnect(panelData.conn.id)}/>}
  </div>;
}

/* ═══ ONBOARDING FLOW (Full-screen, 4 steps) ═══ */

/* ── Industry Icons (onboarding-specific, larger) ── */
const OBIndustryIcon=({type,color,size=44})=>{
  if(type==="manufacturing")return<svg width={size} height={size} viewBox="0 0 56 56" fill="none"><rect x="4" y="36" width="48" height="4" rx="2" fill={color} opacity="0.12"/><path d="M10 38V22l12-8v8l12-8v8l12-8v16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="16" y="28" width="5" height="8" rx="1" stroke={color} strokeWidth="1.5"/><rect x="26" y="28" width="5" height="8" rx="1" stroke={color} strokeWidth="1.5"/><rect x="36" y="28" width="5" height="8" rx="1" stroke={color} strokeWidth="1.5"/></svg>;
  if(type==="qsr")return<svg width={size} height={size} viewBox="0 0 56 56" fill="none"><rect x="4" y="36" width="48" height="4" rx="2" fill={color} opacity="0.12"/><path d="M12 30c0-9 5-18 16-18s16 9 16 18" stroke={color} strokeWidth="2" strokeLinecap="round"/><path d="M8 30h40" stroke={color} strokeWidth="2" strokeLinecap="round"/><path d="M12 34h32l-2 6H14z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/><path d="M20 30v-5c0-1 .8-2 2.5-2h11c1.7 0 2.5 1 2.5 2v5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></svg>;
  return<svg width={size} height={size} viewBox="0 0 56 56" fill="none"><rect x="4" y="36" width="48" height="4" rx="2" fill={color} opacity="0.12"/><rect x="6" y="18" width="28" height="18" rx="3" stroke={color} strokeWidth="2"/><path d="M34 24h10l7 8v4H34" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="16" cy="40" r="5" stroke={color} strokeWidth="2"/><circle cx="42" cy="40" r="5" stroke={color} strokeWidth="2"/><path d="M21 36h17" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>;
};

/* ── Onboarding Step 1: Industry (tap to auto-advance) ── */
function OBIndustryStep({industry,onSelect}){
  return<div className="ob-content" style={{animation:"fadeIn 0.5s ease both"}}>
    <div style={{textAlign:"center",marginBottom:32}}>
      <div style={{display:"inline-flex",padding:"5px 13px",borderRadius:99,background:T.surfaceMuted,fontSize:10.5,fontWeight:600,color:T.textTertiary,letterSpacing:"0.04em",textTransform:"uppercase",fontFamily:T.mono,marginBottom:14}}>Step 1 of 4</div>
      <h1 style={{fontFamily:T.serif,fontSize:"clamp(24px,5vw,34px)",fontWeight:300,letterSpacing:"-0.04em",lineHeight:1.15,marginBottom:8}}>What industry are you in?</h1>
      <p style={{fontSize:14,color:T.textSecondary,lineHeight:1.6,maxWidth:440,margin:"0 auto"}}>Tap to select — we'll configure your goals and metrics to match.</p>
    </div>
    <div className="ob-ind-grid">
      {INDUSTRIES.map((ind,idx)=>{
        const sel=industry===ind.id;
        const cats=GOAL_CATEGORIES[ind.id]||[];
        return<div key={ind.id} className={`ob-ind-card${sel?" sel":""}`} onClick={()=>onSelect(ind.id)} style={{
          borderColor:sel?ind.color:T.border,
          boxShadow:sel?`0 8px 28px ${ind.color}18`:"0 1px 3px rgba(0,0,0,0.04)",
          animation:`fadeIn 0.4s ease ${0.06+idx*0.07}s both`,
        }}>
          {sel&&<div className="ob-sel-badge" style={{background:ind.color}}>{IC.check("#fff",11)}</div>}
          <div style={{display:"flex",alignItems:"flex-start",gap:16,marginBottom:14}}>
            <div style={{width:48,height:48,borderRadius:13,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,background:sel?`${ind.color}14`:T.surfaceMuted,transition:"all 0.25s"}}><OBIndustryIcon type={ind.id} color={sel?ind.color:T.textTertiary}/></div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontFamily:T.serif,fontSize:18,fontWeight:500,letterSpacing:"-0.02em",lineHeight:1.25,marginBottom:4}}>{ind.label}</div>
              <div style={{fontSize:13,color:T.textSecondary,lineHeight:1.5}}>{ind.desc}</div>
            </div>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:14}}>
            {cats.map(cat=><span key={cat} className="ob-pill" style={{
              background:sel?`${ind.color}12`:T.surfaceMuted,color:sel?ind.color:T.textTertiary,
              border:`1px solid ${sel?`${ind.color}25`:"transparent"}`,
            }}>{cat}</span>)}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6,paddingTop:12,borderTop:`1px solid ${T.borderSubtle}`}}>
            {IC.target(sel?ind.color:T.textTertiary)}
            <span style={{fontSize:12,fontWeight:600,color:sel?ind.color:T.textTertiary,fontFamily:T.mono}}>{ind.goalCount}</span>
            <span style={{fontSize:12,color:T.textTertiary}}>operational goals</span>
          </div>
        </div>;
      })}
    </div>
  </div>;
}

/* ── Onboarding Step 2: Persona (tap to auto-advance) ── */
function OBPersonaStep({industry,persona,onSelect}){
  const ind=INDUSTRIES.find(i=>i.id===industry);
  const personas=getPersonasForIndustry(industry);
  const gridClass=`ob-per-grid${personas.length===4||personas.length===5?" cols-2":""}`;

  return<div className="ob-content" style={{animation:"fadeIn 0.5s ease both"}}>
    <div style={{textAlign:"center",marginBottom:28}}>
      <span className="ob-pill" style={{background:`${ind.color}12`,color:ind.color,border:`1px solid ${ind.color}25`,marginBottom:14,display:"inline-flex",fontSize:11,fontWeight:600}}>{ind.label}</span>
      <h1 style={{fontFamily:T.serif,fontSize:"clamp(24px,5vw,34px)",fontWeight:300,letterSpacing:"-0.04em",lineHeight:1.15,marginBottom:8}}>What's your role?</h1>
      <p style={{fontSize:14,color:T.textSecondary,lineHeight:1.6,maxWidth:420,margin:"0 auto"}}>Tap to select — we'll pre-select goals relevant to your responsibilities.</p>
    </div>
    <div className={gridClass}>
      {personas.map((p,idx)=>{
        const sel=persona===p;
        const defaults=PERSONA_DEFAULTS[p]||[];
        const focus=getPersonaFocus(p);
        return<div key={p} className="ob-per-card" onClick={()=>onSelect(p)} style={{
          borderColor:sel?ind.color:T.border,
          background:sel?ind.colorSoft:T.surface,
          boxShadow:sel?`0 4px 16px ${ind.color}12`:"0 1px 2px rgba(0,0,0,0.03)",
          animation:`fadeIn 0.4s ease ${0.04+idx*0.04}s both`,
        }}>
          <div style={{width:40,height:40,borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,background:sel?`${ind.color}18`:T.surfaceMuted,transition:"all 0.2s"}}>
            {sel?IC.check(ind.color,15):IC.people(T.textTertiary)}
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:14,fontWeight:sel?600:500,letterSpacing:"-0.01em",lineHeight:1.3}}>{p}</div>
            <div style={{fontSize:11.5,color:T.textTertiary,marginTop:3,lineHeight:1.4}}>{focus}</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",flexShrink:0}}>
            <span style={{fontSize:18,fontWeight:300,fontFamily:T.serif,color:sel?ind.color:T.textTertiary,letterSpacing:"-0.02em",lineHeight:1}}>{defaults.length}</span>
            <span style={{fontSize:9.5,color:T.textTertiary,marginTop:1}}>goals</span>
          </div>
        </div>;
      })}
    </div>
  </div>;
}

/* ── Goal Row (reusable) ── */
function OBGoalRow({goal,selected,recommended,onToggle,color,expanded,onExpand}){
  return<>
    <div className="ob-goal-row" onClick={()=>onToggle(goal.id)}>
      <div className={`ob-goal-cb${selected?" on":""}`} style={selected?{background:color}:{}}>
        {selected&&IC.check("#fff",11)}
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:13.5,fontWeight:500,letterSpacing:"-0.01em",lineHeight:1.3,color:selected?T.text:T.textSecondary}}>{goal.name}</div>
        <div className="ob-goal-desc">{goal.description}</div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
        {recommended&&<span style={{fontSize:8,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em",padding:"2.5px 7px",borderRadius:5,fontFamily:T.mono,background:`${color}12`,color}}>{"\u2605"}</span>}
        <span style={{padding:"3px 8px",borderRadius:99,fontSize:10,fontFamily:T.mono,fontWeight:500,background:T.surfaceMuted,color:T.textTertiary}}>{goal.metrics.length}</span>
        <div onClick={e=>{e.stopPropagation();onExpand(expanded?null:goal.id);}} style={{width:28,height:28,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",transition:"transform 0.2s",transform:expanded?"rotate(90deg)":"rotate(0)"}}>
          {IC.chevRight(T.textTertiary,13)}
        </div>
      </div>
    </div>
    {expanded&&<div style={{padding:"4px 12px 16px 52px",animation:"fadeIn 0.2s ease"}}>
      <div style={{fontSize:12.5,color:T.textSecondary,lineHeight:1.6,marginBottom:10}}>{goal.description}</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
        {goal.metrics.map((m,i)=><span key={i} className="ob-pill" style={{background:selected?`${color}10`:T.surfaceMuted,color:selected?color:T.textTertiary,fontSize:10}}>{m}</span>)}
      </div>
    </div>}
  </>;
}

/* ── Onboarding Step 3: Goals (Continue button) ── */
function OBGoalsStep({industry,persona,selectedGoals,setSelectedGoals}){
  const ind=INDUSTRIES.find(i=>i.id===industry);
  const allGoals=getGoalsByIndustry(industry);
  const categories=GOAL_CATEGORIES[industry]||[];
  const recommendedIds=PERSONA_DEFAULTS[persona]||[];
  const[activeCat,setActiveCat]=useState("all");
  const[expandedGoal,setExpandedGoal]=useState(null);

  const toggleGoal=(id)=>setSelectedGoals(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);
  const selRecommended=()=>{setSelectedGoals(prev=>{const without=prev.filter(x=>!allGoals.map(g=>g.id).includes(x));return[...without,...recommendedIds];});};
  const selAll=()=>{const ids=allGoals.map(g=>g.id);setSelectedGoals(prev=>[...new Set([...prev,...ids])]);};
  const selNone=()=>{const ids=allGoals.map(g=>g.id);setSelectedGoals(prev=>prev.filter(x=>!ids.includes(x)));};
  const filteredCats=activeCat==="all"?categories:[activeCat];
  const selCount=allGoals.filter(g=>selectedGoals.includes(g.id)).length;

  return<div className="ob-content" style={{animation:"fadeIn 0.5s ease both",maxWidth:780,margin:"0 auto"}}>
    <div style={{marginBottom:20}}>
      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10,flexWrap:"wrap"}}>
        <span className="ob-pill" style={{background:`${ind.color}12`,color:ind.color,border:`1px solid ${ind.color}25`,fontWeight:600,fontSize:11}}>{ind.label}</span>
        {persona&&<span className="ob-pill" style={{background:T.surfaceMuted,color:T.textSecondary,fontSize:11}}>{persona}</span>}
      </div>
      <h1 style={{fontFamily:T.serif,fontSize:"clamp(22px,4.5vw,30px)",fontWeight:300,letterSpacing:"-0.04em",lineHeight:1.15,marginBottom:6}}>Select your operational goals</h1>
      <p style={{fontSize:13,color:T.textTertiary,lineHeight:1.5}}>Pre-selected based on your role. Tap to select or deselect.</p>
    </div>

    {/* Category tabs */}
    <div style={{marginBottom:16,display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
      <div className="ob-cat-tabs">
        <div className={`ob-cat-tab${activeCat==="all"?" active":""}`} onClick={()=>setActiveCat("all")} style={activeCat==="all"?{background:ind.color,borderColor:ind.color}:{}}>
          All <span style={{fontFamily:T.mono,fontWeight:600,marginLeft:3}}>{selCount}/{allGoals.length}</span>
        </div>
        {categories.map(cat=>{
          const catGoals=allGoals.filter(g=>g.category===cat);
          const catSel=catGoals.filter(g=>selectedGoals.includes(g.id)).length;
          const isActive=activeCat===cat;
          return<div key={cat} className={`ob-cat-tab${isActive?" active":""}`} onClick={()=>setActiveCat(cat)} style={isActive?{background:ind.color,borderColor:ind.color}:{}}>
            {cat} <span style={{fontFamily:T.mono,fontWeight:600,marginLeft:3,opacity:0.7}}>{catSel}</span>
          </div>;
        })}
      </div>
      <div style={{marginLeft:"auto",display:"flex",gap:4,flexShrink:0}}>
        <div className="ob-btn ob-btn-ghost" style={{padding:"6px 10px",fontSize:11}} onClick={selRecommended}>Reset</div>
        <div className="ob-btn ob-btn-ghost" style={{padding:"6px 10px",fontSize:11}} onClick={selAll}>All</div>
        <div className="ob-btn ob-btn-ghost" style={{padding:"6px 10px",fontSize:11}} onClick={selNone}>None</div>
      </div>
    </div>

    {/* Goal rows grouped by category */}
    {filteredCats.map(cat=>{
      const catGoals=allGoals.filter(g=>g.category===cat);
      if(catGoals.length===0)return null;
      const catSel=catGoals.filter(g=>selectedGoals.includes(g.id)).length;
      return<div key={cat} style={{marginBottom:16}}>
        {(activeCat==="all")&&<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 2px 8px",marginTop:8}}>
          <span style={{fontSize:12.5,fontWeight:600,letterSpacing:"-0.01em"}}>{cat}</span>
          <span style={{fontSize:11,fontFamily:T.mono,color:catSel>0?ind.color:T.textTertiary,fontWeight:600}}>{catSel}/{catGoals.length}</span>
        </div>}
        <div className="ob-goal-list">
          {catGoals.map(g=><OBGoalRow key={g.id} goal={g} selected={selectedGoals.includes(g.id)} recommended={recommendedIds.includes(g.id)} onToggle={toggleGoal} color={ind.color} expanded={expandedGoal===g.id} onExpand={setExpandedGoal}/>)}
        </div>
      </div>;
    })}
  </div>;
}

/* ── Onboarding Step 4: Review ── */
function OBReviewStep({industry,persona,selectedGoals}){
  const ind=INDUSTRIES.find(i=>i.id===industry);
  const goals=OPERATIONAL_GOALS.filter(g=>selectedGoals.includes(g.id));
  const categories=[...new Set(goals.map(g=>g.category))];

  return<div className="ob-content" style={{animation:"fadeIn 0.5s ease both",maxWidth:700,margin:"0 auto",textAlign:"center"}}>
    <div style={{marginBottom:32}}>
      <div style={{width:64,height:64,borderRadius:18,background:`${ind.color}12`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px",border:`2px solid ${ind.color}22`}}>
        {IC.check(ind.color,28)}
      </div>
      <h1 style={{fontFamily:T.serif,fontSize:"clamp(24px,5vw,32px)",fontWeight:300,letterSpacing:"-0.04em",lineHeight:1.15,marginBottom:8}}>You're all set</h1>
      <p style={{fontSize:14,color:T.textSecondary,lineHeight:1.6,maxWidth:400,margin:"0 auto"}}>
        Configured for <strong style={{color:T.text}}>{ind.label}</strong> as <strong style={{color:T.text}}>{persona}</strong> with {selectedGoals.length} goals.
      </p>
    </div>

    <div className="ob-rev-cards" style={{marginBottom:24,textAlign:"left"}}>
      <div className="ob-rev-card">
        <div style={{fontSize:10,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",color:T.textTertiary,fontFamily:T.mono,marginBottom:8}}>Industry</div>
        <div style={{fontSize:15,fontWeight:500,marginBottom:6}}>{ind.label}</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
          {(GOAL_CATEGORIES[industry]||[]).slice(0,3).map(c=><span key={c} className="ob-pill" style={{background:`${ind.color}10`,color:ind.color,fontSize:10}}>{c}</span>)}
          {(GOAL_CATEGORIES[industry]||[]).length>3&&<span className="ob-pill" style={{background:T.surfaceMuted,color:T.textTertiary,fontSize:10}}>+{(GOAL_CATEGORIES[industry]||[]).length-3}</span>}
        </div>
      </div>
      <div className="ob-rev-card">
        <div style={{fontSize:10,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",color:T.textTertiary,fontFamily:T.mono,marginBottom:8}}>Role</div>
        <div style={{fontSize:15,fontWeight:500,marginBottom:6}}>{persona}</div>
        <div style={{fontSize:12,color:T.textTertiary,lineHeight:1.5}}>Dashboards and alerts tailored to this role.</div>
      </div>
      <div className="ob-rev-card">
        <div style={{fontSize:10,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",color:T.textTertiary,fontFamily:T.mono,marginBottom:8}}>Goals</div>
        <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:6}}>
          <span style={{fontSize:26,fontWeight:300,fontFamily:T.serif,color:ind.color}}>{selectedGoals.length}</span>
          <span style={{fontSize:12,color:T.textTertiary}}>across {categories.length} categories</span>
        </div>
      </div>
    </div>

    <div style={{background:T.surface,border:`1.5px solid ${T.border}`,borderRadius:14,overflow:"hidden",textAlign:"left",marginBottom:10}}>
      {categories.map(cat=>{
        const catGoals=goals.filter(g=>g.category===cat);
        return<div key={cat}>
          <div style={{padding:"10px 16px",background:T.surfaceHover,borderBottom:`1px solid ${T.borderSubtle}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span style={{fontSize:11.5,fontWeight:600,letterSpacing:"-0.01em"}}>{cat}</span>
            <span style={{fontSize:10,fontFamily:T.mono,color:ind.color,fontWeight:600}}>{catGoals.length}</span>
          </div>
          {catGoals.map(g=><div key={g.id} style={{padding:"9px 16px",borderBottom:`1px solid ${T.borderSubtle}`,display:"flex",alignItems:"center",gap:8,fontSize:12.5,color:T.textSecondary}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:ind.color,opacity:0.5,flexShrink:0}}/>
            <span style={{flex:1}}>{g.name}</span>
            <span style={{fontSize:10,fontFamily:T.mono,color:T.textTertiary}}>{g.metrics.length}</span>
          </div>)}
        </div>;
      })}
    </div>
  </div>;
}

/* ═══ ONBOARDING FLOW (main wrapper) ═══ */
function OnboardingFlow({onComplete,industry,setIndustry,persona,setPersona,selectedGoals,setSelectedGoals}){
  const[step,setStep]=useState(0);
  const bodyRef=useRef(null);
  const stepLabels=["Industry","Role","Goals","Review"];

  /* Scroll to top on step change */
  useEffect(()=>{if(bodyRef.current)bodyRef.current.scrollTop=0;},[step]);

  /* Auto-set goals when persona changes */
  const prevPersona=useRef(persona);
  useEffect(()=>{
    if(persona&&persona!==prevPersona.current){
      setSelectedGoals(PERSONA_DEFAULTS[persona]||[]);
      prevPersona.current=persona;
    }
  },[persona]);

  const handleIndustrySelect=(id)=>{
    setIndustry(id);
    setPersona("");
    setSelectedGoals([]);
    setTimeout(()=>setStep(1),350);
  };

  const handlePersonaSelect=(p)=>{
    setPersona(p);
    setTimeout(()=>setStep(2),350);
  };

  const canNext=step===2&&selectedGoals.length>0;
  const ind=INDUSTRIES.find(i=>i.id===industry);

  const handleSkip=()=>{
    const defInd=industry||"manufacturing";
    if(!industry)setIndustry(defInd);
    const defPersona=persona||getPersonasForIndustry(defInd)[0]||"Operations Manager";
    if(!persona)setPersona(defPersona);
    if(selectedGoals.length===0)setSelectedGoals(PERSONA_DEFAULTS[defPersona]||[]);
    onComplete();
  };

  return<>
    <style>{`
      .ob-shell{min-height:100vh;background:${T.bg};font-family:${T.sans};color:${T.text};display:flex;flex-direction:column}
      .ob-header{padding:0 16px;height:56px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid ${T.borderSubtle};background:rgba(255,255,255,0.92);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);position:sticky;top:0;z-index:50;flex-shrink:0}
      .ob-body{flex:1;overflow-y:auto;padding:28px 16px 120px;-webkit-overflow-scrolling:touch}
      .ob-footer{position:fixed;bottom:0;left:0;right:0;z-index:40;padding:12px 16px;background:rgba(255,255,255,0.92);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-top:1px solid ${T.borderSubtle};display:flex;align-items:center;justify-content:space-between;gap:12px}
      .ob-content{max-width:960px;margin:0 auto;width:100%}
      .ob-pill{display:inline-flex;align-items:center;gap:4px;padding:3.5px 10px;border-radius:99px;font-size:10.5px;font-weight:500;font-family:${T.sans};white-space:nowrap;transition:all 0.2s;letter-spacing:-0.01em}
      .ob-sel-badge{position:absolute;top:14px;right:14px;width:24px;height:24px;border-radius:7px;display:flex;align-items:center;justify-content:center;animation:fadeIn 0.3s ease}

      /* Step dots (mobile) */
      .ob-step-dots{display:flex;align-items:center;gap:6px}
      .ob-step-dot{width:8px;height:8px;border-radius:50%;background:${T.border};transition:all 0.3s}
      .ob-step-dot.done{background:${T.accent}}
      .ob-step-dot.active{background:${T.accent};width:24px;border-radius:4px}
      /* Step labels (desktop) */
      .ob-step-labels{display:none;align-items:center;gap:0}
      .ob-step-num{width:22px;height:22px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600;font-family:${T.mono};transition:all 0.3s;border:1.5px solid ${T.border};color:${T.textTertiary};background:transparent}
      .ob-step-num.done,.ob-step-num.active{background:${T.accent};color:#fff;border-color:${T.accent}}

      /* Industry grid */
      .ob-ind-grid{display:grid;grid-template-columns:1fr;gap:14px}
      .ob-ind-card{background:${T.surface};border:2px solid ${T.border};border-radius:16px;padding:24px 20px 20px;cursor:pointer;transition:all 0.3s cubic-bezier(0.4,0,0.2,1);position:relative;-webkit-user-select:none;user-select:none;box-shadow:${T.shadow}}
      .ob-ind-card:active{transform:scale(0.98)}
      .ob-ind-card.sel{transform:translateY(-2px)}

      /* Persona grid */
      .ob-per-grid{display:grid;grid-template-columns:1fr;gap:10px;max-width:720px;margin:0 auto}
      .ob-per-card{display:flex;align-items:center;gap:14px;padding:16px 18px;border-radius:13px;cursor:pointer;background:${T.surface};border:2px solid ${T.border};transition:all 0.3s cubic-bezier(0.4,0,0.2,1);-webkit-user-select:none;user-select:none;min-height:48px;box-shadow:${T.shadow}}
      .ob-per-card:active{transform:scale(0.98)}

      /* Goals */
      .ob-cat-tabs{display:flex;gap:6px;overflow-x:auto;padding-bottom:4px;-webkit-overflow-scrolling:touch;scrollbar-width:none;-ms-overflow-style:none}
      .ob-cat-tabs::-webkit-scrollbar{display:none}
      .ob-cat-tab{padding:7px 14px;border-radius:99px;font-size:12px;font-weight:500;white-space:nowrap;cursor:pointer;border:1.5px solid ${T.border};background:${T.surface};color:${T.textSecondary};transition:all 0.2s;flex-shrink:0;-webkit-user-select:none;user-select:none}
      .ob-cat-tab:active{transform:scale(0.96)}
      .ob-cat-tab.active{color:#fff;border-color:transparent}
      .ob-goal-list{background:${T.surface};border:1.5px solid ${T.border};border-radius:14px;overflow:hidden;box-shadow:${T.shadow}}
      .ob-goal-row{display:flex;align-items:center;gap:12px;padding:14px 16px;border-bottom:1px solid ${T.borderSubtle};cursor:pointer;transition:background 0.15s;-webkit-user-select:none;user-select:none;min-height:56px}
      .ob-goal-row:last-child{border-bottom:none}
      .ob-goal-row:active{background:${T.surfaceHover}}
      .ob-goal-cb{width:24px;height:24px;border-radius:7px;flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all 0.2s;border:2px solid ${T.border}}
      .ob-goal-cb.on{border:none}
      .ob-goal-desc{font-size:11.5px;color:${T.textTertiary};line-height:1.4;margin-top:2px;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden}

      /* Review */
      .ob-rev-cards{display:grid;grid-template-columns:1fr;gap:12px}
      .ob-rev-card{background:${T.surface};border:1.5px solid ${T.border};border-radius:14px;padding:18px 20px;box-shadow:${T.shadow}}

      /* Buttons */
      .ob-btn{padding:11px 24px;border-radius:99px;font-size:13.5px;font-weight:600;font-family:${T.sans};cursor:pointer;display:inline-flex;align-items:center;gap:7px;transition:all 0.2s;border:none;-webkit-user-select:none;user-select:none;letter-spacing:-0.01em}
      .ob-btn:active{transform:scale(0.96)}
      .ob-btn-primary{background:${T.accent};color:#fff;box-shadow:0 4px 14px rgba(0,0,0,0.12)}
      .ob-btn-primary:disabled{background:${T.surfaceMuted};color:${T.textTertiary};box-shadow:none;cursor:default;transform:none}
      .ob-btn-secondary{background:${T.surface};color:${T.textSecondary};border:1.5px solid ${T.border}}
      .ob-btn-ghost{background:transparent;color:${T.textTertiary};padding:11px 14px}

      /* Tablet (640px+) */
      @media(min-width:640px){
        .ob-header{padding:0 24px;height:60px}
        .ob-body{padding:36px 24px 120px}
        .ob-footer{padding:14px 24px}
        .ob-ind-grid{grid-template-columns:1fr 1fr}
        .ob-per-grid{grid-template-columns:1fr 1fr}
        .ob-rev-cards{grid-template-columns:repeat(3,1fr)}
        .ob-step-dots{display:none}
        .ob-step-labels{display:flex}
        .ob-goal-desc{-webkit-line-clamp:2}
      }
      /* Desktop (960px+) */
      @media(min-width:960px){
        .ob-header{padding:0 32px}
        .ob-body{padding:48px 32px 120px}
        .ob-footer{padding:16px 32px}
        .ob-ind-grid{grid-template-columns:repeat(3,1fr)}
        .ob-per-grid{grid-template-columns:repeat(3,1fr)}
        .ob-per-grid.cols-2{grid-template-columns:repeat(2,1fr);max-width:520px}
      }
    `}</style>

    <div className="ob-shell">
      {/* Header */}
      <div className="ob-header">
        <div style={{display:"flex",alignItems:"center",gap:9}}>
          <svg width="26" height="26" viewBox="0 0 100 100" fill="none"><rect width="100" height="100" rx="20" fill="#001F5B"/><path d="M50 15 L30 40 L35 40 L35 55 L25 55 L25 75 L40 75 L40 60 L45 60 L45 75 L55 75 L55 60 L60 60 L60 75 L75 75 L75 55 L65 55 L65 40 L70 40 Z" fill="#fff"/><circle cx="50" cy="32" r="5" fill="#C4A84E"/></svg>
          <span style={{fontFamily:T.serif,fontSize:15,fontWeight:500,letterSpacing:"-0.02em"}}>RC Marine Ops</span>
        </div>

        {/* Mobile: dots */}
        <div className="ob-step-dots">
          {stepLabels.map((_,i)=><div key={i} className={`ob-step-dot${i<step?" done":""}${i===step?" active":""}`}/>)}
        </div>

        {/* Desktop: labeled steps */}
        <div className="ob-step-labels">
          {stepLabels.map((label,i)=>{
            const done=i<step;const active=i===step;
            return<React.Fragment key={i}>
              {i>0&&<div style={{width:32,height:1.5,background:done?T.accent:T.borderSubtle,transition:"background 0.4s"}}/>}
              <div style={{display:"flex",alignItems:"center",gap:6,padding:"5px 8px",borderRadius:99,...(active?{background:"rgba(26,26,30,0.04)"}:{})}}>
                <div className={`ob-step-num${done?" done":""}${active?" active":""}`}>{done?IC.check("#fff",9):i+1}</div>
                <span style={{fontSize:11.5,letterSpacing:"-0.01em",whiteSpace:"nowrap",color:active?T.text:done?T.textSecondary:T.textTertiary,...(active?{fontWeight:600}:{})}}>{label}</span>
              </div>
            </React.Fragment>;
          })}
        </div>

        <div className="ob-btn ob-btn-ghost" style={{fontSize:12,padding:"8px 12px",color:T.textTertiary}} onClick={handleSkip}>Skip</div>
      </div>

      {/* Progress bar */}
      <div style={{height:2,background:T.borderSubtle}}>
        <div style={{height:"100%",width:`${(step/3)*100}%`,background:T.accent,transition:"width 0.5s cubic-bezier(0.4,0,0.2,1)"}}/>
      </div>

      {/* Body */}
      <div className="ob-body" ref={bodyRef}>
        {step===0&&<OBIndustryStep industry={industry} onSelect={handleIndustrySelect}/>}
        {step===1&&<OBPersonaStep industry={industry} persona={persona} onSelect={handlePersonaSelect}/>}
        {step===2&&<OBGoalsStep industry={industry} persona={persona} selectedGoals={selectedGoals} setSelectedGoals={setSelectedGoals}/>}
        {step===3&&<OBReviewStep industry={industry} persona={persona} selectedGoals={selectedGoals}/>}
      </div>

      {/* Footer */}
      <div className="ob-footer">
        <div>
          {step>0&&<button className="ob-btn ob-btn-secondary" onClick={()=>setStep(step-1)}>
            {IC.chevLeft(T.textSecondary,14)}<span>Back</span>
          </button>}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          {step===2&&<span style={{fontSize:12,fontFamily:T.mono,color:selectedGoals.length>0?(ind?ind.color:T.accent):T.textTertiary,fontWeight:600}}>
            {selectedGoals.length} selected
          </span>}
          {step===2&&(
            <button className="ob-btn ob-btn-primary" disabled={!canNext} onClick={()=>{if(canNext)setStep(3);}}>
              <span>Continue</span>{IC.chevRight(canNext?"#fff":T.textTertiary,14)}
            </button>
          )}
          {step===3&&(
            <button className="ob-btn" style={{background:ind?ind.color:T.accent,color:"#fff",boxShadow:"0 4px 18px rgba(0,0,0,0.15)"}} onClick={onComplete}>
              {IC.sparkle("#fff",14)}<span>Launch workspace</span>
            </button>
          )}
        </div>
      </div>
    </div>
  </>;
}

/* ═══ CHAT ONBOARDING (conversational setup) ═══ */

/* Succinct role descriptions */
const PERSONA_DESCS={
  "Plant Manager":"Oversee plant operations, KPIs, and cross-functional teams",
  "VP of Operations":"Strategic oversight of efficiency, cost, and supply chain",
  "Quality Director":"Lead quality programs, compliance, and continuous improvement",
  "Maintenance Manager":"Drive equipment reliability and preventive maintenance",
  "Production Manager":"Manage production targets, scheduling, and line performance",
  "Supply Chain Manager":"Optimize sourcing, inventory, and supplier relationships",
  "Store Manager":"Run day-to-day restaurant operations and guest experience",
  "District Manager":"Oversee multi-unit performance, consistency, and growth",
  "Franchisee":"Maximize unit profitability and protect your investment",
  "VP of Quality Assurance":"Set and enforce food safety and quality standards",
  "Fleet Manager":"Manage vehicle fleet, maintenance, and driver operations",
  "Dispatch Supervisor":"Coordinate dispatching, routes, and delivery execution",
  "VP of Logistics":"Strategic oversight of network and freight operations",
  "Warehouse Manager":"Optimize warehouse throughput, accuracy, and dock operations",
  "Safety Director":"Lead safety programs, compliance, and risk mitigation",
};

function ChatOnboarding({onComplete,setIndustry,setPersona,setSelectedGoals,setFocusGoalName}){
  const[messages,setMessages]=useState([
    {id:"ai-pre-1",role:"ai",parts:[
      {type:"text",content:"Hey! What's your name and company?"},
    ]},
    {id:"u-pre-1",role:"user",text:"Michael, RC Marine Ops"},
    {id:"card-pre",role:"company-card",name:"Michael",company:"RC Marine Ops",website:"rcmarineops.com",logo:"/RCMarineLogo.png"},
    {id:"ai-pre-2",role:"ai",parts:[
      {type:"text",content:"Is that right?"},
    ]},
    {id:"u-pre-2",role:"user",text:"That's correct"},
  ]);
  const[step,setStep]=useState("intro");
  const[typing,setTyping]=useState(false);
  const[chosenIndustry,setChosenIndustry]=useState(null);
  const[chosenPersona,setChosenPersona]=useState(null);
  const[chosenGoals,setChosenGoals]=useState([]);
  const[chosenFocus,setChosenFocus]=useState(null);
  const[chosenInterest,setChosenInterest]=useState(null);
  const endRef=useRef(null);
  const initRef=useRef(false);

  const scrollBottom=()=>{setTimeout(()=>{if(endRef.current)endRef.current.scrollIntoView({behavior:"smooth"});},60);};

  /* ── Add AI message with typing delay ── */
  const addAI=(parts,nextStep,delay=600)=>{
    setTyping(true);scrollBottom();
    setTimeout(()=>{
      setTyping(false);
      setMessages(prev=>[...prev,{id:`ai-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,role:"ai",parts}]);
      if(nextStep)setStep(nextStep);
      scrollBottom();
    },delay);
  };

  /* ── Add user message ── */
  const addUser=(text)=>{
    setMessages(prev=>[...prev,{id:`u-${Date.now()}`,role:"user",text}]);
    scrollBottom();
  };

  /* ── Kick off with industry question (after pre-loaded name/company exchange) ── */
  useEffect(()=>{
    if(initRef.current)return;
    initRef.current=true;
    addAI([
      {type:"text",content:"Great, nice to meet you Michael! Let's get RC Marine Ops set up."},
      {type:"text",content:"What industry are you in?"},
      {type:"options",key:"industry",options:INDUSTRIES.map(ind=>({
        id:ind.id,label:ind.label,sub:ind.desc,color:ind.color,
      }))},
    ],"industry",800);
  },[]);

  /* ── Industry selected ── */
  const handleIndustry=(ind)=>{
    const industry=INDUSTRIES.find(i=>i.id===ind.id);
    setChosenIndustry(industry);
    setIndustry(industry.id);
    addUser(industry.label);

    const personas=getPersonasForIndustry(industry.id);
    setTimeout(()=>{
      addAI([
        {type:"text",content:`Great \u2014 ${industry.label}. I know that space well.`},
        {type:"text",content:"What's your role?"},
        {type:"options",key:"persona",options:personas.map(p=>({
          id:p,label:p,sub:PERSONA_DESCS[p]||"",color:industry.color,
        }))},
      ],"persona",500);
    },300);
  };

  /* ── Persona selected ── */
  const handlePersona=(opt)=>{
    setChosenPersona(opt.id);
    setPersona(opt.id);
    addUser(opt.label);

    const defaults=PERSONA_DEFAULTS[opt.id]||[];
    const goalObjs=defaults.map(id=>OPERATIONAL_GOALS.find(g=>g.id===id)).filter(Boolean);
    const firstBatch=goalObjs.slice(0,3);

    setTimeout(()=>{
      addAI([
        {type:"text",content:"Nice \u2014 here's what I'd recommend based on your role."},
        {type:"text",content:"**Where do you want to focus?** Pick one to start \u2014 you can add more later."},
        {type:"focus-options",key:"focus",goals:firstBatch,color:chosenIndustry.color},
        {type:"action-btns",key:"focus",buttons:[
          {id:"show-more",label:"Show more"},
          {id:"none-of-these",label:"None of these"},
        ]},
      ],"focus",700);
    },300);
  };

  /* ── Focus goal picked ── */
  const handleFocus=(goal)=>{
    setChosenFocus(goal.id);
    if(setFocusGoalName)setFocusGoalName(goal.name);
    const defaults=PERSONA_DEFAULTS[chosenPersona]||[];
    setChosenGoals(defaults);
    setSelectedGoals(defaults);
    addUser(goal.name);

    setTimeout(()=>{
      addAI([
        {type:"text",content:`Great choice. I've set **${goal.name}** as your primary focus and pre-loaded your recommended goals. You can adjust anytime.`},
        {type:"action",key:"confirm",label:"Launch workspace",icon:"sparkle",color:chosenIndustry.color},
      ],"done",600);
    },300);
  };

  /* ── Show more goals ── */
  const handleShowMore=()=>{
    addUser("Show me more");
    const defaults=PERSONA_DEFAULTS[chosenPersona]||[];
    const goalObjs=defaults.map(id=>OPERATIONAL_GOALS.find(g=>g.id===id)).filter(Boolean);
    const moreBatch=goalObjs.slice(3);

    if(!moreBatch.length){handleNoneOfThese();return;}

    setTimeout(()=>{
      addAI([
        {type:"text",content:"Here are more options:"},
        {type:"focus-options",key:"focus2",goals:moreBatch,color:chosenIndustry.color},
        {type:"action-btns",key:"focus2",buttons:[
          {id:"none-of-these",label:"None of these"},
        ]},
      ],"focus2",500);
    },300);
  };

  /* ── None of these ── */
  const handleNoneOfThese=()=>{
    addUser("None of these");
    setTimeout(()=>{
      addAI([
        {type:"text",content:"No problem \u2014 what are you most interested in?"},
        {type:"options",key:"interest",options:[
          {id:"digitise-checks",label:"Digitising checks",sub:"Replace paper forms with smart digital checklists",color:T.highlight},
          {id:"train-staff",label:"Training my staff",sub:"Onboard and upskill your team effectively",color:T.violet},
          {id:"manage-assets",label:"Managing my assets",sub:"Track and maintain equipment and resources",color:T.green},
        ]},
      ],"interest",500);
    },300);
  };

  /* ── Interest picked ── */
  const handleInterest=(opt)=>{
    setChosenInterest(opt.id);
    if(setFocusGoalName)setFocusGoalName(opt.label);
    addUser(opt.label);
    const defaults=PERSONA_DEFAULTS[chosenPersona]||[];
    setChosenGoals(defaults);
    setSelectedGoals(defaults);

    setTimeout(()=>{
      addAI([
        {type:"text",content:`Got it \u2014 **${opt.label.toLowerCase()}** is a great starting point. I've set up your workspace with relevant goals and workflows.`},
        {type:"action",key:"confirm",label:"Launch workspace",icon:"sparkle",color:chosenIndustry.color},
      ],"done",600);
    },300);
  };

  /* ── Launch ── */
  const handleLaunch=()=>{
    addUser("Let's go!");
    setTimeout(()=>onComplete(),600);
  };

  /* ── Render a message part ── */
  const renderPart=(part,idx,msg)=>{
    if(part.type==="text"){
      return<div key={idx} style={{fontSize:13.5,lineHeight:1.6,color:T.textSecondary,letterSpacing:"-0.01em"}}>
        {part.content.split(/(\*\*[^*]+\*\*)/g).map((seg,si)=>{
          if(seg.startsWith("**")&&seg.endsWith("**"))return<strong key={si} style={{color:T.text,fontWeight:600}}>{seg.slice(2,-2)}</strong>;
          return seg;
        })}
      </div>;
    }

    if(part.type==="options"){
      const disabled=step!==part.key;
      return<div key={idx} style={{display:"flex",flexDirection:"column",gap:6,marginTop:6}}>
        {part.options.map((opt,oi)=>{
          const wasChosen=(part.key==="industry"&&chosenIndustry?.id===opt.id)||(part.key==="persona"&&chosenPersona===opt.id)||(part.key==="interest"&&chosenInterest===opt.id);
          return<div key={opt.id} onClick={()=>{
            if(disabled)return;
            if(part.key==="industry")handleIndustry(opt);
            if(part.key==="persona")handlePersona(opt);
            if(part.key==="interest")handleInterest(opt);
          }} style={{
            display:"flex",alignItems:"center",gap:12,
            padding:"12px 16px",borderRadius:12,
            background:wasChosen?`${opt.color}08`:T.surface,
            border:`1.5px solid ${wasChosen?opt.color:T.border}`,
            cursor:disabled?"default":"pointer",
            opacity:disabled&&!wasChosen?0.35:1,
            transition:"all 0.25s cubic-bezier(0.4,0,0.2,1)",
            animation:`fadeIn 0.3s ease ${0.05+oi*0.06}s both`,
          }} onMouseEnter={e=>{if(!disabled){e.currentTarget.style.borderColor=opt.color;e.currentTarget.style.transform="translateX(4px)";e.currentTarget.style.boxShadow=`0 2px 12px ${opt.color}14`;}}}
             onMouseLeave={e=>{if(!disabled&&!wasChosen){e.currentTarget.style.borderColor=T.border;e.currentTarget.style.transform="translateX(0)";e.currentTarget.style.boxShadow="none";}}}>
            {wasChosen&&<div style={{width:22,height:22,borderRadius:6,background:opt.color,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{IC.check("#fff",11)}</div>}
            {!wasChosen&&<div style={{width:22,height:22,borderRadius:6,border:`1.5px solid ${T.border}`,flexShrink:0}}/>}
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13.5,fontWeight:500,letterSpacing:"-0.01em",color:wasChosen?T.text:T.textSecondary}}>{opt.label}</div>
              {opt.sub&&<div style={{fontSize:11.5,color:T.textTertiary,marginTop:1,lineHeight:1.4}}>{opt.sub}</div>}
            </div>
          </div>;
        })}
      </div>;
    }

    if(part.type==="focus-options"){
      const disabled=step!==part.key;
      return<div key={idx} style={{display:"flex",flexDirection:"column",gap:6,marginTop:6}}>
        {part.goals.map((goal,gi)=>{
          const wasChosen=chosenFocus===goal.id;
          const color=part.color;
          return<div key={goal.id} onClick={()=>{
            if(disabled)return;
            handleFocus(goal);
          }} style={{
            display:"flex",alignItems:"center",gap:12,
            padding:"11px 16px",borderRadius:12,
            background:wasChosen?`${color}08`:T.surface,
            border:`1.5px solid ${wasChosen?color:T.border}`,
            cursor:disabled?"default":"pointer",
            opacity:disabled&&!wasChosen?0.35:1,
            transition:"all 0.25s cubic-bezier(0.4,0,0.2,1)",
            animation:`fadeIn 0.3s ease ${0.05+gi*0.06}s both`,
          }} onMouseEnter={e=>{if(!disabled){e.currentTarget.style.borderColor=color;e.currentTarget.style.transform="translateX(4px)";e.currentTarget.style.boxShadow=`0 2px 12px ${color}14`;}}}
             onMouseLeave={e=>{if(!disabled&&!wasChosen){e.currentTarget.style.borderColor=T.border;e.currentTarget.style.transform="translateX(0)";e.currentTarget.style.boxShadow="none";}}}>
            {wasChosen&&<div style={{width:22,height:22,borderRadius:6,background:color,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{IC.check("#fff",11)}</div>}
            {!wasChosen&&<div style={{width:22,height:22,borderRadius:6,border:`1.5px solid ${T.border}`,flexShrink:0}}/>}
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:500,letterSpacing:"-0.01em",color:wasChosen?T.text:T.textSecondary}}>{goal.name}</div>
              <div style={{fontSize:10.5,color:T.textTertiary,marginTop:2,fontFamily:T.mono,letterSpacing:"0.02em"}}>{goal.category}</div>
            </div>
          </div>;
        })}
      </div>;
    }

    if(part.type==="action-btns"){
      const disabled=step!==part.key;
      return<div key={idx} style={{display:"flex",gap:8,marginTop:8,flexWrap:"wrap"}}>
        {part.buttons.map((btn,bi)=><div key={btn.id} onClick={()=>{
          if(disabled)return;
          if(btn.id==="show-more")handleShowMore();
          if(btn.id.startsWith("none-of-these"))handleNoneOfThese();
        }} style={{
          display:"inline-flex",alignItems:"center",gap:6,
          padding:"8px 16px",borderRadius:99,
          border:`1.5px solid ${T.border}`,background:T.surface,
          fontSize:12.5,fontWeight:500,color:T.textSecondary,
          cursor:disabled?"default":"pointer",
          opacity:disabled?0.35:1,
          transition:"all 0.2s",
          animation:`fadeIn 0.3s ease ${0.2+bi*0.08}s both`,
          letterSpacing:"-0.01em",
        }} onMouseEnter={e=>{if(!disabled){e.currentTarget.style.borderColor=T.accent;e.currentTarget.style.color=T.accent;e.currentTarget.style.transform="translateY(-1px)";}}}
           onMouseLeave={e=>{if(!disabled){e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.textSecondary;e.currentTarget.style.transform="translateY(0)";}}}>{btn.label}</div>)}
      </div>;
    }

    if(part.type==="action"){
      return<div key={idx} style={{marginTop:8}}>
        <div onClick={handleLaunch} style={{
          display:"inline-flex",alignItems:"center",gap:8,
          padding:"12px 24px",borderRadius:99,
          background:T.accent,color:"#fff",
          fontSize:13.5,fontWeight:600,letterSpacing:"-0.01em",
          cursor:"pointer",transition:"all 0.2s",
          boxShadow:"0 4px 18px rgba(28,25,23,0.15)",
          animation:"fadeIn 0.4s ease 0.2s both",
        }} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 6px 24px rgba(28,25,23,0.2)";}}
           onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 4px 18px rgba(28,25,23,0.15)";}}>
          {IC.sparkle("#fff",14)}
          <span>{part.label}</span>
        </div>
      </div>;
    }

    return null;
  };

  return<>
    <style>{`
      .cob-shell{min-height:100vh;background:${T.bg};font-family:${T.sans};color:${T.text};display:flex;flex-direction:column}
      .cob-header{padding:0 20px;height:56px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid ${T.borderSubtle};background:rgba(255,255,255,0.92);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);position:sticky;top:0;z-index:50;flex-shrink:0}
      .cob-body{flex:1;overflow-y:auto;padding:28px 16px 120px;display:flex;flex-direction:column;align-items:center;-webkit-overflow-scrolling:touch}
      .cob-thread{max-width:580px;width:100%;display:flex;flex-direction:column;gap:16px}
      .cob-ai{display:flex;gap:12px;align-items:flex-start;animation:fadeInUp 0.4s cubic-bezier(0.4,0,0.2,1)}
      .cob-avatar{width:32px;height:32px;border-radius:10px;background:${T.accent};display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 2px 8px rgba(28,25,23,0.1)}
      .cob-ai-body{flex:1;min-width:0;display:flex;flex-direction:column;gap:8px;background:${T.surface};border:1px solid ${T.border};border-radius:4px 16px 16px 16px;padding:16px 18px;box-shadow:${T.shadow}}
      .cob-user{align-self:flex-end;max-width:85%;animation:fadeInUp 0.35s cubic-bezier(0.4,0,0.2,1)}
      .cob-user-bubble{background:${T.accent};border-radius:16px 16px 4px 16px;padding:12px 18px;font-size:13.5px;line-height:1.55;color:#fff;letter-spacing:-0.01em;box-shadow:0 2px 8px rgba(28,25,23,0.12)}
      .cob-typing{display:flex;gap:12px;align-items:flex-start;animation:fadeIn 0.3s ease}
      .cob-typing-dots{display:flex;gap:4px;padding:16px 18px;background:${T.surface};border:1px solid ${T.border};border-radius:4px 16px 16px 16px;box-shadow:${T.shadow}}
      .cob-dot{width:7px;height:7px;border-radius:50%;background:${T.textTertiary};animation:cobDotBounce 1.2s infinite}
      .cob-dot:nth-child(2){animation-delay:0.15s}
      .cob-dot:nth-child(3){animation-delay:0.3s}
      @keyframes cobDotBounce{0%,60%,100%{transform:translateY(0);opacity:0.4}30%{transform:translateY(-5px);opacity:1}}
      @media(min-width:640px){.cob-body{padding:40px 24px 120px}}
    `}</style>

    <div className="cob-shell">
      {/* Header */}
      <div className="cob-header">
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <svg width="26" height="26" viewBox="0 0 100 100" fill="none"><rect width="100" height="100" rx="22" fill={T.accent}/><path d="M15 50c10-20 22-20 32 0s22 20 32 0" stroke="#fff" strokeWidth="8" strokeLinecap="round" fill="none"/></svg>
          <span style={{fontFamily:T.serif,fontSize:16,fontWeight:600,letterSpacing:"-0.02em"}}>Flows Setup</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:T.green,animation:"subtleBreathe 3s infinite"}}/>
          <span style={{fontSize:10.5,fontFamily:T.mono,color:T.textTertiary}}>AI Online</span>
        </div>
      </div>

      {/* Message thread */}
      <div className="cob-body">
        <div className="cob-thread">
          {messages.map(msg=>{
            if(msg.role==="user"){
              return<div key={msg.id} className="cob-user">
                <div className="cob-user-bubble">{msg.text}</div>
              </div>;
            }
            if(msg.role==="company-card"){
              return<div key={msg.id} style={{animation:"fadeInUp 0.4s cubic-bezier(0.4,0,0.2,1)",maxWidth:420,width:"100%",alignSelf:"center"}}>
                <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:16,padding:"10px 14px",boxShadow:"0 2px 12px rgba(28,25,23,0.06), 0 1px 3px rgba(28,25,23,0.04)",overflow:"hidden",position:"relative",display:"flex",alignItems:"center",gap:12}}>
                  <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg, ${T.accent}, ${T.green})`}}/>
                  <img src={msg.logo} alt={msg.company} style={{width:36,height:36,borderRadius:10,objectFit:"cover",border:`1px solid ${T.border}`,flexShrink:0}}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:14,fontWeight:600,letterSpacing:"-0.02em",fontFamily:T.serif}}>{msg.company}</div>
                    <div style={{fontSize:11,color:T.textTertiary,fontFamily:T.mono}}>{msg.website}</div>
                  </div>
                  <div style={{flexShrink:0,fontSize:13,color:T.textSecondary,fontWeight:500}}>Hi, {msg.name}!</div>
                </div>
              </div>;
            }
            return<div key={msg.id} className="cob-ai">
              <div className="cob-avatar">{IC.sparkle("#fff",14)}</div>
              <div className="cob-ai-body">
                {msg.parts.map((part,i)=>renderPart(part,i,msg))}
              </div>
            </div>;
          })}

          {/* Typing indicator */}
          {typing&&<div className="cob-typing">
            <div className="cob-avatar">{IC.sparkle("#fff",14)}</div>
            <div className="cob-typing-dots">
              <div className="cob-dot"/><div className="cob-dot"/><div className="cob-dot"/>
            </div>
          </div>}

          <div ref={endRef}/>
        </div>
      </div>
    </div>
  </>;
}

/* ═══ STARTER SCREEN (Journey Selector) ═══ */
function StarterScreen({onSelectJourney}){
  const chatIcon=(c,s=20)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
  const journeys=[
    {id:"first-setup",title:"First-time Setup",desc:"Walk through the onboarding flow: pick an industry, role, and goals.",icon:IC.sparkle,color:T.highlight,colorSoft:T.highlightSoft,enabled:true},
    {id:"chat-setup",title:"Chat Setup",desc:"Set up your workspace through a conversation with the AI assistant.",icon:chatIcon,color:T.accent,colorSoft:T.accentSoft,enabled:true},
    {id:"first-day",title:"Your First Day",desc:"See what the workspace looks like on day one. (Coming soon)",icon:IC.play,color:T.green,colorSoft:T.greenSoft,enabled:false},
    {id:"100-day",title:"100 Days Later",desc:"See a mature QSR workspace after 100 days of active use.",icon:IC.building,color:T.amber,colorSoft:T.amberSoft,enabled:true},
  ];

  return<div style={{minHeight:"100vh",background:T.bg,fontFamily:T.sans,color:T.text,display:"flex",alignItems:"center",justifyContent:"center",padding:"32px 16px"}}>
    <div style={{maxWidth:760,width:"100%",textAlign:"center"}}>
      {/* Logo */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:40}}>
        <svg width="36" height="36" viewBox="0 0 100 100" fill="none"><rect width="100" height="100" rx="22" fill={T.accent}/><path d="M15 50c10-20 22-20 32 0s22 20 32 0" stroke="#fff" strokeWidth="8" strokeLinecap="round" fill="none"/></svg>
        <span style={{fontFamily:T.serif,fontSize:20,fontWeight:600,letterSpacing:"-0.03em"}}>Flows</span>
      </div>

      {/* Heading */}
      <h1 style={{fontFamily:T.serif,fontSize:"clamp(28px,5vw,40px)",fontWeight:300,letterSpacing:"-0.04em",lineHeight:1.15,marginBottom:10}}>Prototype Navigator</h1>
      <p style={{fontSize:15,color:T.textSecondary,lineHeight:1.6,maxWidth:480,margin:"0 auto 40px"}}>Use these journeys to explore different parts of the prototype. Each path demonstrates a different user experience.</p>

      {/* Journey cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16,textAlign:"left"}}>
        {journeys.map((j,idx)=>{
          const disabled=!j.enabled;
          return<div key={j.id} onClick={()=>{if(j.enabled)onSelectJourney(j.id);}} style={{
            background:T.surface,border:`1.5px solid ${disabled?T.borderSubtle:T.border}`,borderRadius:18,
            padding:"28px 24px",cursor:disabled?"default":"pointer",
            transition:"all 0.25s",position:"relative",overflow:"hidden",
            opacity:disabled?0.55:1,
            boxShadow:disabled?"none":"0 1px 3px rgba(0,0,0,0.04)",
            animation:`fadeIn 0.5s ease ${0.1+idx*0.1}s both`,
          }} onMouseEnter={e=>{if(!disabled){e.currentTarget.style.boxShadow="0 8px 28px rgba(0,0,0,0.07)";e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.borderColor=j.color;}}} onMouseLeave={e=>{if(!disabled){e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,0.04)";e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.borderColor=T.border;}}}>
            {disabled&&<div style={{position:"absolute",top:14,right:14,padding:"3px 9px",borderRadius:99,fontSize:9.5,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.04em",fontFamily:T.mono,background:T.surfaceMuted,color:T.textTertiary}}>Coming soon</div>}
            <div style={{width:48,height:48,borderRadius:14,background:j.colorSoft,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:18,transition:"all 0.25s"}}>
              {j.icon(j.color,20)}
            </div>
            <div style={{fontFamily:T.serif,fontSize:18,fontWeight:500,letterSpacing:"-0.02em",marginBottom:6,lineHeight:1.25}}>{j.title}</div>
            <div style={{fontSize:13,color:T.textSecondary,lineHeight:1.6,marginBottom:18}}>{j.desc}</div>
            {j.enabled&&<div style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:12.5,fontWeight:600,color:j.color}}>
              <span>Get started</span>
              {IC.chevRight(j.color,14)}
            </div>}
          </div>;
        })}
      </div>
    </div>
  </div>;
}

/* ═══ GOALS PAGE ═══ */

function GoalsPage({industry,persona,selectedGoals,setSelectedGoals,customGoals,setCustomGoals,onNavigate}){
  const ind=INDUSTRIES.find(i=>i.id===industry)||INDUSTRIES[0];
  const allGoals=getGoalsByIndustry(industry);

  /* ── Merge system goals (from onboarding) + custom goals ── */
  const systemGoalObjs=useMemo(()=>
    allGoals.filter(g=>selectedGoals.includes(g.id)).map(g=>({
      ...g,
      isCustom:false,
      target:"",
      priority:"Medium",
      owner:"",
      deadline:"",
      status:"Not Started",
    }))
  ,[allGoals,selectedGoals]);

  const allDisplayGoals=useMemo(()=>[
    ...systemGoalObjs,
    ...(customGoals||[]).map(g=>({...g,isCustom:true})),
  ],[systemGoalObjs,customGoals]);

  /* ── Per-goal editable overrides for system goals ── */
  const[systemOverrides,setSystemOverrides]=useState({});
  const getOverride=(goalId,field)=>(systemOverrides[goalId]||{})[field];
  const setOverride=(goalId,field,value)=>setSystemOverrides(prev=>({
    ...prev,
    [goalId]:{...(prev[goalId]||{}),[ field]:value},
  }));

  /* ── Category filter ── */
  const[activeCategory,setActiveCategory]=useState("All");

  const categories=useMemo(()=>{
    const cats=new Set();
    allDisplayGoals.forEach(g=>cats.add(g.category));
    return["All",...Array.from(cats).sort()];
  },[allDisplayGoals]);

  const categoryCounts=useMemo(()=>{
    const counts={All:allDisplayGoals.length};
    allDisplayGoals.forEach(g=>{counts[g.category]=(counts[g.category]||0)+1;});
    return counts;
  },[allDisplayGoals]);

  const filteredGoals=useMemo(()=>
    activeCategory==="All"
      ? allDisplayGoals
      : allDisplayGoals.filter(g=>g.category===activeCategory)
  ,[allDisplayGoals,activeCategory]);

  /* ── Expand/collapse ── */
  const[expandedId,setExpandedId]=useState(null);
  const toggleExpand=(id)=>setExpandedId(prev=>prev===id?null:id);

  /* ── Derive workflow and connector associations ── */
  const workflowTemplates=useMemo(()=>WORKFLOW_TEMPLATES[industry]||[],[industry]);

  const getWorkflowsForGoal=useCallback((goalId)=>{
    return workflowTemplates.filter(w=>w.goalIds.includes(goalId));
  },[workflowTemplates]);

  const getConnectorsForGoal=useCallback((goalId)=>{
    return CONNECTOR_MAP[goalId]||[];
  },[]);

  /* ── Summary stats ── */
  const customCount=(customGoals||[]).length;
  const totalGoals=allDisplayGoals.length;
  const categoryCount=new Set(allDisplayGoals.map(g=>g.category)).size;

  /* ── Category → color mapping ── */
  const getCategoryColor=(cat)=>{
    if(!cat) return T.accent;
    const lower=cat.toLowerCase();
    if(lower.includes("quality")) return T.violet;
    if(lower.includes("safety")) return T.rose;
    if(lower.includes("maintenance")||lower.includes("reliability")||lower.includes("fleet")) return T.amber;
    if(lower.includes("supply")||lower.includes("inventory")||lower.includes("warehouse")) return T.green;
    if(lower.includes("compliance")||lower.includes("delivery")||lower.includes("visibility")) return T.highlight;
    if(lower==="custom") return T.pink;
    if(lower.includes("cost")||lower.includes("revenue")||lower.includes("profitability")) return T.amber;
    if(lower.includes("workforce")||lower.includes("labor")) return T.violet;
    if(lower.includes("speed")||lower.includes("experience")) return T.highlight;
    if(lower.includes("drive")||lower.includes("digital")) return T.rose;
    if(lower.includes("production")||lower.includes("throughput")) return T.green;
    if(lower.includes("route")||lower.includes("optimization")) return T.violet;
    if(lower.includes("multi-unit")||lower.includes("franchise")) return T.amber;
    return T.accent;
  };

  const getCategorySoft=(cat)=>{
    const c=getCategoryColor(cat);
    if(c===T.violet) return T.violetSoft;
    if(c===T.rose) return T.roseSoft;
    if(c===T.amber) return T.amberSoft;
    if(c===T.green) return T.greenSoft;
    if(c===T.highlight) return T.highlightSoft;
    if(c===T.pink) return T.pinkSoft;
    return T.accentSoft;
  };

  const getCategoryBorder=(cat)=>{
    const c=getCategoryColor(cat);
    if(c===T.violet) return T.violetBorder;
    if(c===T.rose) return T.roseBorder;
    if(c===T.amber) return T.amberBorder;
    if(c===T.green) return T.greenBorder;
    if(c===T.highlight) return T.highlightBorder;
    if(c===T.pink) return T.pinkBorder;
    return T.accentBorder;
  };

  /* ── Priority badge colors ── */
  const priorityColor=(p)=>({High:T.rose,Medium:T.amber,Low:T.green}[p]||T.textTertiary);
  const prioritySoft=(p)=>({High:T.roseSoft,Medium:T.amberSoft,Low:T.greenSoft}[p]||T.surfaceMuted);

  /* ── Status badge colors ── */
  const statusColor=(s)=>({
    "Not Started":T.textTertiary,
    "In Progress":T.highlight,
    "On Track":T.green,
    "At Risk":T.rose,
  }[s]||T.textTertiary);
  const statusSoft=(s)=>({
    "Not Started":T.surfaceMuted,
    "In Progress":T.highlightSoft,
    "On Track":T.greenSoft,
    "At Risk":T.roseSoft,
  }[s]||T.surfaceMuted);

  /* ── Add custom goal ── */
  const addCustomGoal=useCallback(()=>{
    const nextId=`custom-${Date.now()}`;
    const newGoal={
      id:nextId,
      name:"New Custom Goal",
      description:"Describe the objective for this goal.",
      category:"Custom",
      target:"",
      priority:"Medium",
      owner:"",
      deadline:"",
      status:"Not Started",
      workflowIds:[],
      connectorIds:[],
    };
    setCustomGoals(prev=>[...prev,newGoal]);
    setExpandedId(nextId);
    setActiveCategory("All");
  },[setCustomGoals]);

  /* ── Update custom goal field ── */
  const updateCustomGoal=useCallback((goalId,field,value)=>{
    setCustomGoals(prev=>prev.map(g=>g.id===goalId?{...g,[field]:value}:g));
  },[setCustomGoals]);

  /* ── Remove custom goal ── */
  const removeCustomGoal=useCallback((goalId)=>{
    setCustomGoals(prev=>prev.filter(g=>g.id!==goalId));
    if(expandedId===goalId) setExpandedId(null);
  },[setCustomGoals,expandedId]);

  /* ── Available categories for custom goal dropdown ── */
  const availableCategories=useMemo(()=>{
    const cats=GOAL_CATEGORIES[industry]||[];
    return[...cats,"Custom"];
  },[industry]);

  /* ── Statuses ── */
  const STATUSES=["Not Started","In Progress","On Track","At Risk"];
  const PRIORITIES=["High","Medium","Low"];

  /* ── Empty state ── */
  if(!industry||selectedGoals.length===0&&(!customGoals||customGoals.length===0)){
    return<div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:40}}>
      <div style={{textAlign:"center",maxWidth:400}}>
        <div style={{width:64,height:64,borderRadius:16,background:T.surfaceMuted,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}>{IC.target(T.textTertiary,28)}</div>
        <h2 style={{fontFamily:T.serif,fontSize:22,fontWeight:400,letterSpacing:"-0.03em",marginBottom:8}}>No goals configured yet</h2>
        <p style={{fontSize:13,color:T.textSecondary,lineHeight:1.6,marginBottom:24}}>Complete the onboarding flow to set your industry, role, and operational goals. You can also add custom goals from this page once your workspace is configured.</p>
        <div onClick={()=>onNavigate("home")} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"10px 20px",borderRadius:99,background:T.accent,color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer"}}>
          {IC.home("#fff",14)}
          <span>Go to Home</span>
        </div>
      </div>
    </div>;
  }

  /* ── Shared inline input style ── */
  const inputStyle={
    width:"100%",padding:"8px 12px",borderRadius:T.rSm,border:`1px solid ${T.border}`,
    fontFamily:T.sans,fontSize:13,color:T.text,outline:"none",background:T.surfaceHover,
    transition:"border-color 0.2s",
  };
  const selectStyle={
    ...inputStyle,appearance:"none",backgroundImage:`url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23A8A29E' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
    backgroundRepeat:"no-repeat",backgroundPosition:"right 12px center",paddingRight:32,cursor:"pointer",
  };
  const labelStyle={
    fontSize:10,fontWeight:600,color:T.textSecondary,display:"block",marginBottom:5,
    textTransform:"uppercase",letterSpacing:"0.04em",fontFamily:T.mono,
  };

  /* ── Render ── */
  return<div style={{flex:1,overflowY:"auto"}}>
    <style>{`
      .gp-card{background:${T.surface};border:1px solid ${T.border};border-radius:${T.r}px;margin-bottom:10px;overflow:hidden;transition:box-shadow 0.3s cubic-bezier(0.4,0,0.2,1),border-color 0.3s;box-shadow:${T.shadow}}
      .gp-card:hover{box-shadow:${T.shadowMd};border-color:${T.accentBorder}}
      .gp-card-hd{display:flex;align-items:flex-start;gap:12px;padding:16px 20px;cursor:pointer;transition:background 0.15s}
      .gp-card-hd:hover{background:${T.surfaceHover}}
      .gp-expand{overflow:hidden;transition:max-height 0.35s cubic-bezier(0.4,0,0.2,1),opacity 0.25s ease;max-height:0;opacity:0}
      .gp-expand.open{max-height:1200px;opacity:1}
      .gp-field-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
      @media(max-width:600px){.gp-field-row{grid-template-columns:1fr}}
      .gp-tab{padding:7px 16px;border-radius:99px;font-size:11.5px;font-family:${T.sans};cursor:pointer;border:1px solid transparent;background:transparent;color:${T.textSecondary};transition:all 0.2s cubic-bezier(0.4,0,0.2,1);white-space:nowrap;font-weight:500}
      .gp-tab:hover{background:${T.surfaceHover};color:${T.text};transform:translateY(-1px)}
      .gp-tab.active{background:${T.accent};color:#fff;border-color:${T.accent};font-weight:600;box-shadow:0 2px 6px rgba(28,25,23,0.12)}
      .gp-add-card{border:2px dashed ${T.border};border-radius:${T.r}px;padding:20px;display:flex;align-items:center;justify-content:center;gap:10px;cursor:pointer;color:${T.textSecondary};font-size:13px;font-weight:500;transition:all 0.25s cubic-bezier(0.4,0,0.2,1);background:transparent}
      .gp-add-card:hover{border-color:${T.accent};color:${T.accent};background:${T.accentSoft};transform:translateY(-1px)}
      .gp-assoc-item{display:flex;align-items:center;gap:8px;padding:6px 10px;border-radius:${T.rSm}px;background:${T.surfaceMuted};font-size:11.5px;color:${T.textSecondary}}
    `}</style>

    <div style={{maxWidth:920,margin:"0 auto",padding:"28px 24px 60px"}}>

      {/* ── Page Header ── */}
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:16,marginBottom:20,flexWrap:"wrap"}}>
        <div style={{flex:1,minWidth:240}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
            <div style={{width:38,height:38,borderRadius:10,background:ind.colorSoft,display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.target(ind.color,18)}</div>
            <h1 style={{fontFamily:T.serif,fontSize:"clamp(22px,3vw,28px)",fontWeight:400,letterSpacing:"-0.03em",lineHeight:1.2}}>Goals</h1>
          </div>
          <p style={{fontSize:13,color:T.textSecondary,lineHeight:1.6,maxWidth:520}}>Track and manage your operational goals. System goals come from your onboarding setup; add custom goals for anything else you need to measure.</p>
        </div>
        <div onClick={addCustomGoal} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"10px 20px",borderRadius:99,background:T.accent,color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",flexShrink:0,whiteSpace:"nowrap",transition:"opacity 0.15s"}} onMouseEnter={e=>e.currentTarget.style.opacity="0.9"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
          {IC.plus("#fff",14)}
          <span>Add Goal</span>
        </div>
      </div>

      {/* ── Summary Stats ── */}
      <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:20,flexWrap:"wrap"}}>
        {[
          {label:`${totalGoals} goal${totalGoals!==1?"s":""} selected`,color:T.accent},
          {label:`${categoryCount} categor${categoryCount!==1?"ies":"y"}`,color:T.highlight},
          {label:`${customCount} custom`,color:T.pink},
        ].map((s,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:6}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:s.color}}/>
          <span style={{fontSize:11.5,color:T.textSecondary,fontFamily:T.mono}}>{s.label}</span>
        </div>)}
      </div>

      {/* ── Category Filter Tabs ── */}
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:20,paddingBottom:16,borderBottom:`1px solid ${T.borderSubtle}`}}>
        {categories.map(cat=>{
          const isActive=activeCategory===cat;
          const count=categoryCounts[cat]||0;
          return<div key={cat} className={`gp-tab${isActive?" active":""}`} onClick={()=>setActiveCategory(cat)}>
            {cat}{count>0&&<span style={{marginLeft:4,fontSize:10,opacity:0.75}}>({count})</span>}
          </div>;
        })}
      </div>

      {/* ── Goal Cards ── */}
      {filteredGoals.map(goal=>{
        const isExpanded=expandedId===goal.id;
        const isCustom=goal.isCustom;
        const gId=goal.id;

        /* Resolve editable fields: custom goals use their own fields, system goals use overrides */
        const target=isCustom?goal.target:(getOverride(gId,"target")||"");
        const priority=isCustom?goal.priority:(getOverride(gId,"priority")||"Medium");
        const owner=isCustom?goal.owner:(getOverride(gId,"owner")||"");
        const status=isCustom?goal.status:(getOverride(gId,"status")||"Not Started");

        const catColor=getCategoryColor(goal.category);
        const catSoft=getCategorySoft(goal.category);
        const workflows=getWorkflowsForGoal(gId);
        const connectors=getConnectorsForGoal(gId);

        return<div key={gId} className="gp-card">
          {/* ── Card Header ── */}
          <div className="gp-card-hd" onClick={()=>toggleExpand(gId)}>
            {/* Category dot */}
            <div style={{width:10,height:10,borderRadius:"50%",background:catColor,flexShrink:0,marginTop:5}}/>

            {/* Main content */}
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontFamily:T.serif,fontSize:15,fontWeight:500,letterSpacing:"-0.02em",lineHeight:1.35,marginBottom:3}}>{goal.name}</div>
              <div style={{fontSize:12,color:T.textSecondary,lineHeight:1.5,marginBottom:8}}>{goal.description}</div>

              {/* Metadata chips */}
              <div style={{display:"flex",flexWrap:"wrap",gap:5,alignItems:"center"}}>
                {/* Category */}
                <span className="chip" style={{background:catSoft,color:catColor,fontSize:9.5}}>{goal.category}</span>

                {/* Workflow count */}
                {workflows.length>0&&<span className="chip" style={{background:T.greenSoft,color:T.green,fontSize:9.5}}>
                  {IC.workflow(T.green,10)}{workflows.length} workflow{workflows.length!==1?"s":""}
                </span>}

                {/* Connector count */}
                {connectors.length>0&&<span className="chip" style={{background:T.roseSoft,color:T.rose,fontSize:9.5}}>
                  {IC.connector(T.rose,10)}{connectors.length} connector{connectors.length!==1?"s":""}
                </span>}

                {/* Target (if set) */}
                {target&&<span className="chip" style={{background:T.surfaceMuted,color:T.text,fontSize:9.5,fontFamily:T.mono}}>
                  {IC.target(T.textTertiary,9)}{target}
                </span>}

                {/* Priority */}
                <span className="chip" style={{background:prioritySoft(priority),color:priorityColor(priority),fontSize:9.5,fontWeight:600}}>{priority}</span>

                {/* Status */}
                <span className="chip" style={{background:statusSoft(status),color:statusColor(status),fontSize:9.5}}>{status}</span>

                {/* Custom badge */}
                {isCustom&&<span className="chip" style={{background:T.pinkSoft,color:T.pink,fontSize:9,fontWeight:600}}>Custom</span>}
              </div>
            </div>

            {/* Expand chevron */}
            <div style={{width:24,height:24,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"transform 0.25s",transform:isExpanded?"rotate(90deg)":"rotate(0)",marginTop:2}}>
              {IC.chevRight(T.textTertiary,14)}
            </div>
          </div>

          {/* ── Expanded Detail ── */}
          <div className={`gp-expand${isExpanded?" open":""}`}>
            <div style={{padding:"0 20px 20px",borderTop:`1px solid ${T.borderSubtle}`,paddingTop:16,animation:isExpanded?"fadeIn 0.25s ease":"none"}}>

              {/* Editable name/description for custom goals */}
              {isCustom&&<div style={{marginBottom:16}}>
                <div className="gp-field-row">
                  <div>
                    <label style={labelStyle}>Goal Name</label>
                    <input value={goal.name} onChange={e=>updateCustomGoal(gId,"name",e.target.value)} style={inputStyle} onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.border}/>
                  </div>
                  <div>
                    <label style={labelStyle}>Category</label>
                    <select value={goal.category} onChange={e=>updateCustomGoal(gId,"category",e.target.value)} style={selectStyle} onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.border}>
                      {availableCategories.map(c=><option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{marginTop:10}}>
                  <label style={labelStyle}>Description</label>
                  <textarea value={goal.description} onChange={e=>updateCustomGoal(gId,"description",e.target.value)} rows={2} style={{...inputStyle,resize:"vertical",lineHeight:1.5}} onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.border}/>
                </div>
              </div>}

              {/* Target + Priority row */}
              <div className="gp-field-row" style={{marginBottom:12}}>
                <div>
                  <label style={labelStyle}>Target Metric</label>
                  {isCustom
                    ?<input value={target} onChange={e=>updateCustomGoal(gId,"target",e.target.value)} placeholder="e.g. OEE > 85%" style={{...inputStyle,fontFamily:T.mono,fontSize:12}} onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.border}/>
                    :<input value={target} onChange={e=>setOverride(gId,"target",e.target.value)} placeholder="e.g. OEE > 85%" style={{...inputStyle,fontFamily:T.mono,fontSize:12}} onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.border}/>
                  }
                </div>
                <div>
                  <label style={labelStyle}>Priority</label>
                  <div style={{display:"flex",gap:6}}>
                    {PRIORITIES.map(p=>{
                      const isActive=(isCustom?goal.priority:priority)===p;
                      return<div key={p} onClick={()=>isCustom?updateCustomGoal(gId,"priority",p):setOverride(gId,"priority",p)} style={{
                        flex:1,padding:"8px 0",borderRadius:T.rSm,textAlign:"center",fontSize:12,fontWeight:isActive?600:400,
                        background:isActive?prioritySoft(p):"transparent",color:isActive?priorityColor(p):T.textTertiary,
                        border:`1px solid ${isActive?priorityColor(p)+"30":T.border}`,cursor:"pointer",transition:"all 0.15s",
                      }}>{p}</div>;
                    })}
                  </div>
                </div>
              </div>

              {/* Owner + Status row */}
              <div className="gp-field-row" style={{marginBottom:16}}>
                <div>
                  <label style={labelStyle}>Owner</label>
                  {isCustom
                    ?<input value={owner} onChange={e=>updateCustomGoal(gId,"owner",e.target.value)} placeholder="Person or team" style={inputStyle} onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.border}/>
                    :<input value={owner} onChange={e=>setOverride(gId,"owner",e.target.value)} placeholder="Person or team" style={inputStyle} onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.border}/>
                  }
                </div>
                <div>
                  <label style={labelStyle}>Status</label>
                  <select value={isCustom?goal.status:status} onChange={e=>isCustom?updateCustomGoal(gId,"status",e.target.value):setOverride(gId,"status",e.target.value)} style={selectStyle} onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.border}>
                    {STATUSES.map(s=><option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Metrics (system goals only — from the OPERATIONAL_GOALS data) */}
              {!isCustom&&goal.metrics&&goal.metrics.length>0&&<div style={{marginBottom:16}}>
                <label style={labelStyle}>Key Metrics</label>
                <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                  {(Array.isArray(goal.metrics)?goal.metrics:[]).map((m,i)=><span key={i} className="chip" style={{background:T.surfaceMuted,color:T.text,fontSize:10,fontFamily:T.mono}}>
                    {typeof m==="string"?m:m.name}
                  </span>)}
                </div>
              </div>}

              {/* Associated Workflows */}
              {workflows.length>0&&<div style={{marginBottom:16}}>
                <label style={labelStyle}>{IC.workflow(T.textTertiary,10)} Associated Workflows</label>
                <div style={{display:"flex",flexDirection:"column",gap:4,marginTop:4}}>
                  {workflows.map(w=><div key={w.id} className="gp-assoc-item">
                    {IC.workflow(T.green,12)}
                    <span style={{flex:1,fontWeight:500,color:T.text}}>{w.name}</span>
                    <span style={{fontSize:10,color:T.textTertiary,fontFamily:T.mono}}>{w.steps} steps</span>
                  </div>)}
                </div>
              </div>}

              {/* Associated Connectors */}
              {connectors.length>0&&<div style={{marginBottom:16}}>
                <label style={labelStyle}>{IC.connector(T.textTertiary,10)} Associated Connectors</label>
                <div style={{display:"flex",flexDirection:"column",gap:4,marginTop:4}}>
                  {connectors.map(c=><div key={c.id} className="gp-assoc-item">
                    {IC.connector(T.rose,12)}
                    <span style={{flex:1,fontWeight:500,color:T.text}}>{c.name}</span>
                    <span style={{fontSize:10,color:T.textTertiary}}>{c.desc}</span>
                  </div>)}
                </div>
              </div>}

              {/* Personas (system goals only) */}
              {!isCustom&&goal.personas&&goal.personas.length>0&&<div style={{marginBottom:isCustom?16:4}}>
                <label style={labelStyle}>{IC.people(T.textTertiary,10)} Relevant Personas</label>
                <div style={{display:"flex",flexWrap:"wrap",gap:5,marginTop:4}}>
                  {goal.personas.map((p,i)=><span key={i} className="chip" style={{background:T.violetSoft,color:T.violet,fontSize:9.5}}>{p}</span>)}
                </div>
              </div>}

              {/* Remove button for custom goals */}
              {isCustom&&<div style={{paddingTop:12,borderTop:`1px solid ${T.borderSubtle}`,display:"flex",justifyContent:"flex-end"}}>
                <div onClick={(e)=>{e.stopPropagation();removeCustomGoal(gId);}} style={{display:"inline-flex",alignItems:"center",gap:5,padding:"7px 16px",borderRadius:99,background:T.roseSoft,color:T.rose,fontSize:12,fontWeight:600,cursor:"pointer",border:`1px solid ${T.roseBorder}`,transition:"all 0.15s"}} onMouseEnter={e=>{e.currentTarget.style.background=T.rose;e.currentTarget.style.color="#fff";}} onMouseLeave={e=>{e.currentTarget.style.background=T.roseSoft;e.currentTarget.style.color=T.rose;}}>
                  {IC.x(undefined,12)}
                  <span>Remove Goal</span>
                </div>
              </div>}
            </div>
          </div>
        </div>;
      })}

      {/* ── Empty filter state ── */}
      {filteredGoals.length===0&&<div style={{textAlign:"center",padding:"40px 20px"}}>
        <div style={{fontSize:13,color:T.textTertiary,marginBottom:12}}>No goals in this category.</div>
        <div onClick={()=>setActiveCategory("All")} style={{display:"inline-flex",alignItems:"center",gap:5,padding:"7px 16px",borderRadius:99,background:T.surfaceMuted,border:`1px solid ${T.border}`,fontSize:12,color:T.textSecondary,cursor:"pointer"}}>Show all goals</div>
      </div>}

      {/* ── Add Custom Goal Card ── */}
      <div className="gp-add-card" onClick={addCustomGoal} style={{marginTop:filteredGoals.length>0?6:0}}>
        <div style={{width:32,height:32,borderRadius:8,background:T.surfaceMuted,display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.plus(T.textTertiary,16)}</div>
        <span>Add Custom Goal</span>
      </div>

      {/* ── AI Help Card ── */}
      <div style={{padding:"16px 20px",borderRadius:T.r,background:T.surface,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:14,marginTop:16}}>
        <div style={{width:38,height:38,borderRadius:10,background:T.accent,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{IC.sparkle("#fff",16)}</div>
        <div style={{flex:1}}>
          <div style={{fontSize:13.5,fontWeight:500,letterSpacing:"-0.01em",marginBottom:2}}>Need help defining goals?</div>
          <div style={{fontSize:12,color:T.textSecondary,lineHeight:1.5}}>AI can suggest industry-specific goals, recommend targets based on benchmarks, and link goals to your existing workflows and connectors.</div>
        </div>
        <div style={{padding:"8px 16px",borderRadius:99,background:T.accent,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:5,flexShrink:0,whiteSpace:"nowrap"}}>{IC.sparkle("#fff",12)} Ask AI</div>
      </div>
    </div>
  </div>;
}

/* ═══ SCORE PAGE (Dashboard + Predictions + Benchmarking) ═══ */

/* ── Score sites (reuses SITES from people.jsx but adds score-specific data) ── */
const SCORE_SITES=[
  {id:"all",name:"All Sites",type:"Aggregate",color:T.accent},
  {id:"plant-a",name:"Plant Alpha",type:"Manufacturing",color:"#8B5CF6"},
  {id:"plant-b",name:"Plant Beta",type:"Manufacturing",color:"#F59E0B"},
  {id:"hq",name:"HQ — Portland",type:"Office",color:"#3B82F6"},
  {id:"warehouse",name:"Distribution Center",type:"Warehouse",color:"#10B981"},
];

/* ── Per-site score modifiers (multiplied against base goal scores) ── */
const SITE_SCORE_MODIFIERS={
  "all":{multiplier:1.0,trendOffset:0},
  "plant-a":{multiplier:1.08,trendOffset:0.1},
  "plant-b":{multiplier:0.88,trendOffset:-0.1},
  "hq":{multiplier:1.15,trendOffset:0.2},
  "warehouse":{multiplier:0.95,trendOffset:0.0},
};

const SITE_SIGNAL_MODIFIERS={
  "all":{inspections:0,actions:0,training:0,incidents:0,assets:0,observations:0},
  "plant-a":{inspections:6,actions:4,training:8,incidents:-3,assets:5,observations:3},
  "plant-b":{inspections:-8,actions:-6,training:-4,incidents:5,assets:-7,observations:-5},
  "hq":{inspections:10,actions:12,training:14,incidents:-8,assets:8,observations:10},
  "warehouse":{inspections:-3,actions:-2,training:2,incidents:3,assets:-4,observations:-1},
};

function getSiteScore(baseScore,siteId){
  const mod=SITE_SCORE_MODIFIERS[siteId]||SITE_SCORE_MODIFIERS["all"];
  return Math.min(5.0,Math.max(0,Math.round(baseScore*mod.multiplier*10)/10));
}
function getSiteTrend(baseTrend,siteId){
  const mod=SITE_SCORE_MODIFIERS[siteId]||SITE_SCORE_MODIFIERS["all"];
  return Math.round((baseTrend+mod.trendOffset)*10)/10;
}
function getSiteSignals(baseSignals,siteId){
  const mod=SITE_SIGNAL_MODIFIERS[siteId]||SITE_SIGNAL_MODIFIERS["all"];
  const result={};
  Object.keys(baseSignals).forEach(k=>{result[k]=Math.min(100,Math.max(0,baseSignals[k]+(mod[k]||0)));});
  return result;
}

/* ── Mock prediction data (per site) ── */
const MOCK_PREDICTIONS={
  "all":[
    {id:"pred-1",goal:"Unplanned Downtime",current:2.5,predicted:3.1,confidence:78,timeframe:"90 days",direction:"up",insight:"Preventive maintenance completion trending upward — expect score improvement if sustained"},
    {id:"pred-2",goal:"Defect Rate",current:4.1,predicted:4.3,confidence:85,timeframe:"60 days",direction:"up",insight:"First-pass yield improving steadily across all lines"},
    {id:"pred-3",goal:"Employee Turnover",current:2.6,predicted:2.2,confidence:62,timeframe:"90 days",direction:"down",insight:"Training completion declining — risk of increased attrition if not addressed"},
    {id:"pred-4",goal:"OEE",current:3.8,predicted:3.5,confidence:71,timeframe:"60 days",direction:"down",insight:"Changeover times increasing on Line 3 — will drag overall OEE if not corrected"},
    {id:"pred-5",goal:"Regulatory Compliance",current:4.3,predicted:4.4,confidence:91,timeframe:"30 days",direction:"up",insight:"All audit actions on track for completion before next regulatory review"},
    {id:"pred-6",goal:"Injury Rate",current:3.9,predicted:4.1,confidence:74,timeframe:"60 days",direction:"up",insight:"Near-miss reporting up 40% — leading indicator of improved safety culture"},
    {id:"pred-7",goal:"Supplier Quality",current:3.0,predicted:2.7,confidence:66,timeframe:"90 days",direction:"down",insight:"Two key suppliers flagged for non-conformance — incoming quality at risk"},
    {id:"pred-8",goal:"Training Compliance",current:3.5,predicted:3.8,confidence:80,timeframe:"60 days",direction:"up",insight:"New onboarding programme showing faster time-to-competency"},
  ],
  "plant-a":[
    {id:"pa-1",goal:"OEE",current:4.1,predicted:4.4,confidence:82,timeframe:"60 days",direction:"up",insight:"Line 1 throughput up 12% after changeover optimisation"},
    {id:"pa-2",goal:"Defect Rate",current:4.4,predicted:4.6,confidence:88,timeframe:"60 days",direction:"up",insight:"SPC implementation reducing variation on critical dimensions"},
    {id:"pa-3",goal:"Unplanned Downtime",current:2.7,predicted:3.2,confidence:72,timeframe:"90 days",direction:"up",insight:"New PM schedule on critical assets showing early improvements"},
    {id:"pa-4",goal:"Injury Rate",current:4.2,predicted:4.0,confidence:65,timeframe:"90 days",direction:"down",insight:"Contractor safety incidents trending up in maintenance window"},
  ],
  "plant-b":[
    {id:"pb-1",goal:"OEE",current:3.3,predicted:2.9,confidence:74,timeframe:"60 days",direction:"down",insight:"Equipment age on Line 2 causing unplanned stops — capital request pending"},
    {id:"pb-2",goal:"Defect Rate",current:3.6,predicted:3.8,confidence:70,timeframe:"90 days",direction:"up",insight:"New quality gate added at station 4 catching defects earlier"},
    {id:"pb-3",goal:"Employee Turnover",current:2.3,predicted:1.9,confidence:68,timeframe:"90 days",direction:"down",insight:"Night shift retention declining — compensation review needed"},
    {id:"pb-4",goal:"Safety Compliance",current:2.8,predicted:3.1,confidence:76,timeframe:"60 days",direction:"up",insight:"Safety stand-down and retraining programme underway"},
  ],
  "hq":[
    {id:"hq-1",goal:"Regulatory Compliance",current:4.6,predicted:4.7,confidence:92,timeframe:"30 days",direction:"up",insight:"All documentation up to date for upcoming ISO audit"},
    {id:"hq-2",goal:"Training Compliance",current:4.2,predicted:4.4,confidence:86,timeframe:"60 days",direction:"up",insight:"Leadership training programme achieving 95% completion rate"},
    {id:"hq-3",goal:"Supplier Quality",current:3.4,predicted:3.1,confidence:70,timeframe:"90 days",direction:"down",insight:"Procurement flagged two vendors for quality escapes last quarter"},
  ],
  "warehouse":[
    {id:"wh-1",goal:"Inventory Accuracy",current:3.2,predicted:3.6,confidence:78,timeframe:"60 days",direction:"up",insight:"Cycle count programme and barcode scanning reducing discrepancies"},
    {id:"wh-2",goal:"OTIF Delivery",current:3.5,predicted:3.3,confidence:64,timeframe:"90 days",direction:"down",insight:"Carrier delays increasing — need to diversify shipping partners"},
    {id:"wh-3",goal:"Safety Compliance",current:3.0,predicted:3.3,confidence:72,timeframe:"60 days",direction:"up",insight:"Forklift safety programme and dock loading procedures improving"},
    {id:"wh-4",goal:"Asset Utilisation",current:2.8,predicted:3.0,confidence:68,timeframe:"90 days",direction:"up",insight:"Racking optimisation project freeing up 15% more storage capacity"},
  ],
};

/* ── Mock benchmark data (per site) ── */
const SITE_BENCHMARKS={
  "all":[
    {id:"bench-safety",name:"Safety & Compliance",yourScore:4.1,industryAvg:3.4,topQuartile:4.5,percentile:78},
    {id:"bench-quality",name:"Quality Management",yourScore:3.8,industryAvg:3.2,topQuartile:4.3,percentile:72},
    {id:"bench-maintenance",name:"Maintenance & Reliability",yourScore:2.7,industryAvg:3.0,topQuartile:4.0,percentile:38},
    {id:"bench-operations",name:"Production Operations",yourScore:3.5,industryAvg:3.3,topQuartile:4.2,percentile:62},
    {id:"bench-people",name:"People & Training",yourScore:3.1,industryAvg:2.9,topQuartile:3.8,percentile:58},
    {id:"bench-supply",name:"Supply Chain",yourScore:3.2,industryAvg:3.1,topQuartile:4.1,percentile:55},
  ],
  "plant-a":[
    {id:"bench-safety",name:"Safety & Compliance",yourScore:4.4,industryAvg:3.4,topQuartile:4.5,percentile:86},
    {id:"bench-quality",name:"Quality Management",yourScore:4.2,industryAvg:3.2,topQuartile:4.3,percentile:82},
    {id:"bench-maintenance",name:"Maintenance & Reliability",yourScore:3.1,industryAvg:3.0,topQuartile:4.0,percentile:52},
    {id:"bench-operations",name:"Production Operations",yourScore:4.0,industryAvg:3.3,topQuartile:4.2,percentile:78},
    {id:"bench-people",name:"People & Training",yourScore:3.4,industryAvg:2.9,topQuartile:3.8,percentile:68},
    {id:"bench-supply",name:"Supply Chain",yourScore:3.5,industryAvg:3.1,topQuartile:4.1,percentile:65},
  ],
  "plant-b":[
    {id:"bench-safety",name:"Safety & Compliance",yourScore:3.2,industryAvg:3.4,topQuartile:4.5,percentile:42},
    {id:"bench-quality",name:"Quality Management",yourScore:3.4,industryAvg:3.2,topQuartile:4.3,percentile:56},
    {id:"bench-maintenance",name:"Maintenance & Reliability",yourScore:2.2,industryAvg:3.0,topQuartile:4.0,percentile:22},
    {id:"bench-operations",name:"Production Operations",yourScore:3.0,industryAvg:3.3,topQuartile:4.2,percentile:40},
    {id:"bench-people",name:"People & Training",yourScore:2.5,industryAvg:2.9,topQuartile:3.8,percentile:32},
    {id:"bench-supply",name:"Supply Chain",yourScore:2.8,industryAvg:3.1,topQuartile:4.1,percentile:38},
  ],
  "hq":[
    {id:"bench-safety",name:"Safety & Compliance",yourScore:4.6,industryAvg:3.4,topQuartile:4.5,percentile:92},
    {id:"bench-quality",name:"Quality Management",yourScore:4.0,industryAvg:3.2,topQuartile:4.3,percentile:76},
    {id:"bench-maintenance",name:"Maintenance & Reliability",yourScore:3.8,industryAvg:3.0,topQuartile:4.0,percentile:74},
    {id:"bench-operations",name:"Production Operations",yourScore:3.9,industryAvg:3.3,topQuartile:4.2,percentile:72},
    {id:"bench-people",name:"People & Training",yourScore:4.2,industryAvg:2.9,topQuartile:3.8,percentile:88},
    {id:"bench-supply",name:"Supply Chain",yourScore:3.4,industryAvg:3.1,topQuartile:4.1,percentile:60},
  ],
  "warehouse":[
    {id:"bench-safety",name:"Safety & Compliance",yourScore:3.5,industryAvg:3.4,topQuartile:4.5,percentile:54},
    {id:"bench-quality",name:"Quality Management",yourScore:3.2,industryAvg:3.2,topQuartile:4.3,percentile:50},
    {id:"bench-maintenance",name:"Maintenance & Reliability",yourScore:2.9,industryAvg:3.0,topQuartile:4.0,percentile:44},
    {id:"bench-operations",name:"Production Operations",yourScore:3.3,industryAvg:3.3,topQuartile:4.2,percentile:50},
    {id:"bench-people",name:"People & Training",yourScore:3.0,industryAvg:2.9,topQuartile:3.8,percentile:52},
    {id:"bench-supply",name:"Supply Chain",yourScore:3.5,industryAvg:3.1,topQuartile:4.1,percentile:62},
  ],
};

function ScorePage({selectedGoals,industry,onNavigate}){
  const[tab,setTab]=useState("dashboard");
  const[lens,setLens]=useState("risk");
  const[activeSite,setActiveSite]=useState("all");
  const allGoals=getGoalsByIndustry(industry);
  const activeGoals=allGoals.filter(g=>selectedGoals.includes(g.id));

  const signalLabels={inspections:"Inspections",actions:"Actions",training:"Training",incidents:"Incidents",assets:"Assets",observations:"Observations"};

  /* ── Site-adjusted scores ── */
  const scoredGoals=useMemo(()=>
    activeGoals.map(g=>{
      const base=GOAL_SCORES[g.id]||{score:0,trend:0,signals:{}};
      return{...g,scoreData:{
        score:getSiteScore(base.score,activeSite),
        trend:getSiteTrend(base.trend,activeSite),
        signals:getSiteSignals(base.signals,activeSite),
      }};
    }).sort((a,b)=>lens==="risk"?a.scoreData.score-b.scoreData.score:b.scoreData.score-a.scoreData.score)
  ,[activeGoals,lens,activeSite]);

  const siteAgg=useMemo(()=>{
    if(scoredGoals.length===0)return{score:0,trend:0,count:0};
    const total=scoredGoals.reduce((s,g)=>s+g.scoreData.score,0);
    const trendTotal=scoredGoals.reduce((s,g)=>s+g.scoreData.trend,0);
    return{score:Math.round((total/scoredGoals.length)*10)/10,trend:Math.round((trendTotal/scoredGoals.length)*10)/10,count:scoredGoals.length};
  },[scoredGoals]);

  const siteSignals=useMemo(()=>{
    const baseSignals=computeSignalAverages(selectedGoals);
    return getSiteSignals(baseSignals,activeSite);
  },[selectedGoals,activeSite]);

  const topRisks=scoredGoals.filter(g=>g.scoreData.score>0&&g.scoreData.score<3.0);
  const topStrengths=scoredGoals.filter(g=>g.scoreData.score>=3.5);

  const tabs=[
    {id:"dashboard",label:"Dashboard"},
    {id:"predictions",label:"Predictions"},
    {id:"benchmarking",label:"Benchmarking"},
  ];

  const hasGoals=activeGoals.length>0;
  const currentSite=SCORE_SITES.find(s=>s.id===activeSite)||SCORE_SITES[0];
  const sitePredictions=MOCK_PREDICTIONS[activeSite]||MOCK_PREDICTIONS["all"];
  const siteBenchmarks=SITE_BENCHMARKS[activeSite]||SITE_BENCHMARKS["all"];

  /* ── Site selector component ── */
  const SiteSelector=()=><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
    {SCORE_SITES.map(site=>{
      const active=activeSite===site.id;
      return<div key={site.id} onClick={()=>setActiveSite(site.id)} style={{
        display:"flex",alignItems:"center",gap:7,padding:"6px 14px",borderRadius:99,
        background:active?`${site.color}12`:T.surface,
        border:`1.5px solid ${active?site.color:T.border}`,
        cursor:"pointer",transition:"all 0.2s",
      }} onMouseEnter={e=>{if(!active){e.currentTarget.style.borderColor=site.color;e.currentTarget.style.background=`${site.color}06`;}}} onMouseLeave={e=>{if(!active){e.currentTarget.style.borderColor=T.border;e.currentTarget.style.background=T.surface;}}}>
        <div style={{width:7,height:7,borderRadius:"50%",background:site.color,flexShrink:0}}/>
        <span style={{fontSize:12,fontWeight:active?600:400,color:active?T.text:T.textSecondary,whiteSpace:"nowrap"}}>{site.name}</span>
      </div>;
    })}
  </div>;

  return<div style={{flex:1,overflowY:"auto",background:T.bg}}>
    <div style={{maxWidth:960,margin:"0 auto",padding:"28px 24px 64px"}}>

      {/* Header */}
      <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:16}}>
        <div>
          <h1 style={{fontFamily:T.serif,fontSize:24,fontWeight:500,letterSpacing:"-0.03em",color:T.text,margin:0}}>Score</h1>
          <p style={{fontSize:13,color:T.textSecondary,marginTop:4,letterSpacing:"-0.01em"}}>Operational readiness, predictions, and benchmarks</p>
        </div>
        {tab==="dashboard"&&hasGoals&&<LensToggle lens={lens} setLens={setLens}/>}
      </div>

      {/* Site selector */}
      <div style={{marginBottom:16}}><SiteSelector/></div>

      {/* Tabs */}
      <div style={{display:"flex",gap:2,marginBottom:24,background:T.surfaceMuted,borderRadius:99,padding:3,width:"fit-content"}}>
        {tabs.map(t=>{
          const active=tab===t.id;
          return<div key={t.id} onClick={()=>setTab(t.id)} style={{
            padding:"6px 18px",borderRadius:99,fontSize:12.5,fontWeight:active?600:400,
            color:active?T.text:T.textSecondary,background:active?T.surface:"transparent",
            boxShadow:active?"0 1px 3px rgba(0,0,0,0.06)":"none",
            cursor:"pointer",letterSpacing:"-0.01em",
          }}>{t.label}</div>;
        })}
      </div>

      {/* ═══ DASHBOARD TAB ═══ */}
      {tab==="dashboard"&&<>{!hasGoals?<div style={{textAlign:"center",padding:"80px 0"}}>
        <div style={{width:56,height:56,borderRadius:16,background:T.surfaceMuted,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>{IC.target(T.textTertiary,24)}</div>
        <div style={{fontFamily:T.serif,fontSize:18,fontWeight:500,marginBottom:6}}>No goals selected</div>
        <div style={{fontSize:13,color:T.textSecondary,marginBottom:20}}>Select goals to see your operational score</div>
        <div onClick={()=>onNavigate("goals")} className="action-chip primary">Set up goals</div>
      </div>:<>
        {/* Aggregate score card */}
        <div className="bento" style={{padding:"28px 32px",marginBottom:20,borderLeft:`4px solid ${currentSite.color}`}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:20}}>
            <div>
              <div className="lbl" style={{marginBottom:8,display:"flex",alignItems:"center",gap:6}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:currentSite.color}}/>
                {currentSite.name}{activeSite!=="all"&&<span style={{color:T.textTertiary,fontWeight:400}}> — {currentSite.type}</span>}
              </div>
              <ScoreBadge score={siteAgg.score} trend={siteAgg.trend}/>
              <div style={{marginTop:8}}><StarRating score={siteAgg.score} size={22} gap={3}/></div>
            </div>
            <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
              <div style={{textAlign:"center"}}>
                <div style={{fontFamily:T.serif,fontSize:28,fontWeight:500,color:T.text}}>{siteAgg.count}</div>
                <div style={{fontSize:11,color:T.textTertiary,fontFamily:T.mono}}>Active Goals</div>
              </div>
              <div style={{textAlign:"center"}}>
                <div style={{fontFamily:T.serif,fontSize:28,fontWeight:500,color:T.green}}>{topStrengths.length}</div>
                <div style={{fontSize:11,color:T.textTertiary,fontFamily:T.mono}}>Strong</div>
              </div>
              <div style={{textAlign:"center"}}>
                <div style={{fontFamily:T.serif,fontSize:28,fontWeight:500,color:T.rose}}>{topRisks.length}</div>
                <div style={{fontSize:11,color:T.textTertiary,fontFamily:T.mono}}>At Risk</div>
              </div>
            </div>
          </div>
        </div>

        {/* Site comparison strip (only when viewing All Sites) */}
        {activeSite==="all"&&<div style={{display:"grid",gridTemplateColumns:`repeat(${SCORE_SITES.length-1},1fr)`,gap:10,marginBottom:20}}>
          {SCORE_SITES.filter(s=>s.id!=="all").map(site=>{
            const mod=SITE_SCORE_MODIFIERS[site.id];
            const siteScore=Math.min(5.0,Math.round(siteAgg.score*mod.multiplier*10)/10);
            const color=siteScore<3.0?T.rose:siteScore>=3.5?T.green:T.amber;
            return<div key={site.id} onClick={()=>setActiveSite(site.id)} className="bento" style={{padding:"16px 18px",cursor:"pointer",borderTop:`3px solid ${site.color}`,transition:"all 0.2s"}}>
              <div style={{fontSize:12,fontWeight:600,color:T.text,marginBottom:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{site.name}</div>
              <div style={{fontSize:10,color:T.textTertiary,fontFamily:T.mono,marginBottom:10}}>{site.type}</div>
              <div style={{display:"flex",alignItems:"baseline",gap:4}}>
                <span style={{fontFamily:T.serif,fontSize:22,fontWeight:500,color}}>{siteScore}</span>
                <span style={{fontSize:11,color:T.textTertiary}}>/5</span>
              </div>
              <div style={{marginTop:6}}><StarRating score={siteScore} size={10} gap={1}/></div>
            </div>;
          })}
        </div>}

        {/* Signal breakdown */}
        <div className="grid-bento" style={{marginBottom:24}}>
          <div className="col-7">
            <div className="bento" style={{padding:"22px 24px"}}>
              <div className="lbl" style={{marginBottom:16}}>Signal Health</div>
              {Object.entries(siteSignals).map(([key,val])=>
                <SignalBar key={key} label={signalLabels[key]||key} value={val}/>
              )}
            </div>
          </div>
          <div className="col-5">
            <div className="bento" style={{padding:"22px 24px",height:"100%",display:"flex",flexDirection:"column"}}>
              <div className="lbl" style={{marginBottom:14}}>{lens==="risk"?"Top Risks":"Top Strengths"}</div>
              <div style={{flex:1,display:"flex",flexDirection:"column",gap:8}}>
                {(lens==="risk"?topRisks:topStrengths).slice(0,5).map(g=>{
                  const color=g.scoreData.score<3.0?T.rose:g.scoreData.score>=3.5?T.green:T.amber;
                  return<div key={g.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 12px",borderRadius:T.rSm,background:T.surfaceHover}}>
                    <span style={{fontSize:12.5,color:T.text,fontWeight:500,flex:1,minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{g.name}</span>
                    <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
                      <span style={{fontSize:12,fontWeight:600,fontFamily:T.mono,color}}>{g.scoreData.score}</span>
                      {g.scoreData.trend!==0&&<span style={{fontSize:10,color:g.scoreData.trend>0?T.green:T.rose}}>{g.scoreData.trend>0?"↑":"↓"}{Math.abs(g.scoreData.trend)}</span>}
                    </div>
                  </div>;
                })}
                {(lens==="risk"?topRisks:topStrengths).length===0&&<div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:T.textTertiary,fontSize:12}}>
                  {lens==="risk"?"No goals at risk":"No strong goals yet"}
                </div>}
              </div>
            </div>
          </div>
        </div>

        {/* All goals table */}
        <div className="bento" style={{padding:"22px 24px"}}>
          <div className="lbl" style={{marginBottom:14}}>All Goals</div>
          <div style={{display:"flex",flexDirection:"column",gap:4}}>
            {scoredGoals.map((g,idx)=>{
              const s=g.scoreData;
              const color=s.score<3.0?T.rose:s.score>=3.5?T.green:T.amber;
              return<div key={g.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",borderRadius:T.rSm,transition:"background 0.15s",cursor:"pointer",animation:`fadeIn 0.25s ease ${idx*0.02}s both`}} onMouseEnter={e=>e.currentTarget.style.background=T.surfaceHover} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <div style={{width:8,height:8,borderRadius:"50%",background:color,flexShrink:0}}/>
                <span style={{flex:1,fontSize:13,color:T.text,fontWeight:500,minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{g.name}</span>
                <span style={{fontSize:11,color:T.textTertiary,fontFamily:T.mono,flexShrink:0}}>{g.category}</span>
                <div style={{display:"flex",alignItems:"center",gap:4,flexShrink:0}}>
                  <StarRating score={s.score} size={10} gap={1}/>
                  <span style={{fontSize:12,fontWeight:600,fontFamily:T.mono,color,minWidth:28,textAlign:"right"}}>{s.score}</span>
                </div>
                {s.trend!==0&&<span className="chip" style={{background:s.trend>0?T.greenSoft:T.roseSoft,color:s.trend>0?T.green:T.rose,flexShrink:0}}>{s.trend>0?"↑":"↓"}{Math.abs(s.trend)}</span>}
              </div>;
            })}
          </div>
        </div>
      </>}</>}

      {/* ═══ PREDICTIONS TAB ═══ */}
      {tab==="predictions"&&<>
        {/* Summary banner */}
        <div className="bento" style={{padding:"22px 28px",marginBottom:24,background:`linear-gradient(135deg, ${T.surface} 0%, ${T.accentSoft} 100%)`,border:`1px solid ${T.accentBorder}`}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:44,height:44,borderRadius:12,background:T.accent,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{IC.sparkle("#fff",20)}</div>
            <div>
              <div style={{fontSize:15,fontWeight:600,letterSpacing:"-0.01em",marginBottom:2}}>AI Score Predictions{activeSite!=="all"&&<span style={{fontWeight:400,color:T.textSecondary}}> — {currentSite.name}</span>}</div>
              <div style={{fontSize:12.5,color:T.textSecondary,lineHeight:1.5}}>Based on current signal trends, workflow completion rates, and historical patterns. Predictions update daily.</div>
            </div>
          </div>
        </div>

        {/* Prediction summary */}
        <div style={{display:"flex",gap:14,marginBottom:24}}>
          {[
            {label:"Improving",count:sitePredictions.filter(p=>p.direction==="up").length,color:T.green},
            {label:"Declining",count:sitePredictions.filter(p=>p.direction==="down").length,color:T.rose},
            {label:"Avg Confidence",count:Math.round(sitePredictions.reduce((s,p)=>s+p.confidence,0)/sitePredictions.length)+"%",color:T.accent},
          ].map(s=><div key={s.label} className="bento" style={{flex:1,padding:"16px 20px",textAlign:"center"}}>
            <div style={{fontFamily:T.serif,fontSize:24,fontWeight:500,color:s.color}}>{s.count}</div>
            <div style={{fontSize:11,color:T.textTertiary,fontFamily:T.mono,marginTop:2}}>{s.label}</div>
          </div>)}
        </div>

        {/* Prediction cards */}
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {sitePredictions.map((p,idx)=>{
            const improving=p.direction==="up";
            const color=improving?T.green:T.rose;
            const bg=improving?T.greenSoft:T.roseSoft;
            const delta=Math.abs(p.predicted-p.current).toFixed(1);
            return<div key={p.id} className="bento" style={{padding:"18px 22px",animation:`fadeIn 0.3s ease ${idx*0.04}s both`}}>
              <div style={{display:"flex",alignItems:"center",gap:14}}>
                <div style={{width:40,height:40,borderRadius:10,background:bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <span style={{fontSize:18,color}}>{improving?"↑":"↓"}</span>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                    <span style={{fontSize:14,fontWeight:600,letterSpacing:"-0.01em",color:T.text}}>{p.goal}</span>
                    <span className="chip" style={{background:bg,color}}>{improving?"+":"-"}{delta} in {p.timeframe}</span>
                  </div>
                  <div style={{fontSize:12,color:T.textSecondary,lineHeight:1.5}}>{p.insight}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
                  <div style={{textAlign:"center"}}>
                    <div style={{fontSize:10,color:T.textTertiary,fontFamily:T.mono,marginBottom:2}}>Current</div>
                    <div style={{fontSize:16,fontWeight:600,fontFamily:T.mono,color:T.text}}>{p.current}</div>
                  </div>
                  <div style={{color:T.textTertiary,fontSize:14}}>→</div>
                  <div style={{textAlign:"center"}}>
                    <div style={{fontSize:10,color:T.textTertiary,fontFamily:T.mono,marginBottom:2}}>Predicted</div>
                    <div style={{fontSize:16,fontWeight:600,fontFamily:T.mono,color}}>{p.predicted}</div>
                  </div>
                </div>
                <div style={{width:52,flexShrink:0,textAlign:"center"}}>
                  <MiniRing pct={p.confidence} size={36} stroke={3.5} color={p.confidence>=75?T.green:p.confidence>=50?T.amber:T.rose}/>
                  <div style={{fontSize:9.5,color:T.textTertiary,fontFamily:T.mono,marginTop:3}}>{p.confidence}%</div>
                </div>
              </div>
            </div>;
          })}
        </div>
      </>}

      {/* ═══ BENCHMARKING TAB ═══ */}
      {tab==="benchmarking"&&<>
        {/* Industry context */}
        <div className="bento" style={{padding:"22px 28px",marginBottom:24,borderLeft:`4px solid ${currentSite.color}`}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:16}}>
            <div>
              <div className="lbl" style={{marginBottom:6}}>Industry Benchmark{activeSite!=="all"&&<span style={{textTransform:"none",letterSpacing:0}}> — {currentSite.name}</span>}</div>
              <div style={{fontSize:16,fontWeight:600,letterSpacing:"-0.01em"}}>{(INDUSTRIES.find(i=>i.id===industry)||{}).label||"Manufacturing"}</div>
              <div style={{fontSize:12,color:T.textSecondary,marginTop:2}}>Compared against {activeSite==="all"?"organisations":"similar sites"} in your industry</div>
            </div>
            <div style={{display:"flex",gap:16}}>
              <div style={{textAlign:"center",padding:"10px 16px",borderRadius:T.rSm,background:T.surfaceHover}}>
                <div style={{fontFamily:T.serif,fontSize:24,fontWeight:500,color:currentSite.color}}>{hasGoals?siteAgg.score:"—"}</div>
                <div style={{fontSize:10,color:T.textTertiary,fontFamily:T.mono}}>{activeSite==="all"?"Your Score":"Site Score"}</div>
              </div>
              <div style={{textAlign:"center",padding:"10px 16px",borderRadius:T.rSm,background:T.surfaceHover}}>
                <div style={{fontFamily:T.serif,fontSize:24,fontWeight:500,color:T.textSecondary}}>3.2</div>
                <div style={{fontSize:10,color:T.textTertiary,fontFamily:T.mono}}>Industry Avg</div>
              </div>
              <div style={{textAlign:"center",padding:"10px 16px",borderRadius:T.rSm,background:T.surfaceHover}}>
                <div style={{fontFamily:T.serif,fontSize:24,fontWeight:500,color:T.green}}>4.3</div>
                <div style={{fontSize:10,color:T.textTertiary,fontFamily:T.mono}}>Top Quartile</div>
              </div>
            </div>
          </div>
        </div>

        {/* Benchmark cards */}
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {siteBenchmarks.map((b,idx)=>{
            const vsAvg=b.yourScore-b.industryAvg;
            const aboveAvg=vsAvg>=0;
            const pctColor=b.percentile>=75?T.green:b.percentile>=50?T.accent:b.percentile>=25?T.amber:T.rose;
            return<div key={b.id} className="bento" style={{padding:"20px 24px",animation:`fadeIn 0.3s ease ${idx*0.05}s both`}}>
              <div style={{display:"flex",alignItems:"center",gap:16}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:14,fontWeight:600,letterSpacing:"-0.01em",marginBottom:6}}>{b.name}</div>
                  <div style={{display:"flex",flexDirection:"column",gap:4}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:10,fontFamily:T.mono,color:T.textTertiary,width:65,flexShrink:0}}>You</span>
                      <div style={{flex:1,height:8,borderRadius:4,background:T.surfaceMuted,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${(b.yourScore/5)*100}%`,borderRadius:4,background:currentSite.color,transition:"width 0.8s cubic-bezier(0.4,0,0.2,1)"}}/>
                      </div>
                      <span style={{fontSize:11,fontWeight:600,fontFamily:T.mono,color:currentSite.color,width:28,textAlign:"right"}}>{b.yourScore}</span>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:10,fontFamily:T.mono,color:T.textTertiary,width:65,flexShrink:0}}>Industry</span>
                      <div style={{flex:1,height:8,borderRadius:4,background:T.surfaceMuted,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${(b.industryAvg/5)*100}%`,borderRadius:4,background:T.textTertiary,opacity:0.5,transition:"width 0.8s cubic-bezier(0.4,0,0.2,1)"}}/>
                      </div>
                      <span style={{fontSize:11,fontWeight:500,fontFamily:T.mono,color:T.textTertiary,width:28,textAlign:"right"}}>{b.industryAvg}</span>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:10,fontFamily:T.mono,color:T.textTertiary,width:65,flexShrink:0}}>Top 25%</span>
                      <div style={{flex:1,height:8,borderRadius:4,background:T.surfaceMuted,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${(b.topQuartile/5)*100}%`,borderRadius:4,background:T.green,opacity:0.4,transition:"width 0.8s cubic-bezier(0.4,0,0.2,1)"}}/>
                      </div>
                      <span style={{fontSize:11,fontWeight:500,fontFamily:T.mono,color:T.green,width:28,textAlign:"right"}}>{b.topQuartile}</span>
                    </div>
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:14,flexShrink:0}}>
                  <div style={{textAlign:"center"}}>
                    <MiniRing pct={b.percentile} size={44} stroke={4} color={pctColor}/>
                    <div style={{fontSize:10,fontFamily:T.mono,color:T.textTertiary,marginTop:4}}>P{b.percentile}</div>
                  </div>
                  <div style={{textAlign:"center",minWidth:56}}>
                    <span className="chip" style={{background:aboveAvg?T.greenSoft:T.roseSoft,color:aboveAvg?T.green:T.rose,fontSize:11,fontWeight:600}}>
                      {aboveAvg?"+":""}{vsAvg.toFixed(1)} vs avg
                    </span>
                  </div>
                </div>
              </div>
            </div>;
          })}
        </div>

        <div style={{textAlign:"center",padding:"32px 0 0",fontSize:11.5,color:T.textTertiary,lineHeight:1.6}}>
          Benchmarks are based on anonymised, aggregated data from {activeSite==="all"?"organisations":"similar sites"} in your industry.<br/>
          Updated monthly. Last refreshed 28 Feb 2026.
        </div>
      </>}

    </div>
  </div>;
}

/* ═══ TASKS PAGE ═══ */

const MOCK_TASKS=[
  {id:1,title:"Complete monthly safety inspection — Plant Alpha",status:"overdue",priority:"High",assignee:"Sarah Chen",due:"28 Feb 2026",category:"Inspections"},
  {id:2,title:"Review corrective actions from last audit",status:"in-progress",priority:"High",assignee:"Marcus Johnson",due:"5 Mar 2026",category:"Actions"},
  {id:3,title:"Schedule forklift operator refresher training",status:"todo",priority:"Medium",assignee:"Ana Rodriguez",due:"10 Mar 2026",category:"Training"},
  {id:4,title:"Update emergency evacuation plan signage",status:"todo",priority:"Medium",assignee:"Priya Patel",due:"12 Mar 2026",category:"Safety"},
  {id:5,title:"Calibrate pressure gauges — Line 3",status:"in-progress",priority:"Medium",assignee:"James Wilson",due:"7 Mar 2026",category:"Maintenance"},
  {id:6,title:"Submit environmental compliance report Q1",status:"todo",priority:"High",assignee:"Sarah Chen",due:"15 Mar 2026",category:"Compliance"},
  {id:7,title:"Onboard new quality inspector — Plant Beta",status:"done",priority:"Low",assignee:"Lisa Thompson",due:"1 Mar 2026",category:"People"},
  {id:8,title:"Investigate near-miss incident #NM-2026-041",status:"in-progress",priority:"High",assignee:"Priya Patel",due:"4 Mar 2026",category:"Incidents"},
  {id:9,title:"Restock PPE inventory — warehouse",status:"done",priority:"Low",assignee:"David Kim",due:"26 Feb 2026",category:"Inventory"},
  {id:10,title:"Review supplier quality scorecard — Q4",status:"todo",priority:"Medium",assignee:"Carlos Mendez",due:"14 Mar 2026",category:"Quality"},
];

const TASK_STATUS_META={
  "overdue":{label:"Overdue",color:T.rose,bg:T.roseSoft,border:T.roseBorder},
  "in-progress":{label:"In Progress",color:T.accent,bg:T.accentSoft,border:T.accentBorder},
  "todo":{label:"To Do",color:T.textSecondary,bg:T.surfaceMuted,border:T.border},
  "done":{label:"Done",color:T.green,bg:T.greenSoft,border:T.greenBorder},
};

function TasksPage(){
  const[filter,setFilter]=useState("all");
  const[selectedTask,setSelectedTask]=useState(null);

  const counts=useMemo(()=>{
    const c={all:MOCK_TASKS.length,overdue:0,"in-progress":0,todo:0,done:0};
    MOCK_TASKS.forEach(t=>c[t.status]=(c[t.status]||0)+1);
    return c;
  },[]);

  const filtered=useMemo(()=>
    filter==="all"?MOCK_TASKS:MOCK_TASKS.filter(t=>t.status===filter)
  ,[filter]);

  const filters=[
    {id:"all",label:"All"},
    {id:"overdue",label:"Overdue"},
    {id:"in-progress",label:"In Progress"},
    {id:"todo",label:"To Do"},
    {id:"done",label:"Done"},
  ];

  return<div style={{flex:1,overflowY:"auto",background:T.bg}}>
    <div style={{maxWidth:860,margin:"0 auto",padding:"28px 24px 64px"}}>

      {/* Header */}
      <div style={{marginBottom:24}}>
        <h1 style={{fontFamily:T.serif,fontSize:24,fontWeight:500,letterSpacing:"-0.03em",color:T.text,margin:0}}>Tasks</h1>
        <p style={{fontSize:13,color:T.textSecondary,marginTop:4,letterSpacing:"-0.01em"}}>Track and manage operational tasks across your workspace</p>
      </div>

      {/* Summary chips */}
      <div style={{display:"flex",gap:8,marginBottom:24,flexWrap:"wrap"}}>
        {filters.map(f=>{
          const active=filter===f.id;
          const meta=TASK_STATUS_META[f.id];
          const count=counts[f.id]||0;
          return<div key={f.id} onClick={()=>setFilter(f.id)} style={{
            padding:"6px 14px",borderRadius:99,fontSize:12,fontWeight:active?600:400,
            background:active?(meta?meta.bg:T.accentSoft):T.surface,
            border:`1px solid ${active?(meta?meta.border:T.accentBorder):T.border}`,
            color:active?(meta?meta.color:T.accent):T.textSecondary,
            cursor:"pointer",transition:"all 0.2s",display:"flex",alignItems:"center",gap:6,
          }}>
            <span>{f.label}</span>
            <span style={{fontSize:10,fontFamily:T.mono,opacity:0.7}}>{count}</span>
          </div>;
        })}
      </div>

      {/* Task list */}
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {filtered.map((task,idx)=>{
          const meta=TASK_STATUS_META[task.status];
          const isSelected=selectedTask===task.id;
          return<div key={task.id} onClick={()=>setSelectedTask(isSelected?null:task.id)} style={{
            background:T.surface,border:`1px solid ${isSelected?T.accentBorder:T.border}`,
            borderRadius:T.r,padding:"14px 18px",cursor:"pointer",
            transition:"all 0.2s",boxShadow:isSelected?`0 0 0 2px ${T.accentSoft}`:T.shadow,
            animation:`fadeIn 0.3s ease ${idx*0.03}s both`,
          }} onMouseEnter={e=>{if(!isSelected)e.currentTarget.style.borderColor=T.borderSubtle;e.currentTarget.style.boxShadow=T.shadowMd;}} onMouseLeave={e=>{if(!isSelected)e.currentTarget.style.borderColor=T.border;e.currentTarget.style.boxShadow=isSelected?`0 0 0 2px ${T.accentSoft}`:T.shadow;}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              {/* Checkbox */}
              <div style={{width:20,height:20,borderRadius:6,border:`1.5px solid ${task.status==="done"?T.green:T.border}`,background:task.status==="done"?T.greenSoft:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                {task.status==="done"&&IC.check(T.green,12)}
              </div>
              {/* Content */}
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13.5,fontWeight:500,color:task.status==="done"?T.textTertiary:T.text,textDecoration:task.status==="done"?"line-through":"none",letterSpacing:"-0.01em"}}>{task.title}</div>
                {isSelected&&<div style={{marginTop:10,display:"flex",flexDirection:"column",gap:8,animation:"fadeIn 0.2s ease"}}>
                  <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
                    {[["Assignee",task.assignee],["Due",task.due],["Category",task.category],["Priority",task.priority]].map(([k,v])=>
                      <div key={k}>
                        <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:"0.05em",fontFamily:T.mono,color:T.textTertiary,marginBottom:2}}>{k}</div>
                        <div style={{fontSize:12,color:T.textSecondary,fontWeight:500}}>{v}</div>
                      </div>
                    )}
                  </div>
                </div>}
              </div>
              {/* Right side */}
              <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                {task.priority==="High"&&<div className="chip" style={{background:T.roseSoft,color:T.rose}}>High</div>}
                <div className="chip" style={{background:meta.bg,color:meta.color,border:`1px solid ${meta.border}`}}>{meta.label}</div>
              </div>
            </div>
          </div>;
        })}
      </div>

      {filtered.length===0&&<div style={{textAlign:"center",padding:"60px 0"}}>
        <div style={{fontSize:13,color:T.textTertiary}}>No tasks match this filter</div>
      </div>}
    </div>
  </div>;
}

/* ═══ DATA PAGE (Tables + Connectors) ═══ */

const MOCK_REGISTERS=[
  {id:"reg-inspections",name:"Inspections",records:1247,updated:"2 hours ago",status:"live",icon:IC.tasks,color:"#3B82F6",fields:["Site","Type","Date","Inspector","Score","Status"]},
  {id:"reg-actions",name:"Corrective Actions",records:384,updated:"35 min ago",status:"live",icon:IC.check,color:"#10B981",fields:["Action","Assigned To","Priority","Due Date","Status","Source"]},
  {id:"reg-incidents",name:"Incidents",records:89,updated:"1 day ago",status:"live",icon:IC.bolt,color:"#F43F5E",fields:["Incident ID","Date","Site","Severity","Root Cause","Status"]},
  {id:"reg-assets",name:"Assets",records:562,updated:"4 hours ago",status:"live",icon:IC.builder,color:"#8B5CF6",fields:["Asset ID","Name","Location","Type","Last Service","Condition"]},
  {id:"reg-training",name:"Training Records",records:2103,updated:"1 hour ago",status:"live",icon:IC.people,color:"#F59E0B",fields:["Employee","Course","Completed","Expiry","Score","Certificate"]},
  {id:"reg-observations",name:"Observations",records:731,updated:"12 min ago",status:"live",icon:IC.target,color:"#06B6D4",fields:["Observer","Date","Site","Area","Category","Risk Level"]},
  {id:"reg-permits",name:"Permits to Work",records:156,updated:"3 hours ago",status:"paused",icon:IC.shield,color:"#64748B",fields:["Permit No.","Type","Location","Issuer","Valid From","Valid To"]},
  {id:"reg-suppliers",name:"Supplier Quality",records:48,updated:"3 days ago",status:"live",icon:IC.connector,color:"#EC4899",fields:["Supplier","Rating","Last Audit","Non-conformances","Status","Tier"]},
];

function RegistersPage(){
  const[tab,setTab]=useState("tables");
  const[search,setSearch]=useState("");
  const[searchFocused,setSearchFocused]=useState(false);
  const[expandedId,setExpandedId]=useState(null);

  /* ── Connector state (mirrors ConnectorsPage logic) ── */
  const[connStates,setConnStates]=useState({});
  const[configPanel,setConfigPanel]=useState(null);
  const getConnState=(id)=>connStates[id]||{installed:false,configured:false};
  const installConn=(id)=>setConnStates(prev=>({...prev,[id]:{installed:true,configured:false}}));
  const saveConn=(id)=>{setConnStates(prev=>({...prev,[id]:{installed:true,configured:true}}));setConfigPanel(null);};
  const disconnectConn=(id)=>{setConnStates(prev=>{const n={...prev};delete n[id];return n;});setConfigPanel(null);};

  /* ── Tables filtering ── */
  const filteredTables=useMemo(()=>{
    if(!search.trim())return MOCK_REGISTERS;
    const q=search.toLowerCase();
    return MOCK_REGISTERS.filter(r=>r.name.toLowerCase().includes(q));
  },[search]);

  const totalRecords=MOCK_REGISTERS.reduce((s,r)=>s+r.records,0);

  /* ── Connector filtering ── */
  const filteredConnectors=useMemo(()=>{
    if(!search.trim()) return CONNECTOR_CATALOG;
    const q=search.toLowerCase();
    return CONNECTOR_CATALOG.map(cat=>({
      ...cat,
      connectors:cat.connectors.filter(c=>
        c.name.toLowerCase().includes(q)||c.desc.toLowerCase().includes(q)||cat.label.toLowerCase().includes(q)
      )
    })).filter(cat=>cat.connectors.length>0);
  },[search]);

  const installedConns=useMemo(()=>{
    const res=[];
    CONNECTOR_CATALOG.forEach(cat=>{
      cat.connectors.forEach(conn=>{
        if(getConnState(conn.id).installed) res.push({conn,cat});
      });
    });
    return res;
  },[connStates]);

  const totalConnectors=CONNECTOR_CATALOG.reduce((s,c)=>s+c.connectors.length,0);

  const panelData=useMemo(()=>{
    if(!configPanel) return null;
    const cat=CONNECTOR_CATALOG.find(c=>c.id===configPanel.catId);
    const conn=cat?cat.connectors.find(c=>c.id===configPanel.connId):null;
    return conn&&cat?{conn,cat}:null;
  },[configPanel]);

  const tabs=[
    {id:"tables",label:"Tables",count:MOCK_REGISTERS.length},
    {id:"connectors",label:"Connectors",count:totalConnectors},
  ];

  return<div style={{flex:1,overflowY:"auto",background:T.bg}}>
    <div style={{maxWidth:960,margin:"0 auto",padding:"28px 24px 64px"}}>

      {/* Header */}
      <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:20}}>
        <div>
          <h1 style={{fontFamily:T.serif,fontSize:24,fontWeight:500,letterSpacing:"-0.03em",color:T.text,margin:0}}>Data</h1>
          <p style={{fontSize:13,color:T.textSecondary,marginTop:4,letterSpacing:"-0.01em"}}>Tables, connectors, and data sources</p>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          {tab==="tables"&&<span style={{fontSize:11,color:T.textTertiary,fontFamily:T.mono}}>{totalRecords.toLocaleString()} records</span>}
          {tab==="connectors"&&installedConns.length>0&&<div style={{display:"flex",alignItems:"center",gap:5,padding:"4px 10px",borderRadius:99,background:T.greenSoft,border:`1px solid ${T.greenBorder}`}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:T.green}}/>
            <span style={{fontSize:11,fontWeight:600,color:T.green,fontFamily:T.mono}}>{installedConns.length} connected</span>
          </div>}
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:2,marginBottom:20,background:T.surfaceMuted,borderRadius:99,padding:3,width:"fit-content"}}>
        {tabs.map(t=>{
          const active=tab===t.id;
          return<div key={t.id} onClick={()=>{setTab(t.id);setSearch("");}} style={{
            padding:"6px 18px",borderRadius:99,fontSize:12.5,fontWeight:active?600:400,
            color:active?T.text:T.textSecondary,background:active?T.surface:"transparent",
            boxShadow:active?"0 1px 3px rgba(0,0,0,0.06)":"none",
            cursor:"pointer",letterSpacing:"-0.01em",display:"flex",alignItems:"center",gap:6,
          }}>
            <span>{t.label}</span>
            <span style={{fontSize:10,fontFamily:T.mono,color:active?T.textTertiary:T.textTertiary,opacity:0.7}}>{t.count}</span>
          </div>;
        })}
      </div>

      {/* Search */}
      <div style={{marginBottom:24}}>
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"11px 16px",borderRadius:T.r,background:T.surface,border:`1.5px solid ${searchFocused?T.accent:T.border}`,boxShadow:searchFocused?`0 0 0 3px ${T.accentSoft}`:T.shadow,transition:"all 0.2s"}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={searchFocused?T.accent:T.textTertiary} strokeWidth="2" strokeLinecap="round" style={{flexShrink:0,transition:"stroke 0.2s"}}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input value={search} onChange={e=>setSearch(e.target.value)} onFocus={()=>setSearchFocused(true)} onBlur={()=>setSearchFocused(false)} placeholder={tab==="tables"?"Search tables...":"Search connectors..."} style={{flex:1,border:"none",background:"none",fontSize:14,fontFamily:T.sans,color:T.text,outline:"none",letterSpacing:"-0.01em"}}/>
          {search&&<div onClick={()=>setSearch("")} style={{cursor:"pointer",display:"flex",alignItems:"center",padding:2,borderRadius:4}} onMouseEnter={e=>e.currentTarget.style.background=T.surfaceMuted} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>{IC.x(T.textTertiary,14)}</div>}
        </div>
      </div>

      {/* ═══ TABLES TAB ═══ */}
      {tab==="tables"&&<>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
          {filteredTables.map((reg,idx)=>{
            const expanded=expandedId===reg.id;
            return<div key={reg.id} onClick={()=>setExpandedId(expanded?null:reg.id)} className="bento" style={{
              padding:"18px 20px",cursor:"pointer",
              border:expanded?`1px solid ${T.accentBorder}`:`1px solid ${T.border}`,
              boxShadow:expanded?`0 0 0 2px ${T.accentSoft}`:T.shadow,
              animation:`fadeIn 0.3s ease ${idx*0.04}s both`,
            }}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
                <div style={{width:36,height:36,borderRadius:10,background:`${reg.color}12`,display:"flex",alignItems:"center",justifyContent:"center"}}>{reg.icon(reg.color,18)}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:600,letterSpacing:"-0.01em",color:T.text}}>{reg.name}</div>
                  <div style={{fontSize:11,color:T.textTertiary,marginTop:1}}>Updated {reg.updated}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:4,padding:"2px 8px",borderRadius:99,background:reg.status==="live"?T.greenSoft:T.amberSoft}}>
                  <div style={{width:5,height:5,borderRadius:"50%",background:reg.status==="live"?T.green:T.amber}}/>
                  <span style={{fontSize:9.5,fontWeight:600,color:reg.status==="live"?T.green:T.amber,fontFamily:T.mono,textTransform:"capitalize"}}>{reg.status}</span>
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <span style={{fontSize:12,fontFamily:T.mono,color:T.textSecondary}}>{reg.records.toLocaleString()} records</span>
                <span style={{fontSize:11,color:T.textTertiary}}>{reg.fields.length} fields</span>
              </div>
              {expanded&&<div style={{marginTop:14,paddingTop:12,borderTop:`1px solid ${T.borderSubtle}`,animation:"fadeIn 0.2s ease"}}>
                <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:"0.06em",fontFamily:T.mono,color:T.textTertiary,marginBottom:8}}>Fields</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                  {reg.fields.map(f=><span key={f} style={{padding:"3px 10px",borderRadius:99,background:T.surfaceMuted,fontSize:11,color:T.textSecondary,fontFamily:T.mono}}>{f}</span>)}
                </div>
              </div>}
            </div>;
          })}
        </div>
        {filteredTables.length===0&&search&&<div style={{textAlign:"center",padding:"60px 0"}}>
          <div style={{fontSize:13,color:T.textTertiary}}>No tables match "{search}"</div>
        </div>}
      </>}

      {/* ═══ CONNECTORS TAB ═══ */}
      {tab==="connectors"&&<>
        {/* Installed section */}
        {installedConns.length>0&&!search.trim()&&<div style={{marginBottom:32}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
            <span style={{fontSize:12.5,fontWeight:600,color:T.text,letterSpacing:"-0.01em"}}>Installed</span>
            <span style={{padding:"2px 7px",borderRadius:99,background:T.accentSoft,fontSize:10,fontWeight:600,color:T.textSecondary,fontFamily:T.mono}}>{installedConns.length}</span>
          </div>
          <div className="connector-grid">
            {installedConns.map(({conn,cat})=>{
              const st=getConnState(conn.id);
              return<ConnectorCard key={conn.id} conn={conn} cat={cat} isInstalled={true} isConfigured={st.configured} onAction={()=>setConfigPanel({connId:conn.id,catId:cat.id})}/>;
            })}
          </div>
          <div style={{height:1,background:T.borderSubtle,margin:"28px 0 0"}}/>
        </div>}

        {/* Category sections */}
        <div style={{display:"flex",flexDirection:"column",gap:28}}>
          {filteredConnectors.map(cat=><div key={cat.id} style={{animation:"fadeIn 0.3s ease"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
              <div style={{width:5,height:5,borderRadius:"50%",background:cat.color,flexShrink:0}}/>
              <span style={{fontSize:12.5,fontWeight:600,color:T.text,letterSpacing:"-0.01em"}}>{cat.label}</span>
              <span style={{fontSize:10.5,color:T.textTertiary,fontFamily:T.mono}}>{cat.connectors.length}</span>
            </div>
            <div className="connector-grid">
              {cat.connectors.map(conn=>{
                const st=getConnState(conn.id);
                return<ConnectorCard key={conn.id} conn={conn} cat={cat} isInstalled={st.installed} isConfigured={st.configured} onAction={()=>{
                  if(st.installed) setConfigPanel({connId:conn.id,catId:cat.id});
                  else installConn(conn.id);
                }}/>;
              })}
            </div>
          </div>)}
        </div>

        {/* Empty search */}
        {filteredConnectors.length===0&&search&&<div style={{textAlign:"center",padding:"60px 0"}}>
          <div style={{width:48,height:48,borderRadius:12,background:T.surfaceMuted,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.textTertiary} strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
          <div style={{fontSize:13,fontWeight:500,color:T.textSecondary}}>No connectors match "{search}"</div>
          <div style={{fontSize:12,color:T.textTertiary,marginTop:4}}>Try a different search term</div>
        </div>}
      </>}
    </div>

    {/* Connector config panel */}
    {panelData&&<ConnectorConfigPanel conn={panelData.conn} cat={panelData.cat} isConfigured={getConnState(panelData.conn.id).configured} onClose={()=>setConfigPanel(null)} onSave={()=>saveConn(panelData.conn.id)} onDisconnect={()=>disconnectConn(panelData.conn.id)}/>}
  </div>;
}

/* ═══ PEOPLE PAGE ═══ */

const DEPARTMENTS = [
  { id: "ops", name: "Operations", headCount: 24, color: "#3B82F6" },
  { id: "quality", name: "Quality Assurance", headCount: 8, color: "#8B5CF6" },
  { id: "maintenance", name: "Maintenance", headCount: 12, color: "#F59E0B" },
  { id: "safety", name: "Safety & Compliance", headCount: 6, color: "#F43F5E" },
  { id: "logistics", name: "Logistics", headCount: 15, color: "#10B981" },
];

const SITES = [
  { id: "hq", name: "HQ \u2014 Portland", type: "Office", members: 18, color: "#3B82F6" },
  { id: "plant-a", name: "Plant Alpha", type: "Manufacturing", members: 32, color: "#8B5CF6" },
  { id: "plant-b", name: "Plant Beta", type: "Manufacturing", members: 28, color: "#F59E0B" },
  { id: "warehouse", name: "Distribution Center", type: "Warehouse", members: 14, color: "#10B981" },
];

const ROLES = ["Admin", "Manager", "Operator", "Viewer", "Auditor"];

const INITIAL_MEMBERS = [
  { id: 1, name: "Sarah Chen", email: "sarah@rcmarine.com", role: "Admin", dept: "ops", site: "hq", status: "active" },
  { id: 2, name: "Marcus Johnson", email: "marcus@rcmarine.com", role: "Manager", dept: "quality", site: "plant-a", status: "active" },
  { id: 3, name: "Ana Rodriguez", email: "ana@rcmarine.com", role: "Operator", dept: "maintenance", site: "plant-b", status: "active" },
  { id: 4, name: "James Wilson", email: "james@rcmarine.com", role: "Manager", dept: "ops", site: "plant-a", status: "active" },
  { id: 5, name: "Priya Patel", email: "priya@rcmarine.com", role: "Auditor", dept: "safety", site: "hq", status: "active" },
  { id: 6, name: "David Kim", email: "david@rcmarine.com", role: "Operator", dept: "logistics", site: "warehouse", status: "active" },
  { id: 7, name: "Lisa Thompson", email: "lisa@rcmarine.com", role: "Manager", dept: "maintenance", site: "plant-b", status: "active" },
  { id: 8, name: "Carlos Mendez", email: "carlos@rcmarine.com", role: "Operator", dept: "ops", site: "plant-a", status: "active" },
  { id: 9, name: "Emily Foster", email: "emily@rcmarine.com", role: "Viewer", dept: "quality", site: "hq", status: "invited" },
  { id: 10, name: "Robert Chang", email: "robert@rcmarine.com", role: "Operator", dept: "logistics", site: "warehouse", status: "active" },
  { id: 11, name: "Maria Santos", email: "maria@rcmarine.com", role: "Manager", dept: "safety", site: "plant-a", status: "active" },
  { id: 12, name: "Tom Baker", email: "tom@rcmarine.com", role: "Operator", dept: "ops", site: "plant-b", status: "inactive" },
];

const DEPT_MAP = Object.fromEntries(DEPARTMENTS.map(d => [d.id, d]));
const SITE_MAP = Object.fromEntries(SITES.map(s => [s.id, s]));
const TOTAL_HEAD = DEPARTMENTS.reduce((s, d) => s + d.headCount, 0);

/* ── role badge color mapping ── */
const ROLE_STYLES = {
  Admin:    { bg: T.roseSoft,      text: T.rose,    border: T.roseBorder },
  Manager:  { bg: T.violetSoft,    text: T.violet,  border: T.violetBorder },
  Operator: { bg: T.highlightSoft, text: T.highlight, border: T.highlightBorder },
  Viewer:   { bg: T.surfaceMuted,  text: T.textSecondary, border: T.border },
  Auditor:  { bg: T.amberSoft,     text: T.amber,   border: T.amberBorder },
};

/* ── status dot colors ── */
const STATUS_DOT = {
  active:   T.green,
  invited:  T.amber,
  inactive: T.textTertiary,
};
const STATUS_LABEL = {
  active: "Active",
  invited: "Invited",
  inactive: "Inactive",
};

/* ── site type badge colors ── */
const SITE_TYPE_STYLE = {
  Office:        { bg: T.accentSoft,    text: T.accent },
  Manufacturing: { bg: T.violetSoft,    text: T.violet },
  Warehouse:     { bg: T.greenSoft,     text: T.green },
};

/* ── helpers ── */
const initials = (name) => name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

const deptColor = (deptId) => DEPT_MAP[deptId]?.color || T.accent;

/* ═══════════════════════════════════════════════════════
   COMPONENT: PeoplePage
   ═══════════════════════════════════════════════════════ */
const PeoplePage = () => {
  /* ── state ── */
  const [tab, setTab] = useState("members");
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("all");
  const [filterRole, setFilterRole] = useState("all");
  const [filterSite, setFilterSite] = useState("all");
  const [showInvite, setShowInvite] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: "", email: "", role: "Operator", dept: "ops", site: "hq" });
  const [isMobile, setIsMobile] = useState(false);

  /* ── responsive ── */
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 700px)");
    const handler = (e) => setIsMobile(e.matches);
    handler(mq);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /* ── filtered members ── */
  const filtered = useMemo(() => {
    let list = members;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(m => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q));
    }
    if (filterDept !== "all") list = list.filter(m => m.dept === filterDept);
    if (filterRole !== "all") list = list.filter(m => m.role === filterRole);
    if (filterSite !== "all") list = list.filter(m => m.site === filterSite);
    return list;
  }, [members, search, filterDept, filterRole, filterSite]);

  /* ── invite handler ── */
  const handleInvite = useCallback(() => {
    if (!inviteForm.name.trim() || !inviteForm.email.trim()) return;
    const newMember = {
      id: Date.now(),
      name: inviteForm.name.trim(),
      email: inviteForm.email.trim(),
      role: inviteForm.role,
      dept: inviteForm.dept,
      site: inviteForm.site,
      status: "invited",
    };
    setMembers(prev => [...prev, newMember]);
    setInviteForm({ name: "", email: "", role: "Operator", dept: "ops", site: "hq" });
    setShowInvite(false);
  }, [inviteForm]);

  /* ── summary stats ── */
  const totalMembers = members.length;
  const activeDepts = new Set(members.map(m => m.dept)).size;
  const activeSites = new Set(members.map(m => m.site)).size;

  /* ── tab definitions ── */
  const TABS = [
    { key: "members", label: "Members" },
    { key: "departments", label: "Departments" },
    { key: "sites", label: "Sites" },
  ];

  /* ═══ SHARED STYLES ═══ */
  const cardBase = {
    background: T.surface,
    border: `1px solid ${T.border}`,
    borderRadius: T.r,
    overflow: "hidden",
    transition: "box-shadow 0.15s ease",
  };

  /* ═══════════════════════════════════════════════════════
     SUB-RENDER: Select Dropdown
     ═══════════════════════════════════════════════════════ */
  const SelectPill = ({ value, onChange, options, placeholder }) => (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        appearance: "none",
        WebkitAppearance: "none",
        background: value === "all" ? T.surface : T.accentSoft,
        color: value === "all" ? T.textSecondary : T.accent,
        border: `1px solid ${value === "all" ? T.border : T.accent + "44"}`,
        borderRadius: 20,
        padding: "6px 28px 6px 12px",
        fontSize: 13,
        fontFamily: T.sans,
        fontWeight: 600,
        cursor: "pointer",
        outline: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23999'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 10px center",
        transition: "all 0.15s ease",
      }}
    >
      <option value="all">{placeholder}</option>
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );

  /* ═══════════════════════════════════════════════════════
     SUB-RENDER: Members Tab
     ═══════════════════════════════════════════════════════ */
  const renderMembersTab = () => (
    <div>
      {/* ── search + filters ── */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 10,
        alignItems: "center",
        marginBottom: 20,
      }}>
        {/* search */}
        <div style={{
          flex: "1 1 220px",
          position: "relative",
          minWidth: 180,
        }}>
          <div style={{
            position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
            display: "flex", alignItems: "center", pointerEvents: "none", opacity: 0.45,
          }}>
            {IC.filter(T.textSecondary, 14)}
          </div>
          <input
            type="text"
            placeholder="Search people\u2026"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "9px 12px 9px 34px",
              border: `1px solid ${T.border}`,
              borderRadius: T.r,
              fontSize: 14,
              fontFamily: T.sans,
              background: T.surface,
              color: T.text,
              outline: "none",
              transition: "border-color 0.15s",
            }}
            onFocus={e => e.target.style.borderColor = T.accent}
            onBlur={e => e.target.style.borderColor = T.border}
          />
        </div>

        {/* filter pills */}
        <SelectPill
          value={filterDept}
          onChange={setFilterDept}
          placeholder="Department"
          options={DEPARTMENTS.map(d => ({ value: d.id, label: d.name }))}
        />
        <SelectPill
          value={filterRole}
          onChange={setFilterRole}
          placeholder="Role"
          options={ROLES.map(r => ({ value: r, label: r }))}
        />
        <SelectPill
          value={filterSite}
          onChange={setFilterSite}
          placeholder="Site"
          options={SITES.map(s => ({ value: s.id, label: s.name }))}
        />

        {/* clear */}
        {(filterDept !== "all" || filterRole !== "all" || filterSite !== "all" || search) && (
          <button
            onClick={() => { setSearch(""); setFilterDept("all"); setFilterRole("all"); setFilterSite("all"); }}
            style={{
              background: "none",
              border: "none",
              color: T.textTertiary,
              fontSize: 12,
              fontFamily: T.sans,
              cursor: "pointer",
              padding: "6px 8px",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            {IC.x(T.textTertiary, 12)} Clear
          </button>
        )}
      </div>

      {/* ── table ── */}
      <div style={{
        ...cardBase,
        overflow: "hidden",
      }}>
        {/* header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          padding: "10px 16px",
          background: T.surfaceMuted,
          borderBottom: `1px solid ${T.border}`,
          gap: 8,
        }}>
          <div style={{ flex: "2 1 0", minWidth: 0, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: T.textTertiary, fontFamily: T.sans }}>
            Name
          </div>
          <div style={{ flex: "0.8 1 0", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: T.textTertiary, fontFamily: T.sans }}>
            Role
          </div>
          <div style={{ flex: "1 1 0", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: T.textTertiary, fontFamily: T.sans }}>
            Department
          </div>
          {!isMobile && (
            <div style={{ flex: "1 1 0", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: T.textTertiary, fontFamily: T.sans }}>
              Site
            </div>
          )}
          <div style={{ flex: "0.6 1 0", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: T.textTertiary, fontFamily: T.sans, textAlign: "right" }}>
            Status
          </div>
        </div>

        {/* rows */}
        {filtered.length === 0 ? (
          <div style={{
            padding: "40px 16px",
            textAlign: "center",
            color: T.textTertiary,
            fontFamily: T.sans,
            fontSize: 14,
          }}>
            No members match your filters.
          </div>
        ) : (
          filtered.map((m, idx) => {
            const dept = DEPT_MAP[m.dept];
            const site = SITE_MAP[m.site];
            const rs = ROLE_STYLES[m.role] || ROLE_STYLES.Viewer;
            return (
              <div
                key={m.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px 16px",
                  gap: 8,
                  borderBottom: idx < filtered.length - 1 ? `1px solid ${T.borderSubtle}` : "none",
                  cursor: "pointer",
                  transition: "background 0.12s ease",
                }}
                onMouseEnter={e => e.currentTarget.style.background = T.surfaceHover}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                {/* name + avatar */}
                <div style={{ flex: "2 1 0", minWidth: 0, display: "flex", alignItems: "center", gap: 10 }}>
                  {/* avatar */}
                  <div style={{
                    width: 32, height: 32, minWidth: 32,
                    borderRadius: "50%",
                    background: deptColor(m.dept) + "1A",
                    border: `1.5px solid ${deptColor(m.dept)}44`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 700, fontFamily: T.sans,
                    color: deptColor(m.dept),
                  }}>
                    {initials(m.name)}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      fontSize: 14, fontWeight: 600, color: T.text, fontFamily: T.sans,
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}>
                      {m.name}
                    </div>
                    {!isMobile && (
                      <div style={{
                        fontSize: 12, color: T.textTertiary, fontFamily: T.sans,
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      }}>
                        {m.email}
                      </div>
                    )}
                  </div>
                </div>

                {/* role badge */}
                <div style={{ flex: "0.8 1 0" }}>
                  <span style={{
                    display: "inline-block",
                    padding: "3px 10px",
                    borderRadius: 12,
                    fontSize: 12,
                    fontWeight: 600,
                    fontFamily: T.sans,
                    background: rs.bg,
                    color: rs.text,
                    border: `1px solid ${rs.border}`,
                    whiteSpace: "nowrap",
                  }}>
                    {m.role}
                  </span>
                </div>

                {/* department */}
                <div style={{ flex: "1 1 0", display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: dept?.color || T.textTertiary,
                    flexShrink: 0,
                  }} />
                  <span style={{
                    fontSize: 13, color: T.textSecondary, fontFamily: T.sans,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>
                    {dept?.name || m.dept}
                  </span>
                </div>

                {/* site */}
                {!isMobile && (
                  <div style={{ flex: "1 1 0" }}>
                    <span style={{
                      fontSize: 13, color: T.textSecondary, fontFamily: T.sans,
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}>
                      {site?.name || m.site}
                    </span>
                  </div>
                )}

                {/* status */}
                <div style={{ flex: "0.6 1 0", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
                  <div style={{
                    width: 7, height: 7, borderRadius: "50%",
                    background: STATUS_DOT[m.status],
                    flexShrink: 0,
                  }} />
                  <span style={{
                    fontSize: 12, color: T.textSecondary, fontFamily: T.sans,
                  }}>
                    {STATUS_LABEL[m.status]}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── row count ── */}
      <div style={{
        marginTop: 12,
        fontSize: 12,
        color: T.textTertiary,
        fontFamily: T.sans,
        textAlign: "right",
      }}>
        Showing {filtered.length} of {members.length} members
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════════════════
     SUB-RENDER: Departments Tab
     ═══════════════════════════════════════════════════════ */
  const renderDepartmentsTab = () => (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: 16,
    }}>
      {DEPARTMENTS.map(dept => {
        const deptMembers = members.filter(m => m.dept === dept.id);
        const proportion = dept.headCount / TOTAL_HEAD;
        return (
          <div key={dept.id} style={{
            ...cardBase,
            display: "flex",
            flexDirection: "column",
          }}>
            {/* color bar */}
            <div style={{ height: 4, background: dept.color, flexShrink: 0 }} />

            <div style={{ padding: "20px 20px 18px" }}>
              {/* name */}
              <div style={{
                fontFamily: T.serif,
                fontSize: 17,
                fontWeight: 600,
                color: T.text,
                marginBottom: 14,
              }}>
                {dept.name}
              </div>

              {/* head count */}
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 6 }}>
                <span style={{
                  fontFamily: T.mono,
                  fontSize: 32,
                  fontWeight: 700,
                  color: T.text,
                  lineHeight: 1,
                }}>
                  {dept.headCount}
                </span>
                <span style={{
                  fontSize: 13,
                  color: T.textTertiary,
                  fontFamily: T.sans,
                }}>
                  members
                </span>
              </div>

              {/* proportion bar */}
              <div style={{
                height: 6,
                background: T.surfaceMuted,
                borderRadius: 3,
                overflow: "hidden",
                marginBottom: 16,
              }}>
                <div style={{
                  height: "100%",
                  width: `${proportion * 100}%`,
                  background: dept.color,
                  borderRadius: 3,
                  transition: "width 0.4s ease",
                }} />
              </div>

              {/* percentage label */}
              <div style={{
                fontSize: 11,
                color: T.textTertiary,
                fontFamily: T.sans,
                marginBottom: 14,
              }}>
                {Math.round(proportion * 100)}% of organization
              </div>

              {/* member chips */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {deptMembers.slice(0, 3).map(m => (
                  <span key={m.id} style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "3px 10px 3px 4px",
                    borderRadius: 14,
                    background: T.surfaceMuted,
                    fontSize: 12,
                    color: T.textSecondary,
                    fontFamily: T.sans,
                  }}>
                    <span style={{
                      width: 20, height: 20,
                      borderRadius: "50%",
                      background: dept.color + "22",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 9, fontWeight: 700, color: dept.color,
                      fontFamily: T.sans,
                    }}>
                      {initials(m.name)}
                    </span>
                    {m.name.split(" ")[0]}
                  </span>
                ))}
                {deptMembers.length > 3 && (
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "3px 10px",
                    borderRadius: 14,
                    background: T.surfaceMuted,
                    fontSize: 12,
                    color: T.textTertiary,
                    fontFamily: T.sans,
                  }}>
                    +{deptMembers.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  /* ═══════════════════════════════════════════════════════
     SUB-RENDER: Sites Tab
     ═══════════════════════════════════════════════════════ */
  const renderSitesTab = () => (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: 16,
    }}>
      {SITES.map(site => {
        const siteMembers = members.filter(m => m.site === site.id);
        const siteDepts = [...new Set(siteMembers.map(m => m.dept))];
        const ts = SITE_TYPE_STYLE[site.type] || SITE_TYPE_STYLE.Office;
        return (
          <div key={site.id} style={{
            ...cardBase,
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}>
            {/* header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: T.rSm,
                background: site.color + "14",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                {site.type === "Office"
                  ? IC.building(site.color, 18)
                  : IC.globe(site.color, 18)
                }
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontFamily: T.serif,
                  fontSize: 16,
                  fontWeight: 600,
                  color: T.text,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}>
                  {site.name}
                </div>
              </div>
            </div>

            {/* type badge + member count */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{
                display: "inline-block",
                padding: "3px 10px",
                borderRadius: 12,
                fontSize: 11,
                fontWeight: 600,
                fontFamily: T.sans,
                background: ts.bg,
                color: ts.text,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}>
                {site.type}
              </span>
              <span style={{
                fontSize: 13,
                color: T.textSecondary,
                fontFamily: T.sans,
              }}>
                {site.members} members
              </span>
            </div>

            {/* departments represented */}
            <div>
              <div style={{
                fontSize: 11,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: T.textTertiary,
                fontFamily: T.sans,
                marginBottom: 8,
              }}>
                Departments
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
                {siteDepts.map(dId => {
                  const d = DEPT_MAP[dId];
                  return (
                    <div key={dId} style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "3px 10px",
                      borderRadius: 12,
                      background: T.surfaceMuted,
                      fontSize: 12,
                      color: T.textSecondary,
                      fontFamily: T.sans,
                    }}>
                      <div style={{
                        width: 7, height: 7, borderRadius: "50%",
                        background: d?.color || T.textTertiary,
                        flexShrink: 0,
                      }} />
                      {d?.name || dId}
                    </div>
                  );
                })}
                {siteDepts.length === 0 && (
                  <span style={{ fontSize: 12, color: T.textTertiary, fontFamily: T.sans }}>
                    None assigned
                  </span>
                )}
              </div>
            </div>

            {/* member list preview */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 0,
              marginTop: 2,
            }}>
              {siteMembers.slice(0, 5).map((m, i) => (
                <div key={m.id} style={{
                  width: 28, height: 28,
                  borderRadius: "50%",
                  background: deptColor(m.dept) + "22",
                  border: `2px solid ${T.surface}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 700, fontFamily: T.sans,
                  color: deptColor(m.dept),
                  marginLeft: i > 0 ? -8 : 0,
                  position: "relative",
                  zIndex: 5 - i,
                }}>
                  {initials(m.name)}
                </div>
              ))}
              {siteMembers.length > 5 && (
                <div style={{
                  width: 28, height: 28,
                  borderRadius: "50%",
                  background: T.surfaceMuted,
                  border: `2px solid ${T.surface}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 600, fontFamily: T.sans,
                  color: T.textTertiary,
                  marginLeft: -8,
                }}>
                  +{siteMembers.length - 5}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  /* ═══════════════════════════════════════════════════════
     SUB-RENDER: Invite Modal
     ═══════════════════════════════════════════════════════ */
  const renderInviteModal = () => {
    if (!showInvite) return null;

    const fieldLabel = {
      fontSize: 12,
      fontWeight: 600,
      color: T.textSecondary,
      fontFamily: T.sans,
      marginBottom: 5,
      textTransform: "uppercase",
      letterSpacing: "0.04em",
    };
    const fieldInput = {
      width: "100%",
      boxSizing: "border-box",
      padding: "10px 12px",
      border: `1px solid ${T.border}`,
      borderRadius: T.rSm,
      fontSize: 14,
      fontFamily: T.sans,
      background: T.surface,
      color: T.text,
      outline: "none",
      transition: "border-color 0.15s",
    };
    const fieldSelect = {
      ...fieldInput,
      appearance: "none",
      WebkitAppearance: "none",
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23999'/%3E%3C/svg%3E")`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 12px center",
      cursor: "pointer",
    };

    return (
      <div
        onClick={() => setShowInvite(false)}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.35)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: 20,
        }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: T.r,
            width: "100%",
            maxWidth: 460,
            boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
            overflow: "hidden",
          }}
        >
          {/* modal header */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 22px",
            borderBottom: `1px solid ${T.border}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: T.rSm,
                background: T.accentSoft,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {IC.userPlus(T.accent, 16)}
              </div>
              <div>
                <div style={{
                  fontFamily: T.serif,
                  fontSize: 17,
                  fontWeight: 600,
                  color: T.text,
                }}>
                  Invite Team Member
                </div>
                <div style={{
                  fontSize: 12,
                  color: T.textTertiary,
                  fontFamily: T.sans,
                }}>
                  They'll receive an email invitation
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowInvite(false)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 6,
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: T.textTertiary,
              }}
            >
              {IC.x(T.textTertiary, 18)}
            </button>
          </div>

          {/* modal body */}
          <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 16 }}>
            {/* name */}
            <div>
              <div style={fieldLabel}>Full Name</div>
              <input
                type="text"
                placeholder="e.g. Jane Doe"
                value={inviteForm.name}
                onChange={e => setInviteForm(prev => ({ ...prev, name: e.target.value }))}
                style={fieldInput}
                onFocus={e => e.target.style.borderColor = T.accent}
                onBlur={e => e.target.style.borderColor = T.border}
              />
            </div>

            {/* email */}
            <div>
              <div style={fieldLabel}>Email Address</div>
              <input
                type="email"
                placeholder="e.g. jane@rcmarine.com"
                value={inviteForm.email}
                onChange={e => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                style={fieldInput}
                onFocus={e => e.target.style.borderColor = T.accent}
                onBlur={e => e.target.style.borderColor = T.border}
              />
            </div>

            {/* role + dept row */}
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={fieldLabel}>Role</div>
                <select
                  value={inviteForm.role}
                  onChange={e => setInviteForm(prev => ({ ...prev, role: e.target.value }))}
                  style={fieldSelect}
                >
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <div style={fieldLabel}>Department</div>
                <select
                  value={inviteForm.dept}
                  onChange={e => setInviteForm(prev => ({ ...prev, dept: e.target.value }))}
                  style={fieldSelect}
                >
                  {DEPARTMENTS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
            </div>

            {/* site */}
            <div>
              <div style={fieldLabel}>Site</div>
              <select
                value={inviteForm.site}
                onChange={e => setInviteForm(prev => ({ ...prev, site: e.target.value }))}
                style={fieldSelect}
              >
                {SITES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>

          {/* modal footer */}
          <div style={{
            padding: "16px 22px",
            borderTop: `1px solid ${T.border}`,
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
          }}>
            <button
              onClick={() => setShowInvite(false)}
              style={{
                padding: "9px 18px",
                borderRadius: T.rSm,
                border: `1px solid ${T.border}`,
                background: T.surface,
                color: T.textSecondary,
                fontFamily: T.sans,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={e => e.target.style.background = T.surfaceMuted}
              onMouseLeave={e => e.target.style.background = T.surface}
            >
              Cancel
            </button>
            <button
              onClick={handleInvite}
              disabled={!inviteForm.name.trim() || !inviteForm.email.trim()}
              style={{
                padding: "9px 20px",
                borderRadius: T.rSm,
                border: "none",
                background: (!inviteForm.name.trim() || !inviteForm.email.trim()) ? T.surfaceMuted : T.accent,
                color: (!inviteForm.name.trim() || !inviteForm.email.trim()) ? T.textTertiary : "#fff",
                fontFamily: T.sans,
                fontSize: 13,
                fontWeight: 600,
                cursor: (!inviteForm.name.trim() || !inviteForm.email.trim()) ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.15s",
              }}
            >
              {IC.userPlus("#fff", 14)}
              Send Invite
            </button>
          </div>
        </div>
      </div>
    );
  };

  /* ═══════════════════════════════════════════════════════
     MAIN RENDER
     ═══════════════════════════════════════════════════════ */
  return (
    <div style={{
      maxWidth: 960,
      margin: "0 auto",
      padding: isMobile ? "24px 16px 60px" : "32px 24px 80px",
    }}>
      {/* ── page header ── */}
      <div style={{
        display: "flex",
        alignItems: isMobile ? "flex-start" : "flex-end",
        justifyContent: "space-between",
        flexDirection: isMobile ? "column" : "row",
        gap: isMobile ? 14 : 0,
        marginBottom: 28,
      }}>
        <div>
          <h1 style={{
            fontFamily: T.serif,
            fontSize: 30,
            fontWeight: 700,
            color: T.text,
            margin: 0,
            lineHeight: 1.2,
          }}>
            People
          </h1>
          <p style={{
            fontFamily: T.sans,
            fontSize: 14,
            color: T.textTertiary,
            margin: "6px 0 0",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}>
            <span style={{ color: T.textSecondary, fontWeight: 600 }}>{totalMembers}</span> members
            <span style={{ color: T.borderSubtle }}>&middot;</span>
            <span style={{ color: T.textSecondary, fontWeight: 600 }}>{activeDepts}</span> departments
            <span style={{ color: T.borderSubtle }}>&middot;</span>
            <span style={{ color: T.textSecondary, fontWeight: 600 }}>{activeSites}</span> sites
          </p>
        </div>

        <button
          onClick={() => setShowInvite(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "9px 20px",
            borderRadius: 24,
            border: "none",
            background: T.accent,
            color: "#fff",
            fontFamily: T.sans,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            transition: "transform 0.12s, box-shadow 0.15s",
            boxShadow: `0 2px 8px ${T.accent}33`,
            flexShrink: 0,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = `0 4px 14px ${T.accent}44`;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = `0 2px 8px ${T.accent}33`;
          }}
        >
          {IC.userPlus("#fff", 15)}
          Invite
        </button>
      </div>

      {/* ── tab bar ── */}
      <div style={{
        display: "flex",
        gap: 0,
        borderBottom: `2px solid ${T.border}`,
        marginBottom: 24,
      }}>
        {TABS.map(t => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                position: "relative",
                padding: "10px 20px 12px",
                border: "none",
                background: "none",
                fontFamily: T.sans,
                fontSize: 14,
                fontWeight: active ? 700 : 500,
                color: active ? T.accent : T.textTertiary,
                cursor: "pointer",
                transition: "color 0.15s",
              }}
              onMouseEnter={e => { if (!active) e.target.style.color = T.textSecondary; }}
              onMouseLeave={e => { if (!active) e.target.style.color = T.textTertiary; }}
            >
              {t.label}
              {/* underline indicator */}
              <div style={{
                position: "absolute",
                bottom: -2,
                left: 0,
                right: 0,
                height: 2,
                background: active ? T.accent : "transparent",
                borderRadius: "1px 1px 0 0",
                transition: "background 0.2s ease",
              }} />
            </button>
          );
        })}
      </div>

      {/* ── tab content ── */}
      {tab === "members" && renderMembersTab()}
      {tab === "departments" && renderDepartmentsTab()}
      {tab === "sites" && renderSitesTab()}

      {/* ── invite modal ── */}
      {renderInviteModal()}
    </div>
  );
};

/* ═══ CATALOG PAGE ═══ */

const APP_ICON_MAP = {
  "food-safety": (c, s) => IC.shield(c, s),
  "fleet-ops": (c, s) => IC.asset(c, s),
  "quality-mgmt": (c, s) => IC.check(c, s),
  "safety-compliance": (c, s) => IC.target(c, s),
  "mfg-maintenance": (c, s) => IC.bolt(c, s),
  "mfg-shift-mgmt": (c, s) => IC.clock(c, s),
  "production-ops": (c, s) => IC.chart(c, s),
  "mfg-inventory-mgmt": (c, s) => IC.catalog(c, s),
  "mfg-training-ops": (c, s) => IC.people(c, s),
  "qsr-shift-mgmt": (c, s) => IC.clock(c, s),
  "qsr-inventory-mgmt": (c, s) => IC.catalog(c, s),
  "qsr-training-ops": (c, s) => IC.people(c, s),
  "delivery-ops": (c, s) => IC.send(c, s),
  "restaurant-ops": (c, s) => IC.building(c, s),
  "dock-ops": (c, s) => IC.grid(c, s),
  "delivery-tracking": (c, s) => IC.globe(c, s),
  "route-ops": (c, s) => IC.workflow(c, s),
  "tl-inventory-mgmt": (c, s) => IC.catalog(c, s),
  /* Legacy fallback IDs */
  "shift-mgmt": (c, s) => IC.clock(c, s),
  "maintenance": (c, s) => IC.bolt(c, s),
  "training-ops": (c, s) => IC.people(c, s),
  "inventory-mgmt": (c, s) => IC.catalog(c, s),
};

const INDUSTRY_LABELS = {
  qsr: "Quick Service Restaurant",
  "transport-logistics": "Transport & Logistics",
  manufacturing: "Manufacturing",
};

const AI_BUILD_STEPS = [
  { label: "Understanding requirements", icon: "search" },
  { label: "Designing workflows", icon: "workflow" },
  { label: "Configuring dashboards", icon: "chart" },
  { label: "Setting up connectors", icon: "connector" },
  { label: "Finalising app", icon: "sparkle" },
];

const AI_PROMPT_SUGGESTIONS = [
  { label: "Visitor management", prompt: "I need a visitor management app with check-in/check-out workflows, badge printing, and a visitor log dashboard" },
  { label: "Change management", prompt: "Build me a change management app to track engineering change requests with approval workflows and impact analysis" },
  { label: "Supplier onboarding", prompt: "Create an app for onboarding new suppliers with qualification checklists, document collection, and compliance scoring" },
  { label: "Equipment calibration", prompt: "I need an equipment calibration tracking app with scheduling workflows, certificate management, and due date alerts" },
];

/* ── AI app generator (prototype — keyword-based) ── */
const generateAppFromPrompt = (prompt, industry) => {
  const lower = prompt.toLowerCase();
  const words = prompt.split(/\s+/).filter(w => w.length > 3);
  /* Derive a name from the prompt */
  const nameWords = words.slice(0, 3).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  const appName = nameWords.join(" ").replace(/[^a-zA-Z0-9 &-]/g, "").trim() || "Custom App";
  const appId = "ai-" + Date.now();
  /* Pick a colour based on prompt hash */
  const colors = [T.violet, T.highlight, T.green, T.accent, T.rose, T.amber];
  const hash = prompt.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const color = colors[hash % colors.length];
  /* Generate workflows from keywords */
  const wfKeywords = ["checklist", "inspection", "audit", "review", "approval", "report", "check-in", "check-out", "onboarding", "tracking", "scheduling", "calibration", "submission", "collection", "assessment"];
  const matchedWfs = wfKeywords.filter(kw => lower.includes(kw)).slice(0, 3);
  if (matchedWfs.length === 0) matchedWfs.push("primary workflow", "review & approval");
  const workflows = matchedWfs.map((kw, i) => ({
    id: `wf-ai-${i}`,
    name: kw.split(/[-\s]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") + " Flow",
    desc: `AI-generated ${kw} process`,
    steps: 4 + Math.floor(Math.random() * 8),
  }));
  /* Generate dashboards */
  const dashboards = [
    { id: "db-ai-0", name: appName + " Overview", desc: "Key metrics and status summary" },
  ];
  if (lower.includes("compliance") || lower.includes("score") || lower.includes("tracking")) {
    dashboards.push({ id: "db-ai-1", name: "Compliance Scorecard", desc: "Compliance and trend tracking" });
  }
  /* Pick connectors */
  const connectorMap = { "visitor": ["access-control"], "supplier": ["erp", "crm"], "equipment": ["cmms", "mes"], "calibration": ["cmms"], "change": ["erp", "qms"], "quality": ["qms", "mes"], "safety": ["ehs"], "fleet": ["telematics", "tms"] };
  let reqConnectors = [];
  Object.entries(connectorMap).forEach(([kw, cIds]) => {
    if (lower.includes(kw)) reqConnectors.push(...cIds);
  });
  if (reqConnectors.length === 0) reqConnectors = ["erp"];
  reqConnectors = [...new Set(reqConnectors)].slice(0, 3);

  return {
    id: appId,
    name: appName,
    description: prompt.length > 120 ? prompt.slice(0, 117) + "..." : prompt,
    color,
    category: "AI Generated",
    industry: industry || "manufacturing",
    goalIds: [],
    workflows,
    dashboards,
    requiredConnectors: reqConnectors,
    aiGenerated: true,
  };
};

const CatalogPage = ({ installedApps, setInstalledApps, onNavigate, industry, addedConnectors }) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [confirmUninstall, setConfirmUninstall] = useState(null);
  const [animatedCards, setAnimatedCards] = useState(new Set());
  const [justInstalled, setJustInstalled] = useState(null);
  const cardTimers = useRef([]);

  /* ── AI Builder state ── */
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiBuilding, setAiBuilding] = useState(false);
  const [aiBuildStep, setAiBuildStep] = useState(-1);
  const [aiGeneratedApps, setAiGeneratedApps] = useState([]);
  const [aiShowResult, setAiShowResult] = useState(null);
  const aiInputRef = useRef(null);

  /* ── Industry-filtered apps from APP_CATALOG ── */
  const apps = useMemo(() => getAppsByIndustry(industry || "manufacturing"), [industry]);

  const connectorSet = useMemo(() => new Set(addedConnectors || []), [addedConnectors]);

  /* ── Derive categories dynamically from available apps ── */
  const categories = useMemo(() => {
    const cats = new Set();
    apps.forEach(a => cats.add(a.category));
    return ["All", ...Array.from(cats).sort()];
  }, [apps]);

  const categoryCount = useMemo(() => {
    const counts = { All: apps.length };
    apps.forEach(a => {
      counts[a.category] = (counts[a.category] || 0) + 1;
    });
    return counts;
  }, [apps]);

  /* ── Category-filtered subset ── */
  const filteredApps = useMemo(() => {
    if (activeCategory === "All") return apps;
    return apps.filter(a => a.category === activeCategory);
  }, [activeCategory, apps]);

  /* ── Reset category when industry changes ── */
  useEffect(() => {
    setActiveCategory("All");
  }, [industry]);

  // Stagger card animations on mount and filter change
  useEffect(() => {
    setAnimatedCards(new Set());
    cardTimers.current.forEach(t => clearTimeout(t));
    cardTimers.current = [];
    filteredApps.forEach((app, i) => {
      const timer = setTimeout(() => {
        setAnimatedCards(prev => new Set([...prev, app.id]));
      }, i * 60);
      cardTimers.current.push(timer);
    });
    return () => cardTimers.current.forEach(t => clearTimeout(t));
  }, [activeCategory, industry]);

  const installedSet = useMemo(() => new Set(installedApps), [installedApps]);

  const installedAppObjects = useMemo(
    () => [...apps, ...aiGeneratedApps].filter(a => installedSet.has(a.id)),
    [apps, aiGeneratedApps, installedSet]
  );

  /* ── Goal name lookup helper ── */
  const goalNameMap = useMemo(() => {
    const m = {};
    OPERATIONAL_GOALS.forEach(g => { m[g.id] = g; });
    return m;
  }, []);

  const handleInstall = useCallback((appId) => {
    setInstalledApps(prev => [...prev, appId]);
    setJustInstalled(appId);
    setTimeout(() => setJustInstalled(null), 1200);
  }, [setInstalledApps]);

  const handleUninstall = useCallback((appId) => {
    setInstalledApps(prev => prev.filter(id => id !== appId));
    setConfirmUninstall(null);
  }, [setInstalledApps]);

  /* ── AI Builder: kick off build ── */
  const handleAiBuild = useCallback(() => {
    if (!aiPrompt.trim() || aiBuilding) return;
    setAiBuilding(true);
    setAiBuildStep(0);
    setAiShowResult(null);
  }, [aiPrompt, aiBuilding]);

  /* ── AI Builder: step through build animation ── */
  useEffect(() => {
    if (!aiBuilding || aiBuildStep < 0) return;
    if (aiBuildStep >= AI_BUILD_STEPS.length) {
      /* Build complete — generate the app */
      const generated = generateAppFromPrompt(aiPrompt, industry);
      setAiGeneratedApps(prev => [generated, ...prev]);
      setAiShowResult(generated.id);
      setAiBuilding(false);
      setAiBuildStep(-1);
      setAiPrompt("");
      return;
    }
    const delay = 600 + Math.random() * 500;
    const timer = setTimeout(() => setAiBuildStep(s => s + 1), delay);
    return () => clearTimeout(timer);
  }, [aiBuilding, aiBuildStep]);

  /* ── Merge AI-generated apps into filtered list ── */
  const allApps = useMemo(() => [...aiGeneratedApps, ...filteredApps], [aiGeneratedApps, filteredApps]);

  return (
    <div style={{
      minHeight: "100vh",
      background: T.bg,
      overflowY: "auto",
      paddingBottom: 80,
    }}>
      {/* ── Fade-in keyframes injection ── */}
      <style>{`
        @keyframes catalogCardIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes catalogPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes catalogCheckPop {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes catalogShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      <div style={{
        maxWidth: 960,
        margin: "0 auto",
        padding: "40px 32px",
      }}>

        {/* ═══ PAGE HEADER ═══ */}
        <div style={{ marginBottom: 32 }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 8,
          }}>
            <div style={{
              width: 40, height: 40,
              borderRadius: T.rSm,
              background: T.accentSoft,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {IC.catalog(T.accent, 20)}
            </div>
            <h1 style={{
              fontFamily: T.serif,
              fontSize: 28,
              fontWeight: 700,
              color: T.text,
              margin: 0,
              letterSpacing: "-0.02em",
            }}>
              App Catalog
            </h1>
          </div>

          <p style={{
            fontFamily: T.sans,
            fontSize: 14,
            color: T.textSecondary,
            margin: "8px 0 0 0",
            lineHeight: 1.55,
            maxWidth: 560,
          }}>
            Pre-built solutions with dashboards and workflows. Install an app to add it to your workspace.
          </p>

          <div style={{
            display: "flex",
            gap: 6,
            alignItems: "center",
            marginTop: 12,
            fontFamily: T.mono,
            fontSize: 12,
            color: T.textTertiary,
          }}>
            <span style={{
              background: T.surfaceMuted,
              padding: "3px 10px",
              borderRadius: 20,
            }}>
              {apps.length} apps available
            </span>
            <span style={{ color: T.borderSubtle }}>&middot;</span>
            <span style={{
              background: installedApps.length > 0 ? T.greenSoft : T.surfaceMuted,
              color: installedApps.length > 0 ? T.green : T.textTertiary,
              padding: "3px 10px",
              borderRadius: 20,
            }}>
              {installedApps.length} installed
            </span>
          </div>
        </div>

        {/* ═══ AI APP BUILDER ═══ */}
        <div style={{
          marginBottom: 28,
          background: `linear-gradient(135deg, ${T.violetSoft}, ${T.accentSoft})`,
          borderRadius: T.r,
          border: `1px solid ${T.violetBorder}`,
          padding: "24px 24px 20px",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Subtle grid pattern */}
          <div style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `radial-gradient(${T.violet}08 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
            pointerEvents: "none",
          }} />

          <div style={{ position: "relative" }}>
            {/* Header row */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 8,
            }}>
              <div style={{
                width: 32, height: 32,
                borderRadius: 8,
                background: T.violet + "20",
                border: `1px solid ${T.violetBorder}`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {IC.sparkle(T.violet, 16)}
              </div>
              <div>
                <span style={{
                  fontFamily: T.serif,
                  fontSize: 16,
                  fontWeight: 700,
                  color: T.text,
                  letterSpacing: "-0.01em",
                }}>
                  Create with AI
                </span>
                <span style={{
                  fontFamily: T.mono,
                  fontSize: 10,
                  color: T.violet,
                  background: T.violet + "15",
                  padding: "2px 7px",
                  borderRadius: 6,
                  marginLeft: 8,
                  fontWeight: 600,
                }}>
                  NEW
                </span>
              </div>
            </div>

            <p style={{
              fontFamily: T.sans,
              fontSize: 13,
              color: T.textSecondary,
              margin: "0 0 16px 0",
              lineHeight: 1.5,
              maxWidth: 480,
            }}>
              Describe what you need and AI will design a custom app with workflows, dashboards, and connector requirements.
            </p>

            {/* ── Building animation ── */}
            {aiBuilding && (
              <div style={{
                background: T.surface,
                borderRadius: 10,
                border: `1px solid ${T.borderSubtle}`,
                padding: "16px 20px",
                marginBottom: 14,
              }}>
                <div style={{
                  fontFamily: T.sans,
                  fontSize: 12,
                  fontWeight: 600,
                  color: T.text,
                  marginBottom: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}>
                  <span style={{
                    display: "inline-block",
                    width: 8, height: 8,
                    borderRadius: "50%",
                    background: T.violet,
                    animation: "catalogPulse 1s ease infinite",
                  }} />
                  Building your app...
                </div>
                {AI_BUILD_STEPS.map((step, i) => {
                  const done = i < aiBuildStep;
                  const active = i === aiBuildStep;
                  const pending = i > aiBuildStep;
                  return (
                    <div key={i} style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "5px 0",
                      opacity: pending ? 0.35 : 1,
                      transition: "all 0.3s ease",
                    }}>
                      {done ? (
                        <div style={{
                          width: 18, height: 18,
                          borderRadius: "50%",
                          background: T.greenSoft,
                          border: `1.5px solid ${T.green}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          {IC.check(T.green, 10)}
                        </div>
                      ) : active ? (
                        <div style={{
                          width: 18, height: 18,
                          borderRadius: "50%",
                          background: T.violetSoft,
                          border: `1.5px solid ${T.violet}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          animation: "catalogPulse 1s ease infinite",
                        }}>
                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.violet }} />
                        </div>
                      ) : (
                        <div style={{
                          width: 18, height: 18,
                          borderRadius: "50%",
                          border: `1.5px solid ${T.borderSubtle}`,
                        }} />
                      )}
                      <span style={{
                        fontFamily: T.sans,
                        fontSize: 12.5,
                        color: done ? T.green : active ? T.text : T.textTertiary,
                        fontWeight: active ? 600 : 400,
                      }}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── Result just created ── */}
            {aiShowResult && !aiBuilding && (() => {
              const gen = aiGeneratedApps.find(a => a.id === aiShowResult);
              if (!gen) return null;
              return (
                <div style={{
                  background: T.surface,
                  borderRadius: 10,
                  border: `1px solid ${T.greenBorder}`,
                  padding: "16px 20px",
                  marginBottom: 14,
                  animation: "catalogCardIn 0.4s ease",
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 10,
                  }}>
                    {IC.check(T.green, 14)}
                    <span style={{
                      fontFamily: T.sans,
                      fontSize: 13,
                      fontWeight: 600,
                      color: T.green,
                    }}>
                      App ready!
                    </span>
                  </div>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}>
                    <div style={{
                      width: 40, height: 40,
                      borderRadius: 10,
                      background: gen.color + "15",
                      border: `1px solid ${gen.color}20`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      {IC.sparkle(gen.color, 18)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: T.serif, fontSize: 15, fontWeight: 600, color: T.text }}>
                        {gen.name}
                      </div>
                      <div style={{ fontFamily: T.sans, fontSize: 12, color: T.textSecondary, marginTop: 2 }}>
                        {gen.workflows.length} workflow{gen.workflows.length !== 1 ? "s" : ""} &middot; {gen.dashboards.length} dashboard{gen.dashboards.length !== 1 ? "s" : ""}
                      </div>
                    </div>
                    {!installedSet.has(gen.id) ? (
                      <button
                        onClick={() => { handleInstall(gen.id); setAiShowResult(null); }}
                        style={{
                          display: "flex", alignItems: "center", gap: 5,
                          padding: "7px 18px",
                          borderRadius: 20,
                          border: `1.5px solid ${T.accent}`,
                          background: T.accent,
                          color: "#fff",
                          fontFamily: T.sans,
                          fontSize: 12.5,
                          fontWeight: 600,
                          cursor: "pointer",
                          outline: "none",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                      >
                        {IC.plus("#fff", 12)}
                        Install
                      </button>
                    ) : (
                      <span style={{
                        display: "flex", alignItems: "center", gap: 5,
                        fontFamily: T.sans, fontSize: 12, fontWeight: 600, color: T.green,
                      }}>
                        {IC.check(T.green, 13)} Installed
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setAiShowResult(null)}
                    style={{
                      marginTop: 10,
                      fontFamily: T.sans, fontSize: 11.5, color: T.textTertiary,
                      background: "none", border: "none", cursor: "pointer",
                      padding: 0, textDecoration: "underline", textUnderlineOffset: 2,
                    }}
                  >
                    Dismiss
                  </button>
                </div>
              );
            })()}

            {/* ── Input row ── */}
            {!aiBuilding && (
              <>
                <div style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                }}>
                  <div style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    background: T.surface,
                    border: `1px solid ${T.border}`,
                    borderRadius: 10,
                    padding: "4px 4px 4px 14px",
                    transition: "border-color 0.2s",
                  }}
                    onFocus={() => {}}
                  >
                    {IC.sparkle(T.textTertiary, 14)}
                    <input
                      ref={aiInputRef}
                      type="text"
                      placeholder="Describe an app you want to create..."
                      value={aiPrompt}
                      onChange={e => setAiPrompt(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") handleAiBuild(); }}
                      style={{
                        flex: 1,
                        border: "none",
                        outline: "none",
                        background: "transparent",
                        fontFamily: T.sans,
                        fontSize: 13,
                        color: T.text,
                        padding: "9px 0",
                      }}
                    />
                    <button
                      onClick={handleAiBuild}
                      disabled={!aiPrompt.trim()}
                      style={{
                        width: 34, height: 34,
                        borderRadius: 8,
                        border: "none",
                        background: aiPrompt.trim() ? T.violet : T.surfaceMuted,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: aiPrompt.trim() ? "pointer" : "default",
                        transition: "all 0.2s",
                        flexShrink: 0,
                      }}
                    >
                      {IC.send(aiPrompt.trim() ? "#fff" : T.textTertiary, 14)}
                    </button>
                  </div>
                </div>

                {/* Suggestion chips */}
                <div style={{
                  display: "flex",
                  gap: 6,
                  flexWrap: "wrap",
                  marginTop: 12,
                }}>
                  {AI_PROMPT_SUGGESTIONS.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => { setAiPrompt(s.prompt); aiInputRef.current?.focus(); }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        padding: "5px 12px",
                        borderRadius: 20,
                        border: `1px solid ${T.violetBorder}`,
                        background: T.surface,
                        color: T.violet,
                        fontFamily: T.sans,
                        fontSize: 11.5,
                        fontWeight: 500,
                        cursor: "pointer",
                        outline: "none",
                        transition: "all 0.2s ease",
                        whiteSpace: "nowrap",
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = T.violetSoft;
                        e.currentTarget.style.borderColor = T.violet + "40";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = T.surface;
                        e.currentTarget.style.borderColor = T.violetBorder;
                      }}
                    >
                      {IC.sparkle(T.violet, 10)}
                      {s.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* AI-generated count badge */}
          {aiGeneratedApps.length > 0 && (
            <div style={{
              position: "absolute",
              top: 14,
              right: 16,
              fontFamily: T.mono,
              fontSize: 10,
              color: T.violet,
              background: T.surface,
              border: `1px solid ${T.violetBorder}`,
              padding: "3px 9px",
              borderRadius: 20,
            }}>
              {aiGeneratedApps.length} AI-created
            </div>
          )}
        </div>

        {/* ═══ INSTALLED APPS CALLOUT ═══ */}
        {installedAppObjects.length > 0 && (
          <div style={{
            marginBottom: 28,
            background: T.surfaceMuted,
            borderRadius: T.r,
            border: `1px solid ${T.borderSubtle}`,
            padding: "16px 20px",
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}>
              <span style={{
                fontFamily: T.sans,
                fontSize: 12,
                fontWeight: 600,
                color: T.textSecondary,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}>
                Installed Apps
              </span>
              <span style={{
                fontFamily: T.mono,
                fontSize: 11,
                color: T.textTertiary,
              }}>
                {installedAppObjects.length} active
              </span>
            </div>
            <div style={{
              display: "flex",
              gap: 10,
              overflowX: "auto",
              paddingBottom: 4,
              scrollbarWidth: "thin",
            }}>
              {installedAppObjects.map(app => (
                <div
                  key={app.id}
                  onClick={() => onNavigate && onNavigate(app.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    background: T.surface,
                    border: `1px solid ${T.borderSubtle}`,
                    borderRadius: T.rSm,
                    padding: "10px 14px",
                    cursor: "pointer",
                    minWidth: "fit-content",
                    whiteSpace: "nowrap",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = app.color + "60";
                    e.currentTarget.style.boxShadow = `0 2px 8px ${app.color}15`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = T.borderSubtle;
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{
                    width: 28, height: 28,
                    borderRadius: 6,
                    background: app.color + "18",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    {app.aiGenerated ? IC.sparkle(app.color, 14) : APP_ICON_MAP[app.id]?.(app.color, 14)}
                  </div>
                  <span style={{
                    fontFamily: T.sans,
                    fontSize: 13,
                    fontWeight: 600,
                    color: T.text,
                  }}>
                    {app.name}
                  </span>
                  <span style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    fontFamily: T.sans,
                    fontSize: 11,
                    color: T.accent,
                    fontWeight: 600,
                  }}>
                    Open {IC.chevRight(T.accent, 10)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ CATEGORY FILTER PILLS ═══ */}
        <div style={{
          display: "flex",
          gap: 6,
          flexWrap: "wrap",
          marginBottom: 24,
        }}>
          {categories.map(cat => {
            const isActive = activeCategory === cat;
            const count = categoryCount[cat] || 0;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "6px 14px",
                  borderRadius: 20,
                  border: isActive ? `1.5px solid ${T.accent}` : `1px solid ${T.borderSubtle}`,
                  background: isActive ? T.accentSoft : T.surface,
                  color: isActive ? T.accent : T.textSecondary,
                  fontFamily: T.sans,
                  fontSize: 12.5,
                  fontWeight: isActive ? 700 : 500,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  outline: "none",
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = T.surfaceHover;
                    e.currentTarget.style.borderColor = T.border;
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = T.surface;
                    e.currentTarget.style.borderColor = T.borderSubtle;
                  }
                }}
              >
                {cat}
                <span style={{
                  fontFamily: T.mono,
                  fontSize: 10,
                  opacity: 0.7,
                  background: isActive ? T.accent + "20" : T.surfaceMuted,
                  padding: "1px 6px",
                  borderRadius: 10,
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ═══ APP CARDS GRID ═══ */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: 16,
        }}>
          {allApps.map((app) => {
            const isInstalled = installedSet.has(app.id);
            const isAiApp = app.aiGenerated;
            const isAnimated = isAiApp || animatedCards.has(app.id);
            const isJustInstalled = justInstalled === app.id;
            const isConfirming = confirmUninstall === app.id;
            const appGoals = (app.goalIds || []).map(gId => goalNameMap[gId]).filter(Boolean);
            const appConnectors = (app.requiredConnectors || []).map(cId => {
              const detail = getConnectorById(cId);
              return detail ? { ...detail, connected: connectorSet.has(cId) } : null;
            }).filter(Boolean);

            return (
              <div
                key={app.id}
                style={{
                  background: T.surface,
                  borderRadius: T.r,
                  border: `1px solid ${isInstalled ? T.greenBorder + "60" : T.borderSubtle}`,
                  overflow: "hidden",
                  position: "relative",
                  cursor: "default",
                  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                  opacity: isAnimated ? 1 : 0,
                  transform: isAnimated ? "translateY(0)" : "translateY(16px)",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = `0 8px 24px ${T.dark}10, 0 2px 8px ${T.dark}08`;
                  e.currentTarget.style.borderColor = isInstalled ? T.greenBorder : T.border;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = isInstalled ? T.greenBorder + "60" : T.borderSubtle;
                }}
              >
                {/* Top accent bar */}
                <div style={{
                  height: 4,
                  background: isAiApp
                    ? `linear-gradient(90deg, ${T.violet}, ${app.color}, ${T.violet}99)`
                    : `linear-gradient(90deg, ${app.color}, ${app.color}99)`,
                }} />

                {/* Installed shimmer indicator */}
                {isInstalled && !isAiApp && (
                  <div style={{
                    position: "absolute",
                    top: 4,
                    right: 12,
                    width: 8, height: 8,
                    borderRadius: "50%",
                    background: T.green,
                    boxShadow: `0 0 6px ${T.green}40`,
                  }} />
                )}

                {/* AI Generated badge */}
                {isAiApp && (
                  <div style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    fontFamily: T.mono,
                    fontSize: 9.5,
                    fontWeight: 600,
                    color: T.violet,
                    background: T.violetSoft,
                    border: `1px solid ${T.violetBorder}`,
                    padding: "3px 8px",
                    borderRadius: 10,
                  }}>
                    {IC.sparkle(T.violet, 9)}
                    AI Generated
                  </div>
                )}

                <div style={{ padding: "20px 20px 18px" }}>
                  {/* Icon + Category row */}
                  <div style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    marginBottom: 14,
                  }}>
                    <div style={{
                      width: 48, height: 48,
                      borderRadius: 12,
                      background: app.color + "15",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: `1px solid ${app.color}20`,
                    }}>
                      {isAiApp ? IC.sparkle(app.color, 22) : APP_ICON_MAP[app.id]?.(app.color, 22)}
                    </div>
                    <span style={{
                      fontFamily: T.mono,
                      fontSize: 10,
                      color: T.textTertiary,
                      background: T.surfaceMuted,
                      padding: "3px 8px",
                      borderRadius: 6,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}>
                      {app.category}
                    </span>
                  </div>

                  {/* App name */}
                  <h3 style={{
                    fontFamily: T.serif,
                    fontSize: 17,
                    fontWeight: 600,
                    color: T.text,
                    margin: "0 0 6px 0",
                    letterSpacing: "-0.01em",
                  }}>
                    {app.name}
                  </h3>

                  {/* Description */}
                  <p style={{
                    fontFamily: T.sans,
                    fontSize: 13,
                    color: T.textSecondary,
                    lineHeight: 1.5,
                    margin: "0 0 12px 0",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    minHeight: 39,
                  }}>
                    {app.description}
                  </p>

                  {/* ── Goal chips ── */}
                  {appGoals.length > 0 && (
                    <div style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 4,
                      marginBottom: 12,
                    }}>
                      {appGoals.slice(0, 3).map(g => (
                        <span key={g.id} style={{
                          fontFamily: T.sans,
                          fontSize: 10,
                          fontWeight: 500,
                          color: app.color,
                          background: app.color + "12",
                          border: `1px solid ${app.color}20`,
                          padding: "2px 8px",
                          borderRadius: 10,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: 180,
                        }}>
                          {g.name}
                        </span>
                      ))}
                      {appGoals.length > 3 && (
                        <span style={{
                          fontFamily: T.mono,
                          fontSize: 10,
                          color: T.textTertiary,
                          padding: "2px 6px",
                        }}>
                          +{appGoals.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* ── Workflows list ── */}
                  {(app.workflows || []).length > 0 && (
                    <div style={{ marginBottom: 10 }}>
                      <div style={{
                        fontFamily: T.sans,
                        fontSize: 10,
                        fontWeight: 600,
                        color: T.textTertiary,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        marginBottom: 4,
                      }}>
                        Workflows
                      </div>
                      {app.workflows.map(wf => (
                        <div key={wf.id} style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "3px 0",
                        }}>
                          <span style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                            fontFamily: T.sans,
                            fontSize: 12,
                            color: T.text,
                          }}>
                            {IC.workflow(T.textTertiary, 12)}
                            {wf.name}
                          </span>
                          <span style={{
                            fontFamily: T.mono,
                            fontSize: 10,
                            color: T.textTertiary,
                          }}>
                            {wf.steps} steps
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ── Dashboards list ── */}
                  {(app.dashboards || []).length > 0 && (
                    <div style={{ marginBottom: 10 }}>
                      <div style={{
                        fontFamily: T.sans,
                        fontSize: 10,
                        fontWeight: 600,
                        color: T.textTertiary,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        marginBottom: 4,
                      }}>
                        Dashboards
                      </div>
                      {app.dashboards.map(db => (
                        <div key={db.id} style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "3px 0",
                          fontFamily: T.sans,
                          fontSize: 12,
                          color: T.text,
                        }}>
                          {IC.chart(T.textTertiary, 12)}
                          {db.name}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ── Required connectors with status ── */}
                  {appConnectors.length > 0 && (
                    <div style={{ marginBottom: 14 }}>
                      <div style={{
                        fontFamily: T.sans,
                        fontSize: 10,
                        fontWeight: 600,
                        color: T.textTertiary,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        marginBottom: 4,
                      }}>
                        Required Connectors
                      </div>
                      <div style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 4,
                      }}>
                        {appConnectors.map(c => (
                          <span key={c.id} style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            fontFamily: T.sans,
                            fontSize: 10.5,
                            padding: "3px 8px",
                            borderRadius: 10,
                            background: c.connected ? T.greenSoft : T.surfaceMuted,
                            color: c.connected ? T.green : T.textTertiary,
                            border: `1px solid ${c.connected ? T.greenBorder : T.borderSubtle}`,
                          }}>
                            <span style={{
                              width: 5, height: 5,
                              borderRadius: "50%",
                              background: c.connected ? T.green : T.textTertiary,
                              opacity: c.connected ? 1 : 0.4,
                              flexShrink: 0,
                            }} />
                            {c.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── Metadata summary row ── */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 14,
                  }}>
                    <span style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontFamily: T.mono,
                      fontSize: 11,
                      color: T.textTertiary,
                    }}>
                      {IC.workflow(T.textTertiary, 12)}
                      {(app.workflows || []).length} workflow{(app.workflows || []).length !== 1 ? "s" : ""}
                    </span>
                    <span style={{
                      width: 3, height: 3,
                      borderRadius: "50%",
                      background: T.borderSubtle,
                    }} />
                    <span style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontFamily: T.mono,
                      fontSize: 11,
                      color: T.textTertiary,
                    }}>
                      {IC.chart(T.textTertiary, 12)}
                      {(app.dashboards || []).length} dashboard{(app.dashboards || []).length !== 1 ? "s" : ""}
                    </span>
                    {appConnectors.length > 0 && (
                      <>
                        <span style={{
                          width: 3, height: 3,
                          borderRadius: "50%",
                          background: T.borderSubtle,
                        }} />
                        <span style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          fontFamily: T.mono,
                          fontSize: 11,
                          color: appConnectors.every(c => c.connected) ? T.green : T.textTertiary,
                        }}>
                          {IC.connector(appConnectors.every(c => c.connected) ? T.green : T.textTertiary, 12)}
                          {appConnectors.filter(c => c.connected).length}/{appConnectors.length} connected
                        </span>
                      </>
                    )}
                  </div>

                  {/* ── Industry tag + Install button row ── */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                  }}>
                    {/* Industry tag */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {app.industry ? (
                        <span style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          fontFamily: T.sans,
                          fontSize: 10.5,
                          color: T.textTertiary,
                          background: T.surfaceMuted,
                          padding: "3px 9px",
                          borderRadius: 20,
                          border: `1px solid ${T.borderSubtle}`,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "100%",
                        }}>
                          {INDUSTRY_LABELS[app.industry] || app.industry}
                        </span>
                      ) : (
                        <span style={{
                          fontFamily: T.sans,
                          fontSize: 10.5,
                          color: T.textTertiary,
                          opacity: 0.5,
                        }}>
                          All industries
                        </span>
                      )}
                    </div>

                    {/* Install / Installed / Confirm uninstall button */}
                    {isConfirming ? (
                      <div style={{
                        display: "flex",
                        gap: 6,
                        alignItems: "center",
                      }}>
                        <span style={{
                          fontFamily: T.sans,
                          fontSize: 11,
                          color: T.textTertiary,
                        }}>
                          Remove?
                        </span>
                        <button
                          onClick={() => handleUninstall(app.id)}
                          style={{
                            padding: "5px 12px",
                            borderRadius: 20,
                            border: `1px solid ${T.rose}40`,
                            background: T.roseSoft,
                            color: T.rose,
                            fontFamily: T.sans,
                            fontSize: 11.5,
                            fontWeight: 600,
                            cursor: "pointer",
                            outline: "none",
                            transition: "all 0.15s ease",
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = T.rose;
                            e.currentTarget.style.color = "#fff";
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = T.roseSoft;
                            e.currentTarget.style.color = T.rose;
                          }}
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setConfirmUninstall(null)}
                          style={{
                            padding: "5px 10px",
                            borderRadius: 20,
                            border: `1px solid ${T.borderSubtle}`,
                            background: T.surface,
                            color: T.textSecondary,
                            fontFamily: T.sans,
                            fontSize: 11.5,
                            fontWeight: 500,
                            cursor: "pointer",
                            outline: "none",
                          }}
                        >
                          No
                        </button>
                      </div>
                    ) : isInstalled ? (
                      <div style={{display:"flex",gap:6,alignItems:"center"}}>
                      <button
                        onClick={() => onNavigate && onNavigate(app.id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "6px 14px",
                          borderRadius: 20,
                          border: `1.5px solid ${T.accent}`,
                          background: T.accent,
                          color: "#fff",
                          fontFamily: T.sans,
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: "pointer",
                          outline: "none",
                          transition: "all 0.2s ease",
                        }}
                      >
                        Open
                      </button>
                      <button
                        onClick={() => setConfirmUninstall(app.id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "6px 14px",
                          borderRadius: 20,
                          border: `1px solid ${T.greenBorder}`,
                          background: T.greenSoft,
                          color: T.green,
                          fontFamily: T.sans,
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: "pointer",
                          outline: "none",
                          transition: "all 0.2s ease",
                          animation: isJustInstalled ? "catalogCheckPop 0.4s ease" : "none",
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = T.green + "20";
                          e.currentTarget.style.borderColor = T.green;
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = T.greenSoft;
                          e.currentTarget.style.borderColor = T.greenBorder;
                        }}
                      >
                        {IC.check(T.green, 13)}
                        Installed
                      </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleInstall(app.id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "6px 16px",
                          borderRadius: 20,
                          border: `1.5px solid ${T.accent}`,
                          background: "transparent",
                          color: T.accent,
                          fontFamily: T.sans,
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: "pointer",
                          outline: "none",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = T.accent;
                          e.currentTarget.style.color = "#fff";
                          e.currentTarget.style.transform = "scale(1.02)";
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = T.accent;
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                      >
                        {IC.plus(T.accent, 12)}
                        Install
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ═══ EMPTY STATE ═══ */}
        {allApps.length === 0 && (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px 20px",
            textAlign: "center",
          }}>
            <div style={{
              width: 56, height: 56,
              borderRadius: 16,
              background: T.surfaceMuted,
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 16,
            }}>
              {IC.catalog(T.textTertiary, 24)}
            </div>
            <p style={{
              fontFamily: T.serif,
              fontSize: 16,
              fontWeight: 600,
              color: T.text,
              margin: "0 0 6px 0",
            }}>
              No apps in this category
            </p>
            <p style={{
              fontFamily: T.sans,
              fontSize: 13,
              color: T.textTertiary,
            }}>
              Try selecting a different category to browse available apps.
            </p>
            <button
              onClick={() => setActiveCategory("All")}
              style={{
                marginTop: 16,
                padding: "8px 20px",
                borderRadius: 20,
                border: `1.5px solid ${T.accent}`,
                background: "transparent",
                color: T.accent,
                fontFamily: T.sans,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                outline: "none",
              }}
            >
              View all apps
            </button>
          </div>
        )}

        {/* ═══ DEVELOPER SDK SECTION ═══ */}
        <div style={{
          marginTop: 48,
          borderTop: `1px solid ${T.borderSubtle}`,
          paddingTop: 40,
        }}>
          {/* ── Hero ── */}
          <div style={{
            background: `linear-gradient(135deg, ${T.dark}, ${T.dark}F0)`,
            borderRadius: T.r,
            padding: "36px 32px 32px",
            marginBottom: 24,
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Decorative grid dots */}
            <div style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `radial-gradient(${T.surface}10 1px, transparent 1px)`,
              backgroundSize: "24px 24px",
              pointerEvents: "none",
            }} />

            <div style={{ position: "relative" }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 12,
              }}>
                <div style={{
                  width: 36, height: 36,
                  borderRadius: 10,
                  background: T.violet + "25",
                  border: `1px solid ${T.violet}40`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {IC.builder(T.violet, 18)}
                </div>
                <span style={{
                  fontFamily: T.mono,
                  fontSize: 10,
                  fontWeight: 600,
                  color: T.violet,
                  background: T.violet + "20",
                  padding: "3px 10px",
                  borderRadius: 6,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}>
                  Developers
                </span>
              </div>

              <h2 style={{
                fontFamily: T.serif,
                fontSize: 24,
                fontWeight: 700,
                color: T.surface,
                margin: "0 0 8px 0",
                letterSpacing: "-0.02em",
              }}>
                Build for Flowdesk
              </h2>

              <p style={{
                fontFamily: T.sans,
                fontSize: 14,
                color: T.surface + "AA",
                margin: 0,
                lineHeight: 1.6,
                maxWidth: 520,
              }}>
                Create apps that connect workflows, dashboards, and connectors to help teams achieve their operational goals.
              </p>
            </div>
          </div>

          {/* ── Three capability cards ── */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 14,
            marginBottom: 24,
          }}>
            {[
              {
                icon: () => IC.workflow(T.violet, 20),
                title: "Workflows",
                desc: "Define step-by-step processes with our workflow SDK. Support for inspections, checklists, approvals, and custom form fields.",
                color: T.violet,
                soft: T.violetSoft,
                border: T.violetBorder,
              },
              {
                icon: () => IC.chart(T.highlight, 20),
                title: "Dashboards",
                desc: "Build real-time dashboards with goal signals, scoring data, and operational metrics.",
                color: T.highlight,
                soft: T.highlightSoft,
                border: T.highlightBorder,
              },
              {
                icon: () => IC.connector(T.green, 20),
                title: "Connectors",
                desc: "Integrate with any system using our connector framework. OAuth, webhooks, and REST API support.",
                color: T.green,
                soft: T.greenSoft,
                border: T.greenBorder,
              },
            ].map((cap, i) => (
              <div key={i} style={{
                background: T.surface,
                borderRadius: T.r,
                border: `1px solid ${T.borderSubtle}`,
                padding: "20px 18px",
                transition: "all 0.2s ease",
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = cap.border;
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = `0 4px 16px ${cap.color}12`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = T.borderSubtle;
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{
                  width: 40, height: 40,
                  borderRadius: 10,
                  background: cap.soft,
                  border: `1px solid ${cap.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 14,
                }}>
                  {cap.icon()}
                </div>
                <h4 style={{
                  fontFamily: T.serif,
                  fontSize: 15,
                  fontWeight: 600,
                  color: T.text,
                  margin: "0 0 6px 0",
                }}>
                  {cap.title}
                </h4>
                <p style={{
                  fontFamily: T.sans,
                  fontSize: 12.5,
                  color: T.textSecondary,
                  lineHeight: 1.55,
                  margin: 0,
                }}>
                  {cap.desc}
                </p>
              </div>
            ))}
          </div>

          {/* ── Code snippet preview ── */}
          <div style={{
            background: T.dark,
            borderRadius: T.r,
            border: `1px solid ${T.darkBorder}`,
            padding: "20px 24px",
            marginBottom: 24,
            overflow: "hidden",
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 14,
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}>
                <div style={{ display: "flex", gap: 5 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: T.rose + "80" }} />
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: T.amber + "80" }} />
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: T.green + "80" }} />
                </div>
                <span style={{
                  fontFamily: T.mono,
                  fontSize: 11,
                  color: T.surface + "60",
                }}>
                  flowdesk.app.json
                </span>
              </div>
              <span style={{
                fontFamily: T.mono,
                fontSize: 9,
                color: T.violet,
                background: T.violet + "20",
                padding: "2px 8px",
                borderRadius: 6,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}>
                SDK
              </span>
            </div>

            <pre style={{
              fontFamily: T.mono,
              fontSize: 12.5,
              lineHeight: 1.65,
              margin: 0,
              color: T.surface + "CC",
              whiteSpace: "pre",
              overflowX: "auto",
            }}>
              <span style={{ color: T.surface + "50" }}>{"// flowdesk.app.json"}</span>{"\n"}
              <span style={{ color: T.surface + "50" }}>{"{"}</span>{"\n"}
              {"  "}<span style={{ color: T.violet }}>{"\"name\""}</span><span style={{ color: T.surface + "50" }}>:</span> <span style={{ color: T.green }}>{"\"My Custom App\""}</span><span style={{ color: T.surface + "50" }}>,</span>{"\n"}
              {"  "}<span style={{ color: T.violet }}>{"\"version\""}</span><span style={{ color: T.surface + "50" }}>:</span> <span style={{ color: T.green }}>{"\"1.0.0\""}</span><span style={{ color: T.surface + "50" }}>,</span>{"\n"}
              {"  "}<span style={{ color: T.violet }}>{"\"goalIds\""}</span><span style={{ color: T.surface + "50" }}>:</span> <span style={{ color: T.surface + "50" }}>{"["}</span><span style={{ color: T.green }}>{"\"mfg-defects\""}</span><span style={{ color: T.surface + "50" }}>{"],"}</span>{"\n"}
              {"  "}<span style={{ color: T.violet }}>{"\"workflows\""}</span><span style={{ color: T.surface + "50" }}>:</span> <span style={{ color: T.surface + "50" }}>{"[...],"}</span>{"\n"}
              {"  "}<span style={{ color: T.violet }}>{"\"dashboards\""}</span><span style={{ color: T.surface + "50" }}>:</span> <span style={{ color: T.surface + "50" }}>{"[...],"}</span>{"\n"}
              {"  "}<span style={{ color: T.violet }}>{"\"requiredConnectors\""}</span><span style={{ color: T.surface + "50" }}>:</span> <span style={{ color: T.surface + "50" }}>{"["}</span><span style={{ color: T.green }}>{"\"qms\""}</span><span style={{ color: T.surface + "50" }}>{"]"}</span>{"\n"}
              <span style={{ color: T.surface + "50" }}>{"}"}</span>
            </pre>
          </div>

          {/* ── Quick stats row ── */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginBottom: 24,
            flexWrap: "wrap",
          }}>
            {["18 published apps", "3 industries", "70+ goals to target", "Open beta"].map((stat, i) => (
              <React.Fragment key={i}>
                {i > 0 && (
                  <span style={{
                    width: 3, height: 3,
                    borderRadius: "50%",
                    background: T.borderSubtle,
                    flexShrink: 0,
                  }} />
                )}
                <span style={{
                  fontFamily: T.mono,
                  fontSize: 12,
                  color: i === 3 ? T.green : T.textSecondary,
                  fontWeight: i === 3 ? 600 : 400,
                }}>
                  {stat}
                </span>
              </React.Fragment>
            ))}
          </div>

          {/* ── CTA buttons ── */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}>
            <button style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 24px",
              borderRadius: 24,
              border: "none",
              background: T.accent,
              color: T.surface,
              fontFamily: T.sans,
              fontSize: 13.5,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
              onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.transform = "scale(1.02)"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1)"; }}
            >
              {IC.send(T.surface, 13)}
              Get Started
            </button>
            <button style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 24px",
              borderRadius: 24,
              border: `1.5px solid ${T.border}`,
              background: T.surface,
              color: T.text,
              fontFamily: T.sans,
              fontSize: 13.5,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.color = T.accent; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.text; }}
            >
              {IC.link(T.textSecondary, 13)}
              Read the Docs
            </button>
          </div>
        </div>

        {/* ═══ FOOTER ═══ */}
        <div style={{
          marginTop: 48,
          padding: "20px 0",
          borderTop: `1px solid ${T.borderSubtle}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}>
          <span style={{
            fontFamily: T.sans,
            fontSize: 12,
            color: T.textTertiary,
          }}>
            More apps coming soon
          </span>
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 3,
            fontFamily: T.mono,
            fontSize: 10,
            color: T.violet,
            background: T.violetSoft,
            padding: "2px 8px",
            borderRadius: 10,
            border: `1px solid ${T.violetBorder}`,
          }}>
            {IC.sparkle(T.violet, 10)}
            Roadmap
          </span>
        </div>
      </div>
    </div>
  );
};

/* ═══ APP DETAIL PAGE ═══ */

function AppDetailPage({appId,industry,addedConnectors,onBack,onNavigate}){
  const[activeTab,setActiveTab]=useState("Insights");
  const[stripDismissed,setStripDismissed]=useState(false);
  const[stripExpanded,setStripExpanded]=useState(false);
  const[agentInstructions,setAgentInstructions]=useState(null);/* lazy init from defaults */

  /* Find app from catalog */
  const app=APP_CATALOG.find(a=>a.id===appId);
  if(!app)return<div style={{padding:40,textAlign:"center",color:T.textSecondary}}>App not found</div>;

  /* Scores */
  const configScore=getAppConfigScore(app,addedConnectors);
  const perfScore=getAppPerfScore(appId);
  const overallScore=Math.round((configScore+perfScore)/2);

  /* Data */
  const metrics=getAppDashboardMetrics(app);
  const chartData=getAppChartData(appId);
  const activities=getAppActivity(appId);
  const people=getAppPeople(appId);
  const tables=APP_TABLE_MAP[appId]||[];
  const recommendedWfs=APP_RECOMMENDED_WORKFLOWS[appId]||[];
  const connSet=new Set(addedConnectors||[]);

  /* Goals this app serves */
  const appGoals=(app.goalIds||[]).map(gId=>getGoalById(gId)).filter(Boolean);

  /* Register lookup */
  const allRegisters=[...(REGISTER_CATALOG.manufacturing||[]),...(REGISTER_CATALOG.qsr||[]),...(REGISTER_CATALOG["transport-logistics"]||[])];
  const linkedRegisters=tables.map(tId=>allRegisters.find(r=>r.id===tId)).filter(Boolean);

  /* Connector details */
  const connectorDetails=(app.requiredConnectors||[]).map(cId=>{
    const detail=getConnectorById(cId);
    return detail?{...detail,connected:connSet.has(cId)}:null;
  }).filter(Boolean);

  /* Icon for app */
  const appIcon=APP_ICON_MAP[appId];

  /* Months for chart x-axis */
  const months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  /* Activity icon lookup */
  const activityIcon=(type)=>{
    const map={inspection:IC.shield,issue:IC.bolt,escalation:IC.bolt,workflow:IC.workflow,connector:IC.connector};
    return map[type]||IC.bolt;
  };

  const tabs=["Insights","Workflows","Data Tables","Activity","Configuration"];

  /* Agent data for co-pilot strip + inline annotations */
  const agentData=APP_AGENT_INSIGHTS[appId];

  /* ── Score colour helper ── */
  const scoreColor=(v)=>v>=75?T.green:v>=50?T.amber:T.rose;

  return<div style={{minHeight:"100vh",background:T.bg,overflowY:"auto",paddingBottom:80}}>

    {/* ═══ HERO HEADER ═══ */}
    <div style={{background:`linear-gradient(135deg, ${T.dark}, ${T.dark}F0)`,padding:"0 0 28px",position:"relative",overflow:"hidden"}}>
      {/* Decorative grid */}
      <div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(${T.surface}08 1px, transparent 1px)`,backgroundSize:"24px 24px",pointerEvents:"none"}}/>

      <div style={{maxWidth:960,margin:"0 auto",padding:"0 32px",position:"relative"}}>
        {/* Back + title row */}
        <div style={{display:"flex",alignItems:"center",gap:12,paddingTop:24,marginBottom:20}}>
          <div onClick={onBack} style={{width:36,height:36,borderRadius:10,background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all 0.15s"}} onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.15)";}} onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.08)";}}>
            {IC.chevLeft("#fff",16)}
          </div>
          <div style={{width:44,height:44,borderRadius:12,background:app.color+"25",border:`1px solid ${app.color}40`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            {appIcon?appIcon(app.color,22):IC.catalog(app.color,22)}
          </div>
          <div style={{flex:1,minWidth:0}}>
            <h1 style={{fontFamily:T.serif,fontSize:24,fontWeight:700,color:"#fff",margin:0,letterSpacing:"-0.02em"}}>{app.name}</h1>
            <p style={{fontFamily:T.sans,fontSize:13,color:"rgba(255,255,255,0.55)",margin:"3px 0 0",lineHeight:1.4}}>{app.description}</p>
          </div>
        </div>

        {/* Score cards row */}
        <div style={{display:"flex",gap:16,flexWrap:"wrap",marginBottom:20}}>
          {/* Overall score ring */}
          <div style={{display:"flex",alignItems:"center",gap:14,background:"rgba(255,255,255,0.06)",borderRadius:12,padding:"14px 20px",border:"1px solid rgba(255,255,255,0.1)",minWidth:160}}>
            <Ring pct={overallScore} size={52} stroke={5} color={scoreColor(overallScore)}/>
            <div>
              <div style={{fontFamily:T.mono,fontSize:22,fontWeight:700,color:"#fff",lineHeight:1}}>{overallScore}%</div>
              <div style={{fontFamily:T.sans,fontSize:11,color:"rgba(255,255,255,0.5)",marginTop:2}}>Overall Score</div>
            </div>
          </div>
          {/* Config bar */}
          <div style={{flex:1,minWidth:160,background:"rgba(255,255,255,0.06)",borderRadius:12,padding:"14px 20px",border:"1px solid rgba(255,255,255,0.1)",display:"flex",flexDirection:"column",justifyContent:"center"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <span style={{fontFamily:T.sans,fontSize:11,color:"rgba(255,255,255,0.5)"}}>Configuration</span>
              <span style={{fontFamily:T.mono,fontSize:13,fontWeight:600,color:scoreColor(configScore)}}>{configScore}%</span>
            </div>
            <div style={{height:6,borderRadius:3,background:"rgba(255,255,255,0.1)",overflow:"hidden"}}>
              <div style={{height:"100%",width:`${configScore}%`,borderRadius:3,background:scoreColor(configScore),transition:"width 0.8s cubic-bezier(0.4,0,0.2,1)"}}/>
            </div>
          </div>
          {/* Perf bar */}
          <div style={{flex:1,minWidth:160,background:"rgba(255,255,255,0.06)",borderRadius:12,padding:"14px 20px",border:"1px solid rgba(255,255,255,0.1)",display:"flex",flexDirection:"column",justifyContent:"center"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <span style={{fontFamily:T.sans,fontSize:11,color:"rgba(255,255,255,0.5)"}}>Performance</span>
              <span style={{fontFamily:T.mono,fontSize:13,fontWeight:600,color:scoreColor(perfScore)}}>{perfScore}%</span>
            </div>
            <div style={{height:6,borderRadius:3,background:"rgba(255,255,255,0.1)",overflow:"hidden"}}>
              <div style={{height:"100%",width:`${perfScore}%`,borderRadius:3,background:scoreColor(perfScore),transition:"width 0.8s cubic-bezier(0.4,0,0.2,1)"}}/>
            </div>
          </div>
        </div>

        {/* Goal pill (1:1 app→goal) */}
        {appGoals.length>0&&<div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          <span style={{fontFamily:T.sans,fontSize:10.5,fontWeight:500,color:app.color,background:app.color+"20",border:`1px solid ${app.color}30`,padding:"3px 10px",borderRadius:20,whiteSpace:"nowrap"}}>{IC.target(app.color,10)} {appGoals[0].name}</span>
        </div>}
      </div>
    </div>

    {/* ═══ AGENT CO-PILOT STRIP ═══ */}
    {agentData&&agentData.proactive&&!stripDismissed&&<div style={{maxWidth:960,margin:"0 auto",padding:"0 32px"}}>
      <div style={{margin:"20px 0 0",borderRadius:T.r,background:`linear-gradient(135deg, ${app.color}08, ${app.color}04)`,border:`1px solid ${app.color}25`,position:"relative",animation:"fadeIn 0.4s ease",overflow:"hidden"}}>
        <div style={{padding:"18px 22px"}}>
          {/* Agent identity row */}
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
            <div style={{width:32,height:32,borderRadius:9,background:app.color+"18",border:`1px solid ${app.color}30`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{IC.sparkle(app.color,14)}</div>
            <div style={{display:"flex",alignItems:"center",gap:8,flex:1}}>
              <span style={{fontFamily:T.sans,fontSize:13,fontWeight:600,color:T.text}}>{agentData.agent}</span>
              <div style={{display:"flex",alignItems:"center",gap:4}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:T.green,animation:"pulse 2s infinite"}}/>
                <span style={{fontFamily:T.mono,fontSize:10,color:T.textTertiary}}>Active</span>
              </div>
            </div>
          </div>
          {/* Proactive message */}
          <div style={{fontFamily:T.sans,fontSize:13.5,color:T.text,lineHeight:1.6,marginBottom:16,paddingLeft:42}}>{agentData.proactive.message}</div>
          {/* Action buttons */}
          {!stripExpanded&&<div style={{display:"flex",gap:8,paddingLeft:42}}>
            <div onClick={()=>setStripExpanded(true)} style={{padding:"7px 18px",borderRadius:99,background:app.color,color:"#fff",fontSize:12,fontWeight:600,fontFamily:T.sans,cursor:"pointer",display:"flex",alignItems:"center",gap:5,transition:"opacity 0.15s"}} onMouseEnter={e=>{e.currentTarget.style.opacity="0.85";}} onMouseLeave={e=>{e.currentTarget.style.opacity="1";}}>{agentData.proactive.action}</div>
            <div onClick={()=>setStripDismissed(true)} style={{padding:"7px 16px",borderRadius:99,background:T.surfaceMuted,color:T.textSecondary,fontSize:12,fontWeight:500,fontFamily:T.sans,cursor:"pointer",transition:"all 0.15s"}} onMouseEnter={e=>{e.currentTarget.style.background=T.border;}} onMouseLeave={e=>{e.currentTarget.style.background=T.surfaceMuted;}}>Dismiss</div>
          </div>}

          {/* ── Expanded action panel ── */}
          {stripExpanded&&(()=>{
            const prepared=APP_AGENT_PREPARED[appId];
            if(!prepared)return null;
            return<div style={{marginLeft:42,animation:"fadeIn 0.3s ease"}}>
              <div style={{padding:"16px 20px",borderRadius:T.rSm,background:T.surface,border:`1px solid ${T.border}`,marginBottom:12}}>
                <div style={{fontFamily:T.serif,fontSize:14,fontWeight:600,color:T.text,marginBottom:14,letterSpacing:"-0.01em"}}>{prepared.title}</div>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {prepared.fields.map((f,i)=><div key={i} style={{display:"flex",gap:12}}>
                    <span style={{fontFamily:T.sans,fontSize:11,fontWeight:600,color:T.textTertiary,minWidth:100,textTransform:"uppercase",letterSpacing:"0.03em",paddingTop:1}}>{f.label}</span>
                    <span style={{fontFamily:T.sans,fontSize:12.5,color:T.text,lineHeight:1.5,flex:1}}>{f.value}</span>
                  </div>)}
                </div>
              </div>
              {/* Approve / Edit / Dismiss */}
              <div style={{display:"flex",gap:8}}>
                <div onClick={()=>{setStripExpanded(false);setStripDismissed(true);}} style={{padding:"7px 18px",borderRadius:99,background:T.green,color:"#fff",fontSize:12,fontWeight:600,fontFamily:T.sans,cursor:"pointer",display:"flex",alignItems:"center",gap:5,transition:"opacity 0.15s"}} onMouseEnter={e=>{e.currentTarget.style.opacity="0.85";}} onMouseLeave={e=>{e.currentTarget.style.opacity="1";}}>
                  {IC.check("#fff",11)} Approve
                </div>
                <div style={{padding:"7px 16px",borderRadius:99,background:T.surfaceMuted,color:T.textSecondary,fontSize:12,fontWeight:500,fontFamily:T.sans,cursor:"pointer",display:"flex",alignItems:"center",gap:4,transition:"all 0.15s"}} onMouseEnter={e=>{e.currentTarget.style.background=T.border;}} onMouseLeave={e=>{e.currentTarget.style.background=T.surfaceMuted;}}>
                  Edit
                </div>
                <div onClick={()=>{setStripExpanded(false);setStripDismissed(true);}} style={{padding:"7px 16px",borderRadius:99,background:T.surfaceMuted,color:T.textSecondary,fontSize:12,fontWeight:500,fontFamily:T.sans,cursor:"pointer",transition:"all 0.15s"}} onMouseEnter={e=>{e.currentTarget.style.background=T.border;}} onMouseLeave={e=>{e.currentTarget.style.background=T.surfaceMuted;}}>
                  Dismiss
                </div>
              </div>
            </div>;
          })()}
        </div>
      </div>
    </div>}

    {/* ═══ TAB BAR ═══ */}
    <div style={{maxWidth:960,margin:"0 auto",padding:"0 32px"}}>
      <div style={{display:"flex",gap:2,borderBottom:`1px solid ${T.border}`,marginBottom:28,paddingTop:4}}>
        {tabs.map(tab=>{
          const isActive=activeTab===tab;
          return<div key={tab} onClick={()=>setActiveTab(tab)} style={{padding:"12px 18px",fontSize:13,fontFamily:T.sans,fontWeight:isActive?600:400,color:isActive?T.text:T.textSecondary,cursor:"pointer",borderBottom:isActive?`2px solid ${T.accent}`:"2px solid transparent",transition:"all 0.15s",whiteSpace:"nowrap"}} onMouseEnter={e=>{if(!isActive)e.currentTarget.style.color=T.text;}} onMouseLeave={e=>{if(!isActive)e.currentTarget.style.color=T.textSecondary;}}>{tab}</div>;
        })}
      </div>

      {/* ═══ INSIGHTS TAB ═══ */}
      {activeTab==="Insights"&&<div style={{animation:"fadeIn 0.3s ease"}}>
        {/* Metric cards with agent annotations */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:14,marginBottom:28}}>
          {metrics.map((m,i)=>{
            const isFlagged=agentData&&agentData.metricFlag===i;
            return<div key={i} className="bento" style={{padding:"18px 20px",position:"relative",borderColor:isFlagged?T.rose+"25":undefined}}>
            {/* Agent flag badge */}
            {isFlagged&&<div style={{position:"absolute",top:8,right:8,display:"flex",alignItems:"center",gap:3,padding:"1px 6px",borderRadius:99,background:T.roseSoft}}>
              {IC.sparkle(T.rose,8)}
              <span style={{fontFamily:T.mono,fontSize:8,fontWeight:600,color:T.rose,letterSpacing:"0.01em"}}>Flagged</span>
            </div>}
            <div style={{fontFamily:T.sans,fontSize:11,color:T.textTertiary,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.04em"}}>{m.label}</div>
            <div style={{display:"flex",alignItems:"baseline",gap:8}}>
              <span style={{fontFamily:T.serif,fontSize:28,fontWeight:600,color:T.text,letterSpacing:"-0.02em",lineHeight:1}}>{m.value}</span>
              <span className="chip" style={{background:m.trend>0?(m.color===T.rose?T.roseSoft:T.greenSoft):(m.color===T.green?T.roseSoft:T.greenSoft),color:m.trend>0?(m.color===T.rose?T.rose:T.green):(m.color===T.green?T.rose:T.green)}}>
                {m.trend>0?"↑":"↓"} {Math.abs(m.trend)}
              </span>
            </div>
          </div>;})}
        </div>

        {/* Trend chart */}
        <div className="bento" style={{padding:"20px 24px",marginBottom:28}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div>
              <div style={{fontFamily:T.serif,fontSize:16,fontWeight:600,color:T.text,letterSpacing:"-0.01em"}}>Performance Trend</div>
              <div style={{fontFamily:T.sans,fontSize:12,color:T.textTertiary,marginTop:2}}>12-month score progression</div>
            </div>
            <span className="chip" style={{background:T.greenSoft,color:T.green}}>↑ Trending up</span>
          </div>
          {/* Month labels */}
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,padding:"0 2px"}}>
            {months.map((m,i)=><span key={i} style={{fontFamily:T.mono,fontSize:9,color:T.textTertiary}}>{m}</span>)}
          </div>
          <AreaChart data={chartData} color={app.color} w={880} h={140}/>
        </div>

        {/* ── Agent Insights ── */}
        {(()=>{
          const agentData=APP_AGENT_INSIGHTS[appId];
          if(!agentData)return null;
          const sevColor=(s)=>s==="high"?T.rose:s==="positive"?T.green:T.amber;
          const sevSoft=(s)=>s==="high"?T.roseSoft:s==="positive"?T.greenSoft:T.amberSoft;
          const sevBorder=(s)=>s==="high"?T.roseBorder:s==="positive"?T.greenBorder:T.amberBorder;
          const typeIcon=(t)=>t==="alert"?IC.bolt:t==="trend"?IC.chart:IC.sparkle;
          const typeLabel=(t)=>t==="alert"?"Alert":t==="trend"?"Trend":"Recommendation";
          return<div style={{marginBottom:28}}>
            {/* Agent header */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:36,height:36,borderRadius:10,background:app.color+"18",border:`1px solid ${app.color}30`,display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.sparkle(app.color,16)}</div>
                <div>
                  <div style={{fontFamily:T.sans,fontSize:14,fontWeight:600,color:T.text,letterSpacing:"-0.01em"}}>{agentData.agent}</div>
                  <div style={{display:"flex",alignItems:"center",gap:5,marginTop:2}}>
                    <div style={{width:6,height:6,borderRadius:"50%",background:T.green,animation:"pulse 2s infinite"}}/>
                    <span style={{fontSize:10.5,color:T.textTertiary,fontFamily:T.mono}}>Active · Updated {agentData.lastRun}</span>
                  </div>
                </div>
              </div>
              <div style={{padding:"7px 16px",borderRadius:99,background:app.color,color:"#fff",fontSize:11.5,fontWeight:600,fontFamily:T.sans,cursor:"pointer",display:"flex",alignItems:"center",gap:5,transition:"opacity 0.15s"}} onMouseEnter={e=>{e.currentTarget.style.opacity="0.85";}} onMouseLeave={e=>{e.currentTarget.style.opacity="1";}}>{IC.sparkle("#fff",11)} Ask Agent</div>
            </div>
            {/* Insight cards */}
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {agentData.insights.map((ins,i)=>{
                const ic=sevColor(ins.severity);const ics=sevSoft(ins.severity);const icb=sevBorder(ins.severity);
                const TIcon=typeIcon(ins.type);
                return<div key={i} className="bento" style={{padding:"16px 20px",borderLeft:`3px solid ${ic}`,animation:`fadeIn 0.3s ease ${i*0.08}s both`}}>
                  <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
                    <div style={{width:32,height:32,borderRadius:8,background:ics,border:`1px solid ${icb}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>{TIcon(ic,14)}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                        <span style={{fontFamily:T.sans,fontSize:13,fontWeight:600,color:T.text,letterSpacing:"-0.01em"}}>{ins.title}</span>
                        <span style={{fontSize:9,fontFamily:T.mono,padding:"2px 7px",borderRadius:99,background:ics,color:ic,fontWeight:600}}>{typeLabel(ins.type)}</span>
                      </div>
                      <div style={{fontFamily:T.sans,fontSize:12,color:T.textSecondary,lineHeight:1.55}}>{ins.desc}</div>
                      <div style={{fontFamily:T.mono,fontSize:10,color:T.textTertiary,marginTop:6}}>{ins.time}</div>
                    </div>
                  </div>
                </div>;
              })}
            </div>
          </div>;
        })()}

        {/* Connected goals + People row */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:28}}>
          {/* Goal (1:1) */}
          <div className="bento" style={{padding:"18px 20px"}}>
            <div className="lbl" style={{marginBottom:12}}>{IC.target(T.textTertiary,12)} Connected Goal</div>
            {appGoals.length===0?<div style={{fontSize:12,color:T.textTertiary}}>No goal linked</div>:
            <div onClick={()=>onNavigate&&onNavigate("score")} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:T.rSm,background:T.surfaceHover,cursor:"pointer",transition:"background 0.15s"}} onMouseEnter={e=>{e.currentTarget.style.background=T.surfaceMuted;}} onMouseLeave={e=>{e.currentTarget.style.background=T.surfaceHover;}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:app.color,flexShrink:0}}/>
              <span style={{fontFamily:T.sans,fontSize:13,fontWeight:500,color:T.text,flex:1}}>{appGoals[0].name}</span>
              {IC.chevRight(T.textTertiary,14)}
            </div>}
          </div>
          {/* People */}
          <div className="bento" style={{padding:"18px 20px"}}>
            <div className="lbl" style={{marginBottom:12}}>{IC.people(T.textTertiary,12)} Assigned People</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {people.map((p,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:32,height:32,borderRadius:"50%",background:app.color+"18",border:`1.5px solid ${app.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:T.mono,fontSize:11,fontWeight:600,color:app.color,flexShrink:0}}>{p.initials}</div>
                <div>
                  <div style={{fontFamily:T.sans,fontSize:13,fontWeight:500,color:T.text}}>{p.name}</div>
                  <div style={{fontFamily:T.sans,fontSize:11,color:T.textTertiary}}>{p.role}</div>
                </div>
              </div>)}
            </div>
          </div>
        </div>
      </div>}

      {/* ═══ WORKFLOWS TAB ═══ */}
      {activeTab==="Workflows"&&<div style={{animation:"fadeIn 0.3s ease"}}>
        {/* Active workflows */}
        <div className="lbl" style={{marginBottom:14}}>{IC.workflow(T.textTertiary,12)} Active Workflows <span style={{fontFamily:T.mono,fontSize:10,color:T.green,background:T.greenSoft,padding:"1px 7px",borderRadius:10,marginLeft:6}}>{(app.workflows||[]).length}</span></div>
        <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:32}}>
          {(app.workflows||[]).map((wf,i)=>{
            const lastRun=["2 hrs ago","Yesterday","3 hrs ago","1 day ago","4 hrs ago"][i%5];
            return<div key={wf.id} className="bento" style={{padding:"18px 20px",display:"flex",alignItems:"center",gap:16}}>
              <div style={{width:42,height:42,borderRadius:10,background:T.highlightSoft,border:`1px solid ${T.highlightBorder}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                {IC.workflow(T.highlight,20)}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:T.serif,fontSize:15,fontWeight:600,color:T.text,letterSpacing:"-0.01em"}}>{wf.name}</div>
                <div style={{fontFamily:T.sans,fontSize:12,color:T.textSecondary,marginTop:2}}>{wf.desc}</div>
                <div style={{display:"flex",gap:10,marginTop:6}}>
                  <span className="chip" style={{background:T.surfaceMuted,color:T.textTertiary}}>{wf.steps} steps</span>
                  <span style={{fontFamily:T.sans,fontSize:11,color:T.textTertiary}}>Last run: {lastRun}</span>
                </div>
              </div>
              <div onClick={()=>{}} style={{padding:"7px 18px",borderRadius:20,background:T.accent,color:"#fff",fontFamily:T.sans,fontSize:12,fontWeight:600,cursor:"pointer",transition:"opacity 0.15s",whiteSpace:"nowrap"}} onMouseEnter={e=>{e.currentTarget.style.opacity="0.85";}} onMouseLeave={e=>{e.currentTarget.style.opacity="1";}}>Run</div>
            </div>;
          })}
        </div>

        {/* Recommended workflows — first one gets agent badge */}
        {recommendedWfs.length>0&&<>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
            <div className="lbl">{IC.sparkle(T.textTertiary,12)} Recommended</div>
            <div style={{flex:1,height:1,background:T.borderSubtle}}/>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {recommendedWfs.map((rwf,i)=><div key={i} style={{padding:"16px 20px",borderRadius:T.r,border:i===0&&agentData?`1px solid ${app.color}30`:`1px dashed ${T.border}`,background:i===0&&agentData?app.color+"06":T.surfaceHover,display:"flex",alignItems:"center",gap:16,opacity:i===0&&agentData?1:0.7}}>
              <div style={{width:42,height:42,borderRadius:10,background:i===0&&agentData?app.color+"15":T.surfaceMuted,border:i===0&&agentData?`1px solid ${app.color}25`:undefined,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                {i===0&&agentData?IC.sparkle(app.color,20):IC.workflow(T.textTertiary,20)}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{fontFamily:T.serif,fontSize:14,fontWeight:600,color:T.text}}>{rwf.name}</div>
                  {i===0&&agentData&&<span style={{fontSize:9,fontFamily:T.mono,padding:"2px 8px",borderRadius:99,background:app.color+"15",color:app.color,fontWeight:600}}>Agent recommends</span>}
                </div>
                <div style={{fontFamily:T.sans,fontSize:12,color:T.textSecondary,marginTop:2}}>{rwf.desc}</div>
              </div>
              <span className="chip" style={{background:T.highlightSoft,color:T.highlight,fontWeight:600}}>+{rwf.configImpact}% config</span>
            </div>)}
          </div>
        </>}
      </div>}

      {/* ═══ DATA TABLES TAB ═══ */}
      {activeTab==="Data Tables"&&<div style={{animation:"fadeIn 0.3s ease"}}>
        <div className="lbl" style={{marginBottom:14}}>{IC.grid(T.textTertiary,12)} Linked Tables</div>
        {linkedRegisters.length===0?
          <div className="bento" style={{padding:32,textAlign:"center"}}>
            <div style={{width:48,height:48,borderRadius:14,background:T.surfaceMuted,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}>{IC.grid(T.textTertiary,22)}</div>
            <div style={{fontFamily:T.serif,fontSize:15,fontWeight:600,color:T.text,marginBottom:4}}>No tables linked</div>
            <div style={{fontFamily:T.sans,fontSize:12,color:T.textTertiary}}>Connect data tables to enrich this app's dashboards and workflows.</div>
          </div>
        :
          <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:28}}>
            {linkedRegisters.map(reg=><div key={reg.id} className="bento" style={{padding:"16px 20px",display:"flex",alignItems:"center",gap:14,cursor:"pointer",transition:"all 0.15s"}} onClick={()=>onNavigate&&onNavigate("registers")} onMouseEnter={e=>{e.currentTarget.style.borderColor=T.highlight;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;}}>
              <div style={{width:40,height:40,borderRadius:10,background:T.highlightSoft,border:`1px solid ${T.highlightBorder}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{IC.grid(T.highlight,18)}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:T.serif,fontSize:14,fontWeight:600,color:T.text}}>{reg.name}</div>
                <div style={{display:"flex",gap:10,marginTop:4}}>
                  <span style={{fontFamily:T.mono,fontSize:11,color:T.textTertiary}}>{reg.rowCount} rows</span>
                  <span style={{fontFamily:T.sans,fontSize:11,color:T.textTertiary}}>Updated {reg.updatedAgo}</span>
                </div>
              </div>
              <span className="chip" style={{background:T.greenSoft,color:T.green}}>Linked</span>
              {IC.chevRight(T.textTertiary,14)}
            </div>)}
          </div>
        }

        {/* Suggested tables */}
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14,marginTop:linkedRegisters.length>0?0:20}}>
          <div className="lbl">{IC.sparkle(T.textTertiary,12)} Suggested</div>
          <div style={{flex:1,height:1,background:T.borderSubtle}}/>
        </div>
        <div style={{padding:"16px 20px",borderRadius:T.r,border:`1px dashed ${T.border}`,background:T.surfaceHover,opacity:0.7}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:40,height:40,borderRadius:10,background:T.surfaceMuted,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{IC.grid(T.textTertiary,18)}</div>
            <div style={{flex:1}}>
              <div style={{fontFamily:T.serif,fontSize:14,fontWeight:600,color:T.text}}>Custom Data Table</div>
              <div style={{fontFamily:T.sans,fontSize:12,color:T.textSecondary,marginTop:2}}>Create a table to track additional data specific to {app.name}.</div>
            </div>
            <span className="chip" style={{background:T.highlightSoft,color:T.highlight}}>+5% config</span>
          </div>
        </div>
      </div>}

      {/* ═══ ACTIVITY TAB ═══ */}
      {activeTab==="Activity"&&<div style={{animation:"fadeIn 0.3s ease"}}>
        <div className="lbl" style={{marginBottom:14}}>{IC.bolt(T.textTertiary,12)} Recent Activity</div>
        <div style={{display:"flex",flexDirection:"column",gap:2}}>
          {/* Agent actions appear first in the feed */}
          {agentData&&agentData.agentActions&&agentData.agentActions.map((act,i)=>{
            return<div key={"agent-"+i} style={{display:"flex",gap:14,padding:"14px 0",borderBottom:`1px solid ${T.borderSubtle}`,animation:`fadeIn 0.3s ease ${i*0.05}s both`}}>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,paddingTop:2}}>
                <div style={{width:32,height:32,borderRadius:8,background:app.color+"15",border:`1px solid ${app.color}25`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  {IC.sparkle(app.color,14)}
                </div>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                  <span style={{fontFamily:T.sans,fontSize:13,fontWeight:500,color:T.text}}>{act.text}</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontFamily:T.sans,fontSize:11,color:app.color,fontWeight:500}}>{agentData.agent}</span>
                  <span style={{width:3,height:3,borderRadius:"50%",background:T.borderSubtle}}/>
                  <span style={{fontFamily:T.sans,fontSize:11,color:T.textTertiary}}>{act.time}</span>
                </div>
              </div>
              <span className="chip" style={{background:app.color+"12",color:app.color,alignSelf:"center",flexShrink:0}}>Agent</span>
            </div>;
          })}
          {activities.map((a,i)=>{
            const aType=APP_ACTIVITY_TYPES[a.type]||{icon:"bolt",color:T.textTertiary,label:"Event"};
            const iconFn=activityIcon(a.type);
            return<div key={i} style={{display:"flex",gap:14,padding:"14px 0",borderBottom:i<activities.length-1?`1px solid ${T.borderSubtle}`:"none",animation:`fadeIn 0.3s ease ${i*0.05}s both`}}>
              {/* Timeline dot */}
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,paddingTop:2}}>
                <div style={{width:32,height:32,borderRadius:8,background:aType.color+"15",border:`1px solid ${aType.color}25`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  {iconFn(aType.color,14)}
                </div>
              </div>
              {/* Content */}
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                  <span style={{fontFamily:T.sans,fontSize:13,fontWeight:500,color:T.text}}>{a.text}</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontFamily:T.sans,fontSize:11,color:T.textTertiary}}>{a.user}</span>
                  <span style={{width:3,height:3,borderRadius:"50%",background:T.borderSubtle}}/>
                  <span style={{fontFamily:T.sans,fontSize:11,color:T.textTertiary}}>{a.time}</span>
                  {a.score!=null&&<span className="chip" style={{background:a.score>=90?T.greenSoft:a.score>=70?T.amberSoft:T.roseSoft,color:a.score>=90?T.green:a.score>=70?T.amber:T.rose,fontWeight:600,marginLeft:4}}>{a.score}%</span>}
                </div>
              </div>
              {/* Type label */}
              <span className="chip" style={{background:aType.color+"12",color:aType.color,alignSelf:"center",flexShrink:0}}>{aType.label}</span>
            </div>;
          })}
        </div>
      </div>}

      {/* ═══ CONFIGURATION TAB ═══ */}
      {activeTab==="Configuration"&&<div style={{animation:"fadeIn 0.3s ease"}}>
        {/* Large config ring */}
        <div style={{display:"flex",alignItems:"center",gap:24,marginBottom:32,padding:"24px 28px",borderRadius:T.r,background:T.surface,border:`1px solid ${T.border}`}}>
          <Ring pct={configScore} size={80} stroke={7} color={scoreColor(configScore)}/>
          <div>
            <div style={{fontFamily:T.serif,fontSize:28,fontWeight:600,color:T.text,letterSpacing:"-0.02em",lineHeight:1}}>{configScore}%</div>
            <div style={{fontFamily:T.sans,fontSize:13,color:T.textSecondary,marginTop:4}}>Configuration Score</div>
            <div style={{fontFamily:T.sans,fontSize:12,color:T.textTertiary,marginTop:2}}>Complete the items below to improve your score and unlock full app capabilities.</div>
          </div>
        </div>

        {/* ── Agent Configuration (agent.md) ── */}
        {agentData&&(()=>{
          const cfg=APP_AGENT_CONFIG[appId];
          if(!cfg)return null;
          const currentInstructions=agentInstructions!=null?agentInstructions:cfg.instructions;
          return<div style={{marginBottom:28}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
              <div className="lbl">{IC.sparkle(T.textTertiary,12)} Agent Configuration</div>
              <span style={{fontFamily:T.mono,fontSize:10,color:T.textTertiary,background:T.surfaceMuted,padding:"2px 8px",borderRadius:99}}>agent.md</span>
            </div>
            <div style={{padding:"20px 22px",borderRadius:T.r,background:T.surface,border:`1px solid ${T.border}`}}>
              {/* Agent identity */}
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
                <div style={{width:36,height:36,borderRadius:10,background:app.color+"18",border:`1px solid ${app.color}30`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{IC.sparkle(app.color,15)}</div>
                <div style={{flex:1}}>
                  <div style={{fontFamily:T.sans,fontSize:14,fontWeight:600,color:T.text}}>{agentData.agent}</div>
                  <div style={{display:"flex",alignItems:"center",gap:5,marginTop:2}}>
                    <div style={{width:6,height:6,borderRadius:"50%",background:T.green,animation:"pulse 2s infinite"}}/>
                    <span style={{fontFamily:T.mono,fontSize:10,color:T.textTertiary}}>Active · Updated {agentData.lastRun}</span>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div style={{marginBottom:16}}>
                <div style={{fontFamily:T.sans,fontSize:11,fontWeight:600,color:T.textTertiary,textTransform:"uppercase",letterSpacing:"0.04em",marginBottom:8}}>Instructions</div>
                <textarea value={currentInstructions} onChange={e=>setAgentInstructions(e.target.value)} style={{width:"100%",minHeight:180,padding:"14px 16px",borderRadius:T.rSm,border:`1px solid ${T.borderSubtle}`,background:T.bg,color:T.text,fontFamily:T.mono,fontSize:12,lineHeight:1.7,resize:"vertical",outline:"none",boxSizing:"border-box",transition:"border-color 0.15s"}} onFocus={e=>{e.currentTarget.style.borderColor=app.color;}} onBlur={e=>{e.currentTarget.style.borderColor=T.borderSubtle;}}/>
              </div>

              {/* Data Sources */}
              <div style={{marginBottom:16}}>
                <div style={{fontFamily:T.sans,fontSize:11,fontWeight:600,color:T.textTertiary,textTransform:"uppercase",letterSpacing:"0.04em",marginBottom:8}}>Data Sources</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {cfg.dataSources.map((ds,i)=><span key={i} style={{padding:"5px 12px",borderRadius:99,background:T.surfaceHover,border:`1px solid ${T.borderSubtle}`,fontFamily:T.sans,fontSize:11,color:T.text,display:"flex",alignItems:"center",gap:5}}>
                    <span style={{width:6,height:6,borderRadius:"50%",background:T.green,flexShrink:0}}/>
                    {ds}
                  </span>)}
                  <span style={{padding:"5px 12px",borderRadius:99,border:`1px dashed ${T.border}`,fontFamily:T.sans,fontSize:11,color:T.textTertiary,cursor:"pointer",transition:"all 0.15s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=app.color;e.currentTarget.style.color=T.text;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.textTertiary;}}>+ Add source</span>
                </div>
              </div>

              {/* Save */}
              <div style={{display:"flex",gap:8}}>
                <div style={{padding:"8px 20px",borderRadius:99,background:app.color,color:"#fff",fontSize:12,fontWeight:600,fontFamily:T.sans,cursor:"pointer",transition:"opacity 0.15s"}} onMouseEnter={e=>{e.currentTarget.style.opacity="0.85";}} onMouseLeave={e=>{e.currentTarget.style.opacity="1";}}>Save Changes</div>
                <div onClick={()=>setAgentInstructions(null)} style={{padding:"8px 16px",borderRadius:99,background:T.surfaceMuted,color:T.textSecondary,fontSize:12,fontWeight:500,fontFamily:T.sans,cursor:"pointer",transition:"all 0.15s"}} onMouseEnter={e=>{e.currentTarget.style.background=T.border;}} onMouseLeave={e=>{e.currentTarget.style.background=T.surfaceMuted;}}>Reset to Default</div>
              </div>
            </div>
          </div>;
        })()}

        {/* Connectors section */}
        <div style={{marginBottom:28}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
            <div className="lbl">{IC.connector(T.textTertiary,12)} Connectors</div>
            <span style={{fontFamily:T.mono,fontSize:11,color:T.textTertiary}}>{connectorDetails.filter(c=>c.connected).length}/{connectorDetails.length} connected</span>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {connectorDetails.map((c,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderRadius:T.rSm,background:T.surface,border:`1px solid ${c.connected?T.greenBorder:T.borderSubtle}`}}>
              <div style={{width:28,height:28,borderRadius:7,background:c.connected?T.greenSoft:T.surfaceMuted,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                {c.connected?IC.check(T.green,12):<div style={{width:10,height:10,borderRadius:"50%",border:`2px solid ${T.textTertiary}`,opacity:0.4}}/>}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:T.sans,fontSize:13,fontWeight:500,color:T.text}}>{c.name||c.category}</div>
                {c.desc&&<div style={{fontFamily:T.sans,fontSize:11,color:T.textTertiary,marginTop:1}}>{c.category}</div>}
              </div>
              <span className="chip" style={{background:c.connected?T.greenSoft:T.surfaceMuted,color:c.connected?T.green:T.textTertiary}}>{c.connected?"Connected":"Not connected"}</span>
            </div>)}
            {connectorDetails.length===0&&<div style={{padding:16,textAlign:"center",fontSize:12,color:T.textTertiary}}>No connectors required</div>}
          </div>
        </div>

        {/* Workflows section */}
        <div style={{marginBottom:28}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
            <div className="lbl">{IC.workflow(T.textTertiary,12)} Workflows</div>
            <span style={{fontFamily:T.mono,fontSize:11,color:T.textTertiary}}>{(app.workflows||[]).length}/{(app.workflows||[]).length+recommendedWfs.length} configured</span>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {(app.workflows||[]).map((wf,i)=><div key={wf.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderRadius:T.rSm,background:T.surface,border:`1px solid ${T.greenBorder}`}}>
              <div style={{width:28,height:28,borderRadius:7,background:T.greenSoft,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{IC.check(T.green,12)}</div>
              <div style={{flex:1}}>
                <div style={{fontFamily:T.sans,fontSize:13,fontWeight:500,color:T.text}}>{wf.name}</div>
                <div style={{fontFamily:T.sans,fontSize:11,color:T.textTertiary,marginTop:1}}>{wf.steps} steps</div>
              </div>
              <span className="chip" style={{background:T.greenSoft,color:T.green}}>Active</span>
            </div>)}
            {recommendedWfs.map((rwf,i)=><div key={"r"+i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderRadius:T.rSm,background:T.surface,border:`1px dashed ${T.borderSubtle}`}}>
              <div style={{width:28,height:28,borderRadius:7,background:T.surfaceMuted,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><div style={{width:10,height:10,borderRadius:"50%",border:`2px solid ${T.textTertiary}`,opacity:0.4}}/></div>
              <div style={{flex:1}}>
                <div style={{fontFamily:T.sans,fontSize:13,fontWeight:500,color:T.textSecondary}}>{rwf.name}</div>
                <div style={{fontFamily:T.sans,fontSize:11,color:T.textTertiary,marginTop:1}}>{rwf.desc}</div>
              </div>
              <span className="chip" style={{background:T.highlightSoft,color:T.highlight}}>+{rwf.configImpact}%</span>
            </div>)}
          </div>
        </div>

        {/* Data Tables section */}
        <div style={{marginBottom:28}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
            <div className="lbl">{IC.grid(T.textTertiary,12)} Data Tables</div>
            <span style={{fontFamily:T.mono,fontSize:11,color:T.textTertiary}}>{linkedRegisters.length} linked</span>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {linkedRegisters.map(reg=><div key={reg.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderRadius:T.rSm,background:T.surface,border:`1px solid ${T.greenBorder}`}}>
              <div style={{width:28,height:28,borderRadius:7,background:T.greenSoft,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{IC.check(T.green,12)}</div>
              <div style={{flex:1}}>
                <div style={{fontFamily:T.sans,fontSize:13,fontWeight:500,color:T.text}}>{reg.name}</div>
                <div style={{fontFamily:T.sans,fontSize:11,color:T.textTertiary,marginTop:1}}>{reg.rowCount} rows</div>
              </div>
              <span className="chip" style={{background:T.greenSoft,color:T.green}}>Linked</span>
            </div>)}
            {linkedRegisters.length===0&&<div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderRadius:T.rSm,background:T.surface,border:`1px dashed ${T.borderSubtle}`}}>
              <div style={{width:28,height:28,borderRadius:7,background:T.surfaceMuted,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><div style={{width:10,height:10,borderRadius:"50%",border:`2px solid ${T.textTertiary}`,opacity:0.4}}/></div>
              <div style={{flex:1}}>
                <div style={{fontFamily:T.sans,fontSize:13,fontWeight:500,color:T.textSecondary}}>No tables linked</div>
                <div style={{fontFamily:T.sans,fontSize:11,color:T.textTertiary,marginTop:1}}>Connect a data table to improve config score</div>
              </div>
              <span className="chip" style={{background:T.highlightSoft,color:T.highlight}}>+5%</span>
            </div>}
          </div>
        </div>

        {/* People section */}
        <div style={{marginBottom:28}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
            <div className="lbl">{IC.people(T.textTertiary,12)} People</div>
            <span style={{fontFamily:T.mono,fontSize:11,color:T.textTertiary}}>{people.length} assigned</span>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {people.map((p,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderRadius:T.rSm,background:T.surface,border:`1px solid ${T.greenBorder}`}}>
              <div style={{width:28,height:28,borderRadius:"50%",background:app.color+"18",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:T.mono,fontSize:10,fontWeight:600,color:app.color,flexShrink:0}}>{p.initials}</div>
              <div style={{flex:1}}>
                <div style={{fontFamily:T.sans,fontSize:13,fontWeight:500,color:T.text}}>{p.name}</div>
                <div style={{fontFamily:T.sans,fontSize:11,color:T.textTertiary,marginTop:1}}>{p.role}</div>
              </div>
              <span className="chip" style={{background:T.greenSoft,color:T.green}}>Assigned</span>
            </div>)}
          </div>
        </div>

        {/* CTA */}
        {configScore<100&&<div style={{padding:"20px 24px",borderRadius:T.r,background:`linear-gradient(135deg, ${T.highlightSoft}, ${T.accentSoft})`,border:`1px solid ${T.highlightBorder}`,display:"flex",alignItems:"center",gap:16}}>
          <div style={{width:44,height:44,borderRadius:12,background:T.highlight+"20",border:`1px solid ${T.highlightBorder}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{IC.sparkle(T.highlight,20)}</div>
          <div style={{flex:1}}>
            <div style={{fontFamily:T.serif,fontSize:15,fontWeight:600,color:T.text}}>Complete setup to reach 100% config</div>
            <div style={{fontFamily:T.sans,fontSize:12,color:T.textSecondary,marginTop:2}}>Add the missing connectors and recommended workflows to unlock the full potential of {app.name}.</div>
          </div>
          <div style={{padding:"8px 20px",borderRadius:20,background:T.accent,color:"#fff",fontFamily:T.sans,fontSize:12.5,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",transition:"opacity 0.15s"}} onMouseEnter={e=>{e.currentTarget.style.opacity="0.85";}} onMouseLeave={e=>{e.currentTarget.style.opacity="1";}}>Complete Setup</div>
        </div>}
      </div>}

    </div>
  </div>;
}

/* ═══ BUILD MODE ═══ */
function BuildMode(){
  const[msgs,setMsgs]=useState([]);
  const[input,setInput]=useState("");
  const[started,setStarted]=useState(false);
  const[exampleIdx,setExampleIdx]=useState(0);
  const[phase,setPhase]=useState("enter"); // reset | enter | tick | hold | exit
  const[animChecked,setAnimChecked]=useState(0);
  const msgsEnd=useRef(null);

  const EXAMPLES=[
    {label:"Daily Audit",title:"Quality Inspection",doneCount:4,items:["Check temperature logs","Inspect equipment seals","Verify cleaning records","Review staff hygiene","Check storage conditions","Inspect packaging integrity"]},
    {label:"Safety Walk",title:"Floor Inspection",doneCount:3,items:["Check fire exits clear","PPE compliance check","Verify spill stations","Inspect walkway markings","Emergency shower test","First aid kit inventory"]},
    {label:"Shift Change",title:"Handover Report",doneCount:2,items:["Production summary","Equipment status update","Open issues review","Material inventory check","Safety incidents log","Next shift priorities"]},
    {label:"Training",title:"New Hire Onboarding",doneCount:3,items:["Safety orientation","Badge activation","System login setup","Floor tour complete","Emergency procedures","Buddy assignment"]},
  ];

  /* Animated cycling — phase state machine */
  useEffect(()=>{
    if(started) return;
    let t;
    const ex=EXAMPLES[exampleIdx];
    switch(phase){
      case "reset":
        t=setTimeout(()=>setPhase("enter"),40);
        break;
      case "enter":
        t=setTimeout(()=>setPhase("tick"),480);
        break;
      case "tick":
        if(animChecked<ex.doneCount){
          t=setTimeout(()=>setAnimChecked(c=>c+1),420);
        } else {
          t=setTimeout(()=>setPhase("hold"),400);
        }
        break;
      case "hold":
        t=setTimeout(()=>setPhase("exit"),1200);
        break;
      case "exit":
        t=setTimeout(()=>{
          setExampleIdx(i=>(i+1)%EXAMPLES.length);
          setAnimChecked(0);
          setPhase("reset");
        },450);
        break;
    }
    return()=>clearTimeout(t);
  },[phase,animChecked,started,exampleIdx]);

  const doSend=()=>{
    if(!input.trim())return;
    const q=input;setInput("");
    setMsgs(prev=>[...prev,{role:"user",text:q},{role:"ai",text:`Great — I'll build a "${q}" workflow for you. I'm setting up the trigger, adding inspection steps, and configuring notifications. You can see the preview updating on the right. Want me to add any conditional logic or approval steps?`}]);
    if(!started)setStarted(true);
  };
  useEffect(()=>{if(msgsEnd.current)msgsEnd.current.scrollIntoView({behavior:"smooth"});},[msgs]);

  /* ── Computed animation values ── */
  const ex=EXAMPLES[exampleIdx];
  const animPct=ex.items.length>0?Math.round((animChecked/ex.items.length)*100):0;

  /* Slide transform based on phase */
  const slideStyle=phase==="reset"
    ?{transform:"translateX(70px)",opacity:0,transition:"none"}
    :phase==="enter"
    ?{transform:"translateX(0)",opacity:1,transition:"transform 0.45s cubic-bezier(0.22,1,0.36,1), opacity 0.35s ease"}
    :phase==="exit"
    ?{transform:"translateX(-70px)",opacity:0,transition:"transform 0.4s cubic-bezier(0.55,0,1,0.45), opacity 0.3s ease"}
    :{transform:"translateX(0)",opacity:1,transition:"transform 0.45s cubic-bezier(0.22,1,0.36,1), opacity 0.35s ease"};

  /* ── Phone screen content renderer ── */
  const renderPhoneContent=()=><>
    <div style={{position:"absolute",top:10,left:"50%",transform:"translateX(-50%)",width:90,height:24,borderRadius:20,background:"#c5c5c8",zIndex:2}}/>
    <div style={{...slideStyle,display:"flex",flexDirection:"column",flex:1}}>
      <div style={{padding:"44px 18px 12px",borderBottom:"1px solid #f0f0f0"}}>
        <div style={{fontSize:10,color:"#999",fontFamily:T.mono,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>{ex.label}</div>
        <div style={{fontSize:17,fontWeight:600,fontFamily:T.serif,letterSpacing:"-0.02em"}}>{ex.title}</div>
        <div style={{marginTop:8}}><Bar pct={animPct} color={T.green} height={4}/></div>
        <div style={{fontSize:10,color:T.textTertiary,marginTop:4}}>{animChecked} of {ex.items.length} items complete</div>
      </div>
      <div style={{padding:"8px 14px",flex:1,overflowY:"auto"}}>
        {ex.items.map((item,i)=>{
          const isChecked=i<animChecked;
          return <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 6px",borderBottom:"1px solid #f5f5f5"}}>
            <div key={`${i}-${isChecked}`} style={{width:20,height:20,borderRadius:6,flexShrink:0,background:isChecked?T.green:"transparent",border:isChecked?"1.5px solid transparent":"1.5px solid #ddd",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:isChecked?`0 0 8px ${T.green}33`:"none",animation:isChecked?"checkPop 0.32s cubic-bezier(0.34,1.56,0.64,1)":"none"}}>{isChecked&&IC.check("#fff",10)}</div>
            <span style={{fontSize:13,color:isChecked?"#aaa":T.text,transition:"color 0.3s ease"}}>{item}</span>
          </div>;
        })}
      </div>
    </div>
    <div style={{padding:"8px 0 6px",display:"flex",justifyContent:"center"}}><div style={{width:120,height:4,borderRadius:2,background:"#d1d1d6"}}/></div>
  </>;

  /* ── Phone shell ── */
  const renderPhoneShell=(content)=><div style={{position:"relative"}}>
    <div style={{position:"absolute",right:-2,top:120,width:3,height:48,borderRadius:"0 2px 2px 0",background:"#c5c5c8"}}/>
    <div style={{position:"absolute",left:-2,top:100,width:3,height:28,borderRadius:"2px 0 0 2px",background:"#c5c5c8"}}/>
    <div style={{position:"absolute",left:-2,top:136,width:3,height:28,borderRadius:"2px 0 0 2px",background:"#c5c5c8"}}/>
    <div style={{width:310,borderRadius:44,background:"#e8e8ed",padding:"6px",boxShadow:"0 24px 64px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06), inset 0 0 0 1px rgba(0,0,0,0.08)"}}>
      <div style={{borderRadius:38,background:"#fff",height:620,overflow:"hidden",display:"flex",flexDirection:"column",position:"relative"}}>
        {content}
      </div>
    </div>
  </div>;

  const EASE="cubic-bezier(0.4,0,0.2,1)";
  const DUR="0.7s";

  /* ── Single DOM tree: chat panel + right area with phone + start overlay ── */
  return <div style={{flex:1,display:"flex",overflow:"hidden"}}>
    {/* Chat panel — always in DOM, slides in via marginLeft */}
    <div style={{width:380,flexShrink:0,display:"flex",flexDirection:"column",background:T.surface,borderRight:`1px solid ${T.border}`,marginLeft:started?0:-380,transition:`margin-left ${DUR} ${EASE}`}}>
      <div style={{padding:"14px 18px",borderBottom:`1px solid ${T.borderSubtle}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:28,height:28,borderRadius:9,background:T.accent,display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.sparkle("#fff",14)}</div><span style={{fontFamily:T.serif,fontSize:15,fontWeight:500}}>AI Builder</span></div>
        <div style={{display:"flex",alignItems:"center",gap:5,fontSize:10,fontFamily:T.mono,color:T.textTertiary}}><div style={{width:6,height:6,borderRadius:"50%",background:T.green,animation:"pulse 2.5s infinite"}}/>Online</div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"16px 18px",display:"flex",flexDirection:"column",gap:10}}>
        {msgs.map((m,i)=>m.role==="ai"
          ?<div key={i} style={{background:T.surfaceMuted,borderRadius:"16px 16px 16px 4px",padding:"14px 18px",fontSize:13.5,lineHeight:1.6,color:T.textSecondary,maxWidth:"92%",animation:"fadeIn 0.3s ease"}}>{m.text}</div>
          :<div key={i} style={{background:T.accent,borderRadius:"16px 16px 4px 16px",padding:"12px 16px",fontSize:13.5,lineHeight:1.5,color:"#fff",maxWidth:"85%",alignSelf:"flex-end",animation:"fadeIn 0.3s ease"}}>{m.text}</div>
        )}
        <div ref={msgsEnd}/>
      </div>
      <div style={{padding:"12px 18px",borderTop:`1px solid ${T.borderSubtle}`}}>
        <div className="chat-wrap">
          <input className="chat-in" type="text" placeholder="Describe changes..." value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")doSend();}}/>
          <div onClick={doSend} style={{width:32,height:32,borderRadius:9,flexShrink:0,background:input?T.accent:T.border,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"background 0.2s"}}>{IC.send(input?"#fff":T.textTertiary)}</div>
        </div>
      </div>
    </div>

    {/* Right area — phone centered + start content overlay */}
    <div style={{flex:1,position:"relative",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",background:T.bg}}>
      {/* Dot grid — fades in when started */}
      <div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(circle, ${T.border} 1px, transparent 1px)`,backgroundSize:"24px 24px",opacity:started?1:0,transition:`opacity 0.7s ${EASE}`,pointerEvents:"none"}}/>
      {/* Start content — positioned at top, fades out when started */}
      <div style={{position:"absolute",top:0,left:0,right:0,display:"flex",flexDirection:"column",alignItems:"center",paddingTop:"12vh",paddingBottom:60,background:`linear-gradient(${T.bg} 85%, transparent)`,opacity:started?0:1,pointerEvents:started?"none":"auto",transition:`opacity 0.5s ${EASE}`,zIndex:5}}>
        <div style={{maxWidth:540,width:"100%",padding:"0 24px"}}>
          <div style={{textAlign:"center",marginBottom:28}}>
            <div style={{width:48,height:48,borderRadius:14,background:T.accent,display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:14}}>{IC.sparkle("#fff",22)}</div>
            <h1 style={{fontFamily:T.serif,fontSize:28,fontWeight:400,letterSpacing:"-0.03em",lineHeight:1.2,marginBottom:8}}>What do you want to build today, Sarah?</h1>
            <p style={{fontSize:14,color:T.textSecondary,lineHeight:1.6}}>Describe a workflow, form, checklist, or frontline experience</p>
          </div>
          <div className="chat-wrap" style={{marginBottom:14}}>
            <input className="chat-in" type="text" placeholder="e.g. Quality inspection checklist for daily audits..." value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")doSend();}} style={{padding:"12px 0"}}/>
            <div onClick={doSend} style={{width:36,height:36,borderRadius:10,flexShrink:0,background:input?T.accent:T.border,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"background 0.2s"}}>{IC.send(input?"#fff":T.textTertiary)}</div>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center"}}>
            {["Inspection checklist","Shift handover form","Safety audit","Training module"].map((s,i)=><div key={i} className="action-chip" onClick={()=>{setInput(s);}}>{s}</div>)}
          </div>
        </div>
      </div>

      {/* Phone — always in DOM, transitions between peek and centered */}
      <div style={{transition:`transform ${DUR} ${EASE}`,transform:started?"translateY(0)":"translateY(44vh)"}}>
        {renderPhoneShell(renderPhoneContent())}
      </div>

      {/* Bottom gradient — fades out when started */}
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:80,background:`linear-gradient(transparent, ${T.bg})`,zIndex:3,pointerEvents:"none",opacity:started?0:1,transition:`opacity 0.4s ${EASE}`}}/>
    </div>
  </div>;
}

/* ═══ EDIT MODE — NODES LIBRARY ═══ */
function NodesLibrary({onToggle}){
  const[sections,setSections]=useState({flow:false,math:false,api:false});
  return<div style={{width:260,flexShrink:0,background:T.surface,borderRight:`1px solid ${T.border}`,display:"flex",flexDirection:"column",overflow:"hidden",animation:"fadeIn 0.3s ease"}}>
    <div style={{padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${T.borderSubtle}`}}>
      <span style={{fontFamily:T.serif,fontSize:15,fontWeight:500}}>Nodes Library</span>
      <div onClick={onToggle} style={{width:28,height:28,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",background:T.surfaceMuted}} onMouseEnter={e=>e.currentTarget.style.background=T.border} onMouseLeave={e=>e.currentTarget.style.background=T.surfaceMuted}>{IC.panel(T.textSecondary)}</div>
    </div>
    <div style={{flex:1,overflowY:"auto",padding:"10px 12px"}}>
      {NODE_TYPES.map((nt,i)=><div key={i} className="node-lib-item">
        <div style={{width:36,height:36,borderRadius:9,background:`${nt.color}12`,border:`1px solid ${nt.color}25`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{nt.icon(nt.color)}</div>
        <div><div style={{fontSize:12.5,fontWeight:600,letterSpacing:"-0.01em"}}>{nt.label}</div><div style={{fontSize:10.5,color:T.textSecondary,marginTop:1}}>{nt.desc}</div></div>
      </div>)}
      <div style={{marginTop:12}}>
        {[{key:"flow",label:"Playable flow nodes"},{key:"math",label:"Playable math nodes"},{key:"api",label:"Playable API nodes"}].map(s=><div key={s.key} onClick={()=>setSections(p=>({...p,[s.key]:!p[s.key]}))} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 8px",cursor:"pointer",borderTop:`1px solid ${T.borderSubtle}`}}>
          <span style={{fontSize:12,fontWeight:500,color:T.textSecondary}}>{s.label}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.textTertiary} strokeWidth="2" strokeLinecap="round" style={{transform:sections[s.key]?"rotate(180deg)":"rotate(0)",transition:"transform 0.2s"}}><path d="M6 9l6 6 6-6"/></svg>
        </div>)}
      </div>
    </div>
  </div>;
}

/* ═══ EDIT MODE — WORKFLOW CANVAS ═══ */
function WorkflowCanvas({nodes,edges,selectedId,onSelect}){
  const NW=200,NH=68;
  return<div style={{flex:1,position:"relative",overflow:"auto",background:T.bg,backgroundImage:`radial-gradient(circle, ${T.border} 1px, transparent 1px)`,backgroundSize:"24px 24px"}}>
    <svg style={{position:"absolute",top:0,left:0,width:800,height:1050,pointerEvents:"none"}}>
      {edges.map((e,i)=>{
        const fn=nodes.find(n=>n.id===e.from),tn=nodes.find(n=>n.id===e.to);
        if(!fn||!tn)return null;
        const x1=fn.x+NW/2,y1=fn.y+NH+4,x2=tn.x+NW/2,y2=tn.y-4;
        const my=(y1+y2)/2;
        const d=`M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}`;
        return<g key={i}>
          <path d={d} fill="none" stroke={T.border} strokeWidth="1.5"/>
          <circle cx={x1} cy={y1} r="3" fill={T.border}/>
          <circle cx={x2} cy={y2} r="3" fill={T.border}/>
          {e.label&&<><rect x={(x1+x2)/2-30} y={my-10} width={60} height={20} rx={4} fill={T.surface} stroke={T.border} strokeWidth="1"/><text x={(x1+x2)/2} y={my+3} textAnchor="middle" style={{fontSize:9.5,fontFamily:T.mono,fill:T.textSecondary}}>{e.label}</text></>}
        </g>;
      })}
    </svg>
    {nodes.map(node=>{
      const nt=NODE_TYPES.find(t=>t.type===node.type);
      const sel=node.id===selectedId;
      return<div key={node.id} onClick={()=>onSelect(node.id)} style={{
        position:"absolute",left:node.x,top:node.y,width:NW,
        background:T.surface,border:`2px solid ${sel?T.highlight:T.border}`,borderRadius:T.r,
        padding:"12px 14px",cursor:"pointer",
        boxShadow:sel?`0 0 0 3px ${T.highlightSoft}, 0 4px 16px rgba(0,0,0,0.08)`:"0 2px 8px rgba(0,0,0,0.04)",
        transition:"border-color 0.15s, box-shadow 0.15s",display:"flex",alignItems:"center",gap:10,
      }}>
        <div style={{width:32,height:32,borderRadius:8,background:nt?`${nt.color}12`:T.surfaceMuted,border:`1px solid ${nt?`${nt.color}25`:T.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{nt&&nt.icon(nt.color)}</div>
        <div style={{minWidth:0}}><div style={{fontSize:12.5,fontWeight:600,letterSpacing:"-0.01em",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{node.title}</div><div style={{fontSize:10.5,color:T.textTertiary,marginTop:1}}>{node.sub}</div></div>
      </div>;
    })}
  </div>;
}

/* ═══ EDIT MODE — PROPERTIES PANEL ═══ */
function PropertiesPanel({node,onToggle}){
  const[tab,setTab]=useState("properties");
  const nt=node?NODE_TYPES.find(t=>t.type===node.type):null;
  return<div style={{width:280,flexShrink:0,background:T.surface,borderLeft:`1px solid ${T.border}`,display:"flex",flexDirection:"column",overflow:"hidden",animation:"fadeIn 0.3s ease"}}>
    <div style={{padding:"14px 16px",borderBottom:`1px solid ${T.borderSubtle}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <div><div style={{fontFamily:T.serif,fontSize:15,fontWeight:500}}>Properties</div>{node&&<div style={{fontSize:11,color:T.textSecondary,marginTop:1}}>{node.title}</div>}</div>
      <div onClick={onToggle} style={{width:24,height:24,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:T.textTertiary}}>⋮</div>
    </div>
    {/* Tabs */}
    <div style={{display:"flex",padding:"8px 16px 0",gap:0,borderBottom:`1px solid ${T.borderSubtle}`}}>
      {["Properties","Widgets"].map((t,i)=>{const active=tab===(i===0?"properties":"widgets");return<div key={i} onClick={()=>setTab(i===0?"properties":"widgets")} style={{padding:"8px 16px",fontSize:12,fontWeight:active?600:400,color:active?T.highlight:T.textSecondary,borderBottom:active?`2px solid ${T.highlight}`:"2px solid transparent",cursor:"pointer",transition:"all 0.15s"}}>{t}</div>;})}
    </div>
    <div style={{flex:1,overflowY:"auto",padding:"16px"}}>
      {!node?<div style={{textAlign:"center",padding:"40px 0",color:T.textTertiary,fontSize:12}}>Select a node to view properties</div>
      :<div style={{display:"flex",flexDirection:"column",gap:16}}>
        {nt&&<div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",borderRadius:T.rSm,background:`${nt.color}08`,border:`1px solid ${nt.color}18`}}>
          <div style={{width:28,height:28,borderRadius:7,background:`${nt.color}15`,display:"flex",alignItems:"center",justifyContent:"center"}}>{nt.icon(nt.color)}</div>
          <div><div style={{fontSize:11,fontWeight:600,color:nt.color}}>{nt.label}</div><div style={{fontSize:10,color:T.textTertiary}}>{nt.desc}</div></div>
        </div>}
        <div>
          <label style={{fontSize:11,fontWeight:600,color:T.textSecondary,display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.04em",fontFamily:T.mono}}>Name</label>
          <input readOnly value={node.title} style={{width:"100%",padding:"8px 12px",borderRadius:T.rSm,border:`1px solid ${T.border}`,fontFamily:T.sans,fontSize:13,color:T.text,outline:"none",background:T.surfaceHover}}/>
        </div>
        <div>
          <label style={{fontSize:11,fontWeight:600,color:T.textSecondary,display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.04em",fontFamily:T.mono}}>Select Action Type</label>
          <div style={{width:"100%",padding:"8px 12px",borderRadius:T.rSm,border:`1px solid ${T.border}`,fontFamily:T.sans,fontSize:13,color:T.textTertiary,background:T.surfaceHover,display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}>
            <span>Select Action Type</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.textTertiary} strokeWidth="2" strokeLinecap="round"><path d="M6 9l6 6 6-6"/></svg>
          </div>
        </div>
        {node.type==="conditional"&&<div>
          <label style={{fontSize:11,fontWeight:600,color:T.textSecondary,display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.04em",fontFamily:T.mono}}>Condition</label>
          <input readOnly value="source == 'referral'" style={{width:"100%",padding:"8px 12px",borderRadius:T.rSm,border:`1px solid ${T.border}`,fontFamily:T.mono,fontSize:12,color:T.text,outline:"none",background:T.surfaceHover}}/>
        </div>}
      </div>}
    </div>
  </div>;
}

/* ═══ EDIT MODE — ORCHESTRATOR ═══ */
function EditMode(){
  const[nodes]=useState(SAMPLE_NODES);
  const[edges]=useState(SAMPLE_EDGES);
  const[selectedId,setSelectedId]=useState("n4");
  const[libOpen,setLibOpen]=useState(true);
  const[propsOpen,setPropsOpen]=useState(true);
  const selectedNode=nodes.find(n=>n.id===selectedId)||null;

  return<div style={{flex:1,display:"flex",overflow:"hidden"}}>
    {libOpen&&<NodesLibrary onToggle={()=>setLibOpen(false)}/>}
    {!libOpen&&<div style={{position:"absolute",left:8,top:68,zIndex:10,padding:"6px 10px",borderRadius:T.rSm,background:T.surface,border:`1px solid ${T.border}`,boxShadow:"0 2px 8px rgba(0,0,0,0.06)",cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontSize:11,fontWeight:500,color:T.textSecondary}} onClick={()=>setLibOpen(true)}>{IC.panel(T.textSecondary)} Nodes Library</div>}
    <WorkflowCanvas nodes={nodes} edges={edges} selectedId={selectedId} onSelect={setSelectedId}/>
    {propsOpen&&<PropertiesPanel node={selectedNode} onToggle={()=>setPropsOpen(false)}/>}
    {!propsOpen&&<div style={{position:"absolute",right:8,top:68,zIndex:10,padding:"6px 10px",borderRadius:T.rSm,background:T.surface,border:`1px solid ${T.border}`,boxShadow:"0 2px 8px rgba(0,0,0,0.06)",cursor:"pointer",fontSize:11,fontWeight:500,color:T.textSecondary}} onClick={()=>setPropsOpen(true)}>Properties</div>}
  </div>;
}

/* ═══ WIDGET: TASK LIST ═══ */
function TaskListWidget({mode,industry}){
  const tasks=(HOME_TASKS[industry]||HOME_TASKS.manufacturing);
  const doneCount=tasks.filter(t=>t.done).length;
  if(mode==="pinned"){
    const next=tasks.find(t=>!t.done);
    return<div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:32,height:32,borderRadius:9,background:T.accentSoft,display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.tasks(T.accent)}</div>
          <div><div style={{fontSize:13,fontWeight:600,letterSpacing:"-0.01em"}}>Today's Tasks</div><div style={{fontSize:11,color:T.textTertiary,marginTop:1}}>{doneCount} of {tasks.length} complete</div></div>
        </div>
      </div>
      <Bar pct={(doneCount/tasks.length)*100} color={T.green} height={4}/>
      {next&&<div style={{marginTop:10,fontSize:12,color:T.textSecondary,display:"flex",alignItems:"center",gap:6}}>
        <span style={{color:T.textTertiary}}>Next:</span>{next.text}
        {next.tag&&<span className="chip" style={{background:T.accentSoft,color:T.textSecondary}}>{next.tag}</span>}
      </div>}
    </div>;
  }
  return<div>
    {tasks.map((task,i)=><div key={i} style={{padding:"9px 0",borderBottom:i<tasks.length-1?`1px solid ${T.borderSubtle}`:"none",display:"flex",alignItems:"flex-start",gap:10,opacity:task.done?0.4:1}}>
      <div style={{width:18,height:18,borderRadius:6,flexShrink:0,border:task.done?"none":`1.5px solid ${task.ai?T.accentBorder:T.border}`,background:task.done?T.border:task.ai?T.accentSoft:"transparent",marginTop:1,display:"flex",alignItems:"center",justifyContent:"center"}}>{task.done&&IC.check("#fff",10)}</div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:13,letterSpacing:"-0.01em",color:task.done?T.textTertiary:T.text,textDecoration:task.done?"line-through":"none",lineHeight:1.35}}>{task.text}</div>
        {task.ai&&!task.done&&<div style={{marginTop:4,fontSize:10.5,color:T.highlight,fontFamily:T.mono,lineHeight:1.4,paddingLeft:9,borderLeft:`2px solid ${T.highlightBorder}`}}>{task.aiNote}</div>}
      </div>
      {task.tag&&<span className="chip" style={{background:task.ai?T.accentSoft:T.surfaceMuted,color:task.ai?T.text:T.textTertiary,flexShrink:0,marginTop:1}}>{task.tag}</span>}
    </div>)}
  </div>;
}

/* ═══ WIDGET: VELOCITY CHART ═══ */
function VelocityWidget({mode}){
  if(mode==="pinned") return<div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <div style={{width:32,height:32,borderRadius:9,background:T.greenSoft,display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.chart(T.green)}</div>
        <div><div style={{fontSize:13,fontWeight:600,letterSpacing:"-0.01em"}}>Team Velocity</div><div style={{fontSize:11,color:T.textTertiary,marginTop:1}}>Last 12 weeks</div></div>
      </div>
      <div style={{display:"flex",alignItems:"baseline",gap:6}}>
        <span style={{fontFamily:T.serif,fontSize:22,fontWeight:500,letterSpacing:"-0.03em"}}>72</span>
        <span className="chip" style={{background:T.greenSoft,color:T.green}}>↑ 12%</span>
      </div>
    </div>
    <Sparkline data={velData} color={T.green} fill/>
  </div>;
  return<div>
    <div className="lbl" style={{marginBottom:8}}>{IC.pin(T.textTertiary)} Team Velocity</div>
    <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:10}}>
      <span style={{fontFamily:T.serif,fontSize:28,fontWeight:500,letterSpacing:"-0.03em"}}>72</span>
      <span className="chip" style={{background:T.greenSoft,color:T.green}}>↑ 12%</span>
    </div>
    <Sparkline data={velData} color={T.green} fill/>
  </div>;
}

/* ═══ WIDGET: COMPLETION CHART ═══ */
function CompletionWidget({mode}){
  if(mode==="pinned") return<div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <div style={{width:32,height:32,borderRadius:9,background:T.highlightSoft,display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.chart(T.highlight)}</div>
        <div><div style={{fontSize:13,fontWeight:600,letterSpacing:"-0.01em"}}>Completion Rate</div><div style={{fontSize:11,color:T.textTertiary,marginTop:1}}>This quarter</div></div>
      </div>
      <div style={{display:"flex",alignItems:"baseline",gap:6}}>
        <span style={{fontFamily:T.serif,fontSize:22,fontWeight:500,letterSpacing:"-0.03em"}}>93%</span>
        <span className="chip" style={{background:T.highlightSoft,color:T.highlight}}>↑ 3%</span>
      </div>
    </div>
    <MiniBar data={compData} color={T.highlight}/>
  </div>;
  return<div>
    <div className="lbl" style={{marginBottom:8}}>{IC.pin(T.textTertiary)} Completion Rate</div>
    <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:10}}>
      <span style={{fontFamily:T.serif,fontSize:28,fontWeight:500,letterSpacing:"-0.03em"}}>93<span style={{fontSize:16,fontWeight:400}}>%</span></span>
      <span className="chip" style={{background:T.highlightSoft,color:T.highlight}}>↑ 3%</span>
    </div>
    <MiniBar data={compData} color={T.highlight}/>
  </div>;
}

/* ═══ WIDGET: REVENUE ═══ */
function RevenueWidget({mode}){
  if(mode==="pinned") return<div style={{background:T.dark,borderRadius:T.rSm,padding:"16px 18px",margin:"-16px -18px",color:"#D6D3D1"}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <div style={{width:32,height:32,borderRadius:9,background:"rgba(37,99,235,0.14)",display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.chart(T.highlight)}</div>
        <div><div style={{fontSize:13,fontWeight:600,letterSpacing:"-0.01em",color:"#E7E5E4"}}>Pipeline Revenue</div><div style={{fontSize:11,color:"#78716C",marginTop:1}}>This month</div></div>
      </div>
      <div style={{display:"flex",alignItems:"baseline",gap:6}}>
        <span style={{fontFamily:T.serif,fontSize:22,fontWeight:500,letterSpacing:"-0.03em",color:"#F5F5F4"}}>$284k</span>
        <span className="chip" style={{background:"rgba(5,150,105,0.15)",color:"#34D399"}}>↑ 18%</span>
      </div>
    </div>
    <AreaChart data={revData} color={T.highlight}/>
    <div style={{display:"flex",justifyContent:"space-between",marginTop:8,fontSize:9.5,fontFamily:T.mono,color:"#57534E"}}><span>Feb 1</span><span>Feb 15</span><span>Mar 1</span></div>
  </div>;
  return<div style={{background:T.dark,borderRadius:T.rSm,padding:"16px 18px",border:`1px solid ${T.darkBorder}`,color:"#D6D3D1"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
      <div className="lbl" style={{color:"#78716C"}}>{IC.pin("#78716C")} Pipeline Revenue</div>
      <div style={{display:"flex",gap:3}}>{["1W","1M","3M"].map((p,i)=><span key={i} style={{padding:"2px 8px",borderRadius:99,fontSize:9.5,fontFamily:T.mono,background:i===1?"rgba(255,255,255,0.08)":"transparent",color:i===1?"#E7E5E4":"#57534E",cursor:"pointer"}}>{p}</span>)}</div>
    </div>
    <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:14}}>
      <span style={{fontFamily:T.serif,fontSize:26,fontWeight:500,letterSpacing:"-0.03em",color:"#F5F5F4"}}>$284k</span>
      <span className="chip" style={{background:"rgba(5,150,105,0.15)",color:"#34D399"}}>↑ 18%</span>
    </div>
    <AreaChart data={revData} color={T.highlight}/>
    <div style={{display:"flex",justifyContent:"space-between",marginTop:8,fontSize:9.5,fontFamily:T.mono,color:"#57534E"}}><span>Feb 1</span><span>Feb 15</span><span>Mar 1</span></div>
  </div>;
}

/* ═══ WIDGET: ACTIVITY ═══ */
const HOME_ACTIVITY={
  manufacturing:[
    {time:"9:02am",text:"Analyzed overnight shift handover logs",type:"done"},
    {time:"9:01am",text:"Flagged bearing temp anomaly on Line 3",type:"alert"},
    {time:"8:58am",text:"Auto-populated OEE report from MES data",type:"done"},
    {time:"now",text:"Monitoring Line 1 quality hold status...",type:"active"},
  ],
  qsr:[
    {time:"6:32am",text:"Verified walk-in cooler temps within range",type:"done"},
    {time:"6:30am",text:"Cross-referenced crew schedule with forecast",type:"done"},
    {time:"6:28am",text:"Flagged 1 call-out — suggested backup crew",type:"alert"},
    {time:"now",text:"Monitoring delivery order queue...",type:"active"},
  ],
  "transport-logistics":[
    {time:"7:45am",text:"Reviewed 24 pre-trip inspection reports",type:"done"},
    {time:"7:42am",text:"Flagged 2 safety issues on Unit 4472",type:"alert"},
    {time:"7:38am",text:"Detected $340 fuel card variance",type:"done"},
    {time:"now",text:"Monitoring real-time fleet positions...",type:"active"},
  ],
};
const activityItems=HOME_ACTIVITY.manufacturing;
function ActivityWidget({mode,industry}){
  const items=(HOME_ACTIVITY[industry]||HOME_ACTIVITY.manufacturing);
  if(mode==="pinned") return<div>
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
      <div style={{width:32,height:32,borderRadius:9,background:T.greenSoft,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:8,height:8,borderRadius:"50%",background:T.green,animation:"pulse 2s infinite"}}/></div>
      <div><div style={{fontSize:13,fontWeight:600,letterSpacing:"-0.01em"}}>AI Activity</div><div style={{fontSize:11,color:T.textTertiary,marginTop:1}}>4 actions today</div></div>
    </div>
    {items.map((item,i)=><div key={i} style={{display:"flex",gap:10,padding:"6px 0",borderBottom:i<items.length-1?`1px solid ${T.borderSubtle}`:"none"}}>
      <span style={{fontSize:10,fontFamily:T.mono,color:item.type==="active"?T.highlight:T.textTertiary,width:48,flexShrink:0,paddingTop:1.5}}>{item.time}</span>
      <div style={{position:"relative",paddingLeft:14}}>
        <div style={{position:"absolute",left:0,top:5,width:6,height:6,borderRadius:"50%",background:item.type==="active"?T.highlight:item.type==="alert"?T.amber:T.border,boxShadow:item.type==="active"?`0 0 6px ${T.highlightSoft}`:"none"}}/>
        <span style={{fontSize:12,color:item.type==="active"?T.text:T.textSecondary,letterSpacing:"-0.01em",lineHeight:1.4}}>{item.text}</span>
      </div>
    </div>)}
  </div>;
  return<div>
    <div className="lbl" style={{marginBottom:10}}><div style={{width:6,height:6,borderRadius:"50%",background:T.green,animation:"pulse 2s infinite"}}/>Recent AI Activity</div>
    {items.map((item,i)=><div key={i} style={{display:"flex",gap:10,padding:"7px 0",borderBottom:i<items.length-1?`1px solid ${T.borderSubtle}`:"none"}}>
      <span style={{fontSize:10,fontFamily:T.mono,color:item.type==="active"?T.highlight:T.textTertiary,width:48,flexShrink:0,paddingTop:1.5}}>{item.time}</span>
      <div style={{position:"relative",paddingLeft:14}}>
        <div style={{position:"absolute",left:0,top:5,width:6,height:6,borderRadius:"50%",background:item.type==="active"?T.highlight:item.type==="alert"?T.amber:T.border,boxShadow:item.type==="active"?`0 0 6px ${T.highlightSoft}`:"none"}}/>
        <span style={{fontSize:12,color:item.type==="active"?T.text:T.textSecondary,letterSpacing:"-0.01em",lineHeight:1.4}}>{item.text}</span>
      </div>
    </div>)}
  </div>;
}

/* ═══ WIDGET: QUICK STATS ═══ */
const HOME_STATS={
  manufacturing:[
    {label:"Open WOs",value:"7",sub:"2 are critical",color:T.violet},
    {label:"OEE today",value:"84%",sub:"↑3% vs yesterday",color:T.green},
    {label:"Quality holds",value:"2",sub:"Awaiting review",color:T.amber},
  ],
  qsr:[
    {label:"Transactions",value:"142",sub:"↑8% vs last week",color:T.green},
    {label:"Labor cost",value:"28%",sub:"On target",color:T.violet},
    {label:"Safety score",value:"96",sub:"Last audit",color:T.amber},
  ],
  "transport-logistics":[
    {label:"Active loads",value:"38",sub:"2 exceptions",color:T.violet},
    {label:"HOS rate",value:"98%",sub:"Fleet-wide",color:T.green},
    {label:"On-time",value:"94%",sub:"This week",color:T.amber},
  ],
};
const quickStatsData=HOME_STATS.manufacturing;
function QuickStatsWidget({mode,industry}){
  const stats=(HOME_STATS[industry]||HOME_STATS.manufacturing);
  if(mode==="pinned") return<div>
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
      <div style={{width:32,height:32,borderRadius:9,background:T.violetSoft,display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.chart(T.violet)}</div>
      <div><div style={{fontSize:13,fontWeight:600,letterSpacing:"-0.01em"}}>Quick Stats</div><div style={{fontSize:11,color:T.textTertiary,marginTop:1}}>Today's numbers</div></div>
    </div>
    <div style={{display:"flex",gap:16}}>
      {stats.map((s,i)=><div key={i} style={{flex:1,textAlign:"center"}}>
        <div style={{fontFamily:T.serif,fontSize:22,fontWeight:500,letterSpacing:"-0.02em",marginBottom:2}}>{s.value}</div>
        <div style={{fontSize:10,color:T.textTertiary,fontFamily:T.mono,textTransform:"uppercase",letterSpacing:"0.04em"}}>{s.label}</div>
        <div style={{fontSize:10.5,color:T.textSecondary,marginTop:3}}>{s.sub}</div>
      </div>)}
    </div>
  </div>;
  return<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
    {stats.map((stat,i)=><div key={i} className="bento" style={{padding:"14px 16px"}}>
      <div className="lbl" style={{marginBottom:4}}>{stat.label}</div>
      <div style={{fontFamily:T.serif,fontSize:22,fontWeight:500,letterSpacing:"-0.02em"}}>{stat.value}</div>
      <div style={{fontSize:11,color:T.textTertiary,marginTop:2}}>{stat.sub}</div>
    </div>)}
  </div>;
}

/* ═══ AGENT BRIEFING WIDGET ═══ */
function AgentBriefingWidget({mode,industry,installedApps,onNavigate}){
  /* Collect alerts from installed apps' agents */
  const apps=installedApps||[];
  const briefings=apps.map(appId=>{
    const agentData=APP_AGENT_INSIGHTS[appId];
    const appInfo=APP_CATALOG.find(a=>a.id===appId);
    if(!agentData||!appInfo)return null;
    const alert=agentData.insights.find(i=>i.type==="alert");
    return{appId,agent:agentData.agent,appName:appInfo.name,color:appInfo.color,proactive:agentData.proactive,alert,severity:alert?alert.severity:"low"};
  }).filter(Boolean);
  /* Sort: high severity first */
  briefings.sort((a,b)=>{const o={high:0,medium:1,positive:2,low:3};return(o[a.severity]||3)-(o[b.severity]||3);});
  const alertCount=briefings.filter(b=>b.severity==="high").length;

  if(briefings.length===0){
    return<div>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
        <div style={{width:32,height:32,borderRadius:9,background:T.accentSoft,display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.sparkle(T.accent)}</div>
        <div><div style={{fontSize:13,fontWeight:600,letterSpacing:"-0.01em"}}>Agent Briefing</div><div style={{fontSize:11,color:T.textTertiary,marginTop:1}}>No apps installed yet</div></div>
      </div>
      <div style={{fontSize:12,color:T.textTertiary,lineHeight:1.5}}>Install apps from the Catalog to see agent insights here.</div>
    </div>;
  }

  if(mode==="pinned"){
    /* Compact view — show top 4 */
    const shown=briefings.slice(0,4);
    return<div>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
        <div style={{width:32,height:32,borderRadius:9,background:T.accentSoft,display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.sparkle(T.accent)}</div>
        <div><div style={{fontSize:13,fontWeight:600,letterSpacing:"-0.01em"}}>Agent Briefing</div><div style={{fontSize:11,color:T.textTertiary,marginTop:1}}>{alertCount>0?`${alertCount} item${alertCount!==1?"s":""} need${alertCount===1?"s":""} attention`:"All clear"}</div></div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {shown.map((b,i)=>{
          const sevCol=b.severity==="high"?T.rose:b.severity==="medium"?T.amber:T.green;
          const sevBg=b.severity==="high"?T.roseSoft:b.severity==="medium"?T.amberSoft:T.greenSoft;
          return<div key={i} onClick={()=>{window.location.hash="#app/"+b.appId;}} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:T.rSm,background:T.surfaceHover,border:`1px solid ${T.borderSubtle}`,cursor:"pointer",transition:"all 0.15s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=b.color+"50";e.currentTarget.style.background=b.color+"08";}} onMouseLeave={e=>{e.currentTarget.style.borderColor=T.borderSubtle;e.currentTarget.style.background=T.surfaceHover;}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:sevCol,flexShrink:0}}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:12,fontWeight:600,color:T.text,letterSpacing:"-0.01em",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{b.agent}</div>
              <div style={{fontSize:11,color:T.textSecondary,marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{b.alert?b.alert.title:b.proactive?.message?.slice(0,60)+"..."}</div>
            </div>
            <span style={{fontSize:9,fontFamily:T.mono,padding:"2px 7px",borderRadius:99,background:sevBg,color:sevCol,fontWeight:600,flexShrink:0}}>{b.severity==="high"?"Alert":b.severity==="medium"?"Watch":"OK"}</span>
            {IC.chevRight(T.textTertiary,12)}
          </div>;
        })}
      </div>
      {briefings.length>4&&<div style={{fontSize:11,color:T.textTertiary,marginTop:8,textAlign:"center"}}>+{briefings.length-4} more agent{briefings.length-4!==1?"s":""}</div>}
    </div>;
  }

  /* Inline (chat) mode — more compact */
  return<div>
    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
      {IC.sparkle(T.accent,12)}
      <span style={{fontSize:12,fontWeight:600,color:T.text}}>Agent Briefing</span>
      {alertCount>0&&<span style={{fontSize:9,fontFamily:T.mono,padding:"1px 6px",borderRadius:99,background:T.roseSoft,color:T.rose,fontWeight:600}}>{alertCount} alert{alertCount!==1?"s":""}</span>}
    </div>
    {briefings.slice(0,3).map((b,i)=><div key={i} style={{fontSize:12,color:T.textSecondary,padding:"4px 0",display:"flex",alignItems:"center",gap:6}}>
      <div style={{width:6,height:6,borderRadius:"50%",background:b.severity==="high"?T.rose:b.severity==="medium"?T.amber:T.green,flexShrink:0}}/>
      <span style={{fontWeight:500,color:T.text}}>{b.agent}:</span> {b.alert?b.alert.title:"All clear"}
    </div>)}
  </div>;
}

/* ═══ WIDGET DISPATCHER ═══ */
const WIDGET_MAP={agentBriefing:AgentBriefingWidget,taskList:TaskListWidget,velocity:VelocityWidget,completion:CompletionWidget,revenue:RevenueWidget,activity:ActivityWidget,quickStats:QuickStatsWidget};
const WIDGET_LABELS={agentBriefing:"Agent Briefing",taskList:"Tasks",velocity:"Velocity",completion:"Completion",revenue:"Revenue",activity:"Activity",quickStats:"Stats"};

function ChatWidget({widget,mode,isPinned,onPin,onUnpin,industry,installedApps,onNavigate}){
  const Comp=WIDGET_MAP[widget.type];
  if(!Comp) return null;
  const pinned=isPinned;
  const isRevenuePinned=widget.type==="revenue"&&mode==="pinned";
  return<div style={{position:"relative",borderRadius:T.r,border:`1px solid ${isRevenuePinned?"transparent":T.border}`,padding:mode==="pinned"?"18px":"14px 16px",background:isRevenuePinned?"transparent":T.surface,overflow:"hidden",transition:"all 0.3s cubic-bezier(0.4,0,0.2,1)",boxShadow:mode==="pinned"?T.shadow:"none"}}>
    <div onClick={()=>pinned?onUnpin(widget.type):onPin(widget.type)} style={{position:"absolute",top:mode==="pinned"?10:8,right:mode==="pinned"?10:8,width:26,height:26,borderRadius:7,background:pinned?T.highlightSoft:T.surfaceMuted,border:`1px solid ${pinned?T.highlightBorder:T.border}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all 0.15s",zIndex:2,opacity:mode==="pinned"?1:0.6}} onMouseEnter={e=>{e.currentTarget.style.opacity="1";e.currentTarget.style.transform="scale(1.08)";}} onMouseLeave={e=>{e.currentTarget.style.opacity=mode==="pinned"?"1":"0.6";e.currentTarget.style.transform="scale(1)";}} title={pinned?"Unpin from dashboard":"Pin to dashboard"}>
      {IC.pin(pinned?T.highlight:T.textTertiary,10)}
    </div>
    <Comp mode={mode} industry={industry} installedApps={installedApps} onNavigate={onNavigate}/>
  </div>;
}

/* ═══ SETUP WIDGET (in-chat readiness card) ═══ */
function SetupWidget({industry,selectedGoals,addedWorkflows,setAddedWorkflows,focusGoalName,onNavigate}){
  const[expanded,setExpanded]=useState(false);
  const _addedWorkflows=addedWorkflows||[];
  const workflows=useMemo(()=>{
    const templates=WORKFLOW_TEMPLATES[industry]||[];
    return templates.filter(w=>w.goalIds.some(id=>selectedGoals.includes(id)));
  },[industry,selectedGoals]);
  const peopleAssets=useMemo(()=>{
    const pa=PEOPLE_ASSETS_TEMPLATES[industry]||{people:[],assets:[]};
    return{
      people:pa.people.filter(p=>p.goalIds.some(id=>selectedGoals.includes(id))),
      assets:pa.assets.filter(a=>a.goalIds.some(id=>selectedGoals.includes(id))),
    };
  },[industry,selectedGoals]);
  const goalItems=[
    {id:"primary",name:"Set your primary objective",sub:"What outcome matters most?",pts:10,done:true},
    {id:"metrics",name:"Define success metrics",sub:"KPIs and targets",pts:10,done:false},
    {id:"timeline",name:"Set a timeline",sub:"When do you need results?",pts:10,done:false},
  ];
  const goalDone=goalItems.filter(g=>g.done).length;
  const wfDone=_addedWorkflows.length;
  const totalPts=(goalDone*10)+(wfDone*15);
  const maxPts=(goalItems.length*10)+(workflows.length*15)+(peopleAssets.people.length*5)+(peopleAssets.assets.length*5);
  const pct=maxPts>0?Math.round((totalPts/maxPts)*100):0;

  const sections=[
    {key:"goal",label:"Goal",sub:"Define what you want to achieve",icon:IC.target,color:T.highlight,iconBg:T.highlightSoft,done:goalDone,total:goalItems.length,pts:goalDone*10},
    {key:"workflows",label:"Workflows",sub:"Map your core processes",icon:IC.workflow,color:T.green,iconBg:T.greenSoft,done:wfDone,total:workflows.length,pts:wfDone*15},
    {key:"people",label:"People",sub:"Connect your team",icon:IC.people,color:T.violet,iconBg:T.violetSoft,done:0,total:peopleAssets.people.length,pts:0},
    {key:"assets",label:"Assets",sub:"Register equipment and locations",icon:IC.asset,color:T.amber,iconBg:T.amberSoft,done:0,total:peopleAssets.assets.length,pts:0},
  ];

  const toggleWf=(wId)=>{if(setAddedWorkflows)setAddedWorkflows(prev=>prev.includes(wId)?prev.filter(x=>x!==wId):[...prev,wId]);};

  return<div style={{marginTop:6,borderRadius:T.r,border:`1px solid ${T.border}`,overflow:"hidden",background:T.surface,animation:"fadeIn 0.4s ease 0.1s both"}}>
    {/* Dark readiness header */}
    <div style={{background:`linear-gradient(145deg, ${T.dark} 0%, #292524 100%)`,padding:"18px 20px",display:"flex",alignItems:"center",gap:16}}>
      <MiniRing pct={pct} size={48} stroke={4} color={pct>=60?T.green:pct>=30?T.highlight:T.amber}/>
      <div style={{flex:1}}>
        <div style={{fontFamily:T.serif,fontSize:18,fontWeight:500,color:"#F5F5F4",letterSpacing:"-0.02em"}}><span style={{fontFamily:T.mono,fontWeight:700,marginRight:6}}>{pct}</span>Readiness Score</div>
        <div style={{fontSize:11,color:"#78716C",marginTop:2}}>{totalPts} of {maxPts} points earned</div>
      </div>
      <div style={{display:"flex",gap:6}}>
        {sections.map(s=><span key={s.key} style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 8px",borderRadius:99,background:"rgba(255,255,255,0.06)",fontSize:10,fontFamily:T.mono,color:"#A8A29E"}}>
          <span style={{width:5,height:5,borderRadius:"50%",background:s.color}}/>
          {s.done}/{s.total}
        </span>)}
      </div>
    </div>

    {/* Collapsed: summary row with section icons + Get started button */}
    {!expanded&&<div style={{padding:"14px 20px",display:"flex",alignItems:"center",gap:14,borderTop:`1px solid ${T.borderSubtle}`}}>
      <div style={{flex:1,display:"flex",alignItems:"center",gap:12}}>
        {sections.map(s=><div key={s.key} style={{display:"flex",alignItems:"center",gap:7}}>
          <div style={{width:28,height:28,borderRadius:7,background:s.iconBg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{s.icon(s.color,13)}</div>
          <div>
            <div style={{fontSize:12,fontWeight:600,letterSpacing:"-0.01em",lineHeight:1.2}}>{s.label}</div>
            <div style={{fontSize:10,color:T.textTertiary,fontFamily:T.mono}}>{s.done}/{s.total}</div>
          </div>
        </div>)}
      </div>
      <div onClick={()=>setExpanded(true)} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"8px 18px",borderRadius:99,background:T.accent,color:"#fff",fontSize:12.5,fontWeight:600,letterSpacing:"-0.01em",cursor:"pointer",transition:"all 0.2s",boxShadow:"0 2px 8px rgba(28,25,23,0.12)",flexShrink:0,whiteSpace:"nowrap"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow="0 4px 14px rgba(28,25,23,0.18)";}} onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 2px 8px rgba(28,25,23,0.12)";}}>
        {IC.sparkle("#fff",12)}
        Get started
      </div>
    </div>}

    {/* Expanded: full section cards */}
    {expanded&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:0,animation:"fadeIn 0.3s ease"}}>
      {sections.map((sec,si)=>{
        const secPct=sec.total>0?Math.round((sec.done/sec.total)*100):0;
        const items=sec.key==="goal"?goalItems:sec.key==="workflows"?workflows:sec.key==="people"?peopleAssets.people.map(p=>({id:p.role,name:p.role,sub:`${p.goalIds.length} goals`})):peopleAssets.assets.map(a=>({id:a.name,name:a.name,sub:`${a.goalIds.length} goals`}));
        return<div key={sec.key} style={{padding:"16px 18px",borderTop:`1px solid ${T.borderSubtle}`,borderRight:si%2===0?`1px solid ${T.borderSubtle}`:"none"}}>
          {/* Section header */}
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
            <div style={{width:34,height:34,borderRadius:9,background:sec.iconBg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{sec.icon(sec.color,16)}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:14,fontWeight:600,letterSpacing:"-0.01em"}}>{sec.label}</div>
              <div style={{fontSize:11,color:T.textTertiary,marginTop:1}}>{sec.sub}</div>
            </div>
            <Ring pct={secPct} size={38} stroke={3} color={sec.color}/>
          </div>

          {/* Progress line */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
            <span style={{fontSize:9.5,fontFamily:T.mono,textTransform:"uppercase",letterSpacing:"0.06em",color:T.textTertiary}}>{sec.done} of {sec.total} complete</span>
            <span style={{fontSize:10,fontFamily:T.mono,color:sec.color,fontWeight:600}}>{sec.pts} pts</span>
          </div>
          <Bar pct={secPct} color={sec.color} height={3}/>

          {/* Items */}
          <div style={{marginTop:10,display:"flex",flexDirection:"column",gap:0}}>
            {items.map((item,ii)=>{
              const isDone=sec.key==="goal"?item.done:sec.key==="workflows"?_addedWorkflows.includes(item.id):false;
              return<div key={item.id||ii} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 0",borderTop:ii>0?`1px solid ${T.borderSubtle}`:"none"}}>
                {isDone?<div style={{width:20,height:20,borderRadius:6,background:sec.color,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{IC.check("#fff",10)}</div>:<div style={{width:20,height:20,borderRadius:6,border:`1.5px solid ${T.border}`,flexShrink:0}}/>}
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12.5,fontWeight:isDone?500:400,color:isDone?T.text:T.textSecondary,letterSpacing:"-0.01em"}}>{item.name}</div>
                  {item.sub&&!isDone&&<div style={{fontSize:10,color:T.textTertiary,marginTop:1}}>{item.sub}</div>}
                </div>
                {isDone?<span style={{fontSize:10,fontFamily:T.mono,color:sec.color,fontWeight:600}}>+{sec.key==="goal"?10:15}</span>
                :<div onClick={()=>{
                  if(sec.key==="workflows")toggleWf(item.id);
                }} style={{padding:"4px 12px",borderRadius:99,fontSize:10.5,fontWeight:500,border:`1px solid ${T.border}`,color:T.textSecondary,cursor:"pointer",display:"flex",alignItems:"center",gap:4,transition:"all 0.15s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=sec.color;e.currentTarget.style.color=sec.color;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.textSecondary;}}>{IC.plus(T.textSecondary,10)} Add</div>}
              </div>;
            })}
          </div>
        </div>;
      })}
    </div>}
  </div>;
}

/* ═══ CHAT MESSAGE (with avatar for AI) ═══ */
function ChatMessage({msg,pinnedWidgets,onPin,onUnpin,industry,fromChatOnboarding,selectedGoals,addedWorkflows,setAddedWorkflows,focusGoalName,onNavigate}){
  const isAI=msg.role==="ai";
  const parseBold=(text)=>{
    const parts=text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p,i)=>{
      if(p.startsWith("**")&&p.endsWith("**")) return<strong key={i} style={{color:T.text,fontWeight:600}}>{p.slice(2,-2)}</strong>;
      return p;
    });
  };

  if(!isAI) return<div style={{alignSelf:"flex-end",maxWidth:"85%",animation:"fadeInUp 0.35s cubic-bezier(0.4,0,0.2,1)"}}>
    <div style={{background:T.accent,borderRadius:"16px 16px 4px 16px",padding:"12px 18px",fontSize:13.5,lineHeight:1.55,color:"#fff",letterSpacing:"-0.01em",boxShadow:"0 2px 8px rgba(28,25,23,0.12)"}}>{msg.text}</div>
  </div>;

  /* AI message with avatar */
  return<div style={{display:"flex",gap:12,alignItems:"flex-start",animation:"fadeInUp 0.4s cubic-bezier(0.4,0,0.2,1)",maxWidth:"92%"}}>
    <div style={{width:32,height:32,borderRadius:10,background:T.accent,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:"0 2px 8px rgba(28,25,23,0.1)"}}>{IC.sparkle("#fff",14)}</div>
    <div style={{flex:1,minWidth:0,display:"flex",flexDirection:"column",gap:8}}>
      <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:"4px 16px 16px 16px",padding:"14px 18px",fontSize:13.5,lineHeight:1.6,color:T.textSecondary,letterSpacing:"-0.01em",boxShadow:T.shadow}}>
        {parseBold(msg.text)}
      </div>
      {msg.setupWidget&&<SetupWidget industry={industry} selectedGoals={selectedGoals} addedWorkflows={addedWorkflows} setAddedWorkflows={setAddedWorkflows} focusGoalName={focusGoalName} onNavigate={onNavigate}/>}
      {msg.widgets&&msg.widgets.length>0&&<div style={{display:"flex",flexDirection:"column",gap:8}}>
        {msg.widgets.map((w,i)=><ChatWidget key={i} widget={w} mode="inline" isPinned={pinnedWidgets.includes(w.type)} onPin={onPin} onUnpin={onUnpin} industry={industry}/>)}
      </div>}
      {msg.chips&&msg.chips.length>0&&<div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        {msg.chips.map((c,i)=><div key={i} className={i===0?"action-chip primary":"action-chip"}>{c}</div>)}
      </div>}
    </div>
  </div>;
}

/* ═══ CHAT VIEW (Full Screen) ═══ */
function ChatView({chatMessages,setChatMessages,pinnedWidgets,pinWidget,unpinWidget,industry,fromChatOnboarding,focusGoalName,selectedGoals,addedWorkflows,setAddedWorkflows,onNavigate}){
  const[input,setInput]=useState("");
  const[showTyping,setShowTyping]=useState(false);
  const msgsEnd=useRef(null);
  const scrollToBottom=useCallback(()=>{if(msgsEnd.current)msgsEnd.current.scrollIntoView({behavior:"smooth"});},[]);
  useEffect(()=>{scrollToBottom();},[chatMessages,showTyping,scrollToBottom]);

  /* On mount from chat onboarding: show typing then welcome message */
  const hasShownWelcome=useRef(false);
  useEffect(()=>{
    if(fromChatOnboarding&&!hasShownWelcome.current&&chatMessages.length===0){
      hasShownWelcome.current=true;
      setShowTyping(true);
      const focusName=focusGoalName||"your selected goals";
      setTimeout(()=>{
        setShowTyping(false);
        setChatMessages([{
          id:"welcome",role:"ai",
          text:`Welcome to Flows. We've set up your workspace to focus on your first goal — **${focusName}**.`,
          widgets:[],chips:[]
        }]);
        /* Show setup widget after a beat */
        setTimeout(()=>{
          setChatMessages(prev=>[...prev,{
            id:"setup",role:"ai",
            text:"Set up the recommended flows and add your people and assets to get started.",
            setupWidget:true,widgets:[],chips:[]
          }]);
        },800);
      },1200);
    }
  },[fromChatOnboarding]);

  /* Initialise with standard messages if NOT from chat onboarding and no messages */
  useEffect(()=>{
    if(!fromChatOnboarding&&chatMessages.length===0){
      setChatMessages(INITIAL_MESSAGES_MAP[industry]||INITIAL_MESSAGES_MAP.manufacturing||INITIAL_MESSAGES);
    }
  },[industry]);

  const now=new Date();
  const days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const months=["January","February","March","April","May","June","July","August","September","October","November","December"];
  const dateStr=`${days[now.getDay()]} · ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
  const hour=now.getHours();
  const greeting=hour<12?"Good morning":hour<17?"Good afternoon":"Good evening";

  const doSend=()=>{
    if(!input.trim())return;
    const q=input.trim().toLowerCase();
    setInput("");
    const userMsg={id:`u${Date.now()}`,role:"user",text:input.trim(),widgets:[],chips:[]};
    const matchKey=Object.keys(AI_RESPONSES).find(k=>q.includes(k));
    const resp=matchKey?AI_RESPONSES[matchKey]:AI_FALLBACK;
    const aiMsg={id:`a${Date.now()}`,role:"ai",text:resp.text,widgets:resp.widgets,chips:resp.chips};
    setChatMessages(prev=>[...prev,userMsg,aiMsg]);
  };

  const mw={maxWidth:680,width:"100%",margin:"0 auto"};

  return<div style={{display:"flex",flexDirection:"column",flex:1,overflow:"hidden",background:T.surface}}>
    {/* Header */}
    <div style={{padding:"20px 32px 0",flexShrink:0}}>
      <div style={{...mw,display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div style={{animation:"fadeIn 0.5s ease"}}>
          <div className="lbl" style={{marginBottom:3}}>{dateStr}</div>
          <h1 style={{fontFamily:T.serif,fontSize:"clamp(20px,3vw,26px)",fontWeight:400,letterSpacing:"-0.03em",lineHeight:1.2}}>{greeting}, Sarah</h1>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6,fontSize:10.5,fontFamily:T.mono,color:T.textTertiary,paddingTop:4}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:T.green,animation:"subtleBreathe 3s infinite"}}/>
          <span>Online</span>
        </div>
      </div>
    </div>

    {/* Messages */}
    <div style={{flex:1,overflowY:"auto",padding:"18px 32px",display:"flex",flexDirection:"column",alignItems:"center"}}>
      <div style={{...mw,display:"flex",flexDirection:"column",gap:12}}>
        {chatMessages.map(msg=><ChatMessage key={msg.id} msg={msg} pinnedWidgets={pinnedWidgets} onPin={pinWidget} onUnpin={unpinWidget} industry={industry} fromChatOnboarding={fromChatOnboarding} selectedGoals={selectedGoals} addedWorkflows={addedWorkflows} setAddedWorkflows={setAddedWorkflows} focusGoalName={focusGoalName} onNavigate={onNavigate}/>)}

        {/* Typing indicator */}
        {showTyping&&<div style={{display:"flex",gap:12,alignItems:"flex-start",animation:"fadeIn 0.3s ease"}}>
          <div style={{width:32,height:32,borderRadius:10,background:T.accent,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:"0 2px 8px rgba(28,25,23,0.1)"}}>{IC.sparkle("#fff",14)}</div>
          <div style={{display:"flex",gap:4,padding:"16px 18px",background:T.surface,border:`1px solid ${T.border}`,borderRadius:"4px 16px 16px 16px",boxShadow:T.shadow}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:T.textTertiary,animation:"cobDotBounce 1.2s infinite"}}/>
            <div style={{width:7,height:7,borderRadius:"50%",background:T.textTertiary,animation:"cobDotBounce 1.2s infinite 0.15s"}}/>
            <div style={{width:7,height:7,borderRadius:"50%",background:T.textTertiary,animation:"cobDotBounce 1.2s infinite 0.3s"}}/>
          </div>
        </div>}

        <div ref={msgsEnd}/>
      </div>
    </div>

    {/* ── Chat Insight CTA ── */}
    <div style={{padding:"0 32px",flexShrink:0}}>
      <div style={{...mw}}>
        <div onClick={()=>{setInput("Give me an insight on today's operations");}} style={{padding:"14px 18px",borderRadius:T.r,background:`linear-gradient(135deg, ${T.accentSoft}, ${T.highlightSoft})`,border:`1px solid ${T.accentBorder}`,display:"flex",alignItems:"center",gap:14,cursor:"pointer",transition:"all 0.2s",marginBottom:6}} onMouseEnter={e=>{e.currentTarget.style.borderColor=T.accent;e.currentTarget.style.boxShadow=`0 4px 16px ${T.accent}15`;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=T.accentBorder;e.currentTarget.style.boxShadow="none";}}>
          <div style={{width:36,height:36,borderRadius:10,background:T.accent,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:"0 2px 8px rgba(28,25,23,0.1)"}}>{IC.sparkle("#fff",16)}</div>
          <div style={{flex:1}}>
            <div style={{fontFamily:T.sans,fontSize:13,fontWeight:600,color:T.text,letterSpacing:"-0.01em"}}>Get today's insight</div>
            <div style={{fontFamily:T.sans,fontSize:11.5,color:T.textSecondary,marginTop:1}}>AI will analyse activity, flag risks, and suggest next actions</div>
          </div>
          <div style={{padding:"7px 16px",borderRadius:99,background:T.accent,color:"#fff",fontSize:11.5,fontWeight:600,fontFamily:T.sans,flexShrink:0,whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:5}}>{IC.sparkle("#fff",10)} Ask</div>
        </div>
      </div>
    </div>

    {/* Input */}
    <div style={{padding:"10px 32px 18px",flexShrink:0,position:"relative"}}>
      {/* Ambient glow */}
      <div style={{position:"absolute",top:0,left:0,right:0,bottom:"-20px",pointerEvents:"none",zIndex:0}}>
        <div style={{position:"absolute",width:"55%",height:"120%",left:"2%",top:"10%",borderRadius:"50%",background:"rgba(59,130,246,0.22)",filter:"blur(60px)",animation:"glowA 5s ease-in-out infinite",willChange:"transform"}}/>
        <div style={{position:"absolute",width:"55%",height:"120%",right:"2%",top:"10%",borderRadius:"50%",background:"rgba(168,85,247,0.16)",filter:"blur(60px)",animation:"glowB 6.5s ease-in-out infinite",willChange:"transform"}}/>
      </div>
      <div style={{...mw,position:"relative",zIndex:1}}>
        <div className="chat-wrap" style={{borderRadius:12,padding:"5px 5px 5px 16px"}}>
          <input className="chat-in" type="text" placeholder="Ask anything or describe a task..." value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")doSend();}} style={{fontSize:13.5,padding:"10px 0"}}/>
          <div onClick={doSend} style={{width:36,height:36,borderRadius:10,flexShrink:0,background:input?T.accent:T.border,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"background 0.2s"}}>{IC.send(input?"#fff":T.textTertiary)}</div>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:10,justifyContent:"center"}}>
          {(HOME_QUICK_ACTIONS[industry]||HOME_QUICK_ACTIONS.manufacturing).map((qa,i)=><div key={i} className="action-chip" onClick={()=>{setInput(qa.key);}}>{qa.label}</div>)}
        </div>
      </div>
    </div>
  </div>;
}

/* ═══ WIDGET PICKER POPOVER ═══ */
function WidgetPicker({open,onClose,pinnedWidgets,onAdd}){
  const ref=useRef(null);
  useEffect(()=>{if(!open)return;const h=(e)=>{if(ref.current&&!ref.current.contains(e.target))onClose();};document.addEventListener("mousedown",h);return()=>document.removeEventListener("mousedown",h);},[open,onClose]);
  if(!open)return null;
  return<div ref={ref} style={{position:"absolute",top:"100%",right:0,marginTop:6,width:260,background:T.surface,border:`1px solid ${T.border}`,borderRadius:T.r,boxShadow:T.shadowLg,padding:"8px",zIndex:20,animation:"fadeIn 0.2s ease"}}>
    <div style={{padding:"6px 8px 10px",fontSize:10,textTransform:"uppercase",letterSpacing:"0.06em",fontFamily:T.mono,color:T.textTertiary}}>Add Widget</div>
    {AVAILABLE_WIDGETS.map((w,i)=>{
      const already=pinnedWidgets.includes(w.type);
      return<div key={i} onClick={()=>{if(!already){onAdd(w.type);onClose();}}} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 10px",borderRadius:T.rSm,cursor:already?"default":"pointer",opacity:already?0.4:1,transition:"background 0.15s",background:"transparent"}} onMouseEnter={e=>{if(!already)e.currentTarget.style.background=T.surfaceHover;}} onMouseLeave={e=>{e.currentTarget.style.background="transparent";}}>
        <div style={{width:28,height:28,borderRadius:8,background:already?T.surfaceMuted:`${w.color}11`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{w.icon(already?T.textTertiary:w.color)}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:12.5,fontWeight:500,letterSpacing:"-0.01em",color:already?T.textTertiary:T.text}}>{w.label}</div>
          <div style={{fontSize:10.5,color:T.textTertiary,marginTop:1}}>{w.desc}</div>
        </div>
        {already&&<span style={{fontSize:9,fontFamily:T.mono,color:T.textTertiary,flexShrink:0}}>Added</span>}
      </div>;
    })}
  </div>;
}

/* ═══ DASHBOARD VIEW (Full Screen) ═══ */
function DashboardView({pinnedWidgets,pinWidget,unpinWidget,industry,installedApps,onNavigate}){
  const[pickerOpen,setPickerOpen]=useState(false);
  const now=new Date();
  const days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const months=["January","February","March","April","May","June","July","August","September","October","November","December"];
  const dateStr=`${days[now.getDay()]} · ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
  const hour=now.getHours();
  const greeting=hour<12?"Good morning":hour<17?"Good afternoon":"Good evening";
  const hasPinned=pinnedWidgets.length>0;

  return<div style={{flex:1,overflowY:"auto",background:T.bg,padding:"24px 32px 40px"}}>
    {/* Header */}
    <div style={{maxWidth:960,margin:"0 auto",width:"100%"}}>
    <div style={{animation:"fadeIn 0.5s ease",marginBottom:24}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          <div className="lbl" style={{marginBottom:3}}>{dateStr}</div>
          <h1 style={{fontFamily:T.serif,fontSize:"clamp(20px,3vw,26px)",fontWeight:400,letterSpacing:"-0.03em",lineHeight:1.2}}>{greeting}, Sarah</h1>
        </div>
      </div>
    </div>

    {/* Dashboard toolbar */}
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
      <div className="lbl">{IC.pin(T.textTertiary)} Dashboard{hasPinned&&<span style={{marginLeft:6,fontWeight:400}}>· {pinnedWidgets.length} widget{pinnedWidgets.length!==1?"s":""}</span>}</div>
      <div style={{position:"relative"}}>
        <div onClick={()=>setPickerOpen(!pickerOpen)} style={{display:"flex",alignItems:"center",gap:5,padding:"6px 14px",borderRadius:99,fontSize:11.5,fontFamily:T.sans,fontWeight:500,cursor:"pointer",border:`1px solid ${T.border}`,background:T.surface,color:T.textSecondary,transition:"all 0.15s",boxShadow:"0 1px 2px rgba(0,0,0,0.03)"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=T.accentBorder;e.currentTarget.style.background=T.accentSoft;e.currentTarget.style.color=T.text;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.background=T.surface;e.currentTarget.style.color=T.textSecondary;}}>
          {IC.plus(T.textSecondary,13)}
          <span>Add</span>
        </div>
        <WidgetPicker open={pickerOpen} onClose={()=>setPickerOpen(false)} pinnedWidgets={pinnedWidgets} onAdd={pinWidget}/>
      </div>
    </div>

    {/* Widget grid */}
    {hasPinned?<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))",gap:14}}>
      {pinnedWidgets.map((type,idx)=><div key={type} style={{animation:`fadeIn 0.4s ease ${idx*0.08}s both`}}>
        <ChatWidget widget={{type}} mode="pinned" isPinned={true} onPin={pinWidget} onUnpin={unpinWidget} industry={industry} installedApps={installedApps} onNavigate={onNavigate}/>
      </div>)}
    </div>:
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:320,animation:"fadeIn 0.5s ease"}}>
      <div style={{width:56,height:56,borderRadius:16,background:T.surfaceMuted,border:`1.5px dashed ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16}}>{IC.pin(T.textTertiary,20)}</div>
      <div style={{fontSize:15,fontWeight:500,color:T.textSecondary,marginBottom:6,letterSpacing:"-0.01em"}}>Your dashboard is empty</div>
      <div style={{fontSize:13,color:T.textTertiary,textAlign:"center",maxWidth:340,lineHeight:1.6,marginBottom:18}}>Add widgets to build your personal dashboard, or pin them from the Chat view.</div>
      <div onClick={()=>setPickerOpen(true)} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"8px 18px",borderRadius:99,fontSize:12.5,fontWeight:500,cursor:"pointer",border:`1px solid ${T.border}`,background:T.surface,color:T.textSecondary,transition:"all 0.15s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=T.accentBorder;e.currentTarget.style.background=T.accentSoft;e.currentTarget.style.color=T.text;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.background=T.surface;e.currentTarget.style.color=T.textSecondary;}}>
        {IC.plus(T.textSecondary,14)}
        <span>Add your first widget</span>
      </div>
    </div>}
    </div>
  </div>;
}

/* ═══ HOME TAB BAR ═══ */
function HomeTabBar({homeTab,setHomeTab}){
  const tabs=[
    {id:"chat",label:"Chat",icon:(c)=><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>},
    {id:"dashboard",label:"Dashboard",icon:(c)=><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>},
  ];
  return<div style={{display:"flex",alignItems:"center",padding:"0 32px",background:"rgba(255,255,255,0.92)",backdropFilter:"blur(8px)",borderBottom:`1px solid ${T.borderSubtle}`,flexShrink:0,gap:0}}>
    {tabs.map(tab=>{const a=homeTab===tab.id;return<div key={tab.id} onClick={()=>setHomeTab(tab.id)} style={{display:"flex",alignItems:"center",gap:7,padding:"12px 18px 11px",cursor:"pointer",position:"relative",color:a?T.text:T.textTertiary,fontFamily:T.sans,fontSize:13,fontWeight:a?600:400,letterSpacing:"-0.01em",transition:"color 0.2s"}} onMouseEnter={e=>{if(!a)e.currentTarget.style.color=T.textSecondary;}} onMouseLeave={e=>{if(!a)e.currentTarget.style.color=T.textTertiary;}}>
      <span style={{display:"flex",alignItems:"center",transition:"color 0.2s"}}>{tab.icon(a?T.accent:T.textTertiary)}</span>
      <span>{tab.label}</span>
      {a&&<div style={{position:"absolute",bottom:-1,left:16,right:16,height:2.5,borderRadius:"2px 2px 0 0",background:T.accent}}/>}
    </div>;})}
  </div>;
}

/* ═══ HOME CONTENT (Router) ═══ */
function HomeContent({homeTab,setHomeTab,chatMessages,setChatMessages,pinnedWidgets,pinWidget,unpinWidget,overallPct,setConnectOpen,industry,fromChatOnboarding,focusGoalName,selectedGoals,addedWorkflows,setAddedWorkflows,onNavigate,installedApps}){
  return<div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 56px)",overflow:"hidden"}}>
    <HomeTabBar homeTab={homeTab} setHomeTab={setHomeTab}/>
    {homeTab==="dashboard"
      ?<DashboardView pinnedWidgets={pinnedWidgets} pinWidget={pinWidget} unpinWidget={unpinWidget} industry={industry} installedApps={installedApps} onNavigate={onNavigate}/>
      :<ChatView chatMessages={chatMessages} setChatMessages={setChatMessages} pinnedWidgets={pinnedWidgets} pinWidget={pinWidget} unpinWidget={unpinWidget} industry={industry} fromChatOnboarding={fromChatOnboarding} focusGoalName={focusGoalName} selectedGoals={selectedGoals} addedWorkflows={addedWorkflows} setAddedWorkflows={setAddedWorkflows} onNavigate={onNavigate}/>
    }
  </div>;
}

/* ═══ SETTINGS MODAL ═══ */
function SettingsModal({open,onClose,brandName,setBrandName,brandLogoUrl,setBrandLogoUrl,onRestartOnboarding,onBackToStarter}){
  if(!open)return null;
  return<div style={{position:"fixed",inset:0,zIndex:200,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}>
    <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.35)",backdropFilter:"blur(4px)"}}/>
    <div onClick={e=>e.stopPropagation()} style={{position:"relative",width:420,maxWidth:"90vw",background:T.surface,borderRadius:T.r+4,padding:"28px",boxShadow:"0 24px 64px rgba(0,0,0,0.18)",animation:"modalIn 0.3s ease"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <h2 style={{fontFamily:T.serif,fontSize:20,fontWeight:500,letterSpacing:"-0.02em"}}>Settings</h2>
        <div onClick={onClose} style={{width:32,height:32,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",background:T.surfaceMuted}}>{IC.x(T.textSecondary,16)}</div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:20}}>
        <div>
          <label style={{fontSize:11,fontWeight:600,color:T.textSecondary,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.04em",fontFamily:T.mono}}>Workspace Name</label>
          <input value={brandName} onChange={e=>setBrandName(e.target.value)} style={{width:"100%",padding:"10px 14px",borderRadius:T.rSm,border:`1px solid ${T.border}`,fontFamily:T.sans,fontSize:14,color:T.text,outline:"none",background:T.surfaceHover,transition:"border-color 0.2s"}} onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.border}/>
        </div>
        <div>
          <label style={{fontSize:11,fontWeight:600,color:T.textSecondary,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.04em",fontFamily:T.mono}}>Logo URL <span style={{fontWeight:400,textTransform:"none",letterSpacing:0}}>(optional)</span></label>
          <input value={brandLogoUrl} onChange={e=>setBrandLogoUrl(e.target.value)} placeholder="https://example.com/logo.svg" style={{width:"100%",padding:"10px 14px",borderRadius:T.rSm,border:`1px solid ${T.border}`,fontFamily:T.sans,fontSize:14,color:T.text,outline:"none",background:T.surfaceHover,transition:"border-color 0.2s"}} onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.border}/>
          {brandLogoUrl&&<div style={{marginTop:8,padding:10,borderRadius:T.rSm,background:T.surfaceMuted,display:"flex",alignItems:"center",gap:10}}>
            <img src={brandLogoUrl} alt="" style={{width:28,height:28,objectFit:"contain",borderRadius:6}} onError={e=>{e.target.style.display="none";}}/>
            <span style={{fontSize:11,color:T.textTertiary}}>Preview</span>
          </div>}
        </div>
        <div style={{borderTop:`1px solid ${T.borderSubtle}`,paddingTop:20}}>
          <label style={{fontSize:11,fontWeight:600,color:T.textSecondary,display:"block",marginBottom:8,textTransform:"uppercase",letterSpacing:"0.04em",fontFamily:T.mono}}>Onboarding</label>
          <div onClick={()=>{onClose();if(onRestartOnboarding)onRestartOnboarding();}} style={{display:"inline-flex",alignItems:"center",gap:8,padding:"10px 18px",borderRadius:T.rSm,border:`1px solid ${T.border}`,background:T.surface,fontSize:13,fontWeight:500,color:T.text,cursor:"pointer",transition:"all 0.15s"}} onMouseEnter={e=>{e.currentTarget.style.background=T.surfaceHover;e.currentTarget.style.borderColor=T.accentBorder;}} onMouseLeave={e=>{e.currentTarget.style.background=T.surface;e.currentTarget.style.borderColor=T.border;}}>
            {IC.play(T.textSecondary)} Restart Onboarding
          </div>
          <p style={{fontSize:11,color:T.textTertiary,marginTop:6,lineHeight:1.5}}>Re-run industry selection, persona, and goal setup. Your current workspace will be reset.</p>
        </div>
        <div style={{borderTop:`1px solid ${T.borderSubtle}`,paddingTop:20}}>
          <label style={{fontSize:11,fontWeight:600,color:T.textSecondary,display:"block",marginBottom:8,textTransform:"uppercase",letterSpacing:"0.04em",fontFamily:T.mono}}>Starter</label>
          <div onClick={()=>{onClose();if(onBackToStarter)onBackToStarter();}} style={{display:"inline-flex",alignItems:"center",gap:8,padding:"10px 18px",borderRadius:T.rSm,border:`1px solid ${T.border}`,background:T.surface,fontSize:13,fontWeight:500,color:T.text,cursor:"pointer",transition:"all 0.15s"}} onMouseEnter={e=>{e.currentTarget.style.background=T.surfaceHover;e.currentTarget.style.borderColor=T.accentBorder;}} onMouseLeave={e=>{e.currentTarget.style.background=T.surface;e.currentTarget.style.borderColor=T.border;}}>
            {IC.home(T.textSecondary)} Back to Start
          </div>
          <p style={{fontSize:11,color:T.textTertiary,marginTop:6,lineHeight:1.5}}>Return to the starter screen without resetting your workspace.</p>
        </div>
      </div>
    </div>
  </div>;
}

/* ═══ RC LOGO (DEFAULT) ═══ */
function RCLogo({size=28}){
  return<svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <rect width="100" height="100" rx="20" fill="#001F5B"/>
    <path d="M50 15 L30 40 L35 40 L35 55 L25 55 L25 75 L40 75 L40 60 L45 60 L45 75 L55 75 L55 60 L60 60 L60 75 L75 75 L75 55 L65 55 L65 40 L70 40 Z" fill="#fff"/>
    <circle cx="50" cy="32" r="5" fill="#C4A84E"/>
  </svg>;
}

function BrandIcon({brandLogoUrl,size=28}){
  if(brandLogoUrl) return<img src={brandLogoUrl} alt="" style={{width:size,height:size,objectFit:"contain",borderRadius:8}}/>;
  return<RCLogo size={size}/>;
}

/* ═══ HASH ROUTING ═══ */
function parseHash(){
  const h=(window.location.hash||"").replace(/^#\/?/,"");
  if(!h||h==="starter") return{phase:"starter",page:"home",homeTab:"dashboard",appId:null};
  if(h==="onboarding") return{phase:"onboarding",page:"home",homeTab:"dashboard",appId:null};
  if(h==="chat-onboarding") return{phase:"chat-onboarding",page:"home",homeTab:"dashboard",appId:null};
  if(h==="home/chat"||h==="chat") return{phase:"workspace",page:"home",homeTab:"chat",appId:null};
  if(h==="home/dashboard"||h==="dashboard") return{phase:"workspace",page:"home",homeTab:"dashboard",appId:null};
  if(h==="home") return{phase:"workspace",page:"home",homeTab:"dashboard",appId:null};
  /* App detail route: #app/:appId */
  if(h.startsWith("app/")){const aId=h.slice(4);return{phase:"workspace",page:"catalog",homeTab:"dashboard",appId:aId};}
  const validPages=["builder","connect","connectors","goals","people","catalog","tasks","score","registers"];
  if(validPages.includes(h)) return{phase:"workspace",page:h,homeTab:"dashboard",appId:null};
  return{phase:"workspace",page:"home",homeTab:"dashboard",appId:null};
}

/* ═══ CONFIGURING SCREEN ═══ */
function ConfiguringScreen({onDone}){
  const[bars,setBars]=useState([0,0,0]);
  useEffect(()=>{
    const t1=setTimeout(()=>setBars([85,60,30]),80);
    const t2=setTimeout(()=>setBars([100,95,70]),600);
    const t3=setTimeout(()=>setBars([100,100,100]),1100);
    const t4=setTimeout(()=>onDone(),1600);
    return()=>{clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);clearTimeout(t4);};
  },[]);
  const labels=["Goals","Workflows","Data sources"];
  return<div style={{position:"fixed",inset:0,zIndex:9999,background:T.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:T.sans,animation:"fadeIn 0.4s ease"}}>
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:24,animation:"fadeIn 0.5s ease"}}>
      <svg width="56" height="56" viewBox="0 0 100 100" fill="none"><rect width="100" height="100" rx="22" fill={T.accent}/><path d="M15 50c10-20 22-20 32 0s22 20 32 0" stroke="#fff" strokeWidth="8" strokeLinecap="round" fill="none"><animateTransform attributeName="transform" type="translate" values="0,0;0,-3;0,0" dur="1.2s" repeatCount="indefinite"/></path></svg>
      <div style={{textAlign:"center"}}>
        <div style={{fontFamily:T.serif,fontSize:20,fontWeight:500,letterSpacing:"-0.02em",marginBottom:6}}>Configuring your workspace</div>
        <div style={{fontSize:13,color:T.textTertiary}}>Setting up goals, workflows, and data sources...</div>
      </div>
      <div style={{width:260,display:"flex",flexDirection:"column",gap:12}}>
        {labels.map((label,i)=><div key={label}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
            <span style={{fontSize:11,fontFamily:T.mono,color:T.textSecondary,letterSpacing:"0.02em"}}>{label}</span>
            <span style={{fontSize:10,fontFamily:T.mono,color:bars[i]>=100?T.green:T.textTertiary}}>{bars[i]>=100?"Done":""}</span>
          </div>
          <div style={{height:4,borderRadius:4,background:T.surfaceMuted,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${bars[i]}%`,borderRadius:4,background:bars[i]>=100?T.green:T.accent,transition:"width 0.6s cubic-bezier(0.4,0,0.2,1)"}}/>
          </div>
        </div>)}
      </div>
    </div>
  </div>;
}

/* ═══ MAIN APP ═══ */
function App(){
  /* Phase model: starter → onboarding | chat-onboarding → configuring → workspace */
  const initRoute=parseHash();
  const[phase,setPhase]=useState(initRoute.phase);

  const[sidebarMode,setSidebarMode]=useState("expanded");
  const SIDEBAR_W=sidebarMode==="expanded"?240:0;
  const[settingsOpen,setSettingsOpen]=useState(false);
  const[chatMessages,setChatMessages]=useState(INITIAL_MESSAGES);
  const[pinnedWidgets,setPinnedWidgets]=useState([]);
  const[page,setPage]=useState(initRoute.page);
  const[homeTab,setHomeTab]=useState(initRoute.homeTab);
  const[builderMode,setBuilderMode]=useState("build");
  const[brandName,setBrandName]=useState("RC Marine Ops");
  const[brandLogoUrl,setBrandLogoUrl]=useState("");
  const[onboardIndustry,setOnboardIndustry]=useState("");
  const from100Day=useRef(false);
  const[onboardPersona,setOnboardPersona]=useState("");
  const[selectedGoals,setSelectedGoals]=useState([]);
  const[installedApps,setInstalledApps]=useState([]);
  const[addedConnectors,setAddedConnectors]=useState([]);
  const[addedWorkflows,setAddedWorkflows]=useState([]);
  const[customGoals,setCustomGoals]=useState([]);
  const[focusGoalName,setFocusGoalName]=useState("");
  const[fromChatOnboarding,setFromChatOnboarding]=useState(false);
  const[wipeIn,setWipeIn]=useState(false);
  const[appDetailId,setAppDetailId]=useState(initRoute.appId);
  const toggleSidebar=useCallback(()=>setSidebarMode(m=>m==="expanded"?"collapsed":"expanded"),[]);

  /* ── Sync hash → state on popstate/hashchange ── */
  useEffect(()=>{
    const onHash=()=>{
      const r=parseHash();
      setPhase(r.phase);
      setPage(r.page);
      setHomeTab(r.homeTab);
      if(r.appId)setAppDetailId(r.appId);
      else if(r.page!=="catalog")setAppDetailId(null);
    };
    window.addEventListener("hashchange",onHash);
    return()=>window.removeEventListener("hashchange",onHash);
  },[]);

  /* ── Navigation helper: updates state + hash ── */
  const navigate=useCallback((p)=>{
    setPage(p);
    setAppDetailId(null);
    if(p==="home") window.location.hash="#home/dashboard";
    else window.location.hash="#"+p;
  },[]);
  const pinWidget=useCallback((type)=>setPinnedWidgets(p=>p.includes(type)?p:[...p,type]),[]);
  const unpinWidget=useCallback((type)=>setPinnedWidgets(p=>p.filter(t=>t!==type)),[]);

  /* ── Sync homeTab → hash ── */
  const setHomeTabWithHash=useCallback((tab)=>{
    setHomeTab(tab);
    window.location.hash="#home/"+tab;
  },[]);

  /* Reset chat messages when industry is selected (skip if from chat onboarding or configuring) */
  useEffect(()=>{if(onboardIndustry&&!fromChatOnboarding&&phase!=="chat-onboarding"&&phase!=="configuring"){setChatMessages(INITIAL_MESSAGES_MAP[onboardIndustry]||INITIAL_MESSAGES_MAP.manufacturing);}},[onboardIndustry]);

  /* Auto-install recommended apps when goals are selected after chat onboarding */
  useEffect(()=>{
    if(fromChatOnboarding&&selectedGoals.length>0){
      const recommendedAppIds=new Set();
      selectedGoals.forEach(gId=>{getAppsForGoal(gId).forEach(a=>recommendedAppIds.add(a.id));});
      if(recommendedAppIds.size>0)setInstalledApps(prev=>[...new Set([...prev,...recommendedAppIds])]);
    }
  },[fromChatOnboarding,selectedGoals]);

  /* Readiness score calculation (APP_CATALOG approach) */
  const readinessPct=useMemo(()=>{
    const recommendedAppIds=new Set();
    selectedGoals.forEach(gId=>{getAppsForGoal(gId).forEach(a=>recommendedAppIds.add(a.id));});
    if(recommendedAppIds.size===0)return 0;
    const installedRecommended=installedApps.filter(id=>recommendedAppIds.has(id)).length;
    const neededConnectorIds=new Set();
    installedApps.forEach(appId=>{const app=APP_CATALOG.find(a=>a.id===appId);if(app)(app.requiredConnectors||[]).forEach(cId=>neededConnectorIds.add(cId));});
    const connectedCount=addedConnectors.filter(id=>neededConnectorIds.has(id)).length;
    const total=recommendedAppIds.size+neededConnectorIds.size;
    const done=installedRecommended+connectedCount;
    return Math.min(100,Math.round((done/total)*100));
  },[selectedGoals,installedApps,addedConnectors]);

  const isBuilder=page==="builder";
  const isConnect=page==="connect";
  const isConnectors=page==="connectors";
  const isGoals=page==="goals";
  const isPeople=page==="people";
  const isTasks=page==="tasks";
  const isScore=page==="score";
  const isRegisters=page==="registers";
  const isCatalog=page==="catalog"&&!appDetailId;
  const isAppDetail=page==="catalog"&&!!appDetailId;

  /* ── Starter phase ── */
  if(phase==="starter"){
    return<StarterScreen onSelectJourney={(id)=>{
      if(id==="first-setup"){setPhase("onboarding");window.location.hash="#onboarding";}
      if(id==="chat-setup") setPhase("chat-onboarding");
      if(id==="100-day"){
        const p=HUNDRED_DAY_PRESET;
        from100Day.current=true;
        setBrandName(p.brandName);
        setOnboardIndustry(p.onboardIndustry);
        setOnboardPersona(p.onboardPersona);
        setSelectedGoals(p.selectedGoals);
        setInstalledApps(p.installedApps);
        setAddedConnectors(p.addedConnectors);
        setAddedWorkflows(p.addedWorkflows);
        setPinnedWidgets(p.pinnedWidgets);
        setChatMessages(p.chatMessages);
        setFromChatOnboarding(false);
        setPhase("configuring");
      }
    }}/>;
  }

  /* ── Onboarding phase ── */
  if(phase==="onboarding"){
    return<OnboardingFlow
      onComplete={(config)=>{
        /* Handle config from enhanced onboarding if provided */
        if(config&&config.appToInstall)setInstalledApps(prev=>[...new Set([...prev,config.appToInstall])]);
        if(config&&config.goalIds)setSelectedGoals(prev=>[...new Set([...prev,...config.goalIds])]);
        /* Auto-install apps that serve the selected goals */
        const allGoalIds=config&&config.goalIds?[...new Set([...(selectedGoals||[]),...config.goalIds])]:selectedGoals;
        const recommendedAppIds=new Set();
        allGoalIds.forEach(gId=>{getAppsForGoal(gId).forEach(a=>recommendedAppIds.add(a.id));});
        if(recommendedAppIds.size>0)setInstalledApps(prev=>[...new Set([...prev,...recommendedAppIds])]);
        setPhase("workspace");
        window.location.hash=(config&&config.goToGoals)?"#goals":"#home/chat";
      }}
      industry={onboardIndustry} setIndustry={setOnboardIndustry}
      persona={onboardPersona} setPersona={setOnboardPersona}
      selectedGoals={selectedGoals} setSelectedGoals={setSelectedGoals}
    />;
  }

  /* ── Chat Onboarding phase ── */
  if(phase==="chat-onboarding"){
    return<ChatOnboarding
      onComplete={()=>{setFromChatOnboarding(true);setPhase("configuring");}}
      setIndustry={setOnboardIndustry}
      setPersona={setOnboardPersona}
      setSelectedGoals={setSelectedGoals}
      setFocusGoalName={setFocusGoalName}
    />;
  }

  /* ── Configuring phase (animation interstitial) ── */
  if(phase==="configuring"){
    return<ConfiguringScreen onDone={()=>{
      setWipeIn(true);setPhase("workspace");setTimeout(()=>setWipeIn(false),800);
      if(from100Day.current){
        from100Day.current=false;
        setChatMessages(HUNDRED_DAY_PRESET.chatMessages);
        setHomeTab("dashboard");window.location.hash="#home/dashboard";
      }else{
        setChatMessages([]);setHomeTab("chat");window.location.hash="#home/chat";
      }
    }}/>;
  }

  /* ── Workspace phase ── */
  return<>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,300;8..60,400;8..60,500;8..60,600;8..60,700&family=Nunito+Sans:opsz,wght@6..12,300;6..12,400;6..12,500;6..12,600;6..12,700&family=Fira+Code:wght@400;500&display=swap');
      *{margin:0;padding:0;box-sizing:border-box}
      @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(0.8)}}
      @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
      @keyframes fadeInUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
      @keyframes modalIn{from{opacity:0;transform:scale(0.97) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
      @keyframes slideInRight{from{transform:translateX(100%)}to{transform:translateX(0)}}
      @keyframes shimmer{from{background-position:200% 0}to{background-position:-200% 0}}
      @keyframes subtleBreathe{0%,100%{opacity:0.7}50%{opacity:1}}
      @keyframes wipeReveal{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}
      @keyframes cobDotBounce{0%,60%,100%{transform:translateY(0);opacity:0.4}30%{transform:translateY(-5px);opacity:1}}
      @keyframes glowA{0%,100%{transform:translateX(-25%)}50%{transform:translateX(25%)}}
      @keyframes glowB{0%,100%{transform:translateX(25%) scale(1.1)}50%{transform:translateX(-25%) scale(0.9)}}
      @keyframes checkPop{0%{transform:scale(0.5);opacity:0.5}60%{transform:scale(1.18);opacity:1}100%{transform:scale(1);opacity:1}}
      .wipe-in{animation:wipeReveal 0.7s cubic-bezier(0.4,0,0.2,1) forwards}
      .connector-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px}
      @media(max-width:500px){.connector-grid{grid-template-columns:1fr}}
      .bento{background:${T.surface};border:1px solid ${T.border};border-radius:${T.r}px;transition:box-shadow 0.3s cubic-bezier(0.4,0,0.2,1),transform 0.3s cubic-bezier(0.4,0,0.2,1);box-shadow:${T.shadow}}.bento:hover{box-shadow:${T.shadowMd};transform:translateY(-2px)}
      .chip{padding:3px 10px;border-radius:99px;font-size:10px;font-family:${T.mono};display:inline-flex;align-items:center;gap:4px}
      .action-chip{padding:7px 16px;border-radius:99px;font-size:11.5px;font-family:${T.sans};cursor:pointer;border:1px solid ${T.border};background:${T.surface};color:${T.textSecondary};transition:all 0.2s cubic-bezier(0.4,0,0.2,1);white-space:nowrap}.action-chip:hover{border-color:${T.accentBorder};background:${T.accentSoft};color:${T.text};transform:translateY(-1px)}.action-chip.primary{border-color:${T.accent};background:${T.accent};color:#fff;font-weight:600;box-shadow:0 1px 3px rgba(28,25,23,0.12)}.action-chip.primary:hover{opacity:0.92;transform:translateY(-1px)}
      .chat-wrap{display:flex;align-items:center;padding:5px 5px 5px 16px;border-radius:14px;background:${T.surface};border:1.5px solid ${T.border};transition:border-color 0.25s,box-shadow 0.25s}.chat-wrap:focus-within{border-color:${T.accent};box-shadow:0 0 0 3px ${T.accentSoft}}
      .chat-in{flex:1;border:none;background:none;font-size:13px;font-family:${T.sans};color:${T.text};outline:none;letter-spacing:-0.01em}.chat-in::placeholder{color:${T.textTertiary}}
      .lbl{font-size:10px;text-transform:uppercase;letter-spacing:0.06em;font-family:${T.mono};color:${T.textTertiary};display:flex;align-items:center;gap:5px}
      ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${T.border};border-radius:3px}::-webkit-scrollbar-thumb:hover{background:${T.textTertiary}}
      .grid-bento{display:grid;grid-template-columns:repeat(12,1fr);gap:14px}.col-8{grid-column:span 8}.col-7{grid-column:span 7}.col-5{grid-column:span 5}.col-4{grid-column:span 4}
      @media(max-width:900px){.grid-bento{gap:10px}.col-8,.col-7,.col-5,.col-4{grid-column:span 12}}
      @media(max-width:600px){.grid-bento{grid-template-columns:1fr}.col-8,.col-7,.col-5,.col-4{grid-column:span 1}}
      .stat-pair{display:flex;flex-direction:column;gap:14px}@media(max-width:900px){.stat-pair{flex-direction:row}.stat-pair>*{flex:1}}@media(max-width:600px){.stat-pair{flex-direction:column}}
      .quick-row{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;grid-column:1/-1}@media(max-width:600px){.quick-row{grid-template-columns:1fr}}
      .connect-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}@media(max-width:700px){.connect-grid{grid-template-columns:1fr}}
      .score-btn{display:flex;align-items:center;gap:7px;padding:4px 12px 4px 5px;border-radius:99px;cursor:pointer;border:1.5px solid rgba(59,130,246,0.18);background:rgba(59,130,246,0.04);transition:all 0.25s cubic-bezier(0.4,0,0.2,1)}.score-btn:hover{background:rgba(59,130,246,0.08);border-color:rgba(59,130,246,0.32);transform:translateY(-1px);box-shadow:0 2px 8px rgba(37,99,235,0.1)}
      .node-lib-item{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:${T.rSm}px;cursor:pointer;transition:all 0.15s;margin-bottom:2px}.node-lib-item:hover{background:${T.surfaceHover}}
      .tb-icon{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:${T.textSecondary};transition:all 0.2s}.tb-icon:hover{background:${T.surfaceMuted};color:${T.text}}
    `}</style>

    <Sidebar mode={sidebarMode} onToggle={toggleSidebar} onNavigate={navigate} activePage={page} brandName={brandName} brandLogoUrl={brandLogoUrl} onSettings={()=>setSettingsOpen(true)} installedApps={installedApps}/>
    <SettingsModal open={settingsOpen} onClose={()=>setSettingsOpen(false)} brandName={brandName} setBrandName={setBrandName} brandLogoUrl={brandLogoUrl} setBrandLogoUrl={setBrandLogoUrl} onRestartOnboarding={()=>{setOnboardIndustry("");setOnboardPersona("");setSelectedGoals([]);setInstalledApps([]);setAddedConnectors([]);setAddedWorkflows([]);setCustomGoals([]);setFromChatOnboarding(false);setPhase("onboarding");window.location.hash="#onboarding";}} onBackToStarter={()=>{setPhase("starter");window.location.hash="#starter";}}/>

    <div className={wipeIn?"wipe-in":""} style={{minHeight:"100vh",background:T.bg,fontFamily:T.sans,color:T.text,display:"flex",flexDirection:"column",marginLeft:SIDEBAR_W,transition:"margin-left 0.3s cubic-bezier(0.4,0,0.2,1)"}}>
      {/* Top Bar */}
      <div style={{height:56,padding:"0 20px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${T.borderSubtle}`,background:"rgba(255,255,255,0.92)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",position:"sticky",top:0,zIndex:50,flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <div onClick={toggleSidebar} style={{width:36,height:36,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>{IC.panel(T.text,20)}</div>
          {isBuilder?<>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <div className="tb-icon">{IC.save(T.textSecondary)}</div>
              <div className="tb-icon">{IC.folder(T.textSecondary)}</div>
              <div style={{width:1,height:20,background:T.border,margin:"0 2px"}}/>
              <div className="tb-icon">{IC.undo(T.textSecondary)}</div>
              <div className="tb-icon">{IC.redo(T.textSecondary)}</div>
            </div>
          </>:<span style={{fontFamily:T.serif,fontSize:17,fontWeight:500,letterSpacing:"-0.02em"}}>{isConnect?"Workspace Setup":isConnectors?"Connectors":isGoals?"Goals":isPeople?"People":isTasks?"Tasks":isScore?"Score":isRegisters?"Data":isAppDetail?(APP_CATALOG.find(a=>a.id===appDetailId)||{}).name||"App":isCatalog?"Catalog":"Home"}</span>}
        </div>
        {/* Center area */}
        {isBuilder&&<div style={{position:"absolute",left:"50%",transform:"translateX(-50%)"}}>
          <div style={{display:"flex",background:T.surfaceMuted,borderRadius:99,padding:3,gap:2}}>
            {["Build","Edit"].map((tab,i)=>{const a=(tab==="Build"&&builderMode==="build")||(tab==="Edit"&&builderMode==="edit");return<div key={i} onClick={()=>setBuilderMode(tab.toLowerCase())} style={{padding:"5px 16px",borderRadius:99,fontSize:12,fontWeight:a?600:400,color:a?T.text:T.textSecondary,background:a?T.surface:"transparent",boxShadow:a?"0 1px 3px rgba(0,0,0,0.06)":"none",letterSpacing:"-0.01em",cursor:"pointer",whiteSpace:"nowrap"}}>{tab}</div>;})}
          </div>
        </div>}
        {/* Right area */}
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {!isBuilder&&<div className="score-btn" onClick={()=>navigate("connect")}>
            <StarRating score={computeAggregateScore(selectedGoals).score} size={16} gap={2}/>
            <span style={{fontSize:12,fontWeight:600,color:"#B8962E",fontFamily:T.mono}}>{computeAggregateScore(selectedGoals).score}</span>
          </div>}
          <div style={{padding:"5px 12px",borderRadius:99,background:T.surfaceMuted,border:`1px solid ${T.border}`,fontSize:11,fontFamily:T.mono,color:T.textTertiary,display:"flex",alignItems:"center",gap:6,cursor:"pointer"}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>&#x2318;K</div>
          <div style={{width:32,height:32,borderRadius:"50%",background:T.surfaceMuted,border:`2px solid ${T.surface}`,boxShadow:`0 0 0 1px ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:600,color:T.textSecondary}}>S</div>
        </div>
      </div>

      {/* Page content */}
      {page==="home"&&<HomeContent homeTab={homeTab} setHomeTab={setHomeTabWithHash} chatMessages={chatMessages} setChatMessages={setChatMessages} pinnedWidgets={pinnedWidgets} pinWidget={pinWidget} unpinWidget={unpinWidget} overallPct={readinessPct} setConnectOpen={()=>navigate("connect")} industry={onboardIndustry} fromChatOnboarding={fromChatOnboarding} focusGoalName={focusGoalName} selectedGoals={selectedGoals} addedWorkflows={addedWorkflows} setAddedWorkflows={setAddedWorkflows} onNavigate={navigate} installedApps={installedApps}/>}
      {page==="builder"&&<div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",position:"relative"}}>
        {builderMode==="build"?<BuildMode/>:<EditMode/>}
      </div>}
      {page==="connect"&&<ConnectPage industry={onboardIndustry} persona={onboardPersona} selectedGoals={selectedGoals} onNavigate={navigate} addedConnectors={addedConnectors} addedWorkflows={addedWorkflows} setAddedWorkflows={setAddedWorkflows}/>}
      {page==="connectors"&&<ConnectorsPage/>}
      {page==="goals"&&<GoalsPage industry={onboardIndustry} persona={onboardPersona} selectedGoals={selectedGoals} setSelectedGoals={setSelectedGoals} customGoals={customGoals} setCustomGoals={setCustomGoals} onNavigate={navigate}/>}
      {page==="people"&&<PeoplePage/>}
      {page==="tasks"&&<TasksPage/>}
      {page==="score"&&<ScorePage selectedGoals={selectedGoals} industry={onboardIndustry} onNavigate={navigate}/>}
      {page==="registers"&&<RegistersPage/>}
      {page==="catalog"&&!appDetailId&&<CatalogPage installedApps={installedApps} setInstalledApps={setInstalledApps} onNavigate={(target)=>{if(APP_CATALOG.find(a=>a.id===target)){setAppDetailId(target);window.location.hash="#app/"+target;}else{navigate(target);}}} industry={onboardIndustry} addedConnectors={addedConnectors}/>}
      {page==="catalog"&&appDetailId&&<AppDetailPage appId={appDetailId} industry={onboardIndustry} addedConnectors={addedConnectors} onBack={()=>{setAppDetailId(null);window.location.hash="#catalog";}} onNavigate={navigate}/>}
    </div>
  </>;
}

export default App;
