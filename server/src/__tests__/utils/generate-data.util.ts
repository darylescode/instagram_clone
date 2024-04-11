import {
  SelectFollowers,
  SelectPosts,
  SelectSearches,
  SelectUsers,
}                from "@/types/table.types";
import { faker } from "@faker-js/faker";

class GenerateMockData {
  static generateMockData = (changeArg: boolean, list: any[], callback: Function) => {
    return list.flatMap((u, i) => {
      let nextUser = list[i + 1];
      let nextUserId = nextUser ? nextUser.user_id : u.user_id;

      const args = changeArg
        ? [nextUserId, u.user_id]
        : [u.user_id, nextUserId];

      return callback(args[0], args[1]);
    });
  };

  static createUser = (): SelectUsers => ({
    user_id: faker.number.int({ min: 1, max: 1000 }),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    roles: faker.string.fromCharacters(["admin", "user"]),
    age: faker.number.int({ min: 18, max: 99 }),
    avatar_url: faker.image.avatar(),
    birthday: faker.date.past().toISOString(),
    created_at: new Date(faker.date.past().toISOString()),
  });

  static createUserList = (count: number): SelectUsers[] => {
    return Array.from({ length: count }, this.createUser);
  };

  static createFollower = (
    follower_id: number,
    followed_id: number
  ): SelectFollowers => ({
    follower_id: follower_id,
    followed_id: followed_id,
  });

  static createRecentSearch = (user_id: number, search_user_id: number): SelectSearches => ({
    recent_id: faker.number.int({ min: 1, max: 1000 }),
    user_id: user_id,
    search_user_id: search_user_id,
    create_time: new Date(faker.date.past().toISOString()),
  });

  static createPost = (user_id: number): SelectPosts => ({
    post_id: faker.number.int({ min: 1, max: 999 }),
    image_id: faker.string.uuid(),
    image_url: faker.image.url(),
    user_id: user_id,
    caption: faker.lorem.text(),
    privacy_level: faker.string.fromCharacters(["public", "private"]),
    post_date: new Date(faker.date.past().toISOString()),
  });
};

export default GenerateMockData;