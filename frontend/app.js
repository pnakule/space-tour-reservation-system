// ===================================================
//  Space Tour — App Router & State Manager
// ===================================================
 
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
 
// ── Navigate ───────────────────────────────────────────
export function navigate(page, data = {}) {
  Object.assign(State, data);
  State.page = page;
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
 
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
      ?.addEventListener('click', () => navigate('explore'));
    document
      .getElementById('btn-explore')
      ?.addEventListener('click', () => navigate('explore'));
    document
      .getElementById('lcard-reserve-earth')
      ?.addEventListener('click', () => navigate('step1', { step: 1, readiness: { duration: 'earth-orbit' } }));
    document
      .getElementById('lcard-reserve-moon')
      ?.addEventListener('click', () => navigate('step1', { step: 1, readiness: { duration: 'lunar-flyby' } }));
    return;
  }
 
  if (page === 'explore') {
    app.innerHTML = renderExplore();
    exploreCleanup = initExplore();
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
render();
