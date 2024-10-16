import { useNavigate }                    from 'react-router';
import { navigatedPage, selectSidebar }   from '@/redux/slices/sidebarSlice';

import SidebarRenderIcon                  from './SidebarRenderIcon';
import SidebarIconName                    from './SidebarIconName';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';

export interface SidebarProps {
  item: any;
  avatar: string | null | undefined;
  username: string;
  isClicked: boolean;
}

function SidebarTabCard({
  avatar,
  item,
  isClicked,
  username,
}: SidebarProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const sidebarState = useAppSelector(selectSidebar);

  const dispatchHandler = (previous: string, current: string) => {
    dispatch(
      navigatedPage({
        previous: previous,
        current: current,
      })
    );
  };

  // Determine the link based on the item
  const navigateHandler = (item: any) => {
    const link = item.link;
    const linkName = item.name;

    // If the link is "/profile" or the link is not "Create" or "Search",
    // navigate to the page's link
    if ((link === "/profile" || link !== "none") ) {
      const profilePage = `/${username}`;
      const profileLink = "/profile";

      // If the item link is "/profile", set the link to the username
      const newLink = link === profileLink ? profilePage : link;
      
      navigate(newLink);
      return dispatchHandler(sidebarState.current, link);
    }

    // If the item is "Create" or "Search",
    // then close the current view and navigate to the previous view
    if (sidebarState.current === linkName) {
      return dispatchHandler(sidebarState.current, sidebarState.previous);
    }

    // Navigation for "Create" or "Search" view
    dispatchHandler(sidebarState.current, linkName);
  };

  return (
    <li className="sidebar-tab-card">
      <div onClick={() => navigateHandler(item)}>
        <SidebarRenderIcon
          profileSrc={avatar}
          isProfile={item.name === "Profile"}
          IconComponent={isClicked ? item.icon.check : item.icon.uncheck}
        />
        <SidebarIconName name={item.name} />
      </div>
    </li>
  );
}

export default SidebarTabCard;
