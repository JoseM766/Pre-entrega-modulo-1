import * as productsService from "../services/products.service.js";
import { toProductDTO } from "../dto/product.dto.js";

export const createProduct = async (req, res, next) => {
  try {
    const { name, description, category, price, stock } = req.body;

    const newProduct = await productsService.createProduct({
      name,
      description,
      category,
      price,
      stock,
    });

    res.status(201).json({ status: "success", payload: toProductDTO(newProduct) });
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const { status, category, page, limit, sort } = req.query;

    const result = await productsService.listProducts({ status, category, page, limit, sort });

    res.status(200).json({
      status: "success",
      data: result.data.map(toProductDTO),
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await productsService.getProductById(req.params.id);
    res.status(200).json({ status: "success", payload: toProductDTO(product) });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const updatedProduct = await productsService.updateProduct({
      productId: req.params.id,
      updateData: req.body,
    });

    res.status(200).json({ status: "success", payload: toProductDTO(updatedProduct) });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    await productsService.deleteProduct(req.params.id);
    res.status(200).json({ status: "success", message: "Producto eliminado" });
  } catch (error) {
    next(error);
  }
};
