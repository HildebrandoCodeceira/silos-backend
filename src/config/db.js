import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI = "mongodb+srv://hcodeceira:PS4G0h7NgvZaUuQB@users.cpb7m.mongodb.net/users?retryWrites=true&w=majority&appName=users", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB conectado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao conectar no MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB; // export default

