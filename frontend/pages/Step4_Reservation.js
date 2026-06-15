// =====================================================
//  Step 4 — Reservation 
// =====================================================
import { API }      from '../services/api.js';
import { navigate, State } from '../app.js';
import { toast }    from '../components/Toast.js';

const EXPERIENCES = {
  'earth-orbit': { name: 'Earth Orbit Experience', duration: '6 Hours', spacecraft: 'M-1', destination: 'Low Earth Orbit', availability: '2045', visual: 'earth' },
  'lunar-flyby': { name: 'Lunar Flyby Expedition', duration: '7–10 Days', spacecraft: 'L-1', destination: 'Lunar Orbit', availability: '2045', visual: 'moon' },
};

function getSelectedExperience() {
  const key = State.readiness?.duration || 'earth-orbit';
  return { key, ...(EXPERIENCES[key] || EXPERIENCES['earth-orbit']) };
}

export function renderStep4() {
  const exp = getSelectedExperience();
  const traveler = State.traveler || {};

  return `
    <style>
      .summary-page { max-width: 600px; margin: 0 auto; padding: 0 24px 80px; }
      .summary-visual {
        border-radius: var(--r-md); overflow: hidden; height: 130px; margin-bottom: 20px;
        position: relative; background: #070b16;
      }
      .summary-visual::before {
        content: '';
        position: absolute; inset: 0;
        background-image:
          radial-gradient(1px 1px at 18% 30%, #fff, transparent),
          radial-gradient(1px 1px at 40% 70%, #fff, transparent),
          radial-gradient(2px 2px at 62% 40%, rgba(255,255,255,0.85), transparent),
          radial-gradient(1px 1px at 85% 65%, #fff, transparent);
        opacity: 0.7;
      }
      .summary-visual .fare-orb {
        position: absolute; right: -30px; top: -30px; width: 170px; height: 170px; border-radius: 50%;
      }
      .summary-visual.earth .fare-orb {
        background: radial-gradient(circle at 35% 30%, rgba(255,255,255,0.30), transparent 22%),
          radial-gradient(circle at 60% 65%, #2f6fd1 0%, #1b4a96 40%, #0e2c63 70%, transparent 100%);
        box-shadow: 0 0 60px rgba(47,111,209,0.35);
      }
      .summary-visual.moon .fare-orb {
        background: radial-gradient(circle at 35% 32%, #f1e4cb 0%, #c9a368 55%, #8a6a32 100%);
        box-shadow: 0 0 60px rgba(201,163,104,0.40);
      }
      .terms-box {
        background: rgba(201,163,104,0.06);
        border: 1.5px solid rgba(201,163,104,0.28);
        border-radius: var(--r-lg);
        padding: 24px;
        margin: 20px 0;
      }
      .terms-box h3 {
        font-family: var(--font-mono);
        font-size: 0.72rem;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--ochre);
        margin-bottom: 14px;
        display: flex; align-items: center; gap: 8px;
      }
      .terms-list {
        list-style: none; padding: 0; display: flex; flex-direction: column; gap: 10px;
      }
      .terms-list li {
        font-size: 0.85rem;
        color: var(--muted);
        line-height: 1.65;
        padding-left: 18px;
        position: relative;
      }
      .terms-list li::before { content: '•'; position: absolute; left: 0; color: var(--ochre); }
    </style>

    <div class="summary-page">
      <div style="margin-bottom:32px;padding-top:8px">
        <h1 class="t-heading" style="margin-bottom:10px">Reservation Summary</h1>
        <p class="t-sub" style="font-size:0.93rem">
          Review your reservation details and confirm your booking.
        </p>
      </div>

      <!-- Visual -->
      <!-- Visual -->
<div class="summary-visual ${exp.visual}">
  <div class="fare-orb"></div>

  <div style="position:absolute;top:14px;left:14px">
    <span style="
      font-family:var(--font-mono);
      font-size:0.62rem;
      letter-spacing:0.1em;
      text-transform:uppercase;
      color:#fff;
      background:rgba(7,11,22,0.55);
      border-radius:9999px;
      padding:4px 12px;
      border:1px solid rgba(255,255,255,0.2)
    ">
      ${exp.name}
    </span>
  </div>

  <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(7,11,22,0.92) 0%,transparent 60%)"></div>

  <div style="position:absolute;bottom:0;left:0;right:0;padding:18px 22px">
    <div style="
      font-family:var(--font-mono);
      font-size:0.65rem;
      letter-spacing:0.1em;
      text-transform:uppercase;
      color:${exp.key === 'lunar-flyby'
        ? 'var(--ochre-light)'
        : 'var(--terra-light)'
      };
      margin-bottom:4px;
    ">${exp.key === 'lunar-flyby'
  ? 'ultra Premium Experience'
  : 'Earth Orbit'
}
    </div>

    <div style="
      font-family:var(--font-display);
      font-size:1.3rem;
      font-weight:800;
      color:#eef2f9;
    ">
      ${exp.spacecraft}
    </div>

    <div style="
      font-size:0.82rem;
      color:#93a0b8;
      margin-top:2px;
    ">
      ${exp.destination}
    </div>
  </div>
</div>

      <!-- Traveler card -->
      <div class="card" style="margin-bottom:20px">
        <div class="t-label" style="margin-bottom:16px">Traveler</div>
        <div class="data-row">
          <span class="key">Name</span>
          <span class="val">${traveler.firstName || ''} ${traveler.lastName || ''}</span>
        </div>
        <div class="data-row">
          <span class="key">Email</span>
          <span class="val">${traveler.email || ''}</span>
        </div>
      </div>

      <!-- Experience card -->
      <div class="card" style="margin-bottom:20px">
        <div class="t-label" style="margin-bottom:16px">Experience</div>
        <div class="data-row">
          <span class="key">Experience</span>
          <span class="val" style="font-weight:700">${exp.name}</span>
        </div>
        <div class="data-row">
          <span class="key">Spacecraft</span>
          <span class="val">${exp.spacecraft}</span>
        </div>
        <div class="data-row">
          <span class="key">Destination</span>
          <span class="val">${exp.destination}</span>
        </div>
        <div class="data-row">
          <span class="key">Duration</span>
          <span class="val" style="color:var(--terracotta);font-weight:600">${exp.duration}</span>
        </div>
        <div class="data-row">
          <span class="key">Est. Availability</span>
          <span class="val">${exp.availability}</span>
        </div>
      </div>


      <button class="btn btn-earth btn-full btn-lg" id="btn-confirm">
        Confirm Reservation
      </button>
    </div>
  `;
}

export function attachStep4Listeners() {
  const exp = getSelectedExperience();

  document.getElementById('btn-confirm')?.addEventListener('click', async () => {
    const btn = document.getElementById('btn-confirm');
    setLoading(btn, true);
    try {
      const confResult = await API.confirmReservation({
        traveler: State.traveler,
        mindset: State.mindset,
        mission: {
          spacecraft:  exp.spacecraft,
          destination: exp.destination,
          duration:    exp.duration,
          experience:  exp.name,
          availability: exp.availability,
        },
      });
      if (confResult.success) {
        toast('Reservation confirmed!', 'success');
        navigate('step5', {
          step: 5,
          reservationId: confResult.reservationId,
          email: State.traveler?.email,
          selectedExperience: exp,
        });
      } else {
        toast(confResult.message || 'Reservation could not be confirmed.', 'error');
      }
    } catch (err) {
      toast('Connection error. Please try again.', 'error');
    } finally {
      setLoading(btn, false);
    }
  });
}

function setLoading(btn, on) {
  if (!btn) return;
  if (on)  { btn._orig = btn.innerHTML; btn.innerHTML = `<div class="spinner"></div> Confirming…`; btn.disabled = true; }
  else     { btn.innerHTML = btn._orig || 'Confirm Reservation'; btn.disabled = false; }
}

