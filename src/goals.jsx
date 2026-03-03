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
