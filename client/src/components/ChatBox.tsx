import { useEffect, useState, useRef } from "react";
import { useGetUserDataQuery } from "../redux/api/userApi";
import useAdjustInputHeight from "../hooks/useAdjustInputHeight";
import useFetchMessage from "../hooks/useFetchMessage";
import ChatBoxSubmission from "./ChatBoxSubmission";
import ChatBoxMessageList from "./ChatBoxMessageList";
import useSendMessageHandler from "../hooks/useSendMessage";
import SocketService from "../services/SocketServices";
import { useAppSelector } from "../hooks/reduxHooks";
import { selectMessage } from "../redux/slices/messageSlice";

interface IEChatProps {
  socketService: SocketService;
}

function ChatBox({ socketService }: IEChatProps) {
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const { openConversation } = useAppSelector(selectMessage);

  // data
  const userDataApi = useGetUserDataQuery({ person: ""});
  const [newMessage, setNewMessage] = useState<any>();

  // trigger
  const [clearMessage, setClearMessage] = useState<boolean>(false);

  // custom hooks
  useAdjustInputHeight({ inputRef, newMessage, clearMessage });
  
  const { comingMessage, setComingMessage, isLoading } = useFetchMessage({
    userDataApi: userDataApi.data?.user,
    socketService,
    openConversation,
  });

  const sendMessageHandler = useSendMessageHandler({
    userDataApi: userDataApi.data?.user,
    openConversation,
    clearMessage,
    newMessage,
    socketService,
    setClearMessage,
    setComingMessage,
  });

  useEffect(() => {
    if (messageRef.current) scrollToDown(messageRef.current);
  }, [openConversation]);

  function scrollToDown(ref:any){
    const scrollHeight = ref.scrollHeight;
    ref.scrollTop = scrollHeight;
  }

  if (isLoading || !userDataApi.data) return null;

  return (
    <div className="chat__container">
      <ChatBoxMessageList
        messageRef={messageRef}
        comingMessage={comingMessage}
        userDataApi={userDataApi.data.user}
      />
      <ChatBoxSubmission
        inputRef={inputRef}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        sendMessageHandler={sendMessageHandler}
      />
    </div>
  );
}

export default ChatBox;
