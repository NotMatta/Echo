import { Router } from "express";
import { middleware } from "../auth/auth.middleware.ts";
import prisma from "../utils/prisma-client.ts";

const router: Router = Router();
router.use(middleware);

router.get("/test", (_req, res) => {
  return res.status(200).json({ message: "Friendships route is working!" });
}
);

router.get("/", async (req, res) => {
  try{
    const sent = await prisma.friendship.findMany({
      where: { initiatorId: req.user!.id },
      include: { receiver: { select: { id: true, name: true, email: true, pfp: true } } },
    });
    const received = await prisma.friendship.findMany({
      where: { receiverId: req.user!.id },
      include: { initiator: { select: { id: true, name: true, email: true, pfp: true } } },
    });
    return res.status(200).json({friendships: {sent,received}});
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving friendships", error });
  }
});

router.post("/:friendName", async (req, res) => {
  try {
    const { friendName } = req.params;
    const foundUser = await prisma.user.findUnique({
      where: { name: friendName },
    });
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }
    if (foundUser.id === req.user!.id) {
      return res.status(400).json({ message: "You cannot send a friend request to yourself" });
    }
    const existingFriendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { initiatorId: req.user!.id, receiverId: foundUser.id },
          { initiatorId: foundUser.id, receiverId: req.user!.id },
        ],
      },
    });
    if (existingFriendship) {
      switch (existingFriendship.status) {
        case "PENDING":
          return res.status(400).json({ message: "Friend request already pending" });
        case "FRIENDS":
          return res.status(400).json({ message: "You are already friends" });
        case "REJECTED":
          return res.status(400).json({ message: "Friend request was rejected" });
        case "IN_BLOCKED":
          if (existingFriendship.initiatorId === req.user!.id) {
            return res.status(400).json({ message: "You have blocked this user" });
          } else {
            return res.status(400).json({ message: "You are blocked by this user" });
          }
        case "RE_BLOCKED":
          if (existingFriendship.receiverId === req.user!.id) {
            return res.status(400).json({ message: "You have blocked this user" });
          } else {
            return res.status(400).json({ message: "You are blocked by this user" });
          }
        default:
          return res.status(400).json({ message: "Friend request already exists" });
      }
    }
    const newFriendship = await prisma.friendship.create({
      data: {
        initiatorId: req.user!.id,
        receiverId: foundUser.id,
        status: "PENDING",
      },
    });
    return res.status(201).json({ message: "Friend request sent", friendship: newFriendship });
  }
  catch (error) {
    return res.status(500).json({ message: "Error sending friend request", error });
  }
});

export default router;
