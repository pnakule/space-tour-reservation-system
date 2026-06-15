// =====================================================
//  Step 1 — Traveler Information  (backend logic- verify naem email)
// =====================================================
import { API }      from '../services/api.js';
import { navigate } from '../app.js';
import { toast }    from '../components/Toast.js';

export function renderStep1() {
  return `
    <div class="page-body-sm">

      <div style="margin-bottom:36px">
        <h1 class="t-heading" style="margin-bottom:10px">Traveler Information</h1>
        <p class="t-sub" style="font-size:0.93rem">
          Please provide your information to begin your Space Tour reservation.
        </p>
      </div>

      <div class="card" style="margin-bottom:24px">
        <form id="form-step1" novalidate>

          <div class="grid-2" style="margin-bottom:20px">
            <div class="form-group">
              <label class="form-label" for="firstName">First Name <span class="required">*</span></label>
              <input class="form-input" type="text" id="firstName" name="firstName" placeholder="e.g. Sarah" autocomplete="given-name" required />
              <span class="form-error" id="err-firstName"></span>
            </div>
            <div class="form-group">
              <label class="form-label" for="lastName">Last Name <span class="required">*</span></label>
              <input class="form-input" type="text" id="lastName" name="lastName" placeholder="e.g. Okafor" autocomplete="family-name" required />
              <span class="form-error" id="err-lastName"></span>
            </div>
          </div>

          <div class="form-group" style="margin-bottom:28px">
            <label class="form-label" for="email">Email Address <span class="required">*</span></label>
            <input class="form-input" type="email" id="email" name="email" placeholder="your@email.com" autocomplete="email" required />
            <span class="form-error" id="err-email"></span>
            <span class="form-hint">Your reservation confirmation will be sent here.</span>
          </div>

          <!-- Terms checkbox -->
          <div class="card-surface" style="margin-bottom:24px">
            <label class="checkbox-wrap" id="terms-wrap">
              <input type="checkbox" id="terms" name="terms" />
              <span>
                I confirm that the information provided is accurate and I agree to the
                <a href="#" id="terms-link">Terms and Conditions</a>.
              </span>
            </label>
            <span class="form-error" id="err-terms" style="margin-top:8px;display:block"></span>
          </div>

          <button class="btn btn-earth btn-full btn-lg" type="submit" id="btn-step1">
            Continue
          </button>

        </form>
      </div>
    </div>
  `;
}

export function attachStep1Listeners() {
  const form = document.getElementById('form-step1');
  const btn  = document.getElementById('btn-step1');

  document.getElementById('terms-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    openTermsPage();
  });

  ['firstName','lastName','email'].forEach(id => {
    document.getElementById(id)?.addEventListener('blur', () => validateField(id));
    document.getElementById(id)?.addEventListener('input', () => clearError(id));
  });

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const firstName = v('firstName');
    const lastName  = v('lastName');
    const email     = v('email');
    const terms     = document.getElementById('terms')?.checked;

    let ok = true;
    if (!firstName || firstName.length < 1) { setError('firstName', 'First name must be at least 1 characters.'); ok = false; }
    if (!lastName  || lastName.length < 1)  { setError('lastName',  'Last name must be at least 1 characters.');  ok = false; }
    if (!isValidEmail(email))               { setError('email',     'Enter a valid email address.');               ok = false; }
    if (!terms)                             { setError('terms',     'You must accept the Terms and Conditions.');  ok = false; }
    if (!ok) return;

    setLoading(btn, true);
    try {
      const result = await API.validateTraveler({ firstName, lastName, email });
      if (!result.valid) {
        setError(result.field || 'email', result.message);
        toast(result.message, 'error');
        return;
      }
      markValid('firstName'); markValid('lastName'); markValid('email');
      toast('Information verified. Proceeding…', 'success');
      setTimeout(() => {
        navigate('step2', { step: 2, traveler: { firstName, lastName, email } });
      }, 600);
    } catch (err) {
      toast('Connection error. Please try again.', 'error');
    } finally {
      setLoading(btn, false);
    }
  });
}

function openTermsPage() {
  const overlay = document.createElement('div');
  overlay.id = 'terms-overlay';
  overlay.style.cssText = `
    position:fixed;inset:0;z-index:9999;background:var(--cream);
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    padding:40px 24px;text-align:center;overflow-y:auto;
  `;
  overlay.innerHTML = `
    <div style="max-width:600px;margin:0 auto">
      <div style="font-size:3.5rem;margin-bottom:20px">🚀</div>
      <h1 style="font-family:var(--font-display);font-size:2rem;font-weight:800;color:var(--ink);margin-bottom:12px;letter-spacing:-0.02em">
        Terms & Conditions
      </h1>
      <p style="font-size:1rem;color:var(--muted);margin-bottom:8px;font-weight:600">SPACE TOUR · SPACE TOURISM</p>
      <div style="background:var(--surface);border:1.5px solid var(--border);border-radius:14px;padding:28px 32px;margin:28px 0;text-align:left">
        <p style="font-size:0.82rem;color:var(--dim);text-transform:uppercase;letter-spacing:0.1em;font-weight:700;margin-bottom:16px">⚠ Important Notice</p>
        <ul style="margin-top:12px;padding-left:20px;font-size:0.88rem;color:var(--muted);line-height:1.9">
          <li>This is a demonstration project built for learning and practice purposes.</li>

<li>This reservation is fictional, but we hope it inspires your curiosity about the future of space travel.</li>

<li>Completing a reservation is completely free and takes less than a minute.</li>
        </ul>
      </div>
      <button id="terms-close-btn" style="
        background:var(--terracotta);color:#fff;border:none;padding:14px 36px;
        border-radius:var(--r-md);font-size:1rem;font-weight:700;cursor:pointer;
        font-family:var(--font-body);box-shadow:0 4px 16px rgba(47,111,209,0.3);
      ">
        I Understand, Take Me Back
      </button>
    </div>
  `;
  document.body.appendChild(overlay);
  document.getElementById('terms-close-btn')?.addEventListener('click', () => overlay.remove());
}

function v(id)           { return document.getElementById(id)?.value.trim() || ''; }
function isValidEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }

function validateField(id) {
  const val = v(id);
  if (id === 'email') {
    if (!val)               return setError('email', 'Email is required.');
    if (!isValidEmail(val)) return setError('email', 'Enter a valid email address.');
    markValid('email');
  } else {
    if (!val || val.length < 2) return setError(id, 'This field is required (min 2 characters).');
    markValid(id);
  }
}

function setError(id, msg) {
  const input = document.getElementById(id);
  const errEl = document.getElementById(`err-${id}`);
  if (input) { input.classList.add('error'); input.classList.remove('valid'); }
  if (errEl) errEl.textContent = msg;
}
function clearError(id) {
  const input = document.getElementById(id);
  const errEl = document.getElementById(`err-${id}`);
  if (input) input.classList.remove('error');
  if (errEl) errEl.textContent = '';
}
function markValid(id) {
  const input = document.getElementById(id);
  if (input) { input.classList.remove('error'); input.classList.add('valid'); }
  clearError(id);
}
function setLoading(btn, on) {
  if (!btn) return;
  if (on) { btn._orig = btn.innerHTML; btn.innerHTML = `<div class="spinner"></div> Verifying…`; btn.disabled = true; }
  else    { btn.innerHTML = btn._orig || 'Continue'; btn.disabled = false; }
}