/**
 * js/modules/personalCare.js
 * Personal Care Records including nail care detail.
 */

'use strict';

const PagePersonalCare = (() => {

  const CARE_ITEMS = [
    { name: 'Shower / Bath',          sub: 'Full body wash' },
    { name: 'Bed Bath',               sub: 'When shower not possible' },
    { name: 'Oral Hygiene',           sub: 'Teeth / denture cleaning' },
    { name: 'Hair Wash',              sub: '' },
    { name: 'Hair Combing / Styling', sub: '' },
    { name: 'Shaving',                sub: 'Face / legs as appropriate' },
    { name: 'Fingernail Cutting',     sub: 'Check for ingrown / infection' },
    { name: 'Toenail Cutting',        sub: 'Refer to podiatry if thickened' },
    { name: 'Eye Care',               sub: 'Cleaning / prescribed drops' },
    { name: 'Ear Care',               sub: 'External cleaning only' },
    { name: 'Skin Moisturising',      sub: 'Body lotion / emollient' },
    { name: 'Pressure Area Care',     sub: 'Cream / repositioning' },
    { name: 'Dressing / Undressing',  sub: '' },
    { name: 'Continence Care',        sub: 'Pad change / skin checks' },
    { name: 'Catheter Care',          sub: 'If applicable' },
    { name: 'Stoma Care',             sub: 'If applicable' },
  ];

  function render() {
    document.getElementById('content').innerHTML = `
      <div class="card">
        <div class="card-title"><div class="accent"></div>Personal Care Record</div>
        <div class="grid-2" id="pc-form">
          ${Utils.field('Date',  Utils.inp('', 'date', Utils.TODAY))}
          ${Utils.field('Time',  Utils.inp('', 'time', Utils.now()))}
          ${Utils.field('Shift', Utils.sel(['Morning','Afternoon','Evening','Night']))}
          ${Utils.field('Staff Name', Utils.inp('Your full name'))}
        </div>

        <div class="section-divider" style="display:block">Care Provided — toggle each item completed</div>
        ${CARE_ITEMS.map((item, i) => `
          <div class="care-row">
            <div>
              <div class="care-name">${Utils.escapeHtml(item.name)}</div>
              ${item.sub ? `<div class="care-sub">${Utils.escapeHtml(item.sub)}</div>` : ''}
            </div>
            <label class="toggle">
              <input type="checkbox" id="ci-${i}">
              <div class="toggle-track"></div>
            </label>
          </div>`).join('')}

        <div class="section-divider" style="display:block;margin-top:12px">Additional Details</div>
        <div class="grid-2">
          ${Utils.field('Skin Integrity — Any Concerns?', Utils.ta('Redness, sores, bruising, rashes, wounds...'), true)}
          ${Utils.field('Resident Co-operation', Utils.sel(['Fully co-operative','Partially co-operative','Refused (documented separately)','Unable to assess']))}
          ${Utils.field('Assistance Level', Utils.sel(['Full assistance','Prompting / verbal cues only','Standby support','Independent']))}
        </div>

        <div class="section-divider" style="display:block;margin-top:8px">Fingernail / Toenail Detail</div>
        <div class="grid-2">
          <div class="field">
            <label>Nails Cut</label>
            <div style="display:flex;flex-wrap:wrap;gap:12px;margin-top:4px">
              ${['Fingernails','Toenails','Both','N/A today'].map((v) => `
                <label style="display:flex;align-items:center;gap:5px;font-size:12.5px;cursor:pointer">
                  <input type="radio" name="nails" value="${Utils.escapeHtml(v)}" style="accent-color:#5bb8f5">
                  ${Utils.escapeHtml(v)}
                </label>`).join('')}
            </div>
          </div>
          ${Utils.field('Nail Condition', Utils.sel(['Normal','Thickened','Brittle','Ingrown','Fungal signs','Dirty / unkempt']))}
          ${Utils.field('Referral Needed', Utils.sel(['No','Podiatry referral required','GP referral required']))}
          ${Utils.field('Next Nail Check Due', Utils.inp('', 'date'))}
        </div>

        <div class="grid-2" style="margin-top:8px">
          ${Utils.field('Additional Notes', Utils.ta('Follow-up, referrals, concerns...'), true)}
          <div class="btn-row">
            <button class="btn btn-success" onclick="PagePersonalCare.save()">Save Record</button>
          </div>
        </div>
      </div>`;
  }

  function save() {
    const completed = CARE_ITEMS
      .filter((_, i) => document.getElementById(`ci-${i}`)?.checked)
      .map((item) => item.name);

    const record = {
      date:      Utils.TODAY,
      time:      Utils.now(),
      completed,
    };

    Store.push(App.getCurrentResident().id, 'personalCare', record);
    App.toast('✓ Personal care record saved');
    App.showPage('personal-care');
  }

  return { render, save };
})();
