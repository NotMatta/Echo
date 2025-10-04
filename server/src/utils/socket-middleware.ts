import type { ExtendedError, Socket } from "socket.io";
import jwt from "jsonwebtoken";

export const socketMiddleware = (socket: Socket, next: (err?: ExtendedError) => void ) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    if (!decoded) {
      return next(new Error('Authentication error: Invalid token'));
    }
    socket.data.userId = decoded.userId;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
}
