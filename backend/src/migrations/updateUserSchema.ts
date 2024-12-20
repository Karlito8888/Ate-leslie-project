import mongoose from 'mongoose';
import { config } from 'dotenv';
import { User } from '../models/User';

// Load environment variables
config();

const updateUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ate-leslie');
    // console.log('Connected to MongoDB');

    // Find all users
    const users = await User.find({});
    // console.log(`Found ${users.length} users to update`);

    // Update each user
    for (const user of users) {
      // Prepare update object
      const updateData: any = {};

      // Only set fields if they don't exist
      if (!user.fullName) {
        updateData.fullName = {
          firstName: user.username || 'DefaultFirstName',  // Use username as default
          fatherName: 'DefaultFatherName',
          lastName: 'DefaultLastName',
          gender: 'male'
        };
      }

      if (!user.address) {
        updateData.address = {
          unit: '',
          buildingName: '',
          streetNumber: '',
          streetName: '',
          poBox: '',
          district: '',
          city: '',
          emirate: ''
        };
      }

      if (!user.landlineNumber) {
        updateData.landlineNumber = '';
      }

      if (!user.mobileNumber) {
        updateData.mobileNumber = '';
      }

      if (!user.birthDate) {
        updateData.birthDate = null;
      }

      // Update user directly in the database, bypassing validation
      await User.updateOne(
        { _id: user._id },
        { $set: updateData },
        { validateBeforeSave: false }
      );
      
      // console.log(`Updated user: ${user.username}`);
    }

    // console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

// Run the migration
updateUsers(); 