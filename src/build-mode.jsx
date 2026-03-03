/* ═══ BUILD MODE ═══ */
function BuildMode(){
  const[msgs,setMsgs]=useState([]);
  const[input,setInput]=useState("");
  const[started,setStarted]=useState(false);
  const[exampleIdx,setExampleIdx]=useState(0);
  const msgsEnd=useRef(null);

  const EXAMPLES=[
    {label:"Daily Audit",title:"Quality Inspection",pct:40,doneCount:4,items:["Check temperature logs","Inspect equipment seals","Verify cleaning records","Review staff hygiene","Check storage conditions","Inspect packaging integrity"]},
    {label:"Safety Walk",title:"Floor Inspection",pct:60,doneCount:3,items:["Check fire exits clear","PPE compliance check","Verify spill stations","Inspect walkway markings","Emergency shower test","First aid kit inventory"]},
    {label:"Shift Change",title:"Handover Report",pct:30,doneCount:2,items:["Production summary","Equipment status update","Open issues review","Material inventory check","Safety incidents log","Next shift priorities"]},
    {label:"Training",title:"New Hire Onboarding",pct:50,doneCount:3,items:["Safety orientation","Badge activation","System login setup","Floor tour complete","Emergency procedures","Buddy assignment"]},
  ];

  /* Cycle examples only when idle */
  useEffect(()=>{
    if(started)return;
    const t=setInterval(()=>setExampleIdx(i=>(i+1)%EXAMPLES.length),4000);
    return()=>clearInterval(t);
  },[started]);

  const doSend=()=>{
    if(!input.trim())return;
    const q=input;setInput("");
    setMsgs(prev=>[...prev,{role:"user",text:q},{role:"ai",text:`Great — I'll build a "${q}" workflow for you. I'm setting up the trigger, adding inspection steps, and configuring notifications. You can see the preview updating on the right. Want me to add any conditional logic or approval steps?`}]);
    if(!started)setStarted(true);
  };
  useEffect(()=>{if(msgsEnd.current)msgsEnd.current.scrollIntoView({behavior:"smooth"});},[msgs]);

  /* ── Phone screen content renderer ── */
  const renderPhoneContent=(ex)=><>
    <div style={{position:"absolute",top:10,left:"50%",transform:"translateX(-50%)",width:90,height:24,borderRadius:20,background:"#c5c5c8",zIndex:2}}/>
    <div style={{padding:"44px 18px 12px",borderBottom:"1px solid #f0f0f0"}}>
      <div style={{fontSize:10,color:"#999",fontFamily:T.mono,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>{ex.label}</div>
      <div style={{fontSize:17,fontWeight:600,fontFamily:T.serif,letterSpacing:"-0.02em"}}>{ex.title}</div>
      <div style={{marginTop:8}}><Bar pct={ex.pct} color={T.green} height={4}/></div>
      <div style={{fontSize:10,color:T.textTertiary,marginTop:4}}>{ex.doneCount} of {ex.items.length} items complete</div>
    </div>
    <div style={{padding:"8px 14px",flex:1,overflowY:"auto"}}>
      {ex.items.map((item,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 6px",borderBottom:"1px solid #f5f5f5"}}>
        <div style={{width:20,height:20,borderRadius:6,flexShrink:0,background:i<ex.doneCount?T.green:"transparent",border:i<ex.doneCount?"none":"1.5px solid #ddd",display:"flex",alignItems:"center",justifyContent:"center"}}>{i<ex.doneCount&&IC.check("#fff",10)}</div>
        <span style={{fontSize:13,color:i<ex.doneCount?"#999":T.text,textDecoration:"none"}}>{item}</span>
      </div>)}
    </div>
    <div style={{padding:"8px 0 6px",display:"flex",justifyContent:"center"}}><div style={{width:120,height:4,borderRadius:2,background:"#d1d1d6"}}/></div>
  </>;

  /* ── Phone shell ── */
  const renderPhoneShell=(content)=><div style={{position:"relative"}}>
    <div style={{position:"absolute",right:-2,top:120,width:3,height:48,borderRadius:"0 2px 2px 0",background:"#c5c5c8"}}/>
    <div style={{position:"absolute",left:-2,top:100,width:3,height:28,borderRadius:"2px 0 0 2px",background:"#c5c5c8"}}/>
    <div style={{position:"absolute",left:-2,top:136,width:3,height:28,borderRadius:"2px 0 0 2px",background:"#c5c5c8"}}/>
    <div style={{width:310,borderRadius:44,background:"#e8e8ed",padding:"6px",boxShadow:"0 24px 64px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06), inset 0 0 0 1px rgba(0,0,0,0.08)"}}>
      <div style={{borderRadius:38,background:"#fff",height:620,overflow:"hidden",display:"flex",flexDirection:"column",position:"relative"}}>
        {content}
      </div>
    </div>
  </div>;

  const EASE="cubic-bezier(0.4,0,0.2,1)";
  const DUR="0.7s";

  /* ── Single DOM tree: chat panel + right area with phone + start overlay ── */
  return <div style={{flex:1,display:"flex",overflow:"hidden"}}>
    {/* Chat panel — always in DOM, slides in via marginLeft */}
    <div style={{width:380,flexShrink:0,display:"flex",flexDirection:"column",background:T.surface,borderRight:`1px solid ${T.border}`,marginLeft:started?0:-380,transition:`margin-left ${DUR} ${EASE}`}}>
      <div style={{padding:"14px 18px",borderBottom:`1px solid ${T.borderSubtle}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:28,height:28,borderRadius:9,background:T.accent,display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.sparkle("#fff",14)}</div><span style={{fontFamily:T.serif,fontSize:15,fontWeight:500}}>AI Builder</span></div>
        <div style={{display:"flex",alignItems:"center",gap:5,fontSize:10,fontFamily:T.mono,color:T.textTertiary}}><div style={{width:6,height:6,borderRadius:"50%",background:T.green,animation:"pulse 2.5s infinite"}}/>Online</div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"16px 18px",display:"flex",flexDirection:"column",gap:10}}>
        {msgs.map((m,i)=>m.role==="ai"
          ?<div key={i} style={{background:T.surfaceMuted,borderRadius:"16px 16px 16px 4px",padding:"14px 18px",fontSize:13.5,lineHeight:1.6,color:T.textSecondary,maxWidth:"92%",animation:"fadeIn 0.3s ease"}}>{m.text}</div>
          :<div key={i} style={{background:T.accent,borderRadius:"16px 16px 4px 16px",padding:"12px 16px",fontSize:13.5,lineHeight:1.5,color:"#fff",maxWidth:"85%",alignSelf:"flex-end",animation:"fadeIn 0.3s ease"}}>{m.text}</div>
        )}
        <div ref={msgsEnd}/>
      </div>
      <div style={{padding:"12px 18px",borderTop:`1px solid ${T.borderSubtle}`}}>
        <div className="chat-wrap">
          <input className="chat-in" type="text" placeholder="Describe changes..." value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")doSend();}}/>
          <div onClick={doSend} style={{width:32,height:32,borderRadius:9,flexShrink:0,background:input?T.accent:T.border,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"background 0.2s"}}>{IC.send(input?"#fff":T.textTertiary)}</div>
        </div>
      </div>
    </div>

    {/* Right area — phone centered + start content overlay */}
    <div style={{flex:1,position:"relative",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",background:T.bg}}>
      {/* Dot grid — fades in when started */}
      <div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(circle, ${T.border} 1px, transparent 1px)`,backgroundSize:"24px 24px",opacity:started?1:0,transition:`opacity 0.7s ${EASE}`,pointerEvents:"none"}}/>
      {/* Start content — positioned at top, fades out when started */}
      <div style={{position:"absolute",top:0,left:0,right:0,display:"flex",flexDirection:"column",alignItems:"center",paddingTop:"12vh",paddingBottom:60,background:`linear-gradient(${T.bg} 85%, transparent)`,opacity:started?0:1,pointerEvents:started?"none":"auto",transition:`opacity 0.5s ${EASE}`,zIndex:5}}>
        <div style={{maxWidth:540,width:"100%",padding:"0 24px"}}>
          <div style={{textAlign:"center",marginBottom:28}}>
            <div style={{width:48,height:48,borderRadius:14,background:T.accent,display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:14}}>{IC.sparkle("#fff",22)}</div>
            <h1 style={{fontFamily:T.serif,fontSize:28,fontWeight:400,letterSpacing:"-0.03em",lineHeight:1.2,marginBottom:8}}>What do you want to build today, Sarah?</h1>
            <p style={{fontSize:14,color:T.textSecondary,lineHeight:1.6}}>Describe a workflow, form, checklist, or frontline experience</p>
          </div>
          <div className="chat-wrap" style={{marginBottom:14}}>
            <input className="chat-in" type="text" placeholder="e.g. Quality inspection checklist for daily audits..." value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")doSend();}} style={{padding:"12px 0"}}/>
            <div onClick={doSend} style={{width:36,height:36,borderRadius:10,flexShrink:0,background:input?T.accent:T.border,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"background 0.2s"}}>{IC.send(input?"#fff":T.textTertiary)}</div>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center"}}>
            {["Inspection checklist","Shift handover form","Safety audit","Training module"].map((s,i)=><div key={i} className="action-chip" onClick={()=>{setInput(s);}}>{s}</div>)}
          </div>
        </div>
      </div>

      {/* Phone — always in DOM, transitions between peek and centered */}
      <div style={{transition:`transform ${DUR} ${EASE}`,transform:started?"translateY(0)":"translateY(44vh)"}}>
        {renderPhoneShell(
          EXAMPLES.map((ex,idx)=><div key={idx} style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",opacity:idx===exampleIdx?1:0,transition:"opacity 0.6s ease"}}>
            {renderPhoneContent(ex)}
          </div>)
        )}
      </div>

      {/* Bottom gradient — fades out when started */}
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:80,background:`linear-gradient(transparent, ${T.bg})`,zIndex:3,pointerEvents:"none",opacity:started?0:1,transition:`opacity 0.4s ${EASE}`}}/>
    </div>
  </div>;
}
