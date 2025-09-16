import { Router } from "express";
import prisma from '../utils/prisma-client.ts';
import jwt from 'jsonwebtoken';
import { hash, compare } from "bcryptjs";

const router: Router = Router();

router.get('/', (_req, res) => {
}

router.post('signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }
  const hashedPassword = await hash(password, 10);
  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    res.status(201).json({ message: 'User created', userId: newUser.id });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }


export default router;
