/**
 * js/utils.js
 * Shared helper functions available to all modules.
 * Pure functions only — no side effects, no DOM access.
 */

'use strict';

const Utils = (() => {

  /** Today's date as YYYY-MM-DD (for input[type=date] default values) */
  const TODAY = new Date().toISOString().split('T')[0];

  /** Current time as HH:MM */
  function now() {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }

  /**
   * Render a <div class="field"> block.
   * @param {string} label   - Field label text
   * @param {string} elHtml  - Inner HTML (input / select / textarea)
   * @param {boolean} full   - Whether to span full grid width
   */
  function field(label, elHtml, full = false) {
    const cls = full ? 'field full' : 'field';
    return `<div class="${cls}"><label>${escapeHtml(label)}</label>${elHtml}</div>`;
  }

  /**
   * Render an <input> element.
   * @param {string} placeholder
   * @param {string} type        - input type (default 'text')
   * @param {string} value       - initial value
   */
  function inp(placeholder = '', type = 'text', value = '') {
    return `<input type="${type}" placeholder="${escapeHtml(placeholder)}" value="${escapeHtml(value)}">`;
  }

  /**
   * Render a <select> element.
   * @param {string[]} options  - Array of option strings
   * @param {string}   selected - Pre-selected value
   */
  function sel(options, selected = '') {
    const opts = options.map((o) => {
      const esc = escapeHtml(o);
      return `<option${o === selected ? ' selected' : ''}>${esc}</option>`;
    }).join('');
    return `<select>${opts}</select>`;
  }

  /** Render a <textarea> element. */
  function ta(placeholder = '') {
    return `<textarea placeholder="${escapeHtml(placeholder)}"></textarea>`;
  }

  /**
   * Return an appropriate coloured pill badge for a record value.
   * @param {string} value
   */
  function pill(value) {
    if (!value) return '';
    const v = value.toLowerCase();
    if (v.includes('given') || v === 'done' || v === 'intact' || v === 'complete') {
      return `<span class="pill pill-green">${escapeHtml(value)}</span>`;
    }
    if (v === 'refused' || v.includes('concern') || v === 'reddened' || v.includes('error')) {
      return `<span class="pill pill-red">${escapeHtml(value)}</span>`;
    }
    if (v === 'partial' || v.includes('monitor') || v.includes('review')) {
      return `<span class="pill pill-amber">${escapeHtml(value)}</span>`;
    }
    return `<span class="pill pill-gray">${escapeHtml(value)}</span>`;
  }

  /**
   * Escape HTML special characters to prevent XSS when inserting
   * user-supplied text into innerHTML.
   * @param {string} str
   * @returns {string}
   */
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g,  '&amp;')
      .replace(/</g,  '&lt;')
      .replace(/>/g,  '&gt;')
      .replace(/"/g,  '&quot;')
      .replace(/'/g,  '&#039;');
  }

  /**
   * Safely read a value from a form input by CSS selector.
   * Returns empty string if element not found.
   * @param {string} selector
   * @param {Element} context  - parent element to search within
   */
  function val(selector, context = document) {
    const el = context.querySelector(selector);
    return el ? el.value.trim() : '';
  }

  /**
   * Read all inputs/selects/textareas within a context element.
   * Returns an array of trimmed string values.
   * @param {Element} context
   */
  function allVals(context = document) {
    return Array.from(
      context.querySelectorAll('.field input, .field select, .field textarea')
    ).map((el) => el.value.trim());
  }

  return { TODAY, now, field, inp, sel, ta, pill, escapeHtml, val, allVals };
})();
