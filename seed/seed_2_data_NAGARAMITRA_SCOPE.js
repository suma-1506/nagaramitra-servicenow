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
 * Everything marked EDIT is sample data reconstructed from the README counts
 * (2 zones, 4 wards, 3 departments, 6 categories, 8 civic assets, 5 grievances).
 * Compare it with your real instance and correct it. All data is made up.
 *
 * Grievances are inserted normally, so the GrievanceRouter business rule runs
 * on each one. That doubles as a routing test: check the work notes afterwards.
 * Grievance numbers (GRV...) come from the instance counter, so they will not
 * be the same as on your original instance.
 */
(function () {
  var P = 'x_2273825_nagara_0_';

  // ---------- EDIT: data ----------
  var ZONES = [
    { code: 'Z1', name: 'Zone 1' },
    { code: 'Z2', name: 'Zone 2' }
  ];

  // The part before " - " must match WARD_LABELS in seed 1 (the router relies on it).
  var WARDS = [
    { ward_number: 1, name: 'Ward 1 - MVP Colony',     zone: 'Z1', latitude: '17.7416', longitude: '83.3361' },
    { ward_number: 2, name: 'Ward 2 - Seethammadhara', zone: 'Z1', latitude: '17.7435', longitude: '83.3070' },
    { ward_number: 3, name: 'Ward 3 - Madhurawada',    zone: 'Z2', latitude: '17.8054', longitude: '83.3772' },
    { ward_number: 4, name: 'Ward 4 - Gajuwaka',       zone: 'Z2', latitude: '17.6868', longitude: '83.2185' }
  ];

  // Names must match DEPARTMENTS in seed 1.
  var DEPARTMENTS = [
    { code: 'ROADS', name: 'Roads' },
    { code: 'WATER', name: 'Water Supply' },
    { code: 'SANI',  name: 'Sanitation' }
  ];

  var CATEGORIES = [
    { name: 'Pothole',               dept: 'Roads',        sla_hours: 72, keywords: 'pothole,road damage,crack,road' },
    { name: 'Streetlight Not Working', dept: 'Roads',      sla_hours: 48, keywords: 'streetlight,street light,lamp,dark street' },
    { name: 'Water Leakage',         dept: 'Water Supply', sla_hours: 24, keywords: 'water leak,leakage,pipe burst,burst pipe' },
    { name: 'No Water Supply',       dept: 'Water Supply', sla_hours: 48, keywords: 'no water,tap dry,supply cut,water supply' },
    { name: 'Drain Blockage',        dept: 'Sanitation',   sla_hours: 24, keywords: 'drain,sewage,overflow,blocked' },
    { name: 'Garbage Not Collected', dept: 'Sanitation',   sla_hours: 48, keywords: 'garbage,waste,dustbin,trash' }
  ];

  // EDIT: 'type' must be a real choice value of the Civic Asset Type field.
  var ASSETS = [
    { asset_id: 'AST-001', type: 'drain',       ward: 'Ward 1 - MVP Colony',     latitude: '17.7420', longitude: '83.3355' },
    { asset_id: 'AST-002', type: 'streetlight', ward: 'Ward 1 - MVP Colony',     latitude: '17.7410', longitude: '83.3368' },
    { asset_id: 'AST-003', type: 'pipe',        ward: 'Ward 2 - Seethammadhara', latitude: '17.7440', longitude: '83.3075' },
    { asset_id: 'AST-004', type: 'road',        ward: 'Ward 2 - Seethammadhara', latitude: '17.7430', longitude: '83.3065' },
    { asset_id: 'AST-005', type: 'drain',       ward: 'Ward 3 - Madhurawada',    latitude: '17.8060', longitude: '83.3780' },
    { asset_id: 'AST-006', type: 'streetlight', ward: 'Ward 3 - Madhurawada',    latitude: '17.8050', longitude: '83.3765' },
    { asset_id: 'AST-007', type: 'pipe',        ward: 'Ward 4 - Gajuwaka',       latitude: '17.6875', longitude: '83.2190' },
    { asset_id: 'AST-008', type: 'road',        ward: 'Ward 4 - Gajuwaka',       latitude: '17.6860', longitude: '83.2180' }
  ];

  // EDIT: 'level' must be a real choice value of the Officer Level field.
  var OFFICERS = [
    { user_name: 'officer.ward1',  level: 'ward',         ward: 'Ward 1 - MVP Colony', department: 'Roads' },
    { user_name: 'officer.zonal1', level: 'zonal',        zone: 'Z1' },
    { user_name: 'commissioner1',  level: 'commissioner' }
  ];

  // EDIT: 'language' must be a real choice value of the Language field.
  // The router fills ward/category/department from the asset and the text.
  var GRIEVANCES = [
    { short_description: 'Blocked drain overflowing near MVP Colony', description: 'The drain is blocked and sewage is overflowing onto the street.', asset: 'AST-001', language: 'english', latitude: '17.7420', longitude: '83.3355' },
    { short_description: 'Streetlight not working on our lane',        description: 'The streetlight has been off for a week and the street is dark.', asset: 'AST-002', language: 'telugu',  latitude: '17.7410', longitude: '83.3368' },
    { short_description: 'Water leakage from main pipe',               description: 'There is a water leak from the pipe near the junction.',          asset: 'AST-003', language: 'english', latitude: '17.7440', longitude: '83.3075' },
    { short_description: 'Pothole on main road',                       description: 'A large pothole on the road is causing accidents.',               asset: 'AST-008', language: 'hindi',   latitude: '17.6860', longitude: '83.2180' },
    { short_description: 'Garbage not collected for three days',       description: 'Garbage and waste are piling up near the dustbin.',               asset: 'AST-005', language: 'english', latitude: '17.8060', longitude: '83.3780' }
  ];
  var GRIEVANCE_CITIZEN = 'citizen.asha';
  // ---------- end of data ----------

  function say(m) { gs.print('[seed2] ' + m); }

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
      if (fields.hasOwnProperty(f) && fields[f] !== '' && fields[f] !== null) {
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
    deptId[DEPARTMENTS[i].name] = upsert(P + 'department', 'name', DEPARTMENTS[i].name, { code: DEPARTMENTS[i].code });
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
      civic_asset: assetId[g.asset],
      language: g.language,
      latitude: g.latitude,
      longitude: g.longitude
    });
  }
  say('done. Open the Grievance list and check ward, category, department and work notes.');
})();
