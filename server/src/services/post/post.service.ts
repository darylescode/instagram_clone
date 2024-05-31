import { NewPosts, SelectLikes, SelectPosts, UpdatePosts } from "@/types/table.types";

interface IEPostService {
  getPostByUuid: (uuid: string | undefined) => Promise<SelectPosts | undefined>;

  getAllPostsByUsersUuid: (user_uuid: string | undefined) => Promise<SelectPosts[]>;

  geTotalPostsByUsersUuid: (user_uuid: string | undefined) => Promise<string | number | bigint>;

  createNewPost: (file: Express.Multer.File | null | undefined, post: NewPosts) => Promise<string>;

  updatePostByUuid: (uuid: string | undefined, post: UpdatePosts | undefined) => Promise<string | undefined>;

  deletePostByUuid: (uuid: string | undefined) => Promise<string>;

  getPostLikesCountByUuid: (uuid: string | undefined) => Promise<number>;

  getUserLikeStatusForPostByUuid: (user_uuid: string | undefined, post_uuid: string | undefined) => Promise<SelectLikes | undefined>;

  toggleUserLikeForPost: (user_uuid: string | undefined, post_uuid: string | undefined) => Promise<string>;
}

export default IEPostService;
