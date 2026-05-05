/**
 * js/modules/medication.js
 * Medication Administration Record.
 */

'use strict';

const PageMedication = (() => {

  function render() {
    const r       = App.getCurrentResident();
    const records = Store.get(r.id, 'medication');

    document.getElementById('content').innerHTML = `

      <div class="card card-danger">
        <div class="allergy-banner">⚠ ALLERGY ALERT: ${Utils.escapeHtml(r.allergies)}</div>
      </div>

      <div class="card">
        <div class="card-title"><div class="accent"></div>Medication Administration Record</div>
        <div class="grid-2" id="med-form">
          ${Utils.field('Date',        Utils.inp('', 'date', Utils.TODAY))}
          ${Utils.field('Time Given',  Utils.inp('', 'time', Utils.now()))}
          ${Utils.field('Medication Name',  Utils.inp('e.g. Amlodipine 5mg'))}
          ${Utils.field('Dose / Strength',  Utils.inp('e.g. 1 tablet, 5ml'))}
          ${Utils.field('Route', Utils.sel(['Oral','Topical','Inhaled','Subcutaneous injection','Rectal','Transdermal patch','Eye drops','Ear drops','Sublingual','Nasogastric']))}
          ${Utils.field('Administration Result', Utils.sel(['Given as prescribed','Refused','Unable to give — reason below','Withheld — reason below','Not available / out of stock']))}
          <div class="field full">
            <label>PRN Medication?</label>
            <div style="display:flex;gap:16px;margin-top:2px">
              <label style="display:flex;align-items:center;gap:5px;font-size:12.5px;cursor:pointer">
                <input type="radio" name="prn" value="yes" style="accent-color:#5bb8f5"> Yes — PRN
              </label>
              <label style="display:flex;align-items:center;gap:5px;font-size:12.5px;cursor:pointer">
                <input type="radio" name="prn" value="no" checked style="accent-color:#5bb8f5"> No — Scheduled
              </label>
            </div>
          </div>
          ${Utils.field('PRN Reason (if applicable)', Utils.inp('e.g. pain, anxiety, breakthrough nausea'))}
          ${Utils.field('Administered By',  Utils.inp('Your full name'))}
          ${Utils.field('Witnessed By',     Utils.inp('Second signatory (if required)'))}
          ${Utils.field('Notes / Reason if Not Given', Utils.ta('Side effects, refusal reason, stock issue...'), true)}
          <div class="btn-row">
            <button class="btn btn-success" onclick="PageMedication.save()">Save Record</button>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-title"><div class="accent"></div>Today's Medication Log (${records.length})</div>
        <div style="overflow-x:auto">
          <table class="data-table">
            <thead>
              <tr><th>Time</th><th>Medication</th><th>Dose</th><th>Route</th><th>Result</th><th>Staff</th><th></th></tr>
            </thead>
            <tbody>${_renderTable(records)}</tbody>
          </table>
        </div>
      </div>`;
  }

  function save() {
    const form = document.getElementById('med-form');
    const vals = Utils.allVals(form);

    const drug = vals[2];
    if (!drug) {
      App.toast('Please enter a medication name.', 'error');
      return;
    }

    const record = {
      time:   vals[1] || Utils.now(),
      drug,
      dose:   vals[3] || '—',
      route:  vals[4] || '—',
      result: vals[5] || '—',
      prn:    form.querySelector('input[name="prn"]:checked')?.value === 'yes',
      staff:  vals[8] || '—',
    };

    Store.push(App.getCurrentResident().id, 'medication', record);
    App.toast('✓ Medication record saved');
    App.showPage('medication');
  }

  function deleteRecord(index) {
    Store.remove(App.getCurrentResident().id, 'medication', index);
    App.showPage('medication');
  }

  function _renderTable(records) {
    if (records.length === 0) {
      return `<tr><td colspan="7" style="text-align:center;color:#94a3b8;padding:20px">No medication recorded yet.</td></tr>`;
    }
    return records.map((m, i) => {
      const resultColor = m.result === 'Refused' ? '#dc2626'
        : m.result.startsWith('Given') ? '#059669' : '#1a2332';
      return `
        <tr>
          <td><strong>${Utils.escapeHtml(m.time)}</strong></td>
          <td>${Utils.escapeHtml(m.drug)}${m.prn ? ' <span class="pill pill-amber">PRN</span>' : ''}</td>
          <td>${Utils.escapeHtml(m.dose)}</td>
          <td>${Utils.escapeHtml(m.route)}</td>
          <td style="color:${resultColor}">${Utils.escapeHtml(m.result)}</td>
          <td>${Utils.escapeHtml(m.staff)}</td>
          <td>
            <button onclick="PageMedication.deleteRecord(${i})"
              style="border:none;background:none;color:#dc2626;cursor:pointer;font-size:12px"
              aria-label="Delete medication record">✕</button>
          </td>
        </tr>`;
    }).join('');
  }

  return { render, save, deleteRecord };
})();
