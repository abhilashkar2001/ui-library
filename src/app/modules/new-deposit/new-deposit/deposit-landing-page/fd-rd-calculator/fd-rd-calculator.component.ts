import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-fd-rd-calculator',
  templateUrl: './fd-rd-calculator.component.html',
  styleUrls: ['./fd-rd-calculator.component.scss'],
})
export class FdRdCalculatorComponent {
  selectedValue = 'fdCalculator';
  @Output() customDepositChange = new EventEmitter<any>();
  calculatorValues: any = {};
  @Input() customform: any;
  rdFdValue: any;

  onToggleChange(event: any) {
    this.rdFdValue = event.value;
    this.customDepositChange.emit(event.value);
  }
  customCalculatorValues(event: any) {
    this.calculatorValues = event;
  }
}
