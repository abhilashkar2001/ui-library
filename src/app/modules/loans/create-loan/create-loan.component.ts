import { Location } from "@angular/common";
import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { CommonService } from "app/shared/services/common-service/common.service";

@Component({
  selector: "app-create-loan",
  templateUrl: "./create-loan.component.html",
  styleUrls: ["./create-loan.component.scss"],
})
export class CreateLoanComponent implements OnInit, OnChanges, AfterViewInit {
  @Output() onBackEvent: EventEmitter<any> = new EventEmitter();
  @Output() onConfirmEvent: EventEmitter<any> = new EventEmitter();
  @Output() checkAccountHolderType: EventEmitter<any> = new EventEmitter();

  personalLoanDetailsForm: FormGroup | any;
  stepperTitle: string;
  disbursementType: string;
  loanDetails: any;
  isDisabledMode: boolean = true;

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private commonService: CommonService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnInit(): void {
    this.initialForm();
  }

  ngAfterViewInit(): void {
    this.commonService.$calculatorsData.subscribe((response: any) => {
      this.setValues(response);
    });
  }

  setValues(basicLoanDetails: any) {
    if (basicLoanDetails) {
      this.personalLoanDetailsForm.patchValue({
        loanAmount: basicLoanDetails.principlAmount,
        tenureYear: basicLoanDetails.tenure.years,
        tenureMonths: basicLoanDetails.tenure.months,
        tenureDay: basicLoanDetails.tenure.days,
        emiAmount: basicLoanDetails.emiAmount,
        interestRate: basicLoanDetails.interestRate,
        interestPayable: basicLoanDetails.totalInterestPayble,
        principlAmount: basicLoanDetails.principlAmount,
        totalPayableAmount: basicLoanDetails.totalPayableAmount,
      });
    }
  }

  initialForm() {
    this.personalLoanDetailsForm = this.fb.group({
      loanAmount: new FormControl({ value: "", disabled: true }, [
        Validators.required,
      ]),
      tenureYear: new FormControl({ value: "", disabled: true }, [
        Validators.required,
      ]),
      tenureMonths: new FormControl({ value: "", disabled: true }),
      tenureDay: new FormControl({ value: "", disabled: true }),
      emaiPaymentStartDate: new FormControl("", [Validators.required]),
      emiAmount: new FormControl({ value: "", disabled: true }, [
        Validators.required,
        Validators.email,
      ]),
      interestRate: new FormControl({ value: "", disabled: true }, [
        Validators.required,
      ]),
      interestPayable: new FormControl({ value: "", disabled: true }, [
        Validators.required,
      ]),
      principlAmount: new FormControl({ value: "", disabled: true }, [
        Validators.required,
      ]),
      holderType: new FormControl("", [Validators.required]),
      totalPayableAmount: new FormControl({ value: "", disabled: true }, [
        Validators.required,
      ]),
      disbursementType: new FormControl("", [Validators.required]),
      accountNumber: new FormControl("", [Validators.required]),
    });
  }

  onEdit() {
    this.personalLoanDetailsForm.get("loanAmount").enable(); // To enable
    this.personalLoanDetailsForm.get("tenureYear").enable(); // To enable
    this.personalLoanDetailsForm.get("tenureMonths").enable();
    this.personalLoanDetailsForm.get("tenureDay").enable(); // To enable
    this.personalLoanDetailsForm.get("emiAmount").enable(); // To enable
    this.personalLoanDetailsForm.get("interestPayable").enable();
    this.personalLoanDetailsForm.get("principlAmount").enable(); // To enable
    this.personalLoanDetailsForm.get("interestRate").enable();
    this.personalLoanDetailsForm.get("totalPayableAmount").enable(); // To enable
    this.isDisabledMode = false;
  }

  accountHolderSelectionChanged() {
    this.checkAccountHolderType.emit(
      this.personalLoanDetailsForm.controls["holderType"].value.toLowerCase()
    );
  }

  onDisbursementSelectionChanged() {
    this.disbursementType =
      this.personalLoanDetailsForm.controls[
        "disbursementType"
      ].value.toLowerCase();
  }

  onConfirm() {
    console.log(this.personalLoanDetailsForm.value);
    this.onConfirmEvent.emit();
  }

  onExit() {
    this.location.back();
  }
}
