import mongoose from 'mongoose';
import { User } from '../models/User';

const migrate = async () => {
  try {
    await mongoose.connect('mongodb://localhost/db');
    
    const users = await User.find() as any[];
    
    for (const user of users) {
      const update = {
        fullName: user.fullName || { firstName: user.username },
        address: user.address || {},
        landlineNumber: user.landlineNumber || '',
        mobileNumber: user.mobileNumber || '',
        birthDate: user.birthDate || null
      };
      
      await User.updateOne({ _id: user._id }, { $set: update });
    }
    
    process.exit(0);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

migrate(); 