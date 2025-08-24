import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from '../src/models/User.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '123456';

if (!MONGO_URI) {
  console.error("❌ MONGO_URI não encontrada no .env");
  process.exit(1);
}

const seedAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    const adminExists = await User.findOne({
      $or: [
        { email: 'admin@silos.com' },
        { username: 'admin' }
      ]
    });

    if (adminExists) {
      console.log("⚠️ Admin já existe.");
      console.log(`Email: ${adminExists.email}`);
    } else {
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

      await User.create({
        name: 'Administrador',
        email: 'admin@silos.com',
        password: hashedPassword,
        role: 'admin',
        username: 'admin'
      });

      console.log("✅ Admin criado com sucesso!");
    }
  } catch (error) {
    console.error("❌ Erro ao conectar/criar admin:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

seedAdmin();