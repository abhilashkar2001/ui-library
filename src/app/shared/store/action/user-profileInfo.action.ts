import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User } from '../models/user.model';
export const UserProfileInfoAction = createActionGroup({
  source: 'Sign In',
  events: {
    'Load User Profile': emptyProps(),
    'Load User Profile Success': props<{ user: User | null }>(),
    'Load User Profile Failure': props<{ error: Error | null }>(),
  },
});
