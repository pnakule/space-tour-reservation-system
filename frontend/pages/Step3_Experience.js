
// =====================================================
//  Step 3 — Experience Selection
// =====================================================
import { navigate, State } from '../app.js';

const EXPERIENCES = {
  'earth-orbit': {
    name: 'Earth Orbit Experience',
    duration: '6 Hours',
    icon: '🌍',
    spacecraft: 'E-6',
    destination: 'Low Earth Orbit',
    availability: '2045',
    desc: 'Launch into Low Earth Orbit and witness our planet from above.',
    highlights: [
      'Complete multiple Earth orbits',
      'Observe Earth and the thin atmosphere',
      'Return to Earth same day',
    ],
    badge: null,
    accent: 'earth',
  },
  'lunar-flyby': {
    name: 'Lunar Flyby Expedition',
    duration: '7–10 Days',
    icon: '🌕',
    spacecraft: 'L-6',
    destination: 'Lunar Orbit',
    availability: '2045',
    desc: 'Journey beyond Earth orbit and fly around the Moon in an ultra-premium expedition.',
    highlights: [
      'Travel beyond Earth orbit',
      'Fly around the Moon',
      'View the lunar surface close-up',
      'Return to Earth',
    ],
    badge: 'Ultra Premium Experience',
    accent: 'moon',
  },
};

export function renderStep3() {
  const selectedKey = State.readiness?.duration || State.mindset?.duration || 'earth-orbit';
  const selected = EXPERIENCES[selectedKey] || EXPERIENCES['earth-orbit'];

  const expCards = Object.entries(EXPERIENCES).map(([key, exp]) => {
    const isActive = key === selectedKey;
    const isPremium = key === 'lunar-flyby';
    return `
      <div class="exp-select-card ${isActive ? 'active' : ''} ${isPremium ? 'premium' : ''}" data-exp="${key}" style="cursor:pointer">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px">
          <div style="display:flex;align-items:center;gap:12px">
            <span style="font-size:1.6rem">${exp.icon}</span>
            <div>
              ${isPremium ? `<div style="font-family:var(--font-mono);font-size:0.6rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--ochre);margin-bottom:3px">⭐ Ultra Premium</div>` : ''}
              <div style="font-weight:700;font-size:0.95rem;color:var(--ink)">${exp.name}</div>
              <div style="font-family:var(--font-mono);font-size:0.65rem;color:${isPremium ? 'var(--ochre)' : 'var(--terracotta)'};letter-spacing:0.08em;margin-top:2px">${exp.duration} · Est. ${exp.availability}</div>
            </div>
          </div>
          <div style="text-align:right;flex-shrink:0">
            <div style="font-family:var(--font-mono);font-size:0.68rem;color:var(--dim);white-space:nowrap">${exp.spacecraft}</div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <style>
      .exp-select-card {
        background: #fff;
        border: 1.5px solid var(--border);
        border-radius: 14px;
        padding: 20px 22px;
        margin-bottom: 12px;
        transition: border-color 0.2s, background 0.2s;
      }
      .exp-select-card:hover { border-color: var(--terracotta); background: var(--terra-dim); }
      .exp-select-card.active { border-color: var(--clay); background: rgba(58,74,115,0.06); }
      .exp-select-card.premium.active { border-color: var(--ochre); background: var(--ochre-dim); }
      .exp-select-card.premium:hover { border-color: var(--ochre); }
      .journey-detail-card {
        background: #fff;
        border: 1px solid var(--border);
        border-radius: 18px;
        overflow: hidden;
        margin-bottom: 20px;
        box-shadow: var(--shadow-sm);
      }
      .journey-visual {
        width: 100%;
        height: 180px;
        position: relative;
        overflow: hidden;
        background: #070b16;
      }
      .journey-visual::before {
        content: '';
        position: absolute; inset: 0;
        background-image:
          radial-gradient(1px 1px at 15% 25%, #fff, transparent),
          radial-gradient(1px 1px at 35% 70%, #fff, transparent),
          radial-gradient(2px 2px at 55% 35%, rgba(255,255,255,0.85), transparent),
          radial-gradient(1px 1px at 75% 60%, #fff, transparent),
          radial-gradient(1px 1px at 90% 20%, #fff, transparent),
          radial-gradient(1px 1px at 10% 85%, #fff, transparent);
        background-repeat: no-repeat;
        opacity: 0.7;
      }
      .journey-visual .visual-orb { position: absolute; border-radius: 50%; }
      .journey-visual.earth-orbit .visual-orb {
        width: 240px; height: 240px; right: -50px; top: -50px;
        background: radial-gradient(circle at 35% 30%, rgba(255,255,255,0.30), transparent 22%),
          radial-gradient(circle at 60% 65%, #2f6fd1 0%, #1b4a96 40%, #0e2c63 70%, transparent 100%);
        box-shadow: 0 0 80px rgba(47,111,209,0.35);
      }
      .journey-visual.lunar-flyby .visual-orb {
        width: 200px; height: 200px; right: -30px; top: -40px;
        background: radial-gradient(circle at 35% 32%, #f1e4cb 0%, #c9a368 55%, #8a6a32 100%);
        box-shadow: 0 0 80px rgba(201,163,104,0.40);
      }
    </style>

    <div class="page-body-sm">
      <div style="margin-bottom:32px">
        <h1 class="t-heading" style="margin-bottom:10px">Choose Your Experience</h1>
        <p class="t-sub" style="font-size:0.93rem">
          Select the space experience you'd like to reserve.
        </p>
      </div>

      <!-- Experience Selector -->
      <div style="margin-bottom:28px">
        <div class="t-label" style="margin-bottom:14px">Available Experiences</div>
        ${expCards}
      </div>

      <!-- Journey Detail Card -->
      <div id="journey-detail">
        ${buildDetailCard(selected, selectedKey)}
      </div>

      <button class="btn btn-earth btn-full btn-lg" id="btn-step3">
        Continue
      </button>
    </div>
  `;
}

function buildDetailCard(exp, key) {
  const isPremium = key === 'lunar-flyby';
  return `
    <div class="journey-detail-card">
      <div style="position:relative">
        <div class="journey-visual ${key}"><div class="visual-orb"></div></div>
        <div style="position:absolute;top:14px;left:14px">
          <span style="
            font-family:var(--font-mono);font-size:0.62rem;letter-spacing:0.1em;
            text-transform:uppercase;color:#fff;background:rgba(7,11,22,0.55);
            border-radius:9999px;padding:4px 12px;border:1px solid rgba(255,255,255,0.2)
          ">${exp.icon} ${exp.name}</span>
        </div>
        <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(7,11,22,0.92) 0%,transparent 60%)"></div>
        <div style="position:absolute;bottom:0;left:0;right:0;padding:20px 24px 16px">
          <div style="font-family:var(--font-mono);font-size:0.65rem;letter-spacing:0.1em;text-transform:uppercase;color:${isPremium ? 'var(--ochre-light)' : 'var(--terra-light)'};margin-bottom:4px">
            ${isPremium ? '⭐ Ultra Premium Experience' : 'Earth'}
          </div>
          <div style="font-family:var(--font-display);font-size:1.4rem;font-weight:800;color:#eef2f9">${exp.spacecraft}</div>
          <div style="font-size:0.82rem;color:#93a0b8;margin-top:2px">Operated by Space Tour</div>
        </div>
      </div>

      <!-- Details -->
      <div style="padding:4px 24px 8px">
        <div class="data-row"><span class="key">Experience</span><span class="val">${exp.name}</span></div>
        <div class="data-row"><span class="key">Spacecraft</span><span class="val">${exp.spacecraft}</span></div>
        <div class="data-row"><span class="key">Destination</span><span class="val">${exp.destination}</span></div>
        <div class="data-row"><span class="key">Duration</span><span class="val" style="color:var(--terracotta);font-weight:600">${exp.duration}</span></div>
        <div class="data-row"><span class="key">Est. Availability</span><span class="val" style="font-weight:600">${exp.availability}</span></div>
      </div>

      <!-- Highlights -->
      <div style="padding:0 24px 20px">
        <div class="t-label" style="margin-bottom:10px">Experience Highlights</div>
        <div style="display:flex;flex-direction:column;gap:6px">
          ${exp.highlights.map(h => `<div style="font-size:0.85rem;color:var(--muted);padding:8px 12px;background:var(--surface);border-radius:8px;border-left:3px solid ${isPremium ? 'var(--ochre)' : 'var(--terracotta)'}">&middot; ${h}</div>`).join('')}
        </div>
      </div>
    </div>
  `;
}

export function attachStep3Listeners() {
  document.querySelectorAll('.exp-select-card').forEach(card => {
    card.addEventListener('click', () => {
      const key = card.dataset.exp;
      const exp = EXPERIENCES[key];
      if (!exp) return;
      State.readiness = { ...State.readiness, duration: key };
      State.selectedExperience = exp;
      document.querySelectorAll('.exp-select-card').forEach(c => {
        const ck = c.dataset.exp;
        const ce = EXPERIENCES[ck];
        const isActive = ck === key;
        c.classList.toggle('active', isActive);
        const existing = c.querySelector('[data-highlights]');
        if (existing) existing.remove();
       c.classList.toggle('active', isActive);
      });
      const detail = document.getElementById('journey-detail');
      if (detail) detail.innerHTML = buildDetailCard(exp, key);
    });
  });

  document.getElementById('btn-step3')?.addEventListener('click', () => {
    const key = State.readiness?.duration || 'earth-orbit';
    State.selectedExperience = EXPERIENCES[key];
    navigate('step4', { step: 4 });
  });
}
