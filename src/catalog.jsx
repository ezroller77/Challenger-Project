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
