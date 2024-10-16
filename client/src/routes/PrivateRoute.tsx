import {
  useGetTotalFeedQuery,
  useGetUserFeedMutation,
}                                             from "@/redux/api/feedApi";
import { Route, Routes }                      from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";

import Feed                    from "@/pages/Feed";
import Index                   from "@/pages/Index";
import Message                 from "@/pages/Message";
import Explore                 from "@/pages/Explore";
import Profile                 from "@/pages/Profile";
import FollowModal             from "@/shared/modals/FollowModal";
import RedirectRoute           from "./RedirectRoute";
import { PUBLIC_PATH }         from "@/shared/constants/routes";

import useFetchFeed            from "@/hooks/useFetchFeed";
import SocketService           from "@/services/SocketServices";
import { useGetUserDataQuery } from "@/redux/api/userApi";

type PrivateRouteProps = {
  socketService: SocketService;
  feedRef: React.MutableRefObject<HTMLDivElement | null>;
  feeds: { feed: any[] };
  userTotalFeedApi: any;
  setAddFeedTrigger: any;
};

function PrivateRoute() {
  const restrictPublicRoutes = RedirectRoute({ 
    defaultPath: "/", routePath: PUBLIC_PATH 
  });

  const feedRef = useRef<HTMLDivElement | null>(null);
  const userDataApi = useGetUserDataQuery();
  const user = userDataApi.data?.user;

  // STATES
  const [feeds, setFeeds] = useState<any>({ feed: [] });
  const [addFeedTrigger, setAddFeedTrigger] = useState<string>("not triggered yet");
  const [socket, setSocket] = useState<SocketService | null>(null);

  // SERVICES
  const userTotalFeedApi = useGetTotalFeedQuery({});
  const [fetchUserFeed, userFeedApi] = useGetUserFeedMutation({
    fixedCacheKey: "feed-api",
  });

  useFetchFeed({
    userUuid: user?.uuid,
    addFeedTrigger,
    userFeedApi,
    fetchUserFeed,
    setFeeds,
    setAddFeedTrigger,
  });

  useEffect(() => {
    const socketURL = import.meta.env.VITE_REACT_SOCKET_URL;
    if (user && socketURL) {
      const socketService = new SocketService(socketURL, user?.uuid);
      setSocket(socketService);
      socketService.onConnection();
      return () => socketService.onDisconnect();
    }
  }, [user]);

  return (
    <Routes>
      <Route key={1} path="/" element={<Index />} >
        <Route
          index
          element={
            <Feed
              ref={feedRef}
              feeds={feeds}
              userTotalFeedApi={userTotalFeedApi}
              setAddFeedTrigger={setAddFeedTrigger}
            />
          }
        />
        <Route path="/:username/" element={<Profile />}>
          <Route path="followers" element={<FollowModal />} />
          <Route path="following" element={<FollowModal />} />
        </Route>
        <Route
          path="/message"
          element={<Message socketService={socket} />}
        />
        <Route path="/explore" element={<Explore />} /> 
        {restrictPublicRoutes}
      </Route>
    </Routes>
  );
};

export default PrivateRoute
