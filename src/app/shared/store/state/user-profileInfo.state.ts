import { User } from '../models/user.model';

export interface UserProfileState {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

export const initialUserProfileState: UserProfileState = {
  user: null,
  loading: false,
  error: null,
};
