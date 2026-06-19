// =====================================================
//  Lambda: ValidateTraveler
//  POST /validate-traveler  ← API Gateway
//
//  Step 1 of the reservation flow.
//
//  Validation chain:
//    ├─ Validate Name
//    ├─ Validate Email Format
//    ├─ Validate Domain Has MX Records
//    └─ Return Success/Failure message
//
//  Plus a read-only email-uniqueness pre-check against
//  DynamoDB.
// =====================================================

const dns = require('dns').promises;
const { DynamoDBClient, GetItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');

const db    = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const TABLE = process.env.RESERVATIONS_TABLE || 'SpaceTour-Reservations';

const HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: HEADERS, body: '' };

  try {
    const { firstName, lastName, email } = JSON.parse(event.body || '{}');

    // ── 1. Validate Name ─────────────────────────────
    const nameRegex = /^[A-Za-z\s'\-]{2,60}$/;

    if (!firstName || !nameRegex.test(firstName.trim())) {
      return respond(400, { valid: false, field: 'firstName', message: 'First name must be 2–60 alphabetic characters.' });
    }
    if (!lastName || !nameRegex.test(lastName.trim())) {
      return respond(400, { valid: false, field: 'lastName', message: 'Last name must be 2–60 alphabetic characters.' });
    }

    // ── 2. Validate Email Format ─────────────────────
    const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email.trim())) {
      return respond(400, { valid: false, field: 'email', message: 'Enter a valid email address (e.g. name@domain.com).' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const domain = normalizedEmail.split('@')[1];

    // ── 3. Validate Domain Has MX Records ────────────
    const hasMx = await domainHasMxRecords(domain);
    if (!hasMx) {
      return respond(400, {
        valid: false,
        field: 'email',
        message: `The domain "${domain}" does not appear to accept email (no MX records found). Please check your email address.`,
      });
    }

    // ── Email uniqueness pre-check (read-only) ────────
    // The table's primary key is `email`, so this is a single
    // GetItem — no GSI, no write, no record created here.
    const existing = await db.send(new GetItemCommand({
      TableName: TABLE,
      Key: marshall({ email: normalizedEmail }),
    }));

    if (existing.Item) {
      return respond(409, {
        valid: false,
        field: 'email',
        message: 'A reservation with this email already exists.Please use a different email address.',
      });
    }

    // ── 4. Success — nothing is stored yet ────────────
    // No travelerId, no DynamoDB write. The traveler's
    // information stays in frontend state until Step 5.
    console.log(`[ValidateTraveler] OK — ${normalizedEmail} (no record created)`);
    return respond(200, { valid: true });

  } catch (err) {
    console.error('[ValidateTraveler] Error:', err);
    return respond(500, { valid: false, field: 'email', message: 'Server error. Please try again.' });
  }
};

// ── Helper: check MX records for a domain ──────────────
async function domainHasMxRecords(domain) {
  try {
    const records = await dns.resolveMx(domain);
    return Array.isArray(records) && records.length > 0;
  } catch (err) {
    // ENOTFOUND / ENODATA → domain has no MX records (or doesn't exist)
    if (err.code === 'ENOTFOUND' || err.code === 'ENODATA') return false;
    // On unexpected DNS errors, don't hard-block the user —
    // log it and let them through rather than failing validation
    // due to a transient resolver issue.
    console.warn(`[ValidateTraveler] MX lookup error for "${domain}":`, err.code || err.message);
    return true;
  }
}

function respond(status, body) {
  return { statusCode: status, headers: HEADERS, body: JSON.stringify(body) };
}
