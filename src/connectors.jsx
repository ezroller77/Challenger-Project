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
