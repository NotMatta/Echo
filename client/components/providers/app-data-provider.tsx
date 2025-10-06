"use client"

import { useState, useEffect, createContext, useContext } from "react"
import { Friendship } from "@/generated/prisma"
import { Friends, FriendshipReceiver, FriendshipInitiator } from "@/types/friendship";
import { getFriendships } from "@/app/actions/friends.action";
import { getCurrentUser } from "@/app/actions/auth.actions";

interface CurrentUser {
  id: string;
  name: string;
  email: string
  pfp?: string;
}

interface AppDataProviderContext {
  requests: FriendshipInitiator[];
  pendings: FriendshipReceiver[];
  friends: Friends[];
  currentUser: CurrentUser | null;
  setRequests: (next: (old : FriendshipInitiator[]) => FriendshipInitiator[]) => void ;
  setPendings: (next: (old : FriendshipReceiver[]) => FriendshipReceiver[]) => void ;
  setFriends: (next: (old : Friends[]) => Friends[]) => void ;
  setCurrentUser: (next: (old: CurrentUser | null) => CurrentUser) => void;
}

const appDataProviderContext = createContext<AppDataProviderContext | null>(null);

export const AppDataProvider = ({children} : {children: React.ReactNode}) => {
  const [requests,setRequests] = useState<FriendshipInitiator[]>([]);
  const [pendings,setPendings] = useState<FriendshipReceiver[]>([]);
  const [friends,setFriends] = useState<Friends[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [error,setError] = useState<string | null>();
  const [loading,setLoading] = useState(true);

  useEffect(() => {
    const fetchAllFriendships = async () => {
      const res = await getFriendships();
      if(!res.ok){
        setError(res.error);
        setLoading(false)
        return;
      }
      const data = res.data as AppDataProviderContext;
      setRequests(data.requests);
      setPendings(data.pendings);
      setFriends(data.friends);
      setLoading(false);
    }

    const fetchUser = async () => {
      const res = await getCurrentUser();
      if(!res.ok){
        setError(res.error);
        setLoading(false)
        return;
      }
      const data = res.data as CurrentUser;
      setCurrentUser(data);
    }

    if (loading) {
      fetchAllFriendships();
      fetchUser();
    }
      
  },[])

  if(loading){
    return "Loading..."
  }

  if(error){
    return "Error..."
  }

  return (
  <appDataProviderContext.Provider value={{requests, pendings, friends, setRequests, setPendings, setFriends, currentUser, setCurrentUser}}>
    {children}
  </appDataProviderContext.Provider>
  )
}

export const useAppData = () => {
  return useContext(appDataProviderContext);
}
