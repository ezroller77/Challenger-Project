/* ═══ SCORE PAGE ═══ */

function ScorePage({selectedGoals,industry,onNavigate}){
  const[lens,setLens]=useState("risk");
  const allGoals=getGoalsByIndustry(industry);
  const activeGoals=allGoals.filter(g=>selectedGoals.includes(g.id));
  const agg=computeAggregateScore(selectedGoals);
  const signals=computeSignalAverages(selectedGoals);

  const signalLabels={inspections:"Inspections",actions:"Actions",training:"Training",incidents:"Incidents",assets:"Assets",observations:"Observations"};

  /* Sort goals by score */
  const scoredGoals=useMemo(()=>
    activeGoals.map(g=>({...g,scoreData:GOAL_SCORES[g.id]||{score:0,trend:0,signals:{}}}))
      .sort((a,b)=>lens==="risk"?a.scoreData.score-b.scoreData.score:b.scoreData.score-a.scoreData.score)
  ,[activeGoals,lens]);

  const topRisks=scoredGoals.filter(g=>g.scoreData.score>0&&g.scoreData.score<3.0);
  const topStrengths=scoredGoals.filter(g=>g.scoreData.score>=3.5);

  return<div style={{flex:1,overflowY:"auto",background:T.bg}}>
    <div style={{maxWidth:960,margin:"0 auto",padding:"28px 24px 64px"}}>

      {/* Header */}
      <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:28}}>
        <div>
          <h1 style={{fontFamily:T.serif,fontSize:24,fontWeight:500,letterSpacing:"-0.03em",color:T.text,margin:0}}>Score</h1>
          <p style={{fontSize:13,color:T.textSecondary,marginTop:4,letterSpacing:"-0.01em"}}>Operational readiness across your active goals</p>
        </div>
        <LensToggle lens={lens} setLens={setLens}/>
      </div>

      {activeGoals.length===0?<div style={{textAlign:"center",padding:"80px 0"}}>
        <div style={{width:56,height:56,borderRadius:16,background:T.surfaceMuted,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>{IC.target(T.textTertiary,24)}</div>
        <div style={{fontFamily:T.serif,fontSize:18,fontWeight:500,marginBottom:6}}>No goals selected</div>
        <div style={{fontSize:13,color:T.textSecondary,marginBottom:20}}>Select goals to see your operational score</div>
        <div onClick={()=>onNavigate("goals")} className="action-chip primary">Set up goals</div>
      </div>:<>

      {/* Aggregate score card */}
      <div className="bento" style={{padding:"28px 32px",marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:20}}>
          <div>
            <div className="lbl" style={{marginBottom:8}}>Overall Score</div>
            <ScoreBadge score={agg.score} trend={agg.trend}/>
            <div style={{marginTop:8}}><StarRating score={agg.score} size={22} gap={3}/></div>
          </div>
          <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
            <div style={{textAlign:"center"}}>
              <div style={{fontFamily:T.serif,fontSize:28,fontWeight:500,color:T.text}}>{agg.count}</div>
              <div style={{fontSize:11,color:T.textTertiary,fontFamily:T.mono}}>Active Goals</div>
            </div>
            <div style={{textAlign:"center"}}>
              <div style={{fontFamily:T.serif,fontSize:28,fontWeight:500,color:T.green}}>{topStrengths.length}</div>
              <div style={{fontSize:11,color:T.textTertiary,fontFamily:T.mono}}>Strong</div>
            </div>
            <div style={{textAlign:"center"}}>
              <div style={{fontFamily:T.serif,fontSize:28,fontWeight:500,color:T.rose}}>{topRisks.length}</div>
              <div style={{fontSize:11,color:T.textTertiary,fontFamily:T.mono}}>At Risk</div>
            </div>
          </div>
        </div>
      </div>

      {/* Signal breakdown */}
      <div className="grid-bento" style={{marginBottom:24}}>
        <div className="col-7">
          <div className="bento" style={{padding:"22px 24px"}}>
            <div className="lbl" style={{marginBottom:16}}>Signal Health</div>
            {Object.entries(signals).map(([key,val])=>
              <SignalBar key={key} label={signalLabels[key]||key} value={val}/>
            )}
          </div>
        </div>
        <div className="col-5">
          <div className="bento" style={{padding:"22px 24px",height:"100%",display:"flex",flexDirection:"column"}}>
            <div className="lbl" style={{marginBottom:14}}>{lens==="risk"?"Top Risks":"Top Strengths"}</div>
            <div style={{flex:1,display:"flex",flexDirection:"column",gap:8}}>
              {(lens==="risk"?topRisks:topStrengths).slice(0,5).map(g=>{
                const color=g.scoreData.score<3.0?T.rose:g.scoreData.score>=3.5?T.green:T.amber;
                return<div key={g.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 12px",borderRadius:T.rSm,background:T.surfaceHover}}>
                  <span style={{fontSize:12.5,color:T.text,fontWeight:500,flex:1,minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{g.name}</span>
                  <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
                    <span style={{fontSize:12,fontWeight:600,fontFamily:T.mono,color}}>{g.scoreData.score}</span>
                    {g.scoreData.trend!==0&&<span style={{fontSize:10,color:g.scoreData.trend>0?T.green:T.rose}}>{g.scoreData.trend>0?"↑":"↓"}{Math.abs(g.scoreData.trend)}</span>}
                  </div>
                </div>;
              })}
              {(lens==="risk"?topRisks:topStrengths).length===0&&<div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:T.textTertiary,fontSize:12}}>
                {lens==="risk"?"No goals at risk":"No strong goals yet"}
              </div>}
            </div>
          </div>
        </div>
      </div>

      {/* All goals table */}
      <div className="bento" style={{padding:"22px 24px"}}>
        <div className="lbl" style={{marginBottom:14}}>All Goals</div>
        <div style={{display:"flex",flexDirection:"column",gap:4}}>
          {scoredGoals.map((g,idx)=>{
            const s=g.scoreData;
            const color=s.score<3.0?T.rose:s.score>=3.5?T.green:T.amber;
            return<div key={g.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",borderRadius:T.rSm,transition:"background 0.15s",cursor:"pointer",animation:`fadeIn 0.25s ease ${idx*0.02}s both`}} onMouseEnter={e=>e.currentTarget.style.background=T.surfaceHover} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div style={{width:8,height:8,borderRadius:"50%",background:color,flexShrink:0}}/>
              <span style={{flex:1,fontSize:13,color:T.text,fontWeight:500,minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{g.name}</span>
              <span style={{fontSize:11,color:T.textTertiary,fontFamily:T.mono,flexShrink:0}}>{g.category}</span>
              <div style={{display:"flex",alignItems:"center",gap:4,flexShrink:0}}>
                <StarRating score={s.score} size={10} gap={1}/>
                <span style={{fontSize:12,fontWeight:600,fontFamily:T.mono,color,minWidth:28,textAlign:"right"}}>{s.score}</span>
              </div>
              {s.trend!==0&&<span className="chip" style={{background:s.trend>0?T.greenSoft:T.roseSoft,color:s.trend>0?T.green:T.rose,flexShrink:0}}>{s.trend>0?"↑":"↓"}{Math.abs(s.trend)}</span>}
            </div>;
          })}
        </div>
      </div>
      </>}
    </div>
  </div>;
}
