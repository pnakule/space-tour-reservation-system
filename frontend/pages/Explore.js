// =====================================================
//  Explore — Space Knowledge Page
//  Space visuals, Earth & Moon science
//  No reservation content on this page.
// =====================================================
export function renderExplore() {
  return `
    <style>
      .xp { min-height: 100vh; display: flex; flex-direction: column; background: var(--soil); color: #eef2f9; }
      /* ── Nav ── */
      .xp-nav {
        position: sticky; top: 0; z-index: 50;
        padding: 18px 48px;
        display: flex; align-items: center; justify-content: space-between;
        background: rgba(3,6,15,.92);
        backdrop-filter: blur(14px);
        border-bottom: 1px solid rgba(255,255,255,.06);
      }
      .xp-logo {
        font-family: var(--font-display); font-size: 1.05rem; font-weight: 800;
        color: #eef2f9; display: flex; align-items: center; gap: 10px; cursor: pointer;
      }
      .xp-logo-ring {
        width: 24px; height: 24px; border-radius: 50%;
        border: 2px solid var(--terracotta);
        display: flex; align-items: center; justify-content: center;
      }
      .xp-logo-ring::after { content:''; width:7px; height:7px; border-radius:50%; background:var(--terracotta); }
      .xp-back {
        display: inline-flex; align-items: center; gap: 7px;
        padding: 8px 18px;
        background: transparent; color: rgba(238,242,249,.8);
        font-family: var(--font-body); font-size: 0.85rem; font-weight: 600;
        border: 1px solid rgba(238,242,249,.22); border-radius: 8px; cursor: pointer;
        transition: border-color .2s, background .2s;
      }
      .xp-back:hover { border-color: rgba(238,242,249,.5); background: rgba(238,242,249,.07); }
      /* ── Cinematic hero ── */
      .xp-hero {
        position: relative; height: 520px; overflow: hidden;
        display: flex; align-items: flex-end;
      }
      .xp-hero-canvas {
        position: absolute; inset: 0; background: #020610;
      }
      /* Deep space gradient + star layer */
      .xp-hero-canvas::before {
        content: ''; position: absolute; inset: 0;
        background:
          radial-gradient(ellipse 80% 60% at 50% 100%, rgba(20,50,130,.55) 0%, transparent 70%),
          radial-gradient(ellipse 40% 50% at 80% 40%, rgba(201,163,104,.08) 0%, transparent 60%);
      }
      .xp-hero-canvas::after {
        content: ''; position: absolute; inset: 0;
        background-image:
          radial-gradient(1.5px 1.5px at 5%  8%,  rgba(255,255,255,.9), transparent),
          radial-gradient(1px   1px   at 18% 22%, rgba(255,255,255,.7), transparent),
          radial-gradient(2px   2px   at 32% 12%, rgba(255,255,255,.8), transparent),
          radial-gradient(1px   1px   at 45% 35%, rgba(255,255,255,.6), transparent),
          radial-gradient(1.5px 1.5px at 58% 18%, rgba(255,255,255,.85),transparent),
          radial-gradient(1px   1px   at 70% 8%,  rgba(255,255,255,.7), transparent),
          radial-gradient(2px   2px   at 82% 28%, rgba(255,255,255,.6), transparent),
          radial-gradient(1px   1px   at 92% 15%, rgba(255,255,255,.8), transparent),
          radial-gradient(1px   1px   at 12% 52%, rgba(255,255,255,.5), transparent),
          radial-gradient(1.5px 1.5px at 27% 68%, rgba(255,255,255,.6), transparent),
          radial-gradient(1px   1px   at 63% 55%, rgba(255,255,255,.55),transparent),
          radial-gradient(1px   1px   at 88% 62%, rgba(255,255,255,.65),transparent);
        background-repeat: no-repeat;
      }
      .xp-hero-earth-img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        border-radius: 0;
        object-fit: cover;
        object-position: center center;
        z-index: 1;
        opacity: 0.55;
      }
      .xp-hero-overlay {
        position: absolute; inset: 0;
        background: linear-gradient(to top, rgba(3,6,15,1) 0%, rgba(3,6,15,.35) 55%, transparent 100%);
      }
      .xp-hero-content {
        position: relative; z-index: 2; padding: 0 52px 48px;
      }
      .xp-hero-eyebrow {
        font-family: var(--font-mono); font-size: 0.60rem;
        letter-spacing: .20em; text-transform: uppercase;
        color: var(--ochre-light); margin-bottom: 12px;
        display: flex; align-items: center; gap: 9px;
      }
      .xp-hero-eyebrow-dot {
        width: 5px; height: 5px; border-radius: 50%;
        background: var(--ochre-light); display: inline-block;
        animation: xp-blink 1.3s ease-in-out infinite;
      }
      @keyframes xp-blink { 0%,100%{opacity:1} 50%{opacity:.15} }
      .xp-hero-title {
        font-family: var(--font-display);
        font-size: clamp(2.2rem, 5vw, 3.8rem);
        font-weight: 800; color: #eef2f9;
        letter-spacing: -0.02em; line-height: 1.05;
      }
      .xp-hero-title em { font-style: italic; color: var(--ochre-light); }
      /* ── Body ── */
      .xp-body { padding: 64px 48px 80px; max-width: 1120px; margin: 0 auto; width: 100%; }
      /* section divider label */
      .xp-label {
        font-family: var(--font-mono); font-size: 0.60rem;
        letter-spacing: .18em; text-transform: uppercase;
        color: rgba(226,197,148,.55);
        display: flex; align-items: center; gap: 14px;
        margin-bottom: 28px;
      }
      .xp-label::after { content:''; flex:1; height:1px; background: rgba(255,255,255,.07); }
      /* ── Intro two-col ── */
      .xp-intro {
        display: grid; grid-template-columns: 1fr 1fr; gap: 40px;
        margin-bottom: 64px;
      }
      .xp-intro-text h2 {
        font-family: var(--font-display);
        font-size: clamp(1.6rem, 3vw, 2.2rem);
        font-weight: 800; color: #eef2f9;
        letter-spacing: -0.015em; line-height: 1.1;
        margin-bottom: 18px;
      }
      .xp-intro-text p {
        font-size: 0.95rem; line-height: 1.82;
        color: rgba(169,183,212,.85);
        font-weight: 300; margin-bottom: 14px;
      }
      .xp-stat-grid {
        display: grid; grid-template-columns: 1fr 1fr; gap: 14px;
      }
      .xp-stat-box {
        background: rgba(14,24,48,.65);
        border: 1px solid rgba(255,255,255,.07);
        border-radius: 12px; padding: 18px 20px;
        display: flex; flex-direction: column; gap: 4px;
      }
      .xp-stat-k {
        font-family: var(--font-mono); font-size: 0.54rem;
        letter-spacing: .15em; text-transform: uppercase;
        color: rgba(169,183,212,.5);
      }
      .xp-stat-v {
        font-family: var(--font-display); font-size: 1.6rem;
        color: #eef2f9; line-height: 1; font-weight: 700;
      }
      .xp-stat-s { font-size: 0.76rem; color: rgba(169,183,212,.6); margin-top: 2px; }
      /* ── Feature strip ── */
      .xp-feature {
        display: grid; grid-template-columns: 1fr 1fr; gap: 0;
        border-radius: 20px; overflow: hidden;
        margin-bottom: 28px;
        border: 1px solid rgba(255,255,255,.07);
      }
      .xp-feature.reverse { direction: rtl; }
      .xp-feature.reverse > * { direction: ltr; }
      .xp-feature-visual {
        min-height: 320px; position: relative; overflow: hidden;
        background: #020610;
        display: flex; align-items: center; justify-content: center;
      }
      .xp-feature-visual.earth-vis {
        background: radial-gradient(ellipse at 60% 50%, rgba(20,55,150,.45) 0%, #020610 70%);
      }
      .xp-feature-visual.moon-vis {
        background: radial-gradient(ellipse at 40% 50%, rgba(100,70,20,.28) 0%, #020610 70%);
      }
      .xp-fv-img {
        width: 300px; height: 300px;
        border-radius: 50%;
        object-fit: cover;
        position: relative; z-index: 1;
        mask-image: radial-gradient(circle at 50% 50%, black 55%, transparent 78%);
        -webkit-mask-image: radial-gradient(circle at 50% 50%, black 55%, transparent 78%);
      }
      .xp-fv-stars {
        position:absolute; inset:0;
        background-image:
          radial-gradient(1px 1px at 8% 15%,  rgba(255,255,255,.8),transparent),
          radial-gradient(1px 1px at 20% 70%,  rgba(255,255,255,.6),transparent),
          radial-gradient(1.5px 1.5px at 38% 10%,rgba(255,255,255,.75),transparent),
          radial-gradient(1px 1px at 75% 25%,  rgba(255,255,255,.7),transparent),
          radial-gradient(1px 1px at 88% 80%,  rgba(255,255,255,.55),transparent),
          radial-gradient(1px 1px at 55% 88%,  rgba(255,255,255,.5),transparent);
        background-repeat:no-repeat;
      }
      .xp-feature-text {
        background: rgba(8,14,30,.88); 
        padding: 44px 44px;
        display: flex; flex-direction: column; justify-content: center; gap: 18px;
      }
      .xp-feature-tag {
        font-family: var(--font-mono); font-size: 0.58rem;
        letter-spacing: .16em; text-transform: uppercase;
        display: inline-flex; align-items: center; gap: 7px;
        width: fit-content; padding: 5px 13px; border-radius: 9999px;
      }
      .xp-feature-tag.earth-tag {
        color: var(--terra-light);
        background: rgba(47,111,209,.12); border: 1px solid rgba(47,111,209,.30);
      }
      .xp-feature-tag.moon-tag {
        color: var(--ochre-light);
        background: rgba(201,163,104,.10); border: 1px solid rgba(201,163,104,.28);
      }
      .xp-feature-h {
        font-family: var(--font-display);
        font-size: clamp(1.5rem, 2.8vw, 2rem);
        font-weight: 800; color: #eef2f9;
        letter-spacing: -0.015em; line-height: 1.1;
      }
      .xp-feature-p {
        font-size: 0.92rem; line-height: 1.82;
        color: rgba(169,183,212,.82); font-weight: 300;
      }
      .xp-fact-list { display: flex; flex-direction: column; gap: 8px; margin-top: 4px; }
      .xp-fact {
        display: flex; align-items: flex-start; gap: 10px;
        font-size: 0.86rem; color: rgba(169,183,212,.75); line-height: 1.55;
      }
      .xp-fact-dot {
        width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; margin-top: 5px;
      }
      .earth-tag-dot { background: var(--terracotta); }
      .moon-tag-dot  { background: var(--ochre); }
      /* ── Science cards ── */
      .xp-science-grid {
        display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px;
        margin-bottom: 64px;
      }
      .xp-sci-card {
        background: rgba(12,20,42,.72);
        border: 1px solid rgba(255,255,255,.07);
        border-radius: 14px; padding: 26px 22px;
        display: flex; flex-direction: column; gap: 12px;
        transition: border-color .2s, background .2s;
      }
      .xp-sci-card:hover { border-color: rgba(226,197,148,.25); background: rgba(18,28,56,.80); }
      .xp-sci-icon { font-size: 1.8rem; }
      .xp-sci-title {
        font-family: var(--font-display); font-size: 1rem; font-weight: 700; color: #eef2f9;
      }
      .xp-sci-body { font-size: 0.84rem; color: rgba(169,183,212,.78); line-height: 1.72; font-weight: 300; }
      /* ── Footer ── */
      .xp-footer {
        background: rgba(2,4,12,.9);
        border-top: 1px solid rgba(255,255,255,.05);
        padding: 24px 48px;
        display: flex; align-items: center; justify-content: space-between;
        flex-wrap: wrap; gap: 10px; margin-top: auto;
      }
      .xp-footer-brand {
        font-family: var(--font-display); font-weight: 800; font-size: .9rem;
        color: #eef2f9; display: flex; align-items: center; gap: 10px;
      }
      .xp-footer-note {
        font-family: var(--font-mono); font-size: .58rem;
        letter-spacing: .10em; text-transform: uppercase;
        color: rgba(100,113,150,.4);
      }
      /* ── Responsive ── */
      @media (max-width: 900px) {
        .xp-intro { grid-template-columns: 1fr; }
        .xp-science-grid { grid-template-columns: 1fr 1fr; }
        .xp-feature { grid-template-columns: 1fr; }
        .xp-feature-visual { min-height: 260px; }
        .xp-feature.reverse { direction: ltr; }
      }
      @media (max-width: 640px) {
        .xp-nav { padding: 16px 20px; }
        .xp-hero { height: 400px; }
        .xp-hero-earth-img { width: 100%; height: 100%; right: unset; bottom: unset; }
        .xp-hero-content { padding: 0 20px 36px; }
        .xp-body { padding: 44px 20px 60px; }
        .xp-science-grid { grid-template-columns: 1fr; }
        .xp-feature-text { padding: 28px 24px; }
        .xp-footer { padding: 20px; justify-content: center; text-align: center; }
        .xp-fv-img { width: 200px; height: 200px; }
      }
    </style>
    <div class="xp">
      <!-- Nav -->
      <nav class="xp-nav">
        <div class="xp-logo" id="xp-logo">
          <div class="xp-logo-ring"></div>
          Space Tour
        </div>
        <button class="xp-back" id="xp-back">← Back to Home</button>
      </nav>
      <!-- Cinematic hero -->
      <div class="xp-hero">
        <div class="xp-hero-canvas"></div>
        <!-- Earth from Apollo 17 — public domain NASA image -->
        <img
          class="xp-hero-earth-img"
          src="assests/earth.png"
          alt="Earth from space"
        />
        <div class="xp-hero-overlay"></div>
        <div class="xp-hero-content">
          <div class="xp-hero-eyebrow">
            <span class="xp-hero-eyebrow-dot"></span>
            Earth · Moon · Deep Space
          </div>
          <h1 class="xp-hero-title">
            Looking at Earth<br>from <em>out there</em>
          </h1>
        </div>
      </div>
      <!-- Body -->
      <div class="xp-body">
        <!-- Intro -->
        <div class="xp-label">The Overview Effect</div>
        <div class="xp-intro">
          <div class="xp-intro-text">
            <h2>What it means to leave the atmosphere</h2>
            <p>
              From Low Earth Orbit, roughly 400 km above the surface, you can see the entire curvature
              of the planet in a single glance. The atmosphere — the thin blue line that makes all life
              possible — is shockingly fragile. Astronauts describe a fundamental shift in perception
              called the Overview Effect: the borders between countries vanish, the scale of the ocean
              becomes visceral, and the silence is absolute.
            </p>
            <p>
              Humans have experienced this view fewer than 700 times in history. At orbital velocity
              — roughly 28,000 km/h — you circle the entire Earth in 90 minutes and witness 16 sunrises
              and sunsets every single day.
            </p>
          </div>
          <div class="xp-stat-grid">
            <div class="xp-stat-box">
              <span class="xp-stat-k">Orbital Altitude</span>
              <span class="xp-stat-v">~400 km</span>
              <span class="xp-stat-s">Low Earth Orbit</span>
            </div>
            <div class="xp-stat-box">
              <span class="xp-stat-k">Orbital Speed</span>
              <span class="xp-stat-v">28,000</span>
              <span class="xp-stat-s">km/h around Earth</span>
            </div>
            <div class="xp-stat-box">
              <span class="xp-stat-k">Orbit Duration</span>
              <span class="xp-stat-v">90 min</span>
              <span class="xp-stat-s">One full orbit</span>
            </div>
            <div class="xp-stat-box">
              <span class="xp-stat-k">Sunrises / Day</span>
              <span class="xp-stat-v">16</span>
              <span class="xp-stat-s">From orbit</span>
            </div>
          </div>
        </div>
        <!-- Earth Orbit feature -->
        <div class="xp-label">Earth from Orbit</div>
        <div class="xp-feature" style="margin-bottom:28px">
          <div class="xp-feature-visual earth-vis">
            <div class="xp-fv-stars"></div>
            <!-- Earth from orbit — public domain NASA image -->
            <img
              class="xp-fv-img"
              src="assests/earth-1.webp"
              alt="Earth from orbit"
            />
          </div>
          <div class="xp-feature-text">
            <div class="xp-feature-tag earth-tag">🌍 Low Earth Orbit</div>
            <h3 class="xp-feature-h">Earth</h3>
            <p class="xp-feature-p">
              Low Earth Orbit sits between 160 and 2,000 km above the surface. At 400 km —
              the altitude of the International Space Station — you travel fast enough that
              gravity bends your path into a continuous fall around the planet, creating
              perpetual weightlessness.
            </p>
            <div class="xp-fact-list">
              <div class="xp-fact"><span class="xp-fact-dot earth-tag-dot"></span>Earth covers roughly 50% of your field of view from 400 km</div>
              <div class="xp-fact"><span class="xp-fact-dot earth-tag-dot"></span>The Sahara, Amazon, Himalayas — all visible in a single orbit pass</div>
              <div class="xp-fact"><span class="xp-fact-dot earth-tag-dot"></span>City lights are visible from orbit on the night side of the planet</div>
              <div class="xp-fact"><span class="xp-fact-dot earth-tag-dot"></span>Thunderstorm systems look like slow-motion light pulses from above</div>
            </div>
          </div>
        </div>
        <!-- Moon Flyby feature -->
        <div class="xp-label">Lunar Flyby</div>
        <div class="xp-feature reverse" style="margin-bottom:64px">
          <div class="xp-feature-visual moon-vis">
            <div class="xp-fv-stars"></div>
            <!-- Full Moon — public domain Wikimedia image -->
            <img
              class="xp-fv-img"
              src="assests/moon.jpg"
              alt="The Moon from space"
            />
          </div>
          <div class="xp-feature-text">
            <div class="xp-feature-tag moon-tag">🌕 Lunar Orbit</div>
            <h3 class="xp-feature-h">Moon</h3>
            <p class="xp-feature-p">
              The Moon sits 384,400 km from Earth — roughly 1.3 light-seconds away. Flying
              around it means crossing the boundary where Earth's gravity yields to the Moon's.
              From low lunar orbit, the surface fills your view: craters billions of years old,
              highlands, and the vast dark plains called maria formed by ancient volcanic flows.
            </p>
            <div class="xp-fact-list">
              <div class="xp-fact"><span class="xp-fact-dot moon-tag-dot"></span>The lunar far side was first seen by humans in 1968 (Apollo 8)</div>
              <div class="xp-fact"><span class="xp-fact-dot moon-tag-dot"></span>The Moon has no atmosphere — craters are perfectly preserved for billions of years</div>
              <div class="xp-fact"><span class="xp-fact-dot moon-tag-dot"></span>From lunar orbit, Earth appears four times larger than the Moon does from Earth</div>
              <div class="xp-fact"><span class="xp-fact-dot moon-tag-dot"></span>Surface temperatures range from −173°C (night) to +127°C (day)</div>
            </div>
          </div>
        </div>
        <!-- Science cards -->
        <div class="xp-label">Space Science</div>
        <div class="xp-science-grid">
          <div class="xp-sci-card">
            <div class="xp-sci-icon">🚀</div>
            <div class="xp-sci-title">Escaping the Atmosphere</div>
            <div class="xp-sci-body">
              To reach orbit, a spacecraft must accelerate to around 7.9 km/s — orbital velocity.
              At this speed, the craft falls toward Earth at the same rate the planet's surface
              curves away, creating continuous free-fall: weightlessness.
            </div>
          </div>
          <div class="xp-sci-card">
            <div class="xp-sci-icon">🌌</div>
            <div class="xp-sci-title">The Silence of Space</div>
            <div class="xp-sci-body">
              Space is not empty — it contains gas, dust, and radiation — but it is far too thin
              to carry sound. Without air molecules to vibrate, there is no medium for acoustic
              waves. The only sounds in a spacecraft come from machinery inside the pressurised cabin.
            </div>
          </div>
          <div class="xp-sci-card">
            <div class="xp-sci-icon">🌒</div>
            <div class="xp-sci-title">Why the Moon Doesn't Fall</div>
            <div class="xp-sci-body">
              Like an orbital spacecraft, the Moon is perpetually falling toward Earth — it simply
              moves sideways fast enough that it keeps missing. This balance between gravitational
              pull and orbital velocity has kept the Moon locked in its current orbit for 4.5 billion years.
            </div>
          </div>
          <div class="xp-sci-card">
            <div class="xp-sci-icon">🌠</div>
            <div class="xp-sci-title">Stars Without Atmosphere</div>
            <div class="xp-sci-body">
              Earth's atmosphere blurs and scatters starlight, making stars twinkle.
              From space, stars appear as fixed, sharp points of intense light — thousands more
              visible than from any ground-based observatory, in colours invisible to Earth-bound eyes.
            </div>
          </div>
          <div class="xp-sci-card">
            <div class="xp-sci-icon">⚡</div>
            <div class="xp-sci-title">Radiation in Space</div>
            <div class="xp-sci-body">
              Earth's magnetic field deflects most cosmic radiation. Beyond it, astronauts are
              exposed to higher radiation levels from solar wind and galactic cosmic rays. Mission
              duration, altitude, and solar activity all determine total exposure for any given trip.
            </div>
          </div>
          <div class="xp-sci-card">
            <div class="xp-sci-icon">🌍</div>
            <div class="xp-sci-title">Earthrise</div>
            <div class="xp-sci-body">
              When Apollo 8 orbited the Moon in 1968, astronaut Bill Anders photographed Earth
              rising above the lunar horizon. That image — Earthrise — is credited with helping
              launch the environmental movement and permanently changing how humanity sees its home.
            </div>
          </div>
        </div>
      </div>
      <!-- Footer -->
      <footer class="xp-footer">
        <div class="xp-footer-brand">
          <div class="xp-logo-ring"></div>
          Space Tour
        </div>
        <p class="xp-footer-note">© Space Tour · Space Exploration Reference</p>
      </footer>
    </div>
  `;
}
export function initExplore() {
  document.getElementById('xp-back')?.addEventListener('click', () => {
    window.navigate('landing', { step: 0 });
  });
  document.getElementById('xp-logo')?.addEventListener('click', () => {
    window.navigate('landing', { step: 0 });
  });
  return () => {};
}