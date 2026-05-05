/**
 * data/store.js
 * Central in-memory data store. All modules read and write
 * through Store.get() / Store.push() / Store.delete() so that
 * data access is consistent and easy to replace with a real
 * backend (e.g. fetch() calls to a REST API) later.
 */

'use strict';

const Store = (() => {
  // Private state — keyed by resident ID
  const _state = {};

  /**
   * Initialise an empty record set for every resident.
   * Called once by App on startup.
   */
  function init() {
    RESIDENTS.forEach((r) => {
      _state[r.id] = {
        notes:        [],
        continence:   [],
        activity:     [],
        personalCare: [],
        freqSev:      [],
        medication:   [],
        fluid:        [],
        epilepsy:     [],
        nightReports: [],
        appointments: [],
        
      };
    });

    // Seed sample data for resident 1 so the UI looks populated on first load
    _seed();
  }

  function _seed() {
    _state[1].notes = [
      { time: '07:45', shift: 'Morning',   category: 'General',        mood: 'Happy',     note: 'Slept well. Happy and engaged at breakfast. Good appetite.', action: 'None required', staff: 'S. Johnson' },
      { time: '11:20', shift: 'Morning',   category: 'Behaviour',      mood: 'Confused',  note: 'Appeared slightly confused during music session. Settled after 10 mins with reassurance.', action: 'Monitor throughout day', staff: 'S. Johnson' },
      { time: '14:10', shift: 'Afternoon', category: 'Health Concern', mood: 'Distressed', note: 'Complained of mild knee pain. PRN paracetamol given.', action: 'Inform GP if persists', staff: 'J. Lee' },
    ];
    _state[1].continence = [
      { time: '07:00', output: 'Urine only', method: 'Pad',             volume: 'Medium', skin: 'Intact',   padChanged: 'Yes', staff: 'J.S.' },
      { time: '09:00', output: 'Both',       method: 'Toilet assisted', volume: 'Large',  skin: 'Intact',   padChanged: 'Yes', staff: 'J.S.' },
      { time: '11:00', output: 'Urine only', method: 'Pad',             volume: 'Small',  skin: 'Intact',   padChanged: 'No',  staff: 'L.P.' },
      { time: '15:00', output: 'Urine only', method: 'Pad',             volume: 'Medium', skin: 'Reddened', padChanged: 'Yes', staff: 'A.M.' },
    ];
    _state[1].medication = [
      { time: '08:00', drug: 'Amlodipine 5mg',    dose: '1 tablet',   route: 'Oral', result: 'Given',            staff: 'J.S.' },
      { time: '08:00', drug: 'Lisinopril 10mg',   dose: '1 tablet',   route: 'Oral', result: 'Given',            staff: 'J.S.' },
      { time: '14:00', drug: 'Paracetamol 500mg', dose: '2 tablets',  route: 'Oral', result: 'Given — PRN pain', staff: 'A.M.' },
      { time: '18:00', drug: 'Sertraline 50mg',   dose: '1 tablet',   route: 'Oral', result: 'Refused',          staff: 'A.M.' },
    ];
  }

  /**
   * Get all records of a given type for a resident.
   * @param {number} residentId
   * @param {string} recordType  e.g. 'notes', 'medication'
   * @returns {Array}
   */
  function get(residentId, recordType) {
    if (!_state[residentId]) return [];
    return _state[residentId][recordType] || [];
  }

  /**
   * Append a new record.
   * @param {number} residentId
   * @param {string} recordType
   * @param {Object} record
   */
  function push(residentId, recordType, record) {
    if (!_state[residentId]) return;
    _state[residentId][recordType].push(record);
  }

  /**
   * Delete a record by index.
   * @param {number} residentId
   * @param {string} recordType
   * @param {number} index
   */
  function remove(residentId, recordType, index) {
    if (!_state[residentId]) return;
    _state[residentId][recordType].splice(index, 1);
  }

  return { init, get, push, remove };
})();
