import mongoose from 'mongoose';

export const connectDB = async () => {
   const MONGODB_URI = `mongodb://localhost:27017/graphql-server`;
   try {
      const db = await mongoose.connect(MONGODB_URI);
      console.log('Database is connected to:', db.connection.name);
   } catch (error) {
      console.log('DB Connect Error:', error);
      process.exit(1);
   }
};
