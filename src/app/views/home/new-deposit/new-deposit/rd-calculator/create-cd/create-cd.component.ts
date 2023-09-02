import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NewDepositService } from "../../../new-deposit.service";

@Component({
  selector: "app-create-cd",
  templateUrl: "./create-cd.component.html",
  styleUrls: ["./create-cd.component.scss"],
})
export class CreateCdComponent implements OnInit {
  createRdForm: FormGroup;
  @Output() customCreatRdForm = new EventEmitter<any>();
  @Output() customSaveCreate = new EventEmitter<{}>();

  selectedStep: number = 0;
  customBasicForm: any;
  isLinear = true;
  constructor(private fb: FormBuilder, private fdApi: NewDepositService) {}

  ngOnInit(): void {
    this.buildCreateRdForm();
    if (document.getElementById(".custom_stepper")) {
      document.getElementById(".custom_stepper").style.width = `${
        window.screen.width - 100
      }`;
    }
  }

  customSelectionChange(event) {
    // this.isFixedDepositDetail = event.isFixedDepositDetail;
    // this.isPersonalDetails = event.isPersonalDetails;
    // this.isBookFd = event.isBookFd;
  }

  buildCreateRdForm() {
    this.createRdForm = this.fb.group({
      depositAmmount: ["", Validators.required],
      maturityDate: "",
      interestRate: "",
      depositHolderType: "",
      maturityAmmount: "",
      customerType: "",
      payoutType: "",
      paymentType: "",
      autoRenew: false,
    });
    // this.customBasicForm = this.createRdForm;
    setTimeout(() => {
      this.customCreatRdForm.emit(this.createRdForm);
    }, 200);
  }

  submitCreateFd() {
    this.customSaveCreate.emit({ satus: true });
  }
}
