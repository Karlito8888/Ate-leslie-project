// backend/src/scripts/initAdmins.ts

import mongoose from 'mongoose';
import { User } from '../models/User';
import bcrypt from 'bcrypt';

const init = async () => {
  try {
    await mongoose.connect('mongodb://localhost/db');
    
    const exists = await User.findOne({ email: 'admin@test.com' });
    if (!exists) {
      const hash = await bcrypt.hash('admin', 8);
      await User.create({
        username: 'admin',
        email: 'admin@test.com',
        password: hash,
        role: 'admin'
      });
    }
    
    process.exit(0);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

init();

