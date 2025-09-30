import { Router } from "express";
import prisma from '../utils/prisma-client.ts';
import jwt from 'jsonwebtoken';
import { hash, compare } from "bcryptjs";

const router: Router = Router();

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    const hashedPassword = await hash(password, 10);
    const existingUser = await prisma.user.findFirst({
      where: {OR : [{ email }, { name }]},
    });
    if (existingUser) {
      return res.status(403).json({message: "User already exists" });
    }
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });
    const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET!, { expiresIn: '7d' });
    res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    return res.status(201).json({ message: 'User created', userId: user.id });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating user', error });
  }
})

router.post('/signin', async (req, res) => {
  try {
    const { name, password } = req.body;
    if (!name || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    const user = await prisma.user.findUnique({
      where: { name },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(403).json({ message: "Invalid password" });
    }
    const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET!, { expiresIn: '7d' });
    res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    return res.status(200).json({ message: 'Signed in', userId: user.id });
  } catch (error) {
    return res.status(500).json({ message: 'Error signing in', error });
  }
})

router.get('/validate', async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'No token found' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const user = await prisma.user.findUnique({where: { id: decoded.userId }, select: { id: true, name: true, email: true, pfp: true }});
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ message: 'Token is valid', user });
  } catch (error) {
    res.clearCookie('token');
    return res.status(401).json({ message: 'Invalid token', error });
  }
});

export default router;
