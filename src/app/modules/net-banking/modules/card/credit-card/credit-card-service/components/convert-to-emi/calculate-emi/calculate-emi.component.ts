import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { ConvertEmiStore } from "../convert-emi.store";
import { Router } from "@angular/router";
import { CardDetails } from "app/shared/models/emi-converter.model";
import { CardService } from "app/modules/net-banking/modules/card/card.service";
import { ServiceCallHandler } from "app/shared/service-call.handler";

@Component({
  selector: "app-calculate-emi",
  templateUrl: "./calculate-emi.component.html",
  styleUrls: ["./calculate-emi.component.scss"]
})
export class CalculateEmiComponent implements OnInit {
  calculateEmiForm!: FormGroup;
  minTenure = 7;
  maxTenure = 3650;
  thumbLabel = true;
  sliderValue = new FormControl(0);

  emiData: any = ConvertEmiStore.emiDetails;
  amount: number | any;
  totalMonths = 0;
  obj: CardDetails | any;

  constructor(
    private fb: FormBuilder,
    private emiService: CardService,
    private router: Router,
    private serviceCallHandler: ServiceCallHandler
  ) {}

  ngOnInit(): void {
    this.buildCalculateEmiForm();
    this.loadEmiDataFromState();
  }

  private buildCalculateEmiForm() {
    this.calculateEmiForm = this.fb.group({
      tenureYears: [""],
      tenureMonths: [""],
      tenureDays: [""]
    });
  }

  private loadEmiDataFromState() {
    this.obj = history.state;
    if (this.obj) {
      this.emiData[0].value = this.obj.cardNumber;
      this.emiData[1].value = this.obj.cardName;
      this.emiData[2].value = this.obj.noOfElements;
      this.emiData[3].value = this.obj.amount;
    }
  }

  onTenureYearsChange(): void {
    this.calculateSliderValue();
  }

  calculateSliderValue() {
    const m = this.calculateEmiForm.get("tenureMonths")?.value;
    const d = this.calculateEmiForm.get("tenureDays")?.value;
    const y = this.calculateEmiForm.get("tenureYears")?.value;
    this.onSliderChangeForTenure(y * 365 + m * 30 + d);
  }

  onSliderChangeForTenure(event: Event) {
    const tenureInDays: any = (event.target as HTMLInputElement)?.value;
    this.totalMonths = 0;
    // this.sliderValue.value = tenureInDays;
    console.log(this.sliderValue.value);

    const years = Math.floor(tenureInDays / 365);
    const remainingDays = tenureInDays % 365;
    const months = Math.floor(remainingDays / 30);

    this.totalMonths = this.convertYearsToMonths(years) + months;

    const tomorrow = this.getTomorrowDate();

    const payload = {
      principleAmount: this.emiData[3].value,
      interestRate: 7.28, //now we are maintaining percentage as statically
      numberOfMonths: this.totalMonths,
      firstRepaymentDate: tomorrow
    };
    this.calculateEmi(payload);
    this.updateTenureForm(years, months, remainingDays % 30);
  }
  calculateEmi(_: any) {
    // this.emiService.calculateEmi(payload).subscribe((response) => {
    //   if (response && response.statusCode === 200) {
    //     this.emiData[6].value = response.data.monthlyPayment;
    //   }
    // });
  }

  private getTomorrowDate(): string {
    const today = new Date();
    const tomorrow: any = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  }

  private updateTenureForm(years: number, months: number, days: number) {
    this.calculateEmiForm.get("tenureYears")?.setValue(years);
    this.calculateEmiForm.get("tenureMonths")?.setValue(months);
    this.calculateEmiForm.get("tenureDays")?.setValue(days);
  }

  convertYearsToMonths(years: number): number {
    return years * 12;
  }

  convertDaysToMonths(days: number): number {
    return Math.floor(days / 30);
  }

  formatLabel(value: number | null): string {
    if (!value) return "";

    const years = Math.floor(value / 365);
    const remainingDays = value % 365;
    const months = Math.floor(remainingDays / 30);
    const days = remainingDays % 30;

    return value > 0 ? `${years} year ${months} month ${days} day` : `${value}`;
  }

  proceed() {
    const payload = {
      cardNo: this.obj.cardNumber,
      cardName: this.obj.cardName,
      convertToEMI: this.emiData[6].value,
      amount: this.obj.amount,
      interestRate: 7.28, //we are maintaining static value
      processingFee: this.emiData[5].value,
      tenure: this.formatLabel(this.sliderValue.value),
      maturityDate: this.obj.maturityDate,
      monthlyEmi: this.emiData[6].value,
      cardId: this.obj.cardId
    };

    const emiDetailsArr = [
      {
        eventType: "calculateEmi",
        statusHeader: "Confirm Details",
        statusNews: "Converted to EMI successfully!",
        summary: [
          {
            header: "Card Control",
            details: [
              { "Name On Card": this.obj.nameOnCard },
              { "Card No": payload.cardNo },
              { "Card Name": payload.cardName },
              { "Convert To EMI": payload.amount }
            ]
          },
          {
            header: "EMI Details",
            details: [
              { Amount: payload.amount },
              { "Interest Rate": payload.interestRate },
              { "Processing Fee": payload.processingFee },
              { Tenure: payload.tenure },
              { "Maturity Date": payload.maturityDate },
              { "Monthly Emi": this.emiData[6].value },
              { "Card Id": payload.cardId }
            ]
          }
        ],
        qrToggle: false
      }
    ];

    this.serviceCallHandler.put(
      "serviceHandler",
      payload,
      emiDetailsArr,
      (convertedPayload) => this.emiService.convertToEmi(convertedPayload)
    );

    this.router.navigate(["/send-money/payment-summary"]);
  }
}
