import {
  Conversations,
  Followers,
  Likes,
  Messages,
  Posts,
  SearchHistory,
  ResetPasswordToken,
  Users,
  ConversationMembers,
}                                             from "./schema.types";
import { Insertable, Selectable, Updateable } from "kysely";

// USERS
export type SelectUsers = Selectable<Users>;
export type NewUsers    = Insertable<Users>;
export type UpdateUsers = Updateable<Users>;

// FOLLOWERS
export type SelectFollowers = Selectable<Followers>;
export type NewFollowers    = Insertable<Followers>;
export type UpdateFollowers = Updateable<Followers>;

// CONVERSATIONS
export type SelectConversations = Selectable<Conversations>;
export type NewConversations    = Insertable<Conversations>;
export type UpdateConversations = Updateable<Conversations>;

// CONVERSATION MEMBERS
export type SelectChatMembers = Selectable<ConversationMembers>;
export type NewChatMembers    = Insertable<ConversationMembers>;
export type UpdateChatMembers = Updateable<ConversationMembers>;

// MESSAGES
export type SelectMessages = Selectable<Messages>;
export type NewMessages    = Insertable<Messages>;
export type UpdateMessages = Updateable<Messages>;

// POSTS
export type SelectPosts = Selectable<Posts>;
export type NewPosts    = Insertable<Posts>;
export type UpdatePosts = Updateable<Posts>;

// LIKES
export type SelectLikes = Selectable<Likes>;
export type NewLikes    = Insertable<Likes>;
export type UpdateLikes = Updateable<Likes>;

// RECENT SEARCHES
export type SelectSearches = Selectable<SearchHistory>;
export type NewSearches    = Insertable<SearchHistory>;
export type UpdateSearches = Updateable<SearchHistory>;

// RESET PASSWORD TOKEN
export type SelectResetPasswordToken = Selectable<ResetPasswordToken>;
export type NewResetPasswordToken    = Insertable<ResetPasswordToken>;
export type UpdateResetPasswordToken = Updateable<ResetPasswordToken>;