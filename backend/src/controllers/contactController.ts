import { Request, Response } from 'express';
import { Contact } from '../models/Contact';
import { User } from '../models/User';
import { config, sendEmail } from '../index';
import { Newsletter } from '../models/Newsletter';

// Envoyer un message
export const send = async (req: Request, res: Response) => {
  try {
    const { email, subject, message } = req.body;
    
    // Sauvegarder le message
    const contact = new Contact({
      email,
      subject,
      message,
      status: 'unread'
    });
    await contact.save();

    // Envoyer l'email
    await sendEmail(
      config.email.USER,
      subject,
      `De: ${email}\n\n${message}`,
      `<p>De: ${email}</p><p>${message}</p>`
    );

    res.status(201).json({ message: "Message envoyé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'envoi du message" });
  }
};

// Récupérer la FAQ
export const getFaq = async (_req: Request, res: Response) => {
  try {
    // Exemple de FAQ statique (à remplacer par une version dynamique depuis la DB)
    const faq = [
      {
        question: "Comment créer un événement ?",
        answer: "Connectez-vous et cliquez sur le bouton 'Créer un événement'"
      },
      {
        question: "Comment modifier mon profil ?",
        answer: "Allez dans les paramètres de votre compte"
      },
      {
        question: "Comment contacter un organisateur ?",
        answer: "Cliquez sur son nom dans la page de l'événement"
      }
    ];

    res.json(faq);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération de la FAQ" });
  }
};

// S'inscrire à la newsletter
export const subscribeNewsletter = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const userId = (req as any).user?._id;

    // Si l'utilisateur est connecté
    if (userId) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      if (user.newsletterSubscribed) {
        return res.status(400).json({ message: "Déjà inscrit à la newsletter" });
      }

      user.newsletterSubscribed = true;
      await user.save();

      return res.json({ message: "Inscription à la newsletter réussie" });
    }

    // Pour les utilisateurs non connectés
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.newsletterSubscribed) {
        return res.status(400).json({ message: "Email déjà inscrit à la newsletter" });
      }
      existingUser.newsletterSubscribed = true;
      await existingUser.save();
    } else {
      // Vérifier si déjà dans la collection Newsletter
      const existing = await Newsletter.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: "Email déjà inscrit à la newsletter" });
      }

      // Créer l'inscription
      const subscription = new Newsletter({ email });
      await subscription.save();
    }

    // Envoyer email de confirmation
    await sendEmail(
      email,
      "Inscription à la newsletter confirmée",
      "Merci de votre inscription à notre newsletter !",
      "<h1>Bienvenue !</h1><p>Merci de votre inscription à notre newsletter !</p>"
    );

    res.status(201).json({ message: "Inscription réussie" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'inscription" });
  }
};

// Se désinscrire de la newsletter
export const unsubscribeNewsletter = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const userId = (req as any).user?._id;

    // Si l'utilisateur est connecté
    if (userId) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      if (!user.newsletterSubscribed) {
        return res.status(400).json({ message: "Pas inscrit à la newsletter" });
      }

      user.newsletterSubscribed = false;
      await user.save();

      return res.json({ message: "Désinscription de la newsletter réussie" });
    }

    // Pour les utilisateurs non connectés
    const user = await User.findOne({ email });
    if (user) {
      if (!user.newsletterSubscribed) {
        return res.status(400).json({ message: "Email non inscrit à la newsletter" });
      }
      user.newsletterSubscribed = false;
      await user.save();
    } else {
      // Vérifier dans la collection Newsletter
      const result = await Newsletter.deleteOne({ email });
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Email non trouvé dans la newsletter" });
      }
    }

    res.json({ message: "Désinscription réussie" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la désinscription" });
  }
}; 