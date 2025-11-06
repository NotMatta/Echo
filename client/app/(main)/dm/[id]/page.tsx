"use client";
import { getConversation, sendMessage } from "@/app/actions/conversation.action";
import { useAppData } from "@/components/providers/app-data-provider";
import { PageTemplate } from "@/components/ui/v2/page-template";
import { Message, User } from "@/generated/prisma";
import { ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Conversation } from "@/types/conversation";
import { useSocket } from "@/components/providers/socket-provider";

const MessageItem = ({ message, owner, head, className }: { message: Message; owner: User, head: boolean, className?: string}) => {
  const messageDate = new Date(message.updatedAt)
  return (
    <div className={`w-full flex items-start gap-4 ${className}`}>
      { head ? <>
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
      </> : <>
        <div className="w-10"/>
        <p className="whitespace-pre">{message.content}</p>
      </>}
    </div>
  )
};

const DirectMessagesPage = () => {
  const {id: conversationId} : {id: string} = useParams();
  const {conversations, setConversations, currentUser} = useAppData()!
  const router = useRouter();
  const { socket } = useSocket();

  const [receiver, setReceiver] = useState<User | undefined>(undefined);
  const [messages, setMessages] = useState<Message[]>([])
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [input,setInput] = useState("");

  const handleSendMessage = async () => {
    if(!input || !conversationId) return
    const res = await sendMessage(conversationId, input)
    if(!res.ok){
      alert("Failed to send message")
      return
    }

    let newMessages = messages;
    newMessages.push(res.data);
    setMessages(newMessages)

    setConversations((old) => {
      const newMap = new Map(old)
      const conv = conversations.get(conversationId)!;
      newMap.set(conversationId, {...conv, messages: newMessages})
      return newMap
    })
    setInput("");
  }

  useEffect(() => {
    const init = async () => {
      if(!conversationId) return;
      if(conversations.has(conversationId)){
        const conv = conversations.get(conversationId)!;
        const receiverUser = conv.participants.find(user => user.userId !== currentUser?.id)?.user as User;
        setReceiver(receiverUser);
        setMessages(conv.messages || []);
        setLoading(false);
        return;
      }
      const res = await getConversation(conversationId);
      if(res.ok && res.data){
        setConversations(prev => new Map(prev).set(conversationId, res.data!));
        const receiverUser = (res.data as Conversation).participants.find(user => user.userId !== currentUser?.id)?.user as User;
        setReceiver(receiverUser);
        setMessages((res.data as Conversation).messages || [])
        setLoading(false);
      } else {
        setError(res.message);
        setLoading(false);
      }
    }
    loading && init();
  }, [])

  useEffect(() => {
    if(!socket) return;
    socket.on("newMessage", (message: Message) => {
      if(message.conversationId !== conversationId || message.senderId == currentUser?.id) return;
      let newMessages = messages;
      newMessages.push(message);
      setMessages(newMessages)
      setConversations((old) => {
        const newMap = new Map(old)
        const conv = conversations.get(conversationId)!;
        newMap.set(conversationId, {...conv, messages: [...conv.messages, message]})
        return newMap
      })
    });
    return () => {
      socket.off("newMessage");
    };
  }, [socket, messages])

  if(loading){
    return (
      <PageTemplate.Main>
        <PageTemplate.Header>
          <div>Loading...</div>
        </PageTemplate.Header>
      </PageTemplate.Main>
    );
  }

  if(error){
    return (
      <PageTemplate.Main>
        <PageTemplate.Header>
          <div>Error: {error}</div>
        </PageTemplate.Header>
      </PageTemplate.Main>
    );
  }

  return (
    <PageTemplate.Main>
      <PageTemplate.Header>
        <button onClick={() => router.push("/dm")} className="text-xl font-bold"><ChevronLeft/></button>
        <div className="flex items-center gap-2">
          {receiver?.pfp ? (
            <img src={receiver.pfp} alt={receiver.name} className="w-6 h-6 rounded-full object-cover inline-block"/>
          ) : (
              <div className="w-10 h-10 bg-white/10 rounded-full flex justify-center items-center text-2xl font-bold">
                {receiver?.name.charAt(0).toUpperCase() || "U"}
              </div>
            )}
          <span className="font-bold text-sm">{receiver?.name || "Unknown User"}</span>
        </div>
      </PageTemplate.Header>
      <PageTemplate.Body>
        <PageTemplate.Content>
          <div className="flex flex-col h-full">
            <div className="flex flex-col h-0 grow overflow-y-auto max-h-full scrollbar scrollbar-w-[4px] scrollbar-thumb-white/40 scrollbar-thumb-rounded-xl px-2">
              {messages.length === 0 ? (
                <p>No messages yet. Start the conversation!</p>
              ) :  messages.sort((a,b) => a.updatedAt < b.updatedAt ? -1 : 1).map((msg, i) => {
                  return <MessageItem
                    key={msg.id}
                    message={{...msg}}
                    head={i === 0 || messages[i-1].senderId !== msg.senderId}
                    className={(i > 0 && messages[i-1].senderId === msg.senderId) ? "" : "mt-4"}
                    owner={msg.senderId === currentUser!.id ? currentUser! as User : receiver!}
                  />
                })}
            </div>
            <div className="flex gap-2 pt-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="bg-[#222327] rounded-xl px-4 py-5 flex-grow focus-within:outline-none"
                placeholder="Type your message..."
                onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
              />
            </div>
          </div>
        </PageTemplate.Content>
        <PageTemplate.SidePanel>
          Something
        </PageTemplate.SidePanel>
      </PageTemplate.Body>
    </PageTemplate.Main>
  );
}

export default DirectMessagesPage;
