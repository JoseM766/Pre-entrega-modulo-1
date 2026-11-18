export const toProductDTO = (product) => {
  if (!product) return null;

  return {
    id: product._id ?? product.id,
    name: product.name,
    description: product.description,
    category: product.category,
    price: product.price,
    stock: product.stock,
    status: product.status,
  };
};
