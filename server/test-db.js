import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/bookSearchDB";

console.log("🔍 Testing MongoDB connection...");

mongoose.connect(MONGODB_URI, {
    // @ts-ignore
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
  .then(() => {
    console.log("✅ Successfully connected to MongoDB!");
    process.exit(0);
  })
  .catch(err => {
    console.error(" MongoDB connection failed:", err.message);
    process.exit(1);
  });
