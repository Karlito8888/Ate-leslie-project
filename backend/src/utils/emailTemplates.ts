// backend/src/utils/emailTemplates.ts

export const getPasswordResetTemplate = (
  username: string,
  resetUrl: string
) => {
  const text = `
Hello ${username},

You have requested a password reset.
Click the link below to set a new password:

${resetUrl}

If you did not request this reset, please ignore this email.
The link will expire in 30 minutes.

Best regards,
The Ate Leslie Team
`;

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <h2>Password Reset</h2>
  <p>Hello ${username},</p>
  <p>You have requested a password reset.</p>
  <p>Click the link below to set a new password:</p>
  <p>
    <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
      Reset my password
    </a>
  </p>
  <p>If you did not request this reset, please ignore this email.</p>
  <p>The link will expire in 30 minutes.</p>
  <br>
  <p>Best regards,<br>The Ate Leslie Team</p>
</body>
</html>
`;

  return { text, html };
};
