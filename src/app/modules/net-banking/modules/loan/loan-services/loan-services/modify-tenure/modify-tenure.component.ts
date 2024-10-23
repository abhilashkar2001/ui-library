import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoanInstallmentModel } from 'app/shared/models/loan-installment.model';
import { LoanTopUpStore } from '../topup-loan/topup-loan.store';
import { GenericValueService } from 'app/shared/services/generic-value.service';
import { IcHttpResponseModel } from 'app/shared/models/ic-http-response.model';
import { LoanService } from 'app/shared/services/net-loan-service/loan.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-modify-tenure',
  templateUrl: './modify-tenure.component.html',
  styleUrls: ['./modify-tenure.component.scss']
})
export class ModifyTenureComponent implements OnInit {
  modifyTenureForm!: FormGroup;
  minTenure: number = 7;
  maxTenureInYears: number = 10;
  maxTenure: number = 3650;
  chartSectionDetails = LoanTopUpStore.ChartDetails;
  accountDetails = LoanTopUpStore.loanAccountDetails;
  // loanDetails: any;
  customerId: number;
  installmentDetails: LoanInstallmentModel;
  genericValue = { REASON: [] };
  calculatedData: any;
  // Need to remove the static data
  loanDetails = [
    {
      cbsAccountNumber: '300200003035',
      additionalValue: 'Value 1'
    },
    {
      cbsAccountNumber: '300200007504',
      additionalValue: 'Value 2'
    }
  ];
  chartData: any;

  constructor(private fb: FormBuilder, private genericValueService: GenericValueService, private loanService: LoanService) { }

  ngOnInit(): void {
    this.buildModifyTenure();
    this.fetchGenericValues()
  }


  //building the form
  buildModifyTenure() {
    this.modifyTenureForm = this.fb.group({
      debitAccount: [""],
      debitCurrency: [""],
      tenureYear: [""],
      tenureMonth: [""],
      tenureDay: [""],
      reason: [""],
      remarks: [""],
      tenure: [""],
      acceptTermsConditions: [""],
      transferType: "Modify Tenure",
      source: "I",
      customerId: this.customerId,
    });
    this.modifyTenureForm.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe(() => {
        if (this.modifyTenureForm.valid) this.calculateTenure();
      });
  }


  //fetch generic values
  fetchGenericValues() {
    this.genericValueService
      .loadGenericValue("Common", Object.keys(this.genericValue))
      .subscribe((res: any) => {
        if (res?.statusCode === 200 && res?.data) {
          Object.keys(res?.data).forEach(
            (k) => (this.genericValue[k] = res.data[k])
          );
        }
      });
  }


  //fetch installment details
  fetchLoanInstallment() {
    this.loanService
      .fetchLoanInstallment(this.modifyTenureForm?.value?.debitAccount)
      .subscribe((res: IcHttpResponseModel<LoanInstallmentModel>) => {
        if (res?.statusCode == 200 && res?.data) {
          this.installmentDetails = res?.data;
        }
      });
  }



  //when the input values changes, slider value changes
  onTenureChange() {
    let year = this.modifyTenureForm.value.tenureYear;
    let month = this.modifyTenureForm.value.tenureMonth;
    let day = this.modifyTenureForm.value.tenureDay;
    const totalDays = year * 365 + month * 30 + day * 1;
    this.modifyTenureForm.get("tenure").setValue(totalDays);
  }

  //on the slider change, the input values should change
  onSliderChangeForTenure(e) {
    let maxTenure = e.value;
    let years = Math.floor(maxTenure / 365);
    let remainingDays = maxTenure % 365;
    let months = Math.floor(remainingDays / 30);
    remainingDays = remainingDays % 30;
    this.modifyTenureForm.get("tenureYear").setValue(years);
    this.modifyTenureForm.get("tenureMonth").setValue(months);
    this.modifyTenureForm.get("tenureDay").setValue(remainingDays);
    this.calculateTenure();
  }

  calculateTenure() {
    let numberOfMonths =
      this.modifyTenureForm.value.tenureYear * 12 +
      this.modifyTenureForm.value.tenureMonth;
    let payload = {
      firstRepaymentDate: new Date(),
      interestRate: this.installmentDetails?.interestRate,
      numberOfMonths: numberOfMonths,
      principleAmount: this.installmentDetails?.loanAmount,
    };
    this.loanService.calculateEMI(payload).subscribe((res: any) => {
      this.calculatedData = {
        ...res?.data,
        maturityAmount: res?.data?.monthlyPayment,
        depositAmount: this.installmentDetails?.emiAmount,
        currentMaturityDate: this.installmentDetails?.maturityDate,
        currentInterest: this.installmentDetails?.totalInterest,
      };
    });
  }



}
