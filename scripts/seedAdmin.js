import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI não encontrada no .env");
  process.exit(1);
}

const seedAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });

    const adminExists = await User.findOne({ email: 'admin@silos.com' });
    if (adminExists) {
      console.log("⚠️ Admin já existe.");
    } else {
      await User.create({
        name: 'Administrador',
        email: 'admin@silos.com',
        password: '123456',
        role: 'admin'
      });
      console.log("✅ Admin criado com sucesso!");
    }

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Erro ao conectar no MongoDB:", error.message);
    process.exit(1);
  }
};

seedAdmin();
