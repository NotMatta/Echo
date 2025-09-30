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
