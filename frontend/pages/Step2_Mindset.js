// =====================================================
//  Step 2 — Mindset (no backend logic)
// =====================================================
import { navigate, State } from '../app.js';
import { toast }    from '../components/Toast.js';
export function renderStep2() {
  return `
    <div class="page-body-sm">
      <div style="margin-bottom:36px">
        <h1 class="t-heading" style="margin-bottom:10px">Traveler Mindset</h1>
        <p class="t-sub" style="font-size:0.93rem">
          Help us understand your mindset and motivation for space travel.
        </p>
      </div>
      <div class="card" style="margin-bottom:24px">
        <form id="form-step2" novalidate>
          <!-- Quiet & isolated -->
          <div class="form-group" style="margin-bottom:24px">
            <label class="form-label" style="margin-bottom:12px">
              Have you heard about space tourism?
              <span class="required">*</span>
            </label>
            <div class="radio-group inline" id="rg-quiet">
              <label class="radio-option" data-group="quiet" data-val="yes">
                <input type="radio" name="quiet" value="yes" /><span>Yes</span>
              </label>
              <label class="radio-option" data-group="quiet" data-val="no">
                <input type="radio" name="quiet" value="no" /><span>No</span>
              </label>
            </div>
            <span class="form-error" id="err-quiet"></span>
          </div>
          <div class="divider"></div>
          <!-- Space vs luxury -->
          <div class="form-group" style="margin-bottom:24px">
            <label class="form-label" style="margin-bottom:12px">
              Would you trade a luxury vacation on Earth for a journey into space?
              <span class="required">*</span>
            </label>
            <div class="radio-group inline" id="rg-tradeluxury">
              <label class="radio-option" data-group="tradeluxury" data-val="yes">
                <input type="radio" name="tradeLuxury" value="yes" /><span>Yes</span>
              </label>
              <label class="radio-option" data-group="tradeluxury" data-val="no">
                <input type="radio" name="tradeLuxury" value="no" /><span>No</span>
              </label>
            </div>
            <span class="form-error" id="err-tradeluxury"></span>
          </div>
          <div class="divider"></div>
          <!-- Mentally resilient -->
          <div class="form-group" style="margin-bottom:24px">
            <label class="form-label" style="margin-bottom:12px">
              Do you consider yourself mentally resilient when facing uncertainty and challenges?
              <span class="required">*</span>
            </label>
            <div class="radio-group inline" id="rg-resilient">
              <label class="radio-option" data-group="resilient" data-val="yes">
                <input type="radio" name="resilient" value="yes" /><span>Yes</span>
              </label>
              <label class="radio-option" data-group="resilient" data-val="no">
                <input type="radio" name="resilient" value="no" /><span>No</span>
              </label>
            </div>
            <span class="form-error" id="err-resilient"></span>
          </div>
          <div class="divider"></div>
          <!-- Risk acknowledgement -->
          <div class="form-group" style="margin-bottom:28px">
            <label class="form-label" style="margin-bottom:12px">
              Do you acknowledge and accept the risks associated with space travel?
              <span class="required">*</span>
            </label>
            <div class="radio-group inline" id="rg-risk">
              <label class="radio-option" data-group="risk" data-val="yes">
                <input type="radio" name="acknowledgeRisk" value="yes" /><span>Yes, I acknowledge</span>
              </label>
              <label class="radio-option" data-group="risk" data-val="no">
                <input type="radio" name="acknowledgeRisk" value="no" /><span>No</span>
              </label>
            </div>
            <span class="form-error" id="err-risk"></span>
          </div>
          <div class="divider"></div>
          <!-- Why space -->
          <div class="form-group" style="margin-bottom:24px">
            <label class="form-label" style="margin-bottom:10px">
              Why do you want to travel to space? <span class="required">*</span>
            </label>
            <textarea
              class="form-input"
              id="whySpace"
              name="whySpace"
              rows="5"
              maxlength="1000"
              placeholder="Tell us your motivation for space travel (max 1000 characters)…"
              style="resize:vertical;min-height:120px"
            ></textarea>
            <div style="display:flex;justify-content:space-between;margin-top:6px">
              <span class="form-error" id="err-whyspace"></span>
              <span class="form-hint" id="char-count" style="margin-left:auto">0 / 1000 characters</span>
            </div>
          </div>
          <button class="btn btn-earth btn-full btn-lg" type="submit" id="btn-step2">
            Continue
          </button>
        </form>
      </div>
    </div>
  `;
}
export function attachStep2Listeners() {
  // Radio option selection
  document.querySelectorAll('.radio-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const radio = opt.querySelector('input[type="radio"]');
      if (!radio) return;
      radio.checked = true;
      const group = opt.dataset.group;
      document.querySelectorAll(`.radio-option[data-group="${group}"]`).forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      clearError(`err-${group}`);
    });
  });
  // Character count (max 500)
  const textarea = document.getElementById('whySpace');
  const ccEl = document.getElementById('char-count');
  textarea?.addEventListener('input', () => {
    if (textarea.value.length > 500) {
      textarea.value = textarea.value.slice(0, 500);
    }
    const chars = textarea.value.length;
    if (ccEl) {
      ccEl.textContent = `${chars} / 500 characters`;
      ccEl.style.color = chars >= 500 ? 'var(--error)' : 'var(--dim)';
    }
  });
  document.getElementById('form-step2')?.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    const quiet           = checkedValue('quiet');
    const tradeLuxury     = checkedValue('tradeLuxury');
    const resilient       = checkedValue('resilient');
    const whySpace        = document.getElementById('whySpace')?.value.trim() || '';
    const acknowledgeRisk = checkedValue('acknowledgeRisk');
    if (!quiet)       { setError('err-quiet',       'Please select an option.'); ok = false; }
    if (!tradeLuxury) { setError('err-tradeluxury', 'Please select an option.'); ok = false; }
    if (!resilient)   { setError('err-resilient',   'Please select an option.'); ok = false; }
    if (!whySpace) {
      setError('err-whyspace', 'Please share at least a few words about your motivation.'); ok = false;
    } else if (whySpace.length > 500) {
      setError('err-whyspace', 'Please keep your answer to 500 characters or less.'); ok = false;
    }
    // Risk acknowledgement — must be "Yes, I acknowledge" to proceed.
    if (acknowledgeRisk !== 'yes') {
      setError('err-risk', 'You must select "Yes, I acknowledge" to accept the risks of space travel before continuing.');
      toast('You must acknowledge the risks of space travel to continue.', 'error');
      ok = false;
    }
    if (!ok) return;
    toast('Mindset recorded. Proceeding…', 'success');
    setTimeout(() => {
      navigate('step3', {
        step: 3,
        mindset: { quiet, tradeLuxury, resilient, whySpace, acknowledgeRisk },
      });
    }, 600);
  });
}
function checkedValue(name) {
  return document.querySelector(`input[name="${name}"]:checked`)?.value || '';
}
function setError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}
function clearError(id) {
  const el = document.getElementById(id);
  if (el) el.textContent = '';
}
