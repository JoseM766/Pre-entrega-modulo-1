import Product from "../models/Product.js";
import { isValidId } from "./helpers.js";

// Único archivo que conoce el modelo Product.
// Solo busca y guarda datos: las reglas de negocio (stock, estado) viven en el service.
const DEFAULT_PROJECTION = "-__v";
const DEFAULT_SORT = { createdAt: -1 };

export const createProduct = async (productData) => {
  const product = await Product.create(productData);
  return product.toObject({ versionKey: false });
};

export const findProductById = async (id) => {
  if (!isValidId(id)) return null;
  return Product.findById(id).select(DEFAULT_PROJECTION).lean();
};

export const findProductByName = (name) => {
  return Product.findOne({ name }).select(DEFAULT_PROJECTION).lean();
};

export const findProducts = async ({ filter, sort = DEFAULT_SORT, skip, limit }) => {
  const [data, total] = await Promise.all([
    Product.find(filter).select(DEFAULT_PROJECTION).sort(sort).skip(skip).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);

  return { data, total };
};

export const updateProductById = async (id, updateData) => {
  if (!isValidId(id)) return null;
  return Product.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
    .select(DEFAULT_PROJECTION)
    .lean();
};

export const deleteProductById = async (id) => {
  if (!isValidId(id)) return null;
  return Product.findByIdAndDelete(id).select(DEFAULT_PROJECTION).lean();
};
