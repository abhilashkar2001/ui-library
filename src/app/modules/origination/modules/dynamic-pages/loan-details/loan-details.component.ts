import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { GenericValueService } from 'app/shared/services/generic-value.service';

@Component({
  selector: 'app-loan-details',
  templateUrl: './loan-details.component.html',
  styleUrls: ['./loan-details.component.scss'],
})
export class LoanDetailsComponent implements OnInit {
  loanDetailsForm: FormGroup | undefined;
  currentDate = new Date();
  staticData = {
    DISBURSEMENTTYPE: [],
    REPAYMENTFREQUENCY: [],
    ACCOUNT: [],
    ACCOUNTTYPE: [],
  };
  genericValue: any | undefined;

  constructor(
    private fb: FormBuilder,
    private genericValueService: GenericValueService,
    private matIconRegiostry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
  ) {
    this.currentDate.setDate(new Date().getDate() + 1);
    this.matIconRegiostry.addSvgIcon(
      `calendar`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'assets/images/calendar.svg',
      ),
    );
  }

  ngOnInit(): void {
    this.buildDetailsForm();
    this.fetchGenericValues();
  }

  buildDetailsForm(data?: any) {
    this.loanDetailsForm = this.fb.group({
      loanAmount: [data?.loanAmount ?? ''],
      interestRate: [data?.interestRate ?? ''],
      tenureYear: [data?.tenureYear ?? ''],
      tenureMonth: [data?.tenureMonth ?? ''],
      tenureDays: [data?.tenureDays ?? ''],
      repaymentFrequencyId: [data?.repaymentFrequencyId ?? ''],
      emiAmount: [data?.emiAmount ?? ''],
      emiInterestPayable: [data?.emiInterestPayable ?? ''],
      totalInterestAmount: [data?.totalInterestAmount ?? ''],
      totalPayableAmount: [data?.totalPayableAmount ?? ''],
      emiStartDate: [data?.emiStartDate ?? ''],
      disbursementTypeId: [data?.disbursementTypeId ?? ''],
      disbursementType: [data?.disbursementType ?? ''],
      account: [data?.account ?? ''],
      bankName: [data?.bankName ?? ''],
      accountNumber: [data?.accountNumber ?? ''],
      accountTypeId: [data?.accountTypeId ?? ''],
      accountType: [data?.accountType ?? ''],
      accountHolderName: [data?.accountName ?? ''],
      branchName: [data?.branchName ?? ''],
      chequeNumber: [data?.chequeNumber ?? ''],
      bankCode: [data?.bankCode ?? ''],
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
      const disbursement = this.genericValue?.DISBURSEMENTTYPE?.find(
        (value: { id: number; values: string }) => {
          value?.id === event;
        },
      )?.values;
      this.loanDetailsForm?.get('disbursementType')?.setValue(disbursement);
    }
  }
}
