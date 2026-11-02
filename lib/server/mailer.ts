import nodemailer from 'nodemailer';

function getTransport() {
  const user = process.env.CONTACT_SMTP_USER;
  const pass = process.env.CONTACT_SMTP_PASS?.replace(/\s/g, '');
  if (!user || !pass) throw new Error('Mail is not configured');

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user, pass },
  });
}

interface OwnerMessage {
  subject: string;
  text: string;
  html: string;
  replyTo: string;
}

interface CustomerMessage {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export async function sendOwnerEmail({ subject, text, html, replyTo }: OwnerMessage) {
  const to = process.env.CONTACT_TO_EMAIL;
  if (!to) throw new Error('Recipient is not configured');

  await getTransport().sendMail({
    from: `"Tais Tattoos website" <${process.env.CONTACT_SMTP_USER}>`,
    to,
    replyTo,
    subject,
    text,
    html,
  });
}

export async function sendCustomerEmail({ to, subject, text, html }: CustomerMessage) {
  await getTransport().sendMail({
    from: `"Tais Tattoos" <${process.env.CONTACT_SMTP_USER}>`,
    to,
    replyTo: process.env.CONTACT_TO_EMAIL || undefined,
    subject,
    text,
    html,
  });
}