import * as productsRepository from "../repositories/products.repository.js";
import { PRODUCT_STATUS } from "../constants/index.js";
import { ServiceError } from "../utils/service-error.js";
import {
  hasRequiredProductFields,
  isValidPrice,
  isValidStock,
} from "../utils/validators.js";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

// Regla de negocio: el estado del producto depende de su stock.
// Sin stock no se puede vender, con stock sí. Nadie lo elige a mano.
const statusFromStock = (stock) => {
  return stock > 0 ? PRODUCT_STATUS.AVAILABLE : PRODUCT_STATUS.OUT_OF_STOCK;
};

// El repository devuelve null si el id es inválido o no existe: el service decide qué error es.
const findProductOrFail = async (productId) => {
  const product = await productsRepository.findProductById(productId);

  if (!product) {
    throw new ServiceError("PRODUCT_NOT_FOUND", "El producto no existe");
  }

  return product;
};

// --- Crear producto ---
export const createProduct = async ({ name, description, category, price, stock }) => {
  if (!hasRequiredProductFields({ name, description, category })) {
    throw new ServiceError("MISSING_FIELDS", "Faltan campos obligatorios");
  }

  if (!isValidPrice(price)) {
    throw new ServiceError("INVALID_PRICE", "El precio debe ser un número mayor o igual a 0");
  }

  const finalStock = stock === undefined ? 0 : stock;
  if (!isValidStock(finalStock)) {
    throw new ServiceError("INVALID_STOCK", "El stock debe ser un entero mayor o igual a 0");
  }

  const existingProduct = await productsRepository.findProductByName(name.trim());
  if (existingProduct) {
    throw new ServiceError("PRODUCT_EXISTS", "Ya existe un producto con ese nombre");
  }

  return productsRepository.createProduct({
    name,
    description,
    category,
    price,
    stock: finalStock,
    status: statusFromStock(finalStock),
  });
};

// --- Listar productos con filtros, paginación y ordenamiento ---
// Por defecto solo se muestran los productos AVAILABLE (con stock).
// Para ver los agotados hay que pedirlos: ?status=out_of_stock
export const listProducts = async ({ status, category, page, limit, sort }) => {
  const filter = {};

  if (status && !Object.values(PRODUCT_STATUS).includes(status)) {
    throw new ServiceError("INVALID_STATUS", "El estado indicado no es válido");
  }

  filter.status = status || PRODUCT_STATUS.AVAILABLE;
  if (category) filter.category = category;

  const currentPage = Math.max(parseInt(page, 10) || DEFAULT_PAGE, 1);
  const pageLimit = Math.min(parseInt(limit, 10) || DEFAULT_LIMIT, MAX_LIMIT);
  const skip = (currentPage - 1) * pageLimit;

  // sort=price o sort=-price (el "-" indica descendente). Sin sort, el repository usa su orden por defecto.
  const sortOption = sort ? sort.split(",").join(" ") : undefined;

  const { data, total } = await productsRepository.findProducts({
    filter,
    sort: sortOption,
    skip,
    limit: pageLimit,
  });

  return {
    data,
    page: currentPage,
    limit: pageLimit,
    total,
    totalPages: Math.ceil(total / pageLimit) || 0,
  };
};

// --- Consultar un producto por id ---
export const getProductById = async (productId) => {
  return findProductOrFail(productId);
};

// --- Actualizar un producto ---
export const updateProduct = async ({ productId, updateData }) => {
  await findProductOrFail(productId);

  // El status no se manda a mano: se recalcula solo cuando cambia el stock.
  const { status, ...safeUpdateData } = updateData;

  if (safeUpdateData.price !== undefined && !isValidPrice(safeUpdateData.price)) {
    throw new ServiceError("INVALID_PRICE", "El precio debe ser un número mayor o igual a 0");
  }

  if (safeUpdateData.stock !== undefined) {
    if (!isValidStock(safeUpdateData.stock)) {
      throw new ServiceError("INVALID_STOCK", "El stock debe ser un entero mayor o igual a 0");
    }
    safeUpdateData.status = statusFromStock(safeUpdateData.stock);
  }

  return productsRepository.updateProductById(productId, safeUpdateData);
};

// --- Eliminar un producto ---
export const deleteProduct = async (productId) => {
  await findProductOrFail(productId);
  return productsRepository.deleteProductById(productId);
};
