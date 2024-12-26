export const validate = (req: any, res: any, next: any) => {
  const { name, email, msg } = req.body;
  
  if (!name || name.length < 2) return res.status(400).send('Bad name');
  if (!email || !email.includes('@')) return res.status(400).send('Bad email');
  if (!msg || msg.length < 10) return res.status(400).send('Bad msg');
  
  next();
}; 