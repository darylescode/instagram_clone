import UserDto                from "@/domain/dto/user.dto";
import IEUserService          from "@/application/services/user/user.service";
import IEFollowService        from "@/application/services/follow/follow.service";
import { Request, Response }  from "express";
import IESearchHistoryService from "@/application/services/search-history/search-history.service";

class UsersController {
  private userService: IEUserService;
  private followService: IEFollowService;
  private searchHistoryService: IESearchHistoryService;

  constructor(
    userService: IEUserService,
    followService: IEFollowService,
    searchHistoryService: IESearchHistoryService
  ) {
    this.userService = userService;
    this.followService = followService;
    this.searchHistoryService = searchHistoryService;
  }

  public getUserData = async (req: Request, res: Response) => {
    let user: UserDto | undefined;
    const uuid = req.session?.user?.uuid;
    const username = req.query.username || "";

    if (username) {
      user = await this.userService.getUserByUsername(username as string);
    } else {
      user = await this.userService.getUserById(uuid);
    }

    res.status(200).send({ user });
  };

  public searchUsersByQuery = async (req: Request, res: Response) => {
    const searchQuery: any = req.query.searchQuery;
    const users = await this.userService.searchUserByFields(searchQuery);
    res.status(200).send({ users });
  };

  public deleteUser = async (req: Request, res: Response) => {
    const uuid = req.params.uuid;
    const message = await this.userService.deleteUserById(uuid);
    res.status(200).send({ message });
  };

  public getFollowStats = async (req: Request, res: Response) => {
    const uuid = req.params.uuid!;
    const stats = await this.followService.getFollowStats(uuid);
    res.status(200).send(stats);
  };

  public getFollowerFollowingLists = async (req: Request, res: Response) => {
    const uuid = req.params.uuid!;
    const fetchFollowType = req.query.fetchFollowType;
    const followListIds = req.body.followListIds;

    const stats = await this.followService.getFollowerFollowingLists(
      uuid,
      fetchFollowType as string,
      followListIds
    );

    res.status(200).send(stats);
  };

  public toggleFollow = async (req: Request, res: Response) => {
    const follower_uuid = req.params.follower_uuid!;
    const followed_uuid = req.params.followed_uuid!;

    const message = await this.followService.toggleFollow(
      follower_uuid,
      followed_uuid
    );

    res.status(200).send(message);
  };

  public getSearchHistory = async (req: Request, res: Response) => {
    const searcher_uuid = req.params.searcher_uuid;

    const searches = await this.searchHistoryService.getUsersSearchHistoryById(
      searcher_uuid
    );

    res.status(200).send({ searches });
  };

  public saveRecentSearches = async (req: Request, res: Response) => {
    const searcher_uuid = req.params.searcher_uuid;
    const searched_uuid = req.params.searched_uuid;

    const messages = await this.searchHistoryService.saveUsersSearch(
      searcher_uuid,
      searched_uuid
    );

    res.status(200).send({ messages });
  };

  public removeRecentSearches = async (req: Request, res: Response) => {
    const uuid = req.params.uuid;

    const message = await this.searchHistoryService.removeRecentSearchesById(
      uuid
    );

    res.status(200).send(message);
  };
};

export default UsersController;