// backend/src/scripts/initAdmins.ts

import dotenv from 'dotenv';
import { connectDB } from '../index';
import { User } from '../models/User';

dotenv.config();

const admins = [
  {
    username: "admin",
    email: "admin@ateleslie.com",
    password: process.env.ADMIN_PASSWORD || "Admin123!",
    role: "admin",
  },
  {
    username: "support",
    email: "support@ateleslie.com",
    password: process.env.ADMIN_PASSWORD || "Admin123!",
    role: "admin",
  },
  {
    username: "tech",
    email: "tech@ateleslie.com",
    password: process.env.ADMIN_PASSWORD || "Admin123!",
    role: "admin",
  },
];

const initAdmins = async () => {
  try {
    await connectDB();
    
    for (const adminData of admins) {
      const existingAdmin = await User.findOne({ email: adminData.email });
      
      if (!existingAdmin) {
        await User.create(adminData);
        console.log(`Admin créé : ${adminData.email}`);
      } else {
        console.log(`Admin existe déjà : ${adminData.email}`);
      }
    }
    
    console.log('Initialisation des admins terminée');
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de l\'initialisation des admins:', error);
    process.exit(1);
  }
};

initAdmins(); 

