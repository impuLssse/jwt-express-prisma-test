import { User } from '@prisma/client';

export interface Login extends Pick<User, 'user_name'> {
  password: string;
}
