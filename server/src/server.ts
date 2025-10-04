import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import apiRouter from './routes/index.ts';
import { createServer } from "http";
import { Server } from "socket.io";
import { socketMiddleware } from './utils/socket-middleware.ts';
import { addSocket, removeSocket, getCountActiveSockets } from './socket.ts';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));


app.get('/', (_req, res) => {
  res.send('Hello, World!');
});

app.use('/api', apiRouter);

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // your Next.js app
    methods: ["GET", "POST"],
  },
});

io.use(socketMiddleware);

io.on('connection', (socket) => {
  addSocket(socket.data.userId, socket.id);
  console.log('A user connected:', socket.id, 'User ID:', socket.data.userId, 'Total active sockets:', getCountActiveSockets());

  socket.on('disconnect', () => {
    removeSocket(socket.data.userId, socket.id);
    console.log('User disconnected:', socket.id, "Total active sockets:", getCountActiveSockets());
  });
});

app.set('io', io);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
