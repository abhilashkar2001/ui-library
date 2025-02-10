import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  OnChanges,
  AfterViewInit,
} from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { cardStepperConstant } from 'assets/json/loan-stepper.contant';

@Component({
  selector: 'app-card-stepper',
  templateUrl: './card-stepper.component.html',
  styleUrls: ['./card-stepper.component.scss'],
})
export class CardStepperComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() selectionIndex = 0;
  @Input() optionalSteps: any;
  @Output() customSelectionChange = new EventEmitter<{}>();
  @ViewChild('stepper') private myStepper: MatStepper | any;
  loanstepper: any = cardStepperConstant;
  isLinear = true;

  constructor() {}

  ngOnChanges(): void {
    if (
      this.optionalSteps &&
      this.optionalSteps.steps.length &&
      this.optionalSteps.isDifferentMobile
    ) {
      this.loanstepper &&
        this.loanstepper.splice(2, 0, ...this.optionalSteps.steps);
    }
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.onStepSelectionChange();
  }

  onStepSelectionChange(e: any = { selectedIndex: 0 }) {
    let data = {};
    if (
      this.optionalSteps &&
      this.optionalSteps.steps.length &&
      this.optionalSteps.isDifferentMobile
    ) {
      switch (e.selectedIndex) {
        case 0:
          data = {
            isPersonalDetailsStep: false,
            isMobileVerificationStep: true,
            isTermsCondtionsStep: false,
            isCIBILScoreStep: false,
            isSelectKYCStep: false,
            stepper: this.myStepper,
          };
          break;
        case 1:
          data = {
            isPersonalDetailsStep: false,
            isMobileVerificationStep: false,
            isTermsCondtionsStep: false,
            isCIBILScoreStep: true,
            isSelectKYCStep: false,
            stepper: this.myStepper,
          };
          break;
        case 2:
          data = {
            isPersonalDetailsStep: true,
            isMobileVerificationStep: false,
            isTermsCondtionsStep: false,
            isCIBILScoreStep: false,
            isSelectKYCStep: false,
            stepper: this.myStepper,
          };
          break;
        case 3:
          data = {
            isPersonalDetailsStep: false,
            isMobileVerificationStep: false,
            isTermsCondtionsStep: false,
            isCIBILScoreStep: false,
            isSelectKYCStep: true,
            stepper: this.myStepper,
          };
          break;
        case 4:
          data = {
            isPersonalDetailsStep: false,
            isMobileVerificationStep: false,
            isTermsCondtionsStep: true,
            isCIBILScoreStep: false,
            isSelectKYCStep: false,
            stepper: this.myStepper,
          };
          break;
        default: {
        }
      }
    } else {
      switch (e.selectedIndex) {
        case 0:
          data = {
            isMobileVerificationStep: true,
            isTermsCondtionsStep: false,
            isCIBILScoreStep: false,
            stepper: this.myStepper,
          };
          break;
        case 1:
          data = {
            isMobileVerificationStep: false,
            isTermsCondtionsStep: false,
            isCIBILScoreStep: true,
            stepper: this.myStepper,
          };
          break;
        case 2:
          data = {
            isMobileVerificationStep: false,
            isTermsCondtionsStep: true,
            isCIBILScoreStep: false,
            stepper: this.myStepper,
          };
          break;
        default: {
        }
      }
    }
    this.customSelectionChange.emit(data);
  }
}
