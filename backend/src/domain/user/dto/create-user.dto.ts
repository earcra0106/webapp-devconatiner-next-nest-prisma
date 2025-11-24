export interface CreateUserDto {
  email: string;
  name?: string | null;
  password: string;
}