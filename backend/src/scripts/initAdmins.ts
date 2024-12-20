// backend/src/scripts/initAdmins.ts

import dotenv from 'dotenv';
import { connectDB } from '../index';
import { User } from '../models/User';
import bcrypt from 'bcrypt';

dotenv.config();

const admins = [
  {
    username: 'admin',
    email: process.env.ADMIN_EMAIL || 'admin@example.com',
    password: process.env.ADMIN_PASSWORD || 'admin123',
  }
];

async function initAdmins() {
  try {
    await connectDB();

    for (const adminData of admins) {
      try {
        const existingAdmin = await User.findOne({ email: adminData.email });
        
        if (!existingAdmin) {
          const hashedPassword = await bcrypt.hash(adminData.password, 10);
          const admin = new User({ ...adminData, password: hashedPassword, role: 'admin' });
          await admin.save();
          // console.log(`Admin créé : ${adminData.email}`);
        } else {
          // console.log(`Admin existe déjà : ${adminData.email}`);
        }
      } catch (error) {
        console.error(`Erreur lors de la création de l'admin ${adminData.email}:`, error);
      }
    }

    // console.log('Initialisation des admins terminée');
    process.exit(0);
  } catch (error) {
    console.error('Erreur de connexion à la base de données:', error);
    process.exit(1);
  }
}

initAdmins();

