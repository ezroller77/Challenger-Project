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
