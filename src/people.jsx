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
