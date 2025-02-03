import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FundTransferService } from '../fund-transfer.service';
import { Router } from '@angular/router';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { CustomSuccessPopupComponent } from 'app/shared/components/custom-success-popup/custom-success-popup.component';
import { OpenAccountService } from 'app/shared/services/open-service/open-account.service';
import { AllInOnePopupComponent } from 'app/shared/components/all-in-one-popup/all-in-one-popup.component';
import {
  AppState,
  selectUser,
  TokenStorageService,
  User,
} from '@onerumango/utils';
import { TranslateService } from '@ngx-translate/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { GenericValueService } from 'app/shared/services/generic-value.service';

@Component({
  selector: 'app-single-fund-transfer',
  templateUrl: './single-fund-transfer.component.html',
  styleUrls: ['./single-fund-transfer.component.scss'],
})
export class SingleFundTransferComponent implements OnInit, OnDestroy {
  fundTransferForm!: FormGroup;
  purpose = ['Salary', 'Vendor'];
  fromAccount: any = [];
  transferMode = [];
  transferTo: any = [];
  remitter = false;
  beneficiary = false;
  beneficiaryNarration = false;
  remitterNarration = false;
  paymentDetail = false;
  custAccounts: any;
  dialogRef: MatDialogRef<CustomSuccessPopupComponent> | any;
  dialogRef1: MatDialogRef<AllInOnePopupComponent> | any;
  customerInfo: any;
  beneficiaryName: any;
  corporateId: any;
  currentUser: User | undefined;
  subscription: Subscription[] = [];
  genericValue: any = { TRANSFERMODE: [] };

  constructor(
    private fb: FormBuilder,
    private fundTransferService: FundTransferService,
    private genericValueService: GenericValueService,
    private router: Router,
    private dialog: MatDialog,
    private api: OpenAccountService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private tokenStorageService: TokenStorageService,
    public translate: TranslateService,
    private sessionStorageService: SessionStorageService,
    private store: Store<AppState>,
  ) {
    this.matIconRegistry.addSvgIcon(
      `single-trans-icon`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'assets/images/single-trans.svg',
      ),
    );
  }

  ngOnInit(): void {
    this.corporateId = this.sessionStorageService.getCorporateId();
    this.buildForm();
    this.customerInfo = this.sessionStorageService.getCustomerInfo();
    this.custAccounts = this.sessionStorageService.getListOfAccounts();
    this.custAccounts.forEach((element: any) => {
      this.fromAccount.push(element.accountNo);
    });
    this.fetchBenificiary();
    this.fetchGeneric();
    setTimeout(() => {
      const lang = this.tokenStorageService.getLanguage() ?? 'en';
      this.translate.use(lang);
    }, 300);
    this.loadUserProfile();
  }

  loadUserProfile() {
    const loadUserProfileSub = this.store
      .select(selectUser)
      .subscribe((result) => {
        if (result) {
          this.currentUser = result;
        }
      });
    this.subscription.push(loadUserProfileSub);
  }

  buildForm() {
    this.fundTransferForm = this.fb.group({
      purposeOfPayment: ['', Validators.required],
      debitAccount: ['', Validators.required],
      debitAmount: ['', Validators.required],
      transferMode: [''],
      creditAccount: ['', Validators.required],
      trransferOn: ['', Validators.required],
      remmitterEmail: [''],
      remmitterMobile: [''],
      benificiaryEmail: [''],
      benificiaryMobile: [''],
      remmitterNarration: [''],
      benificiaryNarration: [''],
      detail1: [''],
      detail2: [''],
      detail3: [''],
      remarks: [''],
    });
  }

  fetchBenificiary() {
    this.fundTransferService
      .fetchBenificiary(this.customerInfo?.customerId)
      .subscribe((resp: any) => {
        if (resp?.statusCode == 200) {
          const list = resp?.data;
          this.transferTo = list?.filter(
            (item: any) => item?.name && item?.accountNo,
          );
        }
      });
  }

  fetchGeneric() {
    this.genericValueService
      .loadGenericValue(Object.keys(this.genericValue))
      .subscribe((resp: any) => {
        this.transferMode = resp?.data?.TRANSFERMODE;
      });
  }

  onCheckBox(checkbox: string, event: MatCheckboxChange) {
    if (event.checked) {
      if (checkbox === 'Remitter') this.remitter = true;
      else if (checkbox === 'Beneficiary') this.beneficiary = true;
      else if (checkbox === 'RemitterNarration') this.remitterNarration = true;
      else if (checkbox === 'BeneficiaryNarration')
        this.beneficiaryNarration = true;
      else if (checkbox === 'paymentDetail') this.paymentDetail = true;
    } else {
      if (checkbox === 'Remitter') this.remitter = false;
      else if (checkbox === 'Beneficiary') this.beneficiary = false;
      else if (checkbox === 'RemitterNarration') this.remitterNarration = false;
      else if (checkbox === 'BeneficiaryNarration')
        this.beneficiaryNarration = false;
      else if (checkbox === 'paymentDetail') this.paymentDetail = false;
    }
  }

  changeInToAccount(event: any) {
    if (event) {
      this.beneficiaryName = this.transferTo.find(
        (e: any) => e.accountNo == event,
      )?.name;
    }
  }

  goToBeneificiary() {
    this.router.navigate(['user/trade/beneficiary/add-edit-beneficiary']);
  }

  cancel() {
    this.router.navigate([
      'user/dashboard/fund-transfer/fund-transfer-summary',
    ]);
  }

  clear() {
    this.fundTransferForm.reset();
  }

  getOTP() {
    this.api.getOtp(this.customerInfo.mobileNumber).subscribe();
  }

  saveData(payload: any) {
    this.fundTransferService
      .saveFundTransferData(payload)
      .subscribe((resp: any) => {
        if (resp?.statusCode == 200) {
          this.dialogRef = this.dialog.open(CustomSuccessPopupComponent, {
            data: {
              msg: 'Transaction Successful',
              status: true,
              reffNo: resp?.data,
            },
            width: '40%',
            disableClose: true,
            panelClass: 'popup-class',
            backdropClass: 'bdrop',
          });
          this.dialogRef.afterClosed().subscribe((result: any) => {
            console.log(result);
            if (result == 'Done') {
              this.cancel();
            }
          });
        }
      });
  }

  submit() {
    if (!this.fundTransferForm.valid) return;
    const payload: any = [];
    const obj = this.fundTransferForm.value;
    obj.uploadType = 'SINGLE';
    obj.beneficiaryName = this.beneficiaryName;
    payload.push(obj);

    this.getOTP();
    this.dialogRef1 = this.dialog.open(AllInOnePopupComponent, {
      data: {
        remark: true,
        mobile: this.currentUser?.mobile,
      },
      width: '50%',
      height: '33%',
      disableClose: true,
      panelClass: 'popup-dialog-class',
      backdropClass: 'bdrop',
    });
    this.dialogRef1.afterClosed().subscribe((result: any) => {
      if (result == 'verified') {
        this.saveData(payload);
      } else {
        this.dialogRef = this.dialog.open(CustomSuccessPopupComponent, {
          data: { msg: 'Transaction failed', status: false },
          width: '40%',
          disableClose: true,
          panelClass: 'popup-class',
          backdropClass: 'bdrop',
        });
        this.dialogRef.afterClosed().subscribe((result: any) => {
          if (result == 'Failed') {
            this.dialogRef.close();
          }
        });
      }
    });
  }

  ngOnDestroy() {
    this.subscription.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }
}
