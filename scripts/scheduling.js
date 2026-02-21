/**
 * Scheduling for posao / usluga / skela.
 * Date input min 2 days ahead; time picker 09:00–18:00.
 * Each booking blocks 2 hours (chosen slot + next hour).
 *
 * Uses Cloudflare Worker + KV for shared storage so all visitors
 * see the same blocked slots. Falls back to localStorage if the
 * API is unreachable.
 */
(function () {
  'use strict';

  var MIN_DAYS_AHEAD = 2;
  var FIRST_HOUR = 9;
  var LAST_HOUR = 18;
  var STORAGE_PREFIX = 'nebgradnja_blocked_';

  // Worker API URL — update this after deploying your Worker
  var API_BASE = window.NEBGRADNJA_API || 'https://nebgradnja-scheduling.sardoniccrack.workers.dev';

  var LOCATION_PLACEHOLDER = 'Beograd, adresa će biti poslata nakon potvrde termina.';

  function pad2(n) {
    return (n < 10 ? '0' : '') + n;
  }

  function todayStr() {
    var d = new Date();
    return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
  }

  function addDays(str, n) {
    var parts = str.split('-');
    var d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    d.setDate(d.getDate() + n);
    return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
  }

  function getTimeSlots() {
    var slots = [];
    for (var h = FIRST_HOUR; h <= LAST_HOUR; h++) {
      slots.push(pad2(h) + ':00');
    }
    return slots;
  }

  function nextHour(timeStr) {
    var h = parseInt(timeStr.slice(0, 2), 10);
    if (h >= LAST_HOUR) return null;
    return pad2(h + 1) + ':00';
  }

  // --- localStorage fallback (used when API is unreachable) ---

  function getBlockedLocal(type, dateStr) {
    try {
      var raw = localStorage.getItem(STORAGE_PREFIX + type);
      if (!raw) return [];
      var data = JSON.parse(raw);
      if (!data || typeof data !== 'object') return [];
      var entry = data[dateStr];
      return Array.isArray(entry) ? entry : [];
    } catch (e) {
      return [];
    }
  }

  function addBlockedLocal(type, dateStr, timeStr) {
    var key = STORAGE_PREFIX + type;
    var blocked = {};
    try {
      var raw = localStorage.getItem(key);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) blocked = parsed;
      }
    } catch (e) {}
    if (!blocked[dateStr]) blocked[dateStr] = [];
    blocked[dateStr].push(timeStr);
    var next = nextHour(timeStr);
    if (next) blocked[dateStr].push(next);
    try {
      localStorage.setItem(key, JSON.stringify(blocked));
    } catch (e) {}
  }

  // --- Server API (Cloudflare Worker + KV) ---

  function getBlockedFromServer(type, dateStr, callback) {
    if (!API_BASE || API_BASE.indexOf('<YOUR_SUBDOMAIN>') !== -1) {
      callback(getBlockedLocal(type, dateStr));
      return;
    }
    fetch(API_BASE + '/api/blocked?type=' + encodeURIComponent(type) + '&date=' + encodeURIComponent(dateStr))
      .then(function (res) { return res.json(); })
      .then(function (data) {
        callback(data.blocked || []);
      })
      .catch(function () {
        callback(getBlockedLocal(type, dateStr));
      });
  }

  function bookOnServer(type, dateStr, timeStr, callback) {
    addBlockedLocal(type, dateStr, timeStr);

    if (!API_BASE || API_BASE.indexOf('<YOUR_SUBDOMAIN>') !== -1) {
      callback({ ok: true });
      return;
    }
    fetch(API_BASE + '/api/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: type, date: dateStr, time: timeStr })
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        callback(data);
      })
      .catch(function () {
        callback({ ok: true });
      });
  }

  // --- UI rendering ---

  function renderTimePicker(container, timeInput, type, dateStr, selectedTime, onSelect) {
    var slots = getTimeSlots();

    function render(blocked) {
      var html = '';
      slots.forEach(function (t) {
        var disabled = blocked.indexOf(t) !== -1;
        var cls = 'schedule-time-btn';
        if (selectedTime === t) cls += ' selected';
        html += '<button type="button" class="' + cls + '" data-time="' + t + '"' + (disabled ? ' disabled' : '') + '>' + t + '</button>';
      });
      container.innerHTML = html;
      container.querySelectorAll('.schedule-time-btn:not([disabled])').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var t = this.getAttribute('data-time');
          onSelect(t);
          container.querySelectorAll('.schedule-time-btn').forEach(function (b) {
            b.classList.toggle('selected', b.getAttribute('data-time') === t);
          });
        });
      });
    }

    if (dateStr) {
      getBlockedFromServer(type, dateStr, render);
    } else {
      render([]);
    }
  }

  function initSchedulingPage(options) {
    var type = options.type;
    var form = document.querySelector(options.formSelector);
    var dateInput = document.querySelector(options.dateInputSelector);
    var timeInput = document.querySelector(options.timeInputSelector);
    var timePickerEl = document.querySelector(options.timePickerSelector);
    var locationEl = document.querySelector(options.locationSelector);
    var successEl = null;
    if (form) {
      var wrap = form.closest('.form-section-form-wrap');
      if (wrap) successEl = wrap.querySelector('.form-section-success');
    }
    var locationPlaceholder = options.locationPlaceholder || LOCATION_PLACEHOLDER;

    if (!form || !dateInput || !timeInput || !timePickerEl) return;

    if (locationEl) locationEl.textContent = locationPlaceholder;

    var minDate = addDays(todayStr(), MIN_DAYS_AHEAD);
    dateInput.setAttribute('min', minDate);

    function setTime(val) {
      timeInput.value = val || '';
      timeInput.setCustomValidity(val ? '' : (window.i18nGetString && window.i18nGetString('schedulePickDateTime')) || 'Izaberite vreme.');
    }

    function updateTimePicker() {
      var dateVal = dateInput.value;
      renderTimePicker(timePickerEl, timeInput, type, dateVal, timeInput.value, setTime);
    }

    updateTimePicker();
    dateInput.addEventListener('change', function () {
      setTime('');
      updateTimePicker();
    });

    form.setAttribute('data-scheduling', type);
    if (form.getAttribute('enctype') !== 'multipart/form-data') {
      form.setAttribute('enctype', 'application/x-www-form-urlencoded');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var dateVal = dateInput.value;
      var timeVal = timeInput.value;
      if (!dateVal || !timeVal) {
        var msg = (window.i18nGetString && window.i18nGetString('schedulePickDateTime')) || 'Izaberite datum i vreme.';
        alert(msg);
        return;
      }
      if (dateVal < minDate) {
        alert((window.i18nGetString && window.i18nGetString('scheduleMinDays')) || 'Termin možete zakazati najmanje 2 dana unapred.');
        return;
      }

      var submitBtn = form.querySelector('.btn-submit');
      if (submitBtn) submitBtn.disabled = true;

      var formData = new FormData(form);
      var action = form.getAttribute('action');
      var msgError = (window.i18nGetString && window.i18nGetString('formError')) || 'Došlo je do greške. Pokušajte ponovo.';
      var confirmTitle = (window.i18nGetString && window.i18nGetString('scheduleConfirmTitle')) || 'Termin zakažan';
      var confirmAddress = (window.i18nGetString && window.i18nGetString('scheduleConfirmAddress')) || 'Adresa: ' + locationPlaceholder;
      var confirmDate = (window.i18nGetString && window.i18nGetString('scheduleConfirmDate')) || 'Datum i vreme:';

      bookOnServer(type, dateVal, timeVal, function (bookResult) {
        if (!bookResult.ok) {
          if (submitBtn) submitBtn.disabled = false;
          if (bookResult.error === 'Time slot already taken') {
            alert((window.i18nGetString && window.i18nGetString('schedulePickDateTime')) || 'Taj termin je zauzet. Izaberite drugo vreme.');
            updateTimePicker();
          } else {
            if (successEl) {
              successEl.textContent = msgError;
              successEl.hidden = false;
            }
          }
          return;
        }

        fetch(action, {
          method: 'POST',
          body: formData,
          headers: { Accept: 'application/json' }
        })
          .then(function (res) {
            if (res.ok) {
              form.style.display = 'none';
              if (successEl) {
                successEl.innerHTML = '<strong>' + confirmTitle + '</strong><br>' + confirmDate + ' ' + dateVal + ' ' + timeVal + '<br>' + confirmAddress;
                successEl.hidden = false;
              }
              form.reset();
              setTime('');
              dateInput.setAttribute('min', addDays(todayStr(), MIN_DAYS_AHEAD));
              if (options.onFileReset) options.onFileReset();
            } else {
              if (submitBtn) submitBtn.disabled = false;
              if (successEl) {
                successEl.textContent = msgError;
                successEl.hidden = false;
              }
            }
          })
          .catch(function () {
            if (submitBtn) submitBtn.disabled = false;
            if (successEl) {
              successEl.textContent = msgError;
              successEl.hidden = false;
            }
          });
      });
    });
  }

  function runSchedulingInits() {
    var posaoForm = document.querySelector('.scheduling-form[data-type="posao"]');
    if (posaoForm) {
      var cvInput = document.getElementById('posao-cv');
      var cvNameEl = document.getElementById('posao-cv-name');
      if (cvInput && cvNameEl) {
        cvInput.addEventListener('change', function () {
          var files = this.files;
          cvNameEl.textContent = files && files.length ? files[0].name : '';
        });
      }
      initSchedulingPage({
        type: 'posao',
        formSelector: '.scheduling-form[data-type="posao"]',
        dateInputSelector: '#posao-date',
        timeInputSelector: '#posao-time',
        timePickerSelector: '#posao-time-picker',
        locationSelector: '#posao-location',
        locationPlaceholder: 'Beograd, adresa će biti poslata nakon potvrde termina.',
        onFileReset: function () {
          if (cvNameEl) cvNameEl.textContent = '';
        }
      });
    }

    var uslugaForm = document.querySelector('.scheduling-form[data-type="usluga"]');
    if (uslugaForm) {
      initSchedulingPage({
        type: 'usluga',
        formSelector: '.scheduling-form[data-type="usluga"]',
        dateInputSelector: '#usluga-date',
        timeInputSelector: '#usluga-time',
        timePickerSelector: '#usluga-time-picker',
        locationSelector: '#usluga-location',
        locationPlaceholder: 'Beograd, adresa će biti poslata nakon potvrde termina.'
      });
    }

    var skelaForm = document.querySelector('.scheduling-form[data-type="skela"]');
    if (skelaForm) {
      initSchedulingPage({
        type: 'skela',
        formSelector: '.scheduling-form[data-type="skela"]',
        dateInputSelector: '#skela-date',
        timeInputSelector: '#skela-time',
        timePickerSelector: '#skela-time-picker',
        locationSelector: '#skela-location',
        locationPlaceholder: 'Beograd, adresa će biti poslata nakon potvrde termina.'
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runSchedulingInits);
  } else {
    runSchedulingInits();
  }
})();
