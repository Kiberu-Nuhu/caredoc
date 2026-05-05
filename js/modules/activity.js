/**
 * js/modules/activity.js
 * Activity & Engagement records.
 */

'use strict';

const PageActivity = (() => {

  const ACTIVITIES = [
    'Music / Singing','Arts & Crafts','Reading Aloud','Puzzles / Games',
    'Exercise / Movement','Gardening','Baking / Cooking','Film / TV Watching',
    'One-to-One Chat','Group Social','Religious / Spiritual','Reminiscence',
    'Pet Therapy','Visitor Engagement','Outdoor Walk','Sensory Activity',
  ];

  const _checked = new Set();

  function render() {
    _checked.clear();

    document.getElementById('content').innerHTML = `
      <div class="card">
        <div class="card-title"><div class="accent"></div>Activity &amp; Engagement Record</div>
        <div class="grid-2">
          ${Utils.field('Date',     Utils.inp('', 'date', Utils.TODAY))}
          ${Utils.field('Time',     Utils.inp('', 'time', Utils.now()))}
          ${Utils.field('Session Type', Utils.sel(['Group','One-to-one','Independent']))}
          ${Utils.field('Duration (minutes)', Utils.inp('e.g. 45', 'number'))}
          ${Utils.field('Location', Utils.sel(['Main Lounge','Bedroom','Garden','Dining Room','Activity Room','Chapel','Off-site']))}
          ${Utils.field('Led By',   Utils.inp('Staff name or external provider'))}
        </div>

        <div class="section-divider" style="display:block">Activities Undertaken — tick all that apply</div>
        <div class="activity-grid" id="act-grid">
          ${ACTIVITIES.map((a, i) => `
            <div class="act-check" id="actc-${i}" onclick="PageActivity.toggle(${i})">
              <input type="checkbox" id="ach-${i}" tabindex="-1">
              <label for="ach-${i}">${Utils.escapeHtml(a)}</label>
            </div>`).join('')}
        </div>

        <div class="section-divider" style="display:block;margin-top:12px">Engagement &amp; Response</div>
        <div class="grid-2">
          ${Utils.field('Level of Engagement', Utils.sel(['Fully engaged','Partially engaged','Observed only','Declined','Unable to participate']))}
          ${Utils.field('Mood Before', Utils.sel(['Happy','Neutral','Anxious','Distressed','Sleepy','Withdrawn']))}
          ${Utils.field('Mood After',  Utils.sel(['Happy','Neutral','Anxious','Distressed','Sleepy','Withdrawn']))}
          ${Utils.field('Enjoyed Activity?', Utils.sel(['Yes — very much','Yes — somewhat','Neutral','No','Unable to assess']))}
          ${Utils.field('Observations / Notes', Utils.ta('How did the resident respond? Notable moments, preferences, concerns...'), true)}
          <div class="btn-row">
            <button class="btn btn-success" onclick="PageActivity.save()">Save Record</button>
          </div>
        </div>
      </div>`;
  }

  function toggle(index) {
    const el  = document.getElementById('actc-' + index);
    const chk = document.getElementById('ach-'  + index);
    if (_checked.has(index)) {
      _checked.delete(index);
      el.classList.remove('checked');
      chk.checked = false;
    } else {
      _checked.add(index);
      el.classList.add('checked');
      chk.checked = true;
    }
  }

  function save() {
    const selectedActivities = Array.from(_checked).map((i) => ACTIVITIES[i]);
    const r = App.getCurrentResident();

    const record = {
      time:       Utils.now(),
      activities: selectedActivities,
      date:       Utils.TODAY,
    };

    Store.push(r.id, 'activity', record);
    App.toast('✓ Activity record saved');
    App.showPage('activity');
  }

  return { render, toggle, save };
})();
