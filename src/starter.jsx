/* ═══ STARTER SCREEN (Journey Selector) ═══ */
function StarterScreen({onSelectJourney}){
  const chatIcon=(c,s=20)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
  const journeys=[
    {id:"first-setup",title:"First-time Setup",desc:"Walk through the onboarding flow: pick an industry, role, and goals.",icon:IC.sparkle,color:T.highlight,colorSoft:T.highlightSoft,enabled:true},
    {id:"chat-setup",title:"Chat Setup",desc:"Set up your workspace through a conversation with the AI assistant.",icon:chatIcon,color:T.accent,colorSoft:T.accentSoft,enabled:true},
    {id:"first-day",title:"Your First Day",desc:"See what the workspace looks like on day one. (Coming soon)",icon:IC.play,color:T.green,colorSoft:T.greenSoft,enabled:false},
    {id:"100-day",title:"100 Days Later",desc:"See a mature QSR workspace after 100 days of active use.",icon:IC.building,color:T.amber,colorSoft:T.amberSoft,enabled:true},
  ];

  return<div style={{minHeight:"100vh",background:T.bg,fontFamily:T.sans,color:T.text,display:"flex",alignItems:"center",justifyContent:"center",padding:"32px 16px"}}>
    <div style={{maxWidth:760,width:"100%",textAlign:"center"}}>
      {/* Logo */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:40}}>
        <svg width="36" height="36" viewBox="0 0 100 100" fill="none"><rect width="100" height="100" rx="22" fill={T.accent}/><path d="M15 50c10-20 22-20 32 0s22 20 32 0" stroke="#fff" strokeWidth="8" strokeLinecap="round" fill="none"/></svg>
        <span style={{fontFamily:T.serif,fontSize:20,fontWeight:600,letterSpacing:"-0.03em"}}>Flows</span>
      </div>

      {/* Heading */}
      <h1 style={{fontFamily:T.serif,fontSize:"clamp(28px,5vw,40px)",fontWeight:300,letterSpacing:"-0.04em",lineHeight:1.15,marginBottom:10}}>Prototype Navigator</h1>
      <p style={{fontSize:15,color:T.textSecondary,lineHeight:1.6,maxWidth:480,margin:"0 auto 40px"}}>Use these journeys to explore different parts of the prototype. Each path demonstrates a different user experience.</p>

      {/* Journey cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16,textAlign:"left"}}>
        {journeys.map((j,idx)=>{
          const disabled=!j.enabled;
          return<div key={j.id} onClick={()=>{if(j.enabled)onSelectJourney(j.id);}} style={{
            background:T.surface,border:`1.5px solid ${disabled?T.borderSubtle:T.border}`,borderRadius:18,
            padding:"28px 24px",cursor:disabled?"default":"pointer",
            transition:"all 0.25s",position:"relative",overflow:"hidden",
            opacity:disabled?0.55:1,
            boxShadow:disabled?"none":"0 1px 3px rgba(0,0,0,0.04)",
            animation:`fadeIn 0.5s ease ${0.1+idx*0.1}s both`,
          }} onMouseEnter={e=>{if(!disabled){e.currentTarget.style.boxShadow="0 8px 28px rgba(0,0,0,0.07)";e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.borderColor=j.color;}}} onMouseLeave={e=>{if(!disabled){e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,0.04)";e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.borderColor=T.border;}}}>
            {disabled&&<div style={{position:"absolute",top:14,right:14,padding:"3px 9px",borderRadius:99,fontSize:9.5,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.04em",fontFamily:T.mono,background:T.surfaceMuted,color:T.textTertiary}}>Coming soon</div>}
            <div style={{width:48,height:48,borderRadius:14,background:j.colorSoft,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:18,transition:"all 0.25s"}}>
              {j.icon(j.color,20)}
            </div>
            <div style={{fontFamily:T.serif,fontSize:18,fontWeight:500,letterSpacing:"-0.02em",marginBottom:6,lineHeight:1.25}}>{j.title}</div>
            <div style={{fontSize:13,color:T.textSecondary,lineHeight:1.6,marginBottom:18}}>{j.desc}</div>
            {j.enabled&&<div style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:12.5,fontWeight:600,color:j.color}}>
              <span>Get started</span>
              {IC.chevRight(j.color,14)}
            </div>}
          </div>;
        })}
      </div>
    </div>
  </div>;
}
