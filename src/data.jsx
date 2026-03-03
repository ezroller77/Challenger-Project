/* ═══ CHART DATA ═══ */
const velData=[32,38,35,42,48,44,52,58,54,62,68,72];
const compData=[12,18,15,22,19,24,21];
const revData=[42,48,45,52,58,55,62,67,64,71,75,82,78,85,89];
const HOME_TASKS={
  manufacturing:[
    {text:"Complete morning line walk",ai:true,aiNote:"Line 3 flagged — bearing temp trending high",tag:"Priority",done:false},
    {text:"Review overnight shift handover notes",ai:true,aiNote:"2 quality holds noted on Line 1",tag:"AI summary",done:false},
    {text:"Verify PM schedule compliance for Line 3",ai:false,tag:"87% compliant",done:false},
    {text:"Run incoming shipment inspection",ai:false,tag:"Dock B",done:false},
    {text:"Submit daily OEE report",ai:true,aiNote:"Auto-populated from MES data",tag:"Ready ✨",done:false},
    {text:"Update safety board metrics",ai:false,tag:null,done:true},
  ],
  qsr:[
    {text:"Complete opening checklist",ai:false,tag:"14 steps",done:false},
    {text:"Log morning temperature readings",ai:true,aiNote:"Walk-in cooler at 38°F — within range",tag:"Compliance",done:false},
    {text:"Verify line check & station positioning",ai:false,tag:"Lunch prep",done:false},
    {text:"Review crew schedule for lunch rush",ai:true,aiNote:"8 crew on, 1 call-out — suggest cross-train backup",tag:"AI assist",done:false},
    {text:"Check 3rd-party delivery order accuracy",ai:false,tag:"DoorDash",done:false},
    {text:"Submit yesterday's waste tracking log",ai:false,tag:null,done:true},
  ],
  "transport-logistics":[
    {text:"Review morning pre-trip inspection reports",ai:true,aiNote:"2 flags on Unit 4472 — tire pressure + brake wear",tag:"Safety",done:false},
    {text:"Check driver HOS compliance dashboard",ai:true,aiNote:"98% fleet-wide — 2 drivers near limits",tag:"Compliance",done:false},
    {text:"Approve dock receiving schedule",ai:false,tag:"12 inbound",done:false},
    {text:"Review exception alerts for late shipments",ai:false,tag:"3 alerts",done:false},
    {text:"Verify fuel card reconciliation",ai:true,aiNote:"$340 variance flagged at Station 7",tag:"AI flagged",done:false},
    {text:"Submit end-of-day fleet utilization report",ai:false,tag:null,done:true},
  ],
};
const homeTasks=HOME_TASKS.manufacturing;

/* ═══ CHAT DATA ═══ */
const INITIAL_MESSAGES_MAP={
  manufacturing:[
    {id:"m1",role:"ai",text:"Good morning, Sarah! You have **5 open tasks** today. The morning line walk is first — Line 3 has a bearing temp trending high. Your overnight shift handover notes are summarized and ready.",widgets:[{type:"taskList"}],chips:["Start line walk","View OEE dashboard","Quality inspection","Shift handover"]},
  ],
  qsr:[
    {id:"m1",role:"ai",text:"Good morning, Sarah! You have **5 open tasks** to start the day. Opening checklist is up first — all temps look good. Lunch rush crew is set with 8 scheduled, but you have 1 call-out to manage.",widgets:[{type:"taskList"}],chips:["Opening checklist","Temp readings","Line check","Crew schedule"]},
  ],
  "transport-logistics":[
    {id:"m1",role:"ai",text:"Good morning, Sarah! You have **5 open tasks** today. Pre-trip reports are coming in — 2 flags on Unit 4472 need attention. HOS compliance is at 98% fleet-wide with 2 drivers approaching limits.",widgets:[{type:"taskList"}],chips:["Pre-trip reports","HOS dashboard","Exception alerts","Fleet status"]},
  ],
};
const INITIAL_MESSAGES=INITIAL_MESSAGES_MAP.manufacturing;

const AI_RESPONSES={
  velocity:{text:"Here's your team velocity trend over the last 12 weeks.",widgets:[{type:"velocity"}],chips:["Compare to last quarter","Show by team"]},
  completion:{text:"Completion rate is trending well — here's the breakdown.",widgets:[{type:"completion"}],chips:["Show weekly detail","Filter by project"]},
  revenue:{text:"Pipeline revenue is looking strong this month.",widgets:[{type:"revenue"}],chips:["Show by source","Export data"]},
  tasks:{text:"Here are your current tasks for today.",widgets:[{type:"taskList"}],chips:["Add a task","Filter by priority"]},
  activity:{text:"Here's the latest AI activity in your workspace.",widgets:[{type:"activity"}],chips:["Show all activity","Filter by type"]},
  stats:{text:"Here's a quick overview of your key numbers.",widgets:[{type:"quickStats"}],chips:["Show details","Compare to yesterday"]},
};

const AI_FALLBACK={text:"I understand — let me look into that for you. In the meantime, here's what I can help with: tasks, velocity, completion rates, revenue, activity, or quick stats.",widgets:[],chips:["Show my tasks","Team velocity","Revenue overview"]};

/* ═══ WIDGET CATALOGUE ═══ */
const AVAILABLE_WIDGETS=[
  {type:"agentBriefing",label:"Agent Briefing",desc:"Alerts from your app agents",icon:IC.sparkle,color:T.accent},
  {type:"taskList",label:"Tasks",desc:"Today's task list",icon:IC.tasks,color:T.accent},
  {type:"velocity",label:"Velocity",desc:"Team velocity trend",icon:IC.chart,color:T.green},
  {type:"completion",label:"Completion",desc:"Completion rate",icon:IC.chart,color:T.highlight},
  {type:"revenue",label:"Revenue",desc:"Pipeline revenue",icon:IC.chart,color:T.highlight},
  {type:"activity",label:"Activity",desc:"Recent AI activity",icon:IC.bolt,color:T.green},
  {type:"quickStats",label:"Quick Stats",desc:"PRs, meetings, messages",icon:IC.chart,color:T.violet},
];

const HOME_QUICK_ACTIONS={
  manufacturing:[
    {label:"Today's tasks",key:"tasks"},
    {label:"OEE trend",key:"velocity"},
    {label:"Quality rate",key:"completion"},
    {label:"Maintenance log",key:"activity"},
    {label:"Plant stats",key:"stats"},
  ],
  qsr:[
    {label:"Today's tasks",key:"tasks"},
    {label:"Speed of service",key:"velocity"},
    {label:"Completion rate",key:"completion"},
    {label:"Store activity",key:"activity"},
    {label:"Store stats",key:"stats"},
  ],
  "transport-logistics":[
    {label:"Today's tasks",key:"tasks"},
    {label:"Fleet utilization",key:"velocity"},
    {label:"On-time rate",key:"completion"},
    {label:"Fleet activity",key:"activity"},
    {label:"Fleet stats",key:"stats"},
  ],
};

/* ═══ ONBOARDING: INDUSTRIES ═══ */
const INDUSTRIES=[
  {id:"manufacturing",label:"Manufacturing",color:T.green,colorSoft:T.greenSoft,desc:"Production, quality, maintenance & supply chain",goalCount:24},
  {id:"qsr",label:"Quick Service Restaurants",color:T.amber,colorSoft:T.amberSoft,desc:"Speed, food safety, labor & multi-unit operations",goalCount:23},
  {id:"transport-logistics",label:"Transport & Logistics",color:T.violet,colorSoft:T.violetSoft,desc:"Fleet, delivery, routing & compliance",goalCount:23},
];

const GOAL_CATEGORIES={
  manufacturing:["Production & Throughput","Quality & Compliance","Maintenance & Reliability","Supply Chain & Inventory","Workforce & Safety","Cost & Efficiency"],
  qsr:["Speed & Customer Experience","Food Quality & Safety","Labor & Workforce","Inventory & Waste","Revenue & Profitability","Multi-Unit & Franchise Operations","Drive-Thru & Digital Channels"],
  "transport-logistics":["Delivery Performance & Reliability","Fleet & Asset Management","Warehouse & Distribution","Route Optimization & Efficiency","Driver Safety & Compliance","Cost Management","Visibility & Tracking"],
};

/* ═══ ONBOARDING: OPERATIONAL GOALS ═══ */
const OPERATIONAL_GOALS=[
  // Manufacturing — Production & Throughput
  {id:"mfg-oee",name:"Increase Overall Equipment Effectiveness (OEE)",description:"Maximize productive capacity by improving availability, performance, and quality rates simultaneously.",category:"Production & Throughput",industry:"manufacturing",metrics:["OEE %","Availability %","Performance %","Quality Rate %"],personas:["Plant Manager","VP of Operations","Production Manager","Continuous Improvement Manager"]},
  {id:"mfg-throughput",name:"Improve Production Throughput",description:"Increase the volume of units produced per unit of time without proportionally increasing resources.",category:"Production & Throughput",industry:"manufacturing",metrics:["Units per hour","Throughput rate","Takt time","Cycle time","Bottleneck utilization %"],personas:["Production Manager","Plant Manager","Industrial Engineer","VP of Operations"]},
  {id:"mfg-changeover",name:"Reduce Changeover Time",description:"Minimize time lost when switching a production line from one product to another.",category:"Production & Throughput",industry:"manufacturing",metrics:["Changeover time (min)","SMED compliance %","Changeovers per shift"],personas:["Production Manager","Continuous Improvement Manager","Line Supervisor"]},
  {id:"mfg-scheduling",name:"Optimize Production Scheduling",description:"Improve adherence to production plans and reduce schedule deviations causing delays.",category:"Production & Throughput",industry:"manufacturing",metrics:["Schedule adherence %","On-time completion rate","Production plan variance"],personas:["Production Planner","Plant Manager","Supply Chain Manager","VP of Operations"]},
  // Manufacturing — Quality & Compliance
  {id:"mfg-defects",name:"Reduce Defect Rate",description:"Lower the percentage of units that fail to meet specifications at first pass.",category:"Quality & Compliance",industry:"manufacturing",metrics:["First Pass Yield %","DPMO","Scrap rate %","Rework rate %","COPQ"],personas:["Quality Director","Quality Engineer","Plant Manager","VP of Operations"]},
  {id:"mfg-supplier-quality",name:"Improve Supplier Quality",description:"Ensure incoming materials meet specifications consistently, reducing rejections.",category:"Quality & Compliance",industry:"manufacturing",metrics:["Supplier PPM","Incoming rejection rate %","Supplier scorecard","SCARs issued"],personas:["Quality Director","Procurement Manager","Supply Chain Manager"]},
  {id:"mfg-regulatory",name:"Maintain Regulatory Compliance",description:"Meet all regulatory requirements (FDA, EPA, OSHA, ISO) and stay audit-ready.",category:"Quality & Compliance",industry:"manufacturing",metrics:["Audit findings","CAPA closure rate","Compliance score %"],personas:["Quality Director","Compliance Manager","Plant Manager","EHS Manager"]},
  {id:"mfg-customer-complaints",name:"Reduce Customer Complaints & Returns",description:"Decrease quality escapes that reach the customer, improving satisfaction.",category:"Quality & Compliance",industry:"manufacturing",metrics:["Complaints per million","Return rate %","Warranty cost","8D response time"],personas:["Quality Director","VP of Operations","Plant Manager"]},
  // Manufacturing — Maintenance & Reliability
  {id:"mfg-downtime",name:"Reduce Unplanned Downtime",description:"Minimize unexpected equipment failures that halt production.",category:"Maintenance & Reliability",industry:"manufacturing",metrics:["MTBF","Downtime hours","Downtime %","Breakdowns per month"],personas:["Plant Manager","Maintenance Manager","VP of Operations","Reliability Engineer"]},
  {id:"mfg-preventive-maintenance",name:"Shift to Preventive & Predictive Maintenance",description:"Move from reactive break-fix toward scheduled preventive maintenance.",category:"Maintenance & Reliability",industry:"manufacturing",metrics:["Planned Maintenance %","PM compliance %","Predictive alerts acted on","Reactive ratio"],personas:["Maintenance Manager","Reliability Engineer","Plant Manager"]},
  {id:"mfg-spare-parts",name:"Optimize Spare Parts & MRO Inventory",description:"Ensure critical spare parts are available while avoiding excess inventory.",category:"Maintenance & Reliability",industry:"manufacturing",metrics:["Stockout rate","MRO carrying cost","MTTR","Parts availability %"],personas:["Maintenance Manager","Inventory Manager","Plant Manager"]},
  // Manufacturing — Supply Chain & Inventory
  {id:"mfg-raw-inventory",name:"Reduce Raw Material Inventory",description:"Minimize capital tied up in raw material inventory while ensuring production continuity.",category:"Supply Chain & Inventory",industry:"manufacturing",metrics:["Days of Inventory on Hand","Turnover ratio","Carrying cost %","Stockout events"],personas:["Supply Chain Manager","VP of Operations","Plant Manager"]},
  {id:"mfg-otif",name:"Improve On-Time Delivery",description:"Increase the percentage of orders shipped complete and on time.",category:"Supply Chain & Inventory",industry:"manufacturing",metrics:["OTIF %","Fulfillment lead time","Backorder rate","Perfect order rate %"],personas:["VP of Operations","Supply Chain Manager","Plant Manager"]},
  {id:"mfg-wip",name:"Reduce Work-In-Process (WIP)",description:"Minimize partially completed inventory consuming space and increasing lead time.",category:"Supply Chain & Inventory",industry:"manufacturing",metrics:["WIP value","WIP units","WIP days","Flow efficiency"],personas:["Production Manager","Plant Manager","Lean/CI Manager"]},
  {id:"mfg-supply-resilience",name:"Strengthen Supply Chain Resilience",description:"Reduce single-source dependency and build supply chain risk visibility.",category:"Supply Chain & Inventory",industry:"manufacturing",metrics:["Single-source %","Lead time variability","Safety stock days"],personas:["Supply Chain Manager","VP of Operations","Procurement Manager"]},
  // Manufacturing — Workforce & Safety
  {id:"mfg-injuries",name:"Reduce Workplace Injuries",description:"Lower frequency and severity of workplace injuries through proactive safety programs.",category:"Workforce & Safety",industry:"manufacturing",metrics:["TRIR","LTIR","DART rate","Near-miss rate","OSHA recordables"],personas:["EHS Manager","Plant Manager","VP of Operations"]},
  {id:"mfg-turnover",name:"Reduce Absenteeism & Turnover",description:"Address chronic absenteeism and high turnover (~30% avg) impacting production.",category:"Workforce & Safety",industry:"manufacturing",metrics:["Absenteeism %","Turnover rate %","Time-to-fill","Overtime %"],personas:["HR Director","Plant Manager","VP of Operations"]},
  {id:"mfg-training",name:"Improve Training & Certification Compliance",description:"Ensure all operators are trained and certified on equipment and processes.",category:"Workforce & Safety",industry:"manufacturing",metrics:["Completion %","Cert expiry alerts","Skills matrix coverage %"],personas:["HR Director","Training Manager","Plant Manager","Quality Director"]},
  {id:"mfg-labor-utilization",name:"Optimize Labor Utilization",description:"Deploy the right workers with right skills to right stations at right times.",category:"Workforce & Safety",industry:"manufacturing",metrics:["Labor efficiency %","Utilization rate","Overtime %","Output per labor hour"],personas:["Production Manager","Plant Manager","HR Director"]},
  // Manufacturing — Cost & Efficiency
  {id:"mfg-cost-per-unit",name:"Reduce Manufacturing Cost Per Unit",description:"Lower total cost to produce each unit across labor, materials, energy, and overhead.",category:"Cost & Efficiency",industry:"manufacturing",metrics:["Cost per unit","Mfg cost as % revenue","Variance to standard cost"],personas:["VP of Operations","Plant Manager","CFO"]},
  {id:"mfg-energy",name:"Reduce Energy Consumption",description:"Lower energy usage per unit for both cost savings and sustainability goals.",category:"Cost & Efficiency",industry:"manufacturing",metrics:["kWh per unit","Energy intensity ratio","Carbon emissions per unit"],personas:["Plant Manager","VP of Operations","Sustainability Manager"]},
  {id:"mfg-scrap",name:"Minimize Scrap & Material Waste",description:"Reduce raw material wasted through better process control and yield optimization.",category:"Cost & Efficiency",industry:"manufacturing",metrics:["Scrap rate %","Material yield %","Waste cost","Rework cost"],personas:["Production Manager","Quality Director","Continuous Improvement Manager"]},
  {id:"mfg-asset-utilization",name:"Improve Asset Utilization",description:"Maximize productive use of capital equipment and facility capacity.",category:"Cost & Efficiency",industry:"manufacturing",metrics:["Capacity utilization %","Asset utilization rate","Equipment ROI","Revenue per machine hour"],personas:["VP of Operations","Plant Manager","Finance Director"]},
  {id:"mfg-lead-time",name:"Reduce Operational Lead Time",description:"Compress total time from order receipt to shipment by eliminating waste.",category:"Cost & Efficiency",industry:"manufacturing",metrics:["Order-to-ship time","Cycle time","Process cycle efficiency"],personas:["VP of Operations","Lean/CI Manager","Supply Chain Manager"]},

  // QSR — Speed & Customer Experience
  {id:"qsr-speed",name:"Speed of Service",description:"Minimize total time from order placement to order handoff across all channels.",category:"Speed & Customer Experience",industry:"qsr",metrics:["Drive-thru time (sec)","Counter time","Cars per hour","Order-to-delivery"],personas:["Store Manager","District Manager","VP of Operations"]},
  {id:"qsr-accuracy",name:"Order Accuracy",description:"Ensure every order is assembled correctly — the largest driver of guest complaints.",category:"Speed & Customer Experience",industry:"qsr",metrics:["Accuracy rate %","Remakes per 100 orders","Missing-item rate"],personas:["Store Manager","District Manager","VP of Operations"]},
  {id:"qsr-guest-satisfaction",name:"Guest Satisfaction & Loyalty",description:"Track and improve overall guest experience across all channels.",category:"Speed & Customer Experience",industry:"qsr",metrics:["OSAT/CSAT","NPS","Google rating","Loyalty enrollment","Visit frequency"],personas:["Store Manager","District Manager","VP of Marketing","Franchisee"]},
  // QSR — Food Quality & Safety
  {id:"qsr-food-safety",name:"Food Safety Compliance",description:"Maintain health-code and brand-standard compliance for food handling and sanitation.",category:"Food Quality & Safety",industry:"qsr",metrics:["Health inspection scores","Critical violations","HACCP compliance %","Temp log compliance"],personas:["Store Manager","VP of Quality Assurance","Franchisee"]},
  {id:"qsr-food-quality",name:"Food Quality Consistency",description:"Ensure every product matches brand standards for taste, appearance, and temperature.",category:"Food Quality & Safety",industry:"qsr",metrics:["Brand audit score","Mystery shop scores","Quality hold waste"],personas:["Store Manager","District Manager","VP of Quality Assurance"]},
  {id:"qsr-audit-scores",name:"Brand Standards & Ops Audits",description:"Score well on periodic audits evaluating cleanliness, food safety, and service.",category:"Food Quality & Safety",industry:"qsr",metrics:["Overall audit %","Sub-scores","Score trend","% locations above threshold"],personas:["Store Manager","District Manager","Franchisee"]},
  // QSR — Labor & Workforce
  {id:"qsr-labor-cost",name:"Labor Cost Optimization",description:"Keep labor cost aligned with sales volume through smart scheduling.",category:"Labor & Workforce",industry:"qsr",metrics:["Labor % of sales","SPLH","Overtime cost","Scheduled vs actual hours"],personas:["Store Manager","District Manager","Franchisee"]},
  {id:"qsr-retention",name:"Employee Retention & Turnover",description:"Reduce hourly crew turnover, which commonly exceeds 100-150% annually in QSR.",category:"Labor & Workforce",industry:"qsr",metrics:["30/60/90-day retention","Annual turnover %","Avg tenure","Cost per hire"],personas:["Store Manager","District Manager","VP of HR"]},
  {id:"qsr-scheduling",name:"Schedule Effectiveness",description:"Build schedules matching labor to sales forecast, minimizing no-shows.",category:"Labor & Workforce",industry:"qsr",metrics:["Schedule adherence","No-show rate","Under/over-staffed hours"],personas:["Store Manager","District Manager"]},
  {id:"qsr-training",name:"Training Completion & Certification",description:"Ensure all crew complete required training — the root cause behind many failures.",category:"Labor & Workforce",industry:"qsr",metrics:["Completion rate %","Time-to-proficiency","Cert compliance"],personas:["Store Manager","VP of Training"]},
  // QSR — Inventory & Waste
  {id:"qsr-food-cost",name:"Food Cost Control",description:"Manage theoretical vs actual food cost by controlling portioning, waste, and pricing.",category:"Inventory & Waste",industry:"qsr",metrics:["Food cost % of sales","Theoretical vs actual variance","COGS per transaction"],personas:["Store Manager","District Manager","Franchisee"]},
  {id:"qsr-waste",name:"Waste Reduction",description:"Minimize food waste from overproduction, spoilage, and quality holds.",category:"Inventory & Waste",industry:"qsr",metrics:["Waste $ per $1K sales","Waste by category","Shrinkage rate"],personas:["Store Manager","VP of Supply Chain"]},
  {id:"qsr-inventory",name:"Inventory Accuracy & Availability",description:"Keep accurate real-time inventory counts to prevent out-of-stocks and over-ordering.",category:"Inventory & Waste",industry:"qsr",metrics:["Inventory variance","Out-of-stocks per week","Days on hand","Availability %"],personas:["Store Manager","District Manager","VP of Supply Chain"]},
  // QSR — Revenue & Profitability
  {id:"qsr-sss",name:"Same-Store Sales Growth",description:"Grow revenue at existing locations through traffic, average check, and channels.",category:"Revenue & Profitability",industry:"qsr",metrics:["SSS growth % YoY","Transaction count growth","Average check","Channel mix"],personas:["Franchisee","District Manager","CFO"]},
  {id:"qsr-profitability",name:"Restaurant-Level Profitability",description:"Maximize four-wall profit — the primary metric for unit viability.",category:"Revenue & Profitability",industry:"qsr",metrics:["Operating margin %","Four-wall EBITDA","Prime cost %"],personas:["Franchisee","Store Manager","District Manager","CFO"]},
  {id:"qsr-daypart",name:"Daypart Sales Optimization",description:"Grow underpenetrated dayparts to maximize revenue from fixed real estate.",category:"Revenue & Profitability",industry:"qsr",metrics:["Sales by daypart","Daypart mix %","Transaction count by daypart"],personas:["Store Manager","District Manager","VP of Marketing"]},
  // QSR — Multi-Unit & Franchise Operations
  {id:"qsr-consistency",name:"Unit-to-Unit Consistency",description:"Reduce operational variance so every restaurant delivers the same experience.",category:"Multi-Unit & Franchise Operations",industry:"qsr",metrics:["Std dev of key metrics","% units above threshold","Bottom quartile count"],personas:["District Manager","VP of Operations","Franchisee"]},
  {id:"qsr-new-unit",name:"New Unit Opening Performance",description:"Ensure new restaurants ramp to target sales and proficiency on schedule.",category:"Multi-Unit & Franchise Operations",industry:"qsr",metrics:["Honeymoon index","Time to steady-state","New-unit OSAT","90-day retention"],personas:["VP of Operations","VP of Development","Franchisee"]},
  {id:"qsr-franchise-compliance",name:"Franchisee Performance & Compliance",description:"Monitor franchisee adherence to brand standards and operational performance.",category:"Multi-Unit & Franchise Operations",industry:"qsr",metrics:["Franchise audit scores","Royalty timeliness","Compliance rate"],personas:["VP of Operations","VP of Franchise Relations"]},
  // QSR — Drive-Thru & Digital Channels
  {id:"qsr-drive-thru",name:"Drive-Thru Throughput & Experience",description:"Maximize cars served per hour while maintaining accuracy. 65-75%+ of sales.",category:"Drive-Thru & Digital Channels",industry:"qsr",metrics:["Cars per hour","Avg time (sec)","Accuracy rate","OSAT","Balk rate"],personas:["Store Manager","District Manager"]},
  {id:"qsr-digital",name:"Digital & Mobile Order Growth",description:"Grow digital sales as % of total for higher average checks and first-party data.",category:"Drive-Thru & Digital Channels",industry:"qsr",metrics:["Digital % of total","App MAUs","Digital avg check","Kiosk utilization %"],personas:["VP of Digital","CMO","District Manager"]},
  {id:"qsr-delivery",name:"Third-Party Delivery Performance",description:"Manage quality, speed, and profitability through DoorDash, Uber Eats, etc.",category:"Drive-Thru & Digital Channels",industry:"qsr",metrics:["Delivery volume","Profitability after commission","Prep time","Error rate"],personas:["VP of Digital","CFO","Store Manager"]},
  {id:"qsr-kitchen",name:"Kitchen / Order Mgmt Efficiency",description:"Optimize order flow through the kitchen across all channels simultaneously.",category:"Drive-Thru & Digital Channels",industry:"qsr",metrics:["Ticket time by channel","Kitchen orders per hour","Throttling events"],personas:["Store Manager","VP of Technology"]},

  // Transport & Logistics — Delivery Performance
  {id:"tl-otd",name:"On-Time Delivery",description:"Ensure shipments arrive within the committed delivery window.",category:"Delivery Performance & Reliability",industry:"transport-logistics",metrics:["OTD %","Late delivery rate","Avg hours late","OTIF rate"],personas:["VP of Logistics","Dispatch Supervisor","Account Manager"]},
  {id:"tl-first-attempt",name:"First-Attempt Delivery Success",description:"Maximize deliveries completed on the first attempt without re-delivery.",category:"Delivery Performance & Reliability",industry:"transport-logistics",metrics:["First-attempt rate","Re-delivery rate","Failed delivery reasons"],personas:["Last-Mile Ops Manager","Dispatch Supervisor"]},
  {id:"tl-accuracy-damage",name:"Order Accuracy & Damage Reduction",description:"Ensure right items delivered in right quantities, undamaged.",category:"Delivery Performance & Reliability",industry:"transport-logistics",metrics:["Accuracy rate","Damage/claims %","Claims cost per shipment"],personas:["Warehouse Manager","Quality & Claims Manager"]},
  {id:"tl-dwell",name:"Dwell Time Reduction",description:"Minimize time trucks spend waiting at facilities for loading/unloading.",category:"Delivery Performance & Reliability",industry:"transport-logistics",metrics:["Avg dwell time","Detention rate","Detention cost per load"],personas:["Fleet Manager","Dispatch Supervisor"]},
  // Transport & Logistics — Fleet & Asset Management
  {id:"tl-fleet-utilization",name:"Fleet Utilization",description:"Maximize productive use of trucks, trailers, and containers.",category:"Fleet & Asset Management",industry:"transport-logistics",metrics:["Utilization %","Revenue per truck per day","Loaded vs empty miles"],personas:["Fleet Manager","VP of Operations","CFO"]},
  {id:"tl-vehicle-uptime",name:"Vehicle Uptime & Preventive Maintenance",description:"Keep vehicles on the road by reducing unplanned breakdowns.",category:"Fleet & Asset Management",industry:"transport-logistics",metrics:["Uptime %","MTBF","PM compliance","Breakdown rate","Maint cost per mile"],personas:["Fleet Manager","Maintenance Director"]},
  {id:"tl-trailer-pool",name:"Trailer Pool Optimization",description:"Balance trailer supply across locations to avoid delays and repositioning costs.",category:"Fleet & Asset Management",industry:"transport-logistics",metrics:["Trailer-to-load ratio","Pool turns per month","Repositioning cost"],personas:["Fleet Manager","Network Planning Manager"]},
  // Transport & Logistics — Warehouse & Distribution
  {id:"tl-dock-throughput",name:"Dock Throughput & Scheduling",description:"Maximize freight processed through dock doors per shift.",category:"Warehouse & Distribution",industry:"transport-logistics",metrics:["Loads per dock door per day","Avg load/unload time","Appointment adherence %"],personas:["Warehouse Manager","Dock Supervisor"]},
  {id:"tl-cross-dock",name:"Cross-Dock Efficiency",description:"Minimize time freight spends in facility between inbound and outbound movements.",category:"Warehouse & Distribution",industry:"transport-logistics",metrics:["Cycle time","Mis-sort rate","Pieces per hour","Outbound load factor"],personas:["Terminal Manager","Warehouse Manager"]},
  {id:"tl-inventory-fulfillment",name:"Inventory Accuracy & Fulfillment Speed",description:"Maintain precise inventory counts and accelerate pick-pack-ship cycles.",category:"Warehouse & Distribution",industry:"transport-logistics",metrics:["Accuracy %","Order cycle time","Pick accuracy","Orders per labor hour"],personas:["Warehouse Manager","Fulfillment Director"]},
  // Transport & Logistics — Route Optimization
  {id:"tl-route-efficiency",name:"Route Efficiency & Miles Reduction",description:"Optimize routes to minimize total miles and increase stops per route.",category:"Route Optimization & Efficiency",industry:"transport-logistics",metrics:["Planned vs actual miles","Miles per stop","Stops per route","Route adherence %"],personas:["Route Planner","Dispatch Supervisor","VP of Logistics"]},
  {id:"tl-deadhead",name:"Empty Miles (Deadhead) Reduction",description:"Minimize miles driven without revenue-generating freight.",category:"Route Optimization & Efficiency",industry:"transport-logistics",metrics:["Empty mile %","Deadhead ratio","Revenue per total mile","Backhaul utilization %"],personas:["Fleet Manager","Network Planning Manager"]},
  {id:"tl-cube-utilization",name:"Load Optimization (Cube Utilization)",description:"Maximize freight density in each trailer — filling both weight and volume.",category:"Route Optimization & Efficiency",industry:"transport-logistics",metrics:["Cube utilization %","Weight utilization %","Revenue per loaded trailer"],personas:["Load Planner","Dispatch Supervisor","VP of Operations"]},
  // Transport & Logistics — Driver Safety & Compliance
  {id:"tl-driver-safety",name:"Driver Safety & Accident Reduction",description:"Reduce frequency and severity of accidents and unsafe driving behaviors.",category:"Driver Safety & Compliance",industry:"transport-logistics",metrics:["Accident rate per M miles","Hard-braking events","CSA scores","Preventable accident rate"],personas:["Safety Director","Fleet Manager","VP of Operations"]},
  {id:"tl-hos",name:"Hours of Service (HOS) Compliance",description:"Ensure drivers operate within federally mandated HOS limits with ELD data.",category:"Driver Safety & Compliance",industry:"transport-logistics",metrics:["HOS violation rate","ELD compliance %","Available drive hours","Out-of-service rate"],personas:["Safety Director","Compliance Manager","Dispatch Supervisor"]},
  {id:"tl-driver-retention",name:"Driver Retention & Satisfaction",description:"Reduce driver turnover (80-95% annually) which costs $8-12K+ per driver to replace.",category:"Driver Safety & Compliance",industry:"transport-logistics",metrics:["Turnover rate","Avg tenure","Satisfaction score","Home-time compliance %"],personas:["VP of Driver Operations","Fleet Manager","HR Director"]},
  // Transport & Logistics — Cost Management
  {id:"tl-cost-per-mile",name:"Cost Per Mile / Per Shipment",description:"Track and reduce all-in operating cost to move freight.",category:"Cost Management",industry:"transport-logistics",metrics:["Cost per mile","Cost per shipment","Operating ratio","Fuel % of revenue"],personas:["CFO","VP of Operations","Fleet Manager"]},
  {id:"tl-fuel",name:"Fuel Cost Optimization",description:"Reduce fuel spend through routing, speed management, and idle reduction. 25-35% of cost.",category:"Cost Management",industry:"transport-logistics",metrics:["Fuel cost per mile","MPG","Idle time %","Fuel discount vs retail"],personas:["Fleet Manager","Finance Director"]},
  {id:"tl-freight-spend",name:"Freight Spend & Carrier Performance",description:"Control freight spend by benchmarking carrier rates and service levels.",category:"Cost Management",industry:"transport-logistics",metrics:["Spend vs budget","Cost per unit shipped","Carrier scorecard","Spot vs contract mix"],personas:["VP of Logistics","Procurement Manager"]},
  // Transport & Logistics — Visibility & Tracking
  {id:"tl-visibility",name:"Real-Time Shipment Visibility",description:"Provide end-to-end real-time location and status for every shipment.",category:"Visibility & Tracking",industry:"transport-logistics",metrics:["% with real-time tracking","Data freshness","Check-call compliance"],personas:["VP of Logistics","Dispatch Supervisor","Customer Success"]},
  {id:"tl-exceptions",name:"Exception & Delay Management",description:"Detect and resolve shipment exceptions before they impact the customer.",category:"Visibility & Tracking",industry:"transport-logistics",metrics:["Detection-to-resolution time","% resolved before impact","Exception rate"],personas:["Dispatch Supervisor","Control Tower Analyst","Customer Success"]},
  {id:"tl-eta",name:"ETA Accuracy & Predictive Arrival",description:"Improve estimated arrival accuracy using historical data and real-time signals.",category:"Visibility & Tracking",industry:"transport-logistics",metrics:["ETA accuracy %","Avg deviation (min)","Confidence score"],personas:["Dispatch Supervisor","Warehouse Manager","Customer Success"]},
  {id:"tl-pod",name:"Proof of Delivery (POD) Digitization",description:"Capture and transmit POD electronically to accelerate invoicing. Paper adds 3-7 days.",category:"Visibility & Tracking",industry:"transport-logistics",metrics:["ePOD capture rate %","Time to POD availability","Dispute rate","DSO impact"],personas:["Finance Director","Fleet Manager"]},
];

/* ═══ ONBOARDING: PERSONA DEFAULTS ═══ */
const PERSONA_DEFAULTS={
  "Plant Manager":["mfg-oee","mfg-downtime","mfg-defects","mfg-otif","mfg-injuries"],
  "VP of Operations":["mfg-cost-per-unit","mfg-oee","mfg-otif","mfg-throughput","mfg-lead-time"],
  "Quality Director":["mfg-defects","mfg-customer-complaints","mfg-regulatory","mfg-supplier-quality"],
  "Maintenance Manager":["mfg-downtime","mfg-preventive-maintenance","mfg-spare-parts"],
  "Production Manager":["mfg-throughput","mfg-changeover","mfg-labor-utilization","mfg-scheduling"],
  "Supply Chain Manager":["mfg-otif","mfg-raw-inventory","mfg-supply-resilience","mfg-supplier-quality"],
  "Store Manager":["qsr-speed","qsr-accuracy","qsr-labor-cost","qsr-food-cost","qsr-food-safety"],
  "District Manager":["qsr-consistency","qsr-profitability","qsr-audit-scores","qsr-retention","qsr-sss"],
  "Franchisee":["qsr-profitability","qsr-labor-cost","qsr-food-cost","qsr-sss","qsr-guest-satisfaction"],
  "VP of Quality Assurance":["qsr-food-safety","qsr-food-quality","qsr-audit-scores"],
  "Fleet Manager":["tl-fleet-utilization","tl-vehicle-uptime","tl-fuel","tl-driver-safety","tl-deadhead"],
  "Dispatch Supervisor":["tl-otd","tl-eta","tl-exceptions","tl-hos","tl-dwell"],
  "VP of Logistics":["tl-cost-per-mile","tl-otd","tl-visibility","tl-freight-spend","tl-fleet-utilization"],
  "Warehouse Manager":["tl-dock-throughput","tl-cross-dock","tl-dwell","tl-inventory-fulfillment"],
  "Safety Director":["tl-driver-safety","tl-hos","tl-driver-retention"],
};

const getGoalsByIndustry=(industry)=>OPERATIONAL_GOALS.filter(g=>g.industry===industry);
const getCompanyGoals=(industry)=>OPERATIONAL_GOALS.filter(g=>g.industry===industry&&g.level==="company");
const getSiteGoals=(industry)=>OPERATIONAL_GOALS.filter(g=>g.industry===industry&&g.level==="site");
const getChildGoals=(parentGoalId)=>OPERATIONAL_GOALS.filter(g=>g.parentGoalId===parentGoalId);
const getGoalById=(goalId)=>OPERATIONAL_GOALS.find(g=>g.id===goalId)||null;
const getPersonasByIndustry=(industry)=>{const p=new Set();OPERATIONAL_GOALS.filter(g=>g.industry===industry).forEach(g=>g.personas.forEach(x=>p.add(x)));return Array.from(p).sort();};

/* Only return personas that have PERSONA_DEFAULTS for this industry */
const getPersonasForIndustry=(industry)=>{
  return Object.keys(PERSONA_DEFAULTS).filter(pName=>{
    const ids=PERSONA_DEFAULTS[pName];
    return ids.some(id=>{const g=OPERATIONAL_GOALS.find(x=>x.id===id);return g&&g.industry===industry;});
  });
};

/* Derive focus description from persona's default goals */
const getPersonaFocus=(pName)=>{
  const ids=PERSONA_DEFAULTS[pName]||[];
  const cats=[...new Set(ids.map(id=>{const g=OPERATIONAL_GOALS.find(x=>x.id===id);return g?g.category:null;}).filter(Boolean))];
  return cats.slice(0,3).join(" · ")+(cats.length>3?` +${cats.length-3}`:"");
};

/* ═══ GOAL SCORING: SIGNALS ═══ */
const _SIGNAL_DEFS=[
  {id:"inspections",label:"Inspections",icon:IC.tasks,color:T.green},
  {id:"actions",label:"Actions Closed",icon:IC.check,color:T.highlight},
  {id:"training",label:"Training",icon:IC.people,color:T.violet},
  {id:"incidents",label:"Incident Reporting",icon:IC.shield,color:T.rose},
  {id:"assets",label:"Asset Compliance",icon:IC.asset,color:T.amber},
  {id:"observations",label:"Observations",icon:IC.target,color:T.accent},
];
const _SIGNAL_WEIGHTS={
  manufacturing:{inspections:25,actions:20,training:20,incidents:15,assets:10,observations:10},
  qsr:{inspections:30,actions:15,training:20,incidents:10,assets:5,observations:20},
  "transport-logistics":{inspections:20,actions:15,training:15,incidents:20,assets:25,observations:5},
};
const getSignalTypesForIndustry=(industry)=>{
  const w=_SIGNAL_WEIGHTS[industry]||_SIGNAL_WEIGHTS.manufacturing;
  return _SIGNAL_DEFS.map(s=>({...s,weight:w[s.id]||10}));
};
const GOAL_SIGNAL_TYPES=getSignalTypesForIndustry("manufacturing");

/* ═══ GOAL SCORING: MOCK SCORES ═══ */
const GOAL_SCORES={
  "mfg-oee":{score:3.8,trend:0.3,signals:{inspections:82,actions:74,training:90,incidents:65,assets:78,observations:70}},
  "mfg-throughput":{score:3.5,trend:0.2,signals:{inspections:78,actions:70,training:85,incidents:60,assets:72,observations:65}},
  "mfg-changeover":{score:2.9,trend:-0.1,signals:{inspections:65,actions:58,training:70,incidents:50,assets:60,observations:55}},
  "mfg-scheduling":{score:3.2,trend:0.1,signals:{inspections:72,actions:65,training:78,incidents:55,assets:68,observations:62}},
  "mfg-defects":{score:4.1,trend:0.4,signals:{inspections:90,actions:82,training:92,incidents:75,assets:85,observations:80}},
  "mfg-supplier-quality":{score:3.0,trend:0.0,signals:{inspections:68,actions:62,training:72,incidents:52,assets:65,observations:58}},
  "mfg-regulatory":{score:4.3,trend:0.2,signals:{inspections:92,actions:88,training:95,incidents:80,assets:90,observations:85}},
  "mfg-customer-complaints":{score:3.6,trend:0.3,signals:{inspections:80,actions:72,training:82,incidents:62,assets:75,observations:68}},
  "mfg-downtime":{score:2.5,trend:-0.2,signals:{inspections:55,actions:48,training:62,incidents:42,assets:50,observations:45}},
  "mfg-preventive-maintenance":{score:2.8,trend:0.1,signals:{inspections:62,actions:55,training:68,incidents:48,assets:58,observations:52}},
  "mfg-spare-parts":{score:3.1,trend:0.0,signals:{inspections:70,actions:64,training:74,incidents:54,assets:66,observations:60}},
  "mfg-raw-inventory":{score:3.4,trend:0.2,signals:{inspections:76,actions:68,training:80,incidents:58,assets:72,observations:66}},
  "mfg-otif":{score:3.7,trend:0.3,signals:{inspections:82,actions:74,training:86,incidents:64,assets:78,observations:72}},
  "mfg-wip":{score:3.3,trend:0.1,signals:{inspections:74,actions:66,training:78,incidents:56,assets:70,observations:64}},
  "mfg-supply-resilience":{score:2.7,trend:-0.1,signals:{inspections:60,actions:52,training:66,incidents:46,assets:56,observations:50}},
  "mfg-injuries":{score:3.9,trend:0.4,signals:{inspections:86,actions:78,training:90,incidents:70,assets:82,observations:76}},
  "mfg-turnover":{score:2.6,trend:-0.2,signals:{inspections:58,actions:50,training:64,incidents:44,assets:54,observations:48}},
  "mfg-training":{score:3.5,trend:0.2,signals:{inspections:78,actions:70,training:88,incidents:60,assets:72,observations:66}},
  "mfg-labor-utilization":{score:3.0,trend:0.0,signals:{inspections:68,actions:60,training:72,incidents:52,assets:64,observations:58}},
  "mfg-cost-per-unit":{score:3.2,trend:0.1,signals:{inspections:72,actions:64,training:76,incidents:54,assets:68,observations:62}},
  "mfg-energy":{score:2.9,trend:0.0,signals:{inspections:64,actions:56,training:70,incidents:48,assets:60,observations:54}},
  "mfg-scrap":{score:3.4,trend:0.2,signals:{inspections:76,actions:68,training:80,incidents:58,assets:72,observations:66}},
  "mfg-asset-utilization":{score:3.1,trend:0.1,signals:{inspections:70,actions:62,training:74,incidents:52,assets:66,observations:60}},
  "mfg-lead-time":{score:3.3,trend:0.2,signals:{inspections:74,actions:66,training:78,incidents:56,assets:70,observations:64}},
  "mfg-site-oee-plant1":{score:3.4,trend:0.4,signals:{inspections:78,actions:70,training:85,incidents:60,assets:74,observations:68}},
  "mfg-site-oee-plant2":{score:3.0,trend:0.1,signals:{inspections:68,actions:58,training:72,incidents:50,assets:62,observations:55}},
  "mfg-site-defects-plant1":{score:4.0,trend:0.3,signals:{inspections:88,actions:80,training:90,incidents:72,assets:82,observations:76}},
  "mfg-site-safety-plant2":{score:3.2,trend:-0.2,signals:{inspections:72,actions:65,training:76,incidents:48,assets:68,observations:60}},
  "mfg-site-downtime-plant1":{score:2.6,trend:0.2,signals:{inspections:58,actions:50,training:64,incidents:44,assets:52,observations:48}},
  "mfg-site-inventory-plant2":{score:2.8,trend:-0.1,signals:{inspections:62,actions:54,training:68,incidents:46,assets:58,observations:52}},
  "qsr-speed":{score:3.6,trend:0.3,signals:{inspections:80,actions:72,training:84,incidents:62,assets:76,observations:70}},
  "qsr-accuracy":{score:4.0,trend:0.2,signals:{inspections:88,actions:80,training:90,incidents:72,assets:84,observations:78}},
  "qsr-guest-satisfaction":{score:3.4,trend:0.1,signals:{inspections:76,actions:68,training:80,incidents:58,assets:72,observations:66}},
  "qsr-food-safety":{score:4.2,trend:0.3,signals:{inspections:92,actions:85,training:94,incidents:78,assets:88,observations:82}},
  "qsr-food-quality":{score:3.8,trend:0.2,signals:{inspections:84,actions:76,training:86,incidents:66,assets:80,observations:74}},
  "qsr-audit-scores":{score:3.5,trend:0.1,signals:{inspections:78,actions:70,training:82,incidents:60,assets:74,observations:68}},
  "qsr-labor-cost":{score:2.8,trend:-0.1,signals:{inspections:62,actions:54,training:68,incidents:46,assets:58,observations:52}},
  "qsr-retention":{score:2.4,trend:-0.3,signals:{inspections:52,actions:44,training:58,incidents:38,assets:48,observations:42}},
  "qsr-scheduling":{score:3.1,trend:0.0,signals:{inspections:70,actions:62,training:74,incidents:52,assets:66,observations:60}},
  "qsr-training":{score:3.3,trend:0.2,signals:{inspections:74,actions:66,training:82,incidents:56,assets:70,observations:64}},
  "qsr-food-cost":{score:3.0,trend:0.0,signals:{inspections:68,actions:60,training:72,incidents:50,assets:64,observations:58}},
  "qsr-waste":{score:2.6,trend:-0.1,signals:{inspections:58,actions:50,training:64,incidents:44,assets:54,observations:48}},
  "qsr-inventory":{score:3.2,trend:0.1,signals:{inspections:72,actions:64,training:76,incidents:54,assets:68,observations:62}},
  "qsr-sss":{score:3.7,trend:0.3,signals:{inspections:82,actions:74,training:86,incidents:64,assets:78,observations:72}},
  "qsr-profitability":{score:3.4,trend:0.2,signals:{inspections:76,actions:68,training:80,incidents:58,assets:72,observations:66}},
  "qsr-daypart":{score:2.9,trend:0.1,signals:{inspections:64,actions:56,training:70,incidents:48,assets:60,observations:54}},
  "qsr-consistency":{score:3.0,trend:0.0,signals:{inspections:68,actions:60,training:72,incidents:50,assets:64,observations:58}},
  "qsr-new-unit":{score:2.7,trend:-0.1,signals:{inspections:60,actions:52,training:66,incidents:46,assets:56,observations:50}},
  "qsr-franchise-compliance":{score:3.5,trend:0.2,signals:{inspections:78,actions:70,training:82,incidents:60,assets:74,observations:68}},
  "qsr-drive-thru":{score:3.8,trend:0.3,signals:{inspections:84,actions:76,training:88,incidents:66,assets:80,observations:74}},
  "qsr-digital":{score:3.1,trend:0.2,signals:{inspections:70,actions:62,training:74,incidents:52,assets:66,observations:60}},
  "qsr-delivery":{score:2.8,trend:0.0,signals:{inspections:62,actions:54,training:68,incidents:46,assets:58,observations:52}},
  "qsr-kitchen":{score:3.3,trend:0.1,signals:{inspections:74,actions:66,training:78,incidents:56,assets:70,observations:64}},
  "tl-otd":{score:3.9,trend:0.3,signals:{inspections:86,actions:78,training:88,incidents:70,assets:82,observations:76}},
  "tl-first-attempt":{score:3.5,trend:0.2,signals:{inspections:78,actions:70,training:82,incidents:60,assets:74,observations:68}},
  "tl-accuracy-damage":{score:4.0,trend:0.2,signals:{inspections:88,actions:80,training:90,incidents:72,assets:84,observations:78}},
  "tl-dwell":{score:2.8,trend:-0.1,signals:{inspections:62,actions:54,training:68,incidents:46,assets:58,observations:52}},
  "tl-fleet-utilization":{score:3.2,trend:0.1,signals:{inspections:72,actions:64,training:76,incidents:54,assets:68,observations:62}},
  "tl-vehicle-uptime":{score:3.0,trend:0.0,signals:{inspections:68,actions:60,training:72,incidents:50,assets:64,observations:58}},
  "tl-trailer-pool":{score:2.6,trend:-0.2,signals:{inspections:58,actions:50,training:64,incidents:44,assets:54,observations:48}},
  "tl-dock-throughput":{score:3.4,trend:0.2,signals:{inspections:76,actions:68,training:80,incidents:58,assets:72,observations:66}},
  "tl-cross-dock":{score:3.1,trend:0.1,signals:{inspections:70,actions:62,training:74,incidents:52,assets:66,observations:60}},
  "tl-inventory-fulfillment":{score:3.6,trend:0.2,signals:{inspections:80,actions:72,training:84,incidents:62,assets:76,observations:70}},
  "tl-route-efficiency":{score:3.3,trend:0.1,signals:{inspections:74,actions:66,training:78,incidents:56,assets:70,observations:64}},
  "tl-deadhead":{score:2.5,trend:-0.2,signals:{inspections:56,actions:48,training:62,incidents:42,assets:52,observations:46}},
  "tl-cube-utilization":{score:2.9,trend:0.0,signals:{inspections:64,actions:56,training:70,incidents:48,assets:60,observations:54}},
  "tl-driver-safety":{score:4.1,trend:0.3,signals:{inspections:90,actions:82,training:92,incidents:74,assets:86,observations:80}},
  "tl-hos":{score:4.3,trend:0.2,signals:{inspections:94,actions:86,training:96,incidents:80,assets:90,observations:84}},
  "tl-driver-retention":{score:2.4,trend:-0.3,signals:{inspections:52,actions:44,training:58,incidents:38,assets:48,observations:42}},
  "tl-cost-per-mile":{score:3.0,trend:0.0,signals:{inspections:68,actions:60,training:72,incidents:50,assets:64,observations:58}},
  "tl-fuel":{score:3.2,trend:0.1,signals:{inspections:72,actions:64,training:76,incidents:54,assets:68,observations:62}},
  "tl-freight-spend":{score:2.7,trend:-0.1,signals:{inspections:60,actions:52,training:66,incidents:46,assets:56,observations:50}},
  "tl-visibility":{score:3.7,trend:0.3,signals:{inspections:82,actions:74,training:86,incidents:64,assets:78,observations:72}},
  "tl-exceptions":{score:3.4,trend:0.2,signals:{inspections:76,actions:68,training:80,incidents:58,assets:72,observations:66}},
  "tl-eta":{score:3.8,trend:0.2,signals:{inspections:84,actions:76,training:88,incidents:66,assets:80,observations:74}},
  "tl-pod":{score:3.5,trend:0.2,signals:{inspections:78,actions:70,training:82,incidents:60,assets:74,observations:68}},
};

const computeAggregateScore=(goalIds)=>{
  const scored=goalIds.filter(id=>GOAL_SCORES[id]);
  if(scored.length===0)return{score:0,trend:0,count:0};
  const total=scored.reduce((s,id)=>s+GOAL_SCORES[id].score,0);
  const trendTotal=scored.reduce((s,id)=>s+GOAL_SCORES[id].trend,0);
  return{score:Math.round((total/scored.length)*10)/10,trend:Math.round((trendTotal/scored.length)*10)/10,count:scored.length};
};

const computeSignalAverages=(goalIds)=>{
  const scored=goalIds.filter(id=>GOAL_SCORES[id]);
  if(scored.length===0)return{};
  const sums={};const counts={};
  scored.forEach(id=>{const s=GOAL_SCORES[id].signals;Object.keys(s).forEach(k=>{sums[k]=(sums[k]||0)+s[k];counts[k]=(counts[k]||0)+1;});});
  const avg={};Object.keys(sums).forEach(k=>{avg[k]=Math.round(sums[k]/counts[k]);});
  return avg;
};

/* ═══ CONNECTOR MAP (goal → data sources) ═══ */
const CONNECTOR_MAP={
  // Manufacturing
  "mfg-oee":[{id:"mes",name:"MES",desc:"Manufacturing Execution System"}],
  "mfg-throughput":[{id:"mes",name:"MES",desc:"Manufacturing Execution System"}],
  "mfg-changeover":[{id:"mes",name:"MES",desc:"Manufacturing Execution System"}],
  "mfg-scheduling":[{id:"erp",name:"ERP",desc:"Enterprise Resource Planning"},{id:"mes",name:"MES",desc:"Manufacturing Execution System"}],
  "mfg-defects":[{id:"qms",name:"QMS",desc:"Quality Management System"},{id:"mes",name:"MES",desc:"Manufacturing Execution System"}],
  "mfg-supplier-quality":[{id:"qms",name:"QMS",desc:"Quality Management System"},{id:"erp",name:"ERP",desc:"Enterprise Resource Planning"}],
  "mfg-regulatory":[{id:"qms",name:"QMS",desc:"Quality Management System"}],
  "mfg-customer-complaints":[{id:"qms",name:"QMS",desc:"Quality Management System"},{id:"crm",name:"CRM",desc:"Customer Relationship Mgmt"}],
  "mfg-downtime":[{id:"cmms",name:"CMMS",desc:"Maintenance Management System"},{id:"mes",name:"MES",desc:"Manufacturing Execution System"}],
  "mfg-preventive-maintenance":[{id:"cmms",name:"CMMS",desc:"Maintenance Management System"}],
  "mfg-spare-parts":[{id:"cmms",name:"CMMS",desc:"Maintenance Management System"},{id:"erp",name:"ERP",desc:"Enterprise Resource Planning"}],
  "mfg-raw-inventory":[{id:"erp",name:"ERP",desc:"Enterprise Resource Planning"}],
  "mfg-otif":[{id:"erp",name:"ERP",desc:"Enterprise Resource Planning"},{id:"wms",name:"WMS",desc:"Warehouse Management System"}],
  "mfg-wip":[{id:"mes",name:"MES",desc:"Manufacturing Execution System"},{id:"erp",name:"ERP",desc:"Enterprise Resource Planning"}],
  "mfg-supply-resilience":[{id:"erp",name:"ERP",desc:"Enterprise Resource Planning"}],
  "mfg-injuries":[{id:"ehs",name:"EHS",desc:"Environment Health & Safety"}],
  "mfg-turnover":[{id:"hris",name:"HRIS",desc:"HR Information System"}],
  "mfg-training":[{id:"lms",name:"LMS",desc:"Learning Management System"},{id:"hris",name:"HRIS",desc:"HR Information System"}],
  "mfg-labor-utilization":[{id:"hris",name:"HRIS",desc:"HR Information System"},{id:"mes",name:"MES",desc:"Manufacturing Execution System"}],
  "mfg-cost-per-unit":[{id:"erp",name:"ERP",desc:"Enterprise Resource Planning"}],
  "mfg-energy":[{id:"scada",name:"SCADA",desc:"Supervisory Control & Data Acq."}],
  "mfg-scrap":[{id:"mes",name:"MES",desc:"Manufacturing Execution System"},{id:"qms",name:"QMS",desc:"Quality Management System"}],
  "mfg-asset-utilization":[{id:"mes",name:"MES",desc:"Manufacturing Execution System"}],
  "mfg-lead-time":[{id:"erp",name:"ERP",desc:"Enterprise Resource Planning"},{id:"mes",name:"MES",desc:"Manufacturing Execution System"}],
  // QSR
  "qsr-speed":[{id:"pos",name:"POS",desc:"Point of Sale System"},{id:"dtt",name:"Drive-Thru Timer",desc:"Timer & sensor system"}],
  "qsr-accuracy":[{id:"pos",name:"POS",desc:"Point of Sale System"},{id:"kds",name:"KDS",desc:"Kitchen Display System"}],
  "qsr-guest-satisfaction":[{id:"pos",name:"POS",desc:"Point of Sale System"},{id:"survey",name:"Survey",desc:"Guest feedback platform"}],
  "qsr-food-safety":[{id:"fst",name:"Food Safety",desc:"Digital temp logs & HACCP"}],
  "qsr-food-quality":[{id:"fst",name:"Food Safety",desc:"Digital temp logs & HACCP"}],
  "qsr-audit-scores":[{id:"audit",name:"Audit Platform",desc:"Brand standards auditing"}],
  "qsr-labor-cost":[{id:"wfm",name:"WFM",desc:"Workforce Management"},{id:"pos",name:"POS",desc:"Point of Sale System"}],
  "qsr-retention":[{id:"wfm",name:"WFM",desc:"Workforce Management"},{id:"hris",name:"HRIS",desc:"HR Information System"}],
  "qsr-scheduling":[{id:"wfm",name:"WFM",desc:"Workforce Management"}],
  "qsr-training":[{id:"lms",name:"LMS",desc:"Learning Management System"}],
  "qsr-food-cost":[{id:"inv",name:"Inventory",desc:"Inventory & ordering system"},{id:"pos",name:"POS",desc:"Point of Sale System"}],
  "qsr-waste":[{id:"inv",name:"Inventory",desc:"Inventory & ordering system"}],
  "qsr-inventory":[{id:"inv",name:"Inventory",desc:"Inventory & ordering system"}],
  "qsr-sss":[{id:"pos",name:"POS",desc:"Point of Sale System"}],
  "qsr-profitability":[{id:"pos",name:"POS",desc:"Point of Sale System"},{id:"erp",name:"ERP",desc:"Enterprise Resource Planning"}],
  "qsr-daypart":[{id:"pos",name:"POS",desc:"Point of Sale System"}],
  "qsr-consistency":[{id:"audit",name:"Audit Platform",desc:"Brand standards auditing"},{id:"pos",name:"POS",desc:"Point of Sale System"}],
  "qsr-new-unit":[{id:"pos",name:"POS",desc:"Point of Sale System"}],
  "qsr-franchise-compliance":[{id:"audit",name:"Audit Platform",desc:"Brand standards auditing"}],
  "qsr-drive-thru":[{id:"dtt",name:"Drive-Thru Timer",desc:"Timer & sensor system"},{id:"pos",name:"POS",desc:"Point of Sale System"}],
  "qsr-digital":[{id:"pos",name:"POS",desc:"Point of Sale System"},{id:"app",name:"Mobile App",desc:"Digital ordering platform"}],
  "qsr-delivery":[{id:"pos",name:"POS",desc:"Point of Sale System"},{id:"dsp",name:"Delivery Platform",desc:"3rd-party delivery integration"}],
  "qsr-kitchen":[{id:"kds",name:"KDS",desc:"Kitchen Display System"},{id:"pos",name:"POS",desc:"Point of Sale System"}],
  // Transport & Logistics
  "tl-otd":[{id:"tms",name:"TMS",desc:"Transportation Management System"}],
  "tl-first-attempt":[{id:"tms",name:"TMS",desc:"Transportation Management System"},{id:"gps",name:"GPS Tracking",desc:"Real-time GPS platform"}],
  "tl-accuracy-damage":[{id:"wms",name:"WMS",desc:"Warehouse Management System"}],
  "tl-dwell":[{id:"tms",name:"TMS",desc:"Transportation Management System"},{id:"ydm",name:"Yard Mgmt",desc:"Yard management system"}],
  "tl-fleet-utilization":[{id:"tms",name:"TMS",desc:"Transportation Management System"},{id:"eld",name:"ELD/Telematics",desc:"Electronic logging device"}],
  "tl-vehicle-uptime":[{id:"fms",name:"Fleet Maint",desc:"Fleet maintenance system"},{id:"eld",name:"ELD/Telematics",desc:"Electronic logging device"}],
  "tl-trailer-pool":[{id:"tms",name:"TMS",desc:"Transportation Management System"}],
  "tl-dock-throughput":[{id:"wms",name:"WMS",desc:"Warehouse Management System"},{id:"ydm",name:"Yard Mgmt",desc:"Yard management system"}],
  "tl-cross-dock":[{id:"wms",name:"WMS",desc:"Warehouse Management System"}],
  "tl-inventory-fulfillment":[{id:"wms",name:"WMS",desc:"Warehouse Management System"}],
  "tl-route-efficiency":[{id:"tms",name:"TMS",desc:"Transportation Management System"},{id:"gps",name:"GPS Tracking",desc:"Real-time GPS platform"}],
  "tl-deadhead":[{id:"tms",name:"TMS",desc:"Transportation Management System"}],
  "tl-cube-utilization":[{id:"tms",name:"TMS",desc:"Transportation Management System"}],
  "tl-driver-safety":[{id:"eld",name:"ELD/Telematics",desc:"Electronic logging device"},{id:"dashcam",name:"Dashcam AI",desc:"Driver safety cameras"}],
  "tl-hos":[{id:"eld",name:"ELD/Telematics",desc:"Electronic logging device"}],
  "tl-driver-retention":[{id:"hris",name:"HRIS",desc:"HR Information System"},{id:"eld",name:"ELD/Telematics",desc:"Electronic logging device"}],
  "tl-cost-per-mile":[{id:"tms",name:"TMS",desc:"Transportation Management System"},{id:"erp",name:"ERP",desc:"Enterprise Resource Planning"}],
  "tl-fuel":[{id:"fuel",name:"Fuel Card",desc:"Fuel card management"},{id:"eld",name:"ELD/Telematics",desc:"Electronic logging device"}],
  "tl-freight-spend":[{id:"tms",name:"TMS",desc:"Transportation Management System"}],
  "tl-visibility":[{id:"tms",name:"TMS",desc:"Transportation Management System"},{id:"gps",name:"GPS Tracking",desc:"Real-time GPS platform"}],
  "tl-exceptions":[{id:"tms",name:"TMS",desc:"Transportation Management System"}],
  "tl-eta":[{id:"tms",name:"TMS",desc:"Transportation Management System"},{id:"gps",name:"GPS Tracking",desc:"Real-time GPS platform"}],
  "tl-pod":[{id:"epod",name:"ePOD",desc:"Electronic proof of delivery"},{id:"tms",name:"TMS",desc:"Transportation Management System"}],
};

/* ═══ WORKFLOW TEMPLATES (industry → workflows with goalId links) ═══ */
const WORKFLOW_TEMPLATES={
  manufacturing:[
    {id:"wf-quality-audit",name:"Quality Inspection Checklist",desc:"Daily quality audit process",steps:12,goalIds:["mfg-defects","mfg-regulatory","mfg-customer-complaints"]},
    {id:"wf-shift-handover",name:"Shift Handover Procedure",desc:"Structured shift transition",steps:8,goalIds:["mfg-throughput","mfg-scheduling","mfg-oee"]},
    {id:"wf-pm-schedule",name:"Preventive Maintenance Routine",desc:"Scheduled equipment PM",steps:10,goalIds:["mfg-downtime","mfg-preventive-maintenance"]},
    {id:"wf-incident-report",name:"Incident Reporting Flow",desc:"Safety event documentation",steps:10,goalIds:["mfg-injuries","mfg-regulatory"]},
    {id:"wf-supplier-receiving",name:"Supplier Receiving Inspection",desc:"Incoming material QC",steps:6,goalIds:["mfg-supplier-quality","mfg-raw-inventory"]},
    {id:"wf-changeover",name:"Changeover Procedure",desc:"Line changeover checklist",steps:8,goalIds:["mfg-changeover","mfg-oee"]},
  ],
  qsr:[
    {id:"wf-opening-checklist",name:"Opening Checklist",desc:"Store opening procedure",steps:14,goalIds:["qsr-food-safety","qsr-audit-scores","qsr-food-quality"]},
    {id:"wf-temp-log",name:"Temperature Logging",desc:"Hourly temp compliance",steps:6,goalIds:["qsr-food-safety","qsr-food-quality"]},
    {id:"wf-line-check",name:"Line Check & Positioning",desc:"Station setup for daypart",steps:8,goalIds:["qsr-speed","qsr-accuracy","qsr-labor-cost"]},
    {id:"wf-waste-tracking",name:"Waste & Discard Tracking",desc:"End-of-day waste log",steps:5,goalIds:["qsr-waste","qsr-food-cost"]},
    {id:"wf-crew-training",name:"New Crew Onboarding",desc:"Training flow for new hire",steps:12,goalIds:["qsr-training","qsr-retention"]},
    {id:"wf-delivery-handoff",name:"Delivery Order Handoff",desc:"3rd-party delivery QC",steps:6,goalIds:["qsr-delivery","qsr-accuracy"]},
  ],
  "transport-logistics":[
    {id:"wf-pre-trip",name:"Pre-Trip Inspection",desc:"DOT pre-trip checklist",steps:16,goalIds:["tl-vehicle-uptime","tl-driver-safety","tl-hos"]},
    {id:"wf-dock-receiving",name:"Dock Receiving & Check-in",desc:"Inbound trailer processing",steps:8,goalIds:["tl-dock-throughput","tl-dwell","tl-accuracy-damage"]},
    {id:"wf-pod-capture",name:"Proof of Delivery Capture",desc:"Electronic POD workflow",steps:5,goalIds:["tl-pod","tl-otd","tl-visibility"]},
    {id:"wf-exception-mgmt",name:"Exception Handling",desc:"Delay/damage escalation",steps:8,goalIds:["tl-exceptions","tl-eta","tl-visibility"]},
    {id:"wf-fuel-audit",name:"Fuel Card Reconciliation",desc:"Weekly fuel spend audit",steps:6,goalIds:["tl-fuel","tl-cost-per-mile"]},
    {id:"wf-driver-debrief",name:"Driver End-of-Day Debrief",desc:"Shift completion checklist",steps:7,goalIds:["tl-driver-safety","tl-hos","tl-driver-retention"]},
  ],
};

/* ═══ PEOPLE & ASSETS TEMPLATES ═══ */
const PEOPLE_ASSETS_TEMPLATES={
  manufacturing:{
    people:[
      {role:"Line Supervisors",goalIds:["mfg-throughput","mfg-changeover","mfg-scheduling","mfg-oee"]},
      {role:"Quality Inspectors",goalIds:["mfg-defects","mfg-regulatory","mfg-supplier-quality"]},
      {role:"Maintenance Technicians",goalIds:["mfg-downtime","mfg-preventive-maintenance","mfg-spare-parts"]},
      {role:"EHS Coordinators",goalIds:["mfg-injuries","mfg-regulatory"]},
      {role:"Process Engineers",goalIds:["mfg-oee","mfg-throughput","mfg-changeover","mfg-energy"]},
    ],
    assets:[
      {name:"Production Lines",goalIds:["mfg-oee","mfg-throughput","mfg-changeover","mfg-asset-utilization"]},
      {name:"CNC & Equipment",goalIds:["mfg-downtime","mfg-preventive-maintenance","mfg-asset-utilization"]},
      {name:"Warehouse Zones",goalIds:["mfg-raw-inventory","mfg-wip","mfg-otif"]},
      {name:"Quality Stations",goalIds:["mfg-defects","mfg-customer-complaints","mfg-regulatory"]},
    ],
  },
  qsr:{
    people:[
      {role:"Shift Leads",goalIds:["qsr-speed","qsr-accuracy","qsr-scheduling","qsr-labor-cost"]},
      {role:"Crew Members",goalIds:["qsr-training","qsr-accuracy","qsr-food-quality"]},
      {role:"Kitchen Staff",goalIds:["qsr-speed","qsr-kitchen","qsr-food-quality"]},
      {role:"District Managers",goalIds:["qsr-consistency","qsr-profitability","qsr-audit-scores"]},
    ],
    assets:[
      {name:"Kitchen Stations",goalIds:["qsr-speed","qsr-accuracy","qsr-kitchen"]},
      {name:"Drive-Thru Lane",goalIds:["qsr-drive-thru","qsr-speed"]},
      {name:"Refrigeration Units",goalIds:["qsr-food-safety","qsr-food-quality"]},
      {name:"POS Terminals",goalIds:["qsr-sss","qsr-digital","qsr-accuracy"]},
    ],
  },
  "transport-logistics":{
    people:[
      {role:"Dispatchers",goalIds:["tl-otd","tl-exceptions","tl-eta","tl-route-efficiency"]},
      {role:"Drivers",goalIds:["tl-driver-safety","tl-hos","tl-driver-retention"]},
      {role:"Dock Workers",goalIds:["tl-dock-throughput","tl-cross-dock","tl-dwell"]},
      {role:"Fleet Coordinators",goalIds:["tl-fleet-utilization","tl-vehicle-uptime","tl-fuel"]},
    ],
    assets:[
      {name:"Trucks & Tractors",goalIds:["tl-fleet-utilization","tl-vehicle-uptime","tl-fuel"]},
      {name:"Trailers",goalIds:["tl-trailer-pool","tl-cube-utilization"]},
      {name:"Dock Doors",goalIds:["tl-dock-throughput","tl-dwell"]},
      {name:"GPS / Telematics",goalIds:["tl-visibility","tl-eta","tl-driver-safety"]},
    ],
  },
};

/* ═══ CONNECTOR CATALOG ═══ */
const CONNECTOR_CATALOG=[
  {id:"ai_models",label:"AI Models",color:T.violet,connectors:[
    {id:"openai",name:"OpenAI",desc:"GPT models for text and vision"},
    {id:"anthropic",name:"Anthropic",desc:"Claude for reasoning and safety"},
    {id:"google_gemini",name:"Google Gemini",desc:"Multimodal AI from Google"},
    {id:"meta_llama",name:"Meta Llama",desc:"Open-source foundation models"},
    {id:"mistral",name:"Mistral",desc:"Efficient European AI models"},
    {id:"cohere",name:"Cohere",desc:"Enterprise NLP and embeddings"},
  ]},
  {id:"hris",label:"HRIS",color:T.highlight,connectors:[
    {id:"workday",name:"Workday",desc:"Enterprise HR and finance"},
    {id:"sap_successfactors",name:"SAP SuccessFactors",desc:"Cloud-based HCM suite"},
    {id:"bamboohr",name:"BambooHR",desc:"HR software for growing teams"},
    {id:"adp_workforce_now",name:"ADP Workforce Now",desc:"All-in-one HR and payroll"},
    {id:"ukg",name:"UKG",desc:"Workforce management platform"},
    {id:"rippling",name:"Rippling",desc:"Unified HR, IT, and finance"},
    {id:"gusto_hr",name:"Gusto",desc:"Payroll, benefits, and HR"},
    {id:"hibob",name:"HiBob",desc:"Modern HR for mid-market"},
    {id:"ceridian_dayforce",name:"Ceridian Dayforce",desc:"Cloud HCM platform"},
    {id:"oracle_hcm",name:"Oracle HCM",desc:"Enterprise human capital mgmt"},
  ]},
  {id:"payroll",label:"Payroll",color:T.green,connectors:[
    {id:"adp_payroll",name:"ADP",desc:"Payroll and tax services"},
    {id:"paychex",name:"Paychex",desc:"Payroll and HR solutions"},
    {id:"gusto_payroll",name:"Gusto",desc:"Modern payroll platform"},
    {id:"xero_payroll",name:"Xero Payroll",desc:"Cloud payroll for Xero users"},
    {id:"quickbooks_payroll",name:"QuickBooks Payroll",desc:"Intuit payroll integration"},
    {id:"ceridian_payroll",name:"Ceridian",desc:"Continuous payroll calculation"},
    {id:"deel",name:"Deel",desc:"Global payroll and compliance"},
    {id:"rippling_payroll",name:"Rippling",desc:"Automated payroll processing"},
    {id:"square_payroll",name:"Square Payroll",desc:"POS-integrated payroll"},
    {id:"sage_payroll",name:"Sage Payroll",desc:"UK and global payroll"},
  ]},
  {id:"erp",label:"ERP",color:T.amber,connectors:[
    {id:"sap_s4hana",name:"SAP S/4HANA",desc:"Next-gen enterprise ERP"},
    {id:"oracle_netsuite",name:"Oracle NetSuite",desc:"Cloud ERP and financials"},
    {id:"microsoft_dynamics",name:"Dynamics 365",desc:"Microsoft cloud ERP"},
    {id:"infor",name:"Infor",desc:"Industry-specific cloud ERP"},
    {id:"epicor",name:"Epicor",desc:"Manufacturing and distribution"},
    {id:"acumatica",name:"Acumatica",desc:"Cloud ERP for mid-market"},
  ]},
  {id:"pos",label:"Point of Sale",color:T.rose,connectors:[
    {id:"square_pos",name:"Square",desc:"Payments and POS platform"},
    {id:"lightspeed",name:"Lightspeed",desc:"Retail and restaurant POS"},
    {id:"toast",name:"Toast",desc:"Restaurant management platform"},
    {id:"shopify_pos",name:"Shopify POS",desc:"Unified commerce POS"},
    {id:"revel",name:"Revel",desc:"Cloud-based iPad POS"},
  ]},
  {id:"telematics",label:"Telematics",color:T.accent,connectors:[
    {id:"samsara",name:"Samsara",desc:"Fleet and equipment IoT"},
    {id:"geotab",name:"Geotab",desc:"Vehicle tracking and analytics"},
    {id:"verizon_connect",name:"Verizon Connect",desc:"Fleet management platform"},
  ]},
  {id:"public_reviews",label:"Public Reviews",color:T.pink,connectors:[
    {id:"google_reviews",name:"Google Reviews",desc:"Google Business review data"},
    {id:"yelp",name:"Yelp",desc:"Local business review platform"},
    {id:"tripadvisor",name:"TripAdvisor",desc:"Travel and dining reviews"},
    {id:"trustpilot",name:"Trustpilot",desc:"Consumer review platform"},
    {id:"facebook_reviews",name:"Facebook Reviews",desc:"Meta business reviews"},
  ]},
  {id:"asset_systems",label:"Asset Systems",color:T.amber,connectors:[
    {id:"upkeep",name:"UpKeep",desc:"Mobile-first maintenance CMMS"},
    {id:"fiix",name:"Fiix",desc:"AI-powered maintenance mgmt"},
    {id:"ibm_maximo",name:"IBM Maximo",desc:"Enterprise asset management"},
    {id:"maintainx",name:"MaintainX",desc:"Work order and procedure mgmt"},
  ]},
  {id:"databases_feeds",label:"Databases & Data Feeds",color:T.highlight,connectors:[
    {id:"postgresql",name:"PostgreSQL",desc:"Open-source relational database"},
    {id:"mysql",name:"MySQL",desc:"Popular open-source SQL database"},
    {id:"snowflake",name:"Snowflake",desc:"Cloud data warehouse"},
    {id:"bigquery",name:"BigQuery",desc:"Google serverless analytics"},
    {id:"redshift",name:"Amazon Redshift",desc:"AWS data warehouse"},
    {id:"rest_api",name:"REST API",desc:"Custom HTTP API connector"},
    {id:"webhooks",name:"Webhooks",desc:"Event-driven HTTP callbacks"},
    {id:"sftp",name:"SFTP",desc:"Secure file transfer protocol"},
  ]},
];

/* ═══ CATALOG APPS ═══ */
/* APP_CATALOG — rich app definitions with workflows, dashboards, and connectors.
   Each app declares goalIds, contains workflows/dashboards, and lists requiredConnectors.
   Duplicated per industry for prototype simplicity (flat data, no conditional logic). */
const APP_CATALOG=[
  /* ────── Manufacturing ────── */
  {
    id:"quality-mgmt",name:"Quality Management",
    description:"Inspection checklists, defect tracking, supplier receiving, and audit workflows",
    color:T.violet,category:"Quality",industry:"manufacturing",
    goalIds:["mfg-defects"],
    workflows:[
      {id:"wf-quality-audit",name:"Quality Inspection Checklist",desc:"Daily quality audit process",steps:12},
      {id:"wf-supplier-receiving",name:"Supplier Receiving Inspection",desc:"Incoming material QC",steps:6},
    ],
    dashboards:[
      {id:"db-quality-overview",name:"Quality Overview",desc:"First-pass yield, defects, and complaint trends"},
    ],
    requiredConnectors:["qms","mes","crm","erp"],
  },
  {
    id:"safety-compliance",name:"Safety & Compliance",
    description:"Incident reporting, safety audits, and regulatory tracking",
    color:T.rose,category:"Compliance",industry:"manufacturing",
    goalIds:["mfg-injuries"],
    workflows:[
      {id:"wf-incident-report",name:"Incident Reporting Flow",desc:"Safety event documentation",steps:10},
    ],
    dashboards:[
      {id:"db-safety-scorecard",name:"Safety Scorecard",desc:"TRIR, near-misses, and compliance scores"},
    ],
    requiredConnectors:["ehs","qms"],
  },
  {
    id:"mfg-maintenance",name:"Maintenance Manager",
    description:"Preventive maintenance, work orders, and asset health tracking",
    color:T.highlight,category:"Maintenance",industry:"manufacturing",
    goalIds:["mfg-downtime"],
    workflows:[
      {id:"wf-pm-schedule",name:"Preventive Maintenance Routine",desc:"Scheduled equipment PM",steps:10},
    ],
    dashboards:[
      {id:"db-maintenance-health",name:"Asset Health Dashboard",desc:"MTBF, PM compliance, and breakdown trends"},
    ],
    requiredConnectors:["cmms","mes"],
  },
  {
    id:"mfg-shift-mgmt",name:"Shift Management",
    description:"Handover processes, changeover procedures, and crew scheduling",
    color:T.amber,category:"Operations",industry:"manufacturing",
    goalIds:["mfg-throughput"],
    workflows:[
      {id:"wf-shift-handover",name:"Shift Handover Procedure",desc:"Structured shift transition",steps:8},
      {id:"wf-changeover",name:"Changeover Procedure",desc:"Line changeover checklist",steps:8},
    ],
    dashboards:[
      {id:"db-shift-performance",name:"Shift Performance",desc:"Throughput, schedule adherence, and OEE by shift"},
    ],
    requiredConnectors:["mes","erp"],
  },
  {
    id:"production-ops",name:"Production Operations",
    description:"Production scheduling, OEE tracking, and capacity optimisation",
    color:T.green,category:"Operations",industry:"manufacturing",
    goalIds:["mfg-oee"],
    workflows:[
      {id:"wf-daily-production",name:"Daily Production Review",desc:"OEE and throughput daily check",steps:8},
      {id:"wf-capacity-planning",name:"Capacity Planning Workflow",desc:"Weekly capacity and scheduling review",steps:6},
    ],
    dashboards:[
      {id:"db-oee-tracker",name:"OEE Tracker",desc:"Real-time OEE, availability, performance, and quality"},
      {id:"db-production-costs",name:"Production Cost Analysis",desc:"Cost per unit trending and variance"},
    ],
    requiredConnectors:["mes","erp"],
  },
  {
    id:"mfg-inventory-mgmt",name:"Inventory Management",
    description:"Raw material tracking, WIP reduction, and supply chain optimisation",
    color:T.amber,category:"Supply Chain",industry:"manufacturing",
    goalIds:["mfg-raw-inventory"],
    workflows:[
      {id:"wf-inventory-count",name:"Inventory Cycle Count",desc:"Periodic inventory accuracy check",steps:7},
      {id:"wf-reorder-review",name:"Reorder Point Review",desc:"Weekly stock level and reorder assessment",steps:5},
    ],
    dashboards:[
      {id:"db-inventory-health",name:"Inventory Health",desc:"Days on hand, turnover, and stockout alerts"},
    ],
    requiredConnectors:["erp","wms","mes"],
  },
  {
    id:"mfg-training-ops",name:"Training & Onboarding",
    description:"Operator training modules, certification tracking, and skill assessments",
    color:T.pink,category:"People",industry:"manufacturing",
    goalIds:["mfg-training"],
    workflows:[
      {id:"wf-operator-training",name:"Operator Certification Flow",desc:"Equipment-specific training and sign-off",steps:10},
      {id:"wf-new-hire-onboarding",name:"New Hire Onboarding",desc:"Manufacturing onboarding checklist",steps:12},
    ],
    dashboards:[
      {id:"db-training-compliance",name:"Training Compliance",desc:"Completion rates, expiring certs, and skills gaps"},
    ],
    requiredConnectors:["lms","hris"],
  },

  /* ────── QSR ────── */
  {
    id:"food-safety",name:"Food Safety",
    description:"HACCP compliance, temperature logs, and inspection workflows",
    color:T.green,category:"Compliance",industry:"qsr",
    goalIds:["qsr-food-safety"],
    workflows:[
      {id:"wf-opening-checklist",name:"Opening Checklist",desc:"Store opening procedure",steps:14},
      {id:"wf-temp-log",name:"Temperature Logging",desc:"Hourly temp compliance",steps:6},
    ],
    dashboards:[
      {id:"db-compliance-scorecard",name:"Compliance Scorecard",desc:"Food safety metrics and audit trends"},
    ],
    requiredConnectors:["fst","audit"],
  },
  {
    id:"qsr-shift-mgmt",name:"Shift Management",
    description:"Line checks, station positioning, and crew scheduling",
    color:T.amber,category:"Operations",industry:"qsr",
    goalIds:["qsr-speed"],
    workflows:[
      {id:"wf-line-check",name:"Line Check & Positioning",desc:"Station setup for daypart",steps:8},
    ],
    dashboards:[
      {id:"db-shift-performance-qsr",name:"Shift Performance",desc:"Speed of service, accuracy, and labor cost by shift"},
    ],
    requiredConnectors:["pos","dtt","kds","wfm"],
  },
  {
    id:"qsr-inventory-mgmt",name:"Inventory Management",
    description:"Waste tracking, food cost control, and stock management",
    color:T.amber,category:"Supply Chain",industry:"qsr",
    goalIds:["qsr-waste"],
    workflows:[
      {id:"wf-waste-tracking",name:"Waste & Discard Tracking",desc:"End-of-day waste log",steps:5},
    ],
    dashboards:[
      {id:"db-food-cost",name:"Food Cost Dashboard",desc:"Theoretical vs actual food cost and waste trends"},
    ],
    requiredConnectors:["inv","pos"],
  },
  {
    id:"qsr-training-ops",name:"Training & Onboarding",
    description:"New crew onboarding, certification tracking, and skill development",
    color:T.pink,category:"People",industry:"qsr",
    goalIds:["qsr-training"],
    workflows:[
      {id:"wf-crew-training",name:"New Crew Onboarding",desc:"Training flow for new hire",steps:12},
    ],
    dashboards:[
      {id:"db-crew-readiness",name:"Crew Readiness",desc:"Training completion, retention rates, and time-to-proficiency"},
    ],
    requiredConnectors:["lms","wfm","hris"],
  },
  {
    id:"delivery-ops",name:"Delivery Operations",
    description:"Third-party delivery handoff, digital order management, and accuracy tracking",
    color:T.highlight,category:"Operations",industry:"qsr",
    goalIds:["qsr-delivery"],
    workflows:[
      {id:"wf-delivery-handoff",name:"Delivery Order Handoff",desc:"3rd-party delivery QC",steps:6},
    ],
    dashboards:[
      {id:"db-delivery-performance",name:"Delivery Performance",desc:"Delivery volume, error rate, and profitability"},
    ],
    requiredConnectors:["pos","dsp","kds","app"],
  },
  {
    id:"restaurant-ops",name:"Restaurant Operations",
    description:"Drive-thru optimisation, kitchen management, and service speed tracking",
    color:T.rose,category:"Operations",industry:"qsr",
    goalIds:["qsr-drive-thru"],
    workflows:[
      {id:"wf-drive-thru-check",name:"Drive-Thru Performance Check",desc:"Hourly speed and accuracy review",steps:6},
      {id:"wf-kitchen-flow",name:"Kitchen Order Flow Review",desc:"Channel balancing and ticket time audit",steps:5},
    ],
    dashboards:[
      {id:"db-drive-thru",name:"Drive-Thru Dashboard",desc:"Cars per hour, average time, and accuracy"},
      {id:"db-kitchen-ops",name:"Kitchen Operations",desc:"Ticket times by channel and throttling events"},
    ],
    requiredConnectors:["dtt","pos","kds"],
  },

  /* ────── Transport & Logistics ────── */
  {
    id:"fleet-ops",name:"Fleet Operations",
    description:"Vehicle inspections, driver management, fuel audits, and route compliance",
    color:T.highlight,category:"Operations",industry:"transport-logistics",
    goalIds:["tl-vehicle-uptime"],
    workflows:[
      {id:"wf-pre-trip",name:"Pre-Trip Inspection",desc:"DOT pre-trip checklist",steps:16},
      {id:"wf-fuel-audit",name:"Fuel Card Reconciliation",desc:"Weekly fuel spend audit",steps:6},
      {id:"wf-driver-debrief",name:"Driver End-of-Day Debrief",desc:"Shift completion checklist",steps:7},
    ],
    dashboards:[
      {id:"db-fleet-health",name:"Fleet Health",desc:"Vehicle uptime, MTBF, and maintenance costs"},
      {id:"db-driver-safety",name:"Driver Safety Scorecard",desc:"Accident rates, HOS compliance, and CSA scores"},
    ],
    requiredConnectors:["fms","eld","dashcam","fuel","tms","erp","hris"],
  },
  {
    id:"dock-ops",name:"Dock Operations",
    description:"Dock receiving, check-in, cross-dock efficiency, and dwell time management",
    color:T.amber,category:"Operations",industry:"transport-logistics",
    goalIds:["tl-dock-throughput"],
    workflows:[
      {id:"wf-dock-receiving",name:"Dock Receiving & Check-in",desc:"Inbound trailer processing",steps:8},
    ],
    dashboards:[
      {id:"db-dock-throughput",name:"Dock Throughput",desc:"Loads per door, dwell time, and appointment adherence"},
    ],
    requiredConnectors:["wms","ydm","tms"],
  },
  {
    id:"delivery-tracking",name:"Delivery Tracking",
    description:"POD capture, exception handling, and real-time shipment visibility",
    color:T.green,category:"Operations",industry:"transport-logistics",
    goalIds:["tl-otd"],
    workflows:[
      {id:"wf-pod-capture",name:"Proof of Delivery Capture",desc:"Electronic POD workflow",steps:5},
      {id:"wf-exception-mgmt",name:"Exception Handling",desc:"Delay/damage escalation",steps:8},
    ],
    dashboards:[
      {id:"db-delivery-visibility",name:"Shipment Visibility",desc:"Real-time tracking, OTD rate, and ETA accuracy"},
    ],
    requiredConnectors:["epod","tms","gps"],
  },
  {
    id:"route-ops",name:"Route Optimisation",
    description:"Route planning, empty mile reduction, and load optimisation",
    color:T.violet,category:"Operations",industry:"transport-logistics",
    goalIds:["tl-route-efficiency"],
    workflows:[
      {id:"wf-route-review",name:"Daily Route Review",desc:"Planned vs actual route analysis",steps:6},
      {id:"wf-load-planning",name:"Load Planning Check",desc:"Cube and weight utilisation review",steps:5},
    ],
    dashboards:[
      {id:"db-route-efficiency",name:"Route Efficiency",desc:"Miles per stop, deadhead ratio, and cube utilisation"},
    ],
    requiredConnectors:["tms","gps"],
  },
  {
    id:"tl-inventory-mgmt",name:"Inventory Management",
    description:"Warehouse inventory accuracy and pick-pack-ship optimisation",
    color:T.amber,category:"Supply Chain",industry:"transport-logistics",
    goalIds:["tl-inventory-fulfillment"],
    workflows:[
      {id:"wf-warehouse-count",name:"Warehouse Cycle Count",desc:"Inventory accuracy verification",steps:7},
      {id:"wf-fulfillment-check",name:"Fulfillment Quality Check",desc:"Pick accuracy and order completeness audit",steps:5},
    ],
    dashboards:[
      {id:"db-warehouse-ops",name:"Warehouse Operations",desc:"Inventory accuracy, order cycle time, and fulfillment speed"},
    ],
    requiredConnectors:["wms"],
  },
];

/* ═══ APP CATALOG HELPERS ═══ */
const getAppsByIndustry=(industry)=>APP_CATALOG.filter(a=>!a.industry||a.industry===industry);
const getAppsForGoal=(goalId)=>APP_CATALOG.filter(a=>a.goalIds.includes(goalId));
const getAppWorkflowsForGoal=(goalId)=>APP_CATALOG.filter(a=>a.goalIds.includes(goalId)).flatMap(a=>a.workflows.map(w=>({...w,appId:a.id,appName:a.name})));
const getAppConnectorsForGoal=(goalId)=>{
  const ids=new Set();const result=[];
  APP_CATALOG.filter(a=>a.goalIds.includes(goalId)).forEach(a=>{
    (a.requiredConnectors||[]).forEach(cId=>{if(!ids.has(cId)){ids.add(cId);result.push(cId);}});
  });
  return result;
};
const getConnectorById=(cId)=>{
  /* Try individual connector first */
  for(const cat of CONNECTOR_CATALOG){
    const found=cat.connectors.find(c=>c.id===cId);
    if(found)return{...found,category:cat.label,categoryColor:cat.color};
  }
  /* Fall back to category-level match (apps reference category IDs) */
  const cat=CONNECTOR_CATALOG.find(c=>c.id===cId);
  if(cat)return{id:cat.id,name:cat.label,desc:cat.connectors[0]?.desc||"",category:cat.label,categoryColor:cat.color,isCategory:true};
  return null;
};

/* ═══ APP AGENT INSIGHTS ═══ */
/* Each app has a named AI agent that proactively surfaces insights.
   proactive: the co-pilot strip message — one urgent thing, first person, with a recommended action
   metricFlag: index of the metric card to annotate with agent badge (0-based)
   agentActions: things the agent has already done (shown in activity feed)
*/
const APP_AGENT_INSIGHTS={
  /* Manufacturing */
  "quality-mgmt":{
    agent:"Quality Agent",
    status:"active",
    lastRun:"12 min ago",
    proactive:{message:"Line 3 first-pass yield dropped 4.2% last shift. I've traced it to the bearing replacement on Station 7 — want me to draft a corrective action?",action:"Review",actionType:"review"},
    metricFlag:0,
    agentActions:[
      {text:"Correlated defect spike with Station 7 bearing replacement",time:"11 min ago"},
      {text:"Notified shift supervisor R. Patel about Line 3 hold",time:"18 min ago"},
    ],
    insights:[
      {type:"alert",title:"Defect spike on Line 3",desc:"First-pass yield dropped 4.2% in the last shift. Root cause appears linked to the bearing replacement on Station 7.",severity:"high",time:"11 min ago"},
      {type:"trend",title:"Supplier quality improving",desc:"Incoming material rejection rate down 18% over 30 days. Top 3 suppliers all above 98% acceptance.",severity:"positive",time:"2 hrs ago"},
      {type:"recommendation",title:"Schedule audit for Line 1",desc:"Line 1 hasn't had a quality audit in 14 days. Based on historical patterns, scheduling one this week could prevent a compliance gap.",severity:"medium",time:"4 hrs ago"},
    ],
  },
  "safety-compliance":{
    agent:"Safety Agent",
    status:"active",
    lastRun:"8 min ago",
    proactive:{message:"Zone B has had 3 near-miss reports this week — that's double the monthly average. I'd recommend a safety walk-through today before it becomes an incident.",action:"Schedule",actionType:"schedule"},
    metricFlag:1,
    agentActions:[
      {text:"Flagged Zone B near-miss cluster for review",time:"25 min ago"},
      {text:"Sent LOTO-04 review reminder to EHS team",time:"1 hr ago"},
    ],
    insights:[
      {type:"alert",title:"Near-miss cluster in Zone B",desc:"3 near-miss reports filed in Zone B this week — 2x the monthly average. Recommend a safety walk-through.",severity:"high",time:"25 min ago"},
      {type:"trend",title:"TRIR trending down",desc:"Total Recordable Incident Rate has decreased 22% quarter-over-quarter. EHS training completion correlates strongly.",severity:"positive",time:"1 hr ago"},
      {type:"recommendation",title:"Update lockout/tagout procedure",desc:"Procedure LOTO-04 hasn't been reviewed in 11 months. Regulatory best practice is every 6 months.",severity:"medium",time:"3 hrs ago"},
    ],
  },
  "mfg-maintenance":{
    agent:"Maintenance Agent",
    status:"active",
    lastRun:"5 min ago",
    proactive:{message:"CNC-07 spindle bearing is running 12°C above baseline. I'm estimating a 34% failure probability within 72 hours — should I create a work order?",action:"Create WO",actionType:"approve"},
    metricFlag:0,
    agentActions:[
      {text:"Detected temperature anomaly on CNC-07 spindle bearing",time:"5 min ago"},
      {text:"Checked spare parts inventory — filter kits running low",time:"1 hr ago"},
    ],
    insights:[
      {type:"alert",title:"Bearing temp anomaly — CNC-07",desc:"Temperature readings 12°C above baseline on CNC-07 spindle bearing. Failure probability: 34% within 72 hours.",severity:"high",time:"5 min ago"},
      {type:"trend",title:"PM compliance at 94%",desc:"Preventive maintenance completion rate improved from 87% to 94% over the last 60 days.",severity:"positive",time:"1 hr ago"},
      {type:"recommendation",title:"Reorder spare filter kits",desc:"Filter kit inventory will hit zero in ~8 days based on current usage. Lead time is 5 business days.",severity:"medium",time:"2 hrs ago"},
    ],
  },
  "mfg-shift-mgmt":{
    agent:"Shift Agent",
    status:"active",
    lastRun:"18 min ago",
    proactive:{message:"Overtime is at 112% of budget this week — night shift is driving it. I've identified 2 day-shift operators who could move to evening to rebalance. Want to see the plan?",action:"View Plan",actionType:"review"},
    metricFlag:2,
    agentActions:[
      {text:"Analysed overtime spend by shift and flagged budget overrun",time:"18 min ago"},
      {text:"Identified rebalancing opportunity across day/evening shifts",time:"45 min ago"},
    ],
    insights:[
      {type:"alert",title:"Overtime trending above budget",desc:"Week-to-date overtime is at 112% of budget. Night shift is the primary driver.",severity:"high",time:"18 min ago"},
      {type:"trend",title:"Changeover time reduced",desc:"Average changeover time down 11 min (from 42 to 31 min) since new procedure was implemented.",severity:"positive",time:"3 hrs ago"},
      {type:"recommendation",title:"Rebalance crew allocation",desc:"Day shift is overstaffed by 2 operators vs demand. Suggest reassigning to evening shift which is short.",severity:"medium",time:"5 hrs ago"},
    ],
  },
  "production-ops":{
    agent:"Production Agent",
    status:"active",
    lastRun:"3 min ago",
    proactive:{message:"Line 2 OEE is at 71% — well below the 85% target. Three unplanned stops in 4 hours. Availability is the bottleneck. Want me to pull the stop logs?",action:"Investigate",actionType:"investigate"},
    metricFlag:0,
    agentActions:[
      {text:"Identified availability as primary OEE constraint on Line 2",time:"3 min ago"},
      {text:"Cross-referenced stop logs with maintenance schedule",time:"15 min ago"},
    ],
    insights:[
      {type:"alert",title:"OEE below target on Line 2",desc:"Line 2 OEE at 71% vs 85% target. Availability is the constraint — 3 unplanned stops in the last 4 hours.",severity:"high",time:"3 min ago"},
      {type:"trend",title:"Throughput up 6% this week",desc:"Overall throughput increased 6% week-over-week. Line 1 and Line 4 are the top contributors.",severity:"positive",time:"1 hr ago"},
      {type:"recommendation",title:"Review scheduling algorithm",desc:"Current scheduling creates 23% idle time between runs. Optimising job sequencing could recover ~45 min/shift.",severity:"medium",time:"4 hrs ago"},
    ],
  },
  "mfg-inventory-mgmt":{
    agent:"Inventory Agent",
    status:"active",
    lastRun:"22 min ago",
    proactive:{message:"Aluminium billet stock hits safety threshold in 3 days, but supplier lead time is 5 days. I'd place the order today — want me to draft a PO?",action:"Draft PO",actionType:"approve"},
    metricFlag:0,
    agentActions:[
      {text:"Calculated stockout risk timeline for aluminium billets",time:"22 min ago"},
      {text:"Found $2,800 freight savings by consolidating 5 SKU reorders",time:"2 hrs ago"},
    ],
    insights:[
      {type:"alert",title:"Raw material stockout risk",desc:"Aluminium billet stock will fall below safety threshold in 3 days. Supplier lead time is 5 days.",severity:"high",time:"22 min ago"},
      {type:"trend",title:"WIP inventory declining",desc:"Work-in-progress value decreased 15% over 30 days, freeing $42k in working capital.",severity:"positive",time:"2 hrs ago"},
      {type:"recommendation",title:"Consolidate reorder points",desc:"5 SKUs have overlapping reorder windows. Consolidating orders could save ~$2,800 in freight costs.",severity:"medium",time:"6 hrs ago"},
    ],
  },
  "mfg-training-ops":{
    agent:"Training Agent",
    status:"active",
    lastRun:"45 min ago",
    proactive:{message:"Three CNC operation certifications expire this week — M. Torres, K. Singh, and R. Patel. Thursday training slots are open. Should I book them in?",action:"Book Slots",actionType:"approve"},
    metricFlag:0,
    agentActions:[
      {text:"Identified 3 expiring certifications and matched to open slots",time:"45 min ago"},
      {text:"Updated onboarding playbook with new time-to-proficiency data",time:"3 hrs ago"},
    ],
    insights:[
      {type:"alert",title:"3 certifications expiring this week",desc:"CNC operation certs for M. Torres, K. Singh, and R. Patel expire within 7 days. Training slots available Thursday.",severity:"high",time:"45 min ago"},
      {type:"trend",title:"Onboarding time reduced",desc:"Average time-to-proficiency for new operators down from 18 to 14 days since updated training modules.",severity:"positive",time:"3 hrs ago"},
      {type:"recommendation",title:"Cross-train Line 2 operators",desc:"Line 2 has single-operator dependency on 3 stations. Cross-training reduces production risk.",severity:"medium",time:"5 hrs ago"},
    ],
  },
  /* QSR */
  "food-safety":{
    agent:"Food Safety Agent",
    status:"active",
    lastRun:"6 min ago",
    proactive:{message:"Walk-in Unit 2 hit 42°F at 6:15am — above the 40°F threshold. It recovered by 6:28am but I'd investigate the compressor. Want me to log a maintenance ticket?",action:"Log Ticket",actionType:"approve"},
    metricFlag:0,
    agentActions:[
      {text:"Detected temp excursion on Walk-in Unit 2 and verified recovery",time:"6 min ago"},
      {text:"Correlated audit score improvement with opening checklist compliance",time:"1 hr ago"},
    ],
    insights:[
      {type:"alert",title:"Walk-in cooler temp variance",desc:"Unit 2 walk-in recorded 42°F at 6:15am — above the 40°F threshold. Returned to range by 6:28am but needs investigation.",severity:"high",time:"6 min ago"},
      {type:"trend",title:"Audit scores improving",desc:"Rolling 30-day food safety audit score is 96.2, up from 93.1 last month. Opening checklist compliance is the key driver.",severity:"positive",time:"1 hr ago"},
      {type:"recommendation",title:"Add midday temp check",desc:"Historical data shows 2pm-4pm is the highest risk window for temp excursions. Adding a scheduled check could prevent 60% of violations.",severity:"medium",time:"3 hrs ago"},
    ],
  },
  "qsr-shift-mgmt":{
    agent:"Shift Agent",
    status:"active",
    lastRun:"14 min ago",
    proactive:{message:"Lunch rush drive-thru hit 4:12 average — well over the 3:30 target. Station 2 was the bottleneck. I'd move one crew member from counter to support. Want me to flag it for the shift lead?",action:"Flag Lead",actionType:"review"},
    metricFlag:0,
    agentActions:[
      {text:"Identified Station 2 as drive-thru bottleneck during lunch",time:"14 min ago"},
      {text:"Analysed last 4 Fridays and found 22% volume gap vs staffing",time:"2 hrs ago"},
    ],
    insights:[
      {type:"alert",title:"Drive-thru speed above target",desc:"Average service time hit 4:12 during lunch rush vs 3:30 target. Station 2 bottleneck identified.",severity:"high",time:"14 min ago"},
      {type:"trend",title:"Order accuracy at 98.4%",desc:"Accuracy rate up 1.2% since new line check procedure was introduced 3 weeks ago.",severity:"positive",time:"2 hrs ago"},
      {type:"recommendation",title:"Adjust staffing for Friday peak",desc:"Last 4 Fridays showed 22% higher volume than scheduled labour. Suggest adding 2 crew for 11am-2pm.",severity:"medium",time:"4 hrs ago"},
    ],
  },
  "qsr-inventory-mgmt":{
    agent:"Inventory Agent",
    status:"active",
    lastRun:"30 min ago",
    proactive:{message:"Yesterday's waste hit 4.8% of food cost — well above the 3.5% target. Fry station discards are the main driver. Cutting batch sizes 20% during off-peak could fix it. Want the details?",action:"View Details",actionType:"review"},
    metricFlag:0,
    agentActions:[
      {text:"Traced waste spike to fry station batch sizing during off-peak",time:"30 min ago"},
      {text:"Calculated theoretical vs actual food cost gap improvement",time:"2 hrs ago"},
    ],
    insights:[
      {type:"alert",title:"Waste above threshold",desc:"Yesterday's waste was 4.8% of food cost vs 3.5% target. Fry station discards were the main contributor.",severity:"high",time:"30 min ago"},
      {type:"trend",title:"Food cost trending down",desc:"Theoretical vs actual food cost gap narrowed from 2.1% to 1.4% over 30 days.",severity:"positive",time:"2 hrs ago"},
      {type:"recommendation",title:"Review batch sizes at fry station",desc:"Reducing batch size by 20% during off-peak could cut fry waste by ~35% without impacting speed.",severity:"medium",time:"5 hrs ago"},
    ],
  },
  "qsr-training-ops":{
    agent:"Training Agent",
    status:"active",
    lastRun:"1 hr ago",
    proactive:{message:"J. Martinez is behind on training — 2 of 6 modules done by day 5 (target is 4). I can assign catch-up modules for this afternoon. Should I?",action:"Assign",actionType:"approve"},
    metricFlag:0,
    agentActions:[
      {text:"Flagged J. Martinez training gap against day-5 milestone",time:"1 hr ago"},
      {text:"Compiled list of 8 crew needing food safety refresher",time:"3 hrs ago"},
    ],
    insights:[
      {type:"alert",title:"New hire behind on training",desc:"J. Martinez (started 5 days ago) has only completed 2 of 6 required modules. Target is 4 by day 5.",severity:"high",time:"1 hr ago"},
      {type:"trend",title:"Retention improving",desc:"90-day retention rate up to 78% from 64% since structured onboarding was introduced.",severity:"positive",time:"3 hrs ago"},
      {type:"recommendation",title:"Schedule food safety refresher",desc:"8 crew members are due for annual food safety refresher within 30 days.",severity:"medium",time:"4 hrs ago"},
    ],
  },
  "delivery-ops":{
    agent:"Delivery Agent",
    status:"active",
    lastRun:"10 min ago",
    proactive:{message:"DoorDash error rate spiked to 6.2% today — packaging label mismatches are the cause. I'd add a label verification step to the handoff checklist. Want me to update the workflow?",action:"Update",actionType:"approve"},
    metricFlag:1,
    agentActions:[
      {text:"Root-caused DoorDash errors to packaging label mismatches",time:"10 min ago"},
      {text:"Identified Uber Eats now at 42% of delivery volume",time:"2 hrs ago"},
    ],
    insights:[
      {type:"alert",title:"DoorDash error rate spiking",desc:"Order error rate for DoorDash jumped to 6.2% today vs 2.8% average. Packaging label mismatches are the cause.",severity:"high",time:"10 min ago"},
      {type:"trend",title:"Delivery volume up 14%",desc:"Third-party delivery orders are up 14% month-over-month. Uber Eats now accounts for 42% of delivery volume.",severity:"positive",time:"2 hrs ago"},
      {type:"recommendation",title:"Add delivery staging area",desc:"Current handoff area causes congestion during peak. A dedicated staging shelf could reduce driver wait time by ~3 min.",severity:"medium",time:"6 hrs ago"},
    ],
  },
  "restaurant-ops":{
    agent:"Restaurant Agent",
    status:"active",
    lastRun:"8 min ago",
    proactive:{message:"Kitchen ticket time hit 6:24 during lunch — grill station backed up with 2 orders. I'd enable order throttling when the queue exceeds 8 tickets. Want to turn it on?",action:"Enable",actionType:"approve"},
    metricFlag:0,
    agentActions:[
      {text:"Identified grill station as lunch rush bottleneck",time:"8 min ago"},
      {text:"Verified drive-thru positioning guide is improving cars/hour",time:"1 hr ago"},
    ],
    insights:[
      {type:"alert",title:"Kitchen ticket time above 6 min",desc:"Average ticket time hit 6:24 during 12-1pm. Grill station was the bottleneck — 2 orders backed up.",severity:"high",time:"8 min ago"},
      {type:"trend",title:"Drive-thru cars per hour improving",desc:"Average cars/hour up from 28 to 31 over the last 2 weeks. New positioning guide is working.",severity:"positive",time:"1 hr ago"},
      {type:"recommendation",title:"Enable order throttling",desc:"When kitchen queue exceeds 8 tickets, auto-throttling delivery orders could prevent quality drops.",severity:"medium",time:"3 hrs ago"},
    ],
  },
  /* Transport & Logistics */
  "fleet-ops":{
    agent:"Fleet Agent",
    status:"active",
    lastRun:"4 min ago",
    proactive:{message:"Unit 4472 flagged a soft brake pedal on pre-trip inspection. I'd take it out of service now — want me to reassign today's route to Unit 4481?",action:"Reassign",actionType:"approve"},
    metricFlag:0,
    agentActions:[
      {text:"Flagged Unit 4472 brake issue from pre-trip inspection",time:"4 min ago"},
      {text:"Identified 6 units approaching tyre tread minimum",time:"2 hrs ago"},
    ],
    insights:[
      {type:"alert",title:"Unit 4472 brake inspection overdue",desc:"Pre-trip inspection flagged soft brake pedal. Vehicle should be taken out of service for inspection.",severity:"high",time:"4 min ago"},
      {type:"trend",title:"Fleet uptime at 96.2%",desc:"Vehicle uptime improved from 93.8% to 96.2% since predictive maintenance was enabled.",severity:"positive",time:"1 hr ago"},
      {type:"recommendation",title:"Rotate tyre sets on 6 units",desc:"Tread depth analysis shows 6 units approaching minimum. Rotating now extends life by ~15,000 miles.",severity:"medium",time:"3 hrs ago"},
    ],
  },
  "dock-ops":{
    agent:"Dock Agent",
    status:"active",
    lastRun:"15 min ago",
    proactive:{message:"Dock 3 trailer has been sitting for 4.2 hours — 2.5x average. The driver's past their window. I'd bump them to the priority queue. Should I?",action:"Prioritise",actionType:"approve"},
    metricFlag:0,
    agentActions:[
      {text:"Flagged excessive dwell time on Dock 3 trailer",time:"15 min ago"},
      {text:"Calculated throughput improvement from staggered appointments",time:"3 hrs ago"},
    ],
    insights:[
      {type:"alert",title:"Dock 3 dwell time at 4.2 hrs",desc:"Trailer at Dock 3 has been waiting 4.2 hours — 2.5x the average. Driver is past their appointment window.",severity:"high",time:"15 min ago"},
      {type:"trend",title:"Throughput up 8% this week",desc:"Loads processed per door increased from 12.4 to 13.4 daily average.",severity:"positive",time:"2 hrs ago"},
      {type:"recommendation",title:"Stagger appointment windows",desc:"Current 30-min windows create bunching at 8am and 1pm. 15-min stagger could reduce peak wait by 40%.",severity:"medium",time:"4 hrs ago"},
    ],
  },
  "delivery-tracking":{
    agent:"Delivery Agent",
    status:"active",
    lastRun:"7 min ago",
    proactive:{message:"Three shipments are at risk of missing their delivery windows — weather delay on I-95. I'd send proactive ETA updates to the customers now before they escalate. Want me to send them?",action:"Send Updates",actionType:"approve"},
    metricFlag:2,
    agentActions:[
      {text:"Detected I-95 weather delay affecting 3 shipments",time:"7 min ago"},
      {text:"Drafted proactive customer ETA update notifications",time:"12 min ago"},
    ],
    insights:[
      {type:"alert",title:"3 shipments with ETA risk",desc:"Orders #4891, #4903, #4912 are projected to miss delivery windows. Weather delay on I-95 corridor.",severity:"high",time:"7 min ago"},
      {type:"trend",title:"On-time delivery at 94.6%",desc:"OTD rate improved 1.8% month-over-month. POD capture compliance is now at 99.1%.",severity:"positive",time:"1 hr ago"},
      {type:"recommendation",title:"Proactively notify customer",desc:"3 at-risk shipments should trigger proactive ETA updates to customers before they escalate.",severity:"medium",time:"2 hrs ago"},
    ],
  },
  "route-ops":{
    agent:"Route Agent",
    status:"active",
    lastRun:"20 min ago",
    proactive:{message:"Empty miles hit 18.3% this week — NE corridor is the problem. Consolidating 3 partial loads into 2 full ones would save ~$1,200/week. Want me to model the new routes?",action:"Model Routes",actionType:"review"},
    metricFlag:0,
    agentActions:[
      {text:"Identified NE corridor as primary deadhead driver",time:"20 min ago"},
      {text:"Modelled load consolidation savings for 3 routes",time:"1 hr ago"},
    ],
    insights:[
      {type:"alert",title:"Deadhead ratio above 18%",desc:"Empty miles hit 18.3% this week vs 14% target. Northeast corridor is the main driver.",severity:"high",time:"20 min ago"},
      {type:"trend",title:"Cube utilisation improving",desc:"Average trailer cube utilisation up from 76% to 82% since load planning optimisation was enabled.",severity:"positive",time:"2 hrs ago"},
      {type:"recommendation",title:"Consolidate NE corridor runs",desc:"Combining 3 partial loads on the NE corridor into 2 full loads could save ~$1,200/week in fuel.",severity:"medium",time:"5 hrs ago"},
    ],
  },
  "tl-inventory-mgmt":{
    agent:"Warehouse Agent",
    status:"active",
    lastRun:"35 min ago",
    proactive:{message:"Pick accuracy is at 97.8% — below the 99.5% target. Zone C accounts for 60% of errors due to mislabelled bins. I can generate a re-slotting plan. Want to see it?",action:"View Plan",actionType:"review"},
    metricFlag:0,
    agentActions:[
      {text:"Traced pick errors to mislabelled bins in Zone C",time:"35 min ago"},
      {text:"Calculated 20% pick time reduction from re-slotting high-velocity SKUs",time:"2 hrs ago"},
    ],
    insights:[
      {type:"alert",title:"Pick accuracy below target",desc:"Pick accuracy at 97.8% vs 99.5% target. Zone C is responsible for 60% of errors — mislabelled bins.",severity:"high",time:"35 min ago"},
      {type:"trend",title:"Order cycle time reduced",desc:"Average order cycle time decreased from 2.4 hrs to 1.9 hrs over 30 days.",severity:"positive",time:"2 hrs ago"},
      {type:"recommendation",title:"Re-slot Zone C bins",desc:"High-velocity SKUs in Zone C are in suboptimal positions. Re-slotting could reduce pick time by ~20%.",severity:"medium",time:"4 hrs ago"},
    ],
  },
};

/* ═══ AGENT PREPARED ACTIONS ═══ */
/* What the agent shows when you click the primary action button — the work it's already done */
const APP_AGENT_PREPARED={
  "quality-mgmt":{
    title:"Corrective Action Draft — Line 3 Defect Spike",
    fields:[
      {label:"Issue",value:"First-pass yield drop of 4.2% on Line 3, last shift"},
      {label:"Root Cause",value:"Bearing replacement on Station 7 — new bearing slightly out of spec (0.03mm variance)"},
      {label:"Corrective Action",value:"Recalibrate Station 7 bearing mount. Re-inspect last 200 units from affected batch."},
      {label:"Assigned To",value:"R. Patel, Quality Lead"},
      {label:"Due",value:"Today, end of shift"},
    ],
  },
  "safety-compliance":{
    title:"Safety Walk-Through — Zone B",
    fields:[
      {label:"Trigger",value:"3 near-miss reports in Zone B this week (2x monthly average)"},
      {label:"Focus Areas",value:"Forklift traffic patterns, floor markings visibility, PPE compliance"},
      {label:"Proposed Time",value:"Today 2:00 PM (shift overlap for max coverage)"},
      {label:"Lead",value:"EHS Coordinator"},
      {label:"Follow-up",value:"Report findings by EOD, escalate if physical hazard found"},
    ],
  },
  "mfg-maintenance":{
    title:"Work Order — CNC-07 Spindle Bearing",
    fields:[
      {label:"Asset",value:"CNC-07 Spindle Bearing"},
      {label:"Issue",value:"Temperature 12°C above baseline. Estimated 34% failure probability within 72 hrs"},
      {label:"Priority",value:"High — schedule during next planned downtime"},
      {label:"Parts Required",value:"Spindle bearing kit SKU-4472 (2 in stock)"},
      {label:"Est. Downtime",value:"2.5 hours"},
    ],
  },
  "mfg-shift-mgmt":{
    title:"Crew Rebalancing Plan",
    fields:[
      {label:"Problem",value:"Night shift overtime at 112% of budget"},
      {label:"Proposal",value:"Move 2 operators from day shift (overstaffed) to evening shift (understaffed)"},
      {label:"Operators",value:"J. Kim (CNC certified) and M. Torres (multi-station qualified)"},
      {label:"Impact",value:"Estimated $4,200/week overtime reduction"},
      {label:"Effective",value:"Next schedule cycle (Monday)"},
    ],
  },
  "production-ops":{
    title:"Line 2 Stop Log Analysis",
    fields:[
      {label:"Current OEE",value:"71% (target: 85%)"},
      {label:"Constraint",value:"Availability — 3 unplanned stops in 4 hours"},
      {label:"Stop 1",value:"09:14 — Material feed jam (12 min)"},
      {label:"Stop 2",value:"10:42 — Sensor false alarm (8 min)"},
      {label:"Stop 3",value:"11:58 — Tooling changeover delay (22 min)"},
    ],
  },
  "mfg-inventory-mgmt":{
    title:"Purchase Order Draft — Aluminium Billets",
    fields:[
      {label:"Item",value:"Aluminium Billet 6061-T6, 150mm"},
      {label:"Quantity",value:"500 units (2-week supply + safety buffer)"},
      {label:"Supplier",value:"MetalCorp Inc. — preferred vendor"},
      {label:"Unit Cost",value:"$42.50 (last PO price)"},
      {label:"Delivery",value:"5 business days — arrival before stockout if ordered today"},
    ],
  },
  "mfg-training-ops":{
    title:"Training Slot Booking — CNC Certification",
    fields:[
      {label:"Trainees",value:"M. Torres, K. Singh, R. Patel"},
      {label:"Certification",value:"CNC Operation Level 2 (expiring in 7 days)"},
      {label:"Slot",value:"Thursday 9:00 AM — 12:00 PM, Training Room B"},
      {label:"Instructor",value:"A. Chen (certified trainer, available)"},
      {label:"Coverage",value:"Backfill arranged for all 3 stations"},
    ],
  },
  "food-safety":{
    title:"Maintenance Ticket — Walk-in Unit 2 Compressor",
    fields:[
      {label:"Equipment",value:"Walk-in Cooler Unit 2, Compressor"},
      {label:"Issue",value:"Temp excursion to 42°F at 6:15am (threshold: 40°F). Self-recovered by 6:28am."},
      {label:"Urgency",value:"Medium — functioning but at risk of repeat excursion"},
      {label:"Recommended",value:"Inspect compressor relay and condenser coils"},
      {label:"Scheduling",value:"Before tonight's closing — next excursion could spoil inventory"},
    ],
  },
  "qsr-shift-mgmt":{
    title:"Shift Lead Alert — Drive-Thru Bottleneck",
    fields:[
      {label:"Issue",value:"4:12 avg service time during lunch (target: 3:30)"},
      {label:"Bottleneck",value:"Station 2 — order assembly falling behind"},
      {label:"Recommendation",value:"Move 1 crew from counter to Station 2 support during 11:30-1:30"},
      {label:"Expected Impact",value:"~25 second reduction in avg service time"},
      {label:"Notify",value:"Shift Lead on duty"},
    ],
  },
  "qsr-inventory-mgmt":{
    title:"Batch Size Adjustment — Fry Station",
    fields:[
      {label:"Problem",value:"4.8% food waste vs 3.5% target. Fry station is primary driver."},
      {label:"Root Cause",value:"Full batch cooked during off-peak (2-5pm) when demand is 40% lower"},
      {label:"Proposal",value:"Reduce batch size by 20% during 2-5pm window"},
      {label:"Projected Savings",value:"~35% reduction in fry waste ($180/week)"},
      {label:"Risk",value:"Low — batch can be increased if unexpected rush occurs"},
    ],
  },
  "qsr-training-ops":{
    title:"Catch-Up Modules — J. Martinez",
    fields:[
      {label:"Trainee",value:"J. Martinez (Day 5 of onboarding)"},
      {label:"Current Progress",value:"2 of 6 modules complete (target: 4 by day 5)"},
      {label:"Assigned Modules",value:"Module 3: POS System, Module 4: Food Safety Basics"},
      {label:"Schedule",value:"This afternoon, 2:00-4:30 PM (quiet period)"},
      {label:"Buddy",value:"S. Park (assigned mentor, on shift)"},
    ],
  },
  "delivery-ops":{
    title:"Workflow Update — Delivery Label Verification",
    fields:[
      {label:"Problem",value:"DoorDash error rate at 6.2% (avg: 2.8%) — label mismatches"},
      {label:"Change",value:"Add label scan verification step before driver handoff"},
      {label:"Workflow",value:"Order Handoff Checklist → new step after item 3"},
      {label:"Estimated Impact",value:"~70% reduction in label mismatch errors"},
      {label:"Rollout",value:"Immediate — all shifts"},
    ],
  },
  "restaurant-ops":{
    title:"Order Throttling Configuration",
    fields:[
      {label:"Trigger",value:"Kitchen queue exceeds 8 active tickets"},
      {label:"Action",value:"Pause new delivery orders for 5 min, display 'busy' to delivery apps"},
      {label:"Dine-in/Drive-thru",value:"Unaffected — priority maintained"},
      {label:"Auto-resume",value:"When queue drops below 5 tickets"},
      {label:"Expected Impact",value:"Prevent quality drops during peak without losing dine-in throughput"},
    ],
  },
  "fleet-ops":{
    title:"Route Reassignment — Unit 4472 → Unit 4481",
    fields:[
      {label:"Issue",value:"Unit 4472 — soft brake pedal flagged on pre-trip"},
      {label:"Action",value:"Pull Unit 4472 from service, assign today's route to Unit 4481"},
      {label:"Route",value:"NE-14 (Chicago → Detroit, 4 stops)"},
      {label:"Unit 4481 Status",value:"Available, pre-trip passed, fuelled"},
      {label:"Driver",value:"D. Wilson — notified, pickup at Bay 6"},
    ],
  },
  "dock-ops":{
    title:"Priority Queue — Dock 3 Trailer",
    fields:[
      {label:"Trailer",value:"TRL-8842 at Dock 3"},
      {label:"Current Dwell",value:"4.2 hours (avg: 1.7 hours)"},
      {label:"Driver Status",value:"Past appointment window, at risk of HOS violation"},
      {label:"Action",value:"Move to priority unload queue — next available door"},
      {label:"Estimated Clear",value:"45 minutes from now"},
    ],
  },
  "delivery-tracking":{
    title:"Customer ETA Notifications",
    fields:[
      {label:"Affected Orders",value:"#4891 (Acme Corp), #4903 (BuildCo), #4912 (MegaRetail)"},
      {label:"Cause",value:"Weather delay on I-95 corridor — est. 2-3 hour impact"},
      {label:"New ETAs",value:"#4891: +2hrs, #4903: +3hrs, #4912: +2.5hrs"},
      {label:"Message",value:"Proactive delay notification with revised window and apology"},
      {label:"Channel",value:"Email + SMS to primary contact"},
    ],
  },
  "route-ops":{
    title:"Route Consolidation Model — NE Corridor",
    fields:[
      {label:"Current",value:"3 partial loads (avg 54% utilisation) on NE corridor"},
      {label:"Proposed",value:"Consolidate into 2 full loads (avg 82% utilisation)"},
      {label:"Routes Affected",value:"NE-07, NE-12, NE-14"},
      {label:"Fuel Savings",value:"~$1,200/week"},
      {label:"Trade-off",value:"1 delivery shifted by +4hrs (customer pre-notified)"},
    ],
  },
  "tl-inventory-mgmt":{
    title:"Zone C Re-Slotting Plan",
    fields:[
      {label:"Problem",value:"60% of pick errors from Zone C — mislabelled bins"},
      {label:"Phase 1",value:"Re-label all bins in Zone C aisles 4-7 (2 hrs, 1 person)"},
      {label:"Phase 2",value:"Move top 20 high-velocity SKUs to eye-level slots"},
      {label:"Expected Impact",value:"~20% reduction in pick time, error rate back to target"},
      {label:"Schedule",value:"This weekend during low-volume window"},
    ],
  },
};

/* ═══ AGENT CONFIG (per-app agent.md) ═══ */
/* Default instructions and data sources for each app's agent — editable by the user */
const APP_AGENT_CONFIG={
  "quality-mgmt":{
    instructions:"You are the Quality Agent for this manufacturing operation.\n\nFocus areas:\n- Monitor first-pass yield across all production lines\n- Track supplier quality metrics and incoming material rejection rates\n- Flag when any line goes 14+ days without a quality audit\n- Correlate defect spikes with recent equipment changes or maintenance\n\nBehaviour:\n- Always identify root cause before recommending action\n- Prioritise alerts that could impact customer shipments\n- Draft corrective actions in CAPA format\n- Use data from the last 30 days for trend analysis",
    dataSources:["Quality NCR Register","MES Production Data","Supplier Scorecard","Equipment Maintenance Log"],
  },
  "safety-compliance":{
    instructions:"You are the Safety Agent for this facility.\n\nFocus areas:\n- Monitor near-miss and incident report frequency by zone\n- Track TRIR and leading indicators (training completion, audit scores)\n- Flag when safety procedures are overdue for review\n- Identify clusters and patterns in incident data\n\nBehaviour:\n- Prioritise life-safety risks above all else\n- Recommend walk-throughs when near-miss clusters emerge\n- Never delay alerting on high-severity findings\n- Reference regulatory requirements when relevant",
    dataSources:["Risk Register","Incident Reports","Training Records","EHS Audit Data"],
  },
  "mfg-maintenance":{
    instructions:"You are the Maintenance Agent for this plant.\n\nFocus areas:\n- Monitor equipment sensor data for anomalies (temperature, vibration, pressure)\n- Track preventive maintenance completion rates\n- Predict failure probability using historical patterns\n- Monitor spare parts inventory levels against lead times\n\nBehaviour:\n- Alert immediately when failure probability exceeds 25%\n- Always include estimated downtime in work order drafts\n- Check parts availability before recommending repairs\n- Prioritise based on production impact",
    dataSources:["Asset Register","IoT Sensor Feed","PM Schedule","Spare Parts Inventory"],
  },
  "mfg-shift-mgmt":{
    instructions:"You are the Shift Agent for manufacturing operations.\n\nFocus areas:\n- Monitor overtime spend against budget by shift\n- Track changeover times and identify improvement opportunities\n- Analyse staffing levels vs demand patterns\n- Flag scheduling conflicts and coverage gaps\n\nBehaviour:\n- Propose crew rebalancing when overtime exceeds 105% of budget\n- Identify qualified operators for reassignment (check certifications)\n- Consider employee preferences when suggesting moves\n- Always model financial impact of recommendations",
    dataSources:["Shift Schedule","Overtime Reports","Operator Certifications","Production Demand Forecast"],
  },
  "production-ops":{
    instructions:"You are the Production Agent for this facility.\n\nFocus areas:\n- Monitor OEE (Availability × Performance × Quality) per line\n- Identify which OEE component is the constraint\n- Track throughput trends and compare across lines\n- Analyse stop logs for patterns\n\nBehaviour:\n- Alert when any line drops below OEE target for 2+ hours\n- Always identify the constraint (availability, performance, or quality)\n- Cross-reference stops with maintenance and changeover schedules\n- Suggest scheduling optimisations backed by data",
    dataSources:["MES Production Data","Stop Log","Changeover Records","Schedule Optimiser"],
  },
  "mfg-inventory-mgmt":{
    instructions:"You are the Inventory Agent for manufacturing.\n\nFocus areas:\n- Monitor raw material stock levels against safety thresholds\n- Track WIP inventory value and flow\n- Identify reorder timing based on usage rates and lead times\n- Find cost savings through order consolidation\n\nBehaviour:\n- Alert when stock will hit threshold before reorder arrives\n- Always factor in supplier lead times\n- Draft POs with preferred vendor pricing\n- Highlight working capital improvements",
    dataSources:["Raw Material Inventory","WIP Tracking","Supplier Catalog","Purchase Order History"],
  },
  "mfg-training-ops":{
    instructions:"You are the Training Agent for manufacturing.\n\nFocus areas:\n- Track certification expiry dates and renewal windows\n- Monitor onboarding progress against milestones\n- Identify single-operator dependencies on critical stations\n- Match training needs with available slots and instructors\n\nBehaviour:\n- Alert 7 days before any certification expires\n- Proactively match expiring certs with available training slots\n- Recommend cross-training to reduce single-point-of-failure risk\n- Track time-to-proficiency as a key metric",
    dataSources:["Operator Certifications","Training Schedule","Onboarding Tracker","Station Coverage Matrix"],
  },
  "food-safety":{
    instructions:"You are the Food Safety Agent for this restaurant.\n\nFocus areas:\n- Monitor temperature logs for all cold storage units\n- Track food safety audit scores and compliance trends\n- Flag temp excursions immediately, even if self-recovered\n- Identify high-risk time windows from historical data\n\nBehaviour:\n- Never delay alerting on temperature threshold breaches\n- Recommend preventive checks during high-risk windows\n- Correlate equipment issues with temp excursion patterns\n- Track audit score drivers to reinforce what's working",
    dataSources:["Temperature Sensors","Food Safety Audits","Equipment Maintenance","Checklist Completion Logs"],
  },
  "qsr-shift-mgmt":{
    instructions:"You are the Shift Agent for this QSR operation.\n\nFocus areas:\n- Monitor drive-thru and counter service times against targets\n- Identify bottleneck stations during peak periods\n- Analyse staffing levels vs historical volume patterns\n- Track order accuracy rates\n\nBehaviour:\n- Alert when service time exceeds target for 15+ minutes\n- Suggest crew repositioning during peak, not just after\n- Use 4-week rolling data for staffing recommendations\n- Balance speed with order accuracy",
    dataSources:["POS Transaction Data","Drive-Thru Timer","Labour Schedule","Order Accuracy Logs"],
  },
  "qsr-inventory-mgmt":{
    instructions:"You are the Inventory Agent for this restaurant.\n\nFocus areas:\n- Track food waste percentage against target daily\n- Monitor theoretical vs actual food cost\n- Identify waste drivers by station and time of day\n- Optimise batch sizes based on demand patterns\n\nBehaviour:\n- Alert when waste exceeds target by 1%+\n- Always identify the specific station and root cause\n- Propose changes with projected savings\n- Consider speed-of-service impact of any changes",
    dataSources:["Waste Tracking","Food Cost Reports","POS Sales Data","Batch Records"],
  },
  "qsr-training-ops":{
    instructions:"You are the Training Agent for this QSR operation.\n\nFocus areas:\n- Track new hire onboarding progress against day-by-day milestones\n- Monitor 90-day retention rates\n- Flag when trainees fall behind schedule\n- Manage food safety refresher compliance\n\nBehaviour:\n- Alert when any trainee is 1+ modules behind milestone\n- Suggest catch-up plans during quiet periods\n- Pair behind-schedule trainees with available mentors\n- Track which modules have highest drop-off rates",
    dataSources:["Onboarding Tracker","Training Modules","Retention Data","Mentor Assignments"],
  },
  "delivery-ops":{
    instructions:"You are the Delivery Agent for third-party delivery operations.\n\nFocus areas:\n- Monitor order error rates by delivery platform\n- Track delivery volume trends across partners\n- Identify root causes of packaging and handoff errors\n- Optimise the driver handoff process\n\nBehaviour:\n- Alert when any platform's error rate exceeds 2x average\n- Root-cause errors to specific process steps\n- Propose workflow changes with implementation ease in mind\n- Track volume shifts across platforms for capacity planning",
    dataSources:["Delivery Platform APIs","Order Error Logs","Handoff Checklist Data","Volume Reports"],
  },
  "restaurant-ops":{
    instructions:"You are the Restaurant Agent for this QSR operation.\n\nFocus areas:\n- Monitor kitchen ticket times and identify bottleneck stations\n- Track drive-thru throughput (cars per hour)\n- Balance dine-in, drive-thru, and delivery channel capacity\n- Manage order throttling for quality protection\n\nBehaviour:\n- Alert when ticket time exceeds target for 10+ minutes\n- Identify the specific station causing delays\n- Protect dine-in/drive-thru quality when delivery volume spikes\n- Auto-suggest throttling thresholds based on kitchen capacity",
    dataSources:["Kitchen Display System","Drive-Thru Sensors","Delivery Platform Queue","POS Data"],
  },
  "fleet-ops":{
    instructions:"You are the Fleet Agent for this transport operation.\n\nFocus areas:\n- Monitor pre-trip inspection results for safety flags\n- Track fleet uptime and predictive maintenance signals\n- Manage vehicle-to-route assignments for coverage\n- Monitor tyre, brake, and engine health metrics\n\nBehaviour:\n- Immediately flag any safety-critical inspection failure\n- Suggest route reassignment when pulling a vehicle, not just the pull\n- Verify replacement vehicle availability before recommending\n- Track uptime trends to validate predictive maintenance ROI",
    dataSources:["Pre-Trip Inspection Data","Vehicle Telematics","Route Assignments","Maintenance Records"],
  },
  "dock-ops":{
    instructions:"You are the Dock Agent for this facility.\n\nFocus areas:\n- Monitor trailer dwell times and appointment compliance\n- Track throughput per door (loads/day)\n- Identify scheduling patterns that create bunching\n- Flag drivers at risk of HOS violations\n\nBehaviour:\n- Alert when dwell time exceeds 2x average\n- Prioritise trailers with driver HOS concerns\n- Propose appointment schedule optimisations with data\n- Track throughput trends to validate changes",
    dataSources:["Yard Management System","Appointment Schedule","Door Assignment Log","Driver HOS Data"],
  },
  "delivery-tracking":{
    instructions:"You are the Delivery Agent for shipment tracking.\n\nFocus areas:\n- Monitor in-transit shipments for ETA risks\n- Track on-time delivery rates and trends\n- Identify weather, traffic, and infrastructure disruptions\n- Manage proactive customer communication\n\nBehaviour:\n- Alert when any shipment has >30% risk of missing window\n- Draft customer notifications before they need to ask\n- Group related delays for efficient communication\n- Track POD capture compliance as a quality signal",
    dataSources:["TMS Tracking Data","Weather & Traffic APIs","Customer SLAs","POD Capture Logs"],
  },
  "route-ops":{
    instructions:"You are the Route Agent for this transport operation.\n\nFocus areas:\n- Monitor deadhead (empty mile) ratio by corridor\n- Track trailer cube utilisation\n- Identify load consolidation opportunities\n- Optimise route sequencing for fuel efficiency\n\nBehaviour:\n- Alert when deadhead exceeds target by 3%+\n- Model consolidation scenarios with clear trade-offs\n- Always quantify fuel/cost savings in recommendations\n- Flag customer impact and propose mitigation",
    dataSources:["Route Planning System","Load Manifests","Fuel Records","Customer Delivery Windows"],
  },
  "tl-inventory-mgmt":{
    instructions:"You are the Warehouse Agent for this facility.\n\nFocus areas:\n- Monitor pick accuracy rates by zone\n- Track order cycle times and identify bottlenecks\n- Optimise bin slotting for high-velocity SKUs\n- Identify labelling and organisation issues\n\nBehaviour:\n- Alert when accuracy drops below target for any zone\n- Trace errors to specific root causes (labels, slotting, training)\n- Propose re-slotting plans with time/impact estimates\n- Schedule changes during low-volume windows",
    dataSources:["WMS Pick Data","Inventory Master","Zone Layout","Error Logs"],
  },
};

/* ═══ CONNECTOR ICONS ═══ */
const CICO=(()=>{
  const mk=(vb,paths,fill)=>({vb,paths,fill});
  return{
    // AI Models
    openai:mk("0 0 24 24",[{d:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3l2.5 5H17l-4 3.5 1.5 5.5-4.5-3-4.5 3 1.5-5.5L3 10h4.5L12 5z",fill:"#10A37F"}]),
    anthropic:mk("0 0 24 24",[{d:"M12 3L4 21h3.5l1.5-3h6l1.5 3H20L12 3zm0 5.5L14.5 15h-5L12 8.5z",fill:"#D97706"}]),
    google_gemini:mk("0 0 24 24",[{d:"M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z",fill:"#4285F4"},{d:"M12 7l1.2 3.6L17 12l-3.8 1.4L12 17l-1.2-3.6L7 12l3.8-1.4L12 7z",fill:"#EA4335"}]),
    meta_llama:mk("0 0 24 24",[{d:"M12 4c-2 0-3.5 1-4.5 2.5S6 9.5 6 12c0 2 .5 3.5 1.5 5S9.5 19 12 20c2.5-1 3.5-2 4.5-3s1.5-3 1.5-5c0-2.5-.5-4-1.5-5.5S14 4 12 4z",fill:"#0668E1"},{d:"M12 8a4 4 0 100 8 4 4 0 000-8z",fill:"#fff"}]),
    mistral:mk("0 0 24 24",[{d:"M4 4h4v4H4zM10 4h4v4h-4zM16 4h4v4h-4zM4 10h4v4H4zM16 10h4v4h-4zM4 16h4v4H4zM10 16h4v4h-4zM16 16h4v4h-4z",fill:"#F7D046"},{d:"M10 10h4v4h-4z",fill:"#FF7000"}]),
    cohere:mk("0 0 24 24",[{d:"M12 4a8 8 0 018 8h-4a4 4 0 00-4-4V4z",fill:"#39594D"},{d:"M12 4v4a4 4 0 00-4 4H4a8 8 0 018-8z",fill:"#D18EE2"},{d:"M4 12h4a4 4 0 004 4v4a8 8 0 01-8-8z",fill:"#FF7759"}]),
    // HRIS
    workday:mk("0 0 24 24",[{d:"M12 4a8 8 0 100 16 8 8 0 000-16z",fill:"none",stroke:"#F68D2E",sw:2},{d:"M12 4c0 4.42 3.58 8 8 8",fill:"none",stroke:"#F68D2E",sw:2}]),
    sap_successfactors:mk("0 0 24 24",[{d:"M3 6h18v12H3z",fill:"#0070F2"},{d:"M7 10h2v4H7zM11 9h2v5h-2zM15 11h2v3h-2z",fill:"#fff"}]),
    bamboohr:mk("0 0 24 24",[{d:"M12 3c-5 0-9 4-9 9s4 9 9 9 9-4 9-9-4-9-9-9z",fill:"#73C41D"},{d:"M9 8c0 1.66 1.34 3 3 3s3-1.34 3-3",fill:"none",stroke:"#fff",sw:2}]),
    adp_workforce_now:mk("0 0 24 24",[{d:"M2 7h20v10H2z",fill:"#D0271D"},{d:"M5 10h3l1.5 4L11 10h3",fill:"none",stroke:"#fff",sw:1.5}]),
    ukg:mk("0 0 24 24",[{d:"M4 4h16v16H4z",fill:"#005151"},{d:"M8 8h3v8H8zM13 8h3v5h-3z",fill:"#fff"}]),
    rippling:mk("0 0 24 24",[{d:"M4 8c3-3 5-3 8 0s5 3 8 0M4 12c3-3 5-3 8 0s5 3 8 0M4 16c3-3 5-3 8 0s5 3 8 0",fill:"none",stroke:"#FEC312",sw:1.8}]),
    gusto_hr:mk("0 0 24 24",[{d:"M12 3a9 9 0 100 18 9 9 0 000-18z",fill:"#F45D48"},{d:"M12 8v4l3 2",fill:"none",stroke:"#fff",sw:2}]),
    hibob:mk("0 0 24 24",[{d:"M4 6h16v12H4z",rx:3,fill:"#FF426F"},{d:"M8 10h2v4H8zM14 10h2v4h-2z",fill:"#fff"}]),
    ceridian_dayforce:mk("0 0 24 24",[{d:"M12 4a8 8 0 100 16 8 8 0 000-16z",fill:"#0F4539"},{d:"M10 9h4v6h-4z",fill:"#8CC63F"}]),
    oracle_hcm:mk("0 0 24 24",[{d:"M3 8h18v8H3z",fill:"#F80000"},{d:"M7 11h10",fill:"none",stroke:"#fff",sw:2}]),
    // Payroll
    adp_payroll:mk("0 0 24 24",[{d:"M2 7h20v10H2z",fill:"#D0271D"},{d:"M7 12h10",fill:"none",stroke:"#fff",sw:2}]),
    paychex:mk("0 0 24 24",[{d:"M4 6h16v12H4z",fill:"#004B8D"},{d:"M8 10l4 4 4-4",fill:"none",stroke:"#fff",sw:2}]),
    gusto_payroll:mk("0 0 24 24",[{d:"M12 3a9 9 0 100 18 9 9 0 000-18z",fill:"#F45D48"},{d:"M9 12h6M12 9v6",fill:"none",stroke:"#fff",sw:2}]),
    xero_payroll:mk("0 0 24 24",[{d:"M12 3a9 9 0 100 18 9 9 0 000-18z",fill:"#13B5EA"},{d:"M8 8l8 8M16 8l-8 8",fill:"none",stroke:"#fff",sw:2}]),
    quickbooks_payroll:mk("0 0 24 24",[{d:"M12 3a9 9 0 100 18 9 9 0 000-18z",fill:"#2CA01C"},{d:"M14 8v8H10l4-8z",fill:"#fff"}]),
    ceridian_payroll:mk("0 0 24 24",[{d:"M12 4a8 8 0 100 16 8 8 0 000-16z",fill:"#0F4539"},{d:"M8 12h8",fill:"none",stroke:"#8CC63F",sw:2.5}]),
    deel:mk("0 0 24 24",[{d:"M4 6h16v12H4z",fill:"#15357A"},{d:"M8 9h3v6H8z",fill:"#fff"},{d:"M13 9a3 3 0 010 6",fill:"none",stroke:"#fff",sw:2}]),
    rippling_payroll:mk("0 0 24 24",[{d:"M4 9c3-2 5-2 8 0s5 2 8 0M4 13c3-2 5-2 8 0s5 2 8 0",fill:"none",stroke:"#FEC312",sw:2}]),
    square_payroll:mk("0 0 24 24",[{d:"M4 4h16v16H4z",fill:"#1A1A1E"},{d:"M8 8h8v8H8z",fill:"#fff"}]),
    sage_payroll:mk("0 0 24 24",[{d:"M12 3a9 9 0 100 18 9 9 0 000-18z",fill:"#00D639"},{d:"M8 12c0-2.2 1.8-4 4-4s4 1.8 4 4",fill:"none",stroke:"#fff",sw:2}]),
    // ERP
    sap_s4hana:mk("0 0 24 24",[{d:"M3 6h18v12H3z",fill:"#0070F2"},{d:"M6 10h3v4H6zM11 9h2v6h-2zM15 10h3v4h-3z",fill:"#fff"}]),
    oracle_netsuite:mk("0 0 24 24",[{d:"M3 8h18v8H3z",fill:"#F80000"},{d:"M7 10v4h2v-4M11 10v4h2v-2h2v2",fill:"none",stroke:"#fff",sw:1.5}]),
    microsoft_dynamics:mk("0 0 24 24",[{d:"M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z",fill:"#00A4EF"}]),
    infor:mk("0 0 24 24",[{d:"M4 6h16v12H4z",fill:"#007BC0"},{d:"M10 9h4v6h-4z",fill:"#F0AB00"}]),
    epicor:mk("0 0 24 24",[{d:"M4 8h16v8H4z",fill:"#E31937"},{d:"M8 11h8v2H8z",fill:"#fff"}]),
    acumatica:mk("0 0 24 24",[{d:"M12 4l8 8-8 8-8-8z",fill:"none",stroke:"#E8702A",sw:2},{d:"M12 8l4 4-4 4-4-4z",fill:"#E8702A"}]),
    // POS
    square_pos:mk("0 0 24 24",[{d:"M3 3h18v18H3z",fill:"#1A1A1E"},{d:"M7 7h10v10H7z",fill:"#fff"}]),
    lightspeed:mk("0 0 24 24",[{d:"M12 3a9 9 0 100 18 9 9 0 000-18z",fill:"#E2F04F"},{d:"M10 8l4 4-4 4",fill:"none",stroke:"#1A1A1E",sw:2.5}]),
    toast:mk("0 0 24 24",[{d:"M4 8h16v10H4z",fill:"#FF4C00"},{d:"M4 8c0-3 3.6-5 8-5s8 2 8 5",fill:"#FF4C00"}]),
    shopify_pos:mk("0 0 24 24",[{d:"M12 3l9 5v8l-9 5-9-5V8l9-5z",fill:"#96BF48"},{d:"M10 9h4v6l-4-2V9z",fill:"#fff"}]),
    revel:mk("0 0 24 24",[{d:"M4 6h16v12H4z",fill:"#2B2B2B"},{d:"M8 10h8M8 14h5",fill:"none",stroke:"#00C3FF",sw:2}]),
    // Telematics
    samsara:mk("0 0 24 24",[{d:"M12 3a9 9 0 100 18 9 9 0 000-18z",fill:"#1A1A1E"},{d:"M7 12h10M12 7v10",fill:"none",stroke:"#00D084",sw:2}]),
    geotab:mk("0 0 24 24",[{d:"M12 3a9 9 0 100 18 9 9 0 000-18z",fill:"#007DC5"},{d:"M8 14l4-6 4 6",fill:"none",stroke:"#fff",sw:2}]),
    verizon_connect:mk("0 0 24 24",[{d:"M3 12l6 6 12-12",fill:"none",stroke:"#CD040B",sw:3}]),
    // Public Reviews
    google_reviews:mk("0 0 24 24",[{d:"M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3-6.2 3.3 1.2-6.8-5-4.9 6.9-1L12 2z",fill:"#FBBC04"}]),
    yelp:mk("0 0 24 24",[{d:"M12 3v8l-6 3 1-7zM12 11l6 3-1 7z",fill:"#AF0606"},{d:"M12 11l-4 6h8z",fill:"#FF1A1A"}]),
    tripadvisor:mk("0 0 24 24",[{d:"M12 5c-5 0-9 3-9 3l3 1c0 2.8 2.7 5 6 5s6-2.2 6-5l3-1s-4-3-9-3z",fill:"#34E0A1"},{d:"M9 11a2 2 0 100-4 2 2 0 000 4zM15 11a2 2 0 100-4 2 2 0 000 4z",fill:"#1A1A1E"}]),
    trustpilot:mk("0 0 24 24",[{d:"M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3-6.2 3.3 1.2-6.8-5-4.9 6.9-1L12 2z",fill:"#00B67A"}]),
    facebook_reviews:mk("0 0 24 24",[{d:"M12 3a9 9 0 100 18 9 9 0 000-18z",fill:"#1877F2"},{d:"M13 10h2V8h-2a3 3 0 00-3 3v1H8v2h2v5h2v-5h2l.5-2H12v-1a1 1 0 011-1z",fill:"#fff"}]),
    // Asset Systems
    upkeep:mk("0 0 24 24",[{d:"M12 3a9 9 0 100 18 9 9 0 000-18z",fill:"#00B050"},{d:"M8 12l3 3 5-5",fill:"none",stroke:"#fff",sw:2.5}]),
    fiix:mk("0 0 24 24",[{d:"M4 6h16v12H4z",fill:"#1E88E5"},{d:"M8 10h3v4H8z",fill:"#fff"},{d:"M14 10h2v4h-2z",fill:"#FFC107"}]),
    ibm_maximo:mk("0 0 24 24",[{d:"M4 8h16M4 12h16M4 16h16",fill:"none",stroke:"#0F62FE",sw:2.5}]),
    maintainx:mk("0 0 24 24",[{d:"M4 4h16v16H4z",fill:"#FF6B00"},{d:"M8 8l8 8M16 8l-8 8",fill:"none",stroke:"#fff",sw:2}]),
    // Databases & Feeds
    postgresql:mk("0 0 24 24",[{d:"M12 3c-4 0-7 2-7 5v8c0 3 3 5 7 5s7-2 7-5V8c0-3-3-5-7-5z",fill:"none",stroke:"#336791",sw:2},{d:"M5 8c0 3 3 5 7 5s7-2 7-5",fill:"none",stroke:"#336791",sw:2}]),
    mysql:mk("0 0 24 24",[{d:"M12 4c-4.4 0-8 1.8-8 4v8c0 2.2 3.6 4 8 4s8-1.8 8-4V8c0-2.2-3.6-4-8-4z",fill:"none",stroke:"#00758F",sw:2},{d:"M4 8c0 2.2 3.6 4 8 4s8-1.8 8-4",fill:"none",stroke:"#00758F",sw:2}]),
    snowflake:mk("0 0 24 24",[{d:"M12 2v20M4.9 7l14.2 10M4.9 17L19.1 7",fill:"none",stroke:"#29B5E8",sw:2},{d:"M12 2l-2 2 2 2M12 18l2 2-2 2M4.9 7L3 9l2.8.7M19.1 7l1.9 2-2.8.7M4.9 17L3 15l2.8-.7M19.1 17l1.9-2-2.8-.7",fill:"none",stroke:"#29B5E8",sw:1.5}]),
    bigquery:mk("0 0 24 24",[{d:"M12 3a9 9 0 100 18 9 9 0 000-18z",fill:"#4386FA"},{d:"M10 8v5l4 3M14 10h-4",fill:"none",stroke:"#fff",sw:2}]),
    redshift:mk("0 0 24 24",[{d:"M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z",fill:"none",stroke:"#8C4FFF",sw:2},{d:"M12 8l4 2.3v4.4L12 17l-4-2.3v-4.4L12 8z",fill:"#8C4FFF"}]),
    rest_api:mk("0 0 24 24",[{d:"M4 8h6v8H4zM14 8h6v8h-6z",fill:"none",stroke:T.accent,sw:2},{d:"M10 12h4",fill:"none",stroke:T.accent,sw:2}]),
    webhooks:mk("0 0 24 24",[{d:"M12 5a7 7 0 017 7M12 9a3 3 0 013 3",fill:"none",stroke:T.accent,sw:2},{d:"M12 12l-7 7",fill:"none",stroke:T.accent,sw:2}]),
    sftp:mk("0 0 24 24",[{d:"M4 12a8 8 0 0116 0",fill:"none",stroke:T.accent,sw:2},{d:"M12 4v16M8 8l4-4 4 4M8 16l4 4 4-4",fill:"none",stroke:T.accent,sw:1.8}]),
  };
})();

/* ═══ REGISTER CATALOG (Data Tables) ═══ */
const REGISTER_CATALOG={
  manufacturing:[
    {id:"risk-register",name:"Risk Register",type:"Entity",updatedAgo:"1 day ago",rowCount:10},
    {id:"asset-register",name:"Asset Register",type:"Entity",updatedAgo:"3 days ago",rowCount:8},
    {id:"quality-ncr",name:"Quality NCRs",type:"Entity",updatedAgo:"2 hours ago",rowCount:5},
  ],
  qsr:[
    {id:"food-safety",name:"Food Safety Register",type:"Entity",updatedAgo:"4 hours ago",rowCount:5},
    {id:"compliance-log",name:"Compliance Log",type:"Entity",updatedAgo:"1 day ago",rowCount:4},
    {id:"incident-log",name:"Incident Log",type:"Entity",updatedAgo:"6 hours ago",rowCount:3},
  ],
  "transport-logistics":[
    {id:"fleet-register",name:"Fleet Register",type:"Entity",updatedAgo:"2 hours ago",rowCount:6},
    {id:"risk-register-tl",name:"Risk Register",type:"Entity",updatedAgo:"1 day ago",rowCount:5},
    {id:"incident-log-tl",name:"Incident Log",type:"Entity",updatedAgo:"12 hours ago",rowCount:4},
  ],
};

/* ═══ APP DETAIL DATA ═══ */
const APP_ACTIVITY_TYPES={
  inspection:{icon:"shield",color:T.green,label:"Inspection"},
  issue:{icon:"alert",color:T.rose,label:"Issue Raised"},
  escalation:{icon:"bolt",color:T.amber,label:"Escalation"},
  workflow:{icon:"workflow",color:T.highlight,label:"Workflow"},
  connector:{icon:"connector",color:T.violet,label:"Sync"},
  agent:{icon:"sparkle",color:T.accent,label:"Agent"},
};

const APP_TABLE_MAP={
  "quality-mgmt":["quality-ncr"],
  "safety-compliance":["risk-register"],
  "mfg-maintenance":["asset-register"],
  "food-safety":["food-safety"],
  "fleet-ops":["fleet-register"],
  "dock-ops":["fleet-register"],
  "delivery-tracking":["fleet-register"],
};

const APP_RECOMMENDED_WORKFLOWS={
  "quality-mgmt":[
    {name:"Corrective Action Tracking",desc:"CAPA workflow for quality deviations",configImpact:8},
    {name:"Management Review",desc:"Periodic quality management review",configImpact:5},
  ],
  "safety-compliance":[
    {name:"Risk Assessment",desc:"Structured risk assessment for new processes",configImpact:10},
    {name:"Near-Miss Reporting",desc:"Quick near-miss capture workflow",configImpact:7},
  ],
  "mfg-maintenance":[
    {name:"Escalation Rules",desc:"Auto-escalate overdue work orders",configImpact:8},
    {name:"Parts Inventory Check",desc:"Weekly spare parts stock review",configImpact:6},
  ],
  "food-safety":[
    {name:"Supplier Audit",desc:"Periodic supplier food safety audit",configImpact:9},
    {name:"Allergen Management",desc:"Cross-contamination prevention checklist",configImpact:7},
  ],
  "fleet-ops":[
    {name:"Accident Investigation",desc:"Post-incident investigation workflow",configImpact:8},
    {name:"Tyre Management",desc:"Tyre condition and rotation tracking",configImpact:5},
  ],
  "dock-ops":[
    {name:"Cross-Dock Efficiency Audit",desc:"Track throughput and bottlenecks",configImpact:9},
  ],
  "delivery-tracking":[
    {name:"Customer Feedback Capture",desc:"Post-delivery satisfaction check",configImpact:7},
  ],
};

const APP_DASHBOARD_METRICS={
  "quality-mgmt":[
    {label:"First Pass Yield",value:"94.2%",trend:1.2,color:T.green},
    {label:"Open NCRs",value:"7",trend:-2,color:T.amber},
    {label:"Inspections (30d)",value:"142",trend:12,color:T.green},
    {label:"Avg Response Time",value:"4.2 hrs",trend:-0.8,color:T.green},
  ],
  "safety-compliance":[
    {label:"TRIR",value:"1.8",trend:-0.3,color:T.green},
    {label:"Open Actions",value:"4",trend:-1,color:T.amber},
    {label:"Near Misses (30d)",value:"12",trend:3,color:T.rose},
    {label:"Days Since Incident",value:"34",trend:34,color:T.green},
  ],
  "mfg-maintenance":[
    {label:"PM Compliance",value:"87%",trend:4,color:T.green},
    {label:"MTBF",value:"312 hrs",trend:18,color:T.green},
    {label:"Open Work Orders",value:"9",trend:-3,color:T.amber},
    {label:"Uptime",value:"94.1%",trend:1.2,color:T.green},
  ],
  "food-safety":[
    {label:"Compliance Score",value:"96%",trend:2,color:T.green},
    {label:"Temp Exceptions",value:"3",trend:-1,color:T.amber},
    {label:"Inspections (30d)",value:"89",trend:7,color:T.green},
    {label:"Overdue Actions",value:"1",trend:-2,color:T.green},
  ],
  "fleet-ops":[
    {label:"Fleet Uptime",value:"91.4%",trend:0.8,color:T.green},
    {label:"HOS Compliance",value:"98%",trend:1,color:T.green},
    {label:"Fuel Efficiency",value:"6.2 mpg",trend:0.3,color:T.green},
    {label:"Open Defects",value:"5",trend:-2,color:T.amber},
  ],
};

const APP_CHART_DATA={
  "quality-mgmt":[72,78,74,82,85,79,88,91,87,94,92,94],
  "safety-compliance":[45,52,48,55,62,58,65,71,68,74,78,82],
  "mfg-maintenance":[60,58,65,62,70,68,75,72,80,84,87,87],
  "food-safety":[85,88,84,90,92,89,94,96,93,95,96,96],
  "fleet-ops":[70,72,68,75,78,74,80,82,85,88,90,91],
};

const APP_ACTIVITY_SEEDS={
  "quality-mgmt":[
    {type:"inspection",text:"Quality Inspection — Line 3 completed",time:"12 min ago",user:"Sarah Chen",score:94},
    {type:"issue",text:"NCR raised — Batch #4472 label deviation",time:"2 hrs ago",user:"Ravi Singh"},
    {type:"escalation",text:"Corrective action overdue — NCR-023",time:"4 hrs ago",user:"System"},
    {type:"workflow",text:"Supplier Receiving Inspection submitted",time:"Yesterday",user:"Alice Lee",score:100},
    {type:"connector",text:"QMS sync completed — 38 records updated",time:"Yesterday",user:"System"},
    {type:"inspection",text:"Quality Inspection — Line 1 completed",time:"Yesterday",user:"Hannah Boyd",score:97},
    {type:"issue",text:"Defect flagged — surface finish out of spec",time:"2 days ago",user:"Sarah Chen"},
    {type:"workflow",text:"Incoming material inspection passed",time:"2 days ago",user:"Alice Lee",score:100},
  ],
  "safety-compliance":[
    {type:"inspection",text:"Weekly safety walkthrough completed",time:"1 hr ago",user:"Mia Brooks",score:87},
    {type:"issue",text:"Hydraulic leak reported — Press 4",time:"3 hrs ago",user:"Floor Operator"},
    {type:"escalation",text:"Area cordoned off — maintenance dispatched",time:"3 hrs ago",user:"System"},
    {type:"workflow",text:"Incident report submitted — near miss",time:"Yesterday",user:"Chris Park"},
    {type:"connector",text:"EHS system sync — 12 events updated",time:"Yesterday",user:"System"},
  ],
  "mfg-maintenance":[
    {type:"workflow",text:"PM routine — Line 2 conveyor completed",time:"2 hrs ago",user:"Ravi Singh",score:87},
    {type:"issue",text:"Unplanned breakdown — Pump Station 2",time:"6 hrs ago",user:"System"},
    {type:"workflow",text:"Work order WO-445 closed",time:"Yesterday",user:"Maintenance Tech",score:100},
    {type:"connector",text:"CMMS sync — 5 work orders updated",time:"Yesterday",user:"System"},
    {type:"escalation",text:"PM overdue — Press 4 lubrication",time:"2 days ago",user:"System"},
  ],
  "food-safety":[
    {type:"inspection",text:"Opening Checklist completed — all clear",time:"25 min ago",user:"Shift Manager",score:100},
    {type:"inspection",text:"Temperature log — all in range",time:"1 hr ago",user:"Team Member",score:100},
    {type:"issue",text:"Walk-in cooler temp 1°F above threshold",time:"Yesterday",user:"Team Member"},
    {type:"workflow",text:"Closing inspection submitted",time:"Yesterday",user:"Shift Manager",score:91},
    {type:"connector",text:"Food safety system sync completed",time:"Yesterday",user:"System"},
  ],
  "fleet-ops":[
    {type:"inspection",text:"Pre-trip inspection — Unit 2847 passed",time:"30 min ago",user:"Driver",score:100},
    {type:"workflow",text:"Fuel audit — Route 12 reconciled",time:"2 hrs ago",user:"Fleet Coordinator",score:96},
    {type:"issue",text:"Tyre pressure alert — Unit 4472",time:"4 hrs ago",user:"System"},
    {type:"workflow",text:"Driver debrief submitted",time:"Yesterday",user:"Driver",score:100},
    {type:"connector",text:"Telematics sync — 24 vehicles updated",time:"Yesterday",user:"System"},
    {type:"escalation",text:"HOS violation warning — Driver M. Torres",time:"Yesterday",user:"System"},
  ],
};

const APP_PEOPLE_SEEDS={
  "quality-mgmt":[
    {name:"Sarah Chen",role:"Quality Inspector",initials:"SC"},
    {name:"Ravi Singh",role:"QA Manager",initials:"RS"},
    {name:"Alice Lee",role:"Receiving Inspector",initials:"AL"},
    {name:"Hannah Boyd",role:"Quality Analyst",initials:"HB"},
  ],
  "safety-compliance":[
    {name:"Mia Brooks",role:"EHS Coordinator",initials:"MB"},
    {name:"Chris Park",role:"Safety Officer",initials:"CP"},
    {name:"John Doe",role:"Site Manager",initials:"JD"},
  ],
  "mfg-maintenance":[
    {name:"Ravi Singh",role:"Maintenance Lead",initials:"RS"},
    {name:"Tom Wells",role:"Maintenance Tech",initials:"TW"},
    {name:"Jake Reeves",role:"Reliability Engineer",initials:"JR"},
  ],
  "food-safety":[
    {name:"Maria Santos",role:"Shift Manager",initials:"MS"},
    {name:"Tyler Brooks",role:"Team Lead",initials:"TB"},
    {name:"Aisha Khan",role:"Food Safety Officer",initials:"AK"},
  ],
  "fleet-ops":[
    {name:"Dan Kowalski",role:"Fleet Manager",initials:"DK"},
    {name:"Maria Torres",role:"Driver",initials:"MT"},
    {name:"Sam O'Brien",role:"Fleet Coordinator",initials:"SO"},
    {name:"Lee Chang",role:"Mechanic",initials:"LC"},
  ],
};

function getAppConfigScore(app,addedConnectors){
  if(!app)return 0;
  const connSet=new Set(addedConnectors||[]);
  let total=0,done=0;
  total+=(app.workflows||[]).length;
  done+=(app.workflows||[]).length;
  total+=(APP_RECOMMENDED_WORKFLOWS[app.id]||[]).length;
  (app.requiredConnectors||[]).forEach(c=>{total++;if(connSet.has(c))done++;});
  const tables=APP_TABLE_MAP[app.id]||[];
  if(tables.length>0){total++;done++;}
  total++;
  if((APP_PEOPLE_SEEDS[app.id]||[]).length>0)done++;
  return total===0?0:Math.round((done/total)*100);
}

function getAppPerfScore(appId){
  const data=APP_CHART_DATA[appId];
  if(!data||data.length===0)return 0;
  const recent=data.slice(-3);
  return Math.round(recent.reduce((a,v)=>a+v,0)/recent.length);
}

function getAppDashboardMetrics(app){
  if(APP_DASHBOARD_METRICS[app.id])return APP_DASHBOARD_METRICS[app.id];
  return[
    {label:"Completion Rate",value:"78%",trend:3,color:T.green},
    {label:"Open Items",value:"5",trend:-1,color:T.amber},
    {label:"Activities (30d)",value:"64",trend:8,color:T.green},
    {label:"Avg Response",value:"6.1 hrs",trend:-1.2,color:T.green},
  ];
}

function getAppChartData(appId){
  return APP_CHART_DATA[appId]||[55,58,62,60,65,68,64,70,72,75,73,78];
}

function getAppActivity(appId){
  return APP_ACTIVITY_SEEDS[appId]||[
    {type:"workflow",text:"Workflow completed",time:"1 hr ago",user:"Team Member",score:92},
    {type:"inspection",text:"Routine check completed",time:"3 hrs ago",user:"Inspector",score:88},
    {type:"connector",text:"Data sync completed",time:"Yesterday",user:"System"},
  ];
}

function getAppPeople(appId){
  return APP_PEOPLE_SEEDS[appId]||[
    {name:"Team Member",role:"Assigned",initials:"TM"},
  ];
}

/* ═══ BUILDER DATA ═══ */
const NODE_TYPES=[
  {type:"trigger",label:"Trigger",desc:"Initiate workflows",color:T.green,icon:IC.bolt},
  {type:"action",label:"Action",desc:"Perform actions based on triggers",color:T.highlight,icon:IC.play},
  {type:"delay",label:"Delay",desc:"Pause the workflow",color:T.amber,icon:IC.clock},
  {type:"conditional",label:"Conditional",desc:"Branch the workflow",color:T.violet,icon:IC.filter},
  {type:"decision",label:"Decision",desc:"Route the workflow",color:T.rose,icon:IC.decision},
  {type:"notification",label:"Notification",desc:"Send alerts or notifications",color:T.pink,icon:IC.bell},
  {type:"aiAgent",label:"AI Agent",desc:"AI Agent Node",color:T.accent,icon:IC.sparkle},
];

const SAMPLE_NODES=[
  {id:"n1",type:"trigger",title:"Start Workflow",sub:"Trigger",x:280,y:40},
  {id:"n2",type:"conditional",title:"Check Client Source",sub:"Conditional",x:280,y:170},
  {id:"n3",type:"action",title:"Notify Platform",sub:"Action",x:100,y:340},
  {id:"n4",type:"action",title:"Confirm Request",sub:"Action",x:440,y:340},
  {id:"n5",type:"decision",title:"Recurring Customer?",sub:"Decision",x:280,y:480},
  {id:"n6",type:"action",title:"Create CRM Record",sub:"Performs tasks",x:100,y:620},
  {id:"n7",type:"delay",title:"Wait and proceed",sub:"Fixed delay",x:440,y:620},
  {id:"n8",type:"conditional",title:"Check Contact Reason",sub:"Conditional",x:280,y:760},
  {id:"n9",type:"decision",title:"Product or Service?",sub:"Decision",x:280,y:920},
];
const SAMPLE_EDGES=[
  {from:"n1",to:"n2"},{from:"n2",to:"n3",label:"Our website"},{from:"n2",to:"n4",label:"Partner Website"},
  {from:"n3",to:"n5"},{from:"n4",to:"n5"},{from:"n5",to:"n6",label:"✗"},{from:"n5",to:"n7",label:"✓"},
  {from:"n6",to:"n8"},{from:"n7",to:"n8"},{from:"n8",to:"n9",label:"Complaint"},
];
