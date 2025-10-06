"use server"
import { ActionResponse } from "@/types/action-response";
import { cookies } from "next/headers";

export const getFriendships = async () : Promise<ActionResponse> => {
  const cookieStore = await cookies();
  try{
    const token = cookieStore.get('token')?.value;
    if (!token) {
      return { ok: false, message: "No token found" };
    }
    const res = await fetch(`${process.env.SERVER_URL}/api/friendships`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${token}`
      }
    });
    if (!res.ok) {
      const errorData = await res.json();
      return { ok: false, message: errorData.message || "Error retrieving friendships" };
    }
    const data = await res.json();
    return { ok: true, message: "Friendships retrieved successfully", data: data.friendships };
  } catch (error) {
    return { ok: false, message: "Error retrieving friendships", error };
  }
}

export const getFriends = async () : Promise<ActionResponse> => {
  const cookieStore = await cookies();
  try{
    const token = cookieStore.get('token')?.value;
    if (!token) {
      return { ok: false, message: "No token found" };
    }
    const res = await fetch(`${process.env.SERVER_URL}/api/friendships/friends`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${token}`
      }
    });
    if (!res.ok) {
      const errorData = await res.json();
      return { ok: false, message: errorData.message || "Error retrieving friends" };
    }
    const data = await res.json();
    return { ok: true, message: "Friends retrieved successfully", data: data.friends };
  } catch (error) {
    return { ok: false, message: "Error retrieving friends", error };
  }
}

export const addFriend = async (username: string) : Promise<ActionResponse> => {
  const cookieStore = await cookies();
  try{
    const token = cookieStore.get('token')?.value;
    if (!token) {
      return { ok: false, message: "No token found" };
    }
    const res = await fetch(`${process.env.SERVER_URL}/api/friendships`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${token}`
      },
      body: JSON.stringify({ friendName: username })
    });
    if (!res.ok) {
      const errorData = await res.json();
      return { ok: false, message: errorData.message || "Error adding friend" };
    }
    const data = await res.json();
    return { ok: true, message: "Friend added successfully", data: data.friendship };
  } catch (error) {
    return { ok: false, message: "Error adding friend", error };
  }
}

export const cancelRequest = async (friendshipId: string) : Promise<ActionResponse> => {
  const cookieStore = await cookies();
  try{
    const token = cookieStore.get('token')?.value;
    if (!token) {
      return { ok: false, message: "No token found" };
    }
    const res = await fetch(`${process.env.SERVER_URL}/api/friendships/${friendshipId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${token}`
      },
      body: JSON.stringify({ action: "CANCEL" })
    });
    if (!res.ok) {
      const errorData = await res.json();
      return { ok: false, message: errorData.message || "Error cancelling friend request" };
    }
    return { ok: true, message: "Friend request cancelled successfully" };
  } catch (error) {
    return { ok: false, message: "Error cancelling friend request", error };
  }
}

export const acceptRequest = async (friendshipId: string) : Promise<ActionResponse> => {
  const cookieStore = await cookies();
  try{
    const token = cookieStore.get('token')?.value;
    if (!token) {
      return { ok: false, message: "No token found" };
    }
    const res = await fetch(`${process.env.SERVER_URL}/api/friendships/${friendshipId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${token}`
      },
      body: JSON.stringify({ action: "ACCEPT" })
    });
    if (!res.ok) {
      const errorData = await res.json();
      return { ok: false, message: errorData.message || "Error accepting friend request" };
    }
    return { ok: true, message: "Friend request accepted successfully" };
  } catch (error) {
    return { ok: false, message: "Error accepting friend request", error };
  }
}

export const declineRequest = async (friendshipId: string) : Promise<ActionResponse> => {
  const cookieStore = await cookies();
  try{
    const token = cookieStore.get('token')?.value;
    if (!token) {
      return { ok: false, message: "No token found" };
    }
    const res = await fetch(`${process.env.SERVER_URL}/api/friendships/${friendshipId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${token}`
      },
      body: JSON.stringify({ action: "REJECT" })
    });
    if (!res.ok) {
      const errorData = await res.json();
      return { ok: false, message: errorData.message || "Error declining friend request" };
    }
    return { ok: true, message: "Friend request declined successfully" };
  } catch (error) {
    return { ok: false, message: "Error declining friend request", error };
  }
}

export const unfriend = async (friendshipId: string) : Promise<ActionResponse> => {
  const cookieStore = await cookies();
  try{
    const token = cookieStore.get('token')?.value;
    if (!token) {
      return { ok: false, message: "No token found" };
    }
    const res = await fetch(`${process.env.SERVER_URL}/api/friendships/${friendshipId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${token}`
      },
    });
    if (!res.ok) {
      const errorData = await res.json();
      return { ok: false, message: errorData.message || "Error unfriending user" };
    }
    return { ok: true, message: "User unfriended successfully" };
  } catch (error) {
    return { ok: false, message: "Error unfriending user", error };
  }
}
