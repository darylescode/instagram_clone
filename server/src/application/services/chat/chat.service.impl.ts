import IEChatRepository, {
  MessageDataType,
}                        from "@/domain/repositories/chat.repository";
import Chat              from "@/domain/models/chat.model";
import AsyncWrapper      from "@/application/utils/async-wrapper.util";
import IEChatService     from "./chat.service";
import IEUserRepository  from "@/domain/repositories/user.repository";
import ApiErrorException from "@/application/exceptions/api.exception";

class ChatServices implements IEChatService {
  private chatRepository: IEChatRepository;
  private userRepository: IEUserRepository;
  private wrap: AsyncWrapper = new AsyncWrapper();

  constructor(
    chatRepository: IEChatRepository,
    userRepository: IEUserRepository
  ) {
    this.chatRepository = chatRepository;
    this.userRepository = userRepository;
  }

  public getChatHistory = this.wrap.serviceWrap(
    async (uuid: string | undefined, listId: number[]): Promise<Chat[]> => {
      // If no user id is provided, return an error
      if (!uuid) throw ApiErrorException.HTTP400Error("No arguments provided");

      // If the user is not found, return an error
      const user = await this.userRepository.findUserById(uuid);
      if (!user) throw ApiErrorException.HTTP404Error("User not found");

      // Return the chat history
      return await this.chatRepository.findAllConversationByUserId(
        user.getId(),
        listId
      );
    }
  );

  public getChatMessages = this.wrap.serviceWrap(
    async (uuid: string | undefined, listId: number[]): Promise<Chat[]> => {
      // If no chat id is provided, return an error
      if (!uuid) throw ApiErrorException.HTTP400Error("No arguments provided");

      // Check if the chat exists
      const data = await this.chatRepository.findOneConversationById(uuid);

      // If the chat does not exist, return an error
      if (!data) throw ApiErrorException.HTTP404Error("Chat not found");

      // Return the chat messages
      return await this.chatRepository.findAllMessagesById(data.getId(), listId);
    }
  );

  public newMessageAndConversation = this.wrap.serviceWrap(
    async (messageData: MessageDataType): Promise<string> => {
      // destructure the necessary properties from messageData
      const { 
        conversation_id, 
        sender_id, 
        receiver_id, 
        text_message 
      } = messageData ?? {};

      // validate that sender_id and receiver_id are provided
      if (!sender_id || !receiver_id) {
        throw ApiErrorException.HTTP400Error("No arguments provided");
      }

      // fetch the sender and receiver from the user repository
      const sender = await this.userRepository.findUserById(sender_id);
      if (!sender) throw ApiErrorException.HTTP404Error("User not found");

      const receiver = await this.userRepository.findUserById(receiver_id);
      if (!receiver) throw ApiErrorException.HTTP404Error("User not found");

      let conversation;
      if (conversation_id) {
        // if conversation_id is provided, fetch the conversation by its ID
        conversation = await this.chatRepository.findOneConversationById(
          conversation_id
        );
        // if the conversation doesn't exists, throw an error
        if (!conversation) throw ApiErrorException.HTTP404Error("Conversation not found");
      } else {
        // if conversation_id is not provided, fetch the conversation by the member IDs
        conversation = await this.chatRepository.findOneConversationByMembersId(
          [sender.getId(), receiver.getId()]
        );
      }

      // determine the conversation ID, creating a new conversation if necessary
      const newConversationId = conversation
        ? conversation.getId()
        : await this.createConversation(sender.getId(), receiver.getId());

      // save the new message in the chat repository
      await this.chatRepository.saveNewMessage({
        conversation_id: newConversationId,
        sender_id: sender.getId(),
        text_message,
      });

      return "Message sent successfully";
    }
  );

  private createConversation = this.wrap.serviceWrap(
    async (senderId: number, receiverId: number): Promise<number> => {
      const newConversationId = (await this.chatRepository.saveNewConversation(
        {}
      )) as number;

      await this.chatRepository.saveMultipleChatMembers([
        { conversation_id: newConversationId, user_id: senderId },
        { conversation_id: newConversationId, user_id: receiverId },
      ]);

      return newConversationId;
    }
  );

  public deleteConversationById = this.wrap.serviceWrap(
    async (uuid: string | undefined): Promise<string> => {
      // If no conversation id is provided, return an error
      if (!uuid) throw ApiErrorException.HTTP400Error("No arguments provided");

      // Check if the conversation exists
      const conversation = await this.chatRepository.findOneConversationById(
        uuid
      );

      // If the conversation does not exist, return an error
      if (!conversation) throw ApiErrorException.HTTP404Error("Conversation not found");

      // Return the deleted conversation
      await this.chatRepository.deleteConversationById(conversation.getId());
      return "Conversation deleted successfully";
    }
  );
};

export default ChatServices;