import { User } from '@modules/user'

export interface JwtUser {
    expiresIn: string,
    accessToken: string,
    user: User,
  }
  