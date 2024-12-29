import { Request, Response } from 'express';
import { Contact } from '../models/Contact';

// Statistiques des messages
export const getStats = async (_req: Request, res: Response) => {
  try {
    const total = await Contact.countDocuments();
    const unread = await Contact.countDocuments({ status: 'unread' });
    const today = await Contact.countDocuments({
      createdAt: { $gte: new Date().setHours(0, 0, 0, 0) }
    });

    res.json({
      total,
      unread,
      today,
      readRate: total ? ((total - unread) / total) * 100 : 0
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des statistiques" });
  }
};

// Exporter les messages
export const exportContacts = async (_req: Request, res: Response) => {
  try {
    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .select('-__v');

    // Format CSV basique
    const csv = [
      'Date,Email,Sujet,Message,Statut',
      ...contacts.map(c => 
        `${c.createdAt},${c.email},"${c.subject}","${c.message}",${c.status}`
      )
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=contacts.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'export" });
  }
};

// Lister les messages
export const list = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;

    const query: any = {};
    if (status) query.status = status;

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Contact.countDocuments(query);

    res.json({
      contacts,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des messages" });
  }
};

// Mettre à jour le statut
export const updateStatus = async (req: Request, res: Response) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ message: "Message non trouvé" });
    }

    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du statut" });
  }
};

// Supprimer un message
export const remove = async (req: Request, res: Response) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ message: "Message non trouvé" });
    }

    res.json({ message: "Message supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression" });
  }
}; 