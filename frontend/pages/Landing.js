// =====================================================
//  Landing Page — Space Tour
// =====================================================
export function renderLanding() {
  return `
    <style>
      .landing { min-height: 100vh; display: flex; flex-direction: column; background: var(--soil); }

      /* ─── Nav ─── */
      .l-nav {
        position: absolute; top: 0; left: 0; right: 0; z-index: 20;
        padding: 28px 48px;
        display: flex; align-items: center; justify-content: space-between;
      }
      .l-logo {
        font-family: var(--font-display); font-size: 1.1rem; font-weight: 800;
        color: #eef2f9; display: flex; align-items: center; gap: 11px; letter-spacing: 0.01em;
      }
      .l-logo-ring {
        width: 28px; height: 28px; border-radius: 50%;
        border: 2px solid var(--terracotta);
        display: flex; align-items: center; justify-content: center;
        position: relative; flex-shrink: 0;
      }
      .l-logo-ring::after {
        content: ''; width: 9px; height: 9px; border-radius: 50%; background: var(--terracotta);
      }
      .l-blink {
        width: 7px; height: 7px; border-radius: 50%; background: #22c87a; flex-shrink: 0;
        animation: l-blink 1.2s ease-in-out infinite;
      }
      @keyframes l-blink { 0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(34,200,122,.5)} 50%{opacity:.2;box-shadow:0 0 0 5px rgba(34,200,122,0)} }

      /* ─── Animated border on Begin Reservation ─── */
      .l-btn-primary-wrap {
        position: relative; border-radius: 12px; padding: 2px;
        background: conic-gradient(
          from var(--angle, 0deg),
          #2f6fd1 0%, #7eb8f7 25%, #ffffff 50%, #7eb8f7 75%, #2f6fd1 100%
        );
        animation: spin-border 2.4s linear infinite;
      }
      @property --angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes spin-border { to { --angle: 360deg; } }

      /* ─── Hero ─── */
      .l-hero {
        position: relative; height: 100vh;
        display: flex; align-items: center; overflow: hidden;
      }
      .l-hero-bg {
        position: absolute; inset: 0; z-index: 0;
        background-image: url('assests/earth-view.png');
        background-size: cover; background-position: center 35%;
        filter: brightness(1) saturate(1.2);
        animation: l-hero-bg-float 9s ease-in-out infinite;
      }
      @keyframes l-hero-bg-float {
        0%   { background-position: center 30%; }
        50%  { background-position: center 42%; }
        100% { background-position: center 30%; }
      }
      .l-hero-overlay {
        position: absolute; inset: 0; z-index: 2;
        background: linear-gradient(110deg,
          rgba(3,6,15,0.96) 0%,
          rgba(3,6,15,0.70) 42%,
          rgba(3,6,15,0.18) 100%
        );
      }
      .l-hero-stars {
        position: absolute; inset: 0; z-index: 1; pointer-events: none;
        background-image:
          radial-gradient(1px 1px at 15% 22%, rgba(255,255,255,.7), transparent),
          radial-gradient(1px 1px at 28% 68%, rgba(255,255,255,.5), transparent),
          radial-gradient(2px 2px at 52% 15%, rgba(255,255,255,.6), transparent),
          radial-gradient(1px 1px at 74% 38%, rgba(255,255,255,.7), transparent),
          radial-gradient(1px 1px at 88% 72%, rgba(255,255,255,.4), transparent),
          radial-gradient(1px 1px at 6%  55%, rgba(255,255,255,.5), transparent),
          radial-gradient(2px 2px at 40% 82%, rgba(255,255,255,.5), transparent),
          radial-gradient(1px 1px at 62% 91%, rgba(255,255,255,.4), transparent);
        background-repeat: no-repeat;
      }

      /* ─── METEOR SHOWER (pure CSS) ─── */
      .l-meteors {
        position: absolute; inset: 0; z-index: 3; pointer-events: none; overflow: hidden;
      }
      .l-meteor {
        position: absolute;
        width: 1px;
        border-radius: 999px;
        background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.85) 60%, rgba(255,255,255,0) 100%);
        opacity: 0;
        animation: meteor-fall linear infinite;
        transform-origin: top center;
        transform: rotate(32deg);
      }
      @keyframes meteor-fall {
        0%   { opacity: 0; transform: rotate(32deg) translateY(0);    }
        8%   { opacity: 0.9; }
        85%  { opacity: 0.7; }
        100% { opacity: 0; transform: rotate(32deg) translateY(600px); }
      }

      /* 20 meteors — spread across full screen */
      .l-meteor:nth-child(1)  { left:5%;   top:-2%;  width:1px;   height:28px; animation-duration:1.8s; animation-delay:0s;    }
      .l-meteor:nth-child(2)  { left:12%;  top:5%;   width:1px;   height:20px; animation-duration:1.4s; animation-delay:0.5s;  }
      .l-meteor:nth-child(3)  { left:20%;  top:1%;   width:1.5px; height:32px; animation-duration:2.0s; animation-delay:1.1s;  }
      .l-meteor:nth-child(4)  { left:28%;  top:8%;   width:1px;   height:22px; animation-duration:1.3s; animation-delay:0.2s;  }
      .l-meteor:nth-child(5)  { left:35%;  top:3%;   width:1px;   height:30px; animation-duration:1.7s; animation-delay:1.6s;  }
      .l-meteor:nth-child(6)  { left:42%;  top:12%;  width:1px;   height:18px; animation-duration:1.2s; animation-delay:0.8s;  }
      .l-meteor:nth-child(7)  { left:50%;  top:0%;   width:1px;   height:26px; animation-duration:1.5s; animation-delay:2.2s;  }
      .l-meteor:nth-child(8)  { left:57%;  top:6%;   width:1.5px; height:34px; animation-duration:1.9s; animation-delay:1.4s;  }
      .l-meteor:nth-child(9)  { left:64%;  top:2%;   width:1px;   height:20px; animation-duration:1.4s; animation-delay:0.1s;  }
      .l-meteor:nth-child(10) { left:71%;  top:9%;   width:1px;   height:28px; animation-duration:1.6s; animation-delay:2.0s;  }
      .l-meteor:nth-child(11) { left:78%;  top:4%;   width:1px;   height:18px; animation-duration:1.2s; animation-delay:2.8s;  }
      .l-meteor:nth-child(12) { left:85%;  top:14%;  width:1px;   height:24px; animation-duration:1.5s; animation-delay:0.6s;  }
      .l-meteor:nth-child(13) { left:92%;  top:7%;   width:1px;   height:30px; animation-duration:1.7s; animation-delay:1.0s;  }
      .l-meteor:nth-child(14) { left:8%;   top:20%;  width:1px;   height:16px; animation-duration:1.1s; animation-delay:2.5s;  }
      .l-meteor:nth-child(15) { left:18%;  top:25%;  width:1.5px; height:28px; animation-duration:1.8s; animation-delay:1.5s;  }
      .l-meteor:nth-child(16) { left:32%;  top:18%;  width:1px;   height:20px; animation-duration:1.4s; animation-delay:3.1s;  }
      .l-meteor:nth-child(17) { left:48%;  top:22%;  width:1px;   height:26px; animation-duration:1.6s; animation-delay:0.3s;  }
      .l-meteor:nth-child(18) { left:63%;  top:17%;  width:1px;   height:18px; animation-duration:1.3s; animation-delay:1.9s;  }
      .l-meteor:nth-child(19) { left:76%;  top:28%;  width:1px;   height:22px; animation-duration:1.5s; animation-delay:2.4s;  }
      .l-meteor:nth-child(20) { left:90%;  top:22%;  width:1px;   height:24px; animation-duration:1.7s; animation-delay:0.7s;  }

      .l-hero-content {
        position: relative; z-index: 5;
        padding: 148px 48px 96px; max-width: 640px;
        display: flex; flex-direction: column; gap: 0;
      }

      /* ─── Badge ─── */
      .l-open-badge {
        display: inline-flex; align-items: center; gap: 8px;
        font-family: var(--font-mono); font-size: 0.58rem;
        letter-spacing: 0.16em; text-transform: uppercase;
        color: #d4f5e8;
        background: rgba(31,157,107,0.18);
        border: 1px solid rgba(34,200,122,0.40);
        border-radius: 9999px; padding: 5px 14px;
        margin-bottom: 20px; width: fit-content;
      }
      .l-open-dot {
        width: 6px; height: 6px; border-radius: 50%;
        background: #22c87a; flex-shrink: 0;
        animation: l-blink 1.2s ease-in-out infinite;
      }

      /* ─── Headline ─── */
      .l-h1 {
        font-family: var(--font-display);
        font-size: clamp(3.4rem, 6.5vw, 6rem);
        font-weight: 800; line-height: 0.96;
        letter-spacing: -0.025em; color: #ffffff;
        text-shadow: 0 2px 24px rgba(0,0,0,0.55);
        margin-bottom: 6px;
      }
      .l-h1-italic {
        font-family: var(--font-display);
        font-size: clamp(1.3rem, 2.8vw, 2rem);
        font-weight: 700; font-style: italic;
        color: #ffd9a0; letter-spacing: 0.01em;
        text-shadow: 0 2px 16px rgba(0,0,0,0.55);
        margin-bottom: 28px; display: block;
      }
      .l-subtitle {
        font-family: var(--font-body); font-size: 1rem;
        line-height: 1.82; color: rgba(255,255,255,0.92);
        text-shadow: 0 1px 12px rgba(0,0,0,0.55);
        max-width: 440px; font-weight: 400; margin-bottom: 44px;
      }

      /* ─── CTA ─── */
      .l-cta-row { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
      .l-btn-primary {
        display: inline-flex; align-items: center; gap: 10px;
        padding: 15px 34px;
        background: var(--terracotta); color: #fff;
        font-family: var(--font-body); font-size: 0.95rem; font-weight: 700;
        border: none; border-radius: 10px; cursor: pointer;
        box-shadow: 0 4px 24px rgba(47,111,209,.45);
        transition: background .2s, transform .15s, box-shadow .2s;
        letter-spacing: 0.01em; position: relative; overflow: hidden;
      }
      .l-btn-primary::after {
        content: ''; position: absolute; inset: 0;
        background: linear-gradient(135deg, rgba(255,255,255,.12) 0%, transparent 60%);
        pointer-events: none;
      }
      .l-btn-primary:hover { background: #2457aa; transform: translateY(-2px); box-shadow: 0 8px 32px rgba(47,111,209,.55); }
      .l-btn-secondary {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 14px 28px;
        background: rgba(226,197,148,0.15); color: #ffd9a0;
        font-family: var(--font-body); font-size: 0.92rem; font-weight: 600;
        border: 1.5px solid rgba(226,197,148,0.40); border-radius: 10px; cursor: pointer;
        transition: border-color .2s, background .2s, transform .15s;
        backdrop-filter: blur(6px);
      }
      .l-btn-secondary:hover {
        border-color: rgba(226,197,148,0.65);
        background: rgba(226,197,148,0.25);
        transform: translateY(-2px);
      }
      .l-cta-note {
        font-family: var(--font-mono); font-size: 0.67rem;
        color: rgba(255,255,255,0.55); letter-spacing: 0.07em;
        text-shadow: 0 1px 8px rgba(0,0,0,0.5); margin-top: 18px;
      }

      /* ─── Footer ─── */
      .l-footer {
        background: var(--soil); border-top: 1px solid rgba(238,242,249,.07);
        padding: 26px 48px;
        display: flex; align-items: center; justify-content: space-between;
        flex-wrap: wrap; gap: 10px;
      }
      .l-footer-brand {
        font-family: var(--font-display); font-weight: 800; font-size: 0.92rem;
        color: #eef2f9; display: flex; align-items: center; gap: 10px;
      }
      .l-footer-note {
        font-family: var(--font-mono); font-size: 0.60rem;
        letter-spacing: 0.10em; text-transform: uppercase; color: #3a4562;
      }

      /* ─── Responsive ─── */
      @media (max-width: 768px) {
        .l-nav { padding: 22px 24px; }
        .l-hero-content { padding: 130px 24px 72px; }
        .l-footer { padding: 22px 24px; justify-content: center; text-align: center; }
      }
      @media (max-width: 480px) {
        .l-nav { padding: 18px 16px; }
        .l-hero-content { padding: 110px 16px 56px; }
      }
    </style>

    <div class="landing">
      <nav class="l-nav">
        <div class="l-logo">
          <div class="l-logo-ring"></div>
          Space Tour
        </div>
      </nav>

      <section class="l-hero">
        <div class="l-hero-bg"></div>
        <div class="l-hero-overlay"></div>
        <div class="l-hero-stars"></div>

        <!-- Pure CSS meteor shower — no JS needed -->
        <div class="l-meteors">
          <div class="l-meteor"></div>
          <div class="l-meteor"></div>
          <div class="l-meteor"></div>
          <div class="l-meteor"></div>
          <div class="l-meteor"></div>
          <div class="l-meteor"></div>
          <div class="l-meteor"></div>
          <div class="l-meteor"></div>
          <div class="l-meteor"></div>
          <div class="l-meteor"></div>
          <div class="l-meteor"></div>
          <div class="l-meteor"></div>
          <div class="l-meteor"></div>
          <div class="l-meteor"></div>
          <div class="l-meteor"></div>
          <div class="l-meteor"></div>
          <div class="l-meteor"></div>
          <div class="l-meteor"></div>
          <div class="l-meteor"></div>
          <div class="l-meteor"></div>
        </div>

        <div class="l-hero-content">
          <div class="l-open-badge">
            <span class="l-open-dot"></span>
            Reservations Now Open
          </div>
          <h1 class="l-h1">Experience<br>Earth</h1>
          <span class="l-h1-italic">Like Never Before</span>
          <p class="l-subtitle">
            Space Tour offers early access to future space tourism experiences —
            from a 6-hour Earth orbit experience to an ultra-premium journey around the Moon.
          </p>
          <div class="l-cta-row">
            <div class="l-btn-primary-wrap">
              <button class="l-btn-primary" id="btn-reserve">Begin Reservation →</button>
            </div>
            <button class="l-btn-secondary" id="btn-explore">Explore Experiences</button>
          </div>
          <p class="l-cta-note">Takes less than 3 minutes</p>
        </div>
      </section>
    </div>
  `;
}
