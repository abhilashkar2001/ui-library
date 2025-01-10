import { createReducer, on } from '@ngrx/store'; // Import createReducer and on
import { UserProfileInfoAction } from '../action/user-profileInfo.action';
import {
  initialUserProfileState,
  UserProfileState,
} from '../state/user-profileInfo.state';

// Define the reducer using createReducer and explicitly type the state parameter
export const UserProfileInfoReducer = createReducer(
  initialUserProfileState, // Initial state

  // Load User Profile: Set loading to true and reset error
  on(
    UserProfileInfoAction.loadUserProfile,
    (state): UserProfileState => ({
      ...state,
      loading: true,
      error: null,
    }),
  ),

  // Load User Profile Success: Set user and loading to false
  on(
    UserProfileInfoAction.loadUserProfileSuccess,
    (state, { user }): UserProfileState => ({
      ...state,
      user,
      loading: false,
      error: null,
    }),
  ),

  // Load User Profile Failure: Set error and loading to false
  on(
    UserProfileInfoAction.loadUserProfileFailure,
    (state, { error }): UserProfileState => ({
      ...state,
      loading: false,
      error,
    }),
  ),
);
