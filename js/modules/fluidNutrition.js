/**
 * js/modules/fluidNutrition.js
 * Fluid & Nutrition records.
 */

'use strict';

const PageFluidNutrition = (() => {

  function render() {
    const r = App.getCurrentResident();

    document.getElementById('content').innerHTML = `
      <div class="card">
        <div class="card-title"><div class="accent"></div>Fluid &amp; Nutrition Record</div>
        <p style="font-size:12px;color:#94a3b8;margin-bottom:12px">
          Diet type for this resident: <strong>${Utils.escapeHtml(r.diet)}</strong>
        </p>
        <div class="grid-2" id="fn-form">
          ${Utils.field('Date',  Utils.inp('', 'date', Utils.TODAY))}
          ${Utils.field('Meal / Time', Utils.sel(['Breakfast (07:00–09:00)','Mid-morning snack','Lunch (12:00–13:30)','Afternoon snack','Dinner (17:00–18:30)','Evening snack','Additional fluid only']))}
          ${Utils.field('Meal Eaten (%)', Utils.sel(['100% — All eaten','75%','50%','25%','Under 10%','Nothing eaten']))}
          ${Utils.field('Fluid Intake (ml)', Utils.inp('e.g. 200', 'number'))}
          ${Utils.field('Food Texture / Consistency (IDDSI)', Utils.sel(['Normal','Soft','Minced & Moist','Pureed','Liquidised']))}
          ${Utils.field('Fluid Consistency (IDDSI)', Utils.sel(['Thin (normal)','Slightly thick','Mildly thick','Moderately thick','Extremely thick']))}
          ${Utils.field('Appetite', Utils.sel(['Good','Fair','Poor','Refused entirely']))}
          ${Utils.field('Assistance Needed', Utils.sel(['Independent','Setup only','Verbal prompting','Partial physical assistance','Full physical assistance']))}
          ${Utils.field('Swallowing Difficulties?', Utils.sel(['No','Yes — coughing','Yes — choking episode','Yes — needs review','Previously assessed by SALT']))}
          ${Utils.field('Weight Recorded (kg)', Utils.inp('If weighed today', 'number'))}
          ${Utils.field('Observations', Utils.ta('Swallowing difficulties, food preferences, concerns, referrals...'), true)}
          <div class="btn-row">
            <button class="btn btn-success" onclick="PageFluidNutrition.save()">Save Record</button>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-title"><div class="accent"></div>Daily Fluid Balance</div>
        <div class="grid-3">
          <div class="stat-card">
            <div class="stat-value">850ml</div>
            <div class="stat-label">Total In (today)</div>
          </div>
          <div class="stat-card">
            <div class="stat-value" style="color:#dc2626">2000ml</div>
            <div class="stat-label">Daily Target</div>
          </div>
          <div class="stat-card">
            <div class="stat-value" style="color:#d97706">1150ml</div>
            <div class="stat-label">Remaining</div>
            <div class="fluid-bar-wrap">
              <div class="fluid-bar" style="width:42.5%"></div>
            </div>
          </div>
        </div>
      </div>`;
  }

  function save() {
    const form = document.getElementById('fn-form');
    const vals = Utils.allVals(form);

    const record = {
      date:       vals[0] || Utils.TODAY,
      meal:       vals[1] || '—',
      eaten:      vals[2] || '—',
      fluid:      vals[3] || '0',
      texture:    vals[4] || '—',
      fluidConst: vals[5] || '—',
      appetite:   vals[6] || '—',
      assistance: vals[7] || '—',
    };

    Store.push(App.getCurrentResident().id, 'fluid', record);
    App.toast('✓ Fluid & nutrition record saved');
    App.showPage('fluid-nutrition');
  }

  return { render, save };
})();
