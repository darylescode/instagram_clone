import "reflect-metadata";
import {
  describe,
  test,
  expect,
  vi,
  beforeEach,
  afterEach,
}                          from "vitest";
import UserDto             from "@/domain/dto/user.dto";
import FeedService         from "@/application/services/feed/feed.service.impl";
import IEFeedService       from "@/application/services/feed/feed.service";
import FeedRepository      from "@/infrastructure/repositories/feed.repository.impl";
import UserRepository      from "@/infrastructure/repositories/user.repository.impl";
import IEUserRepository    from "@/domain/repositories/user.repository";
import IEFeedRepository    from "@/domain/repositories/feed.repository";
import GenerateMockData    from "@/__tests__/utils/generate-data.util";
import ApiErrorException   from "@/application/exceptions/api.exception";
import { plainToInstance } from "class-transformer";


vi.mock("@/repositories/feed/feed.repository.impl");

vi.mock("@/repositories/user/user.repository.impl");

describe("FeedService", () =>  {
  let feedRepository: IEFeedRepository;
  let userRepository: IEUserRepository;
  let feedService:    IEFeedService;

  const error = {
    noArgsMsg: ApiErrorException.HTTP400Error("No arguments provided"),
    userNotFoundMsg: ApiErrorException.HTTP400Error("User not found"),
  };

  const users = GenerateMockData.createUserList(10);
  const existingUser = users[0]!;
  const existingUserDto = plainToInstance(UserDto, existingUser);
  const nonExistingUser = GenerateMockData.createUser();
  const nonExistingUserDto = plainToInstance(UserDto, nonExistingUser);

  beforeEach(() => {
    feedRepository = new FeedRepository();
    userRepository = new UserRepository();

    feedService = new FeedService(
      feedRepository,
      userRepository
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe("getUserFeed", async () => {
    test("should return the correct result", async () => {
      const post_uuids = [""];

      userRepository.findUserById = vi.fn().mockResolvedValueOnce(existingUserDto);
      feedRepository.getUserFeed = vi.fn().mockResolvedValueOnce([]);

      const userFeed = await feedService.getUserFeed(
        existingUserDto.getUuid(),
        post_uuids
      );

      expect(userFeed).toBeInstanceOf(Array);
      expect(userFeed).toStrictEqual([]);
      expect(userFeed).toHaveLength(0);
        
      expect(userRepository.findUserById)
        .toHaveBeenCalledWith(existingUserDto.getUuid());

      expect(feedRepository.getUserFeed)
        .toHaveBeenCalledWith(existingUserDto.getId(), [0]);
    });

    test("should throw an error if no arguments are provided", async () => {
      userRepository.findUserById = vi.fn();
      feedRepository.getUserFeed = vi.fn();

      await expect(
        feedService.getUserFeed(undefined as any, [])
      ).rejects.toThrow(error.noArgsMsg);

      expect(userRepository.findUserById).not.toHaveBeenCalled();
      expect(feedRepository.getUserFeed).not.toHaveBeenCalled();
    });

    test("should throw an error if the user is not found", async () => {
      userRepository.findUserById = vi.fn().mockResolvedValueOnce(null);
      feedRepository.getUserFeed = vi.fn();

      await expect(
        feedService.getUserFeed(nonExistingUserDto.getUuid(), [])
      ).rejects.toThrow(error.userNotFoundMsg);

      expect(userRepository.findUserById)
        .toHaveBeenCalledWith(nonExistingUserDto.getId());

      expect(feedRepository.getUserFeed).not.toHaveBeenCalled();
    });
  });

  describe("getExploreFeed", async () => {
    test("should return the correct result", async () => {
      userRepository.findUserById = vi.fn().mockResolvedValueOnce(existingUserDto);
      feedRepository.getExploreFeed = vi.fn().mockResolvedValueOnce([]);

      const exploreFeed = await feedService.getExploreFeed(existingUserDto.getUuid());

      expect(exploreFeed).toBeInstanceOf(Array);
      expect(exploreFeed).toStrictEqual([]);
      expect(exploreFeed).toHaveLength(0);

      expect(userRepository.findUserById)
        .toHaveBeenCalledWith(existingUserDto.getUuid());

      expect(feedRepository.getExploreFeed)
        .toHaveBeenCalledWith(existingUserDto.getId());
    });

    test("should throw an error if no arguments are provided", async () => {
      userRepository.findUserById = vi.fn();
      feedRepository.getExploreFeed = vi.fn();
      
      await expect(
        feedService.getExploreFeed(undefined as any)
      ).rejects.toThrow(error.noArgsMsg);

      expect(userRepository.findUserById).not.toHaveBeenCalled();
      expect(feedRepository.getExploreFeed).not.toHaveBeenCalled();
    });

    test("should throw an error if the user is not found", async () => {
      userRepository.findUserById = vi.fn().mockResolvedValueOnce(null);
      feedRepository.getExploreFeed = vi.fn();

      await expect(
        feedService.getExploreFeed(nonExistingUserDto.getUuid())
      ).rejects.toThrow(error.userNotFoundMsg);

      expect(userRepository.findUserById)
        .toHaveBeenCalledWith(nonExistingUserDto.getId());

      expect(feedRepository.getExploreFeed).not.toHaveBeenCalled();
    });
  });
});