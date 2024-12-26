// backend/src/utils/emailTemplates.ts

const style = {
  btn: 'background:#4CAF50;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;display:inline-block',
  p: 'margin:15px 0',
  body: 'font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto'
};

export const resetPassword = (name: string, url: string) => {
  const text = `
Bonjour ${name},

Vous avez demandé une réinitialisation de votre mot de passe.
Cliquez sur ce lien pour définir un nouveau mot de passe : ${url}

Si vous n'avez pas fait cette demande, ignorez cet email.
Le lien expirera dans 30 minutes.

Cordialement,
L'équipe Ate Leslie`;

  const html = `
<div style="${style.body}">
  <h2>Réinitialisation du mot de passe</h2>
  <p style="${style.p}">Bonjour ${name},</p>
  <p style="${style.p}">Vous avez demandé une réinitialisation de votre mot de passe.</p>
  <p style="${style.p}">
    <a href="${url}" style="${style.btn}">Réinitialiser mon mot de passe</a>
  </p>
  <p style="${style.p}">Si vous n'avez pas fait cette demande, ignorez cet email.</p>
  <p style="${style.p}">Le lien expirera dans 30 minutes.</p>
  <p style="${style.p}">Cordialement,<br>L'équipe Ate Leslie</p>
</div>`;

  return { text, html };
};
