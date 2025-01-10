// user-profile.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserProfileState } from '../state/user-profileInfo.state';

// Feature selector for UserProfileState
export const selectUserProfileState =
  createFeatureSelector<UserProfileState>('userProfile');

// Selector to get the user from the state
export const selectUser = createSelector(
  selectUserProfileState,
  (state: UserProfileState) => state.user,
);

// Selector to get the loading state
export const selectLoading = createSelector(
  selectUserProfileState,
  (state: UserProfileState) => state.loading,
);

// Selector to get the error state
export const selectError = createSelector(
  selectUserProfileState,
  (state: UserProfileState) => state.error,
);
