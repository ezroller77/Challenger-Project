/* ═══ TASKS PAGE ═══ */

const MOCK_TASKS=[
  {id:1,title:"Complete monthly safety inspection — Plant Alpha",status:"overdue",priority:"High",assignee:"Sarah Chen",due:"28 Feb 2026",category:"Inspections"},
  {id:2,title:"Review corrective actions from last audit",status:"in-progress",priority:"High",assignee:"Marcus Johnson",due:"5 Mar 2026",category:"Actions"},
  {id:3,title:"Schedule forklift operator refresher training",status:"todo",priority:"Medium",assignee:"Ana Rodriguez",due:"10 Mar 2026",category:"Training"},
  {id:4,title:"Update emergency evacuation plan signage",status:"todo",priority:"Medium",assignee:"Priya Patel",due:"12 Mar 2026",category:"Safety"},
  {id:5,title:"Calibrate pressure gauges — Line 3",status:"in-progress",priority:"Medium",assignee:"James Wilson",due:"7 Mar 2026",category:"Maintenance"},
  {id:6,title:"Submit environmental compliance report Q1",status:"todo",priority:"High",assignee:"Sarah Chen",due:"15 Mar 2026",category:"Compliance"},
  {id:7,title:"Onboard new quality inspector — Plant Beta",status:"done",priority:"Low",assignee:"Lisa Thompson",due:"1 Mar 2026",category:"People"},
  {id:8,title:"Investigate near-miss incident #NM-2026-041",status:"in-progress",priority:"High",assignee:"Priya Patel",due:"4 Mar 2026",category:"Incidents"},
  {id:9,title:"Restock PPE inventory — warehouse",status:"done",priority:"Low",assignee:"David Kim",due:"26 Feb 2026",category:"Inventory"},
  {id:10,title:"Review supplier quality scorecard — Q4",status:"todo",priority:"Medium",assignee:"Carlos Mendez",due:"14 Mar 2026",category:"Quality"},
];

const TASK_STATUS_META={
  "overdue":{label:"Overdue",color:T.rose,bg:T.roseSoft,border:T.roseBorder},
  "in-progress":{label:"In Progress",color:T.accent,bg:T.accentSoft,border:T.accentBorder},
  "todo":{label:"To Do",color:T.textSecondary,bg:T.surfaceMuted,border:T.border},
  "done":{label:"Done",color:T.green,bg:T.greenSoft,border:T.greenBorder},
};

function TasksPage(){
  const[filter,setFilter]=useState("all");
  const[selectedTask,setSelectedTask]=useState(null);

  const counts=useMemo(()=>{
    const c={all:MOCK_TASKS.length,overdue:0,"in-progress":0,todo:0,done:0};
    MOCK_TASKS.forEach(t=>c[t.status]=(c[t.status]||0)+1);
    return c;
  },[]);

  const filtered=useMemo(()=>
    filter==="all"?MOCK_TASKS:MOCK_TASKS.filter(t=>t.status===filter)
  ,[filter]);

  const filters=[
    {id:"all",label:"All"},
    {id:"overdue",label:"Overdue"},
    {id:"in-progress",label:"In Progress"},
    {id:"todo",label:"To Do"},
    {id:"done",label:"Done"},
  ];

  return<div style={{flex:1,overflowY:"auto",background:T.bg}}>
    <div style={{maxWidth:860,margin:"0 auto",padding:"28px 24px 64px"}}>

      {/* Header */}
      <div style={{marginBottom:24}}>
        <h1 style={{fontFamily:T.serif,fontSize:24,fontWeight:500,letterSpacing:"-0.03em",color:T.text,margin:0}}>Tasks</h1>
        <p style={{fontSize:13,color:T.textSecondary,marginTop:4,letterSpacing:"-0.01em"}}>Track and manage operational tasks across your workspace</p>
      </div>

      {/* Summary chips */}
      <div style={{display:"flex",gap:8,marginBottom:24,flexWrap:"wrap"}}>
        {filters.map(f=>{
          const active=filter===f.id;
          const meta=TASK_STATUS_META[f.id];
          const count=counts[f.id]||0;
          return<div key={f.id} onClick={()=>setFilter(f.id)} style={{
            padding:"6px 14px",borderRadius:99,fontSize:12,fontWeight:active?600:400,
            background:active?(meta?meta.bg:T.accentSoft):T.surface,
            border:`1px solid ${active?(meta?meta.border:T.accentBorder):T.border}`,
            color:active?(meta?meta.color:T.accent):T.textSecondary,
            cursor:"pointer",transition:"all 0.2s",display:"flex",alignItems:"center",gap:6,
          }}>
            <span>{f.label}</span>
            <span style={{fontSize:10,fontFamily:T.mono,opacity:0.7}}>{count}</span>
          </div>;
        })}
      </div>

      {/* Task list */}
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {filtered.map((task,idx)=>{
          const meta=TASK_STATUS_META[task.status];
          const isSelected=selectedTask===task.id;
          return<div key={task.id} onClick={()=>setSelectedTask(isSelected?null:task.id)} style={{
            background:T.surface,border:`1px solid ${isSelected?T.accentBorder:T.border}`,
            borderRadius:T.r,padding:"14px 18px",cursor:"pointer",
            transition:"all 0.2s",boxShadow:isSelected?`0 0 0 2px ${T.accentSoft}`:T.shadow,
            animation:`fadeIn 0.3s ease ${idx*0.03}s both`,
          }} onMouseEnter={e=>{if(!isSelected)e.currentTarget.style.borderColor=T.borderSubtle;e.currentTarget.style.boxShadow=T.shadowMd;}} onMouseLeave={e=>{if(!isSelected)e.currentTarget.style.borderColor=T.border;e.currentTarget.style.boxShadow=isSelected?`0 0 0 2px ${T.accentSoft}`:T.shadow;}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              {/* Checkbox */}
              <div style={{width:20,height:20,borderRadius:6,border:`1.5px solid ${task.status==="done"?T.green:T.border}`,background:task.status==="done"?T.greenSoft:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                {task.status==="done"&&IC.check(T.green,12)}
              </div>
              {/* Content */}
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13.5,fontWeight:500,color:task.status==="done"?T.textTertiary:T.text,textDecoration:task.status==="done"?"line-through":"none",letterSpacing:"-0.01em"}}>{task.title}</div>
                {isSelected&&<div style={{marginTop:10,display:"flex",flexDirection:"column",gap:8,animation:"fadeIn 0.2s ease"}}>
                  <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
                    {[["Assignee",task.assignee],["Due",task.due],["Category",task.category],["Priority",task.priority]].map(([k,v])=>
                      <div key={k}>
                        <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:"0.05em",fontFamily:T.mono,color:T.textTertiary,marginBottom:2}}>{k}</div>
                        <div style={{fontSize:12,color:T.textSecondary,fontWeight:500}}>{v}</div>
                      </div>
                    )}
                  </div>
                </div>}
              </div>
              {/* Right side */}
              <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                {task.priority==="High"&&<div className="chip" style={{background:T.roseSoft,color:T.rose}}>High</div>}
                <div className="chip" style={{background:meta.bg,color:meta.color,border:`1px solid ${meta.border}`}}>{meta.label}</div>
              </div>
            </div>
          </div>;
        })}
      </div>

      {filtered.length===0&&<div style={{textAlign:"center",padding:"60px 0"}}>
        <div style={{fontSize:13,color:T.textTertiary}}>No tasks match this filter</div>
      </div>}
    </div>
  </div>;
}
