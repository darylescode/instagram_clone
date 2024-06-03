"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_database_1 = __importDefault(require("@/database/db.database"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const async_wrapper_util_1 = __importDefault(require("@/utils/async-wrapper.util"));
const kysely_1 = require("kysely");
const api_exception_1 = __importDefault(require("@/exceptions/api.exception"));
class PostRepository {
    database;
    wrap = new async_wrapper_util_1.default();
    constructor() { this.database = db_database_1.default; }
    ;
    findPostsByPostId = this.wrap.repoWrap(async (uuid) => {
        return this.database
            .selectFrom("posts")
            .select([
            "id",
            (0, kysely_1.sql) `BIN_TO_UUID(uuid)`.as("uuid"),
            "user_id",
            "caption",
            "image_id",
            "image_url",
            "privacy_level",
            "created_at",
        ])
            .where("uuid", "=", uuid)
            .executeTakeFirst();
    });
    findAllPostsByUserId = this.wrap.repoWrap(async (user_id) => {
        return await this.database
            .selectFrom("posts")
            .innerJoin("users", "posts.user_id", "users.id")
            .leftJoin("likes", "posts.id", "likes.post_id")
            .select((eb) => [
            "posts.id",
            (0, kysely_1.sql) `BIN_TO_UUID(posts.uuid)`.as("uuid"),
            "posts.image_id",
            "posts.image_url",
            "posts.user_id",
            "users.username",
            "users.first_name",
            "users.last_name",
            "posts.caption",
            "posts.privacy_level",
            "posts.created_at",
            eb.fn.count("likes.post_id").as("count"),
        ])
            .where("posts.user_id", "=", user_id)
            .orderBy("posts.created_at", "desc")
            .groupBy("posts.id")
            .execute();
    });
    findUserTotalPostsByUserId = this.wrap.repoWrap(async (user_id) => {
        const query = this.database
            .selectFrom("posts")
            .select((eb) => eb.fn.count("posts.id").as("count"))
            .where("user_id", "=", user_id);
        const { count } = await this.database
            .selectNoFrom((eb) => eb.fn.coalesce(query, eb.lit(0)).as("count"))
            .executeTakeFirstOrThrow();
        return count;
    });
    createNewPost = this.wrap.repoWrap(async (post) => {
        await this.database
            .insertInto("posts")
            .values(post)
            .execute();
    });
    editPostByPostId = this.wrap.repoWrap(async (uuid, post) => {
        await this.database
            .updateTable("posts")
            .set(post)
            .where("uuid", "=", uuid)
            .executeTakeFirst();
    });
    deletePostById = this.wrap.repoWrap(async (post_id) => {
        const { image_id } = (await this.database
            .selectFrom("posts")
            .select(["image_id"])
            .where("id", "=", post_id)
            .executeTakeFirst());
        // deletes the image associated with a user's post from the cloud storage
        const status = await cloudinary_1.default.v2.uploader.destroy(image_id);
        // throws an error if the image deletion was not successful
        if (status.result !== "ok") {
            throw api_exception_1.default.HTTP400Error("Delete image failed");
        }
        await this.database
            .deleteFrom("posts")
            .where("id", "=", post_id)
            .executeTakeFirst();
    });
}
;
exports.default = PostRepository;
