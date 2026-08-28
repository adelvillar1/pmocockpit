// Content catalog for the PMO Cockpit — typed, with permanent stable slugs.
//
// Provenance: initially generated programmatically from docs/v1-reference.html
// (the v1 single-file Stratum app) to guarantee character-identical fidelity.
// This file is now the SOURCE OF TRUTH for all checklist content — edit it
// directly, but treat slugs as PERMANENT identifiers: user progress is keyed
// by slug, so a slug must never be reused for a different item or removed.
// Reword text freely; never change a slug's meaning.
//
// Merge semantics replicate v1's content(type, phase): BASE content applies to
// every program type; per-type EXTRAS are appended after the base items in the
// same group, and extras objective/tips override the base when present.
// Ordering matters — the UI renders base-then-extras order.

export const CATALOG_SCHEMA_VERSION = 1;

export interface PhaseDef {
  id: number;
  title: string;
  short: string;
}

export interface ProgramTypeDef {
  typeId: string;
  name: string;
  shortName: string;
  tagline: string;
  focus: string;
  horizon: string;
  risks: string[];
  kpis: string[];
}

export interface CatalogItem {
  /** Permanent stable identifier: p<phaseId>.<kebab-slug>. Never changes. */
  slug: string;
  text: string;
}

export interface PhaseContent {
  objective: string;
  activities: CatalogItem[];
  nonNeg: CatalogItem[];
  tips: string;
}

export const PHASES: readonly PhaseDef[] = [
  { id: 0, title: "Leadership and vision alignment", short: "Leadership" },
  { id: 1, title: "Current-state assessment", short: "Assessment" },
  { id: 2, title: "Strategy, scope, and business case", short: "Strategy" },
  { id: 3, title: "Operating model, governance, and talent", short: "Org & talent" },
  { id: 4, title: "Execution planning and risk", short: "Planning" },
  { id: 5, title: "Implement, pilot, and capture value", short: "Execute" },
  { id: 6, title: "Scale, embed, and continuous management", short: "Continuous" },
];

export const PROGRAM_TYPES: readonly ProgramTypeDef[] = [
  {
    typeId: "dx",
    name: "Digital transformation",
    shortName: "DX",
    tagline: "Enterprise-wide change in how the company operates, decides, and creates value.",
    focus: "Culture, unified data, a governed use-case portfolio, and an operating model that survives commodity cycles.",
    horizon: "24–48 months, value-gated waves",
    risks: ["Pilot purgatory with no scale path", "IT-owned program with weak operations sponsorship", "Fragmented data blocking every later use case"],
    kpis: ["Cost per boe / unit opex", "Unplanned downtime", "Decision cycle time", "Emissions intensity", "Percent of high-value decisions using live data"],
  },
  {
    typeId: "erp",
    name: "ERP program",
    shortName: "ERP",
    tagline: "Core process and transactional backbone. Process and data first, software second.",
    focus: "Process harmonization, master data, cutover, training, and post-go-live hypercare with finance and operations ownership.",
    horizon: "18–36 months including hypercare",
    risks: ["Replicating legacy process clutter in the new system", "Weak master data and cutover rehearsals", "Underfunded change and training"],
    kpis: ["Close cycle time", "Invoice / joint-interest accuracy", "Manual journal volume", "User adoption by role", "Hypercare ticket burn-down"],
  },
  {
    typeId: "etrm",
    name: "ETRM",
    shortName: "ETRM",
    tagline: "Trading, risk, and commercial systems at the intersection of markets, operations, and finance.",
    focus: "Deal capture, positions, risk analytics, market data, regulatory controls, and tight links to physical ops and ERP.",
    horizon: "12–24 months by commodity book",
    risks: ["Shadow books outside the system of record", "Market-data and valuation mismatches", "Controls that traders work around"],
    kpis: ["T+0 / T+1 position completeness", "Limit-breach response time", "P&L explain quality", "Failed deal / unmatched volume", "Audit exceptions"],
  },
  {
    typeId: "ai",
    name: "AI / advanced analytics",
    shortName: "AI",
    tagline: "From pilots to production systems that change operating and commercial decisions.",
    focus: "Data readiness, model governance, MLOps, domain embedding, productionization, and continuous value and performance monitoring.",
    horizon: "Use-case waves of 3–9 months",
    risks: ["Models that never leave the notebook", "No owner after the data-science team moves on", "Operational decisions without a human override path"],
    kpis: ["Value vs baseline per use case", "Model uptime and drift alerts", "Time from insight to action", "Percent of predictions used in the work process", "Retrain / review cadence adherence"],
  },
  {
    typeId: "twin",
    name: "Digital twin and IoT",
    shortName: "Twin",
    tagline: "Virtual assets and processes fed by live and historical data for simulation and decisions.",
    focus: "Sensor and historian quality, model fidelity matched to use cases, control-system integration, and operator adoption.",
    horizon: "Asset-by-asset, 6–18 months to first production use",
    risks: ["Pretty 3D with no decision workflow", "Fidelity that is either too low or too expensive", "Latency or OT connectivity that operators cannot trust"],
    kpis: ["Operator weekly active use", "Scenario cycle time", "Unplanned events detected early", "Energy / yield improvement on twin-managed units", "Data completeness for modeled tags"],
  },
  {
    typeId: "apm",
    name: "Predictive maintenance / APM",
    shortName: "APM",
    tagline: "Move critical equipment from reactive and calendar-based work to condition-based and predictive.",
    focus: "Failure-mode understanding, sensor strategy, remaining-useful-life models, and integration into the CMMS work process.",
    horizon: "6–12 months per critical equipment class",
    risks: ["Alerts that maintenance ignores", "Models that do not transfer across fields or trains", "No link from prediction to a work order"],
    kpis: ["Unplanned downtime on covered assets", "Emergency vs planned work ratio", "Maintenance cost on covered class", "Alert precision / false-positive rate", "Work-order conversion from predictions"],
  },
  {
    typeId: "ioc",
    name: "Integrated operations",
    shortName: "IOC",
    tagline: "Remote or centralized decision environments combining live data, collaboration, and analytics.",
    focus: "Decision rights between field and center, real-time data quality, collaboration design, and a new way of working — not only a room.",
    horizon: "12–24 months including operating-model change",
    risks: ["A control room that is a video wall of unread dashboards", "Unclear who decides: field vs center", "Ignoring contractor and night-shift workflows"],
    kpis: ["Time to detect and act on deviations", "Site visits avoided without safety regression", "Production opportunity capture", "Handover quality scores", "Decision-rights exceptions"],
  },
  {
    typeId: "cyber",
    name: "Cybersecurity / OT security",
    shortName: "OT security",
    tagline: "Protect operational technology and critical infrastructure while still enabling digital work.",
    focus: "OT inventory, segmentation, monitoring, incident response, governance, and changes that do not jeopardize production or safety systems.",
    horizon: "Ongoing program with 90-day hardening sprints",
    risks: ["IT controls copied onto OT and breaking process", "Unknown assets and flat networks", "Tabletop plans that have never been exercised"],
    kpis: ["OT asset inventory coverage", "Segmented vs flat network share", "Mean time to detect on OT", "Patch / compensating-control SLA", "Exercise findings closed"],
  },
  {
    typeId: "pmo",
    name: "PMO implementation",
    shortName: "PMO",
    tagline: "Stand up a Project, Program, and Portfolio Management Office that governs delivery without becoming bureaucracy.",
    focus: "Charter and mandate, governance cadence, portfolio visibility, standards and templates that fit operational reality, and value tracking across every program in the house.",
    horizon: "6–12 months to operating cadence, then continuous",
    risks: ["Process theater: templates and gates that cost more than they return", "PMO seen as reporting police rather than delivery support", "Mandate without executive teeth — recommendations that nobody must act on", "One-size-fits-all governance applied identically to a small IT project and a major facility program"],
    kpis: ["Portfolio on-time / on-budget delivery rate", "Stage-gate decision cycle time", "Percent of programs reporting value vs baseline", "Resource conflicts resolved before impact", "Stakeholder confidence in portfolio reporting"],
  },
  {
    typeId: "custom",
    name: "Custom / other program",
    shortName: "Custom",
    tagline: "Same disciplined framework for any major system or transformation program in oil and gas.",
    focus: "Apply the common phases and adapt non-negotiables to your specific context.",
    horizon: "Set from the business case, then gate by value",
    risks: ["Scope that is actually several programs", "No named operational owner after go-live", "Benefits that cannot be measured against a baseline"],
    kpis: ["Stated outcome metrics from the charter", "Stage-gate pass rate", "Adoption of the new way of working", "Residual risk vs appetite", "Value captured vs case"],
  },
];

export const PHASE_CONTENT: Record<string, Record<number, PhaseContent>> = {
  dx: {
    0: {
      objective: "Secure visible, sustained executive sponsorship and a shared definition of success that survives commodity-price cycles.",
      activities: [
        { slug: "p0.sponsor-named", text: "Name executive sponsor(s) with real authority — operations leadership, not only IT or digital." },
        { slug: "p0.one-page-charter", text: "Draft a one-page charter linking the program to strategy, HSE, and energy-transition goals." },
        { slug: "p0.outcome-statements", text: "Define three to five outcome statements in operational language (cost/boe, uptime, emissions, cycle time)." },
        { slug: "p0.steering-committee", text: "Stand up a steering committee with decision rights, membership, and a fixed cadence." },
        { slug: "p0.leadership-briefing", text: "Brief the broader leadership team and the operational stakeholders who will live with the change." },
        { slug: "p0.funding-philosophy", text: "Agree the funding philosophy (ring-fenced or value-gated) so the program is not the first cut in a downturn." },
        { slug: "p0.dx-vision-alignment", text: "Align the DX vision with portfolio and energy-transition strategy, not only cost takeout." },
      ],
      nonNeg: [
        { slug: "p0.sponsor-committed", text: "Named executive sponsor with written commitment and time allocation." },
        { slug: "p0.charter-approved", text: "Approved program charter with outcomes and success metrics." },
        { slug: "p0.steering-charter", text: "Steering-committee charter: membership, decision rights, cadence." },
        { slug: "p0.value-hypothesis-signed", text: "Initial value hypothesis signed by finance and operations." },
      ],
      tips: "In oil and gas, sponsorship must include operations. Programs owned only by the technology function almost never scale past pilots.",
    },
    1: {
      objective: "Understand the true starting point — data, processes, systems, capabilities, culture, and constraints — before designing solutions.",
      activities: [
        { slug: "p1.systems-landscape", text: "Map the current systems landscape (OT, IT, data platforms, point solutions) and the integration points that matter." },
        { slug: "p1.data-quality-assessment", text: "Assess data quality, access, ownership, and readiness for the intended use cases." },
        { slug: "p1.process-decision-points", text: "Document the processes and decision points the program will change." },
        { slug: "p1.readiness-assessment", text: "Evaluate skills, roles, and cultural readiness, including contractors and remote crews." },
        { slug: "p1.constraints-captured", text: "Capture regulatory, HSE, cybersecurity, and production-continuity constraints." },
        { slug: "p1.baseline-metrics", text: "Record baseline metrics with sources so later value claims can be proven." },
      ],
      nonNeg: [
        { slug: "p1.landscape-documented", text: "Documented current-state systems and data landscape." },
        { slug: "p1.baseline-metrics-documented", text: "Baseline metrics with data sources for the primary success measures." },
        { slug: "p1.constraint-register", text: "Risk and constraint register covering cyber, HSE, regulatory, and legacy OT." },
        { slug: "p1.stakeholder-impact-map", text: "Stakeholder map and first-pass change-impact assessment." },
      ],
      tips: "Do not skip the data reality check. Most AI, twin, and analytics failures in this industry start with fragmented or inaccessible data, not weak models.",
    },
    2: {
      objective: "Turn vision into a governed scope, a sequenced roadmap, and a quantified case that can be steered.",
      activities: [
        { slug: "p2.scope-statement", text: "Write in-scope and out-of-scope, plus the process for changing either." },
        { slug: "p2.prioritization", text: "Prioritize use cases or workstreams by value, feasibility, data readiness, and operational risk." },
        { slug: "p2.phased-roadmap", text: "Build a phased roadmap (pilot → scale → embed) with stage gates tied to measured value." },
        { slug: "p2.business-case", text: "Quantify the business case with conservative assumptions and oil/gas price sensitivity." },
        { slug: "p2.build-buy-decision", text: "Decide build vs buy, platform choices, and required partners." },
        { slug: "p2.value-tracking-method", text: "Define the value-tracking method: what is measured, by whom, how often, against which baseline." },
        { slug: "p2.portfolio-funding-gates", text: "Create a portfolio view of initiatives with funding released only at stage gates." },
      ],
      nonNeg: [
        { slug: "p2.scope-approved", text: "Approved scope statement and written prioritization criteria." },
        { slug: "p2.roadmap-stage-gates", text: "Phased roadmap with explicit stage gates." },
        { slug: "p2.business-case-reviewed", text: "Quantified business case reviewed by finance and operations." },
        { slug: "p2.value-framework-ready", text: "Value-tracking framework ready before the first pilot." },
      ],
      tips: "Express benefits in terms that survive price cycles: per barrel, per operating day, uptime, maintenance cost ratio. Absolute dollars become meaningless when prices move.",
    },
    3: {
      objective: "Design the organization, decision rights, skills, and ways of working that will deliver and then sustain the program.",
      activities: [
        { slug: "p3.governance-published", text: "Publish governance: steering, working groups, escalation paths, and a RACI for key decisions." },
        { slug: "p3.post-golive-operating-model", text: "Design the post-go-live operating model — who owns the solution when the project team leaves." },
        { slug: "p3.critical-roles", text: "Identify critical roles (product owner, data steward, domain expert, change lead) and fill or develop them." },
        { slug: "p3.change-comms-plan", text: "Write a change and communications plan that involves the front line early." },
        { slug: "p3.upskilling-plan", text: "Plan upskilling for both technical and operational staff, including contractors." },
        { slug: "p3.incentive-alignment", text: "Align incentives and performance management where the work itself is changing." },
      ],
      nonNeg: [
        { slug: "p3.governance-raci-documented", text: "Documented governance structure and RACI." },
        { slug: "p3.post-golive-owners", text: "Named owners for the solution after go-live." },
        { slug: "p3.change-plan-measurable", text: "Change-management plan with measurable adoption goals." },
        { slug: "p3.skills-gap-plan", text: "Skills-gap assessment and development plan for critical roles." },
      ],
      tips: "Operating culture in this industry is strong and often rightly cautious. Designs that ignore experienced operations and maintenance people do not embed.",
    },
    4: {
      objective: "Create an executable plan that manages technical, operational, cyber, and change risk without stopping production.",
      activities: [
        { slug: "p4.resource-loaded-plan", text: "Build workstreams, the critical path, milestones, and a resource-loaded plan." },
        { slug: "p4.risk-register", text: "Maintain a risk register with owners and mitigations — especially OT impact, cutover, and cyber." },
        { slug: "p4.environments-ot-isolation", text: "Define environments (dev / test / prod) and OT isolation where required." },
        { slug: "p4.integration-testing-plan", text: "Plan integration, data connection or migration, and testing that includes operational scenarios." },
        { slug: "p4.cutover-approach", text: "Write the cutover or go-live approach with rollback criteria that operations will actually use." },
        { slug: "p4.quality-gates", text: "Set quality gates and a definition of done for every major deliverable." },
      ],
      nonNeg: [
        { slug: "p4.plan-committed", text: "Detailed plan with critical path and committed resources." },
        { slug: "p4.risk-register-complete", text: "Risk register with explicit OT, HSE, and cyber items and mitigations." },
        { slug: "p4.cutover-rollback-plan", text: "Go-live / cutover criteria and a rollback plan." },
        { slug: "p4.operational-testing-strategy", text: "Testing strategy that includes operational scenarios, not only technical tests." },
      ],
      tips: "On producing assets, big-bang cutovers are high risk. Prefer phased, reversible steps and a clear operational fallback.",
    },
    5: {
      objective: "Deliver working capability, prove value with real data, and create the evidence base for scale — or for a stop.",
      activities: [
        { slug: "p5.pilot-run", text: "Run the pilot or first release against the agreed success metrics and the recorded baseline." },
        { slug: "p5.value-measured", text: "Measure actual value with the tracking framework, including where it missed." },
        { slug: "p5.lessons-captured", text: "Capture lessons and refine both the solution and the work process." },
        { slug: "p5.scale-decision", text: "Take a formal scale / pivot / stop decision to the steering committee with evidence." },
        { slug: "p5.handover-complete", text: "Complete training, documentation, and handover to the operational owners." },
        { slug: "p5.pilot-closed", text: "Close the pilot with a scale plan and a residual-risk register." },
        { slug: "p5.value-and-maturity-tracking", text: "Track both initiative-level value and enterprise capability maturity." },
      ],
      nonNeg: [
        { slug: "p5.pilot-results-documented", text: "Documented pilot results versus baseline, quantitative." },
        { slug: "p5.scale-decision-recorded", text: "Formal scale / no-scale decision recorded by steering." },
        { slug: "p5.ownership-accepted", text: "Operational ownership accepted and a support model in place." },
        { slug: "p5.residual-risk-updated", text: "Updated residual-risk register for the scale phase." },
      ],
      tips: "Many oil and gas programs die in pilot purgatory. Force a clear scale decision. If value is not materializing, stop or redesign rather than quietly expanding scope.",
    },
    6: {
      objective: "Leave project mode. Run a living operating capability with reviews, improvement, and value protection.",
      activities: [
        { slug: "p6.embed-in-operations", text: "Embed the solution in standard operating procedures and the actual decision process." },
        { slug: "p6.value-review-cadence", text: "Run monthly value reviews and a quarterly strategy/roadmap refresh with leadership visibility." },
        { slug: "p6.ci-backlog", text: "Keep a continuous-improvement backlog owned by the operational product owner." },
        { slug: "p6.roadmap-refresh", text: "Refresh the roadmap as technology, regulation, and the asset base change." },
        { slug: "p6.periodic-audits", text: "Audit data quality, model health (if applicable), and cyber posture on a defined cadence." },
        { slug: "p6.capability-sustainment", text: "Keep the change network and skills pipeline alive so capability does not decay after go-live." },
      ],
      nonNeg: [
        { slug: "p6.living-operating-model", text: "Living operating model with a named product or process owner." },
        { slug: "p6.scheduled-reviews", text: "Scheduled value and health reviews with leadership visibility." },
        { slug: "p6.ci-ownership", text: "Continuous-improvement process and backlog ownership." },
        { slug: "p6.health-metrics-defined", text: "Defined metrics and review process for data quality, model health, and security posture as applicable." },
      ],
      tips: "The most common long-term failure is treating the program as finished at go-live. Prices, regulations, assets, and crews change. Continuous management is part of the design.",
    },
  },
  erp: {
    0: {
      objective: "Secure visible, sustained executive sponsorship and a shared definition of success that survives commodity-price cycles.",
      activities: [
        { slug: "p0.sponsor-named", text: "Name executive sponsor(s) with real authority — operations leadership, not only IT or digital." },
        { slug: "p0.one-page-charter", text: "Draft a one-page charter linking the program to strategy, HSE, and energy-transition goals." },
        { slug: "p0.outcome-statements", text: "Define three to five outcome statements in operational language (cost/boe, uptime, emissions, cycle time)." },
        { slug: "p0.steering-committee", text: "Stand up a steering committee with decision rights, membership, and a fixed cadence." },
        { slug: "p0.leadership-briefing", text: "Brief the broader leadership team and the operational stakeholders who will live with the change." },
        { slug: "p0.funding-philosophy", text: "Agree the funding philosophy (ring-fenced or value-gated) so the program is not the first cut in a downturn." },
      ],
      nonNeg: [
        { slug: "p0.sponsor-committed", text: "Named executive sponsor with written commitment and time allocation." },
        { slug: "p0.charter-approved", text: "Approved program charter with outcomes and success metrics." },
        { slug: "p0.steering-charter", text: "Steering-committee charter: membership, decision rights, cadence." },
        { slug: "p0.value-hypothesis-signed", text: "Initial value hypothesis signed by finance and operations." },
      ],
      tips: "In oil and gas, sponsorship must include operations. Programs owned only by the technology function almost never scale past pilots.",
    },
    1: {
      objective: "Understand the true starting point — data, processes, systems, capabilities, culture, and constraints — before designing solutions.",
      activities: [
        { slug: "p1.systems-landscape", text: "Map the current systems landscape (OT, IT, data platforms, point solutions) and the integration points that matter." },
        { slug: "p1.data-quality-assessment", text: "Assess data quality, access, ownership, and readiness for the intended use cases." },
        { slug: "p1.process-decision-points", text: "Document the processes and decision points the program will change." },
        { slug: "p1.readiness-assessment", text: "Evaluate skills, roles, and cultural readiness, including contractors and remote crews." },
        { slug: "p1.constraints-captured", text: "Capture regulatory, HSE, cybersecurity, and production-continuity constraints." },
        { slug: "p1.baseline-metrics", text: "Record baseline metrics with sources so later value claims can be proven." },
        { slug: "p1.process-master-data-audit", text: "Run a process-harmonization and master-data quality audit before design freeze." },
      ],
      nonNeg: [
        { slug: "p1.landscape-documented", text: "Documented current-state systems and data landscape." },
        { slug: "p1.baseline-metrics-documented", text: "Baseline metrics with data sources for the primary success measures." },
        { slug: "p1.constraint-register", text: "Risk and constraint register covering cyber, HSE, regulatory, and legacy OT." },
        { slug: "p1.stakeholder-impact-map", text: "Stakeholder map and first-pass change-impact assessment." },
        { slug: "p1.master-data-baseline", text: "Master-data quality baseline and ownership model." },
      ],
      tips: "Do not skip the data reality check. Most AI, twin, and analytics failures in this industry start with fragmented or inaccessible data, not weak models.",
    },
    2: {
      objective: "Turn vision into a governed scope, a sequenced roadmap, and a quantified case that can be steered.",
      activities: [
        { slug: "p2.scope-statement", text: "Write in-scope and out-of-scope, plus the process for changing either." },
        { slug: "p2.prioritization", text: "Prioritize use cases or workstreams by value, feasibility, data readiness, and operational risk." },
        { slug: "p2.phased-roadmap", text: "Build a phased roadmap (pilot → scale → embed) with stage gates tied to measured value." },
        { slug: "p2.business-case", text: "Quantify the business case with conservative assumptions and oil/gas price sensitivity." },
        { slug: "p2.build-buy-decision", text: "Decide build vs buy, platform choices, and required partners." },
        { slug: "p2.value-tracking-method", text: "Define the value-tracking method: what is measured, by whom, how often, against which baseline." },
      ],
      nonNeg: [
        { slug: "p2.scope-approved", text: "Approved scope statement and written prioritization criteria." },
        { slug: "p2.roadmap-stage-gates", text: "Phased roadmap with explicit stage gates." },
        { slug: "p2.business-case-reviewed", text: "Quantified business case reviewed by finance and operations." },
        { slug: "p2.value-framework-ready", text: "Value-tracking framework ready before the first pilot." },
      ],
      tips: "Express benefits in terms that survive price cycles: per barrel, per operating day, uptime, maintenance cost ratio. Absolute dollars become meaningless when prices move.",
    },
    3: {
      objective: "Design the organization, decision rights, skills, and ways of working that will deliver and then sustain the program.",
      activities: [
        { slug: "p3.governance-published", text: "Publish governance: steering, working groups, escalation paths, and a RACI for key decisions." },
        { slug: "p3.post-golive-operating-model", text: "Design the post-go-live operating model — who owns the solution when the project team leaves." },
        { slug: "p3.critical-roles", text: "Identify critical roles (product owner, data steward, domain expert, change lead) and fill or develop them." },
        { slug: "p3.change-comms-plan", text: "Write a change and communications plan that involves the front line early." },
        { slug: "p3.upskilling-plan", text: "Plan upskilling for both technical and operational staff, including contractors." },
        { slug: "p3.incentive-alignment", text: "Align incentives and performance management where the work itself is changing." },
      ],
      nonNeg: [
        { slug: "p3.governance-raci-documented", text: "Documented governance structure and RACI." },
        { slug: "p3.post-golive-owners", text: "Named owners for the solution after go-live." },
        { slug: "p3.change-plan-measurable", text: "Change-management plan with measurable adoption goals." },
        { slug: "p3.skills-gap-plan", text: "Skills-gap assessment and development plan for critical roles." },
      ],
      tips: "Operating culture in this industry is strong and often rightly cautious. Designs that ignore experienced operations and maintenance people do not embed.",
    },
    4: {
      objective: "Create an executable plan that manages technical, operational, cyber, and change risk without stopping production.",
      activities: [
        { slug: "p4.resource-loaded-plan", text: "Build workstreams, the critical path, milestones, and a resource-loaded plan." },
        { slug: "p4.risk-register", text: "Maintain a risk register with owners and mitigations — especially OT impact, cutover, and cyber." },
        { slug: "p4.environments-ot-isolation", text: "Define environments (dev / test / prod) and OT isolation where required." },
        { slug: "p4.integration-testing-plan", text: "Plan integration, data connection or migration, and testing that includes operational scenarios." },
        { slug: "p4.cutover-approach", text: "Write the cutover or go-live approach with rollback criteria that operations will actually use." },
        { slug: "p4.quality-gates", text: "Set quality gates and a definition of done for every major deliverable." },
        { slug: "p4.migration-dress-rehearsals", text: "Plan data migration with multiple dress rehearsals and a freeze calendar operations can live with." },
      ],
      nonNeg: [
        { slug: "p4.plan-committed", text: "Detailed plan with critical path and committed resources." },
        { slug: "p4.risk-register-complete", text: "Risk register with explicit OT, HSE, and cyber items and mitigations." },
        { slug: "p4.cutover-rollback-plan", text: "Go-live / cutover criteria and a rollback plan." },
        { slug: "p4.operational-testing-strategy", text: "Testing strategy that includes operational scenarios, not only technical tests." },
        { slug: "p4.cutover-runbook-rehearsed", text: "Cutover runbook with at least one full dress rehearsal recorded." },
      ],
      tips: "On producing assets, big-bang cutovers are high risk. Prefer phased, reversible steps and a clear operational fallback.",
    },
    5: {
      objective: "Deliver working capability, prove value with real data, and create the evidence base for scale — or for a stop.",
      activities: [
        { slug: "p5.pilot-run", text: "Run the pilot or first release against the agreed success metrics and the recorded baseline." },
        { slug: "p5.value-measured", text: "Measure actual value with the tracking framework, including where it missed." },
        { slug: "p5.lessons-captured", text: "Capture lessons and refine both the solution and the work process." },
        { slug: "p5.scale-decision", text: "Take a formal scale / pivot / stop decision to the steering committee with evidence." },
        { slug: "p5.handover-complete", text: "Complete training, documentation, and handover to the operational owners." },
        { slug: "p5.pilot-closed", text: "Close the pilot with a scale plan and a residual-risk register." },
        { slug: "p5.hypercare-staffing", text: "Staff a hypercare window with exit criteria and residual-issue ownership." },
      ],
      nonNeg: [
        { slug: "p5.pilot-results-documented", text: "Documented pilot results versus baseline, quantitative." },
        { slug: "p5.scale-decision-recorded", text: "Formal scale / no-scale decision recorded by steering." },
        { slug: "p5.ownership-accepted", text: "Operational ownership accepted and a support model in place." },
        { slug: "p5.residual-risk-updated", text: "Updated residual-risk register for the scale phase." },
        { slug: "p5.hypercare-plan-accepted", text: "Hypercare plan with exit criteria accepted by operations and finance." },
      ],
      tips: "Many oil and gas programs die in pilot purgatory. Force a clear scale decision. If value is not materializing, stop or redesign rather than quietly expanding scope.",
    },
    6: {
      objective: "Leave project mode. Run a living operating capability with reviews, improvement, and value protection.",
      activities: [
        { slug: "p6.embed-in-operations", text: "Embed the solution in standard operating procedures and the actual decision process." },
        { slug: "p6.value-review-cadence", text: "Run monthly value reviews and a quarterly strategy/roadmap refresh with leadership visibility." },
        { slug: "p6.ci-backlog", text: "Keep a continuous-improvement backlog owned by the operational product owner." },
        { slug: "p6.roadmap-refresh", text: "Refresh the roadmap as technology, regulation, and the asset base change." },
        { slug: "p6.periodic-audits", text: "Audit data quality, model health (if applicable), and cyber posture on a defined cadence." },
        { slug: "p6.capability-sustainment", text: "Keep the change network and skills pipeline alive so capability does not decay after go-live." },
      ],
      nonNeg: [
        { slug: "p6.living-operating-model", text: "Living operating model with a named product or process owner." },
        { slug: "p6.scheduled-reviews", text: "Scheduled value and health reviews with leadership visibility." },
        { slug: "p6.ci-ownership", text: "Continuous-improvement process and backlog ownership." },
        { slug: "p6.health-metrics-defined", text: "Defined metrics and review process for data quality, model health, and security posture as applicable." },
      ],
      tips: "The most common long-term failure is treating the program as finished at go-live. Prices, regulations, assets, and crews change. Continuous management is part of the design.",
    },
  },
  etrm: {
    0: {
      objective: "Secure visible, sustained executive sponsorship and a shared definition of success that survives commodity-price cycles.",
      activities: [
        { slug: "p0.sponsor-named", text: "Name executive sponsor(s) with real authority — operations leadership, not only IT or digital." },
        { slug: "p0.one-page-charter", text: "Draft a one-page charter linking the program to strategy, HSE, and energy-transition goals." },
        { slug: "p0.outcome-statements", text: "Define three to five outcome statements in operational language (cost/boe, uptime, emissions, cycle time)." },
        { slug: "p0.steering-committee", text: "Stand up a steering committee with decision rights, membership, and a fixed cadence." },
        { slug: "p0.leadership-briefing", text: "Brief the broader leadership team and the operational stakeholders who will live with the change." },
        { slug: "p0.funding-philosophy", text: "Agree the funding philosophy (ring-fenced or value-gated) so the program is not the first cut in a downturn." },
      ],
      nonNeg: [
        { slug: "p0.sponsor-committed", text: "Named executive sponsor with written commitment and time allocation." },
        { slug: "p0.charter-approved", text: "Approved program charter with outcomes and success metrics." },
        { slug: "p0.steering-charter", text: "Steering-committee charter: membership, decision rights, cadence." },
        { slug: "p0.value-hypothesis-signed", text: "Initial value hypothesis signed by finance and operations." },
      ],
      tips: "In oil and gas, sponsorship must include operations. Programs owned only by the technology function almost never scale past pilots.",
    },
    1: {
      objective: "Understand the true starting point — data, processes, systems, capabilities, culture, and constraints — before designing solutions.",
      activities: [
        { slug: "p1.systems-landscape", text: "Map the current systems landscape (OT, IT, data platforms, point solutions) and the integration points that matter." },
        { slug: "p1.data-quality-assessment", text: "Assess data quality, access, ownership, and readiness for the intended use cases." },
        { slug: "p1.process-decision-points", text: "Document the processes and decision points the program will change." },
        { slug: "p1.readiness-assessment", text: "Evaluate skills, roles, and cultural readiness, including contractors and remote crews." },
        { slug: "p1.constraints-captured", text: "Capture regulatory, HSE, cybersecurity, and production-continuity constraints." },
        { slug: "p1.baseline-metrics", text: "Record baseline metrics with sources so later value claims can be proven." },
        { slug: "p1.deal-lifecycle-mapping", text: "Map current deal capture, risk, settlement, and control points across desks and commodities." },
      ],
      nonNeg: [
        { slug: "p1.landscape-documented", text: "Documented current-state systems and data landscape." },
        { slug: "p1.baseline-metrics-documented", text: "Baseline metrics with data sources for the primary success measures." },
        { slug: "p1.constraint-register", text: "Risk and constraint register covering cyber, HSE, regulatory, and legacy OT." },
        { slug: "p1.stakeholder-impact-map", text: "Stakeholder map and first-pass change-impact assessment." },
      ],
      tips: "Do not skip the data reality check. Most AI, twin, and analytics failures in this industry start with fragmented or inaccessible data, not weak models.",
    },
    2: {
      objective: "Turn vision into a governed scope, a sequenced roadmap, and a quantified case that can be steered.",
      activities: [
        { slug: "p2.scope-statement", text: "Write in-scope and out-of-scope, plus the process for changing either." },
        { slug: "p2.prioritization", text: "Prioritize use cases or workstreams by value, feasibility, data readiness, and operational risk." },
        { slug: "p2.phased-roadmap", text: "Build a phased roadmap (pilot → scale → embed) with stage gates tied to measured value." },
        { slug: "p2.business-case", text: "Quantify the business case with conservative assumptions and oil/gas price sensitivity." },
        { slug: "p2.build-buy-decision", text: "Decide build vs buy, platform choices, and required partners." },
        { slug: "p2.value-tracking-method", text: "Define the value-tracking method: what is measured, by whom, how often, against which baseline." },
        { slug: "p2.risk-limits-in-scope", text: "Put regulatory and internal risk-limit requirements into scope, not a later control add-on." },
      ],
      nonNeg: [
        { slug: "p2.scope-approved", text: "Approved scope statement and written prioritization criteria." },
        { slug: "p2.roadmap-stage-gates", text: "Phased roadmap with explicit stage gates." },
        { slug: "p2.business-case-reviewed", text: "Quantified business case reviewed by finance and operations." },
        { slug: "p2.value-framework-ready", text: "Value-tracking framework ready before the first pilot." },
        { slug: "p2.risk-limit-mapping", text: "Risk-limit and regulatory-control mapping into the target system." },
      ],
      tips: "Express benefits in terms that survive price cycles: per barrel, per operating day, uptime, maintenance cost ratio. Absolute dollars become meaningless when prices move.",
    },
    3: {
      objective: "Design the organization, decision rights, skills, and ways of working that will deliver and then sustain the program.",
      activities: [
        { slug: "p3.governance-published", text: "Publish governance: steering, working groups, escalation paths, and a RACI for key decisions." },
        { slug: "p3.post-golive-operating-model", text: "Design the post-go-live operating model — who owns the solution when the project team leaves." },
        { slug: "p3.critical-roles", text: "Identify critical roles (product owner, data steward, domain expert, change lead) and fill or develop them." },
        { slug: "p3.change-comms-plan", text: "Write a change and communications plan that involves the front line early." },
        { slug: "p3.upskilling-plan", text: "Plan upskilling for both technical and operational staff, including contractors." },
        { slug: "p3.incentive-alignment", text: "Align incentives and performance management where the work itself is changing." },
      ],
      nonNeg: [
        { slug: "p3.governance-raci-documented", text: "Documented governance structure and RACI." },
        { slug: "p3.post-golive-owners", text: "Named owners for the solution after go-live." },
        { slug: "p3.change-plan-measurable", text: "Change-management plan with measurable adoption goals." },
        { slug: "p3.skills-gap-plan", text: "Skills-gap assessment and development plan for critical roles." },
      ],
      tips: "Operating culture in this industry is strong and often rightly cautious. Designs that ignore experienced operations and maintenance people do not embed.",
    },
    4: {
      objective: "Create an executable plan that manages technical, operational, cyber, and change risk without stopping production.",
      activities: [
        { slug: "p4.resource-loaded-plan", text: "Build workstreams, the critical path, milestones, and a resource-loaded plan." },
        { slug: "p4.risk-register", text: "Maintain a risk register with owners and mitigations — especially OT impact, cutover, and cyber." },
        { slug: "p4.environments-ot-isolation", text: "Define environments (dev / test / prod) and OT isolation where required." },
        { slug: "p4.integration-testing-plan", text: "Plan integration, data connection or migration, and testing that includes operational scenarios." },
        { slug: "p4.cutover-approach", text: "Write the cutover or go-live approach with rollback criteria that operations will actually use." },
        { slug: "p4.quality-gates", text: "Set quality gates and a definition of done for every major deliverable." },
        { slug: "p4.stress-scenario-testing", text: "Test position, valuation, and limit calculations under realistic market-stress scenarios." },
      ],
      nonNeg: [
        { slug: "p4.plan-committed", text: "Detailed plan with critical path and committed resources." },
        { slug: "p4.risk-register-complete", text: "Risk register with explicit OT, HSE, and cyber items and mitigations." },
        { slug: "p4.cutover-rollback-plan", text: "Go-live / cutover criteria and a rollback plan." },
        { slug: "p4.operational-testing-strategy", text: "Testing strategy that includes operational scenarios, not only technical tests." },
      ],
      tips: "On producing assets, big-bang cutovers are high risk. Prefer phased, reversible steps and a clear operational fallback.",
    },
    5: {
      objective: "Deliver working capability, prove value with real data, and create the evidence base for scale — or for a stop.",
      activities: [
        { slug: "p5.pilot-run", text: "Run the pilot or first release against the agreed success metrics and the recorded baseline." },
        { slug: "p5.value-measured", text: "Measure actual value with the tracking framework, including where it missed." },
        { slug: "p5.lessons-captured", text: "Capture lessons and refine both the solution and the work process." },
        { slug: "p5.scale-decision", text: "Take a formal scale / pivot / stop decision to the steering committee with evidence." },
        { slug: "p5.handover-complete", text: "Complete training, documentation, and handover to the operational owners." },
        { slug: "p5.pilot-closed", text: "Close the pilot with a scale plan and a residual-risk register." },
      ],
      nonNeg: [
        { slug: "p5.pilot-results-documented", text: "Documented pilot results versus baseline, quantitative." },
        { slug: "p5.scale-decision-recorded", text: "Formal scale / no-scale decision recorded by steering." },
        { slug: "p5.ownership-accepted", text: "Operational ownership accepted and a support model in place." },
        { slug: "p5.residual-risk-updated", text: "Updated residual-risk register for the scale phase." },
      ],
      tips: "Many oil and gas programs die in pilot purgatory. Force a clear scale decision. If value is not materializing, stop or redesign rather than quietly expanding scope.",
    },
    6: {
      objective: "Leave project mode. Run a living operating capability with reviews, improvement, and value protection.",
      activities: [
        { slug: "p6.embed-in-operations", text: "Embed the solution in standard operating procedures and the actual decision process." },
        { slug: "p6.value-review-cadence", text: "Run monthly value reviews and a quarterly strategy/roadmap refresh with leadership visibility." },
        { slug: "p6.ci-backlog", text: "Keep a continuous-improvement backlog owned by the operational product owner." },
        { slug: "p6.roadmap-refresh", text: "Refresh the roadmap as technology, regulation, and the asset base change." },
        { slug: "p6.periodic-audits", text: "Audit data quality, model health (if applicable), and cyber posture on a defined cadence." },
        { slug: "p6.capability-sustainment", text: "Keep the change network and skills pipeline alive so capability does not decay after go-live." },
      ],
      nonNeg: [
        { slug: "p6.living-operating-model", text: "Living operating model with a named product or process owner." },
        { slug: "p6.scheduled-reviews", text: "Scheduled value and health reviews with leadership visibility." },
        { slug: "p6.ci-ownership", text: "Continuous-improvement process and backlog ownership." },
        { slug: "p6.health-metrics-defined", text: "Defined metrics and review process for data quality, model health, and security posture as applicable." },
      ],
      tips: "The most common long-term failure is treating the program as finished at go-live. Prices, regulations, assets, and crews change. Continuous management is part of the design.",
    },
  },
  ai: {
    0: {
      objective: "Secure visible, sustained executive sponsorship and a shared definition of success that survives commodity-price cycles.",
      activities: [
        { slug: "p0.sponsor-named", text: "Name executive sponsor(s) with real authority — operations leadership, not only IT or digital." },
        { slug: "p0.one-page-charter", text: "Draft a one-page charter linking the program to strategy, HSE, and energy-transition goals." },
        { slug: "p0.outcome-statements", text: "Define three to five outcome statements in operational language (cost/boe, uptime, emissions, cycle time)." },
        { slug: "p0.steering-committee", text: "Stand up a steering committee with decision rights, membership, and a fixed cadence." },
        { slug: "p0.leadership-briefing", text: "Brief the broader leadership team and the operational stakeholders who will live with the change." },
        { slug: "p0.funding-philosophy", text: "Agree the funding philosophy (ring-fenced or value-gated) so the program is not the first cut in a downturn." },
      ],
      nonNeg: [
        { slug: "p0.sponsor-committed", text: "Named executive sponsor with written commitment and time allocation." },
        { slug: "p0.charter-approved", text: "Approved program charter with outcomes and success metrics." },
        { slug: "p0.steering-charter", text: "Steering-committee charter: membership, decision rights, cadence." },
        { slug: "p0.value-hypothesis-signed", text: "Initial value hypothesis signed by finance and operations." },
      ],
      tips: "In oil and gas, sponsorship must include operations. Programs owned only by the technology function almost never scale past pilots.",
    },
    1: {
      objective: "Understand the true starting point — data, processes, systems, capabilities, culture, and constraints — before designing solutions.",
      activities: [
        { slug: "p1.systems-landscape", text: "Map the current systems landscape (OT, IT, data platforms, point solutions) and the integration points that matter." },
        { slug: "p1.data-quality-assessment", text: "Assess data quality, access, ownership, and readiness for the intended use cases." },
        { slug: "p1.process-decision-points", text: "Document the processes and decision points the program will change." },
        { slug: "p1.readiness-assessment", text: "Evaluate skills, roles, and cultural readiness, including contractors and remote crews." },
        { slug: "p1.constraints-captured", text: "Capture regulatory, HSE, cybersecurity, and production-continuity constraints." },
        { slug: "p1.baseline-metrics", text: "Record baseline metrics with sources so later value claims can be proven." },
        { slug: "p1.data-readiness-by-use-case", text: "Run a data-readiness assessment for each priority use case: volume, quality, labels, access, and lineage." },
      ],
      nonNeg: [
        { slug: "p1.landscape-documented", text: "Documented current-state systems and data landscape." },
        { slug: "p1.baseline-metrics-documented", text: "Baseline metrics with data sources for the primary success measures." },
        { slug: "p1.constraint-register", text: "Risk and constraint register covering cyber, HSE, regulatory, and legacy OT." },
        { slug: "p1.stakeholder-impact-map", text: "Stakeholder map and first-pass change-impact assessment." },
        { slug: "p1.data-readiness-documented", text: "Written data-readiness result for the first production use case." },
      ],
      tips: "Do not skip the data reality check. Most AI, twin, and analytics failures in this industry start with fragmented or inaccessible data, not weak models.",
    },
    2: {
      objective: "Turn vision into a governed scope, a sequenced roadmap, and a quantified case that can be steered.",
      activities: [
        { slug: "p2.scope-statement", text: "Write in-scope and out-of-scope, plus the process for changing either." },
        { slug: "p2.prioritization", text: "Prioritize use cases or workstreams by value, feasibility, data readiness, and operational risk." },
        { slug: "p2.phased-roadmap", text: "Build a phased roadmap (pilot → scale → embed) with stage gates tied to measured value." },
        { slug: "p2.business-case", text: "Quantify the business case with conservative assumptions and oil/gas price sensitivity." },
        { slug: "p2.build-buy-decision", text: "Decide build vs buy, platform choices, and required partners." },
        { slug: "p2.value-tracking-method", text: "Define the value-tracking method: what is measured, by whom, how often, against which baseline." },
      ],
      nonNeg: [
        { slug: "p2.scope-approved", text: "Approved scope statement and written prioritization criteria." },
        { slug: "p2.roadmap-stage-gates", text: "Phased roadmap with explicit stage gates." },
        { slug: "p2.business-case-reviewed", text: "Quantified business case reviewed by finance and operations." },
        { slug: "p2.value-framework-ready", text: "Value-tracking framework ready before the first pilot." },
      ],
      tips: "Express benefits in terms that survive price cycles: per barrel, per operating day, uptime, maintenance cost ratio. Absolute dollars become meaningless when prices move.",
    },
    3: {
      objective: "Design the organization, decision rights, skills, and ways of working that will deliver and then sustain the program.",
      activities: [
        { slug: "p3.governance-published", text: "Publish governance: steering, working groups, escalation paths, and a RACI for key decisions." },
        { slug: "p3.post-golive-operating-model", text: "Design the post-go-live operating model — who owns the solution when the project team leaves." },
        { slug: "p3.critical-roles", text: "Identify critical roles (product owner, data steward, domain expert, change lead) and fill or develop them." },
        { slug: "p3.change-comms-plan", text: "Write a change and communications plan that involves the front line early." },
        { slug: "p3.upskilling-plan", text: "Plan upskilling for both technical and operational staff, including contractors." },
        { slug: "p3.incentive-alignment", text: "Align incentives and performance management where the work itself is changing." },
        { slug: "p3.mlops-governance", text: "Define model governance, inventory, owners, and monitoring responsibilities (MLOps)." },
      ],
      nonNeg: [
        { slug: "p3.governance-raci-documented", text: "Documented governance structure and RACI." },
        { slug: "p3.post-golive-owners", text: "Named owners for the solution after go-live." },
        { slug: "p3.change-plan-measurable", text: "Change-management plan with measurable adoption goals." },
        { slug: "p3.skills-gap-plan", text: "Skills-gap assessment and development plan for critical roles." },
        { slug: "p3.model-inventory-owners", text: "Model inventory and named operational owner per production model." },
      ],
      tips: "Operating culture in this industry is strong and often rightly cautious. Designs that ignore experienced operations and maintenance people do not embed.",
    },
    4: {
      objective: "Create an executable plan that manages technical, operational, cyber, and change risk without stopping production.",
      activities: [
        { slug: "p4.resource-loaded-plan", text: "Build workstreams, the critical path, milestones, and a resource-loaded plan." },
        { slug: "p4.risk-register", text: "Maintain a risk register with owners and mitigations — especially OT impact, cutover, and cyber." },
        { slug: "p4.environments-ot-isolation", text: "Define environments (dev / test / prod) and OT isolation where required." },
        { slug: "p4.integration-testing-plan", text: "Plan integration, data connection or migration, and testing that includes operational scenarios." },
        { slug: "p4.cutover-approach", text: "Write the cutover or go-live approach with rollback criteria that operations will actually use." },
        { slug: "p4.quality-gates", text: "Set quality gates and a definition of done for every major deliverable." },
      ],
      nonNeg: [
        { slug: "p4.plan-committed", text: "Detailed plan with critical path and committed resources." },
        { slug: "p4.risk-register-complete", text: "Risk register with explicit OT, HSE, and cyber items and mitigations." },
        { slug: "p4.cutover-rollback-plan", text: "Go-live / cutover criteria and a rollback plan." },
        { slug: "p4.operational-testing-strategy", text: "Testing strategy that includes operational scenarios, not only technical tests." },
      ],
      tips: "On producing assets, big-bang cutovers are high risk. Prefer phased, reversible steps and a clear operational fallback.",
    },
    5: {
      objective: "Deliver working capability, prove value with real data, and create the evidence base for scale — or for a stop.",
      activities: [
        { slug: "p5.pilot-run", text: "Run the pilot or first release against the agreed success metrics and the recorded baseline." },
        { slug: "p5.value-measured", text: "Measure actual value with the tracking framework, including where it missed." },
        { slug: "p5.lessons-captured", text: "Capture lessons and refine both the solution and the work process." },
        { slug: "p5.scale-decision", text: "Take a formal scale / pivot / stop decision to the steering committee with evidence." },
        { slug: "p5.handover-complete", text: "Complete training, documentation, and handover to the operational owners." },
        { slug: "p5.pilot-closed", text: "Close the pilot with a scale plan and a residual-risk register." },
      ],
      nonNeg: [
        { slug: "p5.pilot-results-documented", text: "Documented pilot results versus baseline, quantitative." },
        { slug: "p5.scale-decision-recorded", text: "Formal scale / no-scale decision recorded by steering." },
        { slug: "p5.ownership-accepted", text: "Operational ownership accepted and a support model in place." },
        { slug: "p5.residual-risk-updated", text: "Updated residual-risk register for the scale phase." },
      ],
      tips: "Many oil and gas programs die in pilot purgatory. Force a clear scale decision. If value is not materializing, stop or redesign rather than quietly expanding scope.",
    },
    6: {
      objective: "Leave project mode. Run a living operating capability with reviews, improvement, and value protection.",
      activities: [
        { slug: "p6.embed-in-operations", text: "Embed the solution in standard operating procedures and the actual decision process." },
        { slug: "p6.value-review-cadence", text: "Run monthly value reviews and a quarterly strategy/roadmap refresh with leadership visibility." },
        { slug: "p6.ci-backlog", text: "Keep a continuous-improvement backlog owned by the operational product owner." },
        { slug: "p6.roadmap-refresh", text: "Refresh the roadmap as technology, regulation, and the asset base change." },
        { slug: "p6.periodic-audits", text: "Audit data quality, model health (if applicable), and cyber posture on a defined cadence." },
        { slug: "p6.capability-sustainment", text: "Keep the change network and skills pipeline alive so capability does not decay after go-live." },
        { slug: "p6.retraining-and-override", text: "Set retraining triggers, drift alerts, and a human override path for operational decisions." },
      ],
      nonNeg: [
        { slug: "p6.living-operating-model", text: "Living operating model with a named product or process owner." },
        { slug: "p6.scheduled-reviews", text: "Scheduled value and health reviews with leadership visibility." },
        { slug: "p6.ci-ownership", text: "Continuous-improvement process and backlog ownership." },
        { slug: "p6.health-metrics-defined", text: "Defined metrics and review process for data quality, model health, and security posture as applicable." },
        { slug: "p6.monitoring-staffed", text: "Production monitoring and retraining triggers documented and staffed." },
      ],
      tips: "The most common long-term failure is treating the program as finished at go-live. Prices, regulations, assets, and crews change. Continuous management is part of the design.",
    },
  },
  twin: {
    0: {
      objective: "Secure visible, sustained executive sponsorship and a shared definition of success that survives commodity-price cycles.",
      activities: [
        { slug: "p0.sponsor-named", text: "Name executive sponsor(s) with real authority — operations leadership, not only IT or digital." },
        { slug: "p0.one-page-charter", text: "Draft a one-page charter linking the program to strategy, HSE, and energy-transition goals." },
        { slug: "p0.outcome-statements", text: "Define three to five outcome statements in operational language (cost/boe, uptime, emissions, cycle time)." },
        { slug: "p0.steering-committee", text: "Stand up a steering committee with decision rights, membership, and a fixed cadence." },
        { slug: "p0.leadership-briefing", text: "Brief the broader leadership team and the operational stakeholders who will live with the change." },
        { slug: "p0.funding-philosophy", text: "Agree the funding philosophy (ring-fenced or value-gated) so the program is not the first cut in a downturn." },
      ],
      nonNeg: [
        { slug: "p0.sponsor-committed", text: "Named executive sponsor with written commitment and time allocation." },
        { slug: "p0.charter-approved", text: "Approved program charter with outcomes and success metrics." },
        { slug: "p0.steering-charter", text: "Steering-committee charter: membership, decision rights, cadence." },
        { slug: "p0.value-hypothesis-signed", text: "Initial value hypothesis signed by finance and operations." },
      ],
      tips: "In oil and gas, sponsorship must include operations. Programs owned only by the technology function almost never scale past pilots.",
    },
    1: {
      objective: "Understand the true starting point — data, processes, systems, capabilities, culture, and constraints — before designing solutions.",
      activities: [
        { slug: "p1.systems-landscape", text: "Map the current systems landscape (OT, IT, data platforms, point solutions) and the integration points that matter." },
        { slug: "p1.data-quality-assessment", text: "Assess data quality, access, ownership, and readiness for the intended use cases." },
        { slug: "p1.process-decision-points", text: "Document the processes and decision points the program will change." },
        { slug: "p1.readiness-assessment", text: "Evaluate skills, roles, and cultural readiness, including contractors and remote crews." },
        { slug: "p1.constraints-captured", text: "Capture regulatory, HSE, cybersecurity, and production-continuity constraints." },
        { slug: "p1.baseline-metrics", text: "Record baseline metrics with sources so later value claims can be proven." },
        { slug: "p1.sensor-historian-assessment", text: "Assess sensor coverage, historian quality, and data latency for the target assets." },
      ],
      nonNeg: [
        { slug: "p1.landscape-documented", text: "Documented current-state systems and data landscape." },
        { slug: "p1.baseline-metrics-documented", text: "Baseline metrics with data sources for the primary success measures." },
        { slug: "p1.constraint-register", text: "Risk and constraint register covering cyber, HSE, regulatory, and legacy OT." },
        { slug: "p1.stakeholder-impact-map", text: "Stakeholder map and first-pass change-impact assessment." },
      ],
      tips: "Do not skip the data reality check. Most AI, twin, and analytics failures in this industry start with fragmented or inaccessible data, not weak models.",
    },
    2: {
      objective: "Turn vision into a governed scope, a sequenced roadmap, and a quantified case that can be steered.",
      activities: [
        { slug: "p2.scope-statement", text: "Write in-scope and out-of-scope, plus the process for changing either." },
        { slug: "p2.prioritization", text: "Prioritize use cases or workstreams by value, feasibility, data readiness, and operational risk." },
        { slug: "p2.phased-roadmap", text: "Build a phased roadmap (pilot → scale → embed) with stage gates tied to measured value." },
        { slug: "p2.business-case", text: "Quantify the business case with conservative assumptions and oil/gas price sensitivity." },
        { slug: "p2.build-buy-decision", text: "Decide build vs buy, platform choices, and required partners." },
        { slug: "p2.value-tracking-method", text: "Define the value-tracking method: what is measured, by whom, how often, against which baseline." },
        { slug: "p2.fidelity-requirements", text: "Set the fidelity level required per use case (visualization vs physics-based simulation)." },
      ],
      nonNeg: [
        { slug: "p2.scope-approved", text: "Approved scope statement and written prioritization criteria." },
        { slug: "p2.roadmap-stage-gates", text: "Phased roadmap with explicit stage gates." },
        { slug: "p2.business-case-reviewed", text: "Quantified business case reviewed by finance and operations." },
        { slug: "p2.value-framework-ready", text: "Value-tracking framework ready before the first pilot." },
        { slug: "p2.fidelity-map-signed", text: "Use-case-to-fidelity map signed by operations and engineering." },
      ],
      tips: "Express benefits in terms that survive price cycles: per barrel, per operating day, uptime, maintenance cost ratio. Absolute dollars become meaningless when prices move.",
    },
    3: {
      objective: "Design the organization, decision rights, skills, and ways of working that will deliver and then sustain the program.",
      activities: [
        { slug: "p3.governance-published", text: "Publish governance: steering, working groups, escalation paths, and a RACI for key decisions." },
        { slug: "p3.post-golive-operating-model", text: "Design the post-go-live operating model — who owns the solution when the project team leaves." },
        { slug: "p3.critical-roles", text: "Identify critical roles (product owner, data steward, domain expert, change lead) and fill or develop them." },
        { slug: "p3.change-comms-plan", text: "Write a change and communications plan that involves the front line early." },
        { slug: "p3.upskilling-plan", text: "Plan upskilling for both technical and operational staff, including contractors." },
        { slug: "p3.incentive-alignment", text: "Align incentives and performance management where the work itself is changing." },
      ],
      nonNeg: [
        { slug: "p3.governance-raci-documented", text: "Documented governance structure and RACI." },
        { slug: "p3.post-golive-owners", text: "Named owners for the solution after go-live." },
        { slug: "p3.change-plan-measurable", text: "Change-management plan with measurable adoption goals." },
        { slug: "p3.skills-gap-plan", text: "Skills-gap assessment and development plan for critical roles." },
      ],
      tips: "Operating culture in this industry is strong and often rightly cautious. Designs that ignore experienced operations and maintenance people do not embed.",
    },
    4: {
      objective: "Create an executable plan that manages technical, operational, cyber, and change risk without stopping production.",
      activities: [
        { slug: "p4.resource-loaded-plan", text: "Build workstreams, the critical path, milestones, and a resource-loaded plan." },
        { slug: "p4.risk-register", text: "Maintain a risk register with owners and mitigations — especially OT impact, cutover, and cyber." },
        { slug: "p4.environments-ot-isolation", text: "Define environments (dev / test / prod) and OT isolation where required." },
        { slug: "p4.integration-testing-plan", text: "Plan integration, data connection or migration, and testing that includes operational scenarios." },
        { slug: "p4.cutover-approach", text: "Write the cutover or go-live approach with rollback criteria that operations will actually use." },
        { slug: "p4.quality-gates", text: "Set quality gates and a definition of done for every major deliverable." },
      ],
      nonNeg: [
        { slug: "p4.plan-committed", text: "Detailed plan with critical path and committed resources." },
        { slug: "p4.risk-register-complete", text: "Risk register with explicit OT, HSE, and cyber items and mitigations." },
        { slug: "p4.cutover-rollback-plan", text: "Go-live / cutover criteria and a rollback plan." },
        { slug: "p4.operational-testing-strategy", text: "Testing strategy that includes operational scenarios, not only technical tests." },
      ],
      tips: "On producing assets, big-bang cutovers are high risk. Prefer phased, reversible steps and a clear operational fallback.",
    },
    5: {
      objective: "Deliver working capability, prove value with real data, and create the evidence base for scale — or for a stop.",
      activities: [
        { slug: "p5.pilot-run", text: "Run the pilot or first release against the agreed success metrics and the recorded baseline." },
        { slug: "p5.value-measured", text: "Measure actual value with the tracking framework, including where it missed." },
        { slug: "p5.lessons-captured", text: "Capture lessons and refine both the solution and the work process." },
        { slug: "p5.scale-decision", text: "Take a formal scale / pivot / stop decision to the steering committee with evidence." },
        { slug: "p5.handover-complete", text: "Complete training, documentation, and handover to the operational owners." },
        { slug: "p5.pilot-closed", text: "Close the pilot with a scale plan and a residual-risk register." },
        { slug: "p5.workflow-validation", text: "Validate that operators use the twin inside a real decision workflow, not as a demo." },
      ],
      nonNeg: [
        { slug: "p5.pilot-results-documented", text: "Documented pilot results versus baseline, quantitative." },
        { slug: "p5.scale-decision-recorded", text: "Formal scale / no-scale decision recorded by steering." },
        { slug: "p5.ownership-accepted", text: "Operational ownership accepted and a support model in place." },
        { slug: "p5.residual-risk-updated", text: "Updated residual-risk register for the scale phase." },
      ],
      tips: "Many oil and gas programs die in pilot purgatory. Force a clear scale decision. If value is not materializing, stop or redesign rather than quietly expanding scope.",
    },
    6: {
      objective: "Leave project mode. Run a living operating capability with reviews, improvement, and value protection.",
      activities: [
        { slug: "p6.embed-in-operations", text: "Embed the solution in standard operating procedures and the actual decision process." },
        { slug: "p6.value-review-cadence", text: "Run monthly value reviews and a quarterly strategy/roadmap refresh with leadership visibility." },
        { slug: "p6.ci-backlog", text: "Keep a continuous-improvement backlog owned by the operational product owner." },
        { slug: "p6.roadmap-refresh", text: "Refresh the roadmap as technology, regulation, and the asset base change." },
        { slug: "p6.periodic-audits", text: "Audit data quality, model health (if applicable), and cyber posture on a defined cadence." },
        { slug: "p6.capability-sustainment", text: "Keep the change network and skills pipeline alive so capability does not decay after go-live." },
      ],
      nonNeg: [
        { slug: "p6.living-operating-model", text: "Living operating model with a named product or process owner." },
        { slug: "p6.scheduled-reviews", text: "Scheduled value and health reviews with leadership visibility." },
        { slug: "p6.ci-ownership", text: "Continuous-improvement process and backlog ownership." },
        { slug: "p6.health-metrics-defined", text: "Defined metrics and review process for data quality, model health, and security posture as applicable." },
      ],
      tips: "The most common long-term failure is treating the program as finished at go-live. Prices, regulations, assets, and crews change. Continuous management is part of the design.",
    },
  },
  apm: {
    0: {
      objective: "Secure visible, sustained executive sponsorship and a shared definition of success that survives commodity-price cycles.",
      activities: [
        { slug: "p0.sponsor-named", text: "Name executive sponsor(s) with real authority — operations leadership, not only IT or digital." },
        { slug: "p0.one-page-charter", text: "Draft a one-page charter linking the program to strategy, HSE, and energy-transition goals." },
        { slug: "p0.outcome-statements", text: "Define three to five outcome statements in operational language (cost/boe, uptime, emissions, cycle time)." },
        { slug: "p0.steering-committee", text: "Stand up a steering committee with decision rights, membership, and a fixed cadence." },
        { slug: "p0.leadership-briefing", text: "Brief the broader leadership team and the operational stakeholders who will live with the change." },
        { slug: "p0.funding-philosophy", text: "Agree the funding philosophy (ring-fenced or value-gated) so the program is not the first cut in a downturn." },
      ],
      nonNeg: [
        { slug: "p0.sponsor-committed", text: "Named executive sponsor with written commitment and time allocation." },
        { slug: "p0.charter-approved", text: "Approved program charter with outcomes and success metrics." },
        { slug: "p0.steering-charter", text: "Steering-committee charter: membership, decision rights, cadence." },
        { slug: "p0.value-hypothesis-signed", text: "Initial value hypothesis signed by finance and operations." },
      ],
      tips: "In oil and gas, sponsorship must include operations. Programs owned only by the technology function almost never scale past pilots.",
    },
    1: {
      objective: "Understand the true starting point — data, processes, systems, capabilities, culture, and constraints — before designing solutions.",
      activities: [
        { slug: "p1.systems-landscape", text: "Map the current systems landscape (OT, IT, data platforms, point solutions) and the integration points that matter." },
        { slug: "p1.data-quality-assessment", text: "Assess data quality, access, ownership, and readiness for the intended use cases." },
        { slug: "p1.process-decision-points", text: "Document the processes and decision points the program will change." },
        { slug: "p1.readiness-assessment", text: "Evaluate skills, roles, and cultural readiness, including contractors and remote crews." },
        { slug: "p1.constraints-captured", text: "Capture regulatory, HSE, cybersecurity, and production-continuity constraints." },
        { slug: "p1.baseline-metrics", text: "Record baseline metrics with sources so later value claims can be proven." },
        { slug: "p1.equipment-criticality-ranking", text: "Rank critical equipment by consequence of failure and by data availability." },
      ],
      nonNeg: [
        { slug: "p1.landscape-documented", text: "Documented current-state systems and data landscape." },
        { slug: "p1.baseline-metrics-documented", text: "Baseline metrics with data sources for the primary success measures." },
        { slug: "p1.constraint-register", text: "Risk and constraint register covering cyber, HSE, regulatory, and legacy OT." },
        { slug: "p1.stakeholder-impact-map", text: "Stakeholder map and first-pass change-impact assessment." },
      ],
      tips: "Do not skip the data reality check. Most AI, twin, and analytics failures in this industry start with fragmented or inaccessible data, not weak models.",
    },
    2: {
      objective: "Turn vision into a governed scope, a sequenced roadmap, and a quantified case that can be steered.",
      activities: [
        { slug: "p2.scope-statement", text: "Write in-scope and out-of-scope, plus the process for changing either." },
        { slug: "p2.prioritization", text: "Prioritize use cases or workstreams by value, feasibility, data readiness, and operational risk." },
        { slug: "p2.phased-roadmap", text: "Build a phased roadmap (pilot → scale → embed) with stage gates tied to measured value." },
        { slug: "p2.business-case", text: "Quantify the business case with conservative assumptions and oil/gas price sensitivity." },
        { slug: "p2.build-buy-decision", text: "Decide build vs buy, platform choices, and required partners." },
        { slug: "p2.value-tracking-method", text: "Define the value-tracking method: what is measured, by whom, how often, against which baseline." },
        { slug: "p2.benefits-by-equipment-class", text: "Tie expected uptime and maintenance-cost benefits to named equipment classes." },
      ],
      nonNeg: [
        { slug: "p2.scope-approved", text: "Approved scope statement and written prioritization criteria." },
        { slug: "p2.roadmap-stage-gates", text: "Phased roadmap with explicit stage gates." },
        { slug: "p2.business-case-reviewed", text: "Quantified business case reviewed by finance and operations." },
        { slug: "p2.value-framework-ready", text: "Value-tracking framework ready before the first pilot." },
      ],
      tips: "Express benefits in terms that survive price cycles: per barrel, per operating day, uptime, maintenance cost ratio. Absolute dollars become meaningless when prices move.",
    },
    3: {
      objective: "Design the organization, decision rights, skills, and ways of working that will deliver and then sustain the program.",
      activities: [
        { slug: "p3.governance-published", text: "Publish governance: steering, working groups, escalation paths, and a RACI for key decisions." },
        { slug: "p3.post-golive-operating-model", text: "Design the post-go-live operating model — who owns the solution when the project team leaves." },
        { slug: "p3.critical-roles", text: "Identify critical roles (product owner, data steward, domain expert, change lead) and fill or develop them." },
        { slug: "p3.change-comms-plan", text: "Write a change and communications plan that involves the front line early." },
        { slug: "p3.upskilling-plan", text: "Plan upskilling for both technical and operational staff, including contractors." },
        { slug: "p3.incentive-alignment", text: "Align incentives and performance management where the work itself is changing." },
      ],
      nonNeg: [
        { slug: "p3.governance-raci-documented", text: "Documented governance structure and RACI." },
        { slug: "p3.post-golive-owners", text: "Named owners for the solution after go-live." },
        { slug: "p3.change-plan-measurable", text: "Change-management plan with measurable adoption goals." },
        { slug: "p3.skills-gap-plan", text: "Skills-gap assessment and development plan for critical roles." },
      ],
      tips: "Operating culture in this industry is strong and often rightly cautious. Designs that ignore experienced operations and maintenance people do not embed.",
    },
    4: {
      objective: "Create an executable plan that manages technical, operational, cyber, and change risk without stopping production.",
      activities: [
        { slug: "p4.resource-loaded-plan", text: "Build workstreams, the critical path, milestones, and a resource-loaded plan." },
        { slug: "p4.risk-register", text: "Maintain a risk register with owners and mitigations — especially OT impact, cutover, and cyber." },
        { slug: "p4.environments-ot-isolation", text: "Define environments (dev / test / prod) and OT isolation where required." },
        { slug: "p4.integration-testing-plan", text: "Plan integration, data connection or migration, and testing that includes operational scenarios." },
        { slug: "p4.cutover-approach", text: "Write the cutover or go-live approach with rollback criteria that operations will actually use." },
        { slug: "p4.quality-gates", text: "Set quality gates and a definition of done for every major deliverable." },
      ],
      nonNeg: [
        { slug: "p4.plan-committed", text: "Detailed plan with critical path and committed resources." },
        { slug: "p4.risk-register-complete", text: "Risk register with explicit OT, HSE, and cyber items and mitigations." },
        { slug: "p4.cutover-rollback-plan", text: "Go-live / cutover criteria and a rollback plan." },
        { slug: "p4.operational-testing-strategy", text: "Testing strategy that includes operational scenarios, not only technical tests." },
      ],
      tips: "On producing assets, big-bang cutovers are high risk. Prefer phased, reversible steps and a clear operational fallback.",
    },
    5: {
      objective: "Deliver working capability, prove value with real data, and create the evidence base for scale — or for a stop.",
      activities: [
        { slug: "p5.pilot-run", text: "Run the pilot or first release against the agreed success metrics and the recorded baseline." },
        { slug: "p5.value-measured", text: "Measure actual value with the tracking framework, including where it missed." },
        { slug: "p5.lessons-captured", text: "Capture lessons and refine both the solution and the work process." },
        { slug: "p5.scale-decision", text: "Take a formal scale / pivot / stop decision to the steering committee with evidence." },
        { slug: "p5.handover-complete", text: "Complete training, documentation, and handover to the operational owners." },
        { slug: "p5.pilot-closed", text: "Close the pilot with a scale plan and a residual-risk register." },
        { slug: "p5.cmms-integration", text: "Integrate predictions into the existing CMMS / work-management process before claiming value." },
      ],
      nonNeg: [
        { slug: "p5.pilot-results-documented", text: "Documented pilot results versus baseline, quantitative." },
        { slug: "p5.scale-decision-recorded", text: "Formal scale / no-scale decision recorded by steering." },
        { slug: "p5.ownership-accepted", text: "Operational ownership accepted and a support model in place." },
        { slug: "p5.residual-risk-updated", text: "Updated residual-risk register for the scale phase." },
        { slug: "p5.prediction-to-work-order", text: "Prediction-to-work-order path live in the maintenance system." },
      ],
      tips: "Many oil and gas programs die in pilot purgatory. Force a clear scale decision. If value is not materializing, stop or redesign rather than quietly expanding scope.",
    },
    6: {
      objective: "Leave project mode. Run a living operating capability with reviews, improvement, and value protection.",
      activities: [
        { slug: "p6.embed-in-operations", text: "Embed the solution in standard operating procedures and the actual decision process." },
        { slug: "p6.value-review-cadence", text: "Run monthly value reviews and a quarterly strategy/roadmap refresh with leadership visibility." },
        { slug: "p6.ci-backlog", text: "Keep a continuous-improvement backlog owned by the operational product owner." },
        { slug: "p6.roadmap-refresh", text: "Refresh the roadmap as technology, regulation, and the asset base change." },
        { slug: "p6.periodic-audits", text: "Audit data quality, model health (if applicable), and cyber posture on a defined cadence." },
        { slug: "p6.capability-sustainment", text: "Keep the change network and skills pipeline alive so capability does not decay after go-live." },
      ],
      nonNeg: [
        { slug: "p6.living-operating-model", text: "Living operating model with a named product or process owner." },
        { slug: "p6.scheduled-reviews", text: "Scheduled value and health reviews with leadership visibility." },
        { slug: "p6.ci-ownership", text: "Continuous-improvement process and backlog ownership." },
        { slug: "p6.health-metrics-defined", text: "Defined metrics and review process for data quality, model health, and security posture as applicable." },
      ],
      tips: "The most common long-term failure is treating the program as finished at go-live. Prices, regulations, assets, and crews change. Continuous management is part of the design.",
    },
  },
  ioc: {
    0: {
      objective: "Secure visible, sustained executive sponsorship and a shared definition of success that survives commodity-price cycles.",
      activities: [
        { slug: "p0.sponsor-named", text: "Name executive sponsor(s) with real authority — operations leadership, not only IT or digital." },
        { slug: "p0.one-page-charter", text: "Draft a one-page charter linking the program to strategy, HSE, and energy-transition goals." },
        { slug: "p0.outcome-statements", text: "Define three to five outcome statements in operational language (cost/boe, uptime, emissions, cycle time)." },
        { slug: "p0.steering-committee", text: "Stand up a steering committee with decision rights, membership, and a fixed cadence." },
        { slug: "p0.leadership-briefing", text: "Brief the broader leadership team and the operational stakeholders who will live with the change." },
        { slug: "p0.funding-philosophy", text: "Agree the funding philosophy (ring-fenced or value-gated) so the program is not the first cut in a downturn." },
        { slug: "p0.decision-rights-alignment", text: "Align decision rights between field leadership and the integrated operations center." },
      ],
      nonNeg: [
        { slug: "p0.sponsor-committed", text: "Named executive sponsor with written commitment and time allocation." },
        { slug: "p0.charter-approved", text: "Approved program charter with outcomes and success metrics." },
        { slug: "p0.steering-charter", text: "Steering-committee charter: membership, decision rights, cadence." },
        { slug: "p0.value-hypothesis-signed", text: "Initial value hypothesis signed by finance and operations." },
        { slug: "p0.decision-rights-matrix", text: "Written decision-rights matrix for field vs center." },
      ],
      tips: "In oil and gas, sponsorship must include operations. Programs owned only by the technology function almost never scale past pilots.",
    },
    1: {
      objective: "Understand the true starting point — data, processes, systems, capabilities, culture, and constraints — before designing solutions.",
      activities: [
        { slug: "p1.systems-landscape", text: "Map the current systems landscape (OT, IT, data platforms, point solutions) and the integration points that matter." },
        { slug: "p1.data-quality-assessment", text: "Assess data quality, access, ownership, and readiness for the intended use cases." },
        { slug: "p1.process-decision-points", text: "Document the processes and decision points the program will change." },
        { slug: "p1.readiness-assessment", text: "Evaluate skills, roles, and cultural readiness, including contractors and remote crews." },
        { slug: "p1.constraints-captured", text: "Capture regulatory, HSE, cybersecurity, and production-continuity constraints." },
        { slug: "p1.baseline-metrics", text: "Record baseline metrics with sources so later value claims can be proven." },
      ],
      nonNeg: [
        { slug: "p1.landscape-documented", text: "Documented current-state systems and data landscape." },
        { slug: "p1.baseline-metrics-documented", text: "Baseline metrics with data sources for the primary success measures." },
        { slug: "p1.constraint-register", text: "Risk and constraint register covering cyber, HSE, regulatory, and legacy OT." },
        { slug: "p1.stakeholder-impact-map", text: "Stakeholder map and first-pass change-impact assessment." },
      ],
      tips: "Do not skip the data reality check. Most AI, twin, and analytics failures in this industry start with fragmented or inaccessible data, not weak models.",
    },
    2: {
      objective: "Turn vision into a governed scope, a sequenced roadmap, and a quantified case that can be steered.",
      activities: [
        { slug: "p2.scope-statement", text: "Write in-scope and out-of-scope, plus the process for changing either." },
        { slug: "p2.prioritization", text: "Prioritize use cases or workstreams by value, feasibility, data readiness, and operational risk." },
        { slug: "p2.phased-roadmap", text: "Build a phased roadmap (pilot → scale → embed) with stage gates tied to measured value." },
        { slug: "p2.business-case", text: "Quantify the business case with conservative assumptions and oil/gas price sensitivity." },
        { slug: "p2.build-buy-decision", text: "Decide build vs buy, platform choices, and required partners." },
        { slug: "p2.value-tracking-method", text: "Define the value-tracking method: what is measured, by whom, how often, against which baseline." },
      ],
      nonNeg: [
        { slug: "p2.scope-approved", text: "Approved scope statement and written prioritization criteria." },
        { slug: "p2.roadmap-stage-gates", text: "Phased roadmap with explicit stage gates." },
        { slug: "p2.business-case-reviewed", text: "Quantified business case reviewed by finance and operations." },
        { slug: "p2.value-framework-ready", text: "Value-tracking framework ready before the first pilot." },
      ],
      tips: "Express benefits in terms that survive price cycles: per barrel, per operating day, uptime, maintenance cost ratio. Absolute dollars become meaningless when prices move.",
    },
    3: {
      objective: "Design the organization, decision rights, skills, and ways of working that will deliver and then sustain the program.",
      activities: [
        { slug: "p3.governance-published", text: "Publish governance: steering, working groups, escalation paths, and a RACI for key decisions." },
        { slug: "p3.post-golive-operating-model", text: "Design the post-go-live operating model — who owns the solution when the project team leaves." },
        { slug: "p3.critical-roles", text: "Identify critical roles (product owner, data steward, domain expert, change lead) and fill or develop them." },
        { slug: "p3.change-comms-plan", text: "Write a change and communications plan that involves the front line early." },
        { slug: "p3.upskilling-plan", text: "Plan upskilling for both technical and operational staff, including contractors." },
        { slug: "p3.incentive-alignment", text: "Align incentives and performance management where the work itself is changing." },
        { slug: "p3.collaboration-redesign", text: "Redesign collaboration, shift handover, and escalation — not only the physical room." },
      ],
      nonNeg: [
        { slug: "p3.governance-raci-documented", text: "Documented governance structure and RACI." },
        { slug: "p3.post-golive-owners", text: "Named owners for the solution after go-live." },
        { slug: "p3.change-plan-measurable", text: "Change-management plan with measurable adoption goals." },
        { slug: "p3.skills-gap-plan", text: "Skills-gap assessment and development plan for critical roles." },
      ],
      tips: "Operating culture in this industry is strong and often rightly cautious. Designs that ignore experienced operations and maintenance people do not embed.",
    },
    4: {
      objective: "Create an executable plan that manages technical, operational, cyber, and change risk without stopping production.",
      activities: [
        { slug: "p4.resource-loaded-plan", text: "Build workstreams, the critical path, milestones, and a resource-loaded plan." },
        { slug: "p4.risk-register", text: "Maintain a risk register with owners and mitigations — especially OT impact, cutover, and cyber." },
        { slug: "p4.environments-ot-isolation", text: "Define environments (dev / test / prod) and OT isolation where required." },
        { slug: "p4.integration-testing-plan", text: "Plan integration, data connection or migration, and testing that includes operational scenarios." },
        { slug: "p4.cutover-approach", text: "Write the cutover or go-live approach with rollback criteria that operations will actually use." },
        { slug: "p4.quality-gates", text: "Set quality gates and a definition of done for every major deliverable." },
      ],
      nonNeg: [
        { slug: "p4.plan-committed", text: "Detailed plan with critical path and committed resources." },
        { slug: "p4.risk-register-complete", text: "Risk register with explicit OT, HSE, and cyber items and mitigations." },
        { slug: "p4.cutover-rollback-plan", text: "Go-live / cutover criteria and a rollback plan." },
        { slug: "p4.operational-testing-strategy", text: "Testing strategy that includes operational scenarios, not only technical tests." },
      ],
      tips: "On producing assets, big-bang cutovers are high risk. Prefer phased, reversible steps and a clear operational fallback.",
    },
    5: {
      objective: "Deliver working capability, prove value with real data, and create the evidence base for scale — or for a stop.",
      activities: [
        { slug: "p5.pilot-run", text: "Run the pilot or first release against the agreed success metrics and the recorded baseline." },
        { slug: "p5.value-measured", text: "Measure actual value with the tracking framework, including where it missed." },
        { slug: "p5.lessons-captured", text: "Capture lessons and refine both the solution and the work process." },
        { slug: "p5.scale-decision", text: "Take a formal scale / pivot / stop decision to the steering committee with evidence." },
        { slug: "p5.handover-complete", text: "Complete training, documentation, and handover to the operational owners." },
        { slug: "p5.pilot-closed", text: "Close the pilot with a scale plan and a residual-risk register." },
      ],
      nonNeg: [
        { slug: "p5.pilot-results-documented", text: "Documented pilot results versus baseline, quantitative." },
        { slug: "p5.scale-decision-recorded", text: "Formal scale / no-scale decision recorded by steering." },
        { slug: "p5.ownership-accepted", text: "Operational ownership accepted and a support model in place." },
        { slug: "p5.residual-risk-updated", text: "Updated residual-risk register for the scale phase." },
      ],
      tips: "Many oil and gas programs die in pilot purgatory. Force a clear scale decision. If value is not materializing, stop or redesign rather than quietly expanding scope.",
    },
    6: {
      objective: "Leave project mode. Run a living operating capability with reviews, improvement, and value protection.",
      activities: [
        { slug: "p6.embed-in-operations", text: "Embed the solution in standard operating procedures and the actual decision process." },
        { slug: "p6.value-review-cadence", text: "Run monthly value reviews and a quarterly strategy/roadmap refresh with leadership visibility." },
        { slug: "p6.ci-backlog", text: "Keep a continuous-improvement backlog owned by the operational product owner." },
        { slug: "p6.roadmap-refresh", text: "Refresh the roadmap as technology, regulation, and the asset base change." },
        { slug: "p6.periodic-audits", text: "Audit data quality, model health (if applicable), and cyber posture on a defined cadence." },
        { slug: "p6.capability-sustainment", text: "Keep the change network and skills pipeline alive so capability does not decay after go-live." },
        { slug: "p6.local-vs-central-review", text: "Review which decisions stay local versus centralized as capability matures." },
      ],
      nonNeg: [
        { slug: "p6.living-operating-model", text: "Living operating model with a named product or process owner." },
        { slug: "p6.scheduled-reviews", text: "Scheduled value and health reviews with leadership visibility." },
        { slug: "p6.ci-ownership", text: "Continuous-improvement process and backlog ownership." },
        { slug: "p6.health-metrics-defined", text: "Defined metrics and review process for data quality, model health, and security posture as applicable." },
      ],
      tips: "The most common long-term failure is treating the program as finished at go-live. Prices, regulations, assets, and crews change. Continuous management is part of the design.",
    },
  },
  cyber: {
    0: {
      objective: "Secure visible, sustained executive sponsorship and a shared definition of success that survives commodity-price cycles.",
      activities: [
        { slug: "p0.sponsor-named", text: "Name executive sponsor(s) with real authority — operations leadership, not only IT or digital." },
        { slug: "p0.one-page-charter", text: "Draft a one-page charter linking the program to strategy, HSE, and energy-transition goals." },
        { slug: "p0.outcome-statements", text: "Define three to five outcome statements in operational language (cost/boe, uptime, emissions, cycle time)." },
        { slug: "p0.steering-committee", text: "Stand up a steering committee with decision rights, membership, and a fixed cadence." },
        { slug: "p0.leadership-briefing", text: "Brief the broader leadership team and the operational stakeholders who will live with the change." },
        { slug: "p0.funding-philosophy", text: "Agree the funding philosophy (ring-fenced or value-gated) so the program is not the first cut in a downturn." },
        { slug: "p0.board-visibility", text: "Give the board or executive risk committee visibility — this is critical infrastructure." },
      ],
      nonNeg: [
        { slug: "p0.sponsor-committed", text: "Named executive sponsor with written commitment and time allocation." },
        { slug: "p0.charter-approved", text: "Approved program charter with outcomes and success metrics." },
        { slug: "p0.steering-charter", text: "Steering-committee charter: membership, decision rights, cadence." },
        { slug: "p0.value-hypothesis-signed", text: "Initial value hypothesis signed by finance and operations." },
      ],
      tips: "In oil and gas, sponsorship must include operations. Programs owned only by the technology function almost never scale past pilots.",
    },
    1: {
      objective: "Understand the true starting point — data, processes, systems, capabilities, culture, and constraints — before designing solutions.",
      activities: [
        { slug: "p1.systems-landscape", text: "Map the current systems landscape (OT, IT, data platforms, point solutions) and the integration points that matter." },
        { slug: "p1.data-quality-assessment", text: "Assess data quality, access, ownership, and readiness for the intended use cases." },
        { slug: "p1.process-decision-points", text: "Document the processes and decision points the program will change." },
        { slug: "p1.readiness-assessment", text: "Evaluate skills, roles, and cultural readiness, including contractors and remote crews." },
        { slug: "p1.constraints-captured", text: "Capture regulatory, HSE, cybersecurity, and production-continuity constraints." },
        { slug: "p1.baseline-metrics", text: "Record baseline metrics with sources so later value claims can be proven." },
        { slug: "p1.ot-inventory-baseline", text: "Complete an OT asset inventory and a current network-topology baseline." },
      ],
      nonNeg: [
        { slug: "p1.landscape-documented", text: "Documented current-state systems and data landscape." },
        { slug: "p1.baseline-metrics-documented", text: "Baseline metrics with data sources for the primary success measures." },
        { slug: "p1.constraint-register", text: "Risk and constraint register covering cyber, HSE, regulatory, and legacy OT." },
        { slug: "p1.stakeholder-impact-map", text: "Stakeholder map and first-pass change-impact assessment." },
        { slug: "p1.ot-inventory-in-scope", text: "OT asset inventory covering in-scope facilities." },
      ],
      tips: "Do not skip the data reality check. Most AI, twin, and analytics failures in this industry start with fragmented or inaccessible data, not weak models.",
    },
    2: {
      objective: "Turn vision into a governed scope, a sequenced roadmap, and a quantified case that can be steered.",
      activities: [
        { slug: "p2.scope-statement", text: "Write in-scope and out-of-scope, plus the process for changing either." },
        { slug: "p2.prioritization", text: "Prioritize use cases or workstreams by value, feasibility, data readiness, and operational risk." },
        { slug: "p2.phased-roadmap", text: "Build a phased roadmap (pilot → scale → embed) with stage gates tied to measured value." },
        { slug: "p2.business-case", text: "Quantify the business case with conservative assumptions and oil/gas price sensitivity." },
        { slug: "p2.build-buy-decision", text: "Decide build vs buy, platform choices, and required partners." },
        { slug: "p2.value-tracking-method", text: "Define the value-tracking method: what is measured, by whom, how often, against which baseline." },
      ],
      nonNeg: [
        { slug: "p2.scope-approved", text: "Approved scope statement and written prioritization criteria." },
        { slug: "p2.roadmap-stage-gates", text: "Phased roadmap with explicit stage gates." },
        { slug: "p2.business-case-reviewed", text: "Quantified business case reviewed by finance and operations." },
        { slug: "p2.value-framework-ready", text: "Value-tracking framework ready before the first pilot." },
      ],
      tips: "Express benefits in terms that survive price cycles: per barrel, per operating day, uptime, maintenance cost ratio. Absolute dollars become meaningless when prices move.",
    },
    3: {
      objective: "Design the organization, decision rights, skills, and ways of working that will deliver and then sustain the program.",
      activities: [
        { slug: "p3.governance-published", text: "Publish governance: steering, working groups, escalation paths, and a RACI for key decisions." },
        { slug: "p3.post-golive-operating-model", text: "Design the post-go-live operating model — who owns the solution when the project team leaves." },
        { slug: "p3.critical-roles", text: "Identify critical roles (product owner, data steward, domain expert, change lead) and fill or develop them." },
        { slug: "p3.change-comms-plan", text: "Write a change and communications plan that involves the front line early." },
        { slug: "p3.upskilling-plan", text: "Plan upskilling for both technical and operational staff, including contractors." },
        { slug: "p3.incentive-alignment", text: "Align incentives and performance management where the work itself is changing." },
      ],
      nonNeg: [
        { slug: "p3.governance-raci-documented", text: "Documented governance structure and RACI." },
        { slug: "p3.post-golive-owners", text: "Named owners for the solution after go-live." },
        { slug: "p3.change-plan-measurable", text: "Change-management plan with measurable adoption goals." },
        { slug: "p3.skills-gap-plan", text: "Skills-gap assessment and development plan for critical roles." },
      ],
      tips: "Operating culture in this industry is strong and often rightly cautious. Designs that ignore experienced operations and maintenance people do not embed.",
    },
    4: {
      objective: "Create an executable plan that manages technical, operational, cyber, and change risk without stopping production.",
      activities: [
        { slug: "p4.resource-loaded-plan", text: "Build workstreams, the critical path, milestones, and a resource-loaded plan." },
        { slug: "p4.risk-register", text: "Maintain a risk register with owners and mitigations — especially OT impact, cutover, and cyber." },
        { slug: "p4.environments-ot-isolation", text: "Define environments (dev / test / prod) and OT isolation where required." },
        { slug: "p4.integration-testing-plan", text: "Plan integration, data connection or migration, and testing that includes operational scenarios." },
        { slug: "p4.cutover-approach", text: "Write the cutover or go-live approach with rollback criteria that operations will actually use." },
        { slug: "p4.quality-gates", text: "Set quality gates and a definition of done for every major deliverable." },
        { slug: "p4.production-safe-changes", text: "Plan changes that minimize disruption to production and safety systems; define maintenance windows with operations." },
      ],
      nonNeg: [
        { slug: "p4.plan-committed", text: "Detailed plan with critical path and committed resources." },
        { slug: "p4.risk-register-complete", text: "Risk register with explicit OT, HSE, and cyber items and mitigations." },
        { slug: "p4.cutover-rollback-plan", text: "Go-live / cutover criteria and a rollback plan." },
        { slug: "p4.operational-testing-strategy", text: "Testing strategy that includes operational scenarios, not only technical tests." },
      ],
      tips: "On producing assets, big-bang cutovers are high risk. Prefer phased, reversible steps and a clear operational fallback.",
    },
    5: {
      objective: "Deliver working capability, prove value with real data, and create the evidence base for scale — or for a stop.",
      activities: [
        { slug: "p5.pilot-run", text: "Run the pilot or first release against the agreed success metrics and the recorded baseline." },
        { slug: "p5.value-measured", text: "Measure actual value with the tracking framework, including where it missed." },
        { slug: "p5.lessons-captured", text: "Capture lessons and refine both the solution and the work process." },
        { slug: "p5.scale-decision", text: "Take a formal scale / pivot / stop decision to the steering committee with evidence." },
        { slug: "p5.handover-complete", text: "Complete training, documentation, and handover to the operational owners." },
        { slug: "p5.pilot-closed", text: "Close the pilot with a scale plan and a residual-risk register." },
      ],
      nonNeg: [
        { slug: "p5.pilot-results-documented", text: "Documented pilot results versus baseline, quantitative." },
        { slug: "p5.scale-decision-recorded", text: "Formal scale / no-scale decision recorded by steering." },
        { slug: "p5.ownership-accepted", text: "Operational ownership accepted and a support model in place." },
        { slug: "p5.residual-risk-updated", text: "Updated residual-risk register for the scale phase." },
      ],
      tips: "Many oil and gas programs die in pilot purgatory. Force a clear scale decision. If value is not materializing, stop or redesign rather than quietly expanding scope.",
    },
    6: {
      objective: "Leave project mode. Run a living operating capability with reviews, improvement, and value protection.",
      activities: [
        { slug: "p6.embed-in-operations", text: "Embed the solution in standard operating procedures and the actual decision process." },
        { slug: "p6.value-review-cadence", text: "Run monthly value reviews and a quarterly strategy/roadmap refresh with leadership visibility." },
        { slug: "p6.ci-backlog", text: "Keep a continuous-improvement backlog owned by the operational product owner." },
        { slug: "p6.roadmap-refresh", text: "Refresh the roadmap as technology, regulation, and the asset base change." },
        { slug: "p6.periodic-audits", text: "Audit data quality, model health (if applicable), and cyber posture on a defined cadence." },
        { slug: "p6.capability-sustainment", text: "Keep the change network and skills pipeline alive so capability does not decay after go-live." },
        { slug: "p6.continuous-monitoring-exercises", text: "Maintain continuous monitoring, vulnerability management, and scheduled incident-response exercises." },
      ],
      nonNeg: [
        { slug: "p6.living-operating-model", text: "Living operating model with a named product or process owner." },
        { slug: "p6.scheduled-reviews", text: "Scheduled value and health reviews with leadership visibility." },
        { slug: "p6.ci-ownership", text: "Continuous-improvement process and backlog ownership." },
        { slug: "p6.health-metrics-defined", text: "Defined metrics and review process for data quality, model health, and security posture as applicable." },
        { slug: "p6.exercise-calendar-coverage", text: "Exercise calendar and monitoring coverage for in-scope OT." },
      ],
      tips: "The most common long-term failure is treating the program as finished at go-live. Prices, regulations, assets, and crews change. Continuous management is part of the design.",
    },
  },
  custom: {
    0: {
      objective: "Secure visible, sustained executive sponsorship and a shared definition of success that survives commodity-price cycles.",
      activities: [
        { slug: "p0.sponsor-named", text: "Name executive sponsor(s) with real authority — operations leadership, not only IT or digital." },
        { slug: "p0.one-page-charter", text: "Draft a one-page charter linking the program to strategy, HSE, and energy-transition goals." },
        { slug: "p0.outcome-statements", text: "Define three to five outcome statements in operational language (cost/boe, uptime, emissions, cycle time)." },
        { slug: "p0.steering-committee", text: "Stand up a steering committee with decision rights, membership, and a fixed cadence." },
        { slug: "p0.leadership-briefing", text: "Brief the broader leadership team and the operational stakeholders who will live with the change." },
        { slug: "p0.funding-philosophy", text: "Agree the funding philosophy (ring-fenced or value-gated) so the program is not the first cut in a downturn." },
      ],
      nonNeg: [
        { slug: "p0.sponsor-committed", text: "Named executive sponsor with written commitment and time allocation." },
        { slug: "p0.charter-approved", text: "Approved program charter with outcomes and success metrics." },
        { slug: "p0.steering-charter", text: "Steering-committee charter: membership, decision rights, cadence." },
        { slug: "p0.value-hypothesis-signed", text: "Initial value hypothesis signed by finance and operations." },
      ],
      tips: "In oil and gas, sponsorship must include operations. Programs owned only by the technology function almost never scale past pilots.",
    },
    1: {
      objective: "Understand the true starting point — data, processes, systems, capabilities, culture, and constraints — before designing solutions.",
      activities: [
        { slug: "p1.systems-landscape", text: "Map the current systems landscape (OT, IT, data platforms, point solutions) and the integration points that matter." },
        { slug: "p1.data-quality-assessment", text: "Assess data quality, access, ownership, and readiness for the intended use cases." },
        { slug: "p1.process-decision-points", text: "Document the processes and decision points the program will change." },
        { slug: "p1.readiness-assessment", text: "Evaluate skills, roles, and cultural readiness, including contractors and remote crews." },
        { slug: "p1.constraints-captured", text: "Capture regulatory, HSE, cybersecurity, and production-continuity constraints." },
        { slug: "p1.baseline-metrics", text: "Record baseline metrics with sources so later value claims can be proven." },
      ],
      nonNeg: [
        { slug: "p1.landscape-documented", text: "Documented current-state systems and data landscape." },
        { slug: "p1.baseline-metrics-documented", text: "Baseline metrics with data sources for the primary success measures." },
        { slug: "p1.constraint-register", text: "Risk and constraint register covering cyber, HSE, regulatory, and legacy OT." },
        { slug: "p1.stakeholder-impact-map", text: "Stakeholder map and first-pass change-impact assessment." },
      ],
      tips: "Do not skip the data reality check. Most AI, twin, and analytics failures in this industry start with fragmented or inaccessible data, not weak models.",
    },
    2: {
      objective: "Turn vision into a governed scope, a sequenced roadmap, and a quantified case that can be steered.",
      activities: [
        { slug: "p2.scope-statement", text: "Write in-scope and out-of-scope, plus the process for changing either." },
        { slug: "p2.prioritization", text: "Prioritize use cases or workstreams by value, feasibility, data readiness, and operational risk." },
        { slug: "p2.phased-roadmap", text: "Build a phased roadmap (pilot → scale → embed) with stage gates tied to measured value." },
        { slug: "p2.business-case", text: "Quantify the business case with conservative assumptions and oil/gas price sensitivity." },
        { slug: "p2.build-buy-decision", text: "Decide build vs buy, platform choices, and required partners." },
        { slug: "p2.value-tracking-method", text: "Define the value-tracking method: what is measured, by whom, how often, against which baseline." },
      ],
      nonNeg: [
        { slug: "p2.scope-approved", text: "Approved scope statement and written prioritization criteria." },
        { slug: "p2.roadmap-stage-gates", text: "Phased roadmap with explicit stage gates." },
        { slug: "p2.business-case-reviewed", text: "Quantified business case reviewed by finance and operations." },
        { slug: "p2.value-framework-ready", text: "Value-tracking framework ready before the first pilot." },
      ],
      tips: "Express benefits in terms that survive price cycles: per barrel, per operating day, uptime, maintenance cost ratio. Absolute dollars become meaningless when prices move.",
    },
    3: {
      objective: "Design the organization, decision rights, skills, and ways of working that will deliver and then sustain the program.",
      activities: [
        { slug: "p3.governance-published", text: "Publish governance: steering, working groups, escalation paths, and a RACI for key decisions." },
        { slug: "p3.post-golive-operating-model", text: "Design the post-go-live operating model — who owns the solution when the project team leaves." },
        { slug: "p3.critical-roles", text: "Identify critical roles (product owner, data steward, domain expert, change lead) and fill or develop them." },
        { slug: "p3.change-comms-plan", text: "Write a change and communications plan that involves the front line early." },
        { slug: "p3.upskilling-plan", text: "Plan upskilling for both technical and operational staff, including contractors." },
        { slug: "p3.incentive-alignment", text: "Align incentives and performance management where the work itself is changing." },
      ],
      nonNeg: [
        { slug: "p3.governance-raci-documented", text: "Documented governance structure and RACI." },
        { slug: "p3.post-golive-owners", text: "Named owners for the solution after go-live." },
        { slug: "p3.change-plan-measurable", text: "Change-management plan with measurable adoption goals." },
        { slug: "p3.skills-gap-plan", text: "Skills-gap assessment and development plan for critical roles." },
      ],
      tips: "Operating culture in this industry is strong and often rightly cautious. Designs that ignore experienced operations and maintenance people do not embed.",
    },
    4: {
      objective: "Create an executable plan that manages technical, operational, cyber, and change risk without stopping production.",
      activities: [
        { slug: "p4.resource-loaded-plan", text: "Build workstreams, the critical path, milestones, and a resource-loaded plan." },
        { slug: "p4.risk-register", text: "Maintain a risk register with owners and mitigations — especially OT impact, cutover, and cyber." },
        { slug: "p4.environments-ot-isolation", text: "Define environments (dev / test / prod) and OT isolation where required." },
        { slug: "p4.integration-testing-plan", text: "Plan integration, data connection or migration, and testing that includes operational scenarios." },
        { slug: "p4.cutover-approach", text: "Write the cutover or go-live approach with rollback criteria that operations will actually use." },
        { slug: "p4.quality-gates", text: "Set quality gates and a definition of done for every major deliverable." },
      ],
      nonNeg: [
        { slug: "p4.plan-committed", text: "Detailed plan with critical path and committed resources." },
        { slug: "p4.risk-register-complete", text: "Risk register with explicit OT, HSE, and cyber items and mitigations." },
        { slug: "p4.cutover-rollback-plan", text: "Go-live / cutover criteria and a rollback plan." },
        { slug: "p4.operational-testing-strategy", text: "Testing strategy that includes operational scenarios, not only technical tests." },
      ],
      tips: "On producing assets, big-bang cutovers are high risk. Prefer phased, reversible steps and a clear operational fallback.",
    },
    5: {
      objective: "Deliver working capability, prove value with real data, and create the evidence base for scale — or for a stop.",
      activities: [
        { slug: "p5.pilot-run", text: "Run the pilot or first release against the agreed success metrics and the recorded baseline." },
        { slug: "p5.value-measured", text: "Measure actual value with the tracking framework, including where it missed." },
        { slug: "p5.lessons-captured", text: "Capture lessons and refine both the solution and the work process." },
        { slug: "p5.scale-decision", text: "Take a formal scale / pivot / stop decision to the steering committee with evidence." },
        { slug: "p5.handover-complete", text: "Complete training, documentation, and handover to the operational owners." },
        { slug: "p5.pilot-closed", text: "Close the pilot with a scale plan and a residual-risk register." },
      ],
      nonNeg: [
        { slug: "p5.pilot-results-documented", text: "Documented pilot results versus baseline, quantitative." },
        { slug: "p5.scale-decision-recorded", text: "Formal scale / no-scale decision recorded by steering." },
        { slug: "p5.ownership-accepted", text: "Operational ownership accepted and a support model in place." },
        { slug: "p5.residual-risk-updated", text: "Updated residual-risk register for the scale phase." },
      ],
      tips: "Many oil and gas programs die in pilot purgatory. Force a clear scale decision. If value is not materializing, stop or redesign rather than quietly expanding scope.",
    },
    6: {
      objective: "Leave project mode. Run a living operating capability with reviews, improvement, and value protection.",
      activities: [
        { slug: "p6.embed-in-operations", text: "Embed the solution in standard operating procedures and the actual decision process." },
        { slug: "p6.value-review-cadence", text: "Run monthly value reviews and a quarterly strategy/roadmap refresh with leadership visibility." },
        { slug: "p6.ci-backlog", text: "Keep a continuous-improvement backlog owned by the operational product owner." },
        { slug: "p6.roadmap-refresh", text: "Refresh the roadmap as technology, regulation, and the asset base change." },
        { slug: "p6.periodic-audits", text: "Audit data quality, model health (if applicable), and cyber posture on a defined cadence." },
        { slug: "p6.capability-sustainment", text: "Keep the change network and skills pipeline alive so capability does not decay after go-live." },
      ],
      nonNeg: [
        { slug: "p6.living-operating-model", text: "Living operating model with a named product or process owner." },
        { slug: "p6.scheduled-reviews", text: "Scheduled value and health reviews with leadership visibility." },
        { slug: "p6.ci-ownership", text: "Continuous-improvement process and backlog ownership." },
        { slug: "p6.health-metrics-defined", text: "Defined metrics and review process for data quality, model health, and security posture as applicable." },
      ],
      tips: "The most common long-term failure is treating the program as finished at go-live. Prices, regulations, assets, and crews change. Continuous management is part of the design.",
    },
  },
  pmo: {
    0: {
      objective: "Secure visible, sustained executive sponsorship and a shared definition of success that survives commodity-price cycles.",
      activities: [
        { slug: "p0.pmo-mandate-defined", text: "Define the PMO's mandate in writing: what it decides, what it recommends, what it only reports." },
        { slug: "p0.pmo-sponsorship", text: "Secure executive sponsor for the PMO itself — the office must outrank the projects it serves on paper, or it cannot arbitrate." },
        { slug: "p0.pmo-tailoring-philosophy", text: "Agree the tailoring philosophy up front: governance scales with project size and risk, never one-size-fits-all." },
      ],
      nonNeg: [
        { slug: "p0.pmo-charter-approved", text: "PMO charter approved: mandate, decision rights, staffing, funding, and a named head with executive access." },
      ],
      tips: "The PMO's hardest sell is to experienced project leads who have survived bad PMOs. Lead with what the office removes (duplicate reporting, surprise escalations), not what it adds.",
    },
    1: {
      objective: "Understand the true starting point — data, processes, systems, capabilities, culture, and constraints — before designing solutions.",
      activities: [
        { slug: "p1.pmo-project-inventory", text: "Inventory every active project and program: sponsor, stage, spend, health, and who actually tracks what today." },
        { slug: "p1.pmo-current-methods-audit", text: "Audit existing delivery methods, templates, and reporting in use across business units — adopt before you standardize." },
      ],
      nonNeg: [
        { slug: "p1.pmo-baseline-recorded", text: "Documented portfolio baseline: full project inventory with sponsors, spend, and current reporting practices." },
      ],
      tips: "Do not skip the data reality check. Most AI, twin, and analytics failures in this industry start with fragmented or inaccessible data, not weak models.",
    },
    2: {
      objective: "Turn vision into a governed scope, a sequenced roadmap, and a quantified case that can be steered.",
      activities: [
        { slug: "p2.pmo-service-catalog", text: "Define the PMO service catalog: what services it offers projects (coaching, scheduling, assurance) versus control functions." },
        { slug: "p2.pmo-tooling-decision", text: "Decide the portfolio tooling position: one system of record for stage, spend, and risk — and what it replaces." },
      ],
      nonNeg: [
        { slug: "p2.pmo-operating-model-approved", text: "PMO operating model approved by sponsors: services, control points, and the governance calendar." },
        { slug: "p2.pmo-success-metrics", text: "PMO success metrics agreed — the office is measured on portfolio outcomes, not on reports produced." },
      ],
      tips: "Express the PMO business case in the same terms as any other program: decisions accelerated, overruns caught early, portfolio value protected — not in artifacts delivered.",
    },
    3: {
      objective: "Design the organization, decision rights, skills, and ways of working that will deliver and then sustain the program.",
      activities: [
        { slug: "p3.pmo-staffing-model", text: "Design the staffing model: core PMO team versus federated project leads embedded in business units." },
        { slug: "p3.pmo-rac-i", text: "Publish the governance RACI: who gates, who escalates, who arbitrates resource conflicts between programs." },
      ],
      nonNeg: [
        { slug: "p3.pmo-org-announced", text: "PMO organization announced with named roles; federated leads nominated by business-unit leadership." },
        { slug: "p3.pmo-escalation-paths", text: "Documented escalation and arbitration paths, accepted by program sponsors." },
      ],
      tips: "Operating culture in this industry is strong and often rightly cautious. Designs that ignore experienced operations and maintenance people do not embed.",
    },
    4: {
      objective: "Create an executable plan that manages technical, operational, cyber, and change risk without stopping production.",
      activities: [
        { slug: "p4.pmo-standards-built", text: "Build the minimum viable standards set: stage-gate criteria, project charter template, health-report format, risk register." },
        { slug: "p4.pmo-pilot-wave-selection", text: "Select the pilot wave: 2-3 projects of different sizes to prove the governance model before portfolio-wide rollout." },
        { slug: "p4.pmo-integration-plan", text: "Plan integration with existing processes (capex approvals, procurement, HSE management of change) rather than parallel bureaucracy." },
      ],
      nonNeg: [
        { slug: "p4.pmo-standards-approved", text: "Standards set approved with tailoring rules — a small project follows a proportionally lighter path." },
        { slug: "p4.pmo-pilot-committed", text: "Pilot projects committed with named sponsors and success criteria for the PMO pilot itself." },
      ],
      tips: "On producing assets, the PMO must speak capex and opex language. Gate criteria that ignore the field's planning cycle will be routed around within one quarter.",
    },
    5: {
      objective: "Deliver working capability, prove value with real data, and create the evidence base for scale — or for a stop.",
      activities: [
        { slug: "p5.pmo-pilot-run", text: "Run the pilot wave through the full governance cycle: intake, stage gates, health reporting, and at least one gate decision." },
        { slug: "p5.pmo-feedback-incorporated", text: "Collect pilot feedback from project leads and sponsors; adjust standards, cadence, and templates before scaling." },
      ],
      nonNeg: [
        { slug: "p5.pmo-pilot-results", text: "Pilot results documented: what governance caught, what it cost, what project leads want changed." },
        { slug: "p5.pmo-scale-decision", text: "Formal scale / adjust / stop decision on the PMO operating model taken to the executive sponsor." },
      ],
      tips: "Many oil and gas programs die in pilot purgatory. Force a clear scale decision. If value is not materializing, stop or redesign rather than quietly expanding scope.",
    },
    6: {
      objective: "Leave project mode. Run a living operating capability with reviews, improvement, and value protection.",
      activities: [
        { slug: "p6.pmo-portfolio-cadence", text: "Operate the portfolio cadence: monthly health reviews, quarterly portfolio rebalancing, annual mandate refresh." },
        { slug: "p6.pmo-value-tracking", text: "Track PMO value: delivery performance trend, gate decision quality, early-warning wins, and stakeholder confidence." },
        { slug: "p6.pmo-standards-evolution", text: "Keep standards living: retire templates nobody uses, tighten gates that miss, simplify what project leads complain about with evidence." },
      ],
      nonNeg: [
        { slug: "p6.pmo-operating-rhythm", text: "Operating portfolio cadence running with leadership attendance and documented decisions." },
        { slug: "p6.pmo-annual-review", text: "Annual PMO mandate review scheduled — the office earns its existence each year, not once." },
      ],
      tips: "A PMO decays into ceremony within two years unless it keeps earning authority with useful decisions. The annual mandate review is the forcing function.",
    },
  },
};

/** All program type ids, in catalog order. */
export const PROGRAM_TYPE_IDS: readonly string[] = PROGRAM_TYPES.map((p) => p.typeId);

/** All phase ids, in catalog order (0..6). */
export const PHASE_IDS: readonly number[] = PHASES.map((p) => p.id);

/**
 * Merged content for one program type and phase, exactly as v1 rendered it.
 * Throws on unknown typeId or phaseId so callers cannot silently render empty.
 */
export function getPhaseContent(typeId: string, phaseId: number): PhaseContent {
  const byPhase = PHASE_CONTENT[typeId];
  if (!byPhase) throw new Error(`Unknown program type: ${typeId}`);
  const content = byPhase[phaseId];
  if (!content) throw new Error(`Unknown phase ${phaseId} for type ${typeId}`);
  return content;
}

/** Item keys (stable slugs) for one phase of one program type, by group. */
export function listItemKeys(typeId: string, phaseId: number): { activities: string[]; nonNeg: string[] } {
  const content = getPhaseContent(typeId, phaseId);
  return {
    activities: content.activities.map((i) => i.slug),
    nonNeg: content.nonNeg.map((i) => i.slug),
  };
}
