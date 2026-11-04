# NagaraMitra

A ServiceNow application for citizen grievance redressal in a city corporation. A citizen reports a problem once, and the platform routes it to the right ward and department, groups duplicate reports into a single issue, enforces timelines with automatic escalation, and closes a complaint only when the citizen confirms the fix.

> **Status:** In development (started 21 Oct 2026). Built solo on a ServiceNow Personal Developer Instance (Brazil release). **Week 1 is complete and Week 2 is well under way (updated 4 Nov 2026):** the data model, sample data, automatic routing, role-based access control and the citizen portal form (with photo upload and GPS location) work and have been tested. Virtual Agent intake, SLAs and escalation, citizen-confirmed closure, duplicate grouping and dashboards are still to come.
> Originally conceived for the ServiceNow University HackNow hackathon; now being built independently as a portfolio project.

**App source:** [nagaramitra-app](https://github.com/suma-1506/nagaramitra-app) holds the ServiceNow application files, committed from Studio. This repository is the project overview and documentation.

## The problem

City corporations receive complaints about water, roads, streetlights and sanitation through helplines, walk-ins, social media and apps. These channels aren't connected, which leads to:

1. **Duplicates:** one broken drain produces many separate tickets, each handled and counted on its own.
2. **Misrouting:** complaints bounce between departments and lose days.
3. **Unconfirmed closure:** a complaint is marked closed while the problem is still there, so citizens complain again.

## The solution

- **One front door:** every channel creates the same Grievance record (portal form with photo and location, Virtual Agent, helpline entry).
- **Route by place:** the complaint's location maps to a ward, and the complaint is assigned to that ward's officer group in the right department.
- **Issue-centred, not ticket-centred:** duplicate complaints are linked to one parent Issue, and the report count becomes a priority signal. An officer approves every grouping.
- **Enforced timelines:** each category has a citizen-charter SLA, and a missed deadline escalates from ward officer to zonal officer to Commissioner.
- **Citizen-verified closure:** the officer resolves the case with proof, and the citizen confirms. Confirmation closes it; rejection reopens it.
- **Hotspot tracking:** complaints link to a Civic Asset (a drain, a pole, a pipe), so repeat problems at the same asset get flagged.
- **Multilingual updates:** status messages in English, Telugu and Hindi.
- **Leadership dashboards:** ward-wise pendency, repeat hotspots and officer performance.

## What works today

- **Data model:** eight tables (Grievance, Issue, Ward, Zone, Department, Category, Civic Asset, Officer) with sample data for 2 zones, 4 wards, 3 departments, 6 categories, 8 civic assets and 5 grievances.
- **Citizen portal form** (Service Portal page `nagaramitra_submit_grievance`):
  - short description, description and language (English, Telugu or Hindi),
  - location as latitude and longitude, with a "Use my current location" button that reports the accuracy,
  - one optional photo, resized in the browser and saved as an attachment on the grievance,
  - validation on both the client and the server (bad coordinates and wrong file types are rejected),
  - the Citizen field is set to the logged-in user.
- **Automatic routing:** when a grievance is created, a Business Rule calls a Script Include (`GrievanceRouter`) that:
  - finds the ward from the linked civic asset, or otherwise from the nearest ward centre by coordinates (within 25 km; farther complaints are left for an officer),
  - picks the category by matching keywords in the complaint text,
  - takes the department from the category,
  - assigns the group for that ward and department (for example, "Ward 1 - Roads").
- **Audit trail:** every routing decision writes a work note, either "Auto-routed" or a reason why manual assignment is needed (including when no assignment group exists for the ward and department).
- **Access control (tested by impersonating each role):**
  - Citizens can create grievances and read only their own. Fields that officers own (assignment group, assigned to, priority, state, parent, active and citizen) are read-only for citizens on create.
  - Ward officers can read and edit only the grievances of their own ward (looked up through their Officer record), and can update State and Assigned to. They can open the photo on their own ward's grievances.
  - Zonal officers and the Commissioner can read all grievances.
  - The access controls that Studio generates automatically for the Grievance table are deactivated in favour of these role-specific rules.

Routing is implemented with a Business Rule and Script Include because the Run Script action isn't available in Workflow Studio on this instance. Flow Designer is planned for escalations and notifications.

## Known limitations (next up)

- **Ward matching uses the nearest ward centre, not ward boundaries.** A complaint near the edge of two wards can be routed to the neighbouring ward. Real ward boundary polygons would be needed for exact matching in a pilot.
- The portal form accepts one photo per complaint.
- Virtual Agent intake is not built yet.
- The Assigned to lookup for officers is not yet narrowed to officers only.
- Access controls on the other tables (Ward, Zone, Department and so on) still use the auto-generated per-table roles. They will be replaced with the five application roles.

## Data model

| Table | Purpose |
|---|---|
| Grievance (extends Task) | A citizen's complaint, with category, ward, department, location, language and proof |
| Issue | Parent record that groups duplicate grievances, with a report count |
| Ward, Zone | Geographic structure |
| Department, Category | Responsibility and SLA mapping (each category has keywords and SLA hours) |
| Civic Asset | Physical asset a complaint relates to, for hotspot detection |
| Officer | Links a user to a level (ward, zonal, Commissioner), ward and department |

Roles: `citizen`, `ward_officer`, `zonal_officer`, `commissioner` and `admin`.

## Tech stack

ServiceNow scoped application (Studio), Business Rules and Script Includes (JavaScript, GlideRecord), access controls (ACLs), Flow Designer, SLA definitions, Notifications, Service Portal / UI Builder, Virtual Agent, Dashboards and Reports, Git source control.

## Build approach

The core flow (submit, categorise, route, resolve, confirm) is built first, so a working version always exists. AI features are then layered on top:

- **Now Assist** (Smart Categorization, duplicate grouping, multilingual messages, executive brief) is planned if available. It isn't fully available on a free PDI, so the build uses:
  - rule-based categorisation,
  - rule-based duplicate matching (same category, same ward, nearby location, open status) with officer approval,
  - approved Telugu / Hindi / English message templates.

## Roadmap

| Week | Focus | Status |
|---|---|---|
| 1 | Foundation: tables, roles and ACLs, sample data, first routing | **Done** (tables, sample data, routing and access controls complete and tested) |
| 2 | Intake form, field-level ACLs, Virtual Agent intake, geo-routing | Routing, field-level ACLs and the portal form with photo and GPS are done; Virtual Agent intake next |
| 3 | SLAs, escalation, duplicate grouping, citizen confirmation | Not started |
| 4 | Portal polish, dashboards, documentation, demo video | Not started |

## Repository contents

- `/docs`: design documents
- `/seed`: two background scripts that rebuild the sample data on a fresh or reset instance. Run `seed_1_users_groups_GLOBAL.js` in the global scope first, then `seed_2_data_NAGARAMITRA_SCOPE.js` in the NagaraMitra scope. They skip records that already exist, but are meant for rebuilding, not for an instance that already has this data.
- Application source: in the companion repo [nagaramitra-app](https://github.com/suma-1506/nagaramitra-app), synced from ServiceNow Studio. Table data is not included in that repo, which is why the seed scripts exist.

## Data note

All people, officers and complaints in this project are made-up sample data, and no real citizen information is used. Ward centres and civic asset positions use real Visakhapatnam locations (read from Google Maps) so that routing can be tested realistically; the assets themselves are invented.

## Author

Suma Priya Vaddi, final-year B.Tech CSE (AI-ML), ServiceNow Certified System Administrator and Application Developer.
GitHub: [suma-1506](https://github.com/suma-1506) · LinkedIn: [suma-priya-vaddi](https://linkedin.com/in/suma-priya-vaddi)
