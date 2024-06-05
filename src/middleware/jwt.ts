import jwt from "jsonwebtoken";
import { User } from "../models/userTable";

export const generateToken = (user: User): string => {
  return jwt.sign({ id: user.ID, role:user.role }, "SECRET_KEY", { expiresIn: "2h" });
};
