import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import apiRouter from './routes/index.ts';
import { createServer } from "http";
import { Server } from "socket.io";
import { socketMiddleware } from './utils/socket-middleware.ts';
import { handleConnection } from './socket.ts';

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

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.use(socketMiddleware);
io.on('connection', handleConnection);
app.set('io', io);

app.use('/api', apiRouter);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
