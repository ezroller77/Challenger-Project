/* ═══ CHAT ONBOARDING (conversational setup) ═══ */

/* Succinct role descriptions */
const PERSONA_DESCS={
  "Plant Manager":"Oversee plant operations, KPIs, and cross-functional teams",
  "VP of Operations":"Strategic oversight of efficiency, cost, and supply chain",
  "Quality Director":"Lead quality programs, compliance, and continuous improvement",
  "Maintenance Manager":"Drive equipment reliability and preventive maintenance",
  "Production Manager":"Manage production targets, scheduling, and line performance",
  "Supply Chain Manager":"Optimize sourcing, inventory, and supplier relationships",
  "Store Manager":"Run day-to-day restaurant operations and guest experience",
  "District Manager":"Oversee multi-unit performance, consistency, and growth",
  "Franchisee":"Maximize unit profitability and protect your investment",
  "VP of Quality Assurance":"Set and enforce food safety and quality standards",
  "Fleet Manager":"Manage vehicle fleet, maintenance, and driver operations",
  "Dispatch Supervisor":"Coordinate dispatching, routes, and delivery execution",
  "VP of Logistics":"Strategic oversight of network and freight operations",
  "Warehouse Manager":"Optimize warehouse throughput, accuracy, and dock operations",
  "Safety Director":"Lead safety programs, compliance, and risk mitigation",
};

function ChatOnboarding({onComplete,setIndustry,setPersona,setSelectedGoals,setFocusGoalName}){
  const[messages,setMessages]=useState([
    {id:"ai-pre-1",role:"ai",parts:[
      {type:"text",content:"Hey! I'm your setup assistant. I'll help get your workspace configured in about a minute."},
      {type:"text",content:"First \u2014 what's your name and company?"},
    ]},
    {id:"u-pre-1",role:"user",text:"Michael, RC Marine Ops"},
    {id:"card-pre",role:"company-card",name:"Michael",company:"RC Marine Ops",website:"rcmarineops.com",logo:"/RCMarineLogo.png"},
    {id:"ai-pre-2",role:"ai",parts:[
      {type:"text",content:"Is that right?"},
    ]},
    {id:"u-pre-2",role:"user",text:"That's correct"},
  ]);
  const[step,setStep]=useState("intro");
  const[typing,setTyping]=useState(false);
  const[chosenIndustry,setChosenIndustry]=useState(null);
  const[chosenPersona,setChosenPersona]=useState(null);
  const[chosenGoals,setChosenGoals]=useState([]);
  const[chosenFocus,setChosenFocus]=useState(null);
  const[chosenInterest,setChosenInterest]=useState(null);
  const endRef=useRef(null);
  const initRef=useRef(false);

  const scrollBottom=()=>{setTimeout(()=>{if(endRef.current)endRef.current.scrollIntoView({behavior:"smooth"});},60);};

  /* ── Add AI message with typing delay ── */
  const addAI=(parts,nextStep,delay=600)=>{
    setTyping(true);scrollBottom();
    setTimeout(()=>{
      setTyping(false);
      setMessages(prev=>[...prev,{id:`ai-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,role:"ai",parts}]);
      if(nextStep)setStep(nextStep);
      scrollBottom();
    },delay);
  };

  /* ── Add user message ── */
  const addUser=(text)=>{
    setMessages(prev=>[...prev,{id:`u-${Date.now()}`,role:"user",text}]);
    scrollBottom();
  };

  /* ── Kick off with industry question (after pre-loaded name/company exchange) ── */
  useEffect(()=>{
    if(initRef.current)return;
    initRef.current=true;
    addAI([
      {type:"text",content:"Great, nice to meet you Michael! Let's get RC Marine Ops set up."},
      {type:"text",content:"What industry are you in?"},
      {type:"options",key:"industry",options:INDUSTRIES.map(ind=>({
        id:ind.id,label:ind.label,sub:ind.desc,color:ind.color,
      }))},
    ],"industry",800);
  },[]);

  /* ── Industry selected ── */
  const handleIndustry=(ind)=>{
    const industry=INDUSTRIES.find(i=>i.id===ind.id);
    setChosenIndustry(industry);
    setIndustry(industry.id);
    addUser(industry.label);

    const personas=getPersonasForIndustry(industry.id);
    setTimeout(()=>{
      addAI([
        {type:"text",content:`Great \u2014 ${industry.label}. I know that space well.`},
        {type:"text",content:"What's your role?"},
        {type:"options",key:"persona",options:personas.map(p=>({
          id:p,label:p,sub:PERSONA_DESCS[p]||"",color:industry.color,
        }))},
      ],"persona",500);
    },300);
  };

  /* ── Persona selected ── */
  const handlePersona=(opt)=>{
    setChosenPersona(opt.id);
    setPersona(opt.id);
    addUser(opt.label);

    const defaults=PERSONA_DEFAULTS[opt.id]||[];
    const goalObjs=defaults.map(id=>OPERATIONAL_GOALS.find(g=>g.id===id)).filter(Boolean);
    const firstBatch=goalObjs.slice(0,3);

    setTimeout(()=>{
      addAI([
        {type:"text",content:"Nice \u2014 here's what I'd recommend based on your role."},
        {type:"text",content:"**Where do you want to focus?** Pick one to start \u2014 you can add more later."},
        {type:"focus-options",key:"focus",goals:firstBatch,color:chosenIndustry.color},
        {type:"action-btns",key:"focus",buttons:[
          {id:"show-more",label:"Show more"},
          {id:"none-of-these",label:"None of these"},
        ]},
      ],"focus",700);
    },300);
  };

  /* ── Focus goal picked ── */
  const handleFocus=(goal)=>{
    setChosenFocus(goal.id);
    if(setFocusGoalName)setFocusGoalName(goal.name);
    const defaults=PERSONA_DEFAULTS[chosenPersona]||[];
    setChosenGoals(defaults);
    setSelectedGoals(defaults);
    addUser(goal.name);

    setTimeout(()=>{
      addAI([
        {type:"text",content:`Great choice. I've set **${goal.name}** as your primary focus and pre-loaded your recommended goals. You can adjust anytime.`},
        {type:"action",key:"confirm",label:"Launch workspace",icon:"sparkle",color:chosenIndustry.color},
      ],"done",600);
    },300);
  };

  /* ── Show more goals ── */
  const handleShowMore=()=>{
    addUser("Show me more");
    const defaults=PERSONA_DEFAULTS[chosenPersona]||[];
    const goalObjs=defaults.map(id=>OPERATIONAL_GOALS.find(g=>g.id===id)).filter(Boolean);
    const moreBatch=goalObjs.slice(3);

    if(!moreBatch.length){handleNoneOfThese();return;}

    setTimeout(()=>{
      addAI([
        {type:"text",content:"Here are more options:"},
        {type:"focus-options",key:"focus2",goals:moreBatch,color:chosenIndustry.color},
        {type:"action-btns",key:"focus2",buttons:[
          {id:"none-of-these",label:"None of these"},
        ]},
      ],"focus2",500);
    },300);
  };

  /* ── None of these ── */
  const handleNoneOfThese=()=>{
    addUser("None of these");
    setTimeout(()=>{
      addAI([
        {type:"text",content:"No problem \u2014 what are you most interested in?"},
        {type:"options",key:"interest",options:[
          {id:"digitise-checks",label:"Digitising checks",sub:"Replace paper forms with smart digital checklists",color:T.highlight},
          {id:"train-staff",label:"Training my staff",sub:"Onboard and upskill your team effectively",color:T.violet},
          {id:"manage-assets",label:"Managing my assets",sub:"Track and maintain equipment and resources",color:T.green},
        ]},
      ],"interest",500);
    },300);
  };

  /* ── Interest picked ── */
  const handleInterest=(opt)=>{
    setChosenInterest(opt.id);
    if(setFocusGoalName)setFocusGoalName(opt.label);
    addUser(opt.label);
    const defaults=PERSONA_DEFAULTS[chosenPersona]||[];
    setChosenGoals(defaults);
    setSelectedGoals(defaults);

    setTimeout(()=>{
      addAI([
        {type:"text",content:`Got it \u2014 **${opt.label.toLowerCase()}** is a great starting point. I've set up your workspace with relevant goals and workflows.`},
        {type:"action",key:"confirm",label:"Launch workspace",icon:"sparkle",color:chosenIndustry.color},
      ],"done",600);
    },300);
  };

  /* ── Launch ── */
  const handleLaunch=()=>{
    addUser("Let's go!");
    setTimeout(()=>onComplete(),600);
  };

  /* ── Render a message part ── */
  const renderPart=(part,idx,msg)=>{
    if(part.type==="text"){
      return<div key={idx} style={{fontSize:13.5,lineHeight:1.6,color:T.textSecondary,letterSpacing:"-0.01em"}}>
        {part.content.split(/(\*\*[^*]+\*\*)/g).map((seg,si)=>{
          if(seg.startsWith("**")&&seg.endsWith("**"))return<strong key={si} style={{color:T.text,fontWeight:600}}>{seg.slice(2,-2)}</strong>;
          return seg;
        })}
      </div>;
    }

    if(part.type==="options"){
      const disabled=step!==part.key;
      return<div key={idx} style={{display:"flex",flexDirection:"column",gap:6,marginTop:6}}>
        {part.options.map((opt,oi)=>{
          const wasChosen=(part.key==="industry"&&chosenIndustry?.id===opt.id)||(part.key==="persona"&&chosenPersona===opt.id)||(part.key==="interest"&&chosenInterest===opt.id);
          return<div key={opt.id} onClick={()=>{
            if(disabled)return;
            if(part.key==="industry")handleIndustry(opt);
            if(part.key==="persona")handlePersona(opt);
            if(part.key==="interest")handleInterest(opt);
          }} style={{
            display:"flex",alignItems:"center",gap:12,
            padding:"12px 16px",borderRadius:12,
            background:wasChosen?`${opt.color}08`:T.surface,
            border:`1.5px solid ${wasChosen?opt.color:T.border}`,
            cursor:disabled?"default":"pointer",
            opacity:disabled&&!wasChosen?0.35:1,
            transition:"all 0.25s cubic-bezier(0.4,0,0.2,1)",
            animation:`fadeIn 0.3s ease ${0.05+oi*0.06}s both`,
          }} onMouseEnter={e=>{if(!disabled){e.currentTarget.style.borderColor=opt.color;e.currentTarget.style.transform="translateX(4px)";e.currentTarget.style.boxShadow=`0 2px 12px ${opt.color}14`;}}}
             onMouseLeave={e=>{if(!disabled&&!wasChosen){e.currentTarget.style.borderColor=T.border;e.currentTarget.style.transform="translateX(0)";e.currentTarget.style.boxShadow="none";}}}>
            {wasChosen&&<div style={{width:22,height:22,borderRadius:6,background:opt.color,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{IC.check("#fff",11)}</div>}
            {!wasChosen&&<div style={{width:22,height:22,borderRadius:6,border:`1.5px solid ${T.border}`,flexShrink:0}}/>}
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13.5,fontWeight:500,letterSpacing:"-0.01em",color:wasChosen?T.text:T.textSecondary}}>{opt.label}</div>
              {opt.sub&&<div style={{fontSize:11.5,color:T.textTertiary,marginTop:1,lineHeight:1.4}}>{opt.sub}</div>}
            </div>
          </div>;
        })}
      </div>;
    }

    if(part.type==="focus-options"){
      const disabled=step!==part.key;
      return<div key={idx} style={{display:"flex",flexDirection:"column",gap:6,marginTop:6}}>
        {part.goals.map((goal,gi)=>{
          const wasChosen=chosenFocus===goal.id;
          const color=part.color;
          return<div key={goal.id} onClick={()=>{
            if(disabled)return;
            handleFocus(goal);
          }} style={{
            display:"flex",alignItems:"center",gap:12,
            padding:"11px 16px",borderRadius:12,
            background:wasChosen?`${color}08`:T.surface,
            border:`1.5px solid ${wasChosen?color:T.border}`,
            cursor:disabled?"default":"pointer",
            opacity:disabled&&!wasChosen?0.35:1,
            transition:"all 0.25s cubic-bezier(0.4,0,0.2,1)",
            animation:`fadeIn 0.3s ease ${0.05+gi*0.06}s both`,
          }} onMouseEnter={e=>{if(!disabled){e.currentTarget.style.borderColor=color;e.currentTarget.style.transform="translateX(4px)";e.currentTarget.style.boxShadow=`0 2px 12px ${color}14`;}}}
             onMouseLeave={e=>{if(!disabled&&!wasChosen){e.currentTarget.style.borderColor=T.border;e.currentTarget.style.transform="translateX(0)";e.currentTarget.style.boxShadow="none";}}}>
            {wasChosen&&<div style={{width:22,height:22,borderRadius:6,background:color,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{IC.check("#fff",11)}</div>}
            {!wasChosen&&<div style={{width:22,height:22,borderRadius:6,border:`1.5px solid ${T.border}`,flexShrink:0}}/>}
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:500,letterSpacing:"-0.01em",color:wasChosen?T.text:T.textSecondary}}>{goal.name}</div>
              <div style={{fontSize:10.5,color:T.textTertiary,marginTop:2,fontFamily:T.mono,letterSpacing:"0.02em"}}>{goal.category}</div>
            </div>
          </div>;
        })}
      </div>;
    }

    if(part.type==="action-btns"){
      const disabled=step!==part.key;
      return<div key={idx} style={{display:"flex",gap:8,marginTop:8,flexWrap:"wrap"}}>
        {part.buttons.map((btn,bi)=><div key={btn.id} onClick={()=>{
          if(disabled)return;
          if(btn.id==="show-more")handleShowMore();
          if(btn.id.startsWith("none-of-these"))handleNoneOfThese();
        }} style={{
          display:"inline-flex",alignItems:"center",gap:6,
          padding:"8px 16px",borderRadius:99,
          border:`1.5px solid ${T.border}`,background:T.surface,
          fontSize:12.5,fontWeight:500,color:T.textSecondary,
          cursor:disabled?"default":"pointer",
          opacity:disabled?0.35:1,
          transition:"all 0.2s",
          animation:`fadeIn 0.3s ease ${0.2+bi*0.08}s both`,
          letterSpacing:"-0.01em",
        }} onMouseEnter={e=>{if(!disabled){e.currentTarget.style.borderColor=T.accent;e.currentTarget.style.color=T.accent;e.currentTarget.style.transform="translateY(-1px)";}}}
           onMouseLeave={e=>{if(!disabled){e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.textSecondary;e.currentTarget.style.transform="translateY(0)";}}}>{btn.label}</div>)}
      </div>;
    }

    if(part.type==="action"){
      return<div key={idx} style={{marginTop:8}}>
        <div onClick={handleLaunch} style={{
          display:"inline-flex",alignItems:"center",gap:8,
          padding:"12px 24px",borderRadius:99,
          background:T.accent,color:"#fff",
          fontSize:13.5,fontWeight:600,letterSpacing:"-0.01em",
          cursor:"pointer",transition:"all 0.2s",
          boxShadow:"0 4px 18px rgba(28,25,23,0.15)",
          animation:"fadeIn 0.4s ease 0.2s both",
        }} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 6px 24px rgba(28,25,23,0.2)";}}
           onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 4px 18px rgba(28,25,23,0.15)";}}>
          {IC.sparkle("#fff",14)}
          <span>{part.label}</span>
        </div>
      </div>;
    }

    return null;
  };

  return<>
    <style>{`
      .cob-shell{min-height:100vh;background:${T.bg};font-family:${T.sans};color:${T.text};display:flex;flex-direction:column}
      .cob-header{padding:0 20px;height:56px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid ${T.borderSubtle};background:rgba(255,255,255,0.92);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);position:sticky;top:0;z-index:50;flex-shrink:0}
      .cob-body{flex:1;overflow-y:auto;padding:28px 16px 120px;display:flex;flex-direction:column;align-items:center;-webkit-overflow-scrolling:touch}
      .cob-thread{max-width:580px;width:100%;display:flex;flex-direction:column;gap:16px}
      .cob-ai{display:flex;gap:12px;align-items:flex-start;animation:fadeInUp 0.4s cubic-bezier(0.4,0,0.2,1)}
      .cob-avatar{width:32px;height:32px;border-radius:10px;background:${T.accent};display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 2px 8px rgba(28,25,23,0.1)}
      .cob-ai-body{flex:1;min-width:0;display:flex;flex-direction:column;gap:8px;background:${T.surface};border:1px solid ${T.border};border-radius:4px 16px 16px 16px;padding:16px 18px;box-shadow:${T.shadow}}
      .cob-user{align-self:flex-end;max-width:85%;animation:fadeInUp 0.35s cubic-bezier(0.4,0,0.2,1)}
      .cob-user-bubble{background:${T.accent};border-radius:16px 16px 4px 16px;padding:12px 18px;font-size:13.5px;line-height:1.55;color:#fff;letter-spacing:-0.01em;box-shadow:0 2px 8px rgba(28,25,23,0.12)}
      .cob-typing{display:flex;gap:12px;align-items:flex-start;animation:fadeIn 0.3s ease}
      .cob-typing-dots{display:flex;gap:4px;padding:16px 18px;background:${T.surface};border:1px solid ${T.border};border-radius:4px 16px 16px 16px;box-shadow:${T.shadow}}
      .cob-dot{width:7px;height:7px;border-radius:50%;background:${T.textTertiary};animation:cobDotBounce 1.2s infinite}
      .cob-dot:nth-child(2){animation-delay:0.15s}
      .cob-dot:nth-child(3){animation-delay:0.3s}
      @keyframes cobDotBounce{0%,60%,100%{transform:translateY(0);opacity:0.4}30%{transform:translateY(-5px);opacity:1}}
      @media(min-width:640px){.cob-body{padding:40px 24px 120px}}
    `}</style>

    <div className="cob-shell">
      {/* Header */}
      <div className="cob-header">
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <svg width="26" height="26" viewBox="0 0 100 100" fill="none"><rect width="100" height="100" rx="22" fill={T.accent}/><path d="M15 50c10-20 22-20 32 0s22 20 32 0" stroke="#fff" strokeWidth="8" strokeLinecap="round" fill="none"/></svg>
          <span style={{fontFamily:T.serif,fontSize:16,fontWeight:600,letterSpacing:"-0.02em"}}>Flows Setup</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:T.green,animation:"subtleBreathe 3s infinite"}}/>
          <span style={{fontSize:10.5,fontFamily:T.mono,color:T.textTertiary}}>AI Online</span>
        </div>
      </div>

      {/* Message thread */}
      <div className="cob-body">
        <div className="cob-thread">
          {messages.map(msg=>{
            if(msg.role==="user"){
              return<div key={msg.id} className="cob-user">
                <div className="cob-user-bubble">{msg.text}</div>
              </div>;
            }
            if(msg.role==="company-card"){
              return<div key={msg.id} style={{animation:"fadeInUp 0.4s cubic-bezier(0.4,0,0.2,1)",maxWidth:380,width:"100%",alignSelf:"center"}}>
                <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:20,padding:"22px 22px 18px",boxShadow:"0 4px 24px rgba(28,25,23,0.08), 0 1px 4px rgba(28,25,23,0.04)",overflow:"hidden",position:"relative"}}>
                  <div style={{position:"absolute",top:0,left:0,right:0,height:4,background:`linear-gradient(90deg, ${T.accent}, ${T.green})`}}/>
                  <div style={{display:"flex",alignItems:"center",gap:16,marginTop:4}}>
                    <img src={msg.logo} alt={msg.company} style={{width:52,height:52,borderRadius:14,objectFit:"cover",border:`1px solid ${T.border}`,flexShrink:0}}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:11,fontFamily:T.mono,color:T.textTertiary,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:3}}>Company found</div>
                      <div style={{fontSize:16,fontWeight:600,letterSpacing:"-0.02em",fontFamily:T.serif}}>{msg.company}</div>
                      <div style={{fontSize:11.5,color:T.textTertiary,fontFamily:T.mono,marginTop:2}}>{msg.website}</div>
                    </div>
                  </div>
                  <div style={{marginTop:14,paddingTop:14,borderTop:`1px solid ${T.borderSubtle}`,display:"flex",alignItems:"center",gap:8}}>
                    <div style={{fontSize:14.5,fontWeight:500,letterSpacing:"-0.01em"}}>Hi, {msg.name}!</div>
                    <div style={{fontSize:13,color:T.textTertiary}}>Welcome to Flows</div>
                  </div>
                </div>
              </div>;
            }
            return<div key={msg.id} className="cob-ai">
              <div className="cob-avatar">{IC.sparkle("#fff",14)}</div>
              <div className="cob-ai-body">
                {msg.parts.map((part,i)=>renderPart(part,i,msg))}
              </div>
            </div>;
          })}

          {/* Typing indicator */}
          {typing&&<div className="cob-typing">
            <div className="cob-avatar">{IC.sparkle("#fff",14)}</div>
            <div className="cob-typing-dots">
              <div className="cob-dot"/><div className="cob-dot"/><div className="cob-dot"/>
            </div>
          </div>}

          <div ref={endRef}/>
        </div>
      </div>
    </div>
  </>;
}
