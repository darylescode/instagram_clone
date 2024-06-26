"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const faker_1 = require("@faker-js/faker");
const post_service_impl_1 = __importDefault(require("@/services/post/post.service.impl"));
const user_repository_impl_1 = __importDefault(require("@/repositories/user/user.repository.impl"));
const post_repository_impl_1 = __importDefault(require("@/repositories/post/post.repository.impl"));
const generate_data_util_1 = __importDefault(require("../../utils/generate-data.util"));
const api_exception_1 = __importDefault(require("@/exceptions/api.exception"));
const cloudinary_service_lib_1 = __importDefault(require("@/libraries/cloudinary/cloudinary-service.lib"));
const vitest_1 = require("vitest");
vitest_1.vi.mock("@/repositories/feed/feed.repository.impl");
vitest_1.vi.mock("@/repositories/user/user.repository.impl");
vitest_1.vi.mock("@/utils/cloudinary-service.util");
(0, vitest_1.describe)("FeedService", () => {
    let cloudinary;
    let postRepository;
    let userRepository;
    let postService;
    const error = {
        noArgsMsg: api_exception_1.default.HTTP400Error("No arguments provided"),
        userNotFoundMsg: api_exception_1.default.HTTP400Error("User not found"),
        postNotFoundMsg: api_exception_1.default.HTTP400Error("Post not found"),
    };
    const users = generate_data_util_1.default.createUserList(10);
    const existingUser = users[0];
    const notFoundUser = generate_data_util_1.default.createUser();
    const posts = generate_data_util_1.default.generateMockData(false, users, generate_data_util_1.default.createPost);
    const existingPost = posts[0];
    const nonExistingPost = generate_data_util_1.default.createPost(1000);
    (0, vitest_1.beforeEach)(() => {
        cloudinary = new cloudinary_service_lib_1.default();
        postRepository = new post_repository_impl_1.default();
        userRepository = new user_repository_impl_1.default();
        postService = new post_service_impl_1.default(postRepository, userRepository, cloudinary);
    });
    (0, vitest_1.afterEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    afterAll(() => {
        vitest_1.vi.restoreAllMocks();
    });
    (0, vitest_1.describe)("findPostsByPostId (get post by id)", async () => {
        (0, vitest_1.test)("should return the correct result", async () => {
            postRepository.findPostsByPostId = vitest_1.vi.fn().mockResolvedValue(existingPost);
            const result = await postService.findPostsByPostId(existingPost.post_id);
            (0, vitest_1.expect)(result).toEqual(existingPost);
            (0, vitest_1.expect)(postRepository.findPostsByPostId).toHaveBeenCalledWith(existingPost.post_id);
        });
        (0, vitest_1.test)("should throw an error if no args provided", async () => {
            postRepository.findPostsByPostId = vitest_1.vi.fn().mockResolvedValue(null);
            await (0, vitest_1.expect)(postService.findPostsByPostId(null)).rejects.toThrow(error.noArgsMsg);
            (0, vitest_1.expect)(postRepository.findPostsByPostId).not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error if post not found", async () => {
            postRepository.findPostsByPostId = vitest_1.vi.fn().mockResolvedValue(null);
            await (0, vitest_1.expect)(postService.findPostsByPostId(nonExistingPost.post_id)).rejects.toThrow(error.postNotFoundMsg);
            (0, vitest_1.expect)(postRepository.findPostsByPostId).toHaveBeenCalledWith(nonExistingPost.post_id);
        });
    });
    (0, vitest_1.describe)("getUserPosts", async () => {
        (0, vitest_1.test)("should return the correct result", async () => {
            userRepository.findUserById = vitest_1.vi.fn().mockResolvedValue(existingUser);
            postRepository.getUserPosts = vitest_1.vi.fn().mockResolvedValue(posts);
            const result = await postService.getUserPosts(existingUser.user_id);
            (0, vitest_1.expect)(result).toEqual(posts);
            (0, vitest_1.expect)(userRepository.findUserById).toHaveBeenCalledWith(existingUser.user_id);
            (0, vitest_1.expect)(postRepository.getUserPosts).toHaveBeenCalledWith(existingUser.user_id);
        });
        (0, vitest_1.test)("should throw an error if no args provided", async () => {
            userRepository.findUserById = vitest_1.vi.fn();
            await (0, vitest_1.expect)(postService.getUserPosts(null)).rejects.toThrow(error.noArgsMsg);
            (0, vitest_1.expect)(userRepository.findUserById).not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error if user not found", async () => {
            userRepository.findUserById = vitest_1.vi.fn().mockResolvedValue(null);
            await (0, vitest_1.expect)(postService.getUserPosts(notFoundUser.user_id)).rejects.toThrow(error.userNotFoundMsg);
            (0, vitest_1.expect)(userRepository.findUserById).toHaveBeenCalledWith(notFoundUser.user_id);
        });
    });
    (0, vitest_1.describe)("getUserTotalPosts (get the total post available for feed)", async () => {
        (0, vitest_1.test)("should return the correct result", async () => {
            userRepository.findUserById = vitest_1.vi.fn().mockResolvedValue(existingUser);
            postRepository.getUserTotalPosts = vitest_1.vi.fn().mockResolvedValue(posts.length);
            const result = await postService.getUserTotalPosts(existingUser.user_id);
            (0, vitest_1.expect)(result).toEqual(posts.length);
            (0, vitest_1.expect)(userRepository.findUserById).toHaveBeenCalledWith(existingUser.user_id);
            (0, vitest_1.expect)(postRepository.getUserTotalPosts).toHaveBeenCalledWith(existingUser.user_id);
        });
        (0, vitest_1.test)("should throw an error if no args provided", async () => {
            userRepository.findUserById = vitest_1.vi.fn();
            postRepository.getUserTotalPosts = vitest_1.vi.fn();
            await (0, vitest_1.expect)(postService.getUserTotalPosts(undefined))
                .rejects.toThrow(error.noArgsMsg);
            (0, vitest_1.expect)(userRepository.findUserById).not.toHaveBeenCalled();
            (0, vitest_1.expect)(postRepository.getUserTotalPosts).not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error if user not found", async () => {
            userRepository.findUserById = vitest_1.vi.fn().mockResolvedValue(undefined);
            postRepository.getUserTotalPosts = vitest_1.vi.fn();
            await (0, vitest_1.expect)(postService.getUserTotalPosts(notFoundUser.user_id))
                .rejects.toThrow(error.userNotFoundMsg);
            (0, vitest_1.expect)(userRepository.findUserById).toHaveBeenCalledWith(notFoundUser.user_id);
            (0, vitest_1.expect)(postRepository.getUserTotalPosts).not.toHaveBeenCalled();
        });
    });
    (0, vitest_1.describe)("newPost (create new post from the user)", async () => {
        (0, vitest_1.test)("should return the correct result", async () => {
            const { image_url, image_id, ...rest } = existingPost;
            const buffer = Buffer.alloc(1024 * 1024 * 10, ".");
            const file = {
                buffer,
                mimetype: "image/jpeg",
                originalname: faker_1.faker.system.fileName(),
                size: buffer.length,
                filename: faker_1.faker.system.fileName(),
                destination: faker_1.faker.system.directoryPath()
            };
            userRepository.findUserById = vitest_1.vi
                .fn()
                .mockResolvedValue(existingUser);
            postRepository.newPost = vitest_1.vi
                .fn()
                .mockResolvedValue(existingPost);
            cloudinary.uploadAndDeleteLocal = vitest_1.vi
                .fn()
                .mockResolvedValue({ image_url, image_id });
            const result = await postService.newPost(file, rest);
            (0, vitest_1.expect)(result).toBe("Post created successfully");
            (0, vitest_1.expect)(userRepository.findUserById).toHaveBeenCalledWith(existingPost.user_id);
            (0, vitest_1.expect)(cloudinary.uploadAndDeleteLocal).toHaveBeenCalledWith((0, path_1.join)(file.destination, file.filename));
            (0, vitest_1.expect)(postRepository.newPost).toHaveBeenCalledWith({
                ...rest,
                image_url,
                image_id,
            });
        });
        (0, vitest_1.test)("should throw an error if no args provided", async () => {
            const { image_url, image_id, ...rest } = existingPost;
            const buffer = Buffer.alloc(1024 * 1024 * 10, ".");
            const file = {
                buffer,
                mimetype: "image/jpeg",
                originalname: faker_1.faker.system.fileName(),
                size: buffer.length,
                filename: faker_1.faker.system.fileName(),
                destination: faker_1.faker.system.directoryPath(),
            };
            userRepository.findUserById = vitest_1.vi.fn();
            postRepository.newPost = vitest_1.vi.fn();
            cloudinary.uploadAndDeleteLocal = vitest_1.vi.fn();
            await (0, vitest_1.expect)(postService.newPost(file, undefined))
                .rejects.toThrow(error.noArgsMsg);
            (0, vitest_1.expect)(userRepository.findUserById).not.toHaveBeenCalled();
            (0, vitest_1.expect)(postRepository.newPost).not.toHaveBeenCalled();
            (0, vitest_1.expect)(cloudinary.uploadAndDeleteLocal).not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error if no image uploaded", async () => {
            userRepository.findUserById = vitest_1.vi.fn();
            postRepository.newPost = vitest_1.vi.fn();
            cloudinary.uploadAndDeleteLocal = vitest_1.vi.fn();
            await (0, vitest_1.expect)(postService.newPost(undefined, undefined))
                .rejects.toThrow("No image uploaded");
            (0, vitest_1.expect)(userRepository.findUserById).not.toHaveBeenCalled();
            (0, vitest_1.expect)(postRepository.newPost).not.toHaveBeenCalled();
            (0, vitest_1.expect)(cloudinary.uploadAndDeleteLocal).not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error if user not found", async () => {
            const { image_url, image_id, ...rest } = existingPost;
            const buffer = Buffer.alloc(1024 * 1024 * 10, ".");
            const file = {
                buffer,
                mimetype: "image/jpeg",
                originalname: faker_1.faker.system.fileName(),
                size: buffer.length,
                filename: faker_1.faker.system.fileName(),
                destination: faker_1.faker.system.directoryPath(),
            };
            userRepository.findUserById = vitest_1.vi.fn().mockResolvedValue(undefined);
            postRepository.newPost = vitest_1.vi.fn();
            cloudinary.uploadAndDeleteLocal = vitest_1.vi.fn();
            await (0, vitest_1.expect)(postService.newPost(file, rest))
                .rejects.toThrow(error.userNotFoundMsg);
            (0, vitest_1.expect)(userRepository.findUserById).toHaveBeenCalledWith(existingPost.user_id);
            (0, vitest_1.expect)(postRepository.newPost).not.toHaveBeenCalled();
            (0, vitest_1.expect)(cloudinary.uploadAndDeleteLocal).not.toHaveBeenCalled();
        });
    });
    (0, vitest_1.describe)("editPost (edit the user's post)", () => {
        (0, vitest_1.test)("should throw an error if no args provided", async () => {
            postRepository.findPostsByPostId = vitest_1.vi.fn().mockResolvedValue(existingPost);
            postRepository.editPost = vitest_1.vi.fn().mockResolvedValue(existingPost);
            const { image_url, image_id, ...rest } = existingPost;
            const result = await postService.editPost(existingPost.post_id, rest);
            (0, vitest_1.expect)(result).toBe(existingPost);
            (0, vitest_1.expect)(postRepository.findPostsByPostId).toHaveBeenCalledWith(existingPost.post_id);
            (0, vitest_1.expect)(postRepository.editPost).toHaveBeenCalledWith(existingPost.post_id, rest);
        });
        (0, vitest_1.test)("should throw an error if no args provided", async () => {
            postRepository.findPostsByPostId = vitest_1.vi.fn();
            postRepository.editPost = vitest_1.vi.fn();
            await (0, vitest_1.expect)(postService.editPost(undefined, undefined))
                .rejects.toThrow(error.noArgsMsg);
            (0, vitest_1.expect)(postRepository.findPostsByPostId).not.toHaveBeenCalled();
            (0, vitest_1.expect)(postRepository.editPost).not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error if post not found", async () => {
            postRepository.findPostsByPostId = vitest_1.vi.fn().mockResolvedValue(undefined);
            postRepository.editPost = vitest_1.vi.fn();
            const { image_url, image_id, ...rest } = nonExistingPost;
            await (0, vitest_1.expect)(postService.editPost(rest.post_id, rest)).rejects.toThrow(error.postNotFoundMsg);
            (0, vitest_1.expect)(postRepository.findPostsByPostId).toHaveBeenCalledWith(rest.post_id);
            (0, vitest_1.expect)(postRepository.editPost).not.toHaveBeenCalled();
        });
    });
    (0, vitest_1.describe)("deletePost (delete the user's post)", async () => {
        (0, vitest_1.test)("should return the correct result", async () => {
            postRepository.findPostsByPostId = vitest_1.vi.fn().mockResolvedValue(existingPost);
            postRepository.deletePost = vitest_1.vi.fn().mockResolvedValue("Post deleted successfully");
            const result = await postService.deletePost(existingPost.post_id);
            (0, vitest_1.expect)(result).toBe("Post deleted successfully");
            (0, vitest_1.expect)(postRepository.findPostsByPostId).toHaveBeenCalledWith(existingPost.post_id);
            (0, vitest_1.expect)(postRepository.deletePost).toHaveBeenCalledWith(existingPost.post_id);
        });
        (0, vitest_1.test)("should throw an error if no args provided", async () => {
            postRepository.findPostsByPostId = vitest_1.vi.fn();
            postRepository.deletePost = vitest_1.vi.fn();
            await (0, vitest_1.expect)(postService.deletePost(undefined))
                .rejects.toThrow(error.noArgsMsg);
            (0, vitest_1.expect)(postRepository.findPostsByPostId).not.toHaveBeenCalled();
            (0, vitest_1.expect)(postRepository.deletePost).not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error if post not found", async () => {
            postRepository.findPostsByPostId = vitest_1.vi.fn().mockResolvedValue(undefined);
            postRepository.deletePost = vitest_1.vi.fn();
            await (0, vitest_1.expect)(postService.deletePost(nonExistingPost.post_id))
                .rejects.toThrow(error.postNotFoundMsg);
            (0, vitest_1.expect)(postRepository.findPostsByPostId).toHaveBeenCalledWith(nonExistingPost.post_id);
            (0, vitest_1.expect)(postRepository.deletePost).not.toHaveBeenCalled();
        });
    });
    (0, vitest_1.describe)("getLikesCountForPost (get the total likes for the post)", async () => {
        (0, vitest_1.test)("should return the correct result", async () => {
            postRepository.findPostsByPostId = vitest_1.vi.fn().mockResolvedValue(existingPost);
            postRepository.getLikesCountForPost = vitest_1.vi.fn().mockResolvedValue(10);
            const result = await postService.getLikesCountForPost(existingPost.post_id);
            (0, vitest_1.expect)(result).toBe(10);
            (0, vitest_1.expect)(postRepository.findPostsByPostId).toHaveBeenCalledWith(existingPost.post_id);
            (0, vitest_1.expect)(postRepository.getLikesCountForPost).toHaveBeenCalledWith(existingPost.post_id);
        });
        (0, vitest_1.test)("should throw an error if no args provided", async () => {
            postRepository.findPostsByPostId = vitest_1.vi.fn();
            postRepository.getLikesCountForPost = vitest_1.vi.fn();
            await (0, vitest_1.expect)(postService.getLikesCountForPost(undefined))
                .rejects.toThrow(error.noArgsMsg);
            (0, vitest_1.expect)(postRepository.findPostsByPostId).not.toHaveBeenCalled();
            (0, vitest_1.expect)(postRepository.getLikesCountForPost).not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error if post not found", async () => {
            postRepository.findPostsByPostId = vitest_1.vi.fn().mockResolvedValue(undefined);
            postRepository.getLikesCountForPost = vitest_1.vi.fn();
            await (0, vitest_1.expect)(postService.getLikesCountForPost(nonExistingPost.post_id))
                .rejects.toThrow(error.postNotFoundMsg);
            (0, vitest_1.expect)(postRepository.findPostsByPostId).toHaveBeenCalledWith(nonExistingPost.post_id);
            (0, vitest_1.expect)(postRepository.getLikesCountForPost).not.toHaveBeenCalled();
        });
    });
    (0, vitest_1.describe)("checkUserLikeStatusForPost (check if the user liked the post)", async () => {
        (0, vitest_1.test)("should return the correct result", async () => {
            const like = generate_data_util_1.default.createLike(existingPost.post_id, existingPost.user_id);
            userRepository.findUserById = vitest_1.vi.fn().mockResolvedValue(existingUser);
            postRepository.findPostsByPostId = vitest_1.vi.fn().mockResolvedValue(existingPost);
            postRepository.isUserLikePost = vitest_1.vi.fn().mockResolvedValue(like);
            const result = await postService.checkUserLikeStatusForPost(like);
            (0, vitest_1.expect)(result).toBe(like);
            (0, vitest_1.expect)(userRepository.findUserById).toHaveBeenCalledWith(like.user_id);
            (0, vitest_1.expect)(postRepository.findPostsByPostId).toHaveBeenCalledWith(like.post_id);
            (0, vitest_1.expect)(postRepository.isUserLikePost).toHaveBeenCalledWith(like);
        });
        (0, vitest_1.test)("should throw an error if no args provided", async () => {
            userRepository.findUserById = vitest_1.vi.fn();
            postRepository.findPostsByPostId = vitest_1.vi.fn();
            postRepository.isUserLikePost = vitest_1.vi.fn();
            await (0, vitest_1.expect)(postService.checkUserLikeStatusForPost(undefined))
                .rejects.toThrow(error.noArgsMsg);
            (0, vitest_1.expect)(userRepository.findUserById).not.toHaveBeenCalled();
            (0, vitest_1.expect)(postRepository.findPostsByPostId).not.toHaveBeenCalled();
            (0, vitest_1.expect)(postRepository.isUserLikePost).not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error if user not found", async () => {
            const like = generate_data_util_1.default.createLike(existingPost.post_id, existingPost.user_id);
            userRepository.findUserById = vitest_1.vi.fn().mockResolvedValue(undefined);
            postRepository.findPostsByPostId = vitest_1.vi.fn();
            postRepository.isUserLikePost = vitest_1.vi.fn();
            await (0, vitest_1.expect)(postService.checkUserLikeStatusForPost(like))
                .rejects.toThrow(error.userNotFoundMsg);
            (0, vitest_1.expect)(userRepository.findUserById).toHaveBeenCalledWith(like.user_id);
            (0, vitest_1.expect)(postRepository.findPostsByPostId).not.toHaveBeenCalled();
            (0, vitest_1.expect)(postRepository.isUserLikePost).not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error if post not found", async () => {
            const like = generate_data_util_1.default.createLike(existingPost.post_id, existingPost.user_id);
            userRepository.findUserById = vitest_1.vi.fn().mockResolvedValue(existingUser);
            postRepository.findPostsByPostId = vitest_1.vi.fn().mockResolvedValue(undefined);
            postRepository.isUserLikePost = vitest_1.vi.fn();
            await (0, vitest_1.expect)(postService.checkUserLikeStatusForPost(like))
                .rejects.toThrow(error.postNotFoundMsg);
            (0, vitest_1.expect)(userRepository.findUserById).toHaveBeenCalledWith(like.user_id);
            (0, vitest_1.expect)(postRepository.findPostsByPostId).toHaveBeenCalledWith(like.post_id);
            (0, vitest_1.expect)(postRepository.isUserLikePost).not.toHaveBeenCalled();
        });
    });
    (0, vitest_1.describe)("toggleUserLikeForPost (toggle the user's like for the post)", async () => {
        (0, vitest_1.test)("should return the 'like added successfully' message", async () => {
            const like = generate_data_util_1.default.createLike(existingPost.post_id, existingPost.user_id);
            userRepository.findUserById = vitest_1.vi
                .fn()
                .mockResolvedValue(existingUser);
            postRepository.findPostsByPostId = vitest_1.vi
                .fn()
                .mockResolvedValue(existingPost);
            postRepository.isUserLikePost = vitest_1.vi
                .fn()
                .mockResolvedValue(undefined);
            postRepository.toggleUserLikeForPost = vitest_1.vi.fn();
            postRepository.removeUserLikeForPost = vitest_1.vi.fn();
            const result = await postService.toggleUserLikeForPost(like);
            (0, vitest_1.expect)(result).toBe("Like added successfully");
            (0, vitest_1.expect)(userRepository.findUserById).toHaveBeenCalledWith(like.user_id);
            (0, vitest_1.expect)(postRepository.findPostsByPostId).toHaveBeenCalledWith(like.post_id);
            (0, vitest_1.expect)(postRepository.isUserLikePost).toHaveBeenCalledWith(like);
            (0, vitest_1.expect)(postRepository.removeUserLikeForPost).not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should return the 'like removed successfully' message", async () => {
            const like = generate_data_util_1.default.createLike(existingPost.post_id, existingPost.user_id);
            userRepository.findUserById = vitest_1.vi
                .fn()
                .mockResolvedValue(existingUser);
            postRepository.findPostsByPostId = vitest_1.vi
                .fn()
                .mockResolvedValue(existingPost);
            postRepository.isUserLikePost = vitest_1.vi
                .fn()
                .mockResolvedValue(like);
            postRepository.toggleUserLikeForPost = vitest_1.vi.fn();
            postRepository.removeUserLikeForPost = vitest_1.vi.fn();
            const result = await postService.toggleUserLikeForPost(like);
            (0, vitest_1.expect)(result).toBe("Like removed successfully");
            (0, vitest_1.expect)(userRepository.findUserById).toHaveBeenCalledWith(like.user_id);
            (0, vitest_1.expect)(postRepository.findPostsByPostId).toHaveBeenCalledWith(like.post_id);
            (0, vitest_1.expect)(postRepository.isUserLikePost).toHaveBeenCalledWith(like);
            (0, vitest_1.expect)(postRepository.removeUserLikeForPost).toHaveBeenCalledWith(like);
            (0, vitest_1.expect)(postRepository.toggleUserLikeForPost).not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error if no args provided", async () => {
            userRepository.findUserById = vitest_1.vi.fn();
            postRepository.findPostsByPostId = vitest_1.vi.fn();
            postRepository.isUserLikePost = vitest_1.vi.fn();
            postRepository.toggleUserLikeForPost = vitest_1.vi.fn();
            postRepository.removeUserLikeForPost = vitest_1.vi.fn();
            await (0, vitest_1.expect)(postService.toggleUserLikeForPost(undefined))
                .rejects.toThrow(error.noArgsMsg);
            (0, vitest_1.expect)(userRepository.findUserById).not.toHaveBeenCalled();
            (0, vitest_1.expect)(postRepository.findPostsByPostId).not.toHaveBeenCalled();
            (0, vitest_1.expect)(postRepository.isUserLikePost).not.toHaveBeenCalled();
            (0, vitest_1.expect)(postRepository.toggleUserLikeForPost).not.toHaveBeenCalled();
            (0, vitest_1.expect)(postRepository.removeUserLikeForPost).not.toHaveBeenCalled();
        });
        (0, vitest_1.test)("should throw an error if user not found", async () => {
            const like = generate_data_util_1.default.createLike(existingPost.post_id, existingPost.user_id);
            userRepository.findUserById = vitest_1.vi.fn().mockResolvedValue(undefined);
            postRepository.findPostsByPostId = vitest_1.vi.fn();
            postRepository.isUserLikePost = vitest_1.vi.fn();
            postRepository.toggleUserLikeForPost = vitest_1.vi.fn();
            postRepository.removeUserLikeForPost = vitest_1.vi.fn();
            await (0, vitest_1.expect)(postService.toggleUserLikeForPost(like))
                .rejects.toThrow(error.userNotFoundMsg);
            (0, vitest_1.expect)(userRepository.findUserById).toHaveBeenCalledWith(like.user_id);
            (0, vitest_1.expect)(postRepository.findPostsByPostId).not.toHaveBeenCalled();
            (0, vitest_1.expect)(postRepository.isUserLikePost).not.toHaveBeenCalled();
            (0, vitest_1.expect)(postRepository.toggleUserLikeForPost).not.toHaveBeenCalled();
            (0, vitest_1.expect)(postRepository.removeUserLikeForPost).not.toHaveBeenCalled();
        });
    });
});
