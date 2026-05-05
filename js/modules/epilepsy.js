/**
 * js/modules/epilepsy.js
 * Epilepsy Monitoring — comprehensive seizure episode records.
 * Includes: seizure type, body side affected, limb movements,
 * head/eye deviation, postictal detail, rescue medication,
 * oxygen saturation, blood glucose, hospital admission and more.
 */

'use strict';

const PageEpilepsy = (() => {

  // ── Observation checklist ──────────────────
  const OBSERVATIONS = [
    'Jerking / convulsive movements',
    'Stiffening of body',
    'Eyes rolling / flickering',
    'Staring / absence (blank)',
    'Lip smacking / chewing movements',
    'Falling to ground',
    'Loss of bladder control',
    'Loss of bowel control',
    'Cyanosis (blue lips / face)',
    'Pallor (very pale)',
    'Flushing (very red)',
    'Foaming at mouth / excessive saliva',
    'Repetitive hand / arm movements',
    'Repetitive leg movements',
    'Whole body shaking',
    'Only one side of body shaking',
    'Head turning to one side',
    'Eyes deviated to one side',
    'Post-seizure confusion (postictal)',
    'Post-seizure aggression / agitation',
    'Post-seizure paralysis (Todd\'s paresis)',
    'Vomiting during or after seizure',
    'Crying out / vocalising',
    'Automatic behaviour (e.g. picking, fumbling)',
    'Sudden muscle jerk (myoclonic)',
    'Drop attack — sudden fall with no warning',
  ];

  // ── Trigger checklist ──────────────────────
  const TRIGGERS = [
    'Missed / late medication',
    'Incorrect medication dose',
    'Illness / infection',
    'Fever / high temperature',
    'Stress / emotional upset',
    'Anxiety',
    'Lack of sleep / fatigue',
    'Alcohol',
    'Flashing / flickering lights',
    'Dehydration',
    'Hormonal changes',
    'Hypoglycaemia (low blood sugar)',
    'Hyperglycaemia (high blood sugar)',
    'Overheating',
    'Constipation',
    'Pain',
    'No identifiable trigger',
    'Unknown',
  ];

  const _obsChecked  = new Set();
  const _trigChecked = new Set();

  // ── Render ─────────────────────────────────
  function render() {
    _obsChecked.clear();
    _trigChecked.clear();

    const r       = App.getCurrentResident();
    const records = Store.get(r.id, 'epilepsy');

    document.getElementById('content').innerHTML = `

      <!-- Alert banner -->
      <div class="card card-alert">
        <div class="seizure-banner">
          ⚡ EPILEPSY MONITORING — Complete immediately after any seizure episode.
          Call 999 if: seizure lasts over 5 minutes / second seizure follows without recovery /
          first ever seizure / injury occurs / resident does not regain consciousness.
        </div>
      </div>

      <!-- SECTION 1: Basic Details -->
      <div class="card">
        <div class="card-title"><div class="accent"></div>1. Seizure Details</div>
        <div class="grid-2" id="epi-form">
          ${Utils.field('Date', Utils.inp('', 'date', Utils.TODAY))}
          ${Utils.field('Time Seizure Started', Utils.inp('', 'time', Utils.now()))}
          ${Utils.field('Time Seizure Ended', Utils.inp('', 'time'))}
          ${Utils.field('Duration (minutes)', Utils.inp('e.g. 2', 'number'))}
          ${Utils.field('Location When Occurred', Utils.sel(['Bedroom','Lounge','Bathroom / Toilet','Dining Room','Garden','Corridor','Activity Room','Off-site','Other']))}
          ${Utils.field('Was Resident Alone?', Utils.sel(['No — staff present throughout','Yes — found post-seizure','Partially observed','Unknown']))}
          ${Utils.field('Is This a First Seizure?', Utils.sel(['No — known epileptic','Yes — first ever seizure','Yes — first of this type','Unknown']))}
          ${Utils.field('Time Staff Arrived (if found post-seizure)', Utils.inp('', 'time'))}
        </div>
      </div>

      <!-- SECTION 2: Seizure Type & Classification -->
      <div class="card">
        <div class="card-title"><div class="accent"></div>2. Seizure Type &amp; Classification</div>
        <div class="grid-2">
          ${Utils.field('Seizure Type', Utils.sel([
            'Tonic-clonic (grand mal) — generalised',
            'Absence — brief staring / blinking',
            'Focal aware (simple partial)',
            'Focal impaired awareness (complex partial)',
            'Myoclonic — sudden muscle jerks',
            'Tonic — stiffening only',
            'Clonic — jerking only',
            'Atonic (drop attack) — sudden loss of tone',
            'Status epilepticus — prolonged / repeated',
            'Febrile seizure',
            'Unknown / unclassified',
          ]))}
          ${Utils.field('Seizure Phase Observed', Utils.sel([
            'Full seizure observed from start to finish',
            'Only beginning observed',
            'Only middle / main phase observed',
            'Only end / postictal phase observed',
            'Found post-seizure — none observed',
          ]))}
          ${Utils.field('Consciousness During Seizure', Utils.sel([
            'Fully unconscious / unresponsive',
            'Partially conscious — some awareness',
            'Conscious throughout',
            'Fluctuating consciousness',
            'Unknown',
          ]))}
          ${Utils.field('Ability to Speak During Seizure', Utils.sel([
            'Unable to speak',
            'Able to speak but confused',
            'Able to speak normally',
            'Vocalising / crying out only',
            'N/A — unconscious',
            'Unknown',
          ]))}
        </div>
      </div>

      <!-- SECTION 3: Body Side & Movement -->
      <div class="card">
        <div class="card-title"><div class="accent"></div>3. Body Side Affected &amp; Movement Detail</div>
        <div class="grid-2">
          ${Utils.field('Which Side of Body Affected?', Utils.sel([
            'Both sides equally (generalised)',
            'Left side only',
            'Right side only',
            'Started one side — spread to both',
            'Started left — spread to right',
            'Started right — spread to left',
            'No clear side affected',
            'Unknown',
          ]))}
          ${Utils.field('Head Turning / Deviation', Utils.sel([
            'No head turning observed',
            'Head turned to the LEFT',
            'Head turned to the RIGHT',
            'Head turned but direction unclear',
            'Head dropped forward',
            'Head thrown backward',
          ]))}
          ${Utils.field('Eye Deviation / Movement', Utils.sel([
            'Eyes deviated to the LEFT',
            'Eyes deviated to the RIGHT',
            'Eyes rolled upward',
            'Eyes rolled downward',
            'Rapid blinking / flickering',
            'Eyes fixed / staring',
            'No abnormal eye movement',
            'Unknown',
          ]))}
          ${Utils.field('Upper Limb (Arm) Movement', Utils.sel([
            'No abnormal arm movement',
            'Both arms jerking',
            'Left arm only jerking',
            'Right arm only jerking',
            'Both arms stiffening / extended',
            'Left arm stiffening',
            'Right arm stiffening',
            'Repetitive arm / hand automatisms',
            'Arms pulled inward / flexed',
          ]))}
          ${Utils.field('Lower Limb (Leg) Movement', Utils.sel([
            'No abnormal leg movement',
            'Both legs jerking',
            'Left leg only jerking',
            'Right leg only jerking',
            'Both legs stiffening / extended',
            'Left leg stiffening',
            'Right leg stiffening',
            'Pedalling / cycling movements',
            'Sudden leg drop / collapse',
          ]))}
          ${Utils.field('Facial Movement', Utils.sel([
            'No abnormal facial movement',
            'Twitching — left side of face',
            'Twitching — right side of face',
            'Twitching — both sides of face',
            'Lip smacking / chewing',
            'Grimacing',
            'Jaw clenching',
            'No facial movement observed',
          ]))}
          ${Utils.field('Body Position at Onset', Utils.sel([
            'Lying in bed',
            'Sitting in chair',
            'Standing',
            'Walking',
            'Unknown / unobserved',
          ]))}
          ${Utils.field('Did Resident Fall?', Utils.sel([
            'No — was already lying / seated',
            'Yes — fell to floor',
            'Yes — fell but was caught by staff',
            'Slumped in chair',
            'Unknown',
          ]))}
        </div>
      </div>

      <!-- SECTION 4: Observations Checklist -->
      <div class="card">
        <div class="card-title"><div class="accent"></div>4. Seizure Observations — Tick All That Apply</div>
        <div class="activity-grid">
          ${OBSERVATIONS.map((obs, i) => `
            <div class="act-check" id="obs-${i}" onclick="PageEpilepsy.toggleObs(${i})">
              <input type="checkbox" id="obsch-${i}" tabindex="-1">
              <label for="obsch-${i}">${Utils.escapeHtml(obs)}</label>
            </div>`).join('')}
        </div>
      </div>

      <!-- SECTION 5: Post-Seizure Assessment -->
      <div class="card">
        <div class="card-title"><div class="accent"></div>5. Post-Seizure (Postictal) Assessment</div>
        <div class="grid-2">
          ${Utils.field('Post-Seizure State', Utils.sel([
            'Sleepy / drowsy — postictal',
            'Deeply asleep — difficult to rouse',
            'Confused / disorientated',
            'Agitated / aggressive',
            'Distressed / tearful',
            'Returned to normal quickly (under 5 min)',
            'Returned to normal slowly (over 30 min)',
            'Semi-conscious',
            'Paralysis / weakness of limb (Todd\'s paresis)',
            'Other',
          ]))}
          ${Utils.field('Recovery Time to Baseline (minutes)', Utils.inp('e.g. 20', 'number'))}
          ${Utils.field('Speech After Seizure', Utils.sel([
            'Normal speech returned',
            'Slurred speech',
            'Unable to speak (aphasia)',
            'Confused speech',
            'Not yet assessed',
          ]))}
          ${Utils.field('Limb Weakness After Seizure?', Utils.sel([
            'No weakness observed',
            'Left arm weakness',
            'Right arm weakness',
            'Left leg weakness',
            'Right leg weakness',
            'Left side weakness (arm and leg)',
            'Right side weakness (arm and leg)',
            'General weakness / fatigue only',
          ]))}
          ${Utils.field('Oxygen Saturation (SpO2) if Monitored', Utils.inp('e.g. 94%'))}
          ${Utils.field('Blood Glucose if Checked', Utils.inp('e.g. 5.4 mmol/L'))}
          ${Utils.field('Blood Pressure if Checked', Utils.inp('e.g. 120/80'))}
          ${Utils.field('Pulse / Heart Rate if Checked', Utils.inp('e.g. 88 bpm'))}
          ${Utils.field('Temperature if Checked', Utils.inp('e.g. 37.2°C'))}
          ${Utils.field('Skin Colour After Seizure', Utils.sel([
            'Normal colour',
            'Pale / pallor',
            'Flushed / red',
            'Cyanosed (blue / grey)',
            'Mottled',
          ]))}
          ${Utils.field('Injuries Sustained', Utils.sel([
            'None observed',
            'Head injury — bump / laceration',
            'Bite injury — tongue',
            'Bite injury — cheek / lip',
            'Limb injury — bruising',
            'Limb injury — laceration',
            'Suspected fracture',
            'Skin abrasion',
            'Multiple injuries — detail below',
          ]))}
          ${Utils.field('Injury Description (if any)', Utils.inp('Describe location, size and nature of any injury'))}
        </div>
      </div>

      <!-- SECTION 6: Recovery Position & Airway -->
      <div class="card">
        <div class="card-title"><div class="accent"></div>6. Airway &amp; Recovery Position</div>
        <div class="grid-2">
          ${Utils.field('Recovery Position Applied?', Utils.sel([
            'Yes — placed in recovery position',
            'No — resident remained conscious / seated',
            'No — contraindicated (spinal concern)',
            'Attempted but resident resistant',
          ]))}
          ${Utils.field('Time Recovery Position Applied', Utils.inp('', 'time'))}
          ${Utils.field('Airway Clear?', Utils.sel([
            'Yes — airway clear throughout',
            'Airway managed — secretions cleared',
            'Airway concern — suction used',
            'Airway concern — recovery position maintained',
            'Airway compromised — 999 called',
          ]))}
          ${Utils.field('Breathing After Seizure', Utils.sel([
            'Normal breathing restored',
            'Noisy / laboured breathing',
            'Shallow breathing',
            'Breathing absent — CPR initiated',
            'Breathing assisted — oxygen given',
          ]))}
          ${Utils.field('Oxygen Given?', Utils.sel([
            'No',
            'Yes — via face mask',
            'Yes — via nasal cannula',
            'Yes — saturation below 90%',
          ]))}
        </div>
      </div>

      <!-- SECTION 7: Rescue Medication -->
      <div class="card">
        <div class="card-title"><div class="accent"></div>7. Rescue Medication</div>
        <div class="grid-2">
          ${Utils.field('Rescue Medication Given?', Utils.sel([
            'No — not required',
            'No — not available',
            'Yes — Midazolam (buccal)',
            'Yes — Diazepam (rectal)',
            'Yes — Lorazepam',
            'Yes — Other (document below)',
          ]))}
          ${Utils.field('Rescue Medication Dose', Utils.inp('e.g. Midazolam 10mg'))}
          ${Utils.field('Time First Dose Given', Utils.inp('', 'time'))}
          ${Utils.field('Given By', Utils.inp('Staff name and designation'))}
          ${Utils.field('Second Rescue Dose Required?', Utils.sel([
            'No',
            'Yes — given after 10 minutes',
            'Yes — given after 15 minutes',
            'Yes — not available',
          ]))}
          ${Utils.field('Time Second Dose Given (if applicable)', Utils.inp('', 'time'))}
          ${Utils.field('Seizure Stopped After Rescue Medication?', Utils.sel([
            'Yes — seizure stopped',
            'Yes — partially effective',
            'No — seizure continued',
            'No rescue medication given',
          ]))}
          ${Utils.field('PRN / Emergency Protocol Followed?', Utils.sel([
            'Yes — full protocol followed',
            'Yes — partially followed',
            'No — first seizure / no protocol in place',
            'No — reason documented below',
          ]))}
        </div>
      </div>

      <!-- SECTION 8: Emergency Services -->
      <div class="card">
        <div class="card-title"><div class="accent"></div>8. Emergency Services &amp; Hospital</div>
        <div class="grid-2">
          ${Utils.field('Emergency Services Called?', Utils.sel([
            'No — not required',
            'Yes — 999 called',
            'Yes — 111 called',
            'Yes — GP called directly',
            'Yes — on-call nurse / doctor called',
          ]))}
          ${Utils.field('Time 999 / 111 Called (if applicable)', Utils.inp('', 'time'))}
          ${Utils.field('Ambulance Arrival Time (if applicable)', Utils.inp('', 'time'))}
          ${Utils.field('Admitted to Hospital?', Utils.sel([
            'No — remained at care home',
            'Yes — admitted to hospital',
            'Taken to A&E — not admitted',
            'Assessed by paramedics — not conveyed',
          ]))}
          ${Utils.field('Hospital Name (if admitted)', Utils.inp('e.g. Royal Victoria Infirmary'))}
          ${Utils.field('Time Left for Hospital (if applicable)', Utils.inp('', 'time'))}
        </div>
      </div>

      <!-- SECTION 9: Triggers -->
      <div class="card">
        <div class="card-title"><div class="accent"></div>9. Potential Triggers — Tick All That Apply</div>
        <div class="activity-grid">
          ${TRIGGERS.map((t, i) => `
            <div class="act-check" id="trig-${i}" onclick="PageEpilepsy.toggleTrig(${i})">
              <input type="checkbox" id="trigch-${i}" tabindex="-1">
              <label for="trigch-${i}">${Utils.escapeHtml(t)}</label>
            </div>`).join('')}
        </div>
        <div class="grid-2" style="margin-top:12px">
          ${Utils.field('Additional Trigger Notes', Utils.ta('Any other possible triggers or contributing factors...'), true)}
        </div>
      </div>

      <!-- SECTION 10: Notifications & Documentation -->
      <div class="card">
        <div class="card-title"><div class="accent"></div>10. Notifications &amp; Full Documentation</div>
        <div class="grid-2">
          ${Utils.field('Full Description of Seizure', Utils.ta('Describe exactly what you observed — before, during and after. Include position, movements, colour changes, duration of each phase...'), true)}
          ${Utils.field('Immediate Actions Taken', Utils.ta('e.g. called for help, timed seizure, placed in recovery position, given rescue medication, called 999, monitored airway...'), true)}
          ${Utils.field('Manager Notified?', Utils.sel(['Yes — notified immediately','Yes — notified after stabilisation','No — not required','No — unable to contact']))}
          ${Utils.field('Time Manager Notified', Utils.inp('', 'time'))}
          ${Utils.field('Family / Next of Kin Notified?', Utils.sel(['Yes — notified immediately','Yes — notified same day','Yes — notified next day','No — not yet notified','No — family request not to be called']))}
          ${Utils.field('Time Family Notified', Utils.inp('', 'time'))}
          ${Utils.field('GP Informed?', Utils.sel(['Yes — informed same day','Yes — informed next working day','No — 999 called instead','No — not required']))}
          ${Utils.field('Seizure Added to Seizure Diary?', Utils.sel(['Yes','No — complete separately']))}
          ${Utils.field('Medication Review Required?', Utils.sel(['No','Yes — GP to review medication','Yes — urgent review required','Already under neurology review']))}
          ${Utils.field('Care Plan Update Required?', Utils.sel(['No','Yes — update seizure care plan','Yes — update risk assessment','Yes — both']))}
          ${Utils.field('Notifications Made / Further Notes', Utils.ta('Who was informed and when — manager, GP, family, ambulance. Any follow-up actions outstanding...'), true)}
        </div>

        <div class="section-divider" style="display:block">Staff Details</div>
        <div class="grid-2">
          ${Utils.field('Report Completed By', Utils.inp('Staff full name'))}
          ${Utils.field('Designation / Role', Utils.inp('e.g. Senior Carer, Registered Nurse'))}
          ${Utils.field('Witnessed By', Utils.inp('Second staff member name (if present)'))}
          ${Utils.field('Witness Designation', Utils.inp('e.g. Support Worker, Nurse'))}
          ${Utils.field('Date Report Completed', Utils.inp('', 'date', Utils.TODAY))}
          ${Utils.field('Time Report Completed', Utils.inp('', 'time', Utils.now()))}
          <div class="btn-row">
            <button class="btn btn-success" onclick="PageEpilepsy.save()">Save Seizure Record</button>
          </div>
        </div>
      </div>

      <!-- Seizure History Log -->
      <div class="card">
        <div class="card-title"><div class="accent"></div>Seizure History Log (${records.length} recorded)</div>
        <div class="record-list">
          ${_renderLog(records)}
        </div>
      </div>`;
  }

  // ── Toggle helpers ─────────────────────────
  function toggleObs(i) {
    _toggle(_obsChecked, 'obs-', 'obsch-', i);
  }

  function toggleTrig(i) {
    _toggle(_trigChecked, 'trig-', 'trigch-', i);
  }

  function _toggle(set, elPrefix, chkPrefix, i) {
    const el  = document.getElementById(elPrefix + i);
    const chk = document.getElementById(chkPrefix + i);
    if (set.has(i)) {
      set.delete(i);
      el.classList.remove('checked');
      chk.checked = false;
    } else {
      set.add(i);
      el.classList.add('checked');
      chk.checked = true;
    }
  }

  // ── Save ───────────────────────────────────
  function save() {
    const form   = document.getElementById('epi-form');
    const vals   = Utils.allVals(form);
    const allSel = document.querySelectorAll('#content .field select');
    const tas    = document.querySelectorAll('#content .field textarea');

    const record = {
      date:          vals[0]          || Utils.TODAY,
      startTime:     vals[1]          || Utils.now(),
      endTime:       vals[2]          || '—',
      duration:      vals[3]          || '—',
      location:      vals[4]          || '—',
      alone:         vals[5]          || '—',
      firstSeizure:  allSel[2]?.value || '—',
      type:          allSel[4]?.value || 'Unknown',
      sideAffected:  allSel[8]?.value || '—',
      headTurning:   allSel[9]?.value || '—',
      eyeDeviation:  allSel[10]?.value || '—',
      armMovement:   allSel[11]?.value || '—',
      legMovement:   allSel[12]?.value || '—',
      facialMovement:allSel[13]?.value || '—',
      injuries:      allSel[22]?.value || 'None observed',
      rescueMed:     allSel[28]?.value || 'No',
      emergency:     allSel[36]?.value || 'No',
      hospitalAdmit: allSel[38]?.value || '—',
      observations:  Array.from(_obsChecked).map((i) => OBSERVATIONS[i]),
      triggers:      Array.from(_trigChecked).map((i) => TRIGGERS[i]),
      description:   tas[0]?.value.trim() || '',
      actions:       tas[1]?.value.trim() || '',
      staff:         document.querySelectorAll('#content .field input')[document.querySelectorAll('#content .field input').length - 4]?.value || '—',
    };

    Store.push(App.getCurrentResident().id, 'epilepsy', record);
    App.toast('✓ Seizure record saved');
    App.showPage('epilepsy');
  }

  // ── Delete ─────────────────────────────────
  function deleteRecord(index) {
    Store.remove(App.getCurrentResident().id, 'epilepsy', index);
    App.showPage('epilepsy');
  }

  // ── History log ────────────────────────────
  function _renderLog(records) {
    if (records.length === 0) {
      return '<div style="color:#94a3b8;font-size:13px;padding:16px 0;text-align:center">No seizure episodes recorded yet.</div>';
    }
    return records.map((e, i) => `
      <div class="record-item record-item--column">
        <div style="display:flex;justify-content:space-between;width:100%;align-items:center">
          <div class="r-time">${Utils.escapeHtml(e.date)} at ${Utils.escapeHtml(e.startTime)} — Duration: ${Utils.escapeHtml(String(e.duration))} min</div>
          <div style="display:flex;gap:6px;align-items:center">
            <span class="pill pill-amber">${Utils.escapeHtml(e.type)}</span>
            <button onclick="PageEpilepsy.deleteRecord(${i})"
              style="border:none;background:none;color:#dc2626;cursor:pointer;font-size:12px"
              aria-label="Delete seizure record">✕</button>
          </div>
        </div>
        <div style="font-size:12px;color:#374151;margin-top:3px">
          <strong>Side affected:</strong> ${Utils.escapeHtml(e.sideAffected || '—')} &nbsp;|&nbsp;
          <strong>Head turning:</strong> ${Utils.escapeHtml(e.headTurning || '—')} &nbsp;|&nbsp;
          <strong>Eyes:</strong> ${Utils.escapeHtml(e.eyeDeviation || '—')}
        </div>
        <div style="font-size:12px;color:#374151">${Utils.escapeHtml(e.description || 'No description recorded.')}</div>
        <div style="font-size:11px;color:#94a3b8;margin-top:3px">
          Rescue med: ${Utils.escapeHtml(e.rescueMed)} &nbsp;|&nbsp;
          Injuries: ${Utils.escapeHtml(e.injuries)} &nbsp;|&nbsp;
          Hospital: ${Utils.escapeHtml(e.hospitalAdmit || '—')} &nbsp;|&nbsp;
          Staff: ${Utils.escapeHtml(e.staff)}
        </div>
      </div>`).join('');
  }

  return { render, toggleObs, toggleTrig, save, deleteRecord };
})();