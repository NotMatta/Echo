import { Friendship } from "@/generated/prisma"

export interface FriendshipInitiator extends Friendship {
  initiator: {
    id: string,
    name: string,
    email: string,
    pfp?: string | null,
  }
}

export interface FriendshipReceiver extends Friendship {
  receiver: {
    id: string,
    name: string,
    email: string,
    pfp?: string | null,
  }
}
