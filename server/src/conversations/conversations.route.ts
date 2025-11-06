import { Router } from "express";
import prisma from "../utils/prisma-client.ts";
import { middleware } from "../auth/auth.middleware.ts";

export const router: Router = Router();

router.use(middleware)

router.get('/', async (req, res) => {
  try{
    const conversationId = req.query.id as string;
    if (!conversationId) {
      return res.status(400).json({ error: "Missing conversation ID" });
    }
    const userId = req.user!.id;
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId: conversationId,
          userId: userId,
        },
      },
    });
    if (!participant) {
      return res.status(404).json({ error: "Conversation not found" });
    }
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                pfp: true,
              },
            },
          },
        },
      },
    });
    return res.json(conversation);
  } catch (error) {
    console.error("Error fetching direct message conversation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post('/messages', async (req, res) => {
  try {
    const { conversationId, content } = req.body;
    if (!conversationId || !content) {
      return res.status(400).json({ error: "Missing conversation ID or content" });
    }
    const userId = req.user!.id;
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId: conversationId,
          userId: userId,
        },
      },
    });
    if (!participant) {
      return res.status(404).json({ error: "Conversation not found" });
    }
    const message = await prisma.message.create({
      data: {
        conversationId: conversationId,
        senderId: userId,
        content: content,
      },
    });
    res.status(201).json(message);
  }
  catch (error) {
    console.error("Error posting message to conversation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
