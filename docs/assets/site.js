// Copy buttons for install commands. The page works fully without this script.
(() => {
  'use strict';
  const status = document.getElementById('copy-status');
  document.querySelectorAll('button.copy[data-copy]').forEach(button => {
    button.hidden = false;
    button.addEventListener('click', async () => {
      const text = button.getAttribute('data-copy');
      try {
        await navigator.clipboard.writeText(text);
        button.textContent = 'Copied';
        if (status) status.textContent = 'Command copied to the clipboard.';
      } catch {
        button.textContent = 'Select it';
        if (status) status.textContent = 'Copy failed. Select the command and copy it manually.';
      }
      setTimeout(() => { button.textContent = 'Copy'; }, 2000);
    });
  });
})();
