/* ═══ EDIT MODE — NODES LIBRARY ═══ */
function NodesLibrary({onToggle}){
  const[sections,setSections]=useState({flow:false,math:false,api:false});
  return<div style={{width:260,flexShrink:0,background:T.surface,borderRight:`1px solid ${T.border}`,display:"flex",flexDirection:"column",overflow:"hidden",animation:"fadeIn 0.3s ease"}}>
    <div style={{padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${T.borderSubtle}`}}>
      <span style={{fontFamily:T.serif,fontSize:15,fontWeight:500}}>Nodes Library</span>
      <div onClick={onToggle} style={{width:28,height:28,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",background:T.surfaceMuted}} onMouseEnter={e=>e.currentTarget.style.background=T.border} onMouseLeave={e=>e.currentTarget.style.background=T.surfaceMuted}>{IC.panel(T.textSecondary)}</div>
    </div>
    <div style={{flex:1,overflowY:"auto",padding:"10px 12px"}}>
      {NODE_TYPES.map((nt,i)=><div key={i} className="node-lib-item">
        <div style={{width:36,height:36,borderRadius:9,background:`${nt.color}12`,border:`1px solid ${nt.color}25`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{nt.icon(nt.color)}</div>
        <div><div style={{fontSize:12.5,fontWeight:600,letterSpacing:"-0.01em"}}>{nt.label}</div><div style={{fontSize:10.5,color:T.textSecondary,marginTop:1}}>{nt.desc}</div></div>
      </div>)}
      <div style={{marginTop:12}}>
        {[{key:"flow",label:"Playable flow nodes"},{key:"math",label:"Playable math nodes"},{key:"api",label:"Playable API nodes"}].map(s=><div key={s.key} onClick={()=>setSections(p=>({...p,[s.key]:!p[s.key]}))} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 8px",cursor:"pointer",borderTop:`1px solid ${T.borderSubtle}`}}>
          <span style={{fontSize:12,fontWeight:500,color:T.textSecondary}}>{s.label}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.textTertiary} strokeWidth="2" strokeLinecap="round" style={{transform:sections[s.key]?"rotate(180deg)":"rotate(0)",transition:"transform 0.2s"}}><path d="M6 9l6 6 6-6"/></svg>
        </div>)}
      </div>
    </div>
  </div>;
}

/* ═══ EDIT MODE — WORKFLOW CANVAS ═══ */
function WorkflowCanvas({nodes,edges,selectedId,onSelect}){
  const NW=200,NH=68;
  return<div style={{flex:1,position:"relative",overflow:"auto",background:T.bg,backgroundImage:`radial-gradient(circle, ${T.border} 1px, transparent 1px)`,backgroundSize:"24px 24px"}}>
    <svg style={{position:"absolute",top:0,left:0,width:800,height:1050,pointerEvents:"none"}}>
      {edges.map((e,i)=>{
        const fn=nodes.find(n=>n.id===e.from),tn=nodes.find(n=>n.id===e.to);
        if(!fn||!tn)return null;
        const x1=fn.x+NW/2,y1=fn.y+NH+4,x2=tn.x+NW/2,y2=tn.y-4;
        const my=(y1+y2)/2;
        const d=`M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}`;
        return<g key={i}>
          <path d={d} fill="none" stroke={T.border} strokeWidth="1.5"/>
          <circle cx={x1} cy={y1} r="3" fill={T.border}/>
          <circle cx={x2} cy={y2} r="3" fill={T.border}/>
          {e.label&&<><rect x={(x1+x2)/2-30} y={my-10} width={60} height={20} rx={4} fill={T.surface} stroke={T.border} strokeWidth="1"/><text x={(x1+x2)/2} y={my+3} textAnchor="middle" style={{fontSize:9.5,fontFamily:T.mono,fill:T.textSecondary}}>{e.label}</text></>}
        </g>;
      })}
    </svg>
    {nodes.map(node=>{
      const nt=NODE_TYPES.find(t=>t.type===node.type);
      const sel=node.id===selectedId;
      return<div key={node.id} onClick={()=>onSelect(node.id)} style={{
        position:"absolute",left:node.x,top:node.y,width:NW,
        background:T.surface,border:`2px solid ${sel?T.highlight:T.border}`,borderRadius:T.r,
        padding:"12px 14px",cursor:"pointer",
        boxShadow:sel?`0 0 0 3px ${T.highlightSoft}, 0 4px 16px rgba(0,0,0,0.08)`:"0 2px 8px rgba(0,0,0,0.04)",
        transition:"border-color 0.15s, box-shadow 0.15s",display:"flex",alignItems:"center",gap:10,
      }}>
        <div style={{width:32,height:32,borderRadius:8,background:nt?`${nt.color}12`:T.surfaceMuted,border:`1px solid ${nt?`${nt.color}25`:T.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{nt&&nt.icon(nt.color)}</div>
        <div style={{minWidth:0}}><div style={{fontSize:12.5,fontWeight:600,letterSpacing:"-0.01em",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{node.title}</div><div style={{fontSize:10.5,color:T.textTertiary,marginTop:1}}>{node.sub}</div></div>
      </div>;
    })}
  </div>;
}

/* ═══ EDIT MODE — PROPERTIES PANEL ═══ */
function PropertiesPanel({node,onToggle}){
  const[tab,setTab]=useState("properties");
  const nt=node?NODE_TYPES.find(t=>t.type===node.type):null;
  return<div style={{width:280,flexShrink:0,background:T.surface,borderLeft:`1px solid ${T.border}`,display:"flex",flexDirection:"column",overflow:"hidden",animation:"fadeIn 0.3s ease"}}>
    <div style={{padding:"14px 16px",borderBottom:`1px solid ${T.borderSubtle}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <div><div style={{fontFamily:T.serif,fontSize:15,fontWeight:500}}>Properties</div>{node&&<div style={{fontSize:11,color:T.textSecondary,marginTop:1}}>{node.title}</div>}</div>
      <div onClick={onToggle} style={{width:24,height:24,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:T.textTertiary}}>⋮</div>
    </div>
    {/* Tabs */}
    <div style={{display:"flex",padding:"8px 16px 0",gap:0,borderBottom:`1px solid ${T.borderSubtle}`}}>
      {["Properties","Widgets"].map((t,i)=>{const active=tab===(i===0?"properties":"widgets");return<div key={i} onClick={()=>setTab(i===0?"properties":"widgets")} style={{padding:"8px 16px",fontSize:12,fontWeight:active?600:400,color:active?T.highlight:T.textSecondary,borderBottom:active?`2px solid ${T.highlight}`:"2px solid transparent",cursor:"pointer",transition:"all 0.15s"}}>{t}</div>;})}
    </div>
    <div style={{flex:1,overflowY:"auto",padding:"16px"}}>
      {!node?<div style={{textAlign:"center",padding:"40px 0",color:T.textTertiary,fontSize:12}}>Select a node to view properties</div>
      :<div style={{display:"flex",flexDirection:"column",gap:16}}>
        {nt&&<div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",borderRadius:T.rSm,background:`${nt.color}08`,border:`1px solid ${nt.color}18`}}>
          <div style={{width:28,height:28,borderRadius:7,background:`${nt.color}15`,display:"flex",alignItems:"center",justifyContent:"center"}}>{nt.icon(nt.color)}</div>
          <div><div style={{fontSize:11,fontWeight:600,color:nt.color}}>{nt.label}</div><div style={{fontSize:10,color:T.textTertiary}}>{nt.desc}</div></div>
        </div>}
        <div>
          <label style={{fontSize:11,fontWeight:600,color:T.textSecondary,display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.04em",fontFamily:T.mono}}>Name</label>
          <input readOnly value={node.title} style={{width:"100%",padding:"8px 12px",borderRadius:T.rSm,border:`1px solid ${T.border}`,fontFamily:T.sans,fontSize:13,color:T.text,outline:"none",background:T.surfaceHover}}/>
        </div>
        <div>
          <label style={{fontSize:11,fontWeight:600,color:T.textSecondary,display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.04em",fontFamily:T.mono}}>Select Action Type</label>
          <div style={{width:"100%",padding:"8px 12px",borderRadius:T.rSm,border:`1px solid ${T.border}`,fontFamily:T.sans,fontSize:13,color:T.textTertiary,background:T.surfaceHover,display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}>
            <span>Select Action Type</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.textTertiary} strokeWidth="2" strokeLinecap="round"><path d="M6 9l6 6 6-6"/></svg>
          </div>
        </div>
        {node.type==="conditional"&&<div>
          <label style={{fontSize:11,fontWeight:600,color:T.textSecondary,display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.04em",fontFamily:T.mono}}>Condition</label>
          <input readOnly value="source == 'referral'" style={{width:"100%",padding:"8px 12px",borderRadius:T.rSm,border:`1px solid ${T.border}`,fontFamily:T.mono,fontSize:12,color:T.text,outline:"none",background:T.surfaceHover}}/>
        </div>}
      </div>}
    </div>
  </div>;
}

/* ═══ EDIT MODE — ORCHESTRATOR ═══ */
function EditMode(){
  const[nodes]=useState(SAMPLE_NODES);
  const[edges]=useState(SAMPLE_EDGES);
  const[selectedId,setSelectedId]=useState("n4");
  const[libOpen,setLibOpen]=useState(true);
  const[propsOpen,setPropsOpen]=useState(true);
  const selectedNode=nodes.find(n=>n.id===selectedId)||null;

  return<div style={{flex:1,display:"flex",overflow:"hidden"}}>
    {libOpen&&<NodesLibrary onToggle={()=>setLibOpen(false)}/>}
    {!libOpen&&<div style={{position:"absolute",left:8,top:68,zIndex:10,padding:"6px 10px",borderRadius:T.rSm,background:T.surface,border:`1px solid ${T.border}`,boxShadow:"0 2px 8px rgba(0,0,0,0.06)",cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontSize:11,fontWeight:500,color:T.textSecondary}} onClick={()=>setLibOpen(true)}>{IC.panel(T.textSecondary)} Nodes Library</div>}
    <WorkflowCanvas nodes={nodes} edges={edges} selectedId={selectedId} onSelect={setSelectedId}/>
    {propsOpen&&<PropertiesPanel node={selectedNode} onToggle={()=>setPropsOpen(false)}/>}
    {!propsOpen&&<div style={{position:"absolute",right:8,top:68,zIndex:10,padding:"6px 10px",borderRadius:T.rSm,background:T.surface,border:`1px solid ${T.border}`,boxShadow:"0 2px 8px rgba(0,0,0,0.06)",cursor:"pointer",fontSize:11,fontWeight:500,color:T.textSecondary}} onClick={()=>setPropsOpen(true)}>Properties</div>}
  </div>;
}
