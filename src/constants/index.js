// Valores inmutables del dominio. Object.freeze evita que se modifiquen en runtime
// y centraliza los "strings mágicos" en un único lugar.

export const USER_ROLES = Object.freeze({
  ADMIN: "admin",
  USER: "user",
});

export const PRODUCT_STATUS = Object.freeze({
  AVAILABLE: "available",
  OUT_OF_STOCK: "out_of_stock",
});

export const NODE_ENVIRONMENTS = Object.freeze({
  DEVELOPMENT: "development",
  PRODUCTION: "production",
  TEST: "test",
});
