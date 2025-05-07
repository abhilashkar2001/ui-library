import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { LoanService } from 'app/shared/services/loan/loan.service';
import { OpenAccountService } from 'app/shared/services/open-service/open-account.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { AppState, selectLocaleData } from '@onerumango/utils';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { LoanSummaryStore } from './loan-summary.store';

@Component({
  selector: 'app-loan-summary',
  templateUrl: './loan-summary.component.html',
  styleUrls: ['./loan-summary.component.scss'],
})
export class LoanSummaryComponent implements OnInit, OnChanges, OnDestroy {
  @Output() backEvent: EventEmitter<any> = new EventEmitter();
  @Output() CustomSubmit: EventEmitter<any> = new EventEmitter();
  @Input() updateParentModel: ((value: Partial<any>) => void) | any;
  @Input() loanSummary: any;
  @Input() mobileVerifyInfo: any;
  loansummaryDetails = LoanSummaryStore.LOANSUMMARY;
  personalDetailsArr = LoanSummaryStore.PersonalDetailsStore;
  businessDetailsArr = LoanSummaryStore.BusinessDetailsStore;
  collateralDetailsArr = LoanSummaryStore.CollateralDetailsStore;
  loanSummaryDetails: any;
  stepperTitle: string | undefined;
  otherUserInfo: any;
  personalDetails: any;
  checkListDoc: any[] = [];
  subscriptions: Subscription[] = [];
  documentDetails: any;
  originationId: number | null | undefined;

  constructor(
    private loanService: LoanService,
    private openAccountService: OpenAccountService,
    private sessionStorageService: SessionStorageService,
    private store: Store<AppState>,
  ) {}

  ngOnInit(): void {
    this.originationId = this.sessionStorageService.getOriginationId();
    const otherUserInfo$ = this.store
      .select(selectLocaleData)
      .subscribe((userInfo) => {
        if (userInfo) {
          this.otherUserInfo = userInfo;
          this.fetchChecklist();
          this.getLoanSummary().then(() => {
            this.getOriginationMasterData();
          });
        }
      });
    this.subscriptions.push(otherUserInfo$);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loanSummaryDetails = changes['loanSummary']?.currentValue;
  }

  getLoanSummary() {
    return new Promise((resolve) => {
      this.loanService
        .getLoanSummary(this.originationId)
        .subscribe((response: any) => {
          this.loanSummaryDetails = response?.data;
          this.documentDetails = response?.data?.customerInfo[0]?.documentInfo;
          this.getCollateralDetails(this.loanSummaryDetails);
          resolve('');
        });
    });
  }

  // Fetch Checklist info
  fetchChecklist() {
    if (this.originationId)
      this.loanService
        .fetchCheckListSummary(this.originationId)
        .subscribe((res) => {
          if (res.data.length > 0) {
            this.checkListDoc = res.data
              .filter((item: any) => item?.docInfoModel)
              .filter(
                (item: any) =>
                  !item.document?.toLowerCase().includes('national'),
              );
            console.log(this.checkListDoc);
          }
        });
  }

  getCollateralDetails(details: any) {
    const collateralDetails = details?.collateralInfo?.collateralDetails || [];
    const credit = collateralDetails[0] || {};
    const vaf = collateralDetails[1] || {};
    details.collateralInfo = {
      ...details.collateralInfo,
      collateralDescriptionForCredit: credit.description,
      ownershipForCredit: credit.ownership,
      assetMonetaryWorthForCredit: credit.assetMonetaryWorth,
      collateralDescriptionForVaf: vaf.description,
      ownershipForVaf: vaf.ownership,
      assetMonetaryWorthForVaf: vaf.assetMonetaryWorth,
    };
  }

  getOriginationMasterData() {
    const originationId = this.sessionStorageService.getOriginationId();
    this.loanService
      .getOriginationMaster(originationId)
      .subscribe((resp: any) => {
        if (resp?.statusCode == 200 && resp?.data) {
          this.personalDetails = resp?.data?.[0]?.customerInfo;
        }
      });
  }

  onVerify() {
    this.updateParentModel({ updateMasterSave: false });
    this.CustomSubmit.emit();
    this.openAccountService.setData(this.loanSummaryDetails);
  }

  onBack() {
    this.backEvent.emit();
  }

  checkDisbursementType() {
    return !!(
      this.loanSummaryDetails?.disbursementDetails?.disbursementTypeValue !=
        null &&
      this.loanSummaryDetails?.disbursementDetails?.disbursementTypeValue
        ?.toLowerCase()
        ?.includes('account')
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
