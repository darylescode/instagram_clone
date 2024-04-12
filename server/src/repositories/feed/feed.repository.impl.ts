import db                from "@/database/db.database";
import { DB }            from "@/types/schema.types";
import { Kysely, sql }   from "kysely";
import { SelectPosts }   from "@/types/table.types";
import IFeedRepository   from "./feed.repository";
import DatabaseException from "@/exceptions/database.exception";

class FeedRepository implements IFeedRepository {
  private database: Kysely<DB>;

  constructor() { this.database = db; };

  async getTotalFeed(): Promise<number> {
    try {
      const query = this.database
        .selectFrom("posts")
        .select((eb) => eb.fn.countAll<number>().as("count"))
        .where((eb) =>
          eb("created_at", ">", sql<Date>`DATE_SUB(CURDATE(), INTERVAL 3 DAY)`)
        );

      const { count } = await this.database
        .selectNoFrom((eb) => [eb.fn.coalesce(query, eb.lit(0)).as("count")])
        .executeTakeFirstOrThrow();

      return count;
    } catch (error) {
      throw DatabaseException.fromError(error);
    }
  };

  async getUserFeed(user_id: number, post_ids: number[]): Promise<SelectPosts[]> {
    try {
      return await this.database
        .selectFrom("followers")
        .innerJoin("posts", "followers.followed_id", "posts.user_id")
        .innerJoin("users", "users.user_id", "posts.user_id")
        .select((eb) => [
          "posts.post_id",
          "posts.image_id",
          "posts.image_url",
          "users.user_id",
          "users.username",
          "users.first_name",
          "users.last_name",
          "users.avatar_url",
          "posts.caption",
          "posts.privacy_level",
          "posts.created_at",
          eb
            .selectFrom("likes")
            .select((eb) => eb.fn.count("likes.post_id").as("count"))
            .whereRef("posts.post_id", "=", "likes.post_id")
            .as("count"),
        ])
        .where((eb) =>
          eb.and([
            eb("followers.follower_id", "=", user_id),
            eb("posts.created_at", ">", sql<Date>`DATE_SUB(CURDATE(), INTERVAL 3 DAY)`),
            eb("posts.post_id", "not in", post_ids),
          ])
        )
        .orderBy(sql`"RAND()"`)
        .limit(3)
        .execute();
    } catch (error) {
      throw DatabaseException.fromError(error);
    }
  };

  async getExploreFeed(user_id: number): Promise<SelectPosts[]> {
    return await this.database
      .selectFrom("posts")
      .innerJoin("users", "users.user_id", "posts.user_id")
      .leftJoin("followers", (join) =>
        join.on((eb) =>
          eb.and([
            eb("followers.followed_id", "=", eb.ref("users.user_id")),
            eb("followers.follower_id", "=", user_id),
          ])
        )
      )
      .select((eb) => [
        "posts.post_id",
        "posts.image_id",
        "posts.image_url",
        "users.user_id",
        "users.username",
        "users.first_name",
        "users.last_name",
        "users.avatar_url",
        "posts.caption",
        "posts.privacy_level",
        "posts.created_at",
        eb
          .selectFrom("likes")
          .select((eb) => eb.fn.count("likes.post_id").as("count"))
          .whereRef("posts.post_id", "=", "likes.post_id")
          .as("count"),
      ])
      .where((eb) =>
          eb.and([
            eb("posts.created_at", ">", sql<Date>`DATE_SUB(CURDATE(), INTERVAL 3 DAY)`),
            eb("followers.follower_id", "is", eb.lit(null)),
            eb("users.user_id", "!=", user_id),
          ])
        )
      .orderBy(sql`"RAND()"`)
      .limit(3)
      .execute();
  };
};

export default FeedRepository;