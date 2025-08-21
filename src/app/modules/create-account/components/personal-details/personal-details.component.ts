//@ts-ignore
import { Component, Input, OnInit } from '@angular/core';
//@ts-ignore
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//@ts-ignore
import { GenericValueInfoModel } from 'app/shared/models/generic-value.model';
import { GenericValueService } from 'app/shared/services/generic-value.service';
import { SidenavService } from 'app/shared/services/sidenav.service';
//@ts-ignore
import { BankCodePanelComponent } from 'app/shared/components/bank-code-panel/bank-code-panel.component';
import { LoanService } from 'app/shared/services/loan/loan.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
//@ts-ignore
import { catchError, map, of, tap } from 'rxjs';
import { OpenAccountService } from 'app/shared/services/open-service/open-account.service';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss'],
})
export class AccountPersonalDetailsComponent implements OnInit {
  // disbursementForm: FormGroup | undefined;
  // currentDate: Date | undefined;
  // genericValue: GenericValueInfoModel | undefined;
  // @Input() screenCode = '';
  // staticData = {
  //   DISBURSEMENTTYPE: [],
  //   ACCOUNTTYPE: [],
  //   CHEQUETYPE: [],
  // };
  // accountValue = [
  //   { label: 'Internal', value: true },
  //   { label: 'External', value: false },
  // ];
  // internalAccount = [
  //   { label: 'Yes', value: true },
  //   { label: 'No', value: false },
  // ];
  // chequeValiadtors = ['chequeTypeId', 'customerName', 'branchCode'];
  // accountValidators = ['accountTypeId'];
  // originationId: number | undefined;

  detailsForGeneric: any = {
    accountType: '',
  };
  noOfapplicantguardian: any = 3;
  accordionItems: any = [];
  personalDetailsForm!: FormGroup;

  constructor(
    //@ts-ignore
    private fb: FormBuilder,
    //@ts-ignore
    private genericValueService: GenericValueService,
    public sidenavService: SidenavService,
    //@ts-ignore
    private loanService: LoanService,
    //@ts-ignore
    private sessionStorageService: SessionStorageService,
    private accountService: OpenAccountService,
  ) {
    // this.currentDate?.setDate(new Date().getDate() + 1);
  }

  // get loanDisbursementAccount() {
  //   return this.disbursementForm?.get('disbursementAccount') as FormGroup;
  // }

  ngOnInit(): void {
    // this.originationId = this.sessionStorageService.getOriginationId();
    // this.buildDisbursementForm();
    // this.fetchGenericValues();
    // this.fetchDisbursementDetails();
    let acc = localStorage.getItem('account-type');
    this.detailsForGeneric.accountType = acc !== null ? acc : 'individual';
    this.createAccordian();
  }

  // createAccordian() {
  //   if (this.detailsForGeneric.accountType == 'minor') {
  //     this.accordionItems.push({ header: 'Minor Details', expanded: true, showIsPrimary: false, accountType: this.detailsForGeneric.accountType });
  //   }
  //   for (let i = 0; i < this.noOfapplicantguardian; i++) {
  //     if (this.detailsForGeneric.accountType == 'joint') {
  //       this.accordionItems.push({ header: 'Applicant ' + (i + 1), expanded: false, showIsPrimary: true, accountType: this.detailsForGeneric.accountType });
  //     } else if (this.detailsForGeneric.accountType == 'minor') {
  //       this.accordionItems.push({ header: 'Guardians ' + (i + 1), expanded: false, showIsPrimary: true, accountType: this.detailsForGeneric.accountType });
  //     } else if(this.detailsForGeneric.accountType == 'corporate'){
  //        this.accordionItems.push({ header: 'Managing Director ' + (i + 1), expanded: false, showIsPrimary: true, accountType: this.detailsForGeneric.accountType });
  //     }
  //   }
  // }

  createAccordian(): void {
    const { accountType } = this.detailsForGeneric;
    // Reset accordion items
    this.accordionItems = [];
    // Titles for corporate applicants
    const corporateTitles = [
      'Managing Director',
      'Vice President',
      'CEO',
      'CFO',
      'CTO',
    ];
    // Add Minor Details section if account type is 'minor'
    if (accountType === 'minor') {
      this.accordionItems.push({
        header: 'Minor Details',
        expanded: true,
        showIsPrimary: false,
        accountType,
      });
    }
    // Generate header label based on account type and index
    const getHeaderLabel = (index: number): string => {
      if (accountType === 'corporate') {
        return corporateTitles[index] || `Corporate Member ${index + 1}`;
      }
      const labels: any = {
        joint: 'Applicant',
        minor: 'Guardians',
      };
      return `${labels[accountType] || 'Applicant'} ${index + 1}`;
    };
    // Create accordion items
    for (let i = 0; i < this.noOfapplicantguardian; i++) {
      this.accordionItems.push({
        header: getHeaderLabel(i),
        expanded: false,
        showIsPrimary: true,
        accountType,
      });
    }
  }

  deleteAccordian(index: any) {
    if (this.accordionItems.length > 1) {
      if (index > -1) {
        this.accordionItems.splice(index, 1);
      }
    }
  }

  // buildDisbursementForm(data?: any) {
  //   this.disbursementForm = this.fb.group({
  //     originationId: this.originationId,
  //     disbursementTypeId: [data?.disbursementTypeId ?? '', Validators.required],
  //     disbursementTypeValue: [data?.disbursementTypeValue ?? 'Cash'],
  //     loanAmount: [data?.principalAmount ?? '5678'],
  //     firstDisbursementDate: [data?.firstDisbursementDate ?? this.currentDate],
  //     chequeTypeId: [data?.chequeTypeId ?? ''],
  //     branchCode: [data?.branchCode ?? ''],
  //     internal: [data?.internal ?? false],
  //     customerName: [''],
  //     internalAccount: [true],
  //     createAccountWithUs: [false],
  //     disbursementAccount: this.fb.group({
  //       accountNo: [data?.disbursementAccount?.accountNo ?? ''],
  //       confirmAccountNo: [data?.disbursementAccount?.accountNo ?? ''],
  //       accountTypeId: [data?.disbursementAccount?.accountTypeId ?? null],
  //       customerName: [data?.disbursementAccount?.customerName ?? ''],
  //       bankCode: [data?.disbursementAccount?.bankCode ?? ''],
  //       branchName: [data?.disbursementAccount?.branchName ?? ''],
  //     }),
  //   });
  // }

  // fetchGenericValues() {
  //   this.genericValueService
  //     .loadGenericValue(Object.keys(this.staticData))
  //     .subscribe((resp: any) => {
  //       if (resp?.statusCode === 200) {
  //         this.genericValue = resp?.data;
  //       }
  //     });
  // }

  // setDisbursement(event: number) {
  //   if (event) {
  //     const disbursement = this.genericValue?.['DISBURSEMENTTYPE']?.find(
  //       (value: { id: number; values: string }) => value?.id === event,
  //     )?.values;
  //     this.disbursementForm
  //       ?.get('disbursementTypeValue')
  //       ?.setValue(disbursement);
  //     if (disbursement?.includes('Cheque')) {
  //       this.chequeValiadtors.forEach((field) => {
  //         this.disbursementForm
  //           ?.get(field)
  //           ?.setValidators([Validators.required]);
  //         this.disbursementForm?.get(field)?.updateValueAndValidity();
  //       });
  //       this.accountValidators.forEach((field) => {
  //         this.disbursementForm?.get(field)?.clearValidators();
  //         this.disbursementForm?.get(field)?.updateValueAndValidity();
  //       });
  //     }
  //   }
  // }

  // searchBankCode() {
  //   const contextData = {
  //     component: BankCodePanelComponent,
  //     data: 2,
  //   };
  //   this.sidenavService;
  //   console.log(contextData);
  //   this.sidenavService.open(contextData);
  // }

  // fetchDisbursementDetails() {
  //   this.loanService.fetchDisbursementDetails(962).subscribe((res: any) => {
  //     if (res?.statusCode === 200 || res?.statusCode === 201)
  //       this.buildDisbursementForm(res?.data[0]);
  //   });
  // }

  handleSubmit() {
    let payload = { ...this.personalDetailsForm.value };
    payload.customerInfo.contact.address.city = {
      cityId: payload.customerInfo.contact.address.city,
    };
    payload.customerInfo.contact.address = [].concat(
      payload.customerInfo.contact.address,
    );

    console.log('PAYLOAD==> ', payload);

    // payload.originationId = this.originationId;
    // payload.screenCode = this.screenCode;
    // delete payload.disbursementAccount.confirmAccountNo;
    return this.accountService.saveAccountDetails(payload).pipe(
      tap((res) => {
        console.log(res);
      }),
      map((res: any) =>
        res?.statusCode == 200 || res?.statusCode == 201
          ? ('success' as const)
          : ('failure' as const),
      ),
      catchError((_err) => {
        console.error(_err);
        return of('failure' as const);
      }),
    );
  }

  submitForm() {
    return this.handleSubmit().toPromise();
  }
  getForm(form: any) {
    this.personalDetailsForm = form;
  }
}
