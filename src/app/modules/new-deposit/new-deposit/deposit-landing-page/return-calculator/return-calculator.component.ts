import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: "app-return-calculator",
  templateUrl: "./return-calculator.component.html",
  styleUrls: ["./return-calculator.component.scss"],
})
export class ReturnCalculatorComponent implements OnInit {
  max = 100000;
  min = 1000;
  ammountValue = 0;
  depositForm: FormGroup;
  @Input() rdFdValue;
  @Input() fdName;
  @Output() customCalculatorValues = new EventEmitter<any>();

  amount = new FormControl("");
  email = new FormControl("");
  thumbLabel: boolean = true;
  name = "Angular 5";

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
    console.log(this.rdFdValue);
  }
  ngOnChanges(): void {
    console.log(this.rdFdValue);
    if (this.rdFdValue) {
      this.depositForm.reset();
    }
  }
  onSliderChange(e) {
    this.ammountValue = e.value;
    this.depositForm.get("amount").setValue(e.value);
    console.log(this.depositForm.value);
  }
  buildForm() {
    this.depositForm = this.fb.group({
      amount: 0,
      tenureYear: "",
      tenureMonth: "",
      tenureDays: "",
      scheme: "",
      ownerShip: "",
      intrestPayout: "",
      typeOfCustomer: "",
      dateOfInstalment: "",
    });
  }
  updateDeposit() {
    console.log(this.depositForm.value);
    this.customCalculatorValues.emit(this.depositForm.value);
  }
  resetform() {
    this.depositForm.reset();
  }
}
