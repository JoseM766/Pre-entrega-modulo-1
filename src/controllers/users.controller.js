import * as usersService from "../services/users.service.js";
import { toUserDTO } from "../dto/user.dto.js";

export const listUsers = async (req, res, next) => {
  try {
    const users = await usersService.listUsers();
    res.status(200).json({ status: "success", payload: users.map(toUserDTO) });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await usersService.getUserById(req.params.id);
    res.status(200).json({ status: "success", payload: toUserDTO(user) });
  } catch (error) {
    next(error);
  }
};
