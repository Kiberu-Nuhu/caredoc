/**
 * js/modules/dailyNotes.js
 * Daily notes — entry form and log view.
 */

'use strict';

const PageDailyNotes = (() => {

  function render() {
    const r    = App.getCurrentResident();
    const notes = Store.get(r.id, 'notes');

    document.getElementById('content').innerHTML = `
      <div class="card">
        <div class="card-title"><div class="accent"></div>New Daily Note</div>
        <div class="grid-2" id="notes-form">
          ${Utils.field('Date',  Utils.inp('', 'date', Utils.TODAY))}
          ${Utils.field('Time',  Utils.inp('', 'time', Utils.now()))}
          ${Utils.field('Staff Name', Utils.inp('Your full name'))}
          ${Utils.field('Shift', Utils.sel(['Morning (07:00–14:00)', 'Afternoon (14:00–21:00)', 'Night (21:00–07:00)']))}
          ${Utils.field('Note Category', Utils.sel(['General','Behaviour','Health Concern','Social','Sleep','Mood','Skin','Fall / Incident','Other']), true)}
          <div class="field full">
            <label>Mood / Presentation</label>
            <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:2px">
              ${['Happy','Content','Anxious','Confused','Agitated','Distressed','Sleepy','Withdrawn','Tearful','Calm']
                .map((m) => `<label style="display:flex;align-items:center;gap:5px;font-size:12.5px;cursor:pointer">
                  <input type="radio" name="mood-sel" style="accent-color:#5bb8f5" value="${Utils.escapeHtml(m)}"> ${Utils.escapeHtml(m)}
                </label>`).join('')}
            </div>
          </div>
          ${Utils.field('Observation / Note', Utils.ta('Document what you observed, any changes in behaviour, health events, resident comments...'), true)}
          ${Utils.field('Action Taken / Follow-Up Required', Utils.ta('Actions taken or required follow-up...'), true)}
          ${Utils.field('Escalated To', Utils.inp('Manager / GP / Family (if applicable)'))}
          ${Utils.field('Staff Signature', Utils.inp('Your full name'))}
          <div class="btn-row">
            <button class="btn btn-outline" onclick="App.showPage('daily-notes')">Clear</button>
            <button class="btn btn-success" onclick="PageDailyNotes.save()">Save Note</button>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-title"><div class="accent"></div>Today's Notes (${notes.length})</div>
        <div class="record-list" id="notes-list">
          ${_renderList(notes)}
        </div>
      </div>`;
  }

  function save() {
    const form  = document.getElementById('notes-form');
    const vals  = Utils.allVals(form);
    const mood  = form.querySelector('input[name="mood-sel"]:checked');
    const textareas = form.querySelectorAll('textarea');

    const note = textareas[0] ? textareas[0].value.trim() : '';
    if (!note) {
      App.toast('Please enter a note before saving.', 'error');
      return;
    }

    const record = {
      time:     vals[1] || Utils.now(),
      staff:    vals[2] || 'Unknown',
      shift:    vals[3] || 'Morning',
      category: vals[4] || 'General',
      mood:     mood ? mood.value : '—',
      note,
      action:   textareas[1] ? textareas[1].value.trim() : '',
    };

    Store.push(App.getCurrentResident().id, 'notes', record);
    App.toast('✓ Daily note saved');
    App.showPage('daily-notes');
  }

  function deleteRecord(index) {
    Store.remove(App.getCurrentResident().id, 'notes', index);
    App.showPage('daily-notes');
  }

  function _renderList(notes) {
    if (notes.length === 0) {
      return '<div style="color:#94a3b8;font-size:13px;padding:16px 0;text-align:center">No notes recorded yet today.</div>';
    }
    return notes.map((n, i) => `
      <div class="record-item record-item--column">
        <div style="display:flex;justify-content:space-between;width:100%;align-items:center">
          <div class="r-time">${Utils.escapeHtml(n.time)} — ${Utils.escapeHtml(n.shift)} — ${Utils.escapeHtml(n.staff)}</div>
          <div style="display:flex;gap:6px;align-items:center">
            ${Utils.pill(n.category)}
            <button onclick="PageDailyNotes.deleteRecord(${i})" style="border:none;background:none;color:#dc2626;cursor:pointer;font-size:13px" aria-label="Delete note">✕</button>
          </div>
        </div>
        <div style="font-size:12px;color:#374151">${Utils.escapeHtml(n.note)}</div>
        ${n.action ? `<div style="font-size:11px;color:#94a3b8">Action: ${Utils.escapeHtml(n.action)}</div>` : ''}
      </div>`).join('');
  }

  return { render, save, deleteRecord };
})();
