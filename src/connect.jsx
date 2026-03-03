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
