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
  const SIDEBAR_W=sidebarMode==="expanded"?240:56;
  const[settingsOpen,setSettingsOpen]=useState(false);
  const[chatMessages,setChatMessages]=useState(INITIAL_MESSAGES);
  const[pinnedWidgets,setPinnedWidgets]=useState([]);
  const[page,setPage]=useState(initRoute.page);
  const[homeTab,setHomeTab]=useState(initRoute.homeTab);
  const[builderMode,setBuilderMode]=useState("build");
  const[brandName,setBrandName]=useState("RC Marine Ops");
  const[brandLogoUrl,setBrandLogoUrl]=useState("");
  const[onboardIndustry,setOnboardIndustry]=useState("");
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
    return<ConfiguringScreen onDone={()=>{setChatMessages([]);setWipeIn(true);setPhase("workspace");setHomeTab("chat");window.location.hash="#home/chat";setTimeout(()=>setWipeIn(false),800);}}/>;
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
          </>:<span style={{fontFamily:T.serif,fontSize:17,fontWeight:500,letterSpacing:"-0.02em"}}>{isConnect?"Workspace Setup":isConnectors?"Connectors":isGoals?"Goals":isPeople?"People":isTasks?"Tasks":isScore?"Score":isRegisters?"Data Tables":isAppDetail?(APP_CATALOG.find(a=>a.id===appDetailId)||{}).name||"App":isCatalog?"Catalog":"Home"}</span>}
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
      {page==="home"&&<HomeContent homeTab={homeTab} setHomeTab={setHomeTabWithHash} chatMessages={chatMessages} setChatMessages={setChatMessages} pinnedWidgets={pinnedWidgets} pinWidget={pinWidget} unpinWidget={unpinWidget} overallPct={readinessPct} setConnectOpen={()=>navigate("connect")} industry={onboardIndustry} fromChatOnboarding={fromChatOnboarding} focusGoalName={focusGoalName} selectedGoals={selectedGoals} addedWorkflows={addedWorkflows} setAddedWorkflows={setAddedWorkflows} onNavigate={navigate}/>}
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
