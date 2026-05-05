/**
 * js/app.js
 * Central application controller.
 * Handles: initialisation, resident switching, page routing, toast notifications.
 * Loaded LAST so all modules are already defined.
 */

'use strict';

const App = (() => {

  // ── State ──────────────────────────────────
  let _currentResident = null;
  let _currentPage     = 'dashboard';
  let _toastTimer      = null;

  // ── Page registry ──────────────────────────
  // Maps page keys to their render functions defined in each module file.
  const PAGE_TITLES = {
    'dashboard':      'Dashboard',
    'daily-notes':    'Daily Notes',
    'continence':     'Continence Monitoring',
    'activity':       'Activity & Engagement',
    'night-report':   'Night Report',
    'personal-care':  'Personal Care',
    'freq-severity':  'Frequency & Severity',
    'medication':     'Medication Administration',
    'fluid-nutrition':'Fluid & Nutrition',
    'epilepsy':       'Epilepsy Monitoring',
    'residents':      'All Residents',
  };

  const PAGE_RENDERERS = {
    'dashboard':      () => PageDashboard.render(),
    'daily-notes':    () => PageDailyNotes.render(),
    'continence':     () => PageContinence.render(),
    'activity':       () => PageActivity.render(),
    'night-report':   () => PageNightReport.render(),
    'personal-care':  () => PagePersonalCare.render(),
    'freq-severity':  () => PageFreqSeverity.render(),
    'medication':     () => PageMedication.render(),
    'fluid-nutrition':() => PageFluidNutrition.render(),
    'epilepsy':       () => PageEpilepsy.render(),
    'residents':      () => PageResidents.render(),
    'appointments':   () => PageAppointments.render(),
  };

  // ── Init ───────────────────────────────────
  function init() {
    Store.init();
    _populateResidentDropdown();

    document.getElementById('tb-date').textContent = new Date().toLocaleDateString('en-GB', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });

    switchResident(RESIDENTS[0].id);
  }

  // ── Resident switching ─────────────────────
  function switchResident(id) {
    const resident = RESIDENTS.find((r) => r.id == id);
    if (!resident) return;

    _currentResident = resident;
    document.getElementById('residentSelect').value = id;

    const initials = resident.name.split(' ').map((n) => n[0]).join('').slice(0, 2);
    document.getElementById('sidebar-avatar').textContent = initials;
    document.getElementById('sidebar-name').textContent   = resident.name;
    document.getElementById('sidebar-meta').textContent   = `${resident.room} • DOB: ${resident.dob}`;
    document.getElementById('tb-badge').textContent       = `${resident.name} — ${resident.room}`;

    showPage(_currentPage);
    toast(`Switched to ${resident.name}`);
  }

  function getCurrentResident() {
    return _currentResident;
  }

  // ── Page routing ───────────────────────────
  function showPage(pageKey) {
    _currentPage = pageKey;

    // Update nav active state
    document.querySelectorAll('.nav-item').forEach((el) => {
      el.classList.toggle('active', el.dataset.page === pageKey);
    });

    // Update topbar title
    document.getElementById('tb-title').textContent = PAGE_TITLES[pageKey] || pageKey;

    // Clear and render content
    const contentEl = document.getElementById('content');
    contentEl.innerHTML = '';

    const renderer = PAGE_RENDERERS[pageKey];
    if (renderer) {
      renderer(contentEl);
    } else {
      contentEl.innerHTML = `<div class="card"><p>Page not found: ${Utils.escapeHtml(pageKey)}</p></div>`;
    }
  }

  // ── Toast notification ─────────────────────
  function toast(message, type = 'success') {
    const el = document.getElementById('toast');
    el.textContent = message;
    el.className   = `toast${type === 'error' ? ' error' : ''} show`;

    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(() => el.classList.remove('show'), 2800);
  }

  // ── Save all ──────────────────────────────
  function saveAll() {
    toast(`✓ All records saved for ${_currentResident.name}`);
  }

  // ── Private helpers ────────────────────────
  function _populateResidentDropdown() {
    const select = document.getElementById('residentSelect');
    select.innerHTML = '';
    RESIDENTS.forEach((r) => {
      const opt = document.createElement('option');
      opt.value       = r.id;
      opt.textContent = `${r.name} — ${r.room}`;
      select.appendChild(opt);
    });
  }

  // ── Start the app on DOMContentLoaded ─────
  document.addEventListener('DOMContentLoaded', init);

  // Public API
  return { switchResident, getCurrentResident, showPage, toast, saveAll };
})();
