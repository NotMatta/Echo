import { Router } from "express";
import { middleware } from "../auth/auth.middleware.ts";
import prisma from "../utils/prisma-client.ts";
import { Status } from "@prisma/client";

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

router.post("/", async (req, res) => {
  try {
    const { friendName } = req.body;
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
          if(existingFriendship.updatedAt.getTime() + 24*60*60*1000 > new Date().getTime()) {
            if(existingFriendship.initiatorId === req.user!.id) {
              return res.status(400).json({ message: "You have been rejected, you need to wait 24 hours before sending another friend request" });
            } 
          }
          await prisma.friendship.delete({ where: { id: existingFriendship.id } });
          break;
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
      include: { receiver: { select: { id: true, name: true, email: true, pfp: true } } },
    });
    return res.status(201).json({ message: "Friend request sent", friendship: newFriendship });
  }
  catch (error) {
    return res.status(500).json({ message: "Error sending friend request", error });
  }
});

router.put("/:friendshipId", async (req, res) => {
  try {
    const { friendshipId } = req.params;
    const { action }: { action: "ACCEPT" | "REJECT" | "BLOCK" | "UNBLOCK" | "CANCEL" } = req.body;
    if(!["ACCEPT", "REJECT", "BLOCK", "UNBLOCK", "CANCEL"].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }
    const friendship = await prisma.friendship.findUnique({
      where: { id: friendshipId },
    });
    if (!friendship) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    let updatedStatus: Status;

    switch (action) {
      case "ACCEPT": case "REJECT":
        if (friendship.receiverId !== req.user!.id) {
          return res.status(403).json({ message: "You are not authorized to accept or reject this friend request" });
        }
        if (friendship.status !== "PENDING") {
          return res.status(400).json({ message: "Friend request is not pending" });
        }
        updatedStatus = action === "ACCEPT" ? "FRIENDS" : "REJECTED";
        break;
      case "CANCEL":
        if(friendship.status !== "PENDING" || friendship.initiatorId !== req.user!.id) {
          return res.status(403).json({ message: "You are not authorized to cancel this friend request" });
        }
        await prisma.friendship.delete({ where: { id: friendshipId } });
        return res.status(200).json({ message: `Friend request Canceled` });
      case "BLOCK":
        if ((friendship.initiatorId !== req.user!.id && friendship.receiverId !== req.user!.id) || friendship.status !== "FRIENDS") {
          return res.status(403).json({ message: "You are not authorized to block this user" });
        }
        updatedStatus = friendship.initiatorId === req.user!.id ? "RE_BLOCKED" : "IN_BLOCKED";
        break;
      case "UNBLOCK":
        if (friendship.initiatorId !== req.user!.id && friendship.receiverId !== req.user!.id && (friendship.status !== "IN_BLOCKED" && friendship.status !== "RE_BLOCKED")) {
          return res.status(403).json({ message: "You are not authorized to unblock this user" });
        }
        updatedStatus = "REJECTED";
        break;
      default:
        return res.status(400).json({ message: "Invalid action" });
    }

    const updatedFriendship = await prisma.friendship.update({
      where: { id: friendshipId },
      data: { status: updatedStatus },
    });

    return res.status(200).json({ message: `Friend request ${action.toLowerCase()}ed`, friendship: updatedFriendship });
  }
  catch (error) {
    return res.status(500).json({ message: "Error updating friend request", error });
  }
});

router.delete("/:friendshipId", async (req, res) => {
  try {
    const { friendshipId } = req.params;
    if (!friendshipId) {
      return res.status(400).json({ message: "Friendship ID is required" });
    }
    const friendship = await prisma.friendship.findUnique({
      where: { id: friendshipId },
    });
    if (!friendship) {
      return res.status(404).json({ message: "Friend request not found" });
    }
    if (friendship.initiatorId !== req.user!.id && friendship.receiverId !== req.user!.id) {
      return res.status(403).json({ message: "You are not authorized to delete this friend request" });
    }
    if(friendship.status !== "FRIENDS") {
      return res.status(400).json({ message: "Only friends can be deleted" });
    }
    await prisma.friendship.delete({ where: { id: friendshipId } });
    return res.status(200).json({ message: "Friend request deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting friend request", error });
  }
});

export default router;
