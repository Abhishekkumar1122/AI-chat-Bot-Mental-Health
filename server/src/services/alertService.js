const nodemailer = require('nodemailer');

function buildTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function sendCrisisAlertEmail({ userEmail, content, sentimentScore, keywords }) {
  const transporter = buildTransporter();
  if (!transporter || !process.env.ALERT_EMAIL_TO) {
    return false;
  }

  await transporter.sendMail({
    from: process.env.ALERT_EMAIL_FROM || process.env.SMTP_USER,
    to: process.env.ALERT_EMAIL_TO,
    subject: 'Crisis risk event detected',
    text: [
      `User: ${userEmail}`,
      `Sentiment score: ${sentimentScore}`,
      `Keywords: ${(keywords || []).join(', ') || 'none'}`,
      '',
      'Message:',
      content,
    ].join('\n'),
  });

  return true;
}

module.exports = {
  sendCrisisAlertEmail,
};
