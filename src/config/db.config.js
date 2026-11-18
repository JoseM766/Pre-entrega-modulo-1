import mongoose from "mongoose";
import { config } from "./index.js";

// Solo abre y cierra la conexión. Las consultas las hacen los repositories.
export const connectDB = async () => {
  await mongoose.connect(config.mongoUri);
  console.log("Conectado a la base de datos");
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
};
