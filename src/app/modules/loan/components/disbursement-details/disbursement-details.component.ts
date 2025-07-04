import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GenericValueInfoModel } from 'app/shared/models/generic-value.model';
import { GenericValueService } from 'app/shared/services/generic-value.service';
import { SidenavService } from 'app/shared/services/sidenav.service';
import { BankCodePanelComponent } from 'app/shared/components/bank-code-panel/bank-code-panel.component';
import { LoanService } from 'app/shared/services/loan/loan.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { catchError, map, of, tap } from 'rxjs';

@Component({
  selector: 'app-disbursement-details',
  templateUrl: './disbursement-details.component.html',
  styleUrls: ['./disbursement-details.component.scss'],
})
export class DisbursementDetailsComponent implements OnInit {
  disbursementForm: FormGroup | undefined;
  currentDate: Date | undefined;
  genericValue: GenericValueInfoModel | undefined;
  staticData = {
    DISBURSEMENTTYPE: [],
    ACCOUNTTYPE: [],
    CHEQUETYPE: [],
  };
  accountValue = [
    { label: 'Internal', value: true },
    { label: 'External', value: false },
  ];
  internalAccount = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];
  chequeValiadtors = ['chequeTypeId', 'customerName', 'branchCode'];
  accountValidators = ['accountTypeId'];
  originationId: number | undefined;

  constructor(
    private fb: FormBuilder,
    private genericValueService: GenericValueService,
    public sidenavService: SidenavService,
    private loanService: LoanService,
    private sessionStorageService: SessionStorageService,
  ) {
    this.currentDate?.setDate(new Date().getDate() + 1);
  }

  get loanDisbursementAccount() {
    return this.disbursementForm?.get('disbursementAccount') as FormGroup;
  }

  ngOnInit(): void {
    this.originationId = this.sessionStorageService.getOriginationId();
    this.buildDisbursementForm();
    this.fetchGenericValues();
  }

  buildDisbursementForm(data?: any) {
    this.disbursementForm = this.fb.group({
      originationId: this.originationId,
      disbursementTypeId: [
        data?.loanDisbursementModel?.disbursementTypeId?.data
          ?.disbursementTypeId ?? '',
        Validators.required,
      ],
      disbursementTypeValue: [
        data?.loanDisbursementModel?.disbursementModeValue?.data
          ?.disbursementTypeValue ?? 'Cash',
      ],
      loanAmount: [data?.principalAmount ?? ''],
      firstDisbursementDate: [
        data?.loanDisbursementModel?.firstDisbursementDate ?? this.currentDate,
      ],
      chequeTypeId: [data?.chequeTypeId ?? ''],
      branchCode: [data?.branchCode ?? ''],
      internal: [data?.internal ?? false],
      disbursementAccount: this.fb.group({
        internalAccount: [true],
        accountNo: [
          data?.loanDisbursementModel?.disbursementAccount?.accountNo ?? '',
        ],
        confirmAccountNo: [
          data?.loanDisbursementModel?.disbursementAccount?.confirmAccountNo ??
            '',
        ],
        accountTypeId: [
          data?.loanDisbursementModel?.disbursementAccount?.accountTypeId ??
            null,
        ],
        customerName: [
          data?.loanDisbursementModel?.disbursementAccount?.customerName ?? '',
        ],
        bankCode: [
          data?.loanDisbursementModel?.disbursementAccount?.bankCode ?? '',
        ],
        branchName: [
          data?.loanDisbursementModel?.disbursementAccount?.branchName ?? '',
        ],
        newAccount: [false],
      }),
    });
  }

  fetchGenericValues() {
    this.genericValueService
      .loadGenericValue(Object.keys(this.staticData))
      .subscribe((resp: any) => {
        if (resp?.statusCode === 200) {
          this.genericValue = resp?.data;
        }
      });
  }

  setDisbursement(event: number) {
    if (event) {
      const disbursement = this.genericValue?.['DISBURSEMENTTYPE']?.find(
        (value: { id: number; values: string }) => value?.id === event,
      )?.values;
      this.disbursementForm
        ?.get('disbursementTypeValue')
        ?.setValue(disbursement);
      if (disbursement?.includes('Cheque')) {
        this.chequeValiadtors.forEach((field) => {
          this.disbursementForm
            ?.get(field)
            ?.setValidators([Validators.required]);
          this.disbursementForm?.get(field)?.updateValueAndValidity();
        });
        this.accountValidators.forEach((field) => {
          this.disbursementForm?.get(field)?.clearValidators();
          this.disbursementForm?.get(field)?.updateValueAndValidity();
        });
      }
    }
  }

  searchBankCode() {
    const contextData = {
      component: BankCodePanelComponent,
      data: 2,
    };
    this.sidenavService;
    console.log(contextData);
    this.sidenavService.open(contextData);
  }

  fetchDisbursementDetails() {
    if (this.originationId)
      this.loanService
        .fetchDisbursementDetails(this.originationId)
        .subscribe((res: any) => console.log(res));
  }

  saveDisbursementDetails() {
    const payload = { ...this.disbursementForm?.value };
    this.loanService.saveDisbursementDetails(payload).subscribe((res: any) => {
      console.log(res);
    });
  }

  handleSubmit() {
    const payload = { ...this.disbursementForm?.value };
    payload.originationModel.originationId = 554;
    delete payload.loanDetails.totalPrincipalAmount;
    payload.screenCode = 444;
    return this.loanService.saveDisbursementDetails(payload).pipe(
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
}
