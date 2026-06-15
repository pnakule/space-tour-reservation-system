// Toast notification helper
export function toast(message, type = 'info', duration = 4000) {
  const root = document.getElementById('toast-root');
  if (!root) return;

  const icons = { success: '✓', error: '✕', info: '→' };
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.innerHTML = `<span>${icons[type] || '·'}</span><span>${message}</span>`;
  root.appendChild(el);

  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(6px)';
    el.style.transition = '0.25s ease';
    setTimeout(() => el.remove(), 260);
  }, duration);
}
