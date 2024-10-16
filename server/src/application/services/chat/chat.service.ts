import ChatDto             from "@/domain/dto/chat.dto";
import ConversationDto     from "@/domain/dto/conversation.dto";
import { MessageDataType } from "@/domain/repositories/chat.repository";

interface IChatService {
  getChatHistory: (uuid: string, conversationIds: string[]) => Promise<ConversationDto[]>;

  getChatMessages: (conversationUuid: string, messageUuids: string[]) => Promise<ChatDto[]>;

  newMessageAndConversation: (messageData: MessageDataType) => Promise<string>;

  deleteConversationById: (uuid: string) => Promise<string>;
};

export default IChatService;