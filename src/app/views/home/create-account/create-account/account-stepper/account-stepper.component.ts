import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-account-stpper',
  templateUrl: './account-stepper.component.html',
  styleUrls: ['./account-stepper.component.scss'],
})
export class AccountStepperComponent implements OnInit, OnChanges, AfterViewInit{
  isCreateFdDone: boolean = false;
  isDone = true;
  @Input() customBasicForm: FormGroup;
  @Input() customVerifyNumber: any;
  @Input() customPersonalDetails: any;
  @Input() documentDetailsForm: FormGroup;
  @Input() selectionIndex = 0;
  @Output() customSelectionChange = new EventEmitter<{}>();
  @ViewChild('stepper') private myStepper: MatStepper;

  isLinear = true;

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.onStepSelectionChange();
  }

  onStepSelectionChange(e: any = { selectedIndex: 0 }) {
    let data = {};
    if (e.selectedIndex == 0) {
      data = {
        isMobileVerification: true,
        isPersonalDetails: false,
        isSelectKYC: false,
        stepper: this.myStepper,
      };
      this.customSelectionChange.emit(data);
    } else if (e.selectedIndex == 1) {
      data = {
        isMobileVerification: false,
        isPersonalDetails: true,
        isSelectKYC: false,
        stepper: this.myStepper,
      };
      this.customSelectionChange.emit(data);
    } else {
      data = {
        isMobileVerification: false,
        isPersonalDetails: false,
        isSelectKYC: true,
        stepper: this.myStepper,
      };
      this.customSelectionChange.emit(data);
    }
  }
}
