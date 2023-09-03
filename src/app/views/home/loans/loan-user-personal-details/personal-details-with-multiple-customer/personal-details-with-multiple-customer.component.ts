import { Component, EventEmitter, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-personal-details-with-multiple-customer",
  templateUrl: "./personal-details-with-multiple-customer.component.html",
  styleUrls: ["./personal-details-with-multiple-customer.component.scss"],
})
export class PersonalDetailsWithMultipleCustomerComponent implements OnInit {
  @Output() onBackEvent: EventEmitter<any> = new EventEmitter();
  @Output() onConfirmEvent: EventEmitter<any> = new EventEmitter();
  panelOpenState: boolean = false;
  closeOthers: boolean = false;
  multipleApplicants = [
    {
      isSubmitted: false,
      customerDetails: [],
    },
  ];

  constructor() {}

  ngOnInit(): void {}

  onConfirm(applicantsDetails: any) {
    this.multipleApplicants = [
      { isSubmitted: true, customerDetails: { ...applicantsDetails.payLoad } },
    ];
    // this.openAccountService.savePersonalDetails(event.payLoad).subscribe(
    //   (response: any) => {
    //     console.log('Response: ', response);
    //     localStorage.setItem('customerId', response.data.customerId);
    // this.onConfirmEvent.emit();
    //   },
    //   (error: any) => {
    //     console.log(error);
    //   }
    // );
  }

  addAnotherDocument() {
    this.multipleApplicants = [
      ...this.multipleApplicants,
      { isSubmitted: true, customerDetails: [] },
    ];
  }

  validate() {
    if (
      this.multipleApplicants.length >= 1 &&
      this.multipleApplicants.some((item) => item.isSubmitted)
    ) {
      return false;
    }

    return true;
  }

  onSubmit() {
    console.log("multiple Customers: ", this.multipleApplicants);
    this.onConfirmEvent.emit();
  }

  onBack() {
    this.onBackEvent.emit();
  }
}
