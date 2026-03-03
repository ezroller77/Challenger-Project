/* ═══ CHART PRIMITIVES ═══ */
function Sparkline({data,color,w=140,h=44,fill=false}){const max=Math.max(...data),min=Math.min(...data),rng=max-min||1;const pts=data.map((v,i)=>`${(i/(data.length-1))*w},${h-((v-min)/rng)*(h-6)-3}`).join(" ");const ly=h-((data[data.length-1]-min)/rng)*(h-6)-3;return<svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{display:"block"}}>{fill&&<polygon points={`0,${h} ${pts} ${w},${h}`} fill={color} opacity="0.1"/>}<polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx={w} cy={ly} r="3" fill={color}/></svg>;}
function AreaChart({data,color,w=280,h=110}){const max=Math.max(...data),min=Math.min(...data),rng=max-min||1;const pts=data.map((v,i)=>`${(i/(data.length-1))*w},${h-((v-min)/rng)*(h-14)-7}`).join(" ");const id=`g-${color.replace('#','')}`;return<svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{display:"block"}}><defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.2"/><stop offset="100%" stopColor={color} stopOpacity="0.02"/></linearGradient></defs><polygon points={`0,${h} ${pts} ${w},${h}`} fill={`url(#${id})`}/><polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;}
function MiniBar({data,color,w=140,h=48}){const max=Math.max(...data),bw=(w/data.length)-3;return<svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{display:"block"}}>{data.map((v,i)=>{const bh=(v/max)*(h-4);return<rect key={i} x={i*(bw+3)} y={h-bh} width={bw} height={bh} rx={2.5} fill={i===data.length-1?color:`${color}30`}/>;})}</svg>;}

/* ═══ PROGRESS PRIMITIVES ═══ */
function Ring({pct,size=56,stroke=5,color}){const r=(size-stroke)/2,circ=2*Math.PI*r,off=circ-(pct/100)*circ;return<svg width={size} height={size} style={{transform:"rotate(-90deg)"}}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.surfaceMuted} strokeWidth={stroke}/><circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round" style={{transition:"stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)"}}/></svg>;}
function Bar({pct,color,height=6}){return<div style={{height,borderRadius:height,background:T.surfaceMuted,overflow:"hidden",width:"100%"}}><div style={{height:"100%",width:`${pct}%`,borderRadius:height,background:color,transition:"width 0.8s cubic-bezier(0.4,0,0.2,1)"}}/></div>;}
function MiniRing({pct,size=28,stroke=3,color}){const r=(size-stroke)/2,circ=2*Math.PI*r,off=circ-(pct/100)*circ;return<svg width={size} height={size} style={{transform:"rotate(-90deg)",display:"block"}}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(59,130,246,0.15)" strokeWidth={stroke}/><circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round" style={{transition:"stroke-dashoffset 0.6s ease"}}/></svg>;}

/* ═══ SCORE PRIMITIVES ═══ */
function StarRating({score,size=28,gap=3}){
  const full=Math.floor(score);
  const partial=score-full;
  const empty=5-full-(partial>0?1:0);
  const gold="#B8962E",goldShadow="rgba(184,150,46,0.12)";
  return<div style={{display:"flex",gap}}>
    {Array(full).fill(0).map((_,i)=><div key={"f"+i} style={{width:size,height:size,borderRadius:size*0.22,background:gold,boxShadow:`0 1px 4px ${goldShadow}`}}/>)}
    {partial>0&&<div key="p" style={{width:size,height:size,borderRadius:size*0.22,background:`linear-gradient(90deg, ${gold} ${partial*100}%, ${T.surfaceMuted} ${partial*100}%)`,boxShadow:`0 1px 4px ${goldShadow}`}}/>}
    {Array(empty).fill(0).map((_,i)=><div key={"e"+i} style={{width:size,height:size,borderRadius:size*0.22,background:T.surfaceMuted}}/>)}
  </div>;
}

function ScoreBadge({score,trend,size="large"}){
  const isLg=size==="large";
  return<div style={{display:"flex",alignItems:"baseline",gap:isLg?10:6}}>
    <span style={{fontFamily:T.serif,fontSize:isLg?48:24,fontWeight:500,letterSpacing:"-0.03em",lineHeight:1}}>{score}</span>
    <span style={{fontSize:isLg?18:13,color:T.textTertiary,fontWeight:400}}>/5.0</span>
    {trend!==0&&<span className="chip" style={{background:trend>0?T.greenSoft:T.roseSoft,color:trend>0?T.green:T.rose,marginLeft:4}}>
      {trend>0?"↑":"↓"} {Math.abs(trend)}
    </span>}
  </div>;
}

function SignalBar({label,value,target,color,weight}){
  const pct=Math.min(100,value);
  const healthColor=pct>=70?T.green:pct>=40?T.amber:T.rose;
  return<div style={{marginBottom:10}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
      <span style={{fontSize:12,color:T.textSecondary}}>{label}{weight?<span style={{color:T.textTertiary,fontFamily:T.mono,fontSize:10,marginLeft:6}}>{weight}%</span>:null}</span>
      <span style={{fontSize:12,fontWeight:600,fontFamily:T.mono,color:healthColor}}>{value}%</span>
    </div>
    <div style={{height:6,borderRadius:3,background:T.surfaceMuted,overflow:"hidden"}}>
      <div style={{height:"100%",width:`${pct}%`,borderRadius:3,background:healthColor,opacity:0.75,transition:"width 0.8s cubic-bezier(0.4,0,0.2,1)"}}/>
    </div>
  </div>;
}

function LensToggle({lens,setLens}){
  return<div style={{display:"flex",background:T.surfaceMuted,borderRadius:99,padding:3,gap:2}}>
    {["risk","opportunity"].map(l=>{const a=lens===l;return<div key={l} onClick={()=>setLens(l)} style={{padding:"5px 16px",borderRadius:99,fontSize:12,fontWeight:a?600:400,color:a?T.text:T.textSecondary,background:a?T.surface:"transparent",boxShadow:a?"0 1px 3px rgba(0,0,0,0.06)":"none",cursor:"pointer",textTransform:"capitalize",letterSpacing:"-0.01em"}}>{l==="risk"?"Risk":"Opportunity"}</div>;})}
  </div>;
}
