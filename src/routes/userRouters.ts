import { Router } from "express";
import {
  viewBooks,
  borrowBook,
  viewBorrowedBooks,
  signUp,
  signIn,
} from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/books", authMiddleware, viewBooks);
router.post("/borrow", authMiddleware, borrowBook);
router.get("/borrowed", authMiddleware, viewBorrowedBooks);

export { router as userRoutes };
