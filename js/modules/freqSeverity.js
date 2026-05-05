/**
 * js/modules/freqSeverity.js
 * Frequency & Severity monitoring — full behaviour detail per incident.
 */

'use strict';

const PageFreqSeverity = (() => {

  // ── All possible behaviour categories ─────
  const BEHAVIOUR_CATEGORIES = {
    'Aggression & Violence': [
      'Verbal aggression — shouting / swearing',
      'Verbal aggression — threats',
      'Physical aggression — hitting / punching',
      'Physical aggression — kicking',
      'Physical aggression — biting',
      'Physical aggression — scratching',
      'Physical aggression — spitting',
      'Physical aggression — throwing objects',
      'Physical aggression — hair pulling',
      'Sexual aggression / inappropriate behaviour',
    ],
    'Self-Harm & Risk': [
      'Self-harm — hitting self',
      'Self-harm — scratching self',
      'Self-harm — head banging',
      'Suicidal ideation / statements',
      'Attempted self-harm',
      'Falls — unassisted',
      'Falls — near miss',
      'Risk-taking behaviour',
    ],
    'Wandering & Elopement': [
      'Wandering — within building',
      'Wandering — attempted elopement',
      'Elopement — left building unsafely',
      'Entering other residents\' rooms',
      'Persistent door / exit checking',
    ],
    'Resistive Behaviour': [
      'Resistive to personal care',
      'Resistive to medication',
      'Resistive to moving / repositioning',
      'Refusing food / fluids',
      'Refusing to engage with staff',
      'Refusing medical treatment',
      'Spitting out medication',
    ],
    'Mood & Emotional': [
      'Anxiety — mild',
      'Anxiety — severe / panic',
      'Low mood / tearfulness',
      'Emotional outbursts / crying',
      'Irritability / frustration',
      'Apathy / withdrawal',
      'Euphoria / elevated mood',
      'Emotional lability (rapid mood changes)',
      'Grief / bereavement reaction',
    ],
    'Cognitive & Perceptual': [
      'Confusion / disorientation',
      'Delusions — paranoid',
      'Delusions — other',
      'Visual hallucinations',
      'Auditory hallucinations',
      'Sundowning behaviour',
      'Memory-related distress',
      'Misidentification of people / places',
    ],
    'Sleep & Night-time': [
      'Night-time disturbance — waking',
      'Night-time disturbance — calling out',
      'Night-time wandering',
      'Day / night reversal',
      'Excessive daytime sleeping',
      'Nightmares / night terrors',
    ],
    'Repetitive Behaviour': [
      'Repetitive questioning',
      'Repetitive movements / rocking',
      'Repetitive vocalisation / calling out',
      'Repetitive actions (e.g. picking, tapping)',
      'Hoarding behaviour',
      'Shadowing staff',
    ],
    'Medical / Physical': [
      'Seizure activity',
      'Breathlessness / respiratory distress',
      'Pain-related behaviour',
      'Incontinence — refusal of care',
      'Disinhibition — undressing',
      'Disinhibition — sexual behaviour',
      'Pica — eating non-food items',
      'Excessive noise / screaming',
    ],
  };

  // Flatten for indexed access
  const ALL_BEHAVIOURS = Object.entries(BEHAVIOUR_CATEGORIES).flatMap(([cat, items]) =>
    items.map(name => ({ cat, name }))
  );

  // Track scale selections per behaviour index
  const _freq = {};
  const _sev  = {};

  // Track which behaviours are active (checked)
  const _active = new Set();

  // ── Render ─────────────────────────────────
  function render() {
    Object.keys(_freq).forEach(k => delete _freq[k]);
    Object.keys(_sev).forEach(k => delete _sev[k]);
    _active.clear();

    const r       = App.getCurrentResident();
    const records = Store.get(r.id, 'freqSev');

    let behaviourHTML = '';
    let globalIdx = 0;

    Object.entries(BEHAVIOUR_CATEGORIES).forEach(([category, behaviours]) => {
      behaviourHTML += `
        <div style="margin-bottom:6px">
          <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;
            color:#5bb8f5;padding:12px 0 8px;border-bottom:2px solid #e2e8f0;margin-bottom:8px">
            ${Utils.escapeHtml(category)}
          </div>
          ${behaviours.map((b) => {
            const i = globalIdx++;
            return `
              <div class="fs-behaviour-row" id="fsrow-${i}">
                <div class="fs-behaviour-header" onclick="PageFreqSeverity.toggleBehaviour(${i})">
                  <div style="display:flex;align-items:center;gap:10px">
                    <div class="fs-check" id="fschk-${i}">✓</div>
                    <div style="font-size:13px;font-weight:500;color:#1a2332">${Utils.escapeHtml(b)}</div>
                  </div>
                  <div style="font-size:11px;color:#94a3b8">tap to record</div>
                </div>
                <div class="fs-detail" id="fsdetail-${i}" style="display:none">
                  <div class="fs-scales">
                    <div class="fs-scale-block">
                      <div class="fs-scale-label">Frequency (occurrences)</div>
                      <div class="scale-opts">
                        ${['0','1','2–3','4–5','6–10','10+'].map((f, j) =>
                          `<button class="sbtn" id="fb-${i}-${j}" onclick="PageFreqSeverity.pickFreq(${i},${j},'${f}')">${f}</button>`
                        ).join('')}
                      </div>
                    </div>
                    <div class="fs-scale-block">
                      <div class="fs-scale-label">Severity</div>
                      <div class="scale-opts" style="flex-wrap:wrap;gap:4px">
                        ${[
                          {v:1,l:'1 — Mild'},
                          {v:2,l:'2 — Low'},
                          {v:3,l:'3 — Moderate'},
                          {v:4,l:'4 — High'},
                          {v:5,l:'5 — Severe'},
                        ].map(s =>
                          `<button class="sbtn fs-sev-btn" id="sb-${i}-${s.v}" onclick="PageFreqSeverity.pickSev(${i},${s.v})">${s.l}</button>`
                        ).join('')}
                      </div>
                    </div>
                  </div>
                  <div style="margin-top:10px">
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:8px">
                      ${Utils.field('Time of Day Most Frequent', Utils.sel(['Not specified','Morning (06:00–12:00)','Afternoon (12:00–17:00)','Evening (17:00–21:00)','Night (21:00–06:00)','Throughout the day','Variable / unpredictable']))}
                      ${Utils.field('Duration of Episode', Utils.sel(['Seconds (under 1 min)','Brief (1–5 minutes)','Moderate (5–15 minutes)','Prolonged (15–30 minutes)','Extended (over 30 minutes)','Continuous throughout shift']))}
                      ${Utils.field('Apparent Trigger / Antecedent', Utils.sel(['No clear trigger','Personal care','Medication time','Mealtimes','Visitors','Noise / environment','Confusion / disorientation','Pain / discomfort','Frustration / communication','Other resident interaction','Unknown']))}
                      ${Utils.field('Intervention Used', Utils.sel(['No intervention needed','Verbal reassurance','Redirection / distraction','Environmental change','One-to-one support','PRN medication given','Physical intervention (documented)','Called for assistance','Removed from situation','Other']))}
                    </div>
                    ${Utils.field('Specific Notes for This Behaviour', Utils.ta('Describe what happened, context, any patterns, what helped or did not help...'))}
                  </div>
                </div>
              </div>`;
          }).join('')}
        </div>`;
    });

    document.getElementById('content').innerHTML = `

      <div class="card">
        <div class="card-title"><div class="accent"></div>Frequency &amp; Severity Monitoring</div>
        <div class="grid-2">
          ${Utils.field('Date',          Utils.inp('', 'date', Utils.TODAY))}
          ${Utils.field('Review Period', Utils.sel(['Daily','Weekly','Monthly']))}
          ${Utils.field('Completed By',  Utils.inp('Staff name'))}
          ${Utils.field('Reviewed By',   Utils.inp('Manager / nurse name'))}
        </div>
        <div style="background:#f0f9ff;border:1px solid #bfdbfe;border-radius:8px;padding:10px 14px;margin:12px 0;font-size:12px;color:#1e40af">
          <strong>How to use:</strong> Tap any behaviour to expand it and record frequency, severity, time of day, trigger and notes.
          Only behaviours you tap will be included in the saved record.
          Severity: 1 = Mild &nbsp;→&nbsp; 5 = Severe.
        </div>
      </div>

      <div class="card">
        <div class="card-title"><div class="accent"></div>Behaviour Record</div>
        <style>
          .fs-behaviour-row { border-bottom: 1px solid #f1f5f9; }
          .fs-behaviour-row:last-child { border-bottom: none; }
          .fs-behaviour-header { display:flex;justify-content:space-between;align-items:center;padding:10px 4px;cursor:pointer;user-select:none; }
          .fs-behaviour-header:hover { background:#f8fafc; border-radius:6px; }
          .fs-check { width:22px;height:22px;border-radius:50%;border:2px solid #dde3ec;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:transparent;background:#fff;flex-shrink:0;transition:all 0.15s; }
          .fs-check.active { background:#059669;border-color:#059669;color:#fff; }
          .fs-detail { background:#f8fafc;border-radius:8px;padding:12px;margin-bottom:8px; }
          .fs-scales { display:flex;flex-direction:column;gap:12px; }
          .fs-scale-block { display:flex;flex-direction:column;gap:6px; }
          .fs-scale-label { font-size:11px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.5px; }
          .fs-sev-btn { width:auto;padding:0 10px;font-size:11px; }
        </style>
        ${behaviourHTML}
      </div>

      <div class="card">
        <div class="card-title"><div class="accent"></div>Overall Summary</div>
        <div class="grid-2">
          ${Utils.field('Overall Description of Behaviours Observed', Utils.ta('Summarise patterns, context, times, any changes from previous review period...'), true)}
          ${Utils.field('Interventions & Strategies Used Overall', Utils.ta('What worked, what did not work, any new approaches tried...'), true)}
          ${Utils.field('Escalation / Referral Needed', Utils.sel(['No','GP review','Psychiatry / CMHT referral','Behaviour support team','Occupational therapy','Safeguarding referral','Family meeting','Other']))}
          ${Utils.field('Risk Level This Period', Utils.sel(['Low — manageable with current support','Medium — increased monitoring needed','High — urgent review required','Critical — immediate action taken']))}
          ${Utils.field('Overall Trend Since Last Review', Utils.sel(['Stable — no change','Improving — behaviours reducing','Deteriorating — behaviours increasing','Fluctuating — variable pattern','First assessment — no comparison available']))}
          ${Utils.field('Care Plan Update Required?', Utils.sel(['No','Yes — behaviour support plan','Yes — risk assessment','Yes — both']))}
          <div class="btn-row">
            <button class="btn btn-success" onclick="PageFreqSeverity.save()">Save Record</button>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-title"><div class="accent"></div>Previous Records (${records.length})</div>
        <div class="record-list">
          ${_renderLog(records)}
        </div>
      </div>`;
  }

  // ── Toggle behaviour open/closed ──────────
  function toggleBehaviour(i) {
    const detail = document.getElementById('fsdetail-' + i);
    const chk    = document.getElementById('fschk-' + i);
    const isOpen = detail.style.display !== 'none';

    if (isOpen) {
      detail.style.display = 'none';
      chk.classList.remove('active');
      _active.delete(i);
    } else {
      detail.style.display = 'block';
      chk.classList.add('active');
      _active.add(i);
    }
  }

  // ── Scale pickers ─────────────────────────
  function pickFreq(beh, idx, val) {
    for (let j = 0; j < 6; j++) {
      const el = document.getElementById(`fb-${beh}-${j}`);
      if (el) el.className = 'sbtn';
    }
    const btn = document.getElementById(`fb-${beh}-${idx}`);
    if (btn) btn.classList.add(['s1','s1','s2','s3','s4','s5'][idx] || 's5');
    _freq[beh] = val;
  }

  function pickSev(beh, sev) {
    for (let s = 1; s <= 5; s++) {
      const el = document.getElementById(`sb-${beh}-${s}`);
      if (el) el.className = 'sbtn fs-sev-btn';
    }
    const btn = document.getElementById(`sb-${beh}-${sev}`);
    if (btn) btn.classList.add(`s${sev}`);
    _sev[beh] = sev;
  }

  // ── Save ───────────────────────────────────
  function save() {
    const behaviours = Array.from(_active).map((i) => ({
      name:     ALL_BEHAVIOURS[i]?.name || '—',
      category: ALL_BEHAVIOURS[i]?.cat  || '—',
      freq:     _freq[i] || '0',
      sev:      _sev[i]  || '—',
    }));

    Store.push(App.getCurrentResident().id, 'freqSev', {
      date:       Utils.TODAY,
      behaviours,
      count:      behaviours.length,
    });

    App.toast('✓ Frequency & Severity record saved');
    App.showPage('freq-severity');
  }

  // ── Log ────────────────────────────────────
  function _renderLog(records) {
    if (!records.length) {
      return '<div style="color:#94a3b8;font-size:13px;padding:16px 0;text-align:center">No records yet.</div>';
    }
    return records.map((rec, i) => `
      <div class="record-item record-item--column">
        <div style="display:flex;justify-content:space-between;width:100%;align-items:center">
          <div class="r-time">${Utils.escapeHtml(rec.date)}</div>
          <span class="pill pill-amber">${rec.count || 0} behaviour${(rec.count || 0) !== 1 ? 's' : ''} recorded</span>
        </div>
        ${(rec.behaviours || []).slice(0, 3).map(b =>
          `<div style="font-size:12px;color:#374151">
            <strong>${Utils.escapeHtml(b.name)}</strong> —
            Freq: ${Utils.escapeHtml(String(b.freq))} &nbsp;|&nbsp;
            Severity: ${Utils.escapeHtml(String(b.sev))}
          </div>`
        ).join('')}
        ${(rec.behaviours || []).length > 3 ? `<div style="font-size:11px;color:#94a3b8">+ ${rec.behaviours.length - 3} more behaviours recorded</div>` : ''}
      </div>`).join('');
  }

  return { render, toggleBehaviour, pickFreq, pickSev, save };
})();
