/* ═══ SIDEBAR (Persistent push + icon-rail collapse) ═══ */
function Sidebar({mode,onToggle,onNavigate,activePage,brandName,brandLogoUrl,onSettings,installedApps}){
  const expanded=mode==="expanded";
  const W=expanded?240:56;

  /* ── Nav sections ── */
  const home=[{icon:IC.home,label:"Home",id:"home",action:()=>onNavigate("home")}];

  const operations=[
    {icon:IC.tasks,label:"Tasks",id:"tasks",action:()=>onNavigate("tasks")},
    {icon:IC.people,label:"People",id:"people",action:()=>onNavigate("people")},
  ];

  const goals=[
    {icon:IC.target,label:"Goals",id:"goals",action:()=>onNavigate("goals")},
    {icon:IC.chart,label:"Score",id:"score",action:()=>onNavigate("score")},
  ];

  const apps=[{icon:IC.catalog,label:"Catalog",id:"catalog",action:()=>onNavigate("catalog")}];

  const installedAppItems=(installedApps||[]).map(id=>{
    const app=APP_CATALOG.find(a=>a.id===id);
    if(!app)return null;
    return{label:app.name,id:"installed_"+app.id,appColor:app.color||T.accent,action:()=>{window.location.hash="#app/"+app.id;}};
  }).filter(Boolean);

  const platform=[
    {icon:IC.builder,label:"Builder",id:"builder",action:()=>onNavigate("builder")},
    {icon:IC.connector,label:"Connectors",id:"connectors",action:()=>onNavigate("connectors")},
  ];

  const data=[
    {icon:IC.grid,label:"Data Tables",id:"registers",action:()=>onNavigate("registers")},
    {icon:IC.source,label:"Sources"},
  ];

  const isActive=(item)=>item.id===activePage;

  /* ── Render helpers ── */
  const renderNavItem=(item,i)=>{
    const act=isActive(item);
    const disabled=item.disabled;
    return<div key={item.id||i} onClick={disabled?undefined:item.action} title={expanded?undefined:item.label} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 10px",borderRadius:T.rSm,background:act?T.accentSoft:"transparent",color:act?T.accent:T.textSecondary,cursor:disabled?"default":"pointer",opacity:disabled?0.45:1,position:"relative",justifyContent:expanded?"flex-start":"center"}}>
      {act&&<div style={{position:"absolute",left:0,top:"50%",transform:"translateY(-50%)",width:3,height:16,borderRadius:"0 3px 3px 0",background:T.accent}}/>}
      <span style={{flexShrink:0}}>{item.icon(act?T.accent:T.textSecondary)}</span>
      {expanded&&<span style={{fontSize:13,fontWeight:act?600:400,fontFamily:T.sans,letterSpacing:"-0.01em",whiteSpace:"nowrap",overflow:"hidden"}}>{item.label}</span>}
    </div>;
  };

  const renderInstalledApp=(item,i)=>{
    const act=isActive(item);
    return<div key={item.id||("ia"+i)} onClick={item.action} title={expanded?undefined:item.label} style={{display:"flex",alignItems:"center",gap:10,padding:expanded?"7px 10px 7px 18px":"7px 0",borderRadius:T.rSm,background:act?T.accentSoft:"transparent",color:act?T.accent:T.textSecondary,cursor:"pointer",position:"relative",justifyContent:expanded?"flex-start":"center"}}>
      {act&&<div style={{position:"absolute",left:0,top:"50%",transform:"translateY(-50%)",width:3,height:16,borderRadius:"0 3px 3px 0",background:T.accent}}/>}
      <span style={{flexShrink:0,width:16,height:16,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{width:8,height:8,borderRadius:"50%",background:item.appColor,display:"inline-block"}}/></span>
      {expanded&&<span style={{fontSize:12,fontWeight:act?600:400,fontFamily:T.sans,letterSpacing:"-0.01em",color:act?T.accent:T.textSecondary,whiteSpace:"nowrap",overflow:"hidden"}}>{item.label}</span>}
    </div>;
  };

  const renderSection=(label,items)=><div key={label}>
    {expanded?<div style={{fontSize:10,textTransform:"uppercase",letterSpacing:"0.08em",color:T.textTertiary,fontFamily:T.mono,padding:"4px 10px",marginBottom:4,marginTop:12}}>{label}</div>:<div style={{marginTop:12}}/>}
    {items.map(renderNavItem)}
  </div>;

  return<div style={{position:"fixed",left:0,top:0,bottom:0,width:W,background:T.surface,borderRight:`1px solid ${T.border}`,zIndex:100,transition:"width 0.3s cubic-bezier(0.4,0,0.2,1)",display:"flex",flexDirection:"column",overflow:"hidden"}}>
    {/* Header */}
    <div style={{padding:expanded?"14px 16px":"14px 0",display:"flex",alignItems:"center",justifyContent:expanded?"flex-start":"center",borderBottom:`1px solid ${T.borderSubtle}`,height:56,flexShrink:0}}>
      <div style={{display:"flex",alignItems:"center",gap:10,overflow:"hidden"}}><BrandIcon brandLogoUrl={brandLogoUrl} size={expanded?30:26}/>{expanded&&<span style={{fontFamily:T.serif,fontSize:16,fontWeight:600,letterSpacing:"-0.02em",whiteSpace:"nowrap"}}>{brandName||"RC Marine Ops"}</span>}</div>
    </div>

    {/* Nav */}
    <div style={{flex:1,padding:expanded?"12px 10px 0":"12px 6px 0",display:"flex",flexDirection:"column",overflowY:"auto"}}>
      {home.map(renderNavItem)}
      {renderSection("Operations",operations)}
      {renderSection("Goals",goals)}
      {renderSection("Apps",apps)}
      {installedAppItems.length>0&&installedAppItems.map(renderInstalledApp)}
      {renderSection("Platform",platform)}
      {renderSection("Data",data)}
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
