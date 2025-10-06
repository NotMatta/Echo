"use client";
import { useAppData } from "@/components/providers/app-data-provider";
import { useSocket } from "@/components/providers/socket-provider";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
}

const DirectMessagesPage = () => {
  const {id: userId} = useParams();
  const { friends, currentUser } = useAppData();
  const { socket } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [friend] = useState(friends.find(f => f.id === userId) || null);
  const router = useRouter();

  const handleNewMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  }

  const handleSendMessage = () => {
    if(!inputMessage.trim() || !friend) return;
    const newMessage: Message = {
      id: Math.random().toString(36).substring(2, 15),
      senderId: currentUser.id,
      receiverId: friend.id,
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };
    socket?.emit("direct-message", newMessage);
    handleNewMessage(newMessage);
    setInputMessage("");
  }
    
  useEffect(() => {
    const friend = friends.find(f => f.id === userId);
    if(!friend) {
      router.replace("/friends");
    }
  }, [userId, friends, router]);

  useEffect(() => {
    if (!socket) return;

    socket.on("direct-message", handleNewMessage);

    return () => {
      socket.off("direct-message", handleNewMessage);
    };
  }, [socket]);

  return (
    <div className="p-4 flex flex-col">
      <h1>Direct Messages with {friend?.name}</h1>
      <div className="flex flex-col gap-2 grow overflow-y-auto p-4">
      {messages.length === 0 ? (
        <p>No messages yet. Start the conversation!</p>
      ) : (
          <ul>
            {messages.map((msg) => (
              <li key={msg.id}>
                <strong>{msg.senderId === currentUser.id ? "You" : friend?.name}:</strong> {msg.content} <em>({new Date(msg.timestamp).toLocaleString()})</em>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mt-4 flex">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="border p-2 flex-grow mr-2"
          placeholder="Type your message..."
          onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
        />
        <button onClick={handleSendMessage} className="bg-blue-500 text-white px-4 py-2 rounded">
          Send
        </button>
      </div>
    </div>
  );
}

export default DirectMessagesPage;
