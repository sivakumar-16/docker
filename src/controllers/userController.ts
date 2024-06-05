import { Request, Response } from "express";
import { AppDataSource } from "../dbConfig";
import { User } from "../models/userTable";
import { Book } from "../models/bookTable";
import { UserBook } from "../models/userBookTable";
import bcrypt from "bcryptjs";
// import jwt from 'jsonwebtoken';
import { generateToken } from "../middleware/jwt";
// import 'dotenv/config';

//signup

export const signUp = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const userRepository = AppDataSource.getRepository(User);
    if (
      !username ||
      typeof username !== "string" ||
      !password ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        message: "Username and password are required and must be strings",
      });
    }
    const existingUser = await userRepository.findOne({ where: { username } });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = userRepository.create({ username, password: hashedPassword });
    await userRepository.save(user);

    res.status(201).json({ message: "User created" });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Error creating user", error });
  }
};

//signin

export const signIn = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (
      !username ||
      typeof username !== "string" ||
      !password ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        message: "Username and password are required and must be strings",
      });
    }
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // const token = jwt.sign({ userId: user.ID }, "SECRET_KEY", { expiresIn: '1h' });
    const token = generateToken(user);
     return res.status(200).json(token);
  } catch (error) {
    console.error("Error signing in:", error);
    return res.status(500).json({ message: "Error signing in", error });
  }
};

export const viewBooks = async (req: Request, res: Response) => {
  try {
    const bookRepository = AppDataSource.getRepository(Book);
    const books = await bookRepository.find();
   return res.status(200).json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    return res.status(500).json({ message: "Books not found" });
  }
};

export const borrowBook = async (req: Request, res: Response) => {
  const { username, bookname, startdate, enddate } = req.body;

  if (!username || !bookname || !startdate || !enddate) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const userRepository = AppDataSource.getRepository(User);
    const bookRepository = AppDataSource.getRepository(Book);
    const userBookRepository = AppDataSource.getRepository(UserBook);

    const user = await userRepository.findOne({
      where: { username: username },
    });
    const book = await bookRepository.findOne({
      where: { bookname: bookname },
    });

    if (!user || !book) {
      return res.status(400).json({ message: "Invalid user or book" });
    }
    const newUserBook = userBookRepository.create({
      username: user,
      bookname: book,
      startdate: startdate,
      enddate: enddate,
    });
    await userBookRepository.save(newUserBook);
   return res.status(201).json({ message: "Book borrowed successfully" ,newUserBook});
  } catch (error) {
    console.error("Error borrowing book:", error);
   return res.status(500).json({ message: "Internal server error" });
  }
};

export const viewBorrowedBooks = async (req: Request, res: Response) => {
  try {
    // const { UBID } = req.body;
    const userBookRepository = AppDataSource.getRepository(UserBook);
    const userBooks = await userBookRepository.find({
      relations:['username', 'bookname']
    });
    // {where: { UBID: UBID }}
   return res.status(201).json(userBooks);
  } catch (error) {
    console.error("Error borrowed books:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
