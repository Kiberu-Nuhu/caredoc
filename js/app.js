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
    'appointments':   'Appointment Records',
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

    ['residentSelect', 'mobileResidentSelect'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('change', (e) => switchResident(e.target.value));
    });

    document.getElementById('tb-date').textContent = new Date().toLocaleDateString('en-GB', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });

    _initSwipe();
    switchResident(RESIDENTS[0].id);
  }

  // ── Resident switching ─────────────────────
  function switchResident(id) {
    const resident = RESIDENTS.find((r) => r.id == id);
    if (!resident) return;

    _currentResident = resident;
    document.getElementById('residentSelect').value = id;
    const mSel = document.getElementById('mobileResidentSelect');
    if (mSel) mSel.value = id;

    const initials = resident.name.split(' ').map((n) => n[0]).join('').slice(0, 2);
    document.getElementById('sidebar-avatar').textContent = initials;
    document.getElementById('sidebar-name').textContent   = resident.name;
    document.getElementById('sidebar-meta').textContent   = `${resident.room} • DOB: ${resident.dob}`;
    document.getElementById('tb-badge').textContent       = `${resident.name} — ${resident.room}`;

    showPage(_currentPage);
    closeSidebar();
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

    closeSidebar();
  }

  // ── Sidebar open / close / toggle ────────
  function openSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const btn     = document.getElementById('menu-toggle');
    if (!sidebar) return;
    sidebar.style.transition = '';
    sidebar.classList.add('open');
    if (overlay) overlay.classList.add('active');
    if (btn) btn.setAttribute('aria-expanded', 'true');
  }

  function closeSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const btn     = document.getElementById('menu-toggle');
    if (sidebar) { sidebar.style.transition = ''; sidebar.classList.remove('open'); }
    if (overlay) { overlay.style.opacity = ''; overlay.classList.remove('active'); }
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }

  function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
  }

  // ── Touch swipe gesture ───────────────────
  function _initSwipe() {
    const sidebar  = document.querySelector('.sidebar');
    if (!sidebar) return;

    const SIDEBAR_W      = 280;
    const EDGE_THRESHOLD = 40;  // px from left edge to start drag
    const SNAP_THRESHOLD = 80;  // px of travel before snap open

    let startX      = 0;
    let startY      = 0;
    let startOffset = 0;
    let dragging    = false;
    let intent      = null;     // 'h' | 'v'

    function _getOffset() {
      return sidebar.classList.contains('open') ? 0 : -SIDEBAR_W;
    }

    function _applyLive(offset) {
      const overlay = document.getElementById('sidebar-overlay');
      sidebar.style.transform = `translateX(${offset}px)`;
      if (overlay) {
        const p = (offset + SIDEBAR_W) / SIDEBAR_W;
        overlay.style.display = p > 0.01 ? 'block' : 'none';
        overlay.style.opacity = String(p * 0.55);
      }
    }

    function _clearLive() {
      sidebar.style.transform = '';
      const overlay = document.getElementById('sidebar-overlay');
      if (overlay) { overlay.style.opacity = ''; overlay.style.display = ''; }
    }

    document.addEventListener('touchstart', (e) => {
      const x      = e.touches[0].clientX;
      const isOpen = sidebar.classList.contains('open');
      if (x > EDGE_THRESHOLD && !isOpen) return;
      startX      = x;
      startY      = e.touches[0].clientY;
      startOffset = _getOffset();
      dragging    = true;
      intent      = null;
      sidebar.style.transition = 'none';
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
      if (!dragging) return;
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;

      if (intent === null) {
        if (Math.abs(dx) < 5 && Math.abs(dy) < 5) return;
        intent = Math.abs(dx) >= Math.abs(dy) ? 'h' : 'v';
      }
      if (intent === 'v') { dragging = false; _clearLive(); return; }

      e.preventDefault();
      const offset = Math.max(-SIDEBAR_W, Math.min(0, startOffset + dx));
      _applyLive(offset);
    }, { passive: false });

    document.addEventListener('touchend', (e) => {
      if (!dragging) return;
      dragging = false;
      const dx        = e.changedTouches[0].clientX - startX;
      const finalOff  = startOffset + dx;
      _clearLive();
      if (finalOff > -SIDEBAR_W + SNAP_THRESHOLD) openSidebar();
      else closeSidebar();
    }, { passive: true });
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
    const selectors = [
      document.getElementById('residentSelect'),
      document.getElementById('mobileResidentSelect'),
    ].filter(Boolean);
    selectors.forEach((select) => {
      select.innerHTML = '';
      RESIDENTS.forEach((r) => {
        const opt = document.createElement('option');
        opt.value       = r.id;
        opt.textContent = `${r.name} — ${r.room}`;
        select.appendChild(opt);
      });
    });
  }

  // ── Start the app on DOMContentLoaded ─────
  document.addEventListener('DOMContentLoaded', init);

  // Public API
  return { switchResident, getCurrentResident, showPage, toast, saveAll, openSidebar, closeSidebar, toggleSidebar };
})();
