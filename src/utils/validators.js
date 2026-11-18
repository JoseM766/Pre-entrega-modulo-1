export const hasRequiredRegisterFields = ({ first_name, last_name, email, password }) => {
  return Boolean(first_name && last_name && email && password);
};

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const isValidPassword = (password) => {
  return typeof password === "string" && password.length >= 8;
};

export const normalizeEmail = (email) => {
  return email.trim().toLowerCase();
};

// --- Validadores de Product ---

export const hasRequiredProductFields = ({ name, description, category }) => {
  return Boolean(name && description && category);
};

export const isValidPrice = (price) => {
  return typeof price === "number" && price >= 0;
};

export const isValidStock = (stock) => {
  return Number.isInteger(stock) && stock >= 0;
};
