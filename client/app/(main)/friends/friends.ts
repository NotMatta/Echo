"use server"
import { validateToken } from "@/app/actions/auth.actions";
import { Status } from "@/generated/prisma";
import prisma from "@/utils/prisma-client";

interface SendRequestResult {
  ok: boolean;
  message: string;
  error?: any;
}

export interface fetchOptions extends SendRequestResult {
  data?: any;
}

export const SendRequest = async (username: string) : Promise<SendRequestResult> => {
  try {
    return await prisma.$transaction(async (prisma) => {
      const res = await validateToken();
      if (!res || !res.ok) {
        return { ok: false, message: "Unauthorized" };
      }
      const foundUser = await prisma.user.findUnique({
        where: { name: username},
      });
      if (!foundUser) {
        return { ok: false, message: "User not found" };
      }
      if (foundUser.id === res.userId) {
        return { ok: false, message: "You cannot send a friend request to yourself" };
      }
      const foundFriendRequest = await prisma.friendship.findFirst({
        where: {OR: [
          {
            initiatorId: res.userId,
            receiverId: foundUser.id,
          },
          {
            initiatorId: foundUser.id,
            receiverId: res.userId,
          }
        ]}
      });
      if (foundFriendRequest) {
        switch (foundFriendRequest.status) {
          case "FRIENDS":
            return { ok: false, message: "You are already friends" };
          case "REJECTED":
            return { ok: false, message: "You cannot send a friend request" };
          case "BLOCKED":
            return { ok: false, message: foundFriendRequest.initiatorId === res.userId ? "You Blocked this user" : "This user Blocked you" };
          default:
            return { ok: false, message: "Friend request already sent" };
        }
      }
      await prisma.friendship.create({
        data: {
          initiatorId: res.userId!,
          receiverId: foundUser.id,
          status: "PENDING",
        },
      });
      return { ok: true, message: "Friend request sent successfully" };
    });
  } catch (error) {
    console.error("Error sending friend request:", error);
    return { ok: false, message: "Error sending friend request", error };
  }
}

export const fetchFriendRequests = async (type: "SENT" | "RECEIVED" ) : Promise<fetchOptions> => {
  try {
    const res = await validateToken();
    if (!res || !res.ok) {
      return { ok: false, message: "Unauthorized" };
    }
    if (type === "SENT") {
      const requests = await prisma.friendship.findMany({
        where: {
          initiatorId: res.userId,
          status: Status.PENDING,
        },
        include: {
          receiver: {
            select: {
              id: true,
              name: true,
              pfp: true,
            }
          }
        },
      });
      return { ok: true, message: "Friend requests fetched successfully", data: requests };
    } else {
      const requests = await prisma.friendship.findMany({
        where: {
          receiverId: res.userId,
          status: Status.PENDING,
        },
        include: {
          initiator: {
            select: {
              id: true,
              name: true,
              pfp: true,
            }
          }
        },
      });
      return { ok: true, message: "Friend requests fetched successfully", data: requests };
    }
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    return { ok: false, message: "Error fetching friend requests", error };
  }
}

export const cancelRequest = async (requestId: number) : Promise<SendRequestResult> => {
  try {
    return await prisma.$transaction(async (prisma) => {
      const res = await validateToken();
      if (!res || !res.ok) {
        return { ok: false, message: "Unauthorized" };
      }
      const foundRequest = await prisma.friendship.findUnique({
        where: { id: requestId },
      });
      if (!foundRequest) {
        return { ok: false, message: "Friend request not found" };
      }
      if (foundRequest.initiatorId !== res.userId) {
        return { ok: false, message: "You are not authorized to cancel this friend request" };
      }
      if (foundRequest.status !== Status.PENDING) {
        return { ok: false, message: "You can only cancel pending friend requests" };
      }
      await prisma.friendship.delete({
        where: { id: requestId },
      });
      return { ok: true, message: "Friend request cancelled successfully" };
    });
  } catch (error) {
    console.error("Error cancelling friend request:", error);
    return { ok: false, message: "Error cancelling friend request", error };
  }
}

export const acceptRequest = async (requestId: number) : Promise<SendRequestResult> => {
  try {
    return await prisma.$transaction(async (prisma) => {
      const res = await validateToken();
      if (!res || !res.ok) {
        return { ok: false, message: "Unauthorized" };
      }
      const foundRequest = await prisma.friendship.findUnique({
        where: { id: requestId },
      });
      if (!foundRequest) {
        return { ok: false, message: "Friend request not found" };
      }
      if (foundRequest.receiverId !== res.userId) {
        return { ok: false, message: "You are not authorized to accept this friend request" };
      }
      if (foundRequest.status !== Status.PENDING) {
        return { ok: false, message: "You can only accept friend requests" };
      }
      await prisma.user.update({
        where: {id: res.userId},
        data: {
          friends: { connect: {id: foundRequest.initiatorId}}
        }
      });
      await prisma.user.update({
        where: {id: foundRequest.initiatorId},
        data: {
          friends: { connect: {id: res.userId}}
        }
      });
      await prisma.friendship.update({
        where: { id: requestId },
        data: { status: Status.FRIENDS },
      })
      return { ok: true, message: "Friend request cancelled successfully" };
    });
  } catch (error) {
    console.error("Error cancelling friend request:", error);
    return { ok: false, message: "Error cancelling friend request", error };
  }
}

export const declineRequest = async (requestId: number) : Promise<SendRequestResult> => {
  try {
    return await prisma.$transaction(async (prisma) => {
      const res = await validateToken();
      if (!res || !res.ok) {
        return { ok: false, message: "Unauthorized" };
      }
      const foundRequest = await prisma.friendship.findUnique({
        where: { id: requestId },
      });
      if (!foundRequest) {
        return { ok: false, message: "Friend request not found" };
      }
      if (foundRequest.receiverId !== res.userId) {
        return { ok: false, message: "You are not authorized to decline this friend request" };
      }
      if (foundRequest.status !== Status.PENDING) {
        return { ok: false, message: "You can only decline pending friend requests" };
      }
      await prisma.friendship.update({
        where: { id: requestId },
        data: { status: Status.REJECTED },
      });
      return { ok: true, message: "Friend request declined successfully" };
    });
  } catch (error) {
    console.error("Error declining friend request:", error);
    return { ok: false, message: "Error declining friend request", error };
  }
}

export const getFriends = async () => {
  try {
    const res = await validateToken();
    if (!res || !res.ok) {
      return { ok: false, message: "Unauthorized" };
    }
    const userWithFriends = await prisma.user.findUnique({
      where: { id: res.userId },
      include: {
        friends: {
          select: {
            id: true,
            name: true,
            pfp: true,
          }
        }
      }
    });
    if (!userWithFriends) {
      return { ok: false, message: "User not found" };
    }
    return { ok: true, message: "Friends fetched successfully", data: userWithFriends.friends };
  } catch (error) {
    console.error("Error fetching friends:", error);
    return { ok: false, message: "Error fetching friends", error };
  }
}

export const removeFriend = async (friendId: string) : Promise<SendRequestResult> => {
  try{
    return await prisma.$transaction(async (prisma) => {
      const res = await validateToken();
      if (!res || !res.ok) {
        return { ok: false, message: "Unauthorized" };
      }
      const foundUser = await prisma.user.findUnique({where: {id: friendId}})
      if(!foundUser){
        return { ok: false, message: "User not found" };
      }
      const foundRequest = await prisma.friendship.findFirst({
        where: {OR: [
          {
            initiatorId: res.userId,
            receiverId: foundUser.id,
          },
          {
            initiatorId: foundUser.id,
            receiverId: res.userId,
          }
        ],
        status: Status.FRIENDS
        }
      });
      if(!foundRequest){
        return { ok: false, message: "Friendship not found" };
      }
      await prisma.user.update({
        where: {id: foundRequest.receiverId},
        data: {
          friends: { disconnect: {id: foundRequest.initiatorId}}
        }
      });
      await prisma.user.update({
        where: {id: foundRequest.initiatorId},
        data: {
          friends: { disconnect: {id: foundRequest.receiverId}}
        }
      });
      await prisma.friendship.delete({where: {id: foundRequest.id}})
      return { ok: false, message: "Friendship ended" };
    })
  } catch (error) {
    console.error("Error fetching friends:", error);
    return { ok: false, message: "Error removing friend", error };
  }
}
