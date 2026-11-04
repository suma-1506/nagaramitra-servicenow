/*
 * NagaraMitra seed script 2 of 2: zones, wards, departments, categories,
 * civic assets, officers and sample grievances  (run AFTER seed 1)
 *
 * HOW TO RUN
 *   1. System Definition > Scripts - Background.
 *   2. Set the scope dropdown to NagaraMitra (x_2273825_nagara_0).
 *   3. Paste this whole file and click Run script.
 *   Safe to re-run: existing records are skipped, never duplicated.
 *
 * Use this ONLY to rebuild after an instance reset or on a fresh instance.
 * Do NOT run it on an instance that already has this data.
 *
 * Data was copied from the real instance on 2 Nov 2026. Ward, civic asset and
 * sample grievance coordinates were updated on 4 Nov 2026 to real Visakhapatnam
 * locations (Google Maps). All names are made up.
 *
 * Departments have an assignment_group (Water Dept, Roads Dept, Sanitation Dept).
 * Those groups are created by seed 1, and reading sys_user_group from this
 * scope relies on the cross-scope privilege that ships with the app.
 *
 * Grievances are inserted normally, so the GrievanceRouter business rule runs
 * on each one and fills ward, category, department and assignment group.
 * That doubles as a routing test: check the work notes afterwards. Grievance
 * numbers (GRV...) come from the instance counter, so they will not match
 * the original numbers.
 */
(function () {
  var P = 'x_2273825_nagara_0_';

  // ---------- data ----------
  var ZONES = [
    { code: 'Z01', name: 'Central Zone' },
    { code: 'Z02', name: 'North Zone' }
  ];

  // The part of each name before " - " must match WARD_LABELS in seed 1.
  var WARDS = [
    { ward_number: 1, name: 'Ward 1 - MVP Colony',    zone: 'Z01', latitude: '17.743439', longitude: '83.336362' },
    { ward_number: 2, name: 'Ward 2 - Dwaraka Nagar', zone: 'Z01', latitude: '17.729597', longitude: '83.308713' },
    { ward_number: 3, name: 'Ward 3 - Madhavadhara',  zone: 'Z02', latitude: '17.748504', longitude: '83.258406' },
    { ward_number: 4, name: 'Ward 4 - Madhurawada',   zone: 'Z02', latitude: '17.824523', longitude: '83.356589' }
  ];

  // group = the department-level group created in seed 1.
  var DEPARTMENTS = [
    { code: 'WAT', name: 'Water',      group: 'Water Dept' },
    { code: 'ROD', name: 'Roads',      group: 'Roads Dept' },
    { code: 'SAN', name: 'Sanitation', group: 'Sanitation Dept' }
  ];

  var CATEGORIES = [
    { name: 'Water Supply Disruption', dept: 'Water',      sla_hours: 24, keywords: 'no water, water supply, low pressure, dry tap, tap, tanker, borewell' },
    { name: 'Pipe Leakage',            dept: 'Water',      sla_hours: 12, keywords: 'leak, leaking, burst, pipeline, water wastage, overflowing tank' },
    { name: 'Pothole / Road Damage',   dept: 'Roads',      sla_hours: 72, keywords: 'pothole, road damage, broken road, crater, road repair, cracked road' },
    { name: 'Streetlight Not Working', dept: 'Roads',      sla_hours: 48, keywords: 'streetlight, street light, lamp, light not working, dark street, pole light' },
    { name: 'Garbage Not Collected',   dept: 'Sanitation', sla_hours: 24, keywords: 'garbage, trash, waste, dustbin, bin, not collected, litter' },
    { name: 'Drain Blockage',          dept: 'Sanitation', sla_hours: 24, keywords: 'drain, drainage, sewer, sewage, clogged, blocked, manhole' }
  ];

  // type values: pipe, drain, road_segment, pole
  var ASSETS = [
    { asset_id: 'DRN-W1-001', type: 'drain',        ward: 'Ward 1 - MVP Colony',    latitude: '17.743523', longitude: '83.336480' },
    { asset_id: 'POL-W1-001', type: 'pole',         ward: 'Ward 1 - MVP Colony',    latitude: '17.743123', longitude: '83.335980' },
    { asset_id: 'PIP-W2-001', type: 'pipe',         ward: 'Ward 2 - Dwaraka Nagar', latitude: '17.729697', longitude: '83.308813' },
    { asset_id: 'RDS-W2-001', type: 'road_segment', ward: 'Ward 2 - Dwaraka Nagar', latitude: '17.729297', longitude: '83.308413' },
    { asset_id: 'POL-W3-001', type: 'pole',         ward: 'Ward 3 - Madhavadhara',  latitude: '17.748304', longitude: '83.258206' },
    { asset_id: 'DRN-W3-001', type: 'drain',        ward: 'Ward 3 - Madhavadhara',  latitude: '17.748604', longitude: '83.258506' },
    { asset_id: 'PIP-W4-001', type: 'pipe',         ward: 'Ward 4 - Madhurawada',   latitude: '17.824623', longitude: '83.356689' },
    { asset_id: 'RDS-W4-001', type: 'road_segment', ward: 'Ward 4 - Madhurawada',   latitude: '17.824323', longitude: '83.356389' }
  ];

  // level values: ward, zonal, commissioner
  var OFFICERS = [
    { user_name: 'officer.ward1',  level: 'ward',         ward: 'Ward 1 - MVP Colony', zone: 'Z01', department: 'Water' },
    { user_name: 'officer.zonal1', level: 'zonal',        zone: 'Z01' },
    { user_name: 'commissioner1',  level: 'commissioner' }
  ];

  // language values: english, telugu, hindi. asset '' = no civic asset linked.
  var GRIEVANCES = [
    { short_description: 'Streetlight not working',          description: 'The street light in our lane is dark since last night',                 asset: '',           language: 'english', latitude: '17.743323', longitude: '83.336180' },
    { short_description: 'Pothole near main road',           description: 'Big pothole on the road, vehicles are getting damaged',                 asset: 'RDS-W2-001', language: 'english', latitude: '17.729297', longitude: '83.308413' },
    { short_description: 'No water supply since morning',    description: 'No water in the tap since morning, low pressure yesterday',             asset: '',           language: 'english', latitude: '17.743123', longitude: '83.335980' },
    { short_description: 'Drain is blocked and overflowing', description: 'The drain is clogged and sewage is overflowing onto the street',        asset: 'DRN-W3-001', language: 'telugu',  latitude: '17.748604', longitude: '83.258506' },
    { short_description: 'Garbage not collected for 3 days', description: 'Garbage is piled up near the dustbin and nobody has collected it',      asset: '',           language: 'hindi',   latitude: '17.824623', longitude: '83.356689' }
  ];
  
  var GRIEVANCE_CITIZEN = 'citizen.asha';
  // ---------- end of data ----------

  function say(m) { gs.info('[seed2] ' + m); }

  function lookup(table, field, value) {
    var gr = new GlideRecord(table);
    gr.addQuery(field, value);
    gr.setLimit(1);
    gr.query();
    return gr.next() ? gr.getUniqueValue() : '';
  }

  function upsert(table, keyField, keyValue, fields) {
    var ex = lookup(table, keyField, keyValue);
    if (ex) { say('exists: ' + keyValue); return ex; }
    var gr = new GlideRecord(table);
    gr.initialize();
    gr.setValue(keyField, keyValue);
    for (var f in fields) {
      if (fields.hasOwnProperty(f) && fields[f] !== '' && fields[f] !== null && fields[f] !== undefined) {
        gr.setValue(f, fields[f]);
      }
    }
    var id = gr.insert();
    say(id ? 'created: ' + keyValue : 'FAILED: ' + keyValue);
    return id;
  }

  var i;
  var zoneId = {}, wardId = {}, deptId = {}, assetId = {};

  for (i = 0; i < ZONES.length; i++) {
    zoneId[ZONES[i].code] = upsert(P + 'zone', 'code', ZONES[i].code, { name: ZONES[i].name });
  }
  for (i = 0; i < WARDS.length; i++) {
    var w = WARDS[i];
    wardId[w.name] = upsert(P + 'ward', 'name', w.name, {
      ward_number: w.ward_number, zone: zoneId[w.zone], latitude: w.latitude, longitude: w.longitude
    });
  }
  for (i = 0; i < DEPARTMENTS.length; i++) {
    var d = DEPARTMENTS[i];
    var grpId = lookup('sys_user_group', 'name', d.group);
    if (!grpId) { say('GROUP NOT FOUND: ' + d.group + ' (run seed 1 first)'); }
    deptId[d.name] = upsert(P + 'department', 'name', d.name, { code: d.code, assignment_group: grpId });
  }
  for (i = 0; i < CATEGORIES.length; i++) {
    var c = CATEGORIES[i];
    upsert(P + 'category', 'name', c.name, { department: deptId[c.dept], sla_hours: c.sla_hours, keywords: c.keywords });
  }
  for (i = 0; i < ASSETS.length; i++) {
    var a = ASSETS[i];
    assetId[a.asset_id] = upsert(P + 'civic_asset', 'asset_id', a.asset_id, {
      type: a.type, ward: wardId[a.ward], latitude: a.latitude, longitude: a.longitude
    });
  }
  for (i = 0; i < OFFICERS.length; i++) {
    var o = OFFICERS[i];
    var uid = lookup('sys_user', 'user_name', o.user_name);
    if (!uid) { say('USER NOT FOUND: ' + o.user_name + ' (run seed 1 first)'); continue; }
    upsert(P + 'officer', 'user', uid, {
      level: o.level,
      ward: o.ward ? wardId[o.ward] : '',
      zone: o.zone ? zoneId[o.zone] : '',
      department: o.department ? deptId[o.department] : ''
    });
  }

  var citizenId = lookup('sys_user', 'user_name', GRIEVANCE_CITIZEN);
  if (!citizenId) { say('USER NOT FOUND: ' + GRIEVANCE_CITIZEN + ' (run seed 1 first)'); return; }
  for (i = 0; i < GRIEVANCES.length; i++) {
    var g = GRIEVANCES[i];
    upsert(P + 'grievance', 'short_description', g.short_description, {
      description: g.description,
      citizen: citizenId,
      civic_asset: g.asset ? assetId[g.asset] : '',
      language: g.language,
      latitude: g.latitude,
      longitude: g.longitude
    });
  }
  say('done. Open the Grievance list and check ward, category, department and work notes.');
})();
