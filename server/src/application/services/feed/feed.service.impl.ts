import IEFeedService     from "./feed.service";
import { SelectPosts }   from "@/domain/types/table.types";
import IEFeedRepository  from "@/domain/repositories/feed.repository";
import IEUserRepository  from "@/domain/repositories/user.repository";
import ApiErrorException from "@/application/exceptions/api.exception";

class FeedService implements IEFeedService {
  private feedRepository: IEFeedRepository;
  private userRepository: IEUserRepository;

  constructor(
    feedRepository: IEFeedRepository,
    userRepository: IEUserRepository
  ) {
    this.feedRepository = feedRepository;
    this.userRepository = userRepository;
  }

  public getTotalFeed = async (): Promise<number> => {
    return await this.feedRepository.getTotalFeed();
  };

  public getUserFeed = async (
    user_id: string,
    post_uuid: string[]
  ): Promise<SelectPosts[]> => {
    // If no arguments are provided, return an error
    if (!user_id) throw ApiErrorException.HTTP400Error("No arguments provided");

    // If the user is not found, return an error
    const user = await this.userRepository.findUserById(user_id);
    if (!user) throw ApiErrorException.HTTP404Error("User not found");

    // Return the user feed
    return await this.feedRepository.getUserFeed(user.getId(), post_uuid);
  };

  public getExploreFeed = async (user_id: string): Promise<SelectPosts[]> => {
    // If no arguments are provided, return an error
    if (!user_id) throw ApiErrorException.HTTP400Error("No arguments provided");

    // If the user is not found, return an error
    const user = await this.userRepository.findUserById(user_id);
    if (!user) throw ApiErrorException.HTTP404Error("User not found");

    // Return the explore feed
    return await this.feedRepository.getExploreFeed(user.getId());
  };
};

export default FeedService;