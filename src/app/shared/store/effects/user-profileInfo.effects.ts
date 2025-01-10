import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { UserProfileInfoAction } from '../action/user-profileInfo.action';
import { User } from '../models/user.model';
import { UserProfileService } from '../services/user-profileInfo.service';

@Injectable()
export class UserProfileInfoEffects {
  constructor(
    private actions$: Actions,
    private userProfileService: UserProfileService,
  ) {}

  loadUserProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserProfileInfoAction.loadUserProfile),
      mergeMap(() =>
        this.userProfileService.loadUserProfile().pipe(
          map((user: User) =>
            UserProfileInfoAction.loadUserProfileSuccess({ user }),
          ),
          catchError((error: Error) =>
            of(UserProfileInfoAction.loadUserProfileFailure({ error })),
          ),
        ),
      ),
    ),
  );
}
