import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GenericValueInfoModel } from 'app/shared/models/generic-value.model';
import { GenericValueService } from 'app/shared/services/generic-value.service';

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
  };
  accountValue = [
    { label: 'Internal', value: true },
    { label: 'External', value: false },
  ];
  internalAccount = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];

  constructor(
    private fb: FormBuilder,
    private genericValueService: GenericValueService,
  ) {
    this.currentDate?.setDate(new Date().getDate() + 1);
  }

  ngOnInit(): void {
    this.buildDisbursementForm();
    this.fetchGenericValues();
  }

  buildDisbursementForm(data?: any) {
    this.disbursementForm = this.fb.group({
      disbursementTypeId: [
        data?.loanDisbursementModel?.disbursementTypeId?.data
          ?.disbursementTypeId ?? '',
        Validators.required,
      ],
      disbursementTypeValue: [
        data?.loanDisbursementModel?.disbursementModeValue?.data
          ?.disbursementTypeValue ?? 'Cash',
      ],
      internal: [data?.internal ?? false],
      internalAccount: [true],
      loanAmount: [data?.principalAmount ?? ''],
      firstDisbursementDate: [
        data?.loanDisbursementModel?.firstDisbursementDate ?? this.currentDate,
      ],
      chequeNumber: [
        data?.loanDisbursementModel?.chequeNumber ?? data?.chequeNumber ?? '',
      ],
      requiredMultipleDisbursement: false,
      scheduleFrequencyYear: 0,
      scheduleFrequencyMonth: 1,
      scheduleFrequencyDay: 0,
      disbursementAccount: this.fb.group({
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
    console.log(event);
    if (event) {
      const disbursement = this.genericValue?.['DISBURSEMENTTYPE']?.find(
        (value: { id: number; values: string }) => value?.id === event,
      )?.values;
      this.disbursementForm
        ?.get('disbursementTypeValue')
        ?.setValue(disbursement);
    }
  }
}
