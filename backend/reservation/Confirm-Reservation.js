// =====================================================
//  Lambda: ConfirmReservation
//  POST /confirm-reservation  ← API Gateway
//
//  Step 5 of the reservation flow — the ONLY place in the
//  system that writes to DynamoDB.
//
//  Receives the full set of data collected across
//  Steps 1–4 (traveler info, mindset answers, selected
//  experience) and:
//   1. Re-checks email uniqueness.
//   2. If the email already has a reservation -> error,
//      nothing is written.
//   3. If the email is new -> writes a single complete
//      reservation record to DynamoDB and queues a
//      confirmation email via SQS (sent by SES through
//      the SendConfirmationEmail Lambda).
//
//  If the user abandons the flow at any earlier step,
//  this Lambda is never invoked, so no record is ever
//  created in DynamoDB.
// =====================================================

const { DynamoDBClient, GetItemCommand, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');
const { SQSClient, SendMessageCommand } = require('@aws-sdk/client-sqs');
const { randomUUID } = require('crypto');

const db    = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const sqs   = new SQSClient({ region: process.env.AWS_REGION || 'us-east-1' });

const TABLE         = process.env.RESERVATIONS_TABLE || 'SpaceTour-Reservations';
const EMAIL_QUEUE_URL = process.env.EMAIL_QUEUE_URL || '';

const HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: HEADERS, body: '' };

  try {
    const body = JSON.parse(event.body || '{}');
    const traveler = body.traveler || {};
    const mindset  = body.mindset  || {};
    const mission  = body.mission  || {};

    const firstName = (traveler.firstName || '').trim();
    const lastName  = (traveler.lastName  || '').trim();
    const email     = (traveler.email     || '').trim().toLowerCase();

    // ── Required field check ──────────────────────────
    const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    if (!firstName || !lastName || !emailRegex.test(email)) {
      return respond(400, { success: false, message: 'Missing or invalid traveler information.' });
    }

    // ── Re-check email uniqueness (read-only) ─────────
    const existing = await db.send(new GetItemCommand({
      TableName: TABLE,
      Key: marshall({ email }),
    }));

    if (existing.Item) {
      return respond(409, {
        success: false,
        message: 'A reservation with this email already exists. Contact support if this is an error.',
      });
    }

    // ── Build the complete reservation record ─────────
    const reservationId = `STC-RSVP-${randomUUID().replace(/-/g, '').substring(0, 6).toUpperCase()}`;
    const createdAt = new Date().toISOString();

    const item = {
      email,
      firstName,
      lastName,
      whySpace:         mindset.whySpace         || '',
      quiet:            mindset.quiet            || '',
      tradeLuxury:      mindset.tradeLuxury      || '',
      resilient:        mindset.resilient        || '',
      acknowledgeRisk:  mindset.acknowledgeRisk   || '',
      experience:       mission.experience       || '',
      spacecraft:       mission.spacecraft       || '',
      destination:      mission.destination      || '',
      duration:         mission.duration         || '',
      availability:     mission.availability     || '',
      reservationId,
      status:    'CONFIRMED',
      createdAt,
    };

    // ── Write the ONLY DynamoDB record for this user ──
    // ConditionExpression guards against a race where two
    // requests with the same email arrive at the same time.
    try {
      await db.send(new PutItemCommand({
        TableName: TABLE,
        Item: marshall(item, { removeUndefinedValues: true }),
        ConditionExpression: 'attribute_not_exists(email)',
      }));
    } catch (err) {
      if (err.name === 'ConditionalCheckFailedException') {
        return respond(409, {
          success: false,
          message: 'A reservation with this email already exists. Contact support if this is an error.',
        });
      }
      throw err;
    }

    // ── Queue confirmation email (sent via SES) ───────
    if (EMAIL_QUEUE_URL) {
      try {
        await sqs.send(new SendMessageCommand({
          QueueUrl: EMAIL_QUEUE_URL,
          MessageBody: JSON.stringify({
            type: 'RESERVATION_CONFIRMED',
            email,
            firstName,
            lastName,
            reservationId,
          
          }),
        }));
      } catch (err) {
        // Don't fail the reservation if the email queue is unavailable —
        // the reservation record is already saved.
        console.error('[ConfirmReservation] Failed to queue confirmation email:', err);
      }
    }

    console.log(`[ConfirmReservation] CONFIRMED — ${reservationId} (${email})`);
    return respond(200, { success: true, reservationId });

  } catch (err) {
    console.error('[ConfirmReservation] Error:', err);
    return respond(500, { success: false, message: 'Server error. Please try again.' });
  }
};

function respond(status, body) {
  return { statusCode: status, headers: HEADERS, body: JSON.stringify(body) };
}
