import mongoose from "mongoose";

// Los ids que llegan por URL pueden ser cualquier cosa ("abc"). Si no tienen forma de ObjectId,
// Mongoose lanzaría un CastError; por eso los repositories devuelven null en vez de consultar.
export const isValidId = (id) => mongoose.isObjectIdOrHexString(id);
