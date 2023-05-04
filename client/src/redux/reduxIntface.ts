
// actions
interface IEAuthData {
  message: string,
  token: any;
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
  avatar_url: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  roles: string;
  age: number;
  birthday: string;
  fetch_status: string;
}

interface IEFollow {
  followed_id: number;
  follower_id: number;
  user_id: number;
  username: string;
  avatar_url: string;
  first_name: string;
  last_name: string;
}

interface IETotal {
  followers: number;
  following: number;
}

interface IEFollowState {
  total: IETotal;
  followers: Array<IEFollow>;
  following: Array<IEFollow>;
}

interface IEChatState {
  // [key: string]: any;
  conversation_id: number | null;
  sender_id: number | null;
  message_id: number | null;
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

interface IEPost {
  [key: string]: any;
  post_id: number;
  user_id: number;
  caption: string;
  image_id: string;
  image_url: string;
  post_date: string;
}

interface IEPostState {
  post: Array<IEPost>
}

interface IEFeed extends IEPost {
  count: number;
};

interface IEFeeds {
  [key: string]: any;
  feeds: Array<IEFeed>;
  feedStatus: boolean;
  lastRequest: number;
}

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
  IEFollowState,
  IEPostState,
  IEFeeds,
};