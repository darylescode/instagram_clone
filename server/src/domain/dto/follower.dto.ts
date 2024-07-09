import FollowDto              from "./follow.dto";
import { Exclude, Expose }    from "class-transformer";
import { IsNotEmpty, IsUUID } from "class-validator";

class FollowerDto extends FollowDto {
  @Exclude({ toPlainOnly: true })
  private follower_id: number;

  @Expose()
  @IsNotEmpty({ message: "follower UUID is required" })
  @IsUUID(4, { message: "invalid UUID" })
  private follower_uuid: any;

  constructor(
    follower_id: number,
    follower_uuid: any,
    created_at: Date | null,
    username: string,
    first_name?: string | null,
    last_name?: string | null,
    avatar_url?: string | null
  ) {
    super(username, created_at, first_name, last_name, avatar_url);
    this.follower_id = follower_id;
    this.follower_uuid = follower_uuid;
  }

  // getters
  public getFollowerId(): number {
    return this.follower_id;
  }

  public getFollowerUuid(): any {
    return this.follower_uuid;
  }

  // setters
  public setFollowerId(follower_id: number): void {
    this.follower_id = follower_id;
  }

  public setFollowerUuid(follower_uuid: any): void {
    this.follower_uuid = follower_uuid;
  }
}

export default FollowerDto;