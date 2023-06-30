import React, { useState, useEffect, useRef } from "react";
import { Route, Routes } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./redux/hooks/hooks";
import { useDispatch } from "react-redux";
import { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import { getMessage } from "./redux/reducer/chat";
import { userDataThunk } from "./redux/action/user";
import RouteIndex from "./routes/Index";
import api from "./assets/data/api";
import { setAccessStatus } from "./redux/reducer/auth";


function App() {
  const appDispatch = useAppDispatch();
  const dispatch = useDispatch();
  const isLoading = useAppSelector(state => state.auth.isLoading);
  const socket = useRef<Socket | null>(null);
  const { access_status, access_message } = useAppSelector((state) => state.auth);
  const token_status = useAppSelector((state) => state.auth.token_status);
  const userData = useAppSelector((state) => state.user);
  const [comingMessage, setComingMessage] = useState<any>();
  const routes = RouteIndex();
  
  // socket handler
  useEffect(() => {
    try {
      if (userData.user_id && socket) {
        socket.current = io("ws://localhost:8900");
        socket.current.emit("addUser", userData.user_id);
        socket.current.on("getMessage", (data: any) => {
          setComingMessage({
            conversation_id: data.conversation_id,
            sender_id: data.senderId,
            text_message: data.text,
          });
        });
      }
    } catch (error) {
      
    }
  }, [socket, userData]);

  useEffect(() => {
    if(comingMessage) dispatch(getMessage(comingMessage));
  }, [comingMessage]);


  useEffect(() => {
    async function performRequest() {
      try {
        const token: any = sessionStorage.getItem("token");
        const response = await api.get("/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // if access token is expired
        if (response.data.accessToken) {
          sessionStorage.setItem("token", response.data.accessToken);
          await performRequest();
        }

        // else proceed to API call for user's information
        if (token && token_status === "") appDispatch(userDataThunk(token));
      } catch (error) {
        appDispatch(setAccessStatus(error.response.data));
      }
    }

    if (String(access_status)[0] !== "4") performRequest();
  }, [access_status]);
  
  

  if(isLoading || !routes) return <></>;

  return (
    <Routes>
      {routes}
      <Route path="/404" element={<div>404 Not Found Page</div>}/>
      <Route path="*" element={<div>404 Not Found Page</div>}/> 
    </Routes>
  );
}

export default App;
