// backend/src/scripts/initAdmins.ts

import mongoose from 'mongoose';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import { SECURITY } from '../index';

const init = async () => {
  try {
    await mongoose.connect('mongodb://localhost/db');
    
    const exists = await User.findOne({ email: 'admin@test.com' });
    if (!exists) {
      const hash = await bcrypt.hash('admin', SECURITY.SALT_ROUNDS);
      await User.create({
        username: 'admin',
        email: 'admin@test.com',
        password: hash,
        role: 'admin',
        fullName: 'Admin',
        newsletterSubscribed: true
      });
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
    
    process.exit(0);
  } catch (e) {
    console.error('Error:', e);
    process.exit(1);
  }
};

init();

