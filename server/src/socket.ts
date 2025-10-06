import { Router } from "express";
import { middleware } from "./auth/auth.middleware.ts";
import jwt from "jsonwebtoken";
import type { Socket } from "socket.io";
import prisma from "./utils/prisma-client.ts";
import type { User } from "@prisma/client";

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
}

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

// Utils

const getFriends = async (userId: string) => {
  try {
    const friends = await prisma.friendship.findMany({
      where: {
        OR: [
          { initiatorId: userId, status: 'FRIENDS' },
          { receiverId: userId, status: 'FRIENDS' }
        ]
      },
      select: {
        initiatorId: true,
        receiverId: true
      }
    });
    return friends.map(f => f.initiatorId === userId ? f.receiverId : f.initiatorId);
  } catch (error) {
    console.error("Error retrieving friends for user:", userId, error);
    return [];
  }
}

export const getFriendsStatus = async (friends: Partial<User>[]) => {
  return friends.map(friend => {
    return {
      id: friend.id,
      name: friend.name,
      email: friend.email,
      pfp: friend.pfp,
     online: activeSockets.has(friend.id!)
    }
  });
}

// Handle functions

export const handleConnection = async (socket: Socket) => {
  addSocket(socket.data.userId, socket.id);
  socket.join("user-status-" + socket.data.userId);
  socket.to("user-status-" + socket.data.userId).emit("friend-online", { userId: socket.data.userId });
  socket.on("direct-message", async (msg: Message) => {
    const receiverSockets = getUserSockets(msg.receiverId);
    if (receiverSockets) {
      receiverSockets.forEach(sid => {
        socket.to(sid).emit("direct-message", msg);
      });
    }
  });
  socket.on("typing", ({ to }: { to: string }) => {
    const receiverSockets = getUserSockets(to);
    if (receiverSockets) {
      receiverSockets.forEach(sid => {
        socket.to(sid).emit("typing", { from: socket.data.userId });
      });
    }
  });

  socket.on("stop-typing", ({ to }: { to: string }) => {
    const receiverSockets = getUserSockets(to);
    if (receiverSockets) {
      receiverSockets.forEach(sid => {
        socket.to(sid).emit("stop-typing", { from: socket.data.userId });
      });
    }
  });

  const friends = await getFriends(socket.data.userId);
  friends.forEach(friendId => {
      socket.join("user-status-" + friendId);
  });
  console.log('A user connected:', socket.id, 'User ID:', socket.data.userId, 'Total active sockets:', getCountActiveSockets());

  socket.on('disconnect', () => {
    socket.to("user-status-" + socket.data.userId).emit("friend-offline", { userId: socket.data.userId });
    removeSocket(socket.data.userId, socket.id);
    console.log('User disconnected:', socket.id, "Total active sockets:", getCountActiveSockets());
  });
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

router.get("/test", (req, res) => {
  const io: Socket = req.app.get('io');
  io.emit("test-event");
  return res.status(200).json({ message: "Test event emitted" });
});

export {
  router as socketRouter
}
