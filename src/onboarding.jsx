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