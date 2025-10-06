"use client"

import { getFriends, getFriendships } from "@/app/actions/friends.action"
import { getCurrentUser } from "@/app/actions/auth.actions"
import { useFetch } from "../hooks/useFetch"
import { User } from "@/generated/prisma"
import { Friends, FriendshipInitiator, FriendshipReceiver } from "@/types/friendship"
import { createContext, useContext } from "react"

export interface Friendships {
  sent: FriendshipReceiver[],
  received: FriendshipInitiator[]
}

const AppDataContext = createContext<{
  friendships: Friendships,
  mutateFriendships: (next: (old: Friendships) => Friendships) => void,
  friends: Friends[],
  mutateFriends: (next: (old: Friends[]) => Friends[]) => void,
  currentUser: User,
  mutateCurrentUser: (next: (old: User) => User) => void,
} | null>(null);

export const AppDataProvider = ({children}: {children: React.ReactNode}) => {
  const {
    data: friendships,
    mutate: mutateFriendships,
    loading: friendshipsLoading,
    error: friendshipsError
  } = useFetch<Friendships>("friendships", getFriendships);

  const {
    data: currentUser,
    mutate: mutateCurrentUser,
    loading: currentUserLoading,
    error: currentUserError
  } = useFetch<User>("user", getCurrentUser);

  const {
    data: friends,
    mutate: mutateFriends,
    loading: friendsLoading,
    error: friendsError
  } = useFetch<Friends[]>("friends", getFriends);


  if (friendshipsLoading  || currentUserLoading || friendsLoading) {
    return (
      <div>Loading...</div>
    )
  }

  if (friendshipsError || currentUserError || friendsError) {
    return (
      <div>Error loading app data. Please refresh the page. {JSON.stringify({currentUserError, friendshipsError})}</div>
    )
  }

  return (
    <AppDataContext.Provider value={{friendships: friendships!, mutateFriendships, currentUser: currentUser!, mutateCurrentUser, friends: friends || [], mutateFriends}}>
      {children}
    </AppDataContext.Provider>
  )
}

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error("useAppData must be used within an AppDataProvider");
  }
  return context;
}
