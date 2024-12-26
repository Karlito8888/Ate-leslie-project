export const validate = (req: any, res: any, next: any) => {
  const { title, desc, date, loc } = req.body;
  
  if (!title || title.length < 3) return res.status(400).send('Bad title');
  if (!desc || desc.length < 10) return res.status(400).send('Bad desc');
  if (!date || new Date(date) < new Date()) return res.status(400).send('Bad date');
  if (!loc) return res.status(400).send('Bad loc');
  
  next();
}; 