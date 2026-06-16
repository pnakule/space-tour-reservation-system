// =====================================================
//  Space Tour — App Router & State Manager
// =====================================================
 
import { renderLanding }       from './pages/Landing.js';
import { renderExplore, initExplore } from './pages/Explore.js';
import { renderStep1 }         from './pages/Step1_Traveler.js';
import { renderStep2 }         from './pages/Step2_Mindset.js';
import { renderStep3 }         from './pages/Step3_Experience.js';
import { renderStep4 }         from './pages/Step4_Reservation.js';
import { renderStep5 }         from './pages/Step5_Confirmed.js';
import { attachStep1Listeners } from './pages/Step1_Traveler.js';
import { attachStep2Listeners } from './pages/Step2_Mindset.js';
import { attachStep3Listeners } from './pages/Step3_Experience.js';
import { attachStep4Listeners } from './pages/Step4_Reservation.js';
import { toast }                from './components/Toast.js';
 
// ── Global State ──────────────────────────────────────
export const State = {
  page: 'landing',
  step: 0,
  traveler: {},
  readiness: {},
  reservationId: null,
  email: null,
  // Tracks how the Explore page was reached:
  //  'app'     -> opened from inside the app (Landing page, normal flow)
  //  'offline' -> opened directly via index.html#explore (e.g. from offline.html)
  exploreEntry: 'app',
};
 
// ── Step config ────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'Traveler'    },
  { id: 2, label: 'Mindset' },
  { id: 3, label: 'Experience'     },
  { id: 4, label: 'Reservation'     },
  { id: 5, label: 'Confirmed'   },
];
 
// Holds the cleanup function returned by initExplore(),
// so we can stop the canvas animation when leaving the page.
let exploreCleanup = null;

// Set to true while we are reacting to a browser/device "Back" press,
// so navigate() doesn't push a brand-new history entry on top of it.
let handlingPopState = false;

// ── Navigate ───────────────────────────────────────────
export function navigate(page, data = {}) {
  const cameFrom = State.page;
  Object.assign(State, data);
  State.page = page;
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (handlingPopState) return; // browser already moved the history pointer

  if (page === 'landing') {
    // Returning to Home from inside the app — keep history tidy without
    // adding a new entry (so a later "Back" press doesn't just retrace steps).
    if (cameFrom !== 'landing') {
      history.replaceState({ page: 'landing' }, '', '#landing');
    }
  } else if (cameFrom === 'landing') {
    // Leaving Home for the first time in this run — create exactly one
    // "back stop" so the device/browser Back button always returns Home,
    // no matter how many steps are visited afterwards.
    history.pushState({ page }, '', '#' + page);
  } else {
    // Moving between steps/pages without returning Home — update the
    // current history entry in place instead of growing the stack.
    history.replaceState({ page }, '', '#' + page);
  }
}

// Any browser/device "Back" action (hardware back button, swipe-back,
// the on-screen Back arrow, etc.) should land the user on the Home page,
// regardless of which step or page they were on.
window.addEventListener('popstate', () => {
  handlingPopState = true;
  navigate('landing', { step: 0 });
  handlingPopState = false;
});
 
// ── Render ─────────────────────────────────────────────
function render() {
  const app = document.getElementById('app');
  const { page } = State;
 
  // If we're leaving the explore page, stop its animation loop.
  if (page !== 'explore' && exploreCleanup) {
    exploreCleanup();
    exploreCleanup = null;
  }
 
  if (page === 'landing') {
    app.innerHTML = renderLanding();
    document
      .getElementById('btn-reserve')
      ?.addEventListener('click', () => navigate('step1', { step: 1 }));
    document
      .getElementById('btn-explore')
      ?.addEventListener('click', () => navigate('explore', { exploreEntry: 'app' }));
    document
      .getElementById('lcard-reserve-earth')
      ?.addEventListener('click', () => navigate('step1', { step: 1, readiness: { duration: 'earth-orbit' } }));
    document
      .getElementById('lcard-reserve-moon')
      ?.addEventListener('click', () => navigate('step1', { step: 1, readiness: { duration: 'lunar-flyby' } }));
    return;
  }
 
  if (page === 'explore') {
    app.innerHTML = renderExplore(State.exploreEntry);
    exploreCleanup = initExplore(State.exploreEntry);
    return;
  }
 
  const stepNum = parseInt(page.replace('step', ''), 10);
  State.step = stepNum;
 
  app.innerHTML = `
    ${buildStepBar(stepNum)}
    <div id="page-inner"></div>
    <div id="toast-root"></div>
  `;
 
  const inner = document.getElementById('page-inner');
 
  switch (page) {
    case 'step1': inner.innerHTML = renderStep1();   attachStep1Listeners(); break;
    case 'step2': inner.innerHTML = renderStep2();   attachStep2Listeners(); break;
    case 'step3': inner.innerHTML = renderStep3();   attachStep3Listeners(); break;
    case 'step4': inner.innerHTML = renderStep4();   attachStep4Listeners(); break;
    case 'step5': inner.innerHTML = renderStep5();   break;
  }
}
 
// ── Step Bar ───────────────────────────────────────────
function buildStepBar(current) {
  const items = STEPS.map((s, i) => {
    const isDone   = s.id < current || (current === 5 && s.id === 5);
    const isActive = s.id === current && current !== 5;
    const dotClass = isDone ? 'done' : isActive ? 'active' : '';
    const lblClass = isDone ? 'done' : isActive ? 'active' : '';
    const lineClass = isDone ? 'done' : '';
    const icon = isDone ? '✓' : s.id;
 
    const dot = `
      <div class="step-item">
        <div class="step-dot-wrap">
          <div class="step-dot ${dotClass}">${icon}</div>
          <div class="step-label ${lblClass}">${s.label}</div>
        </div>
      </div>`;
 
    const line = i < STEPS.length - 1
      ? `<div class="step-connector ${lineClass}"></div>`
      : '';
 
    return dot + line;
  }).join('');
 
  return `
    <nav class="step-bar">
      <div class="step-bar-inner">${items}</div>
    </nav>`;
}
 
// ── Boot ───────────────────────────────────────────────
window.navigate = navigate;
window.toast    = toast;
if (window.location.hash === '#explore') {
  State.page = 'explore';
  // Reached directly via a link/hash (e.g. the "Explore the Experience"
  // button on offline.html) rather than from inside the running app.
  State.exploreEntry = 'offline';
}
render();