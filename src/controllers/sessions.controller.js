import { generateToken } from "../utils/jwt.js";
import { config } from "../config/index.js";
import { toUserDTO, toCurrentUserDTO } from "../dto/user.dto.js";

export const register = (req, res) => {
  res.status(201).json({ status: "success", payload: toUserDTO(req.user) });
};

export const login = (req, res) => {
  const { _id, email, role } = req.user;

  const token = generateToken({ id: _id, email, role });

  res.cookie("currentUser", token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 3600000,
    secure: config.isProduction,
  });

  res.status(200).json({ status: "success", message: "Login correcto" });
};

export const current = (req, res) => {
  res.status(200).json({ status: "success", payload: toCurrentUserDTO(req.user) });
};

export const logout = (req, res) => {
  res.clearCookie("currentUser");
  res.status(200).json({ status: "success", message: "Sesión cerrada" });
};