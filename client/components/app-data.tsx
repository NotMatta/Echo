"use client"

import { getFriendships } from "@/app/actions/friends.action"
import { getCurrentUser } from "@/app/actions/auth.actions"
import { useFetch } from "./hooks/useFetch"
import { Friendship, User } from "@/generated/prisma"

interface FriendshipInitiator extends Friendship {
  initiator: {
    id: string,
    name: string,
    email: string,
    pfp: string,
  }
}

interface FriendshipReceiver extends Friendship {
  receiver: {
    id: string,
    name: string,
    email: string,
    pfp: string,
  }
}

export const AppDataLoader = ({children}: {children: React.ReactNode}) => {

  const {error: friendshipsError, loading: friendshipsLoading} = useFetch<{sent: FriendshipReceiver[], recieved: FriendshipInitiator[]}>("friendships", getFriendships);
  const {error: currentUserError, loading: currentUserLoading} = useFetch<User>("user", getCurrentUser);

  if (friendshipsLoading  || currentUserLoading) {
    return (
      <div>Loading...</div>
    )
  }

  if (friendshipsError || currentUserError) {
    return (
      <div>Error loading app data. Please refresh the page.</div>
    )
  }

  return (
    <div>
      {children}
    </div>
  )
}
