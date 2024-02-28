import ProfileHeaderAvatar from "./ProfileHeaderAvatar";
import ProfileHeaderDetails from "./ProfileHeaderDetails";
import { IEUserState } from "../redux/reduxIntface";

type ProfileHeaderProps = {
  user: IEUserState;
};

function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="profile__header">
      <ProfileHeaderAvatar user={user} />
      <ProfileHeaderDetails user={user} />
    </div>
  );
}

export default ProfileHeader;
