class UserDetails {
  protected username: string;
  protected first_name?: string | null;
  protected last_name?: string | null;
  protected avatar_url?: string | null;
  protected age?: number | null;
  protected birthday?: string | null;

  constructor(
    username: string,
    first_name?: string | null,
    last_name?: string | null,
    avatar_url?: string | null,
    age?: number | null,
    birthday?: string | null
  ) {
    this.username = username;
    this.first_name = first_name;
    this.last_name = last_name;
    this.avatar_url = avatar_url;
    this.age = age;
    this.birthday = birthday;
  }

  // getters
  public getUsername(): string {
    return this.username;
  }

  public getFirstName(): string | null {
    return this.first_name || null;
  }

  public getLastName(): string | null {
    return this.last_name || null;
  }

  public getAvatarUrl(): string | null {
    return this.avatar_url || null;
  }

  public getAge(): number | null {
    return this.age || null;
  }

  public getBirthday(): string | null {
    return this.birthday || null;
  }

  // setters
  public setUsername(username: string): void {
    this.username = username;
  }

  public setFirstName(first_name: string | null): void {
    this.first_name = first_name;
  }

  public setLastName(last_name: string | null): void {
    this.last_name = last_name;
  }

  public setAvatarUrl(avatar_url: string | null): void {
    this.avatar_url = avatar_url;
  }

  public setAge(age: number | null): void {
    this.age = age;
  }

  public setBirthday(birthday: string | null): void {
    this.birthday = birthday;
  }
}

export default UserDetails;
