// ====================================================
//  Step 5 — Reservation Confirmed
// ====================================================
import { State } from '../app.js';

export function renderStep5() {
  const resId = State.reservationId || 'ST-100001';
  const email = State.email         || 'your email address';
  const name  = State.traveler?.firstName
    ? `${State.traveler.firstName} ${State.traveler.lastName}`
    : 'Traveler';

  return `
    <style>
      .confirmed-page {
        min-height: 80vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 56px 24px 80px;
      }

      /* Rocket icon */
      .confirmed-icon {
        width: 80px; height: 80px;
        border-radius: 50%;
        background: var(--sage-dim);
        border: 2px solid rgba(31,157,107,0.3);
        display: flex; align-items: center; justify-content: center;
        font-size: 2.2rem;
        margin-bottom: 28px;
        animation: popIn 0.5s cubic-bezier(0.34,1.56,0.64,1);
      }
      @keyframes popIn {
        from { transform: scale(0.4); opacity: 0; }
        to   { transform: scale(1);   opacity: 1; }
      }

      /* Title */
      .confirmed-title {
        font-family: var(--font-display);
        font-size: clamp(1.8rem, 4vw, 2.4rem);
        font-weight: 800;
        color: var(--ink);
        letter-spacing: -0.02em;
        text-align: center;
        margin-bottom: 10px;
      }
      .confirmed-sub {
        font-size: 0.96rem;
        color: var(--muted);
        text-align: center;
        line-height: 1.7;
        max-width: 400px;
        margin-bottom: 40px;
      }

      /* Reservation ID card */
      .res-id-card {
        width: 100%;
        max-width: 460px;
        background: #fff;
        border: 1.5px solid var(--border);
        border-radius: var(--r-xl);
        overflow: hidden;
        margin-bottom: 24px;
        box-shadow: var(--shadow-sm);
      }
      .res-id-header {
        padding: 28px 32px 24px;
        text-align: center;
        background: linear-gradient(135deg, var(--terra-dim) 0%, transparent 100%);
        border-bottom: 1px solid var(--border);
      }
      .res-id-label {
        font-family: var(--font-mono);
        font-size: 0.62rem;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: var(--dim);
        margin-bottom: 10px;
      }
      .res-id-value {
        font-family: var(--font-mono);
        font-size: 1.55rem;
        font-weight: 700;
        color: var(--terracotta);
        letter-spacing: 0.08em;
      }

      /* Blinking confirmed badge */
      .confirmed-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 20px;
        background: rgba(31,157,107,0.1);
        border: 1.5px solid rgba(31,157,107,0.35);
        border-radius: 9999px;
        font-family: var(--font-mono);
        font-size: 0.7rem;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--success);
        font-weight: 700;
        margin-top: 16px;
        animation: badgeGlow 2s ease-in-out infinite;
      }
      .confirmed-blink-dot {
        width: 8px; height: 8px;
        border-radius: 50%;
        background: var(--success);
        animation: blinkGreen 1.1s ease-in-out infinite;
        flex-shrink: 0;
      }
      @keyframes blinkGreen {
        0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(31,157,107,0.6); }
        50%       { opacity: 0.15; box-shadow: 0 0 0 5px rgba(31,157,107,0); }
      }
      @keyframes badgeGlow {
        0%, 100% { box-shadow: 0 0 0 0 rgba(31,157,107,0); border-color: rgba(31,157,107,0.35); }
        50%       { box-shadow: 0 0 12px rgba(31,157,107,0.25); border-color: rgba(31,157,107,0.65); }
      }

      /* Traveler row */
      .res-traveler {
        padding: 16px 32px 20px;
        text-align: center;
      }
      .res-traveler-name {
        font-family: var(--font-display);
        font-size: 1.05rem;
        font-weight: 700;
        color: var(--ink);
      }
      .res-traveler-label {
        font-family: var(--font-mono);
        font-size: 0.6rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--dim);
        margin-bottom: 4px;
      }

      /* Email notice */
      .email-notice {
        width: 100%;
        max-width: 460px;
        display: flex;
        gap: 14px;
        align-items: flex-start;
        padding: 18px 22px;
        background: var(--sage-dim);
        border: 1px solid rgba(31,157,107,0.22);
        border-radius: var(--r-lg);
        font-size: 0.87rem;
        color: var(--muted);
        line-height: 1.6;
        margin-bottom: 32px;
      }
      .email-icon { font-size: 1.3rem; flex-shrink: 0; margin-top: 2px; }

      .cta-row { display: flex; justify-content: center; }

      @media (max-width: 500px) {
        .confirmed-page { padding: 40px 16px 60px; }
        .res-id-value { font-size: 1.25rem; }
      }
    </style>

    <div class="confirmed-page">

      <div class="confirmed-icon">🚀</div>

      <h1 class="confirmed-title">Reservation Confirmed</h1>
      <p class="confirmed-sub">
        Thank you for choosing Space Tour
      </p>

      <!-- Reservation ID card -->
      <div class="res-id-card">
        <div class="res-id-header">
          <div class="res-id-label">Reservation ID</div>
          <div class="res-id-value">${resId}</div>
          <div class="confirmed-badge">
            <span class="confirmed-blink-dot"></span>
            Confirmed
          </div>
        </div>
        <div class="res-traveler">
          <div class="res-traveler-label">Traveler</div>
          <div class="res-traveler-name">${name}</div>
        </div>
      </div>

      <!-- Email notice -->
      <div class="email-notice">
        <span class="email-icon">📧</span>
        <span>
          A confirmation email with your reservation details has been sent to:
          <strong style="color:var(--ink);display:block;margin-top:4px">${email}</strong>
        </span>
      </div>

      <div class="cta-row">
        <button class="btn btn-ghost" onclick="navigate('landing',{step:0})">
          ← Return to Home
        </button>
      </div>

    </div>
  `;
}
