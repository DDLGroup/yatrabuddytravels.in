/**
 * Yatra Buddy Travels - 7-Day Digital Countdown
 * Automatically reduces time second-by-second and persists remaining duration
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'yatra_launch_target_ts';
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

  let targetTimestamp;

  function initCountdownTarget() {
    const stored = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();

    if (stored) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed) && parsed > now) {
        targetTimestamp = parsed;
        return;
      }
    }

    // Set exactly 7 days from current time
    targetTimestamp = now + SEVEN_DAYS_MS;
    try {
      localStorage.setItem(STORAGE_KEY, targetTimestamp.toString());
    } catch (e) {
      console.warn('Storage unavailable', e);
    }
  }

  initCountdownTarget();

  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  const statusEl = document.getElementById('countdown-status');

  function pad(num) {
    return num < 10 ? '0' + num : String(num);
  }

  function updateCountdown() {
    const now = Date.now();
    const diff = targetTimestamp - now;

    if (diff <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      if (statusEl) {
        statusEl.innerHTML = '<i class="fa-solid fa-check-circle" style="color: #34d399;"></i> Ready to launch!';
      }
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (daysEl) daysEl.textContent = pad(days);
    if (hoursEl) hoursEl.textContent = pad(hours);
    if (minutesEl) minutesEl.textContent = pad(minutes);
    if (secondsEl) secondsEl.textContent = pad(seconds);
  }

  // Initial call & recurring 1-second interval
  updateCountdown();
  setInterval(updateCountdown, 1000);
})();
