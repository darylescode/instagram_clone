import {
  useGetFollowersAndFollowingListsMutation,
  useGetUserDataQuery,
}                                 from "@/redux/api/userApi";

import { useState, useEffect }    from "react";
import { useLocation, useParams } from "react-router";

import FollowLists                from "@/shared/components/follow-modal/FollowLists";
import FollowModalTitle           from "@/shared/components/follow-modal/FollowModalTitle";

function FollowModal() {
  const location = useLocation();
  const pathType = location?.pathname?.split("/")[2];
  const { username } = useParams();
  const userApiData = useGetUserDataQuery({ person: username || "" });
  const [removedUsers, setRemovedUsers] = useState<Array<number>>([]);

  const [fetchFollowsLists, { data: follows, isLoading }] =
    useGetFollowersAndFollowingListsMutation();

  useEffect(() => {
    if (userApiData.isLoading) return;
    const user_id = userApiData.data?.user?.uuid;
    fetchFollowsLists({ user_id: user_id, fetch: pathType, listsId: 0 });
  }, [userApiData.data]);

  return (
    <div className="follow-modal__container">
      <div className="follow-modal__parent">
        <FollowModalTitle path={pathType} />
        <div className="follow-modal__list-container">
          <FollowLists
            path={pathType}
            follower_id={userApiData?.data?.user?.uuid}
            isLoading={isLoading}
            lists={follows?.lists}
            removedUsers={removedUsers}
            setRemovedUsers={setRemovedUsers}
          />
        </div>
      </div>
    </div>
  );
}

export default FollowModal;
