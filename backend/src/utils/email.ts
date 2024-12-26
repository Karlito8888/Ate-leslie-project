// backend/src/utils/email.ts

import nodemailer from 'nodemailer';

const config = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: +(process.env.EMAIL_PORT || 587),
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASSWORD,
  from: process.env.EMAIL_FROM || 'noreply@example.com',
  name: process.env.EMAIL_FROM_NAME || 'No Reply'
};

const transporter = nodemailer.createTransport({
  host: config.host,
  port: config.port,
  auth: {
    user: config.user,
    pass: config.pass,
  },
});

export const send = async (to: string, subject: string, text: string, html?: string) => {
  await transporter.sendMail({
    from: `${config.name} <${config.from}>`,
    to,
    subject,
    text,
    html: html || text,
  });
}; 