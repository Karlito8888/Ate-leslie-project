export const validate = (req: any, res: any, next: any) => {
  const { stars, text } = req.body;
  
  if (!stars || stars < 1 || stars > 5) return res.status(400).send('Bad stars');
  if (!text || text.length < 3) return res.status(400).send('Bad text');
  
  next();
}; 