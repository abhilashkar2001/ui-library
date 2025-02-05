import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { QueryParamEnum } from 'app/enum/query-param.enum';
import { ChecklistRouteObjModel } from 'app/shared/models/checklist-model';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { SessionService } from 'app/shared/session.service';
import { getParameterByName, UserProfileAction } from '@onerumango/utils';
import { User } from '@onerumango/utils';
import { selectUser } from '@onerumango/utils';
import { Observable, Subscription } from 'rxjs';
@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss'],
})
export class CallbackComponent implements OnInit, OnDestroy {
  userProfile$: Observable<User | null>;
  subscriptions: Subscription[] = [];

  constructor(
    private sessionService: SessionService,
    private router: Router,
    private sessionStorageService: SessionStorageService,
    private store: Store,
  ) {
    this.userProfile$ = this.store.select(selectUser);
  }

  ngOnInit() {
    sessionStorage.clear();
    localStorage.clear();
    /* send username and password to get Access Token */
    const payload = {
      username: 'WEBSITE',
      password: 'Newuser@1',
    };
    const isRememberMe = true;
    const otpRequired = false;

    this.sessionService
      .signin(payload, isRememberMe, otpRequired)
      .subscribe((_) => {
        this.store.dispatch(UserProfileAction.loadUserProfile());
      });

    this.getProfile();
  }

  /**
   * @method getProfile()
   */
  getProfile() {
    const userProfileSubscription$ = this.userProfile$.subscribe(async () => {
      this.sessionStorageService.setCustomerId(
        <string>getParameterByName('customerId'),
      );
      this.sessionStorageService.setMobile(
        <string>getParameterByName('mobile'),
      );
      this.sessionStorageService.setReferanceNumber(
        <string>getParameterByName('referanceNumber'),
      );
      this.sessionStorageService.setType(
        JSON.stringify(getParameterByName('type')),
      );
      this.sessionStorageService.setScreenId(
        <string>getParameterByName(QueryParamEnum.SCREEN_ID),
      );
      if (getParameterByName(QueryParamEnum.CHECKLIST_ITEM)) {
        const checklistObj: ChecklistRouteObjModel = {
          checklistItem: getParameterByName(QueryParamEnum.CHECKLIST_ITEM),
          processStageId: getParameterByName(QueryParamEnum.PROCESS_STAGE_ID),
          screenId: getParameterByName(QueryParamEnum.SCREEN_ID),
          processCycleCode: getParameterByName(
            QueryParamEnum.PROCESS_CYCLE_CODE,
          ),
        };
        this.sessionStorageService.setChecklistRouteObj(checklistObj);
      }
      if (
        getParameterByName('customerId') != null &&
        getParameterByName('mobile') != null
      ) {
        this.router.navigate([`/origination/otp`], {
          queryParams: { type: `${getParameterByName('screen')}` },
        });
      } else if (getParameterByName('route') == 'tracking') {
        this.router.navigate([`${getParameterByName('route')}`]);
      } else {
        sessionStorage.setItem(
          'originationId',
          JSON.stringify(getParameterByName('originationId')),
        );

        this.sessionStorageService.setProcessCycleCode(
          getParameterByName(QueryParamEnum.PROCESS_CYCLE_CODE),
        );

        this.router.navigate([
          `/origination/request-process/${getParameterByName('route')}`,
        ]);
      }
    });
    this.subscriptions.push(userProfileSubscription$);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscribe) => subscribe.unsubscribe());
  }
}
