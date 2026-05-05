/**
 * js/modules/continence.js
 * Continence monitoring — entry form and daily chart.
 */

'use strict';

const PageContinence = (() => {

  function render() {
    const r      = App.getCurrentResident();
    const records = Store.get(r.id, 'continence');

    document.getElementById('content').innerHTML = `
      <div class="card">
        <div class="card-title"><div class="accent"></div>Continence Check Entry</div>
        <div class="grid-2" id="continence-form">
          ${Utils.field('Date',       Utils.inp('', 'date', Utils.TODAY))}
          ${Utils.field('Time',       Utils.inp('', 'time', Utils.now()))}
          ${Utils.field('Output Type', Utils.sel(['Urine only','Faeces only','Both','No output']))}
          ${Utils.field('Method',      Utils.sel(['Pad','Toilet — assisted','Toilet — independent','Commode','Catheter']))}
          ${Utils.field('Volume (Urine)', Utils.sel(['Small','Medium','Large','N/A']))}
          ${Utils.field('Stool (Bristol Scale)', Utils.sel(['N/A','Type 1 — Hard lumps','Type 2 — Lumpy sausage','Type 3 — Cracked sausage','Type 4 — Smooth/soft','Type 5 — Soft blobs','Type 6 — Mushy','Type 7 — Liquid/watery']))}
          ${Utils.field('Skin Condition',  Utils.sel(['Intact','Reddened','Blistered','Broken / Sore','Rash present']))}
          ${Utils.field('Pad Changed?',    Utils.sel(['Yes','No — not required']))}
          ${Utils.field('Product Used',    Utils.inp('e.g. Tena Super, Comficare'))}
          ${Utils.field('Any Concerns',    Utils.inp('e.g. blood in urine, pain on voiding'))}
          ${Utils.field('Barrier Cream',   Utils.sel(['No','Yes — Cavilon','Yes — Sudocrem','Yes — Other']))}
          ${Utils.field('Staff Initials',  Utils.inp('e.g. J.S.'))}
          ${Utils.field('Additional Notes', Utils.ta('Any further observations...'), true)}
          <div class="btn-row">
            <button class="btn btn-success" onclick="PageContinence.save()">Save Record</button>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-title"><div class="accent"></div>Today's Continence Chart (${records.length} entries)</div>
        <div style="overflow-x:auto">
          <table class="data-table">
            <thead>
              <tr>
                <th>Time</th><th>Output</th><th>Method</th><th>Volume</th>
                <th>Skin</th><th>Pad Changed</th><th>Staff</th><th></th>
              </tr>
            </thead>
            <tbody>
              ${_renderTable(records)}
            </tbody>
          </table>
        </div>
      </div>`;
  }

  function save() {
    const form = document.getElementById('continence-form');
    const vals = Utils.allVals(form);

    const record = {
      time:       vals[1] || Utils.now(),
      output:     vals[2] || '—',
      method:     vals[3] || '—',
      volume:     vals[4] || '—',
      stool:      vals[5] || 'N/A',
      skin:       vals[6] || 'Intact',
      padChanged: vals[7] || '—',
      product:    vals[8] || '—',
      concerns:   vals[9] || '—',
      staff:      vals[11] || '—',
    };

    Store.push(App.getCurrentResident().id, 'continence', record);
    App.toast('✓ Continence record saved');
    App.showPage('continence');
  }

  function deleteRecord(index) {
    Store.remove(App.getCurrentResident().id, 'continence', index);
    App.showPage('continence');
  }

  function _renderTable(records) {
    if (records.length === 0) {
      return `<tr><td colspan="8" style="text-align:center;color:#94a3b8;padding:20px">No records yet.</td></tr>`;
    }
    return records.map((rec, i) => `
      <tr>
        <td><strong>${Utils.escapeHtml(rec.time)}</strong></td>
        <td>${Utils.escapeHtml(rec.output)}</td>
        <td>${Utils.escapeHtml(rec.method)}</td>
        <td>${Utils.escapeHtml(rec.volume)}</td>
        <td style="color:${rec.skin !== 'Intact' ? '#b45309' : '#059669'}">${Utils.escapeHtml(rec.skin)}</td>
        <td>${Utils.escapeHtml(rec.padChanged)}</td>
        <td>${Utils.escapeHtml(rec.staff)}</td>
        <td>
          <button onclick="PageContinence.deleteRecord(${i})"
            style="border:none;background:none;color:#dc2626;cursor:pointer;font-size:12px"
            aria-label="Delete record">✕</button>
        </td>
      </tr>`).join('');
  }

  return { render, save, deleteRecord };
})();
