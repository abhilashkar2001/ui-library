import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-loan-terms-conditions',
  templateUrl: './loan-terms-conditions.component.html',
  styleUrls: ['./loan-terms-conditions.component.scss'],
})
export class LoanTermsConditionsComponent {
  @Output() backEvent: EventEmitter<any> = new EventEmitter();
  @Output() CustomSubmit: EventEmitter<any> = new EventEmitter();
  @Input() updateParentModel: ((value: Partial<any>) => void) | any;
  stepperTitle: string;

  constructor(private activatedRoute: ActivatedRoute) {
    this.stepperTitle = this.activatedRoute.snapshot['queryParams']['title'];
  }

  onConfirm() {
    this.updateParentModel({ updateMasterSave: false });
    this.CustomSubmit.emit({ gotoNext: true });
  }

  onBack() {
    this.backEvent.emit();
  }
}
