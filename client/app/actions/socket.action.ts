"use server";
import { cookies } from "next/headers";

interface SocketResponse {
  ok: boolean;
  message: string;
  socketToken?: string;
  error?: any;
}

export const getSocketToken = async () : Promise<SocketResponse> => {
  const cookieStore = await cookies();
  try {
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return { ok: false, message: "No token found" };
    }
    const res = await fetch(`${process.env.SERVER_URL}/api/socket/token`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${token}`
      }
    });
    if (!res.ok) {
      const errorData = await res.json();
      return { ok: false, message: errorData.message || "Error retrieving socket token" };
    }
    const data = await res.json();
    return { ok: true, message: "Socket token retrieved successfully", socketToken: data.token };
  } catch (error) {
    console.error("Error retrieving socket token:", error);
    return { ok: false, message: "Error retrieving socket token", error };
  }
};
