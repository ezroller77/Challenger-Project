/* ═══ WIDGET: TASK LIST ═══ */
function TaskListWidget({mode,industry}){
  const tasks=(HOME_TASKS[industry]||HOME_TASKS.manufacturing);
  const doneCount=tasks.filter(t=>t.done).length;
  if(mode==="pinned"){
    const next=tasks.find(t=>!t.done);
    return<div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:32,height:32,borderRadius:9,background:T.accentSoft,display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.tasks(T.accent)}</div>
          <div><div style={{fontSize:13,fontWeight:600,letterSpacing:"-0.01em"}}>Today's Tasks</div><div style={{fontSize:11,color:T.textTertiary,marginTop:1}}>{doneCount} of {tasks.length} complete</div></div>
        </div>
      </div>
      <Bar pct={(doneCount/tasks.length)*100} color={T.green} height={4}/>
      {next&&<div style={{marginTop:10,fontSize:12,color:T.textSecondary,display:"flex",alignItems:"center",gap:6}}>
        <span style={{color:T.textTertiary}}>Next:</span>{next.text}
        {next.tag&&<span className="chip" style={{background:T.accentSoft,color:T.textSecondary}}>{next.tag}</span>}
      </div>}
    </div>;
  }
  return<div>
    {tasks.map((task,i)=><div key={i} style={{padding:"9px 0",borderBottom:i<tasks.length-1?`1px solid ${T.borderSubtle}`:"none",display:"flex",alignItems:"flex-start",gap:10,opacity:task.done?0.4:1}}>
      <div style={{width:18,height:18,borderRadius:6,flexShrink:0,border:task.done?"none":`1.5px solid ${task.ai?T.accentBorder:T.border}`,background:task.done?T.border:task.ai?T.accentSoft:"transparent",marginTop:1,display:"flex",alignItems:"center",justifyContent:"center"}}>{task.done&&IC.check("#fff",10)}</div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:13,letterSpacing:"-0.01em",color:task.done?T.textTertiary:T.text,textDecoration:task.done?"line-through":"none",lineHeight:1.35}}>{task.text}</div>
        {task.ai&&!task.done&&<div style={{marginTop:4,fontSize:10.5,color:T.highlight,fontFamily:T.mono,lineHeight:1.4,paddingLeft:9,borderLeft:`2px solid ${T.highlightBorder}`}}>{task.aiNote}</div>}
      </div>
      {task.tag&&<span className="chip" style={{background:task.ai?T.accentSoft:T.surfaceMuted,color:task.ai?T.text:T.textTertiary,flexShrink:0,marginTop:1}}>{task.tag}</span>}
    </div>)}
  </div>;
}

/* ═══ WIDGET: VELOCITY CHART ═══ */
function VelocityWidget({mode}){
  if(mode==="pinned") return<div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <div style={{width:32,height:32,borderRadius:9,background:T.greenSoft,display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.chart(T.green)}</div>
        <div><div style={{fontSize:13,fontWeight:600,letterSpacing:"-0.01em"}}>Team Velocity</div><div style={{fontSize:11,color:T.textTertiary,marginTop:1}}>Last 12 weeks</div></div>
      </div>
      <div style={{display:"flex",alignItems:"baseline",gap:6}}>
        <span style={{fontFamily:T.serif,fontSize:22,fontWeight:500,letterSpacing:"-0.03em"}}>72</span>
        <span className="chip" style={{background:T.greenSoft,color:T.green}}>↑ 12%</span>
      </div>
    </div>
    <Sparkline data={velData} color={T.green} fill/>
  </div>;
  return<div>
    <div className="lbl" style={{marginBottom:8}}>{IC.pin(T.textTertiary)} Team Velocity</div>
    <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:10}}>
      <span style={{fontFamily:T.serif,fontSize:28,fontWeight:500,letterSpacing:"-0.03em"}}>72</span>
      <span className="chip" style={{background:T.greenSoft,color:T.green}}>↑ 12%</span>
    </div>
    <Sparkline data={velData} color={T.green} fill/>
  </div>;
}

/* ═══ WIDGET: COMPLETION CHART ═══ */
function CompletionWidget({mode}){
  if(mode==="pinned") return<div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <div style={{width:32,height:32,borderRadius:9,background:T.highlightSoft,display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.chart(T.highlight)}</div>
        <div><div style={{fontSize:13,fontWeight:600,letterSpacing:"-0.01em"}}>Completion Rate</div><div style={{fontSize:11,color:T.textTertiary,marginTop:1}}>This quarter</div></div>
      </div>
      <div style={{display:"flex",alignItems:"baseline",gap:6}}>
        <span style={{fontFamily:T.serif,fontSize:22,fontWeight:500,letterSpacing:"-0.03em"}}>93%</span>
        <span className="chip" style={{background:T.highlightSoft,color:T.highlight}}>↑ 3%</span>
      </div>
    </div>
    <MiniBar data={compData} color={T.highlight}/>
  </div>;
  return<div>
    <div className="lbl" style={{marginBottom:8}}>{IC.pin(T.textTertiary)} Completion Rate</div>
    <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:10}}>
      <span style={{fontFamily:T.serif,fontSize:28,fontWeight:500,letterSpacing:"-0.03em"}}>93<span style={{fontSize:16,fontWeight:400}}>%</span></span>
      <span className="chip" style={{background:T.highlightSoft,color:T.highlight}}>↑ 3%</span>
    </div>
    <MiniBar data={compData} color={T.highlight}/>
  </div>;
}

/* ═══ WIDGET: REVENUE ═══ */
function RevenueWidget({mode}){
  if(mode==="pinned") return<div style={{background:T.dark,borderRadius:T.rSm,padding:"16px 18px",margin:"-16px -18px",color:"#D6D3D1"}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <div style={{width:32,height:32,borderRadius:9,background:"rgba(37,99,235,0.14)",display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.chart(T.highlight)}</div>
        <div><div style={{fontSize:13,fontWeight:600,letterSpacing:"-0.01em",color:"#E7E5E4"}}>Pipeline Revenue</div><div style={{fontSize:11,color:"#78716C",marginTop:1}}>This month</div></div>
      </div>
      <div style={{display:"flex",alignItems:"baseline",gap:6}}>
        <span style={{fontFamily:T.serif,fontSize:22,fontWeight:500,letterSpacing:"-0.03em",color:"#F5F5F4"}}>$284k</span>
        <span className="chip" style={{background:"rgba(5,150,105,0.15)",color:"#34D399"}}>↑ 18%</span>
      </div>
    </div>
    <AreaChart data={revData} color={T.highlight}/>
    <div style={{display:"flex",justifyContent:"space-between",marginTop:8,fontSize:9.5,fontFamily:T.mono,color:"#57534E"}}><span>Feb 1</span><span>Feb 15</span><span>Mar 1</span></div>
  </div>;
  return<div style={{background:T.dark,borderRadius:T.rSm,padding:"16px 18px",border:`1px solid ${T.darkBorder}`,color:"#D6D3D1"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
      <div className="lbl" style={{color:"#78716C"}}>{IC.pin("#78716C")} Pipeline Revenue</div>
      <div style={{display:"flex",gap:3}}>{["1W","1M","3M"].map((p,i)=><span key={i} style={{padding:"2px 8px",borderRadius:99,fontSize:9.5,fontFamily:T.mono,background:i===1?"rgba(255,255,255,0.08)":"transparent",color:i===1?"#E7E5E4":"#57534E",cursor:"pointer"}}>{p}</span>)}</div>
    </div>
    <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:14}}>
      <span style={{fontFamily:T.serif,fontSize:26,fontWeight:500,letterSpacing:"-0.03em",color:"#F5F5F4"}}>$284k</span>
      <span className="chip" style={{background:"rgba(5,150,105,0.15)",color:"#34D399"}}>↑ 18%</span>
    </div>
    <AreaChart data={revData} color={T.highlight}/>
    <div style={{display:"flex",justifyContent:"space-between",marginTop:8,fontSize:9.5,fontFamily:T.mono,color:"#57534E"}}><span>Feb 1</span><span>Feb 15</span><span>Mar 1</span></div>
  </div>;
}

/* ═══ WIDGET: ACTIVITY ═══ */
const HOME_ACTIVITY={
  manufacturing:[
    {time:"9:02am",text:"Analyzed overnight shift handover logs",type:"done"},
    {time:"9:01am",text:"Flagged bearing temp anomaly on Line 3",type:"alert"},
    {time:"8:58am",text:"Auto-populated OEE report from MES data",type:"done"},
    {time:"now",text:"Monitoring Line 1 quality hold status...",type:"active"},
  ],
  qsr:[
    {time:"6:32am",text:"Verified walk-in cooler temps within range",type:"done"},
    {time:"6:30am",text:"Cross-referenced crew schedule with forecast",type:"done"},
    {time:"6:28am",text:"Flagged 1 call-out — suggested backup crew",type:"alert"},
    {time:"now",text:"Monitoring delivery order queue...",type:"active"},
  ],
  "transport-logistics":[
    {time:"7:45am",text:"Reviewed 24 pre-trip inspection reports",type:"done"},
    {time:"7:42am",text:"Flagged 2 safety issues on Unit 4472",type:"alert"},
    {time:"7:38am",text:"Detected $340 fuel card variance",type:"done"},
    {time:"now",text:"Monitoring real-time fleet positions...",type:"active"},
  ],
};
const activityItems=HOME_ACTIVITY.manufacturing;
function ActivityWidget({mode,industry}){
  const items=(HOME_ACTIVITY[industry]||HOME_ACTIVITY.manufacturing);
  if(mode==="pinned") return<div>
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
      <div style={{width:32,height:32,borderRadius:9,background:T.greenSoft,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:8,height:8,borderRadius:"50%",background:T.green,animation:"pulse 2s infinite"}}/></div>
      <div><div style={{fontSize:13,fontWeight:600,letterSpacing:"-0.01em"}}>AI Activity</div><div style={{fontSize:11,color:T.textTertiary,marginTop:1}}>4 actions today</div></div>
    </div>
    {items.map((item,i)=><div key={i} style={{display:"flex",gap:10,padding:"6px 0",borderBottom:i<items.length-1?`1px solid ${T.borderSubtle}`:"none"}}>
      <span style={{fontSize:10,fontFamily:T.mono,color:item.type==="active"?T.highlight:T.textTertiary,width:48,flexShrink:0,paddingTop:1.5}}>{item.time}</span>
      <div style={{position:"relative",paddingLeft:14}}>
        <div style={{position:"absolute",left:0,top:5,width:6,height:6,borderRadius:"50%",background:item.type==="active"?T.highlight:item.type==="alert"?T.amber:T.border,boxShadow:item.type==="active"?`0 0 6px ${T.highlightSoft}`:"none"}}/>
        <span style={{fontSize:12,color:item.type==="active"?T.text:T.textSecondary,letterSpacing:"-0.01em",lineHeight:1.4}}>{item.text}</span>
      </div>
    </div>)}
  </div>;
  return<div>
    <div className="lbl" style={{marginBottom:10}}><div style={{width:6,height:6,borderRadius:"50%",background:T.green,animation:"pulse 2s infinite"}}/>Recent AI Activity</div>
    {items.map((item,i)=><div key={i} style={{display:"flex",gap:10,padding:"7px 0",borderBottom:i<items.length-1?`1px solid ${T.borderSubtle}`:"none"}}>
      <span style={{fontSize:10,fontFamily:T.mono,color:item.type==="active"?T.highlight:T.textTertiary,width:48,flexShrink:0,paddingTop:1.5}}>{item.time}</span>
      <div style={{position:"relative",paddingLeft:14}}>
        <div style={{position:"absolute",left:0,top:5,width:6,height:6,borderRadius:"50%",background:item.type==="active"?T.highlight:item.type==="alert"?T.amber:T.border,boxShadow:item.type==="active"?`0 0 6px ${T.highlightSoft}`:"none"}}/>
        <span style={{fontSize:12,color:item.type==="active"?T.text:T.textSecondary,letterSpacing:"-0.01em",lineHeight:1.4}}>{item.text}</span>
      </div>
    </div>)}
  </div>;
}

/* ═══ WIDGET: QUICK STATS ═══ */
const HOME_STATS={
  manufacturing:[
    {label:"Open WOs",value:"7",sub:"2 are critical",color:T.violet},
    {label:"OEE today",value:"84%",sub:"↑3% vs yesterday",color:T.green},
    {label:"Quality holds",value:"2",sub:"Awaiting review",color:T.amber},
  ],
  qsr:[
    {label:"Transactions",value:"142",sub:"↑8% vs last week",color:T.green},
    {label:"Labor cost",value:"28%",sub:"On target",color:T.violet},
    {label:"Safety score",value:"96",sub:"Last audit",color:T.amber},
  ],
  "transport-logistics":[
    {label:"Active loads",value:"38",sub:"2 exceptions",color:T.violet},
    {label:"HOS rate",value:"98%",sub:"Fleet-wide",color:T.green},
    {label:"On-time",value:"94%",sub:"This week",color:T.amber},
  ],
};
const quickStatsData=HOME_STATS.manufacturing;
function QuickStatsWidget({mode,industry}){
  const stats=(HOME_STATS[industry]||HOME_STATS.manufacturing);
  if(mode==="pinned") return<div>
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
      <div style={{width:32,height:32,borderRadius:9,background:T.violetSoft,display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.chart(T.violet)}</div>
      <div><div style={{fontSize:13,fontWeight:600,letterSpacing:"-0.01em"}}>Quick Stats</div><div style={{fontSize:11,color:T.textTertiary,marginTop:1}}>Today's numbers</div></div>
    </div>
    <div style={{display:"flex",gap:16}}>
      {stats.map((s,i)=><div key={i} style={{flex:1,textAlign:"center"}}>
        <div style={{fontFamily:T.serif,fontSize:22,fontWeight:500,letterSpacing:"-0.02em",marginBottom:2}}>{s.value}</div>
        <div style={{fontSize:10,color:T.textTertiary,fontFamily:T.mono,textTransform:"uppercase",letterSpacing:"0.04em"}}>{s.label}</div>
        <div style={{fontSize:10.5,color:T.textSecondary,marginTop:3}}>{s.sub}</div>
      </div>)}
    </div>
  </div>;
  return<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
    {stats.map((stat,i)=><div key={i} className="bento" style={{padding:"14px 16px"}}>
      <div className="lbl" style={{marginBottom:4}}>{stat.label}</div>
      <div style={{fontFamily:T.serif,fontSize:22,fontWeight:500,letterSpacing:"-0.02em"}}>{stat.value}</div>
      <div style={{fontSize:11,color:T.textTertiary,marginTop:2}}>{stat.sub}</div>
    </div>)}
  </div>;
}

/* ═══ AGENT BRIEFING WIDGET ═══ */
function AgentBriefingWidget({mode,industry,installedApps,onNavigate}){
  /* Collect alerts from installed apps' agents */
  const apps=installedApps||[];
  const briefings=apps.map(appId=>{
    const agentData=APP_AGENT_INSIGHTS[appId];
    const appInfo=APP_CATALOG.find(a=>a.id===appId);
    if(!agentData||!appInfo)return null;
    const alert=agentData.insights.find(i=>i.type==="alert");
    return{appId,agent:agentData.agent,appName:appInfo.name,color:appInfo.color,proactive:agentData.proactive,alert,severity:alert?alert.severity:"low"};
  }).filter(Boolean);
  /* Sort: high severity first */
  briefings.sort((a,b)=>{const o={high:0,medium:1,positive:2,low:3};return(o[a.severity]||3)-(o[b.severity]||3);});
  const alertCount=briefings.filter(b=>b.severity==="high").length;

  if(briefings.length===0){
    return<div>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
        <div style={{width:32,height:32,borderRadius:9,background:T.accentSoft,display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.sparkle(T.accent)}</div>
        <div><div style={{fontSize:13,fontWeight:600,letterSpacing:"-0.01em"}}>Agent Briefing</div><div style={{fontSize:11,color:T.textTertiary,marginTop:1}}>No apps installed yet</div></div>
      </div>
      <div style={{fontSize:12,color:T.textTertiary,lineHeight:1.5}}>Install apps from the Catalog to see agent insights here.</div>
    </div>;
  }

  if(mode==="pinned"){
    /* Compact view — show top 4 */
    const shown=briefings.slice(0,4);
    return<div>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
        <div style={{width:32,height:32,borderRadius:9,background:T.accentSoft,display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.sparkle(T.accent)}</div>
        <div><div style={{fontSize:13,fontWeight:600,letterSpacing:"-0.01em"}}>Agent Briefing</div><div style={{fontSize:11,color:T.textTertiary,marginTop:1}}>{alertCount>0?`${alertCount} item${alertCount!==1?"s":""} need${alertCount===1?"s":""} attention`:"All clear"}</div></div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {shown.map((b,i)=>{
          const sevCol=b.severity==="high"?T.rose:b.severity==="medium"?T.amber:T.green;
          const sevBg=b.severity==="high"?T.roseSoft:b.severity==="medium"?T.amberSoft:T.greenSoft;
          return<div key={i} onClick={()=>{window.location.hash="#app/"+b.appId;}} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:T.rSm,background:T.surfaceHover,border:`1px solid ${T.borderSubtle}`,cursor:"pointer",transition:"all 0.15s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=b.color+"50";e.currentTarget.style.background=b.color+"08";}} onMouseLeave={e=>{e.currentTarget.style.borderColor=T.borderSubtle;e.currentTarget.style.background=T.surfaceHover;}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:sevCol,flexShrink:0}}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:12,fontWeight:600,color:T.text,letterSpacing:"-0.01em",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{b.agent}</div>
              <div style={{fontSize:11,color:T.textSecondary,marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{b.alert?b.alert.title:b.proactive?.message?.slice(0,60)+"..."}</div>
            </div>
            <span style={{fontSize:9,fontFamily:T.mono,padding:"2px 7px",borderRadius:99,background:sevBg,color:sevCol,fontWeight:600,flexShrink:0}}>{b.severity==="high"?"Alert":b.severity==="medium"?"Watch":"OK"}</span>
            {IC.chevRight(T.textTertiary,12)}
          </div>;
        })}
      </div>
      {briefings.length>4&&<div style={{fontSize:11,color:T.textTertiary,marginTop:8,textAlign:"center"}}>+{briefings.length-4} more agent{briefings.length-4!==1?"s":""}</div>}
    </div>;
  }

  /* Inline (chat) mode — more compact */
  return<div>
    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
      {IC.sparkle(T.accent,12)}
      <span style={{fontSize:12,fontWeight:600,color:T.text}}>Agent Briefing</span>
      {alertCount>0&&<span style={{fontSize:9,fontFamily:T.mono,padding:"1px 6px",borderRadius:99,background:T.roseSoft,color:T.rose,fontWeight:600}}>{alertCount} alert{alertCount!==1?"s":""}</span>}
    </div>
    {briefings.slice(0,3).map((b,i)=><div key={i} style={{fontSize:12,color:T.textSecondary,padding:"4px 0",display:"flex",alignItems:"center",gap:6}}>
      <div style={{width:6,height:6,borderRadius:"50%",background:b.severity==="high"?T.rose:b.severity==="medium"?T.amber:T.green,flexShrink:0}}/>
      <span style={{fontWeight:500,color:T.text}}>{b.agent}:</span> {b.alert?b.alert.title:"All clear"}
    </div>)}
  </div>;
}

/* ═══ WIDGET DISPATCHER ═══ */
const WIDGET_MAP={agentBriefing:AgentBriefingWidget,taskList:TaskListWidget,velocity:VelocityWidget,completion:CompletionWidget,revenue:RevenueWidget,activity:ActivityWidget,quickStats:QuickStatsWidget};
const WIDGET_LABELS={agentBriefing:"Agent Briefing",taskList:"Tasks",velocity:"Velocity",completion:"Completion",revenue:"Revenue",activity:"Activity",quickStats:"Stats"};

function ChatWidget({widget,mode,isPinned,onPin,onUnpin,industry,installedApps,onNavigate}){
  const Comp=WIDGET_MAP[widget.type];
  if(!Comp) return null;
  const pinned=isPinned;
  const isRevenuePinned=widget.type==="revenue"&&mode==="pinned";
  return<div style={{position:"relative",borderRadius:T.r,border:`1px solid ${isRevenuePinned?"transparent":T.border}`,padding:mode==="pinned"?"18px":"14px 16px",background:isRevenuePinned?"transparent":T.surface,overflow:"hidden",transition:"all 0.3s cubic-bezier(0.4,0,0.2,1)",boxShadow:mode==="pinned"?T.shadow:"none"}}>
    <div onClick={()=>pinned?onUnpin(widget.type):onPin(widget.type)} style={{position:"absolute",top:mode==="pinned"?10:8,right:mode==="pinned"?10:8,width:26,height:26,borderRadius:7,background:pinned?T.highlightSoft:T.surfaceMuted,border:`1px solid ${pinned?T.highlightBorder:T.border}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all 0.15s",zIndex:2,opacity:mode==="pinned"?1:0.6}} onMouseEnter={e=>{e.currentTarget.style.opacity="1";e.currentTarget.style.transform="scale(1.08)";}} onMouseLeave={e=>{e.currentTarget.style.opacity=mode==="pinned"?"1":"0.6";e.currentTarget.style.transform="scale(1)";}} title={pinned?"Unpin from dashboard":"Pin to dashboard"}>
      {IC.pin(pinned?T.highlight:T.textTertiary,10)}
    </div>
    <Comp mode={mode} industry={industry} installedApps={installedApps} onNavigate={onNavigate}/>
  </div>;
}

/* ═══ SETUP WIDGET (in-chat readiness card) ═══ */
function SetupWidget({industry,selectedGoals,addedWorkflows,setAddedWorkflows,focusGoalName,onNavigate}){
  const[expanded,setExpanded]=useState(false);
  const _addedWorkflows=addedWorkflows||[];
  const workflows=useMemo(()=>{
    const templates=WORKFLOW_TEMPLATES[industry]||[];
    return templates.filter(w=>w.goalIds.some(id=>selectedGoals.includes(id)));
  },[industry,selectedGoals]);
  const peopleAssets=useMemo(()=>{
    const pa=PEOPLE_ASSETS_TEMPLATES[industry]||{people:[],assets:[]};
    return{
      people:pa.people.filter(p=>p.goalIds.some(id=>selectedGoals.includes(id))),
      assets:pa.assets.filter(a=>a.goalIds.some(id=>selectedGoals.includes(id))),
    };
  },[industry,selectedGoals]);
  const goalItems=[
    {id:"primary",name:"Set your primary objective",sub:"What outcome matters most?",pts:10,done:true},
    {id:"metrics",name:"Define success metrics",sub:"KPIs and targets",pts:10,done:false},
    {id:"timeline",name:"Set a timeline",sub:"When do you need results?",pts:10,done:false},
  ];
  const goalDone=goalItems.filter(g=>g.done).length;
  const wfDone=_addedWorkflows.length;
  const totalPts=(goalDone*10)+(wfDone*15);
  const maxPts=(goalItems.length*10)+(workflows.length*15)+(peopleAssets.people.length*5)+(peopleAssets.assets.length*5);
  const pct=maxPts>0?Math.round((totalPts/maxPts)*100):0;

  const sections=[
    {key:"goal",label:"Goal",sub:"Define what you want to achieve",icon:IC.target,color:T.highlight,iconBg:T.highlightSoft,done:goalDone,total:goalItems.length,pts:goalDone*10},
    {key:"workflows",label:"Workflows",sub:"Map your core processes",icon:IC.workflow,color:T.green,iconBg:T.greenSoft,done:wfDone,total:workflows.length,pts:wfDone*15},
    {key:"people",label:"People",sub:"Connect your team",icon:IC.people,color:T.violet,iconBg:T.violetSoft,done:0,total:peopleAssets.people.length,pts:0},
    {key:"assets",label:"Assets",sub:"Register equipment and locations",icon:IC.asset,color:T.amber,iconBg:T.amberSoft,done:0,total:peopleAssets.assets.length,pts:0},
  ];

  const toggleWf=(wId)=>{if(setAddedWorkflows)setAddedWorkflows(prev=>prev.includes(wId)?prev.filter(x=>x!==wId):[...prev,wId]);};

  return<div style={{marginTop:6,borderRadius:T.r,border:`1px solid ${T.border}`,overflow:"hidden",background:T.surface,animation:"fadeIn 0.4s ease 0.1s both"}}>
    {/* Dark readiness header */}
    <div style={{background:`linear-gradient(145deg, ${T.dark} 0%, #292524 100%)`,padding:"18px 20px",display:"flex",alignItems:"center",gap:16}}>
      <MiniRing pct={pct} size={48} stroke={4} color={pct>=60?T.green:pct>=30?T.highlight:T.amber}/>
      <div style={{flex:1}}>
        <div style={{fontFamily:T.serif,fontSize:18,fontWeight:500,color:"#F5F5F4",letterSpacing:"-0.02em"}}><span style={{fontFamily:T.mono,fontWeight:700,marginRight:6}}>{pct}</span>Readiness Score</div>
        <div style={{fontSize:11,color:"#78716C",marginTop:2}}>{totalPts} of {maxPts} points earned</div>
      </div>
      <div style={{display:"flex",gap:6}}>
        {sections.map(s=><span key={s.key} style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 8px",borderRadius:99,background:"rgba(255,255,255,0.06)",fontSize:10,fontFamily:T.mono,color:"#A8A29E"}}>
          <span style={{width:5,height:5,borderRadius:"50%",background:s.color}}/>
          {s.done}/{s.total}
        </span>)}
      </div>
    </div>

    {/* Collapsed: summary row with section icons + Get started button */}
    {!expanded&&<div style={{padding:"14px 20px",display:"flex",alignItems:"center",gap:14,borderTop:`1px solid ${T.borderSubtle}`}}>
      <div style={{flex:1,display:"flex",alignItems:"center",gap:12}}>
        {sections.map(s=><div key={s.key} style={{display:"flex",alignItems:"center",gap:7}}>
          <div style={{width:28,height:28,borderRadius:7,background:s.iconBg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{s.icon(s.color,13)}</div>
          <div>
            <div style={{fontSize:12,fontWeight:600,letterSpacing:"-0.01em",lineHeight:1.2}}>{s.label}</div>
            <div style={{fontSize:10,color:T.textTertiary,fontFamily:T.mono}}>{s.done}/{s.total}</div>
          </div>
        </div>)}
      </div>
      <div onClick={()=>setExpanded(true)} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"8px 18px",borderRadius:99,background:T.accent,color:"#fff",fontSize:12.5,fontWeight:600,letterSpacing:"-0.01em",cursor:"pointer",transition:"all 0.2s",boxShadow:"0 2px 8px rgba(28,25,23,0.12)",flexShrink:0,whiteSpace:"nowrap"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow="0 4px 14px rgba(28,25,23,0.18)";}} onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 2px 8px rgba(28,25,23,0.12)";}}>
        {IC.sparkle("#fff",12)}
        Get started
      </div>
    </div>}

    {/* Expanded: full section cards */}
    {expanded&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:0,animation:"fadeIn 0.3s ease"}}>
      {sections.map((sec,si)=>{
        const secPct=sec.total>0?Math.round((sec.done/sec.total)*100):0;
        const items=sec.key==="goal"?goalItems:sec.key==="workflows"?workflows:sec.key==="people"?peopleAssets.people.map(p=>({id:p.role,name:p.role,sub:`${p.goalIds.length} goals`})):peopleAssets.assets.map(a=>({id:a.name,name:a.name,sub:`${a.goalIds.length} goals`}));
        return<div key={sec.key} style={{padding:"16px 18px",borderTop:`1px solid ${T.borderSubtle}`,borderRight:si%2===0?`1px solid ${T.borderSubtle}`:"none"}}>
          {/* Section header */}
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
            <div style={{width:34,height:34,borderRadius:9,background:sec.iconBg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{sec.icon(sec.color,16)}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:14,fontWeight:600,letterSpacing:"-0.01em"}}>{sec.label}</div>
              <div style={{fontSize:11,color:T.textTertiary,marginTop:1}}>{sec.sub}</div>
            </div>
            <Ring pct={secPct} size={38} stroke={3} color={sec.color}/>
          </div>

          {/* Progress line */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
            <span style={{fontSize:9.5,fontFamily:T.mono,textTransform:"uppercase",letterSpacing:"0.06em",color:T.textTertiary}}>{sec.done} of {sec.total} complete</span>
            <span style={{fontSize:10,fontFamily:T.mono,color:sec.color,fontWeight:600}}>{sec.pts} pts</span>
          </div>
          <Bar pct={secPct} color={sec.color} height={3}/>

          {/* Items */}
          <div style={{marginTop:10,display:"flex",flexDirection:"column",gap:0}}>
            {items.map((item,ii)=>{
              const isDone=sec.key==="goal"?item.done:sec.key==="workflows"?_addedWorkflows.includes(item.id):false;
              return<div key={item.id||ii} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 0",borderTop:ii>0?`1px solid ${T.borderSubtle}`:"none"}}>
                {isDone?<div style={{width:20,height:20,borderRadius:6,background:sec.color,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{IC.check("#fff",10)}</div>:<div style={{width:20,height:20,borderRadius:6,border:`1.5px solid ${T.border}`,flexShrink:0}}/>}
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12.5,fontWeight:isDone?500:400,color:isDone?T.text:T.textSecondary,letterSpacing:"-0.01em"}}>{item.name}</div>
                  {item.sub&&!isDone&&<div style={{fontSize:10,color:T.textTertiary,marginTop:1}}>{item.sub}</div>}
                </div>
                {isDone?<span style={{fontSize:10,fontFamily:T.mono,color:sec.color,fontWeight:600}}>+{sec.key==="goal"?10:15}</span>
                :<div onClick={()=>{
                  if(sec.key==="workflows")toggleWf(item.id);
                }} style={{padding:"4px 12px",borderRadius:99,fontSize:10.5,fontWeight:500,border:`1px solid ${T.border}`,color:T.textSecondary,cursor:"pointer",display:"flex",alignItems:"center",gap:4,transition:"all 0.15s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=sec.color;e.currentTarget.style.color=sec.color;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.textSecondary;}}>{IC.plus(T.textSecondary,10)} Add</div>}
              </div>;
            })}
          </div>
        </div>;
      })}
    </div>}
  </div>;
}

/* ═══ CHAT MESSAGE (with avatar for AI) ═══ */
function ChatMessage({msg,pinnedWidgets,onPin,onUnpin,industry,fromChatOnboarding,selectedGoals,addedWorkflows,setAddedWorkflows,focusGoalName,onNavigate}){
  const isAI=msg.role==="ai";
  const parseBold=(text)=>{
    const parts=text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p,i)=>{
      if(p.startsWith("**")&&p.endsWith("**")) return<strong key={i} style={{color:T.text,fontWeight:600}}>{p.slice(2,-2)}</strong>;
      return p;
    });
  };

  if(!isAI) return<div style={{alignSelf:"flex-end",maxWidth:"85%",animation:"fadeInUp 0.35s cubic-bezier(0.4,0,0.2,1)"}}>
    <div style={{background:T.accent,borderRadius:"16px 16px 4px 16px",padding:"12px 18px",fontSize:13.5,lineHeight:1.55,color:"#fff",letterSpacing:"-0.01em",boxShadow:"0 2px 8px rgba(28,25,23,0.12)"}}>{msg.text}</div>
  </div>;

  /* AI message with avatar */
  return<div style={{display:"flex",gap:12,alignItems:"flex-start",animation:"fadeInUp 0.4s cubic-bezier(0.4,0,0.2,1)",maxWidth:"92%"}}>
    <div style={{width:32,height:32,borderRadius:10,background:T.accent,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:"0 2px 8px rgba(28,25,23,0.1)"}}>{IC.sparkle("#fff",14)}</div>
    <div style={{flex:1,minWidth:0,display:"flex",flexDirection:"column",gap:8}}>
      <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:"4px 16px 16px 16px",padding:"14px 18px",fontSize:13.5,lineHeight:1.6,color:T.textSecondary,letterSpacing:"-0.01em",boxShadow:T.shadow}}>
        {parseBold(msg.text)}
      </div>
      {msg.setupWidget&&<SetupWidget industry={industry} selectedGoals={selectedGoals} addedWorkflows={addedWorkflows} setAddedWorkflows={setAddedWorkflows} focusGoalName={focusGoalName} onNavigate={onNavigate}/>}
      {msg.widgets&&msg.widgets.length>0&&<div style={{display:"flex",flexDirection:"column",gap:8}}>
        {msg.widgets.map((w,i)=><ChatWidget key={i} widget={w} mode="inline" isPinned={pinnedWidgets.includes(w.type)} onPin={onPin} onUnpin={onUnpin} industry={industry}/>)}
      </div>}
      {msg.chips&&msg.chips.length>0&&<div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        {msg.chips.map((c,i)=><div key={i} className={i===0?"action-chip primary":"action-chip"}>{c}</div>)}
      </div>}
    </div>
  </div>;
}

/* ═══ CHAT VIEW (Full Screen) ═══ */
function ChatView({chatMessages,setChatMessages,pinnedWidgets,pinWidget,unpinWidget,industry,fromChatOnboarding,focusGoalName,selectedGoals,addedWorkflows,setAddedWorkflows,onNavigate}){
  const[input,setInput]=useState("");
  const[showTyping,setShowTyping]=useState(false);
  const msgsEnd=useRef(null);
  const scrollToBottom=useCallback(()=>{if(msgsEnd.current)msgsEnd.current.scrollIntoView({behavior:"smooth"});},[]);
  useEffect(()=>{scrollToBottom();},[chatMessages,showTyping,scrollToBottom]);

  /* On mount from chat onboarding: show typing then welcome message */
  const hasShownWelcome=useRef(false);
  useEffect(()=>{
    if(fromChatOnboarding&&!hasShownWelcome.current&&chatMessages.length===0){
      hasShownWelcome.current=true;
      setShowTyping(true);
      const focusName=focusGoalName||"your selected goals";
      setTimeout(()=>{
        setShowTyping(false);
        setChatMessages([{
          id:"welcome",role:"ai",
          text:`Welcome to Flows. We've set up your workspace to focus on your first goal — **${focusName}**.`,
          widgets:[],chips:[]
        }]);
        /* Show setup widget after a beat */
        setTimeout(()=>{
          setChatMessages(prev=>[...prev,{
            id:"setup",role:"ai",
            text:"Set up the recommended flows and add your people and assets to get started.",
            setupWidget:true,widgets:[],chips:[]
          }]);
        },800);
      },1200);
    }
  },[fromChatOnboarding]);

  /* Initialise with standard messages if NOT from chat onboarding and no messages */
  useEffect(()=>{
    if(!fromChatOnboarding&&chatMessages.length===0){
      setChatMessages(INITIAL_MESSAGES_MAP[industry]||INITIAL_MESSAGES_MAP.manufacturing||INITIAL_MESSAGES);
    }
  },[industry]);

  const now=new Date();
  const days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const months=["January","February","March","April","May","June","July","August","September","October","November","December"];
  const dateStr=`${days[now.getDay()]} · ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
  const hour=now.getHours();
  const greeting=hour<12?"Good morning":hour<17?"Good afternoon":"Good evening";

  const doSend=()=>{
    if(!input.trim())return;
    const q=input.trim().toLowerCase();
    setInput("");
    const userMsg={id:`u${Date.now()}`,role:"user",text:input.trim(),widgets:[],chips:[]};
    const matchKey=Object.keys(AI_RESPONSES).find(k=>q.includes(k));
    const resp=matchKey?AI_RESPONSES[matchKey]:AI_FALLBACK;
    const aiMsg={id:`a${Date.now()}`,role:"ai",text:resp.text,widgets:resp.widgets,chips:resp.chips};
    setChatMessages(prev=>[...prev,userMsg,aiMsg]);
  };

  const mw={maxWidth:680,width:"100%",margin:"0 auto"};

  return<div style={{display:"flex",flexDirection:"column",flex:1,overflow:"hidden",background:T.surface}}>
    {/* Header */}
    <div style={{padding:"20px 32px 0",flexShrink:0}}>
      <div style={{...mw,display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div style={{animation:"fadeIn 0.5s ease"}}>
          <div className="lbl" style={{marginBottom:3}}>{dateStr}</div>
          <h1 style={{fontFamily:T.serif,fontSize:"clamp(20px,3vw,26px)",fontWeight:400,letterSpacing:"-0.03em",lineHeight:1.2}}>{greeting}, Sarah</h1>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6,fontSize:10.5,fontFamily:T.mono,color:T.textTertiary,paddingTop:4}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:T.green,animation:"subtleBreathe 3s infinite"}}/>
          <span>Online</span>
        </div>
      </div>
    </div>

    {/* Messages */}
    <div style={{flex:1,overflowY:"auto",padding:"18px 32px",display:"flex",flexDirection:"column",alignItems:"center"}}>
      <div style={{...mw,display:"flex",flexDirection:"column",gap:12}}>
        {chatMessages.map(msg=><ChatMessage key={msg.id} msg={msg} pinnedWidgets={pinnedWidgets} onPin={pinWidget} onUnpin={unpinWidget} industry={industry} fromChatOnboarding={fromChatOnboarding} selectedGoals={selectedGoals} addedWorkflows={addedWorkflows} setAddedWorkflows={setAddedWorkflows} focusGoalName={focusGoalName} onNavigate={onNavigate}/>)}

        {/* Typing indicator */}
        {showTyping&&<div style={{display:"flex",gap:12,alignItems:"flex-start",animation:"fadeIn 0.3s ease"}}>
          <div style={{width:32,height:32,borderRadius:10,background:T.accent,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:"0 2px 8px rgba(28,25,23,0.1)"}}>{IC.sparkle("#fff",14)}</div>
          <div style={{display:"flex",gap:4,padding:"16px 18px",background:T.surface,border:`1px solid ${T.border}`,borderRadius:"4px 16px 16px 16px",boxShadow:T.shadow}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:T.textTertiary,animation:"cobDotBounce 1.2s infinite"}}/>
            <div style={{width:7,height:7,borderRadius:"50%",background:T.textTertiary,animation:"cobDotBounce 1.2s infinite 0.15s"}}/>
            <div style={{width:7,height:7,borderRadius:"50%",background:T.textTertiary,animation:"cobDotBounce 1.2s infinite 0.3s"}}/>
          </div>
        </div>}

        <div ref={msgsEnd}/>
      </div>
    </div>

    {/* ── Chat Insight CTA ── */}
    <div style={{padding:"0 32px",flexShrink:0}}>
      <div style={{...mw}}>
        <div onClick={()=>{setInput("Give me an insight on today's operations");}} style={{padding:"14px 18px",borderRadius:T.r,background:`linear-gradient(135deg, ${T.accentSoft}, ${T.highlightSoft})`,border:`1px solid ${T.accentBorder}`,display:"flex",alignItems:"center",gap:14,cursor:"pointer",transition:"all 0.2s",marginBottom:6}} onMouseEnter={e=>{e.currentTarget.style.borderColor=T.accent;e.currentTarget.style.boxShadow=`0 4px 16px ${T.accent}15`;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=T.accentBorder;e.currentTarget.style.boxShadow="none";}}>
          <div style={{width:36,height:36,borderRadius:10,background:T.accent,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:"0 2px 8px rgba(28,25,23,0.1)"}}>{IC.sparkle("#fff",16)}</div>
          <div style={{flex:1}}>
            <div style={{fontFamily:T.sans,fontSize:13,fontWeight:600,color:T.text,letterSpacing:"-0.01em"}}>Get today's insight</div>
            <div style={{fontFamily:T.sans,fontSize:11.5,color:T.textSecondary,marginTop:1}}>AI will analyse activity, flag risks, and suggest next actions</div>
          </div>
          <div style={{padding:"7px 16px",borderRadius:99,background:T.accent,color:"#fff",fontSize:11.5,fontWeight:600,fontFamily:T.sans,flexShrink:0,whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:5}}>{IC.sparkle("#fff",10)} Ask</div>
        </div>
      </div>
    </div>

    {/* Input */}
    <div style={{padding:"10px 32px 18px",flexShrink:0,position:"relative"}}>
      {/* Ambient glow */}
      <div style={{position:"absolute",top:0,left:0,right:0,bottom:"-20px",pointerEvents:"none",zIndex:0}}>
        <div style={{position:"absolute",width:"55%",height:"120%",left:"2%",top:"10%",borderRadius:"50%",background:"rgba(59,130,246,0.22)",filter:"blur(60px)",animation:"glowA 5s ease-in-out infinite",willChange:"transform"}}/>
        <div style={{position:"absolute",width:"55%",height:"120%",right:"2%",top:"10%",borderRadius:"50%",background:"rgba(168,85,247,0.16)",filter:"blur(60px)",animation:"glowB 6.5s ease-in-out infinite",willChange:"transform"}}/>
      </div>
      <div style={{...mw,position:"relative",zIndex:1}}>
        <div className="chat-wrap" style={{borderRadius:12,padding:"5px 5px 5px 16px"}}>
          <input className="chat-in" type="text" placeholder="Ask anything or describe a task..." value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")doSend();}} style={{fontSize:13.5,padding:"10px 0"}}/>
          <div onClick={doSend} style={{width:36,height:36,borderRadius:10,flexShrink:0,background:input?T.accent:T.border,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"background 0.2s"}}>{IC.send(input?"#fff":T.textTertiary)}</div>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:10,justifyContent:"center"}}>
          {(HOME_QUICK_ACTIONS[industry]||HOME_QUICK_ACTIONS.manufacturing).map((qa,i)=><div key={i} className="action-chip" onClick={()=>{setInput(qa.key);}}>{qa.label}</div>)}
        </div>
      </div>
    </div>
  </div>;
}

/* ═══ WIDGET PICKER POPOVER ═══ */
function WidgetPicker({open,onClose,pinnedWidgets,onAdd}){
  const ref=useRef(null);
  useEffect(()=>{if(!open)return;const h=(e)=>{if(ref.current&&!ref.current.contains(e.target))onClose();};document.addEventListener("mousedown",h);return()=>document.removeEventListener("mousedown",h);},[open,onClose]);
  if(!open)return null;
  return<div ref={ref} style={{position:"absolute",top:"100%",right:0,marginTop:6,width:260,background:T.surface,border:`1px solid ${T.border}`,borderRadius:T.r,boxShadow:T.shadowLg,padding:"8px",zIndex:20,animation:"fadeIn 0.2s ease"}}>
    <div style={{padding:"6px 8px 10px",fontSize:10,textTransform:"uppercase",letterSpacing:"0.06em",fontFamily:T.mono,color:T.textTertiary}}>Add Widget</div>
    {AVAILABLE_WIDGETS.map((w,i)=>{
      const already=pinnedWidgets.includes(w.type);
      return<div key={i} onClick={()=>{if(!already){onAdd(w.type);onClose();}}} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 10px",borderRadius:T.rSm,cursor:already?"default":"pointer",opacity:already?0.4:1,transition:"background 0.15s",background:"transparent"}} onMouseEnter={e=>{if(!already)e.currentTarget.style.background=T.surfaceHover;}} onMouseLeave={e=>{e.currentTarget.style.background="transparent";}}>
        <div style={{width:28,height:28,borderRadius:8,background:already?T.surfaceMuted:`${w.color}11`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{w.icon(already?T.textTertiary:w.color)}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:12.5,fontWeight:500,letterSpacing:"-0.01em",color:already?T.textTertiary:T.text}}>{w.label}</div>
          <div style={{fontSize:10.5,color:T.textTertiary,marginTop:1}}>{w.desc}</div>
        </div>
        {already&&<span style={{fontSize:9,fontFamily:T.mono,color:T.textTertiary,flexShrink:0}}>Added</span>}
      </div>;
    })}
  </div>;
}

/* ═══ DASHBOARD VIEW (Full Screen) ═══ */
function DashboardView({pinnedWidgets,pinWidget,unpinWidget,industry,installedApps,onNavigate}){
  const[pickerOpen,setPickerOpen]=useState(false);
  const now=new Date();
  const days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const months=["January","February","March","April","May","June","July","August","September","October","November","December"];
  const dateStr=`${days[now.getDay()]} · ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
  const hour=now.getHours();
  const greeting=hour<12?"Good morning":hour<17?"Good afternoon":"Good evening";
  const hasPinned=pinnedWidgets.length>0;

  return<div style={{flex:1,overflowY:"auto",background:T.bg,padding:"24px 32px 40px"}}>
    {/* Header */}
    <div style={{maxWidth:960,margin:"0 auto",width:"100%"}}>
    <div style={{animation:"fadeIn 0.5s ease",marginBottom:24}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          <div className="lbl" style={{marginBottom:3}}>{dateStr}</div>
          <h1 style={{fontFamily:T.serif,fontSize:"clamp(20px,3vw,26px)",fontWeight:400,letterSpacing:"-0.03em",lineHeight:1.2}}>{greeting}, Sarah</h1>
        </div>
      </div>
    </div>

    {/* Dashboard toolbar */}
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
      <div className="lbl">{IC.pin(T.textTertiary)} Dashboard{hasPinned&&<span style={{marginLeft:6,fontWeight:400}}>· {pinnedWidgets.length} widget{pinnedWidgets.length!==1?"s":""}</span>}</div>
      <div style={{position:"relative"}}>
        <div onClick={()=>setPickerOpen(!pickerOpen)} style={{display:"flex",alignItems:"center",gap:5,padding:"6px 14px",borderRadius:99,fontSize:11.5,fontFamily:T.sans,fontWeight:500,cursor:"pointer",border:`1px solid ${T.border}`,background:T.surface,color:T.textSecondary,transition:"all 0.15s",boxShadow:"0 1px 2px rgba(0,0,0,0.03)"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=T.accentBorder;e.currentTarget.style.background=T.accentSoft;e.currentTarget.style.color=T.text;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.background=T.surface;e.currentTarget.style.color=T.textSecondary;}}>
          {IC.plus(T.textSecondary,13)}
          <span>Add</span>
        </div>
        <WidgetPicker open={pickerOpen} onClose={()=>setPickerOpen(false)} pinnedWidgets={pinnedWidgets} onAdd={pinWidget}/>
      </div>
    </div>

    {/* Widget grid */}
    {hasPinned?<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))",gap:14}}>
      {pinnedWidgets.map((type,idx)=><div key={type} style={{animation:`fadeIn 0.4s ease ${idx*0.08}s both`}}>
        <ChatWidget widget={{type}} mode="pinned" isPinned={true} onPin={pinWidget} onUnpin={unpinWidget} industry={industry} installedApps={installedApps} onNavigate={onNavigate}/>
      </div>)}
    </div>:
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:320,animation:"fadeIn 0.5s ease"}}>
      <div style={{width:56,height:56,borderRadius:16,background:T.surfaceMuted,border:`1.5px dashed ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16}}>{IC.pin(T.textTertiary,20)}</div>
      <div style={{fontSize:15,fontWeight:500,color:T.textSecondary,marginBottom:6,letterSpacing:"-0.01em"}}>Your dashboard is empty</div>
      <div style={{fontSize:13,color:T.textTertiary,textAlign:"center",maxWidth:340,lineHeight:1.6,marginBottom:18}}>Add widgets to build your personal dashboard, or pin them from the Chat view.</div>
      <div onClick={()=>setPickerOpen(true)} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"8px 18px",borderRadius:99,fontSize:12.5,fontWeight:500,cursor:"pointer",border:`1px solid ${T.border}`,background:T.surface,color:T.textSecondary,transition:"all 0.15s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=T.accentBorder;e.currentTarget.style.background=T.accentSoft;e.currentTarget.style.color=T.text;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.background=T.surface;e.currentTarget.style.color=T.textSecondary;}}>
        {IC.plus(T.textSecondary,14)}
        <span>Add your first widget</span>
      </div>
      <div style={{position:"relative",marginTop:-1}}>
        <WidgetPicker open={pickerOpen} onClose={()=>setPickerOpen(false)} pinnedWidgets={pinnedWidgets} onAdd={pinWidget}/>
      </div>
    </div>}
    </div>
  </div>;
}

/* ═══ HOME TAB BAR ═══ */
function HomeTabBar({homeTab,setHomeTab}){
  const tabs=[
    {id:"chat",label:"Chat",icon:(c)=><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>},
    {id:"dashboard",label:"Dashboard",icon:(c)=><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>},
  ];
  return<div style={{display:"flex",alignItems:"center",padding:"0 32px",background:"rgba(255,255,255,0.92)",backdropFilter:"blur(8px)",borderBottom:`1px solid ${T.borderSubtle}`,flexShrink:0,gap:0}}>
    {tabs.map(tab=>{const a=homeTab===tab.id;return<div key={tab.id} onClick={()=>setHomeTab(tab.id)} style={{display:"flex",alignItems:"center",gap:7,padding:"12px 18px 11px",cursor:"pointer",position:"relative",color:a?T.text:T.textTertiary,fontFamily:T.sans,fontSize:13,fontWeight:a?600:400,letterSpacing:"-0.01em",transition:"color 0.2s"}} onMouseEnter={e=>{if(!a)e.currentTarget.style.color=T.textSecondary;}} onMouseLeave={e=>{if(!a)e.currentTarget.style.color=T.textTertiary;}}>
      <span style={{display:"flex",alignItems:"center",transition:"color 0.2s"}}>{tab.icon(a?T.accent:T.textTertiary)}</span>
      <span>{tab.label}</span>
      {a&&<div style={{position:"absolute",bottom:-1,left:16,right:16,height:2.5,borderRadius:"2px 2px 0 0",background:T.accent}}/>}
    </div>;})}
  </div>;
}

/* ═══ HOME CONTENT (Router) ═══ */
function HomeContent({homeTab,setHomeTab,chatMessages,setChatMessages,pinnedWidgets,pinWidget,unpinWidget,overallPct,setConnectOpen,industry,fromChatOnboarding,focusGoalName,selectedGoals,addedWorkflows,setAddedWorkflows,onNavigate,installedApps}){
  return<div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 56px)",overflow:"hidden"}}>
    <HomeTabBar homeTab={homeTab} setHomeTab={setHomeTab}/>
    {homeTab==="dashboard"
      ?<DashboardView pinnedWidgets={pinnedWidgets} pinWidget={pinWidget} unpinWidget={unpinWidget} industry={industry} installedApps={installedApps} onNavigate={onNavigate}/>
      :<ChatView chatMessages={chatMessages} setChatMessages={setChatMessages} pinnedWidgets={pinnedWidgets} pinWidget={pinWidget} unpinWidget={unpinWidget} industry={industry} fromChatOnboarding={fromChatOnboarding} focusGoalName={focusGoalName} selectedGoals={selectedGoals} addedWorkflows={addedWorkflows} setAddedWorkflows={setAddedWorkflows} onNavigate={onNavigate}/>
    }
  </div>;
}
