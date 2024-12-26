export const register = (req: any, res: any, next: any) => {
  const { username, email, password } = req.body;

  if (!username || username.length < 3) return res.status(400).send('Bad name');
  if (!email || !email.includes('@')) return res.status(400).send('Bad email');
  if (!password || password.length < 6) return res.status(400).send('Bad pass');

  next();
};

export const login = (req: any, res: any, next: any) => {
  const { email, password } = req.body;

  if (!email || !email.includes('@')) return res.status(400).send('Bad email');
  if (!password) return res.status(400).send('Bad pass');

  next();
};

export const changePass = (req: any, res: any, next: any) => {
  const { old, pass } = req.body;

  if (!old || !pass) return res.status(400).send('Missing pass');
  if (old === pass) return res.status(400).send('Same pass');
  if (pass.length < 6) return res.status(400).send('Bad pass');

  next();
};

export const resetPass = (req: any, res: any, next: any) => {
  const { pass, confirm } = req.body;

  if (!pass || pass.length < 6) return res.status(400).send('Bad pass');
  if (pass !== confirm) return res.status(400).send('No match');

  next();
};

export const editProfile = (req: any, res: any, next: any) => {
  const { username, email } = req.body;

  if (username && username.length < 3) return res.status(400).send('Bad name');
  if (email && !email.includes('@')) return res.status(400).send('Bad email');

  next();
}; 