import { User } from '../../user';

export interface JwtUser {
  expiresIn: string;
  accessToken: string;
  user: User;
}
