// =====================================================
//  Lambda: SendConfirmationEmail
//  Trigger: SQS queue (from ConfirmReservation Lambda)
//  Sends HTML confirmation email via AWS SES
//
//  Only ever invoked AFTER ConfirmReservation has
//  successfully written the reservation to DynamoDB.
//
//  Theme logic:
//   "Earth Orbit"  → deep-space blue/indigo UI  (default)
//   "Lunar Flyby"  → premium silver/pearl moon UI
// =====================================================
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const ses  = new SESClient({ region: process.env.AWS_REGION || 'us-east-1' });
const FROM = process.env.FROM_EMAIL || 'reservations@spacetour.com';

// ── SQS batch handler ─────────────────────────────────
exports.handler = async (event) => {
  const failures = [];
  for (const record of event.Records) {
    try {
      const msg = JSON.parse(record.body);
      if (msg.type === 'RESERVATION_CONFIRMED') {
        await sendConfirmationEmail(msg);
        console.log(`[SendConfirmationEmail] Sent to ${msg.email} — ${msg.reservationId}`);
      }
    } catch (err) {
      console.error(`[SendConfirmationEmail] Failed: ${record.messageId}`, err);
      failures.push({ itemIdentifier: record.messageId });
    }
  }
  return { batchItemFailures: failures };
};

// ── Build and send email ──────────────────────────────
async function sendConfirmationEmail({ email, firstName, lastName, reservationId, mission = {} }) {
  const fullName = `${firstName} ${lastName}`;
  await ses.send(new SendEmailCommand({
    Source: `Space Tour <${FROM}>`,
    Destination: { ToAddresses: [email] },
    Message: {
      Subject: {
        Data: `Space Tour Reservation Confirmed — ${reservationId}`,
      },
      Body: {
        Html: { Data: buildHtml({ fullName, reservationId, mission }) },
        Text: { Data: buildText({ fullName, reservationId, mission }) },
      },
    }
  }));
}

// ── Theme resolver ────────────────────────────────────
// Returns a color/copy token map based on mission.experience.
// All other code is theme-agnostic — only touch this to add themes.
function resolveTheme(experience = '') {
  const key = experience.toLowerCase();

  if (key.includes('lunar') || key.includes('moon')) {
    // ── Lunar Flyby: premium silver / pearl / moon palette ──
    return {
      pageBg:        '#09090e',
      headerBg:      'linear-gradient(135deg,#0e0e18,#17172a)',
      bodyBg:        '#0e0e18',
      footerBg:      '#07070c',
      border:        '#2a2a40',
      divider:       '#1a1a2e',
      accentStrip:   'linear-gradient(90deg,#6e6e9e,#e8e2d5,#b8a98a)',
      accentColor:   '#c8b990',
      accentBg:      'rgba(200,185,144,0.07)',
      accentBorder:  'rgba(200,185,144,0.20)',
      headingColor:  '#edeae3',
      bodyText:      '#9090aa',
      labelText:     '#50506a',
      valueText:     '#edeae3',
      journeyBg:     '#12121e',
      journeyBorder: '#2a2a40',
      journeyHead:   '#edeae3',
      journeyBody:   '#9090aa',
      footerText:    '#38384e',
      footerLink:    '#52526a',
      tagline:       'Your lunar journey begins here.',
    };
  }

  // ── Earth Orbit: deep-space blue / indigo palette (default) ──
  return {
    pageBg:        '#08090f',
    headerBg:      'linear-gradient(135deg,#0f1118,#161923)',
    bodyBg:        '#0f1118',
    footerBg:      '#0a0b12',
    border:        '#252a38',
    divider:       '#1e2333',
    accentStrip:   'linear-gradient(90deg,#2f6fd1,#c9a368)',
    accentColor:   '#2f6fd1',
    accentBg:      'rgba(47,111,209,0.08)',
    accentBorder:  'rgba(47,111,209,0.25)',
    headingColor:  '#f4f2ee',
    bodyText:      '#8b8fa8',
    labelText:     '#555a70',
    valueText:     '#f4f2ee',
    journeyBg:     '#161923',
    journeyBorder: '#252a38',
    journeyHead:   '#f4f2ee',
    journeyBody:   '#8b8fa8',
    footerText:    '#3a4258',
    footerLink:    '#555a70',
    tagline:       'Your journey beyond Earth begins here.',
  };
}

// ── HTML email ────────────────────────────────────────
function buildHtml({ fullName, reservationId, mission }) {
  const t = resolveTheme(mission.experience);

  const rows = [
    ['Traveler',          fullName],
    ['Experience',        mission.experience   || '—'],
    ['Spacecraft',        mission.spacecraft   || '—'],
    ['Destination',       mission.destination  || '—'],
    ['Travel Duration',   mission.duration     || '—'],
    ['Est. Availability', mission.availability || '—'],
  ];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Space Tour Reservation Confirmed</title>
</head>
<body style="margin:0;padding:0;background:${t.pageBg};font-family:'Segoe UI',Arial,sans-serif;color:${t.headingColor}">
<table width="100%" cellpadding="0" cellspacing="0" style="background:${t.pageBg};padding:40px 20px">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%">

  <!-- Header -->
  <tr><td style="
    background:${t.headerBg};
    border-radius:16px 16px 0 0;
    padding:32px 36px 28px;
    border:1px solid ${t.border};
    border-bottom:none;
  ">
    <div style="font-family:Arial,sans-serif;font-size:1rem;font-weight:800;letter-spacing:0.06em;color:${t.headingColor};margin-bottom:24px">
      SPACE TOUR
    </div>
  </td></tr>

  <!-- Accent strip -->
  <tr><td style="border-left:1px solid ${t.border};border-right:1px solid ${t.border};height:4px;background:${t.accentStrip}">
  </td></tr>

  <!-- Body -->
  <tr><td style="
    background:${t.bodyBg};
    padding:32px 36px;
    border:1px solid ${t.border};
    border-top:none;
    border-bottom:none;
  ">
    <p style="font-size:0.95rem;color:${t.bodyText};line-height:1.7;margin:0 0 10px">
      Future Traveler ${fullName},
    </p>
    <p style="font-size:0.95rem;color:${t.bodyText};line-height:1.7;margin:0 0 28px">
      Your Space Tour reservation has been successfully confirmed.
    </p>

    <!-- Reservation ID box -->
    <div style="
      background:${t.accentBg};
      border:1px solid ${t.accentBorder};
      border-radius:10px;
      padding:18px 22px;
      margin-bottom:28px;
      text-align:center;
    ">
      <div style="font-size:0.65rem;font-family:'Courier New',monospace;letter-spacing:0.15em;text-transform:uppercase;color:${t.bodyText};margin-bottom:8px">Reservation ID</div>
      <div style="font-family:'Courier New',monospace;font-size:1.3rem;font-weight:700;color:${t.accentColor};letter-spacing:0.1em">${reservationId}</div>
    </div>

    <!-- Details table -->
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
      ${rows.map(([key, val]) => `
        <tr>
          <td style="
            padding:12px 0;
            border-bottom:1px solid ${t.divider};
            font-size:0.82rem;
            color:${t.labelText};
            width:45%;
            vertical-align:top;
          ">${key}</td>
          <td style="
            padding:12px 0;
            border-bottom:1px solid ${t.divider};
            font-size:0.85rem;
            color:${t.valueText};
            font-weight:400;
            text-align:right;
            vertical-align:top;
          ">${val}</td>
        </tr>
      `).join('')}
    </table>

    <!-- Journey message -->
    <div style="
      margin-top:28px;
      padding:18px 20px;
      background:${t.journeyBg};
      border:1px solid ${t.journeyBorder};
      border-radius:10px;
      text-align:center;
    ">
      <p style="font-size:1rem;font-weight:700;color:${t.journeyHead};letter-spacing:-0.01em;margin:0 0 8px">
       ✨ Never lose your sense of wonder. ${t.tagline}
      </p>
      <p style="font-size:0.85rem;color:${t.journeyBody};line-height:1.7;margin:0">
        This confirmation was generated for demonstration purposes and does not represent a real spaceflight reservation.
      </p>
    </div>
  </td></tr>

  <!-- Footer -->
  <tr><td style="
    background:${t.footerBg};
    border-radius:0 0 16px 16px;
    padding:24px 36px;
    border:1px solid ${t.border};
    border-top:1px solid ${t.divider};
    text-align:center;
  ">
    <div style="font-size:0.75rem;color:${t.footerText};line-height:1.8">
      <a href="https://github.com/pnakule/space-tour-reservation-system"
         style="font-family:'Courier New',monospace;font-size:0.70rem;color:${t.footerLink};letter-spacing:0.08em;text-decoration:none;">
        github/pnakule/space-tour-reservation-system
      </a>
    </div>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

// ── Plain text fallback ───────────────────────────────
// Content is identical for all themes — plain text carries no styling.
function buildText({ fullName, reservationId, mission }) {
  return `
SPACE TOUR
══════════════════════════════════════
Dear ${fullName},
Your Space Tour reservation has been successfully confirmed.

Reservation ID:    ${reservationId}
Traveler:          ${fullName}
Experience:        ${mission.experience   || '—'}
Spacecraft:        ${mission.spacecraft   || '—'}
Destination:       ${mission.destination  || '—'}
Travel Duration:   ${mission.duration     || '—'}
Est. Availability: ${mission.availability || '—'}

──────────────────────────────────────
${resolveTheme(mission.experience).tagline}

✨ The future is built by those who dare to imagine it.
This confirmation was generated for demonstration purposes and does not represent a real spaceflight reservation.
──────────────────────────────────────
https://github.com/pnakule/space-tour-reservation-system
  `.trim();
}