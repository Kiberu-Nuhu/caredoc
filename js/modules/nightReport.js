/**
 * js/modules/nightReport.js
 * Night Report — hourly checks and shift handover.
 */

'use strict';

const PageNightReport = (() => {

  const CHECK_TIMES = ['22:00','23:00','00:00','01:00','02:00','03:00','04:00','05:00','06:00'];

  function render() {
    const r       = App.getCurrentResident();
    const reports = Store.get(r.id, 'nightReports');

    document.getElementById('content').innerHTML = `
      <div class="card">
        <div class="card-title"><div class="accent"></div>Night Report — ${Utils.escapeHtml(r.name)}</div>
        <div class="grid-2" id="nr-form">
          ${Utils.field('Date (Night of)', Utils.inp('', 'date', Utils.TODAY))}
          ${Utils.field('Shift',           Utils.sel(['21:00 – 07:00','22:00 – 07:00','23:00 – 07:00']))}
          ${Utils.field('Night Staff Name',     Utils.inp('Your full name'))}
          ${Utils.field('Second Staff / Co-worker', Utils.inp('Colleague name (if applicable)'))}
        </div>

        <div class="section-divider" style="display:block">Sleep &amp; Behaviour Overview</div>
        <div class="grid-2">
          ${Utils.field('Settled to Bed At',    Utils.inp('', 'time'))}
          ${Utils.field('Woke During Night?',   Utils.sel(['No — slept throughout','Yes — once','Yes — twice','Yes — multiple times','Did not sleep']))}
          ${Utils.field('Time(s) Awake',         Utils.inp('e.g. 01:30, 03:45'))}
          ${Utils.field('Reason for Waking',    Utils.sel(['N/A','Confusion / disorientation','Pain / discomfort','Toileting need','Nightmares / distress','Noise / environment','Unknown','Other']))}
          ${Utils.field('Overall Sleep Quality', Utils.sel(['Good — settled all night','Fair — brief disturbance','Poor — frequently disturbed','Very poor — no meaningful sleep']))}
          ${Utils.field('Mood During Night',     Utils.sel(['Calm / settled','Anxious','Confused','Agitated','Distressed','Tearful','Happy','Sleepy / drowsy']))}
        </div>

        <div class="section-divider" style="display:block">Hourly / Night Checks</div>
        <div style="overflow-x:auto">
          <table class="data-table">
            <thead>
              <tr>
                <th>Check Time</th><th>Awake / Asleep</th><th>Breathing</th>
                <th>Position</th><th>Skin / Pad</th><th>Notes</th><th>Initials</th>
              </tr>
            </thead>
            <tbody>
              ${CHECK_TIMES.map((t) => `
                <tr>
                  <td><strong>${t}</strong></td>
                  <td><select class="tbl-select"><option>Asleep</option><option>Awake</option><option>Restless</option><option>Not checked</option></select></td>
                  <td><select class="tbl-select"><option>Normal</option><option>Noisy</option><option>Laboured</option><option>N/A</option></select></td>
                  <td><select class="tbl-select"><option>Comfortable</option><option>Repositioned</option><option>Self-moved</option></select></td>
                  <td><select class="tbl-select"><option>OK</option><option>Pad changed</option><option>Skin concern</option></select></td>
                  <td><input class="tbl-input" type="text" placeholder="Notes" style="width:140px"></td>
                  <td><input class="tbl-input" type="text" placeholder="Initials" style="width:55px"></td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>

        <div class="section-divider" style="display:block;margin-top:12px">Personal Care During Night</div>
        <div class="grid-2">
          ${Utils.field('Continence Care Needed?', Utils.sel(['No — pad intact all night','Yes — pad changed once','Yes — pad changed twice','Yes — pad changed 3+ times','Toileting assisted']))}
          ${Utils.field('Number of Pad Changes',   Utils.inp('e.g. 2', 'number'))}
          ${Utils.field('Skin Condition',          Utils.sel(['Intact throughout','Slight redness noted','Broken skin / wound','Referred to day staff']))}
          ${Utils.field('Pressure Areas Checked?', Utils.sel(['Yes — all clear','Yes — concern noted','No — resident declined']))}
        </div>

        <div class="section-divider" style="display:block">Incidents &amp; Concerns During Night</div>
        <div class="grid-2">
          ${Utils.field('Any Incidents?', Utils.sel(['No incidents','Fall / near fall','Seizure episode','Medical emergency','Behavioural incident','Visitor / family issue','Other']))}
          ${Utils.field('Incident Time (if applicable)', Utils.inp('', 'time'))}
          ${Utils.field('Incident Description', Utils.ta('Describe fully what happened, actions taken, who was informed...'), true)}
          ${Utils.field('Manager Informed?', Utils.sel(['No — no concerns','Yes — informed during night','Yes — recorded for morning handover']))}
          ${Utils.field('Family Informed?',  Utils.sel(['No','Yes — during night','Yes — for morning handover']))}
          ${Utils.field('GP / 111 / 999 Called?', Utils.sel(['No','Yes — GP called','Yes — 111 called','Yes — 999 called']))}
        </div>

        <div class="section-divider" style="display:block">Handover to Morning Shift</div>
        <div class="grid-2">
          ${Utils.field('Key Points for Day Staff',   Utils.ta('Important information for the morning shift — health changes, incidents, concerns, outstanding tasks...'), true)}
          ${Utils.field('Follow-Up Actions Required', Utils.ta('Tasks, GP calls, family contact, medication reviews etc.'), true)}
          ${Utils.field('Overall Night Summary', Utils.sel(['Settled and uneventful','Minor concerns — noted above','Significant concerns — urgent review needed','Medical emergency occurred']))}
          ${Utils.field('Handover Given To', Utils.inp('Name of receiving staff member'))}
          ${Utils.field('Handover Time',     Utils.inp('', 'time'))}
          ${Utils.field('Night Staff Signature', Utils.inp('Your full name'))}
          <div class="btn-row">
            <button class="btn btn-success" onclick="PageNightReport.save()">Save Night Report</button>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-title"><div class="accent"></div>Previous Night Reports (${reports.length})</div>
        <div class="record-list">
          ${_renderLog(reports)}
        </div>
      </div>`;
  }

  function save() {
    const form = document.getElementById('nr-form');
    const vals = Utils.allVals(form);
    const contentEl = document.getElementById('content');
    const allSelects = contentEl.querySelectorAll('.field select');
    const allTextareas = contentEl.querySelectorAll('.field textarea');

    const record = {
      date:     vals[0] || Utils.TODAY,
      staff:    vals[2] || '—',
      sleep:    allSelects[4]?.value || '—',
      woke:     allSelects[1]?.value || '—',
      summary:  allSelects[allSelects.length - 3]?.value || 'Settled and uneventful',
      handover: allTextareas[0]?.value.trim() || '',
    };

    Store.push(App.getCurrentResident().id, 'nightReports', record);
    App.toast('✓ Night report saved');
    App.showPage('night-report');
  }

  function deleteRecord(index) {
    Store.remove(App.getCurrentResident().id, 'nightReports', index);
    App.showPage('night-report');
  }

  function _renderLog(reports) {
    if (reports.length === 0) {
      return '<div style="color:#94a3b8;font-size:13px;padding:16px 0;text-align:center">No night reports recorded yet.</div>';
    }
    return reports.map((n, i) => `
      <div class="record-item record-item--column">
        <div style="display:flex;justify-content:space-between;width:100%;align-items:center">
          <div class="r-time">Night of ${Utils.escapeHtml(n.date)} — ${Utils.escapeHtml(n.staff)}</div>
          <div style="display:flex;gap:6px;align-items:center">
            ${Utils.pill(n.summary)}
            <button onclick="PageNightReport.deleteRecord(${i})"
              style="border:none;background:none;color:#dc2626;cursor:pointer;font-size:12px"
              aria-label="Delete night report">✕</button>
          </div>
        </div>
        <div style="font-size:12px;color:#374151">Sleep: ${Utils.escapeHtml(n.sleep)} | Waking: ${Utils.escapeHtml(n.woke)}</div>
        ${n.handover ? `<div style="font-size:11px;color:#94a3b8">${Utils.escapeHtml(n.handover.slice(0, 120))}${n.handover.length > 120 ? '…' : ''}</div>` : ''}
      </div>`).join('');
  }

  return { render, save, deleteRecord };
})();
