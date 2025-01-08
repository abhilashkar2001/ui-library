import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GenericValueService } from 'app/shared/services/generic-value.service';
import { FundTransferService } from '../fund-transfer.service';
import { debounceTime } from 'rxjs/operators';
import { toWords } from 'number-to-words';
import { CustomSuccessPopupComponent } from 'app/shared/components/custom-success-popup/custom-success-popup.component';
import { AllInOnePopupComponent } from 'app/shared/components/all-in-one-popup/all-in-one-popup.component';
import { OpenAccountService } from 'app/shared/services/open-service/open-account.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { SessionStorageService } from 'app/shared/services/session-storage.service';

@Component({
  selector: 'app-multi-fund-transfer',
  templateUrl: './multi-fund-transfer.component.html',
  styleUrls: ['./multi-fund-transfer.component.scss'],
})
export class MultiFundTransferComponent implements OnInit {
  multiTransferForm!: FormGroup;
  genericValue = { TRANSFERMODE: [] };
  selectedAccounts: any[] | any;
  purpose = [
    { label: 'Salary', value: 'salary' },
    { label: 'Vendor', value: 'vendor' },
  ];
  fromAccount: any = [];
  transferMode = [];
  transferTo = [];
  benificiaryEmail = [];
  benificiaryMobile = [];
  remitter = false;
  beneficiary = false;
  beneficiaryNarration = false;
  remitterNarration = false;
  paymentDetail = false;
  custAccounts: any;
  totalAmount = 0;
  totalAmountInWords = 'Zero';
  dialogRef: MatDialogRef<CustomSuccessPopupComponent> | any;
  dialogRef1: MatDialogRef<AllInOnePopupComponent> | any;
  customerInfo: any;
  editedAmountIndex: number | any;
  debitAmount: number[] = [];
  corporateId: any;
  constructor(
    private fb: FormBuilder,
    private genericValueService: GenericValueService,
    private router: Router,
    private fundTransferService: FundTransferService,
    private dialog: MatDialog,
    private api: OpenAccountService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private sessionStorageService: SessionStorageService,
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
    this.initMultiTransferForm();
    this.fetchGenericValues();
    this.custAccounts = this.sessionStorageService.getListOfAccounts();
    this.customerInfo = this.sessionStorageService.getCustomerInfo();
    this.custAccounts.forEach((element: any) => {
      this.fromAccount.push(element.accountNo);
    });
    this.fetchBenificiary();
  }

  initMultiTransferForm() {
    this.multiTransferForm = this.fb.group({
      purposeOfPayment: ['', Validators.required],
      debitAccount: ['', Validators.required],
      debitAmount: ['', Validators.required],
      transferMode: [''],
      trransferOn: ['', Validators.required],
      remmitterEmail: [''],
      remmitterMobile: [''],
      benificiaryEmail: [''],
      benificiaryMobile: [''],
      remmitterNarration: [''],
      benificiaryNarration: [''],
      transferTo: [''],
      detail1: [''],
      detail2: [''],
      detail3: [''],
      remarks: [''],
    });
    this.multiTransferForm
      .get('debitAmount')
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe((resp) => {
        if (resp) {
          this.totalAmount = 0;
          this.convertTotalAmountToAlphabet();
          if (this.selectedAccounts && this.selectedAccounts.length > 1) {
            this.totalAmount = resp * this.selectedAccounts.length;
            this.convertTotalAmountToAlphabet();
          } else {
            this.totalAmount = resp;
            this.convertTotalAmountToAlphabet();
          }
        } else {
          this.totalAmount = 0;
          this.convertTotalAmountToAlphabet();
        }
      });
  }

  fetchGenericValues() {
    this.genericValueService
      .loadGenericValue('Common', Object.keys(this.genericValue))
      .subscribe((res: any) => {
        if (res?.statusCode === 200 && res?.data) {
          this.transferMode = res?.data?.TRANSFERMODE;
        }
      });
  }

  fetchBenificiary() {
    this.fundTransferService
      .fetchBenificiary(this.customerInfo?.customerId)
      .subscribe((resp: any) => {
        if (resp?.statusCode == 200) {
          this.transferTo = resp?.data;
        }
      });
  }

  selectMultiAcc(event: any) {
    this.selectedAccounts = event;
    this.selectedAccounts = event.map((account: any) => ({
      accountNo: account,
      amount: this.multiTransferForm.value.debitAmount,
    }));
    if (
      this.multiTransferForm.get('debitAmount')?.value &&
      this.selectedAccounts.length > 1
    ) {
      this.totalAmount =
        this.multiTransferForm.get('debitAmount')?.value *
        this.selectedAccounts.length;
      this.convertTotalAmountToAlphabet();
    } else {
      this.totalAmount = this.multiTransferForm.get('debitAmount')?.value;
      this.convertTotalAmountToAlphabet();
    }
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

  convertTotalAmountToAlphabet() {
    this.totalAmountInWords = toWords(this.totalAmount);
    this.totalAmountInWords =
      this.totalAmountInWords.charAt(0).toUpperCase() +
      this.totalAmountInWords.slice(1);
  }

  getOTP() {
    this.api.getOtp(this.customerInfo.mobileNumber).subscribe();
  }

  cancel() {
    this.router.navigate([
      'user/dashboard/fund-transfer/fund-transfer-summary',
    ]);
  }

  clear() {
    this.multiTransferForm.reset();
  }

  delete(account: any) {
    this.multiTransferForm
      .get('transferTo')
      ?.patchValue(
        this.multiTransferForm.value.transferTo.filter(
          (item: any) => item != account,
        ),
      );
    const index = this.selectedAccounts.indexOf(account);
    if (index > -1) {
      this.selectedAccounts.splice(index, 1);
    }
  }

  done(index: number) {
    this.editedAmountIndex = -1;
    const initialAmount = this.selectedAccounts[index].amount;
    const dividedAmount =
      (this.totalAmount - initialAmount) / (this.selectedAccounts.length - 1);
    this.selectedAccounts.forEach((item: any, i: any) => {
      if (i != index) item.amount = dividedAmount;
    });
  }

  // onAmountChange(event, i) {
  //   console.log(event);
  //   console.log(i);
  //   console.log(this.selectedAccounts);
  //   console.log(this.selectedAccounts[i].amount);
  //   this.selectedAccounts[i].amount = event;
  // }

  saveData(payload: any) {
    payload.forEach((value: any) => delete value.transferTo);
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

  edit(index: number) {
    this.editedAmountIndex = index;
  }

  submit() {
    if (!this.multiTransferForm.valid) return;

    const payload: any = [];
    this.selectedAccounts.forEach((element: any) => {
      const obj = { ...this.multiTransferForm.value };
      obj.creditAccount = element.accountNo;
      obj.debitAmount = element.amount;

      obj.uploadType = 'MULTI';
      payload.push(obj);
    });

    this.getOTP();
    this.dialogRef1 = this.dialog.open(AllInOnePopupComponent, {
      data: { remark: true, mobile: this.customerInfo.mobileNumber },
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
}
