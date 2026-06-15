// ====================================================
//  API Service — AWS API Gateway + Lambda
//  Set DEMO_MODE = false + fill API_BASE for production
//
//  Architecture:
//   - /validate-traveler   (Step 1) — read-only checks,
//     no DynamoDB write, no travelerId generated.
//   - /check-eligibility    (Step 2) — pure validation,
//     no DynamoDB access at all.
//   - /confirm-reservation  (Step 5 only) — the ONLY
//     endpoint that writes to DynamoDB. Receives the full
//     traveler + mindset + Experience, re-checks email
//     uniqueness, then saves the record and sends the
//     confirmation to sqs
//
//  If the user abandons the flow before Step 5,
//  /confirm-reservation is never called and nothing is
//  ever persisted.
// ====================================================

const API_BASE   = 'https://l3nbabfv8c.execute-api.us-east-1.amazonaws.com/prod';
const DEMO_MODE  = false;

// ── Demo-mode "DynamoDB" ─────────────────────────────────
// A simple in-memory set standing in for the single
// DynamoDB table (primary key = email) so the demo can
// still demonstrate email-uniqueness enforcement without
// a backend. Nothing is added here until /confirm-reservation
// succeeds — mirroring the real architecture.
const confirmedReservations = new Set();

async function call(path, method = 'POST', body = null) {
  if (DEMO_MODE) return mockResponse(path, body);

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    return data;
  }

  return data;
}

// ── Mock responses (demo mode) ─────────────────────────
function mockResponse(path, body) {
  // ── Step 1: validation only — no record is created ──
  if (path === '/validate-traveler') {
    const { firstName, lastName, email } = body;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '');
    const nameOk  = firstName?.trim().length >= 2 && lastName?.trim().length >= 2;

    if (!nameOk)  return Promise.resolve({ valid: false, field: 'firstName', message: 'First and last name must be at least 2 characters.' });
    if (!emailOk) return Promise.resolve({ valid: false, field: 'email',     message: 'Enter a valid email address.' });

    // Read-only uniqueness pre-check against confirmed reservations
    if (confirmedReservations.has(email.trim().toLowerCase())) {
      return Promise.resolve({ valid: false, field: 'email', message: 'A reservation with this email already exists.' });
    }

    return Promise.resolve({ valid: true });
  }

  // ── Step 2: pure validation — no DynamoDB access ────
  if (path === '/check-eligibility') {
    const { dob, medicalCondition, acknowledgeRisk } = body;
    if (!dob) return Promise.resolve({ eligible: false, reason: 'Date of birth is required.' });

    const launchYear = 2045;
    const birthYear  = new Date(dob).getFullYear();
    const ageAtLaunch = launchYear - birthYear;
    if (ageAtLaunch < 18) return Promise.resolve({ eligible: false, reason: `You will be ${ageAtLaunch} at launch. Minimum age is 18.` });
    if (ageAtLaunch > 70) return Promise.resolve({ eligible: false, reason: `You will be ${ageAtLaunch} at launch. Maximum age is 70.` });
    if (medicalCondition === 'yes') return Promise.resolve({ eligible: false, reason: 'Applicants with known medical conditions affecting space travel require medical board clearance.' });
    if (acknowledgeRisk !== 'yes')  return Promise.resolve({ eligible: false, reason: 'You must acknowledge the risks of space travel to proceed.' });

    return Promise.resolve({ eligible: true, ageAtLaunch });
  }

  // ── Step 5 ONLY: the single DynamoDB write ──────────
  if (path === '/confirm-reservation') {
    const email = (body?.traveler?.email || '').trim().toLowerCase();

    if (confirmedReservations.has(email)) {
      return Promise.resolve({
        success: false,
        message: 'A reservation with this email already exists. Contact support if this is an error.',
      });
    }

    const id = 'STC-RSVP-' + String(Math.floor(100000 + Math.random() * 900000)).padStart(6, '0');
    confirmedReservations.add(email);
    // In production this is where ConfirmReservation Lambda
    // writes the item to DynamoDB and queues the SES email.
    return Promise.resolve({ success: true, reservationId: id });
  }

  return Promise.resolve({ success: true });
}

// ── Public API ─────────────────────────────────────────
export const API = {
  validateTraveler:    (data) => call('/strs-validatestraveler', 'POST', data),
  confirmReservation:  (data) => call('/strs-CompleteReservation', 'POST', data),
};
