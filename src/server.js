import app from "./app.js";
import { config } from "./config/index.js";
import { connectDB } from "./config/db.config.js";

const startServer = async () => {
  await connectDB();

  app.listen(config.port, () => {
    console.log(`Servidor corriendo en el puerto ${config.port} (${config.nodeEnv})`);
  });
};

// Si la base de datos no responde, no tiene sentido dejar el servidor levantado.
startServer().catch((error) => {
  console.error("No se pudo iniciar la aplicación:", error.message);
  process.exit(1);
});
