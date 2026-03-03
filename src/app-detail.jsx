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