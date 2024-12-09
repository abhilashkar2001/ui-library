import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-fd-rd-calculator",
  templateUrl: "./fd-rd-calculator.component.html",
  styleUrls: ["./fd-rd-calculator.component.scss"]
})
export class FdRdCalculatorComponent implements OnInit {
  selectedValue = "fdCalculator";
  @Output() customDepositChange = new EventEmitter<any>();
  calculatorValues: any = {};
  @Input() customform: any;
  rdFdValue: any;

  constructor() {}

  ngOnInit(): void {}
  onToggleChange(event: any) {
    this.rdFdValue = event.value;
    this.customDepositChange.emit(event.value);
  }
  customCalculatorValues(event: any) {
    this.calculatorValues = event;
  }
}
