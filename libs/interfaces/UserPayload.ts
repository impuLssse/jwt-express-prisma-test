import { User } from './User';

export interface UserPayload extends Pick<User, 'user_name'> {}
