/**
 * js/modules/dashboard.js
 * Dashboard page — summary stats, resident profile, quick actions.
 */

'use strict';

const PageDashboard = (() => {

  function render() {
    const r   = App.getCurrentResident();
    const rec = {
      notes:      Store.get(r.id, 'notes'),
      continence: Store.get(r.id, 'continence'),
      medication: Store.get(r.id, 'medication'),
    };

    const alerts =
      rec.notes.filter((n) => n.category === 'Health Concern').length +
      rec.medication.filter((m) => m.result === 'Refused').length;

    document.getElementById('content').innerHTML = `

      <div class="dash-stats">
        <div class="stat-card">
          <div class="stat-value">${rec.notes.length}</div>
          <div class="stat-label">Notes Today</div>
          <div style="margin-top:6px">${rec.notes.length > 0 ? '<span class="pill pill-green">Active</span>' : '<span class="pill pill-gray">None</span>'}</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${rec.continence.length}</div>
          <div class="stat-label">Continence Checks</div>
          <div style="margin-top:6px"><span class="pill pill-blue">Logged</span></div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${rec.medication.length}</div>
          <div class="stat-label">Medications</div>
          <div style="margin-top:6px"><span class="pill pill-blue">Today</span></div>
        </div>
        <div class="stat-card">
          <div class="stat-value" style="color:${alerts > 0 ? '#dc2626' : '#059669'}">${alerts}</div>
          <div class="stat-label">Alerts</div>
          <div style="margin-top:6px">${alerts > 0 ? '<span class="pill pill-red">Requires Review</span>' : '<span class="pill pill-green">All Clear</span>'}</div>
        </div>
      </div>

      <div class="card">
        <div class="card-title"><div class="accent"></div>Resident Profile — ${Utils.escapeHtml(r.name)}</div>
        <div class="grid-4" style="margin-bottom:12px">
          ${_profileItem('Room',       r.room)}
          ${_profileItem('Date of Birth', `${r.dob} (${r.age})`)}
          ${_profileItem('GP',         r.gp)}
          ${_profileItem('Key Worker', r.keyworker)}
          ${_profileItem('Diagnosis',  r.diagnosis)}
          ${_profileItem('Allergies',  r.allergies, '#dc2626')}
          ${_profileItem('Diet',       r.diet)}
          ${_profileItem('Mobility',   r.mobility)}
        </div>
        ${r.dnr ? '<div class="dnacpr-banner">⚠ DNACPR IN PLACE — Do Not Attempt Cardiopulmonary Resuscitation</div>' : ''}
      </div>

      <div class="card">
        <div class="card-title"><div class="accent"></div>Today's Activity Log</div>
        <div class="record-list">
          ${_buildLog(rec)}
        </div>
      </div>

      <div class="card">
        <div class="card-title"><div class="accent"></div>Quick Actions</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px">
          <button class="btn btn-primary"  onclick="App.showPage('daily-notes')">+ Daily Note</button>
          <button class="btn btn-outline"  onclick="App.showPage('continence')">+ Continence</button>
          <button class="btn btn-outline"  onclick="App.showPage('activity')">+ Activity</button>
          <button class="btn btn-outline"  onclick="App.showPage('personal-care')">+ Personal Care</button>
          <button class="btn btn-outline"  onclick="App.showPage('medication')">+ Medication</button>
          <button class="btn btn-outline"  onclick="App.showPage('fluid-nutrition')">+ Fluid / Nutrition</button>
          <button class="btn btn-outline"  onclick="App.showPage('epilepsy')">+ Seizure Record</button>
          <button class="btn btn-outline"  onclick="App.showPage('night-report')">+ Night Report</button>
        </div>
      </div>`;
  }

  function _profileItem(label, value, color = '') {
    return `
      <div>
        <div style="font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px">${Utils.escapeHtml(label)}</div>
        <div style="font-weight:600;margin-top:2px${color ? ';color:' + color : ''}">${Utils.escapeHtml(String(value))}</div>
      </div>`;
  }

  function _buildLog(rec) {
    const rows = [];

    rec.notes.slice(0, 3).forEach((n) => {
      const snippet = n.note.length > 80 ? n.note.slice(0, 80) + '…' : n.note;
      rows.push(`
        <div class="record-item">
          <div>
            <div class="r-time">${Utils.escapeHtml(n.time)} — ${Utils.escapeHtml(n.shift)} shift</div>
            <div class="r-desc">${Utils.escapeHtml(snippet)}</div>
          </div>
          ${Utils.pill(n.category)}
        </div>`);
    });

    rec.continence.slice(0, 2).forEach((n) => {
      rows.push(`
        <div class="record-item">
          <div>
            <div class="r-time">${Utils.escapeHtml(n.time)} — Continence check</div>
            <div class="r-desc">${Utils.escapeHtml(n.output)} | Skin: ${Utils.escapeHtml(n.skin)}</div>
          </div>
          ${Utils.pill(n.skin)}
        </div>`);
    });

    rec.medication.slice(0, 3).forEach((n) => {
      rows.push(`
        <div class="record-item">
          <div>
            <div class="r-time">${Utils.escapeHtml(n.time)} — Medication</div>
            <div class="r-desc">${Utils.escapeHtml(n.drug)} ${Utils.escapeHtml(n.dose)} — ${Utils.escapeHtml(n.result)}</div>
          </div>
          ${Utils.pill(n.result)}
        </div>`);
    });

    if (rows.length === 0) {
      return '<div style="color:#94a3b8;font-size:13px;text-align:center;padding:20px">No records yet today. Start documenting using the quick actions below.</div>';
    }

    return rows.join('');
  }

  return { render };
})();
