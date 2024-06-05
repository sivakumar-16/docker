import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const  adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authheader = req.headers.authorization;
console.log(authheader,req.headers);

  if (!authheader) {
    res.status(401).json({ message: "missing token" });
  }
  const token = authheader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied" });
  }

  try {
    const decoded = jwt.verify(token, "SECRET_KEY");

    (req as any).user = decoded;
    const user = (req as any).user;
    if (user.role !== "admin") {
      console.log("Decoded user:", user);
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    return res.status(400).json({ message: "Invalid token" });
  }
};
