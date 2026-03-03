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
    goalIds:["mfg-defects","mfg-regulatory","mfg-customer-complaints","mfg-supplier-quality","mfg-raw-inventory"],
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
    goalIds:["mfg-injuries","mfg-regulatory"],
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
    goalIds:["mfg-downtime","mfg-preventive-maintenance"],
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
    goalIds:["mfg-throughput","mfg-scheduling","mfg-oee","mfg-changeover"],
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
    goalIds:["mfg-oee","mfg-throughput","mfg-asset-utilization","mfg-cost-per-unit"],
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
    goalIds:["mfg-raw-inventory","mfg-otif","mfg-wip","mfg-supply-resilience"],
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
    goalIds:["mfg-training","mfg-turnover"],
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
    goalIds:["qsr-food-safety","qsr-food-quality","qsr-audit-scores"],
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
    goalIds:["qsr-speed","qsr-accuracy","qsr-labor-cost"],
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
    goalIds:["qsr-waste","qsr-food-cost","qsr-inventory"],
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
    goalIds:["qsr-training","qsr-retention"],
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
    goalIds:["qsr-delivery","qsr-accuracy","qsr-digital"],
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
    goalIds:["qsr-drive-thru","qsr-kitchen","qsr-speed"],
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
    goalIds:["tl-vehicle-uptime","tl-driver-safety","tl-hos","tl-fuel","tl-cost-per-mile","tl-driver-retention"],
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
    goalIds:["tl-dock-throughput","tl-dwell","tl-accuracy-damage","tl-cross-dock"],
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
    goalIds:["tl-pod","tl-otd","tl-visibility","tl-exceptions","tl-eta"],
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
    goalIds:["tl-route-efficiency","tl-deadhead","tl-cube-utilization"],
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
