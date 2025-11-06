import { Conversation as C, Message, ConversationParticipant } from "@/generated/prisma"
export type Conversation = C & {
  messages: Message[];
  participants: (ConversationParticipant & {
    user: {
      id: string;
      name: string | null;
      pfp: string | null;
    };
  })[];
}

