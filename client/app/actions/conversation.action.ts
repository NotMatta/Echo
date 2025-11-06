"use server"
import { Conversation } from "@/generated/prisma";
import { ActionResponse } from "@/types/action-response";
import { cookies } from "next/headers";

export const getConversation = async (conversationId: string) : Promise<ActionResponse & { data? : Conversation }> => {
  const cookieStore = await cookies();
  try{
    const token = cookieStore.get('token')?.value;
    if (!token) {
      return { ok: false, message: "No token found" };
    }
    const res = await fetch(`${process.env.SERVER_URL}/api/conversations?id=${conversationId}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${token}`
      }
    });
    if (!res.ok) {
      const errorData = await res.json();
      console.log(errorData);
      return { ok: false, message: errorData.message || "Error retrieving friendships" };
    }
    const data = await res.json();
    return { ok: true, message: "Conversation retrieved successfully", data };
  } catch (error) {
    return { ok: false, message: "Error retrieving conversation", error };
  }
}

export const sendMessage = async (conversationId: string, content: string) : Promise<ActionResponse> => {
  const cookieStore = await cookies();
  try{
    const token = cookieStore.get('token')?.value;
    if (!token) {
      return { ok: false, message: "No token found" };
    }
    const res = await fetch(`${process.env.SERVER_URL}/api/conversations/messages`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${token}`
      },
      body: JSON.stringify({conversationId, content})
    });
    if (!res.ok) {
      const errorData = await res.json();
      console.log(errorData);
      return { ok: false, message: errorData.message || "Error sending message" };
    }
    const data = await res.json();
    return { ok: true, message: "Message sent", data };
  } catch (error) {
    return { ok: false, message: "Error sending message", error };
  }
}
