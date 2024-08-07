import { join }                                              from "path";
import { faker }                                             from "@faker-js/faker";
import { Readable }                                          from "stream";
import PostService                                           from "@/application/services/post/post.service.impl";
import IEPostService                                         from "@/application/services/post/post.service";
import UserRepository                                        from "@/infrastructure/repositories/user.repository.impl";
import PostRepository                                        from "@/infrastructure/repositories/post.repository.impl";
import IEPostRepository                                      from "@/domain/repositories/post.repository";
import IEUserRepository                                      from "@/domain/repositories/user.repository";
import GenerateMockData                                      from "@/__tests__/utils/generate-data.util";
import ApiErrorException                                     from "@/application/exceptions/api.exception";
import CloudinaryService                                     from "@/application/libs/cloudinary-service.lib";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("@/repositories/feed/feed.repository.impl");

vi.mock("@/repositories/user/user.repository.impl");

vi.mock("@/utils/cloudinary-service.util");

describe("PostService", () => {
  let cloudinary:     CloudinaryService;
  let postRepository: IEPostRepository;
  let userRepository: IEUserRepository;
  let postService:    IEPostService;

  const error = {
    noArgsMsg: ApiErrorException.HTTP400Error("No arguments provided"),
    userNotFoundMsg: ApiErrorException.HTTP400Error("User not found"),
    postNotFoundMsg: ApiErrorException.HTTP400Error("Post not found"),
  };

  const users = GenerateMockData.createUserList(10);
  const existingUser = users[0]!;
  const notFoundUser = GenerateMockData.createUser();

  const posts = GenerateMockData.generateMockData(
    false, users, GenerateMockData.createPost
  );
  const existingPost = posts[0]!;
  const nonExistingPost = GenerateMockData.createPost(1000);

  beforeEach(() => {
    cloudinary = new CloudinaryService();
    postRepository = new PostRepository();
    userRepository = new UserRepository();

    postService = new PostService(
      postRepository, 
      userRepository, 
      cloudinary
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe("getPostByUuid (get post by id)", async () => {
    test("should return the correct result", async () => {
      postRepository.findPostsByPostId = vi
        .fn()
        .mockResolvedValue(existingPost);

      const result = await postService.getPostByUuid(existingPost.uuid);

      expect(result).toEqual(existingPost);
      expect(postRepository.findPostsByPostId).toHaveBeenCalledWith(
        existingPost.uuid
      );
    });

    test("should throw an error if no args provided", async () => {
      postRepository.findPostsByPostId = vi.fn().mockResolvedValue(null);

      await expect(postService.getPostByUuid(null as any)).rejects.toThrow(
        error.noArgsMsg
      );

      expect(postRepository.findPostsByPostId).not.toHaveBeenCalled();
    });

    test("should throw an error if post not found", async () => {
      postRepository.findPostsByPostId = vi.fn().mockResolvedValue(null);

      await expect(
        postService.getPostByUuid(nonExistingPost.uuid)
      ).rejects.toThrow(error.postNotFoundMsg);

      expect(postRepository.findPostsByPostId).toHaveBeenCalledWith(
        nonExistingPost.uuid
      );
    });
  });

  describe("getAllPostsByUsersUuid", async () => {
    test("should return the correct result", async () => {
      userRepository.findUserById = vi.fn().mockResolvedValue(existingUser);
      postRepository.findAllPostsByUserId = vi.fn().mockResolvedValue(posts);

      const result = await postService.getAllPostsByUsersUuid(
        existingUser.uuid
      );

      expect(result).toEqual(posts);
      expect(userRepository.findUserById).toHaveBeenCalledWith(
        existingUser.uuid
      );
      expect(postRepository.findAllPostsByUserId).toHaveBeenCalledWith(
        existingUser.id
      );
    });

    test("should throw an error if no args provided", async () => {
      userRepository.findUserById = vi.fn();

      await expect(
        postService.getAllPostsByUsersUuid(null as any)
      ).rejects.toThrow(error.noArgsMsg);

      expect(userRepository.findUserById).not.toHaveBeenCalled();
    });

    test("should throw an error if user not found", async () => {
      userRepository.findUserById = vi.fn().mockResolvedValue(null);

      await expect(
        postService.getAllPostsByUsersUuid(notFoundUser.uuid)
      ).rejects.toThrow(error.userNotFoundMsg);

      expect(userRepository.findUserById).toHaveBeenCalledWith(
        notFoundUser.uuid
      );
    });
  });

  describe("geTotalPostsByUsersUuid (get the total post available for feed)", async () => {
    test("should return the correct result", async () => {
      userRepository.findUserById = vi.fn().mockResolvedValue(existingUser);
      postRepository.findUserTotalPostsByUserId = vi.fn().mockResolvedValue(posts.length);

      const result = await postService.geTotalPostsByUsersUuid(existingUser.uuid);

      expect(result).toEqual(posts.length);
      expect(userRepository.findUserById).toHaveBeenCalledWith(existingUser.uuid);
      expect(postRepository.findUserTotalPostsByUserId).toHaveBeenCalledWith(existingUser.id);
    });

    test("should throw an error if no args provided", async () => {
      userRepository.findUserById = vi.fn();
      postRepository.findUserTotalPostsByUserId = vi.fn();

      await expect(
        postService.geTotalPostsByUsersUuid(undefined))
      .rejects.toThrow(error.noArgsMsg);

      expect(userRepository.findUserById).not.toHaveBeenCalled();
      expect(postRepository.findUserTotalPostsByUserId).not.toHaveBeenCalled();
    });

    test("should throw an error if user not found", async () => {
      userRepository.findUserById = vi.fn().mockResolvedValue(undefined);
      postRepository.findUserTotalPostsByUserId = vi.fn();

      await expect(
        postService.geTotalPostsByUsersUuid(notFoundUser.uuid))
      .rejects.toThrow(error.userNotFoundMsg);

      expect(userRepository.findUserById).toHaveBeenCalledWith(notFoundUser.uuid);
      expect(postRepository.findUserTotalPostsByUserId).not.toHaveBeenCalled();
    });
  });

  describe("createNewPost (create new post from the user)", async () => {
    test("should return the correct result", async () => {
      const { image_url, image_id, ...rest } = existingPost;
      
      const buffer = Buffer.alloc(1024 * 1024 * 10, ".");

      const file = {
        buffer,
        mimetype: "image/jpeg",
        originalname: faker.system.fileName(),
        size: buffer.length,
        filename: faker.system.fileName(),
        destination: faker.system.directoryPath(),
        fieldname: "",
        encoding: "",
        stream: new Readable(),
        path: faker.system.filePath(),
        image_id,
        user_id: rest.user_id,
      };

      userRepository.findUserById = vi
        .fn()
        .mockResolvedValue(existingUser);

      postRepository.createNewPost = vi
        .fn()
        .mockResolvedValue(existingPost);

      cloudinary.uploadAndDeleteLocal = vi
        .fn()
        .mockResolvedValue({ image_url, image_id });
        
      const result = await postService.createNewPost(rest, file);

      expect(result).toBe("Post created successfully");
      expect(userRepository.findUserById).toHaveBeenCalledWith(existingPost.user_id);
      
      expect(cloudinary.uploadAndDeleteLocal).toHaveBeenCalledWith(
        join(file.destination, file.filename)
      );

      expect(postRepository.createNewPost).toHaveBeenCalledWith({
        ...rest,
        image_url,
        image_id,
      });
    });
    
    test("should throw an error if no args provided", async () => {
      const { image_url, image_id, user_id, ...rest } = existingPost;
      
      const buffer = Buffer.alloc(1024 * 1024 * 10, ".");

      const file = {
        buffer,
        mimetype: "image/jpeg",
        originalname: faker.system.fileName(),
        size: buffer.length,
        filename: faker.system.fileName(),
        destination: faker.system.directoryPath(),
        fieldname: "",
        encoding: "",
        stream: new Readable,
        path: faker.system.filePath(),
        image_id, 
        user_id,
      };

      userRepository.findUserById = vi.fn();
      postRepository.createNewPost = vi.fn();
      cloudinary.uploadAndDeleteLocal = vi.fn();

      await expect(
        postService.createNewPost(undefined, file))
      .rejects.toThrow(error.noArgsMsg);

      expect(userRepository.findUserById).not.toHaveBeenCalled();
      expect(postRepository.createNewPost).not.toHaveBeenCalled();
      expect(cloudinary.uploadAndDeleteLocal).not.toHaveBeenCalled();
    });

    test("should throw an error if no image uploaded", async () => {
      userRepository.findUserById = vi.fn();
      postRepository.createNewPost = vi.fn();
      cloudinary.uploadAndDeleteLocal = vi.fn();

      await expect(
        postService.createNewPost(undefined, undefined))
      .rejects.toThrow("No image uploaded");

      expect(userRepository.findUserById).not.toHaveBeenCalled();
      expect(postRepository.createNewPost).not.toHaveBeenCalled();
      expect(cloudinary.uploadAndDeleteLocal).not.toHaveBeenCalled();
    });

    test("should throw an error if user not found", async () => {
      const { image_url, image_id, ...rest } = existingPost;

      const buffer = Buffer.alloc(1024 * 1024 * 10, ".");

      const file = {
        buffer,
        mimetype: "image/jpeg",
        originalname: faker.system.fileName(),
        size: buffer.length,
        filename: faker.system.fileName(),
        destination: faker.system.directoryPath(),
        fieldname: "",
        encoding: "",
        stream: new Readable(),
        path: faker.system.filePath(),
        image_id,
        user_id: rest.user_id,
      };

      userRepository.findUserById = vi.fn().mockResolvedValue(undefined);
      postRepository.createNewPost = vi.fn();
      cloudinary.uploadAndDeleteLocal = vi.fn();

      await expect(
        postService.createNewPost(rest, file))
      .rejects.toThrow(error.userNotFoundMsg);

      expect(userRepository.findUserById).toHaveBeenCalledWith(existingPost.user_id);
      expect(postRepository.createNewPost).not.toHaveBeenCalled();
      expect(cloudinary.uploadAndDeleteLocal).not.toHaveBeenCalled();
    });
  });

  describe("updatePostByUuid (edit the user's post)", () => {
    test("should throw an error if no args provided", async () => {
      postRepository.findPostsByPostId = vi
        .fn()
        .mockResolvedValue(existingPost);

      postRepository.editPostByPostId = vi.fn()

      const { image_url, image_id, ...rest } = existingPost;
      const result = await postService.updatePostByUuid(existingPost.uuid, rest);

      expect(result).toBe("Post edited successfully");
      
      expect(postRepository.findPostsByPostId).toHaveBeenCalledWith(
        existingPost.uuid
      );

      expect(postRepository.editPostByPostId).toHaveBeenCalledWith(
        existingPost.uuid,
        rest
      );
    });

    test("should throw an error if no args provided", async () => {
      postRepository.findPostsByPostId = vi.fn();
      postRepository.editPostByPostId = vi.fn();

      await expect(postService.updatePostByUuid(undefined, undefined)).rejects.toThrow(
        error.noArgsMsg
      );

      expect(postRepository.findPostsByPostId).not.toHaveBeenCalled();
      expect(postRepository.editPostByPostId).not.toHaveBeenCalled();
    });

    test("should throw an error if post not found", async () => {
      postRepository.findPostsByPostId = vi.fn().mockResolvedValue(undefined);
      postRepository.editPostByPostId = vi.fn();

      const { image_url, image_id, ...rest } = nonExistingPost;

      await expect(postService.updatePostByUuid(rest.uuid, rest)).rejects.toThrow(
        error.postNotFoundMsg
      );

      expect(postRepository.findPostsByPostId).toHaveBeenCalledWith(
        rest.uuid
      );
      expect(postRepository.editPostByPostId).not.toHaveBeenCalled();
    });
  });

  describe("deletePostByUuid (delete the user's post)", async () => {
    test("should return the correct result", async () => {
      postRepository.findPostsByPostId = vi
        .fn()
        .mockResolvedValue(existingPost);

      postRepository.deletePostById = vi.fn()

      const result = await postService.deletePostByUuid(existingPost.uuid);

      expect(result).toBe("Post deleted successfully");

      expect(
        postRepository.findPostsByPostId
      ).toHaveBeenCalledWith(existingPost.uuid);
      
      expect(
        postRepository.deletePostById
      ).toHaveBeenCalledWith(existingPost.id);
    });

    test("should throw an error if no args provided", async () => {
      postRepository.findPostsByPostId = vi.fn();
      postRepository.deletePostById = vi.fn();

      await expect(
        postService.deletePostByUuid(undefined)
      ).rejects.toThrow(error.noArgsMsg);

      expect(postRepository.findPostsByPostId).not.toHaveBeenCalled();
      expect(postRepository.deletePostById).not.toHaveBeenCalled();
    });

    test("should throw an error if post not found", async () => {
      postRepository.findPostsByPostId = vi.fn().mockResolvedValue(undefined);
      postRepository.deletePostById = vi.fn();

      await expect(
        postService.deletePostByUuid(nonExistingPost.uuid)
      ).rejects.toThrow(error.postNotFoundMsg);

      expect(postRepository.findPostsByPostId).toHaveBeenCalledWith(
        nonExistingPost.uuid
      );
      expect(postRepository.deletePostById).not.toHaveBeenCalled();
    });
  });
});
