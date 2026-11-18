import * as usersRepository from "../repositories/users.repository.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { ServiceError } from "../utils/service-error.js";
import { USER_ROLES } from "../constants/index.js";
import {
  hasRequiredRegisterFields,
  isValidEmail,
  isValidPassword,
  normalizeEmail,
} from "../utils/validators.js";

export const registerUser = async ({ first_name, last_name, email, password }) => {
  if (!hasRequiredRegisterFields({ first_name, last_name, email, password })) {
    throw new ServiceError("MISSING_FIELDS", "Faltan campos obligatorios");
  }

  if (!isValidEmail(email)) {
    throw new ServiceError("INVALID_EMAIL", "El formato del email no es válido");
  }

  if (!isValidPassword(password)) {
    throw new ServiceError("INVALID_PASSWORD", "La contraseña debe tener al menos 8 caracteres");
  }

  const normalizedEmail = normalizeEmail(email);

  const existingUser = await usersRepository.findUserByEmail(normalizedEmail);
  if (existingUser) {
    throw new ServiceError("EMAIL_EXISTS", "El email ya está registrado");
  }

  const hashedPassword = await hashPassword(password);

  // El rol nunca se toma del body: siempre se registra como USER.
  return usersRepository.createUser({
    first_name,
    last_name,
    email: normalizedEmail,
    password: hashedPassword,
    role: USER_ROLES.USER,
  });
};

// Devuelve el usuario (sin password) si las credenciales son correctas, o null si no.
// No distingue "email inexistente" de "password incorrecta" para no dar pistas.
export const authenticateUser = async ({ email, password }) => {
  if (!email || !password) return null;

  const user = await usersRepository.findUserByEmailWithPassword(normalizeEmail(email));
  if (!user) return null;

  const passwordMatches = await comparePassword(password, user.password);
  if (!passwordMatches) return null;

  const { password: _hashedPassword, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
