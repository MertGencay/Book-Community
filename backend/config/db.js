import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Mongo DB bağlantısı kuruldu!');
  } catch (error) {
    console.log('Mongo DB bağlantısı başarısız oldu.', error.message);
    throw error;
  }
};

export default connectDB;
