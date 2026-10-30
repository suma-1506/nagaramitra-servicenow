/*
 * NagaraMitra seed script 1 of 2: users, roles, groups  (run FIRST)
 *
 * HOW TO RUN
 *   1. Import the app from GitHub first (so the NagaraMitra roles exist).
 *   2. System Definition > Scripts - Background.
 *   3. Set the scope dropdown to GLOBAL (users and groups are global tables).
 *   4. Paste this whole file and click Run script.
 *   Safe to re-run: existing records are skipped, never duplicated.
 *
 * Everything marked EDIT is sample data reconstructed from the README counts.
 * Compare it with your real instance and correct it. All names are made up.
 * No passwords are set. Impersonation does not need one; set one on the user
 * form only if you want to log in as that user.
 */
(function () {
  var APP = 'x_2273825_nagara_0';

  // EDIT: must match the department names in script 2 (the router builds
  // group names as "<Ward label> - <Department name>", e.g. "Ward 1 - Roads").
  var DEPARTMENTS = ['Roads', 'Water Supply', 'Sanitation'];
  // EDIT: the part of each ward name before " - " (must match script 2).
  var WARD_LABELS = ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4'];

  // EDIT: confirm the real user names (user_name) on your instance.
  var USERS = [
    { user_name: 'citizen.asha',   first_name: 'Asha',  last_name: 'Citizen',      role: 'citizen' },
    { user_name: 'officer.ward1',  first_name: 'Ward1', last_name: 'Officer',      role: 'ward_officer',  ward_label: 'Ward 1' },
    { user_name: 'officer.zonal1', first_name: 'Zonal', last_name: 'Officer One',  role: 'zonal_officer' },
    { user_name: 'commissioner1',  first_name: 'City',  last_name: 'Commissioner', role: 'commissioner' }
  ];

  function say(m) { gs.print('[seed1] ' + m); }

  function findOne(table, field, value) {
    var gr = new GlideRecord(table);
    gr.addQuery(field, value);
    gr.setLimit(1);
    gr.query();
    return gr.next() ? gr : null;
  }

  function ensureUser(u) {
    var ex = findOne('sys_user', 'user_name', u.user_name);
    if (ex) { say('user exists: ' + u.user_name); return ex.getUniqueValue(); }
    var gr = new GlideRecord('sys_user');
    gr.initialize();
    gr.setValue('user_name', u.user_name);
    gr.setValue('first_name', u.first_name);
    gr.setValue('last_name', u.last_name);
    gr.setValue('email', u.user_name.replace(/[^a-z0-9]/g, '') + '@example.com');
    gr.setValue('active', true);
    var id = gr.insert();
    say(id ? 'user created: ' + u.user_name : 'FAILED to create user: ' + u.user_name);
    return id;
  }

  function ensureRole(userId, roleShortName) {
    var fullName = APP + '.' + roleShortName;
    var role = findOne('sys_user_role', 'name', fullName);
    if (!role) { say('ROLE NOT FOUND: ' + fullName + ' (import the app first)'); return; }
    var has = new GlideRecord('sys_user_has_role');
    has.addQuery('user', userId);
    has.addQuery('role', role.getUniqueValue());
    has.setLimit(1);
    has.query();
    if (has.next()) { say('  role already assigned: ' + roleShortName); return; }
    has.initialize();
    has.setValue('user', userId);
    has.setValue('role', role.getUniqueValue());
    say(has.insert() ? '  role assigned: ' + roleShortName : '  FAILED role: ' + roleShortName);
  }

  function ensureGroup(name) {
    var ex = findOne('sys_user_group', 'name', name);
    if (ex) { return ex.getUniqueValue(); }
    var gr = new GlideRecord('sys_user_group');
    gr.initialize();
    gr.setValue('name', name);
    gr.setValue('active', true);
    var id = gr.insert();
    say(id ? 'group created: ' + name : 'FAILED group: ' + name);
    return id;
  }

  function ensureMember(groupId, userId) {
    var m = new GlideRecord('sys_user_grmember');
    m.addQuery('group', groupId);
    m.addQuery('user', userId);
    m.setLimit(1);
    m.query();
    if (m.next()) { return; }
    m.initialize();
    m.setValue('group', groupId);
    m.setValue('user', userId);
    m.insert();
  }

  // 1) one group per ward x department
  var groupIds = {};
  for (var w = 0; w < WARD_LABELS.length; w++) {
    for (var d = 0; d < DEPARTMENTS.length; d++) {
      var gName = WARD_LABELS[w] + ' - ' + DEPARTMENTS[d];
      groupIds[gName] = ensureGroup(gName);
    }
  }

  // 2) users, roles, and group membership for ward officers
  for (var i = 0; i < USERS.length; i++) {
    var u = USERS[i];
    var userId = ensureUser(u);
    if (!userId) { continue; }
    ensureRole(userId, u.role);
    if (u.ward_label) {
      for (var k = 0; k < DEPARTMENTS.length; k++) {
        ensureMember(groupIds[u.ward_label + ' - ' + DEPARTMENTS[k]], userId);
      }
    }
  }
  say('done. Now run seed 2 in the NagaraMitra scope.');
})();
