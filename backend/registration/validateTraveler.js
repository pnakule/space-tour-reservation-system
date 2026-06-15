// =====================================================
//  Lambda: ValidateTraveler
//  POST /validate-traveler  ← API Gateway
//
//  Step 1 of the reservation flow.
//  - Validates name format
//  - Validates email format
//  - Checks whether the email already has a CONFIRMED
//    reservation in DynamoDB (uniqueness pre-check only)
//
//  IMPORTANT: This Lambda performs READ-ONLY checks.
//  It never writes to DynamoDB, never generates a
//  travelerId, and never creates a partial record.
//  The only write to DynamoDB happens in the
//  ConfirmReservation Lambda after Step 5.
// =====================================================

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

    // ── Name validation ──────────────────────────────
    const nameRegex = /^[A-Za-z\s'\-]{2,60}$/;

    if (!firstName || !nameRegex.test(firstName.trim())) {
      return respond(400, { valid: false, field: 'firstName', message: 'First name must be 2–60 alphabetic characters.' });
    }
    if (!lastName || !nameRegex.test(lastName.trim())) {
      return respond(400, { valid: false, field: 'lastName', message: 'Last name must be 2–60 alphabetic characters.' });
    }

    // ── Email validation ─────────────────────────────
    const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email.trim())) {
      return respond(400, { valid: false, field: 'email', message: 'Enter a valid email address (e.g. name@domain.com).' });
    }

    const normalizedEmail = email.trim().toLowerCase();

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
        message: 'A reservation with this email already exists. Contact support if this is an error.',
      });
    }

    // ── All good — nothing is stored yet ──────────────
    // No travelerId, no DynamoDB write. The traveler's
    // information stays in frontend state until Step 5.
    console.log(`[ValidateTraveler] OK — ${normalizedEmail} (no record created)`);
    return respond(200, { valid: true });

  } catch (err) {
    console.error('[ValidateTraveler] Error:', err);
    return respond(500, { valid: false, field: 'email', message: 'Server error. Please try again.' });
  }
};

function respond(status, body) {
  return { statusCode: status, headers: HEADERS, body: JSON.stringify(body) };
}
