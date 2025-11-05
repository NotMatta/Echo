"use client";
import { useAppData } from "@/components/providers/app-data-provider";
import { useSocket } from "@/components/providers/socket-provider";
import { PageTemplate } from "@/components/ui/v2/page-template";
import { User } from "@/generated/prisma";
import { ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
}

const MessageItem = ({ message, owner }: { message: Message; owner: Partial<User>}) => {
  const messageDate = new Date(message.timestamp)

  return (
    <div className="w-full flex items-start gap-4">
      {owner.pfp ? (
        <img src={owner.pfp} alt={owner.name} className="w-10 h-10 rounded-full object-cover inline-block"/>
      ) : (
          <div className="w-10 h-10 bg-white/10 rounded-full flex justify-center items-center text-lg font-bold">
            {owner.name!.charAt(0).toUpperCase() || "U"}
          </div>
        )}
      <div className="flex flex-col">
        <div className="flex gap-2 items-center">
          <p className="text-sm font-semibold">{owner.name}</p>
          <div className="text-xs text-gray-400">{
            /* Check if it's today ? HH:MM else DD/MM/YYYY HH:MM */
            messageDate.toDateString() === new Date().toDateString()
              ? messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : messageDate.toLocaleDateString() + " " + messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }</div>
        </div>
        <p className="whitespace-pre">{message.content}</p>
      </div>
    </div>
  )
};

const DirectMessagesPage = () => {
  const {id: userId} = useParams();
  const { friends, currentUser } = useAppData()!;
  const { socket } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [friend] = useState(friends.find(f => f.id === userId) || null);
  const [isTyping,setIsTyping] = useState(false);
  const [isFriendTyping,setIsFriendTyping] = useState(false);
  const router = useRouter();

  const handleNewMessage = (message: Message) => {
    setMessages(prevMessages => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      if (lastMessage && lastMessage.senderId === message.senderId && lastMessage.receiverId === message.receiverId ) {
        const updatedMessages = [...prevMessages];
        updatedMessages[updatedMessages.length - 1] = {
          ...lastMessage,
          content: lastMessage.content + "\n" + message.content,
          timestamp: message.timestamp, // Update timestamp to the latest message
        };
        return updatedMessages;
      } else {
        return [...prevMessages, message];
      }
    })
  }

  const handleSendMessage = () => {
    if(!inputMessage.trim() || !friend) return;
    const newMessage: Message = {
      id: Math.random().toString(36).substring(2, 15),
      senderId: currentUser!.id,
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


    socket.on("typing", ({ from }) => {
      if(from === friend?.id) {
        setIsFriendTyping(true);
      }
    });

    socket.on("stop-typing", ({from}) => {
      if(from === friend?.id) {
        setIsFriendTyping(false);
      }
    });

    return () => {
      socket.off("direct-message");
      socket.off("typing");
      socket.off("stop-typing");
    };
  }, [socket]);

  useEffect(() => {
    if(!socket) return;

    if(!isTyping && inputMessage) {
      setIsTyping(true);
      socket.emit("typing", { to: friend?.id });
    }

    if(isTyping && !inputMessage) {
      setIsTyping(false);
      socket.emit("stop-typing", { to: friend?.id });
    }
  },[socket, isTyping, inputMessage, friend?.id]);

  return (
    <PageTemplate.Main>
      <PageTemplate.Header>
        <button onClick={() => router.push("/dm")} className="text-xl font-bold"><ChevronLeft/></button>
        <div className="flex items-center gap-2">
          {friend?.pfp ? (
            <img src={friend.pfp} alt={friend.name} className="w-6 h-6 rounded-full object-cover inline-block"/>
          ) : (
              <div className="w-10 h-10 bg-white/10 rounded-full flex justify-center items-center text-2xl font-bold">
                {friend?.name.charAt(0).toUpperCase() || "U"}
              </div>
            )}
          <span className="font-bold text-sm">{friend?.name || "Unknown User"}</span>
        </div>
      </PageTemplate.Header>
      <PageTemplate.Body>
        <PageTemplate.Content>
          <div className="flex flex-col h-full">
            <div className="flex flex-col gap-2 h-0 grow overflow-y-auto max-h-full scrollbar scrollbar-w-[4px] scrollbar-thumb-white/40 scrollbar-thumb-rounded-xl px-2">
              {messages.length === 0 ? (
                <p>No messages yet. Start the conversation!</p>
              ) :  messages.map((msg) => (
                  <MessageItem
                    key={msg.id}
                    message={msg}
                    owner={msg.senderId === currentUser!.id ? currentUser! : (friend as Partial<User>)}
                  />
                ))}
            </div>
            {isFriendTyping && (
              <div className="px-4 text-sm text-gray-400 italic">{friend?.name} is typing...</div>
            )}
            <div className="flex gap-2 pt-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="bg-[#222327] rounded-xl px-4 py-5 flex-grow focus-within:outline-none"
                placeholder="Type your message..."
                onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
              />
            </div>
          </div>
        </PageTemplate.Content>
        <PageTemplate.SidePanel>
          <h2 className="font-bold mb-2">About {friend?.name}</h2>
          <p>ID: {friend?.id}</p>
          {/* Additional friend info can go here */}
        </PageTemplate.SidePanel>
      </PageTemplate.Body>
    </PageTemplate.Main>
  );
}

export default DirectMessagesPage;
