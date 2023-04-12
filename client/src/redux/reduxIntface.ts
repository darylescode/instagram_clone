
// actions
interface IEAuthData {
  message: string,
  user_data: object,
};

interface Name {
  first_name: string;
  last_name: string;
}

interface Members {
  user_one: number;
  user_two: number;
}

interface IEChatData extends Array<IEChatData> {
  [key: string]: any;
  conversation_id: number;
  first_name: string;
  last_name: string;
  message_id: number;
  sender_id: number;
  text_message: string;
  time_sent: string;
  user_one: number;
  user_two: number;
  username: any;
}

// reducers
interface IEUserState {
  [key: string]: any;
  user_id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  roles: string;
  age: number;
  birthday: string;
}

interface IEChatState {
  // [key: string]: any;
  conversation_id: number | null;
  sender_id: number | null;
  members: Members;
  message_id: number | null;
  username: any | null;
  name: Name;
  text_message: string | null;
  time_sent: string | null;
}

interface IEChatMemberState {
  [key: string]: any;
  conversation_id: number | null;
  members: Members;
  username: any | null;
  name: Name;
};

// thunk error
interface IEAuthFetchError {
  errorType: string;
  errorMessage: string;
}

export type {
  IEAuthData,
  IEChatData,
  IEAuthFetchError,
  IEChatState,
  IEUserState,
  IEChatMemberState,
};