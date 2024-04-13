"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_database_1 = __importDefault(require("@/database/db.database"));
const database_exception_1 = __importDefault(require("@/exceptions/database.exception"));
class ChatsRepository {
    database;
    constructor() { this.database = db_database_1.default; }
    ;
    async getUserConversationHistoryByUserId(user_id, conversations) {
        try {
            return await this.database
                .selectFrom("conversations")
                .select([
                "conversations.conversation_id",
                "conversations.user_one_id",
                "conversations.user_two_id",
            ])
                .leftJoin((eb) => eb
                .selectFrom("users")
                .select([
                "users.user_id",
                "users.username",
                "users.first_name",
                "users.last_name",
                "users.avatar_url",
            ])
                .as("users"), (join) => join.onRef("users.user_id", "=", (eb) => eb
                .case()
                .when("conversations.user_one_id", "=", user_id)
                .then(eb.ref("conversations.user_two_id"))
                .else(eb.ref("conversations.user_one_id"))
                .end()))
                .selectAll("users")
                .where("conversations.conversation_id", "not in", conversations)
                .execute();
        }
        catch (error) {
            throw database_exception_1.default.error(error);
        }
    }
    ;
    async findConversationByConversationId(conversation_id) {
        try {
            return await this.database
                .selectFrom("conversations")
                .selectAll()
                .where("conversation_id", "=", conversation_id)
                .executeTakeFirst();
        }
        catch (error) {
            throw database_exception_1.default.error(error);
        }
    }
    ;
    async findConversationByUserId(user_id) {
        try {
            return await this.database
                .selectFrom("conversations")
                .select([
                "conversations.conversation_id",
                "conversations.user_one_id",
                "conversations.user_two_id",
            ])
                .where((eb) => eb.or([
                eb("conversations.user_one_id", "=", user_id[0])
                    .and("conversations.user_two_id", "=", user_id[1]),
                eb("conversations.user_one_id", "=", user_id[2])
                    .and("conversations.user_two_id", "=", user_id[3]),
            ]))
                .executeTakeFirst();
        }
        catch (error) {
            throw database_exception_1.default.error(error);
        }
        ;
    }
    ;
    async getMessagesByConversationId(conversation_id, ids) {
        try {
            return await this.database
                .selectFrom("messages")
                .selectAll()
                .where((eb) => eb.and([
                eb("conversation_id", "=", conversation_id),
                eb("message_id", "not in", ids),
            ]))
                .limit(10)
                .execute();
        }
        catch (error) {
            throw database_exception_1.default.error(error);
        }
        ;
    }
    ;
    async saveNewConversation(conversation) {
        try {
            const { insertId } = await this.database
                .insertInto("conversations")
                .values(conversation)
                .executeTakeFirst();
            return insertId;
        }
        catch (error) {
            throw database_exception_1.default.error(error);
        }
        ;
    }
    ;
    async saveNewMessage(message) {
        try {
            await this.database
                .insertInto("messages")
                .values(message)
                .executeTakeFirst();
            return "New message created";
        }
        catch (error) {
            throw database_exception_1.default.error(error);
        }
        ;
    }
    ;
    async deleteConversation(conversation_id) {
        try {
            await this.database
                .deleteFrom("conversations")
                .where("conversation_id", "=", conversation_id)
                .execute();
            return "Conversation deleted";
        }
        catch (error) {
            throw database_exception_1.default.error(error);
        }
        ;
    }
    ;
}
;
exports.default = ChatsRepository;
