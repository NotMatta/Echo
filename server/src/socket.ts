import { Router } from "express";
import { middleware } from "./auth/auth.middleware.ts";
import jwt from "jsonwebtoken";

// Store to manage active socket connections linked to user IDs

const activeSockets: Map<string, Set<string>> = new Map();

export const addSocket = (userId: string, socketId: string) => {
  if (!activeSockets.has(userId)) {
    activeSockets.set(userId, new Set());
  }
  activeSockets.get(userId)!.add(socketId);
}

export const removeSocket = (userId: string, socketId: string) => {
  if (activeSockets.has(userId)) {
    activeSockets.get(userId)!.delete(socketId);
    if (activeSockets.get(userId)!.size === 0) {
      activeSockets.delete(userId);
    }
  }
}

export const getUserSockets = (userId: string): Set<string> | undefined => {
  return activeSockets.get(userId);
}

export const getCountActiveSockets = (): number => {
  let count = 0;
  activeSockets.forEach(sockets => {
    count += sockets.size;
  });
  return count;
}

// Route to generate a JWT token for socket authentication

const router: Router = Router();

router.use(middleware);

router.get("/token", (req, res) => {
  console.log("Generating socket token for user:", req.user);
  try {
    const userId = req.user!.id;
    const token = jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ message: "Error generating socket token", error });
  }
});

router.get("/active-sockets", (req, res) => {
  const userId = req.user!.id;
  const sockets = getUserSockets(userId);
  return res.status(200).json({ count: sockets ? sockets.size : 0, sockets: sockets ? Array.from(sockets) : [] });
});

export {
  router as socketRouter
}
