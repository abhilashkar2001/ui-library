import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { QueryParamEnum } from 'app/enum/query-param.enum';
import { ChecklistRouteObjModel } from 'app/shared/models/checklist-model';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { SessionService } from 'app/shared/session.service';
import { UserProfileInfoAction } from 'app/shared/store/action/user-profileInfo.action';
import { User } from 'app/shared/store/models/user.model';
import { selectUser } from 'app/shared/store/selector/user-profileInfo.selector';
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
        /* get profile info */
        this.store.dispatch(UserProfileInfoAction.loadUserProfile());
        this.getProfile();
      });
  }

  /**
   * @method getProfile()
   */
  getProfile() {
    const userProfileSubscription$ = this.userProfile$.subscribe(async () => {
      this.sessionStorageService.setCustomerId(
        <string>this.getParameterByName('customerId'),
      );
      this.sessionStorageService.setMobile(
        <string>this.getParameterByName('mobile'),
      );
      this.sessionStorageService.setReferanceNumber(
        <string>this.getParameterByName('referanceNumber'),
      );
      this.sessionStorageService.setType(
        JSON.stringify(this.getParameterByName('type')),
      );
      this.sessionStorageService.setScreenId(
        <string>this.getParameterByName(QueryParamEnum.SCREEN_ID),
      );
      if (this.getParameterByName(QueryParamEnum.CHECKLIST_ITEM)) {
        const checklistObj: ChecklistRouteObjModel = {
          checklistItem: this.getParameterByName(QueryParamEnum.CHECKLIST_ITEM),
          processStageId: this.getParameterByName(
            QueryParamEnum.PROCESS_STAGE_ID,
          ),
          screenId: this.getParameterByName(QueryParamEnum.SCREEN_ID),
          processCycleCode: this.getParameterByName(
            QueryParamEnum.PROCESS_CYCLE_CODE,
          ),
        };
        this.sessionStorageService.setChecklistRouteObj(checklistObj);
      }
      if (
        this.getParameterByName('customerId') != null &&
        this.getParameterByName('mobile') != null
      ) {
        this.router.navigate([`/origination/otp`], {
          queryParams: { type: `${this.getParameterByName('screen')}` },
        });
      } else if (this.getParameterByName('route') == 'tracking') {
        this.router.navigate([`${this.getParameterByName('route')}`]);
      } else {
        sessionStorage.setItem(
          'originationId',
          JSON.stringify(this.getParameterByName('originationId')),
        );

        this.sessionStorageService.setProcessCycleCode(
          this.getParameterByName(QueryParamEnum.PROCESS_CYCLE_CODE),
        );

        this.router.navigate([
          `/origination/${this.getParameterByName('route')}`,
        ]);
      }
    });
    this.subscriptions.push(userProfileSubscription$);
  }

  getParameterByName(name: any, url = window.location.href) {
    name = name.replace(/[[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscribe) => subscribe.unsubscribe());
  }
}
