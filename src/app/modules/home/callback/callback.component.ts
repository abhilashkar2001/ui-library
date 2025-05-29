import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { QueryParamEnum } from 'app/enum/query-param.enum';
import { ChecklistRouteObjModel } from 'app/shared/models/checklist-model';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import {getParameterByName, TokenStorageService, UserProfileAction} from '@onerumango/utils';
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
    private router: Router,
    private sessionStorageService: SessionStorageService,
    private store: Store,
    private tokenStorageService: TokenStorageService
  ) {
    this.userProfile$ = this.store.select(selectUser);
  }

  ngOnInit() {
    sessionStorage.clear();
    localStorage.clear();
    const code = getParameterByName('code');
    if (code) {
      this.tokenStorageService.saveToken(code)
      this.store.dispatch(UserProfileAction.loadUserProfile());
    }
    this.getProfile();
  }

  /**
   * @method getProfile()
   */
  getProfile() {
    const userProfileSubscription$ = this.userProfile$.subscribe(async () => {
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
      this.sessionStorageService.setType(
          getParameterByName('type'),
      );
      this.sessionStorageService.setOriginationId(
          Number(getParameterByName(QueryParamEnum.ORIGINATION_ID)),
      );
      this.sessionStorageService.setProcessCycleCode(
          getParameterByName(QueryParamEnum.PROCESS_CYCLE_CODE),
      );
      this.router.navigate([
        `/origination/request-processing/${getParameterByName('route')}`,
      ]);
    });
    this.subscriptions.push(userProfileSubscription$);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscribe) => subscribe.unsubscribe());
  }
}
