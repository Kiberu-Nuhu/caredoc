/**
 * js/modules/appointments.js
 * Appointment Records — GP, hospital, specialist, community visits.
 */

'use strict';

const PageAppointments = (() => {

  function render() {
    const r       = App.getCurrentResident();
    const records = Store.get(r.id, 'appointments');

    document.getElementById('content').innerHTML = `

      <div class="card">
        <div class="card-title"><div class="accent"></div>New Appointment Record</div>
        <div class="grid-2" id="appt-form">
          ${Utils.field('Date of Appointment', Utils.inp('', 'date', Utils.TODAY))}
          ${Utils.field('Time of Appointment', Utils.inp('', 'time'))}
          ${Utils.field('Appointment Type', Utils.sel([
            'GP — routine review',
            'GP — urgent / same day',
            'GP — telephone consultation',
            'GP — home visit',
            'Hospital — outpatient',
            'Hospital — A&E attendance',
            'Hospital — inpatient admission',
            'Hospital — day procedure',
            'Hospital — discharge follow-up',
            'Dentist — routine',
            'Dentist — urgent',
            'Optician / eye test',
            'Podiatry / chiropody',
            'Physiotherapy',
            'Occupational therapy',
            'Speech & Language Therapy (SALT)',
            'Dietitian',
            'Psychiatry',
            'Community Mental Health Team (CMHT)',
            'Community Nurse visit',
            'District Nurse visit',
            'Specialist nurse visit',
            'Neurology',
            'Cardiology',
            'Respiratory',
            'Orthopaedics',
            'Urology',
            'Gastroenterology',
            'Rheumatology',
            'Dermatology',
            'Endocrinology / Diabetes clinic',
            'Palliative care / Hospice',
            'Social worker visit',
            'Advocacy visit',
            'Other — specify in notes',
          ]))}
          ${Utils.field('Clinician / Professional Name', Utils.inp('e.g. Dr Smith, Nurse Jones'))}
          ${Utils.field('Location', Utils.sel([
            'At care home — room visit',
            'At care home — GP surgery annex',
            'GP surgery',
            'Hospital — outpatient department',
            'Hospital — A&E',
            'Hospital — ward',
            'Community clinic',
            'Dentist practice',
            'Optician',
            'Video / telephone call',
            'Other',
          ]))}
          ${Utils.field('Hospital / Clinic Name (if applicable)', Utils.inp('e.g. Royal Victoria Infirmary'))}
          ${Utils.field('Department / Specialty (if applicable)', Utils.inp('e.g. Cardiology, Ward 7'))}
          ${Utils.field('Referral Source', Utils.sel([
            'GP referral',
            'Hospital self-referral',
            'Care home initiated',
            'Family request',
            'Routine / scheduled review',
            'Follow-up from previous appointment',
            'Emergency / urgent referral',
            'Other',
          ]))}
        </div>

        <div class="section-divider" style="display:block">Transport &amp; Escort</div>
        <div class="grid-2">
          ${Utils.field('Transport Used', Utils.sel([
            'Care home vehicle',
            'Family / next of kin transport',
            'Ambulance — non-emergency',
            'Ambulance — emergency (999)',
            'Taxi',
            'Community transport',
            'Public transport',
            'At care home — no transport needed',
            'Other',
          ]))}
          ${Utils.field('Escorted By', Utils.inp('Staff name(s) or family member who accompanied'))}
          ${Utils.field('Time Left Care Home', Utils.inp('', 'time'))}
          ${Utils.field('Time Returned to Care Home', Utils.inp('', 'time'))}
          ${Utils.field('Resident Consent Given?', Utils.sel([
            'Yes — verbal consent',
            'Yes — written consent',
            'Lacks capacity — best interest decision',
            'Family / legal guardian consented',
            'Emergency — consent not applicable',
          ]))}
          ${Utils.field('Mental Capacity Assessment Needed?', Utils.sel(['No','Yes — completed','Yes — required']))}
        </div>

        <div class="section-divider" style="display:block">Appointment Outcome</div>
        <div class="grid-2">
          ${Utils.field('Appointment Status', Utils.sel([
            'Attended — completed',
            'Attended — partial (left early)',
            'Did not attend — refused',
            'Did not attend — unwell',
            'Did not attend — transport issue',
            'Cancelled by clinic',
            'Rescheduled',
            'Telephone / video — completed',
            'Ongoing — admitted to hospital',
          ]))}
          ${Utils.field('Resident Cooperation', Utils.sel([
            'Fully cooperative',
            'Anxious but cooperative',
            'Partially cooperative',
            'Refused parts of assessment',
            'Refused attendance entirely',
            'Unable to assess',
          ]))}
          ${Utils.field('Diagnosis / Findings', Utils.ta('What was found / assessed / diagnosed...'))}
          ${Utils.field('Treatment Given at Appointment', Utils.ta('Procedures, injections, dressings, tests carried out...'))}
          ${Utils.field('Medication Changes', Utils.sel([
            'No medication changes',
            'New medication prescribed',
            'Medication dose changed',
            'Medication stopped',
            'Multiple medication changes',
          ]))}
          ${Utils.field('New Medication Details (if applicable)', Utils.inp('Drug name, dose, frequency, duration'))}
          ${Utils.field('Investigations Ordered', Utils.ta('Blood tests, scans, X-rays, ECG, urine tests ordered...'))}
          ${Utils.field('Referrals Made', Utils.ta('Any onward referrals made at this appointment...'))}
          ${Utils.field('Follow-Up Appointment Required?', Utils.sel([
            'No follow-up needed',
            'Yes — date given (see below)',
            'Yes — to be arranged by clinic',
            'Yes — to be arranged by GP',
            'Yes — to be arranged by care home',
            'Discharge from service',
          ]))}
          ${Utils.field('Follow-Up Date (if known)', Utils.inp('', 'date'))}
          ${Utils.field('Follow-Up Location / Department', Utils.inp('e.g. Cardiology outpatients, GP surgery'))}
        </div>

        <div class="section-divider" style="display:block">Actions &amp; Notifications</div>
        <div class="grid-2">
          ${Utils.field('Actions Required by Care Home', Utils.ta('Medication to collect, referrals to chase, care plan updates, monitoring required...'))}
          ${Utils.field('Family / Next of Kin Informed?', Utils.sel([
            'Yes — informed same day',
            'Yes — informed within 24 hours',
            'No — not required',
            'No — unable to contact',
            'Family attended appointment',
          ]))}
          ${Utils.field('GP Informed of Outcome?', Utils.sel([
            'Yes — GP received clinic letter',
            'Yes — care home informed GP',
            'No — clinic to inform GP directly',
            'No — GP was the clinician',
            'Pending',
          ]))}
          ${Utils.field('Care Plan Update Required?', Utils.sel([
            'No',
            'Yes — medical care plan',
            'Yes — risk assessment',
            'Yes — medication plan',
            'Yes — multiple updates needed',
          ]))}
          ${Utils.field('Full Appointment Notes', Utils.ta('Complete record of the appointment — what was discussed, examined, decided and planned...'), true)}
          ${Utils.field('Record Completed By', Utils.inp('Staff full name'))}
          ${Utils.field('Designation / Role', Utils.inp('e.g. Senior Carer, Nurse'))}
          ${Utils.field('Date Record Completed', Utils.inp('', 'date', Utils.TODAY))}
          <div class="btn-row">
            <button class="btn btn-success" onclick="PageAppointments.save()">Save Appointment Record</button>
          </div>
        </div>
      </div>

      <!-- Appointment History -->
      <div class="card">
        <div class="card-title"><div class="accent"></div>Appointment History (${records.length} records)</div>
        <div style="overflow-x:auto">
          <table class="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Clinician</th>
                <th>Location</th>
                <th>Status</th>
                <th>Follow-Up</th>
                <th></th>
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
    const form = document.getElementById('appt-form');
    const vals = Utils.allVals(document.getElementById('content'));
    const tas  = document.querySelectorAll('#content .field textarea');
    const sels = document.querySelectorAll('#content .field select');

    const record = {
      date:       vals[0] || Utils.TODAY,
      time:       vals[1] || '—',
      type:       sels[0]?.value || '—',
      clinician:  vals[3] || '—',
      location:   sels[1]?.value || '—',
      hospital:   vals[5] || '—',
      status:     sels[7]?.value || '—',
      medChanges: sels[8]?.value || 'No medication changes',
      followUp:   sels[9]?.value || 'No follow-up needed',
      followDate: vals[vals.length - 5] || '—',
      notes:      tas[tas.length - 3]?.value.trim() || '',
      staff:      vals[vals.length - 3] || '—',
    };

    Store.push(App.getCurrentResident().id, 'appointments', record);
    App.toast('✓ Appointment record saved');
    App.showPage('appointments');
  }

  function deleteRecord(i) {
    Store.remove(App.getCurrentResident().id, 'appointments', i);
    App.showPage('appointments');
  }

  function _renderTable(records) {
    if (!records.length) {
      return `<tr><td colspan="7" style="text-align:center;color:#94a3b8;padding:20px">No appointment records yet.</td></tr>`;
    }
    return records.map((rec, i) => `
      <tr>
        <td><strong>${Utils.escapeHtml(rec.date)}</strong><br><span style="font-size:11px;color:#94a3b8">${Utils.escapeHtml(rec.time)}</span></td>
        <td style="font-size:11px">${Utils.escapeHtml(rec.type)}</td>
        <td>${Utils.escapeHtml(rec.clinician)}</td>
        <td style="font-size:11px">${Utils.escapeHtml(rec.location)}</td>
        <td>${Utils.pill(rec.status)}</td>
        <td style="font-size:11px;color:${rec.followDate && rec.followDate !== '—' ? '#059669' : '#94a3b8'}">
          ${Utils.escapeHtml(rec.followDate && rec.followDate !== '—' ? rec.followDate : rec.followUp)}
        </td>
        <td>
          <button onclick="PageAppointments.deleteRecord(${i})"
            style="border:none;background:none;color:#dc2626;cursor:pointer;font-size:12px"
            aria-label="Delete record">✕</button>
        </td>
      </tr>`).join('');
  }

  return { render, save, deleteRecord };
})();
