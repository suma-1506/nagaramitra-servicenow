# NagaraMitra

A ServiceNow application for citizen grievance redressal in a city corporation. A citizen reports a problem once, and the platform routes it to the right ward and department, groups duplicate reports into a single issue, enforces timelines with automatic escalation, and closes a complaint only when the citizen confirms the fix.

> **Status:** In development (started 21 Oct 2026). Built solo on a ServiceNow Personal Developer Instance (Brazil release).
> Originally conceived for the ServiceNow University HackNow hackathon; now being built independently as a portfolio project.

**App source:** [nagaramitra-app](https://github.com/suma-1506/nagaramitra-app) holds the ServiceNow application files, committed from Studio.

## The problem

City corporations receive complaints about water, roads, streetlights and sanitation through helplines, walk-ins, social media and apps. These channels aren't connected, which leads to:

1. **Duplicates:** one broken drain produces many separate tickets, each handled and counted on its own.
2. **Misrouting:** complaints bounce between departments and lose days.
3. **Unconfirmed closure:** a complaint is marked closed while the problem is still there, so citizens complain again.

## The solution

- **One front door:** every channel creates the same Grievance record (portal form with photo and location, Virtual Agent, helpline entry).
- **Route by place:** the complaint's location maps to a ward and zone, and a Flow Designer flow assigns it to that ward's officer group in the right department.
- **Issue-centred, not ticket-centred:** duplicate complaints are linked to one parent Issue, and the report count becomes a priority signal. An officer approves every grouping.
- **Enforced timelines:** each category has a citizen-charter SLA, and a missed deadline escalates from ward officer to zonal officer to Commissioner.
- **Citizen-verified closure:** the officer resolves the case with proof, and the citizen confirms. Confirmation closes it; rejection reopens it.
- **Hotspot tracking:** complaints link to a Civic Asset (a drain, a pole, a pipe), so repeat problems at the same asset get flagged.
- **Multilingual updates:** status messages in English, Telugu and Hindi.
- **Leadership dashboards:** ward-wise pendency, repeat hotspots and officer performance.

## Data model (planned)

| Table | Purpose |
|---|---|
| Grievance (extends Task) | A citizen's complaint, with category, ward, location, priority and proof |
| Issue | Parent record that groups duplicate grievances, with a report count |
| Ward, Zone | Geographic structure |
| Department, Category | Responsibility and SLA mapping |
| Civic Asset | Physical asset a complaint relates to, for hotspot detection |

## Tech stack

ServiceNow scoped application (Studio), Flow Designer, SLA definitions, Notifications, Service Portal / UI Builder, Virtual Agent, Dashboards and Reports, JavaScript (business rules, Script Includes, GlideRecord), Git source control.

## Build approach

The core flow (submit, categorise, route, resolve, confirm) is built first, so a working version always exists. AI features are then layered on top:

- **Now Assist** (Smart Categorization, duplicate grouping, multilingual messages, executive brief) is planned if available. It isn’t fully available on a free PDI, so the build uses:
  - rule-based categorisation,
  - rule-based duplicate matching (same category, same ward, nearby location, open status) with officer approval,
  - approved Telugu / Hindi / English message templates.

## Roadmap

| Week | Focus | Status |
|---|---|---|
| 1 | Foundation: tables, roles and ACLs, sample data, first routing flow | In progress |
| 2 | Intake form, Virtual Agent intake, geo-routing | Not started |
| 3 | SLAs, escalation, duplicate grouping, citizen confirmation | Not started |
| 4 | Portal polish, dashboards, documentation, demo video | Not started |

## Repository contents

- `/docs`: design documents
- Application source: in the companion repo [nagaramitra-app](https://github.com/suma-1506/nagaramitra-app), synced from ServiceNow Studio

## Data note

All data in this project is made-up sample data. No real citizen information is used.

## Author

Suma Priya Vaddi, final-year B.Tech CSE (AI-ML), ServiceNow Certified System Administrator and Application Developer.
GitHub: [suma-1506](https://github.com/suma-1506) · LinkedIn: [suma-priya-vaddi](https://linkedin.com/in/suma-priya-vaddi)
