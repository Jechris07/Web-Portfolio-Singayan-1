'use strict';

(() => {
  const root = document.documentElement;
  const storageKey = 'singayan-theme';
  let theme = 'dark';
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved === 'light' || saved === 'dark') theme = saved;
  } catch { /* The toggle also works when storage is unavailable. */ }

  function applyTheme(value) {
    theme = value;
    root.dataset.theme = value;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', value === 'dark' ? '#14191d' : '#f3f1e9');
    const button = document.querySelector('.theme-toggle');
    if (button) {
      button.setAttribute('aria-pressed', String(value === 'dark'));
      button.title = value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    }
  }
  applyTheme(theme);
  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(theme);
    document.querySelector('.theme-toggle').addEventListener('click', () => {
      applyTheme(theme === 'dark' ? 'light' : 'dark');
      try { localStorage.setItem(storageKey, theme); } catch { /* Keep the current session usable. */ }
    });
  });
  window.addEventListener('storage', event => {
    if (event.key === storageKey) applyTheme(event.newValue === 'light' ? 'light' : 'dark');
  });
})();
